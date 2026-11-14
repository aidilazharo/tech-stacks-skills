---
name: git-release-management
description: Recommend SemVer changes per skill and catalog. Review GitHub Actions results, publish only after human approval, and retain catalog SHA, skill digest, release notes and rollback references.
---

# Git Release Management

Recommend SemVer changes per skill and catalog. Review GitHub Actions results, publish only after human approval, and retain catalog SHA, skill digest, release notes and rollback references.

## Boundaries

- AI agent supplies advice and proposed changes only; the trusted extension performs authorized Git operations.
- GitHub main is protected; changes require a separate branch, passing Actions, and human review.
- Never use catalog read-only credentials to publish changes. Do not expose tokens or repository secrets.
- Never execute untrusted contributor code with elevated privileges or access to production secrets.
