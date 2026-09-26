import test from 'node:test';
import assert from 'node:assert/strict';
import {registerPortraitFrame,followPortraitEffect} from '../apps/core/noname/util/portraitEffectFit.js';

function fixture(width=120,height=180){
 const rect={width,height},player={getBoundingClientRect:()=>rect};
 const sprite={update(){this.axes=[this.scale,this.scale];},mvp:{scale(x,y){sprite.axes[0]*=x;sprite.axes[1]*=y;}}};
 followPortraitEffect(sprite,player,.5);
 return{rect,player,sprite,draw(){sprite.update({});return sprite.axes;}};
}
test('existing frame effects follow a widening portrait without growing vertically; release restores native sizing',()=>{
 const f=fixture(),before=f.draw();
 const release=registerPortraitFrame(f.player,{width:120,height:180});
 f.rect.width=360;
 assert.deepEqual(f.draw(),[before[0]*3,before[1]]);
 f.rect.width=240;
 assert.deepEqual(f.draw(),[before[0]*2,before[1]]);
 release();f.rect.width=120;
 assert.deepEqual(f.draw(),before);
});
test('effects created after widening and viewport zoom use the same native height reference',()=>{
 const f=fixture(360,180);
 const release=registerPortraitFrame(f.player,{width:120,height:180});
 assert.deepEqual(f.draw(),[1,1/3]);
 f.rect.width=180;f.rect.height=90;
 assert.deepEqual(f.draw(),[.5,1/6]);
 release();
});
test('unadapted portraits keep normal effect proportions while following window resize',()=>{
 const f=fixture();assert.deepEqual(f.draw(),[1/3,1/3]);
 f.rect.width=60;f.rect.height=90;assert.deepEqual(f.draw(),[1/6,1/6]);
});
