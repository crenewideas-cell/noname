import {lib, game, ui, get, createSceneContext, openSkinGallery} from 'noname';
import {createPortraitTextures} from './native/portraits.js';
import {createResourceAccess} from './native/resources.js';
import {mountGamePresentation} from './native/presentation.js';

// Keep the logical extension directory and its trailing slash. Vite's asset
// URL transform treats new URL('./', import.meta.url) as an asset path and can
// remove the slash, producing e.g. 手杀标准UIfiles.json on concatenation.
const base = import.meta.url.slice(0, import.meta.url.lastIndexOf('/') + 1);
const vendors = new Map();
function loadVendor(file) {
 if(vendors.has(file))return vendors.get(file);
 const promise=new Promise((resolve,reject)=>{
  const node=document.createElement('script');node.src=base+file;node.async=false;
  node.onload=resolve;node.onerror=()=>{node.remove();reject(new Error('界面资源加载失败：'+file));};
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
 hidepack:[],favouriteCharacter:[],recentCharacter:[],rzsh_cards:true,rzsh_mvp:true,
 tianti_versus_two:{count:0,top:40,win:0,fail:0,num:0,top_win:0,win_Cty:0,xxingnum:0}};

export async function createNativeRuntime(manifest) {
 const inventory=await fetch(base+'files.json');
 if(!inventory.ok)throw new Error('手杀界面素材清单加载失败：'+inventory.status);
 const files=await inventory.json();
 const storage=scopedStorage(localStorage),session=scopedStorage(sessionStorage),styles=new Set(),dialogs=new Set();
 let scene,portraits,portraitTimer,prepared,homeFactory,disposeGame,disposed=false,onlineEntry=false;
 const visiblePortraits=new Set();
 const sourceNames=['如真似幻','十周年UI','手杀ui','选将美化','手杀MVP','皮肤切换','千幻聆音','标记补充','电脑适配'];
 function url(input){let value=String(input);for(const name of sourceNames)value=value.replace('extension/'+name+'/',base+'original/'+name+'/');value=value.replace('extension/手杀标准UI/',base);const at=value.indexOf(base);return at>0?value.slice(at):value;}
 function localPath(input){const resolved=new URL(url(input),location.href).href;return resolved.startsWith(base)?decodeURIComponent(resolved.slice(base.length).split(/[?#]/)[0]).replace(/\/+/g,'/'):null;}
 const resources=createResourceAccess({files,localPath,url,assetURL:lib.assetURL,game});
 function css(path){const node=document.createElement('link');node.rel='stylesheet';node.href=url(path);document.head.append(node);styles.add(node);return node;}
 function reloadLobby(){sessionStorage.setItem(lib.configprefix+'return_to_lobby','true');session.setItem('returnHome',scene?.isHome?'true':'false');localStorage.removeItem(lib.configprefix+'directstart');game.reload();}
 const context=createSceneContext({lib,game,ui,get},{settingsKey:'ui_workshop_shousha_settings',defaults,actions:{
  reload:reloadLobby,reload3:reloadLobby,getFileList:resources.list,
  createCss(text){const node=document.createElement('style');node.textContent=text;document.head.append(node);styles.add(node);return node;},
  storyBackground(){if(ui.background)ui.background.style.backgroundImage=`url("${base}original/core/image/background/1.jpg")`;},
  updateBackground(){},
  playAudio(...args){const path=args.filter(arg=>typeof arg==='string'||typeof arg==='number').join('/');const local=localPath(path);return game.playAudio({path:local===null?path:'ext:手杀标准UI/'+local,addVideo:false});},
 }});
 const {config}=context;
 window.playerNickName ||= {};
 storage.setItem('hideModesA','true');storage.setItem('liuli_tenUIfix','fix');storage.setItem('firstSTBG','on');
 storage.setItem('loggedIn',lib.config.connect_nickname||'无名玩家');session.setItem('Network','online');session.setItem('rzshk','true');
 function portraitStore(){return portraits ||= createPortraitTextures({PIXI:window.PIXI,character:name=>context.lib.character[name]||Object.values(context.lib.characterPack).map(pack=>pack[name]).find(Boolean),assetURL:lib.assetURL,defaultPath:lib.characterDefaultPicturePath,readImage:key=>game.getDB('image',key),url});}
 const bridge={storage,session,url,
  timeout:(fn,ms,...args)=>scene?scene.timeout(fn,ms,...args):setTimeout(fn,ms,...args),
  interval:(fn,ms,...args)=>scene?scene.interval(fn,ms,...args):setInterval(fn,ms,...args),
  frame:fn=>scene?scene.frame(fn):requestAnimationFrame(fn),
  own:resource=>scene?.own(resource)||resource,
  tween(method,...args){const tween=window.gsap[method](...args);scene?.ownTween(tween);return tween;},
  get screen(){return scene?.screen||{width:1103,height:514};},
  mount(app){scene.mount(app);},ready(){scene?.ready();},login(){scene?.login();},
  async finish(mode){if(mode==='connect')return bridge.openOnlineLobby();try{await context.commitMode(mode);portraits?.pause();await scene?.finish(mode);}catch(error){console.error(error);bridge.notice(error.message);}},
  releaseScene(current){if(scene!==current)return;clearInterval(portraitTimer);portraitTimer=undefined;visiblePortraits.clear();portraits?.dispose();portraits=undefined;context.ui.backgroundMusicRZ?.pause();scene=undefined;},
  async openOnlineLobby(){if(onlineEntry)return;onlineEntry=true;const resume=scene?.suspendRendering();try{const entry=await lib.uiWorkshop.openRooms('identity');await entry?.closed;}catch(error){console.error(error);bridge.notice(error.message);}finally{onlineEntry=false;resume?.();}},
  watchPortrait(sprite,name,options){visiblePortraits.add({sprite,name,options});if(portraitTimer)return;portraitTimer=scene.interval(()=>{
   let started=0;for(const entry of visiblePortraits){if(entry.sprite.destroyed){visiblePortraits.delete(entry);continue;}if(!entry.sprite.worldVisible||!scene.isVisible(entry.sprite))continue;
    const bounds=entry.sprite.getBounds();if(bounds.x+bounds.width<0||bounds.y+bounds.height<0||bounds.x>bridge.screen.width||bounds.y>bridge.screen.height)continue;
    entry.sprite.texture=portraitStore().get(entry.name,entry.options);entry.sprite.width=entry.options.width;entry.sprite.height=entry.options.height;visiblePortraits.delete(entry);if(++started===12)break;
   }},200);},
  framePortrait(player,portrait,labels){const frame=new window.PIXI.Graphics();frame.lineStyle(7,0x251b13,1).drawRoundedRect(-86,-139,172,198,6);frame.lineStyle(2,0xbda36b,1).drawRoundedRect(-86,-139,172,198,6);frame.lineStyle(1,0xead6a0,.8).drawRoundedRect(-81,-134,162,188,3);player.addChildAt(frame,player.getChildIndex(labels));},
  notice(message){const node=document.createElement('div');node.className='shousha-native-notice';node.textContent=message;document.body.append(node);setTimeout(()=>node.remove(),4500);},
  character:name=>openSkinGallery(name),collection:()=>openSkinGallery(Object.keys(lib.character)[0]),
  characterTexture:(name,options)=>portraitStore().get(name,options),
 };
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
  if(prepared)return prepared;
  prepared=(async()=>{
   css(base+'original/如真似幻/css/font.css');
   await loadVendor('original/如真似幻/js/gsap.min.js');
   await loadVendor('original/如真似幻/js/pixi6.min.js');
   const response=await fetch(base+'native/lobby.js');if(!response.ok)throw new Error('手杀大厅程序缺失');
   const source=await response.text();
   new Function('lib','game','ui','get','ai','_status','bridge','navigator','confirms',source)(context.lib,context.game,context.ui,context.get,context.ai,context._status,bridge,sceneNavigator,confirms);
   homeFactory=window.shoushaLobbyFactory(context.lib,context.game,context.ui,context.get,context.ai,context._status,bridge);
  })().catch(error=>{prepared=undefined;throw error;});return prepared;
 }
 return {base,bridge,config,reloadLobby,
  themes:[...new Set(files.filter(f=>f.startsWith('original/如真似幻/images/uiStyles/')&&f.endsWith('/ui.json')).map(f=>f.split('/')[4]))],
  loginThemes:[...new Set(files.filter(f=>f.startsWith('original/如真似幻/spine/startSpine/')&&f.endsWith('.skel')).map(f=>f.split('/')[4]))],
  saveSetting:(key,value)=>context.game.saveConfig(key,value),
  async home(current){scene=current;await prepareScene();await lib.uiWorkshop?.prepareCharacters?.();context.refreshCharacters();await portraitStore().prepare();homeFactory.createHome();},
  async prepareGame(){/* Core initialization owns all gameplay preparation. */},
  async installGame(){if(!disposed&&!disposeGame)disposeGame=mountGamePresentation({lib,game,ui,get,manifest,files,base,config});},
  dispose(){disposed=true;disposeGame?.();scene?.dispose();portraits?.dispose();dialogs.forEach(close=>close());styles.forEach(node=>node.remove());},
 };
}
