// A camera guard, not a per-skin scale table. Preserve skeleton coordinates and
// explicit layer registrations; reject inferred zoom/crops that lose a subject.
export function opaqueGeometryBounds(skeleton){
 const points=[];
 for(const slot of skeleton.slots){
  const a=slot.attachment;
  if(!a?.region||slot.data.blendMode!==0||(slot.color?.a??1)<.95||(a.color?.a??1)<.95)continue;
  const v=new Float32Array(a.worldVerticesLength||8);
  if(a.worldVerticesLength)a.computeWorldVertices(slot,0,v.length,v,0,2);
  else a.computeWorldVertices(slot.bone.matrix?slot:slot.bone,v,0,2);
  for(let i=0;i<v.length;i+=2)if(Number.isFinite(v[i])&&Number.isFinite(v[i+1]))points.push([v[i],v[i+1]]);
 }
 if(!points.length)return null;
 const x=Math.min(...points.map(p=>p[0])),y=Math.min(...points.map(p=>p[1]));
 return{x,y,width:Math.max(...points.map(p=>p[0]))-x,height:Math.max(...points.map(p=>p[1]))-y};
}
export function unionBounds(a,b){const x=Math.min(a.x,b.x),y=Math.min(a.y,b.y);return{x,y,width:Math.max(a.x+a.width,b.x+b.width)-x,height:Math.max(a.y+a.height,b.y+b.height)-y};}
export function idleGeometryEnvelope(layer,samples=24,measure=opaqueGeometryBounds){
 const track=layer.state.getCurrent(0),skeleton=layer.skeleton;
 if(!track||skeleton.slots.some(s=>s.attachment?.type===6))return null;
 const time=track.trackTime;let bounds=null;
 try{for(let i=0;i<=samples;i++){
  track.trackTime=track.animation.duration*i/samples;skeleton.setToSetupPose();layer.state.apply(skeleton);skeleton.updateWorldTransform();
  const b=measure(skeleton);if(b)bounds=bounds?unionBounds(bounds,b):b;
 }}finally{track.trackTime=time;skeleton.setToSetupPose();layer.state.apply(skeleton);skeleton.updateWorldTransform();}
 return bounds;
}
// The background's opaque rectangle is only a proposed camera. Protect a
// subject's entire idle envelope, including headwear, before accepting a crop.
export function protectSubjectCamera(fit,subject,aspect){
 if(!subject?.width||!subject?.height)return null;
 const h=Math.min(fit.height,fit.width/aspect),w=h*aspect;
 const margin=Math.max(subject.width,subject.height)*.15;
 const left=Math.min(subject.x,Math.max(fit.x,subject.x-margin)),bottom=Math.min(subject.y,Math.max(fit.y,subject.y-margin));
 const right=Math.max(subject.x+subject.width,Math.min(fit.x+fit.width,subject.x+subject.width+margin));
 const top=Math.max(subject.y+subject.height,Math.min(fit.y+fit.height,subject.y+subject.height+margin));
 const safe={x:left,y:bottom,width:right-left,height:top-bottom};
 let width=Math.max(w,safe.width,safe.height*aspect),height=width/aspect;
 let y=fit.y+fit.height/2-height/2;
 const center=subject.x+subject.width/2;
 // Portrait framing follows the principal subject, not the center of an
 // asymmetric opaque background. Merely keeping the face inside is insufficient.
 let x=center-width/2;
 x=Math.max(safe.x+safe.width-width,Math.min(safe.x,x));
 y=Math.max(safe.y+safe.height-height,Math.min(safe.y,y));
 if(Math.abs(x-(fit.x+fit.width/2-w/2))<1e-5&&Math.abs(y-(fit.y+fit.height/2-h/2))<1e-5&&Math.abs(width-w)<1e-5)return null;
 return{x,y,width,height};
}
export function anonymousSubject(skeleton){const names=skeleton.slots.map(s=>s.attachment?.name).filter(Boolean);return names.filter(n=>/^\d+(?:[_-]\d+)*$/.test(n)).length>names.length/2;}
// One-shot root motion can move a readable idle portrait out of its frame.
// Keep the authored action camera until the head actually crosses an edge.
export function actionSubjectCamera(fit,subject,aspect){
 if(!subject?.width||!subject?.height)return fit;
 const height=Math.min(fit.height,fit.width/aspect),width=height*aspect;
 const x=fit.x+fit.width/2-width/2,y=fit.y+fit.height/2-height/2;
 if(subject.x>=x&&subject.y>=y&&subject.x+subject.width<=x+width&&subject.y+subject.height<=y+height)return fit;
 const margin=Math.max(subject.width,subject.height)*.1;
 const w=Math.max(width,subject.width+margin*2,(subject.height+margin*2)*aspect),h=w/aspect;
 return {x:Math.max(subject.x+subject.width+margin-w,Math.min(x,subject.x-margin)),y:Math.max(subject.y+subject.height+margin-h,Math.min(y,subject.y-margin)),width:w,height:h};
}

// Separate exports with a verified opaque painting can fill a portrait behind
// a numeric character. Explicitly calibrated/shared scenes keep their camera.
export function independentBackdrop(entry,painting,sceneCoordinates){
 return !!painting&&!sceneCoordinates&&!entry.scene&&!!entry.legacy?.beijing&&entry.models?.length===2&&
  !Object.keys(entry.composition||{}).length&&entry.models.every(m=>/^4\.0\./.test(m.version||'')&&!m.sceneVariant&&!m.sceneCoordinates&&!m.layerRegistration&&!m.layerCoordinateMismatch&&!m.transform);
}
export function fixedPortraitCamera(fit,body,aspect){
 const y=Math.min(fit.y,body.y),height=Math.max(fit.y+fit.height,body.y+body.height)-y;
 const width=Math.max(fit.width,height*aspect);
 return {x:fit.x+fit.width/2-width/2,y,width,height};
}
export function backdropPlacement(bounds,camera,width,height){
 const scale=Math.max(width/bounds.width,height/bounds.height)/Math.max(width/camera.width,height/camera.height);
 return {scale,x:camera.x+camera.width/2-(bounds.x+bounds.width/2)*scale,y:camera.y+camera.height/2-(bounds.y+bounds.height/2)*scale};
}

export function flatBackdropNames(skeleton){
 const slot=skeleton.drawOrder.find(s=>s.attachment?.region&&s.data.blendMode===0),a=slot?.attachment,r=a?.region;
 if(!r||r.width<32||r.height<32)return[];
 const texture=r.texture||r.page?.texture,image=texture?.getImage?.()||texture?.baseTexture?.resource?.source;
 if(!image)return[];
 const canvas=document.createElement('canvas');canvas.width=r.rotate?r.height:r.width;canvas.height=r.rotate?r.width:r.height;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,r.x??r.texture?.frame.x,r.y??r.texture?.frame.y,canvas.width,canvas.height,0,0,canvas.width,canvas.height);
 const p=ctx.getImageData(0,0,canvas.width,canvas.height).data;
 // A fully uniform neutral backing plane is not painting coverage. Exclude
 // it only while measuring the camera; never remove it from the source rig.
 if(p[3]!==255||p[0]!==p[1]||p[1]!==p[2])return[];
 for(let i=4;i<p.length;i+=4)if(p[i]!==p[0]||p[i+1]!==p[1]||p[i+2]!==p[2]||p[i+3]!==255)return[];
 return[a.name];
}

// Largest wholly opaque rectangle at the requested aspect, containing the
// protected face. Unlike trimming rows, this catches a stepped background edge.
export function opaqueCamera(pixels,width,height,aspect,face){
 if(!face||!(face.width>0&&face.height>0))return null;
 const heights=new Uint16Array(width);let best=null;
 for(let y=0;y<height;y++){
  for(let x=0;x<width;x++)heights[x]=pixels[(y*width+x)*4+3]>=240?heights[x]+1:0;
  const stack=[];
  for(let x=0;x<=width;x++){
   const h=x===width?0:heights[x];let start=x;
   while(stack.length&&stack.at(-1).h>h){
    const s=stack.pop();start=s.x;const top=y-s.h+1,w=Math.min(x-s.x,s.h*aspect),hh=w/aspect;
    if(w<width*.5||hh<height*.5||w<face.width||hh<face.height)continue;
    const left=Math.max(s.x,Math.min(x-w,face.x+face.width/2-w/2));
    const yy=Math.max(top,Math.min(y+1-hh,face.y+face.height/2-hh*.35));
    if(face.x<left||face.x+face.width>left+w||face.y<yy||face.y+face.height>yy+hh)continue;
    // An opaque crop must keep the head readable, not merely inside its last
    // few rows. A background's upper rectangle is not a valid portrait camera.
    const headCenter=(face.y+face.height/2-yy)/hh;
    if(headCenter<.12||headCenter>.60)continue;
    if(!best||w*hh>best.width*best.height)best={x:left,y:yy,width:w,height:hh};
   }
   if(h&&(!stack.length||stack.at(-1).h<h))stack.push({x:start,h});
  }
 }
 return best&&{x:best.x/width,y:best.y/height,width:best.width/width,height:best.height/height};
}
