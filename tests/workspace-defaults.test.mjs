import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=new URL('../',import.meta.url);
const read=async file=>fs.readFile(new URL(file,root),'utf8');
test('Library v0.0.7 exposes git-tracked shared defaults without executable templates',async()=>{
 const catalog=JSON.parse(await read('catalog.json'));
 const version=(await read('VERSION')).trim();
 assert.equal(version,'0.0.7');assert.equal(catalog.version,version);
 assert.equal(catalog.workspaceDefaults.sdlc,'sdlc');
 assert.equal(catalog.workspaceDefaults.templates,'templates');
 assert.equal(catalog.workspaceDefaults.allowRemoteExecution,false);
 for(const [dir,expected] of [['sdlc/processes',6],['sdlc/roles',5],['sdlc/workflows',2],['templates',14]]){
  const entries=await fs.readdir(new URL(dir+'/',root),{withFileTypes:true});
  assert.equal(entries.filter(e=>e.isFile()).length,expected,dir);
  assert.ok(entries.every(e=>e.isFile()&&!e.isSymbolicLink()),dir);
 }
});
