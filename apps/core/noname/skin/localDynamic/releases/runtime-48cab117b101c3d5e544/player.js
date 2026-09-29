(function(){
 'use strict';
 const query=new URLSearchParams(location.search),base=new URL(query.get('assetBase')||'../',location.href),channel=query.get('channel')||'';
 const status=document.getElementById('status'),subtitle=document.getElementById('subtitle');
 let interactive=query.get('interactive')==='1';
 let app,model,entry,root,fit,engine42,disposed=false,view={scale:1,x:0,y:0},returnTimer,subtitleTimer,eventTimer,motionRequest=0;
 let voices=[],audio,ctx,analyser,lip=0,follow=true,sound=true,loopAction=false,lastMotion='',pointer=null,gesture=null,stateIdle='';
 const overrides=new Map(),hiddenLayers=new Set(),activeDrags=new Map(),motions=new Map();
 const legacyLayers=[],externalLayers=[],externalLoads=new Map();let externalRoot,externalActions;
 const lifetime=new AbortController(),pendingLoads=new Set();
 let phase='created';
 function setPhase(value){phase=value;document.documentElement.dataset.skinPhase=value;}
 function checkAlive(){if(disposed)throw new DOMException('播放器已销毁','AbortError');}
 function trackLoad(begin){
  checkAlive();
  return new Promise((resolve,reject)=>{
   let cleanup=()=>{},done=false;
   const finish=(error,value)=>{if(done)return;done=true;clearTimeout(timer);pendingLoads.delete(cancel);cleanup();error?reject(error):resolve(value);};
   const cancel=()=>finish(new DOMException('播放器加载已取消','AbortError'));
   const timer=setTimeout(()=>finish(Error('动态皮肤资源加载超时')),60000);
   pendingLoads.add(cancel);
   try{cleanup=begin(value=>finish(null,value),error=>finish(error))||cleanup;if(done)cleanup();}catch(error){finish(error);}
  });
 }
 let volume=1,presentation,surface,audioSamples,requestedPause=false,backgroundImage,fillScene=false,selectIdleAnimation,sourceScene,sourcePlacement,sourceLayout,sourceActions,cameraAction,resolveScreenAction,protectIdleCamera;
 const preview=query.get('presentation')==='preview';
 const effectHost=window.frameElement?.__nonameSkinEffectHost,effectMode=window.frameElement?.__nonameSkinEffect;
 const notice=error=>report('notice',{message:String(error?.message||error)});
 const url=path=>new URL(path.split('/').map(encodeURIComponent).join('/'),base).href;
 function script(path){return trackLoad((resolve,reject)=>{const node=document.createElement('script');node.async=false;node.src=path;node.onload=resolve;node.onerror=()=>reject(new Error('播放库加载失败：'+path));document.head.append(node);return()=>{node.onload=node.onerror=null;if(disposed)node.remove();};});}
 async function loadRuntime(type){
  const paths=type==='spine36'?['spine36.js']:type==='spine42'?['spine42.js','vendor/spine-webgl.min.js']:
   type==='live2d'?['vendor/pixi.min.js','vendor/live2dcubismcore.min.js','vendor/live2d.min.js']:['vendor/pixi.min.js','vendor/pixi-spine.js'];
  // Fetch concurrently, execute in dependency order (ordered classic scripts).
  await Promise.all(paths.map(script));
 }
 function report(type,extra={}){if(parent!==window)parent.postMessage({type:'noname-skin-'+type,channel,id:entry?.id,...extra},'*');}
 async function json(path){
  const address=url(path);
  if(!address.startsWith('file:')){const r=await fetch(address,{signal:AbortSignal.any([lifetime.signal,AbortSignal.timeout(60000)])});if(!r.ok)throw new Error('读取失败 '+r.status+' '+path);return r.json();}
  return trackLoad((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('GET',address);xhr.onload=()=>{try{if(xhr.status!==0&&xhr.status!==200)throw new Error('读取失败 '+xhr.status);resolve(JSON.parse(xhr.responseText));}catch(e){reject(e);}};xhr.onerror=()=>reject(new Error('本地文件读取失败：'+path));xhr.send();return()=>{xhr.onload=xhr.onerror=null;xhr.abort();};});
 }
 function resize(){
  if(protectIdleCamera&&presentation?.protectedSubject&&fillScene){
   const camera=protectIdleCamera(fit,presentation.protectedSubject,innerWidth/innerHeight);
   if(camera){Object.assign(fit,camera);engine42?.setFit(fit,true);}
  }
  if(engine42){engine42.setView(view);return;}
  if(!app||!fit||disposed)return;
  const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);if(app.screen.width!==w||app.screen.height!==h)app.renderer.resize(w,h);
  if(sourcePlacement){
   [...root.children,...externalLayers].forEach((child,i)=>{
    const layer=child.sourceLayer||sourceScene.layers[i],bounds=child.skinSourceBounds;
    const action=child.state?.getCurrent(0)?.animation?.name;
    const camera=sourceScene.viewport.actionCameras?.[action]?.bounds||sourceScene.viewport.bounds;
    const t=sourceScene.viewport.policy==='complete-artwork'?sourceLayout(camera,{width:w,height:h}):sourceLayout(layer,{width:w,height:h,referenceHeight:sourceScene.viewport.referenceHeight},bounds);cameraAction=action;
    child.position.set(t.x,h-t.y);child.scale.set(t.scale*(layer.display.flipX?-1:1),t.scale*(layer.display.flipY?-1:1));child.angle=-t.angle;child.alpha=layer.display.opacity;
    child.skinPlacementTrace=t;
   });
   root.scale.set(view.scale);root.position.set(w*(.5+view.x)-w*.5*view.scale,h*(.5+view.y)-h*.5*view.scale);
   if(externalRoot){externalRoot.scale.copyFrom(root.scale);externalRoot.position.copyFrom(root.position);}
   Object.assign(fit,{x:0,y:0,width:w,height:h});app.render();return;
  }
  // Legacy scenes fill the native portrait frame with one uniform scale.
  // Other packs retain their complete-subject fit.
  const padding=preview&&(!entry.legacy||fillScene)?1:.97;
  const scale=(fillScene?Math.max(w/fit.width,h/fit.height):Math.min(w/fit.width,h/fit.height))*padding*view.scale;root.scale.set(scale);
  root.position.set(w/2-(fit.x+fit.width/2)*scale+w*view.x,h/2-(fit.y+fit.height/2)*scale+h*view.y);app.render();
 }
 async function loadSpine(m,index,actionLayer){
  if(!m.skeleton.endsWith('.json')&&/^3\.[67]\./.test(m.version||'')){
   if(!window.createSpine36)await script('spine36.js');
   const engine=await createSpine36({models:[m]},url,{scale:1,x:0,y:0},{signal:lifetime.signal});
   if(disposed){engine.destroy();checkAlive();}
   engine.pause(true);engine.canvas.style.display='none';legacyLayers.push(engine);
   const b=engine.fit,ratio=Math.min(1,1024/Math.max(b.width,b.height));
   const viewport={width:Math.max(1,Math.round(b.width*ratio)),height:Math.max(1,Math.round(b.height*ratio))};
   engine.setFit(b,true);engine.draw(0,viewport);
   const sprite=PIXI.Sprite.from(engine.canvas),layer=new PIXI.Container();
   sprite.width=b.width;sprite.height=b.height;sprite.position.set(b.x,-b.y-b.height);layer.addChild(sprite);
   layer.skinAnimations=engine.motions;layer.skinIdle=engine.layers[0].idle;
   layer.spineData={animations:engine.layers[0].skeleton.data.animations};
   layer.state={setAnimation:(track,name)=>engine.motion(name),addAnimation:()=>{}};
   layer.update=dt=>{engine.draw(dt,viewport);sprite.texture.update();};
   // The raster adapter has no PIXI Skeleton/AnimationState facade. Provide
   // explicit deterministic seeking without exposing native world coordinates
   // to the unrelated PIXI framing path.
   layer.skinSeek=(name,time)=>{for(const l of engine.layers){l.skeleton.setToSetupPose();l.state.clearTracks();l.state.setAnimation(0,name||l.idle,true);}engine.draw(time,viewport);sprite.texture.update();};
   return layer;
  }
  const metadata={spineAtlasFile:url(m.atlas)};
  if(/^(?:3\.8|4\.[01])\./.test(m.version||'')){
   const {inspectAtlasPages,clampAtlasEdge,declaredAtlasSize}=await import('./atlas-compat.js');checkAlive();
   const response=await fetch(url(m.atlas),{signal:AbortSignal.any([lifetime.signal,AbortSignal.timeout(60000)])});
   if(!response.ok)throw Error('图集读取失败：'+response.status);
   metadata.atlasRawData=await response.text();const extents=inspectAtlasPages(PIXI,metadata.atlasRawData);
   metadata.imageLoader=(loader,prefix,baseUrl,options)=>(name,callback)=>{
    const address=new URL(name.split('/').map(encodeURIComponent).join('/'),url(m.atlas)).href;
    loader.add(prefix+name,address,options,resource=>{
     if(resource.error){callback(null);return;}
     try{if(m.legacy?.premultipliedAlpha||name.includes('-pma.'))resource.texture.baseTexture.alphaMode=PIXI.ALPHA_MODES.PMA;callback((/^4\.[01]\./.test(m.version)?declaredAtlasSize:clampAtlasEdge)(PIXI,resource.texture.baseTexture,extents.get(name)));}catch(error){fail(error);}
    });
   };
  }
  const {installSourceMasks}=await import('./source-masks.js');
  const chooseSkin=/^4\.0\./.test(m.version||'')?(await import('./skeleton-skin.js')).chooseSkeletonSkin:null;
  checkAlive();const loader=new PIXI.Loader();
  return trackLoad((resolve,reject)=>{
   if(m.skeleton.endsWith('.json')&&/^3\.8\./.test(m.version||''))loader.pre((resource,next)=>{
    if(resource.url!==url(m.skeleton))return next();
    Promise.all([json(m.skeleton),import('./spine-json.js')]).then(([raw,adapter])=>{
     if(disposed)return;
     const normalized=adapter.normalizeSpineJson(raw);resource.data=normalized.data;resource.type=PIXI.LoaderResource.TYPE.JSON;resource.skinJsonConversion=normalized.conversion;resource.complete();next();
    }).catch(error=>{if(!disposed)reject(error);});
   });
   loader.onError.once(e=>reject(new Error(String(e))));
   loader.add('layer'+index,url(m.skeleton),{metadata}).load((_,res)=>{
    try{
     const data=res['layer'+index].spineData;if(!data)throw new Error('Spine 骨骼解析失败：'+m.skeleton);
     const s=new PIXI.spine.Spine(data);s.autoUpdate=false;s.skinJsonConversion=res['layer'+index].skinJsonConversion||null;
     if(chooseSkin){s.skinSelectionTrace=chooseSkin(data,m.skin??m.legacy?.skin,PIXI.spine.AttachmentType);if(s.skinSelectionTrace.name){s.skeleton.setSkinByName(s.skinSelectionTrace.name);s.skeleton.setSlotsToSetupPose();}}
     else if(m.skin&&data.skins.some(x=>x.name===m.skin))s.skeleton.setSkinByName(m.skin);
     s.skinAnimations=data.animations.map(x=>x.name);
     if(actionLayer){s.sourceLayer=actionLayer;s.visible=false;s.skinIdle=null;}
     else if(sourceScene){
      const declared=sourceScene.layers[index].playback.declaredAction;
      if(Array.isArray(declared))throw Error('此候选类别尚未验证多动作声明');
      if(declared&&!s.skinAnimations.includes(declared))throw Error('源动作不存在：'+declared);
      s.skinIdle=declared||(sourcePlacement?s.skinAnimations[0]:selectIdleAnimation({},s.skinAnimations,sourceScene.layers[index].role==='background'));
      sourceScene.layers[index].playback.resolvedIdle=s.skinIdle;
     }else s.skinIdle=selectIdleAnimation(m,s.skinAnimations,m.role==='BgBack'||!!(entry.legacy?.beijing&&index===0));
     if(s.skinIdle){const track=s.state.setAnimation(0,s.skinIdle,true);if(sourceActions)track.timeScale=sourceScene.layers[index].playback.speed;}s.update(1/30);
     let sourceBounds=s.getLocalBounds();
     // Some 4.1 cutscenes begin with all slots detached. Advance through only
     // that empty lead-in before taking the initial camera bounds.
     if(/^4\.1\./.test(m.version||'')&&s.skinIdle&&!(sourceBounds.width>0&&sourceBounds.height>0)){
      const duration=data.animations.find(a=>a.name===s.skinIdle)?.duration||0;
      let elapsed=1/30;
      for(const time of [...new Set([.1,.25,.5,1,2,duration/2,Math.max(0,duration-.01)])].filter(t=>t>elapsed&&t<duration).sort((a,b)=>a-b)){
       s.update(time-elapsed);elapsed=time;sourceBounds=s.getLocalBounds();
       if(sourceBounds.width>0&&sourceBounds.height>0){s.skinInitialAdvance=elapsed;break;}
      }
     }
     s.skinSourceBounds={width:sourceBounds.width,height:sourceBounds.height};
     const t=m.transform||{},scale=t.localScale||{},pos=t.anchoredPosition||{};
     s.scale.set(scale.x??1,scale.y??1);s.position.set(pos.x||0,-(pos.y||0));
     if(m.legacy){
      const c=m.legacy;
      // Composite the original artwork before fitting it to an avatar. Applying
      // separate avatar edits here shrinks backgrounds away from their subjects.
      const update=s.update.bind(s);s.update=dt=>update(dt*(sourceActions?1:(c.speed??1)));
     }
     installSourceMasks(s,()=>s.sourceLayer?.display?.hideSlots??m.legacy?.hideSlots);s.update(0);
     resolve(s);
    }catch(e){reject(e);}
   });
   return()=>queueMicrotask(()=>{loader.reset();loader.destroy();});
  });
 }
 let screenActions;
 let capabilities={events:{},interaction:{available:false,motions:[]}};
 function info(){
  let parameters=[],layers=[],hits=[];
  if(model){
   const core=model.internalModel.coreModel,raw=core.getModel();
   parameters=Array.from(raw.parameters.ids,(id,i)=>({id,min:raw.parameters.minimumValues[i],max:raw.parameters.maximumValues[i],value:raw.parameters.defaultValues[i]}));
   layers=Array.from(core.getDrawableIds(),(id,i)=>({id:String(i),name:id}));
   hits=Object.values(model.internalModel.hitAreas).map(h=>({name:h.name,id:h.id,index:h.index,action:hitAction(h.name)}));
  }else if(engine42)layers=engine42.layers.map((l,i)=>({id:String(i),name:l.meta.role||l.meta.skeleton.split('/').pop()}));
  else layers=root.children.map((l,i)=>({id:String(i),name:entry.models[i].skeleton.split('/').pop()}));
  const expressions=model?(model.internalModel.settings.expressions?.map(e=>e.Name)||[]):entry.motions.filter(n=>/^(expression|angry|delight|good|no|surprise|think|shy)(_|$)/i.test(n));
  return{motions:entry.motions||[],parameters,layers,hits,expressions,...capabilities,voices:voices.map((v,i)=>({index:i,label:(v.skinLabel?v.skinLabel+' · ':'')+v.label,subtitle:v.subtitle||''}))};
 }
 function repairHits(){
  const internal=model.internalModel,core=internal.coreModel,ids=Array.from(core.getDrawableIds()),areas=internal.settings.hitAreas||entry.hitAreas||[];
  internal.hitAreas={};
  for(const h of areas){
   let index=ids.indexOf(h.Id);if(index<0)index=ids.indexOf(h.Name);
   if(index<0&&/^\d+$/.test(h.Id)&&Number(h.Id)<ids.length&&ids[Number(h.Id)]===h.Name)index=Number(h.Id);
   if(index>=0)internal.hitAreas[h.Name]={id:ids[index],name:h.Name,index};
  }
 }
 function hitAction(name){
  const normal=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');const target=normal(name);
  return entry.motions.find(n=>normal(n)===target)||'';
 }
 function hit(x,y){
  if(!model)return[];
  return model.hitTest(x,y).filter(name=>model.internalModel.coreModel.getDrawableOpacity(model.internalModel.hitAreas[name].index)>0).sort((a,b)=>{
   const rank=s=>!hitAction(s)?4:/Idle/.test(s)?0:/Head|Special/.test(s)?1:/Drag/.test(s)?3:2;return rank(a)-rank(b);
  });
 }
 function initAudio(){
  if(!audio){audio=new Audio();audio.volume=volume;audio.preload='none';audio.onended=()=>{lip=0;subtitle.textContent='';};audio.onerror=()=>{report('notice',{message:'语音文件播放失败'});};}
  if(!ctx){try{ctx=new(window.AudioContext||window.webkitAudioContext)();const source=ctx.createMediaElementSource(audio);analyser=ctx.createAnalyser();analyser.fftSize=256;source.connect(analyser);analyser.connect(ctx.destination);}catch(e){console.warn(e);}}
  if(ctx?.state==='suspended')ctx.resume().catch(()=>{});
 }
 async function playVoice(index){
  if(!sound||!voices[index])return false;initAudio();const v=voices[index];audio.pause();audio.src=url(v.file);subtitle.textContent=v.subtitle||v.label;
  try{await audio.play();return true;}catch(e){subtitle.textContent='点击语音按钮后播放';report('notice',{message:'浏览器暂未允许语音播放，请点击语音按钮。'});return false;}
 }
 function autoVoice(name,automatic=false){
  if(!sound||!interactive&&!automatic)return;
  const aliases={touch_head:['headtouch','touch_head'],touch_body:['touch','touch_body'],touch_special:['touch2','touch_special'],login:['login'],home:['home']};
  const labels=aliases[name]||[name];const candidates=voices.map((v,i)=>({v,i})).filter(({v})=>labels.includes(v.label)||labels.some(label=>v.tags?.includes('cue:'+label)));
  const skinId=entry.id.match(/^az_(\d+)$/)?.[1];
  const exact=candidates.find(({v})=>!/_ex\d/.test(v.label)&&(v.skinLabel===entry.title||(skinId&&v.tags?.includes('skin-id:'+skinId))));
  // Avoid playing an arbitrary alternate costume's line when correspondence is ambiguous.
  if(exact)playVoice(exact.i);else if(candidates.length===1)playVoice(candidates[0].i);
 }
 async function motion(name,withVoice=true,automatic=false,onFinished){
  if(disposed||!entry.motions.includes(name))return false;
  const request=++motionRequest;clearTimeout(returnTimer);externalActions?.stop();effectHost?.stop();let played=false;
  const actionScene=entry.actionScene||sourceScene,actionAPI=entry.actionScene?screenActions:sourceActions;
  if(effectHost&&actionAPI){
   const sourceIndex=actionScene.layers.findIndex(l=>l.role==='primary'),installedIndex=entry.models.findIndex(m=>m.legacy?.name===entry.legacy?.name);
   const i=entry.actionScene?(installedIndex>=0?installedIndex:entry.models.length-1):sourceIndex,l=engine42?.layers[i]||root.children[i];
   const action=name.startsWith('source:')?resolveScreenAction(actionAPI.sourceAction(actionScene,name,l.skeleton.data.animations),entry.models):
    (await import('./effect-layout.js')).discoveredSkillAction(actionScene,name,entry.models[i],l.skeleton.data.animations);
   if(action){
    const current=l.state.getCurrent(0);if(current&&!current.loop){l.sourceLayer=null;const t=l.state.setAnimation(0,l.idle||l.skinIdle,true);t.mixDuration=0;t.timeScale=actionScene.layers[sourceIndex].playback.speed;}
    played=await effectHost.play(action,hidden=>{if(engine42){l.sourceHidden=hidden;engine42.draw(0);}else{l.renderable=!hidden;app.render();}},onFinished);
    if(played){lastMotion=name;report('motion',{motion:name});if(withVoice)autoVoice(name,automatic);}return played;
   }
  }
  if(model){
   const manager=model.internalModel.motionManager;
   const loaded=await manager.loadMotion(name,0);
   if(disposed||!loaded||request!==motionRequest)return false;
   // The declared idle may have any source name (for example idle_1). It must
   // loop continuously instead of being restarted by the one-shot return timer.
   const idleState=name===entry.idle||name===stateIdle||/^(idle\d*|normal\w*|loop\w*|stand\w*|wait\w*)$/i.test(name);
   if(idleState){stateIdle=name;manager.groups.idle=name;}
   const looping=idleState||loopAction;
   if(typeof loaded.setIsLoop==='function')loaded.setIsLoop(looping);
   manager.stopAllMotions();
   played=await model.motion(name,0,3);
   const duration=motions.get(name)?.Meta?.Duration||loaded.getDuration?.();
   if(request!==motionRequest)return false;
   if(!looping&&played&&duration>0)returnTimer=setTimeout(()=>motion(stateIdle||entry.idle,false),Math.min(duration,300)*1000+100);
  }else if(engine42)played=await engine42.motion(name,{onFinished});
  else if(sourceActions&&name.startsWith('source:')){
   const index=sourceScene.layers.findIndex(l=>l.role==='primary'),s=root.children[index];
   const action=sourceActions.sourceAction(sourceScene,name,s.spineData.animations);
   if(action?.mode==='external'){const current=s.state.getCurrent(0);if(current&&!current.loop){s.sourceLayer=null;const idle=s.state.setAnimation(0,s.skinIdle,true);idle.mixDuration=0;idle.timeScale=sourceScene.layers[index].playback.speed;}played=await externalActions.play(action,onFinished);if(played)resize();}
   else if(action){sourceActions.queueSourceAction(s.state,action,onFinished,value=>{s.sourceLayer=value;s.skeleton.setSlotsToSetupPose();resize();});played=true;}
  }else for(const [index,s] of root.children.entries()){if(s.skinAnimations.includes(name)){s.sourceLayer=null;const track=s.state.setAnimation(0,name,name===s.skinIdle);if(sourceActions)track.timeScale=sourceScene.layers[index].playback.speed;if(name!==s.skinIdle&&s.skinIdle){const next=s.state.addAnimation(0,s.skinIdle,true,0);if(sourceActions)next.timeScale=sourceScene.layers[index].playback.speed;}played=true;}}
   if(played){lastMotion=name;report('motion',{motion:name});if(withVoice)autoVoice(name,automatic);}
  return played;
 }
 function setLayer(id,visible){
  visible?hiddenLayers.delete(String(id)):hiddenLayers.add(String(id));
  if(engine42)engine42.setLayer(Number(id),visible);else if(!model&&root.children[id])root.children[id].visible=visible;
 }
 function setParameter(id,value){if(value===null)overrides.delete(id);else overrides.set(id,Number(value));}
 function resetSourceMotions(){
  effectHost?.stop();externalActions?.stop();
  if(engine42){engine42.resetMotions();return;}
  for(const [i,s] of root.children.entries()){s.state.clearTracks();s.sourceLayer=null;s.skeleton.setToSetupPose();if(s.skinIdle){const t=s.state.setAnimation(0,s.skinIdle,true);t.mixDuration=0;if(sourceActions)t.timeScale=sourceScene.layers[i].playback.speed;}s.update(0);}
 }
 function reset(){clearTimeout(returnTimer);stateIdle=entry.idle;overrides.clear();activeDrags.clear();hiddenLayers.clear();if(engine42)engine42.layers.forEach((_,i)=>engine42.setLayer(i,true));else if(!model)root.children.forEach(s=>s.visible=true);if(model)model.internalModel.focusController.focus(0,0,true);if(sourceScene)resetSourceMotions();else motion(entry.idle,false);view={scale:1,x:0,y:0};resize();audio?.pause();subtitle.textContent='';report('view',{view});}
 function pointerEvents(canvas){
  const coords=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*innerWidth,y:(e.clientY-r.top)/r.height*innerHeight};};
  canvas.addEventListener('pointerdown',e=>{if(!interactive||pointer||e.button!==0)return;e.preventDefault();const p=coords(e);pointer={id:e.pointerId,...p,startX:p.x,startY:p.y,hits:hit(p.x,p.y),pan:e.ctrlKey||e.shiftKey,view:{...view},moved:false};canvas.setPointerCapture(e.pointerId);initAudio();});
  canvas.addEventListener('pointermove',e=>{
   if(!interactive)return;const p=coords(e);if(model&&follow&&!e.ctrlKey)model.focus(p.x,p.y);
   if(!pointer||pointer.id!==e.pointerId)return;
   const dx=p.x-pointer.startX,dy=p.y-pointer.startY;if(Math.hypot(dx,dy)>7)pointer.moved=true;
   if(pointer.pan){view={...view,x:pointer.view.x+dx/innerWidth,y:pointer.view.y+dy/innerHeight};resize();report('view',{view});return;}
   if(pointer.moved&&!gesture){const area=pointer.hits.find(h=>/Drag/.test(h)&&hitAction(h));const action=area&&hitAction(area);gesture={area,action};if(action){void motion(action).catch(notice);report('hit',{areas:[area],action,message:'拖拽触发 '+area});}}
  });
  const release=e=>{
   if(!pointer||pointer.id!==e.pointerId)return;
   if(!pointer.moved){const names=pointer.hits;const name=names.find(n=>entry.motions.includes(hitAction(n)));
    let fallback='';
    if(name)void motion(hitAction(name)).catch(notice);
    else if(!model || !Object.keys(model.internalModel.hitAreas).length){
     // Preserve the ZIP's Spine click-to-cycle preview. Models without region
     // definitions can expose their explicitly named touch clips the same way.
     const list=model?entry.motions.filter(n=>/^(touch|tap|click)(_|$)/i.test(n)):capabilities.interaction.motions;
     if(list.length){fallback=list[(Math.max(-1,list.indexOf(lastMotion))+1)%list.length];void motion(fallback).catch(notice);}
    }
    report('hit',{areas:names,action:name?hitAction(name):fallback,message:name?'触发 '+name:fallback?'通用触摸预览：'+fallback+'（素材未提供部位规则）':names.length?'区域有定义，但没有同名动作；可用动作菜单选择。':'未命中互动区域'});
   }
   pointer=null;gesture=null;activeDrags.clear();if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  };
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',()=>{pointer=null;gesture=null;activeDrags.clear();});
  canvas.addEventListener('wheel',e=>{if(!interactive||!e.ctrlKey)return;e.preventDefault();view.scale=Math.max(.1,Math.min(8,view.scale*Math.exp(-e.deltaY*.001)));resize();report('view',{view});},{passive:false});
 }

 async function anchorGeometry(endPose=false,attachments=false){
  if(model||disposed)return null;
  const {subjectBounds,transformBounds}=await import('./composition.js');
  const layers=engine42?.layers||root.children,declared=sourceScene?.layers?.findIndex(l=>l.role==='primary'),named=entry.models.findIndex(m=>m.legacy?.name===entry.legacy?.name&&entry.legacy?.name);
  const index=declared>=0?declared:named>=0?named:layers.length-1,l=layers[index],track=l.state?.getCurrent?.(0);if(!l.skeleton)return null;
  const centers=attachments?(await import('./anchor-geometry.js')).attachmentCenters:null,saved=track?.trackTime;
  const draw=()=>{if(engine42)engine42.draw(0);else{l.update(0);app.render();}};
  try{
   if(endPose&&track){track.trackTime=Math.max(0,track.animation.duration-1/60);draw();}
   // Fade-out alpha must not erase the ending pose's anatomical reference.
   const alphas=l.skeleton.slots.map(s=>s.color.a);if(endPose)l.skeleton.slots.forEach(s=>s.color.a=1);
   let boxes;try{boxes=attachments?centers(l.skeleton):[subjectBounds(l.skeleton,{},true)].filter(b=>b?.width&&b.height);}finally{l.skeleton.slots.forEach((s,i)=>s.color.a=alphas[i]);}
   const w=innerWidth,h=innerHeight,project=raw=>{
    const up=engine42?raw:{...raw,y:-raw.y-raw.height};if(endPose)return up;
    if(sourcePlacement){const t=sourceLayout(sourceScene.layers[index],{width:w,height:h,referenceHeight:sourceScene.viewport.referenceHeight},l.skinSourceBounds),b=transformBounds(up,t);return{x:b.x,y:h-b.y-b.height,width:b.width,height:b.height,key:raw.key};}
    if(!engine42){const b=transformBounds(raw,{scale:l.scale.x,x:l.x,y:l.y,angle:l.angle});return{x:root.x+b.x*root.scale.x,y:root.y+b.y*root.scale.y,width:b.width*root.scale.x,height:b.height*root.scale.y,key:raw.key};}
    const b=transformBounds(raw,l.transform||{}),cover=entry.legacy?fillScene:preview,scale=(entry.legacy&&cover?Math.max(w/fit.width,h/fit.height):Math.min(w/fit.width,h/fit.height))*(cover?1:.97)*view.scale;
    return{x:w/2+(b.x-fit.x-fit.width/2)*scale+w*view.x,y:h/2-(b.y+b.height-fit.y-fit.height/2)*scale+h*view.y,width:b.width*scale,height:b.height*scale,key:raw.key};
   };
   if(attachments)return{points:boxes.map(project),viewport:{width:w,height:h}};
   return boxes.length?{...project(boxes[0]),viewport:{width:w,height:h}}:null;
  }finally{if(endPose&&track){track.trackTime=saved;draw();}}
 }
 const subjectAnchor=endPose=>anchorGeometry(endPose),attachmentAnchors=endPose=>anchorGeometry(endPose,true);

 async function start(){
  setPhase('loading');
  // Independent previews read only their selected skin's detail file.
  try{const selected=window.frameElement?.__nonameSkinEntry;if(selected?.id===query.get('id'))entry=selected;}catch{}
  if(entry?.detail)entry=await json(entry.detail);
  else if(entry)entry=structuredClone(entry);
  else entry=await json('entries/'+query.get('id')+'.json');
  checkAlive();
  if(!entry)throw new Error('皮肤不存在');
  if(entry.scene?.protocol==='noname-source-scene/1'){
   sourceScene=entry.scene;sourcePlacement=sourceScene.viewport.policy!=='protected-idle-artwork';
   const nativeSource=entry.models?.every(m=>/^3\.6\./.test(m.version||''));
   if(sourceScene.sourceFamily!=='decade-dynamicSkin'||sourceScene.layers.length!==entry.models?.length||(!nativeSource&&!entry.models.every(m=>/^4\.0\./.test(m.version||'')||(m.skeleton.endsWith('.json')&&/^3\.8\./.test(m.version||'')))))throw Error('未经支持的源场景类别');
   const complete=sourceScene.viewport.policy==='complete-artwork';
   if(nativeSource&&complete)throw Error('原生3.6完整场景相机尚未验证');
   if(complete?(sourceScene.layers.length!==1||sourceScene.provenance.placementOrigin!=='20260919-supplement'):!(sourceScene.viewport.referenceHeight>0)&&!(effectMode&&sourceScene.viewport.policy==='source-effect-screen'))throw Error('缺少已声明的场景呈现约定');
   if(sourceScene.layers.some(l=>l.display.clip||l.display.clipSlots.length))throw Error('此候选类别尚未验证外部裁剪');
   const layout=await import('./source-scene.js');sourceLayout=complete?layout.layoutCompleteArtwork:layout.layoutDecadeLayer;
   if(sourceScene.actionContract){sourceActions=await import('./source-actions.js');if(effectHost)resolveScreenAction=(await import('./effect-layout.js')).screenAction;}
   entry.type=nativeSource?'spine36':'spine';
  }
  if(entry.actionScene&&effectHost){screenActions=await import('./source-actions.js');resolveScreenAction=(await import('./effect-layout.js')).screenAction;}
  const {idleAnimation}=await import('./composition.js');selectIdleAnimation=idleAnimation;
  const declaredBackground=entry.legacy?.background;
  if(typeof declaredBackground==='string'&&/\.(?:png|jpe?g|webp)$/i.test(declaredBackground)&&!declaredBackground.split(/[\\/]/).includes('..')){
    const path='assets/dynamic/'+declaredBackground;
    try{const image=new Image();image.src=url(path);await image.decode();backgroundImage=image;entry.staticBackground=path;}catch(error){notice(error);}
  }
  fillScene=!!entry.legacy;
  if(entry.type==='spine36'&&entry.models.some(m=>!/^3\.[67]\./.test(m.version||'')))entry.type='spine';
  await Promise.all([loadRuntime(entry.type),entry.voiceFile?json(entry.voiceFile).then(data=>{voices=data;}):null]);
  if(disposed)return;
  if(entry.type==='spine42'||entry.type==='spine36'){
   const engine=await (entry.type==='spine36'?createSpine36:createSpine42)(entry,url,view,{signal:lifetime.signal});
   if(disposed){engine.destroy();return;}engine42=engine;fit=engine42.fit;entry.motions=engine42.motions;
  }else{
   app=new PIXI.Application({width:Math.max(1,innerWidth),height:Math.max(1,innerHeight),backgroundAlpha:0,antialias:true,resolution:Math.min(devicePixelRatio||1,1.5),autoDensity:true,preserveDrawingBuffer:true,powerPreference:'low-power',autoStart:false});app.ticker.maxFPS=30;document.body.prepend(app.view);root=new PIXI.Container();app.stage.addChild(root);
   if(entry.type==='live2d'){
    PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);
    const {loadLive2DScoped}=await import('./live2d-assets.js');
    model=await loadLive2DScoped(PIXI,url(entry.model),{autoUpdate:false,autoInteract:false,motionPreload:'NONE',idleMotionGroup:entry.idle},{signal:lifetime.signal});
    if(disposed){model.destroy({texture:true,baseTexture:true});return;}
    root.addChild(model);fit={x:0,y:0,width:model.width,height:model.height};repairHits();
    app.ticker.add(()=>{if(!disposed)model.update(app.ticker.deltaMS);});
    const core=model.internalModel.coreModel,getOpacity=core.getDrawableOpacity.bind(core);
    core.getDrawableOpacity=i=>hiddenLayers.has(String(i))?0:getOpacity(i);
    model.internalModel.on('beforeModelUpdate',()=>{
     if(analyser&&audio&&!audio.paused){if(audioSamples?.length!==analyser.fftSize)audioSamples=new Uint8Array(analyser.fftSize);analyser.getByteTimeDomainData(audioSamples);let sum=0;for(const n of audioSamples)sum+=((n-128)/128)**2;lip=Math.min(1,Math.sqrt(sum/audioSamples.length)*5);}else lip=0;
     for(const id of model.internalModel.settings.getLipSyncParameters?.()||[])if(lip>0)core.setParameterValueById(id,lip);
     for(const[id,value]of overrides)core.setParameterValueById(id,value);
    });
    const manager=model.internalModel.motionManager;
    manager.on('motionStart',name=>{lastMotion=name;report('motion',{motion:name});});
    const create=manager.createMotion.bind(manager);manager.createMotion=function(data,group,definition){motions.set(group,data);return create(data,group,definition);};
    if(entry.idle)await motion(entry.idle,false);
   }else{
    for(let i=0;i<entry.models.length;i++){const layer=await loadSpine(entry.models[i],i);if(disposed){layer.destroy({children:true,texture:true,baseTexture:true});return;}root.addChild(layer);}
    if(sourceActions){
     externalRoot=new PIXI.Container();app.stage.addChild(externalRoot);
     const {createExternalActionController}=await import('./source-external-actions.js');
     externalActions=createExternalActionController({setPrimaryHidden:hidden=>{root.children[sourceScene.layers.findIndex(l=>l.role==='primary')].renderable=!hidden;},load:action=>{
      const key=JSON.stringify([action.model.skeleton,action.model.atlas,action.model.skin]);
      if(!externalLoads.has(key))externalLoads.set(key,loadSpine(action.model,-1,action.actionLayer).then(layer=>{if(disposed){layer.destroy({children:true,texture:true,baseTexture:true});throw new DOMException('播放器已销毁','AbortError');}externalLayers.push(layer);externalRoot.addChild(layer);return layer;}).catch(error=>{externalLoads.delete(key);throw error;}));
      return externalLoads.get(key);
     }});
    }
    const b=root.getLocalBounds();fit={x:b.x,y:b.y,width:b.width,height:b.height};entry.motions=[...new Set(root.children.flatMap(s=>s.skinAnimations))];
    app.ticker.add(()=>{if(!disposed){[...root.children,...externalLayers.filter(l=>l.visible)].forEach(s=>s.update(Math.min(.05,app.ticker.deltaMS/1000)));if(sourceScene?.viewport.policy==='complete-artwork'&&cameraAction!==root.children[0].state?.getCurrent(0)?.animation?.name)resize();}});
   }
  }
  checkAlive();setPhase('decoded');
  if(sourceActions)entry.motions=[...new Set([...entry.motions,...sourceScene.actionContract.records.filter(a=>a.status==='candidate').map(a=>a.command)])];
  if(sourcePlacement){
   fit={x:0,y:0,width:innerWidth,height:innerHeight};presentation={content:fit,focus:fit,sourceContract:sourceScene.protocol};resize();app?.render();status.textContent='';
  }else{
  const {compositionFor,avatarLayerTransform,paintingBounds,sceneFocus,subjectBounds,portraitClipBounds,inferredAvatarZoom,cameraSubjectX}=await import('./composition.js');
  if(!engine42&&entry.legacy?.beijing&&root.children.length>1){
   // PIXI is Y-down; composition metadata and the native Spine adapter are
   // Y-up. Convert before computing a shared layer calibration.
   const raw=root.children.map(child=>{const b=child.getLocalBounds();return{x:b.x,y:-b.y-b.height,width:b.width,height:b.height};});
   root.children.forEach((child,i)=>{
    const t=avatarLayerTransform(entry,i,raw[i],raw[0]);if(!t)return;
    child.scale.set(t.scale??1);child.position.set(t.x||0,-(t.y||0));child.angle=-(t.angle||0);
   });
   const b=root.getLocalBounds();fit={x:b.x,y:b.y,width:b.width,height:b.height};
  }
  if(!(fit.width>0&&fit.height>0))throw new Error('无可见模型边界');
  // Sample the actual transparent artwork once, rather than fitting the exported canvas.
  // A small offscreen render keeps this independent of the preview's current dimensions.
  let sampledPainting=false;
  if(!engine42){
   const size=384,scale=Math.min(size/fit.width,size/fit.height)*.94;
   root.scale.set(scale);root.position.set(size/2-(fit.x+fit.width/2)*scale,size/2-(fit.y+fit.height/2)*scale);
   const texture=PIXI.RenderTexture.create({width:size,height:size,resolution:1});
   try{
    app.renderer.render(root,{renderTexture:texture,clear:true});
    const pixels=app.renderer.plugins.extract.pixels(texture);
    if(entry.legacy&&!entry.legacy.beijing&&!backgroundImage&&root.children.length===1&&!SkinFraming.isOpaqueScene(pixels,size,size))fillScene=false;
    // A single transparent character is not a background scene. Its opaque
    // clothing must never become the camera's crop rectangle.
    let b=SkinFraming.visibleBounds(pixels,size,size);
    if(entry.legacy&&root.children.length>1&&entry.legacy.beijing){
     const visible=root.children.map(child=>child.visible);
     root.children.forEach((child,i)=>child.visible=i===0);
     try{
      app.renderer.render(root,{renderTexture:texture,clear:true});
      const background=app.renderer.plugins.extract.pixels(texture);
      const foreground=root.children.at(-1),subject=subjectBounds(foreground.skeleton,{scale:foreground.scale.x,angle:foreground.angle,x:foreground.x,y:foreground.y});
      const anchor=subject&&{x:((subject.x+subject.width/2)*scale+root.x)/size,y:((subject.y+subject.height/2)*scale+root.y)/size};
      let painting=SkinFraming.sceneBounds(background,size,size,false,true,anchor);
      if(!painting&&!entry.models.at(-1).layerCoordinateMismatch&&!subjectBounds(foreground.skeleton,{scale:foreground.scale.x,angle:foreground.angle,x:foreground.x,y:foreground.y},true)?.width){
        const t={scale:foreground.scale.x,x:foreground.x,y:foreground.y,angle:foreground.angle},unverified=inferredAvatarZoom(entry,t);
        if(unverified){foreground.scale.set(1);foreground.position.set(0,0);foreground.angle=0;}
        root.children.forEach(child=>child.visible=child===foreground);
        app.renderer.render(root,{renderTexture:texture,clear:true});
        painting=SkinFraming.recoverSceneBounds(background,app.renderer.plugins.extract.pixels(texture),size,size);
        if(!painting||!unverified){foreground.scale.set(t.scale);foreground.position.set(t.x,t.y);foreground.angle=t.angle;}
      }
      sampledPainting=!!painting;
      b=painting||SkinFraming.visibleBounds(background,size,size)||b;
     }finally{root.children.forEach((child,i)=>child.visible=visible[i]);}
    }
    if(b)fit={x:(b.x*size-root.x)/scale,y:(b.y*size-root.y)/scale,width:b.width*size/scale,height:b.height*size/scale};
   }finally{texture.destroy(true);}
  }
  if(!engine42&&!sampledPainting&&entry.legacy?.beijing&&root.children.length>1){
   const subject=root.children[1].getLocalBounds(),scale=root.children[1].scale;
   const painting=paintingBounds(root.children[0].skeleton,{x:subject.x*scale.x,width:subject.width*scale.x});
   if(painting&&painting.height>=fit.height*.65&&painting.height<=fit.height*1.1)fit=painting;
  }
  const foreground=engine42?.layers.at(-1)||root?.children.at(-1);
  if(engine42?.transparentFigure)fillScene=false;
  const authoredClip=portraitClipBounds(entry,foreground?.skeleton);
  if(authoredClip)fit=authoredClip;
  const subjectX=entry.legacy?cameraSubjectX(entry,subjectBounds(foreground?.skeleton,engine42?foreground?.transform:{scale:foreground?.scale?.x,angle:foreground?.angle,x:foreground?.x,y:foreground?.y})):undefined;
  fit=sceneFocus(entry,fit,innerWidth/innerHeight,subjectX);
  if(entry.legacy?.beijing&&!Number.isFinite(subjectX)){
    const compact=subjectBounds(foreground?.skeleton,engine42?foreground?.transform:{scale:foreground?.scale?.x,angle:foreground?.angle,x:foreground?.x,y:foreground?.y},true);
    const width=Math.min(fit.width,fit.height*innerWidth/innerHeight),left=fit.x+fit.width/2-width/2;
    // Do not recenter existing readable portraits. Use the additional naming
    // convention only when it proves a face would be outside the old camera.
    if(compact?.width&&(compact.x<left||compact.x+compact.width>left+width))fit=sceneFocus(entry,fit,innerWidth/innerHeight,compact.x+compact.width/2);
  }
  presentation=SkinFraming.compose(entry,fit,compositionFor(entry));
  // In-game portraits retain their fixed geometry. Subject framing is for the large preview.
  fit=preview||entry.legacy?presentation.focus:presentation.content;
  if(engine42)engine42.setFit(fit,entry.legacy?fillScene:preview);
  resize();app?.render();status.textContent='';
  if(entry.legacy?.beijing){
   fit=SkinFraming.trimPortraitEdges(engine42?.canvas||app.view,fit,innerWidth/innerHeight,!engine42);
   presentation.focus=fit;
   if(engine42)engine42.setFit(fit,true);resize();app?.render();
  }
  }

  if(entry.legacy?.beijing&&!sourcePlacement&&entry.models.every(m=>/^(?:3\.6|3\.8|4\.0)\./.test(m.version||''))&&(engine42?.layers||root.children).every(l=>l.skeleton&&l.state?.getCurrent)){
   const sharedCoordinates=!engine42&&entry.models.every(m=>/^4\.0\./.test(m.version||''))&&(await import('./scene-coordinates.js')).sharedSceneCoordinates(root.children[0].skeleton,root.children.at(-1).skeleton);
   const sharedIdentity=sharedCoordinates&&Math.abs(sharedCoordinates.transform.scale-1)<1e-6&&Math.hypot(sharedCoordinates.transform.x,sharedCoordinates.transform.y)<.001;
   const sceneCoordinates=entry.models.at(-1).sceneCoordinates||(sharedIdentity&&sharedCoordinates);
   if(sceneCoordinates)presentation.sceneCoordinates=sceneCoordinates;
   const {idleGeometryEnvelope,anonymousSubject,unionBounds,opaqueCamera,flatBackdropNames,protectSubjectCamera}=await import('./idle-framing.js');
   const {subjectBounds,subjectHeadBounds,transformBounds}=await import('./composition.js');
   protectIdleCamera=protectSubjectCamera;
   const primary=engine42?.layers.at(-1)||root.children.at(-1),transform=engine42?primary.transform||{}:{scale:primary.scale.x,x:primary.x,y:primary.y,angle:primary.angle};
   const headEnvelope=idleGeometryEnvelope(primary,24,s=>subjectHeadBounds(s));
   const face=headEnvelope?transformBounds(headEnvelope,transform):subjectBounds(primary.skeleton,transform,true);
   if(face?.width){
    const camera=protectSubjectCamera(fit,face,innerWidth/innerHeight);
    if(camera){fit=camera;presentation.focus=fit;presentation.cameraGuard={reason:'idle-head-envelope',policy:'subject-protected',bounds:face};engine42?.setFit(fit,fillScene);resize();app?.render();}
    presentation.protectedSubject=face;
   }
   if(!face?.width&&anonymousSubject(primary.skeleton)&&(!sceneCoordinates||!engine42)){
    const {sourcePortraitLayers}=await import('./source-portrait.js');
    const authoredLayers=!sceneCoordinates&&!engine42&&sourcePortraitLayers(entry);
    if(authoredLayers){
     sourceScene={layers:authoredLayers,viewport:{policy:'source-avatar',referenceHeight:180}};
     sourceLayout=(await import('./source-scene.js')).layoutDecadeLayer;sourcePlacement=true;
     fit={x:0,y:0,width:innerWidth,height:innerHeight};fillScene=false;
     presentation={content:fit,focus:fit,nativePortrait:true,cameraGuard:{reason:'authored-anonymous-layer-placement',policy:'source-avatar',referenceHeight:180}};
     resize();app?.render();
    }else{
    const geometry=idleGeometryEnvelope(primary),body=geometry&&transformBounds(geometry,transform);
    if(body&&(body.y<fit.y||body.y+body.height>fit.y+fit.height)){
     fit=unionBounds(fit,body);fillScene=false;presentation.focus=fit;presentation.cameraGuard={reason:'anonymous-primary-outside-background',policy:'contain',bounds:body};presentation.previewAspect=fit.width/fit.height;
     engine42?.setFit(fit,false);resize();app?.render();
     if(sceneCoordinates&&!engine42){
      // Registered anonymous rigs can split the room itself across both layers.
      // Recover its composed painting, protecting foreground coverage, instead
      // of treating a narrow background-only fragment as the entire camera.
      const sample=document.createElement('canvas');sample.width=240;sample.height=Math.round(240*innerHeight/innerWidth);const ctx=sample.getContext('2d',{willReadFrequently:true});
      const pixels=()=>{ctx.clearRect(0,0,sample.width,sample.height);ctx.drawImage(app.view,0,0,sample.width,sample.height);return ctx.getImageData(0,0,sample.width,sample.height).data;};
      const composed=pixels(),visibility=root.children.map(l=>l.visible);let crop;
      try{root.children.forEach(l=>l.visible=l===primary);app.render();crop=SkinFraming.recoverSceneBounds(composed,pixels(),sample.width,sample.height);}finally{root.children.forEach((l,i)=>l.visible=visibility[i]);app.render();}
      if(crop){const scale=Math.min(innerWidth/fit.width,innerHeight/fit.height)*.97,vw=innerWidth/scale,vh=innerHeight/scale;
       fit={x:fit.x+fit.width/2-vw/2+crop.x*vw,y:fit.y+fit.height/2-vh/2+crop.y*vh,width:crop.width*vw,height:crop.height*vh};fillScene=true;presentation.focus=fit;presentation.previewAspect=fit.width/fit.height;presentation.cameraGuard={reason:'registered-composed-painting',policy:'foreground-coverage-protected',crop};resize();app.render();
      }
     }
    }
    }
   }else if(face?.width){
    const background=engine42?.layers[0]||root.children[0],meta=engine42?background.meta:entry.models[0],flat=meta.legacy?flatBackdropNames(background.skeleton):[],savedHidden=meta.legacy?.hideSlots;
    if(flat.length){meta.legacy.hideSlots=[...(Array.isArray(savedHidden)?savedHidden:savedHidden?[savedHidden]:[]),...flat];if(engine42)engine42.draw(0);else{background.update(0);app.render();}}
    const source=engine42?.canvas||app.view,sample=document.createElement('canvas');sample.width=240;sample.height=Math.round(240*innerHeight/innerWidth);const ctx=sample.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0,sample.width,sample.height);
    const scale=Math.max(innerWidth/fit.width,innerHeight/fit.height),vw=innerWidth/scale,vh=innerHeight/scale,cx=fit.x+fit.width/2,cy=fit.y+fit.height/2;
    const protectedFace={x:(face.x-cx+vw/2)/vw*sample.width,y:(engine42?cy+vh/2-face.y-face.height:face.y-cy+vh/2)/vh*sample.height,width:face.width/vw*sample.width,height:face.height/vh*sample.height};
    if(flat.length){meta.legacy.hideSlots=savedHidden;presentation.cameraExcludedBackplanes=flat;}
    const crop=opaqueCamera(ctx.getImageData(0,0,sample.width,sample.height).data,sample.width,sample.height,innerWidth/innerHeight,protectedFace);
    if(crop&&crop.height<.985){
     fit={x:cx-vw/2+crop.x*vw,y:engine42?cy+vh/2-(crop.y+crop.height)*vh:cy-vh/2+crop.y*vh,width:crop.width*vw,height:crop.height*vh};
     presentation.focus=fit;presentation.cameraGuard={reason:'stepped-transparent-margin',policy:'opaque-face-protected',crop};engine42?.setFit(fit,true);resize();app?.render();
    }
    if(flat.length){if(engine42)engine42.draw(0);else{background.update(0);app.render();}}
   }
  }
  if(screenActions)entry.motions=[...new Set([...entry.motions,...entry.actionScene.actionContract.records.map(a=>a.command)])];
  const {primaryCapabilities}=await import('./motion-catalog.js');
  capabilities=primaryCapabilities(entry,model?[]:(engine42?.layers||root.children).map((l,i)=>({role:sourceScene?.layers[i]?.role||(entry.legacy?.name&&entry.models[i].legacy?.name===entry.legacy.name?'primary':entry.models[i].role),effectOnly:entry.models[i].effectOnly,motions:l.names||l.skinAnimations,idle:l.idle||l.skinIdle})),!!model);
  checkAlive();setPhase('composed');
  if(backgroundImage||(preview&&!entry.legacy)){surface=SkinFraming.createPresentationCanvas(engine42?.canvas||app.view,backgroundImage);if(engine42)engine42.setOnDraw(surface.draw);else app.renderer.on('postrender',surface.draw);}
  const canvas=surface?.canvas||engine42?.canvas||app.view;pointerEvents(canvas);
  window.skinPlayer={entry,app,root,subjectAnchor,attachmentAnchors,externalLayers,fit,presentation,model,engine42,canvas,fillScene,pause(value){requestedPause=!!value;updatePlayback();},setEffectLayer(layer){if(!effectMode)return;sourceScene.layers[0]=layer;resize();if(!engine42){root.children[0].update(0);app.render();}},info,hit,motion,setParameter,setLayer,playVoice,reset,dispose,get lastMotion(){return lastMotion;},renderFrame:()=>{if(engine42)engine42.renderFrame();else app.render();surface?.draw();},capture:()=>{if(surface){surface.draw();return surface.canvas.toDataURL('image/png');}if(engine42)return engine42.capture();app.render();return app.view.toDataURL('image/png');},setView:v=>{view={...view,...v};resize();}};
  // Sampling and intermediate contain-fits are never presentation frames.
  // Reveal only after the final camera has painted the actual viewport.
  setPhase('firstFrameReady');document.documentElement.dataset.skinReady='true';setPhase('visible');
  report('ready',{bounds:fit,presentation,info:info()});
  updatePlayback();if(effectMode)queueMicrotask(()=>{if(!disposed)effectMode.ready(window.skinPlayer);});
 }
 function updatePlayback(){const paused=requestedPause||document.hidden;effectHost?.pause(paused);engine42?.pause(paused);if(app)paused?app.stop():app.start();if(paused)audio?.pause();}
 function receiveMessage(event){
  if(event.source!==parent||event.data?.channel!==channel||disposed)return;const d=event.data;
  if(d.type==='noname-skin-view'){view={...view,...d.view};resize();}
  if(d.type==='noname-skin-motion')motion(d.motion).catch(e=>report('notice',{message:e.message}));
  if(d.type==='noname-skin-event'){
   clearTimeout(eventTimer);
   if((sourceActions||screenActions)&&d.motion?.startsWith('source:')){
    let finished=false;
    const finish=reason=>{if(disposed||finished)return;finished=true;report('event-finished',{kind:d.kind,reason});};
    motion(d.motion,true,true,finish).then(played=>{if(!played)finish('not-played');}).catch(e=>{report('notice',{message:e.message});finish('error');});
    return;
   }
   motion(d.motion,true,true).then(played=>{
    if(disposed)return;
    const layers=engine42?.layers.map(l=>l.skeleton.data)||(!model?root?.children.map(s=>s.spineData):[])||[];
    const duration=model?(motions.get(d.motion)?.Meta?.Duration||1):Math.max(0,...layers.map(data=>data.animations.find(a=>a.name===d.motion)?.duration||0));
    eventTimer=setTimeout(()=>report('event-finished',{kind:d.kind}),played?Math.min(14,Math.max(.1,duration))*1000:0);
   }).catch(e=>{report('notice',{message:e.message});report('event-finished',{kind:d.kind});});
  }
  if(d.type==='noname-skin-reset')reset();
  if(d.type==='noname-skin-parameter')setParameter(d.id,d.value);
  if(d.type==='noname-skin-layer')setLayer(d.id,d.visible);
  if(d.type==='noname-skin-expression'){if(model)model.expression(d.name).catch(notice);else void motion(d.name,false).catch(notice);}
  if(d.type==='noname-skin-voice')playVoice(d.index);
  if(d.type==='noname-skin-options'){
   follow=d.follow??follow;sound=d.sound??sound;loopAction=d.loop??loopAction;
   if(typeof d.volume==='number'){volume=Math.max(0,Math.min(1,d.volume));if(audio)audio.volume=volume;}
   if(typeof d.interactive==='boolean'&&interactive!==d.interactive){
    interactive=d.interactive;
    if(!interactive){const canvas=surface?.canvas||engine42?.canvas||app?.view;if(pointer&&canvas?.hasPointerCapture(pointer.id))canvas.releasePointerCapture(pointer.id);pointer=null;gesture=null;activeDrags.clear();clearTimeout(returnTimer);motionRequest++;audio?.pause();lip=0;subtitle.textContent='';model?.internalModel.focusController.focus(0,0,true);if(window.skinPlayer){if(sourceScene){resetSourceMotions();resize();}else void motion(stateIdle||entry.idle,false).catch(notice);}}
   }
   if(!sound){audio?.pause();lip=0;subtitle.textContent='';}
  }
  if(d.type==='noname-skin-pause'){requestedPause=!!d.paused;updatePlayback();}
 }
 addEventListener('message',receiveMessage);
 addEventListener('resize',resize);
 function visibilityChanged(){if(!disposed)updatePlayback();}
 document.addEventListener('visibilitychange',visibilityChanged);
 function dispose(){if(disposed)return;disposed=true;effectHost?.dispose();externalActions?.dispose();if(phase!=='error')setPhase('disposed');delete document.documentElement.dataset.skinReady;lifetime.abort();for(const cancel of [...pendingLoads])cancel();clearTimeout(returnTimer);clearTimeout(subtitleTimer);clearTimeout(eventTimer);motionRequest++;audio?.pause();ctx?.close().catch(()=>{});engine42?.destroy();for(const engine of legacyLayers)engine.destroy();if(app)app.destroy(true,{children:true,texture:true,baseTexture:true});app=null;surface?.canvas.remove();removeEventListener('message',receiveMessage);removeEventListener('resize',resize);removeEventListener('error',loadingError);removeEventListener('unhandledrejection',loadingRejection);document.removeEventListener('visibilitychange',visibilityChanged);}
 function fail(error){if(disposed)return;if(effectMode)queueMicrotask(()=>effectMode.fail(error));setPhase('error');window.skinPlayerError=String(error.stack||error);status.textContent='加载失败：'+(error.message||error);report('error',{message:String(error.message||error)});dispose();}
 function loadingError(event){if(phase!=='visible')fail(event.error||Error(event.message));}
 function loadingRejection(event){if(phase!=='visible')fail(event.reason||Error('资源加载失败'));}
 addEventListener('error',loadingError);addEventListener('unhandledrejection',loadingRejection);
 addEventListener('pagehide',dispose);
 window.skinPlayerLifecycle={dispose,get phase(){return phase;},get pendingLoads(){return pendingLoads.size;}};
 window.skinPlayerError=null;start().catch(fail);
})();
