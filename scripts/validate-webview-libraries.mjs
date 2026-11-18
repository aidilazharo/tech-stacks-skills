import {readFile, lstat, readdir} from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const defaultRoot=path.resolve(import.meta.dirname,'..');
const requiredAssets=['codemirror/lib/codemirror.js','codemirror/lib/codemirror.css','quill/quill.js','quill/quill.snow.css','frappe-gantt/frappe-gantt.umd.js','sortablejs/sortablejs-1.15.7.min.js'];
export async function validateWebviewLibraries({root=defaultRoot,required=requiredAssets}={}){
 const base=path.join(root,'shared','libraries','webview');
 const manifest=JSON.parse(await readFile(path.join(base,'manifest.json'),'utf8'));
 if(manifest.schema!==1||manifest.id!=='atgv-approved-webview-libraries'||!Array.isArray(manifest.assets)||!manifest.assets.length)throw Error('Invalid webview asset manifest');
 const seen=new Set();let total=0;
 for(const item of manifest.assets){
  if(typeof item.path!=='string'||!item.path||item.path.startsWith('/')||item.path.includes('\\')||item.path.split('/').some(x=>!x||x==='.'||x==='..')||seen.has(item.path))throw Error('Unsafe or duplicate library path');
  if(!Number.isSafeInteger(item.bytes)||item.bytes<1||!/^[a-f0-9]{64}$/.test(String(item.sha256||'')))throw Error('Invalid asset metadata: '+item.path);
  seen.add(item.path);
  const file=path.join(base,'assets',...item.path.split('/')),stat=await lstat(file);
  if(stat.isSymbolicLink()||!stat.isFile())throw Error('Invalid packaged webview library: '+item.path);
  const raw=await readFile(file);
  // Git on Windows may convert LF text assets to CRLF. Only a pinned exact
  // match, or the same text after LF normalization, is accepted.
  const normalized=raw.includes(13)?Buffer.from(raw.toString('utf8').replace(/\r\n/g,'\n'),'utf8'):raw;
  if(![raw,normalized].some(data=>data.length===item.bytes&&crypto.createHash('sha256').update(data).digest('hex')===item.sha256))throw Error('SHA-256/length mismatch: '+item.path);
  total+=item.bytes;
 }
 for(const name of required)if(!seen.has(name))throw Error('Required webview asset missing from manifest: '+name);
 async function walk(dir,prefix=''){
  for(const entry of await readdir(dir,{withFileTypes:true})){
   const relative=prefix?prefix+'/'+entry.name:entry.name;
   if(entry.isSymbolicLink())throw Error('Symbolic link in webview assets: '+relative);
   if(entry.isDirectory())await walk(path.join(dir,entry.name),relative);
   else if(!entry.isFile()||!seen.has(relative))throw Error('Unlisted webview asset: '+relative);
  }
 }
 await walk(path.join(base,'assets'));
 return {count:seen.size,total};
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 const {count,total}=await validateWebviewLibraries();
 console.log(`PASS webview libraries: ${count} integrity-checked files (${total} bytes)`);
}
