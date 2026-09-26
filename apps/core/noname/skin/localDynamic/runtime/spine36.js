window.createSpine36 = async function (entry, url, initialView) {
  const { spine } = await import('../../../../extension/十周年局内UI/vendor/spine.js');
  const { restoreMeshUVs } = await import('./mesh-uv.js');
  const { usePremultipliedTexture } = await import('./texture-alpha.js');
  const { createLegacyParser } = await import('./legacy-parser.js');
  const { compositionFor, transformBounds, avatarLayerTransform, paintingBounds, subjectBounds, idleAnimation, inferredAvatarZoom } = await import('./composition.js');
  const composition = compositionFor(entry);
  const canvas=document.createElement('canvas');document.body.prepend(canvas);
  const context=new spine.webgl.ManagedWebGLRenderingContext(canvas,{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true});
  const gl=context.gl,renderer=new spine.webgl.SceneRenderer(canvas,context),assets=new spine.webgl.AssetManager(context);
  const layers=[];let view=initialView,paused=false,disposed=false,last=performance.now(),raf,cover=false,onDraw;
  function applyPose(layer,dt){
    const {skeleton,state,meta}=layer,config=meta.legacy||{};
    state.update(dt*(config.speed||1));state.apply(skeleton);
    skeleton.updateWorldTransform();
  }
  const load=(fn,path)=>new Promise((resolve,reject)=>assets[fn](path,(_,value)=>resolve(value),(_,error)=>reject(new Error(String(error)))));
  try {
    for(const m of entry.models){
      const [atlas,binary]=await Promise.all([load('loadTextureAtlas',url(m.atlas)),load('loadBinary',url(m.skeleton))]);
      // Screen/additive slots require premultiplied texture samples. Transparent
      // atlas pixels may contain white RGB and otherwise become solid bands.
      for(const page of atlas.pages)usePremultipliedTexture(page.texture,gl,!!(m.legacy?.premultipliedAlpha??page.pma));
      const parser=createLegacyParser(spine,atlas,m);
      const data=parser.readSkeletonData(m.skeleton.endsWith('.json')?JSON.parse(new TextDecoder().decode(binary)):binary);
      for(const skin of data.skins)for(const slots of skin.attachments)for(const attachment of Object.values(slots||{}))if(attachment instanceof spine.MeshAttachment)restoreMeshUVs(attachment);
      const skeleton=new spine.Skeleton(data);skeleton.opacity=1;if(m.skin&&data.findSkin(m.skin))skeleton.setSkinByName(m.skin);
      const state=new spine.AnimationState(new spine.AnimationStateData(data));state.data.defaultMix=.15;
      const names=data.animations.map(a=>a.name);const idle=idleAnimation(m,names,m.role==='BgBack'||!!(entry.legacy?.beijing&&!layers.length));
      if(idle)state.setAnimation(0,idle,true);
      const layer={skeleton,state,names,idle,visible:!m.effectOnly,enabled:true,meta:m,transform:composition.layers?.[layers.length],premultipliedAlpha:true};
      applyPose(layer,1/30);layers.push(layer);
    }
    // Preserve rig coordinates and apply reviewed layer calibration outside the
    // skeleton. Legacy avatar parameters are not universally valid scene units.
    const raw=layers.map(l=>{const offset=new spine.Vector2(),size=new spine.Vector2();l.skeleton.getBounds(offset,size,[]);return {x:offset.x,y:offset.y,width:size.x,height:size.y};});
    layers.forEach((l,i)=>l.transform=avatarLayerTransform(entry,i,raw[i],raw[0]));
    const bounds=layers.filter(l=>!l.meta.effectOnly).map(l=>transformBounds(raw[layers.indexOf(l)],l.transform));
    const painting=entry.legacy?.beijing&&paintingBounds(layers[0].skeleton,bounds[1]);
    const x=Math.min(...bounds.map(b=>b.x)),y=Math.min(...bounds.map(b=>b.y));
    let fit={x,y,width:Math.max(...bounds.map(b=>b.x+b.width))-x,height:Math.max(...bounds.map(b=>b.y+b.height))-y};
    if(!Number.isFinite(fit.width)||fit.width<=0)throw new Error('Spine 3.6 模型边界无效');
    function draw(dt=0,viewport){
      if(disposed)return;
      const w=viewport?.width||Math.max(1,innerWidth),h=viewport?.height||Math.max(1,innerHeight),dpr=viewport?1:Math.min(devicePixelRatio||1,1.5);
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';}
      const scale=(entry.legacy&&cover?Math.max(w/fit.width,h/fit.height):Math.min(w/fit.width,h/fit.height))*(cover?1:.97)*view.scale;
      renderer.camera.setViewport(w/scale,h/scale);renderer.camera.position.set(fit.x+fit.width/2-w*view.x/scale,fit.y+fit.height/2+h*view.y/scale,0);
      gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      for(const l of layers){
        applyPose(l,dt);l.skeleton.update(dt);
        if(!l.visible||!l.enabled)continue;
        renderer.begin();
        if(l.transform){
          const t=l.transform,matrix=renderer.camera.projectionView.copy();
          matrix.translate(t.x||0,t.y||0,0);matrix.scale(t.scale??1,t.scale??1,1);
          if(t.angle)matrix.rotate(t.angle,0,0,1);
          renderer.batcherShader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX,matrix.values);
        }
        renderer.skeletonRenderer.hideSlots=l.meta.legacy?.hideSlots;
        renderer.drawSkeleton(l.skeleton,l.premultipliedAlpha);
        renderer.end();
      }
      renderer.end();
      onDraw?.();
    }
    function tick(now){raf=0;if(disposed||paused||document.hidden)return;const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;draw(dt);raf=requestAnimationFrame(tick);}
    function schedule(){cancelAnimationFrame(raf);raf=0;if(!disposed&&!paused&&!document.hidden){last=performance.now();raf=requestAnimationFrame(tick);}}
    document.addEventListener('visibilitychange',schedule);
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
    const transparentFigure=!!entry.legacy&&!entry.legacy.beijing&&!entry.staticBackground&&layers.length===1&&!SkinFraming.isOpaqueScene(pixels,384,384,true);
    let scene,sampledPainting=false,recoveredPainting=false;
    const background=l=>l.meta.role==='BgBack'||!!(entry.legacy&&layers.length>1&&l===layers[0]);
    if(layers.some(background)){
      const enabled=layers.map(l=>l.enabled),sample=new Uint8Array(pixels.length);
      // Inspect actual background pixels, independent of foreground effects.
      for(const l of layers)l.enabled=background(l);
      draw(0,{width:384,height:384});gl.readPixels(0,0,384,384,gl.RGBA,gl.UNSIGNED_BYTE,sample);
      const subject=subjectBounds(layers.at(-1).skeleton,layers.at(-1).transform),sampleScale=Math.min(384/fit.width,384/fit.height)*.97;
      const anchor=subject&&{x:.5+(subject.x+subject.width/2-fit.x-fit.width/2)*sampleScale/384,y:.5-(subject.y+subject.height/2-fit.y-fit.height/2)*sampleScale/384};
      scene=SkinFraming.sceneBounds(sample,384,384,true,!!entry.legacy,entry.legacy?anchor:undefined);
      // Body mass is weaker evidence than a recognized face. Do not override
      // a camera rejection made using an actual face rectangle.
      if(!scene&&entry.legacy&&!entry.models.at(-1).layerCoordinateMismatch&&!subjectBounds(layers.at(-1).skeleton,layers.at(-1).transform,true)?.width){
        const fg=layers.at(-1),transform=fg.transform,unverified=inferredAvatarZoom(entry,transform),foreground=new Uint8Array(sample.length);
        if(unverified)fg.transform=undefined;
        for(const l of layers)l.enabled=l===fg;
        draw(0,{width:384,height:384});gl.readPixels(0,0,384,384,gl.RGBA,gl.UNSIGNED_BYTE,foreground);
        scene=SkinFraming.recoverSceneBounds(sample,foreground,384,384,true);recoveredPainting=!!scene;
        if(!scene||!unverified)fg.transform=transform;
      }
      sampledPainting=!!scene;
      scene=scene||(entry.legacy?SkinFraming.visibleBounds(sample,384,384,true):null);
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
    if(painting&&!sampledPainting){
      const candidate=transformBounds(painting,layers[0].transform);
      if(candidate.height>=fit.height*.65&&candidate.height<=fit.height*1.1)fit=candidate;
    }
    draw();schedule();
    return{canvas,fit,layers,transparentFigure,recoveredPainting,motions:[...new Set(layers.flatMap(l=>l.names))],motion,draw,
      setFit:(bounds,fill=false)=>{fit=bounds;cover=fill;},setOnDraw:callback=>{onDraw=callback;},setView:v=>{view={...view,...v};draw();},pause:v=>{if(paused!==!!v){paused=!!v;schedule();}},
      setLayer:(id,visible)=>{if(layers[id])layers[id].enabled=visible;},
      capture:()=>{draw();return canvas.toDataURL('image/png');},
      destroy:()=>{if(disposed)return;disposed=true;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',schedule);assets.dispose();renderer.dispose();gl.getExtension('WEBGL_lose_context')?.loseContext();canvas.remove();}};
  }catch(e){assets.dispose();renderer.dispose();gl.getExtension('WEBGL_lose_context')?.loseContext();canvas.remove();throw e;}
};
