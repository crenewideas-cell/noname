import {dynamicRuntimeDirectory} from './runtime-release.js';

// Code is relative to this module; data is relative to the selected pack.
export function dynamicPlayerURL(packBase, options={}, moduleURL=import.meta.url) {
 const url=new URL('./releases/'+dynamicRuntimeDirectory+'/player.html',moduleURL);
 const base=new URL(packBase,moduleURL);
 if(base.origin!==url.origin||base.search||base.hash||!base.pathname.endsWith('/'))throw Error('Invalid dynamic skin asset base');
 url.searchParams.set('assetBase',base.href);
 for(const [key,value] of Object.entries(options))url.searchParams.set(key,String(value));
 return url.href;
}
export function dynamicThumbnailKey(pack,entry) {
 return 'portrait:fixed-frame-v1:240x360:ready-v1:'+pack.base+entry.id+':'+(entry.thumbnailRevision||'');
}

// Fixed portrait cameras change visible framing; older images are incompatible.
export function compatibleThumbnailKey(pack,entry){return dynamicThumbnailKey(pack,entry);}
