import {lib, game, get} from 'noname';
import {save} from '../util/config.js';
import {getSkinService, refreshCharacterSkins} from './index.js';
import {createSkinManagement, managedPortrait, managedSelection, managedToken, skinEnabled} from './management.js';
import {skinSets,skinSetCharacters} from './setCatalog.js';
import {migrateKeySkinManagement} from './keyMigration.js';

let management;
export function managedCharacterName(id){const name=get.translation(id);return skinSetCharacters[id]?.displayName||(name!==id?name:skinSetCharacters[id]?.name||id);}
export function managedCharacterSex(id){return get.character(id).sex||skinSetCharacters[id]?.sex;}
export function getSkinManagement() {
 if(management)return management;
 management=createSkinManagement({config:()=>lib.config,save:(key,value)=>save(key,'config',value),sets:skinSets,
  refresh(){getSkinService().invalidate();refreshCharacterSkins();game.localDynamicSkinTestHub?.refresh();},
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
 const groups=new Map();
 for(const [key,pack] of Object.entries(lib.characterPack||{})){
  const name=get.translation(key+'_character_config')||key;
  groups.set(key,{id:key,name,characters:Object.keys(pack).filter(id=>!get.character(id).isUnseen)});
 }
 // Keep installed cosmetic sets manageable even when their gameplay pack is disabled.
 for(const set of getSkinManagement().listSets())if(![...groups.values()].some(group=>group.characters.some(id=>set.entries[id]))){
  const key='set:'+set.pack;
  const group=groups.get(key)||{id:key,name:set.pack,characters:[]};
  group.characters=[...new Set([...group.characters,...Object.keys(set.entries)])];groups.set(key,group);
 }
 const all={id:'all',name:'全部武将 / 跨包搭配',characters:[...new Set([...groups.values()].flatMap(group=>group.characters))]};
 return [all,...groups.values()];
}
export const relatedCharacters=characters=>[...new Set(characters.flatMap(id=>[id,...(lib.characterSubstitute[id]||[]).map(row=>row[0]),...getSkinManagement().listSets().flatMap(set=>Object.keys(set.entries[id]?.variants||{}))]))];

/** Integrate at the existing adapter boundary so selection, previews and avatars agree. */
export function connectSkinManagement() {
 if(game.qhly_skinManagementReady)return;
 const manager=getSkinManagement();
 const oldGet=game.qhly_getSkin, oldFile=game.qhly_getSkinFile, oldList=game.qhly_getSkinList, oldSet=game.qhly_setCurrentSkin, oldInfo=game.qhly_getSkinInfo;
 const entry=(name,token)=>manager.listSets().find(set=>managedToken(set.id)===token)?.entries[name];
 game.qhly_skinAllowed=(name,token)=>{
  if(!token)return true;
  const dynamic=game.qhly_hasDynamicSkin?.(name,token);
  return skinEnabled(lib.config,name,dynamic?'dynamic':'static',token) && skinEnabled(lib.config,name,dynamic?'dynamic':'static',game.qhly_getSkinFile(name,token));
 };
 game.qhly_getSkin=function(name){
  const selection=managedSelection(lib.config,name);
  const token=selection?selection.token:oldGet.call(this,name);
  return game.qhly_skinAllowed(name,token)?token:null;
 };
 game.qhly_getSkinFile=function(name,token){return entry(name,token)?.path || oldFile.call(this,name,token);};
 game.qhly_getSkinInfo=function(name,token,...rest){const row=entry(name,token);return row?{translation:row.name,name:row.name,info:'皮肤套装',level:'静态',skill:{}}:oldInfo.call(this,name,token,...rest);};
 game.qhly_getManagedSkinList=(name,callback,...rest)=>oldList.call(game,name,(ok,files)=>{
  const extra=manager.listSets().filter(set=>set.entries[name]&&!set.entries[name].classic).map(set=>managedToken(set.id));
  callback(ok||!!extra.length,[...new Set([...(files||[]),...extra])]);
 },...rest);
 game.qhly_getSkinList=function(name,callback,...rest){return game.qhly_getManagedSkinList(name,(ok,files)=>callback(ok,files.filter(file=>game.qhly_skinAllowed(name,file))),...rest);};
 game.qhly_getSkinList._skinManager=true;
 game.qhly_setCurrentSkin=function(name,token,callback,...rest){
  const set=manager.listSets().find(set=>managedToken(set.id)===token&&set.entries[name]);
  const operation=set?manager.applySet(set.id,[name]):manager.clear(relatedCharacters([name])).then(()=>new Promise(resolve=>oldSet.call(this,name,token,resolve,...rest)));
  return operation.then(()=>{refreshCharacterSkins();game.qhly_refresh?.(name,game.qhly_getSkin(name));callback?.();},error=>{console.warn('皮肤选择失败',error);callback?.();});
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
