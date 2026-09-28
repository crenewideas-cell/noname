import test from 'node:test';
import assert from 'node:assert/strict';
import {spine} from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';
import {compileDecadeScene} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
import {compileSourceActions,sourceAction,queueSourceAction} from '../apps/core/noname/skin/localDynamic/runtime/source-actions.js';
import {layoutDecadeLayer} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
function scene(config){const s=compileDecadeScene(config,{sourceConfigHash:'fixture'});s.actionContract=compileSourceActions(s);return s;}
test('source action scope preserves unknown branches and requires an explicit return clip',()=>{
 const s=scene({name:'actor',action:'idle',scale:.4,beijing:{name:'bg'},gongji:{name:'actor',action:'strike'},shan:'dodge',chuchang:{name:'other',action:'in'},teshu:{name:'actor',action:'special',scale:.8}});
 assert.equal(sourceAction(s,'source:gongji',[{name:'idle'},{name:'strike'}]).layer,1);
 assert.equal(s.actions.shan,'dodge');
 assert.throws(()=>sourceAction(s,'source:shan',[{name:'idle'}]),/源动作不存在/);
 assert.throws(()=>sourceAction(s,'source:chuchang',[]),/external-model/);
 assert.throws(()=>sourceAction(s,'source:teshu',[]),/action-layer-overrides:scale/);
 assert.equal(scene({name:'actor',gongji:'strike'}).actionContract.records[0].reason,'return-action-not-explicit');
 assert.equal(scene({name:'actor',action:'idle',gongji:{action:['a','b']}}).actionContract.records[0].reason,'action-choice-or-default-requires-source-contract');
 assert.equal(scene({name:'actor',action:'idle',gongji:{action:'a',delay:1}}).actionContract.records[0].reason,'additional-action-semantics:delay');
});
test('finite source action returns at duration, preserves speed zero and can be interrupted',()=>{
 const data=new spine.SkeletonData();data.animations=[new spine.Animation('idle',[],2),new spine.Animation('strike',[],1)];
 const state=new spine.AnimationState(new spine.AnimationStateData(data));state.data.defaultMix=.15;
 const skeleton=new spine.Skeleton(data);
 const step=dt=>{state.update(dt);state.apply(skeleton);};
 state.setAnimation(0,'idle',true);
 queueSourceAction(state,{animation:'strike',returnAnimation:'idle'});
 step(.99);assert.equal(state.getCurrent(0).animation.name,'strike');assert.equal(state.getCurrent(0).loop,false);
 step(0);assert.equal(state.getCurrent(0).trackTime,.99);
 step(.02);step(0);assert.equal(state.getCurrent(0).animation.name,'idle');assert.equal(state.getCurrent(0).loop,true);
 queueSourceAction(state,{animation:'strike',returnAnimation:'idle'});step(.5);
 queueSourceAction(state,{animation:'strike',returnAnimation:'idle'});assert.equal(state.getCurrent(0).trackTime,0);
 // Even when the source reuses its idle clip for an event, event playback is finite.
 queueSourceAction(state,{animation:'idle',returnAnimation:'idle'});assert.equal(state.getCurrent(0).loop,false);assert.equal(state.getCurrent(0).next.loop,true);assert.equal(state.getCurrent(0).next.delay,2);
});
test('source event completion follows animation time and reports interruption once',()=>{
 const data=new spine.SkeletonData();data.animations=[new spine.Animation('idle',[],2),new spine.Animation('strike',[],1)];
 const state=new spine.AnimationState(new spine.AnimationStateData(data)),skeleton=new spine.Skeleton(data),events=[];
 const step=dt=>{state.update(dt);state.apply(skeleton);};
 queueSourceAction(state,{animation:'strike',returnAnimation:'idle'},r=>events.push(r));
 step(0);step(.5);assert.deepEqual(events,[]);
 step(.51);step(0);assert.deepEqual(events,['completed']);
 step(3);assert.deepEqual(events,['completed']);
 queueSourceAction(state,{animation:'strike',returnAnimation:'idle'},r=>events.push(r));
 step(.2);state.setAnimation(0,'idle',true);assert.deepEqual(events,['completed','interrupted']);
 step(3);assert.equal(events.length,2);
 queueSourceAction(state,{animation:'strike',returnAnimation:'idle'},r=>events.push(r));
 step(.2);state.clearTracks();assert.deepEqual(events,['completed','interrupted','interrupted']);
});
test('explicit complete action placement has its own defaults and returns to original speed',()=>{
 const s=scene({name:'actor',action:'idle',angle:30,scale:.2,speed:.5,gongji:{name:'actor',action:'strike',x:[10,.4],y:0,scale:0,speed:2}});
 const contract=compileSourceActions(s,{allowLayerOverrides:true}),action=contract.records[0];
 assert.equal(action.status,'candidate');assert.equal(action.actionLayer.placement.angle,0);assert.equal(action.actionLayer.placement.scale,0);assert.equal(action.returnSpeed,.5);
 assert.equal(layoutDecadeLayer(action.actionLayer,{width:240,height:360,referenceHeight:180}).x,106);
 const data=new spine.SkeletonData();data.animations=[new spine.Animation('idle',[],2),new spine.Animation('strike',[],1)];
 const state=new spine.AnimationState(new spine.AnimationStateData(data)),skeleton=new spine.Skeleton(data);let active;
 queueSourceAction(state,action,null,l=>active=l);
 const step=dt=>{state.update(dt);state.apply(skeleton);};
 step(.25);assert.equal(state.getCurrent(0).trackTime,.5);assert.equal(active,action.actionLayer);
 step(.26);step(0);assert.equal(state.getCurrent(0).animation.name,'idle');assert.equal(state.getCurrent(0).timeScale,.5);assert.equal(active,null);
 const before=state.getCurrent(0).trackTime;step(.2);assert.ok(Math.abs(state.getCurrent(0).trackTime-before-.1)<1e-9);
 const zero={...action,actionLayer:{...action.actionLayer,playback:{speed:0}}};queueSourceAction(state,zero,null,l=>active=l);step(3);assert.equal(state.getCurrent(0).trackTime,0);assert.equal(active,zero.actionLayer);
 state.clearTracks();assert.equal(active,null);
});
test('old action callbacks cannot clear the placement of a newer action',()=>{
 const data=new spine.SkeletonData();data.animations=[new spine.Animation('idle',[],2),new spine.Animation('strike',[],1)];
 const state=new spine.AnimationState(new spine.AnimationStateData(data));state.data.defaultMix=.5;
 const skeleton=new spine.Skeleton(data),first={playback:{speed:1}},second={playback:{speed:2}};let active;
 const a={animation:'strike',returnAnimation:'idle',returnSpeed:1};
 const old=queueSourceAction(state,{...a,actionLayer:first},null,l=>active=l);
 queueSourceAction(state,{...a,actionLayer:second},null,l=>active=l);
 old.listener?.end();assert.equal(active,second);
 state.update(.1);state.apply(skeleton);assert.equal(active,second);
});
