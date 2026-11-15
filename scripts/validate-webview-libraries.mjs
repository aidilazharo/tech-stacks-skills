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
 if(stat.isSymbolicLink()||!stat.isFile())throw Error('Invalid packaged webview library: '+item.path);
 const raw=await readFile(file);
 // Git on Windows may convert LF text assets (including license files) to CRLF.
 // Accept only the exact manifest-pinned bytes or their LF-normalized equivalent.
 const normalized=raw.includes(13)?Buffer.from(raw.toString('utf8').replace(/\r\n/g,'\n'),'utf8'):raw;
 const valid=[raw,normalized].some(data=>data.length===item.bytes&&crypto.createHash('sha256').update(data).digest('hex')===item.sha256);
 if(!valid)throw Error('SHA-256/length mismatch: '+item.path);
 total+=item.bytes;
}
console.log(`PASS webview libraries: ${seen.size} integrity-checked files (${total} bytes)`);
