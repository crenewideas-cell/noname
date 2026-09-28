import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {compileSourceActions} from '../apps/core/noname/skin/localDynamic/runtime/source-actions.js';
const run=path.resolve('output/dynamic-remediation/20260926-r01'),out=path.join(run,process.env.SKIN_ACTION_CANDIDATE_LABEL||'external-actions-r03/candidates-v3');
const root='apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/';
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const references=JSON.parse(await fs.readFile(path.join(run,'source-reference-resolution.json'))).entries;
const auditRows=JSON.parse(await fs.readFile(path.join(run,'all-base-models.json'))).results;
const audit=new Map(auditRows.map(r=>[r.file,r]));
const refs=new Map(references.map(r=>[r.id+'/'+r.field,r])),resources=new Map(),rows=[],ids=[];
const sha=b=>createHash('sha256').update(b).digest('hex');
await fs.mkdir(path.join(out,'entries'),{recursive:true});
async function model(ref,config){
 const key=ref.skeleton.path;
 if(!resources.has(key))resources.set(key,(async()=>{
  const relative=ref.skeleton.path.split('/无名杀基础扩展/')[1],atlas=ref.atlas.path.split('/无名杀基础扩展/')[1];
  if(!relative?.startsWith('assets/dynamic/')||!atlas?.startsWith('assets/dynamic/')||[relative,atlas].some(p=>p.split('/').includes('..')))throw Error('Invalid frozen resource path');
  const [bytes,atlasBytes]=await Promise.all([fs.readFile(root+relative),fs.readFile(root+atlas)]);
  if(sha(bytes)!==ref.skeleton.sha256||sha(atlasBytes)!==ref.atlas.sha256)throw Error('Installed resource identity differs');
  const prior=audit.get(relative),fingerprint=createHash('sha256').update(bytes).update(atlasBytes.toString()).digest('hex');
  const matched=prior?.fingerprint===fingerprint;
  if(matched&&prior.status!=='parsed')throw Error('Existing matching model audit failed: '+(prior.error||prior.status));
  const jsonData=relative.endsWith('.json')?JSON.parse(bytes):null;
  const availableAnimations=jsonData?Object.keys(jsonData.animations||{}):matched?prior.animations?.map(a=>a.name):null;
  const version=relative.endsWith('.json')?jsonData.skeleton?.spine:bytes.subarray(0,128).toString('latin1').match(/(?:^|[^0-9])([234]\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9]+)?)/)?.[1];
  return{skeleton:relative,atlas,version,availableAnimations,provenance:{skeletonSHA256:ref.skeleton.sha256,atlasSHA256:ref.atlas.sha256,existingAuditMatched:matched}};
 })());
 return{...await resources.get(key),legacy:config,skin:config.skin};
}
for(const e of inventory.entries){
 const row={id:e.id,status:'outside-supported-source-scenes'};rows.push(row);
 if(e.pack!=='无名杀基础扩展')continue;
 let entry,folder;
 for(const f of ['scene36-candidate','scene-candidate','scene40-candidate','scene40-decoded-candidate'])try{entry=JSON.parse(await fs.readFile(path.join(run,f,'entries',e.id+'.json')));folder=f;break;}catch(error){if(error.code!=='ENOENT')throw error;}
 if(!entry)continue;
 if(entry.scene.provenance.sourceConfigHash!==e.sourceConfigHash)throw Error('Source identity changed');
 const externalModels={},resourceFailures=[];
 for(const kind of ['chuchang','gongji','teshu','shan']){
  const c=entry.scene.source[kind];if(!c||typeof c!=='object'||Array.isArray(c)||!c.name||c.name===entry.scene.source.name)continue;
  const ref=refs.get(e.id+'/'+kind);
  try{
   if(ref?.status!=='exact-windows-resource-resolved'||ref.name!==c.name)throw Error(ref?.status||'no-exact-resource');
   const m=await model(ref,c),native=entry.models.every(m=>/^3\.6\./.test(m.version));
   const supported=native?/^3\.6\./.test(m.version):/^4\.0\./.test(m.version)||/^3\.8\./.test(m.version)&&m.skeleton.endsWith('.json');
   if(!supported)throw Error('External engine family requires separate adapter: '+m.version);
   const declared=c.action??c.animation,selected=typeof declared==='string'?declared:Array.isArray(declared)&&declared.length===1?declared[0]:null;
   if(selected&&m.availableAnimations&&!m.availableAnimations.includes(selected))throw Error('Missing exact source action: '+selected);
   externalModels[kind]=m;
  }catch(error){resourceFailures.push({kind,reason:String(error)});}
 }
 const contract=compileSourceActions(entry.scene,{allowLayerOverrides:true,allowSourceDefault:true,externalModels});
 row.contract=contract;row.resourceFailures=resourceFailures;row.baseline=folder;
 const commands=contract.records.filter(r=>r.status==='candidate');if(!commands.length){row.status='no-supported-action';continue;}
 entry.scene.actionContract=contract;entry.motions=[...new Set([...entry.motions,...commands.map(r=>r.command)])];
 row.status='runtime-candidate';ids.push(e.id);
 await fs.writeFile(path.join(out,'entries',e.id+'.json'),JSON.stringify(entry),{flag:'wx'});
}
const records=rows.flatMap(r=>r.contract?.records||[]),external=records.filter(r=>r.mode==='external');
const summary={frozen:rows.length,priority:4895,deferred:39,deleted:0,candidateSkins:ids.length,candidateCommands:records.filter(r=>r.status==='candidate').length,externalSkins:rows.filter(r=>r.contract?.records.some(a=>a.mode==='external')).length,externalCommands:external.length,sourceDefaultReturnCommands:records.filter(r=>r.status==='candidate'&&r.returnSelection==='source-default-first').length,unsupportedReasons:records.filter(r=>r.status!=='candidate').reduce((o,r)=>(o[r.reason]=(o[r.reason]||0)+1,o),{}),resourceFailures:rows.flatMap(r=>r.resourceFailures||[]).length,productionInstalled:false,finalAcceptance:0};
await fs.writeFile(path.join(out,'ids.json'),JSON.stringify(ids),{flag:'wx'});
await fs.writeFile(path.join(out,'impact.json'),JSON.stringify({summary,rows},null,2),{flag:'wx'});
console.log(JSON.stringify(summary,null,2));
