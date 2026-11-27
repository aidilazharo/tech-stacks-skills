# Technology-stack prerequisites & ATGV readiness

Catalog version: **0.0.11** (see root `VERSION` for the authoritative release). Work in a **generated project's scaffold directory** when running npm commands, not the catalog root.

| Stack | Prerequisite | Install | Test | Build | Run | Browser E2E |
| --- | --- | --- | --- | --- | --- | --- |
| React 19 | Node 22.22.3+, or supported 24/26 | `npm ci --ignore-scripts` | `npm test` | `npm run build` | `npm run dev` | `npm run test:e2e` |
| Angular 22 | Node ^22.22.3 / ^24.15 / ^26; TypeScript 6.0.x | `npm ci --ignore-scripts` | `npm test` | `npm run build` | `npm run dev` | `npm run test:e2e` |
| NestJS 11 | Node 22.12+ | `npm ci --ignore-scripts` | `npm test` | `npm run build` | `npm run dev` | Not configured |
| .NET 10 | .NET SDK 10 | `dotnet restore` | `dotnet test tests/Atgv.Tests/Atgv.Tests.csproj` | `dotnet build` | `dotnet run` | Not configured |
| Spring Boot 3.5 | Java 25, Maven | `mvn dependency:resolve` | `mvn test` | `mvn package` | `mvn spring-boot:run` | Not configured |

## npm cache permissions on Apple Silicon and other systems

ATGV may report **"Default npm cache is not writable; retrying with a private ATGV cache"**. That message is an automatic retry, **not** proof that a stack is incomplete or that npm failed. Do not use `sudo npm install` or recursively chown arbitrary system directories.

```sh
mkdir -p "$HOME/.cache/atgv-npm"
npm_config_cache="$HOME/.cache/atgv-npm" npm ci --ignore-scripts
npm_config_cache="$HOME/.cache/atgv-npm" npm test
```

Windows PowerShell:

```powershell
$env:npm_config_cache = Join-Path $HOME '.cache\atgv-npm'
New-Item -ItemType Directory -Force -Path $env:npm_config_cache | Out-Null
npm ci --ignore-scripts
npm test
```

The **catalog** cannot force a cache choice in a running VS Code extension. The extension's installer needs to pass its own writable `npm_config_cache` environment to child npm processes and show the final exit code and install log. This catalog provides the correct fallback commands.

## Lockfiles and secure reproducibility

The React, Angular and NestJS scaffolds include npm lockfiles. Use `npm ci --ignore-scripts` for reproducible installs; do not commit `node_modules` or generated database files. Update and review the lockfile when dependencies change.

## Browser readiness

React and Angular implement separate UI, API and browser checks. React browser-test packages are opt-in: run `npm run test:e2e:setup` in the React project before installing Chromium. React's mandatory `npm test` uses the Node test runner, not jsdom. One-time browser installation:

```sh
npx playwright install chromium
npm run test:e2e
```

Browser downloads must follow organizational proxy policy. The smoke tests start both API and frontend through Playwright's webServer config and run a serious/critical axe audit.

## Quick validation (offline)

Run from the catalog root: `node scripts/validate-catalog.mjs`.
This checks file references, runnable command names, TypeScript/JSX alignment, and frameworks declared in stack metadata. It **does not** compile uninstalled dependencies or validate against a live package registry. All stacks need an environment with approved dependencies to run build and tests.
