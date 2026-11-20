import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { readFileSync } from 'node:fs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..');
const j=(f)=>JSON.parse(readFileSync(join(root,f),'utf8'));
test('harness validates with no network access',()=>{
  const result=execFileSync(process.execPath,[join(root,'ai-harness/scripts/validate.mjs')],{encoding:'utf8'});
  assert.match(result,/AI harness validation OK/);
});
test('developer workflow protects TDD and preview',()=>{
 const w=j('ai-harness/workflows/developer-tdd.json');
 assert.equal(w.tdd.lockedTestsImmutable,true);
 assert.equal(w.tdd.previewCountsAsGreen,false);
 assert.equal(w.execution.catalogScriptsAutoExecute,false);
 assert.ok(w.steps.some(s=>s.id==='repair-if-needed'));
});
test('read-only plan reflects manifest and TDD workflow',()=>{
 const raw=execFileSync(process.execPath,[join(root,'ai-harness/scripts/plan.mjs'),'developer-tdd'],{encoding:'utf8'});
 const plan=JSON.parse(raw);assert.equal(plan.kind,'read-only-harness-plan');
 assert.equal(plan.harness.version,'0.3.0');assert.ok(plan.steps.includes('verify'));
});
test('404 evaluation requires real endpoint checks and preserves locked tests',()=>{
 const e=j('ai-harness/evals/http-create-404.json');
 assert.equal(e.failure.method,'POST');assert.equal(e.failure.route,'/api/names');
 assert.ok(e.requiredChecks.includes('inspect-api-route-registration'));
 assert.ok(e.forbiddenActions.includes('edit-locked-test'));
});

test('TDD repair step loads explicit versioned skills',()=>{
 const w=j('ai-harness/workflows/developer-tdd.json');
 const repair=w.steps.find(x=>x.id==='repair-if-needed');
 assert.ok(repair.skills.includes('dev-tdd-repair'));
 assert.ok(repair.skills.includes('dev-api-contract'));
 assert.equal(repair.activation,'only-when-green-fails');
});
test('runtime trace and tool contracts do not grant code privileges',()=>{
 const manifest=j('ai-harness/manifest.json');
 const tools=j(manifest.tools);
 const run=j(manifest.contracts.run);
 const episode=j(manifest.contracts.episode);
 assert.equal(tools.downloadedToolsExecutable,false);
 assert.equal(tools.untrustedCatalogCanElevatePermissions,false);
 assert.ok(run.requiredFields.includes('skillsLoaded'));
 assert.ok(episode.requiredFields.includes('failureAttribution'));
});

test('Git Agent uses a draft PR and enforces human approval and protected main',()=>{
 const agent=j('ai-harness/agents/git-agent.json');
 const flow=j('ai-harness/workflows/library-contribution.json');
 assert.equal(agent.kind,'shared-service');
 assert.equal(flow.git.protectedBranch,'main');
 assert.equal(flow.git.directPushMain,false);
 assert.equal(flow.git.defaultPRDraft,true);
 assert.equal(flow.git.writeRequiresExplicitUserApproval,true);
 assert.equal(flow.git.maintainerReviewRequired,true);
 assert.equal(flow.execution.catalogScriptsAutoExecute,false);
});

test('every catalog role has independently versioned agent metadata and harness roles agree',()=>{
 const catalog=j('catalog.json'), registry=j(catalog.roleAgents.manifest), harness=j('ai-harness/manifest.json');
 assert.equal(catalog.version,'0.0.0');
 assert.equal(catalog.roleAgents.version,'0.0.0');
 assert.equal(Object.keys(registry.agents).length,18);
 for(const id of catalog.roles){
   assert.match(registry.agents[id].version,/^\d+\.\d+\.\d+$/);
   assert.equal(registry.agents[id].roleSkill,'roles/'+id+'/SKILL.md');
 }
 for(const [id,rel] of Object.entries(harness.agents)){
   const agent=j(rel);
   assert.match(agent.version,/^\d+\.\d+\.\d+$/);
   if(registry.agents[id])assert.equal(agent.version,registry.agents[id].version);
 }
});
