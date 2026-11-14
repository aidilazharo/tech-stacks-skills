import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..');
const harness=JSON.parse(readFileSync(join(root,'ai-harness/manifest.json'),'utf8'));
const selected=process.argv[2] ?? 'developer-tdd';
const rel=harness.workflows[selected];
if(!rel){console.error('Unknown workflow: '+selected);process.exitCode=1;}
else {
  const w=JSON.parse(readFileSync(join(root,rel),'utf8'));
  const out={kind:'read-only-harness-plan',harness:{id:harness.id,version:harness.version},workflow:selected,agent:w.agent,steps:w.steps.map(x=>x.id),skillChoices:Object.keys(harness.skills),execution:'requires ATGV harness adapter; no AI or tools executed'};
  console.log(JSON.stringify(out,null,2));
}
