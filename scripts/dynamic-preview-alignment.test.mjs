import test from 'node:test';import assert from 'node:assert/strict';
import {alignEffectSubject,screenEffectLayer} from '../apps/core/noname/skin/localDynamic/runtime/effect-layout.js';
import {compileDecadeLayer} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
import {alignAttachmentPoints} from '../apps/core/noname/skin/localDynamic/runtime/anchor-geometry.js';
test('numeric attachment correspondences recover camera with an animated outlier',()=>{
 const source=Array.from({length:20},(_,i)=>({key:String(i),x:i*13,y:(i%5)*27}));
 const target=source.map(p=>({...p,x:321+p.x*1.4,y:900-407-p.y*1.4}));target[0].x+=180;
 const camera=alignAttachmentPoints(source,target,900);assert.equal(camera.matches,20);
 assert.ok(Math.abs(camera.x-321)<1);assert.ok(Math.abs(camera.y-407)<1);assert.ok(Math.abs(camera.scale-1.4)<.01);
});
test('unrelated rigs and insufficient correspondences do not override authored placement',()=>{
 const source=Array.from({length:20},(_,i)=>({key:String(i),x:i*13,y:(i%5)*27}));
 assert.equal(alignAttachmentPoints(source,source.slice(0,5),900),null);
 assert.equal(alignAttachmentPoints(source,source.map((p,i)=>({...p,x:(i%7)*61,y:(i%3)*91})),900),null);
});
test('preview entrance centers in its own portrait, independently of opponent anchors',()=>{
 const a={kind:'chuchang',actionLayer:compileDecadeLayer({name:'entrance',scale:1},'action')},v={width:1400,height:900,rect:{left:200,top:100,width:360,height:540}};
 assert.equal(screenEffectLayer(a,{...v,preview:true}).placement.x,380);
 assert.equal(screenEffectLayer(a,v).placement.x,560);
});
test('entrance end subject shares idle screen center and scale through resize and page zoom',()=>{
 const layer=compileDecadeLayer({name:'entrance',scale:.4},'action'),source={x:-31,y:92,width:44,height:60};
 for(const zoom of [.75,1,1.5]){const target={x:350*zoom,y:220*zoom,width:66*zoom,height:90*zoom},height=900*zoom,l=alignEffectSubject(layer,source,target,height),p=l.placement;
  assert.ok(Math.abs(p.x+(source.x+source.width/2)*p.scale-target.x-target.width/2)<1e-8);
  assert.ok(Math.abs(height-p.y-(source.y+source.height/2)*p.scale-target.y-target.height/2)<1e-8);
  assert.equal(source.width*p.scale,target.width);
 }
 assert.equal(alignEffectSubject(layer,{...source,width:0},{x:1,y:1,width:1,height:1},900),null);
 assert.equal(layer.placement.scale,.4);
});
