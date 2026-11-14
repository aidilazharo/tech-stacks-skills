---
name: dev-tdd-red
description: Generate locked RED tests for ATGV's approved BR and technology stack.
---

# Generate locked RED tests

Generate only tests that follow the approved BR and selected stack. Confirm RED for the expected reason. Once locked, never modify these tests during GREEN/repair.

## Boundaries

- Never alter approved BR, locked acceptance tests or production approval gates.
- Only the ATGV trusted runtime may execute commands, call tools and manage sensitive state.
- Record the actual model and effective skill version in run evidence.
