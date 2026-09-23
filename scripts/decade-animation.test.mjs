import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../apps/core/extension/ui/十周年局内UI/',import.meta.url);
async function fixture(){
 const plays=[],stops=[];let listener;
 class Renderer{
  gl={getExtension:()=>null};canvas={remove(){},setAttribute(){}};spine={};requestId=0;
  render(){} loadSpine(name,type,resolve){resolve();}
  playSpine(def,position){const sprite={def,position};plays.push(sprite);return sprite;}
  stopSpine(sprite){stops.push(sprite);}stopSpineAll(){}
 }
 const context=vm.createContext({console,performance,setTimeout,clearTimeout,innerWidth:1440,innerHeight:810,cancelAnimationFrame(){},
  document:{body:{},createElement(){return {remove(){}};}}});
 const source=new vm.SourceTextModule(await fs.readFile(new URL('animations.js',root),'utf8'),{context});
 await source.link(async specifier=>{
  const values=specifier==='noname'?{subscribePresentation:fn=>{listener=fn;return()=>{listener=undefined;};}}:
   specifier.includes('animation-renderer')?{createAnimationRenderer:()=>({AnimationPlayer:Renderer})}:{spine:{}};
  return new vm.SyntheticModule(Object.keys(values),function(){for(const[k,v]of Object.entries(values))this.setExport(k,v);},{context});
 });await source.evaluate();
 const metadata=JSON.parse(await fs.readFile(new URL('animation-assets.json',root),'utf8'));
 const api=source.namespace.mountAnimations({base:'/',parts:new Set(['arena','lines']),options:{sound:false},metadata,enabled:()=>true,volume:()=>0});
 const emit=async data=>listener?.({time:performance.now(),player:{seat:'0',rect:{left:10,top:20,width:130,height:180}},...data});
 return {api,plays,stops,emit,metadata};
}
test('source card definitions take priority and judge outcomes select their source action',async()=>{
 const f=await fixture();try{
  await f.emit({type:'card',card:'wanjian',nature:'',color:'black'});
  assert.equal(f.plays.at(-1).def.name,'effect_wanjianqifa_full');
  assert.equal(f.plays.at(-1).position.parent,undefined);assert.equal(f.plays.at(-1).position.x,undefined);
  await f.emit({type:'card',card:'sha',nature:'',color:'red'});assert.equal(f.plays.at(-1).def.name,'effect_hongsha');
  await f.emit({type:'card',card:'sha',nature:'fire',color:'red'});assert.equal(f.plays.at(-1).def.name,'effect_huosha');
  await f.emit({type:'card',card:'kaihua',nature:'',color:'black'});assert.equal(f.plays.at(-1).def.name,'effect_shushangkaihua');
  await f.emit({type:'card',card:'sha',nature:'kami',color:'red'});assert.equal(f.plays.at(-1).def.name,'effect_shesha');
  await f.emit({type:'judge',effective:true});assert.equal(f.plays.at(-1).def.action,'play4');
  await f.emit({type:'judge',effective:false});assert.equal(f.plays.at(-1).def.action,'play5');
 }finally{f.api.dispose();}
});
test('one limited skill notification pair renders once, ordinary fullscreen labels remain available',async()=>{
 const f=await fixture();try{
  await f.emit({type:'skill',skill:'test',limited:true,time:100});
  await f.emit({type:'fullscreen',time:110});assert.equal(f.plays.length,1);
  await f.emit({type:'fullscreen',time:500});assert.equal(f.plays.length,2);
 }finally{f.api.dispose();}
});
test('target indicator follows its existing node and stops after deselection/disposal',async()=>{
 const f=await fixture();const node={getBoundingClientRect:()=>({left:1,top:2,width:130,height:180})};
 f.api.syncTargets([node]);await new Promise(r=>setTimeout(r,0));
 assert.equal(f.plays[0].position.parent,node);assert.equal(f.plays[0].position.follow,true);
 f.api.syncTargets([]);assert.equal(f.stops.length,1);f.api.dispose();await f.emit({type:'start'});assert.equal(f.plays.length,1);
});
test('target-resolution actions use the source animations and cancel the delayed return on disposal',async()=>{
 const f=await fixture(),target={seat:'1',rect:{left:300,top:30,width:130,height:180}};
 await f.emit({type:'cardTarget',card:'guohe',target});
 assert.deepEqual(f.plays.map(p=>p.def.action),['zizouqi_guohechaiqiao_qiao','zizouqi_guohechaiqiao_futou']);
 assert.ok(f.plays.every(p=>p.position.x===365));
 await f.emit({type:'cardTarget',card:'shunshou',target});assert.equal(f.plays.at(-1).def.action,'yangchuxian');
 await new Promise(r=>setTimeout(r,650));assert.equal(f.plays.at(-1).position.x,75);
 await f.emit({type:'cardTarget',card:'shunshou',target});const count=f.plays.length;f.api.dispose();
 await new Promise(r=>setTimeout(r,650));assert.equal(f.plays.length,count);
});
test('dying loop starts once, follows the seat and stops on recovery or release',async()=>{
 const f=await fixture(),node={getBoundingClientRect:()=>({left:1,top:2,width:130,height:180})};
 f.api.syncDying([node]);f.api.syncDying([node]);await new Promise(r=>setTimeout(r,0));
 assert.equal(f.plays.length,1);assert.equal(f.plays[0].def.name,'SS_jiuwo');assert.equal(f.plays[0].def.loop,true);assert.equal(f.plays[0].position.parent,node);
 f.api.syncDying([]);assert.equal(f.stops.length,1);f.api.dispose();
});
test('health effects use explicit public causes and respect source numeric ranges',async()=>{
 const f=await fixture();try{
  await f.emit({type:'number',value:-3});assert.equal(f.plays.length,0);
  await f.emit({type:'number',value:-2,health:{kind:'loseHp',value:2}});assert.equal(f.plays.at(-1).def.name,'effect_loseHp');
  await f.emit({type:'number',value:2,health:{kind:'recover',value:2}});assert.equal(f.plays.at(-1).def.action,'2');assert.match(f.plays.at(-1).def.name,/huifushuzi/);
  await f.emit({type:'number',value:-1,health:{kind:'damage',value:3,unreal:false}});assert.equal(f.plays.at(-1).def.action,'3');assert.match(f.plays.at(-1).def.name,/SZN_shuzi/);
  await f.emit({type:'number',value:0,health:{kind:'damage',value:0,unreal:true}});assert.equal(f.plays.at(-1).def.action,'play0');
  const numeric=()=>f.plays.filter(p=>p.def.name.startsWith('globaltexiao/')).length,count=numeric();
  for(const value of [1,10,Infinity,NaN])await f.emit({type:'number',value:-value,health:{kind:'damage',value,unreal:false}});
  assert.equal(numeric(),count);
  await f.emit({type:'number',value:-2,nature:'fire',health:{kind:'damage',value:2}});
  assert.equal(f.plays.at(-2).def.name,'effect_shoujidonghua');assert.equal(f.plays.at(-2).def.action,'play4');
 }finally{f.api.dispose();}
});

test('kill achievements consume host counts, legacy deaths stay plain, and conversion has its own effect',async()=>{
 const f=await fixture();try{
  await f.emit({type:'death'});assert.equal(f.plays.length,1);assert.equal(f.plays[0].def.name,'effect_zhenwang');
  await f.emit({type:'death',source:{seat:'1'},kills:3});await new Promise(r=>setTimeout(r,0));
  assert.ok(f.plays.some(p=>p.def.name==='sanpo'));assert.ok(f.plays.some(p=>p.def.name==='qy_SF_eff_lianzhan_lv3_zi'));
  const length=f.plays.length;await f.emit({type:'death',source:{seat:'0'},kills:3});assert.equal(f.plays.length,length+1);
  await f.emit({type:'conversion'});assert.equal(f.plays.at(-1).def.name,'zhuanhuanji');
 }finally{f.api.dispose();}
});

test('national card and damage achievements use explicit public names and source attribution',async()=>{
 const f=await fixture();try{
  for(const name of ['guguoanbang','haolingtianxia','kefuzhongyuan','wenheluanwu']){await f.emit({type:'card',card:'gz_'+name,nature:''});assert.equal(f.plays.at(-1).def.name,'card/effect_'+name);assert.equal(f.plays.at(-1).position.x,undefined);}
  await f.emit({type:'number',value:-3,health:{kind:'damage',value:3,sourced:true}});await new Promise(r=>setTimeout(r,0));assert.ok(f.plays.some(p=>p.def.name==='wanfumodi'));
  await f.emit({type:'number',value:-4,health:{kind:'damage',value:4,sourced:true}});await new Promise(r=>setTimeout(r,0));assert.ok(f.plays.some(p=>p.def.name==='shenweizhengqiankun'));
  const count=f.plays.filter(p=>['wanfumodi','shenweizhengqiankun'].includes(p.def.name)).length;
  await f.emit({type:'number',value:-4,health:{kind:'damage',value:4}});assert.equal(f.plays.filter(p=>['wanfumodi','shenweizhengqiankun'].includes(p.def.name)).length,count);
 }finally{f.api.dispose();}
});
