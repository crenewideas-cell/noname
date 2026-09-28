import fs from 'node:fs/promises';
const file='apps/core/noname/skin/localDynamic/bridge.js';let s=(await fs.readFile(file,'utf8')).replaceAll('\r\n','\n');
function replace(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,60));s=s.replace(a,b);}
replace('let serial=0,localLayout,localPlayer;','let serial=0,localLayout,localPlayer;const warmPreviews=[];');
replace("h.node.remove();h.portrait.classList.remove('local-dynamic-visible');", "h.node.remove();if(!h.parked)h.portrait.classList.remove('local-dynamic-visible');");
replace('hub.stopPreview=node=>{','function prunePreviews(){for(let i=warmPreviews.length-1;i>=0;i--){const h=warmPreviews[i];if(!h.node.isConnected||Date.now()-h.parkedAt>45000){warmPreviews.splice(i,1);dispose(h);}}while(warmPreviews.length>2)dispose(warmPreviews.shift());}\n  hub.stopPreview=node=>{');
replace('dispose(h);hub.previews.delete(node);',`hub.previews.delete(node);
    if(node.isConnected&&h.frame?.dataset.ready==='true'){
      h.effectHost?.stop();h.frame.contentWindow.skinPlayer.pause(true);message(h.frame,'options',{interactive:false});
      h.cleanupLayout?.();h.cleanupLayout=undefined;h.parked=true;h.parkedAt=Date.now();h.node.style.display='none';node.classList.remove('local-dynamic-visible');warmPreviews.push(h);prunePreviews();
    }else dispose(h);`);
replace("const h=createHost(own.p,own.e,node,name);hub.previews.set(node,h);",`prunePreviews();const index=warmPreviews.findIndex(h=>h.portrait===node&&h.e.id===own.e.id&&h.p===own.p);
    const h=index<0?createHost(own.p,own.e,node,name):warmPreviews.splice(index,1)[0];hub.previews.set(node,h);
    if(h.parked){h.parked=false;h.entered=false;h.lastEvent=undefined;h.node.style.display='';h.frame.contentWindow.skinPlayer.pause(false);readyHost(h,h.readyData);}`);
const a=s.indexOf("        h.releasePriority?.();h.releasePriority=undefined;hub.loadThumbnail.cancel(h.node);h.loading?.remove();"),b=s.indexOf("\n      }\n      if(event.data.type==='noname-skin-event-finished'",a);
if(a<0||b<0)throw Error('Ready handler not found');
const body=s.slice(a,b).replaceAll('event.data','data').replace('hub.loadThumbnail.publish(h.p,h.e,h.frame.contentWindow.skinPlayer);','if(!h.readyData)hub.loadThumbnail.publish(h.p,h.e,h.frame.contentWindow.skinPlayer);h.readyData=data;');
s=s.slice(0,a)+'        readyHost(h,event.data);'+s.slice(b);
const marker="  addEventListener('message',event=>{";s=s.replace(marker,'  function readyHost(h,data){\n'+body+'\n  }\n'+marker);
replace('hub.resources.prune();hub.integrate();hub.refresh();','prunePreviews();hub.resources.prune();hub.integrate();hub.refresh();');
await fs.writeFile(file+'.r10.tmp',s);await fs.rename(file+'.r10.tmp',file);
