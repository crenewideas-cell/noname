import test from 'node:test';
import assert from 'node:assert/strict';
import {spine} from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';
import {createAnimationRenderer} from '../apps/core/extension/ui/十周年局内UI/animation-renderer.js';
import {compileDecadeLayer,compileDecadeScene,layoutDecadeLayer,layoutCompleteArtwork,transformPoint} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
test('source coordinate matrices agree with the separate APNode path across sizes and DPR',()=>{
 const previous=globalThis.HTMLElement;globalThis.HTMLElement=class{};
 try{const {APNode}=createAnimationRenderer(spine);
  for(const size of [[120,180],[360,600],[600,240]])for(const dpr of [1,1.5,2])for(const c of [{},{x:[10,.2],y:[-7,.8],scale:.4,angle:32},{x:0,y:0,scale:-.7,angle:90},{x:[-3,1.2],y:17,scale:0,angle:-20}]){
   const [width,height]=size,layer=compileDecadeLayer({name:'fixture',...c},'primary'),actual=layoutDecadeLayer(layer,{width,height,dpr});
   const node=new APNode({...layer.placement,skeleton:{bounds:{size:{x:100,y:200}}}});node.update({dpr,delta:0,canvas:{width:width*dpr,height:height*dpr}});
   for(const [x,y] of [[0,0],[23,-16],[-14,67]]){const p=transformPoint(actual.device,x,y),m=node.mvp.values;const expected={x:((m[0]*x+m[4]*y+m[12])+1)*width*dpr/2,y:((m[1]*x+m[5]*y+m[13])+1)*height*dpr/2};assert.ok(Math.abs(p.x-expected.x)<.001);assert.ok(Math.abs(p.y-expected.y)<.001);}
  }
 }finally{if(previous===undefined)delete globalThis.HTMLElement;else globalThis.HTMLElement=previous;}
});
test('scene compilation preserves zero values, foreground, actions and independent source objects',()=>{
 const source={name:'rig',scale:0,speed:0,opacity:0,x:0,y:0,beijing:{name:'bg'},qianjing:{name:'fg'},gongji:{name:'attack',action:['hit','recover']},special:{condition:{lowhp:{transform:'other'}}}};
 const scene=compileDecadeScene(source,{sourceConfigHash:'fixture'});assert.deepEqual(scene.layers.map(l=>l.role),['background','primary','foreground']);
 assert.equal(scene.layers[1].playback.speed,0);assert.equal(scene.layers[1].display.opacity,0);assert.equal(layoutDecadeLayer(scene.layers[1],{width:120,height:180}).scale,0);
 assert.deepEqual(scene.source,source);source.gongji.action.push('mutation');assert.deepEqual(scene.actions.gongji.action,['hit','recover']);assert.equal(scene.viewport.status,'requires-source-evidence');
});
test('complete-artwork policy contains the fixed reference rectangle without aspect distortion',()=>{
 const b={x:-510,y:-20,width:1500,height:850};
 for(const [width,height] of [[240,360],[360,600],[600,240]]){
  const t=layoutCompleteArtwork(b,{width,height,dpr:1.5});
  const lower=transformPoint(t.logical,b.x,b.y),upper=transformPoint(t.logical,b.x+b.width,b.y+b.height);
  assert.ok(lower.x>=-1e-9&&lower.y>=-1e-9&&upper.x<=width+1e-9&&upper.y<=height+1e-9);
  assert.ok(Math.abs((upper.x-lower.x)/(upper.y-lower.y)-b.width/b.height)<1e-9);
  assert.ok(Math.abs(lower.x+upper.x-width)<1e-9&&Math.abs(lower.y+upper.y-height)<1e-9);
 }
 assert.throws(()=>layoutCompleteArtwork({...b,width:Infinity},{width:240,height:360}));
});
