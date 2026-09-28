import {compileDecadeLayer} from './source-scene.js';
// Source protocols preserve exact resource/action identity. Protocols 1/2
// govern the primary rig; protocol 3 also binds verified external sprites and
// the original default-first rule. Unresolved branches remain explicit errors.
const kinds=['chuchang','gongji','teshu','shan'];
const actionOwners=new WeakMap();
const fields=new Set(['name','action','animation','json','version','x','y','scale','angle','speed','opacity','flipX','flipY','hideSlots','clipSlots','clip','skin']);
export function compileSourceActions(scene,{allowLayerOverrides=false,allowSourceDefault=false,externalModels={}}={}){
 const primary=scene.layers.findIndex(l=>l.role==='primary'),layer=scene.layers[primary];
 const idle=layer?.playback.declaredAction,records=[];
 for(const kind of kinds){
  const value=scene.source[kind];if(value==null)continue;
  const row={kind,command:'source:'+kind,source:structuredClone(value),status:'unsupported'};records.push(row);
  const c=typeof value==='string'?{action:value}:value;
  const reject=reason=>{row.reason=reason;};
  if(!c||Array.isArray(c)||typeof c!=='object'){reject('invalid-action-descriptor');continue;}
  if(c.name!=null&&c.name!==layer.resource.name){
   const model=externalModels[kind];
   if(!model){reject('external-model');continue;}
   const unknown=Object.keys(c).filter(k=>!fields.has(k));
   if(unknown.length){reject('additional-action-semantics:'+unknown.join(','));continue;}
   const declared=c.action??c.animation;
   const action=allowSourceDefault&&Array.isArray(declared)&&declared.length===1?declared[0]:declared;
   if(action!=null&&(typeof action!=='string'||!action)){reject('action-choice-or-default-requires-source-contract');continue;}
   let actionLayer;
   try{actionLayer=compileDecadeLayer(c,'action');}catch(error){reject('invalid-action-layer:'+error.message);continue;}
   if(actionLayer.display.clip||actionLayer.display.clipSlots.length||actionLayer.playback.speed<0){reject('external-mask-or-negative-speed');continue;}
   Object.assign(row,{status:'candidate',mode:'external',layer:primary,animation:action??null,actionSelection:action?'explicit':'source-default-first',actionLayer,model,loop:false,transition:'hide-primary-until-source-sprite-completes',placement:'independent-source-sprite',returnPolicy:'resume-continuous-primary'});continue;
  }
  const declared=c.action??c.animation;
  const action=allowSourceDefault&&Array.isArray(declared)&&declared.length===1?declared[0]:declared;
  if(typeof action!=='string'||!action){reject('action-choice-or-default-requires-source-contract');continue;}
  if((typeof idle!=='string'||!idle)&&!(allowSourceDefault&&idle==null)){reject('return-action-not-explicit');continue;}
  const unknown=Object.keys(c).filter(k=>!fields.has(k));
  if(unknown.length){reject('additional-action-semantics:'+unknown.join(','));continue;}
  const changed=Object.keys(c).filter(k=>!['name','action','animation'].includes(k)&&JSON.stringify(c[k])!==JSON.stringify(layer.source[k]));
  let actionLayer;
  if(changed.length){
   const supported=['x','y','scale','angle','speed','opacity','flipX','flipY','hideSlots'];
   if(!allowLayerOverrides||changed.some(k=>!supported.includes(k))||!['x','y','scale'].every(k=>c[k]!=null)){reject('action-layer-overrides:'+changed.join(','));continue;}
   // An action object is a separate sprite in the source EpicFX path. Only
   // complete placement declarations are admitted here; omitted placement is
   // not filled by the avatar camera or by undocumented parent inheritance.
   try{actionLayer=compileDecadeLayer({...c,name:layer.resource.name},'primary');}catch(error){reject('invalid-action-layer:'+error.message);continue;}
   if(actionLayer.playback.speed<0){reject('negative-action-speed');continue;}
  }
  Object.assign(row,{status:'candidate',layer:primary,animation:action,returnAnimation:idle??null,returnSelection:idle?'explicit':'source-default-first',loop:false,transition:'at-duration-no-mix',placement:actionLayer?'declared-action-layer':'unchanged-source-primary',...(actionLayer?{actionLayer}:{}),returnSpeed:layer.playback.speed});
 }
 return{protocol:allowSourceDefault||Object.keys(externalModels).length?'noname-source-actions/3':allowLayerOverrides?'noname-source-actions/2':'noname-source-actions/1',records,acceptance:'pending'};
}
export function sourceAction(scene,command,animations){
 if(!['noname-source-actions/1','noname-source-actions/2','noname-source-actions/3'].includes(scene?.actionContract?.protocol))return null;
 const row=scene.actionContract.records.find(r=>r.command===command);
 if(!row)return null;
 if(row.status!=='candidate')throw Error('源动作尚未支持：'+row.kind+' ('+row.reason+')');
 if(row.mode==='external')return row; // Validate against the external rig after loading it.
 const returnAnimation=row.returnAnimation??(row.returnSelection==='source-default-first'?(scene.layers[row.layer].playback.resolvedIdle??animations[0]?.name):null);
 for(const name of [row.animation,returnAnimation])if(!animations.some(a=>a.name===name))throw Error('源动作不存在：'+name);
 return {...row,returnAnimation,returnSpeed:row.returnSpeed??scene.layers[row.layer].playback.speed};
}
export function queueSourceAction(state,action,onFinished,onLayer){
 // A finite action may have the same name as idle. It still plays once and
 // returns to a fresh looping track; clip identity never determines event type.
 const owner={};actionOwners.set(state,owner);
 const setLayer=value=>{if(actionOwners.get(state)===owner)onLayer?.(value);};
 const current=state.setAnimation(0,action.animation,false);current.mixDuration=0;
 // Speed belongs to each track so a fast event never accelerates its return.
 current.timeScale=action.actionLayer?.playback.speed??action.returnSpeed??1;
 setLayer(action.actionLayer||null);
 if(onFinished||onLayer){
  let finished=false;
  const finish=reason=>{if(!finished){finished=true;onFinished?.(reason);}};
  current.listener={complete:()=>finish('completed'),interrupt:()=>{setLayer(null);finish('interrupted');},end:()=>{setLayer(null);finish('interrupted');}};
 }
 const next=state.addAnimation(0,action.returnAnimation,true,0);next.mixDuration=0;
 next.timeScale=action.returnSpeed??1;
 next.listener={start:()=>setLayer(null)};
 next.delay=current.animation.duration;
 return current;
}
