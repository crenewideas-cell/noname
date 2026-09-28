import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const root=path.join(run,'library-loading-v1');
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=async p=>JSON.parse(await fs.readFile(p));
let manifest;
try{manifest=await read(path.join(root,'manifest.json'));}catch(error){
 if(error.code!=='ENOENT')throw error;
 const inventory=await read(path.join(run,'inventory.json')),scope=await read(path.join(run,'scope-adjustment.json'));
 const deferred=new Set(scope.deferredSkinIds),entries=inventory.entries.filter(e=>!deferred.has(e.id));
 if(inventory.entries.length!==4934||entries.length!==4895)throw Error('Frozen scope mismatch');
 await fs.mkdir(path.join(root,'runtime'),{recursive:true});await fs.mkdir(path.join(root,'entries'),{recursive:true});
 const files=[];
 for(const name of (await fs.readdir('apps/core/noname/skin/localDynamic/runtime')).filter(n=>/\.(js|html|css)$/.test(n)).sort()){
  const bytes=await fs.readFile(path.join('apps/core/noname/skin/localDynamic/runtime',name));await fs.writeFile(path.join(root,'runtime',name),bytes);files.push({name,sha256:hash(bytes)});
 }
 const runner=await fs.readFile('scripts/dynamic-remediation-capture.mjs');await fs.writeFile(path.join(root,'capture-runner.mjs'),runner);
 const entryOrigins=[];
 for(const e of entries){const data=e.effective||e.catalog;if(!data)throw Error('Missing preserved metadata '+e.id);entryOrigins.push({id:e.id,origin:e.effective?'frozen-effective':'frozen-catalog-unavailable-probe',sha256:hash(JSON.stringify(data))});await fs.writeFile(path.join(root,'entries',e.id+'.json'),JSON.stringify(data));}
 const shards=[];
 for(let start=0;start<entries.length;start+=100){const ids=entries.slice(start,start+100).map(e=>e.id);const index=shards.length;await fs.writeFile(path.join(root,`ids-${index}.json`),JSON.stringify(ids));shards.push({index,ids,attempts:[],status:'pending'});}
 manifest={createdAt:new Date().toISOString(),original:4934,priority:4895,deferred:[...deferred],files,entryOrigins,runnerSHA256:hash(runner),runtimeSnapshotHash:hash(JSON.stringify(files)),
  purpose:'Complete denominator loading/visual discovery using current generic runtime and frozen effective entries; not correctness acceptance. No unvalidated scene candidates or source asset edits.',viewports:['240x360'],times:[0,1,3],shards};
 await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));
}
for(const f of manifest.files)if(hash(await fs.readFile(path.join(root,'runtime',f.name)))!==f.sha256)throw Error('Runtime snapshot drift '+f.name);
if(hash(await fs.readFile(path.join(root,'capture-runner.mjs')))!==manifest.runnerSHA256)throw Error('Capture runner drift');
for(const e of manifest.entryOrigins)if(hash(await fs.readFile(path.join(root,'entries',e.id+'.json')))!==e.sha256)throw Error('Entry snapshot drift '+e.id);
for(const shard of manifest.shards){
 if(shard.status==='complete')continue;
 const attempt=shard.attempts.length,label=`library-loading-v1/shard-${String(shard.index).padStart(2,'0')}-attempt-${attempt}`;
 const log=await fs.open(path.join(root,`shard-${shard.index}-attempt-${attempt}.log`),'wx');
 shard.attempts.push({label,startedAt:new Date().toISOString()});shard.status='running';await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));
 const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[path.join(root,'capture-runner.mjs'),run,'--candidate','--label',label],{windowsHide:true,stdio:['ignore',log.fd,log.fd],env:{...process.env,SKIN_CASE_FILE:path.join(root,`ids-${shard.index}.json`),SKIN_ENTRY_ROOT:path.join(root,'entries'),SKIN_RUNTIME_ROOT:path.join(root,'runtime'),SKIN_VIEWPORTS:'240x360',SKIN_TIMES:'0,1,3',SKIN_CAPTURE_ACTIONS:'0'}});child.once('error',reject);child.once('exit',resolve);});
 await log.close();const report=await read(path.join(run,label,'report.json')).catch(()=>[]);
 Object.assign(shard.attempts.at(-1),{finishedAt:new Date().toISOString(),exitCode:code,checked:report.length,failed:report.filter(r=>r.status==='failed').length});
 const actual=new Set(report.map(r=>r.id));shard.status=report.length===shard.ids.length&&shard.ids.every(id=>actual.has(id))?'complete':'infrastructure-incomplete';
 if(report.some(r=>r.runtimeSnapshotHash!==manifest.runtimeSnapshotHash))throw Error('Mixed runtime evidence in shard');
 await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify({shard:shard.index,status:shard.status,...shard.attempts.at(-1)}));
 if(shard.status!=='complete')throw Error('Incomplete shard; rerun resumes a new attempt without deleting existing evidence');
}
manifest.finishedAt=new Date().toISOString();await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));
