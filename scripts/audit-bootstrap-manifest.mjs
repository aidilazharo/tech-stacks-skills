/**
 * Read-only diagnostic for an existing ATGV application checkout.
 * Usage: node scripts/audit-bootstrap-manifest.mjs "C:\\path\\to\\project"
 * This script never updates application files or their Git repository.
 */
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { resolve, join, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const catalogRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = resolve(process.argv[2] || '.');
const messages = [];
const failed = [];
const warnings = [];
const notice = (message) => messages.push(message);
const error = (message) => failed.push(message);
const warning = (message) => warnings.push(message);
const readJSON = (file) => JSON.parse(readFileSync(file, 'utf8'));
const safeRelative = (value) => typeof value === 'string' && value.length > 0 && value.length <= 450 &&
  !value.includes('\\') && !value.includes('\0') && !value.startsWith('/') &&
  !value.endsWith('/') && value.split('/').every((part) => part !== '' && part !== '.' && part !== '..' && /^[a-zA-Z0-9_.@-]+$/.test(part));

function walkFiles(folder, prefix = '') {
  const result = [];
  for (const dirent of readdirSync(folder, { withFileTypes: true })) {
    const rel = prefix ? prefix + '/' + dirent.name : dirent.name;
    // Local validation may have installed or built a scaffold. Generated
    // dependencies and output are not catalog source files.
    if (!prefix && ['node_modules', 'dist', '.angular', 'coverage', 'test-results', 'playwright-report', 'data'].includes(dirent.name)) continue;
    if (!safeRelative(rel)) throw Error('Unsafe scaffold file path: ' + rel);
    if (dirent.isSymbolicLink()) throw Error('Symlink in catalog scaffold: ' + rel);
    if (dirent.isDirectory()) result.push(...walkFiles(join(folder, dirent.name), rel));
    else if (dirent.isFile()) result.push(rel);
    else throw Error('Unsupported scaffold entry: ' + rel);
  }
  return result;
}

try {
  const markerPath = join(projectRoot, 'atgv.bootstrap.json');
  if (!existsSync(markerPath)) throw Error('No atgv.bootstrap.json exists in the chosen application directory.');
  const marker = readJSON(markerPath);
  const manifest = readJSON(join(catalogRoot, 'catalog.json'));
  const version = readFileSync(join(catalogRoot, 'VERSION'), 'utf8').trim();
  if (manifest.version !== version) error(`Catalog metadata mismatch: VERSION=${version}, catalog.json=${manifest.version}`);
  if (marker.schema !== 1 || marker.status !== 'draft') warning('The starter is not a schema-1 draft; automatic starter commit may be unavailable.');
  if (!Array.isArray(marker.stacks) || marker.stacks.length < 1 || marker.stacks.length > 2 || new Set(marker.stacks).size !== marker.stacks.length)
    throw Error('Invalid stacks selection in atgv.bootstrap.json.');
  notice('Project: ' + projectRoot);
  notice('Starter catalog version: ' + (marker.catalogVersion ?? '(not recorded)'));
  notice('Checked against catalog version: ' + version);
  if (marker.catalogVersion !== version) warning('Catalog has changed since this starter was generated. A new template snapshot may differ from the existing files.');
  const expected = new Map([['atgv.bootstrap.json', null]]);
  const descriptors = marker.stacks.map((id) => {
    if (!manifest.techStacks.includes(id) || !safeRelative(id)) throw Error('Unknown stack in starter manifest: ' + String(id));
    return readJSON(join(catalogRoot, 'tech-stacks', id, 'stack.json'));
  });
  for (const descriptor of descriptors) {
    const prefix = marker.stacks.length > 1 ? (descriptor.stackType === 'frontend' ? 'apps/web/' : 'services/api/') : '';
    const source = join(catalogRoot, 'tech-stacks', descriptor.id, 'scaffold');
    for (const item of walkFiles(source)) {
      const rel = prefix + item;
      if (expected.has(rel)) error('Overlapping scaffold file in selected stacks: ' + rel);
      expected.set(rel, readFileSync(join(source, ...item.split('/'))));
    }
  }
  if (!Array.isArray(marker.generatedFiles)) {
    warning('The starter has no generatedFiles list; ATGV will derive it from the active scaffold.');
  } else {
    const generated = marker.generatedFiles;
    if (!generated.length || !generated.includes('atgv.bootstrap.json')) error('Generated file list is empty or missing atgv.bootstrap.json.');
    if (new Set(generated).size !== generated.length) error('Generated file list contains duplicate entries.');
    for (const rel of generated) {
      if (!safeRelative(rel)) { error('Unsafe generated path: ' + JSON.stringify(rel)); continue; }
      if (!expected.has(rel)) error('Not in the active catalog scaffold: ' + rel);
      const target = join(projectRoot, ...rel.split('/'));
      if (!existsSync(target)) error('Generated file is missing from application checkout: ' + rel);
      else if (lstatSync(target).isSymbolicLink() || !lstatSync(target).isFile()) error('Generated file is not a normal file: ' + rel);
      else if (!realpathSync(target).startsWith(realpathSync(projectRoot) + sep)) error('Generated file resolves outside the project: ' + rel);
      else if (rel !== 'atgv.bootstrap.json' && expected.has(rel) && !readFileSync(target).equals(expected.get(rel)))
        error('Starter file differs from current catalog template: ' + rel + ' (could be an intentional edit or a catalog revision).');
    }
    notice('Recorded generated files: ' + generated.length);
    notice('Active scaffold paths (including manifest): ' + expected.size);
    const unrecorded = [...expected.keys()].filter((f) => !generated.includes(f));
    if (unrecorded.length) {
      warning('Active scaffold paths not recorded by this starter (' + unrecorded.length + '): ' + unrecorded.slice(0, 15).join(', ') +
        (unrecorded.length > 15 ? ', ...' : '') + '. This may be expected for preserved files or a later catalog revision.');
    }
  }
} catch (cause) {
  error(cause.message || String(cause));
}

for (const entry of messages) console.log('INFO', entry);
for (const entry of warnings) console.warn('WARN', entry);
for (const entry of failed) console.error('FAIL', entry);
if (failed.length) {
  console.error(`FAIL manifest audit: ${failed.length} problem(s), ${warnings.length} warning(s). No files changed.`);
  process.exitCode = 1;
} else {
  console.log(`PASS manifest structural audit: ${warnings.length} warning(s). No files changed.`);
  console.log('NOTE: Compared recorded starter files with the current catalog; a historical catalog revision may contain different file content.');
}
