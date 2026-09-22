import {lib,game,ui} from 'noname';
export const type='extension';
const base=import.meta.url.slice(0,import.meta.url.lastIndexOf('/')+1);
let installed,activeRuntime;

function openNativeSettings(runtime){
 const overlay=document.createElement('div');overlay.className='shousha-native-confirm shousha-native-settings';
 const dismiss=runtime.ownDialog(overlay);
 const panel=document.createElement('div'),title=document.createElement('h3');title.textContent='手杀标准UI · 界面设置';panel.append(title);
 const home=document.createElement('details'),homeTitle=document.createElement('summary');homeTitle.textContent='登录与大厅';home.append(homeTitle);panel.append(home);
 const online=document.createElement('p');online.textContent='联机大厅：使用默认 UI 的现有大厅。专属大厅接口已保留，暂未开放。';home.append(online);
 for(const [label,items,current,onchange] of [
  ['大厅主题',runtime.themes,runtime.config.uiStyles,value=>runtime.saveSetting('uiStyles',value)],
  ['登录动画',runtime.loginThemes,runtime.bridge.storage.getItem('rzsh_loginui')||'戏志才·举棋若定',value=>runtime.bridge.storage.setItem('rzsh_loginui',value)],
 ]){const row=document.createElement('label'),caption=document.createElement('span'),input=document.createElement('select');caption.textContent=label;for(const name of items){const option=document.createElement('option');option.value=name;option.textContent=name;input.append(option);}input.value=current;input.onchange=()=>onchange(input.value);row.append(caption,input);home.append(row);}
 const section=document.createElement('details'),heading=document.createElement('summary');heading.textContent='对局外观';section.open=true;section.append(heading);panel.append(section);
 for(const [key,name] of [['rzsh_cards','手杀卡牌插画'],['ss_dynamic','动态武将立绘'],['ss_effects','对局动画特效'],['rzsh_mvp','结算统计面板']]){
  const label=document.createElement('label'),text=document.createElement('span'),input=document.createElement('input');text.textContent=name;input.type='checkbox';input.checked=runtime.config[key]!==false;input.onchange=()=>runtime.saveSetting(key,input.checked);label.append(text,input);section.append(label);
 }
 const skins=document.createElement('button');skins.textContent='武将皮肤';skins.onclick=()=>runtime.bridge.collection();panel.append(skins);
 const dynamic=document.createElement('button');dynamic.textContent='动态皮肤';dynamic.onclick=()=>runtime.openDynamicSkins().catch(error=>runtime.bridge.notice(error.message));panel.append(dynamic);
 const close=document.createElement('button');close.textContent='保存并重启';close.onclick=()=>runtime.reloadLobby();const back=document.createElement('button');back.textContent='返回';back.onclick=dismiss;panel.append(close,back);overlay.append(panel);document.body.append(overlay);
}

function createScene(runtime,node,resolve){
 const timers=new Set(),intervals=new Set(),frames=new Set(),apps=new Set(),resources=new Set(),tweens=new Set();
 const screen={width:514*(node.clientWidth||1103)/(node.clientHeight||514),height:514};
 let iframe,observer,finishing=false,closed=false,app,loginStarting=false;
 const runVisual=(fn,...args)=>{if(closed)return;try{Promise.resolve(fn(...args)).catch(error=>runtime.bridge.notice('大厅展示失败：'+error.message));}catch(error){runtime.bridge.notice('大厅展示失败：'+error.message);}};
 const scene={screen,
  get isHome(){return !!app&&!closed;},
  own(resource){if(closed)resource.destroy?.();else resources.add(resource);return resource;},
  ownTween(tween){if(closed)tween.kill();else tweens.add(tween);return tween;},
  isVisible(sprite){let root=sprite;while(root){if(root.visible===false||root.renderable===false||root.alpha===0)return false;if(!root.parent)break;root=root.parent;}return [...apps].some(application=>application.stage===root);},
  mount(application){if(closed){application.destroy(true,{children:true});return;}app=application;apps.add(app);node.append(app.view);const resize=()=>{if(closed)return;const scale=node.clientHeight/screen.height;app.view.style.width=screen.width*scale+'px';app.view.style.height=screen.height*scale+'px';};observer=new ResizeObserver(resize);observer.observe(node);resize();},
  ready(){loading.remove();},
  suspendRendering(){
   const running=[...apps].filter(application=>application.ticker?.started);
   const runningTweens=[...tweens].filter(tween=>!tween.paused());
   running.forEach(application=>application.stop());runningTweens.forEach(tween=>tween.pause());
   return()=>{if(closed)return;running.forEach(application=>application.start());runningTweens.forEach(tween=>tween.resume());};
  },
  async finish(mode){
   if(finishing||closed)return;
   if(mode==='connect')return runtime.bridge.openOnlineLobby();
   if(!lib.config.all.mode.includes(mode)){alert('当前工程尚未安装此玩法，请在扩展管理中安装对应游戏模式。');return;}
   finishing=true;
   try{await runtime.prepareGame();if(closed)return;await game.promises.saveConfig('sessionType','offline');if(!closed)resolve(mode);}
   catch(error){finishing=false;console.error(error);runtime.bridge.notice('开始对局失败：'+error.message);}
  },
  login(){if(iframe)return;iframe=document.createElement('iframe');iframe.title='手杀标准UI登录';iframe.style.visibility='hidden';const login=new URL('original/如真似幻/html/rzsh.html',base);login.searchParams.set('nickname',lib.config.connect_nickname||'无名玩家');login.searchParams.set('volume',String((lib.config.volumn_background||0)/8));iframe.src=login.href;node.append(loading,iframe);},
  dispose(){
   if(closed)return;closed=true;observer?.disconnect();window.removeEventListener('message',onMessage);
   timers.forEach(clearTimeout);intervals.forEach(clearInterval);frames.forEach(cancelAnimationFrame);
   const releases=[...Array.from(tweens,tween=>()=>tween.kill()),...Array.from(resources,resource=>()=>resource.destroy?.()),...Array.from(apps,application=>()=>{if(application.renderer)application.destroy(true,{children:true});}),()=>runtime.bridge.releaseScene(scene)];
   for(const release of releases)try{release();}catch(error){console.warn('手杀大厅资源释放失败',error);}
   tweens.clear();resources.clear();apps.clear();iframe?.remove();toolbar.remove();loading.remove();
  },
  timeout(fn,ms,...args){if(closed)return 0;const id=setTimeout(()=>{timers.delete(id);runVisual(fn,...args);},ms);timers.add(id);return id;},
  interval(fn,ms,...args){if(closed)return 0;const id=setInterval(()=>runVisual(fn,...args),ms);intervals.add(id);return id;},
  frame(fn){if(closed)return 0;const id=requestAnimationFrame(t=>{frames.delete(id);runVisual(fn,t);});frames.add(id);return id;},
 };
 const loading=document.createElement('div');loading.className='shousha-native-loading';const boot=document.createElement('iframe');boot.title='手杀标准UI · 加载中';boot.src=base+'boot.html';loading.append(boot);
 function showLoadError(error){
  if(closed)return;loading.classList.add('shousha-native-load-error');loading.textContent='界面加载失败：'+(error.message||error);node.append(loading);
  const retry=document.createElement('button');retry.textContent='重新加载手杀界面';retry.onclick=()=>runtime.reloadLobby();loading.append(retry);
 }
 const toolbar=document.createElement('div');toolbar.className='shousha-native-tools';
 for(const [label,action] of [['UI工坊',()=>lib.uiWorkshop.open()],['界面设置',()=>openNativeSettings(runtime)],['联机房间',()=>runtime.bridge.openOnlineLobby()]]){const button=document.createElement('button');button.textContent=label;button.onclick=action;toolbar.append(button);}node.append(toolbar);
 async function onMessage(event){
  if(closed||event.source!==iframe?.contentWindow||event.origin!==location.origin)return;
  if(event.data?.type==='shousha-login-ready'){iframe.style.visibility='visible';loading.remove();return;}
  if(event.data?.type==='shousha-login-error'){showLoadError(event.data.message);return;}
  if(!['shousha-profile','shousha-login'].includes(event.data?.type))return;
  if(typeof event.data.nickname!=='string'||!event.data.nickname.trim())return;
  const loggingIn=event.data.type==='shousha-login';
  if(loggingIn&&loginStarting)return;
  if(loggingIn)loginStarting=true;
  try{
   runtime.bridge.storage.setItem('loggedIn',event.data.nickname);await game.promises.saveConfig('connect_nickname',event.data.nickname);
   if(closed)return;
   if(event.data.type==='shousha-login'){iframe?.remove();iframe=null;runtime.bridge.session.setItem('Network','online');if(!app){node.append(loading);await runtime.home(scene);}}
  }catch(error){showLoadError(error);}finally{if(loggingIn)loginStarting=false;}
 }
 window.addEventListener('message',onMessage);
 const onlineReturn=sessionStorage.getItem('noname_online_return');
 if(onlineReturn){sessionStorage.removeItem('noname_online_return');node.append(loading);runtime.home(scene).then(()=>{if(!closed)return runtime.bridge.openOnlineLobby(onlineReturn);}).catch(showLoadError);}
 else if(runtime.bridge.session.getItem('returnHome')==='true'){runtime.bridge.session.removeItem('returnHome');node.append(loading);runtime.home(scene).catch(showLoadError);}else scene.login();return scene;
}

export async function activate(manifest){
 if(installed)return installed;
 const style=document.createElement('link');style.rel='stylesheet';style.href=base+'native.css';document.head.append(style);
 let runtime,preparing,arenaError,disposed=false;
 const hasGameSkin=Object.entries(manifest.components).some(([key,value])=>key!=='home'&&value.runtime==='shousha');
 async function prepare(){
  if(!preparing)preparing=import('./native-runtime.js').then(module=>module.createNativeRuntime(manifest)).then(value=>{
   if(disposed){value.dispose();throw new Error('手杀界面已退出');}
   runtime=value;activeRuntime=value;
   if(lib.uiWorkshop?.failedId===manifest.id){delete lib.uiWorkshop.failedId;delete lib.uiWorkshop.error;}
   return value;
  }).catch(error=>{preparing=undefined;throw error;});
  return preparing;
 }
 const openSettings=async()=>openNativeSettings(await prepare());
 if(lib.uiWorkshop)lib.uiWorkshop.openSuiteSettings=openSettings;
 const splash={id:'shousha-standard',name:'手杀标准UI',scene:null,
  async init(node,resolve){
   node.classList.add('shousha-native-splash');
   const loading=document.createElement('div');loading.className='shousha-native-loading';loading.textContent='正在载入手杀界面…';node.append(loading);
   try{const value=await prepare();if(disposed||!node.isConnected)return;loading.remove();this.scene=createScene(value,node,resolve);}
   catch(error){
    if(disposed||!node.isConnected)return;
    console.error('手杀大厅加载失败',error);loading.classList.add('shousha-native-load-error');loading.textContent='手杀界面加载失败：'+error.message;
    if(lib.uiWorkshop){lib.uiWorkshop.failedId=manifest.id;lib.uiWorkshop.error=loading.textContent;}
    const retry=document.createElement('button');retry.textContent='重新加载手杀界面';retry.onclick=()=>{loading.remove();void splash.init(node,resolve);};
    const workshop=document.createElement('button');workshop.textContent='打开 UI 工坊';workshop.onclick=()=>lib.uiWorkshop?.open();loading.append(retry,workshop);
   }
  },
  async dispose(node){this.scene?.dispose();this.scene=null;node?.remove();return true;},
  preview(node){node.style.backgroundImage=`url("${base}original/如真似幻/images/uiStyles/经典主题/bg.jpg")`;},
 };
 lib.onloadSplashes ||= [];
 if(manifest.components.home?.runtime==='shousha'){lib.onloadSplashes=lib.onloadSplashes.filter(item=>item.id!==splash.id);lib.onloadSplashes.push(splash);lib.config.splash_style=splash.id;}
 // Register the selected lobby synchronously. Arena skin assets load only when
 // an arena exists; their failure must never replace the selected home screen.
 const mountArena=()=>{
  if(disposed||!hasGameSkin)return;
  void prepare().then(value=>value.installGame()).then(()=>{
   if(disposed)return;
   arenaError?.remove();arenaError=undefined;
   if(lib.uiWorkshop?.failedId===manifest.id){delete lib.uiWorkshop.failedId;delete lib.uiWorkshop.error;}
  }).catch(error=>{
   if(disposed)return;
   console.error('手杀对局皮肤加载失败',error);
   const message='手杀对局皮肤加载失败：'+error.message;
   if(lib.uiWorkshop){lib.uiWorkshop.failedId=manifest.id;lib.uiWorkshop.error=message;}
   arenaError?.remove();arenaError=document.createElement('div');arenaError.className='shousha-native-notice';arenaError.style.pointerEvents='auto';arenaError.textContent=message;
   const retry=document.createElement('button');retry.textContent='重试皮肤加载';retry.onclick=mountArena;arenaError.append(retry);document.body.append(arenaError);
  });
 };
 if(hasGameSkin){if(ui.arena)mountArena();else lib.arenaReady.push(mountArena);}
 installed=()=>{if(disposed)return;disposed=true;runtime?.dispose();void splash.dispose();arenaError?.remove();style.remove();const at=lib.arenaReady?.indexOf(mountArena);if(at>=0)lib.arenaReady.splice(at,1);lib.onloadSplashes=lib.onloadSplashes.filter(item=>item!==splash);if(lib.uiWorkshop?.openSuiteSettings===openSettings)delete lib.uiWorkshop.openSuiteSettings;activeRuntime=null;installed=null;};return installed;
}

export async function mountPreview(node,manifest,screen='login'){
 const doc=node.ownerDocument,frame=doc.createElement('iframe');frame.title='手杀标准UI · 原版界面预览';frame.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0';const url=new URL(screen==='login'?'original/如真似幻/html/rzsh.html':'preview.html',base);url.searchParams.set('preview',screen);frame.src=url.href;node.replaceChildren(frame);return()=>frame.remove();
}
export default function(){return {name:'手杀标准UI',editable:false,package:{nopack:true,version:'2.0.0',author:'原界面及各 UI 模块作者；PXLNGU整合',intro:'手杀标准UI：原素材登录与大厅，本体节点的卡牌、武将框、按钮及结算展示；选将、技能、AI、胜负与联机统一使用本体逻辑。'},
 async precontent(){const manifest=await(await fetch(base+'ui-workshop.json')).json();if(lib.uiWorkshop)await lib.uiWorkshop.registerExtension(manifest,'手杀标准UI');else await activate(manifest);},
 config:{settings:{name:'手杀标准UI · 界面设置',clear:true,onclick(){if(activeRuntime)openNativeSettings(activeRuntime);else alert('请先应用手杀标准UI，再打开界面设置。');}},apply:{name:'使用手杀标准UI',clear:true,async onclick(){const manifest=await(await fetch(base+'ui-workshop.json')).json();await lib.uiWorkshop.registerExtension(manifest,'手杀标准UI');await lib.uiWorkshop.use(manifest.id);game.reload();}}},content(){},
};}
