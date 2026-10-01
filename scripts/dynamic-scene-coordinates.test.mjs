import test from 'node:test';import assert from 'node:assert/strict';
import {sharedSceneCoordinates,sourceCameraAnchor} from '../apps/core/noname/skin/localDynamic/runtime/scene-coordinates.js';
import {avatarLayerTransform,sceneFocus} from '../apps/core/noname/skin/localDynamic/runtime/composition.js';
function skeleton(scale,x,y){const root={data:{index:0,name:'root'}},b={parent:root,data:{index:1,name:'scale',scaleX:scale,scaleY:scale,rotation:0},worldX:x,worldY:y};return {bones:[root,b],slots:Array.from({length:6},()=>({bone:b,data:{blendMode:0},attachment:{region:{}}})),data:{animations:[{timelines:[]}]}};}
test('shared static root recovers scene units; identity root, effects and animated groups fail closed',()=>{
 const a=skeleton(.3,10,20),b=skeleton(.6,-40,30);
 assert.deepEqual(sharedSceneCoordinates(a,b).transform,{scale:.5,angle:0,x:30,y:5});
 b.data.animations[0].timelines.push({boneIndex:1});assert.equal(sharedSceneCoordinates(a,b),null);b.data.animations[0].timelines=[];
 b.bones[1].data.name='eff';assert.equal(sharedSceneCoordinates(a,b),null);b.bones[1].data.name='scale';
 b.bones[1].data.scaleY=.5;assert.equal(sharedSceneCoordinates(a,b),null);
 assert.equal(sharedSceneCoordinates(skeleton(1,0,0),skeleton(1,0,0)),null);
});
test('avatar registration never substitutes for proven scene registration; focus maps through both transforms',()=>{
 const t={scale:2,angle:0,x:7,y:9},m={legacy:{x:[0,.5],y:[0,.5],scale:1},sceneVariant:{transform:{scale:.5,angle:0,x:10,y:20}},sceneCoordinates:{transform:t}};
 const entry={legacy:{beijing:{}},models:[{},m]};
 assert.equal(sourceCameraAnchor(entry),-20);
 assert.deepEqual(avatarLayerTransform(entry,1,{height:20},{height:50}),t);
 const focus=sceneFocus(entry,{x:-100,y:-100,width:200,height:200},.5);
 assert.equal(focus.x+focus.width/2,-33);
});
test('constant root timelines are opt-in and any changing channel rejects recovery',()=>{
 class TranslateTimeline{constructor(){this.boneIndex=1;this.frames=[0,0,-4,1,0,-4];}}
 const a=skeleton(.3,10,20),b=skeleton(.6,-40,30),timeline=new TranslateTimeline();b.data.animations[0].timelines.push(timeline);
 assert.equal(sharedSceneCoordinates(a,b),null);
 assert.deepEqual(sharedSceneCoordinates(a,b,true).transform,{scale:.5,angle:0,x:30,y:5});
 timeline.frames[5]=-5;assert.equal(sharedSceneCoordinates(a,b,true),null);
});
