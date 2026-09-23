/** File discovery for an installed extension, with a bounded static-host fallback. */
export function createResourceAccess(host, directories, timeout=1500) {
 const keyOf=path=>String(path).replace(/\\/g,'/').replace(/\/+$/,'');
 const indexedFile=key=>!!directories[key] || !!directories[key.slice(0,key.lastIndexOf('/'))]?.files.includes(key.slice(key.lastIndexOf('/')+1));
 function bounded(run,fallback,callback) {
  let finished=false;
  const finish=value=>{if(finished)return;finished=true;clearTimeout(timer);callback(value);};
  const fail=()=>finish(fallback());
  const timer=setTimeout(fail,timeout);
  try{run(finish,fail);}catch{fail();}
 }
 return {
  checkFile(path,callback) {
   const key=keyOf(path);
   bounded((done,fail)=>{
    if(typeof host.checkFile!=='function'||typeof host.checkDir!=='function'){fail();return;}
    let pending=2,found=false;
    const accept=value=>{found ||= value===1;if(--pending===0)done(found);};
    host.checkFile(key,accept,fail);host.checkDir(key,accept,fail);
   },()=>indexedFile(key),callback);
  },
  readDirectory(path,callback,onError) {
   const key=keyOf(path);
   bounded((done,fail)=>{
    if(typeof host.getFileList!=='function'){fail();return;}
    host.getFileList(key,(folders,files)=>done({folders,files}),fail);
   },()=>directories[key],result=>{
    if(result)callback(result.folders.slice(),result.files.slice());
    else if(onError)onError(new Error(`目录不可访问：${path}`));
    else callback([],[]);
   });
  },
 };
}
