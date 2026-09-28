import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { createHash } from 'node:crypto';
import path from 'node:path';
const run = path.resolve(process.argv[2] || 'output/dynamic-remediation/20260926-r01');
const completed = JSON.parse(await fs.readFile(path.join(run, 'freeze-complete.json')));
const manifest = path.join(run, 'baseline-files.jsonl'), h = createHash('sha256'), frozen = new Map();
for await (const chunk of createReadStream(manifest)) h.update(chunk);
if (h.digest('hex') !== completed.manifestHash) throw Error('Frozen manifest hash mismatch');
for await (const line of createInterface({ input: createReadStream(manifest), crlfDelay: Infinity })) { const f = JSON.parse(line); if (frozen.has(f.path)) throw Error('Duplicate frozen path: ' + f.path); frozen.set(f.path, f); }
if (frozen.size !== completed.total) throw Error('Frozen count mismatch');
const inventory = JSON.parse(await fs.readFile(path.join(run, 'inventory.json')));
const windowsPaths = new Map();
for (const [name,f] of frozen) {
  const key = name.toLowerCase();
  if (windowsPaths.has(key) && windowsPaths.get(key).sha256 !== f.sha256) throw Error('Case-insensitive resource collision: '+name);
  windowsPaths.set(key,f);
}
let enriched = 0, mismatched = 0;
function enrich(value) {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.status === 'present') {
    const f = frozen.get(value.path) || windowsPaths.get(value.path.toLowerCase());
    if (f) { if (value.sha256 && value.sha256 !== f.sha256) { value.identityConflict = true; mismatched++; } value.sha256 = f.sha256; value.frozen = true; if(f.path!==value.path)value.actualPath=f.path; enriched++; }
  }
  for (const v of Object.values(value)) if (v && typeof v === 'object') enrich(v);
}
enrich(inventory.entries);
const resolve = (pack, name, json) => {
  const prefix = 'temp/动态皮包/' + pack + '/assets/dynamic/' + name.replaceAll('\\', '/');
  const desired = prefix + (json ? '.json' : '.skel'), atlas = prefix + '.atlas';
  const chosen = frozen.get(desired), alternative = frozen.get(prefix + (json ? '.skel' : '.json'));
  return { requested: desired, atlas, skeleton: chosen || null, atlasIdentity: frozen.get(atlas) || null,
    alternateFormat: alternative || null, status: chosen && frozen.has(atlas) ? 'present' : 'unresolved-source-reference' };
};
const extra = [], divergences = [], impact = {};
for (const e of inventory.entries) {
  for (const model of e.effective?.models || []) for (const rule of ['sceneVariant','layerRegistration','layerCoordinateMismatch','avatarPresentation']) {
    if (model[rule] !== undefined) (impact[rule] ||= []).push({ pack:e.pack,id:e.id,model:model.skeleton,output:model[rule] });
  }
  if (e.effective?.inferredBackground) (impact.inferredBackground ||= []).push({ pack:e.pack,id:e.id,output:e.effective.inferredBackground });
  if (e.issues.includes('merged-owner-configs-differ')) divergences.push({ pack:e.pack,id:e.id,configs:e.sourceConfigs,catalogConfig:e.catalog.legacy });
  if (e.classification.source !== 'legacy-dynamicSkin') continue;
  const c=e.sourceConfigs[0]?.config;
  if (!c) continue;
  function visit(v,prefix='') {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return;
    if (prefix && typeof v.name === 'string' && !['beijing'].includes(prefix)) {
      // special transform names reference another skin configuration, not skeleton files.
      const isSkinReference = /^special\.(?:变身\d*|觉醒|转换)$/.test(prefix);
      extra.push({ pack:e.pack,id:e.id,field:prefix,config:v,kind:isSkinReference?'skin-config-reference':'model-reference',
        ...(isSkinReference ? {status:'pending-config-resolution'} : resolve(e.pack,v.name,v.json)) });
    }
    for (const [k,x] of Object.entries(v)) if (x && typeof x==='object' && !Array.isArray(x)) visit(x,prefix?prefix+'.'+k:k);
  }
  visit(c);
}
const resources = JSON.parse(await fs.readFile(path.join(run,'resources.json')));enrich(resources);
inventory.summary.frozenComplete=true;
inventory.summary.frozenManifestHash=completed.manifestHash;
inventory.summary.resourcesWithoutHash=resources.filter(r=>r.status==='present'&&!r.sha256).length;
inventory.summary.hashConflicts=mismatched;
inventory.summary.extraSourceReferences=extra.length;
inventory.summary.extraUnresolvedReferences=extra.filter(r=>r.status!=='present').length;
inventory.summary.extraSourceReferencesNote='Structural discovery; optionality, exact field semantics and transformation targets remain pending.';
async function write(name,data){const target=path.join(run,name);await fs.writeFile(target+'.tmp',JSON.stringify(data,null,2));await fs.rename(target+'.tmp',target);}
await write('inventory.json',inventory);await write('inventory-summary.json',inventory.summary);await write('resources.json',resources);
await write('source-extra-references.json',extra);await write('merged-config-divergences.json',divergences);await write('rule-impact.json',impact);
await write('freeze-verification.json',{ checkedAt:new Date().toISOString(),manifestRecords:frozen.size,manifestHash:completed.manifestHash,enriched,identityConflicts:mismatched,scope:inventory.entries.length,passed:!mismatched&&!inventory.summary.resourcesWithoutHash });
console.log(JSON.stringify(inventory.summary));
if(mismatched||inventory.summary.resourcesWithoutHash)process.exitCode=1;
