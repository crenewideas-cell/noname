(function(){
 'use strict';
 const query=new URLSearchParams(location.search),base=new URL('../',location.href),channel=query.get('channel')||'';
 const status=document.getElementById('status'),subtitle=document.getElementById('subtitle');
 let interactive=query.get('interactive')==='1';
 let app,model,entry,root,fit,engine42,disposed=false,view={scale:1,x:0,y:0},returnTimer,subtitleTimer,eventTimer,motionRequest=0;
 let voices=[],audio,ctx,analyser,lip=0,follow=true,sound=true,loopAction=false,lastMotion='',pointer=null,gesture=null,stateIdle='';
 const overrides=new Map(),hiddenLayers=new Set(),activeDrags=new Map(),motions=new Map();
 const legacyLayers=[];
 let volume=1,presentation,surface,audioSamples,requestedPause=false,backgroundImage,fillScene=false,selectIdleAnimation;
 const preview=query.get('presentation')==='preview';
 const notice=error=>report('notice',{message:String(error?.message||error)});
 const url=path=>new URL(path.split('/').map(encodeURIComponent).join('/'),base).href;
 function script(path){return new Promise((resolve,reject)=>{const node=document.createElement('script');node.async=false;node.src=path;node.onload=resolve;node.onerror=()=>reject(new Error('播放库加载失败：'+path));document.head.append(node);});}
 async function loadRuntime(type){
  const paths=type==='spine36'?['spine36.js']:type==='spine42'?['spine42.js','vendor/spine-webgl.min.js']:
   type==='live2d'?['vendor/pixi.min.js','vendor/live2dcubismcore.min.js','vendor/live2d.min.js']:['vendor/pixi.min.js','vendor/pixi-spine.js'];
  // Fetch concurrently, execute in dependency order (ordered classic scripts).
  await Promise.all(paths.map(script));
 }
 function report(type,extra={}){if(parent!==window)parent.postMessage({type:'noname-skin-'+type,channel,id:entry?.id,...extra},'*');}
 async function json(path){
  const address=url(path);
  if(!address.startsWith('file:')){const r=await fetch(address);if(!r.ok)throw new Error('读取失败 '+r.status+' '+path);return r.json();}
  return new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('GET',address);xhr.onload=()=>{try{if(xhr.status!==0&&xhr.status!==200)throw new Error('读取失败 '+xhr.status);resolve(JSON.parse(xhr.responseText));}catch(e){reject(e);}};xhr.onerror=()=>reject(new Error('本地文件读取失败：'+path));xhr.send();});
 }
 function resize(){
  if(engine42){engine42.setView(view);return;}
  if(!app||!fit||disposed)return;
  const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);if(app.screen.width!==w||app.screen.height!==h)app.renderer.resize(w,h);
  // Legacy scenes fill the native portrait frame with one uniform scale.
  // Other packs retain their complete-subject fit.
  const padding=preview&&(!entry.legacy||fillScene)?1:.97;
  const scale=(fillScene?Math.max(w/fit.width,h/fit.height):Math.min(w/fit.width,h/fit.height))*padding*view.scale;root.scale.set(scale);
  root.position.set(w/2-(fit.x+fit.width/2)*scale+w*view.x,h/2-(fit.y+fit.height/2)*scale+h*view.y);
 }
 async function loadSpine(m,index){
  if(!m.skeleton.endsWith('.json')&&/^3\.[67]\./.test(m.version||'')){
   if(!window.createSpine36)await script('spine36.js');
   const engine=await createSpine36({models:[m]},url,{scale:1,x:0,y:0});
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
   return layer;
  }
  const loader=new PIXI.Loader();
  return new Promise((resolve,reject)=>{
   loader.onError.once(e=>reject(new Error(String(e))));
   loader.add('layer'+index,url(m.skeleton),{metadata:{spineAtlasFile:url(m.atlas)}}).load((_,res)=>{
    try{
     const data=res['layer'+index].spineData;if(!data)throw new Error('Spine 骨骼解析失败：'+m.skeleton);
     const s=new PIXI.spine.Spine(data);s.autoUpdate=false;
     if(m.skin&&data.skins.some(x=>x.name===m.skin))s.skeleton.setSkinByName(m.skin);
     s.skinAnimations=data.animations.map(x=>x.name);s.skinIdle=selectIdleAnimation(m,s.skinAnimations,m.role==='BgBack'||!!(entry.legacy?.beijing&&index===0));
     if(s.skinIdle)s.state.setAnimation(0,s.skinIdle,true);s.update(1/30);
     const t=m.transform||{},scale=t.localScale||{},pos=t.anchoredPosition||{};
     s.scale.set(scale.x??1,scale.y??1);s.position.set(pos.x||0,-(pos.y||0));
     if(m.legacy){
      const c=m.legacy;
      // Composite the original artwork before fitting it to an avatar. Applying
      // separate avatar edits here shrinks backgrounds away from their subjects.
      const update=s.update.bind(s);s.update=dt=>{update(dt*(c.speed||1));for(const slot of s.skeleton.slots)if(c.hideSlots?.includes(slot.attachment?.name))slot.setAttachment(null);};
     }
     resolve(s);
    }catch(e){reject(e);}
   });
  });
 }
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
  return{motions:entry.motions||[],parameters,layers,hits,expressions,voices:voices.map((v,i)=>({index:i,label:(v.skinLabel?v.skinLabel+' · ':'')+v.label,subtitle:v.subtitle||''}))};
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
 async function motion(name,withVoice=true,automatic=false){
  if(disposed||!entry.motions.includes(name))return false;
  const request=++motionRequest;clearTimeout(returnTimer);let played=false;
  if(model){
   const manager=model.internalModel.motionManager;
   const loaded=await manager.loadMotion(name,0);
   if(disposed||!loaded||request!==motionRequest)return false;
   const idleState=/^(idle\d*|normal\w*|loop\w*|stand\w*|wait\w*)$/i.test(name);
   if(idleState){stateIdle=name;manager.groups.idle=name;}
   const looping=idleState||loopAction;
   if(typeof loaded.setIsLoop==='function')loaded.setIsLoop(looping);
   manager.stopAllMotions();
   played=await model.motion(name,0,3);
   const duration=motions.get(name)?.Meta?.Duration||loaded.getDuration?.();
   if(request!==motionRequest)return false;
   if(!looping&&played&&duration>0)returnTimer=setTimeout(()=>motion(stateIdle||entry.idle,false),Math.min(duration,300)*1000+100);
  }else if(engine42)played=engine42.motion(name);
  else for(const s of root.children){if(s.skinAnimations.includes(name)){s.state.setAnimation(0,name,name===s.skinIdle);if(name!==s.skinIdle&&s.skinIdle)s.state.addAnimation(0,s.skinIdle,true,0);played=true;}}
   if(played){lastMotion=name;report('motion',{motion:name});if(withVoice)autoVoice(name,automatic);}
  return played;
 }
 function setLayer(id,visible){
  visible?hiddenLayers.delete(String(id)):hiddenLayers.add(String(id));
  if(engine42)engine42.setLayer(Number(id),visible);else if(!model&&root.children[id])root.children[id].visible=visible;
 }
 function setParameter(id,value){if(value===null)overrides.delete(id);else overrides.set(id,Number(value));}
 function reset(){clearTimeout(returnTimer);stateIdle=entry.idle;overrides.clear();activeDrags.clear();hiddenLayers.clear();if(engine42)engine42.layers.forEach((_,i)=>engine42.setLayer(i,true));else if(!model)root.children.forEach(s=>s.visible=true);if(model)model.internalModel.focusController.focus(0,0,true);motion(entry.idle,false);view={scale:1,x:0,y:0};resize();audio?.pause();subtitle.textContent='';report('view',{view});}
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
     const list=entry.motions.filter(n=>!model?n!==entry.idle:/^(touch|tap|click)(_|$)/i.test(n));
     if(list.length){fallback=list[(Math.max(-1,list.indexOf(lastMotion))+1)%list.length];void motion(fallback).catch(notice);}
    }
    report('hit',{areas:names,action:name?hitAction(name):fallback,message:name?'触发 '+name:fallback?'通用触摸预览：'+fallback+'（素材未提供部位规则）':names.length?'区域有定义，但没有同名动作；可用动作菜单选择。':'未命中互动区域'});
   }
   pointer=null;gesture=null;activeDrags.clear();if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  };
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',()=>{pointer=null;gesture=null;activeDrags.clear();});
  canvas.addEventListener('wheel',e=>{if(!interactive||!e.ctrlKey)return;e.preventDefault();view.scale=Math.max(.1,Math.min(8,view.scale*Math.exp(-e.deltaY*.001)));resize();report('view',{view});},{passive:false});
 }
 async function start(){
  // Independent previews read only their selected skin's detail file.
  try{const selected=window.frameElement?.__nonameSkinEntry;if(selected?.id===query.get('id'))entry=selected;}catch{}
  if(entry?.detail)entry=await json(entry.detail);
  else if(entry)entry=structuredClone(entry);
  else entry=await json('entries/'+query.get('id')+'.json');
  if(!entry)throw new Error('皮肤不存在');
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
   engine42=await (entry.type==='spine36'?createSpine36:createSpine42)(entry,url,view);fit=engine42.fit;entry.motions=engine42.motions;
  }else{
   app=new PIXI.Application({width:Math.max(1,innerWidth),height:Math.max(1,innerHeight),backgroundAlpha:0,antialias:true,resolution:Math.min(devicePixelRatio||1,1.5),autoDensity:true,preserveDrawingBuffer:true,powerPreference:'low-power'});app.ticker.maxFPS=30;document.body.prepend(app.view);root=new PIXI.Container();app.stage.addChild(root);
   if(entry.type==='live2d'){
    PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);
    model=await PIXI.live2d.Live2DModel.from(url(entry.model),{autoUpdate:false,autoInteract:false,motionPreload:'NONE',idleMotionGroup:entry.idle});
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
    for(let i=0;i<entry.models.length;i++)root.addChild(await loadSpine(entry.models[i],i));
    const b=root.getLocalBounds();fit={x:b.x,y:b.y,width:b.width,height:b.height};entry.motions=[...new Set(root.children.flatMap(s=>s.skinAnimations))];
    app.ticker.add(()=>{if(!disposed)root.children.forEach(s=>s.update(Math.min(.05,app.ticker.deltaMS/1000)));});
   }
  }
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
  if(backgroundImage||(preview&&!entry.legacy)){surface=SkinFraming.createPresentationCanvas(engine42?.canvas||app.view,backgroundImage);if(engine42)engine42.setOnDraw(surface.draw);else app.renderer.on('postrender',surface.draw);}
  const canvas=surface?.canvas||engine42?.canvas||app.view;pointerEvents(canvas);
  window.skinPlayer={entry,app,root,fit,presentation,model,engine42,canvas,fillScene,info,hit,motion,setParameter,setLayer,playVoice,reset,dispose,get lastMotion(){return lastMotion;},capture:()=>{if(surface){surface.draw();return surface.canvas.toDataURL('image/png');}if(engine42)return engine42.capture();app.render();return app.view.toDataURL('image/png');},setView:v=>{view={...view,...v};resize();}};
  // Sampling and intermediate contain-fits are never presentation frames.
  // Reveal only after the final camera has painted the actual viewport.
  document.documentElement.dataset.skinReady='true';
  report('ready',{bounds:fit,presentation,info:info()});
  updatePlayback();
 }
 function updatePlayback(){const paused=requestedPause||document.hidden;engine42?.pause(paused);if(app)paused?app.stop():app.start();if(paused)audio?.pause();}
 addEventListener('message',event=>{
  if(event.source!==parent||event.data?.channel!==channel||disposed)return;const d=event.data;
  if(d.type==='noname-skin-view'){view={...view,...d.view};resize();}
  if(d.type==='noname-skin-motion')motion(d.motion).catch(e=>report('notice',{message:e.message}));
  if(d.type==='noname-skin-event'){
   clearTimeout(eventTimer);
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
    if(!interactive){const canvas=surface?.canvas||engine42?.canvas||app?.view;if(pointer&&canvas?.hasPointerCapture(pointer.id))canvas.releasePointerCapture(pointer.id);pointer=null;gesture=null;activeDrags.clear();clearTimeout(returnTimer);motionRequest++;audio?.pause();lip=0;subtitle.textContent='';model?.internalModel.focusController.focus(0,0,true);if(window.skinPlayer)void motion(stateIdle||entry.idle,false).catch(notice);}
   }
   if(!sound){audio?.pause();lip=0;subtitle.textContent='';}
  }
  if(d.type==='noname-skin-pause'){requestedPause=!!d.paused;updatePlayback();}
 });
 addEventListener('resize',resize);
 document.addEventListener('visibilitychange',()=>{if(!disposed)updatePlayback();});
 function dispose(){if(disposed)return;disposed=true;clearTimeout(returnTimer);clearTimeout(subtitleTimer);clearTimeout(eventTimer);audio?.pause();ctx?.close().catch(()=>{});engine42?.destroy();for(const engine of legacyLayers)engine.destroy();if(app)app.destroy(true,{children:true,texture:true,baseTexture:true});app=null;}
 addEventListener('pagehide',dispose);
 window.skinPlayerError=null;start().catch(e=>{window.skinPlayerError=String(e.stack||e);status.textContent='加载失败：'+e.message;report('error',{message:e.message});console.error(e);});
})();
