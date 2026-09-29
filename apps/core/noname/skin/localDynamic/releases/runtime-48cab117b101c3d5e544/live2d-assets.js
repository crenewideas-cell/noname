// One local player iframe owns one Live2D model and its complete loading scope.
// The vendor's from() hides the model until loading finishes; its default texture
// loader also outlives model destruction. Keep both under the player's lifetime.
export async function loadLive2DScoped(PIXI,source,options,{signal}){
 signal.throwIfAborted();
 const owner=new AbortController();signal=AbortSignal.any([signal,owner.signal]);
 const {Live2DModel,Live2DFactory:factory,Live2DLoader:loader}=PIXI.live2d;
 const model=new Live2DModel(options),textures=new Set(),objectURLs=new Set();
 const originalLoaders=loader.middlewares;
 let context,disposed=false;
 const alive=()=>{signal.throwIfAborted();if(disposed)throw new DOMException('Live2D 已销毁','AbortError');};
 const fetchResource=async address=>{alive();const response=await fetch(address,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)])});if(!response.ok)throw Error('Live2D 读取失败 '+response.status+' '+address);return response;};
 loader.middlewares=[async request=>{
  const address=request.settings?request.settings.resolveURL(request.url):request.url;
  const response=await fetchResource(address);
  request.result=await (request.type==='arraybuffer'?response.arrayBuffer():request.type==='json'?response.json():response.text());alive();
 }];
 function release(){
  if(disposed)return;disposed=true;
  signal.removeEventListener('abort',release);loader.middlewares=originalLoaders;
  owner.abort();
  for(const address of objectURLs)URL.revokeObjectURL(address);objectURLs.clear();
  // Vendor destroy assumes internalModel is already assigned, which is false
  // during settings/moc/texture loading. Destroy each resource exactly once.
  model.emit('destroy');model.autoUpdate=false;model.unregisterInteraction();
  const internal=model.internalModel||context?.internalModel;
  if(internal&&!internal.destroyed)internal.destroy();
  for(const texture of textures)texture.destroy(true);textures.clear();
  if(!model.destroyed)PIXI.Container.prototype.destroy.call(model,{children:true});
 }
 model.destroy=release;
 signal.addEventListener('abort',release,{once:true});
 const texture=async address=>{
  const response=await fetchResource(address),blob=await response.blob();alive();
  const objectURL=URL.createObjectURL(blob);objectURLs.add(objectURL);
  const image=new Image(),cancel=()=>{image.src='';};signal.addEventListener('abort',cancel,{once:true});
  try{image.src=objectURL;await image.decode();alive();const result=new PIXI.Texture(new PIXI.BaseTexture(image));textures.add(result);return result;}
  finally{signal.removeEventListener('abort',cancel);URL.revokeObjectURL(objectURL);objectURLs.delete(objectURL);}
 };
 const essentials=async(ctx,next)=>{
  const pending=Promise.all(ctx.settings.textures.map(file=>texture(ctx.settings.resolveURL(file))));
  // Attach rejection handling immediately while the moc is still loading.
  pending.catch(()=>{});
  await next();alive();
  model.internalModel=ctx.internalModel;model.emit('modelLoaded',ctx.internalModel);
  model.textures=await pending;alive();model.emit('textureLoaded',model.textures);model.emit('ready');
 };
 const stages=[factory.urlToJSON,factory.jsonToSettings,factory.waitUntilReady,factory.setupOptionals,essentials,factory.createInternalModel];
 context={live2dModel:model,source,options};let index=-1;
 const next=async i=>{alive();if(i<=index)throw Error('Live2D middleware repeated');index=i;if(stages[i])await stages[i](context,()=>next(i+1));alive();};
 try{await next(0);alive();model.emit('load');return model;}
 catch(error){release();throw error;}
}
