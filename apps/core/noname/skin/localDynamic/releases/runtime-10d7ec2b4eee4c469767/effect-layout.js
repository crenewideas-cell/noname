// EpicFX.playDynamicEffect2 uses a screen canvas, independent of the portrait's
// height/180 camera. Coordinates here are CSS pixels, with Spine's Y-up origin.
import {compileDecadeLayer} from './source-scene.js';
export function screenAction(action,models){
 if(!action||!['chuchang','gongji','teshu'].includes(action.kind))return null;
 if(action.mode==='external')return action;
 // An explicitly named sprite is independent even when it reuses the idle rig.
 // Bare clip names and dodge remain on their existing portrait contract.
 if(!action.source||typeof action.source!=='object'||!action.source.name)return null;
 return{...action,model:{...models[action.layer],legacy:structuredClone(action.source)},actionLayer:compileDecadeLayer(action.source,'action')};
}
export function screenEffectLayer(action,{width,height,rect,local=false,preview=false,previewHeight=rect.height}){
 const layer=structuredClone(action.actionLayer),p=layer.placement;
 layer.role='primary';layer.playback.declaredAction=action.animation??null;
 if(action.kind==='gongji'||action.kind==='teshu'){
  if(!local){p.x=[0,rect.left+rect.width/2<width/2?.4:.63];p.y=[0,.5];}
  if(preview)p.scale*=previewHeight*.0035;
 }else{
  p.x=rect.left+rect.width*(local?.5:1);p.y=height-rect.top-(local?0:rect.height/2);
 }
 // Only the outer portrait crop is absent. Authored internal clipping and
 // hideSlots remain on the model; do not disable all masks to make it protrude.
 p.angle=0;return layer;
}
