import fs from 'node:fs/promises';
const file='scripts/dynamic-experience-actions.mjs';let s=await fs.readFile(file,'utf8');
s=s.replace("import {screenAction}","import vm from 'node:vm';import {spine} from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';import {createLegacyParser} from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';\nimport {screenAction}");
s=s.replace('async function validate(m,animation){',`let modern;
async function animations(m,bytes,atlasText){
 if(m.skeleton.endsWith('.json'))return Object.keys(JSON.parse(bytes).animations||{});
 let api,parser;
 if(/^3\\.6\\./.test(m.version)){api=spine;}else if(/^4\\.0\\./.test(m.version)){
  if(!modern){const c=vm.createContext({console,Float32Array,Uint8Array,Int16Array,Uint16Array,DataView,Math,ArrayBuffer,window:{},navigator:{}});vm.runInContext(await fs.readFile(work+'/reference/spine-webgl-4.0.official.js','utf8'),c);modern=c.spine;}api=modern;
 }else throw Error('unsupported action reader '+m.version);
 const texture={setFilters(){},setWraps(){},getImage(){return{width:4096,height:4096};}},atlas=new api.TextureAtlas(atlasText,()=>texture);
 parser=api===spine?createLegacyParser(api,atlas,m):new api.SkeletonBinary(new api.AtlasAttachmentLoader(atlas));
 const data=parser.readSkeletonData(new Uint8Array(bytes));return data.animations.map(a=>a.name);
}
async function validate(m,animation){`);
const a="const names=m.skeleton.endsWith('.json')?Object.keys(JSON.parse(bytes).animations||{}):a?.fingerprint===fingerprint&&a.status==='parsed'?a.animations.map(x=>x.name):null;";
if(!s.includes(a))throw Error('missing parser change');s=s.replace(a,"const names=a?.fingerprint===fingerprint&&a.status==='parsed'&&a.animations?a.animations.map(x=>x.name):await animations(m,bytes,atlas.toString());");
await fs.writeFile(file+'.tmp',s);await fs.rename(file+'.tmp',file);
