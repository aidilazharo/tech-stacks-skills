"""Verified source synchronization and release publication; runs only in development CI."""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

SOURCE_REPO = "aidilazharo/tech-stacks-skills"
DEST_REPO = "aiamalaysia/my-fow-technology-app-techassists-enterprise-skills"
SOURCE = Path(os.environ.get("GITHUB_WORKSPACE", ".")) / "source"
DEST = Path(os.environ.get("GITHUB_WORKSPACE", ".")) / "destination"
SHA_RE = re.compile(r"[0-9a-f]{40}")
TAG_RE = re.compile(r"v(\d+)\.(\d+)\.(\d+)-source-build\.(\d+)")
MARKER_RE = re.compile(r"(?m)^ATGV-Library-Sync: ([0-9a-f]{40}) (v\d+\.\d+\.\d+-source-build\.\d+)$")
ASSET_LIMIT = 80 * 1024 * 1024


def command(args, cwd=None, env=None, data=None):
    result = subprocess.run(args, cwd=cwd, env=env, input=data,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
    if result.returncode:
        # Avoid printing CLI stderr containing credentials or signed download URLs.
        raise RuntimeError(f"{args[0]} {args[1]} failed (exit {result.returncode})")
    return result.stdout


def git(root, *args, env=None, data=None):
    return command(["git", *args], cwd=root, env=env, data=data)


def gh(role, *args):
    env = dict(os.environ)
    env["GH_TOKEN"] = env["SOURCE_TOKEN" if role == "source" else "DEST_TOKEN"]
    if not env["GH_TOKEN"]:
        raise RuntimeError("Missing approved GitHub credential")
    env.pop("SOURCE_TOKEN", None)
    env.pop("DEST_TOKEN", None)
    return command(["gh", *args], env=env)


def api(role, route):
    return json.loads(gh(role, "api", route))


def sha(value):
    if not SHA_RE.fullmatch(value or ""):
        raise RuntimeError("Invalid commit SHA")
    return value


def version_key(tag):
    match = TAG_RE.fullmatch(tag or "")
    if not match:
        raise RuntimeError("Invalid release tag")
    return tuple(map(int, match.groups()))


def source_version(commit):
    value = git(SOURCE, "show", f"{sha(commit)}:VERSION").decode().strip()
    manifest = json.loads(git(SOURCE, "show", f"{commit}:catalog.json"))
    if not re.fullmatch(r"\d+\.\d+\.\d+", value) or manifest.get("version") != value:
        raise RuntimeError("Library VERSION and catalog.json do not agree")
    return value


def protected(path):
    parts = path.lower().split(b"/")
    return (b".git" in parts or b".github" in parts or
            parts[-1] in (b"action.yml", b"action.yaml"))


def tree(root, commit):
    result = {}
    for item in git(root, "ls-tree", "-rz", "--full-tree", sha(commit)).split(b"\0"):
        if not item:
            continue
        metadata, path = item.split(b"\t", 1)
        mode, kind, oid = metadata.split(b" ")
        result[path] = (mode, kind, oid)
    return result


def projection(entries):
    selected = {path: value for path, value in entries.items() if not protected(path)}
    if any(kind != b"blob" for _, kind, _ in selected.values()):
        raise RuntimeError("Source contains an unsupported submodule")
    return selected


def verify_projection(source, destination):
    missing = [path for path, value in source.items() if destination.get(path) != value]
    if missing:
        raise RuntimeError(f"Destination source mismatch ({len(missing)} tracked paths)")


def branch_name(subject, version):
    match = re.match(r"^(fix|feat|refactor|perf|chore|docs|test|build)(?:\(|:|!)", subject)
    return f"{match[1] if match else 'sync'}/library-v{version}"


def marker(commit, tag):
    return f"ATGV-Library-Sync: {sha(commit)} {tag}"


def find_marker(body):
    matches = MARKER_RE.findall(body or "")
    return matches[0] if len(matches) == 1 else None


def expected_assets(version):
    return [f"tech-stacks-skills-{version}-source.zip", "library-source.sha256"]


def release_for(commit, tag=None):
    version = source_version(commit)
    if tag:
        version_key(tag)
        rows = [api("source", f"repos/{SOURCE_REPO}/releases/tags/{tag}")]
    else:
        rows = api("source", f"repos/{SOURCE_REPO}/releases?per_page=100")
    valid = []
    for row in rows:
        t = row.get("tag_name", "")
        if not TAG_RE.fullmatch(t) or not t.startswith(f"v{version}-source-build."):
            continue
        if row.get("draft") or row.get("target_commitish") != commit:
            continue
        # The authoritative development release must actually tag the tested SHA.
        resolved = git(SOURCE, "rev-parse", f"refs/tags/{t}^{{commit}}").decode().strip()
        if resolved != commit:
            raise RuntimeError("Development release tag does not match its tested revision")
        assets = {a["name"]: a for a in row.get("assets", [])}
        if any(name not in assets or assets[name].get("state") != "uploaded" or
               not 0 < assets[name].get("size", 0) <= ASSET_LIMIT
               for name in expected_assets(version)):
            raise RuntimeError("Development release is missing verified artifacts")
        valid.append(row)
    if not valid:
        raise RuntimeError("No verified development release for the exact source revision")
    return max(valid, key=lambda row: version_key(row["tag_name"]))


def ancestor(root, earlier, later):
    git(root, "merge-base", "--is-ancestor", sha(earlier), sha(later))


def source_head():
    return sha(git(SOURCE, "rev-parse", "HEAD").decode().strip())


def dest_head():
    return sha(git(DEST, "rev-parse", "refs/remotes/origin/main").decode().strip())


def summary(message):
    print(message)
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a", encoding="utf-8") as out:
            out.write(message + "\n")


def ensure_verified_build(commit):
    data = api("source", f"repos/{SOURCE_REPO}/actions/workflows/release-library-source.yml/runs?branch=main&head_sha={commit}&status=success&per_page=30")
    if not any(run.get("head_sha") == commit and run.get("event") in ("push", "workflow_dispatch")
               and run.get("conclusion") == "success" for run in data.get("workflow_runs", [])):
        raise RuntimeError("No successful source build for this revision")


def overlay(commit, base):
    # Copy Git objects directly; never execute source or destination project code.
    selected = projection(tree(SOURCE, commit))
    before = tree(DEST, base)
    # Reject file/directory collisions rather than deleting destination-only paths.
    for path in selected:
        parts = path.split(b"/")
        if any(b"/".join(parts[:i]) in before for i in range(1, len(parts))):
            raise RuntimeError("Destination path collision")
        if path not in before and any(other.startswith(path + b"/") for other in before):
            raise RuntimeError("Destination directory collision")
    git(DEST, "fetch", "--no-tags", str(SOURCE.resolve()), commit)
    with tempfile.TemporaryDirectory() as temp:
        env = dict(os.environ, GIT_INDEX_FILE=str(Path(temp) / "index"))
        git(DEST, "read-tree", base, env=env)
        data = b"".join(mode + b" " + oid + b"\t" + path + b"\0"
                        for path, (mode, _, oid) in selected.items())
        git(DEST, "update-index", "-z", "--index-info", env=env, data=data)
        new_tree = git(DEST, "write-tree", env=env).decode().strip()
    return sha(new_tree), selected, before


def sync():
    commit = source_head()
    verified = os.environ.get("VERIFIED_SHA", "")
    if verified and verified != commit:
        summary("Source main advanced; waiting for its own verified build.")
        return
    ensure_verified_build(commit)
    release = release_for(commit)
    tag = release["tag_name"]
    version = source_version(commit)
    subject = git(SOURCE, "log", "-1", "--format=%s", commit).decode().strip()
    branch = branch_name(subject, version)
    base = dest_head()
    new_tree, selected, before = overlay(commit, base)
    base_tree = git(DEST, "rev-parse", f"{base}^{{tree}}").decode().strip()
    summary(f"Source {commit} / {tag}; destination branch {branch}")
    if new_tree == base_tree:
        summary("No source differences; no PR required.")
        return
    # Verify the proposed tree, including every protected and destination-only path.
    env = dict(os.environ, GIT_AUTHOR_NAME="ATGV Sync Bot",
               GIT_AUTHOR_EMAIL="41898282+github-actions[bot]@users.noreply.github.com",
               GIT_COMMITTER_NAME="ATGV Sync Bot",
               GIT_COMMITTER_EMAIL="41898282+github-actions[bot]@users.noreply.github.com")
    body_marker = marker(commit, tag)
    new_commit = sha(git(DEST, "commit-tree", new_tree, "-p", base,
                         "-m", f"{branch.split('/')[0]}: synchronize SDLC Library v{version}",
                         "-m", body_marker, env=env).decode().strip())
    after = tree(DEST, new_commit)
    verify_projection(selected, after)
    verify_projection({p: v for p, v in before.items() if p not in selected}, after)
    summary(git(DEST, "diff", "--stat", base, new_commit).decode())
    if os.environ.get("DRY_RUN", "true").lower() == "true":
        summary("Dry run: no remote branch or PR created.")
        return
    prs = json.loads(gh("dest", "pr", "list", "--repo", DEST_REPO, "--head", branch,
                        "--base", "main", "--state", "open", "--json", "body,url"))
    if prs:
        if len(prs) != 1 or find_marker(prs[0]["body"]) != (commit, tag):
            raise RuntimeError("Existing PR has a different source identity")
        summary("Existing PR: " + prs[0]["url"])
        return
    remote = git(DEST, "ls-remote", "--heads", "origin", f"refs/heads/{branch}").decode().strip()
    if remote:
        existing = sha(remote.split()[0])
        git(DEST, "fetch", "--no-tags", "origin", f"refs/heads/{branch}")
        existing_tree = git(DEST, "rev-parse", f"{existing}^{{tree}}").decode().strip()
        existing_message = git(DEST, "log", "-1", "--format=%B", existing).decode()
        if existing_tree != new_tree or find_marker(existing_message) != (commit, tag):
            raise RuntimeError("Existing branch differs; no force push allowed")
    else:
        git(DEST, "push", "origin", f"{new_commit}:refs/heads/{branch}")
    body = (f"## Verified SDLC Library v{version}\n\n{body_marker}\n\n"
            f"- Source: {SOURCE_REPO}\n- Development release: {tag}\n"
            "- Source build, regression and packaging checks passed.\n"
            "- Destination-only files and all GitHub workflows are preserved.\n"
            "- Release binaries are published only after this PR is merged.\n")
    url = gh("dest", "pr", "create", "--repo", DEST_REPO, "--base", "main", "--head", branch,
             "--title", f"Synchronize SDLC Library v{version}", "--body", body).decode().strip()
    summary("Created PR: " + url)


def digest(path):
    # Streaming SHA-256 also works on macOS system Python 3.9.
    checksum = hashlib.sha256()
    with open(path, "rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            checksum.update(chunk)
    return checksum.hexdigest()


def verify_checksum(folder, checksum, filename):
    expected = digest(folder / filename)
    lines = (folder / checksum).read_text(encoding="utf-8").splitlines()
    if not any(re.fullmatch(r"[0-9a-f]{64}\s+\*?" + re.escape(filename), line.strip())
               and line.strip().split()[0] == expected for line in lines):
        raise RuntimeError(f"Checksum mismatch: {filename}")


def download(role, repo, tag, folder, assets):
    for name in assets:
        gh(role, "release", "download", tag, "--repo", repo, "--pattern", name,
           "--dir", str(folder))
    for name, asset in assets.items():
        path = folder / name
        if not path.is_file() or path.stat().st_size != asset["size"]:
            raise RuntimeError(f"Incorrect asset size: {name}")
        expected = asset.get("digest")
        if expected and expected != "sha256:" + digest(path):
            raise RuntimeError(f"Asset digest mismatch: {name}")


def publish():
    current = dest_head()
    main = source_head()
    prs = json.loads(gh("dest", "pr", "list", "--repo", DEST_REPO, "--base", "main",
                        "--state", "merged", "--limit", "100",
                        "--json", "body,headRefName,mergeCommit,url"))
    candidates = []
    for pr in prs:
        found = find_marker(pr.get("body"))
        if not found or not pr.get("mergeCommit"):
            continue
        commit, tag = found
        ver = ".".join(map(str, version_key(tag)[:3]))
        if not re.fullmatch(r"(fix|feat|refactor|perf|chore|docs|test|build|sync)/library-v" + re.escape(ver),
                            pr["headRefName"]):
            continue
        merged = sha(pr["mergeCommit"]["oid"])
        # Both revisions must remain in their respective main histories.
        try:
            ancestor(SOURCE, commit, main)
            ancestor(DEST, merged, current)
        except RuntimeError:
            continue
        selected = projection(tree(SOURCE, commit))
        try:
            verify_projection(selected, tree(DEST, merged))
            verify_projection(selected, tree(DEST, current))
        except RuntimeError:
            continue
        candidates.append((version_key(tag), commit, tag, merged, pr["url"]))
    if not candidates:
        summary("No merged, matching SDLC Library synchronization PR is ready for publication.")
        return
    _, commit, tag, merged, pr_url = max(candidates)
    ensure_verified_build(commit)
    row = release_for(commit, tag)
    version = source_version(commit)
    dest_releases = api("dest", f"repos/{DEST_REPO}/releases?per_page=100")
    for item in dest_releases:
        old = item.get("tag_name", "")
        if not TAG_RE.fullmatch(old) or item.get("draft"):
            continue
        if version_key(old) > version_key(tag):
            summary("A newer destination release exists. No downgrade.")
            return
    notes = (f"Verified SDLC Library v{version}\n\n{marker(commit, tag)}\n"
             f"Destination commit: {merged}\nReviewed PR: {pr_url}\n")
    existing = next((item for item in dest_releases if item.get("tag_name") == tag), None)
    if existing and (find_marker(existing.get("body")) != (commit, tag)
                     or existing.get("target_commitish") != merged):
        raise RuntimeError("Destination release identity conflict; no overwrite")
    # A pre-existing tag must also resolve to the exact approved commit.
    remote_tag = git(DEST, "ls-remote", "--tags", "origin",
                     f"refs/tags/{tag}", f"refs/tags/{tag}^{{}}").decode().splitlines()
    if remote_tag:
        resolved = remote_tag[-1].split()[0]
        if resolved != merged:
            raise RuntimeError("Destination tag points to a different commit")
    names = expected_assets(version)
    assets = {a["name"]: a for a in row["assets"] if a["name"] in names}
    with tempfile.TemporaryDirectory() as temp:
        folder = Path(temp) / "source"
        folder.mkdir()
        download("source", SOURCE_REPO, tag, folder, assets)
        verify_checksum(folder, "library-source.sha256", names[0])
        if os.environ.get("DRY_RUN", "true").lower() == "true":
            summary(f"Dry run: verified {tag} and {len(names)} assets for {merged}")
            return
        if not existing:
            gh("dest", "release", "create", tag, "--repo", DEST_REPO, "--target", merged,
               "--title", f"SDLC Library v{version}", "--notes", notes, "--draft")
        detail = existing or next((item for item in api("dest", f"repos/{DEST_REPO}/releases?per_page=100")
                                   if item.get("tag_name") == tag), None)
        if not detail or find_marker(detail.get("body")) != (commit, tag) or detail.get("target_commitish") != merged:
            raise RuntimeError("Draft release identity could not be verified")
        uploaded = {a["name"]: a for a in detail.get("assets", [])}
        if set(uploaded) - set(names):
            raise RuntimeError("Unexpected destination release assets")
        # Never overwrite assets. Resume an identical draft only after validating existing bytes.
        for name in names:
            if name in uploaded:
                with tempfile.TemporaryDirectory() as check:
                    download("dest", DEST_REPO, tag, Path(check), {name: uploaded[name]})
                    if digest(Path(check) / name) != digest(folder / name):
                        raise RuntimeError("Existing destination asset differs; no overwrite")
            elif detail.get("draft"):
                gh("dest", "release", "upload", tag, str(folder / name), "--repo", DEST_REPO)
            else:
                raise RuntimeError("Published destination release is incomplete; no overwrite")
        if detail.get("draft"):
            final_draft = api("dest", f"repos/{DEST_REPO}/releases/{detail['id']}")
            final_assets = {a["name"]: a for a in final_draft.get("assets", [])}
            if set(final_assets) != set(names) or not final_draft.get("draft"):
                raise RuntimeError("Draft asset set changed before publication")
            with tempfile.TemporaryDirectory() as check:
                download("dest", DEST_REPO, tag, Path(check), final_assets)
                if any(digest(Path(check) / name) != digest(folder / name) for name in names):
                    raise RuntimeError("Uploaded release asset verification failed")
            git(DEST, "fetch", "--no-tags", "origin", "main")
            latest_main = dest_head()
            ancestor(DEST, merged, latest_main)
            verify_projection(projection(tree(SOURCE, commit)), tree(DEST, latest_main))
            gh("dest", "release", "edit", tag, "--repo", DEST_REPO, "--draft=false", "--latest")
        final = api("dest", f"repos/{DEST_REPO}/releases/tags/{tag}")
        if final.get("draft") or final.get("target_commitish") != merged or find_marker(final.get("body")) != (commit, tag):
            raise RuntimeError("Published release identity could not be verified")
        summary(f"Verified destination release: https://github.com/{DEST_REPO}/releases/tag/{tag}")


if __name__ == "__main__":
    if os.environ.get("GITHUB_REPOSITORY") != SOURCE_REPO:
        raise SystemExit("This automation may only run in the development repository")
    if len(sys.argv) != 2 or sys.argv[1] not in ("sync", "publish"):
        raise SystemExit("Use sync or publish")
    try:
        {"sync": sync, "publish": publish}[sys.argv[1]]()
    except (RuntimeError, ValueError, KeyError) as error:
        raise SystemExit(str(error))
