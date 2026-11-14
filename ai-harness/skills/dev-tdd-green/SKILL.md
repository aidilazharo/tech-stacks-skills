---
name: dev-tdd-green
description: Implement the passing code for ATGV's approved BR and technology stack.
---

# Implement the passing code

Implement the smallest correct change in an isolated worktree; verify the exact test target and real entry point; preserve last passing implementation and retest prior ACs.

## Boundaries

- Never alter approved BR, locked acceptance tests or production approval gates.
- Only the ATGV trusted runtime may execute commands, call tools and manage sensitive state.
- Record the actual model and effective skill version in run evidence.
