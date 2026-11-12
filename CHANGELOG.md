# Changelog

## 1.1.4 — 2026-11-12

- React and Angular SQLite API scaffold tests: await database client closure and retry temporary database deletion on Windows when SQLite file handles remain briefly busy (`EBUSY` / `EPERM`).
- Retain real test failures and existing acceptance assertions; no tests are disabled or bypassed.
- Existing generated project repositories are not modified by downloading this catalog update; apply the same patch to an existing `server/api.test.mjs` as needed.
- Windows integration execution remains necessary to confirm the EBUSY fix in the target environment.

## 1.1.3 — 2026-11-11

- React: convert JSX starter to TypeScript/TSX; add Vitest + React Testing Library, Playwright and axe-core tests.
- Angular: use CLI Vitest TestBed, API tests and Playwright/axe; configure proxy and correct Angular 22 supported runtime and TypeScript ranges.
- NestJS: add real validation unit tests and Supertest/SQLite integration tests; remove unsupported Jest OpenAPI claim.
- Spring Boot: add MockMvc controller test; align integration framework descriptor.
- .NET: align declared test frameworks with actual packages; avoid claiming uninstalled frameworks.
- All: align version metadata, add catalog validator and writable npm cache readiness guidance.
- npm package-lock.json files are **not included**: registry access was unavailable during packaging. Generate and commit them with `npm install --package-lock-only` on a registry-connected machine; thereafter use `npm ci`.

## 1.1.2

- Design-system kits and guides for AIA Qi and Bootstrap 5.3.
