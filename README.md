# ATGV SDLC Skills, Technology Stacks and Design Catalog

**This GitHub repository's `main` branch is the single source of truth.**
The VS Code extension ships no hardcoded technology scaffold, role skill, or design template.

## Layout

- `catalog.json`, `VERSION`: schema and manifest, catalog `1.1.1`
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

## Design systems · v1.1.2

The catalogue now includes **AIA Qi** and **Bootstrap v5.3**. Both offer a pinned component inventory, CSS, tokens, licence, and AI guidance. Bootstrap includes 5.3.6 compiled CSS + JS. ATGV displays the catalogue-selected design systems dynamically; no remote scripts run inside the privileged VS Code webview.
