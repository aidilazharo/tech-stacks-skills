import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..');
const harness=JSON.parse(readFileSync(join(root,'ai-harness/manifest.json'),'utf8'));
const selected=process.argv[2] ?? 'developer-tdd';
const memoryIndex=JSON.parse(readFileSync(join(root,'.memory/manifest.json'),'utf8'));
function decisionsFor(text){
 const query=String(text||'').toLowerCase(),entries=[];
 for(const entry of memoryIndex.categories){
  if(!/^[a-z][a-z0-9-]+$/.test(entry.id)||entry.path!=='.memory/'+entry.id+'.json')continue;
  const file=JSON.parse(readFileSync(join(root,entry.path),'utf8'));
  if(entry.id!=='versioning'&&!(file.keywords||[]).some(x=>query.includes(x)))continue;
  for(const decision of file.decisions||[])if(decision.status==='accepted')entries.push({category:entry.id,id:decision.id,decision:decision.decision});
 }
 return entries.slice(0,12);
}
const rel=harness.workflows[selected];
if(!rel){console.error('Unknown workflow: '+selected);process.exitCode=1;}
else {
  const w=JSON.parse(readFileSync(join(root,rel),'utf8'));
  const out={kind:'read-only-harness-plan',harness:{id:harness.id,version:harness.version},workflow:selected,agent:w.agent,repositoryDecisions:decisionsFor(selected),steps:w.steps.map(x=>x.id),skillChoices:Object.keys(harness.skills),execution:'requires ATGV harness adapter; no AI or tools executed'};
  console.log(JSON.stringify(out,null,2));
}
