import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import * as presentation from '../apps/core/noname/ui/presentationEvents.js';

const source=await fs.readFile(new URL('../apps/core/noname/library/element/player.js',import.meta.url),'utf8');
const ast=ts.createSourceFile('player.js',source,ts.ScriptTarget.Latest,true),methods={};
function visit(n){if(ts.isMethodDeclaration(n))methods[n.name.getText(ast)]=n.getText(ast);ts.forEachChild(n,visit);}visit(ast);
const method=(name,context)=>vm.runInNewContext('({'+methods[name]+'})['+JSON.stringify(name)+']',context);
test('hand limit captures the existing three modifier results without any extra evaluation or altered return',()=>{
 const calls=[],player={hp:4,dataset:{position:'0'},storage:{}},before=JSON.stringify(player);
 const getLimit=method('getHandcardLimit',{rememberHandLimit:presentation.rememberHandLimit,game:{checkMod:(p,n,kind)=>{calls.push(kind);return n+1;}}});
 assert.equal(presentation.handLimitPresentation(player),undefined);
 assert.equal(getLimit.call(player),7);assert.equal(presentation.handLimitPresentation(player),7);
 for(let i=0;i<10;i++)assert.equal(presentation.handLimitPresentation(player),7);
 assert.deepEqual(calls,['maxHandcardBase','maxHandcard','maxHandcardFinal']);assert.equal(JSON.stringify(player),before);
 const infinite=method('getHandcardLimit',{rememberHandLimit:presentation.rememberHandLimit,game:{checkMod:()=>Infinity}});
 assert.equal(infinite.call(player),Infinity);assert.equal(presentation.handLimitPresentation(player),Infinity);
 const negative=method('getHandcardLimit',{rememberHandLimit:presentation.rememberHandLimit,game:{checkMod:()=>-3}});
 assert.equal(negative.call(player),0);assert.equal(presentation.handLimitPresentation(player),0);
 presentation.clearPlayerPresentation(player);assert.equal(presentation.handLimitPresentation(player),undefined);
});
test('dying and target display transports carry only public state and preserve rule objects',async()=>{
 const records=[],broadcasts=[],messages=[],player={hp:0,dataset:{position:'0'},classList:{contains:()=>false}},target={dataset:{position:'1'}};
 const stop=presentation.subscribePresentation(m=>messages.push(m));
 const game={addVideo:(...args)=>records.push(args),broadcast:(...args)=>broadcasts.push(args)};
 const context={...presentation,playerPresentation:p=>({seat:p.dataset.position}),game};
 try{
  // rememberDying uses the real snapshot helper, which safely accepts no DOM.
  method('$dyingPresentation',context).call(player,true);assert.equal(presentation.dyingPresentation(player),true);
  player.hp=1;assert.equal(presentation.dyingPresentation(player),false);player.hp=0;
  method('$dyingPresentation',context).call(player,false);assert.equal(presentation.dyingPresentation(player),false);
  const effect=method('$cardTargetPresentation',context);
  effect.call(player,'sha',target);effect.call(player,'guohe',null);assert.equal(records.length,2);
  effect.call(player,'guohe',target);effect.call(player,'shunshou',target);
  await new Promise(r=>queueMicrotask(r));
  assert.equal(messages.at(-1).target.seat,'1');assert.ok(Object.isFrozen(messages.at(-1).target));
  assert.equal(records.at(-1)[2].card,'shunshou');assert.equal(records.at(-1)[2].target,'1');
  let args;const [remote,,card,remoteTarget]=broadcasts.at(-1);remote({$cardTargetPresentation:(...a)=>args=a},card,remoteTarget);assert.equal(args[0],'shunshou');assert.equal(args[1],target);
  assert.deepEqual(Object.keys(target),['dataset']);
 }finally{stop();}
});
test('special mark mapping is restricted to source marks; prefix snapshots do not reveal hidden generals or call getters',async()=>{
 const context=vm.createContext({}),module=new vm.SourceTextModule(await fs.readFile(new URL('../apps/core/extension/ui/十周年局内UI/extras.js',import.meta.url),'utf8'),{context});
 await module.link(()=>new vm.SyntheticModule(['handLimitPresentation','dyingPresentation'],function(){this.setExport('handLimitPresentation',()=>{});this.setExport('dyingPresentation',()=>false);},{context}));await module.evaluate();
 const{specialMarkFile,prefixMarkFile}=module.namespace;
 for(const suit of ['spade','heart','club','diamond'])assert.equal(specialMarkFile('xinfu_falu_'+suit),'falu_'+suit+'.png');
 for(const group of ['qun','shu','wei','wu','jin','shen'])assert.equal(specialMarkFile('starcanxi_'+group),'starcanxi_'+group+'.png');
 for(const id of ['starcanxi_cancel','starcanxi_wangsheng','starcanxi_xiangsi','xinfu_falu_foo'])assert.equal(specialMarkFile(id),undefined);
 let hidden=false;const player={name:'hero',classList:{contains:()=>hidden}},lib={translate:{hero_prefix:'界'}},prefixes={'界':'jie'};
 assert.match(prefixMarkFile(player,lib,prefixes),/mark_jie/);hidden=true;assert.equal(prefixMarkFile(player,lib,prefixes),undefined);
 hidden=false;Object.defineProperty(lib.translate,'hero_prefix',{get(){throw new Error('getter must not run');}});assert.equal(prefixMarkFile(player,lib,prefixes),undefined);
});
