# React 19 + TypeScript 5.9 — ATGV runnable scaffold

This scaffold is supplied by the catalog and copied to a **project** branch by ATGV. Install packages in the generated project directory, **not** in the catalog root.

```sh
npm install
npm run db:migrate
npm test
npm run build
npm run dev
```
Browser E2E + axe accessibility checks require a browser install once per machine:
```sh
npx playwright install chromium
npm run test:e2e
```

**macOS/Linux npm cache permission fallback (no sudo):**
```sh
mkdir -p "$HOME/.cache/atgv-npm"
npm_config_cache="$HOME/.cache/atgv-npm" npm install
```

For Windows PowerShell, use `$env:npm_config_cache = Join-Path $HOME '.cache\atgv-npm'` before `npm install`.
See `../../docs/STACK-READINESS.md` for preflight checks, Node constraints, and lockfile-generation instructions.
The initial SQLite schema is an idempotent example rather than a production migration system.
