import {lib, game, get} from 'noname';
import {save} from '../util/config.js';
import {getSkinService, refreshCharacterSkins} from './index.js';
import {createSkinManagement, managedPortrait, managedSelection, managedDefault, managedToken, skinEnabled, registerBaseSkins} from './management.js';
import {skinSets,skinSetCharacters} from './setCatalog.js';
import {migrateKeySkinManagement} from './keyMigration.js';
import {archiveSkinEntries,recoverSkinEntries} from './setFiles.js';

registerBaseSkins(skinSets);
let management,packSnapshot,packCache;
export function managedCharacterName(id){const name=get.translation(id);return skinSetCharacters[id]?.displayName||(name!==id?name:skinSetCharacters[id]?.name||id);}
export function managedCharacterNames(id){return [managedCharacterName(id),get.translation(id),skinSetCharacters[id]?.name];}
export function managedCharacterSex(id){return get.character(id).sex||skinSetCharacters[id]?.sex;}
function skinPacks(){
 const sources=Object.entries(lib.characterPack||{}).map(([id,pack])=>({id,pack,count:Object.keys(pack).length}));
 if(packSnapshot&&sources.length===packSnapshot.length&&sources.every((source,index)=>source.id===packSnapshot[index].id&&source.pack===packSnapshot[index].pack&&source.count===packSnapshot[index].count))return packCache;
 const groups=sources.map(({id,pack})=>({id,name:String(get.translation(id+'_character_config')||id).replace(/<[^>]*>/g,''),characters:Object.keys(pack)}));
 for(const set of skinSets){
  const known=groups.find(group=>group.characters.some(id=>set.entries[id]));
  if(known){known.id='set:'+set.pack;known.name=set.pack;known.characters=[...new Set([...known.characters,...Object.keys(set.entries)])];continue;}
  const id='set:'+set.pack,group=groups.find(group=>group.id===id);
  if(group)group.characters=[...new Set([...group.characters,...Object.keys(set.entries)])];
  else groups.push({id,name:set.pack,characters:Object.keys(set.entries)});
 }
 packSnapshot=sources;packCache=groups;return groups;
}
export function getSkinManagement() {
 if(management)return management;
 management=createSkinManagement({config:()=>lib.config,save:(key,value)=>save(key,'config',value),sets:skinSets,packs:skinPacks,archive:archiveSkinEntries,recover:recoverSkinEntries,
  refresh(){getSkinService().invalidate();refreshCharacterSkins();game.localDynamicSkinTestHub?.invalidateCatalog();game.localDynamicSkinTestHub?.refresh();},
  exists:path=>new Promise(resolve=>{const image=new Image();const done=value=>{clearTimeout(timer);image.onload=image.onerror=null;resolve(value);};const timer=setTimeout(()=>done(false),8000);image.onload=()=>done(true);image.onerror=()=>done(false);image.src=lib.assetURL+path;}),
 });
 if(lib.config.skin_management&&lib.config.skin_management.keyResourceLayout!==2){
  management.ready=management.migrate(migrateKeySkinManagement);
  management.ready.catch(error=>console.warn('键社皮肤设置迁移失败',error));
 }else management.ready=Promise.resolve();
 return management;
}
export async function setSkinSystemEnabled(enabled){
 await save('change_skin','config',enabled);lib.config.change_skin=enabled;
 refreshCharacterSkins();game.localDynamicSkinTestHub?.refresh();
}
export function managementCharacters() {
 const groups=getSkinManagement().listPacks().map(group=>({...group,characters:group.characters.filter(id=>!get.character(id).isUnseen)}));
 const all={id:'all',name:'全部武将 / 跨包搭配',characters:[...new Set(groups.flatMap(group=>group.characters))]};
 return [all,...groups];
}
export const relatedCharacters=characters=>{
 const sets=getSkinManagement().listSets();
 return [...new Set(characters.flatMap(id=>[id,...(lib.characterSubstitute[id]||[]).map(row=>row[0]),...sets.flatMap(set=>Object.keys(set.entries[id]?.variants||{}))]))];
};

/** Integrate at the existing adapter boundary so selection, previews and avatars agree. */
export function connectSkinManagement() {
 if(game.qhly_skinManagementReady)return;
 const manager=getSkinManagement();
 const oldGet=game.qhly_getSkin, oldFile=game.qhly_getSkinFile, oldList=game.qhly_getSkinList, oldSet=game.qhly_setCurrentSkin, oldInfo=game.qhly_getSkinInfo;
 const entry=(name,token)=>manager.assetForToken(name,token)||manager.listSets().find(set=>managedToken(set.id)===token)?.entries[name];
 game.qhly_getDefaultSkin=name=>managedDefault(lib.config,name);
 game.qhly_skinAllowed=(name,token)=>{
  if(!token)return true;
  const selected=managedSelection(lib.config,name);
  const dynamic=(selected?.token===token&&selected.dynamic)||game.qhly_hasDynamicSkin?.(name,token)||game.localDynamicSkinTestHub?.owns(name,token);
  return skinEnabled(lib.config,name,dynamic?'dynamic':'static',token) && skinEnabled(lib.config,name,dynamic?'dynamic':'static',game.qhly_getSkinFile(name,token));
 };
 game.qhly_getSkin=function(name){
  const selection=managedSelection(lib.config,name);
  const token=selection?selection.token:oldGet.call(this,name);
  return game.qhly_skinAllowed(name,token)?token:null;
 };
 game.qhly_getSkinFile=function(name,token){
  const selected=managedSelection(lib.config,name);
  if(token&&selected?.token===token&&selected.path)return selected.path;
  const fallback=managedDefault(lib.config,name);
  if(token&&fallback?.token===token&&fallback.path)return fallback.path;
  return entry(name,token)?.path || (!token&&get.character(name).img) || oldFile.call(this,name,token);
 };
 game.qhly_isManagedSkin=(name,token)=>!!token&&(!!entry(name,token)||managedSelection(lib.config,name)?.token===token||managedDefault(lib.config,name)?.token===token);
 game.qhly_getSkinInfo=function(name,token,...rest){const fallback=managedDefault(lib.config,name);const row=entry(name,token)||(token&&fallback?.token===token?fallback:null);return row?{translation:row.name,name:row.name,info:row.id?(row.set?'套装补充原画':'游离原画'):'皮肤套装',level:row.dynamic?'动态':'静态',skill:{}}:oldInfo.call(this,name,token,...rest);};
 game.qhly_getManagedSkinList=(name,callback,...rest)=>oldList.call(game,name,(ok,files)=>{
  const extra=manager.listSets().filter(set=>set.entries[name]&&!set.entries[name].classic).map(set=>managedToken(set.id));
  extra.push(...manager.listAssets(name).map(asset=>asset.token));
  const selected=managedSelection(lib.config,name);if(selected?.token&&selected.path)extra.push(selected.token);
  const fallback=managedDefault(lib.config,name);if(fallback?.token&&fallback.path)extra.push(fallback.token);
  callback(ok||!!extra.length,[...new Set([...(files||[]),...extra])]);
 },...rest);
 game.qhly_getSkinList=function(name,callback,...rest){return game.qhly_getManagedSkinList(name,(ok,files)=>callback(ok,files.filter(file=>game.qhly_skinAllowed(name,file))),...rest);};
 game.qhly_getSkinList._skinManager=true;
 const revisions=new Map();
 game.qhly_setCurrentSkin=function(name,token,callback,...rest){
  const revision=(revisions.get(name)||0)+1;revisions.set(name,revision);
  const set=manager.listSets().find(set=>managedToken(set.id)===token&&set.entries[name]);
  const selected=managedSelection(lib.config,name);
  const fallback=managedDefault(lib.config,name);
  // Browsing individual skins does not replace the default chosen by Apply Set.
  const asset=manager.assetForToken(name,token);
  const choice=asset?{...asset,assetId:asset.id}:set?{...set.entries[name],set:set.id,token}:token&&fallback?.token===token?fallback:null;
  const operation=choice?manager.select(name,choice,relatedCharacters([name])):token&&selected?.token===token?Promise.resolve():manager.clear(relatedCharacters([name]),{keepDefault:true}).then(()=>new Promise(resolve=>oldSet.call(this,name,token,resolve,...rest)));
  return operation.then(()=>{
   if(revisions.get(name)!==revision)return false;
   refreshCharacterSkins();const current=game.qhly_getSkin(name);game.qhly_refresh?.(name,current);
   if(set)for(const listener of lib.qhly_callbackList||[])listener.onChangeSkin?.(name,current);
   callback?.();return true;
  },error=>{console.warn('皮肤选择失败',error);if(revisions.get(name)===revision)callback?.(error);return false;});
 };
 game.qhly_skinManagementReady=true;
}

export function captureSkinEntries(characters) {
 const result={};
 for(const id of relatedCharacters(characters)){
  const selection=managedSelection(lib.config,id);
  if(selection){result[id]=structuredClone(selection);if(!result[id].dynamic)delete result[id].token;continue;}
  const token=game.qhly_getSkin?.(id),path=managedPortrait(lib.config,id);
  if(token&&game.qhly_hasDynamicSkin?.(id,token))result[id]={name:game.qhly_getSkinName(id,token),token,path:game.qhly_getSkinFile(id,token),dynamic:true};
  else result[id]=path?{name:lib.config.skin[id]?.[0]||'自定义皮肤',path}:{classic:true,name:'经典形象'};
 }
 return result;
}
