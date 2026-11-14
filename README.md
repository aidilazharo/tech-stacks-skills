# ATGV SDLC Skills, Technology Stacks and Design Catalog

**This GitHub repository's `main` branch is the single source of truth.**
The VS Code extension ships no hardcoded technology scaffold, role skill, or design template.

## Layout

- `catalog.json`, `VERSION`: schema and manifest, catalog `1.1.11`
- `roles/<id>/SKILL.md`: 18 role skills
- `tech-stacks/<id>/stack.json`: five stack descriptors
- `tech-stacks/<id>/scaffold/`: runnable project starter, API, ORM and SQLite examples
- `tech-stacks/<id>/manual.md`: component access, API queries, local SQLite and test instructions
- `shared/design-systems/<id>/`: design tokens, guidance, mockup HTML template
- `shared/design-systems/aia-qi/kit/`: independent Qi-inspired UI kit v1.0.0, 34 component definitions, CSS/JS, docs, examples and MIT license. AIATECH renders component names safely from this verified repository snapshot; repository HTML/JS is not executed inside a privileged webview.
- `shared/workflows/`: approved workflow references
- `shared/document-templates/`: optional document skeletons

## Publish an update

1. Review all stack and design files and CI changes in a GitHub pull request.
2. Merge approved changes to **main** and update the semantic `VERSION` and `catalog.json` version.
3. In ATGV Settings or Solution Architect My Work, click **Check Updates**, then **Pull & Update**.
4. ATGV downloads, validates and pins the exact Git SHA, and stores a versioned offline copy.
5. Existing project source and previous approved artifacts are preserved. **Save Stack** only generates into a safe new bootstrap branch.

## Security

Catalog pulls are **read-only** and never push to this source repository. Clone/pull tokens are stored in VS Code SecretStorage. Never publish secrets or SQLite data.
Scaffold code is executable and must be reviewed before npm/dotnet/Maven runs; dependency versions, native SQLite drivers and external package sources must be approved by your organization.

## Notes

React/Angular demo APIs use Express + Drizzle ORM + SQLite in the same npm app for one-click local startup. NestJS uses Drizzle + SQLite, .NET uses EF Core SQLite, and Spring uses Spring Data JPA SQLite.
These are development starter examples, not production-reviewed templates. Live dependency download and compiler verification should be completed in your approved CI environment.

## Design systems · v1.1.3

The catalogue now includes **AIA Qi** and **Bootstrap v5.3**. Both offer a pinned component inventory, CSS, tokens, licence, and AI guidance. Bootstrap includes 5.3.6 compiled CSS + JS. ATGV displays the catalogue-selected design systems dynamically; no remote scripts run inside the privileged VS Code webview.

## Scaffold readiness · v1.1.3

Use `node scripts/validate-catalog.mjs` for an offline structural check. See [`docs/STACK-READINESS.md`](docs/STACK-READINESS.md) for per-stack test/build instructions, npm cache permission handling and lockfile-generation guidance. The three npm-based starter projects contain real unit/API tests, with browser/E2E tests in the React and Angular scaffolds. Runtime compilation and dependency-resolution checks require access to the approved npm, Maven and NuGet registries and supported Node/Java/.NET runtimes.

## Diagnosing a generated starter manifest (1.1.6)

An existing project's `atgv.bootstrap.json` is produced by **ATGV**, not by this catalog. When Save Stack fails with `Starter manifest contains an invalid generated file list`, use this read-only diagnostic from the catalog root:

```powershell
node scripts/audit-bootstrap-manifest.mjs "C:\\path\\to\\application"
```

The command reports unsafe, duplicate, missing, no-longer-cataloged, and changed generated paths plus catalog version drift. It does not alter your Git checkout. See `CHANGELOG.md` for version history and upgrade notes.

## React scaffold test change (1.1.7)

The React starter `src/App.test.tsx` now checks that the application mounts; it no longer requires the demo-only `ATGV React` heading or `New task` textbox. Product-specific acceptance criteria must be tested by the Developer TDD pipeline. Existing projects must retain their own tests unless a verified migration is safe; the ATGV extension v0.3.10 handles the exact v1.1.6 demo-only fixture in isolated development worktrees.

## AI harness catalog (1.1.8)

`ai-harness/` introduces versioned agent profiles, specialized skills, workflow definitions, safeguards and read-only evaluation fixtures. Run `node ai-harness/scripts/validate.mjs` and `node --test ai-harness/tests/harness.test.mjs` to check it. The extension requires a new adapter to consume these definitions; catalog JavaScript is not automatically executed by ATGV. See `ai-harness/README.md`.

## Agent quality suite (1.1.11)

`ai-harness/evals/agent-quality-suite.json` adds offline trace evaluation for Context, Tools, Loop, Governance, plus completion evidence, recovery, TDD integrity, traceability, handoff and instruction boundaries. Run `node --test ai-harness/tests/agent-quality.test.mjs`. These deterministic fixtures are **not** real AI inference benchmarks; see `ai-harness/README.md`.
