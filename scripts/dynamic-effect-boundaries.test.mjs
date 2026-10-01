import test from 'node:test';
import assert from 'node:assert/strict';
import {clippedEffectEdges,featherEffectPixels,softenCutContours} from '../apps/core/noname/skin/localDynamic/runtime/effect-boundaries.js';
test('opaque artwork and softly fading effects keep their original pixels',()=>{
 const opaque=new Uint8ClampedArray(40*40*4).fill(255);
 assert.deepEqual(clippedEffectEdges(opaque,40,40),[]);
 const soft=new Uint8ClampedArray(40*40*4);
 for(let y=0;y<40;y++)for(let x=0;x<40;x++)soft[(y*40+x)*4+3]=Math.max(0,Math.min(x,y,39-x,39-y))*12;
 const original=soft.slice();assert.equal(softenCutContours(soft,40,40),false);assert.deepEqual(soft,original);
});
test('clipped effect boundaries fade locally and maintain premultiplied RGB',()=>{
 const pixels=new Uint8ClampedArray(40*40*4);
 for(let y=0;y<30;y++)for(let x=0;x<30;x++){const i=(y*40+x)*4;pixels.set([100,80,50,180],i);}
 const edges=clippedEffectEdges(pixels,40,40);assert.deepEqual(edges,['left','top']);
 featherEffectPixels(pixels,40,40,edges,true);
 assert.equal(pixels[3],0);assert.equal(pixels[0],0);assert.equal(pixels[(20*40+20)*4+3],180);
 assert.equal(softenCutContours(pixels,40,40,true),true);
 assert.ok(pixels[(29*40+20)*4+3]<180);assert.equal(pixels[(20*40+20)*4+3],180);
});
