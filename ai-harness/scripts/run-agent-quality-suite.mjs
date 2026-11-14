// Offline, read-only evaluator of synthetic agent quality fixtures. No network or AI execution.
import { readFileSync, writeFileSync } from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {evaluateAgent} from './evaluate-agent.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const suite=JSON.parse(readFileSync(join(root,'evals/agent-quality-suite.json'),'utf8'));
const results=[];
for(const scenario of suite.scenarios){
 const trace=JSON.parse(readFileSync(join(root,'evals/fixtures/agent-quality',scenario.file),'utf8'));
 const actual=evaluateAgent(trace);
 results.push({scenario:scenario.id,expected:scenario.expected,actual:actual.status,correct:actual.status===scenario.expected,checks:actual.checks});
}
const report={schema:1,suite:suite.id,version:suite.version,kind:'synthetic-trace-rule-evaluation',NOT_LIVE_AGENT_RESULT:true,summary:{total:results.length,correct:results.filter(r=>r.correct).length,incorrect:results.filter(r=>!r.correct).length},results};
const idx=process.argv.indexOf('--out');
if(idx>=0){if(!process.argv[idx+1])throw new Error('Expected output path after --out');writeFileSync(resolve(process.argv[idx+1]),JSON.stringify(report,null,2)+'\n');}
console.log('Agent Quality synthetic fixtures: '+report.summary.correct+'/'+report.summary.total+' expected outcomes detected; '+report.summary.incorrect+' mismatches.');
if(report.summary.incorrect)process.exitCode=1;
