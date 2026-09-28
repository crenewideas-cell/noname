import fs from 'node:fs/promises';const file='apps/core/noname/skin/localDynamic/effect-host.js';let s=(await fs.readFile(file,'utf8')).replaceAll('\r\n','\n');
function replace(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,60));s=s.replace(a,b);}
replace("import {screenEffectLayer,alignEffectSubject}","import {alignAttachmentPoints} from './runtime/anchor-geometry.js';\nimport {screenEffectLayer,alignEffectSubject}");
replace('let sourceSubject,targetSubject;','let sourceSubject,targetSubject,sourcePoints,targetPoints,alignmentKey,alignedPlacement;');
const a=s.indexOf('     if(sourceSubject&&targetSubject){'),b=s.indexOf('\n     return result;',a);if(a<0||b<0)throw Error('Alignment block missing');
s=s.slice(0,a)+`     const f=frame.getBoundingClientRect(),key=[f.left,f.top,f.width,f.height,n.left,n.top,n.width,n.height,w,h].join('|');
     if(key!==alignmentKey){alignmentKey=key;alignedPlacement=undefined;
      const toScreen=(point,viewport)=>({...point,x:(f.left-n.left+point.x*f.width/viewport.width)*w/n.width,y:(f.top-n.top+point.y*f.height/viewport.height)*h/n.height,width:(point.width||0)*f.width/viewport.width*w/n.width,height:(point.height||0)*f.height/viewport.height*h/n.height});
      if(sourceSubject&&targetSubject){const target=toScreen(targetSubject,targetSubject.viewport),aligned=alignEffectSubject(result,sourceSubject,target,h);if(aligned){alignedPlacement=aligned.placement;iframe.__nonameSkinAlignment={method:'subject',source:sourceSubject,target,placement:alignedPlacement};}}
      if(!alignedPlacement&&sourcePoints&&targetPoints){const target=targetPoints.points.map(p=>toScreen(p,targetPoints.viewport)),aligned=alignAttachmentPoints(sourcePoints.points,target,h);if(aligned){const {matches,residual,...placement}=aligned;alignedPlacement=placement;iframe.__nonameSkinAlignment={method:'matching-attachments',matches,residual,placement};}}
     }
     if(alignedPlacement)Object.assign(result.placement,alignedPlacement);`+s.slice(b);
replace("if(t.done)return;}\n       l.state.clearTracks();", "if(t.done)return;if(!sourceSubject||!targetSubject){sourcePoints=await p.attachmentAnchors?.(true);targetPoints=await frame.contentWindow.skinPlayer?.attachmentAnchors?.();if(t.done)return;}}\n       l.state.clearTracks();");
await fs.writeFile(file+'.r10.tmp',s);await fs.rename(file+'.r10.tmp',file);
