import test from 'node:test';
import assert from 'node:assert/strict';
import {skillPresentation} from '../apps/core/noname/ui/presentationEvents.js';

test('skill labels are detached snapshots and never execute rules or translation/storage getters',()=>{
 let calls=0;
 const trap=()=>{calls++;throw Error('rule was evaluated');};
 const lib={skill:{passive:{trigger:{player:'damageEnd'},filter:trap},active:{enable:'phaseUse',filter:trap},limited:{limited:true},convert:{zhuanhuanji:true},custom:{zhuanhuanji:trap},hidden:{}},translate:{passive:'被动',active:'主动',limited:'限定',convert:'转换',custom:'自定义',hidden:'暗技'}};
 Object.defineProperty(lib.translate,'trap',{get:trap});lib.skill.trap={};
 const player={skills:['passive','active','limited','convert','custom','trap'],storage:{convert:true},awakenedSkills:['limited'],additionalSkills:{'hidden:test':['hidden']},hiddenSkills:[],classList:{contains:()=>false}};
 const state=skillPresentation(player,lib);
 assert.equal(calls,0);assert.equal(state.length,5);assert.equal(state.find(s=>s.id==='active').active,true);
 assert.equal(state.find(s=>s.id==='convert').state,'yin');assert.equal(state.find(s=>s.id==='custom').state,'');
 assert.equal(state.find(s=>s.id==='limited').used,true);assert.ok(Object.isFrozen(state));assert.ok(state.every(Object.isFrozen));
 player.storage.convert=false;player.awakenedSkills.length=0;
 assert.equal(state.find(s=>s.id==='convert').state,'yin');assert.equal(state.find(s=>s.id==='limited').used,true);
 assert.equal(skillPresentation(player,lib,true).length,6);
});

test('unrevealed generals never expose labels to other seats and local hidden skills remain local',()=>{
 const player={skills:['a'],hiddenSkills:['b'],classList:{contains:name=>name==='unseen2'}};
 const lib={skill:{a:{},b:{}},translate:{a:'一',b:'二'}};
 assert.deepEqual(skillPresentation(player,lib),[]);
 assert.deepEqual(skillPresentation(player,lib,true).map(s=>s.id),['a','b']);
});
