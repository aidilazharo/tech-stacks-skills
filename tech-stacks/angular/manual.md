# Angular — Access & Testing Manual

| Component | Location / command |
|---|---|
| Frontend | http://127.0.0.1:4200/ |
| REST API health | `curl -i http://127.0.0.1:3001/api/health` |
| REST CRUD | `curl -i http://127.0.0.1:3001/api/tasks` |
| OpenAPI | http://127.0.0.1:3001/api/docs |
| ORM | Drizzle ORM / `server/index.mjs` |
| Database | SQLite / `data/app.db` (created on first run) |
| Query | `sqlite3 data/app.db "SELECT id,title,status FROM tasks;"` |
| Init schema | `npm run db:migrate` |
| Tests | `npm test` |
| Build | `npm run build` |

The SQLite database is **local only** and is excluded from Git.

## Catalog 1.1.3 test commands

- `npm test` — Vitest UI unit + Node SQLite API tests
- `npx playwright install chromium` — one-time browser setup
- `npm run test:e2e` — Playwright smoke + axe-core accessibility audit
- `npm run build` — compile scaffold
- `npm_config_cache="$HOME/.cache/atgv-npm" npm install` — macOS/Linux fallback when the default npm cache is not writable
