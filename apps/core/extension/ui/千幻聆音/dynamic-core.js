import {lib, game, ui, get, _status, openCharacterSkins, subscribeCharacterSkins, installLocalDynamicPacks} from 'noname';
import metadata from '../十周年局内UI/animation-assets.json' with {type:'json'};
import {directories} from './filesystem.js';
import {skinEnabled} from '../../noname/skin/management.js';

// Adapt the original Qianhuan controls to the installed renderer, without
// installing decadeUI's legacy player/rules overrides.
export function connectDynamicCore() {
 void installLocalDynamicPacks({lib, game, ui, get, _status, openCharacterSkins});
 const skins=structuredClone(metadata.skins),entries=new Map();
 const base=lib.assetURL+'extension/十周年局内UI/assets/dynamic/';
 let classes,serial=0,frame=0;
 const key=name=>skins[name]?name:skins[game.qhly_getRealName(name)]?game.qhly_getRealName(name):name?.replace(/^gz_/,'');
 const label=file=>file?file.replace(/\.[^.]+$/,''):'经典形象';
 const emptyTable=Object.freeze({}),tables=new Map(),tablePresence=new WeakMap();
 function table(name){
  const native=skins[key(name)],extra=game.localDynamicSkinTestHub?.skinTable(name)||emptyTable;
  if(!native)return extra;
  const cached=tables.get(native);if(cached?.extra===extra)return cached.table;
  const merged={...native,...extra};tables.set(native,{extra,table:merged});return merged;
 }
 game.qhly_dynamicSkin=new Proxy(skins,{get:(target,name)=>typeof name==='string'?table(name):target[name]});
 game.qhly_dynamicOwns=name=>{
  if(!lib.config.extension_千幻聆音_enable)return false;
  const value=table(name);if(!tablePresence.has(value))tablePresence.set(value,Object.keys(value).length>0);
  return tablePresence.get(value);
 };
 game.qhly_hasDynamicSkin=(name,skin)=>!!table(name)[label(skin)];
 const originalFile=game.qhly_getSkinFile;
 game.qhly_isDynamicOnly=(name,file)=>{
  if(table(name)[label(file)]?.localDynamic)return false;
  if(!file||!table(name)[label(file)])return false;
  const path=originalFile(name,file),slash=path.lastIndexOf('/');
  return !directories[path.slice(0,slash)]?.files.includes(path.slice(slash+1));
 };
 game.qhly_getSkinFile=(name,file)=>game.qhly_isDynamicOnly(name,file)?originalFile(name,null):originalFile(name,file);
 function available(name,title,node){
  return skinEnabled(lib.config,name,'dynamic',title+'.jpg')&&game.qhly_skinAllowed?.(name,title+'.jpg')!==false&&lib.config.extension_千幻聆音_enable&&lib.config.change_skin!==false&&lib.config.animation!==false&&!lib.config.low_performance&&!lib.config.extension_千幻聆音_qhly_decadeCloseDynamic&&(node?.dataset.qhlyPreviewDynamic==='true'||!lib.config.qhly_skinset?.djtoggle?.[name]?.[title])&&table(name)[title];
 }
 function visible(node){
  if(!node.isConnected||!node.getClientRects().length)return false;
  const player=node.closest('#arena>.player');
  if(!player)return true;
  const hidden=node.classList.contains('avatar2')?'unseen2':'unseen';
  return !player.classList.contains('dead')&&![hidden,hidden+'_v',hidden+'_show'].some(c=>player.classList.contains(c));
 }
 game.qhly_getCoordinate=(node,subtr)=>{if(!node)return false;const r=node.getBoundingClientRect();return {x:r.left,y:innerHeight-(subtr?r.bottom:0),width:r.width,height:r.height};};
 function stop(node,expected){
  const entry=entries.get(node);if(!entry||expected&&entry!==expected)return;
  entries.delete(node);node.classList.remove("qhly-dynamic-visible");entry.closed=true;entry.stopAction?.();entry.resize?.disconnect();entry.cancelLoad?.();
  const renderer=entry.renderer;
  if(renderer){cancelAnimationFrame(renderer.requestId);renderer.stopSpineAll();renderer.canvas.remove();renderer.spine.assetManager?.dispose?.();renderer.spine.shader?.dispose?.();renderer.spine.batcher?.dispose?.();renderer.gl?.getExtension('WEBGL_lose_context')?.loseContext();}
  if(entry.facade&&node.dynamic===entry.facade){entry.facade.primary=null;queueMicrotask(()=>{if(node.dynamic===entry.facade)delete node.dynamic;});}
 }
 function post(node,data,mode){
  const entry=entries.get(node);if(!entry)return;
  if(data.message==='DESTROY'){stop(node);return;}
  const sprite=mode==='beijing'||data.dybg?entry.background:entry.primary;
  if(!sprite)return;
  for(const field of ['x','y','scale','angle','speed','opacity'])if(data[field]!==undefined)sprite[field]=structuredClone(data[field]);
 }
 async function mount(node,name,title){
  const definition=available(name,title,node);if(!definition||!visible(node)){stop(node);game.localDynamicSkinTestHub?.stopPreview(node);return;}
  if(definition.localDynamic){stop(node);return game.localDynamicSkinTestHub.mount(node,name,title);}
  game.localDynamicSkinTestHub?.stopPreview(node);
  const old=entries.get(node);if(old?.name===name&&old.title===title)return old.ready;
  stop(node);const entry={name,title,closed:false};entries.set(node,entry);
  entry.ready=(async()=>{
   classes ||= Promise.all([import('../十周年局内UI/animation-renderer.js'),import('../十周年局内UI/vendor/spine.js')]).then(([a,b])=>a.createAnimationRenderer(b.spine));
   const {AnimationPlayer}=await classes;if(entry.closed||!visible(node)){stop(node,entry);return;}
   const renderer=entry.renderer=new AnimationPlayer(base,node.$dynamicWrap||node);
   if(!renderer.gl)throw Error('当前设备无法创建动态皮肤画布');
   const canvas=renderer.canvas;canvas.classList.add('qhly-core-dynamic');canvas.dataset.character=name;canvas.dataset.skin=title;
   canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
   const draw=renderer.render;renderer.render=function(time){if(entry.closed)return;if(!visible(node)||!available(entry.name,entry.title,node)){stop(node,entry);return;}try{draw.call(this,time);}catch(error){stop(node,entry);console.warn('千幻动态皮肤绘制失败',error);}};
   entry.resize=new ResizeObserver(()=>{renderer.resized=false;});entry.resize.observe(node);
   const kind=node.closest('#arena>.player')?'player':'bigAvatar';
   const theme=kind==='player'?(ui.arena?.dataset.newDecadeStyle==='on'?'decade':'shousha'):lib.config.qhly_currentViewSkin;
   const edit=lib.qhly_skinEdit?.[game.qhly_getRealName(name)]?.[title+'.jpg']?.[kind];
   const skin=structuredClone(definition);
   const ratio=node.clientHeight/180||1;
   Object.assign(skin,edit?.dynamic?.[theme]||{});if(skin.beijing)Object.assign(skin.beijing,edit?.beijing?.[theme]||{});
   for(const [field,layer] of [['background',skin.beijing],['primary',skin]]){
    if(!layer?.name)continue;
    await new Promise((resolve,reject)=>{let settled=false;const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);entry.cancelLoad=undefined;error?reject(error):resolve();};const timer=setTimeout(()=>finish(Error('动态皮肤加载超时：'+layer.name)),15000);entry.cancelLoad=()=>finish();renderer.loadSpine(layer.name,'skel',()=>finish(),()=>finish(Error('动态皮肤加载失败：'+layer.name)));});
    if(entry.closed||!available(name,title,node)||!visible(node)){stop(node,entry);return;}
    entry[field]=renderer.playSpine({...layer,loop:true},{x:layer.x||[0,.5],y:layer.y||[0,.5],scale:(layer.scale||1)*ratio,angle:layer.angle});
   }
   if(!entry.primary)throw Error('动态皮肤没有可播放的骨骼');
   entry.primary.beijing=entry.background;entry.primary.qhly_resizeRatio=ratio;node.classList.add("qhly-dynamic-visible");
   entry.facade={id:++serial,primary:entry.primary,canvas,renderer:{capacity:1,postMessage:data=>post(node,data,data.dybg?'beijing':'daiji')}};
   node.dynamic=entry.facade;node.stopDynamic=()=>stop(node);
   canvas.dataset.ready='true';
  })().catch(error=>{stop(node,entry);console.warn(error);});
  return entry.ready;
 }
 function scan(){
  frame=0;
  for(const [node,entry] of entries)if(!visible(node)||!available(entry.name,entry.title,node))stop(node);
  for(const node of document.querySelectorAll('#arena>.player>.avatar,#arena>.player>.avatar2')){
   const name=node.dataset.skinCharacter;if(!name)continue;
   const title=label(game.qhly_getSkin(name));
   if(available(name,title)&&visible(node))void mount(node,name,title);else stop(node);
  }
 }
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(scan);};
 subscribeCharacterSkins(schedule);
 const observer=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.target.matches?.('.player,.avatar,.avatar2')))schedule();});
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-skin-character']});
 (lib.qhly_callbackList ||= []).push({onChangeSkin(name,file){for(const[node,entry]of entries)if(entry.name===name&&!node.closest('#arena>.player'))void mount(node,name,label(file));schedule();}});
 game.qhly_changeDynamicSkin=(target,skin,name,secondary)=>{
  if(typeof target==='string'||!target){schedule();return;}
  if(target.node?.avatar){schedule();return;}
  name ||= target.name;return mount(target,name,skin||label(game.qhly_getSkin(name)));
 };
 const originalPost=game.qhly_postMessage;
 game.qhly_postMessage=(node,data,mode,...rest)=>entries.has(node)?post(node,data,mode):originalPost(node,data,mode,...rest);
 game.qhly_captureDynamic=async node=>{
  const entry=entries.get(node);if(!entry)throw Error('动态皮肤尚未就绪');await entry.ready;
  if(entry.closed||!entry.primary)throw Error('动态皮肤无法生成静皮');
  const renderer=entry.renderer;cancelAnimationFrame(renderer.requestId);renderer.render(performance.now());
  const output=document.createElement('canvas');output.width=renderer.canvas.width;output.height=renderer.canvas.height;
  const context=output.getContext('2d');context.drawImage(renderer.canvas,0,0);
  return new Promise((resolve,reject)=>output.toBlob(blob=>blob?resolve(blob):reject(Error('无法导出皮肤图像')),'image/jpeg',.95));
 };
 // The bundled skeletons declare their own actions. Reuse those actions and
 // the original portrait coordinates; never synthesize missing effects.
 async function playAction(node,action='GongJi',flip=false){
  const entry=entries.get(node);if(!entry)return false;await entry.ready;
  if(entry.closed||entry.stopAction||!visible(node)||!available(entry.name,entry.title)||_status.bigEditing)return false;
  const primary=entry.primary,animation=primary?.skeleton.data.findAnimation(action);if(!animation)return false;
  const rect=node.getBoundingClientRect(),zoom=document.body.getBoundingClientRect().width/document.body.offsetWidth||1;
  const host=document.createElement('div');host.className='qhly-core-action';host.style.cssText='position:fixed;left:0;top:0;pointer-events:none;z-index:100025;width:'+innerWidth/zoom+'px;height:'+innerHeight/zoom+'px';document.body.append(host);
  const {AnimationPlayer}=await classes;const renderer=new AnimationPlayer(base,host);
  renderer.canvas.style.cssText='width:100%;height:100%;pointer-events:none';
  let closed=false;const opacity=primary.opacity;
  const finish=()=>{if(closed)return;closed=true;clearTimeout(timer);cancelAnimationFrame(renderer.requestId);renderer.stopSpineAll();renderer.spine.assetManager?.dispose?.();renderer.spine.shader?.dispose?.();renderer.spine.batcher?.dispose?.();renderer.gl?.getExtension('WEBGL_lose_context')?.loseContext();host.remove();primary.opacity=opacity;delete entry.stopAction;};
  const timer=setTimeout(finish,15000);entry.stopAction=finish;
  renderer.loadSpine(primary.name,'skel',()=>{
   if(closed||entry.closed||!visible(node)){finish();return;}
   primary.opacity=0;
   const coordinate=(value,size)=>Array.isArray(value)?(value[0]||0)+size*(value[1]||0):value??size*.5;
   const factor=rect.height/node.clientHeight;
   renderer.playSpine({name:primary.name,action,loop:false,flipX:flip,oncomplete:()=>queueMicrotask(finish)},{x:(rect.left+coordinate(primary.x,node.clientWidth)*factor)/zoom,y:(innerHeight-rect.bottom+coordinate(primary.y,node.clientHeight)*factor)/zoom,scale:primary.scale*factor/zoom,angle:primary.angle});
  },finish);
  return true;
 }
 game.playShoushaAvatar=(node,flip)=>lib.config.extension_千幻聆音_qhly_shoushaTexiao===false?false:playAction(node,'GongJi',flip);
 game.qhly_coreDynamic={mount,stop,refresh:schedule,entries,playAction};
 schedule();
}
