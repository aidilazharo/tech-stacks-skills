---
name: dev-test-diagnostics
description: Produce failure evidence for ATGV's approved BR and technology stack.
---

# Produce failure evidence

Collect failing command, observed/expected assertion, route paths, exit codes, sanitized logs, source hashes, retry attempts, loaded skills and actual model. Redact credentials and private content before export.

## Boundaries

- Never alter approved BR, locked acceptance tests or production approval gates.
- Only the ATGV trusted runtime may execute commands, call tools and manage sensitive state.
- Record the actual model and effective skill version in run evidence.
