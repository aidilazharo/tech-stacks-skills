# ATGV SDLC Library v0.0.10

- Reduce mandatory React starter dependencies: remove jsdom, xmlchars/saxes chain, Vitest and Testing Library; move Playwright/axe to explicit pinned optional setup.
- Retain React/Vite/TypeScript, Express, Drizzle, SQLite, Swagger and the existing cross-platform launcher; replace mandatory DOM tests with real React render and SQLite API tests using Node's test runner.
- Keep interactive browser checks in optional Playwright suite; fix stale smoke heading and add health/UI interaction coverage.
- Prune the existing npm lockfile to the remaining dependency graph and update metadata and instructions. No registry bypass or security policy changes.
- Structural source and lock checks completed; live npm install, compile and Windows server validation still required.
