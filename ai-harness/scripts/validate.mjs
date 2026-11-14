import { readFileSync, existsSync, lstatSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative, sep } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const harnessRoot = join(root, 'ai-harness');
const errors = [];
const assert = (yes, why) => { if (!yes) errors.push(why); };
const json = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'));
const safe = (rel) => typeof rel === 'string' && /^[a-zA-Z0-9_./-]+$/.test(rel)
  && !rel.startsWith('/') && !rel.split('/').some((s) => s === '..' || !s)
  && resolve(root, rel).startsWith(root + sep);
function file(rel) {
  if (!safe(rel)) { errors.push('Unsafe path: ' + String(rel)); return false; }
  const abs = resolve(root, rel);
  try { const stat = lstatSync(abs); assert(stat.isFile() && !stat.isSymbolicLink(), 'Not a regular file: ' + rel); return stat.isFile() && !stat.isSymbolicLink(); }
  catch { errors.push('Missing file: ' + rel); return false; }
}
const manifest = json('ai-harness/manifest.json');
const catalog = json('catalog.json');
const version = readFileSync(join(harnessRoot, 'VERSION'), 'utf8').trim();
assert(manifest.schema === 1, 'Harness schema must be 1');
assert(manifest.version === version, 'Harness version mismatch');
assert(catalog.aiHarness?.manifest === 'ai-harness/manifest.json', 'Catalog harness reference missing');
assert(catalog.aiHarness?.version === version, 'Catalog harness version mismatch');
assert(manifest.runtime === 'atgv-core', 'Runtime must remain atgv-core');
assert(manifest.security?.downloadedCodeAutoExecuted === false, 'Remote executable code must not auto-run');
assert(manifest.security?.ATGVCoreEnforcesInvariants === true, 'ATGV core protection required');
assert(manifest.security?.pinPerRunSkillDigest === true, 'Run skill digest pinning required');
for (const [id,rel] of Object.entries(manifest.agents ?? {})) {
  if (!file(rel)) continue;
  const agent = json(rel);
  assert(id === agent.id, 'Agent ID mismatch: ' + id);
  assert(file(agent.roleSkill), 'Agent role skill missing: ' + id);
  for (const wf of agent.workflows || []) assert(manifest.workflows?.[wf], 'Unknown workflow: ' + wf);
}
for (const [id,rel] of Object.entries(manifest.workflows ?? {})) {
  if (!file(rel)) continue;
  const wf=json(rel);
  assert(id === wf.id, 'Workflow ID mismatch: '+id);
  assert(wf.execution?.runtime === 'atgv-core', 'Only core runs workflow: ' + id);
  assert(wf.execution?.catalogScriptsAutoExecute === false, 'Auto execution not permitted: '+id);
  assert(wf.execution?.pinRunSnapshot === true, 'Pin run snapshots: '+id);
  assert(Array.isArray(wf.steps) && wf.steps.length > 0, 'No workflow steps: '+id);
  assert(new Set((wf.steps||[]).map(s=>s.id)).size === wf.steps.length, 'Duplicate workflow steps: '+id);
  for(const step of wf.steps||[])assert(step.guard === 'atgv-core', 'Workflow guard must be core: '+id);
  if (id==='developer-tdd') {
    assert(wf.tdd?.lockedTestsImmutable === true, 'Locked tests immutable');
    assert(wf.tdd?.keepLastPassingSource === true, 'Last passing source preserved');
    assert(wf.tdd?.quarantineFailedCandidates === true, 'Failed candidates quarantined');
    assert(wf.tdd?.previewCountsAsGreen === false, 'Preview cannot count as GREEN');
  }
}
for (const [id,entry] of Object.entries(manifest.skills ?? {})) {
  if (!file(entry.manifest)) continue;
  const skill=json(entry.manifest);
  assert(skill.id === id, 'Skill ID mismatch: '+id);
  assert(skill.version === entry.version, 'Skill version mismatch: '+id);
  assert(skill.execute === 'never', 'Skill execution must be disabled: '+id);
  assert(file(skill.entrypoint), 'Skill entrypoint missing: '+id);
  if (safe(skill.entrypoint) && existsSync(join(root,skill.entrypoint))) {
    const content=readFileSync(join(root,skill.entrypoint),'utf8');
    assert(content.startsWith('---\n'), 'Expected skill frontmatter: '+id);
    assert(content.includes('name: '+id+'\n'), 'Skill name mismatch: '+id);
  }
}
for(const rel of [...(manifest.policies??[]),...(manifest.evals??[]),...(Object.values(manifest.contracts??{})),manifest.tools,manifest.context])if(rel)file(rel);
for (const rel of Object.values(manifest.workflows ?? {})) {
  const wf = json(rel);
  for (const step of wf.steps || []) for (const id of step.skills || [])
    assert(Boolean(manifest.skills?.[id]), 'Unknown step skill: '+id+' in '+wf.id);
}
const qualityRel='ai-harness/evals/agent-quality-suite.json';
assert(manifest.evals?.includes(qualityRel),'Agent quality suite must be in harness manifest');
const quality=json(qualityRel);
assert(quality.schema===1,'Agent quality suite schema must be 1');
assert(file(quality.traceContract),'Agent trace contract missing');
const qualityChecks=quality.categories?.map(c=>c.id)||[];
for(const category of ['context','tools','loop','governance','completion','recovery','tdd','observability','handoff','safety'])
  assert(qualityChecks.includes(category),'Missing agent quality category: '+category);
assert(quality.policy?.executeModel===false && quality.policy?.executeRepositoryCode===false,'Agent quality checks must not execute model or catalog code');
for (const scenario of quality.scenarios||[]) {
  assert(typeof scenario.id==='string' && /^[a-z0-9-]+$/.test(scenario.id), 'Unsafe scenario ID');
  assert(typeof scenario.file==='string' && /^[a-z0-9-]+\.json$/.test(scenario.file), 'Unsafe scenario file');
  if (typeof scenario.file==='string' && /^[a-z0-9-]+\.json$/.test(scenario.file)) file(quality.fixtures+scenario.file);
  assert(['passed','failed','blocked'].includes(scenario.expected),'Unknown expected scenario outcome: '+scenario.id);
}
const gitFlow=json('ai-harness/workflows/library-contribution.json');
assert(gitFlow.git?.directPushMain === false, 'Git agent cannot directly push to main');
assert(gitFlow.git?.writeRequiresExplicitUserApproval === true, 'Git agent requires explicit write approval');
assert(gitFlow.git?.maintainerReviewRequired === true, 'Git agent requires human PR review');
assert(gitFlow.execution?.catalogScriptsAutoExecute === false, 'Git agent cannot execute catalog scripts');
const toolPolicy=json('ai-harness/tools/registry.json');
assert(toolPolicy.untrustedCatalogCanElevatePermissions === false, 'Catalog must not elevate permissions');
assert(toolPolicy.downloadedToolsExecutable === false, 'Catalog tools must be identifiers only');
const policy=json('ai-harness/policies/guardrails.json');
assert(policy.nonOverridable?.includes('locked_acceptance_tests'), 'Locked tests must remain protected');
assert(policy.preview?.cannotCompleteAC === true, 'Preview cannot complete AC');
assert(policy.preview?.cannotPublishProduction === true, 'Preview cannot publish');
if(errors.length){console.error('AI harness validation failed:\n'+errors.map(x=>' - '+x).join('\n'));process.exitCode=1;}
else console.log('AI harness validation OK: '+Object.keys(manifest.agents).length+' agents, '+Object.keys(manifest.workflows).length+' workflows, '+Object.keys(manifest.skills).length+' versioned skills');
