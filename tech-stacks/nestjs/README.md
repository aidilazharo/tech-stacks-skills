# NestJS 11 + TypeScript 5.9 — ATGV runnable scaffold

This scaffold is supplied by the catalog and copied to a **project** branch by ATGV. Install packages in the generated project directory, **not** in the catalog root.

```sh
npm ci --ignore-scripts
npm run db:migrate
npm test
npm run build
npm run dev
```
The tests run real task validation and HTTP/SQLite integration checks.





**macOS/Linux npm cache permission fallback (no sudo):**
```sh
mkdir -p "$HOME/.cache/atgv-npm"
npm_config_cache="$HOME/.cache/atgv-npm" npm ci --ignore-scripts
```

For Windows PowerShell, use `$env:npm_config_cache = Join-Path $HOME '.cache\atgv-npm'` before `npm ci --ignore-scripts`.
See `../../docs/STACK-READINESS.md` for preflight checks, Node constraints, and locked-install guidance.
The initial SQLite schema is an idempotent example rather than a production migration system.
