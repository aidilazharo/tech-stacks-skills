# ATGV workspace Library, v0.0.7

The GitHub Library repository checks out **directly** to `.atgv/library/`. This folder contains `.git/`, `catalog.json`, `VERSION`, `roles/`, `tech-stacks/`, `sdlc/`, `templates/`, `shared/` and the declarative AI Harness files. Never create `.atgv/library/repository/`.

The `sdlc/` directory stores reusable process, role and workflow definitions. `templates/` stores reusable Markdown starters. They are version-controlled in Library main, immutable under normal extension activity, and read only as *untrusted reference data*. The extension must not execute arbitrary Library JavaScript or HTML in a privileged context.

Each project keeps its own `atgv.project.json`, real project source checkout, delivered `documents/`, `knowledge/` including SQLite and uploaded sources, `sdlc/` runtime progress and approvals, and `overrides/`. Create project-specific files only where needed; never merge project state into the Library.

For older installations, preserve user-edited `.atgv/sdlc/`, `.atgv/templates/` and the prior `.atgv/library/repository/` layout as a backup before activating the clean repository at `.atgv/library/`. Never hard-reset Git or overwrite local edits during path migrations. The Library's `VERSION` and `catalog.json.version` must match.
