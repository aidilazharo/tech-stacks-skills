# BA-to-mockup and production UI prompt

**Input:** [Approved business requirement text, user persona(s), relevant Jira ticket, channel, target stack, localization, approval status]

Create the following in order using `ai/AGENTS.md` and `tokens/tokens.json`:

1. **Requirement mapping:** convert business requirement(s) into user tasks, page routes, navigation, form fields, permissions, validations, data objects and success/error/empty cases. Link each UI element to a requirement ID.
2. **Screen specification:** populate the schema in `ai/design-contract.schema.json`; declare screens, actions, states, dependencies and device targets.
3. **High-fidelity mockup:** create complete responsive HTML for each required screen using the `qi-` classes. Render all screens as separate discoverable pages or tabs; use realistic but fictional labelled data. Do not make one screenshot serve as the full design.
4. **Review gates:** show each design individually, list assumptions and open questions; require explicit human approval before treating the design as final.
5. **Production implementation:** after approval, reuse the approved structure and tokens in the chosen frontend stack. Add API contracts, state management, error handling, a11y verification and tests. Do not represent placeholder or demo APIs as production integrations.
6. **Handoff:** produce source, component inventory, visual regression evidence at 375/768/1024/1440, traceability report, design-token exceptions and a list of human approvals.

Required design output: `design-contract.json`, `screen-inventory.md`, `mockups/*.html`, and an implementation plan. For production output, also provide tested components and API/data contracts.

UX constraints: one prominent primary action per decision area; compact content-driven layout; semantic red sparingly; 4px spacing units; 12-column grid; labels and inline help; meaningful empty/error/loading states; keyboard and screen-reader support; avoid arbitrary re-styling.

If a genuine official Qi source package becomes available, prefer it over this starter and record component migrations and approvals. Do not pull external proprietary design assets without authorization.
