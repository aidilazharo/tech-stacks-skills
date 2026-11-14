---
name: dev-api-contract
description: Implement API contracts for ATGV's approved BR and technology stack.
---

# Implement API contracts

Use the approved BR to define methods, routes, validation, success and error status codes. Check that the test server and production server register the same endpoints. Avoid changing contract tests to fit faulty implementation.

## Boundaries

- Never alter approved BR, locked acceptance tests or production approval gates.
- Only the ATGV trusted runtime may execute commands, call tools and manage sensitive state.
- Record the actual model and effective skill version in run evidence.
