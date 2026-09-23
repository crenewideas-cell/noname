import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {fixMatchingScenes} from './fix-matching-scenes.mjs';

for(const style of ['shousha','rzsh'])test(`${style}: nested completion callbacks run through the current Spine listener API`,()=>{
 const start=style==='shousha'?"pipeihome.on('added', () => {":'U1["on"]("added", () => {';
 const end=style==='shousha'?'function setupp(){}':'function U2(){}';
 const source=start+`
 outer.state.tracks[0].onComplete=function(){
  events.push('wheel');
  inner.state.tracks[0]["onComplete"]=function(){events.push('enter');};
 };
 });`+end;
 const migrated=fixMatchingScenes(source,style);
 const events=[],outer={state:{tracks:[{}]}},inner={state:{tracks:[{}]}};
 const stage={on:(_event,fn)=>fn()},reset={state:{setAnimation:()=>events.push('reset')}};
 vm.runInNewContext(migrated,{pipeihome:stage,U1:stage,findpipei:reset,G4:reset,bridge:{matching:()=>{}},lib:{config:{mode:'versus'}},outer,inner,events});
 outer.state.tracks[0].listener.complete();inner.state.tracks[0].listener.complete();
 assert.deepEqual(events,['reset','wheel','enter']);
 assert.equal(fixMatchingScenes(migrated,style),migrated);
});

for(const [style,file]of [['shousha','手杀标准UI/native/lobby.js'],['rzsh','如真似幻/scenes.js']])test(`${style}: checked-in scene stays valid and regeneration is idempotent`,()=>{
 const source=fs.readFileSync(new URL('../apps/core/extension/ui/'+file,import.meta.url),'utf8');
 const checked=spawnSync(process.execPath,['--check',fileURLToPath(new URL('../apps/core/extension/ui/'+file,import.meta.url))],{encoding:'utf8'});
 assert.equal(checked.status,0,checked.stderr);
 assert.equal(fixMatchingScenes(source,style),source);
});

test('ranked matching counts four portraits and the visual VS separator without changing core player config',()=>{
 const source=fixMatchingScenes("pipeihome.on('added', () => { let plength = lib.config.player_number; window.playerNickName['rzsh']=[]; result=plength; }); function setupp(){}",'shousha');
 for(const [mode,story,expected]of [['versus','paiwei',5],['versus','classic',4],['identity','classic',8]]){
  const context={pipeihome:{on:(_event,fn)=>fn()},bridge:{matching:()=>{}},findpipei:{state:{setAnimation:()=>{}}},lib:{config:{mode,player_number:8}},game:{storyBgMode:story},get:{config:()=> 'two'},window:{playerNickName:{}}};
  vm.runInNewContext(source,context);assert.equal(context.result,expected);assert.equal(context.lib.config.player_number,8);
 }
});
