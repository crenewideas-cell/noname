import {lib, game, ui, get, createSceneContext, openCharacterSkins, getSkinService, subscribeCharacterSkins} from 'noname';
import {createPortraitTextures} from './native/portraits.js';
import {createResourceAccess} from './native/resources.js';
import {mountGamePresentation} from './native/presentation.js';
import {mountSkinAnimations} from './native/animations.js';

// Keep the logical extension directory and its trailing slash. Vite's asset
// URL transform treats new URL('./', import.meta.url) as an asset path and can
// remove the slash, producing e.g. 手杀标准UIfiles.json on concatenation.
const base = import.meta.url.slice(0, import.meta.url.lastIndexOf('/') + 1);
const vendors = new Map();
function loadVendor(file) {
 if(vendors.has(file))return vendors.get(file);
 const promise=new Promise((resolve,reject)=>{
  const node=document.createElement('script');node.src=base+file;node.async=false;
  node.onload=()=>resolve({PIXI:window.PIXI,gsap:window.gsap});node.onerror=()=>{node.remove();reject(new Error('界面资源加载失败：'+file));};
  document.head.append(node);
 });
 vendors.set(file,promise);promise.catch(()=>vendors.delete(file));return promise;
}
function scopedStorage(storage) {
 const prefix='noname-shousha-native:';
 return {getItem:key=>storage.getItem(prefix+key),setItem:(key,value)=>storage.setItem(prefix+key,String(value)),removeItem:key=>storage.removeItem(prefix+key)};
}
const defaults={uiStyles:'经典主题',rzEpicSpine:false,rzsh_head:'3.png',rzshbgm:'争流',
 rzsh_wjbg:'战火连天.jpg',rszh_ideimg:'君临天下.png',zhuanzhuan:'on',storyBG_default:'1',
 hidepack:[],favouriteCharacter:[],recentCharacter:[],rzsh_cards:true,rzsh_mvp:true,ss_effects:true,ss_dynamic:true,
 tianti_versus_two:{count:0,top:40,win:0,fail:0,num:0,top_win:0,win_Cty:0,xxingnum:0}};

export async function createNativeRuntime(manifest) {
 const inventory=await fetch(base+'files.json',{signal:AbortSignal.timeout(20000)});
 if(!inventory.ok)throw new Error('手杀界面素材清单加载失败：'+inventory.status);
 const files=await inventory.json();
 const storage=scopedStorage(localStorage),session=scopedStorage(sessionStorage),styles=new Set(),dialogs=new Set(),sounds=new Set(),controller=new AbortController();
 let scene,portraits,portraitTimer,prepared,homeFactory,disposeGame,installingGame,animations,graphics,motion,disposed=false,onlineEntry=false,entering=false,homeGeneration=0,onlineController;
 const visiblePortraits=new Set(),sceneNodes=new Set(),backgrounds=new Map();
 const unsubscribeSkins=subscribeCharacterSkins(()=>{portraits?.refresh();animations?.refresh();});
 function setSceneBackground(path){
  if(disposed||!ui.background)return;
  const node=ui.background;
  if(!backgrounds.has(node))backgrounds.set(node,{value:node.style.getPropertyValue('background-image'),priority:node.style.getPropertyPriority('background-image')});
  node.setBackgroundImage(url(path));backgrounds.get(node).written=node.style.getPropertyValue('background-image');
 }
 // Preserve the old scene's names without sharing globals with another skin.
 const sceneWindow=Object.create(null);
 for(const key of ['devicePixelRatio','innerWidth','innerHeight'])Object.defineProperty(sceneWindow,key,{get:()=>window[key]});
 sceneWindow.inSplash=!!window.inSplash;
 Object.defineProperty(sceneWindow,'documentZoom',{get:()=>game.documentZoom});
 sceneWindow.playerNickName={};
 function ownNode(node){sceneNodes.add(node);return node;}
 const sceneDocument=new Proxy(document,{get(target,key){
  if(key==='createElement')return(...args)=>ownNode(target.createElement(...args));
  const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
 }});
 function clearSceneNodes(){
  for(const node of sceneNodes)try{if(node instanceof HTMLMediaElement){node.pause();node.oncanplay=node.onended=node.onerror=null;node.removeAttribute('src');node.load();}node.remove();}catch(error){console.warn('大厅节点释放失败',error);}
  sceneNodes.clear();
  for(const [node,previous] of backgrounds)if(node.style.getPropertyValue('background-image')===previous.written){if(previous.value)node.style.setProperty('background-image',previous.value,previous.priority);else node.style.removeProperty('background-image');}
  backgrounds.clear();
 }
 const sourceNames=['如真似幻','十周年UI','手杀ui','选将美化','手杀MVP','皮肤切换','千幻聆音','标记补充','电脑适配'];
 function url(input){let value=String(input);for(const name of sourceNames)value=value.replace('extension/'+name+'/',base+'original/'+name+'/');value=value.replace('extension/手杀标准UI/',base);const at=value.indexOf(base);return at>0?value.slice(at):value;}
 function localPath(input){const resolved=new URL(url(input),location.href).href;return resolved.startsWith(base)?decodeURIComponent(resolved.slice(base.length).split(/[?#]/)[0]).replace(/\/+/g,'/'):null;}
 const resources=createResourceAccess({files,localPath,url,assetURL:lib.assetURL,game});
 function css(path){const href=new URL(url(path),document.baseURI).href;for(const node of styles)if(node.href===href)return node;const node=document.createElement('link');node.rel='stylesheet';node.href=href;document.head.append(node);styles.add(node);return node;}
 function reloadLobby(){sessionStorage.setItem(lib.configprefix+'return_to_lobby','true');session.setItem('returnHome',scene?.isHome?'true':'false');localStorage.removeItem(lib.configprefix+'directstart');game.reload();}
 const context=createSceneContext({lib,game,ui,get},{settingsKey:'ui_workshop_shousha_settings',defaults,actions:{
  reload:reloadLobby,reload3:reloadLobby,getFileList(path,callback,onerror){const current=scene;return resources.list(path,(...args)=>{if(!disposed&&scene===current)callback?.(...args);},error=>{if(!disposed&&scene===current)onerror?.(error);});},
  createCss(text){const node=ownNode(document.createElement('style'));node.textContent=text;document.head.append(node);return node;},
  storyBackground(){setSceneBackground(base+'original/core/image/background/1.jpg');},
  updateBackground(){},
  playAudio(...args){
   const path=args.filter(arg=>typeof arg==='string'||typeof arg==='number').join('/'),local=localPath(path);
   if(local===null)return game.playAudio({path,addVideo:false});
   const audio=new Audio(base+local+(/\.[a-z0-9]+$/i.test(local)?'':'.mp3'));audio.volume=Math.max(0,Math.min(1,(lib.config.volumn_audio||0)/8));sounds.add(audio);
   const release=()=>{audio.pause();audio.removeAttribute('src');sounds.delete(audio);};audio.onended=release;audio.onerror=release;scene?.own({destroy:release});
   void audio.play().catch(release);return audio;
  },
 }});
 const {config}=context;
 context.ui.background={setBackgroundImage:setSceneBackground};
 const draftGameKeys=new Set(Object.keys(context.game));
 for(const key of ['div','node']){const create=context.ui.create[key];context.ui.create[key]=(...args)=>ownNode(create(...args));}
 const parts=new Set(Object.entries(manifest.components).filter(([,part])=>part.runtime==='shousha').map(([id])=>id));
 function saveSetting(key,value){context.game.saveConfig(key,value);animations?.refresh();}
 function animationService(){
  return animations ||= mountSkinAnimations({base,files,config,parts,saveSetting,label:name=>get.translation(name),staticSelected:name=>lib.config.change_skin!==false&&!!getSkinService().current(name),active:()=>!!ui.arena,enabled:()=>lib.config.animation!==false&&!lib.config.low_performance});
 }
 storage.setItem('hideModesA','true');storage.setItem('liuli_tenUIfix','fix');storage.setItem('firstSTBG','on');
 storage.setItem('loggedIn',lib.config.connect_nickname||'无名玩家');session.setItem('Network','online');session.setItem('rzshk','true');
 function portraitStore(){return portraits ||= createPortraitTextures({PIXI:graphics,character:name=>context.lib.character[name]||Object.values(context.lib.characterPack).map(pack=>pack[name]).find(Boolean),assetURL:lib.assetURL,defaultPath:lib.characterDefaultPicturePath,readImage:key=>game.getDB('image',key),url,skin:name=>lib.config.change_skin!==false?getSkinService().current(name):null});}
 const bridge={storage,session,url,
  timeout:(fn,ms,...args)=>scene?.timeout(fn,ms,...args)||0,
  interval:(fn,ms,...args)=>scene?.interval(fn,ms,...args)||0,
  frame:fn=>scene?.frame(fn)||0,
  own(resource){
   const current=scene,token=homeGeneration;
   if(resource instanceof graphics.Loader){const load=resource.load.bind(resource);resource.load=callback=>load((...args)=>{if(!disposed&&scene===current&&token===homeGeneration)try{Promise.resolve(callback?.(...args)).catch(error=>{if(!disposed&&scene===current&&token===homeGeneration)bridge.notice('大厅素材显示失败：'+error.message);});}catch(error){bridge.notice('大厅素材显示失败：'+error.message);}});}
   return current?.own(resource)||resource;
  },
  tween(method,...args){const tween=motion[method](...args);scene?.ownTween(tween);return tween;},
  get screen(){return scene?.screen||{width:1103,height:514};},
  mount(app){scene.mount(app);},ready(){scene?.ready();},login(){scene?.login();},
  matching(mode){const current=scene;const token=homeGeneration;scene?.timeout(()=>{if(!disposed&&scene===current&&token===homeGeneration)void bridge.finish(mode);},20000);},
  async finish(mode){if(disposed||entering)return;if(mode==='connect')return bridge.openOnlineLobby();entering=true;const current=scene;try{await context.commitMode(mode);if(disposed||scene!==current)return;portraits?.pause();await current?.finish(mode);}catch(error){console.error(error);bridge.notice(error.message);}finally{entering=false;}},
  releaseScene(current){if(scene!==current)return;homeGeneration++;clearInterval(portraitTimer);portraitTimer=undefined;visiblePortraits.clear();portraits?.dispose();portraits=undefined;context.ui.backgroundMusicRZ?.pause();clearSceneNodes();scene=undefined;for(const key of Object.keys(sceneWindow))delete sceneWindow[key];for(const key of Object.keys(context.game))if(!draftGameKeys.has(key))delete context.game[key];for(const key of Object.keys(context.ui))if(!['create','background','dialogs'].includes(key))delete context.ui[key];prepared=undefined;homeFactory=undefined;},
  async openOnlineLobby(mode='identity'){if(disposed||onlineEntry)return;onlineEntry=true;const current=scene,resume=current?.suspendRendering();try{const entry=await lib.uiWorkshop.openRooms(mode);if(disposed||scene!==current){entry?.close();return;}onlineController=entry;await entry?.closed;}catch(error){if(!disposed){console.error(error);bridge.notice(error.message);}}finally{onlineController=undefined;onlineEntry=false;resume?.();}},
  watchPortrait(sprite,name,options){visiblePortraits.add({sprite,name,options});if(portraitTimer)return;portraitTimer=scene.interval(()=>{
   let started=0;for(const entry of visiblePortraits){if(entry.sprite.destroyed){visiblePortraits.delete(entry);continue;}if(!entry.sprite.worldVisible||!scene.isVisible(entry.sprite))continue;
    const bounds=entry.sprite.getBounds();if(bounds.x+bounds.width<0||bounds.y+bounds.height<0||bounds.x>bridge.screen.width||bounds.y>bridge.screen.height)continue;
    entry.sprite.texture=portraitStore().get(entry.name,entry.options);entry.sprite.width=entry.options.width;entry.sprite.height=entry.options.height;visiblePortraits.delete(entry);if(++started===12)break;
   }},200);},
  framePortrait(player,portrait,labels){const frame=new graphics.Graphics();frame.lineStyle(7,0x251b13,1).drawRoundedRect(-86,-139,172,198,6);frame.lineStyle(2,0xbda36b,1).drawRoundedRect(-86,-139,172,198,6);frame.lineStyle(1,0xead6a0,.8).drawRoundedRect(-81,-134,162,188,3);player.addChildAt(frame,player.getChildIndex(labels));},
  notice(message){if(disposed)return;const node=document.createElement('div');node.className='shousha-native-notice';node.textContent=message;document.body.append(node);const close=()=>{clearTimeout(timer);node.remove();dialogs.delete(close);};const timer=setTimeout(close,4500);dialogs.add(close);},
  character:name=>characterSkins(name),collection:()=>characterSkins(),
  characterTexture:(name,options)=>portraitStore().get(name,options),
 };
 function characterSkins(name){
  const gallery=openCharacterSkins(name);
  const close=()=>{gallery.close();dialogs.delete(close);};dialogs.add(close);
  gallery.addEventListener('close',()=>dialogs.delete(close),{once:true});return gallery;
 }
 function confirmDialog(message,callback,title,buttons=['确定','取消']) {
  const backdrop=document.createElement('div');backdrop.className='shousha-native-confirm';
  const panel=document.createElement('div'),heading=document.createElement('h3'),body=document.createElement('p');
  let closed=false;
  const close=()=>{if(closed)return;closed=true;dialogs.delete(close);window.removeEventListener('keydown',onKey,true);backdrop.remove();};
  const finish=index=>{if(closed)return;close();callback(index);};
  const onKey=event=>{if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish(0);}};
  window.addEventListener('keydown',onKey,true);backdrop.onclick=event=>{if(event.target===backdrop)finish(0);};
  heading.textContent=title||'手杀标准UI';body.textContent=message;panel.append(heading,body);
  buttons.forEach((text,index)=>{const button=document.createElement('button');button.textContent=text;button.onclick=()=>finish(index+1);panel.append(button);});
  backdrop.append(panel);document.body.append(backdrop);dialogs.add(close);
 }
 const sceneNavigator={notification:{confirm:confirmDialog}};
 const confirms=(message,title,yes,no)=>confirmDialog(message,index=>index===1?yes?.():no?.(),title,['确定','取消']);
 // Only this lobby program is executable. The archived nine legacy modules,
 // their event replacements and core-ui.js are never loaded into a game.
 async function prepareScene(){
  if(disposed)throw new Error('手杀界面已退出');
  if(prepared)return prepared;
  const owner=scene,token=homeGeneration;
  const ensureActive=()=>{if(disposed||scene!==owner||token!==homeGeneration)throw new Error('手杀大厅已退出');};
  const job=(async()=>{
   css(base+'original/如真似幻/css/font.css');
   ({gsap:motion}=await loadVendor('original/如真似幻/js/gsap.min.js'));
   ensureActive();
   ({PIXI:graphics}=await loadVendor('original/如真似幻/js/pixi6.min.js'));
   const response=await fetch(base+'native/lobby.js',{signal:controller.signal});if(!response.ok)throw new Error('手杀大厅程序缺失');
   const source=await response.text();
   ensureActive();
   new Function('lib','game','ui','get','ai','_status','bridge','navigator','confirms','window','document','setTimeout','setInterval','requestAnimationFrame','PIXI','gsap',source)(context.lib,context.game,context.ui,context.get,context.ai,context._status,bridge,sceneNavigator,confirms,sceneWindow,sceneDocument,bridge.timeout,bridge.interval,bridge.frame,graphics,motion);
   homeFactory=sceneWindow.shoushaLobbyFactory(context.lib,context.game,context.ui,context.get,context.ai,context._status,bridge);
  })().catch(error=>{if(prepared===job)prepared=undefined;throw error;});prepared=job;return job;
 }
 return {base,bridge,config,reloadLobby,
  ownDialog(node){const release=()=>{node.remove();dialogs.delete(release);};dialogs.add(release);return release;},
  themes:[...new Set(files.filter(f=>f.startsWith('original/如真似幻/images/uiStyles/')&&f.endsWith('/ui.json')).map(f=>f.split('/')[4]))],
  loginThemes:[...new Set(files.filter(f=>f.startsWith('original/如真似幻/spine/startSpine/')&&f.endsWith('.skel')).map(f=>f.split('/')[4]))],
  saveSetting,
  openDynamicSkins:character=>animationService().openSkins(character),
  async home(current){
   if(disposed)return;
   const token=++homeGeneration;scene=current;
   const valid=()=>!disposed&&scene===current&&token===homeGeneration;
   await prepareScene();if(!valid())return;
   context.refreshCharacters();sceneWindow.playerNickName ||= {};sceneWindow.noname_character_rank=structuredClone(window.noname_character_rank||context.lib.rank);await portraitStore().prepare();if(!valid())return;
   homeFactory.createHome();
  },
  async prepareGame(){/* Core initialization owns all gameplay preparation. */},
  async installGame(){
   if(disposed||disposeGame)return;
   if(!installingGame)installingGame=mountGamePresentation({lib,game,ui,get,manifest,files,base,config,animations:animationService(),signal:controller.signal}).then(release=>{if(disposed)release();else disposeGame=release;}).finally(()=>{installingGame=undefined;});
   return installingGame;
  },
  dispose(){
   if(disposed)return;disposed=true;homeGeneration++;controller.abort();context.dispose();unsubscribeSkins();
   const releases=[()=>onlineController?.close(),()=>disposeGame?.(),()=>animations?.dispose(),()=>scene?.dispose(),()=>portraits?.dispose(),clearSceneNodes,...Array.from(sounds,audio=>()=>{audio.pause();audio.removeAttribute('src');}),...dialogs,...Array.from(styles,node=>()=>node.remove())];
   for(const release of releases)try{release();}catch(error){console.warn('手杀资源释放失败',error);}
   sounds.clear();dialogs.clear();styles.clear();clearInterval(portraitTimer);visiblePortraits.clear();
  },
 };
}
