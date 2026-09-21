import {lib, game, ui, get, ai, _status, suspendSelectionGuide} from 'noname';
import {createPortraitTextures} from './native/portraits.js';
import {createResourceAccess} from './native/resources.js';
import {optionalScriptDefaults,scriptFallbacks} from './native/script-policy.mjs';
import {createCompatibility} from './native/compatibility.js';
import {installAdaptiveLayout} from './native/layout.js';
import {installDeferredEffects} from './native/effects.js';
import {createSelectionAdapter} from './native/selection.js';
import {installNativeMenu} from './native/menu.js';
import {installPortraitClips} from './native/portrait-clips.js';

const base = import.meta.url.slice(0, import.meta.url.lastIndexOf('/') + 1);
const developmentRevision=import.meta.env?.DEV?Date.now():null;
const sourceNames = ['如真似幻','十周年UI','手杀ui','选将美化','手杀MVP','皮肤切换','千幻聆音','标记补充','电脑适配'];
// These vendor bundles contain several classic-script modules. PIXI plugins
// read this.PIXI/globalThis.PIXI before the complete bundle has finished.
const classicVendors = new Set(['original/如真似幻/js/gsap.min.js','original/如真似幻/js/pixi6.min.js','original/如真似幻/js/pixi6.min_chg.js']);
const vendorLoads = new Map();
function loadClassicVendor(src) {
 if(vendorLoads.has(src))return vendorLoads.get(src);
 const task=new Promise((resolve,reject)=>{
  const node=document.createElement('script');node.src=src;node.async=false;
  const failed=event=>{if(event.filename===node.src){event.preventDefault();finish(event.error||new Error(event.message));}};
  function finish(error){window.removeEventListener('error',failed);node.onload=node.onerror=null;if(error){node.remove();reject(error);}else resolve();}
  window.addEventListener('error',failed);
  node.onload=()=>finish();node.onerror=()=>finish(new Error('手杀标准UI资源加载失败：'+src));
  document.head.appendChild(node);
 });
 vendorLoads.set(src,task);task.catch(()=>vendorLoads.delete(src));return task;
}
const defaults = {
 extension_十周年UI_enable:true, extension_十周年UI_newDecadeStyle:'off',
 extension_十周年UI_JBDDZ:true, extension_十周年UI_rightLayout:true,
 extension_十周年UI_dynamicSkin:true, extension_十周年UI_gameAnimationEffect:true,
 extension_手杀ui_enable:true, extension_手杀ui_yangshi:'on',
 extension_手杀ui_jindutiao:true, extension_手杀ui_jindutiaoYangshi:'1',
 extension_手杀MVP_shoushajiesuan:true, extension_如真似幻_enable:true,
 extension_皮肤切换_enable:true, extension_千幻聆音_enable:true,
 extension_标记补充_enable:true, extension_选将美化_enable:true,
 layoutSet:true, new_pause:'shousha', game_cardSet:'hand', game_cardSet2:'new',
 uiStyles:'经典主题', rzEpicSpine:false, rzsh_head:'3.png', rzshbgm:'争流',
 rzsh_wjbg:'战火连天.jpg', rszh_ideimg:'君临天下.png', zhuanzhuan:'on',
 image_background_story:true, storyBG_default:'1', tenUIonlySkill:true,
 hidepack:[],favouriteCharacter:[],recentCharacter:[],
};

function scopedStorage(storage) {
 const prefix='noname-shousha-native:';
 return {
  getItem:key=>storage.getItem(prefix+key),
  setItem:(key,value)=>storage.setItem(prefix+key,String(value)),
  removeItem:key=>storage.removeItem(prefix+key),
  clear(){for(const key of Object.keys(storage))if(key.startsWith(prefix))storage.removeItem(key);},
 };
}

export async function createNativeRuntime(manifest) {
 const files=await (await fetch(base+'files.json')).json();
 const fileSet=new Set(files);
 const scriptGlobals=await(await fetch(base+'native/script-globals.json')).json();
 const resources=createResourceAccess({files,localPath,url,assetURL:lib.assetURL,game});
 const resourceHooks=new Set(['qhly_checkFileExist','dcd_checkFileExist','thunderFileExist','qhly_readFileAsText','getFileList']);
 const styles=new Set(), observers=new Set(), pending=new Set();
 const failures=[],styleTasks=new Set();
 const storage=scopedStorage(localStorage), session=scopedStorage(sessionStorage);
 storage.setItem('hideModesA','true');
 storage.setItem('liuli_tenUIfix','fix');
 storage.setItem('firstSTBG','on');
 storage.setItem('loggedIn',lib.config.connect_nickname||'无名玩家');
 // The original UI calls its local AI lobby "online". Actual networking is
 // exclusively handled by the host's online room service.
 session.setItem('Network','online');
 session.setItem('rzshk','true');
 let currentScene, disposed=false, prepared=false,portraits,disposeSkinEvents,disposeLayout,disposeEffects,disposeSelection,restoreGuide,disposeMenu,disposeClips,disposeControls;
 const selection=createSelectionAdapter({lib,game,ui,get,_status});
 const legacyClick=new Proxy(ui.click,{
  get(target,key){return Object.hasOwn(selection.handlers,key)?selection.handlers[key]:Reflect.get(target,key);},
  set(target,key,value){if(Object.hasOwn(selection.handlers,key))return true;return Reflect.set(target,key,value);},
 });
 const legacyUi=new Proxy(ui,{get(target,key){return key==='click'?legacyClick:Reflect.get(target,key);}});
 let onlineEntry,onlineLobbyHandler,portraitTimer;
 const visiblePortraits=new Set();
 function portraitStore(){
  return portraits ||= createPortraitTextures({PIXI:window.PIXI,character:name=>characters[name],assetURL:lib.assetURL,defaultPath:lib.characterDefaultPicturePath,readImage:key=>game.getDB('image',key),url});
 }
 function reloadLobby(){
  sessionStorage.setItem(lib.configprefix+'return_to_lobby','true');
  session.setItem('returnHome',currentScene?.isHome?'true':'false');
  localStorage.removeItem(lib.configprefix+'directstart');
  localStorage.removeItem(lib.configprefix+'playback');
  game.reload();
 }
 let scriptChain=Promise.resolve();
 const packs=new Map(),nativeSettings={...(lib.config.ui_workshop_shousha_settings||{})},projected=new Map();let projecting=false;
 function project(key,value){if(!projected.has(key))projected.set(key,{exists:Object.hasOwn(lib.config,key),value:lib.config[key]});lib.config[key]=value;}
 const isPrivate=key=>typeof key==='string'&&(sourceNames.some(name=>key.startsWith('extension_'+name+'_'))||/^(qhly_|rzsh|rz_|rzLock_|storyBG|storyBGM|tianti_|shouSha|tenUI|game_cardSet|uiStyles|new_pause|rszh_)/.test(key));
 const config=new Proxy(lib.config,{
  get(target,key){return Object.hasOwn(nativeSettings,key)?nativeSettings[key]:isPrivate(key)?undefined:Reflect.get(target,key);},
  set(target,key,value){if(isPrivate(key)){nativeSettings[key]=value;if(projecting)project(key,value);}else Reflect.set(target,key,value);return true;},
 });
 for(const [key,value] of Object.entries(defaults))if(config[key]===undefined)config[key]=value;
 for(const name of sourceNames)config['extension_'+name+'_enable']=true;
 config.tianti_versus_two ||= {count:0,top:40,win:0,fail:0,num:0,top_win:0,win_Cty:0,xxingnum:0};
 const virtualExtensionMenu=Object.create(lib.extensionMenu);
 const virtualExtensionPack=Object.create(lib.extensionPack);
 const sourceConfig=new Proxy(config,{
  get(target,key){
   if(key==='extensions'){
    const list=[...(target.extensions||[])];
    // Dependency probes succeed, enumeration still contains host extensions only.
    Object.defineProperties(list,{contains:{value:name=>sourceNames.includes(name)||Array.prototype.includes.call(list,name)},includes:{value:name=>sourceNames.includes(name)||Array.prototype.includes.call(list,name)}});
    return list;
   }
   return Reflect.get(target,key);
  },
  set(target,key,value){Reflect.set(target,key,value);return true;},
 });
 const legacyGet=new Proxy(get,{get(target,key){if(key==='extensionConfig')return (name,option)=>config['extension_'+name+'_'+option];return Reflect.get(target,key);}});
 function url(input) {
  let value=String(input);
  try{value=decodeURI(value);}catch{}
  for(const name of sourceNames)value=value.replace('extension/'+name+'/',base+'original/'+name+'/').replace(new RegExp('extension/'+name+'$'),base+'original/'+name);
  value=value.replace(/(?:\.\/)?extension\/手杀标准UI\//,base);
  const at=value.indexOf(base);
  if(at>0)value=value.slice(at);
  if(value.startsWith('image/background/'))value=base+'original/core/'+value;
  if(value.startsWith('audio/background/'))value=base+'original/core/'+value;
  return value;
 }
 function localPath(input) {
  const resolved=new URL(url(input),location.href).href;
  const root=new URL(base,location.href).href;
  return resolved.startsWith(root)?decodeURIComponent(resolved.slice(root.length).split(/[?#]/)[0]).replace(/\/+/g,'/'):null;
 }
 async function run(file,extra={}) {
  const relative=localPath(file),optional=Object.hasOwn(optionalScriptDefaults,relative);
  let text;
  if(relative!==null&&!fileSet.has(relative)){
   // Do not request absent optional files: Vite would emit an ENOENT overlay
   // before an HTTP error handler could recover from it.
   if(optional)text=optionalScriptDefaults[relative];
   else throw new Error('手杀标准UI缺少必需脚本：'+relative);
  }
  if(text===undefined){
   if(classicVendors.has(relative))return loadClassicVendor(url(file));
   const sourceURL=url(file);
   const response=await fetch(developmentRevision===null?sourceURL:sourceURL+(sourceURL.includes('?')?'&':'?')+'nativeRevision='+developmentRevision);
   if(!response.ok)throw new Error('手杀标准UI资源加载失败：'+file);
   text=await response.text();
  }
  // These are shipped, fixed source programs; imported workshop archives never
  // execute arbitrary JavaScript. Sloppy mode preserves original global hooks.
  const values={lib:legacyLib,game:legacyGame,ui:legacyUi,get:legacyGet,ai,_status,bridge,document:legacyDocument,localStorage:storage,sessionStorage:session,...extra};
  const declared=scriptGlobals[localPath(file)]||{exports:[],variables:[]};
  for(const name of declared.variables)if(!Object.hasOwn(values,name))values[name]=window[name];
  const exports=declared.exports.map(name=>`if(typeof ${name} !== 'undefined') window[${JSON.stringify(name)}]=${name};`).join('\n');
  new Function(...Object.keys(values),text+'\n'+exports+'\n//# sourceURL='+url(file))(...Object.values(values));
 }
 function script(file,onerror) {
  let relative=localPath(file);
  if(!fileSet.has(relative)&&Object.hasOwn(scriptFallbacks,relative)){relative=scriptFallbacks[relative];file=base+relative;}
  const task=scriptChain.then(()=>{
   return run(file);
  }).catch(error=>{if(onerror){onerror(error);return;}failures.push(error);throw error;});
  // A handled optional-file failure must not poison the rest of the queue.
  scriptChain=task.catch(()=>{});
  pending.add(task);task.finally(()=>pending.delete(task)).catch(()=>{});
  return task;
 }
 async function drain(){
  let previous;do{previous=scriptChain;await previous;await Promise.all([...styleTasks]);}while(previous!==scriptChain);
  if(failures.length){
   const errors=failures.splice(0);
   if(errors.length===1)throw errors[0];
   throw new AggregateError(errors,[...new Set(errors.map(error=>error?.message||String(error)))].join('\n'));
  }
 }
 function insertion(target,key){return (...nodes)=>{
  for(const node of nodes){
   if(node instanceof HTMLScriptElement&&node.src){let failed=false;script(node.src,node.onerror?error=>{failed=true;node.onerror.call(node,error);}:undefined).then(()=>{if(!failed)try{node.onload?.call(node,new Event('load'));}catch(error){failures.push(error);}}).catch(()=>{});}
   else {if(node instanceof HTMLLinkElement){node.href=url(node.href);styles.add(node);}target.appendChild(node);}
  }
  return key==='appendChild'?nodes[0]:undefined;
 };}
 const head=new Proxy(document.head,{get(target,key){if(['append','appendChild'].includes(key))return insertion(target,key);const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;}});
 const body=new Proxy(document.body,{get(target,key){if(['append','appendChild'].includes(key))return insertion(target,key);const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;},set(target,key,value){return Reflect.set(target,key,value,target);}});
 const legacyDocument=new Proxy(document,{get(target,key){if(key==='head')return head;const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;}});
 function css(path,name,callback) {
  const link=document.createElement('link');link.rel='stylesheet';
  link.href=url(path+(name?'/'+name+'.css':''));
  const ready=new Promise(resolve=>{link.onload=()=>{try{callback?.();}catch(error){failures.push(error);}finally{resolve();}};link.onerror=()=>{failures.push(new Error('手杀标准UI样式加载失败：'+link.href));resolve();};});
  styleTasks.add(ready);ready.then(()=>styleTasks.delete(ready));
  styles.add(link);document.head.append(link);return link;
 }
 const init=new Proxy(lib.init,{
  get(target,key){
   if(key==='css')return css;
   if(key==='js'||key==='jsForExtension')return (path,name,onload,onerror)=>{
    let failed=false;const handle=onerror?error=>{failed=true;onerror(error);}:undefined;
    const task=Array.isArray(name)?Promise.all(name.map(part=>script(path+'/'+part+'.js',handle))):script(name?path.replace(/\/$/,'')+'/'+name+'.js':path,handle);
    task.then(()=>{if(!failed)try{onload?.();}catch(error){failures.push(error);}},error=>console.error(error));return task;
   };
   return Reflect.get(target,key);
  },
  set(target,key,value){if(['onload','start','startBefore','parse','parsex'].includes(key))return true;return Reflect.set(target,key,value);},
 });
 const content=new Proxy(lib.element.content,{
  set(target,key,value){
   if(['gain','lose','equip','addJudge','judge','phaseJudge','gameDraw','gainPlayerCard','discardPlayerCard','chooseButton','chooseControl','choosePlayerCard','chooseTarget','chooseToDiscard','addToExpansion','useSkill','useCard','respond','damage','phase','phaseLoop','chooseToUse','chooseToRespond'].includes(key))return true;
   return Reflect.set(target,key,value);
  },
 });
 const legacyPrototypes=new Map();
 const events=new Proxy(lib.element.event,{set(target,key,value){
  if(['setContent','start','loop','goto','redo','finish'].includes(key))return true;
  return Reflect.set(target,key,value);
 }});
 const elements=new Proxy(lib.element,{get(target,key){
  if(key==='content')return content;
  if(key==='event')return events;
  if(['button','dialog','control','card','player'].includes(key)){
   const proto=Reflect.get(target,key);
   if(!legacyPrototypes.has(proto))legacyPrototypes.set(proto,new Proxy(proto,{
    getPrototypeOf(){return null;},
    set(target,method,value){if(key==='player'&&['judge','chooseControl'].includes(method))return true;return Reflect.set(target,method,value);},
   }));
   // for-in over a modern HTMLElement prototype otherwise reaches native DOM
   // getters (e.g. align), which cannot be read on the prototype itself.
   return legacyPrototypes.get(proto);
  }
  return Reflect.get(target,key);
 }});
 const characterCache=new Map();
 const characters=new Proxy(lib.character,{
  get(target,key){if(Reflect.has(target,key))return Reflect.get(target,key);if(projecting||typeof key!=='string')return;
   if(!characterCache.has(key)){const info=Object.values(lib.characterPack).map(pack=>pack[key]).find(Boolean);if(info)characterCache.set(key,get.convertedCharacter(info));}
   return characterCache.get(key);
  },
  ownKeys(target){return projecting?Reflect.ownKeys(target):[...new Set([...Reflect.ownKeys(target),...Object.values(lib.characterPack).flatMap(pack=>Object.keys(pack))])];},
  getOwnPropertyDescriptor(target,key){return Reflect.getOwnPropertyDescriptor(target,key)||{configurable:true,enumerable:true,writable:true,value:this.get(target,key)};},
 });
 const legacyLib=new Proxy(lib,{
  get(target,key){
   if(key==='config')return sourceConfig;
   if(key==='init')return init;
   if(key==='game')return legacyGame;
   if(key==='element')return elements;
   if(key==='character')return characters;
   if(key==='extensionMenu')return virtualExtensionMenu;
   if(key==='extensionPack')return virtualExtensionPack;
   return Reflect.get(target,key);
  },
 });
 const overrides={
  reload3:()=>reloadLobby(),
  reload:()=>currentScene?reloadLobby():game.reload(),
  getFileList:resources.list,
  qhly_checkFileExist:resources.check,
  dcd_checkFileExist:resources.check,
  thunderFileExist:resources.known,
  qhly_readFileAsText:resources.readText,
  readFile(path,callback,onerror){fetch(url(path)).then(r=>{if(!r.ok)throw new Error(path);return r.arrayBuffer();}).then(callback,onerror);},
  createCss(text){const node=document.createElement('style');node.textContent=text;document.head.append(node);styles.add(node);return node;},
  playAudio(...args){
   const options=args.length===1&&args[0]&&typeof args[0]==='object'?{...args[0]}:{path:args.filter(arg=>typeof arg==='string'||typeof arg==='number').join('/'),onError:args.find(arg=>typeof arg==='function')};
   const path=String(options.path||'').replace(/^ext:/,'extension/');
   if(path.includes('extension/')&&(sourceNames.some(name=>path.includes('extension/'+name+'/'))||path.includes('extension/手杀标准UI/'))){
    const local=localPath(path);
    if(local!==null)options.path='ext:手杀标准UI/'+local;
   }
   return game.playAudio(options);
  },
  saveConfig(key,value,mode,callback){
   if(isPrivate(key)&&!mode){config[key]=value;game.saveConfig('ui_workshop_shousha_settings',{...nativeSettings});callback?.();return;}
   if(key==='layout'&&['nova','long','long2'].includes(value))value='mobile';
   const result=game.saveConfig(key,value,mode,callback);return result;
  },
  storyBackground(set){
   const theme=set||config['storyBG_online_'+(game.storyBgMode||config.mode)]||config.storyBG_default||'1';
   const choices=theme==='4'?['1','2','3']:theme==='groups'?['wei','shu','wu','qun']:[theme];
   const picked=choices[Math.floor(Math.random()*choices.length)];
   if(ui.background)ui.background.style.backgroundImage=`url("${base}original/core/image/background/${picked}.jpg")`;
  },
  switchMode:mode=>currentScene?.finish(mode),
 };
 const legacyGame=new Proxy(game,{
  get(target,key){if(key==='qhly_hasExtension')return name=>sourceNames.includes(name)||(lib.config.extensions||[]).includes(name)&&!!lib.config['extension_'+name+'_enable'];return Object.hasOwn(overrides,key)?overrides[key]:Reflect.get(target,key);},
  set(target,key,value){
   // Keep the current async event engine and networking entry points. All
   // presentation hooks, character selection and additional UI helpers pass through.
   if(['loop','loop2','pause','pause2','resume','resume2','createEvent','check','uncheck','import','saveConfig','connect','createServer','send','broadcast','broadcastAll'].includes(key))return true;
   if(resourceHooks.has(key))return true;
   if(Object.hasOwn(overrides,key)){overrides[key]=value;return true;}
   return Reflect.set(target,key,value);
  },
 });
 // Compiled step events run against the host singleton, outside our lexical
 // proxy. Publish the UI helpers they call as well as the scoped versions.
 for(const key of ['createCss','storyBackground','reload3','qhly_checkFileExist','dcd_checkFileExist','thunderFileExist','qhly_readFileAsText'])game[key]=(...args)=>overrides[key](...args);
 const bridge={
  storage,session,url,script,css,
  checkFileExist:resources.check,
  resourceExists:resources.known,
  readResourceText:resources.readText,
  timeout:(fn,ms,...args)=>currentScene?currentScene.timeout(fn,ms,...args):setTimeout(fn,ms,...args),
  interval:(fn,ms,...args)=>currentScene?currentScene.interval(fn,ms,...args):setInterval(fn,ms,...args),
  frame:fn=>currentScene?currentScene.frame(fn):requestAnimationFrame(fn),
  releaseScene(scene){if(currentScene!==scene)return;clearInterval(portraitTimer);portraitTimer=undefined;visiblePortraits.clear();portraits?.dispose();portraits=undefined;currentScene=undefined;},
  own:resource=>currentScene?.own(resource)||resource,
  tween(method,...args){const tween=window.gsap[method](...args);currentScene?.ownTween(tween);return tween;},
  get screen(){return currentScene?.screen||{width:1103,height:514};},
  mount(app){currentScene.mount(app);},
  ready(){currentScene?.ready();},
  finish(mode){portraits?.pause();currentScene?.finish(mode);},
  login(){currentScene?.login();},
  async openOnlineLobby(){
   if(onlineEntry)return;
   onlineEntry=true;
   const resume=currentScene?.suspendRendering();
   try {
    // A future native lobby can register here without re-enabling the old
    // random local-match scene. The existing online service owns all rooms.
    const entry=await (config.rzsh_onlineLobby==='native'&&onlineLobbyHandler?onlineLobbyHandler():lib.uiWorkshop.openRooms('identity'));
    await entry?.closed;
   } catch(error){console.error(error);bridge.notice('联机大厅打开失败：'+error.message);}
   finally{onlineEntry=false;resume?.();}
  },
  watchPortrait(sprite,name,options){
   visiblePortraits.add({sprite,name,options});
   if(portraitTimer)return;
   portraitTimer=currentScene.interval(()=>{
    let started=0;
    for(const entry of visiblePortraits){
     if(entry.sprite.destroyed){visiblePortraits.delete(entry);continue;}
     if(!entry.sprite.worldVisible||!currentScene.isVisible(entry.sprite))continue;
     const bounds=entry.sprite.getBounds();
     if(bounds.x+bounds.width<0||bounds.y+bounds.height<0||bounds.x>bridge.screen.width||bounds.y>bridge.screen.height)continue;
     entry.sprite.texture=portraitStore().get(entry.name,entry.options);
     entry.sprite.width=entry.options.width;entry.sprite.height=entry.options.height;
     visiblePortraits.delete(entry);
     if(++started===12)break;
    }
   },200);
  },
  framePortrait(player,portrait,labels){
   // jbg.png is only a rectangular backdrop, not an ornamental outer frame.
   // Draw the frame above the cropped art and below the rank/name plates.
   const frame=new window.PIXI.Graphics();
   frame.lineStyle(7,0x251b13,1).drawRoundedRect(-86,-139,172,198,6);
   frame.lineStyle(2,0xbda36b,1).drawRoundedRect(-86,-139,172,198,6);
   frame.lineStyle(1,0xead6a0,.8).drawRoundedRect(-81,-134,162,188,3);
   for(const x of [-86,86])for(const y of [-139,59]){
    const dx=x<0?1:-1,dy=y<0?1:-1;
    frame.lineStyle(3,0xd7bb78,1).moveTo(x,y+20*dy).lineTo(x,y).lineTo(x+20*dx,y);
   }
   player.addChildAt(frame,player.getChildIndex(labels));
  },
  installSkinEvents(){
   if(disposeSkinEvents)return;
   // Keep the host's async event steps intact. Skin effects are presentation
   // hooks, not replacements for useSkill/useCard/respond gameplay content.
   const skill='_shousha_native_skill_skin';
   lib.skill[skill]={charlotte:true,forced:true,popup:false,firstDo:true,trigger:{player:'useSkillBegin'},
    async content(event,trigger,player){game.qhly_changeSkillSkin?.(player,trigger.skill);},
   };
   game.addGlobalSkill(skill);
   const original=game.playCardAudio;
   const adapted=function(card,player){
    if(!player||typeof player!=='object'||!player.name1)return original.apply(this,arguments);
    const skin=game.qhly_getSkin(player.name1),realName=game.qhly_getRealName(player.name1);
    const skinName=game.qhly_earse_ext(skin),rule=lib.qhly_skinChange?.[realName]?.[skinName];
    let sex=player.sex==='female'?'female':'male';
    if(config.qhly_changeSex?.[player.name1]?.[skin])sex=sex==='female'?'male':'female';
    const fallback=()=>original.call(game,card,sex);
    if(!rule?.cardaudio||typeof card==='string'||typeof lib.card[card.name]?.audio==='string')return fallback();
    if(!lib.config.background_audio||(get.type(card)==='equip'&&!lib.config.equip_audio))return;
    const pkg=game.qhly_foundPackage(player.name1);
    const root=pkg.isExt&&realName!==player.name1&&skin?'extension/手杀标准UI/original/千幻聆音/sanguoaudio/':pkg.audio;
    if(!root)return fallback();
    const directory=game.qhly_getPlayerStatus(player)===2&&rule.audio1?rule.audio1:skinName+'/';
    const nature=get.natureList(card)[0];
    const name=card.name==='sha'&&['fire','thunder','ice','stab'].includes(nature)?card.name+'_'+nature:card.name;
    const audioPath=root+(skin?realName:player.name1)+'/'+directory+name+'.mp3';
    const local=localPath(audioPath);
    // Missing optional skin voices should use the core audio immediately, not
    // wait for a failed media download while gameplay has already advanced.
    if(local!==null&&!fileSet.has(local))return fallback();
    return game.playAudio({path:local===null?'../'+audioPath:'ext:手杀标准UI/'+local,onError:fallback});
   };
   game.playCardAudio=adapted;
   disposeSkinEvents=()=>{game.removeGlobalSkill(skill);delete lib.skill[skill];if(game.playCardAudio===adapted)game.playCardAudio=original;};
  },
  finishPlayer(player){
   // Source player DOM uses real modern Player instances. Preserve hand caches,
   // equipment observers and virtual-card state required by current gameplay.
   for(const name of ['handcards1','handcards2']){
    const node=player.node[name];
    node._childNodesWatcher={get childNodes(){return Array.from(node.childNodes);},toJSON(){return null;}};
   }
   player.updates ||= [];
   player._args ||= [player.parentNode];
   const observer=new MutationObserver(()=>player.$handleEquipChange?.());
   observer.observe(player.node.equips,{childList:true});observers.add(observer);
  },
  async handPlugins(app){
   app.path.ext=(path,ext=app.name)=>base+'original/'+ext+'/'+path;
   const prefix='original/手杀ui/';
   const suffix=config.extension_手杀ui_yangshi==='on'?'main1':'main2';
   const selected=files.filter(file=>file.startsWith(prefix)&&file.split('/').length===4&&file.endsWith('/'+suffix+'.js')).map(file=>file===prefix+'character/main1.js'?prefix+'character/main1_new.js':file);
   for(const file of selected)await run(base+file,{app});
  },
 };
 const compatibility=createCompatibility({lib,game,get,files,base,config});
 bridge.playerInit=compatibility.playerInit;
 bridge.playerReinit=compatibility.playerReinit;
 bridge.initCard=compatibility.initCard;
 bridge.hasModule=name=>sourceNames.some(module=>module.startsWith(name))||(lib.config.extensions||[]).some(module=>module.startsWith(name)&&lib.config['extension_'+module+'_enable']);
 // Class methods are non-enumerable in the modern engine; legacy builders copy
 // the prototype using for-in. Expose those methods without replacing classes.
 for(const key of ['Player','Card','Dialog','Control','Button']){
  const proto=lib.element[key]?.prototype;if(!proto)continue;
  for(const [name,descriptor] of Object.entries(Object.getOwnPropertyDescriptors(proto))){
   if(name!=='constructor'&&descriptor.configurable&&typeof descriptor.value==='function')Object.defineProperty(proto,name,{...descriptor,enumerable:true});
  }
 }
 lib.element.player.updates ||= [];
 lib.element.player.fixShadow ||= function(){
  const shadows={small:'3px 3px 5px 3px rgba(0,0,0,.8)',normal:'3px 3px 5px 4px rgba(0,0,0,.9)',large:'3px 3px 5px 5px rgba(0,0,0,1)'};
  const shadow=this.name&&shadows[config.shadow_fix];
  this.classList.toggle('shadowfix',!!shadow);
  if(shadow)this.style.setProperty('box-shadow',shadow,'important');
  else this.style.removeProperty('box-shadow');
 };
 await script(base+'native/core-ui.js');
 window.shoushaCoreUI(legacyLib,legacyGame,legacyUi,legacyGet,ai,_status,bridge);
 // Cordova's original multi-button dialogs have an in-browser equivalent.
 if(!navigator.notification)Object.defineProperty(navigator,'notification',{configurable:true,value:{confirm(message,callback,title,buttons=['确定','取消']){
  const backdrop=document.createElement('div');backdrop.className='shousha-native-confirm';
  const panel=document.createElement('div'),heading=document.createElement('h3'),body=document.createElement('p');
  let closed=false;
  const finish=index=>{if(closed)return;closed=true;window.removeEventListener('keydown',onKey,true);backdrop.remove();callback(index);};
  const onKey=event=>{if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish(0);}};
  window.addEventListener('keydown',onKey,true);
  backdrop.onclick=event=>{if(event.target===backdrop)finish(0);};
  heading.textContent=title||'手杀标准UI';body.textContent=message;panel.append(heading,body);
  buttons.forEach((text,index)=>{const button=document.createElement('button');button.textContent=text;button.onclick=()=>finish(index+1);panel.append(button);});
  backdrop.append(panel);document.body.append(backdrop);
 }}});
 window.confirms=(message,title,yes,no)=>navigator.notification.confirm(message,index=>index===1?yes?.():no?.(),title,['确定','取消']);
 window.getChromeVersion ||= ()=>Number(navigator.userAgent.match(/(?:Chrome|Chromium)\/(\d+)/)?.[1]||130);
 window.isPcApp ||= ()=>!lib.device;
 window.playerNickName ||= {};
 window.lastRunExtensions ||= [];
 window.liulikillVersion='5.5';
 for(const name of sourceNames){
  await script(base+'native/'+name+'.js');
  const pack=window.shoushaNativeFactories[name](legacyLib,legacyGame,legacyUi,legacyGet,ai,_status,bridge);
  packs.set(name,pack);
  const settings={};
  for(const [key,option] of Object.entries(pack.config||{})){
   const id='extension_'+name+'_'+key;
   if(config[id]===undefined&&Object.hasOwn(option,'init'))config[id]=option.init;
   settings[key]=config[id];
  }
  pack.settings=settings;
  Object.defineProperty(virtualExtensionMenu,'extension_'+name,{configurable:true,writable:true,value:{...pack.config,enable:{init:true}}});
  Object.defineProperty(virtualExtensionPack,name,{configurable:true,writable:true,value:{...pack.package,version:pack.package?.version||'5.5'}});
 }
 const preparedPacks=new Set(),loadedPacks=new Set(),preparingPacks=new Map();
 async function preparePack(name){
  if(preparedPacks.has(name))return;
  if(preparingPacks.has(name))return preparingPacks.get(name);
  const task=(async()=>{
   try{const pack=packs.get(name);if(name!=='如真似幻')await pack.precontent?.call(pack,pack.settings);await drain();preparedPacks.add(name);}
   catch(error){throw new Error('手杀标准UI「'+name+'」初始化失败：'+(error?.message||String(error)),{cause:error});}
  })();
  preparingPacks.set(name,task);try{await task;}finally{preparingPacks.delete(name);}
 }
 async function loadPack(name){
  if(loadedPacks.has(name))return;await preparePack(name);const pack=packs.get(name);
  const callbackInitializer=await pack.content?.call(pack,pack.settings,pack.package);
  if(typeof callbackInitializer==='function')await new Promise(resolve=>callbackInitializer(resolve));
  await drain();loadedPacks.add(name);
 }
 const api={
  base,bridge,packs,config,reloadLobby,
  registerOnlineLobby(handler){onlineLobbyHandler=handler;return()=>{if(onlineLobbyHandler===handler)onlineLobbyHandler=undefined;};},
  themes:[...new Set(files.filter(file=>file.startsWith('original/如真似幻/images/uiStyles/')&&file.endsWith('/ui.json')).map(file=>file.split('/')[4]))],
  loginThemes:[...new Set(files.filter(file=>file.startsWith('original/如真似幻/spine/startSpine/')&&file.endsWith('.skel')).map(file=>file.split('/')[4]))],
  saveSetting(key,value){overrides.saveConfig(key,value);},
  async prepareScene(){
   if(prepared)return;
   css(base+'original/如真似幻/css/font.css');
   await script(base+'original/如真似幻/js/gsap.min.js');
   await script(base+'original/如真似幻/js/pixi6.min.js');
   prepared=true;
  },
  async home(scene){
   currentScene=scene;
   await api.prepareScene();
   await lib.uiWorkshop?.prepareCharacters?.();
   await portraitStore().prepare();
   packs.get('如真似幻').createHome();
  },
  async openCollection(){await api.prepareScene();await preparePack('皮肤切换');window.skinSwitch.cangZhenGe();},
  async prepareGame(){for(const name of ['十周年UI','皮肤切换','千幻聆音','手杀ui','选将美化','标记补充','手杀MVP','电脑适配'])await preparePack(name);await drain();},
  async openCharacter(name){await loadPack('千幻聆音');game.qhly_open_new(name,'skill');},
  async installGame(){
   if(disposed||_status.connectMode||config.mode==='connect')return;
   restoreGuide ||= suspendSelectionGuide();
   disposeSelection ||= selection.install();
   disposeClips ||= installPortraitClips();
   disposeControls ||= compatibility.installControls();
   projecting=true;for(const [key,value] of Object.entries(nativeSettings))project(key,value);
   // Source content depends on the previous extension's DOM and plugin hooks.
   // Register a single awaited loader because the host loads extensions in parallel.
   // Precontent establishes shared helpers first, matching the original loader.
   await api.prepareGame();
   for(const name of ['标记补充','皮肤切换','千幻聆音','十周年UI','手杀MVP','手杀ui','如真似幻','选将美化','电脑适配'])await loadPack(name);
   // HP animations can fire during character initialization / first-turn
   // skills, before the source's background animation queue reaches them.
   const animation=window.decadeUI?.animation;
   disposeEffects=installDeferredEffects(animation,files);
   if(animation)await Promise.all(['skeleton','skeletonxHp'].map(name=>animation.hasSpine(name)?undefined:new Promise((resolve,reject)=>animation.loadSpine(name,'skel',resolve,()=>reject(new Error('手杀标准UI体力动画加载失败：'+name))))));
   for(const entry of window.lastRunExtensions.splice(0).sort((a,b)=>(a.priority||0)-(b.priority||0)))await entry.content?.();
   void compatibility.warmCards();
   for(const [name,type] of [['button','Button'],['dialog','Dialog'],['control','Control']]){
    const create=ui.create[name];
    ui.create[name]=function(...args){
     const node=create.apply(this,args);
     if(node instanceof HTMLDivElement&&!(node instanceof lib.element[type]))Object.setPrototypeOf(node,lib.element[type].prototype);
     if(name==='dialog'){node.paginationMap ||= new Map();node.paginationMaxCount ||= new Map();node.supportsPagination ??= false;}
     return node;
    };
   }
   overrides.storyBackground();
   if(lib.uiWorkshop)lib.uiWorkshop.openGameMenu=()=>{
    if(!window.shohshaMenu2?.isConnected)return false;
    if(!window.popuperContainer)window.shohshaMenu2.click();
    return true;
   };
   lib.arenaReady.push(()=>{overrides.storyBackground();disposeLayout?.();disposeLayout=installAdaptiveLayout({game,ui});disposeMenu?.();disposeMenu=installNativeMenu({ui});void compatibility.warmCards();});
  },
  dispose(){disposed=true;disposeControls?.();disposeClips?.();disposeSelection?.();restoreGuide?.();disposeMenu?.();disposeEffects?.();disposeLayout?.();disposeSkinEvents?.();styles.forEach(node=>node.remove());observers.forEach(observer=>observer.disconnect());currentScene?.dispose();portraits?.dispose();visiblePortraits.clear();document.body.classList.remove('shousha-native-game');if(lib.uiWorkshop)delete lib.uiWorkshop.openGameMenu;for(const [key,old] of projected){if(old.exists)lib.config[key]=old.value;else delete lib.config[key];}},
 };
 bridge.collection=()=>api.openCollection().catch(error=>{console.error(error);alert('珍藏阁加载失败：'+error.message);});
 bridge.notice=message=>{
  const node=document.createElement('div');node.className='shousha-native-notice';node.textContent=message;document.body.append(node);setTimeout(()=>node.remove(),4500);
 };
 bridge.character=name=>api.openCharacter(name).catch(error=>{console.error(error);alert('武将详情加载失败：'+error.message);});
 bridge.characterTexture=(name,options)=>portraitStore().get(name,options);
 return api;
}
