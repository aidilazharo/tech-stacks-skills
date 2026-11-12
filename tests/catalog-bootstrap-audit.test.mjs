import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const script = join(root, 'scripts', 'audit-bootstrap-manifest.mjs');
const testBody = readFileSync(join(root, 'tech-stacks', 'react', 'scaffold', 'server', 'api.test.mjs'));
const starter = (additional = {}) => ({
  schema: 1, stacks: ['react'], source: 'github-main-catalog',
  catalogVersion: '1.1.6', templateDigest: 'sample', status: 'draft',
  generatedFiles: ['atgv.bootstrap.json', 'server/api.test.mjs'], ...additional,
});
function project(marker, { testFile = testBody } = {}) {
  const temp = mkdtempSync(join(tmpdir(), 'atgv-catalog-audit-'));
  mkdirSync(join(temp, 'server'));
  const file = join(temp, 'atgv.bootstrap.json');
  writeFileSync(file, JSON.stringify(marker, null, 2));
  writeFileSync(join(temp, 'server', 'api.test.mjs'), testFile);
  return { temp, file };
}
function audit(folder) {
  return spawnSync(process.execPath, [script, folder], { encoding: 'utf8' });
}

test('matching generated scaffold paths pass without writing into project', (t) => {
  const state = project(starter());
  t.after(() => rmSync(state.temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }));
  const before = readFileSync(state.file);
  const outcome = audit(state.temp);
  assert.equal(outcome.status, 0, outcome.stderr);
  assert.match(outcome.stdout, /PASS manifest structural audit/);
  assert.deepEqual(readFileSync(state.file), before);
});

test('unrecognized generated file is detected with exact relative name', (t) => {
  const state = project(starter({ generatedFiles: ['atgv.bootstrap.json', 'unknown.txt'] }));
  t.after(() => rmSync(state.temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }));
  const outcome = audit(state.temp);
  assert.equal(outcome.status, 1);
  assert.match(outcome.stderr, /Not in the active catalog scaffold: unknown.txt/);
});

test('duplicate and unsafe generated paths are rejected', (t) => {
  const state = project(starter({ generatedFiles: ['atgv.bootstrap.json', 'atgv.bootstrap.json', '../outside.txt'] }));
  t.after(() => rmSync(state.temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }));
  const outcome = audit(state.temp);
  assert.equal(outcome.status, 1);
  assert.match(outcome.stderr, /duplicate entries/);
  assert.match(outcome.stderr, /Unsafe generated path/);
});

test('content drift is reported without overwriting files', (t) => {
  const edited = Buffer.from('console.log("legitimate user edits");\n');
  const state = project(starter(), { testFile: edited });
  t.after(() => rmSync(state.temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }));
  const outcome = audit(state.temp);
  assert.equal(outcome.status, 1);
  assert.match(outcome.stderr, /differs from current catalog template: server\/api.test.mjs/);
  assert.deepEqual(readFileSync(join(state.temp, 'server', 'api.test.mjs')), edited);
});

test('catalog revision drift is a warning, not a silent repair', (t) => {
  const state = project(starter({ catalogVersion: '1.1.4' }));
  t.after(() => rmSync(state.temp, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 }));
  const outcome = audit(state.temp);
  assert.equal(outcome.status, 0, outcome.stderr);
  assert.match(outcome.stderr, /Catalog has changed since this starter was generated/);
});
