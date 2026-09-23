import { game as host } from 'noname';
import directories from './resource-index.json' with {type:'json'};
import { createResourceAccess } from './file-access.js';
export {directories};
export const {readDirectory,checkFile}=createResourceAccess(host,directories);
// Only this extension uses the indexed fallback; the core's file API stays unchanged.
export const game=new Proxy(host,{get(target,key){return key==='getFileList'?readDirectory:Reflect.get(target,key,target);}});
