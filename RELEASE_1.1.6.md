# Catalog 1.1.6 — manifest diagnostics and catalog consistency

## Fixes

- Align `VERSION`, `catalog.json`, release notes, and primary catalog documentation to 1.1.6.
- Correct the Bootstrap manifest ID and design asset paths to the already-existing canonical `bootstrap-5-3` directory (matching ATGV v0.3.07 normalization).
- Retain awaited SQLite client closure and Windows `EBUSY` / `EPERM` retry behavior in React and Angular starter API tests.
- Add a read-only `scripts/audit-bootstrap-manifest.mjs` tool for checking existing application `atgv.bootstrap.json` generated-file lists against the catalog. It reports missing, unsafe, duplicated and no-longer-cataloged entries, and catalog version drift. It never deletes or modifies the application.
- Strengthen the catalog validator and include regression tests for the read-only bootstrap manifest diagnostic.
- Add a lightweight CI workflow for catalog structural checks and tests.
- Exclude `.git` metadata, `.DS_Store` and machine-specific generated content from distributable ZIP.

## Important boundary

**ATGV v0.3.07 writes `atgv.bootstrap.json` in the application checkout, not the catalog.** A previous application's invalid generated-file list cannot be repaired by updating the catalog alone. Do not overwrite user edits or rewrite the Git manifest automatically. Use the audit script for a precise diagnosis; ATGV extension-level reconciliation is a separate change.

## Usage

From the catalog root:

```powershell
node scripts/validate-catalog.mjs
node scripts/audit-bootstrap-manifest.mjs "C:\path\to\tech-cockpit"
```

The archive is a GitHub-ready source snapshot, not a Git repository; commit its file contents into your GitHub `main` branch through your usual review process.

## Test scope

Node structural tests and included read-only regression tests were executed on Linux. React/Angular/NestJS full dependency installation and browser/Windows integration tests must be executed in a connected and supported environment. Three missing npm lockfiles remain release warnings.
