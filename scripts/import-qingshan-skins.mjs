import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash, randomInt} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=path.resolve('apps/core/extension/packs/怒焰三国');
const source=path.resolve('temp/静态皮肤_青山抚媚');
const output=path.join(root,'image/skin-sets');
const manifestPath=path.join(output,'manifest.json');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const fixed=new Set(['canghaiyizhu.jpg','nysgs_bulianshi.jpg','nysgs_caifuren.jpg','nysgs_dongxie.jpg','nysgs_shen_zhenji.jpg','nysgs_xinxianying.jpg','nysgs_zhenji.jpg','nysgs_zhenji_shadow.jpg']);
const read=async file=>fs.readFile(file);
async function characterMetadata(ids){
 const translations=await fs.readFile(path.join(root,'character/translate.js'),'utf8');
 const names=Object.fromEntries([...translations.matchAll(/^\s*(\w+):\s*"([^"\r\n]+)",?\s*$/gm)].map(match=>[match[1],match[2]]));
 return Object.fromEntries(ids.map(id=>{const base=id.replace(/_(shadow|canghaiyizhu)$/,'');return [id,{name:names[id]||(names[base]?names[base]+' · 形态':names[id.replace('nysgs_jie_','nysgs_')]?'界 · '+names[id.replace('nysgs_jie_','nysgs_')]:id),sex:'female',form:id!==base}];}));
}
if(process.argv.includes('--metadata')){
 const manifest=JSON.parse(await read(manifestPath));manifest.characters=await characterMetadata(Object.keys(manifest.sets.find(set=>set.id==='nuyan-qingshan').entries));
 await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
}else if(process.argv.includes('--consume')){
 const manifest=JSON.parse(await read(manifestPath));
 // Verify the entire imported set before consuming even one source file.
 for(const item of manifest.allocations){
  if(digest(await read(path.join(output,item.destination)))!==item.sha256)throw Error('导入校验失败：'+item.destination);
  if(item.originalDestination&&digest(await read(path.join(root,item.originalDestination)))!==item.sha256)throw Error('补全原画校验失败：'+item.originalDestination);
  if(item.random){
   const from=path.resolve(source,item.source);
   if(!from.startsWith(source+path.sep))throw Error('来源超出暂存目录');
   try{if(digest(await read(from))!==item.sha256)throw Error('源文件已变化：'+from);}catch(e){if(e.code!=='ENOENT')throw e;}
  }
 }
 for(const item of manifest.allocations.filter(item=>item.random)){
  const from=path.resolve(source,item.source);
  if(!from.startsWith(source+path.sep))throw Error('来源超出暂存目录');
  await fs.unlink(from).catch(e=>{if(e.code!=='ENOENT')throw e;});
 }
 console.log('已移除已校验的随机分配源文件；其余资源保留。');
}else{
 try{await fs.access(manifestPath);throw Error('分配清单已存在，禁止重新随机分配。');}catch(e){if(e.code!=='ENOENT')throw e;}
 const code=(await fs.readFile(path.join(root,'character/character.js'),'utf8')).replace(/import.*?;\s*/,'').replace('export default characters;','globalThis.result=characters;');
 const context={lib:{config:{},characterReplace:{}}};vm.runInNewContext(code,context);
 const formsCode=(await fs.readFile(path.join(root,'character/characterSubstitute.js'),'utf8')).replace('export default characterSubstitutes;','globalThis.result=characterSubstitutes;');
 const formContext={};vm.runInNewContext(formsCode,formContext);
 const fileKey=file=>file.toLowerCase().replaceAll('_','');
 const originals=new Map((await fs.readdir(path.join(root,'image/character'))).map(file=>[fileKey(file),file]));
 const oldRoot=path.resolve('temp/怒焰三国旧版皮肤');
 const oldFiles=new Map((await fs.readdir(oldRoot)).map(file=>[fileKey(file),file]));
 const female=Object.entries(context.result).filter(([,info])=>info.sex==='female' && originals.has(fileKey(info.trashBin.find(x=>x.startsWith('ext:')).split('/').pop())));
 const slots=new Map();
 const add=(id,file)=>{file=file.toLowerCase();if(!slots.has(file))slots.set(file,[]);if(!slots.get(file).includes(id))slots.get(file).push(id);};
 for(const [id,info] of female){add(id,info.trashBin.find(x=>x.startsWith('ext:')).split('/').pop());for(const [form,tags] of formContext.result[id]||[])add(form,tags.find(x=>x.endsWith('.jpg')).split('/').pop());}
 const pool=[];
 for(const group of await fs.readdir(source,{withFileTypes:true}))if(group.isDirectory())for(const file of await fs.readdir(path.join(source,group.name)))if(/\.(png|jpe?g|webp)$/i.test(file))pool.push(path.join(group.name,file));
 const initialCount=pool.length;
 for(let i=pool.length-1;i>0;i--){const j=randomInt(i+1);[pool[i],pool[j]]=[pool[j],pool[i]];}
 const manifest={version:1,pack:'怒焰三国',femaleCharacters:female.length,initialSourceCount:initialCount,allocations:[],sets:[]};
 const oldSet={id:'nuyan-original',name:'怒焰三国 · 旧版皮肤',pack:'怒焰三国',entries:{}};
 const newSet={id:'nuyan-qingshan',name:'怒焰三国 · 青山抚媚',pack:'怒焰三国',entries:{}};
 const used=new Set();
 for(const [file,ids] of slots){
  const random=!fixed.has(file);
  let relative,bytes;
  if(random){do{relative=pool.pop();if(!relative)throw Error('没有足够的独立图片');bytes=await read(path.join(source,relative));}while(used.has(digest(bytes)));}
  else {relative=originals.get(fileKey(file));if(!relative)throw Error('指定原图缺失：'+file);bytes=await read(path.join(root,'image/character',relative));}
  const sha256=digest(bytes);used.add(sha256);
  const destination='qingshan/'+file.replace(/\.jpg$/i,path.extname(relative).toLowerCase());
  const oldFile=oldFiles.get(fileKey(file));
  const oldBytes=oldFile?await read(path.join(oldRoot,oldFile)):execFileSync('git',['show','HEAD:apps/core/extension/packs/怒焰三国/image/character/'+originals.get(fileKey(file))],{maxBuffer:30*1024*1024});
  const oldDestination='original/'+file;
  for(const [dest,data] of [[destination,bytes],[oldDestination,oldBytes]]){await fs.mkdir(path.dirname(path.join(output,dest)),{recursive:true});await fs.writeFile(path.join(output,dest),data);}
  const url=dest=>'extension/怒焰三国/image/skin-sets/'+dest;
  for(const id of ids){newSet.entries[id]={name:'青山抚媚',path:url(destination)};oldSet.entries[id]={name:'旧版皮肤',path:url(oldDestination)};}
  manifest.allocations.push({characters:ids,source:relative.replaceAll('\\','/'),random,destination,sha256});
 }
 // Forms travel with their general when a single character is selected.
 for(const set of [oldSet,newSet])for(const [id] of female){const variants={};for(const [form] of formContext.result[id]||[])if(set.entries[form])variants[form]=set.entries[form].path;if(Object.keys(variants).length)set.entries[id].variants=variants;}
 manifest.sets=[oldSet,newSet];manifest.randomAssigned=manifest.allocations.filter(x=>x.random).length;
 manifest.characters=await characterMetadata(Object.keys(newSet.entries));
 manifest.remainingSourceCount=initialCount-manifest.randomAssigned;
 await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({femaleCharacters:female.length,portraits:slots.size,fixed:slots.size-manifest.randomAssigned,random:manifest.randomAssigned,remaining:manifest.remainingSourceCount}));
}
