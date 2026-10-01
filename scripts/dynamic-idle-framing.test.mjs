import test from 'node:test';import assert from 'node:assert/strict';
import {opaqueCamera,idleGeometryEnvelope,anonymousSubject,protectSubjectCamera,actionSubjectCamera} from '../apps/core/noname/skin/localDynamic/runtime/idle-framing.js';
import {avatarLayerTransform,subjectBounds,subjectHeadBounds} from '../apps/core/noname/skin/localDynamic/runtime/composition.js';
import {sourceAction} from '../apps/core/noname/skin/localDynamic/runtime/source-actions.js';
test('action camera protects a crossing head but preserves an already readable frame',()=>{
 const fit={x:-100,y:-150,width:200,height:300};
 assert.equal(actionSubjectCamera(fit,{x:-20,y:40,width:40,height:50},2/3),fit);
 assert.equal(actionSubjectCamera(fit,null,2/3),fit);
 const head={x:180,y:130,width:60,height:90},camera=actionSubjectCamera(fit,head,2/3);
 assert.ok(camera.x<=head.x&&camera.x+camera.width>=head.x+head.width);
 assert.ok(camera.y<=head.y&&camera.y+camera.height>=head.y+head.height);
 assert.equal(camera.width,fit.width);assert.equal(camera.height,fit.height);
 assert.deepEqual(fit,{x:-100,y:-150,width:200,height:300});
});
test('avatar filename and edition flag cannot manufacture a second magnification',()=>{
 const entry={legacy:{beijing:{}},models:[{legacy:{scale:.3}},{skeleton:'a/daiji2.skel',avatarPresentation:true,legacy:{scale:1.2,shizhounian:true}}]};
 assert.equal(avatarLayerTransform(entry,1,{height:300},{height:900}),undefined);
 entry.models[1].layerRegistration={transform:{scale:2,x:10}};assert.deepEqual(avatarLayerTransform(entry,1,{height:300},{height:900}),{scale:2,x:10});
});
test('stepped opaque camera contains the face and never includes a transparent pixel',()=>{
 const w=120,h=180,p=new Uint8Array(w*h*4);for(let y=30;y<h;y++)for(let x=0;x<(y<70?100:120);x++)p[(y*w+x)*4+3]=255;
 const face={x:50,y:75,width:20,height:25},c=opaqueCamera(p,w,h,w/h,face);assert.ok(c);assert.ok(c.y>=30/h);assert.ok(Math.abs(c.width/c.height*w/h-w/h)<1e-6);
 for(let y=Math.ceil(c.y*h);y<Math.floor((c.y+c.height)*h);y++)for(let x=Math.ceil(c.x*w);x<Math.floor((c.x+c.width)*w);x++)assert.equal(p[(y*w+x)*4+3],255);
 assert.ok(c.x*w<=face.x&&(c.x+c.width)*w>=face.x+face.width);
 assert.equal(opaqueCamera(p,w,h,w/h,{...face,y:0}),null);
});
test('idle envelope covers motion extrema without advancing the live track',()=>{
 const track={trackTime:.1,animation:{duration:2}},slot={data:{blendMode:0},color:{a:1},attachment:{name:'1',region:{},computeWorldVertices(b,out){const x=Math.sin(track.trackTime*Math.PI);out.set([x,0,x+1,0,x+1,1,x,1]);}}};
 const skeleton={slots:[slot],setToSetupPose(){},updateWorldTransform(){}};slot.bone={};
 const layer={skeleton,state:{getCurrent:()=>track,apply(){}}};const b=idleGeometryEnvelope(layer);assert.equal(track.trackTime,.1);assert.ok(b.x<=-1&&b.width>=3);assert.equal(anonymousSubject(skeleton),true);
});

test('an opaque upper backdrop cannot turn a readable face into a bottom-edge crop',()=>{
 const width=120,height=180,pixels=new Uint8Array(width*height*4);
 for(let y=0;y<100;y++)for(let x=0;x<width;x++)pixels[(y*width+x)*4+3]=255;
 assert.equal(opaqueCamera(pixels,width,height,width/height,{x:50,y:78,width:20,height:20}),null);
});
test('resolved steady idle is the return for protected artwork; explicit source return still wins',()=>{
 const scene={layers:[{playback:{resolvedIdle:'DaiJi',speed:1}}],actionContract:{protocol:'noname-source-actions/3',records:[{command:'source:shan',kind:'shan',status:'candidate',layer:0,animation:'shan',returnSelection:'source-default-first'}]}};
 const animations=['ChuChang','DaiJi','shan'].map(name=>({name}));assert.equal(sourceAction(scene,'source:shan',animations).returnAnimation,'DaiJi');scene.actionContract.records[0].returnAnimation='ChuChang';assert.equal(sourceAction(scene,'source:shan',animations).returnAnimation,'ChuChang');
});
test('principal body group wins over a larger companion face and protects its crown',()=>{
 const slot=(name,x,y,w,h)=>({bone:{},color:{a:1},attachment:{name,region:{},computeWorldVertices(b,v){v.set([x,y,x+w,y,x+w,y+h,x,y+h]);}}});
 const slots=[slot('r2-tou',-100,0,80,80),slot('r-tou',100,0,40,40),slot('r-maozi',95,35,50,40),...Array.from({length:8},(_,i)=>slot('r-body'+i,0,0,1,1))];
 assert.equal(subjectBounds({slots}).x,100);assert.deepEqual(subjectHeadBounds({slots}),{x:95,y:0,width:50,height:75});
});
test('camera protects the head across portrait and landscape viewports without chasing every frame',()=>{
 const fit={x:0,y:0,width:600,height:800},head={x:520,y:760,width:70,height:100};
 for(const aspect of [.45,.67,2]){
  const c=protectSubjectCamera(fit,head,aspect);assert.ok(c);assert.ok(c.x<=head.x&&c.y<=head.y&&c.x+c.width>=head.x+head.width&&c.y+c.height>=head.y+head.height);
  assert.ok(Math.abs(c.x+c.width/2-head.x-head.width/2)<1e-6);
  assert.equal(protectSubjectCamera(c,head,aspect),null);
 }
});
