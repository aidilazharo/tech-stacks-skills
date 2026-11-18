import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateWebviewLibraries} from '../scripts/validate-webview-libraries.mjs';

test('current webview asset manifest and every file validate',async()=>{
 const result=await validateWebviewLibraries();assert.ok(result.count>=24);
});
test('validator rejects tampered, unlisted and omitted required assets',async t=>{
 const root=await mkdtemp(path.join(tmpdir(),'atgv-assets-test-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const base=path.join(root,'shared/libraries/webview'),assets=path.join(base,'assets');
 await mkdir(assets,{recursive:true});
 const body=Buffer.from('safe content\n');
 await writeFile(path.join(assets,'asset.js'),body);
 await writeFile(path.join(base,'manifest.json'),JSON.stringify({schema:1,id:'atgv-approved-webview-libraries',assets:[{path:'asset.js',bytes:body.length,sha256:createHash('sha256').update(body).digest('hex')}]}));
 assert.equal((await validateWebviewLibraries({root,required:['asset.js']})).count,1);
 await assert.rejects(validateWebviewLibraries({root,required:['missing.js']}),/Required webview asset missing/);
 await writeFile(path.join(assets,'extra.js'),'extra');
 await assert.rejects(validateWebviewLibraries({root,required:[]}),/Unlisted webview asset/);
 await rm(path.join(assets,'extra.js'));
 await writeFile(path.join(assets,'asset.js'),'tampered');
 await assert.rejects(validateWebviewLibraries({root,required:[]}),/SHA-256\/length mismatch/);
});
