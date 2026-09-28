import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const run=path.resolve('output/dynamic-remediation/20260926-r01');
const out=path.join(run,'continuation-actions-20260926');
await fs.mkdir(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=async f=>JSON.parse(await fs.readFile(path.join(run,f)));
const close=await read('stage-close-20260926.json'),inventory=await read('inventory.json');
const report={checkedAt:new Date().toISOString(),scope:close.scope,files:[],batches:[],catalogs:[]};
for(const f of close.files){const b=await fs.readFile(f.file);report.files.push({...f,matches:sha(b)===f.sha256});assert.equal(sha(b),f.sha256);}
for(const b of close.batches){const actual=sha(await fs.readFile(path.join(run,b.folder,'report.json')));assert.equal(actual,b.reportSHA256);report.batches.push({folder:b.folder,sha256:actual});}
const ids=[];
for(const c of close.scope.catalogs){const bytes=await fs.readFile(path.join('apps/core/extension/imports/本地动态皮肤包',c.pack,'catalog.json'));assert.equal(sha(bytes),c.sha256);ids.push(...JSON.parse(bytes).entries.map(e=>e.id));report.catalogs.push(c);}
assert.deepEqual(ids.sort(),inventory.entries.map(e=>e.id).sort());
report.loading=(await read('library-loading-summary.json')).summary;
report.defects=(await read('defects.json')).defects.map(d=>({id:d.id,status:d.status}));
for(const name of ['player.js','spine36.js','source-scene.js']){const f='apps/core/noname/skin/localDynamic/runtime/'+name;await fs.mkdir(path.join(out,'before-runtime'),{recursive:true});await fs.copyFile(f,path.join(out,'before-runtime',name),fs.constants.COPYFILE_EXCL);}
for(const f of ['scripts/dynamic-remediation-scene-candidate.mjs','scripts/dynamic-source-scene.test.mjs','docs/dynamic-skin-remediation-status.md'])await fs.copyFile(f,path.join(out,path.basename(f)+'.before'),fs.constants.COPYFILE_EXCL);
await fs.writeFile(path.join(out,'continuation-check.json'),JSON.stringify(report,null,2),{flag:'wx'});
console.log(JSON.stringify({scope:ids.length,files:report.files.length,batches:report.batches.length,out}));
