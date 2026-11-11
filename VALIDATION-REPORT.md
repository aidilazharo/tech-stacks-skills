# Catalog 1.1.3 — local verification report

Date: 2026-11-11

## Passed offline checks

- All 24 JSON files parse successfully.
- Catalog `VERSION`, catalog manifest, and the five stack descriptors agree.
- npm script references and advertised testing dependencies pass `node scripts/validate-catalog.mjs`.
- All shipped `.mjs` files pass `node --check`.
- Existing NestJS static test passes with Node's built-in test runner.
- Spring Boot POM parses as XML.
- React TypeScript entry and Angular Vitest target exist; Playwright test files exist for React and Angular.

## Checks not possible here

The build environment cannot reach `registry.npmjs.org`; npm package installation, package-lock generation, TypeScript compilation, Angular/NestJS integration tests and Playwright browser tests were **not run**. .NET and Maven toolchains were not installed here. The catalog is structurally validated, **not certified to compile/run** until tests are executed in an approved connected environment.

## Remaining release gates

1. Generate complete npm lockfiles in React, Angular and NestJS scaffolds using a connected registry and commit them.
2. Execute `npm ci`, `npm test`, `npm run build` (and browser e2e for frontend stacks) using supported Node versions.
3. Execute `dotnet restore && dotnet test && dotnet build`, and `mvn test && mvn package`.
4. Verify the consuming ATGV extension handles a writable npm cache, final install exit codes, and TDD readiness. These behaviors are not controlled by the catalog alone.
