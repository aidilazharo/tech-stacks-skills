const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(base, p), 'utf8');
const files = ['README.md','LICENSE','NOTICE.md','css/qi.css','js/qi.js','tokens/tokens.json','ai/AGENTS.md','ai/design-contract.schema.json','ai/design-contract.example.json','docs/index.html','examples/insurance-dashboard.html','examples/claims-flow.html'];
for (const f of files) assert.ok(fs.existsSync(path.join(base, f)), `Missing ${f}`);
const tokens = JSON.parse(read('tokens/tokens.json'));
const schema = JSON.parse(read('ai/design-contract.schema.json'));
const example = JSON.parse(read('ai/design-contract.example.json'));
assert.equal(tokens.grid.columns, 12);
assert.equal(tokens.spacePx['1'], 4);
assert.equal(tokens.status, 'unofficial-original-implementation');
assert.equal(example.designSystem.official, false);
for (const k of schema.required) assert.ok(k in example, `Design contract missing ${k}`);
for (const screen of example.screens) for (const k of schema.properties.screens.items.required) assert.ok(k in screen, `${screen.id}: missing ${k}`);
const css = read('css/qi.css');
for (let col = 1; col <= 12; col++) assert.ok(css.includes(`.qi-col-${col}{`), `Missing column ${col}`);
for (const key of ['--qi-color-primary','--qi-color-bg','--qi-color-focus','--qi-space-4','.qi-btn-primary','.qi-modal-backdrop','.qi-accordion-trigger','.qi-table']) assert.ok(css.includes(key), `Missing ${key}`);
for (const p of ['docs/index.html','examples/insurance-dashboard.html','examples/claims-flow.html']) {
  const html = read(p);
  assert.ok(html.includes('meta name="viewport"'), `${p} missing viewport`);
  assert.ok(html.includes('qi.css'), `${p} missing CSS`);
  assert.ok(html.includes('qi.js'), `${p} missing JS`);
  assert.ok(!html.includes('https://fonts.'), `${p} includes remote fonts`);
}
assert.ok(read('js/qi.js').includes('function closeModal'));
assert.ok(read('README.md').includes('not the official AIA Qi Design System'));
console.log(`OK — ${files.length} critical files, foundation tokens, 12 grid columns, contract shape and standalone HTML checked.`);
