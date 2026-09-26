import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import {createLegacyParser} from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';
import ts from 'typescript';
const local=await fs.readFile('apps/core/extension/ui/十周年局内UI/vendor/spine.js','utf8');
const reference=await fs.readFile('output/dynamic-proportions/reference-spine36.js','utf8');
function runtime(source){const c=vm.createContext({console,Float32Array,Uint8Array,Int16Array,Uint16Array,DataView,Math,ArrayBuffer,window:{},navigator:{}});vm.runInContext(source.replace(/export\s*\{\s*spine\s*\};?/g,''),c);return c.spine;}
const current=runtime(local),official=runtime(reference);
// The published 3.6 build predates clipping; compile that attachment from the
// official 3.6 source so its enum does not desynchronize binary parsing.
const clippingFile='output/dynamic-runtime-audit/ClippingAttachment.ts';
await fs.mkdir(path.dirname(clippingFile),{recursive:true});
let clipping;
try{clipping=await fs.readFile(clippingFile,'utf8');}catch{
 const response=await fetch('https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/3.6/spine-ts/core/src/attachments/ClippingAttachment.ts');
 if(!response.ok)throw Error('Cannot load official clipping reference');clipping=await response.text();await fs.writeFile(clippingFile,clipping);
}
vm.runInNewContext(ts.transpileModule(clipping,{compilerOptions:{target:ts.ScriptTarget.ES2015,module:ts.ModuleKind.None}}).outputText,{spine:official,VertexAttachment:official.VertexAttachment});
official.AttachmentType.Clipping=6;
official.AtlasAttachmentLoader.prototype.newClippingAttachment=function(skin,name){return new official.ClippingAttachment(name);};
official.Color.rgba8888ToColor=(color,value)=>current.Color.rgba8888ToColor(color||{},value);
official.Color.rgb888ToColor=current.Color.rgb888ToColor;
// The official 3.6 JS package has no binary reader. Reuse the binary reader,
// but compare all animation, bone, constraint and mesh evaluation independently.
let binary=local.slice(local.indexOf('\tvar SkeletonBinary ='),local.indexOf('\tvar Skin ='));
binary=binary.slice(0,binary.lastIndexOf('})(spine || (spine = {}));'));
const OriginalSkin=official.Skin;
official.Skin=class extends OriginalSkin {constructor(name){super(name);this.bones=[];this.constraints=[];}setAttachment(...args){this.addAttachment(...args);}};
vm.runInNewContext('(function(spine){'+binary+'})(spine)',{spine:official,DataView,Float32Array,Int16Array,Uint8Array,Math});
const root='apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展';
const catalog=JSON.parse(await fs.readFile(root+'/catalog.json'));
const models=[...new Map(catalog.entries.filter(e=>e.available!==false&&e.type==='spine36').flatMap(e=>e.models).filter(m=>/^3\.6\./.test(m.version)).map(m=>[m.skeleton,m])).values()];
const prior=process.argv.includes('--failed')?JSON.parse(await fs.readFile('output/dynamic-runtime-audit/geometry.json')):[];
const selected=process.argv.includes('--all')?models:process.argv.includes('--failed')?models.filter(m=>prior.some(r=>r.model===m.skeleton&&r.error)):models.filter(m=>/司马懿|卢弈|神荀彧|曹操/.test(m.skeleton));
const report=[];
for(const model of selected){
 if(report.length%100===0)console.log('audit',report.length,'/',selected.length,model.skeleton);
 try{
 const bytes=new Uint8Array(await fs.readFile(root+'/'+model.skeleton)),atlas=await fs.readFile(root+'/'+model.atlas,'utf8');
 const texture={setFilters(){},setWraps(){},getImage(){return{width:2048,height:2048}}};
 const skeletons=[current,official].map(s=>vm.runInNewContext('const a=new s.TextureAtlas(atlas,()=>texture),parser=createLegacyParser(s,a,model),data=parser.readSkeletonData(bytes);const skeleton=new s.Skeleton(data),state=new s.AnimationState(new s.AnimationStateData(data));if(data.animations.length)state.setAnimation(0,data.animations.find(a=>a.name===model.animation)?.name||data.animations[0].name,true);({skeleton,state,format:parser.skinTableFormat})',{s,atlas,texture,bytes,model,createLegacyParser},{timeout:2000}));
 let maxError=0,slot='',samples=0;
 for(const dt of [0,.033,.25,.5,1]){
  for(const {skeleton,state} of skeletons)vm.runInNewContext('state.update(dt);state.apply(skeleton);skeleton.updateWorldTransform();',{skeleton,state,dt},{timeout:2000});
  for(let n=0;n<skeletons[0].skeleton.slots.length;n++){
   const vertices=skeletons.map(({skeleton})=>{const slot=skeleton.slots[n],a=slot.attachment;if(!a?.region)return null;const v=new Float32Array(a.worldVerticesLength||8);if(a.worldVerticesLength)a.computeWorldVertices(slot,0,a.worldVerticesLength,v,0,2);else a.computeWorldVertices(slot.bone,v,0,2);return v;});
   if(!vertices[0]||!vertices[1])continue;
   for(let i=0;i<vertices[0].length;i++){const e=Math.abs(vertices[0][i]-vertices[1][i]);samples++;if(e>maxError){maxError=e;slot=skeletons[0].skeleton.slots[n].data.name;}}
  }
 }
 report.push({model:model.skeleton,maxError,slot,samples,format:skeletons[0].format,skins:skeletons[0].skeleton.data.skins.length});
 }catch(e){report.push({model:model.skeleton,error:e.stack});}
}
await fs.mkdir('output/dynamic-runtime-audit',{recursive:true});
if(prior.length)report.push(...prior.filter(r=>!selected.some(m=>m.skeleton===r.model)));
await fs.writeFile('output/dynamic-runtime-audit/geometry.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({models:report.length,errors:report.filter(r=>r.error).slice(0,3),differences:report.filter(r=>r.maxError>.01).slice(0,15),maxError:Math.max(...report.map(r=>r.maxError||0))},null,2));



