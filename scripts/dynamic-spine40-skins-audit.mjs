import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json'))),scope=JSON.parse(await fs.readFile(path.join(run,'scope-adjustment.json')));
const vendor=path.join(run,'reference/spine-webgl-4.0.official.js'),provenance=JSON.parse(await fs.readFile(vendor+'.provenance.json'));
const bytes=await fs.readFile(vendor);if(createHash('sha256').update(bytes).digest('hex')!==provenance.sha256)throw Error('Official runtime changed');
const context=vm.createContext({console});vm.runInContext(bytes.toString(),context);const spine=context.spine;
const groups=new Map();
for(const e of inventory.entries){
 if(scope.deferredSkinIds.includes(e.id))continue;
 for(const stage of (process.env.SKIN_VARIANTS_STAGES||'source').split(','))for(const m of e[stage+'ModelFacts'].filter(m=>m.version?.startsWith('4.0.'))){
  const key=m.skeleton.sha256+':'+m.atlas.sha256;let row=groups.get(key);
  if(!row){row={facts:m,skinIds:[],uses:[]};groups.set(key,row);}row.skinIds.push(e.id);row.uses.push({id:e.id,stage});
 }
}
const rows=[];
for(const {facts,skinIds,uses} of groups.values()){
 const row={skeleton:facts.skeleton.path,sha256:facts.skeleton.sha256,atlas:facts.atlas.path,skinIds:[...new Set(skinIds)],uses};
 try{
  const dataBytes=await fs.readFile(row.skeleton),atlasBytes=await fs.readFile(row.atlas);
  for(const [b,sha] of [[dataBytes,facts.skeleton.sha256],[atlasBytes,facts.atlas.sha256]])if(createHash('sha256').update(b).digest('hex')!==sha)throw Error('Source identity changed');
  const atlas=new spine.TextureAtlas(atlasBytes.toString());for(const page of atlas.pages)page.setTexture(new spine.FakeTexture({width:page.width,height:page.height}));
  const reader=new (facts.format==='json'?spine.SkeletonJson:spine.SkeletonBinary)(new spine.AtlasAttachmentLoader(atlas));
  const data=reader.readSkeletonData(facts.format==='json'?JSON.parse(dataBytes.toString()):dataBytes);
  row.defaultSkin=data.defaultSkin?.name??null;
  row.skins=data.skins.map(s=>({name:s.name,attachments:s.getAttachments().length,renderableAttachments:s.getAttachments().filter(a=>a.attachment instanceof spine.RegionAttachment||a.attachment instanceof spine.MeshAttachment).length}));
  const drawable=row.skins.filter(s=>s.renderableAttachments>0),defaultDrawable=row.skins.find(s=>s.name===row.defaultSkin)?.renderableAttachments;
  row.implicitSelection=!defaultDrawable&&drawable.length===1?drawable[0].name:null;
  row.variants=[null,...data.skins.map(s=>s.name)].map(name=>{
   const skeleton=new spine.Skeleton(data);if(name!==null)skeleton.setSkinByName(name);skeleton.setSlotsToSetupPose();skeleton.updateWorldTransform();
   return{name,setupRenderableSlots:skeleton.slots.filter(s=>s.attachment instanceof spine.RegionAttachment||s.attachment instanceof spine.MeshAttachment).length};
  });
  row.animations=data.animations.map(a=>({name:a.name,duration:a.duration}));row.status='decoded';
 }catch(error){row.status='failed';row.error=String(error);}
 rows.push(row);
}
const report={provenance,models:rows.length,decoded:rows.filter(r=>r.status==='decoded').length,noDefaultRenderable:rows.filter(r=>r.status==='decoded'&&!r.variants[0].setupRenderableSlots).length,limitation:'Independent source metadata and setup-slot audit; no automatic skin choice and no visual acceptance.',rows};
await fs.writeFile(path.join(run,process.env.SKIN_VARIANTS_REPORT||'spine40-skins-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,provenance:undefined,rows:undefined}));
console.log(JSON.stringify(rows.filter(r=>r.skinIds.includes('base_88c084cfa2668f55'))));
