import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spine} from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';
import {createLegacyParser,usesSpine36} from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const audit=JSON.parse(await fs.readFile(path.join(run,'all-base-models.json')));
const failed=new Set(audit.failures.map(f=>f.file));
const entries=inventory.entries.filter(e=>e.pack==='无名杀基础扩展');
const affectedByFailure=entries.filter(e=>(e.catalog?.models||[]).some(m=>failed.has(m.skeleton)));
await fs.writeFile(path.join(run,'scope-adjustment.json'),JSON.stringify({date:new Date().toISOString(),authorization:'用户：37个失败的可以直接跳过，先抓主要矛盾；实在不行直接踢掉',originalSkinCount:inventory.entries.length,failedModels:failed.size,deferredSkinCount:affectedByFailure.length,deferredSkinIds:affectedByFailure.map(e=>e.id),deletedSkinCount:0,remainingPriorityCount:inventory.entries.length-affectedByFailure.length,policy:'暂缓失败模型的恢复工作，保留冻结4934分母及原目录；尚未删除任何素材或条目，暂缓项不计验收通过。'},null,2));
const models=new Map();for(const e of entries)for(const m of [...e.catalog?.models||[],...e.effective?.models||[]])if(usesSpine36(m)){const key=m.skeleton+'\0'+m.atlas;if(!models.has(key))models.set(key,{...m,skinIds:[]});const record=models.get(key);if(!record.skinIds.includes(e.id))record.skinIds.push(e.id);}
const rows=[];let index=0;const list=[...models.values()],root='apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展';
await Promise.all(Array.from({length:6},async()=>{while(index<list.length){const m=list[index++];const row={skeleton:m.skeleton,atlas:m.atlas,skinIds:m.skinIds};try{
 const [bytes,text]=await Promise.all([fs.readFile(path.join(root,m.skeleton)),fs.readFile(path.join(root,m.atlas),'utf8')]);
 row.hash=createHash('sha256').update(bytes).digest('hex');const atlas=new spine.TextureAtlas(text,()=>({setFilters(){},setWraps(){},getImage(){return{width:4096,height:4096};}}));
 const data=createLegacyParser(spine,atlas,m).readSkeletonData(bytes);row.linkedMeshes=[];
 for(const skin of data.skins)for(const [slot,attachments] of skin.attachments.entries())for(const [name,a] of Object.entries(attachments||{}))if(a instanceof spine.MeshAttachment&&a.parentMesh)row.linkedMeshes.push({skin:skin.name,slot,name,parent:a.parentMesh.name,inheritDeform:a.inheritDeform});
 row.status='decoded';
 }catch(error){row.status='failed';row.error=String(error);}rows.push(row);}}));
rows.sort((a,b)=>a.skeleton.localeCompare(b.skeleton));const affected=rows.filter(r=>r.linkedMeshes?.some(m=>m.inheritDeform));
const skinIds=[...new Set(affected.flatMap(r=>r.skinIds))].sort();
const report={rule:'legacy-linked-mesh-deform-inheritance',totalModels:list.length,checked:rows.length,failed:rows.filter(r=>r.status==='failed').length,affectedModels:affected.length,affectedSkins:skinIds.length,skinIds,models:rows};
await fs.writeFile(path.join(run,'linked-deform-impact.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,models:undefined,skinIds:undefined}));
