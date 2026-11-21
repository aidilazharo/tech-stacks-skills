# ATGV SDLC Library v0.0.2

## Changes

- Record the source-only `.memory` release policy in decision memory.
- Exclude `.memory/` from GitHub source ZIPs using `git archive` export-ignore attributes.
- Verify that release ZIPs have no `.memory` entries before publication.
- Support running the version-policy module and harness planner without bundled decision memory.
- Preserve one overwritten RELEASE.md and exact incremental versions.

## Validation

- Catalog, Harness, starters and archive-exclusion CI checks.
