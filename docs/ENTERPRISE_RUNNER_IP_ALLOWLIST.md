# Enterprise GitHub Actions: IP allowlist and self-hosted runners

If checkout fails with `repository owner has an IP allow list enabled` and `HTTP 403`, CI has not validated the library. This is a network policy error; do not modify acceptance tests or disable validation.

Ask the `aiamalaysia` GitHub organization administrator to authorize a fixed outbound IP and register approved self-hosted GitHub Actions runners. Configure these **Actions variables** in each enterprise repository (not token secrets):

- `ATGV_LINUX_RUNNER`: the registered Linux runner label (e.g. `aia-ip-approved-linux`)
- `ATGV_WINDOWS_RUNNER`: the registered Windows runner label (e.g. `aia-ip-approved-windows`)

The values must match actual available runner labels. Both runners need Git and Node.js 24 support. Each runner must be allowed to access the repository, GitHub Actions endpoints, and necessary tooling. Organization policies may additionally restrict Actions access. A self-hosted runner on a non-approved IP will still fail.

The workflow defaults remain `ubuntu-latest` and `windows-latest` for repositories without this restriction. On the enterprise repository with an IP allowlist, **both variables must be set** for all three PR checks to run on approved infrastructure.

**The current PR can be fixed only after these workflow changes are applied to its branch (or the base used by its workflow) and the approved runners are configured.** Rerun checks. Separately, code-owner review is required to merge.

Source repo `aidilazharo` no longer schedules reverse synchronization: `aiamalaysia` owns the weekday 08:00 Asia/Kuala_Lumpur pull-and-PR workflow, which also supports `workflow_dispatch`.
