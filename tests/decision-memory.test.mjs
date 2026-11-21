import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {nextVersion,requireIncrement,parts} from '../scripts/version-policy.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('strict increment with rollovers and upper bound',()=>{
 assert.equal(nextVersion('0.0.0'),'0.0.1');
 assert.equal(nextVersion('0.0.99'),'0.1.0');
 assert.equal(nextVersion('0.99.99'),'1.0.0');
 assert.equal(nextVersion('99.99.98'),'99.99.99');
 assert.throws(()=>nextVersion('99.99.99'),/Maximum/);
 for(const invalid of ['100.0.0','0.100.0','0.0.100','00.0.1','0.00.1'])assert.throws(()=>parts(invalid));
 assert.equal(requireIncrement('0.0.0','0.0.1'),'0.0.1');
 for(const invalid of ['0.0.0','0.0.2','0.1.0','99.99.99'])assert.throws(()=>requireIncrement('0.0.0',invalid));
});
test('decision memory categories are JSON, curated, and synced via catalog',()=>{
 const catalog=JSON.parse(readFileSync(join(root,'catalog.json'),'utf8'));
 assert.equal(catalog.version,readFileSync(join(root,'VERSION'),'utf8').trim());
 assert.equal(catalog.decisionMemory.distribution,'source-only');
 assert.equal(catalog.decisionMemory.manifest,'.memory/manifest.json');
 const manifest=JSON.parse(readFileSync(join(root,'.memory/manifest.json'),'utf8'));
 assert.ok(manifest.categories.length>=10);
 for(const item of manifest.categories){const entry=JSON.parse(readFileSync(join(root,item.path),'utf8'));assert.equal(entry.category,item.id);}
});

test('source-only decision memory matches archive export policy',()=>{
 const attrs=readFileSync(join(root,'.gitattributes'),'utf8');
 assert.match(attrs,/^\.memory export-ignore$/m);
 const memory=JSON.parse(readFileSync(join(root,'.memory/release-management.json'),'utf8'));
 assert.ok(memory.decisions.some(x=>x.id==='RELEASE-0002'&&x.status==='accepted'));
 const catalog=JSON.parse(readFileSync(join(root,'catalog.json'),'utf8'));
 assert.equal(catalog.decisionMemory.distribution,'source-only');
});
