import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root='apps/core/extension/ui/动态皮肤验证扩展';
const catalog=JSON.parse(await fs.readFile(root+'/catalog.json','utf8'));
const refs=new Set(),report={samples:catalog.entries.length,groups:{},types:{},missing:[],voiceReferences:0,uniqueVoiceFiles:0};
const voiceFiles=new Set();
const json=async file=>JSON.parse(await fs.readFile(path.join(root,file),'utf8'));
function add(file){refs.add(file.replaceAll('\\','/'));}
for(const e of catalog.entries){
 report.groups[e.testCategory]=(report.groups[e.testCategory]||0)+1;report.types[e.type]=(report.types[e.type]||0)+1;
 add(e.thumbnail);if(e.prefab)add(e.prefab);if(e.controller)add(e.controller);
 if(e.voiceFile){add(e.voiceFile);for(const v of await json(e.voiceFile)){add(v.file);voiceFiles.add(v.file);report.voiceReferences++;}}
 if(e.model){
  add(e.model);const model=await json(e.model),dir=path.posix.dirname(e.model),f=model.FileReferences;
  for(const file of [f.Moc,f.Physics,f.Pose,f.DisplayInfo,...f.Textures,...Object.values(f.Motions||{}).flat().flatMap(m=>[m.File,m.Sound]),...(f.Expressions||[]).map(x=>x.File)].filter(Boolean))add(path.posix.join(dir,file));
 }
 for(const m of e.models||[]){
  add(m.skeleton);add(m.atlas);
  const atlas=await fs.readFile(path.join(root,m.atlas),'utf8');
  for(const line of atlas.split(/\r?\n/).filter(l=>/\.(png|jpe?g|webp)$/i.test(l.trim())))add(path.posix.join(path.posix.dirname(m.atlas),line.trim()));
 }
}
for(const file of refs){try{assert.ok((await fs.stat(path.join(root,file))).size>0);}catch{report.missing.push(file);}}
report.uniqueVoiceFiles=voiceFiles.size;report.uniqueDependencies=refs.size;
report.sourceMissingLayers=await json('名将杀源参数缺失图层.json');
await fs.mkdir('output/dynamic-samples',{recursive:true});await fs.writeFile('output/dynamic-samples/dependency-report.json',JSON.stringify(report,null,2)+'\n');
console.log(report);assert.equal(report.samples,64);assert.deepEqual(report.missing,[]);
