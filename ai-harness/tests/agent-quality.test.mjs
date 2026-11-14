import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {evaluateAgent} from '../scripts/evaluate-agent.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '..','..');
const json=p=>JSON.parse(readFileSync(join(root,p),'utf8'));
const suite=json('ai-harness/evals/agent-quality-suite.json');
const path=s=>'ai-harness/evals/fixtures/agent-quality/'+s.file;
test('catalog defines four user failure modes and six complementary agent checks',()=>{
 assert.deepEqual(suite.categories.slice(0,4).map(c=>c.id),['context','tools','loop','governance']);
 assert.equal(suite.categories.length,10);
 assert.equal(suite.policy.executeModel,false);
 assert.equal(suite.policy.executeRepositoryCode,false);
});
for(const s of suite.scenarios){
 test('agent trace fixture: '+s.id+' -> '+s.expected,()=>{
  const result=evaluateAgent(json(path(s)));
  assert.equal(result.status,s.expected);
  if(s.check) assert.equal(result.checks.find(c=>c.id===s.check).status,s.expected);
  assert.equal(result.checks.length,suite.categories.length);
  assert.equal(result.source,'trace-contract-only');
 });
}
test('fail-closed invalid trace and no silent unknown schema',()=>{
 assert.throws(()=>evaluateAgent({schema:1,runId:'x',agentId:'a'}),/Missing trace field/);
 const good=json(path(suite.scenarios[0])); good.schema=2;
 assert.throws(()=>evaluateAgent(good),/Invalid schema/);
});

test('incomplete nested evidence fails closed instead of producing a pass',()=>{
 const good=json(path(suite.scenarios[0]));
 delete good.context.used;
 assert.throws(()=>evaluateAgent(good),/Missing\/invalid trace array: context.used/);
 const other=json(path(suite.scenarios[0]));
 delete other.tdd.lockedTestsModified;
 assert.throws(()=>evaluateAgent(other),/Missing\/invalid trace flag: tdd.lockedTestsModified/);
});
