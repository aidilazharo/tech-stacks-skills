# NestJS — Access & Testing Manual

1. `npm install` and `npm run db:migrate` initialize SQLite `data/app.db`.
2. `npm run dev` serves API at http://127.0.0.1:3000.
3. `curl http://127.0.0.1:3000/api/health` verifies the API.
4. Open http://127.0.0.1:3000/api/docs for Swagger UI.
5. `curl -i http://127.0.0.1:3000/api/tasks` lists saved tasks.
6. `sqlite3 data/app.db "SELECT id,title,status FROM tasks;"` queries SQLite.
7. `npm test` and `npm run build` verify source and compile types.

ORM: Drizzle + libSQL SQLite driver. Upgrade starter tests to live DB integration tests before production.

## Catalog 1.1.3 test commands

- `npm test` — Vitest unit + Supertest SQLite API integration
- `npm run build` — compile scaffold
- `npm_config_cache="$HOME/.cache/atgv-npm" npm install` — macOS/Linux fallback when the default npm cache is not writable
