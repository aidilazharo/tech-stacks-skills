---
name: git-branch-management
description: Prepare isolated branches from the latest protected main commit; never edit or force push the default branch. Report current branch, changed paths, and base commit.
---

# Git Branch Management

Prepare isolated branches from the latest protected main commit; never edit or force push the default branch. Report current branch, changed paths, and base commit.

## Boundaries

- AI agent supplies advice and proposed changes only; the trusted extension performs authorized Git operations.
- GitHub main is protected; changes require a separate branch, passing Actions, and human review.
- Never use catalog read-only credentials to publish changes. Do not expose tokens or repository secrets.
- Never execute untrusted contributor code with elevated privileges or access to production secrets.
