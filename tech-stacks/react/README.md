# React + REST API + Drizzle ORM + SQLite

This **remote-only** skeleton is copied from the verified GitHub catalog, not from VS Code extension source. API and frontend share one npm project for one-click bootstrap.

- `npm install` (review dependencies before executing)
- `npm run db:migrate` — create `data/app.db`
- `npm run dev` — frontend and REST API
- `npm test` — SQLite CRUD integration test
- `npm run build` — production frontend
- API `http://127.0.0.1:3001/api/health`, Swagger `http://127.0.0.1:3001/api/docs`
- SQLite `sqlite3 data/app.db "SELECT * FROM tasks;"`

For production, replace the starter's idempotent SQL initializer with versioned migrations and add authentication, role authorization, audit logging and CI checks.
