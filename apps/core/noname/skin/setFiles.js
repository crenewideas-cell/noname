import {game,lib} from 'noname';
import {openLargeArchive} from '../ui/workshop/largeArchive.js';
import {normalizeSkinPath} from './service.js';

const imageFile=/\.(png|jpe?g|webp|gif|avif)$/i;
const maxImageBytes=40*1024*1024;
const mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',avif:'image/avif'};
const newId=()=>crypto.randomUUID();
async function read(path){
 try{return await game.promises.readFile(path);}catch{
  // Bundled extensions can be served through an alias rather than a disk folder.
  const response=await fetch(lib.assetURL+path);if(!response.ok)throw Error('原画无法归档：'+path);
  return response.arrayBuffer();
 }
}
async function write(path,data){
 if(typeof game.writeFile!=='function')throw Error('当前环境未连接文件服务，无法保存皮肤');
 const slash=path.lastIndexOf('/');
 await new Promise((resolve,reject)=>game.writeFile(data,path.slice(0,slash),path.slice(slash+1),error=>{
  if(error&&(error instanceof Error||error.code||error.type==='error'))reject(Error('保存皮肤失败：'+(error.message||path)));else resolve();
 }));
}
async function validateImage(blob){
 if(!blob.size||blob.size>maxImageBytes)throw Error('单张皮肤应为不超过 40 MB 的图片');
 const url=URL.createObjectURL(blob);
 try{await new Promise((resolve,reject)=>{
  const image=new Image(),timer=setTimeout(()=>finish(Error('图片读取超时')),15000);
  function finish(error){clearTimeout(timer);image.onload=image.onerror=null;error?reject(error):resolve();}
  image.onload=()=>finish(image.naturalWidth&&image.naturalHeight?null:Error('无效的皮肤图片'));
  image.onerror=()=>finish(Error('图片损坏或格式不受支持'));image.src=url;
 });}finally{URL.revokeObjectURL(url);}
}
export async function saveSkinImage(blob,filename){
 const suffix=filename.match(imageFile)?.[1]?.toLowerCase();if(!suffix)throw Error('请选择 PNG、JPG、WebP、GIF 或 AVIF 图片');
 await validateImage(blob);
 const path=`image/skin-sets/user/${newId()}.${suffix}`;
 await write(path,await blob.arrayBuffer());
 return {name:filename.split('/').pop().replace(imageFile,''),path};
}
const normalizeName=value=>String(value).normalize('NFKC').replace(/<[^>]*>/g,'').replace(/\s+/g,'').toLowerCase();
/** Exact IDs win over names. Ambiguous matches remain unassigned for review. */
function characterMatcher(characters,nameOf){
 const ids=new Map(),names=new Map();
 const add=(map,key,id)=>{key=normalizeName(key);const matches=map.get(key)||[];if(!matches.includes(id))matches.push(id);map.set(key,matches);};
 for(const id of characters){add(ids,id,id);for(const name of [nameOf(id)].flat())if(name)add(names,name,id);}
 return filename=>{
  const segments=filename.replace(/\\/g,'/').split('/'),stem=segments.pop().replace(imageFile,''),candidates=[stem,...segments.reverse()].map(normalizeName);
  for(const candidate of candidates)if(ids.has(candidate))return ids.get(candidate);
  for(const candidate of candidates)if(names.has(candidate))return names.get(candidate);
  return [];
 };
}
export function matchSkinCharacter(filename,characters,nameOf){
 return characterMatcher(characters,nameOf)(filename);
}
export async function readSkinArchive(file,characters,nameOf){
 const archive=await openLargeArchive(file),rows=[],match=characterMatcher(characters,nameOf);
 for(const [path,entry]of archive.entries){
  if(entry.dir||!imageFile.test(path)||path.startsWith('__MACOSX/')||path.split('/').some(part=>part.startsWith('.')))continue;
  const matches=match(path);
  rows.push({path,matches,character:matches.length===1?matches[0]:'',read:async()=>{
   const blob=await archive.read(path,maxImageBytes),suffix=path.match(imageFile)[1].toLowerCase();
   return new Blob([blob],{type:mime[suffix]});
  }});
 }
 if(!rows.length)throw Error('压缩包中没有可导入的皮肤图片');
 return rows;
}
/** Archive copies, never move a shared/base asset out from under another set. */
export async function archiveSkinEntries(set,entries){
 const directory=`temp/skin-sets-trash/${Date.now()}-${newId()}`,files={};
 const paths=[...new Set(Object.values(entries).flatMap(entry=>entry.classic?[]:[entry.path,...Object.values(entry.variants||{})]).filter(Boolean))];
 for(const original of paths){
  const path=normalizeSkinPath(original);if(!path)throw Error('无法归档此原画路径：'+original);
  const data=await read(path);
  const backup=`${directory}/${newId()}.${path.match(imageFile)?.[1]||'jpg'}`;
  await write(backup,data);files[path]=backup;
 }
 await write(directory+'/restore.json',JSON.stringify({version:1,set:{...set,entries},files,deletedAt:new Date().toISOString()},null,2));
 return {directory,files};
}
export async function recoverSkinEntries(item){
 const entries=structuredClone(item.entries),paths=new Map();
 for(const entry of Object.values(entries)){
  if(entry.classic)continue;
  for(const path of [entry.path,...Object.values(entry.variants||{})].filter(Boolean)){
   if(paths.has(path))continue;
   const backup=item.files?.[path]||path;
   const data=await read(backup),destination=`image/skin-sets/user/${newId()}.${path.match(imageFile)?.[1]||'jpg'}`;
   await write(destination,data);paths.set(path,destination);
  }
 }
 for(const entry of Object.values(entries)){
  if(paths.has(entry.path))entry.path=paths.get(entry.path);
  for(const [id,path]of Object.entries(entry.variants||{}))if(paths.has(path))entry.variants[id]=paths.get(path);
 }
 return entries;
}
