import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {compileSourceActions} from '../apps/core/noname/skin/localDynamic/runtime/source-actions.js';
import {compileDecadeScene} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
const run=path.resolve('output/dynamic-remediation/20260926-r01');
const out=path.join(run,process.env.SKIN_ACTION_CANDIDATE_LABEL||'continuation-actions-20260926');
await fs.mkdir(path.join(out,'entries'),{recursive:true});
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const sha=b=>createHash('sha256').update(b).digest('hex');
const rows=[],ids=[],masks=[];
for(const e of inventory.entries){
 const row={id:e.id,pack:e.pack,status:'other-source-family'};rows.push(row);
 if(e.pack!=='无名杀基础扩展')continue;
 const variants=new Map(e.sourceConfigs.filter(c=>c.config).map(c=>[JSON.stringify(c.config),c.config]));
 row.status=!variants.size?'unmapped':variants.size!==1?'owner-config-ambiguity':'audited';
 row.variants=[];
 for(const config of variants.values()){
  const scene=compileDecadeScene(config,{sourceConfigHash:e.sourceConfigHash});
  const contract=compileSourceActions(scene,{allowLayerOverrides:process.env.SKIN_ACTION_PLACEMENT==='1'});row.variants.push(contract);
  for(const layer of scene.layers)for(const field of ['clip','clipSlots','disableMask','outcropMask','hideSlots'])if(layer.source[field]!=null)masks.push({id:e.id,role:layer.role,field,value:layer.source[field]});
 }
 if(variants.size!==1)continue;
 const contract=row.variants[0];if(!contract.records.some(r=>r.status==='candidate'))continue;
 let entry,bytes,folder;
 for(const f of ['scene36-candidate','scene-candidate','scene40-candidate','scene40-decoded-candidate']){
  try{bytes=await fs.readFile(path.join(run,f,'entries',e.id+'.json'));entry=JSON.parse(bytes);folder=f;break;}catch(error){if(error.code!=='ENOENT')throw error;}
 }
 if(!entry){row.status='action-candidate-without-supported-source-scene';continue;}
 if(entry.scene.provenance.sourceConfigHash!==e.sourceConfigHash)throw Error('Candidate source changed: '+e.id);
 entry.scene.actionContract=contract;
 entry.scene.actions.shan=entry.scene.source.shan;
 entry.motions=[...new Set([...entry.motions,...contract.records.filter(r=>r.status==='candidate').map(r=>r.command)])];
 // There is no automatic entrance activation: this candidate certifies explicit
 // requests only. Avatar/preview entrance policy remains an open source contract.
 row.status='runtime-candidate';row.baseline={folder,sha256:sha(bytes)};
 await fs.writeFile(path.join(out,'entries',e.id+'.json'),JSON.stringify(entry),{flag:'wx'});ids.push(e.id);
}
const count=key=>rows.reduce((o,r)=>(o[r[key]]=(o[r[key]]||0)+1,o),{});
const records=rows.flatMap(r=>r.variants?.flatMap(v=>v.records)||[]);
const summary={frozen:rows.length,priority:4895,deferred:39,deleted:0,candidates:ids.length,statuses:count('status'),actionRecords:records.length,candidateActions:records.filter(r=>r.status==='candidate').length,unsupportedActions:records.filter(r=>r.status!=='candidate').length,masks:masks.reduce((o,r)=>(o[r.field]=(o[r.field]||0)+1,o),{}),finalSkinAcceptance:0,productionInstalled:false};
await fs.writeFile(path.join(out,'ids.json'),JSON.stringify(ids),{flag:'wx'});
await fs.writeFile(path.join(out,'impact.json'),JSON.stringify({summary,rows,masks},null,2),{flag:'wx'});
console.log(JSON.stringify(summary));
