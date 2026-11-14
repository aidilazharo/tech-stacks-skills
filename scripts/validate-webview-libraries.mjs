import {readFile, lstat} from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const base=path.join(root,'shared','libraries','webview');
const manifest=JSON.parse(await readFile(path.join(base,'manifest.json'),'utf8'));
if(manifest.schema!==1||manifest.id!=='atgv-approved-webview-libraries'||!Array.isArray(manifest.assets)||manifest.assets.length!==21)throw Error('Invalid webview asset manifest');
const seen=new Set();let total=0;
for(const item of manifest.assets){
 if(typeof item.path!=='string'||!item.path||item.path.startsWith('/')||item.path.includes('\\')||item.path.split('/').some(x=>!x||x==='.'||x==='..')||seen.has(item.path))throw Error('Unsafe or duplicate library path');
 seen.add(item.path);
 const file=path.join(base,'assets',...item.path.split('/')),stat=await lstat(file);
 if(stat.isSymbolicLink()||!stat.isFile()||stat.size!==item.bytes)throw Error('Invalid packaged webview library: '+item.path);
 const actual=crypto.createHash('sha256').update(await readFile(file)).digest('hex');
 if(actual!==item.sha256)throw Error('SHA-256 mismatch: '+item.path);
 total+=stat.size;
}
console.log(`PASS webview libraries: ${seen.size} integrity-checked files (${total} bytes)`);
