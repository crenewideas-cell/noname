import { lib, game, ui, get, ai, _status, getSkinService, refreshCharacterSkins, connectSkinManagement } from 'noname';
import { directories } from './filesystem.js';
import {connectFileIO} from './file-io.js';
import {connectDynamicCore} from './dynamic-core.js';
import sharing from './resource-sharing.json' with {type:'json'};
export { checkFile } from './filesystem.js';

export const resourceRoot = 'extension/手杀标准UI/original/千幻聆音/';
export function fitView(root, view, theme, back, footer) {
 const bodyScale=document.body.getBoundingClientRect().width/document.body.offsetWidth || 1;
 const width=window.innerWidth/bodyScale, height=window.innerHeight/bodyScale;
 Object.assign(root.style,{position:'fixed',zIndex:'100020',left:'0px',top:'0px',transform:'none',width:width+'px',height:height+'px'});
 // Keep the original theme's coordinate system stable while the host changes zoom.
 const designWidth=1600,designHeight=designWidth/(theme.whr||1.7198);
 const scale=Math.min(width/designWidth,height/designHeight);
 const scaleX=lib.config.qhly_layoutFitX?width/designWidth:scale;
 const scaleY=lib.config.qhly_layoutFitY?height/designHeight:scale;
 Object.assign(view.style,{left:'50%',top:'50%',right:'auto',bottom:'auto',margin:'0',width:designWidth+'px',height:designHeight+'px',transform:`translate(-50%,-50%) scale(${scaleX},${scaleY})`});
 if(back)back.style.transform='none';
 if(footer)footer.style.transform='none';
 view.qhlyDynamicLayout?.();
}
export function observeViewport(update) {
 const observer=new ResizeObserver(update);
 observer.observe(document.body);
 observer.observe(document.documentElement);
 const zoom=new MutationObserver(update);
 zoom.observe(document.body,{attributes:true,attributeFilter:['style']});
 return ()=>{observer.disconnect();zoom.disconnect();};
}
export function loadScript(path) {
 if(Array.isArray(path))return path.reduce((previous,item)=>previous.then(()=>loadScript(item)),Promise.resolve());
 return new Promise((resolve, reject) => lib.init.js(path, null, resolve, () => reject(new Error(`千幻脚本加载失败：${path}`))));
}

const hydratedPacks=new WeakSet();
export function hydrateProfileMetadata() {
 if (!lib.rank && window.noname_character_rank) lib.rank = window.noname_character_rank;
 // The lobby imports every pack's catalogue but only installs selected packs'
 // biographies and titles. Qianhuan's profile page reads these metadata maps.
 for(const pack of Object.values(lib.imported.character||{})){
  if(hydratedPacks.has(pack))continue;
  hydratedPacks.add(pack);
  for(const [name,intro] of Object.entries(pack.characterIntro||{}))lib.characterIntro[name] ??= intro;
  for(const [name,title] of Object.entries(pack.characterTitle||{}))lib.characterTitle[name] ??= title;
 }
}
export function configure() {
 lib.qhly_skinChange ||= {};
 lib.qhly_skinEdit ||= {};
 hydrateProfileMetadata();
 const defaults = {qhly_currentViewSkin:'shousha',qhly_viewskin_css:'newui_ss',qhly_funcLoadInPrecontent:true,
  qhly_originSkinPath:resourceRoot+'sanguoskin/',qhly_lutou:false,qhly_replaceCharacterCard2:'info',qhly_smallwindowstyle:'shousha'};
 // Restore the upstream default only when the earlier adapter supplied it;
 // a choice explicitly saved through the extension's settings wins.
 if(lib.config.qhly_replaceCharacterCard2==='noname'||(lib.config.qhly_coreAdapterVersion===1&&lib.config.qhly_replaceCharacterCard2==='nonereplace'&&lib.config.extension_千幻聆音_qhly_replaceCharacterCard2===undefined))game.saveConfig('qhly_replaceCharacterCard2','info');
 for (const [key,value] of Object.entries(defaults)) if(lib.config[key] === undefined) game.saveConfig(key,value);
 if(!lib.config.qhly_coreAdapterVersion){game.saveConfig('change_skin',true);game.saveConfig('qhly_coreAdapterVersion',1);}
 if(lib.config.qhly_coreAdapterVersion<2)game.saveConfig('qhly_coreAdapterVersion',2);
 if(lib.config.qhly_coreAdapterVersion<3){
  if(lib.config.extension_千幻聆音_qhly_smallwindowstyle===undefined)game.saveConfig('qhly_smallwindowstyle','shousha');
  game.saveConfig('qhly_coreAdapterVersion',3);
 }
 // Classic auxiliary scripts expect engine globals, independently of the dev/cheat setting.
 Object.assign(window,{lib,game,ui,get,ai,_status});
}

export function connectCore() {
 if(game.qhly_coreReady)return;
 window.DEFAULT_PACKAGE.audio = resourceRoot+'sanguoaudio/';
 game.qhly_originPlaySkillAudio = (name,index) => game.tryAudio({audioList:[`skill/${name}.mp3`,`skill/${name}${index || 1}.mp3`]});
 // The bundled resource pack has explicit aliases which predate this program ZIP.
 // Keep new package declarations; fill only missing aliases with actual shipped art.
 for(const [name,entry] of Object.entries(sharing))if(!lib.qhly_skinShare[name] && !directories[resourceRoot+'sanguoskin/'+name] && directories[resourceRoot+'sanguoskin/'+entry.name])lib.qhly_skinShare[name]=entry;
 if(!lib.qhly_skinShare.pot_xiaoqiao&&!directories[resourceRoot+'sanguoskin/pot_xiaoqiao'])lib.qhly_skinShare.pot_xiaoqiao={name:'xiaoqiao'};
 // Preserve the core portrait resolver (forms, metadata, hidden generals, and PIXI subscribers).
 if(HTMLDivElement.prototype.qhly_origin_setBackground) {
  const original=HTMLDivElement.prototype.qhly_origin_setBackground;
  HTMLDivElement.prototype.qhly_origin_setBackground=function(name,type,...rest){
   if(type==='character')rest[0]='noskin';
   return original.call(this,name,type,...rest);
  };
  HTMLDivElement.prototype.setBackground=function(name,type,...rest){
   if(type==='character'&&this.classList.contains('qh-not-replace'))rest[0]='noskin';
   return original.call(this,name,type,...rest);
  };
 }
 if(HTMLDivElement.prototype.qhly_origin_setBackgroundImage) HTMLDivElement.prototype.setBackgroundImage=HTMLDivElement.prototype.qhly_origin_setBackgroundImage;
 connectFileIO();
 connectDynamicCore();
 connectSkinManagement();
 const imported=[];
 for(const [name,value] of Object.entries(lib.config.skin||{})) {
  if(!Array.isArray(value)||typeof value[1]!=='string'||!value[1].startsWith(resourceRoot+'sanguoskin/')||lib.config.qhly_skinset.skin[name])continue;
  const file=value[1].split('/').pop();
  if(game.qhly_getSkinFile(name,file)===value[1]){lib.config.qhly_skinset.skin[name]=file;imported.push([name,file]);}
 }
 const sync = () => {
  const skins={...lib.config.skin};
  for(const [name,skin] of Object.entries(lib.config.qhly_skinset.skin)) {
   // Managed choices have their own durable store. Never copy stale legacy
   // selections over them or persist virtual set tokens as ordinary skin files.
   if(lib.config.skin_management?.selections?.[name]||skin?.startsWith('套装 · '))continue;
   if(game.qhly_isDynamicOnly?.(name,skin)){delete skins[name];continue;}
   if(skin) skins[name]=[game.qhly_getSkinName(name,skin),game.qhly_getSkinFile(name,skin)];
  }
  lib.config.skin=skins;
  game.saveConfig('skin',skins);
  getSkinService().invalidate();
  refreshCharacterSkins();
 };
 (lib.qhly_callbackList ||= []).push({onChangeSkin(name,skin){
  if(!skin&&!lib.config.skin_management?.selections?.[name]) delete lib.config.skin?.[name];
  sync();
 }});
 sync();
 getSkinService().register('qianhuan-extension', name => new Promise(resolve=>game.qhly_getSkinList(name,(ok,files)=>resolve(ok?files.map(file=>({name:game.qhly_getSkinName(name,file),path:game.qhly_getSkinFile(name,file),source:'千幻聆音'})):[]))));
 game.qhly_coreReady=true;
 // Rebuild the original extension's voice mappings for imported selections.
 for(const [name,file] of imported)game.qhly_setCurrentSkin(name,file);
}

