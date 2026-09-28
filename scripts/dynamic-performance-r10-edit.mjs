import fs from 'node:fs/promises';
const root='apps/core/noname/skin/localDynamic/';
async function edit(file,fn){const old=(await fs.readFile(file,'utf8')).replaceAll('\r\n','\n'),next=fn(old);if(next===old)throw Error('No edit: '+file);await fs.writeFile(file+'.r10.tmp',next);await fs.rename(file+'.r10.tmp',file);}
const replace=(s,a,b)=>{if(!s.includes(a))throw Error('Missing fragment '+a.slice(0,70));return s.replace(a,b);};
await edit(root+'runtime/spine-assets.js',s=>{
 s=replace(s,'const controller = new AbortController(), textures = new Set();','const controller = new AbortController(), textures = new Set();\n  const shared = window.frameElement?.__nonameSkinResources;');
 s=replace(s,'const blob = await (await response(address)).blob();','if (shared) { const value = await shared.image(address, {signal:controller.signal}); check(); return value; }\n    const blob = await (await response(address)).blob();');
 s=replace(s,'const data = await (await response(address)).arrayBuffer(); check(); return new Uint8Array(data);','const data = shared ? await (await shared.blob(address, {signal:controller.signal})).arrayBuffer() : await (await response(address)).arrayBuffer(); check(); return new Uint8Array(data);');
 return replace(s,'const text = await (await response(address)).text(); check();','const text = shared ? await (await shared.blob(address, {signal:controller.signal})).text() : await (await response(address)).text(); check();');
});
for(const n of ['spine36.js','spine42.js'])await edit(root+'runtime/'+n,s=>{
 s=replace(s,'const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;draw(dt);raf=requestAnimationFrame(tick);','if(now-last<1000/30-1){raf=requestAnimationFrame(tick);return;}const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;draw(dt);raf=requestAnimationFrame(tick);');
 return replace(s,"capture:()=>{draw();return canvas.toDataURL('image/png');}","renderFrame:()=>draw(0),capture:()=>{draw();return canvas.toDataURL('image/png');}");
});
await edit(root+'runtime/player.js',s=>replace(s,"capture:()=>{if(surface)","renderFrame:()=>{if(engine42)engine42.renderFrame();else app.render();surface?.draw();},capture:()=>{if(surface)"));
await edit(root+'runtime-url.js',s=>{
 s=replace(s,"return 'portrait:'+dynamicRuntimeRevision+':240x360:ready-v1:'+pack.base+entry.id+':'+(entry.thumbnailRevision||'');","return 'portrait:camera-r09-v1:240x360:ready-v1:'+pack.base+entry.id+':'+(entry.thumbnailRevision||'');");
 return s+"\n// R10 changes scheduling and reuse, not the portrait camera. Preserve compatible\n// R09 thumbnails across code-only releases; bump camera-r09-v1 on visual changes.\nexport function compatibleThumbnailKey(pack,entry){return 'portrait:10d7ec2b4eee4c469767:240x360:ready-v1:'+pack.base+entry.id+':'+(entry.thumbnailRevision||'');}\n";
});
await edit(root+'bridge.js',s=>{
 s=replace(s,"import {dynamicPlayerURL}","import {createSkinResourceCache} from './resource-cache.js';\nimport {dynamicPlayerURL}");
 s=replace(s,'hub.loadThumbnail=createThumbnailLoader(lookupOwned);','hub.resources=createSkinResourceCache();\n  hub.loadThumbnail=createThumbnailLoader(lookupOwned,hub.resources);');
 s=replace(s,"bottom:12%;transform", "bottom:18%;transform");
 s=replace(s,"if(animated){\n      // Pass only selected metadata", "if(animated){\n      h.releasePriority=hub.loadThumbnail.prioritize(p,e);\n      const start=()=>{\n      if(!node.isConnected)return;\n      // Pass only selected metadata");
 s=replace(s,"f.__nonameSkinEntry=e;", "f.__nonameSkinEntry=e;f.__nonameSkinResources=hub.resources;");
 s=replace(s,"node.append(f);f.addEventListener('load',()=>updateInput(h,true));", "node.append(f);f.addEventListener('load',()=>updateInput(h,true));\n      };if(player)queueMicrotask(start);else h.startTimer=setTimeout(start,100);");
 s=replace(s,'function dispose(h){if(h){hub.loadThumbnail.cancel(h.node);','function dispose(h){if(h){clearTimeout(h.startTimer);h.releasePriority?.();hub.loadThumbnail.cancel(h.node);');
 s=replace(s,"hub.loadThumbnail.cancel(h.node);h.loading?.remove();", "h.releasePriority?.();h.releasePriority=undefined;hub.loadThumbnail.cancel(h.node);h.loading?.remove();");
 s=replace(s,"console.warn(h.p.name,h.e.id,event.data.message);", "h.releasePriority?.();h.releasePriority=undefined;console.warn(h.p.name,h.e.id,event.data.message);");
 s=replace(s,"hub.integrate();hub.refresh();},750)","hub.resources.prune();hub.integrate();hub.refresh();},750)");
 return s;
});
