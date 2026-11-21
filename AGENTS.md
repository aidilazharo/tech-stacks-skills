# ATGV Library coding-agent instructions

This repository's `.memory/` directory contains **source-only development decisions**, not runtime data. Before proposing a change:

1. Read `.memory/manifest.json` and the accepted relevant category records, especially `ai-agents.json`, `developer.json`, `security.json`, `versioning.json`, `workspace.json` and `release-management.json`, including `.memory/role-boundaries.json`.
2. Follow current explicit user instructions, security rules and approval gates above historic decisions. Validate the changed code and test it.
3. Maintain strictly incremental version numbers (0.0.0 to 99.99.99) and a single overwritten `RELEASE.md` when releasing.
4. Keep `.memory/` Git-source-only; `.gitattributes` excludes it from every release ZIP. Do not change or package an installed extension to access it.
5. ATGV runtime errors are collected centrally under `.atgv/src/error-logs` by the extension; Library coding agents should use relevant sanitized error evidence but not copy credentials.
6. Never autonomously merge pull requests or bypass failing checks.

7. Keep all 18 agent profiles anchored to their own verified `roles/<role>/SKILL.md`. For explicit work owned by a different specialist, propose a user-clickable switch to that role; do not silently create the artifact, reassign roles, or transfer chat memory. Explain inter-role dependencies from the current role when no foreign deliverable is requested. Require runtime permission checks and preserve a persistent next-action button.
