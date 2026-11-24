# ATGV SDLC Library v0.0.8

## Changes

- Add development-hosted automatic source synchronization and PR creation to the approved AIA Malaysia Library repository.
- Pin synchronization to a verified main revision and matching Library source release; validate VERSION and catalog.json.
- Protect destination .git, .github, action manifests and destination-only files; never force-push or write directly to main.
- After an approved destination PR is merged, verify the source projection and publish the Library source ZIP and SHA-256 checksum via GitHub API.
- Preserve release identity, verify uploaded draft assets and prevent overwrites and downgrades.
- Provide scheduled publication checks and manual dry-run controls. AIA Malaysia GitHub Actions remain disabled.

## Verification

Local Git overlay, version, asset and checksum tests run with the existing Library catalog, harness and starter checks. Live destination synchronization requires the approved AIAMALAYSIA_PAT secret and repository permissions.
