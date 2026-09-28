import test from 'node:test';
import assert from 'node:assert/strict';
import {screenAction,screenEffectLayer,discoveredSkillAction,fitScreenEnvelope} from '../apps/core/noname/skin/localDynamic/runtime/effect-layout.js';
import {compileDecadeLayer,layoutDecadeLayer} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
import {installSourceMasks} from '../apps/core/noname/skin/localDynamic/runtime/source-masks.js';
const action={kind:'gongji',animation:'attack',actionLayer:compileDecadeLayer({name:'attack',x:[7,.3],scale:1.3,hideSlots:['cape']},'action')};
const viewport={width:1000,height:700,rect:{left:100,top:200,width:120,height:180}};
test('same-rig skill clips use an established screen contract, without inventing an attack fallback',()=>{
 const model={skeleton:'body.skel',atlas:'body.atlas'},record={status:'candidate',mode:'external',kind:'gongji',source:{name:'body',action:'GongJi'},model};
 const scene={actionContract:{records:[record]}},animations=[{name:'TeShu'},{name:'GongJi'}];
 const action=discoveredSkillAction(scene,'TeShu',model,animations);
 assert.equal(action.kind,'teshu');assert.equal(action.animation,'TeShu');assert.equal(action.actionLayer.placement.scale,1);
 assert.equal(action.model.legacy.action,'TeShu');assert.equal(record.source.action,'GongJi');
 assert.equal(discoveredSkillAction(scene,'GongJi',model,animations),null);
 assert.equal(discoveredSkillAction(scene,'Jineng',model,animations),null);
 assert.equal(discoveredSkillAction(scene,'TeShu',{...model,skeleton:'other.skel'},animations),null);
 assert.equal(discoveredSkillAction({actionContract:{records:[{...record,source:{...record.source,hideSlots:['head']}}]}},'TeShu',model,animations),null);
});
test('discovered skill camera contains the whole sampled motion at different viewport sizes',()=>{
 const b={x:-1800,y:-800,width:3600,height:2200};
 for(const [w,h] of [[1280,720],[1920,1080],[720,1280]]){
  const p=fitScreenEnvelope(b,w,h),left=p.x+b.x*p.scale,bottom=p.y+b.y*p.scale;
  assert.ok(left>=w*.039&&bottom>=h*.039);assert.ok(left+b.width*p.scale<=w*.961);assert.ok(bottom+b.height*p.scale<=h*.961);
 }
 assert.equal(fitScreenEnvelope({...b,width:0},1000,700),null);
});
test('screen camera preserves local authored scale and coordinates independently of avatar size/DPR',()=>{
 const l=screenEffectLayer(action,{...viewport,local:true});
 assert.equal(layoutDecadeLayer(l,{...viewport,dpr:2}).scale,1.3);assert.equal(l.placement.x[0],7);assert.deepEqual(l.display.hideSlots,['cape']);assert.equal(action.actionLayer.role,'action');
});
test('opponent attack uses source left/right screen anchors; preview uses source preview factor',()=>{
 assert.deepEqual(screenEffectLayer(action,viewport).placement.x,[0,.4]);
 assert.deepEqual(screenEffectLayer(action,{...viewport,rect:{...viewport.rect,left:800}}).placement.x,[0,.63]);
 assert.equal(screenEffectLayer(action,{...viewport,preview:true}).placement.scale,1.3*180*.0035);
});
test('entrance anchors at local player top / remote player center in Y-up screen pixels',()=>{
 const a={...action,kind:'chuchang'};
 assert.deepEqual(screenEffectLayer(a,{...viewport,local:true}).placement,{...action.actionLayer.placement,x:160,y:500});
 assert.equal(screenEffectLayer(a,viewport).placement.y,410);
 assert.equal(screenEffectLayer(a,viewport).placement.x,220);
});
test('explicit same-rig sprite gets independent defaults; bare clips and dodge stay in portrait',()=>{
 const a={kind:'gongji',layer:0,animation:'attack',source:{name:'rig',action:'attack'}},models=[{skeleton:'rig.json',legacy:{scale:2,speed:3,hideSlots:['face']}}];
 const screen=screenAction(a,models);assert.equal(screen.actionLayer.placement.scale,1);assert.equal(screen.model.legacy.speed,undefined);assert.deepEqual(screen.actionLayer.display.hideSlots,[]);
 assert.equal(screenAction({...a,source:'attack'},models),null);assert.equal(screenAction({...a,kind:'shan'},models),null);
});
test('masks filter timeline attachments before display construction, restore pose even on error',()=>{
 const a={name:'cape'},b={name:'face'},slot={attachment:a,deform:[5,6]},spine={skeleton:{slots:[slot]},state:{apply(){slot.attachment=a;}}};
 let hidden=['cape'],seen;
 spine.update=function(){this.state.apply();seen=slot.attachment;if(this.fail)throw Error('renderer');};
 installSourceMasks(spine,()=>hidden);spine.update();assert.equal(seen,null);assert.equal(slot.attachment,a);assert.deepEqual(slot.deform,[5,6]);
 spine.update();assert.equal(seen,null);hidden=[];spine.update();assert.equal(seen,a);
 hidden='super-cape';spine.update();assert.equal(seen,a);hidden='cape';spine.update();assert.equal(seen,null);
 hidden=['cape'];spine.fail=true;assert.throws(()=>spine.update(),/renderer/);assert.equal(slot.attachment,a);
});
