import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import vm from 'node:vm';import ts from 'typescript';
import {playerLinePath} from '../apps/core/noname/ui/lineCoordinates.js';
const rect=(left,top,width,height)=>({getBoundingClientRect:()=>({left,top,width,height})});
test('line coordinates preserve screen centres across arena zoom, border, scroll and independent seat zoom',()=>{
 const parent={...rect(40,70,2000,1000),offsetWidth:1000,offsetHeight:500,clientLeft:3,clientTop:4,scrollLeft:20,scrollTop:15};
 const source=rect(200,300,240,360),target=rect(1500,120,120,180),path=playerLinePath(source,target,parent);
 const expected=[320,480,1560,210];
 for(let i=0;i<4;i++)assert.equal((path[i]-(i%2?15:20)+(i%2?4:3))*2+(i%2?70:40),expected[i]);
 assert.equal(playerLinePath(source,target,{...parent,offsetWidth:0}),null);
});
function methods(text){const ast=ts.createSourceFile('x.js',text,ts.ScriptTarget.Latest,true),out={};function visit(n){if(ts.isMethodDeclaration(n))out[n.name.getText(ast)]=n;ts.forEachChild(n,visit);}visit(ast);return{ast,out};}
const identitySource=await fs.readFile('apps/core/mode/identity.js','utf8'),parsed=methods(identitySource);
function fixture(){
 const status={},lib={playerOL:{}},game={};
 const get={translation:s=>({cai2:'猜',fan2:'反贼',zhong2:'忠臣',nei2:'内奸',zhu2:'主公',special:'军师',special_bg:'师'})[s]||s};
 const ui={create:{div:(cls,str)=>({textContent:str,style:{}})},refresh:()=>{}};
 const context=vm.createContext({_status:status,game,get,lib,ui});
 const method=name=>vm.runInContext('({'+parsed.out[name].getText(parsed.ast)+'})['+JSON.stringify(name)+']',context);
 const p={identity:'cai',identityShown:false,ai:{shown:0},node:{identity:{firstChild:{innerHTML:'猜'},classList:{remove(){}}}},style:{},classList:{contains:()=>true},setIdentity(id){this.node.identity.firstChild.innerHTML=id||this.identity;},$dieAfter:method('$dieAfter'),showIdentity:method('showIdentity')};lib.playerOL.a=p;
 let arrow;ts.forEachChild(parsed.out.dieAfter,function visit(n){if(!arrow&&ts.isArrowFunction(n))arrow=n;else ts.forEachChild(n,visit);});
 return{p,context,lib,game,method,reveal:vm.runInContext('('+arrow.getText(parsed.ast)+')',context)};
}
test('remote death before reveal updates both guess labels to the transmitted identity, repeatedly and for special roles',()=>{
 for(const id of ['fan','zhong','nei']){const f=fixture();f.game.log=()=>{};f.p.$dieAfter();assert.equal(f.p.node.dieidentity.textContent,'猜');const node=f.p.node.dieidentity;f.reveal(f.p,null,id);assert.equal(f.p.identity,id);assert.equal(f.p.identityShown,true);assert.equal(f.p.ai.shown,1);assert.equal(f.p.node.identity.firstChild.innerHTML,id);assert.equal(node.textContent,{fan:'反贼',zhong:'忠臣',nei:'内奸'}[id]);f.reveal(f.p,null,id);assert.equal(f.p.node.dieidentity,node);}
 const f=fixture();f.game.log=()=>{};f.p.$dieAfter();f.reveal(f.p,'special','zhong');assert.equal(f.p.node.dieidentity.textContent,'军师');assert.equal(f.p.node.identity.firstChild.innerHTML,'师');
});
test('reconnect refreshes public/dead identity without revealing living hidden roles',()=>{
 const f=fixture();f.p.$dieAfter();f.method('updateState')({a:{identity:'fan',shown:0}});assert.equal(f.p.node.dieidentity.textContent,'反贼');assert.equal(f.p.identityShown,true);
 const g=fixture();g.p.classList.contains=()=>false;g.method('updateState')({a:{identity:'nei',identityShown:false,shown:0}});assert.equal(g.p.identityShown,false);assert.equal(g.p.node.identity.firstChild.innerHTML,'猜');
 g.method('updateState')({a:{identity:'nei',identityShown:true,shown:1}});assert.equal(g.p.node.identity.firstChild.innerHTML,'nei');assert.equal(g.method('getState')().a.identityShown,true);
});
test('reconnect restores each private local role without publishing it or changing other hidden roles',()=>{
 for(const id of ['zhu','zhong','fan','nei']){
  const f=fixture();f.game.me=f.p;f.p.classList.contains=()=>false;
  f.method('updateState')({a:{identity:id,identityShown:false,shown:0}});
  assert.equal(f.p.node.identity.firstChild.innerHTML,id);
  assert.equal(f.p.identityShown,false);assert.equal(f.p.ai.shown,0);
 }
 const f=fixture();f.game.me=f.p;f.game.observe=true;f.p.classList.contains=()=>false;
 f.method('updateState')({a:{identity:'nei',identityShown:false,shown:0}});
 assert.equal(f.p.node.identity.firstChild.innerHTML,'猜');
});
