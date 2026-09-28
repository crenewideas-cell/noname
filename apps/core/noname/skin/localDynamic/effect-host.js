import {alignAttachmentPoints} from './runtime/anchor-geometry.js';
import {screenEffectLayer,alignEffectSubject,fitScreenEnvelope} from './runtime/effect-layout.js';
import {idleGeometryEnvelope} from './runtime/idle-framing.js';

// One transparent screen surface per active portrait action. Never reparent or
// resize the portrait renderer: its background and idle clocks keep running.
export function createEffectHost({frame,anchor,local=false,preview=false}){
 let active,closed=false,paused=false,serial=0;
 function finish(t,reason,error){
  if(t.done)return;t.done=true;clearTimeout(t.timer);cancelAnimationFrame(t.raf);
  t.iframe.contentWindow?.skinPlayerLifecycle?.dispose();t.node.remove();
  if(active===t){active=null;t.hidden(false);}
  error?t.reject(error):t.resolve(false);t.finished?.(reason);
 }
 const stop=()=>{if(active)finish(active,'interrupted');};
 return{
  play(action,hidden,finished){
   if(closed)return Promise.resolve(false);stop();
   return new Promise((resolve,reject)=>{
    const node=document.createElement('div'),iframe=document.createElement('iframe');
    const t=active={node,iframe,hidden,finished,resolve,reject,done:false};let sourceSubject,targetSubject,sourcePoints,targetPoints,alignmentKey,alignedPlacement,screenBounds;iframe.__nonameSkinResources=frame.__nonameSkinResources;
    node.className='local-dynamic-effect';node.setAttribute('popover','manual');
    node.style.cssText='position:fixed;inset:0;margin:0;padding:0;border:0;width:100%;height:100%;max-width:none;max-height:none;background:transparent;overflow:hidden;pointer-events:none;z-index:2147483647;';
    iframe.style.cssText='display:block;width:100%;height:100%;border:0;background:transparent;pointer-events:none;visibility:hidden;';
    iframe.title='动态皮肤出框动作';iframe.tabIndex=-1;iframe.setAttribute('aria-hidden','true');
    node.append(iframe);(document.fullscreenElement||document.body).append(node);
    try{node.showPopover();}catch{node.removeAttribute('popover');}
    function layer(){
     const r=anchor.getBoundingClientRect(),n=node.getBoundingClientRect(),w=iframe.clientWidth,h=iframe.clientHeight;
     const result=screenEffectLayer(action,{width:w,height:h,local,preview,previewHeight:anchor.offsetHeight,rect:{left:(r.left-n.left)*w/n.width,top:(r.top-n.top)*h/n.height,width:r.width*w/n.width,height:r.height*h/n.height}});
     const f=frame.getBoundingClientRect(),key=[f.left,f.top,f.width,f.height,n.left,n.top,n.width,n.height,w,h].join('|');
     if(key!==alignmentKey){alignmentKey=key;alignedPlacement=undefined;
      const toScreen=(point,viewport)=>({...point,x:(f.left-n.left+point.x*f.width/viewport.width)*w/n.width,y:(f.top-n.top+point.y*f.height/viewport.height)*h/n.height,width:(point.width||0)*f.width/viewport.width*w/n.width,height:(point.height||0)*f.height/viewport.height*h/n.height});
      if(sourceSubject&&targetSubject){const target=toScreen(targetSubject,targetSubject.viewport),aligned=alignEffectSubject(result,sourceSubject,target,h);if(aligned){alignedPlacement=aligned.placement;iframe.__nonameSkinAlignment={method:'subject',source:sourceSubject,target,placement:alignedPlacement};}}
      if(!alignedPlacement&&sourcePoints&&targetPoints){const target=targetPoints.points.map(p=>toScreen(p,targetPoints.viewport)),aligned=alignAttachmentPoints(sourcePoints.points,target,h);if(aligned){const {matches,residual,...placement}=aligned;alignedPlacement=placement;iframe.__nonameSkinAlignment={method:'matching-attachments',matches,residual,placement};}}
     }
     if(alignedPlacement)Object.assign(result.placement,alignedPlacement);
     if(screenBounds)Object.assign(result.placement,fitScreenEnvelope(screenBounds,w,h));
     return result;
    }
    const scene={protocol:'noname-source-scene/1',sourceFamily:'decade-dynamicSkin',layers:[layer()],viewport:{policy:'source-effect-screen'},provenance:{placementOrigin:'EpicFX.playDynamicEffect2'}};
    iframe.__nonameSkinEntry={id:'effect-'+(++serial),type:'spine',models:[{...structuredClone(action.model),animation:action.animation??undefined}],scene,motions:[]};
    iframe.__nonameSkinEffect={
     async ready(p){
      if(t.done)return;
      try{
       const l=p.engine42?.layers[0]||p.root.children[0],name=action.animation??l.skeleton.data.animations[0]?.name;
       if(!name||!l.skeleton.data.animations.some(a=>a.name===name))throw Error('源动作不存在：'+name);
       if(action.cameraPolicy==='measured-screen-envelope'){
        const bounds=idleGeometryEnvelope(l);
        if(bounds){screenBounds=p.engine42?bounds:{...bounds,y:-bounds.y-bounds.height};iframe.__nonameSkinScreenBounds=screenBounds;}
       }
       if(preview&&action.kind==='chuchang'){[sourceSubject,targetSubject]=await Promise.all([p.subjectAnchor?.(true),frame.contentWindow.skinPlayer?.subjectAnchor?.()]);if(t.done)return;sourcePoints=await p.attachmentAnchors?.(true);targetPoints=await frame.contentWindow.skinPlayer?.attachmentAnchors?.();if(t.done)return;}
       alignmentKey=undefined;
       l.state.clearTracks();l.skeleton.setToSetupPose();const track=l.state.setAnimation(0,name,false);track.mixDuration=0;
       // No actionContract in this isolated entry: the update adapter applies speed.
       track.timeScale=1;
       track.listener={complete:()=>queueMicrotask(()=>finish(t,'completed')),interrupt:()=>queueMicrotask(()=>finish(t,'interrupted')),end:()=>queueMicrotask(()=>finish(t,'interrupted'))};
       p.setEffectLayer(layer());p.pause(paused);p.renderFrame?.();
       clearTimeout(t.timer);hidden(true);iframe.style.visibility='visible';resolve(true);
       // Follow moving/resized avatars without affecting either renderer's clock.
       const sharedKeys=new Set(targetPoints?.points.map(p=>p.key)||[]);let bodySeen=false,bodyRestored=false;
       let last='';const follow=()=>{if(t.done)return;if(!anchor.isConnected||!frame.isConnected){finish(t,'interrupted');return;}// Some entrance clips end with transparent hold frames. Restore the
       // aligned idle when their shared body vanishes; let remaining FX finish.
       if(alignedPlacement&&sharedKeys.size>=6&&!bodyRestored){const alpha=l.skeleton.slots.filter(s=>s.attachment?.region&&sharedKeys.has(s.attachment.region.name||s.attachment.name)).map(s=>s.color.a).sort((a,b)=>a-b);const opacity=alpha[Math.floor(alpha.length*.75)];if(opacity>.5)bodySeen=true;if(bodySeen&&track.trackTime>track.animation.duration*.5&&opacity<.02){hidden(false);bodyRestored=true;iframe.__nonameSkinIdleRestoredAt=track.trackTime;}}
       const next=layer(),key=JSON.stringify(next.placement);if(key!==last){p.setEffectLayer(next);last=key;}t.raf=requestAnimationFrame(follow);};follow();
      }catch(error){finish(t,'failed',error);}
     },fail:error=>finish(t,'failed',Error(String(error?.message||error)))
    };
    t.timer=setTimeout(()=>finish(t,'failed',Error('出框动作加载超时')),60000);
    const address=new URL(frame.src);address.searchParams.set('id',iframe.__nonameSkinEntry.id);address.searchParams.set('channel','effect-'+serial);address.searchParams.set('interactive','0');address.searchParams.set('presentation','effect');iframe.src=address.href;
   });
  },stop,pause(value){paused=!!value;active?.iframe.contentWindow?.skinPlayer?.pause(paused);},
  dispose(){closed=true;stop();},get active(){return active?.iframe||null;}
 };
}
