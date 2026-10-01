window.createSpine36 = async function (entry, url, initialView, { signal } = {}) {
  const { spine } = await import('./vendor/spine36.js');
  const { restoreMeshUVs } = await import('./mesh-uv.js');
  const { usePremultipliedTexture } = await import('./texture-alpha.js');
  const { createLegacyParser } = await import('./legacy-parser.js');
  const { createSpineAssetScope } = await import('./spine-assets.js');
  signal?.throwIfAborted();
  const { compositionFor, transformBounds, avatarLayerTransform, paintingBounds, subjectBounds, subjectHeadBounds, idleAnimation, inferredAvatarZoom } = await import('./composition.js');
  const {actionSubjectCamera}=await import('./idle-framing.js');
  const composition = compositionFor(entry);
  const sourceScene=entry.scene?.protocol==='noname-source-scene/1'?entry.scene:null;
  const sourcePlacement=sourceScene&&sourceScene.viewport.policy!=='protected-idle-artwork';
  const sourceLayout=sourceScene?(await import('./source-scene.js')).layoutDecadeLayer:null;
  const sourceActions=sourceScene?.actionContract?await import('./source-actions.js'):null;
  const canvas=document.createElement('canvas');document.body.prepend(canvas);
  const context=new spine.webgl.ManagedWebGLRenderingContext(canvas,{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true});
  const gl=context.gl,renderer=new spine.webgl.SceneRenderer(canvas,context),assets=createSpineAssetScope(spine,context,{legacy:true,signal});
  const layers=[],externalLayers=[],externalLoads=new Map();let externalActions,view=initialView,paused=false,disposed=false,last=performance.now(),raf,cover=false,onDraw;
  let removeVisibility=()=>{};
  function destroy(){if(disposed)return;disposed=true;externalActions?.dispose();signal?.removeEventListener('abort',destroy);cancelAnimationFrame(raf);removeVisibility();assets.dispose();renderer.dispose();gl.getExtension('WEBGL_lose_context')?.loseContext();canvas.remove();}
  signal?.addEventListener('abort',destroy,{once:true});
  function applyPose(layer,dt){
    const {skeleton,state,meta}=layer;
    state.update(dt*(sourceActions?1:(meta.legacy?.speed??1)));state.apply(skeleton);
    const config=layer.sourceLayer?.source||meta.legacy||{};
    if(sourceScene){skeleton.flipX=!!config.flipX;skeleton.flipY=!!config.flipY;skeleton.color.a=config.opacity??1;}
    skeleton.updateWorldTransform();
  }
  const load=(fn,path)=>assets[fn](path);
  try {
    async function loadLayer(m,actionLayer){
      const [atlas,binary]=await Promise.all([load('loadTextureAtlas',url(m.atlas)),load('loadBinary',url(m.skeleton))]);
      // Screen/additive slots require premultiplied texture samples. Transparent
      // atlas pixels may contain white RGB and otherwise become solid bands.
      for(const page of atlas.pages)usePremultipliedTexture(page.texture,gl,!!(m.legacy?.premultipliedAlpha??page.pma));
      const parser=createLegacyParser(spine,atlas,m);
      const data=parser.readSkeletonData(m.skeleton.endsWith('.json')?JSON.parse(new TextDecoder().decode(binary)):binary);
      for(const skin of data.skins)for(const slots of skin.attachments)for(const attachment of Object.values(slots||{}))if(attachment instanceof spine.MeshAttachment)restoreMeshUVs(attachment);
      const skeleton=new spine.Skeleton(data);skeleton.opacity=1;if(m.skin&&data.findSkin(m.skin))skeleton.setSkinByName(m.skin);
      const state=new spine.AnimationState(new spine.AnimationStateData(data));state.data.defaultMix=.15;
      const names=data.animations.map(a=>a.name);const idle=actionLayer?null:sourceScene?(sourcePlacement?(m.animation??names[0]):sourceScene.layers[layers.length].playback.declaredAction||idleAnimation({},names,sourceScene.layers[layers.length].role==='background')):idleAnimation(m,names,m.role==='BgBack'||!!(entry.legacy?.beijing&&!layers.length));
      if(sourceScene&&!actionLayer)sourceScene.layers[layers.length].playback.resolvedIdle=idle;
      if(sourceScene&&idle&&!names.includes(idle))throw Error('源配置动作不存在：'+idle);
      if(idle){const track=state.setAnimation(0,idle,true);if(sourceActions)track.timeScale=m.legacy?.speed??1;}
      const layer={skeleton,state,names,idle,visible:actionLayer?false:!m.effectOnly,enabled:true,meta:m,sourceLayer:actionLayer,transform:composition.layers?.[layers.length],premultipliedAlpha:true};
      applyPose(layer,actionLayer?0:1/30);
      const originalSubject=subjectBounds(skeleton,{},true);
      // Sparse avatar exports expose detached effect slots around the person.
      // Only their recovered framing needs the cut-effect upload correction.
      if(entry.legacy?.beijing&&originalSubject?.width&&skeleton.sparseSubjectRecovered){
        const {prepareEffectPage}=await import('./effect-boundaries.js');
        for(const page of atlas.pages){const texture=page.texture,image=texture.getImage();
          const pixels=prepareEffectPage(image,atlas.regions.filter(r=>r.page===page),image.naturalWidth||image.width,image.naturalHeight||image.height,!!(m.legacy?.premultipliedAlpha??page.pma));
          if(pixels!==image){texture._image=pixels;texture.update();}
        }
      }
      (await import('./composition.js')).setSubjectFocus(skeleton,m);
      const focusedSubject=subjectBounds(skeleton,{},true);
      skeleton.subjectFocusChanged=!!(originalSubject?.width&&focusedSubject?.width&&Math.abs(originalSubject.x-focusedSubject.x)>originalSubject.width);
      if(!skeleton.subjectFocusChanged)delete skeleton.subjectFocusX;
      return layer;
    }
    for(const m of entry.models)layers.push(await loadLayer(m));
    if(!sourceScene&&entry.legacy?.beijing&&layers.length===2&&!entry.composition?.layers&&!entry.models.at(-1).sceneCoordinates&&!entry.models.at(-1).layerRegistration){
      const {sharedSceneCoordinates}=await import('./scene-coordinates.js');
      const pair=!sharedSceneCoordinates(layers[0].skeleton,layers[1].skeleton)&&sharedSceneCoordinates(layers[0].skeleton,layers[1].skeleton,true);
      const m=entry.models[1];
      if(pair&&!m.sceneVariant&&m.avatarPresentation&&Math.abs(pair.transform.scale-1)>.05){
        m.sceneCoordinates={...pair,rule:'constant-scene-root'};
      }else if(pair&&m.sceneVariant&&layers[1].skeleton.subjectFocusChanged){
        m.sceneCoordinates={...pair,rule:'constant-scene-root'};
      }
    }
    if(sourceActions){
      const {createExternalActionController}=await import('./source-external-actions.js');
      externalActions=createExternalActionController({setPrimaryHidden:hidden=>{layers[sourceScene.layers.findIndex(l=>l.role==='primary')].sourceHidden=hidden;},load:action=>{
        const key=JSON.stringify([action.model.skeleton,action.model.atlas,action.model.skin]);
        if(!externalLoads.has(key)){
          const pending=loadLayer(action.model,action.actionLayer).then(layer=>{if(disposed)throw new DOMException('播放器已销毁','AbortError');const offset=new spine.Vector2(),size=new spine.Vector2();layer.skeleton.getBounds(offset,size,[]);layer.sourceBounds={width:size.x,height:size.y};externalLayers.push(layer);return layer;}).catch(error=>{externalLoads.delete(key);throw error;});
          externalLoads.set(key,pending);
        }
        return externalLoads.get(key);
      }});
    }
    // Preserve rig coordinates and apply reviewed layer calibration outside the
    // skeleton. Legacy avatar parameters are not universally valid scene units.
    const raw=layers.map(l=>{const offset=new spine.Vector2(),size=new spine.Vector2();l.skeleton.getBounds(offset,size,[]);return {x:offset.x,y:offset.y,width:size.x,height:size.y};});
    if(!sourcePlacement&&layers.length===2){
      const transform=(await import('./composition.js')).restoredSceneUnits(entry,layers[0].skeleton,layers[1].skeleton);
      if(transform)entry.models[1].sceneCoordinates={transform,rule:'full-export-matched-scene-units'};
    }
    if(!sourcePlacement)layers.forEach((l,i)=>l.transform=avatarLayerTransform(entry,i,raw[i],raw[0]));
    const bounds=layers.filter(l=>!l.meta.effectOnly).map(l=>transformBounds(raw[layers.indexOf(l)],l.transform));
    const painting=entry.legacy?.beijing&&paintingBounds(layers[0].skeleton,bounds[1]);
    const x=Math.min(...bounds.map(b=>b.x)),y=Math.min(...bounds.map(b=>b.y));
    let fit={x,y,width:Math.max(...bounds.map(b=>b.x+b.width))-x,height:Math.max(...bounds.map(b=>b.y+b.height))-y};
    // Explicit source placement does not require an inferred artwork camera.
    // An empty animated layer must not poison other layers with infinite bounds.
    if(!sourcePlacement&&(!Number.isFinite(fit.width)||fit.width<=0))throw new Error('Spine 3.6 模型边界无效');
    function draw(dt=0,viewport){
      if(disposed)return;
      const w=viewport?.width||Math.max(1,innerWidth),h=viewport?.height||Math.max(1,innerHeight),dpr=viewport?1:Math.min(devicePixelRatio||1,1.5);
      const renderLayers=[...layers,...externalLayers];
      for(const l of renderLayers){
        if(externalLayers.includes(l)&&!l.visible)continue;
        applyPose(l,dt);l.skeleton.update(dt);
      }
      const primary=layers.at(-1),track=primary.state.getCurrent(0);
      const activeFit=!sourceScene&&entry.legacy?.beijing&&cover&&track&&!track.loop&&track.animation.name!==primary.idle?
        actionSubjectCamera(fit,subjectHeadBounds(primary.skeleton,primary.transform),w/h):fit;
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';}
      const scale=(entry.legacy&&cover?Math.max(w/activeFit.width,h/activeFit.height):Math.min(w/activeFit.width,h/activeFit.height))*(cover?1:.97)*view.scale;
      if(sourcePlacement){renderer.camera.setViewport(w/view.scale,h/view.scale);renderer.camera.position.set(w/2-w*view.x/view.scale,h/2+h*view.y/view.scale,0);}
      else{renderer.camera.setViewport(w/scale,h/scale);renderer.camera.position.set(activeFit.x+activeFit.width/2-w*view.x/scale,activeFit.y+activeFit.height/2+h*view.y/scale,0);}
      gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      for(const l of renderLayers){
        if(!l.visible||!l.enabled||l.sourceHidden)continue;
        renderer.begin();
        const placement=sourcePlacement?sourceLayout(l.sourceLayer||sourceScene.layers[layers.indexOf(l)],{width:w,height:h,referenceHeight:sourceScene.viewport.referenceHeight},l.sourceBounds||raw[layers.indexOf(l)]):l.transform;
        if(sourcePlacement)l.placementTrace=placement;
        if(placement){
          const t=placement,matrix=renderer.camera.projectionView.copy();
          matrix.translate(t.x||0,t.y||0,0);matrix.scale(t.scale??1,t.scale??1,1);
          if(t.angle)matrix.rotate(t.angle,0,0,1);
          renderer.batcherShader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX,matrix.values);
        }
        renderer.skeletonRenderer.hideSlots=(l.sourceLayer?.source||l.meta.legacy)?.hideSlots;
        renderer.drawSkeleton(l.skeleton,l.premultipliedAlpha);
        renderer.end();
      }
      renderer.end();
      onDraw?.();
    }
    function tick(now){raf=0;if(disposed||paused||document.hidden)return;if(now-last<1000/30-1){raf=requestAnimationFrame(tick);return;}const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;draw(dt);raf=requestAnimationFrame(tick);}
    function schedule(){cancelAnimationFrame(raf);raf=0;if(!disposed&&!paused&&!document.hidden){last=performance.now();raf=requestAnimationFrame(tick);}}
    document.addEventListener('visibilitychange',schedule);
    removeVisibility=()=>document.removeEventListener('visibilitychange',schedule);
    function motion(name,{onFinished}={}){
      externalActions?.stop();
      if(sourceActions&&name.startsWith('source:')){
        const index=sourceScene.layers.findIndex(l=>l.role==='primary'),layer=layers[index];
        const action=sourceActions.sourceAction(sourceScene,name,layer.skeleton.data.animations);
        if(!action)return false;
        if(action.mode==='external'){const current=layer.state.getCurrent(0);if(current&&!current.loop){layer.sourceLayer=null;const idle=layer.state.setAnimation(0,layer.idle,true);idle.mixDuration=0;idle.timeScale=layer.meta.legacy?.speed??1;}return externalActions.play(action,onFinished);}
        sourceActions.queueSourceAction(layer.state,action,onFinished,value=>{layer.sourceLayer=value;});layer.visible=true;return true;
      }
      let played=false;
      for(const l of layers){
        if(!l.names.includes(name)){if(l.meta.effectOnly)l.visible=false;continue;}
        l.visible=true;l.sourceLayer=null;const track=l.state.setAnimation(0,name,name===l.idle);if(sourceActions)track.timeScale=l.meta.legacy?.speed??1;played=true;
        if(name!==l.idle){if(l.meta.effectOnly)track.listener={complete:()=>{l.visible=false;}};else if(l.idle){const next=l.state.addAnimation(0,l.idle,true,0);if(sourceActions)next.timeScale=l.meta.legacy?.speed??1;}}
      }
      return played;
    }
    let transparentFigure=false,recoveredPainting=false;
    if(!sourcePlacement){
    // Ignore transparent atlas padding when computing the initial camera.
    draw(0,{width:384,height:384});
    const pixels=new Uint8Array(384*384*4);gl.readPixels(0,0,384,384,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    transparentFigure=!!entry.legacy&&!entry.legacy.beijing&&!entry.staticBackground&&layers.length===1&&!SkinFraming.isOpaqueScene(pixels,384,384,true);
    let scene,sampledPainting=false;
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
    }else fit={x:0,y:0,width:innerWidth,height:innerHeight};
    draw();schedule();
    return{canvas,fit,layers,transparentFigure,recoveredPainting,motions:[...new Set(layers.flatMap(l=>l.names))],motion,draw,
      externalLayers,
      resetMotions(){externalActions?.stop();for(const l of layers){l.state.clearTracks();l.sourceLayer=null;l.skeleton.setToSetupPose();if(l.idle){const t=l.state.setAnimation(0,l.idle,true);t.mixDuration=0;if(sourceActions)t.timeScale=l.meta.legacy?.speed??1;}}draw(0);},
      setFit:(bounds,fill=false)=>{fit=bounds;cover=fill;},setOnDraw:callback=>{onDraw=callback;},setView:v=>{view={...view,...v};draw();},pause:v=>{if(paused!==!!v){paused=!!v;schedule();}},
      setLayer:(id,visible)=>{if(layers[id])layers[id].enabled=visible;},
      renderFrame:()=>draw(0),capture:()=>{draw();return canvas.toDataURL('image/png');},
      destroy};
  }catch(e){destroy();throw e;}
};
