# ATGV AI Harness — Catalog Definition (0.1.0)

This directory is the **declarative, GitHub-managed harness definition**, not a remotely executable replacement for the ATGV VS Code extension. It defines which skills to load, how SDLC workflows progress, the evidence each step needs, and how runs can be evaluated. It requires a future ATGV-compatible harness adapter to consume it.

- `manifest.json`: discoverable harness profile, capabilities and file mappings
- `agents/`: BA, SA, UIUX, DEV agent roles and default skill composition
- `workflows/`: process sequencing, TDD retries, checkpoints and verification expectations
- `skills/`: versioned, local-overridable skill instructions (never executable JS)
- `policies/`: declarative safe-use controls; immutable runtime guarantees **must be enforced by ATGV core**, not trusted to this file
- `evals/`: portable scenarios for comparing harness/skill revisions
- `scripts/`: read-only validator and dry-run plan renderer, using Node standard library
- `tests/`: structural and execution-plan regression checks

## Local verification

```sh
node ai-harness/scripts/validate.mjs
node --test ai-harness/tests/harness.test.mjs
node ai-harness/scripts/plan.mjs developer-tdd
```

## Security/trust boundary

1. The catalog is **untrusted data until its pinned SHA, paths and schema are verified**.
2. Only audited ATGV core may execute project commands, manage AI credentials, call tools, change Git state, run TDD, or enforce approvals. No downloaded script receives extension host privileges.
3. `skills/*/SKILL.md` and `agents/*.json` are task guidance. They cannot relax locked-test protection, BR approval, production gates, or privacy/credential protections.
4. Running `scripts/*.mjs` locally or in CI is a separate, explicit developer action. ATGV must never auto-execute catalog JS on pull.
5. Pin a harness version, catalog Git SHA, each actual loaded skill ID/version/digest, AI model, and permissions for a run. Updates take effect on new runs only.
6. Development Preview Mode can skip tests to preview drafts, but cannot pass acceptance criteria or authorize production delivery.

## Extending

Add a new `skills/<id>/SKILL.md` and `skills/<id>/skill.json`, refer to its ID from an agent or workflow, then update `manifest.json` and run validation. Use semantic versioning per skill. Local overrides must be kept outside the shared read-only clone with upstream IDs and diffs.

This first revision is a **validated configuration and skill scaffold**. It does **not** implement autonomous model invocation, credential access, automatic sandboxing, resumable execution, or runtime activation in existing VSIX releases.

## Runtime contracts and observability

The optional `contracts/run.json` and `contracts/episode.json` describe the per-run skill/model pin and auditable TDD evidence. `tools/registry.json` names **capability identifiers only**—it contains no executable tool implementations or permission grant. `context/selection.json` specifies recommended context order and redaction exclusions; the actual permission and token-budget enforcement remains in ATGV core.
