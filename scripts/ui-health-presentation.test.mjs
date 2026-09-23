import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import {emitPresentation,subscribePresentation,recoveryPresentation} from '../apps/core/noname/ui/presentationEvents.js';

// Exercise the actual core method with inert DOM/transport adapters. This
// verifies old calls, video records and remote replay use the same popup path.
const source=await fs.readFile(new URL('../apps/core/noname/library/element/player.js',import.meta.url),'utf8');
const ast=ts.createSourceFile('player.js',source,ts.ScriptTarget.Latest,true);let method;
function visit(n){if(ts.isMethodDeclaration(n)&&n.name.getText(ast)==='$damagepop')method=n.getText(ast);ts.forEachChild(n,visit);}visit(ast);
assert.ok(method);
function fixture(){
 const videos=[],broadcasts=[],messages=[];
 const release=subscribePresentation(message=>messages.push(message));
 const game={addVideo:(...args)=>videos.push(args),broadcast:(...args)=>broadcasts.push(args)};
 const ui={create:{div:()=>({dataset:{},classList:{add(){}}})}};
 const receiver={damagepopups:[{}]};
 const damagepop=vm.runInNewContext('({'+method+'}).$damagepop',{game,ui,emitPresentation,playerPresentation:()=>({seat:'1',rect:{left:0,top:0,width:130,height:180}})});
 receiver.$damagepop=damagepop;
 return {receiver,damagepop,videos,broadcasts,messages,release};
}
test('explicit health metadata survives video/remote transport without changing the existing numeric popup',async()=>{
 const f=fixture();try{
  const health={kind:'damage',value:3,unreal:true};
  f.damagepop.call(f.receiver,-1,'fire',false,undefined,health);
  health.value=9;await new Promise(r=>queueMicrotask(r));
  assert.equal(f.messages[0].health.value,3);assert.ok(Object.isFrozen(f.messages[0].health));
  assert.equal(f.messages[0].value,-1);assert.equal(f.receiver.damagepopups.at(-1).innerHTML,-1);
  const video=f.videos[0];assert.equal(video[0],'damagepop');assert.equal(video[2][3].kind,'damage');
  const [remote,player,...args]=f.broadcasts[0];
  let received;remote({$damagepop:(...values)=>received=values},...args);
  assert.equal(received[0],-1);assert.equal(received[4].unreal,true);
 }finally{f.release();}
});
test('legacy popup/video calls have no invented cause and nobroadcast remains effective',async()=>{
 const f=fixture();try{
  f.damagepop.call(f.receiver,2,'wood',undefined,false);
  await new Promise(r=>queueMicrotask(r));
  assert.equal(f.messages[0].health,null);assert.equal(f.receiver.damagepopups.at(-1).innerHTML,'+2');
  assert.equal(f.broadcasts.length,0);assert.equal(f.videos[0][2][3],undefined);
 }finally{f.release();}
});

test('death effects transport core kill counts and keep old video calls valid',async()=>{
 let die;
 function find(n){if(ts.isMethodDeclaration(n)&&n.name.getText(ast)==='$die')die=n.getText(ast);ts.forEachChild(n,find);}find(ast);
 const messages=[],videos=[],broadcasts=[],sourcePlayer={stat:[{kill:2},{kill:1}],dataset:{position:'2'}},player={dataset:{position:'1'}};
 const stop=subscribePresentation(m=>messages.push(m));
 try{
  player.$die=vm.runInNewContext('({'+die+'}).$die',{lib:{config:{die_move:'off'}},game:{addVideo:(...args)=>videos.push(args),broadcast:(...args)=>broadcasts.push(args)},emitPresentation,playerPresentation:p=>p?{seat:p.dataset.position}:null});
  player.$die(sourcePlayer);await new Promise(r=>queueMicrotask(r));
  assert.equal(messages[0].kills,3);assert.equal(messages[0].source.seat,'2');assert.ok(Object.isFrozen(messages[0].source));
  assert.deepEqual(sourcePlayer.stat,[{kill:2},{kill:1}]);assert.equal(videos[0][2].source,'2');assert.equal(videos[0][2].kills,3);
  const [remote,,source,visual]=broadcasts[0];let args;remote({$die:(...values)=>args=values},source,visual);assert.equal(args[1].kills,3);
  player.$die();await new Promise(r=>queueMicrotask(r));assert.equal(messages[1].source,null);assert.equal(messages[1].kills,0);
 }finally{stop();}
});

test('recovery milestones observe confirmed results in private display state across UI switches',()=>{
 const player={storage:{}},source={storage:{}},snapshot=JSON.stringify([player,source]);
 const record=(amount,phase,rescued=false)=>recoveryPresentation(player,source,{amount,phase,rescued});
 assert.deepEqual(record(2,1),[]);assert.deepEqual(record(1,1),['recovery']);assert.deepEqual(record(1,1),[]);
 assert.deepEqual(record(2,2),[]);assert.deepEqual(record(1,2),['recovery']);
 assert.deepEqual(record(1,3,true),[]);assert.deepEqual(record(1,4,true),[]);assert.deepEqual(record(1,5,true),['rescue']);
 assert.deepEqual(record(0,5,true),[]);assert.deepEqual(record(Infinity,5),[]);
 assert.deepEqual(recoveryPresentation(player,null,{amount:3,phase:6}),[]);
 assert.equal(JSON.stringify([player,source]),snapshot);
});

test('healing achievements broadcast and record the same filtered, immutable display result',async()=>{
 let method;
 function find(n){if(ts.isMethodDeclaration(n)&&n.name.getText(ast)==='$recoveryAchievement')method=n.getText(ast);ts.forEachChild(n,find);}find(ast);
 const videos=[],broadcasts=[],messages=[],player={};const release=subscribePresentation(m=>messages.push(m));
 try{
  player.$recoveryAchievement=vm.runInNewContext('({'+method+'}).$recoveryAchievement',{game:{addVideo:(...args)=>videos.push(args),broadcast:(...args)=>broadcasts.push(args)},emitPresentation,playerPresentation:()=>({seat:'0'})});
  player.$recoveryAchievement(['recovery','invalid','rescue']);await new Promise(r=>queueMicrotask(r));
  assert.deepEqual(messages[0].achievements,['recovery','rescue']);assert.ok(Object.isFrozen(messages[0].achievements));
  assert.equal(videos[0][0],'recoveryAchievement');assert.deepEqual(Array.from(videos[0][2]),['recovery','rescue']);
  const [remote,,data]=broadcasts[0];let received;remote({$recoveryAchievement:value=>received=value},data);assert.deepEqual(Array.from(received),['recovery','rescue']);
 }finally{release();}
});
