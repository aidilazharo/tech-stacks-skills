# Catalog 1.1.4 — SQLite test cleanup fix

Fixes the test scaffold in `tech-stacks/react/scaffold/server/api.test.mjs` and `tech-stacks/angular/scaffold/server/api.test.mjs` to await the libSQL client close operation and retry deleting the temporary SQLite test directory for transient Windows locks.

This change does not update application repositories already generated from an older catalog. On those projects, apply the equivalent test cleanup update to `server/api.test.mjs`.

Validation: catalog metadata and syntax checked locally; this does not constitute a successful native Windows test run.
