// EpicFX.playDynamicEffect2 uses a screen canvas, independent of the portrait's
// height/180 camera. Coordinates here are CSS pixels, with Spine's Y-up origin.
import {compileDecadeLayer} from './source-scene.js';
// Combined character rigs often declare only GongJi in dynamicSkin, although
// the same verified rig also contains TeShu/Jineng. Those clips belong on the
// already established screen camera, not in the cropped idle portrait.
export function discoveredSkillAction(scene,name,model,animations){
 if(!/^(teshu|jineng)$/i.test(name)||!animations.some(a=>a.name===name))return null;
 const source=(scene?.actionContract?.records||[]).find(a=>a.status==='candidate'&&a.mode==='external'&&
  a.model?.skeleton===model?.skeleton&&a.model?.atlas===model?.atlas&&a.source?.name&&
  ['gongji','teshu'].includes(a.kind)&&Object.keys(a.source).every(k=>['name','action','animation','version','json'].includes(k)));
 if(!source)return null;
 const descriptor={...source.source,action:name};delete descriptor.animation;
 return {...source,kind:'teshu',command:name,animation:name,source:descriptor,cameraPolicy:'measured-screen-envelope',
  model:{...source.model,animation:name,legacy:descriptor},actionLayer:compileDecadeLayer(descriptor,'action')};
}
export function fitScreenEnvelope(bounds,width,height){
 if(!bounds||![bounds.x,bounds.y,bounds.width,bounds.height,width,height].every(Number.isFinite)||bounds.width<=0||bounds.height<=0||width<=0||height<=0)return null;
 const scale=Math.min(width/bounds.width,height/bounds.height)*.92;
 return {scale,x:width/2-(bounds.x+bounds.width/2)*scale,y:height/2-(bounds.y+bounds.height/2)*scale,angle:0};
}
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
  p.x=rect.left+rect.width*((local||preview)? .5 : 1);p.y=height-rect.top-(local?0:rect.height/2);
 }
 // Only the outer portrait crop is absent. Authored internal clipping and
 // hideSlots remain on the model; do not disable all masks to make it protrude.
 p.angle=0;return layer;
}

// Align an entrance's ending subject to the idle portrait in screen pixels.
// The source action keeps its animated travel; only the shared camera changes.
export function alignEffectSubject(layer,source,target,height){
 if(!source||!target||![source.x,source.y,source.width,source.height,target.x,target.y,target.width,target.height,height].every(Number.isFinite)||source.width<=0||target.width<=0||source.height<=0||target.height<=0)return null;
 const scale=target.width/source.width;
 if(Math.abs((source.height/source.width)/(target.height/target.width)-1)>.75)return null;
 const result=structuredClone(layer);Object.assign(result.placement,{scale,x:target.x+target.width/2-(source.x+source.width/2)*scale,y:height-target.y-target.height/2-(source.y+source.height/2)*scale,angle:0});return result;
}
