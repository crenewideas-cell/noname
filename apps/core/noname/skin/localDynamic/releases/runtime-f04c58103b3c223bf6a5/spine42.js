window.createSpine42 = async function (entry, url, initialView, { signal } = {}) {
  if (!window.spine) await new Promise((resolve, reject) => {
    const script = document.createElement('script');script.src='vendor/spine-webgl.min.js';script.onload=resolve;script.onerror=()=>reject(new Error('Spine 4.2 播放库加载失败'));document.head.appendChild(script);
  });
  const { createSpineAssetScope } = await import('./spine-assets.js');
  signal?.throwIfAborted();
  const canvas=document.createElement('canvas');document.body.prepend(canvas);
  const context=new spine.ManagedWebGLRenderingContext(canvas,{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true});
  const gl=context.gl,renderer=new spine.SceneRenderer(canvas,context),assets=createSpineAssetScope(spine,context,{signal});
  const layers=[];let view=initialView,paused=false,disposed=false,last=performance.now(),raf,cover=false,onDraw;
  let removeVisibility=()=>{};
  function destroy(){if(disposed)return;disposed=true;signal?.removeEventListener('abort',destroy);cancelAnimationFrame(raf);removeVisibility();assets.dispose();renderer.dispose();context.dispose();canvas.remove();}
  signal?.addEventListener('abort',destroy,{once:true});
  const load=(fn,path)=>assets[fn](path);
  try {
    for(const m of entry.models){
      const [atlas,binary]=await Promise.all([load('loadTextureAtlas',url(m.atlas)),load('loadBinary',url(m.skeleton))]);
      const attachmentLoader=new spine.AtlasAttachmentLoader(atlas);
      const isJSON=m.skeleton.toLowerCase().endsWith('.json');
      const reader=isJSON?new spine.SkeletonJson(attachmentLoader):new spine.SkeletonBinary(attachmentLoader);
      const data=reader.readSkeletonData(isJSON?JSON.parse(new TextDecoder().decode(binary)):binary);
      const skeleton=new spine.Skeleton(data);if(m.skin&&data.findSkin(m.skin))skeleton.setSkinByName(m.skin);
      const state=new spine.AnimationState(new spine.AnimationStateData(data));state.data.defaultMix=.15;
      const names=data.animations.map(a=>a.name);const idle=names.includes(m.animation)?m.animation:(names.includes('Idle')?'Idle':names[0]);
      if(idle)state.setAnimation(0,idle,true);
      state.apply(skeleton);skeleton.updateWorldTransform(spine.Physics.update);
      layers.push({skeleton,state,names,idle,visible:!m.effectOnly,enabled:true,meta:m,premultipliedAlpha:atlas.pages.every(page=>page.pma)});
    }
    const bounds=layers.filter(l=>!l.meta.effectOnly).map(l=>l.skeleton.getBoundsRect());
    const x=Math.min(...bounds.map(b=>b.x)),y=Math.min(...bounds.map(b=>b.y));
    let fit={x,y,width:Math.max(...bounds.map(b=>b.x+b.width))-x,height:Math.max(...bounds.map(b=>b.y+b.height))-y};
    if(!Number.isFinite(fit.width)||fit.width<=0)throw new Error('Spine 4.2 模型边界无效');
    function draw(dt=0,viewport){
      if(disposed)return;
      const w=viewport?.width||Math.max(1,innerWidth),h=viewport?.height||Math.max(1,innerHeight),dpr=viewport?1:Math.min(devicePixelRatio||1,1.5);
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';}
      const scale=(entry.legacy&&cover?Math.max(w/fit.width,h/fit.height):Math.min(w/fit.width,h/fit.height))*(cover?1:.97)*view.scale;
      renderer.camera.setViewport(w/scale,h/scale);renderer.camera.position.set(fit.x+fit.width/2-w*view.x/scale,fit.y+fit.height/2+h*view.y/scale,0);
      gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);renderer.begin();
      for(const l of layers){l.state.update(dt);l.state.apply(l.skeleton);l.skeleton.update(dt);l.skeleton.updateWorldTransform(spine.Physics.update);if(l.visible&&l.enabled)renderer.drawSkeleton(l.skeleton,l.premultipliedAlpha);}
      renderer.end();
      onDraw?.();
    }
    function tick(now){raf=0;if(disposed||paused||document.hidden)return;const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;draw(dt);raf=requestAnimationFrame(tick);}
    function schedule(){cancelAnimationFrame(raf);raf=0;if(!disposed&&!paused&&!document.hidden){last=performance.now();raf=requestAnimationFrame(tick);}}
    document.addEventListener('visibilitychange',schedule);
    removeVisibility=()=>document.removeEventListener('visibilitychange',schedule);
    function motion(name){
      let played=false;
      for(const l of layers){
        if(!l.names.includes(name)){if(l.meta.effectOnly)l.visible=false;continue;}
        l.visible=true;const track=l.state.setAnimation(0,name,name===l.idle);played=true;
        if(name!==l.idle){if(l.meta.effectOnly)track.listener={complete:()=>{l.visible=false;}};else if(l.idle)l.state.addAnimation(0,l.idle,true,0);}
      }
      return played;
    }
    // Ignore transparent atlas padding when computing the initial camera.
    draw(0,{width:384,height:384});
    const pixels=new Uint8Array(384*384*4);gl.readPixels(0,0,384,384,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    let scene;
    const background=l=>l.meta.role==='BgBack'||!!(entry.legacy&&layers.length>1&&l===layers[0]);
    if(layers.some(background)){
      const enabled=layers.map(l=>l.enabled),sample=new Uint8Array(pixels.length);
      // Inspect actual background pixels, independent of foreground effects.
      for(const l of layers)l.enabled=background(l);
      draw(0,{width:384,height:384});gl.readPixels(0,0,384,384,gl.RGBA,gl.UNSIGNED_BYTE,sample);
      scene=SkinFraming.sceneBounds(sample,384,384,true)||(entry.legacy&&SkinFraming.visibleBounds(sample,384,384,true));
      if(scene&&!entry.legacy&&layers.some(l=>l.meta.role==='Ren')){
        for(const l of layers)l.enabled=l.meta.role==='Ren';
        draw(0,{width:384,height:384});gl.readPixels(0,0,384,384,gl.RGBA,gl.UNSIGNED_BYTE,sample);
        const subject=SkinFraming.visibleBounds(sample,384,384,true);
        if(subject){
          const x=Math.min(scene.x,subject.x),y=Math.min(scene.y,subject.y);
          const bounds={x,y,width:Math.max(scene.x+scene.width,subject.x+subject.width)-x,height:Math.max(scene.y+scene.height,subject.y+subject.height)-y};
          // Protect foreground protrusions. If this is not a compact scene,
          // fall back to the original complete-subject fit instead of cropping.
          scene=bounds.width*bounds.height<=scene.width*scene.height*1.15?bounds:null;
        }
      }
      layers.forEach((l,i)=>l.enabled=enabled[i]);
    }
    const visible=scene||SkinFraming.visibleBounds(pixels,384,384,true);
    if(visible){
      const scale=Math.min(384/fit.width,384/fit.height)*.97;
      fit={x:fit.x+fit.width/2+(visible.x-.5)*384/scale,y:fit.y+fit.height/2+(.5-visible.y-visible.height)*384/scale,width:visible.width*384/scale,height:visible.height*384/scale};
    }
    draw();schedule();
    return{canvas,fit,layers,motions:[...new Set(layers.flatMap(l=>l.names))],motion,draw,
      setFit:(bounds,fill=false)=>{fit=bounds;cover=fill;},setOnDraw:callback=>{onDraw=callback;},setView:v=>{view={...view,...v};draw();},pause:v=>{if(paused!==!!v){paused=!!v;schedule();}},
      setLayer:(id,visible)=>{if(layers[id])layers[id].enabled=visible;},
      capture:()=>{draw();return canvas.toDataURL('image/png');},
      destroy};
  }catch(e){destroy();throw e;}
};
