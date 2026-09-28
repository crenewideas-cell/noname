import fs from 'node:fs/promises';
import {createSceneVariantResolver} from './dynamic-scene-variants.mjs';
const root='apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展',out='output/dynamic-remediation/20260926-r01/composition-r08';
const catalog=JSON.parse(await fs.readFile(root+'/catalog.json')),resolver=await createSceneVariantResolver(),results=[];
await fs.mkdir(out+'/paired-entries',{recursive:true});
for(const e of catalog.entries){
 if(e.available===false)continue;
 const models=await resolver.pairedScene(root,e);if(!models)continue;
 const old=JSON.parse(await fs.readFile(root+'/entries/'+e.id+'.json'));
 await fs.writeFile(out+'/paired-entries/'+e.id+'.json',JSON.stringify({...old,models}));
 results.push({id:e.id,title:e.title,character:e.character,priorVariant:!!old.models.at(-1).sceneVariant,coordinates:models.at(-1).sceneCoordinates,variant:models.at(-1).sceneVariant});
 if(results.length%25===0)console.log('candidates',results.length);
}
await fs.writeFile(out+'/paired-candidates.json',JSON.stringify(results,null,2));console.log(JSON.stringify({candidates:results.length,byBone:results.reduce((r,e)=>(r[e.coordinates.bone]=(r[e.coordinates.bone]||0)+1,r),{})}));
