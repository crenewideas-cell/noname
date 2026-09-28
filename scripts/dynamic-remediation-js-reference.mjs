import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {spine as local} from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';
import {createLegacyParser} from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const source=await fs.readFile(path.join(run,'reference/spine-core-3.6.official.js'),'utf8');
const context=vm.createContext({console,Float32Array,Uint8Array,Int16Array,Uint16Array,DataView,Math,ArrayBuffer});vm.runInContext(source,context);const official=context.spine;
const input=JSON.parse(await fs.readFile(path.join(run,'reference/requests.json')));
const java=(await fs.readFile(path.join(run,'reference/comparisons.jsonl'),'utf8')).trim().split('\n').map(JSON.parse);
const targets=new Set(java.filter(r=>r.maxVertexError>.05).map(r=>r.file));
// This bridge shares decoded data, never used as evidence of binary correctness.
// Java already provides a separately implemented binary reader. Here we isolate
// JS runtime arithmetic from Java float/angle-boundary differences.
function clone(value,seen=new Map()){
 if(value===null||typeof value!=='object')return value;if(seen.has(value))return seen.get(value);
 if(ArrayBuffer.isView(value))return value.slice();
 const Type=official[value.constructor?.name];
 const out=Array.isArray(value)?[]:Type?Object.create(Type.prototype):{};seen.set(value,out);
 for(const key of Object.keys(value))out[key]=clone(value[key],seen);return out;
}
const rows=[];
for(const req of input.filter(r=>targets.has(r.file))){const row={file:req.file};try{
 const text=await fs.readFile(req.atlas,'utf8');const atlas=new local.TextureAtlas(text,()=>({setFilters(){},setWraps(){},getImage(){return{width:4096,height:4096};}}));
 const data=createLegacyParser(local,atlas,{skeleton:req.file,version:req.version}).readSkeletonData(await fs.readFile(req.file));
 const other=clone(data);const name=data.animations.find(a=>a.name===req.animation)?.name||data.animations[0]?.name;
 row.maxVertexError=0;row.attachmentDifferences=[];
 for(const t of [0,Math.fround(1/30),.25,.5,1]){
  const rigs=[[local,data],[official,other]].map(([runtime,d])=>{const s=new runtime.Skeleton(d),state=new runtime.AnimationState(new runtime.AnimationStateData(d));if(name){state.setAnimation(0,name,true);state.update(t);state.apply(s);}s.updateWorldTransform();return s;});
  for(let i=0;i<rigs[0].slots.length;i++){const slots=rigs.map(s=>s.slots[i]),attachments=slots.map(s=>s.attachment);if(attachments[0]?.name!==attachments[1]?.name){row.attachmentDifferences.push({time:t,slot:i});continue;}if(!attachments[0]?.computeWorldVertices)continue;
   const values=attachments.map((a,j)=>{const v=new Float32Array(a.worldVerticesLength||8);if(a.worldVerticesLength)a.computeWorldVertices(slots[j],0,v.length,v,0,2);else a.computeWorldVertices(slots[j].bone,v,0,2);return v;});
   for(let j=0;j<values[0].length;j++){const error=Math.abs(values[0][j]-values[1][j]);if(!Number.isFinite(error))throw Error('Nonfinite world vertex');if(error>row.maxVertexError){row.maxVertexError=error;row.difference={time:t,slot:slots[0].data.name,index:j,local:values[0][j],official:values[1][j]};}}
  }
 }row.status='compared';
 }catch(error){row.status='failed';row.error=String(error);}rows.push(row);}
const report={officialURL:'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/654c20e5b0e523040b6366bbd1042510d2645134/spine-ts/build/spine-core.js',sha256:createHash('sha256').update(source).digest('hex'),independence:'Official JS geometry and animation code, shared locally decoded data. Complements independent Java decoding; does not independently certify the decoder or rasterization.',expected:targets.size,checked:rows.length,failed:rows.filter(r=>r.status==='failed').length,different:rows.filter(r=>r.maxVertexError>1e-5||r.attachmentDifferences?.length).length,results:rows};
await fs.writeFile(path.join(run,'reference/javascript-cross-check.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,results:undefined}));
