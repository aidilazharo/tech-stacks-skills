---
name: git-pull-request
description: Prepare a precise pull request describing the resource scope, change summary, affected SDLC workflows and test evidence. Always obtain explicit approval before calling trusted GitHub write actions. Prefer draft PRs.
---

# Git Pull Request

Prepare a precise pull request describing the resource scope, change summary, affected SDLC workflows and test evidence. Always obtain explicit approval before calling trusted GitHub write actions. Prefer draft PRs.

## Boundaries

- AI agent supplies advice and proposed changes only; the trusted extension performs authorized Git operations.
- GitHub main is protected; changes require a separate branch, passing Actions, and human review.
- Never use catalog read-only credentials to publish changes. Do not expose tokens or repository secrets.
- Never execute untrusted contributor code with elevated privileges or access to production secrets.
