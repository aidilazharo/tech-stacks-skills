# AI interface design instructions — Qi-inspired AI UI Kit v1.0.0

Apply these instructions before generating **any** UI/UX mockup, screen, page, design, prototype, HTML or frontend application.

## Status and provenance

This package is an **unofficial original implementation** inspired by the public AIA Qi Design System. It is **not** official AIA Qi, does **not** include AIA-owned code, design files, fonts, logos, illustrations or design-token exports, and does **not** certify brand compliance. Do not describe generated interfaces as officially Qi-compliant. Use the actual internally licensed AIA Qi library where it is authorized and available.

Public source: https://design.aia.com/aia-qi-design-system

## Mandatory AI workflow

1. Read `tokens/tokens.json`, `css/qi.css`, `docs/index.html` and `ai/design-contract.schema.json` before making visual decisions.
2. Read the business requirement, user roles, device targets, language, existing product conventions and accessibility needs.
3. Translate the requirement into a **screen inventory**, **task-based user flow**, content hierarchy, component list and states **before** writing code. Use `ai/design-contract.example.json` as the machine-readable output pattern.
4. Compose pages using existing `qi-` classes and semantic tokens. Never invent a competing ad-hoc design system unless a needed component is absent; then document it.
5. Implement desktop 1440x900, tablet 768x1024 and mobile 375x812 as minimum tested references. Assess tablet landscape 1024x768 as well.
6. Generate states for each interaction: default, hover, focus-visible, active, disabled, loading, success, warning, error, empty and user confirmation, where relevant.
7. Make all calls to action function or label them as prototypes. Never present inert controls as finished functional work.
8. Check accessible names, form labels, semantic headings, logical keyboard order, contrast, reduced motion, language lengths, error descriptions and focus management.
9. Use only authorized brand assets. Do not recreate AIA logo from scratch, bundle proprietary AIA Everest files or import restricted Qi components.
10. Record which details are confirmed by public Qi guidance versus independent approximations. Do not hallucinate exact specs.
11. Deliver editable source files and a preview path; include component manifest, breakpoints, interactions and accessibility checklist.

## Visual direction

- Calm, confident digital insurance experience: **white and off-white surfaces**, charcoal text, **reserved red emphasis**.
- Red should not visually dominate more than about 20% of the complete layout. This is a public Qi recommendation, not an automated guarantee.
- Prefer a 4px spacing rhythm; group related content together, separate distinct tasks clearly.
- Use a 12-column responsive grid and tidy cards with restrained elevation.
- Use readable labels. Put **one primary action** in the main decision region, then secondary/ghost actions.
- Avoid gratuitous gradients, shadows, cards, fake performance metrics, emoji-only status indicators and dense hero graphics.
- Typography fallback: Open Sans → Noto Sans → system UI. AIA Everest only if licensed and supplied locally by the consuming organization.
- Prepare for multi-country and multilingual content; do not rely on fixed-width labels or English-only assumptions.
- Use neutral icons or original SVGs, not repurposed protected symbols.

## Component contract

| Category | Use | Classes / markup |
|---|---|---|
| Grid | Responsive 12-column layout | `.qi-container`, `.qi-row`, `.qi-col-12`, `.qi-col-md-6`, `.qi-col-lg-4` |
| Shell | Header/sidebar/main | `.qi-shell`, `.qi-shell-top`, `.qi-shell-sidebar`, `.qi-shell-main` |
| Actions | Primary, secondary, ghost, destructive | `.qi-btn`, `.qi-btn-primary`, `.qi-btn-secondary`, `.qi-btn-ghost`, `.qi-btn-danger` |
| Display | Card, metrics, badges, table | `.qi-card`, `.qi-kpi`, `.qi-badge-*`, `.qi-table` |
| Inputs | Labeled fields | `.qi-field`, `.qi-label`, `.qi-input`, `.qi-select`, `.qi-textarea` |
| Selection | Checkbox/radio/switch/chip | `.qi-check`, `.qi-radio`, `.qi-switch`, `.qi-chip` |
| Navigation | Sidebar/breadcrumb/tabs | `.qi-nav-link`, `.qi-breadcrumb`, `.qi-tab`, `[role=tablist]` |
| Disclosure | Expand/collapse | `.qi-accordion-trigger[aria-controls][aria-expanded]` |
| Feedback | Alert/progress/toast | `.qi-alert-*`, `.qi-progress`, `QiUI.toast()` |
| Overlay | Accessible modal | `.qi-modal-backdrop`, `.qi-modal[role=dialog]`, `QiUI.openModal()` |
| Flow | Step indicator | `.qi-steps`, `.qi-step[data-state]` |

## Generation rules

- Output valid, independently runnable HTML and CSS/JS. Use `<link rel="stylesheet" href=".../css/qi.css">` and `<script src=".../js/qi.js"></script>`.
- Reuse existing CSS variables e.g. `var(--qi-color-primary)` and `var(--qi-space-4)`; do not hard-code a parallel palette.
- A mockup must resemble the functional intended design, not a colored wireframe: realistic hierarchy and plausible fictional data **clearly labeled as fictional**.
- Never invent a real user's sensitive data or production business values.
- Split reusable patterns into components when using React, Vue, Angular or other frontend environments; retain the same token naming and semantic behavior.
- Provide a component-to-requirement traceability table and a list of assumptions or unresolved business questions.

## Recommended generation sequence

`BR → Screen inventory → Flow + states → Design contract JSON → Static responsive mockups → Stakeholder review → Functional screens → Interaction verification → Accessibility checks → Approved handoff`

## Critical review checklist

- Is the primary next step instantly clear? Does the layout prioritize user goals?
- Are forms labeled, validated, recoverable, and confirmed before irreversible actions?
- Are dark-mode text, navigation, tables and state colors readable?
- Does every clickable UI element work in mockup or explicitly say demo?
- Did the AI avoid using any official AIA logos, protected artwork, fonts, exact source code or unsupported compliance claims?
- Are both design and implementation grounded in the same tokens and semantic components?
