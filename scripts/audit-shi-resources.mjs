import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spine} from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';
import {createLegacyParser} from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';

const root='apps/core/extension/imports/本地动态皮肤包/势武将资源补充';
const manifest=JSON.parse(fs.readFileSync(root+'/resource-manifest.json'));
for(const file of manifest.files){
 assert.equal(createHash('sha256').update(fs.readFileSync(file.destination)).digest('hex'),file.sha256,file.destination);
 assert.ok(!file.destination.endsWith('.js'),'No legacy executable imports');
}
const results=[];
for(const model of manifest.effects){
 const row={skeleton:model.skeleton,available:false};
 try{
  const atlas=new spine.TextureAtlas(fs.readFileSync(root+'/'+model.atlas,'utf8'),()=>({setFilters(){},setWraps(){},getImage(){return{width:4096,height:4096}}}));
  const data=createLegacyParser(spine,atlas,model).readSkeletonData(new Uint8Array(fs.readFileSync(root+'/'+model.skeleton)));
  Object.assign(row,{available:true,bones:data.bones.length,animations:data.animations.map(a=>({name:a.name,duration:a.duration}))});
 }catch(error){row.error=error.message;}
 results.push(row);
}
fs.mkdirSync('output/shi-resource-import',{recursive:true});
fs.writeFileSync('output/shi-resource-import/parsed-effects.json',JSON.stringify(results,null,2));
// A sidecar marks incomplete source effects without deleting their original bytes.
fs.writeFileSync(root+'/effect-validation.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({verifiedFiles:manifest.files.length,parsed:results.filter(r=>r.available).length,failures:results.filter(r=>!r.available)},null,2));
