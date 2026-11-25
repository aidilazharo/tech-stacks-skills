import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import hashlib
import subprocess

spec = importlib.util.spec_from_file_location("sync", Path(__file__).with_name("aiamalaysia-sync.py"))
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class SyncTests(unittest.TestCase):
    def test_protected_paths(self):
        for path in (b".github/workflows/build.yml", b".git/config",
                     b"nested/.github/a", b"foo/action.yaml", b"foo/action.yml"):
            self.assertTrue(sync.protected(path))
        self.assertFalse(sync.protected(b"src/index.js"))

    def test_projection_and_mismatch(self):
        blob = (b"100644", b"blob", b"1" * 40)
        items = {b"src/a": blob, b".github/workflows/a": blob}
        self.assertEqual(sync.projection(items), {b"src/a": blob})
        sync.verify_projection(sync.projection(items), items)
        with self.assertRaises(RuntimeError):
            sync.verify_projection(sync.projection(items), {})
        with self.assertRaises(RuntimeError):
            sync.projection({b"submodule": (b"160000", b"commit", b"2" * 40)})

    def test_branch_and_marker(self):
        self.assertEqual(sync.branch_name("fix(ui): spacing", "0.0.8"), "fix/library-v0.0.8")
        self.assertEqual(sync.branch_name("unknown", "0.0.8"), "sync/library-v0.0.8")
        marker = sync.marker("a" * 40, "v0.0.8-source-build.99")
        self.assertEqual(sync.find_marker(marker), ("a" * 40, "v0.0.8-source-build.99"))
        self.assertIsNone(sync.find_marker(marker + "\n" + marker))
        self.assertGreater(sync.version_key("v0.1.0-source-build.1"), sync.version_key("v0.0.99-source-build.99"))

    def test_library_assets(self):
        self.assertEqual(sync.expected_assets("0.0.8"),
                         ["tech-stacks-skills-0.0.8-source.zip", "library-source.sha256"])
        with self.assertRaises(RuntimeError):
            sync.version_key("v0.0.8-build.99")

    def test_digest_without_file_digest(self):
        with tempfile.TemporaryDirectory() as tmp:
            file = Path(tmp) / "file.zip"
            with patch.object(hashlib, "file_digest", create=True,
                              side_effect=AssertionError("requires Python 3.11")):
                for data in (b"", b"example", bytes(range(256)) * 9000):
                    with self.subTest(size=len(data)):
                        file.write_bytes(data)
                        self.assertEqual(sync.digest(file), hashlib.sha256(data).hexdigest())

    def test_checksum(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            (folder / "file.zip").write_bytes(b"example")
            checksum = hashlib.sha256(b"example").hexdigest()
            (folder / "file.sha256").write_text(checksum + "  file.zip\n")
            sync.verify_checksum(folder, "file.sha256", "file.zip")
            (folder / "file.zip").write_bytes(b"changed")
            with self.assertRaises(RuntimeError):
                sync.verify_checksum(folder, "file.sha256", "file.zip")

    def test_real_git_overlay_preserves_destination(self):
        old_source, old_dest = sync.SOURCE, sync.DEST
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source, dest = root / "source", root / "destination"
            for repo in (source, dest):
                repo.mkdir()
                subprocess.run(["git", "init", "-q", str(repo)], check=True)
                sync.git(repo, "config", "user.name", "Test")
                sync.git(repo, "config", "user.email", "test@example.com")
                (repo / ".github").mkdir()
                (repo / ".github" / "workflow.yml").write_text(str(repo))
                (repo / "code.txt").write_text(str(repo))
                (repo / "VERSION").write_text("0.0.8\n")
                (repo / "catalog.json").write_text('{"version":"0.0.8"}')
                if repo == dest:
                    (repo / "destination-only.txt").write_text("preserve")
                sync.git(repo, "add", ".")
                sync.git(repo, "commit", "-qm", "initial")
            try:
                sync.SOURCE, sync.DEST = source, dest
                source_sha = sync.git(source, "rev-parse", "HEAD").decode().strip()
                base = sync.git(dest, "rev-parse", "HEAD").decode().strip()
                self.assertEqual(sync.source_version(source_sha), "0.0.8")
                new_tree, selected, before = sync.overlay(source_sha, base)
                new_commit = sync.git(dest, "commit-tree", new_tree, "-p", base,
                                      "-m", "test").decode().strip()
                after = sync.tree(dest, new_commit)
                sync.verify_projection(selected, after)
                self.assertEqual(after[b".github/workflow.yml"], before[b".github/workflow.yml"])
                self.assertEqual(after[b"destination-only.txt"], before[b"destination-only.txt"])
            finally:
                sync.SOURCE, sync.DEST = old_source, old_dest


if __name__ == "__main__":
    unittest.main()
