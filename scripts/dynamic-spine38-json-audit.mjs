import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {normalizeSpineJson} from '../apps/core/noname/skin/localDynamic/runtime/spine-json.js';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const vendor=path.join(run,'reference/spine-webgl-3.8-20191015.official.js'),runtime=await fs.readFile(vendor),context=vm.createContext({console});
vm.runInContext(runtime.toString(),context);const spine=context.spine;
const groups=new Map();
for(const e of inventory.entries)for(const stage of ['source','catalog','effective'])for(const f of e[stage+'ModelFacts']||[]){
 if(f.format!=='json'||!f.version?.startsWith('3.8.'))continue;
 const key=f.skeleton.sha256+':'+f.atlas.sha256;if(!groups.has(key))groups.set(key,{facts:f,uses:[]});groups.get(key).uses.push({id:e.id,stage});
}
const rows=[];
for(const {facts,uses} of groups.values()){
 const row={file:facts.skeleton.path,sha256:facts.skeleton.sha256,uses};
 try{
  const bytes=await fs.readFile(row.file);if(createHash('sha256').update(bytes).digest('hex')!==row.sha256)throw Error('Source identity changed');
  const raw=JSON.parse(bytes.toString()),normalized=normalizeSpineJson(raw);row.conversion=normalized.conversion;
  if(!normalized.conversion){row.status='unchanged-schema';rows.push(row);continue;}
  const atlasText=await fs.readFile(facts.atlas.path,'utf8');
  const atlas=new spine.TextureAtlas(atlasText,()=>new spine.FakeTexture({width:16384,height:16384}));
  const read=json=>new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(json);
  try{const before=read(raw);row.before={skins:before.skins.length,slots:before.slots.length,animations:before.animations.map(a=>a.name)};}catch(error){row.before={error:String(error)};}
  const after=read(normalized.data),rig=new spine.Skeleton(after);
  row.after={skins:after.skins.length,slots:after.slots.length,animations:after.animations.map(a=>a.name),renderableSlots:rig.slots.filter(s=>s.attachment instanceof spine.RegionAttachment||s.attachment instanceof spine.MeshAttachment).length};
  const restored=Object.fromEntries(normalized.data.skins.map(s=>[s.name,s.attachments]));
  if(JSON.stringify(restored)!==JSON.stringify(raw.skins)||normalized.data.skeleton.spine!==raw.skeleton.spine)throw Error('Non-lossless schema conversion');
  if(!row.after.renderableSlots)throw Error('Converted source still has no visible attachments');
  row.status='lossless-container-conversion-official-decode-passed';
 }catch(error){row.status='failed';row.error=String(error);}
 rows.push(row);
}
const report={runtime:{file:vendor,sha256:createHash('sha256').update(runtime).digest('hex'),upstreamCommit:'f68ac18a824a78861f1b645d7fdabe544f3ffd03'},models:rows.length,counts:rows.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{}),limitation:'Official historical decoding and lossless skin-container structure check; fake textures support attachment metadata only, not UV/pixel validation.',rows};
await fs.writeFile(path.join(run,process.env.SKIN_JSON_REPORT||'spine38-json-container-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,rows:undefined}));console.log(JSON.stringify(rows.filter(r=>r.conversion)));
