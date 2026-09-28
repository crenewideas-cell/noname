import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const read=async f=>JSON.parse(await fs.readFile(path.join(run,f)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const inventory=await read('inventory.json'),catalogs=[],currentIds=[];
for(const pack of [...new Set(inventory.entries.map(e=>e.pack))]){
 const file=path.join('apps/core/extension/imports/本地动态皮肤包',pack,'catalog.json'),bytes=await fs.readFile(file),catalog=JSON.parse(bytes);
 catalogs.push({pack,entries:catalog.entries.length,sha256:sha(bytes)});currentIds.push(...catalog.entries.map(e=>e.id));
}
assert.deepEqual(currentIds.sort(),inventory.entries.map(e=>e.id).sort(),'Current library scope must still equal frozen scope');
const batches=[];
for(const [folder,idFile] of [['scene36-images','scene36-candidate/ids.json'],['live2d-owned-assets-all','live2d-all-ids.json'],['spine38-json-loader-all','spine38-json-effective-ids.json']]){
 const ids=await read(idFile),rows=await read(folder+'/report.json');
 assert.equal(rows.length,ids.length,folder+' must finish the complete expected denominator');
 assert.deepEqual(rows.map(r=>r.id).sort(),[...ids].sort());
 assert.ok(rows.every(r=>['captured','failed'].includes(r.status)));
 const rechecks=[];
 if(folder==='scene36-images')for(const r of await read('scene36-empty-layer-recheck/report.json')){
  if(r.viewport.width!==240)continue;assert.equal(r.status,'captured');
  const original=rows.find(x=>x.id===r.id);assert.equal(original?.status,'failed');
  assert.equal(sha(await fs.readFile(path.join(run,folder,'entry-snapshot',r.id+'.json'))),sha(await fs.readFile(path.join(run,'scene36-empty-layer-recheck/entry-snapshot',r.id+'.json'))));
  rechecks.push({id:r.id,report:'scene36-empty-layer-recheck/report.json',status:r.status,runtimeSnapshotHash:r.runtimeSnapshotHash,originalError:original.error});
 }
 const evidence=await fs.readFile(path.join(run,folder,'report.json'));
 batches.push({folder,expected:ids.length,firstPassCaptured:rows.filter(r=>r.status==='captured').length,captured:rows.filter(r=>r.status==='captured').length+rechecks.length,failed:rows.filter(r=>r.status==='failed'&&!rechecks.some(x=>x.id===r.id)).map(r=>({id:r.id,error:r.error})),rechecks,reportSHA256:sha(evidence),runtimeSnapshotHash:rows[0].runtimeSnapshotHash,visualAcceptance:0});
}
const soak=await read('actual-game-soak-30min-v2/report.json');
assert.equal(soak.completed,true,'Actual game stability test must finish, not merely start');
assert.ok(soak.elapsedSeconds>=1800);assert.equal(soak.errors.length,0);
const lifecycle=await read('live2d-lifecycle-v3.json');assert.equal(lifecycle.length,6);assert.ok(lifecycle.every(r=>r.status==='passed'));
const recovery=await read('recovery-drill-v8.json');assert.equal(recovery.pass,true);assert.equal(recovery.results.length,13);
const files=[];for(const row of recovery.results){const bytes=await fs.readFile(row.file);assert.equal(sha(bytes),row.candidate,'Recovery candidate changed: '+row.file);files.push({file:row.file,sha256:sha(bytes)});}
const reviewed=[];
for(const file of ['spine40-screen-reference-pilot/comparison.png','scene40-screen-review/comparison-01.jpg','scene36-apnode-review/comparison-01.jpg','scene36-apnode-review/comparison-02.jpg','live2d-owned-assets-all/aki-comparison.png','actual-game-soak-30min-v2/final.png'])reviewed.push({file,sha256:sha(await fs.readFile(path.join(run,file))),review:'actually viewed; diagnostic only, no complete skin acceptance'});
const report={closedAt:new Date().toISOString(),reason:'User requested this stage to finish and be recorded before moving to a new window.',scope:{baseline:4934,priority:4895,deferred:39,deleted:0,current:currentIds.length,catalogs,finalSkinAcceptance:0},batches,
 actualGame:{folder:'actual-game-soak-30min-v2',completed:true,elapsedSeconds:soak.elapsedSeconds,roundsStarted:soak.rounds.length,roundsFinished:soak.rounds.filter(r=>r.finishedAt).length,samples:soak.samples.length,pageErrors:soak.errors.length,skinHostErrors:soak.samples.flatMap(s=>s.hosts).filter(h=>h.error).length,maxHosts:Math.max(...soak.samples.map(s=>s.hosts.length)),limitation:'Frozen runtime at start; actual offline AI games with native 3.6/4.0 hosts only. Concurrent capture load excludes final performance certification; Live2D and source-scene candidate paths are not covered by this game run.'},
 live2dLifecycle:{cases:6,passed:6,report:'live2d-lifecycle-v3.json'},recovery:{files:13,pass:true,report:'recovery-drill-v8.json'},files,reviewed,
 remaining:['Source playback/action/viewport and multilayer contracts are not certified for all entries.','Three user-reported Wenyang framing defects remain open.','All-library visual review, temporal/action matrices, context recovery, full performance, package install/upgrade/cache/rollback and final release remain incomplete.'],formalInstallChanged:false};
const output=path.join(run,'stage-close-20260926.json');await fs.writeFile(output,JSON.stringify(report,null,2),{flag:'wx'});
console.log(JSON.stringify({...report,files:undefined,reviewed:undefined},null,2));
