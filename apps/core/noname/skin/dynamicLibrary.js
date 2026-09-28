import {lib,game,get} from 'noname';
import {readJSON,install} from './localDynamic/bridge.js';
import {dynamicOwners,dynamicKey} from './localDynamic/assignments.js';
import {dynamicSkins} from './dynamicManagement.js';

const root='extension/本地动态皮肤包/';
const url=path=>new URL(root+path,new URL(lib.assetURL||'./',document.baseURI)).href;
let inventory,rowsPromise;
export async function loadDynamicLibrary(progress=()=>{},{reload=false}={}){
 if(reload){inventory=undefined;rowsPromise=undefined;}
 if(rowsPromise)return rowsPromise;
 rowsPromise=(async()=>{
  await dynamicSkins(null);
  const index=inventory ||= await readJSON(url('runtime-index.json')),rows=[];
  for(const [position,pack]of index.packs.entries()){
   progress(`读取动态资源：${pack.name}（${position+1}/${index.packs.length}）`);
   let source;
   try{source=await readJSON(url(pack.name+'/library-index.json'));}catch(error){
    // Older file:// packages may report a missing summary as a parse error.
    // The existing group index remains the authoritative fallback.
    const bindings=await readJSON(url(pack.name+'/binding-index.json')),files=[...new Set(Object.values(bindings))];source=[];
    for(let i=0;i<files.length;i+=8){const batch=await Promise.all(files.slice(i,i+8).map(async file=>(await readJSON(url(pack.name+'/'+file))).map(row=>({...row,bindingGroup:file}))));source.push(...batch.flat());progress(`读取 ${pack.name} 分组 ${Math.min(i+8,files.length)}/${files.length}`);}
   }
   const registered=install({lib,game},pack.name,root+pack.name+'/');
   for(const row of source)rows.push({...row,key:dynamicKey(pack.name,row.entry.id),path:registered.resourcePath+row.entry.thumbnail});
  }
  return [...new Map(rows.map(row=>[row.key,row])).values()];
 })().catch(error=>{rowsPromise=undefined;throw error;});return rowsPromise;
}
export function libraryRows(rows){
 const legacy=lib.config.localDynamicSkinBindings||{},lookup=new Map(rows.map(row=>[row.key,row]));
 const inherited=new Map();for(const [name,binding]of Object.entries(legacy))if(binding&&!binding.automatic){
  const row=lookup.get(dynamicKey(binding.pack,binding.id));if(!row)continue;
  const key=JSON.stringify([binding.pack,row.bindingGroup]);if(!inherited.has(key))inherited.set(key,[]);inherited.get(key).push(name);
 }
 return rows.map(row=>{
  const meta=lib.config.skin_management?.dynamicMeta?.[row.key]||{},natural={...row.entry,characterIds:[...(row.entry.characterIds||[]),...(inherited.get(JSON.stringify([row.pack,row.bindingGroup]))||[])]};
  const sexes=[...new Set((row.entry.characterIds||[]).map(id=>get.character(id)?.sex).filter(Boolean))];
  return {...row,owners:dynamicOwners(lib.config,row.pack,natural),group:meta.group||row.entry.group||row.entry.character||'未分类',sex:meta.sex||(!row.entry.sex||row.entry.sex==='unknown'?(sexes.length===1?sexes[0]:'unknown'):row.entry.sex)};
 });
}
export function previewLibrarySkin(row){
 const hub=game.localDynamicSkinTestHub,dialog=document.createElement('dialog');dialog.className='skin-manager skin-dynamic-preview';
 const title=document.createElement('h2');title.textContent=row.entry.character+' · '+row.entry.title;
 const stage=document.createElement('div');stage.className='skin-dynamic-preview-stage';stage.dataset.qhlyPreviewDynamic='true';
 const close=document.createElement('button');close.textContent='关闭预览';close.onclick=()=>dialog.close();dialog.append(title,stage,close);document.body.append(dialog);dialog.showModal();
 if(!hub.previewResource(stage,row.pack,row.entry))stage.textContent='动态播放已关闭，请开启换肤与动画，并关闭低性能模式后预览。';
 dialog.addEventListener('close',()=>{hub.stopPreview(stage);dialog.remove();},{once:true});
}
const normal=value=>String(value||'').normalize('NFKC').replace(/<[^>]*>/g,'').replace(/[\s·_\-（）()]/g,'').toLowerCase();
const normalizedEntries=new WeakMap();
export function nameScore(row,character,names){
 if(row.entry.characterIds?.includes(character))return 100;
 let normalized=normalizedEntries.get(row.entry);
 if(!normalized){normalized={source:normal(row.entry.character),title:normal(row.entry.title)};normalizedEntries.set(row.entry,normalized);}
 const {source,title}=normalized;
 let score=0;for(const name of [character,...names].filter(Boolean).map(normal)){
  if(name===source)score=Math.max(score,95);
  else if(name.length>=2&&(source.includes(name)||name.includes(source))&&source.length>=2)score=Math.max(score,70);
  else if(name.length>=2&&title.includes(name))score=Math.max(score,50);
 }
 return score;
}
export function randomSample(rows,count){
 const pool=rows.slice(),chosen=[];
 while(pool.length&&chosen.length<count){const bytes=new Uint32Array(1);crypto.getRandomValues(bytes);const i=Math.floor(bytes[0]/4294967296*pool.length);chosen.push(pool[i]);pool[i]=pool.at(-1);pool.pop();}
 return chosen;
}
