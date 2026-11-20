import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root=join(import.meta.dirname,'..');
test('one current RELEASE.md matches Library VERSION',()=>{
 const version=readFileSync(join(root,'VERSION'),'utf8').trim();
 const catalog=JSON.parse(readFileSync(join(root,'catalog.json'),'utf8'));
 assert.equal(catalog.version,version);
 assert.match(version,/^[0-9]+\.[0-9]+\.[0-9]+$/);
 const docs=readdirSync(root).filter(x=>/^RELEASE(?:[_-].+)?\.md$/i.test(x));
 assert.deepEqual(docs,['RELEASE.md']);
 assert.match(readFileSync(join(root,'RELEASE.md'),'utf8'),new RegExp('v'+version.replaceAll('.','\.')));
});

test('unreferenced design previews and Finder metadata are absent',()=>{
 for(const p of ['.DS_Store','shared/.DS_Store',
  'shared/design-systems/aia-qi/kit/previews/component-guide.png',
  'shared/design-systems/aia-qi/kit/previews/dashboard-desktop.png',
  'shared/design-systems/aia-qi/kit/previews/dashboard-mobile.png']){
  assert.equal(existsSync(join(root,p)),false,p);
 }
 const checksums=readFileSync(join(root,'shared/design-systems/aia-qi/kit/SHA256SUMS.txt'),'utf8');
 assert.doesNotMatch(checksums,/\.\/previews\//);
});
