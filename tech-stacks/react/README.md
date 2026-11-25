# React 19 + TypeScript — ATGV runnable scaffold

Install in the generated project, not the catalog root. Use a supported Node version from package.json and an organization-approved npm registry.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run dev
```

The base install includes React, Vite, TypeScript, Express, Drizzle, SQLite, Swagger and the existing cross-platform frontend/API launcher. Node's built-in test runner checks real React rendering and SQLite CRUD. No jsdom, XML parser, Vitest, or Testing Library is required.

Optional browser interactions and accessibility (not required by Save Stack):
```sh
npm run test:e2e:setup
npx playwright install chromium
npm run test:e2e
```
The setup installs the pinned browser test tools without changing the starter manifest or lock. Re-run setup after a clean npm ci if needed. Browser downloads and all packages remain subject to organizational security policy.

Existing edited application files are not overwritten; use ATGV's verified scaffold migration or review changes manually. On Windows close processes locking node_modules before retrying an install. See ../../docs/STACK-READINESS.md.
