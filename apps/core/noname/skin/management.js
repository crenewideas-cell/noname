import {normalizeSkinPath, savedSkinPath} from './service.js';
import {keySkinPath} from './keyMigration.js';

export const managementKey = 'skin_management';
export const managedToken = set => `套装 · ${set}.jpg`;
const safeId = id => typeof id === 'string' && id.length > 0 && !['__proto__','constructor','prototype'].includes(id);
export function skinEnabled(config, character, kind, skin) {
 const state=config[managementKey];
 return !state?.disabled?.[kind]?.[character] && !(skin && state?.hidden?.[character]?.[skin]);
}
export function managedSelection(config, character) { return config[managementKey]?.selections?.[character]; }
export function managedPortrait(config, character) {
 const entry=managedSelection(config,character);
 const path=keySkinPath(entry ? (entry.classic?null:normalizeSkinPath(entry.path)) : savedSkinPath(config.skin?.[character]));
 return skinEnabled(config,character,'static',path) && (!entry?.token || skinEnabled(config,character,'static',entry.token)) ? path : null;
}

/** One serialized, durable configuration write per batch. No original art is overwritten. */
export function createSkinManagement({config, save, refresh=()=>{}, exists=async()=>true, sets=[]}) {
 const catalog=new Map(sets.map(set=>[set.id,set]));
 let queue=Promise.resolve();
 function update(edit) {
  const job=queue.then(async()=>{
   const state=structuredClone(config()[managementKey] || {version:1});
   state.selections ||= {};state.disabled ||= {};state.hidden ||= {};state.presets ||= [];
   const result=await edit(state);
   await save(managementKey,state);
   config()[managementKey]=state;
   refresh();return result;
  });
  queue=job.catch(()=>{});return job;
 }
 const ids=characters=>[...new Set(characters)].filter(safeId);
 const listSets=()=>[...catalog.values(),...(config()[managementKey]?.presets||[])];
 async function applySet(id, characters) {
  return update(async state=>{
   const set=listSets().find(set=>set.id===id);if(!set)throw Error('套装不存在');
   const targets=characters?ids(characters):Object.keys(set.entries);
   const entries=targets.filter(name=>set.entries[name]).map(name=>[name,set.entries[name]]);
   if(!entries.length)throw Error('所选武将不在此套装中');
   const paths=[...new Set(entries.flatMap(([,entry])=>entry.classic?[]:[entry.path,...Object.values(entry.variants||{})]).filter(Boolean))];
   // Limit concurrent image decodes even for very large extension packs.
   for(let i=0;i<paths.length;i+=6){
    await Promise.all(paths.slice(i,i+6).map(async path=>{if(!normalizeSkinPath(path)||!await exists(path))throw Error('皮肤无法加载，未更改任何选择：'+path);}));
   }
   for(const [name,entry] of entries){
    const selection={...entry,set:id,token:entry.classic?null:entry.token||managedToken(id)};
    state.selections[name]=selection;
    delete state.disabled[entry.dynamic?'dynamic':'static']?.[name];delete state.hidden[name]?.[selection.token];delete state.hidden[name]?.[entry.path];
    for(const [form,path] of Object.entries(entry.variants||{}))if(safeId(form)){
     state.selections[form]={name:entry.name,path,set:id,token:selection.token};
     delete state.disabled.static?.[form];delete state.hidden[form]?.[path];delete state.hidden[form]?.[selection.token];
    }
   }
   return entries.length;
  });
 }
 return {
  listSets, applySet,
  registerSets(sets){
   // Reloading an installed skin extension replaces its definitions by stable ID.
   for(const set of sets)if(!safeId(set?.id)||!set.entries||typeof set.entries!=='object')throw Error('无效的皮肤套装');
   for(const set of sets)catalog.set(set.id,structuredClone(set));
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
  clear(characters){return update(state=>{for(const id of ids(characters))delete state.selections[id];});},
  classic(characters){return update(state=>{for(const id of ids(characters))state.selections[id]={classic:true,name:'经典形象',token:null};});},
  savePreset(name,pack,entries){
   if(!name.trim()||!Object.keys(entries).length)return Promise.reject(Error('请填写套装名称并选择武将'));
   return update(state=>{
    const id='custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
    state.presets.push({id,name:name.trim(),pack,entries:structuredClone(entries)});return id;
   });
  },
 };
}
