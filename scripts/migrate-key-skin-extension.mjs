import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const core=path.resolve('apps/core');
const previous=path.join(core,'image/skin-sets/key');
const root=path.join(core,'extension/packs/键社');
const target=path.join(root,'image/skin-sets');
const hash=data=>createHash('sha256').update(data).digest('hex');
const manifest=JSON.parse(await fs.readFile(path.join(process.argv.includes('--consume')?target:previous,'manifest.json'),'utf8'));
if(process.argv.includes('--consume')){
 for(const row of manifest.allocations){
  if(hash(await fs.readFile(path.join(target,row.destination)))!==row.sha256)throw Error('目标图片校验失败');
  if(hash(await fs.readFile(path.join(target,row.originalDestination)))!==row.originalSha256)throw Error('旧套装图片校验失败');
  try{if(hash(await fs.readFile(path.join(previous,path.basename(row.destination))))!==row.sha256)throw Error('旧目录图片已改变');}catch(error){if(error.code!=='ENOENT')throw error;}
 }
 for(const row of manifest.allocations){
  const file=path.resolve(previous,path.basename(row.destination));
  if(!file.startsWith(previous+path.sep))throw Error('清理超出旧皮肤目录');
  await fs.unlink(file).catch(error=>{if(error.code!=='ENOENT')throw error;});
 }
 await fs.unlink(path.join(previous,'manifest.json')).catch(error=>{if(error.code!=='ENOENT')throw error;});
 await fs.rmdir(previous); // Only remove the now-empty, explicitly named directory.
 console.log('已清理旧的本体皮肤目录');
}else{
 await fs.mkdir(path.join(target,'original'),{recursive:true});
 await fs.mkdir(path.join(target,'new'),{recursive:true});
 manifest.pack='键社';manifest.resourceRoot='extension/键社/image/skin-sets/';
 const current=manifest.sets.find(set=>set.id==='key-key-studio'),old=manifest.sets.find(set=>set.id==='key-original');
 for(const row of manifest.allocations){
  const filename=path.basename(row.destination),data=await fs.readFile(path.join(previous,row.destination));
  if(hash(data)!==row.sha256)throw Error('源图校验失败：'+filename);
  row.destination='new/'+filename;
  row.originalDestination='original/'+row.character+'.jpg';
  const original=await fs.readFile(path.join(core,'image/character',row.originalId+'.jpg'));
  row.originalSha256=hash(original);
  for(const [dest,bytes] of [[row.destination,data],[row.originalDestination,original]]){
   const full=path.join(target,dest);
   try{await fs.writeFile(full,bytes,{flag:'wx'});}catch(error){if(error.code!=='EEXIST'||hash(await fs.readFile(full))!==hash(bytes))throw error;}
  }
  current.entries[row.character].path=manifest.resourceRoot+row.destination;
  old.entries[row.character].path=manifest.resourceRoot+row.originalDestination;
 }
 for(const set of manifest.sets){
  set.name=set.id==='key-original'?'键社 · 旧版皮肤':'键社 · 键社新装';set.pack='键社';
  set.entries.key_umi.variants={key_umi2:set.entries.key_umi2.path};
 }
 await fs.writeFile(path.join(target,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 const list=await fs.readdir(path.join(root,'image/skin-sets/new'));
 console.log('迁移完成：新图',list.length,'张，旧图',manifest.allocations.length,'张，均在键社扩展内');
}
