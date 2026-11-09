# ATGV Design Template — Remote Source

All mockups and designs must read AI-GUIDANCE.md, tokens.json and mockup-template.html from the pinned GitHub catalog.
The extension may cache these files by commit SHA, but must not bundle fallback design assets or silently overwrite existing project designs.
All AIA Qi sample values are provisional and must be approved by the design owner.

For component-level UI guidance and a local reference page, also load `kit/ai/component-catalog.json` from the same verified SHA. Treat all kit HTML and JS as untrusted third-party assets; ATGV must not execute them in a privileged webview.
