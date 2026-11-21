import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
const root=join(import.meta.dirname,'..');
const json=rel=>JSON.parse(readFileSync(join(root,rel),'utf8'));
test('all 18 role expert agents point to their own verified role skills',()=>{
 const catalog=json('catalog.json');
 const harness=json('ai-harness/manifest.json');
 const policy=json('ai-harness/policies/role-expertise-handoff.json');
 assert.equal(catalog.version,readFileSync(join(root,'VERSION'),'utf8').trim());
 assert.equal(policy.schema,1);
 assert.equal(policy.neverAutoSwitch,true);
 assert.equal(policy.switchRequiresUserClick,true);
 assert.equal(policy.checksEnabledRoles,true);
 assert.equal(policy.alwaysShowNextActionButton,true);
 assert.equal(policy.routeForeignRoleArtifactCreation,true);
 assert.equal(policy.answerCrossRoleInformationalQuestionsInCurrentRole,true);
 assert.ok(harness.policies.includes('ai-harness/policies/role-expertise-handoff.json'));
 assert.ok(harness.capabilities.includes('explicit-cross-role-verified-skill-handoff'));
 const ids=Object.keys(harness.agents).filter(x=>x!=='git-agent').sort();
 assert.equal(ids.length,18);
 assert.deepEqual(Object.keys(policy.roles).sort(),ids);
 for(const id of ids){
  const profile=json(harness.agents[id]);
  assert.equal(profile.roleSkill,'roles/'+id+'/SKILL.md');
  assert.equal(policy.roles[id].roleSkill,profile.roleSkill);
  assert.ok(Array.isArray(policy.roles[id].expertise)&&policy.roles[id].expertise.length,
   'Missing expert deliverables for '+id);
  assert.ok(existsSync(join(root,profile.roleSkill)),'Missing SKILL.md for '+id);
 }
});
test('source-only coding-agent memory mirrors all roles but is not required by releases',()=>{
 assert.match(readFileSync(join(root,'.gitattributes'),'utf8'),/^\.memory export-ignore$/m);
 const manifest=join(root,'.memory/manifest.json');
 if(!existsSync(manifest)){
  // Published git archive intentionally excludes .memory; harness must still work.
  assert.ok(existsSync(join(root,'ai-harness/policies/role-expertise-handoff.json')));
  return;
 }
 const memoryIndex=json('.memory/manifest.json');
 assert.equal(memoryIndex.releasePackaging.excludeDirectory,'.memory');
 assert.equal(memoryIndex.categories.find(c=>c.id==='role-boundaries')?.path,'.memory/role-boundaries.json');
 const memory=json('.memory/role-boundaries.json'),policy=json('ai-harness/policies/role-expertise-handoff.json');
 assert.equal(memory.status,'accepted');
 assert.deepEqual(Object.keys(memory.roles).sort(),Object.keys(policy.roles).sort());
 assert.match(readFileSync(join(root,'AGENTS.md'),'utf8'),/role-boundaries\.json/);
});
