# Catalog 1.1.6 — validation report

Date: 2026-11-12

## Checks passed locally (Linux)

- `node scripts/validate-catalog.mjs`: five stacks, 18 roles, two design systems; no errors.
- ATGV v0.3.07 extension `inspectManifest`: passed using the updated catalog tree.
- All 24 catalog JSON files parsed.
- `node --test tests/catalog-bootstrap-audit.test.mjs`: 5 tests passed.
- `node --test tech-stacks/nestjs/scaffold/test/static.test.mjs`: 1 test passed.
- `node shared/design-systems/aia-qi/kit/tests/verify.js`: passed.
- `node --check` for catalog scripts and React/Angular API server/test `.mjs`: passed.
- Distribution archive verified using CRC and safe-path checks after packaging.

## Warnings

- React, Angular and NestJS `package-lock.json` files are absent; create them from a supported Node environment with approved npm registry access before enforcing `npm ci`.
- No live npm dependency resolution, complete application builds, browser runs, .NET or Maven builds, or native Windows SQLite test execution were performed here.
- The project's existing `atgv.bootstrap.json` has not been inspected; catalog updates alone cannot reconcile it.

The new GitHub Actions workflow supplies offline checks on both Linux and Windows **after** it is committed to the repository. Its presence in this archive is not evidence of a completed Windows CI run.
