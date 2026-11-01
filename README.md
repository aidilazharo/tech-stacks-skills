# ATGV SDLC Skills & Technology Stacks

This private repository is the **pull-only central asset catalog** for ATGV AIATECH Assist. Approved branch: **main**. Do not use this repository for project source code, credentials, Jira exports or confidential business documents.

Contents: 18 role-based skills, 5 technology-stack descriptors and minimal editable scaffold references, reusable workflows/document templates, and an **AIA Qi-informed** UI/UX starter. Official AIA Qi token values and licensed component source were not publicly provided; the starter marks all sample tokens as provisional, not official AIA brand specifications.

## Layout

- `catalog.json`: catalog schema 1, semantic version and required asset IDs
- `roles/<role-id>/SKILL.md`: person-neutral SDLC role guidance; names describe responsibilities rather than people
- `tech-stacks/<id>/stack.json`: extension-compatible validated descriptors
- `tech-stacks/<id>/scaffold/`: baseline examples, subject to dependency review before any production use
- `shared/workflows/`: planning, review and authorization steps
- `shared/document-templates/`: reusable drafts
- `shared/design-systems/aia-qi/`: provisional tokens, guidance and mockup template

## Extension

In VS Code open Settings → GitHub — SDLC Catalog. The default repository is `https://github.com/aidilazharo/tech-stacks-skills`; connect with VS Code GitHub sign-in (private repository requires access). Test Connection → Pull Catalog. The extension pins exact Git commit+blob hashes, activates safe workspace assets and uses the selected stack and design guidance. It does not push to this repository.

Existing authored project files and customized workspace tech-stack JSON override remote examples. An updated main commit requires a new Pull to activate; check-for-update does not silently replace assets.

Source: https://design.aia.com/aia-qi-design-system (general Qi design goals: consistency, efficiency and scalability). All sample tokens are illustrative until approved by the AIA design owner.
