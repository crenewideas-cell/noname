// Split exports retain a static, uniformly scaled root group. Root identity
// alone is not evidence: require the same named nontrivial group and geometry
// attached below it in both rigs. This recovers units, never edits source rigs.
export function sharedSceneCoordinates(background,foreground){
 const neutral=t=>{const type=t.constructor.name,step=type==='RotateTimeline'?2:/^(?:Translate|Scale|Shear)Timeline$/.test(type)?3:0,expected=type==='ScaleTimeline'?1:0;
  return !!step&&t.frames?.length>=step&&t.frames[0]===0&&Array.from(t.frames).every((v,i)=>i%step===0||Math.abs(v-t.frames[i%step])<1e-6);};
 const animated=(s,b)=>s.data.animations.some(a=>a.timelines.some(t=>t.boneIndex===b.data.index&&!neutral(t)));
 const staticChain=(s,b)=>{for(let p=b;p;p=p.parent)if(animated(s,p)||Math.abs(p.data.rotation||0)>.01||Math.abs(p.data.scaleX-p.data.scaleY)>.01)return false;return true;};
 const groups=s=>s.bones.filter(b=>b.parent&&!/^(?:root|eff|effect|tx)(?:$|[_\d])/i.test(b.data.name)&&Math.abs(Math.abs(b.data.scaleX)-1)>.05&&staticChain(s,b));
 const units=b=>{let scale=1;for(let p=b;p;p=p.parent)scale*=p.data.scaleX??1;return scale;};
 const contains=(bone,parent)=>{for(let b=bone;b;b=b.parent)if(b===parent)return true;return false;};
 const support=(s,b)=>s.slots.filter(slot=>slot.attachment?.region&&slot.data.blendMode===0&&contains(slot.bone,b)).length;
 const pairs=groups(background).flatMap(a=>groups(foreground).filter(b=>a.data.name===b.data.name&&!animated(background,a)&&!animated(foreground,b)&&support(background,a)>=3&&support(foreground,b)>=5).map(b=>({a,b})));
 if(pairs.length!==1)return null;
 const {a,b}=pairs[0],scale=units(a)/units(b);
 if(!(scale>.05&&scale<20))return null;
 return {bone:a.data.name,transform:{scale,angle:0,x:a.worldX-scale*b.worldX,y:a.worldY-scale*b.worldY}};
}

export function sourceCameraAnchor(entry){
 const model=entry.models?.at(-1),v=model?.sceneVariant?.transform,c=model?.legacy;
 if(!model?.sceneCoordinates||!v||!c)return;
 const coord=(n,size)=>Array.isArray(n)?n[0]+n[1]*size:n??size/2;
 const angle=-(c.angle||0)*Math.PI/180,x=(60-coord(c.x,120))/(c.scale||1),y=(90-coord(c.y,180))/(c.scale||1);
 const ax=Math.cos(angle)*x-Math.sin(angle)*y-v.x,ay=Math.sin(angle)*x+Math.cos(angle)*y-v.y;
 const rotation=-(v.angle||0)*Math.PI/180;
 return (Math.cos(rotation)*ax-Math.sin(rotation)*ay)/v.scale;
}
