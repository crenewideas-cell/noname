import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {independentBackdrop,fixedPortraitCamera,backdropPlacement} from '../apps/core/noname/skin/localDynamic/runtime/idle-framing.js';

test('a lower torso anchor is not rejected as a face at the bottom of the painting',()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../apps/core/noname/skin/localDynamic/runtime/framing.js',import.meta.url),'utf8'),context);
 const pixels=new Uint8Array(100*100*4);for(let y=20;y<80;y++)for(let x=0;x<100;x++)pixels[(y*100+x)*4+3]=255;
 const framing=context.window.SkinFraming;
 assert.ok(framing.sceneBounds(pixels,100,100,false,true,{x:.5,y:.7,kind:'body'}));
 assert.equal(framing.sceneBounds(pixels,100,100,false,true,{x:.5,y:.7,kind:'face'}),null);
});

test('only unregistered separate 4.0 artwork with a measured painting uses independent fill',()=>{
 const entry={legacy:{beijing:{}},models:[{version:'4.0.56'},{version:'4.0.56'}]};
 assert.equal(independentBackdrop(entry,{},null),true);
 assert.equal(independentBackdrop(entry,null,null),false);
 assert.equal(independentBackdrop(entry,{},{}),false);
 for(const field of ['sceneVariant','sceneCoordinates','layerRegistration','layerCoordinateMismatch','transform']){
  const next=structuredClone(entry);next.models[1][field]={};assert.equal(independentBackdrop(next,{},null),false,field);
 }
 for(const version of ['3.6.38','3.8.75','4.1.00'])assert.equal(independentBackdrop({...entry,models:entry.models.map(m=>({...m,version}))},{},null),false);
 assert.equal(independentBackdrop({...entry,scene:{}},{},null),false);
 assert.equal(independentBackdrop({...entry,composition:{focus:{}}},{},null),false);
});

test('fixed portrait protects vertical artwork while its own backdrop covers every frame edge',()=>{
 const painting={x:-200,y:-100,width:400,height:250},body={x:-350,y:-190,width:700,height:480};
 for(const [w,h] of [[240,360],[360,600],[420,600]]){
  const camera=fixedPortraitCamera(painting,body,w/h),t=backdropPlacement(painting,camera,w,h),s=Math.max(w/camera.width,h/camera.height);
  assert.equal(camera.x+camera.width/2,painting.x+painting.width/2);
  assert.ok(camera.y<=body.y&&camera.y+camera.height>=body.y+body.height);
  const left=w/2+(painting.x*t.scale+t.x-camera.x-camera.width/2)*s;
  const top=h/2+(painting.y*t.scale+t.y-camera.y-camera.height/2)*s;
  assert.ok(left<=1e-8&&top<=1e-8&&left+painting.width*t.scale*s>=w-1e-8&&top+painting.height*t.scale*s>=h-1e-8);
  assert.equal(camera.height,480);
 }
});
