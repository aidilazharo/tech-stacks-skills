import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const root=join(import.meta.dirname,'..');
test('one current RELEASE.md matches Library VERSION',()=>{
 const version=readFileSync(join(root,'VERSION'),'utf8').trim();
 const catalog=JSON.parse(readFileSync(join(root,'catalog.json'),'utf8'));
 assert.equal(catalog.version,version);
 assert.equal(version,'0.0.0');
 const docs=readdirSync(root).filter(x=>/^RELEASE(?:[_-].+)?\.md$/i.test(x));
 assert.deepEqual(docs,['RELEASE.md']);
 assert.match(readFileSync(join(root,'RELEASE.md'),'utf8'),new RegExp('v'+version.replaceAll('.','\.')));
});
