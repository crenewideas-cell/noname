import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';

// Add named portraits to the existing set without rerunning random allocation.
const root=path.resolve('apps/core/extension/packs/怒焰三国');
const source=path.resolve('temp/静态皮肤_怒焰三国');
const originals=path.resolve('temp/怒焰三国旧版皮肤');
const output=path.join(root,'image/skin-sets');
const manifestPath=path.join(output,'manifest.json');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const fileKey=file=>file.toLowerCase().replaceAll('_','');
function inside(directory,relative){
 const target=path.resolve(directory,relative);
 if(!target.startsWith(directory+path.sep))throw Error('文件超出指定目录：'+relative);
 return target;
}
async function copyVerified(from,to){
 const bytes=await fs.readFile(from),sha256=digest(bytes);
 await fs.mkdir(path.dirname(to),{recursive:true});
 try{await fs.writeFile(to,bytes,{flag:'wx'});}catch(error){if(error.code!=='EEXIST'||digest(await fs.readFile(to))!==sha256)throw error;}
 if(digest(await fs.readFile(to))!==sha256)throw Error('复制失败：'+to);
 return sha256;
}

const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
const current=manifest.sets.find(set=>set.id==='nuyan-qingshan');
const old=manifest.sets.find(set=>set.id==='nuyan-original');
if(!current||!old)throw Error('缺少怒焰三国新旧套装清单');
const context={lib:{config:{},characterReplace:{}}};
const code=(await fs.readFile(path.join(root,'character/character.js'),'utf8'))
 .replace(/import.*?;\s*/,'').replace('export default characters;','globalThis.result=characters;');
vm.runInNewContext(code,context);
const characters=context.result;
const translations=await fs.readFile(path.join(root,'character/translate.js'),'utf8');
const names=Object.fromEntries([...translations.matchAll(/^\s*(\w+):\s*"([^"\r\n]+)",?\s*$/gm)].map(match=>[match[1],match[2]]));
const aliases={'曹睿':'nysgs_caorui'};
const oldFiles=new Map((await fs.readdir(originals)).map(file=>[fileKey(file),file]));
const baseFiles=new Map((await fs.readdir(path.join(root,'image/character'))).map(file=>[fileKey(file),file]));
const planned=[];
for(const file of await fs.readdir(source)){
 if(!/\.(png|jpe?g|webp)$/i.test(file))continue;
 const sourceName=path.basename(file,path.extname(file));
 const ids=aliases[sourceName]?[aliases[sourceName]]:Object.keys(characters).filter(id=>names[id]?.replace(/^怒焰/,'')===sourceName);
 if(ids.length!==1)throw Error('无法唯一匹配怒焰武将：'+file);
 const id=ids[0];
 if(planned.some(row=>row.id===id))throw Error('重复提供同一武将图片：'+id);
 const from=inside(source,file),sha256=digest(await fs.readFile(from));
 const destination='qingshan/'+id+path.extname(file).toLowerCase();
 const previous=manifest.allocations.find(row=>row.characters.includes(id));
 if(previous&&(previous.sha256!==sha256||previous.destination!==destination))throw Error('已分配武将图片不同，拒绝覆盖：'+id);
 const originalName=characters[id].trashBin.find(tag=>tag.startsWith('ext:')&&/\.(png|jpe?g|webp)$/i.test(tag))?.split('/').pop();
 if(!originalName)throw Error('未找到原画配置：'+id);
 const oldFile=oldFiles.get(fileKey(originalName)),baseFile=baseFiles.get(fileKey(originalName));
 if(!oldFile&&!baseFile)throw Error('未找到旧图：'+id);
 const originalFrom=oldFile?inside(originals,oldFile):inside(path.join(root,'image/character'),baseFile);
 const originalSkinDestination='original/'+id+path.extname(originalFrom).toLowerCase();
 planned.push({id,file,sourceName,from,sha256,destination,originalFrom,originalSkinDestination,previous});
}
for(const row of planned){
 const {id,file,sourceName,from,destination,originalFrom,originalSkinDestination}=row;
 const sha256=await copyVerified(from,inside(output,destination));
 const originalSha256=await copyVerified(originalFrom,inside(output,originalSkinDestination));
 const url=relative=>'extension/怒焰三国/image/skin-sets/'+relative;
 current.entries[id]={name:'青山抚媚',path:url(destination)};
 old.entries[id]={name:'旧版皮肤',path:url(originalSkinDestination)};
 manifest.characters[id]={name:names[id],sex:characters[id].sex,form:!!characters[id].isUnseen};
 if(!row.previous)manifest.allocations.push({characters:[id],source:file,sourceName,sourceDirectory:'temp/静态皮肤_怒焰三国',random:false,destination,sha256,originalSkinDestination,originalSha256,match:aliases[sourceName]?'曹睿／曹叡名称映射':'exact'});
}
manifest.namedAssigned=manifest.allocations.filter(row=>row.sourceDirectory==='temp/静态皮肤_怒焰三国').length;
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
if(process.argv.includes('--consume')){
 // Transfer integrity checks protect the user's source images before removal.
 for(const row of planned){
  if(digest(await fs.readFile(row.from))!==row.sha256||digest(await fs.readFile(inside(output,row.destination)))!==row.sha256)throw Error('源图或目标图发生变化：'+row.file);
 }
 for(const row of planned)await fs.unlink(inside(source,row.file));
}
console.log('怒焰新套装：新增',planned.filter(row=>!row.previous).length,'张；当前共',Object.keys(current.entries).length,'个武将／形态 ID');
console.log(planned.map(row=>row.sourceName+' → '+row.id).join('\n'));
console.log(process.argv.includes('--consume')?'已移除本批已迁移的 temp 源图':'源图已保留');
