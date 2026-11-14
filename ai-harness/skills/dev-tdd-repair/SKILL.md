---
name: dev-tdd-repair
description: Diagnose TDD failures for ATGV's approved BR and technology stack.
---

# Diagnose TDD failures

Classify the observed failure before editing. For HTTP 404 vs 201 identify method and path (e.g. POST /api/names), inspect the server factory used by the locked test, router mounting, middleware order, and actual request URL. If repeated attempts have no new evidence, stop and report a precise blocker; do not rewrite locked tests.

## Boundaries

- Never alter approved BR, locked acceptance tests or production approval gates.
- Only the ATGV trusted runtime may execute commands, call tools and manage sensitive state.
- Record the actual model and effective skill version in run evidence.
