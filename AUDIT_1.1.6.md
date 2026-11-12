# ATGV tech-stacks-skills — source audit and remediation (catalog 1.1.6)

Date: 2026-11-12. Source: user-supplied `tech-stacks-skills.zip`. This report only covers the supplied archive; the remote GitHub main branch was not modified.

## Confirmed findings

| Severity | Finding in uploaded archive | Resolution |
|---|---|---|
| High | `VERSION` was `1.1.5` while `catalog.json` declared `1.1.4`; `RELEASE_1.1.5.md` still documented `1.1.4`. The shipped catalog validator failed. | Align all current catalog metadata and release docs to `1.1.6`. |
| High | `catalog.json` declared `bootstrap-5.3` and paths under that folder, but actual files live under `shared/design-systems/bootstrap-5-3`. | Use canonical `bootstrap-5-3` for ID, paths, and guidance. This matches the normalization behavior in ATGV v0.3.07. |
| Medium | There was no diagnostic utility to determine precisely why an existing application's `atgv.bootstrap.json` generated-file list fails the extension's check. | Add `scripts/audit-bootstrap-manifest.mjs`, with five read-only regression tests. It reports duplicate, unsafe, missing, renamed, and modified generated files. |
| Medium | The uploaded ZIP included `.git` history and macOS `.DS_Store` files, unnecessarily increasing the archive and including local metadata. | Exclude `.git`, `.DS_Store`, and machine-specific generated directories in the distribution. |
| Medium | Validator did not explicitly verify design-system asset path integrity or starter SQLite cleanup behavior; the stale Bootstrap reference escaped release validation. | Harden structural validator, add Windows path collision checks, and add GitHub CI checks on Linux and Windows. |
| Warning | React, Angular, and NestJS scaffolds do not have lockfiles, and live package resolution was not tested here. | Not fabricated. Document as remaining release gates requiring an approved registry. |

## Existing application manifest failure — scope limitation

ATGV v0.3.07 generates `atgv.bootstrap.json` **in the application's Git checkout**, not in this catalog. The previously reported error `Starter manifest contains an invalid generated file list` is raised in `src/architect-simple-workflow.js` during generated-commit validation. It can occur if a recorded relative file path is no longer in the active scaffold or the manifest is malformed. Neither the exact offending path nor whether the file was previously edited can be established from the uploaded stack error log alone. The new tool helps identify these conditions but intentionally **does not rewrite** or delete the application manifest. The extension needs a separately reviewed migration/reconciliation mechanism if automatic repair is desired.

Example, from the catalog root in Windows PowerShell:

```powershell
node scripts/validate-catalog.mjs
node scripts/audit-bootstrap-manifest.mjs "C:\\path\\to\\application"
```

Review the generated report and your Git changes before taking action. A manifest matching the current catalog does not guarantee the old project can be auto-committed: ATGV also checks Git status, file bytes, existing tracked files, and the marker's draft status.

## Verification performed

- Catalog version, 5 tech-stack descriptors, 18 role skills and 2 design-system inventories: passed.
- Ran actual `inspectManifest` in ATGV v0.3.07 source against the updated catalog paths: passed.
- All 24 JSON files parsed.
- New catalog manifest audit regression tests (5): passed.
- Existing NestJS static starter test (1): passed.
- AIA QI standalone design-kit verification: passed.
- JavaScript `.mjs` syntax checks for scripts and React/Angular server files: passed.
- ZIP CRC, safe relative paths, and absence of `.git` / `.DS_Store`: verified on packaged output.

## Not performed / remaining risks

- npm dependency installation, React/Angular/NestJS application build, actual Windows SQLite integration tests, Playwright browser tests, Maven tests, and .NET tests. These were not executed in this offline audit and remain unverified.
- The existing application's `atgv.bootstrap.json` was not supplied, so the exact cause of its generated-file error remains unknown.
- No GitHub remote updates or commits were made.

## Suggested follow-on extension changes (separate from this catalog release)

1. In `architect-simple-workflow.js`, report the **specific invalid generated-file entry** and recorded vs active catalog revision.
2. Detect catalog revision changes between starter generation and commit; verify using the recorded template digest or the pinned revision rather than silently switching to the newest active snapshot.
3. Offer safe, reviewed reconciliation for known legacy starter paths only. Preserve approved source files and user edits, and never bypass genuine test failures.
