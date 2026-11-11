import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJSON = (relative) => JSON.parse(readFileSync(join(root, relative), 'utf8'));
const errors = [];
const warn = [];
const assert = (ok, message) => { if (!ok) errors.push(message); };
const catalog = readJSON('catalog.json');
const version = readFileSync(join(root, 'VERSION'), 'utf8').trim();
assert(catalog.version === version, 'catalog.json and VERSION mismatch');

for (const id of catalog.techStacks) {
  const base = `tech-stacks/${id}`;
  const cfg = readJSON(`${base}/stack.json`);
  assert(cfg.id === id, `${id}: metadata id mismatch`);
  for (const entry of [cfg.scaffold, cfg.accessManual]) assert(existsSync(join(root, base, entry)), `${id}: missing ${entry}`);
  if (['react', 'angular', 'nestjs'].includes(id)) {
    const scaffold = `${base}/scaffold`;
    const pkg = readJSON(`${scaffold}/package.json`);
    for (const [key, scriptName] of [['test', cfg.testCommand], ['build', cfg.buildCommand], ['run', cfg.runCommand], ['e2e', cfg.e2eCommand]]) {
      if (scriptName) {
        assert(scriptName.startsWith('npm run ') || scriptName === 'npm test', `${id}: unexpected ${key} command`);
        const name = scriptName === 'npm test' ? 'test' : scriptName.slice('npm run '.length);
        assert(Boolean(pkg.scripts[name]), `${id}: missing npm script ${name}`);
      }
    }
    const dev = pkg.devDependencies ?? {};
    const all = { ...pkg.dependencies, ...dev };
    for (const unit of cfg.unit ?? []) {
      if (/Vitest/i.test(unit)) assert(Boolean(dev.vitest), `${id}: missing vitest`);
      if (/Testing Library/i.test(unit)) assert(Boolean(all['@testing-library/react']), `${id}: missing @testing-library/react`);
    }
    if (cfg.e2e?.includes('Playwright')) {
      assert(Boolean(dev['@playwright/test']), `${id}: missing Playwright dependency`);
      assert(existsSync(join(root, `${scaffold}/e2e/smoke.spec.ts`)), `${id}: missing Playwright smoke test`);
      assert(Boolean(dev['@axe-core/playwright']), `${id}: missing @axe-core/playwright`);
    }
    if (!existsSync(join(root, `${scaffold}/package-lock.json`))) warn.push(`${id}: lockfile absent (generate via npm registry before CI use)`);
  }
}
const react = readJSON('tech-stacks/react/stack.json');
assert(react.language === 'TypeScript', 'React language should be TypeScript');
assert(existsSync(join(root, 'tech-stacks/react/scaffold/src/main.tsx')), 'React main.tsx missing');
assert(!existsSync(join(root, 'tech-stacks/react/scaffold/src/main.jsx')), 'Stale React JSX entry exists');
const ng = readJSON('tech-stacks/angular/scaffold/angular.json');
assert(Boolean(ng.projects?.['atgv-app']?.architect?.test), 'Angular test builder missing');

for (const message of warn) console.warn('WARN', message);
for (const message of errors) console.error('FAIL', message);
if (errors.length) { console.error(`${errors.length} catalog validation failure(s)`); process.exitCode = 1; }
else console.log(`PASS catalog ${version}: ${catalog.techStacks.length} stack descriptors, ${warn.length} lockfile warning(s)`);
