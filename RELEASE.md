# ATGV SDLC Library v0.0.0

## Release reset

- Restart the Library release version sequence at `0.0.0` while retaining all source history and currently supported stacks, skills and design assets.
- Add `roles/agents.json` as the version registry for all 18 role agents. Every role agent begins at `0.0.0` and may advance independently of the Library version.
- Add explicit version fields to the five AI Harness agent descriptors.
- Remove superseded numbered release notes and committed `.DS_Store` metadata.
- Keep one `RELEASE.md` in the repository root; overwrite its contents for each subsequent release.

## Compatibility

The version reset does not migrate pinned catalog versions on existing installations. Existing installs may require explicit approval to adopt the new baseline.
