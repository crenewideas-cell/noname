// Split exports retain a static, uniformly scaled root group. Root identity
// alone is not evidence: require the same named nontrivial group and geometry
// attached below it in both rigs. This recovers units, never edits source rigs.
export function sharedSceneCoordinates(background,foreground){
 const groups=s=>s.bones.filter(b=>b.parent&&!b.parent.parent&&!/^(?:root|eff|effect|tx)(?:$|[_\d])/i.test(b.data.name)&&Math.abs(Math.abs(b.data.scaleX)-1)>.05&&Math.abs(b.data.scaleX-b.data.scaleY)<.01&&Math.abs(b.data.rotation||0)<.01);
 const animated=(s,b)=>s.data.animations.some(a=>a.timelines.some(t=>t.boneIndex===b.data.index));
 const contains=(bone,parent)=>{for(let b=bone;b;b=b.parent)if(b===parent)return true;return false;};
 const support=(s,b)=>s.slots.filter(slot=>slot.attachment?.region&&slot.data.blendMode===0&&contains(slot.bone,b)).length;
 const pairs=groups(background).flatMap(a=>groups(foreground).filter(b=>a.data.name===b.data.name&&!animated(background,a)&&!animated(foreground,b)&&support(background,a)>=3&&support(foreground,b)>=5).map(b=>({a,b})));
 if(pairs.length!==1)return null;
 const {a,b}=pairs[0],scale=a.data.scaleX/b.data.scaleX;
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
