import {lib,game,ui} from 'noname';
import {createNativeRuntime} from './native-runtime.js';
export const type='extension';
const base=import.meta.url.slice(0,import.meta.url.lastIndexOf('/')+1);
let installed,activeRuntime;

function openNativeSettings(runtime){
 const overlay=document.createElement('div');overlay.className='shousha-native-confirm shousha-native-settings';
 const panel=document.createElement('div'),title=document.createElement('h3');title.textContent='手杀标准UI · 原版界面设置';panel.append(title);
 const home=document.createElement('details'),homeTitle=document.createElement('summary');homeTitle.textContent='登录与大厅';home.append(homeTitle);panel.append(home);
 const online=document.createElement('p');online.textContent='联机大厅：使用默认 UI 的现有大厅。专属大厅接口已保留，暂未开放。';home.append(online);
 for(const [label,items,current,onchange] of [
  ['大厅主题',runtime.themes,runtime.config.uiStyles,value=>runtime.saveSetting('uiStyles',value)],
  ['登录动画',runtime.loginThemes,runtime.bridge.storage.getItem('rzsh_loginui')||'戏志才·举棋若定',value=>runtime.bridge.storage.setItem('rzsh_loginui',value)],
 ]){const row=document.createElement('label'),caption=document.createElement('span'),input=document.createElement('select');caption.textContent=label;for(const name of items){const option=document.createElement('option');option.value=name;option.textContent=name;input.append(option);}input.value=current;input.onchange=()=>onchange(input.value);row.append(caption,input);home.append(row);}
 const sectionNames={'十周年UI':'对局、卡牌与武将框','手杀ui':'操作与技能控件','选将美化':'选将与提示','手杀MVP':'结算与 MVP','皮肤切换':'动态皮肤','千幻聆音':'皮肤与语音','标记补充':'标记与特效','电脑适配':'鼠标与触控'};
 for(const [name,pack] of runtime.packs){
  if(!sectionNames[name])continue;
  const section=document.createElement('details'),heading=document.createElement('summary');heading.textContent=sectionNames[name];section.append(heading);panel.append(section);
  for(const [key,option] of Object.entries(pack.config||{})){
   if(option.unshow||option.clear||!Object.hasOwn(option,'init'))continue;
   const label=document.createElement('label'),text=document.createElement('span');text.innerHTML=option.name||key;const configKey='extension_'+name+'_'+key;let input;
   if(option.item){input=document.createElement('select');for(const [value,name] of Object.entries(option.item)){const o=document.createElement('option');o.value=value;o.textContent=String(name).replace(/<[^>]*>/g,'');input.append(o);}input.value=runtime.config[configKey];}
   else if(typeof option.init==='boolean'){input=document.createElement('input');input.type='checkbox';input.checked=runtime.config[configKey];}
   else{input=document.createElement('input');input.value=runtime.config[configKey]??option.init;}
   input.onchange=()=>runtime.saveSetting(configKey,input.type==='checkbox'?input.checked:input.value);label.append(text,input);section.append(label);
  }
 }
 const close=document.createElement('button');close.textContent='保存并重启';close.onclick=()=>runtime.reloadLobby();const back=document.createElement('button');back.textContent='返回';back.onclick=()=>overlay.remove();panel.append(close,back);overlay.append(panel);document.body.append(overlay);
}

function createScene(runtime,node,resolve){
 const timers=new Set(),intervals=new Set(),frames=new Set(),apps=new Set(),resources=new Set(),tweens=new Set();
 const screen={width:514*(node.clientWidth||1103)/(node.clientHeight||514),height:514};
 let iframe,observer,finishing=false,closed=false,app;
 const scene={screen,
  get isHome(){return !!app&&!closed;},
  own(resource){resources.add(resource);return resource;},
  ownTween(tween){tweens.add(tween);return tween;},
  isVisible(sprite){let root=sprite;while(root){if(root.visible===false||root.renderable===false||root.alpha===0)return false;if(!root.parent)break;root=root.parent;}return [...apps].some(application=>application.stage===root);},
  mount(application){app=application;apps.add(app);node.append(app.view);const resize=()=>{if(closed)return;const scale=node.clientHeight/screen.height;app.view.style.width=screen.width*scale+'px';app.view.style.height=screen.height*scale+'px';};observer=new ResizeObserver(resize);observer.observe(node);resize();},
  ready(){loading.remove();},
  suspendRendering(){
   const running=[...apps].filter(application=>application.ticker?.started);
   const timeline=window.gsap?.globalTimeline,wasPaused=timeline?.paused();
   running.forEach(application=>application.stop());timeline?.pause();
   return()=>{if(closed)return;running.forEach(application=>application.start());if(!wasPaused)timeline?.resume();};
  },
  async finish(mode){
   if(finishing||closed)return;
   if(mode==='connect')return runtime.bridge.openOnlineLobby();
   if(!lib.config.all.mode.includes(mode)){alert('当前工程尚未安装此玩法，请在扩展管理中安装对应游戏模式。');return;}
   finishing=true;
   try{await runtime.prepareGame();await game.promises.saveConfig('sessionType','offline');game.isInMenu=false;game.isRzJiemian=false;resolve(mode);}
   catch(error){console.error(error);alert('对局界面未能加载，将返回大厅：'+error.message);runtime.reloadLobby();}
  },
  login(){if(iframe)return;iframe=document.createElement('iframe');iframe.title='手杀标准UI登录';iframe.style.visibility='hidden';const login=new URL('original/如真似幻/html/rzsh.html',base);login.searchParams.set('nickname',lib.config.connect_nickname||'无名玩家');login.searchParams.set('volume',String((lib.config.volumn_background||0)/8));iframe.src=login.href;node.append(loading,iframe);},
  dispose(){if(closed)return;closed=true;observer?.disconnect();window.removeEventListener('message',onMessage);timers.forEach(clearTimeout);intervals.forEach(clearInterval);frames.forEach(cancelAnimationFrame);tweens.forEach(tween=>tween.kill());tweens.clear();for(const resource of resources)resource.destroy?.();for(const application of apps)if(application.renderer)application.destroy(true,{children:true});runtime.bridge.releaseScene(scene);iframe?.remove();toolbar.remove();loading.remove();ui.backgroundMusicRZ?.pause();},
  timeout(fn,ms,...args){const id=setTimeout(()=>{timers.delete(id);if(!closed)fn(...args);},ms);timers.add(id);return id;},
  interval(fn,ms,...args){const id=setInterval(()=>{if(!closed)fn(...args);},ms);intervals.add(id);return id;},
  frame(fn){const id=requestAnimationFrame(t=>{frames.delete(id);if(!closed)fn(t);});frames.add(id);return id;},
 };
 const loading=document.createElement('div');loading.className='shousha-native-loading';const boot=document.createElement('iframe');boot.title='手杀标准UI · 加载中';boot.src=base+'boot.html';loading.append(boot);
 const toolbar=document.createElement('div');toolbar.className='shousha-native-tools';
 for(const [label,action] of [['UI工坊',()=>lib.uiWorkshop.open()],['界面设置',()=>openNativeSettings(runtime)],['联机房间',()=>runtime.bridge.openOnlineLobby()]]){const button=document.createElement('button');button.textContent=label;button.onclick=action;toolbar.append(button);}node.append(toolbar);
 async function onMessage(event){
  if(event.source!==iframe?.contentWindow||event.origin!==location.origin)return;
  if(event.data?.type==='shousha-login-ready'){iframe.style.visibility='visible';loading.remove();return;}
  if(event.data?.type==='shousha-login-error'){loading.textContent='登录界面加载失败：'+event.data.message;return;}
  if(event.data?.type==='shousha-profile'||event.data?.type==='shousha-login'){runtime.bridge.storage.setItem('loggedIn',event.data.nickname);await game.promises.saveConfig('connect_nickname',String(event.data.nickname));}
  if(event.data?.type==='shousha-login'){iframe.remove();iframe=null;runtime.bridge.session.setItem('Network','online');if(!app){node.append(loading);try{await runtime.home(scene);}catch(error){loading.textContent='界面加载失败：'+error.message;console.error(error);}}}
 }
 window.addEventListener('message',onMessage);
 if(runtime.bridge.session.getItem('returnHome')==='true'){runtime.bridge.session.removeItem('returnHome');node.append(loading);runtime.home(scene).catch(error=>{loading.textContent='界面加载失败：'+error.message;console.error(error);});}else scene.login();return scene;
}

export async function activate(manifest){
 if(installed)return installed;
 const style=document.createElement('link');style.rel='stylesheet';style.href=base+'native.css';document.head.append(style);
 const runtime=await createNativeRuntime(manifest);
 activeRuntime=runtime;
 if(lib.uiWorkshop)lib.uiWorkshop.openSuiteSettings=()=>openNativeSettings(runtime);
 const splash={id:'shousha-standard',name:'手杀标准UI',scene:null,
  async init(node,resolve){node.classList.add('shousha-native-splash');this.scene=createScene(runtime,node,resolve);},
  async dispose(node){this.scene?.dispose();this.scene=null;node?.remove();return true;},
  preview(node){node.style.backgroundImage=`url("${base}original/如真似幻/images/uiStyles/经典主题/bg.jpg")`;},
 };
 lib.onloadSplashes ||= [];
 if(manifest.components.home?.runtime==='shousha'){lib.onloadSplashes=lib.onloadSplashes.filter(item=>item.id!==splash.id);lib.onloadSplashes.push(splash);lib.config.splash_style=splash.id;}
 if(Object.entries(manifest.components).some(([key,value])=>key!=='home'&&value.runtime==='shousha')){lib.extensions ||= [];lib.extensions.push(['手杀标准UI',()=>runtime.installGame(),{},false,{nopack:true},false]);}
 installed=()=>{splash.dispose();runtime.dispose();style.remove();lib.onloadSplashes=lib.onloadSplashes.filter(item=>item!==splash);if(lib.uiWorkshop)delete lib.uiWorkshop.openSuiteSettings;activeRuntime=null;installed=null;};return installed;
}

export async function mountPreview(node,manifest,screen='login'){
 const doc=node.ownerDocument,frame=doc.createElement('iframe');frame.title='手杀标准UI · 原版界面预览';frame.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0';const url=new URL(screen==='login'?'original/如真似幻/html/rzsh.html':'preview.html',base);url.searchParams.set('preview',screen);frame.src=url.href;node.replaceChildren(frame);return()=>frame.remove();
}
export default function(){return {name:'手杀标准UI',editable:false,package:{nopack:true,version:'2.0.0',author:'原界面及各 UI 模块作者；PXLNGU整合',intro:'手杀标准UI：完整界面、交互与本地素材。'},
 async precontent(){const manifest=await(await fetch(base+'ui-workshop.json')).json();if(lib.uiWorkshop)await lib.uiWorkshop.registerExtension(manifest,'手杀标准UI');else await activate(manifest);},
 config:{settings:{name:'手杀标准UI · 界面设置',clear:true,onclick(){if(activeRuntime)openNativeSettings(activeRuntime);else alert('请先应用手杀标准UI，再打开界面设置。');}},apply:{name:'使用手杀标准UI',clear:true,async onclick(){const manifest=await(await fetch(base+'ui-workshop.json')).json();await lib.uiWorkshop.registerExtension(manifest,'手杀标准UI');await lib.uiWorkshop.use(manifest.id);game.reload();}}},content(){},
};}
