// Share immutable input bytes and decoded images, never skeleton state or GPU
// textures. Each player still owns and disposes its renderer independently.
export function createSkinResourceCache({fetcher=fetch,decode=decodeImage,blobBudget=24*1024*1024,imageBudget=96*1024*1024,ttl=45000,now=()=>Date.now()}={}) {
 const blobs=new Map(),images=new Map();let hits=0,misses=0;
 const abort=()=>new DOMException('皮肤资源请求已取消','AbortError');
 function prune(map,budget){
  let bytes=0;for(const [key,row] of map){if(row.value&&now()-row.used>ttl)map.delete(key);else bytes+=row.bytes||0;}
  for(const [key,row] of [...map].sort((a,b)=>a[1].used-b[1].used)){if(bytes<=budget)break;if(row.value){map.delete(key);bytes-=row.bytes;}}
 }
 function read(map,key,signal,loader,budget,size){
  if(signal?.aborted)return Promise.reject(abort());prune(map,budget);
  let row=map.get(key);if(row?.controller.signal.aborted){map.delete(key);row=null;}
  if(row)hits++;else{misses++;row={controller:new AbortController(),users:new Set(),used:now()};map.set(key,row);const current=row;
   row.promise=Promise.resolve().then(()=>loader(current.controller.signal)).then(value=>{current.value=value;current.bytes=size(value);current.used=now();prune(map,budget);return value;},error=>{if(map.get(key)===current)map.delete(key);throw error;});
  }
  row.used=now();const current=row,token={};row.users.add(token);
  return new Promise((resolve,reject)=>{let done=false;const finish=(error,value)=>{if(done)return;done=true;signal?.removeEventListener('abort',cancel);current.users.delete(token);if(!current.users.size&&!current.value){current.controller.abort();if(map.get(key)===current)map.delete(key);}error?reject(error):resolve(value);};const cancel=()=>finish(abort());signal?.addEventListener('abort',cancel,{once:true});current.promise.then(v=>finish(null,v),e=>finish(e));});
 }
 const blob=(address,{signal}={})=>read(blobs,address,signal,async signal=>{const r=await fetcher(address,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)])});if(!r.ok)throw Error('皮肤资源读取失败 '+r.status);return r.blob();},blobBudget,b=>b.size);
 return {blob,image:(address,{signal}={})=>read(images,address,signal,async signal=>decode(await blob(address,{signal}),signal),imageBudget,v=>v.width*v.height*4),prune(){prune(blobs,blobBudget);prune(images,imageBudget);},stats(){return{hits,misses,blobBytes:[...blobs.values()].reduce((n,r)=>n+(r.bytes||0),0),imageBytes:[...images.values()].reduce((n,r)=>n+(r.bytes||0),0),pending:[...blobs.values(),...images.values()].filter(r=>!r.value).length};}};
}
async function decodeImage(blob,signal){
 const url=URL.createObjectURL(blob),image=new Image();
 try{return await new Promise((resolve,reject)=>{const finish=error=>{image.onload=image.onerror=null;signal.removeEventListener('abort',cancel);error?reject(error):resolve(image);};const cancel=()=>{image.removeAttribute('src');finish(new DOMException('皮肤图像解码已取消','AbortError'));};if(signal.aborted){cancel();return;}signal.addEventListener('abort',cancel,{once:true});image.onload=()=>finish();image.onerror=()=>finish(Error('皮肤图像解码失败'));image.src=url;});}finally{URL.revokeObjectURL(url);}
}
