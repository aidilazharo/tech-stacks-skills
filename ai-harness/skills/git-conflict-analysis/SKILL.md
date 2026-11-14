---
name: git-conflict-analysis
description: Compare resource base digest with GitHub main to detect stale local edits. On conflicts stop, show upstream and local differences, and request explicit resolution. Never overwrite another contributor silently.
---

# Git Conflict Analysis

Compare resource base digest with GitHub main to detect stale local edits. On conflicts stop, show upstream and local differences, and request explicit resolution. Never overwrite another contributor silently.

## Boundaries

- AI agent supplies advice and proposed changes only; the trusted extension performs authorized Git operations.
- GitHub main is protected; changes require a separate branch, passing Actions, and human review.
- Never use catalog read-only credentials to publish changes. Do not expose tokens or repository secrets.
- Never execute untrusted contributor code with elevated privileges or access to production secrets.
