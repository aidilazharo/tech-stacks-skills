## 0.0.0 — Clean version baseline (2026-11-21)

- Reset the root SDLC Library version to `0.0.0` without deleting source history or changing runtime scaffolds.
- Add independent `0.0.0` role-agent versions for every catalog role and five harness agent profiles.
- Consolidate release notes into one overwritten `RELEASE.md` and remove obsolete release-note files and macOS metadata.
- Preserve pinned libraries, starter lockfiles, tests, skills and source provenance.

## 1.1.17 — Verified starter builds and dependency updates

- Upgrade Drizzle ORM and the test tooling; add npm lockfiles for reproducible starter installs.
- Repair the NestJS TypeScript production build and verify React, Angular and NestJS tests and builds before publishing.
- Validate every webview asset against its manifest and run catalog checks in the release workflow.
- The upstream picomatch development-tool ReDoS advisory has no patched release; use trusted glob patterns and review updates when available.

## 1.1.16 — SortableJS moves to the verified SDLC Library

- Publish the unmodified MIT-licensed SortableJS 1.15.7 browser build, license, and provenance notice in shared/libraries/webview/assets/sortablejs/.
- Update the trusted webview asset manifest to v1.0.1 with pinned SHA-256 and sizes. ATGV v0.4.13 can load these assets through its verified local Library cache, retaining native Kanban fallback when the asset is unavailable.
- Preserve existing code editor, Quill, Gantt, tech stack, role skills, and design catalog resources.

## 1.1.12 — Verified webview libraries

- Added CodeMirror, Quill and Frappe Gantt browser assets under shared/libraries/webview with a versioned SHA-256 manifest.
- Support runtime download, integrity verification, caching and no-npm use in ATGV v0.3.31.
- Existing catalog resources, agents, skills, tests and scaffolds are preserved.

## 1.1.11 — AI Agent Quality Tests

- AI Harness v0.3.0 adds a read-only, offline, ten-category Agent Quality evaluator and sixteen synthetic test fixtures: four requested failure modes plus six supporting dimensions.
- Distinguishes failed checks from blocked checks (e.g. missing permissions or tool availability).
- Adds a normalized agent-trace contract, validation checks and GitHub Actions test coverage.
- Preserves existing catalog skills, tech stacks and trusted ATGV runtime boundaries. No extension changes or live model inference in this release.

## 1.1.10 (2026-11-14) — Library repository cleanup

- Remove seven obsolete root-level audit, validation snapshot and historical release-note Markdown files. Their release history is retained in `CHANGELOG.md` and prior Git commits.
- Update README references to the retained changelog.
- Preserve all role skills, harness workflows, SDLC templates, technology-stack scaffolds, design-system assets, licenses, tests and GitHub Actions.
- Do not deduplicate identical stack scaffold files because each scaffold must remain independently deployable.
- No extension runtime or AI skill behavior changes.

## 1.1.9 (2026-11-13)

- Add Git Agent, contribution workflow, four Git skills, and GitHub Actions validation workflows.

## 1.1.8 — Catalog AI Harness definitions (candidate)

- Added optional AI harness manifest, four SDLC agent profiles, four workflows and seven independently versioned Developer skills.
- Added read-only validation, plan inspection, guarded TDD 404 evaluation fixture and CI tests.
- No ATGV runtime activation; requires a future extension adapter. No privileged downloaded JS execution.

# Changelog

## 1.1.7 — 2026-11-13
- Replace React starter demo-specific UI assertions with an accessible application mount smoke test.
- Do not treat the original task-list example as an acceptance criterion for unrelated Business Requirements.
- Keep application-specific RED/GREEN tests mandatory in the ATGV Developer workflow.

## 1.1.6 — 2026-11-12

- Fix inconsistent version metadata in the uploaded 1.1.5 archive (catalog.json still 1.1.4).
- Correct the Bootstrap design-system ID and referenced paths to `bootstrap-5-3`, matching the catalog directory and the extension normalization.
- Add read-only bootstrap manifest audit utility and regression checks.
- Reinforce catalog validation, scaffold path safety checks, and GitHub CI checks.
- Retain 1.1.4 Windows SQLite cleanup correction for React and Angular starters.
- Do not silently repair or rewrite existing application checkout files.

## 1.1.5 — uploaded archive

- VERSION had been advanced without aligning catalog.json and release notes. This inconsistency is corrected in 1.1.6.

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
