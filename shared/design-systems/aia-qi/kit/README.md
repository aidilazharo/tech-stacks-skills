# Qi-inspired AI UI Kit v1.0.0

**An independent Bootstrap-like CSS/JS starter and AI design guide** informed by public AIA Qi design principles. Ships as a self-contained ZIP. No dependencies, build tools, proprietary AIA fonts, logos, Figma exports or private component source.

> **Important:** This is **not the official AIA Qi Design System** and is not an authorized, pixel-perfect, AIA-branded reproduction. Its exact hex values, radii, spacing scale beyond the public 4px base, shadows, CSS classes and implementation are our original starter decisions. Use approved Qi packages and tokens if you need organization-certified brand fidelity.

## Open and preview

1. Extract the ZIP.
2. Open `docs/index.html` in a browser for the **visual component guide**.
3. Open `examples/insurance-dashboard.html` to see a full responsive portal page.
4. Open `examples/claims-flow.html` to use a working three-step demonstration.
5. For AI-generated screens, load `ai/AGENTS.md` and `tokens/tokens.json` as AI instructions or context, then use `ai/feature-to-ui-prompt.md`.

No `npm install`, internet access or backend is needed. The example pages use only local files and fictional data. `npm test` is available for basic repository checks.

## Install in your project

Copy `css/qi.css` and `js/qi.js` to your app, then include:

```html
<link rel="stylesheet" href="css/qi.css">
<main class="qi-container qi-page">
  <div class="qi-row">
    <section class="qi-col-12 qi-col-md-6 qi-card">
      <h1>Welcome</h1>
      <button class="qi-btn qi-btn-primary" type="button">Get started</button>
    </section>
  </div>
</main>
<script src="js/qi.js"></script>
```

Use `import 'qi-inspired-ai-ui-kit/css/qi.css'` and `import 'qi-inspired-ai-ui-kit/js/qi.js'` if included through a bundler (refer to the local package metadata). JavaScript interactions are optional progressive enhancements.

## Key parts

| Area | Included |
|---|---|
| Foundations | Starter color and semantic tokens, typography stacks, 4px spacing, radii and shadows, contrast-aware status palettes |
| Layout | 12-column fluid grid, breakpoints 576/768/1024/1440, fixed-width and fluid containers, optional app shell |
| Components | Buttons, cards, KPIs, badges, tags, alerts, form fields, checks, radios, switches, chips, tabs, accordion, breadcrumbs, navigation, table, progress, stepper, empty/skeleton states, modals, notifications |
| Interactions | Dependency-free keyboard tabs, accordion, modal with focus trapping, toasts, mobile navigation, theme toggle |
| Examples | Insurance policy dashboard + end-to-end guided claim interface (fictional) |
| AI instructions | `AGENTS.md`, copy/paste system prompt, feature-to-UI prompt, machine-readable design contract + schema, VS Code / GitHub Copilot integration guide, reusable skill |
| Tests | Node structural tests plus optional browser validation (see below) |

## Publicly described Qi facts used

- AIA Qi design: reusable components for consistency, efficiency and scalability.
- Palette: red, charcoal and white dominate; secondary salmon, purple and warm grey; red used sparingly (approximately 20% or less in a layout).
- 4px **soft** spacing grid, with 8px alignment affinity.
- Up to 12 equal columns; reference frames of **375×812**, **768×1024**, **1024×768**, **1440×900**.
- Digital fonts are AIA Everest (license-controlled) and Open Sans; Noto Sans is recommended for non-English localization.
- Atomic structure: Foundations → Atoms → Molecules → Organisms → Templates → Flows.
- Guiding principles: clarity, efficiency, unified, delightful, human, purposeful.

All additional specifications in the package are independent implementation defaults and should be validated against your organization's current design policy.

## Source links

- https://design.aia.com/aia-qi-design-system
- https://design.aia.com/foundations
- https://design.aia.com/colour
- https://design.aia.com/grid-and-layout
- https://design.aia.com/spacing
- https://design.aia.com/typography
- https://design.aia.com/shadow
- https://design.aia.com/components
- https://design.aia.com/design-standards
- https://design.aia.com/blog/how-the-qi-design-system-became-aias-single-source-of-truth-across-18-markets

## Guidance for AI agents

Put `ai/AGENTS.md` and `tokens/tokens.json` in the coding agent's context before each generation. Save the machine-readable result as `design-contract.json` and review it before generating pages. A suggested order is:

`Approved BR → UI requirement mapping → Screen contract → High-fidelity mockups → Human approval → Production UI → Testing and release`

Example prompts and a suggested pull-only `design-systems/qi-inspired` repository structure are included, specifically to support the **Designs & Diagrams** feature in an AI-assisted SDLC editor extension.

## Accessibility and implementation caveats

- Focus styles, common semantic roles, keyboard tabs, escape-to-close modals, reduced motion and visible form labels are provided; **full WCAG conformance is not certified**. Test each finished interface with users and accessibility tools.
- The `claims-flow.html` example is a **client-side demonstration only**; it does not upload, send or store user data. Implement server-side validation, authentication, authorization, CSRF defenses, malware scanning and retention controls before using any real data.
- AIA Everest is not bundled. If your organization is entitled to use it, load its licensed font files separately from an approved source.
- Demo names/figures are fictional. Do not use as actual quotes, coverage, premium rates or personal records.
- The kit uses normal CSS/JS classes, not official Qi React/Angular/Vue packages.

## Verify

```bash
node tests/verify.js
# or
npm test
```

For full browser interaction and viewport checks, use a headless browser such as Chromium/Playwright, and test the application with your actual backend and assistive technology.

## License and notice

Original starter files in this package are MIT-licensed (see `LICENSE`). AIA, Qi, AIA Everest and other marks are the property of their respective owners. The reference website's content and proprietary artifacts are **not** relicensed or reproduced by this project. No affiliation or endorsement is implied.
