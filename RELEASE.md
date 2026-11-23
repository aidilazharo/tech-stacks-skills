# ATGV SDLC Library v0.0.7

## Changes

- Publish six shared SDLC processes, five reference role definitions and two approval workflows under `sdlc/`.
- Publish 14 shared document templates under `templates/` at the Git checkout root.
- Define `.atgv/library/` as the checked-out GitHub Library itself; no nested `repository/` directory.
- Version reusable defaults independently of per-project progress, drafts, project memory and approval history.
- Keep Library content declarative; never execute downloaded scripts in the privileged extension runtime.

## Verification

`node scripts/validate-catalog.mjs` and `node --test tests/*.test.mjs` plus harness checks; verify Git checkout remains clean after ATGV initialization.
