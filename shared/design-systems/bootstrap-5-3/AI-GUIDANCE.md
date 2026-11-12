# Bootstrap v5.3 — AI Design Guidance

Source: tech-stacks-skills/main. Framework: official Bootstrap 5.3.6 compiled CSS/JavaScript, MIT license, version-pinned by ATGV catalog SHA.

## Layout
- Use Bootstrap 5.3 semantic HTML, `.container`/`.container-fluid`, `.row`, `.col-*`, responsive breakpoint classes and spacing utilities.
- Build mobile-first, responsive screens that adapt at sm 576, md 768, lg 992, xl 1200 and xxl 1400 CSS pixels.
- Use Bootstrap v5.3 color tokens (`--bs-*`) and `data-bs-theme="light|dark"`; do not import AIA Qi tokens or `.qi-*` classes.
- Respect WCAG keyboard controls, labels, focus visibility, contrast, reduced motion and screen reader feedback. Prefer semantic elements.

## Components
- Reference the activated catalog file `kit/ai/component-catalog.json` for approved Bootstrap class names, roles, behavior and states.
- Use standard Bootstrap components: buttons, form inputs, cards, tables, navbars, tabs, modals, alerts, toasts, accordion, offcanvas, progress, placeholders, dropdowns.
- JS-dependent components need Bootstrap bundle and correct `data-bs-*` attributes; do not assume they function from markup alone.
- Include explicit loading, validation, empty and error states for interactive flows.

## Assets
- Offline CSS: `kit/css/bootstrap.min.css`; JavaScript plugins: `kit/js/bootstrap.bundle.min.js`.
- Pin both to 5.3.6 and include the MIT LICENSE. Do not load public CDN scripts into ATGV's privileged VS Code webview.
- This catalogue is AI reference material; only trusted generated application outputs should run Bootstrap JavaScript in their own isolated environment.

## Output
- For every screen, provide user flow, wireframe, responsive screen mockup, interactive prototype and developer handoff with required components and behaviors.
- Record selected framework ID `bootstrap-5-3`, catalogue revision and toolkit version in output metadata.
