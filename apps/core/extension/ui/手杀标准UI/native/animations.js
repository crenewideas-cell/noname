import {subscribePresentation} from 'noname';
import {createAnimationRenderer} from './animation-renderer.js';

let library;
async function loadLibrary(base){
 if(!library)library=(async()=>{
  const response=await fetch(base+'original/十周年UI/spine.js');
  if(!response.ok)throw new Error('Spine 渲染资源加载失败');
  // Fixed bundled graphics library, with its namespace kept inside this call.
  // Never load animation.js's legacy gameplay registration callback.
  const spine=new Function(await response.text()+'\nreturn spine;').call({});
  return createAnimationRenderer(spine);
 })().catch(error=>{library=undefined;throw error;});
 return library;
}
const cardEffects={sha:'heisha',shan:'shan',tao:'tao',jiu:'jiu',wuxie:'wuxiekeji',wuzhong:'wuzhongshengyou',guohe:'guohechaiqiao',shunshou:'shunshouqianyang',juedou:'juedou',nanman:'nanmanruqin',wanjian:'wanjianqifa',taoyuan:'taoyuanjieyi',wugu:'wugufengdeng',huogong:'huogong',tiesuo:'tiesuolianhuan',lebu:'lebusishu',bingliang:'bingliangcunduan',shandian:'shandian'};

export function mountSkinAnimations({base,files,config,active=()=>true,enabled=()=>true,label=name=>name,saveSetting,parts}){
 const inventory=new Set(files),portraits=new Map(),renderers=new Set(),pending=new WeakMap(),specialSkills=new Map(),failedPortraits=new WeakMap();
 let disposed=false,effects,portraitRenderer,metadata,ready,scanFrame=0,gallery;
 const assetType=(root,name)=>['skel','json'].find(type=>inventory.has(root+name+'.'+type));
 const effectsRoot='original/十周年UI/assets/animation/',skinsRoot='original/十周年UI/assets/dynamic/';
 function destroy(renderer){
  if(!renderer)return;
  renderers.delete(renderer);cancelAnimationFrame(renderer.requestId);renderer.canvas.remove();
  for(const release of [()=>renderer.stopSpineAll(),()=>{renderer.nodes.length=0;},()=>renderer.spine.assetManager?.dispose?.(),()=>renderer.spine.shader?.dispose?.(),()=>renderer.spine.batcher?.dispose?.(),()=>renderer.gl?.getExtension('WEBGL_lose_context')?.loseContext()])try{release();}catch(error){console.warn('动画资源释放失败',error);}
 }
 function guardedRender(renderer,draw){return function(time){
  if(disposed||!renderers.has(renderer))return;
  try{draw.call(this,time);}catch(error){
   for(const [avatar,entry] of portraits)if(entry.renderer===renderer){failedPortraits.set(avatar,entry.character+':'+entry.label);removePortrait(avatar,entry);}
   destroy(renderer);
   if(renderer.canvas.classList.contains('ss-animation-canvas'))effects=undefined;
   else portraitRenderer=undefined;
   console.warn('手杀动画绘制失败，可重新开启动画重试',error);
  }
 };}
 async function prepare(){
  if(!ready)ready=Promise.all([loadLibrary(base),fetch(base+'native/animation-assets.json').then(response=>{if(!response.ok)throw new Error('动态素材清单加载失败');return response.json();})]).then(([classes,data])=>{metadata=data;return classes;}).catch(error=>{ready=undefined;throw error;});
  return ready;
 }
 async function makeRenderer(root,offscreen=false){
  const classes=await prepare();if(disposed)return;
  const canvas=document.createElement('canvas');
  const renderer=new classes.AnimationPlayer(base+root,offscreen?'offscreen':document.body,offscreen?canvas:undefined);
  if(!renderer.gl){renderer.canvas.remove();throw new Error('当前设备无法创建动画画布');}
  renderer.canvas.className=offscreen?'ss-dynamic-source':'ss-animation-canvas';
  if(!offscreen)renderer.canvas.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:10002;pointer-events:none';
  renderer.canvas.setAttribute('aria-hidden','true');renderers.add(renderer);pending.set(renderer,new Map());
  renderer.width=innerWidth;renderer.height=innerHeight;
  renderer.render=guardedRender(renderer,renderer.render);
  return renderer;
 }
 async function load(renderer,root,name){
  if(disposed||!renderers.has(renderer))return false;
  const type=assetType(root,name);if(!type)return false;
  if(renderer.hasSpine(name))return true;
  const jobs=pending.get(renderer);
  if(!jobs.has(name))jobs.set(name,new Promise((resolve,reject)=>renderer.loadSpine(name,type,()=>resolve(true),()=>reject(new Error('动画素材无法载入：'+name)))).catch(error=>{jobs.delete(name);throw error;}));
  return jobs.get(name);
 }
 async function play(definition,player,time=performance.now()){
  if(disposed||!active()||!parts.has('arena')||!enabled()||config.ss_effects===false||config.extension_十周年UI_gameAnimationEffect===false)return;
  const def=typeof definition==='string'?{name:definition}:definition;
  if(!def?.name||!assetType(effectsRoot,def.name))return;
  effects ||= makeRenderer(effectsRoot);
  let renderer;
  try{renderer=await effects;}catch(error){effects=undefined;throw error;}
  if(!renderer||!await load(renderer,effectsRoot,def.name)||disposed||!renderers.has(renderer)||!active()||!enabled()||config.ss_effects===false||performance.now()-time>2500)return;
  // Snapshot coordinates, never the player or a game event object.
  const rect=player?.rect;
  const axis=(value,size)=>Array.isArray(value)?value[0]+value[1]*size:typeof value==='number'?value:size/2;
  const position=rect?{x:rect.left+axis(def.x,rect.width),y:innerHeight-rect.top-rect.height+axis(def.y,rect.height),scale:def.scale||.6}:{x:def.x,y:def.y,scale:def.scale||1};
  renderer.playSpine({...def,loop:false},position);
 }
 const unsubscribe=subscribePresentation(async message=>{
  if(!active()||!parts.has('arena')||!enabled()||config.ss_effects===false||disposed)return;
  const specialSkill=message.type==='skill'&&(message.awakening||message.mission||message.limited);
  if(specialSkill)specialSkills.set(message.player?.seat,message.time);
  if(message.type==='fullscreen'&&message.time-(specialSkills.get(message.player?.seat)??-Infinity)<300)return;
  await prepare();if(disposed)return;
  if(message.type==='skill'){
   const def=metadata.effects.skill?.[message.skill];
   const special=message.awakening?'juexingji':message.mission?'shimingji':message.limited?'xiandingji':null;
   await play(special?{name:special,scale:.8}:def||{name:'effect_jineng_SS_1',scale:.6},special?null:message.player,message.time);
  }else if(message.type==='card'){
   let name=cardEffects[message.card]||message.card;
   if(message.card==='sha'){if(message.nature.includes('fire'))name='huosha';else if(message.nature.includes('thunder'))name='leisha';}
   await play({name:'effect_'+name,scale:.65},message.player,message.time);
  }else if(message.type==='number'&&typeof message.value==='number'&&message.value<0){
   await play({name:'SZN_loseHp',scale:.6},message.player,message.time);
  }else if(message.type==='death')await play({name:'SZN_zhenwang',scale:.6},message.player,message.time);
  else if(message.type==='judge')await play({name:'effect_panding_SS',scale:.6},message.player,message.time);
  else if(message.type==='start')await play('shoushakaizhan',null,message.time);
  else if(message.type==='fullscreen')await play({name:'effect_xianding',scale:.8},null,message.time);
 });
 function visible(avatar){
  const player=avatar.parentElement;
  const hidden=avatar.classList.contains('avatar2')?'unseen2':'unseen';
  return avatar.isConnected&&player?.matches('#arena > .player')&&!player.classList.contains('dead')&&![hidden,hidden+'_v',hidden+'_show'].some(name=>player.classList.contains(name))&&avatar.getClientRects().length>0;
 }
 function removePortrait(avatar,expected){
  const entry=portraits.get(avatar);if(!entry||(expected&&entry!==expected))return;
  entry.disposed=true;portraits.delete(avatar);entry.canvas.remove();
  for(const sprite of entry.sprites)try{entry.renderer?.stopSpine(sprite);}catch(error){console.warn('动态立绘资源释放失败',error);}
  entry.sprites.length=0;
 }
 function skinOptions(character){
  const source=metadata?.skins[character]||{};
  return Object.entries(source).filter(([,skin])=>skin?.name&&assetType(skinsRoot,skin.name));
 }
 async function getPortraitRenderer(){
  if(!portraitRenderer)portraitRenderer=makeRenderer(skinsRoot,true).then(renderer=>{
   if(!renderer)return;
   const render=renderer.render;
   // One WebGL context for all portraits. Each local 2D canvas stays in its
   // avatar's DOM stack, so frames, dialogs and hidden generals remain correct.
   renderer.render=guardedRender(renderer,function(time){
    if(disposed)return;
    for(const [avatar,entry] of portraits){
     const rect=avatar.getBoundingClientRect();entry.rect=rect;
   const shown=visible(avatar)&&avatar.dataset.skinCharacter===entry.character&&active()&&enabled()&&config.ss_dynamic!==false&&config.extension_十周年UI_dynamicSkin!==false;
     for(const sprite of entry.sprites){sprite.opacity=shown?1:0;sprite.clip={x:rect.left,y:innerHeight-rect.bottom,width:rect.width,height:rect.height};}
     if(!shown)entry.context.clearRect(0,0,entry.canvas.width,entry.canvas.height);
    }
    render.call(this,time);
    for(const [avatar,entry] of portraits){
     if(entry.disposed||!entry.sprites.length||!visible(avatar)||avatar.dataset.skinCharacter!==entry.character||!active()||!enabled()||config.ss_dynamic===false)continue;
     const rect=entry.rect;if(!rect.width||!rect.height)continue;
     const width=Math.ceil(rect.width),height=Math.ceil(rect.height);
     if(entry.canvas.width!==width)entry.canvas.width=width;
     if(entry.canvas.height!==height)entry.canvas.height=height;
     entry.context.clearRect(0,0,width,height);
     entry.context.drawImage(this.canvas,rect.left,rect.top,rect.width,rect.height,0,0,width,height);
    }
   });
   return renderer;
  }).catch(error=>{portraitRenderer=undefined;throw error;});
  return portraitRenderer;
 }
 async function addPortrait(avatar,character,label,skin){
  const canvas=document.createElement('canvas');canvas.className='ss-dynamic-portrait';canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;border-radius:inherit';
  const context=canvas.getContext('2d');if(!context)return;
  const entry={canvas,context,character,label,skin,sprites:[],disposed:false};portraits.set(avatar,entry);
  try{
   const renderer=await getPortraitRenderer();entry.renderer=renderer;
   if(!renderer||entry.disposed||disposed)return;
   const layers=[skin.beijing,skin].filter(layer=>layer?.name&&assetType(skinsRoot,layer.name));
   for(const layer of layers){
    const loaded=await load(renderer,skinsRoot,layer.name);
    if(!loaded||disposed||entry.disposed||!renderers.has(renderer)||!active()||!enabled()||!visible(avatar)||avatar.dataset.skinCharacter!==character||config.ss_dynamic===false||config.extension_十周年UI_dynamicSkin===false){removePortrait(avatar,entry);return;}
    const sprite=renderer.playSpine({...layer,loop:true},{parent:avatar,follow:true,x:layer.x,y:layer.y,scale:layer.scale||1,angle:layer.angle});
    if(sprite)entry.sprites.push(sprite);
   }
   avatar.append(canvas);
  }catch(error){if(portraits.get(avatar)===entry)failedPortraits.set(avatar,character+':'+label);removePortrait(avatar,entry);console.warn('手杀动态立绘加载失败，保留静态立绘',error);}
 }
 function scan(){
  scanFrame=0;if(disposed||!metadata)return;
  const allowed=active()&&enabled()&&parts.has('players')&&config.ss_dynamic!==false&&config.extension_十周年UI_dynamicSkin!==false;
  for(const avatar of portraits.keys())if(!allowed||!visible(avatar))removePortrait(avatar);
  if(!allowed)return;
  for(const avatar of document.querySelectorAll('#arena>.player>.avatar,#arena>.player>.avatar2')){
   if(!visible(avatar))continue;
   const character=avatar.dataset.skinCharacter;if(!character){removePortrait(avatar);continue;}
   const choices=skinOptions(character),selected=config.ss_dynamic_skins?.[character];
   const selectedSkin=selected==='off'?null:choices.find(([label])=>label===selected)||choices[0];
   const old=portraits.get(avatar);
   if(old&&(old.character!==character||old.label!==selectedSkin?.[0]))removePortrait(avatar);
   if(selectedSkin&&!portraits.has(avatar)&&failedPortraits.get(avatar)!==character+':'+selectedSkin[0])void addPortrait(avatar,character,...selectedSkin);
  }
 }
 const schedule=()=>{if(!scanFrame&&!disposed)scanFrame=requestAnimationFrame(()=>{try{scan();}catch(error){scanFrame=0;console.warn('手杀立绘刷新失败',error);}});};
 const observer=new MutationObserver(records=>{if(records.some(record=>record.type==='childList'||record.target.matches?.('.avatar,.avatar2,.player')))schedule();});
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','data-skin-character']});
 const resize=()=>{for(const renderer of renderers){renderer.width=innerWidth;renderer.height=innerHeight;renderer.resized=false;}schedule();};
 window.addEventListener('resize',resize);
 void prepare().then(schedule).catch(error=>console.warn('手杀动画资源未就绪',error));
 return {
  async openSkins(character){
   await prepare();if(disposed)return;
   gallery?.remove();gallery=document.createElement('section');gallery.className='ss-dynamic-gallery';
   const heading=document.createElement('h2');heading.textContent='动态皮肤';gallery.append(heading);
   const characters=document.createElement('select');
   for(const key of Object.keys(metadata.skins).filter(key=>skinOptions(key).length)){
    const option=document.createElement('option');option.value=key;option.textContent=label(key);characters.append(option);
   }
   if(character&&skinOptions(character).length)characters.value=character;
   const choices=document.createElement('div');choices.className='ss-dynamic-choices';
   const populate=()=>{
    choices.replaceChildren();const name=characters.value;
    const selected=config.ss_dynamic_skins?.[name]||skinOptions(name)[0]?.[0]||'off';
    for(const choice of ['off',...skinOptions(name).map(([label])=>label)]){
     const button=document.createElement('button');button.textContent=choice==='off'?'静态立绘':choice;button.setAttribute('aria-pressed',String(choice===selected));
     button.onclick=()=>{saveSetting('ss_dynamic_skins',{...(config.ss_dynamic_skins||{}),[name]:choice});schedule();populate();};choices.append(button);
    }
   };
   characters.onchange=populate;populate();
   const close=document.createElement('button');close.textContent='关闭';close.onclick=()=>{gallery?.remove();gallery=undefined;};
   gallery.append(characters,choices,close);document.body.append(gallery);
  },
  refresh(){
   for(const avatar of document.querySelectorAll('#arena>.player>.avatar,#arena>.player>.avatar2'))failedPortraits.delete(avatar);
   if(!enabled()||config.ss_effects===false)for(const renderer of renderers)if(renderer.canvas.classList.contains('ss-animation-canvas'))renderer.stopSpineAll();
   if(!metadata)void prepare().then(schedule).catch(error=>console.warn('手杀动画资源重试失败',error));else schedule();
  },
  result(win){if(typeof win==='boolean')return play(win?'Xshengli':'Xnoshengli',null);},
  dispose(){disposed=true;unsubscribe();observer.disconnect();cancelAnimationFrame(scanFrame);window.removeEventListener('resize',resize);gallery?.remove();for(const avatar of portraits.keys())removePortrait(avatar);for(const renderer of [...renderers])destroy(renderer);},
 };
}
