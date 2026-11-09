# VS Code SDLC extension integration (Designs & Diagrams)

Use this pack as an **AI design guideline source**, not a replacement for the existing SDLC data model.

## Suggested location in an SDLC skills repository

```
repo/
  design-systems/
    qi-inspired/
      manifest.json
      tokens/tokens.json
      css/qi.css
      js/qi.js
      ai/AGENTS.md
      ai/design-contract.schema.json
      examples/...
  skills/
    solution-architect/...
    ui-ux-designer/...
```

## Settings example

```
UI & Design → Design System
  Provider: Local design kit | Approved internal Qi package
  Source path: <project>/design-systems/qi-inspired
  Token file: tokens/tokens.json
  AI rules: ai/AGENTS.md
  Preferred screen stack: HTML/CSS | React | Angular
  Design approval: Required
  Preview: Open in editor tab
```

## UI workflow

1. Approved business requirement and Jira traceability revision must be read-only inputs.
2. AI calculates a screen inventory, interaction map and `design-contract.json` (do not show a complete design before this step).
3. Users open **Designs & Diagrams → UI/UX Designs** and view a list of generated pages. Each page opens in a **new preview tab**.
4. The user reviews one or more responsive breakpoints, edits descriptions and explicitly approves or requests regeneration. Maintain immutable approved design revisions.
5. Downstream developer work uses only approved revisions and records token version, screen revision, BR IDs, Jira IDs and generation hash.
6. If BR changes, create an impact proposal; do not silently overwrite approved designs or Jira content.
7. Deliver source files, visual preview screenshots and acceptance checks. Never submit the standalone mockups as if they are production-connected code.

## Governance and permissions

A repo should be pull-only for consumers, pinned by commit SHA or semantic release tag, and verified with a SHA-256 checksum; cache it locally for offline use. Show source and version in settings. Disallow unknown URLs and unapproved executable packages. Do not run generated code automatically in a privileged VS Code context.
