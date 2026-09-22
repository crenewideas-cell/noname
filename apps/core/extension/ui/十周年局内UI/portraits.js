import {createAnimationRenderer} from './animation-renderer.js';
import {spine} from './vendor/spine.js';

/** Visible avatar labels belong to the core. Hidden generals never start loads. */
export function mountPortraits({base,metadata,enabled}) {
 const {AnimationPlayer}=createAnimationRenderer(spine),entries=new Map(),loads=new Map(),pending=new Set(),failed=new WeakMap();
 let renderer,disposed=false,frame=0;
 function visible(avatar){
  const player=avatar.parentElement,hidden=avatar.classList.contains('avatar2')?'unseen2':'unseen';
  return avatar.isConnected&&player?.matches('#arena>.player')&&!player.classList.contains('dead')&&![hidden,hidden+'_v',hidden+'_show'].some(x=>player.classList.contains(x))&&avatar.getClientRects().length>0;
 }
 function remove(avatar){const entry=entries.get(avatar);if(!entry)return;entry.disposed=true;for(const sprite of entry.sprites)renderer?.stopSpine(sprite);entry.canvas.remove();entries.delete(avatar);}
 function destroy(){if(!renderer)return;const old=renderer;renderer=undefined;cancelAnimationFrame(old.requestId);old.canvas.remove();for(const release of [()=>old.stopSpineAll(),()=>old.spine.assetManager?.dispose?.(),()=>old.spine.shader?.dispose?.(),()=>old.spine.batcher?.dispose?.(),()=>old.gl?.getExtension('WEBGL_lose_context')?.loseContext()])try{release();}catch(error){console.warn('立绘资源释放失败',error);}}
 function prepare(){
  if(renderer)return renderer;
  renderer=new AnimationPlayer(base+'assets/dynamic/','offscreen',document.createElement('canvas'));
  if(!renderer.gl){destroy();throw new Error('无法创建动态立绘画布');}
  renderer.width=innerWidth;renderer.height=innerHeight;const draw=renderer.render;
  renderer.render=function(time){
   if(disposed)return;
   try {
    for(const [avatar,entry] of entries){const r=avatar.getBoundingClientRect();entry.rect=r;const shown=enabled()&&visible(avatar)&&entry.character===avatar.dataset.skinCharacter;for(const sprite of entry.sprites){sprite.opacity=shown?1:0;sprite.clip={x:r.left,y:innerHeight-r.bottom,width:r.width,height:r.height};}if(!shown)entry.context.clearRect(0,0,entry.canvas.width,entry.canvas.height);}
    draw.call(this,time);
    for(const [avatar,entry] of entries){if(!enabled()||!visible(avatar)||entry.character!==avatar.dataset.skinCharacter)continue;const r=entry.rect;if(!r.width||!r.height)continue;entry.canvas.width=Math.ceil(r.width);entry.canvas.height=Math.ceil(r.height);entry.context.clearRect(0,0,r.width,r.height);entry.context.drawImage(this.canvas,r.left,r.top,r.width,r.height,0,0,r.width,r.height);}
   }catch(error){for(const [avatar,entry] of entries){failed.set(avatar,entry.character);remove(avatar);}destroy();console.warn('动态立绘绘制失败',error);}
  };
  return renderer;
 }
 async function add(avatar,character,skin){
  const canvas=document.createElement('canvas');canvas.className='decade-portrait';canvas.setAttribute('aria-hidden','true');const context=canvas.getContext('2d');if(!context)return;
  const entry={canvas,context,character,sprites:[],disposed:false};entries.set(avatar,entry);
  try{
   const current=prepare();
   for(const layer of [skin.beijing,skin].filter(Boolean)){
    if(!loads.has(layer.name))loads.set(layer.name,new Promise((resolve,reject)=>{
     let settled=false;
     const finish=fn=>{if(disposed||renderer!==current)try{current.spine.assetManager?.dispose?.();}catch{}if(settled)return;settled=true;clearTimeout(timer);pending.delete(cancel);fn();};
     const cancel=()=>finish(resolve),timer=setTimeout(()=>finish(()=>reject(new Error('动态素材加载超时：'+layer.name))),5000);pending.add(cancel);
     current.loadSpine(layer.name,'skel',()=>finish(resolve),()=>finish(()=>reject(new Error('动态素材加载失败：'+layer.name))));
    }));
    await loads.get(layer.name);
    if(disposed||entry.disposed||renderer!==current||!enabled()||!visible(avatar)||avatar.dataset.skinCharacter!==character){remove(avatar);return;}
    const sprite=current.playSpine({...layer,loop:true},{parent:avatar,follow:true,x:layer.x,y:layer.y,scale:layer.scale||1,angle:layer.angle});if(sprite)entry.sprites.push(sprite);
   }
   avatar.append(canvas);
  }catch(error){failed.set(avatar,character);remove(avatar);console.warn('动态立绘保留本体静态图',error);}
 }
 function scan(){
  frame=0;if(disposed)return;
  for(const [avatar,entry] of entries)if(!enabled()||!visible(avatar)||entry.character!==avatar.dataset.skinCharacter)remove(avatar);
  if(!enabled())return;
  for(const avatar of document.querySelectorAll('#arena>.player>.avatar,#arena>.player>.avatar2')){
   if(!visible(avatar))continue;const character=avatar.dataset.skinCharacter,skin=Object.values(metadata.skins[character]||{})[0];
   if(skin&&!entries.has(avatar)&&failed.get(avatar)!==character)void add(avatar,character,skin);
  }
 }
 const schedule=()=>{if(!disposed&&!frame)frame=requestAnimationFrame(scan);};
 const observer=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.target.matches?.('.avatar,.avatar2,.player')))schedule();});
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-skin-character']});
 const resize=()=>{if(renderer){renderer.width=innerWidth;renderer.height=innerHeight;renderer.resized=false;}schedule();};window.addEventListener('resize',resize);schedule();
 return()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('resize',resize);for(const avatar of entries.keys())remove(avatar);for(const cancel of pending)cancel();pending.clear();destroy();loads.clear();};
}
