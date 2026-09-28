import {normalizeSkinPath, savedSkinPath} from './service.js';
import {keySkinPath} from './keyMigration.js';

export const managementKey = 'skin_management';
export const managedToken = set => `套装 · ${set}.jpg`;
export const assetToken = id => `自定义原画 · ${id}.jpg`;
const safeId = id => typeof id === 'string' && id.length > 0 && !['__proto__','constructor','prototype'].includes(id);
// The immutable base collection is independent of the user's applied default.
const initialDefaults=new Map();
export function registerBaseSkins(sets){
 for(const set of sets.filter(set=>set.base))for(const [id,entry]of Object.entries(set.entries))initialDefaults.set(id,{...entry,set:set.id,token:entry.classic?null:managedToken(set.id)});
}
export function skinEnabled(config, character, kind, skin) {
 const state=config[managementKey];
 return !state?.disabled?.[kind]?.[character] && !(skin && state?.hidden?.[character]?.[skin]);
}
export function managedSelection(config, character) {
 return config[managementKey]?.selections?.[character] || (!config.skin?.[character]&&!config.qhly_skinset?.skin?.[character]?initialDefaults.get(character):undefined);
}
// Older saves kept only the applied selection. Treat an existing set choice as
// its default until the next write materializes the separate defaults map.
export function managedDefault(config, character) {
 const state=config[managementKey];
 return (state?.defaults===undefined ? (state?.selections?.[character]?.set ? state.selections[character] : undefined) : state.defaults[character]) || initialDefaults.get(character);
}
export function managedPortrait(config, character) {
 const entry=managedSelection(config,character);
 const path=keySkinPath(entry ? (entry.classic?null:normalizeSkinPath(entry.path)) : savedSkinPath(config.skin?.[character]));
 return skinEnabled(config,character,'static',path) && (!entry?.token || skinEnabled(config,character,'static',entry.token)) ? path : null;
}

/** One serialized, durable configuration write per batch. No original art is overwritten. */
export function createSkinManagement({config, save, refresh=()=>{}, exists=async()=>true, sets=[], packs=()=>[], archive=async()=>null, recover=async item=>item.entries}) {
 const catalog=new Map(sets.map(set=>[set.id,set]));
 const emptyState={};
 let queue=Promise.resolve(),catalogVersion=0,definitionCache,definitionGroups,definitionVersion,viewCache,viewState,viewDefinitions;
 function update(edit) {
  const job=queue.then(async()=>{
   const state=structuredClone(config()[managementKey] || {version:2});
   state.selections ||= {};state.disabled ||= {};state.hidden ||= {};state.presets ||= [];
   state.defaults ??= Object.fromEntries(Object.entries(state.selections).filter(([,entry])=>entry.set).map(([id,entry])=>[id,structuredClone(entry)]));
   state.setEdits ||= {};state.deletedSets ||= {};state.trash ||= [];
   state.assets ||= {};
   state.dynamicAssignments ||= {};state.dynamicMeta ||= {};
   const result=await edit(state);
   await save(managementKey,state);
   config()[managementKey]=state;
   refresh();return result;
  });
  queue=job.catch(()=>{});return job;
 }
 const ids=characters=>[...new Set(characters)].filter(safeId);
 const listPacks=()=>packs();
 function definitions(){
  const groups=listPacks();
  if(definitionCache&&definitionGroups===groups&&definitionVersion===catalogVersion)return definitionCache;
  const result=[...catalog.values()].map(set=>({...set,packId:set.packId||groups.find(group=>group.name===set.pack||group.characters.some(id=>set.entries[id]))?.id||'set:'+set.pack}));
  for(const group of groups){
   let base=result.find(set=>set.packId===group.id&&set.base);
   if(!base){base={id:'base:'+group.id,name:group.name+' · 基础套装',pack:group.name,packId:group.id,base:true,entries:{}};result.push(base);}
   base.entries={...Object.fromEntries(group.characters.map(id=>[id,{classic:true,name:'基础原画'}])),...base.entries};
   base.name=group.name+' · 基础套装';
   if(!result.some(set=>set.packId===group.id&&set.firstExtension))result.push({id:'extension:'+group.id,name:group.name+' · 扩展套装 1',pack:group.name,packId:group.id,firstExtension:true,entries:{}});
  }
  definitionGroups=groups;definitionVersion=catalogVersion;definitionCache=result;return result;
 }
 function listSets(state=config()[managementKey]||emptyState){
  const groups=listPacks(),defined=definitions(),cacheable=state===(config()[managementKey]||emptyState);
  if(cacheable&&viewCache&&viewState===state&&viewDefinitions===defined)return viewCache;
  const result=[...defined,...(state.presets||[]).map(set=>({...set,packId:set.packId||groups.find(group=>group.name===set.pack)?.id||'all'}))]
   .filter(set=>set.base||set.firstExtension||!state.deletedSets?.[set.id]).map(set=>{
    if(set.base)return structuredClone(set);
    const edit=state.setEdits?.[set.id],entries={...set.entries};
    for(const [id,entry]of Object.entries(edit?.entries||{})){if(entry===null)delete entries[id];else entries[id]=entry;}
    return structuredClone({...set,name:edit?.name||set.name,entries});
   });
  // Read-only catalog views prevent a caller from bypassing base-set protection.
  const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
  freeze(result);
  if(cacheable){viewCache=result;viewState=state;viewDefinitions=defined;}
  return result;
 }
 const findSet=(id,state)=>{const set=listSets(state).find(set=>set.id===id);if(!set)throw Error('套装不存在');return set;};
 const baseFor=(set,character,state,all=listSets(state))=>all.find(base=>base.base&&(base.packId===set.packId||set.packId==='all')&&base.entries[character]);
 function resolveEntry(set,character,state,all=listSets(state)){
  const base=baseFor(set,character,state,all),entry=set.entries[character]||base?.entries[character];
  if(!entry)return null;
  return {...entry,set:set.id,token:entry.classic?null:entry.dynamic&&entry.token?entry.token:managedToken(set.id),fallback:!set.entries[character]};
 }
 function effectiveEntries(set,state){
  const all=listSets(state),characters=new Set([...all.filter(base=>base.base&&(base.packId===set.packId||set.packId==='all')).flatMap(base=>Object.keys(base.entries)),...Object.keys(set.entries)]);
  const result=Object.fromEntries([...characters].map(id=>[id,resolveEntry(set,id,state,all)]));
  for(const [id,entry]of Object.entries(result))for(const [form,path]of Object.entries(entry?.variants||{}))if(safeId(form)&&!set.entries[form])result[form]={name:entry.name,path,set:set.id,token:entry.token,parent:id};
  return result;
 }
 function reconcile(state,setId,removed){
  const set=removed||findSet(setId,state),effective=removed?null:effectiveEntries(set,state),all=listSets(state);
  for(const field of ['selections','defaults'])for(const [id,entry]of Object.entries(state[field]))if(entry.set===setId){
   if(!removed&&entry.assetId&&state.assets?.[entry.assetId])continue;
   const base=baseFor(set,id,state,all);
   state[field][id]=structuredClone(effective?.[id]||(base&&resolveEntry(base,id,state,all))||{classic:true,name:'基础原画',token:null});
  }
 }
 const editable=(id,state)=>{const set=findSet(id,state);if(set.base)throw Error('基础套装及其内容不可修改或删除');return set;};
 function assetRows(state=config()[managementKey]||{}){
  return Object.values(state.assets||{}).filter(asset=>!asset.set||!state.deletedSets?.[asset.set]).map(asset=>({...asset,token:assetToken(asset.id)}));
 }
 function resetAssetSelections(state,id){
  for(const field of ['selections','defaults'])for(const [character,entry]of Object.entries(state[field]))if(entry.assetId===id){
   const base=listSets(state).find(set=>set.base&&set.entries[character]);
   state[field][character]=base?resolveEntry(base,character,state):{classic:true,name:'基础原画',token:null};
  }
 }
 async function validateEntries(entries){
  for(const [id,entry]of Object.entries(entries))if(!safeId(id)||!entry||typeof entry!=='object')throw Error('无效的武将皮肤');
  const paths=[...new Set(Object.values(entries).flatMap(entry=>entry.classic?[]:[entry.path,...Object.values(entry.variants||{})]))];
  for(let i=0;i<paths.length;i+=6)await Promise.all(paths.slice(i,i+6).map(async path=>{if(!normalizeSkinPath(path)||!await exists(path))throw Error('皮肤无法加载，未更改任何选择：'+path);}));
 }
 async function applySet(id, characters) {
  return update(async state=>{
   const set=findSet(id,state),effective=effectiveEntries(set,state);
   const targets=characters?ids(characters):Object.keys(effective);
   const entries=targets.filter(name=>effective[name]).map(name=>[name,effective[name]]);
   if(!entries.length)throw Error('所选武将不在此套装中');
   await validateEntries(Object.fromEntries(entries));
   for(const [name,entry] of entries){
    const selection={...entry,set:id,token:entry.classic?null:entry.token||managedToken(id)};
    state.selections[name]=selection;
    state.defaults[name]=structuredClone(selection);
    delete state.disabled[entry.dynamic?'dynamic':'static']?.[name];delete state.hidden[name]?.[selection.token];delete state.hidden[name]?.[entry.path];
    for(const [form,path] of Object.entries(entry.variants||{}))if(safeId(form)){
     state.selections[form]=structuredClone(effective[form]||{name:entry.name,path,set:id,token:selection.token,parent:name});
     state.defaults[form]=structuredClone(state.selections[form]);
     delete state.disabled.static?.[form];delete state.hidden[form]?.[path];delete state.hidden[form]?.[selection.token];
    }
   }
   return entries.length;
  });
 }
 return {
  listSets, listPacks, applySet,
  getSet:id=>findSet(id),
  assignDynamic(plan,mode='append'){return update(state=>{
   if(!['append','replace'].includes(mode))throw Error('无效分配方式');
   const allowed=new Set(listPacks().flatMap(pack=>pack.characters));
   for(const row of plan){
    if(!allowed.has(row.character)||!Array.isArray(row.skins))throw Error('无效分配目标');
    for(const skin of row.skins)if(!safeId(skin.id)||!safeId(skin.pack)||/[\\/]/.test(skin.pack))throw Error('无效动态资源');
    const previous=state.dynamicAssignments[row.character],skins=mode==='replace'?[]:previous?.skins||[];
    const unique=new Map([...skins,...row.skins].map(skin=>[JSON.stringify([skin.pack,skin.id]),{pack:skin.pack,id:skin.id}]));
    state.dynamicAssignments[row.character]={mode:mode==='replace'?'replace':previous?.mode||'append',skins:[...unique.values()]};
    if(mode==='replace')for(const field of ['selections','defaults']){
     const current=state[field][row.character],legacy=field==='selections'&&config().qhly_skinset?.skin?.[row.character];
     const keepsToken=token=>!!token&&row.skins.some(skin=>skin.token===token);
     if((current?.dynamic&&!unique.has(JSON.stringify([current.pack,current.id]))&&!keepsToken(current.token))||(!current&&typeof legacy==='string'&&legacy.startsWith('本地 · ')&&!keepsToken(legacy))){
      const base=listSets(state).find(set=>set.base&&set.entries[row.character]);
      state[field][row.character]=base?resolveEntry(base,row.character,state):{classic:true,name:'基础原画',token:null};
     }
    }
   }
  });},
  activateDynamic(rows){return update(async state=>{
   for(const row of rows)if(!state.dynamicAssignments[row.character]?.skins.some(skin=>skin.pack===row.entry.pack&&skin.id===row.entry.id))throw Error('此动皮尚未绑定到目标武将');
   await validateEntries(Object.fromEntries(rows.map(row=>[row.character,row.entry])));
   for(const {character,entry}of rows){
    state.selections[character]=structuredClone(entry);delete state.disabled.dynamic?.[character];
    delete state.hidden[character]?.[entry.path];delete state.hidden[character]?.[entry.token];
   }
  });},
  labelDynamic(keys,metadata){return update(state=>{
   if(metadata.sex&&!['male','female','double','unknown'].includes(metadata.sex))throw Error('无效性别分类');
   for(const key of keys)state.dynamicMeta[key]={...state.dynamicMeta[key],...metadata};
  });},
  listAssets:character=>assetRows().filter(asset=>!character||asset.character===character),
  assetForToken:(character,token)=>assetRows().find(asset=>asset.character===character&&asset.token===token),
  importLoose(rows){return update(async state=>{
   const allowed=new Set(listPacks().flatMap(pack=>pack.characters));
   for(const row of rows){if(!allowed.has(row.character))throw Error('武将不存在：'+row.character);await validateEntries({[row.character]:row.entry});}
   for(const row of rows){const id=crypto.randomUUID();state.assets[id]={...structuredClone(row.entry),id,character:row.character};}
   return rows.length;
  });},
  moveAsset(id,character,setId=null,replace=false){return update(state=>{
   const asset=state.assets[id];if(!asset)throw Error('原画不存在');
   if(!listPacks().some(pack=>pack.characters.includes(character)))throw Error('目标武将不存在');
   if(asset.set)editable(asset.set,state);
   const target=setId?editable(setId,state):null;
   if(target&&target.packId!=='all'&&!listPacks().find(pack=>pack.id===target.packId)?.characters.includes(character))throw Error('目标武将不属于此套装的将包');
   resetAssetSelections(state,id);
   const entry={name:asset.name,path:asset.path};
   if(target&&replace){
    const previous=target.entries[character];
    if(previous&&!previous.classic){const oldId=crypto.randomUUID();state.assets[oldId]={...structuredClone(previous),id:oldId,character};delete state.assets[oldId].set;delete state.assets[oldId].token;}
    const edit=state.setEdits[setId]||={};edit.entries||={};edit.entries[character]=entry;
    delete state.assets[id];reconcile(state,setId);
   }else state.assets[id]={...entry,id,character,...(setId?{set:setId}:{})};
  });},
  detachEntry(setId,character){return update(state=>{
   const set=editable(setId,state),entry=set.entries[character];if(!entry||entry.classic)throw Error('此武将没有可剥离的原画');
   const id=crypto.randomUUID();state.assets[id]={...structuredClone(entry),id,character};delete state.assets[id].set;delete state.assets[id].token;
   const edit=state.setEdits[setId]||={};edit.entries||={};edit.entries[character]=null;
   reconcile(state,setId);return id;
  });},
  renameAsset(id,name){return update(state=>{const entry=state.assets[id];if(!entry)throw Error('原画不存在');if(entry.set)editable(entry.set,state);if(!name.trim())throw Error('请填写原画名称');entry.name=name.trim();for(const selected of Object.values(state.selections))if(selected.assetId===id)selected.name=entry.name;});},
  deleteAsset(id){return update(async state=>{
   const asset=state.assets[id];if(!asset)throw Error('原画不存在');if(asset.set)editable(asset.set,state);
   const set=asset.set?findSet(asset.set,state):{id:'loose',name:'游离原画',entries:{}},entries={[asset.character]:asset};
   const backup=await archive(set,entries);
   state.trash.push({id:crypto.randomUUID(),kind:'asset',asset:structuredClone(asset),set,entries,location:backup?.directory||backup,files:backup?.files,time:Date.now()});
   resetAssetSelections(state,id);delete state.assets[id];return backup?.directory||backup;
  });},
  resolveEntry:(id,character)=>resolveEntry(findSet(id),character),
  renameSet(id,name){return update(state=>{editable(id,state);if(!name.trim())throw Error('请填写套装名称');(state.setEdits[id]||={}).name=name.trim();});},
  putEntries(id,entries){return update(async state=>{
   const set=editable(id,state),allowed=new Set(listPacks().filter(pack=>pack.id===set.packId||set.packId==='all').flatMap(pack=>pack.characters));
   if(Object.keys(entries).some(id=>!allowed.has(id)))throw Error('导入的武将不属于此套装的扩展包');
   await validateEntries(entries);
   const edit=state.setEdits[id]||={};edit.entries||={};
   for(const [character,entry]of Object.entries(entries))edit.entries[character]=structuredClone(entry);
   reconcile(state,id);
  });},
  deleteEntries(id,characters){return update(async state=>{
   const set=editable(id,state),entries=Object.fromEntries(ids(characters).filter(id=>set.entries[id]).map(id=>[id,set.entries[id]]));
   const extras=assetRows(state).filter(asset=>asset.set===id&&characters.includes(asset.character)),archiveEntries={...entries};
   if(!Object.keys(entries).length&&!extras.length)throw Error('所选武将在此套装中没有可删除的皮肤');
   for(const asset of extras)archiveEntries['asset:'+asset.id]=asset;
   const backup=await archive(set,archiveEntries),location=backup?.directory||backup;
   state.trash.push({id:crypto.randomUUID(),kind:'entries',set:structuredClone(set),entries,extras,location,files:backup?.files,time:Date.now()});
   for(const asset of extras){resetAssetSelections(state,asset.id);delete state.assets[asset.id];}
   const edit=state.setEdits[id]||={};edit.entries||={};
   for(const character of Object.keys(entries))edit.entries[character]=null;
   // A parent skin may refer to a deleted form; remove that edge as well.
   for(const [character,entry]of Object.entries(set.entries))if(!Object.hasOwn(entries,character)&&Object.keys(entry.variants||{}).some(form=>Object.hasOwn(entries,form))){
    const next=structuredClone(entry);for(const form of Object.keys(entries))delete next.variants[form];edit.entries[character]=next;
   }
   reconcile(state,id);return location;
  });},
  deleteSet(id){return update(async state=>{
   const set=editable(id,state);if(set.firstExtension)throw Error('第一套扩展套装必须保留，可删除其中的皮肤');
   const extras=assetRows(state).filter(asset=>asset.set===id),archiveEntries={...set.entries};
   for(const asset of extras)archiveEntries['asset:'+asset.id]=asset;
   const backup=await archive(set,archiveEntries),location=backup?.directory||backup;
   state.trash.push({id:crypto.randomUUID(),kind:'set',set:structuredClone(set),entries:structuredClone(set.entries),extras,location,files:backup?.files,time:Date.now()});
   for(const asset of extras){resetAssetSelections(state,asset.id);delete state.assets[asset.id];}
   state.deletedSets[id]=true;reconcile(state,id,set);return location;
  });},
  listTrash:()=>structuredClone(config()[managementKey]?.trash||[]),
  restoreTrash(id){return update(async state=>{
   const item=state.trash.find(item=>item.id===id);if(!item)throw Error('归档记录不存在');
   const entries=await recover(item);await validateEntries(entries);
   if(item.kind==='asset'){
    const asset={...item.asset,...entries[item.asset.character]};if(asset.set&&state.deletedSets[asset.set])delete asset.set;
    state.assets[asset.id]=asset;state.trash=state.trash.filter(entry=>entry.id!==id);return;
   }
   if(item.kind==='set'||state.deletedSets[item.set.id]){
    delete state.deletedSets[item.set.id];
    if(!listSets(state).some(set=>set.id===item.set.id))state.presets.push(item.set);
   }
   editable(item.set.id,state);
   const edit=state.setEdits[item.set.id]||={};edit.entries||={};Object.assign(edit.entries,structuredClone(entries));
   for(const asset of item.extras||[]){const restored=await recover({...item,entries:{[asset.character]:asset}});state.assets[asset.id]={...asset,...restored[asset.character]};}
   state.trash=state.trash.filter(entry=>entry.id!==id);reconcile(state,item.set.id);
  });},
  select(character,entry,related=[character]){
   return update(async state=>{
    if(!safeId(character))throw Error('无效武将');
    const variants={};
    if(entry&&!entry.classic&&(!normalizeSkinPath(entry.path)||!await exists(entry.path)))throw Error('皮肤无法加载，已保留当前形象：'+entry.path);
    // Ordinary skin folders may only provide some of a general's forms.
    for(const [id,path] of Object.entries(entry?.variants||{}))if(safeId(id)&&normalizeSkinPath(path)&&await exists(path))variants[id]=path;
    for(const id of ids(related))state.selections[id]={classic:true,name:'经典形象',token:null};
    if(entry){
     state.selections[character]={...entry,variants,token:entry.classic?null:entry.token||entry.path.split('/').pop()};
     delete state.disabled.static?.[character];
     delete state.hidden[character]?.[entry.path];delete state.hidden[character]?.[state.selections[character].token];
     for(const [id,path] of Object.entries(variants))if(safeId(id)){
      state.selections[id]={name:entry.name,path,set:entry.set,parent:character,token:state.selections[character].token};
      delete state.disabled.static?.[id];delete state.hidden[id]?.[path];delete state.hidden[id]?.[state.selections[character].token];
     }
    }
   });
  },
  registerSets(sets){
   // Reloading an installed skin extension replaces its definitions by stable ID.
   for(const set of sets)if(!safeId(set?.id)||!set.entries||typeof set.entries!=='object')throw Error('无效的皮肤套装');
   for(const set of sets)catalog.set(set.id,{...catalog.get(set.id),...structuredClone(set)});
   catalogVersion++;registerBaseSkins([...catalog.values()]);
   refresh();
  },
  migrate(rewrite){return update(state=>Object.assign(state,rewrite(state)));},
  setEnabled(characters,kind,enabled){
   if(!['static','dynamic'].includes(kind))return Promise.reject(Error('未知皮肤类型'));
   return update(state=>{state.disabled[kind] ||= {};for(const id of ids(characters)){if(enabled)delete state.disabled[kind][id];else state.disabled[kind][id]=true;}});
  },
  setSkinsEnabled(character,skins,enabled){
   if(!safeId(character))return Promise.reject(Error('无效武将'));
   return update(state=>{
    const apply=(id,skin)=>{if(!safeId(id)||!safeId(skin))return;state.hidden[id] ||= {};if(enabled)delete state.hidden[id][skin];else state.hidden[id][skin]=true;};
    for(const skin of skins.filter(safeId)){
     apply(character,skin);
     for(const set of listSets())if(managedToken(set.id)===skin)for(const [form,path] of Object.entries(set.entries[character]?.variants||{})){apply(form,skin);apply(form,path);}
    }
   });
  },
  clear(characters,{keepDefault=false}={}){return update(state=>{for(const id of ids(characters)){delete state.selections[id];if(!keepDefault)delete state.defaults[id];}});},
  restoreDefault(characters){return update(state=>{
   for(const id of ids(characters)){
    const entry=state.defaults[id]||initialDefaults.get(id)||{classic:true,name:'基础原画',token:null};
    state.selections[id]=structuredClone(entry);
    delete state.disabled[entry.dynamic?'dynamic':'static']?.[id];
    delete state.hidden[id]?.[entry.token];delete state.hidden[id]?.[entry.path];
   }
  });},
  classic(characters){return update(state=>{for(const id of ids(characters))state.selections[id]={classic:true,name:'经典形象',token:null};});},
  savePreset(name,pack,entries={}){
   if(!name.trim())return Promise.reject(Error('请填写套装名称'));
   return update(async state=>{
    await validateEntries(entries);
    const group=listPacks().find(group=>group.id===pack||group.name===pack);
    if(!group&&pack!=='all')throw Error('扩展包不存在');
    const id='custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
    const snapshots=structuredClone(entries);for(const entry of Object.values(snapshots)){delete entry.assetId;if(!entry.dynamic)delete entry.id;delete entry.character;}
    state.presets.push({id,name:name.trim(),pack:group?.name||'跨包搭配',packId:group?.id||'all',entries:snapshots});return id;
   });
  },
 };
}
