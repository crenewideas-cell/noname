// Resource queries for the bundled UI. Browsers have neither Node fs nor
// Cordova's resolveLocalFileSystemURL; shipped files are indexed locally.
export function createResourceAccess({files,localPath,url,assetURL,game}) {
 const fileSet=new Set(files),directories=new Map([['',{folders:new Set(),files:new Set()}]]);
 const probes=new Map();
 function addFile(file){
  const parts=file.split('/');
  for(let i=0;i<parts.length;i++){
   const parent=parts.slice(0,i).join('/');
   if(!directories.has(parent))directories.set(parent,{folders:new Set(),files:new Set()});
   directories.get(parent)[i===parts.length-1?'files':'folders'].add(parts[i]);
  }
 }
 files.forEach(addFile);
 const relative=path=>localPath(path)?.replace(/\/+$/,'')??null;
 function hostPath(path){
  const local=relative(path);
  if(local!==null)return 'extension/ui/手杀标准UI'+(local?'/'+local:'');
  const root=new URL(assetURL||'./',location.href),resolved=new URL(url(path),root);
  if(resolved.origin!==root.origin||!resolved.pathname.startsWith(root.pathname))return null;
  return decodeURIComponent(resolved.pathname.slice(root.pathname.length));
 }
 function known(path){const local=relative(path);return local!==null&&(fileSet.has(local)||directories.has(local));}
 async function probe(path){
  if(known(path))return true;
  const host=hostPath(path);
  if(host!==null&&typeof game.checkFile==='function'&&typeof game.checkDir==='function'){
   const check=method=>new Promise(resolve=>{try{game[method](host,value=>resolve(value===1),()=>resolve(false));}catch{resolve(false);}});
   if(await check('checkFile')||await check('checkDir'))return true;
  }
  // Missing optional bundled assets are absent, not HTML from Vite's fallback.
  if(relative(path)!==null)return false;
  try{
   const response=await fetch(url(path),{method:'HEAD',signal:AbortSignal.timeout(8000)});
   return response.ok&&!response.headers.get('content-type')?.includes('text/html');
  }catch{return false;}
 }
 return {
  known,
  check(path,callback){
   if(known(path)){callback?.(true);return;}
   const key=url(path);
   if(!probes.has(key))probes.set(key,probe(path));
   return probes.get(key).then(exists=>callback?.(exists));
  },
  list(path,callback,onerror){
   const local=relative(path),entry=local===null?null:directories.get(local);
   if(entry){callback([...entry.folders],[...entry.files]);return;}
   const host=hostPath(path);
   if(host!==null&&typeof game.getFileList==='function'){
    try{return game.getFileList(host,callback,error=>{if(onerror)onerror(error);else callback([],[]);});}
    catch(error){if(onerror)onerror(error);else callback([],[]);return;}
   }
   callback([],[]);
  },
  readText(path,callback){
   return fetch(url(path)).then(response=>{
    if(!response.ok||response.headers.get('content-type')?.includes('text/html'))throw new Error('无法读取界面资源：'+path);
    return response.text();
   }).then(text=>callback?.(true,text),()=>callback?.(false));
  },
 };
}
