// Keep failed optional portraits out of PIXI ImageResource's unhandled promise
// path. A stable canvas texture lets existing sprites receive the loaded image.
export function createPortraitTextures({PIXI,character,assetURL,defaultPath,readImage,url,skin=()=>null}) {
 const cache=new Map(),queue=[],urgent=[],cancelLoads=new Set(),images=new Map(),fallbacks=new Map();
 let active=0,urgentActive=0,disposed=false,paused=false;
 const resolvePath=path=>url(/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(path)?path:assetURL+path);
 function sourceFor(name,seen=new Set()) {
  if(seen.has(name))return {path:'image/character/'+name+'.jpg'};
  seen.add(name);
  const info=character(name),tags=info?.trashBin||info?.[4]||[];
  const source=info?.img||tags.find(tag=>typeof tag==='string'&&/^(img:|ext:|db:|mode:|character:)/.test(tag));
  if(source?.startsWith('db:'))return {database:source.slice(3)};
  if(source?.startsWith('character:'))return sourceFor(source.slice(10),seen);
  if(source?.startsWith('mode:'))return {path:'image/mode/'+source.slice(5)+'/character/'+name+'.jpg'};
  if(source)return {path:source.replace(/^img:/,'').replace(/^ext:/,'extension/')};
  if(name.includes('::')){const [mode,id]=name.split('::');return {path:'image/mode/'+mode+'/character/'+id+'.jpg'};}
  return {path:'image/character/'+name+'.jpg'};
 }
 function loadImage(src) {
  if(images.has(src))return images.get(src);
  const task=new Promise(resolve=>{
   const image=new Image();let finished=false;
   const finish=value=>{if(finished)return;finished=true;clearTimeout(timer);cancelLoads.delete(cancel);image.onload=image.onerror=null;if(!value)image.removeAttribute('src');resolve(value);};
   const cancel=()=>finish(null),timer=setTimeout(cancel,15000);cancelLoads.add(cancel);
   image.crossOrigin='anonymous';
   image.onload=()=>finish(image.naturalWidth&&image.naturalHeight?image:null);
   image.onerror=cancel;
   image.src=src;
  });
  // Share in-flight requests only; retaining every decoded gallery original
  // alongside its canvas would keep a second full collection in memory.
  images.set(src,task);task.then(()=>images.delete(src));return task;
 }
 function fallbackFor(name){const info=character(name);return (info?.sex||info?.[0])==='female'?'female':'male';}
 function draw({canvas,texture},image){
  // Crop to the actual opening's aspect ratio; never stretch the source art.
  const scale=Math.max(canvas.width/image.naturalWidth,canvas.height/image.naturalHeight);
  const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
  const context=canvas.getContext('2d');context.clearRect(0,0,canvas.width,canvas.height);
  context.drawImage(image,(canvas.width-width)/2,(canvas.height-height)/2,width,height);
  texture.baseTexture.update();
 }
 async function paint(entry) {
  const {name,canvas,texture}=entry,version=entry.version=(entry.version||0)+1;
  const source=sourceFor(name),sex=fallbackFor(name);
  const fallback=resolvePath(defaultPath+sex+'.jpg');
  let src;
  if(source.database){
   try{src=await readImage(source.database);}catch(error){console.warn('手杀标准UI：读取武将头像失败',name,error);}
  }else src=resolvePath(source.path);
  if(disposed)return;
  const selected=skin(name);
  let image=selected?await loadImage(resolvePath(selected)):null;
  if(disposed||entry.version!==version)return;
  if(!image)image=typeof src==='string'?await loadImage(src):null;
  if(disposed||entry.version!==version)return;
  if(!image){
   console.warn('手杀标准UI：武将头像不可用，使用默认头像',name,src||source.database);
   image=fallbacks.get(sex)||(src!==fallback?await loadImage(fallback):null);
  }
  if(disposed||entry.version!==version||!image)return;
  // Keep frame dimensions fixed: sprites already sized their placeholder.
  // Resizing the texture after loading would unexpectedly enlarge every card.
  draw({canvas,texture},image);
 }
 function start(entry,priority){
  if(priority)urgentActive++;else active++;
  void paint(entry).catch(error=>console.warn('手杀标准UI：头像载入失败',entry.name,error)).finally(()=>{
   if(priority)urgentActive--;else active--;pump();
  });
 }
 function pump(){
  // Match portraits have their own slots, so the full gallery cannot starve them.
  while(!disposed&&urgentActive<4&&urgent.length)start(urgent.shift(),true);
  while(!disposed&&!paused&&active<2&&queue.length)start(queue.shift(),false);
 }
 return {
  refresh(){for(const entry of cache.values()){entry.version=(entry.version||0)+1;if(!queue.includes(entry)&&!urgent.includes(entry))queue.push(entry);}pump();},
  pause(){paused=true;queue.length=0;},
  async prepare(){
   await Promise.all(['male','female'].map(async sex=>{const image=await loadImage(resolvePath(defaultPath+sex+'.jpg'));if(!disposed&&image)fallbacks.set(sex,image);}));
  },
  get(name,{width=135,height=224,priority=false}={}){
   const key=name+':'+width+'x'+height;
   if(cache.has(key)){
    const entry=cache.get(key),index=queue.indexOf(entry);
    if(priority&&index!==-1){queue.splice(index,1);urgent.push(entry);pump();}
    return entry.texture;
   }
   if(disposed)return PIXI.Texture.EMPTY;
   const canvas=document.createElement('canvas');canvas.width=width*2;canvas.height=height*2;
   const context=canvas.getContext('2d');context.fillStyle='#302b23';context.fillRect(0,0,canvas.width,canvas.height);
   // Only canvas resources reach Texture.from; no implicit image promise exists.
   const texture=PIXI.Texture.from(canvas),entry={name,canvas,texture};
   const fallback=fallbacks.get(fallbackFor(name));if(fallback)draw(entry,fallback);
   cache.set(key,entry);(priority?urgent:queue).push(entry);pump();return texture;
  },
  dispose(){disposed=true;queue.length=urgent.length=0;for(const cancel of [...cancelLoads])cancel();for(const {texture} of cache.values())texture.destroy(true);cache.clear();images.clear();fallbacks.clear();},
 };
}
