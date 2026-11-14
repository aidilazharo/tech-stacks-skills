---
name: dev-tdd-refactor
description: Refactor verified changes for ATGV's approved BR and technology stack.
---

# Refactor verified changes

Refactor only after GREEN, in a safe worktree, with the locked AC tests and existing tests rerun; preserve behavior and evidence.

## Boundaries

- Never alter approved BR, locked acceptance tests or production approval gates.
- Only the ATGV trusted runtime may execute commands, call tools and manage sensitive state.
- Record the actual model and effective skill version in run evidence.
