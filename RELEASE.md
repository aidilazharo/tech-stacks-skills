# ATGV SDLC Library v0.0.6

## Changes

- Record accepted source-only decisions for **all 18 specialist agents** in `.memory/role-boundaries.json` and link the policy from `.memory/manifest.json` and `AGENTS.md`.
- Publish a declarative runtime contract in `ai-harness/policies/role-expertise-handoff.json`, referenced by the harness manifest, mapping each role to its verified `roles/<role>/SKILL.md` and typical deliverables.
- Keep a specialist's AI chat focused on its selected role. Explicit requests to create another role's exclusive deliverable must suggest a user-clickable role switch, not silently execute the work.
- Permit cross-role questions, impact assessment and dependency reviews within the currently active role. Treat ambiguous multiple-role requests as needing clarification, not an automatic switch.
- Require enabled-role and permission checks. Never change role assignments automatically, copy private chat history without consent or invent approvals.
- Keep a working **What to do next** control available regardless of AI/provider availability. The extension owns the UI and navigation enforcement; catalog scripts remain non-executable.
- Retain `.memory export-ignore` so coding-agent memory does not leak into the Library source release ZIP.

## Verification

Run catalog and Harness validation, all role-skill consistency tests, memory packaging tests and starter regression suites before merging or publishing Library v0.0.6.
