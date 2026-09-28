import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import {emotionTriggerPresentation,subscribePresentation} from '../apps/core/noname/ui/presentationEvents.js';

// R13 deliberately replaces the archived Liuli spam/probability contract.
const source=await fs.readFile('apps/core/noname/ui/emotionReplies.js','utf8');
function fixture(rng=()=>0){
 const timers=new Map(),sent=[];let now=0,id=0,listener,auto=true,replies=true;
 const players=['0','1','2','3'].map(seat=>({dataset:{position:seat},hp:3,dead:false,controlled:false,online:false,
  isIn(){return !this.dead;},isUnderControl(){return this.controlled;},isOnline(){return this.online;},hasSkillTag(){return false;},
  throwEmotion(target,emotion){sent.push({sender:seat,target:target.dataset.position,emotion,time:now});listener?.({type:'emotion',player:{seat},target:{seat:target.dataset.position},emotion});}}));
 const game={players,dead:[],me:players[0]},status={},relations=new Map();
 const get={attitude:(a,b)=>relations.get(a.dataset.position+':'+b.dataset.position)??((Number(a.dataset.position)<2)===(Number(b.dataset.position)<2)?1:-1)};
 const ctx=vm.createContext({game,get,_status:status,subscribePresentation:fn=>{listener=fn;return()=>listener=undefined;},performance:{now:()=>now},crypto:{getRandomValues:a=>{a[0]=Math.floor(rng()*4294967296);return a;}},Uint32Array,
  setTimeout:(fn,delay=0)=>{timers.set(++id,{fn,time:now+delay});return id;},clearTimeout:id=>timers.delete(id)});
 const install=vm.runInContext(source.replace(/^import .*;\r?\n/gm,'').replace('export function','function')+'\ninstallEmotionReplies',ctx);
 const dispose=install({automatic:()=>auto,enabled:()=>replies});
 const emit=(trigger,detail={})=>listener?.({type:'emotionTrigger',trigger,player:'2',source:'1',num:1,...detail});
 const advance=ms=>{const end=now+ms;let count=0;while(true){const item=[...timers].sort((a,b)=>a[1].time-b[1].time)[0];if(!item||item[1].time>end)break;assert.ok(++count<1000);timers.delete(item[0]);now=item[1].time;item[1].fn();}now=end;};
 return {game,status,players,sent,timers,dispose,emit,advance,auto:v=>auto=v,raw:m=>listener?.(m),relations};
}
test('local player praises ally; ally praises local player; intensity follows effective damage',()=>{
 for(const [source,num,count]of [['1',1,1],['1',3,3],['0',8,3]]){
  const f=fixture();f.emit('damageSource',{source,num});f.advance(2500);
  assert.equal(f.sent.length,count);assert.ok(f.sent.every(m=>m.emotion==='flower'&&m.target===source&&m.sender===(source==='0'?'1':'0')));f.dispose();
 }
});
test('aid, healing, rescue, armour and turning face up earn proportional thanks',()=>{
 for(const [trigger,detail,count]of [
  ['gainAfter',{giver:'1',source:null,count:1},1],['gainAfter',{giver:'1',source:null,count:6},3],
  ['recoverAfter',{source:'1',num:1,hp:2},1],['recoverAfter',{source:'1',num:1,hp:1,savePlayer:'1'},3],
  ['changeHujiaAfter',{source:null,parentPlayer:'1',num:2},2],['turnOverAfter',{source:null,parentPlayer:'1',turnedOver:false},2]]){
  const f=fixture();f.emit(trigger,{...detail,player:'0'});f.advance(2500);assert.equal(f.sent.length,count,trigger);assert.ok(f.sent.every(m=>m.sender==='0'&&m.target==='1'&&m.emotion==='flower'));f.dispose();
 }
});
test('enemy good plays get eggs/shoe; friendly fire is a mistake but damage-benefit skills are exempt',()=>{
 const f=fixture();f.emit('damageSource',{player:'0',source:'2',num:3});f.advance(2500);assert.deepEqual(f.sent.map(m=>m.emotion),['egg','egg','shoe']);assert.ok(f.sent.every(m=>m.sender==='0'));f.dispose();
 const g=fixture();g.emit('damageSource',{player:'0',source:'1',num:2});g.advance(2500);assert.deepEqual(g.sent.map(m=>m.emotion),['egg','egg']);g.dispose();
 const h=fixture();h.players[0].hasSkillTag=()=>true;h.emit('damageSource',{player:'0',source:'1',num:3});h.advance(2500);assert.equal(h.sent.length,0);h.dispose();
});
test('one responder handles a mass action, all cooldowns bound future reactions',()=>{
 const f=fixture();for(let i=0;i<60;i++)f.emit('damageSource',{num:2});f.advance(2500);
 assert.equal(f.sent.length,3);assert.equal(new Set(f.sent.map(m=>m.sender)).size,1);
 f.emit('damageSource',{num:2});f.advance(1000);assert.equal(f.sent.length,3);
 f.advance(3500);f.emit('damageSource',{num:2});f.advance(2500);assert.equal(f.sent.length,3,'same pair cooldown');
 f.advance(4000);f.emit('damageSource',{num:1});f.advance(2000);assert.equal(f.sent.length,4);f.dispose();
});
test('no opening spam, hand-count rewards, zero-value healing or self assistance',()=>{
 const f=fixture();for(const trigger of ['gameDrawBefore','enterGame','phaseUseBegin','useCard'])f.emit(trigger,{handCount:20,card:'jiu'});
 f.emit('recoverAfter',{player:'0',source:'1',num:0});f.emit('gainAfter',{player:'0',source:'0',giver:'0',count:9});f.emit('turnOverAfter',{player:'0',source:'1',turnedOver:true});f.advance(5000);assert.equal(f.sent.length,0);f.dispose();
});
test('disable, result, teardown and removed participants cancel delayed interactions',()=>{
 for(const change of [f=>f.auto(false),f=>f.raw({type:'result'}),f=>f.dispose(),f=>f.players[0].dead=true,f=>f.players[1].dead=true,f=>f.status.connectMode=true]){
  const f=fixture();f.emit('damageSource',{num:3});f.advance(650);change(f);f.advance(5000);assert.equal(f.sent.length,0);f.dispose();
 }
 for(const [obj,key]of [['status','connectMode'],['status','video'],['status','over'],['game','online'],['game','observe']]){
  const f=fixture();f[obj][key]=true;f.emit('damageSource');f.advance(5000);assert.equal(f.sent.length,0);f.dispose();
 }
});
test('no impersonation of other humans, controlled bots or local observer',()=>{
 for(const field of ['controlled','online']){const f=fixture();f.players[1][field]=true;f.emit('damageSource',{source:'0'});f.advance(5000);assert.equal(f.sent.length,0);f.dispose();}
 const f=fixture();f.game.notMe=true;f.emit('damageSource');f.advance(5000);assert.equal(f.sent.length,0);f.dispose();
});
test('automatic local gifts do not recurse; manual gifts can receive one reply only',()=>{
 const f=fixture();f.emit('damageSource',{num:3});f.advance(15000);assert.equal(f.sent.length,3);assert.ok(f.sent.every(m=>m.sender==='0'));f.dispose();
 const g=fixture();g.auto(false);g.raw({type:'emotion',player:{seat:'0'},target:{seat:'1'},emotion:'flower'});g.advance(5000);assert.equal(g.sent.length,1);assert.equal(g.sent[0].sender,'1');g.dispose();
});
test('card theft is not credited as assistance; a fresh match resets presentation-only cooldowns',()=>{
 const f=fixture();f.emit('gainAfter',{player:'0',source:'1',count:3,gainAnimation:'gain2'});f.advance(2500);assert.equal(f.sent.length,0);
 f.emit('gainAfter',{player:'0',source:'1',count:3,gainAnimation:'giveAuto'});f.advance(2500);assert.equal(f.sent.length,2);
 f.raw({type:'result'});f.emit('damageSource');f.advance(1000);assert.equal(f.sent.length,2);
 f.raw({type:'start'});f.emit('damageSource');f.advance(2500);assert.equal(f.sent.length,3);f.dispose();
});
test('engine publishes completed public counts without a gameplay hook; ignores draws and use intent',async()=>{
 const file=await fs.readFile('apps/core/noname/library/element/gameEvent.ts','utf8'),ast=ts.createSourceFile('event.ts',file,ts.ScriptTarget.Latest,true);let method;
 function visit(n){if(ts.isMethodDeclaration(n)&&n.name.getText(ast)==='trigger')method=n.getText(ast);ts.forEachChild(n,visit);}visit(ast);
 const trigger=vm.runInNewContext(ts.transpile('const x={'+method+'};x.trigger;',{target:ts.ScriptTarget.ES2022}),{_status:{gameDrawed:true},lib:{hookmap:{}},emotionTriggerPresentation});
 const p={dataset:{position:'1'},hp:2,classList:{contains:()=>false}},s={dataset:{position:'0'}},event={name:'recover',player:p,source:s,giver:s,parent:{player:s},num:2,cards:[{},{}],getParent:()=>({player:s})};
 const records=[],release=subscribePresentation(m=>records.push(m));
 try{for(const name of ['recoverAfter','gainAfter','turnOverAfter','changeHujiaAfter','dieBegin','phaseUseBegin','gameDrawBefore'])trigger.call(event,name);p.hp=10;await new Promise(r=>queueMicrotask(r));
  assert.equal(records.length,5);assert.equal(records[0].hp,2);assert.equal(records[0].num,2);assert.equal(records[0].savePlayer,'0');assert.equal(records[1].count,2);assert.equal(records[2].turnedOver,false);assert.equal(records[3].num,2);assert.equal(records[4].source,'0');assert.ok(records.every(Object.isFrozen));
 }finally{release();}
});

test('flower counts vary inside strength bands; reply chance is exactly 50 percent',()=>{
 for(const rng of [0,.499999,.5,.999999]){
  for(const [num,lo,hi]of [[1,1,2],[2,2,3],[8,3,4]]){const f=fixture(()=>rng);f.emit('damageSource',{num});f.advance(2500);assert.equal(f.sent.length,rng<.5?lo:hi);f.dispose();}
  const f=fixture(()=>rng);f.auto(false);f.raw({type:'emotion',player:{seat:'0'},target:{seat:'1'},emotion:'flower'});f.advance(15000);assert.equal(f.sent.length,rng<.5?1:0);assert(f.sent.every(m=>m.emotion==='flower'));f.dispose();
 }
});
