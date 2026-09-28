import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
const root='apps/core/noname/skin/localDynamic/',out='output/dynamic-remediation/20260926-r01/performance-r10';
const baseline=JSON.parse(await fs.readFile(out+'/baseline.json'));
for(const file of [root+'effect-host.js',root+'runtime/effect-layout.js']){const b=await fs.readFile(file);await fs.mkdir(path.dirname(out+'/before-files/'+file),{recursive:true});await fs.writeFile(out+'/before-files/'+file,b,{flag:'wx'});baseline.push({file,sha256:createHash('sha256').update(b).digest('hex')});}
await fs.writeFile(out+'/baseline.json',JSON.stringify(baseline,null,2));
async function edit(file,fn){const old=(await fs.readFile(file,'utf8')).replaceAll('\r\n','\n'),next=fn(old);if(old===next)throw Error('No change '+file);await fs.writeFile(file+'.r10.tmp',next);await fs.rename(file+'.r10.tmp',file);}
const replace=(s,a,b)=>{if(!s.includes(a))throw Error('Missing '+a.slice(0,70));return s.replace(a,b);};
await edit(root+'runtime/effect-layout.js',s=>{
 s=replace(s,'p.x=rect.left+rect.width*(local?.5:1);','p.x=rect.left+rect.width*(local||preview?.5:1);');
 return s+`
// Align an entrance's ending subject to the idle portrait in screen pixels.
// The source action keeps its animated travel; only the shared camera changes.
export function alignEffectSubject(layer,source,target,height){
 if(!source||!target||![source.x,source.y,source.width,source.height,target.x,target.y,target.width,target.height,height].every(Number.isFinite)||source.width<=0||target.width<=0||source.height<=0||target.height<=0)return null;
 const scale=target.width/source.width;
 if(Math.abs((source.height/source.width)/(target.height/target.width)-1)>.75)return null;
 const result=structuredClone(layer);Object.assign(result.placement,{scale,x:target.x+target.width/2-(source.x+source.width/2)*scale,y:height-target.y-target.height/2-(source.y+source.height/2)*scale,angle:0});return result;
}
`;
});
await edit(root+'runtime/player.js',s=>{
 const fn=`
 async function subjectAnchor(endPose=false){
  if(model||disposed)return null;
  const {subjectBounds,transformBounds}=await import('./composition.js');
  const layers=engine42?.layers||root.children,declared=sourceScene?.layers?.findIndex(l=>l.role==='primary'),named=entry.models.findIndex(m=>m.legacy?.name===entry.legacy?.name&&entry.legacy?.name);
  const index=declared>=0?declared:named>=0?named:layers.length-1,l=layers[index],track=l.state?.getCurrent?.(0);if(!l.skeleton)return null;
  const saved=track?.trackTime;
  const draw=()=>{if(engine42)engine42.draw(0);else{l.update(0);app.render();}};
  try{
   if(endPose&&track){track.trackTime=Math.max(0,track.animation.duration-1/60);draw();}
   const raw=subjectBounds(l.skeleton,{},true);if(!raw?.width||!raw.height)return null;
   const up=engine42?raw:{...raw,y:-raw.y-raw.height};if(endPose)return up;
   const w=innerWidth,h=innerHeight;
   if(sourcePlacement){const t=sourceLayout(sourceScene.layers[index],{width:w,height:h,referenceHeight:sourceScene.viewport.referenceHeight},l.skinSourceBounds),b=transformBounds(up,t);return{x:b.x,y:h-b.y-b.height,width:b.width,height:b.height,viewport:{width:w,height:h}};}
   if(!engine42){const b=subjectBounds(l.skeleton,{scale:l.scale.x,x:l.x,y:l.y,angle:l.angle},true);return{x:root.x+b.x*root.scale.x,y:root.y+b.y*root.scale.y,width:b.width*root.scale.x,height:b.height*root.scale.y,viewport:{width:w,height:h}};}
   const b=transformBounds(raw,l.transform||{}),cover=entry.legacy?fillScene:preview,scale=(entry.legacy&&cover?Math.max(w/fit.width,h/fit.height):Math.min(w/fit.width,h/fit.height))*(cover?1:.97)*view.scale;
   return{x:w/2+(b.x-fit.x-fit.width/2)*scale+w*view.x,y:h/2-(b.y+b.height-fit.y-fit.height/2)*scale+h*view.y,width:b.width*scale,height:b.height*scale,viewport:{width:w,height:h}};
  }finally{if(endPose&&track){track.trackTime=saved;draw();}}
 }
`;
 s=replace(s,' async function start(){',fn+'\n async function start(){');
 return replace(s,'window.skinPlayer={entry,app,root,','window.skinPlayer={entry,app,root,subjectAnchor,');
});
await edit(root+'effect-host.js',s=>{
 s=replace(s,"import {screenEffectLayer}","import {screenEffectLayer,alignEffectSubject}");
 s=replace(s,"const t=active={node,iframe,hidden,finished,resolve,reject,done:false};","const t=active={node,iframe,hidden,finished,resolve,reject,done:false};let sourceSubject,targetSubject;iframe.__nonameSkinResources=frame.__nonameSkinResources;");
 s=replace(s,"return screenEffectLayer(action,{width:w,height:h,local,preview,previewHeight:anchor.offsetHeight,rect:{left:(r.left-n.left)*w/n.width,top:(r.top-n.top)*h/n.height,width:r.width*w/n.width,height:r.height*h/n.height}});",`const result=screenEffectLayer(action,{width:w,height:h,local,preview,previewHeight:anchor.offsetHeight,rect:{left:(r.left-n.left)*w/n.width,top:(r.top-n.top)*h/n.height,width:r.width*w/n.width,height:r.height*h/n.height}});
     if(sourceSubject&&targetSubject){const f=frame.getBoundingClientRect(),target={x:(f.left-n.left+targetSubject.x*f.width/targetSubject.viewport.width)*w/n.width,y:(f.top-n.top+targetSubject.y*f.height/targetSubject.viewport.height)*h/n.height,width:targetSubject.width*f.width/targetSubject.viewport.width*w/n.width,height:targetSubject.height*f.height/targetSubject.viewport.height*h/n.height};const aligned=alignEffectSubject(result,sourceSubject,target,h);if(aligned){iframe.__nonameSkinAlignment={source:sourceSubject,target,placement:aligned.placement};return aligned;}}
     return result;`);
 s=replace(s,'     ready(p){','     async ready(p){');
 s=replace(s,"       l.state.clearTracks();l.skeleton.setToSetupPose();", "       if(preview&&action.kind==='chuchang'){[sourceSubject,targetSubject]=await Promise.all([p.subjectAnchor?.(true),frame.contentWindow.skinPlayer?.subjectAnchor?.()]);if(t.done)return;}\n       l.state.clearTracks();l.skeleton.setToSetupPose();");
 return replace(s,'p.setEffectLayer(layer());p.pause(paused);p.capture();','p.setEffectLayer(layer());p.pause(paused);p.renderFrame?.();');
});
