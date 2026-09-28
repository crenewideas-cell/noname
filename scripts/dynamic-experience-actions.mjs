import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
import vm from 'node:vm';import {spine} from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';import {createLegacyParser} from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';
import {screenAction} from '../apps/core/noname/skin/localDynamic/runtime/effect-layout.js';
const work='output/dynamic-remediation/20260926-r01',out=work+'/experience-r09/actions',root='apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展';
const sha=b=>createHash('sha256').update(b).digest('hex'),read=async p=>JSON.parse(await fs.readFile(p));
const inventory=await read(work+'/inventory.json'),frozen=new Map(inventory.entries.map(e=>[e.id,e])),deferred=new Set((await read(work+'/scope-adjustment.json')).deferredSkinIds);
const audit=new Map((await read(work+'/all-base-models.json')).results.map(r=>[r.file,r])),resources=new Map(),rows=[];
await fs.mkdir(out+'/entries',{recursive:true});
let modern;
async function animations(m,bytes,atlasText){
 if(m.skeleton.endsWith('.json'))return Object.keys(JSON.parse(bytes).animations||{});
 let api,parser;
 if(/^3\.6\./.test(m.version)){api=spine;}else if(/^4\.0\./.test(m.version)){
  if(!modern){const c=vm.createContext({console,Float32Array,Uint8Array,Int16Array,Uint16Array,DataView,Math,ArrayBuffer,window:{},navigator:{}});vm.runInContext(await fs.readFile(work+'/reference/spine-webgl-4.0.official.js','utf8'),c);modern=c.spine;}api=modern;
 }else throw Error('unsupported action reader '+m.version);
 const texture={setFilters(){},setWraps(){},getImage(){return{width:4096,height:4096};}},atlas=new api.TextureAtlas(atlasText,()=>texture);
 if(api!==spine)for(const page of atlas.pages)page.setTexture(texture);
 parser=api===spine?createLegacyParser(api,atlas,m):new api.SkeletonBinary(new api.AtlasAttachmentLoader(atlas));
 const data=parser.readSkeletonData(new Uint8Array(bytes));return data.animations.map(a=>a.name);
}
async function validate(m,animation){
 const key=m.skeleton+'|'+m.atlas;
 if(!resources.has(key))resources.set(key,(async()=>{const bytes=await fs.readFile(root+'/'+m.skeleton),atlas=await fs.readFile(root+'/'+m.atlas);if(m.provenance?.skeletonSHA256&&sha(bytes)!==m.provenance.skeletonSHA256)throw Error('skeleton identity changed');if(m.provenance?.atlasSHA256&&sha(atlas)!==m.provenance.atlasSHA256)throw Error('atlas identity changed');
 const a=audit.get(m.skeleton),fingerprint=createHash('sha256').update(bytes).update(atlas.toString()).digest('hex');
 const names=a?.fingerprint===fingerprint&&a.status==='parsed'&&a.animations?a.animations.map(x=>x.name):await animations(m,bytes,atlas.toString());
 if(!names)throw Error('no matching parsed model audit');return {names,skeletonSHA256:sha(bytes),atlasSHA256:sha(atlas)};})());
 const facts=await resources.get(key);if(animation&&!facts.names.includes(animation))throw Error('missing exact animation: '+animation);if(!facts.names.length)throw Error('no animation');return facts;
}
for(const id of await read(work+'/external-actions-r03/candidates-v3/ids.json')){
 const row={id,accepted:[],rejected:[]};rows.push(row);if(deferred.has(id)){row.skipped='original-deferred';continue;}
 const candidate=await read(work+'/external-actions-r03/candidates-v3/entries/'+id+'.json'),installed=await read(root+'/entries/'+id+'.json');
 if(candidate.scene.provenance.sourceConfigHash!==frozen.get(id).sourceConfigHash||JSON.stringify(installed.legacy)!==JSON.stringify(candidate.scene.source)){row.skipped='source-identity-differs';continue;}
 const records=[];
 for(const original of candidate.scene.actionContract.records){if(original.status!=='candidate')continue;const action=screenAction(original,candidate.models);if(!action)continue;
  try{if(action.actionLayer.display.clip||action.actionLayer.display.clipSlots.length)throw Error('unverified external mask');const facts=await validate(action.model,action.animation);records.push({...action,mode:'external',animation:action.animation||facts.names[0],model:{...action.model,availableAnimations:facts.names,provenance:{...action.model.provenance,...facts,names:undefined}}});row.accepted.push(original.command);}catch(e){row.rejected.push({command:original.command,error:String(e)});}
 }
 if(!records.length)continue;
 // This action metadata never substitutes idle models, coordinates or masks.
 const actionScene={...candidate.scene,actionContract:{protocol:'noname-source-actions/3',records,acceptance:'representative-runtime-validation'},viewport:{policy:'actions-only'}};
 const next={...installed,actionScene};await fs.writeFile(out+'/entries/'+id+'.json',JSON.stringify(next));row.beforeSHA256=sha(await fs.readFile(root+'/entries/'+id+'.json'));row.afterSHA256=sha(JSON.stringify(next));
}
await fs.writeFile(out+'/impact.json',JSON.stringify({entries:rows.filter(r=>r.accepted.length).length,commands:rows.reduce((n,r)=>n+r.accepted.length,0),rows},null,2));console.log(JSON.stringify({entries:rows.filter(r=>r.accepted.length).length,commands:rows.reduce((n,r)=>n+r.accepted.length,0),rejected:rows.filter(r=>r.rejected.length).length}));
if(process.env.SKIN_ACTION_DELIVER==='1'){
 await fs.mkdir(out+'/rollback',{recursive:true});
 for(const r of rows.filter(r=>r.accepted.length)){const file=root+'/entries/'+r.id+'.json',old=await fs.readFile(file);if(sha(old)!==r.beforeSHA256)throw Error('Entry changed during delivery');await fs.writeFile(out+'/rollback/'+r.id+'.json',old,{flag:'wx'});await fs.copyFile(out+'/entries/'+r.id+'.json',file+'.r09.tmp');await fs.rename(file+'.r09.tmp',file);}
 console.log('Delivered actions-only metadata; idle models unchanged.');
}
