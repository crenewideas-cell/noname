// PIXI builds sprites/meshes and clipping containers inside update(), after
// AnimationState.apply(). Filtering after update is one frame too late, and an
// attachment timeline can undo it every frame. Temporarily filter the applied
// pose, preserving the skeleton's attachment/deform state for the next frame.
export function installSourceMasks(spine,getHidden){
 const apply=spine.state.apply,update=spine.update;
 let filtered=null,clipState=null;
 spine.state.apply=function(...args){
  const result=apply.apply(this,args),value=getHidden(),hidden=Array.isArray(value)?value:value?[value]:[];
  if(filtered&&hidden?.length&&spine.skeleton)for(const slot of spine.skeleton.slots){
   if(slot.attachment&&hidden.includes(slot.attachment.name)){filtered.push([slot,slot.attachment]);slot.attachment=null;}
  }
  if(clipState&&spine.skeleton?.slots&&spine.slotContainers)for(const [i,slot] of spine.skeleton.slots.entries()){
   const clip=slot.attachment?.type===6;
   if(clip){
    clipState.ends.push([slot.attachment,slot.attachment.endSlot]);
    // Clipping vertices are already in skeleton space. A previous region on
    // this slot may have left its bone transform on the PIXI container.
    spine.slotContainers[i].setTransform(0,0,1,1,0,0,0,0,0);
    if(slot.currentSprite)slot.currentSprite.visible=false;
    if(slot.currentMesh)slot.currentMesh.visible=false;
   }else if(slot.currentGraphics){
    clipState.graphics.push([slot,slot.currentGraphics]);slot.currentGraphics=null;
    if(slot.attachment?.type===0&&slot.currentSprite)slot.currentSprite.visible=true;
    if(slot.attachment?.type===2&&slot.currentMesh)slot.currentMesh.visible=true;
   }
  }
  return result;
 };
 spine.update=function(...args){
  const previous=filtered,previousClip=clipState;filtered=[];clipState={ends:[],graphics:[]};
  try{
   const result=update.apply(this,args);
   for(const [slot,graphics] of clipState.graphics)slot.currentGraphics=graphics;
   for(const [clip,end] of clipState.ends)clip.endSlot=end;
   if(spine.slotContainers&&spine.skeleton?.slots.some(s=>s.currentGraphics))rebuildClipping(spine);
   return result;
  }finally{
   for(const [slot,graphics] of clipState.graphics)slot.currentGraphics=graphics;
   for(const [clip,end] of clipState.ends)clip.endSlot=end;
   for(const [slot,attachment] of filtered)slot.attachment=attachment;filtered=previous;clipState=previousClip;
  }
 };
}

function rebuildClipping(spine){
 const slots=spine.skeleton.slots;
 // Clear the vendor's previous draw-order grouping, including children of a
 // clip whose attachment disappeared. Keep sprites, meshes and mask geometry.
 for(const c of spine.slotContainers)c.parent?.removeChild(c);
 for(const c of spine.tempClipContainers||[])if(c?.parent===spine)spine.removeChild(c);
 // Stock update assigns invisible placeholders directly into children without
 // setting parent. Remove those stale references as well, or they accumulate.
 const owned=new Set([...spine.slotContainers,...spine.tempClipContainers||[]]);
 spine.children=spine.children.filter(c=>!owned.has(c));
 for(const slot of slots){slot.clippingContainer?.removeChildren();if(slot.currentGraphics)slot.currentGraphics.visible=false;}
 let active=null;
 for(const slot of spine.skeleton.drawOrder){
  const c=spine.slotContainers[slot.data.index],attachment=slot.attachment;
  if(attachment?.type===6){
   // Spine clipStart ignores another clipping attachment until the active
   // clip ends. PIXI's stock grouping instead replaces it with the nested one.
   spine.addChild(c);
   if(!active){slot.currentGraphics.visible=true;slot.clippingContainer.renderable=true;active={container:slot.clippingContainer,end:attachment.endSlot};}
  }else{
   (active?.container||spine).addChild(c);
   if(active?.end===slot.data)active=null;
  }
 }
}
