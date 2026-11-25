# ATGV SDLC Skills, Technology Stacks and Design Catalog

**This GitHub repository's `main` branch is the single source of truth.**
The VS Code extension ships no hardcoded technology scaffold, role skill, or design template.

## Layout

- `catalog.json`, `VERSION`: schema and manifest, catalog `0.0.9`
- `roles/<id>/SKILL.md`: 18 role skills
- `.memory/`: curated, categorized JSON decision records (version rules, release policy, workflow policies)
- `roles/agents.json`: independent SemVer for each of 18 role agents (all initialize at `0.0.0`)
- `tech-stacks/<id>/stack.json`: five stack descriptors
- `tech-stacks/<id>/scaffold/`: runnable project starter, API, ORM and SQLite examples
- `tech-stacks/<id>/manual.md`: component access, API queries, local SQLite and test instructions
- `shared/design-systems/<id>/`: design tokens, guidance, mockup HTML template
- `shared/design-systems/aia-qi/kit/`: independent Qi-inspired UI kit v1.0.0, 34 component definitions, CSS/JS, docs, examples and MIT license. AIATECH renders component names safely from this verified repository snapshot; repository HTML/JS is not executed inside a privileged webview.
- `shared/workflows/`: approved workflow references
- `shared/document-templates/`: optional document skeletons

## Publish an update

Use `node scripts/set-version.mjs 0.0.1` (with the approved new number) before every release. It updates catalog metadata and overwrites the single `RELEASE.md`; replace the placeholder with actual reviewed changes before merging.

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

Use `node scripts/validate-catalog.mjs` for an offline structural check. See [`docs/STACK-READINESS.md`](docs/STACK-READINESS.md) for per-stack test/build instructions, npm cache permission handling and locked-install guidance. The three npm-based starter projects contain real unit/API tests, with browser/E2E tests in the React and Angular scaffolds. Runtime compilation and dependency-resolution checks require access to the approved npm, Maven and NuGet registries and supported Node/Java/.NET runtimes.

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

Catalog 1.1.14: React starter now includes an interactive Qi-inspired component reference (buttons, badges, cards, forms, tables, progress and dialogs). New generated projects receive it automatically; existing pristine catalog starters require verified migration through ATGV Save Stack. Edited application files are not overwritten. This is an independent starter, not an official AIA Qi distribution.

**Decision memory distribution:** `.memory` stays in the source repository and is excluded from release ZIPs. Runtime tools function when this directory is absent.

**AI source memory:** The `.memory` JSON files are consulted from Git source checkouts before AI writes or updates code, not from distributed Library ZIPs. Extension runtime error logs are unified under `.atgv/src/error-logs`; the library supplies coding guidance, not another runtime log store.

## Role-aware AI navigation (Library 0.0.5)

Every catalog role is registered in `ai-harness/manifest.json` and points to its individual `roles/<role>/SKILL.md`. The shared, active-project-only context contract is `ai-harness/context/project-snapshot.json`; approved BRs, live Jira issues and Confluence activity metadata remain authoritative at their own sources. The role navigation registry `ai-harness/actions/role-next-actions.json` provides one read-only next-step link for all 18 roles. These files are declarations, not executable code: the ATGV extension must load, validate, permission-check and render actions. Do not trust model text to choose executable commands. Provider sharing of project evidence requires consent.

## All 18 specialist roles and explicit handoffs (Library 0.0.6)

The source-only `.memory/role-boundaries.json` and distributable `ai-harness/policies/role-expertise-handoff.json` declare each agent's role expertise and verified role-SKILL.md. ATGV may explain cross-role dependencies from the currently selected role but must recommend a user-clickable role switch before producing another specialist's deliverable. The role remains unchanged until the user clicks; a disabled role leads to settings, never automatic assignment. The original request remains a draft and the persistent What to do next button stays visible even when AI is offline. Runtime enforcement belongs to the extension core.

## Shared workspace defaults · v0.0.7

The Library is **itself the GitHub repository checkout** at `<workspace>/.atgv/library/` (never `library/repository/`). `sdlc/` contains six reusable lifecycle processes, five reference role configurations and two approval workflows; `templates/` contains 14 reusable document templates. These assets are version-controlled, read as data, and must not be copied into the clean Library checkout by the VS Code extension. Projects own their runtime state, approvals, generated documents and overrides. The extension may use safe offline fallbacks before initial Library setup. See `docs/WORKSPACE-LIBRARY.md`.

## AIA Malaysia distribution

The development repository runs all CI, synchronization and release publication. After verified source release, `sync-to-aiamalaysia.yml` creates a versioned PR in `aiamalaysia/my-fow-technology-app-techassists-enterprise-skills`. The scheduled or manual `publish-aiamalaysia-release.yml` checks merged PRs before publishing the ZIP and checksum via GitHub API. Configure an organization-approved `AIAMALAYSIA_PAT` repository Actions secret with Contents and Pull requests write access. Both workflows provide manual dry runs. Destination Actions remain disabled; its GitHub workflows and destination-only files are preserved.
