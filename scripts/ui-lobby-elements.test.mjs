import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import path from 'node:path';
import {createLobbyElements, fitLobbyBackground, lobbyLoadingTips} from '../apps/core/noname/ui/lobbyElements.js';
import {createLobbyLayout} from '../apps/core/noname/ui/lobbyLayout.js';
import {fixLobbyElements} from './fix-lobby-elements.mjs';

const point=()=>({x:0,y:0,set(x,y=x){this.x=x;this.y=y;}});
class Sprite {
 constructor(texture){this.texture=texture;this.anchor=point();this.scale=point();this.position=point();this.events={};}
 on(event,fn){(this.events[event]??=[]).push(fn);return this;}
 emit(event){for(const fn of this.events[event]||[])fn.call(this,{target:this});}
}
class AnimatedSprite extends Sprite { static fromFrames(frames){return new AnimatedSprite(frames);}play(){this.playing=true;} }
class Spine extends Sprite { constructor(data){super();this.data=data;this.state={setAnimation:(...args)=>this.animation=args};} }
class Text extends Sprite { constructor(text,style){super();this.text=text;this.style=style;} }
const PIXI={Sprite,AnimatedSprite,spine:{Spine},Text};

test('same panel geometry shares one definition; theme changes never leak to another instance',()=>{
 const a=createLobbyLayout('rzsh'),b=createLobbyLayout('shousha');
 assert.equal(Object.keys(a).length,111);assert.equal(Object.keys(b).length,84);
 assert.equal(Object.keys(a).filter(k=>JSON.stringify(a[k])===JSON.stringify(b[k])).length,51);
 a.modesecbg.x=-100;assert.notEqual(b.modesecbg.x,-100);assert.notEqual(createLobbyLayout('rzsh').modesecbg.x,-100);
});
test('button templates retain event target, callback context and animation differences',()=>{
 const ui=createLobbyElements(PIXI,'rzsh'),atlas={button:['a','b']};let calls=0;
 const node=ui.sprite(atlas,'button',{animated:true,speed:1,down(e){assert.equal(this,node);assert.equal(e.target,node);this.alpha=.5;calls++;},up(){this.alpha=1;calls++;}});
 node.emit('pointerdown');assert.equal(node.alpha,.5);node.emit('pointerup');assert.equal(node.alpha,1);
 assert.equal(calls,2);assert.equal(node.animationSpeed,1);assert.equal(node.playing,true);
 const decoration=ui.sprite(atlas,'button');assert.equal(decoration.interactive,undefined);assert.deepEqual(decoration.events,{});
 const vip=ui.sprite(atlas,'button',{interactive:true});assert.equal(vip.interactive,true);assert.deepEqual(vip.events,{});
});
test('shared layouts preserve theme scaling, raw positioning and unlisted button actions',()=>{
 const a=createLobbyElements(PIXI,'rzsh'),b=createLobbyElements(PIXI,'shousha');
 for(const ui of [a,b]){const node=ui.sprite({},'bigmenu');ui.place(node,{x:2,y:3});assert.equal(node.x,ui.layout.bigmenu.x*2);assert.equal(node.scale.y,ui.layout.bigmenu.scale*2);ui.place(node,{raw:true});assert.equal(node.x,ui.layout.bigmenu.x);assert.equal(node.scale.y,ui.layout.bigmenu.scale);}
 const node=a.sprite({},'unknown');let clicked=false;a.place(node,{handlers:{up(){clicked=true;}}});node.emit('pointerup');assert.ok(clicked);
 b.place(undefined,{raw:true});
});
test('background fit preserves cover center and stretch behavior across texture changes',()=>{
 const s=new Sprite({width:100,height:50});fitLobbyBackground(s,{width:200,height:200,centerX:80,centerY:40});
 assert.equal(s.scale.x,4);assert.equal(s.position.x,80);assert.equal(s.anchor.x,.5);
 s.texture={width:400,height:200};fitLobbyBackground(s,{width:200,height:200});assert.equal(s.scale.x,1);
 const bg=createLobbyElements(PIXI,'shousha').background(s.texture,{width:300,height:150});assert.equal(bg.width,300);assert.equal(bg.height,150);assert.equal(bg.anchor.x,0);
});

test('shousha repositions artwork for the viewport without squeezing its texture',()=>{
 const ui=createLobbyElements(PIXI,'shousha');
 for(const [x,y] of [[1680/881*514/1103,1],[1920/1080*514/1103,1],[2,1]]){
  for(const name of ['mode1','mode2','mode3','mode4','under5','shop','bigmenu']){
   const node=ui.sprite({},name);ui.place(node,{x,y});
   assert.equal(node.scale.x,node.scale.y,name);
   assert.equal(node.x,ui.layout[name].x*x,name);
   assert.equal(node.y,ui.layout[name].y*y,name);
  }
 }
});
test('loading templates retain logo, progress and theme-specific tip styles',()=>{
 const ui=createLobbyElements(PIXI,'rzsh'),screen={width:1000,height:500};
 const logo=ui.idle({},screen,{x:.52,scale:.75}),bar=ui.idle({},screen,{y:.95,scale:.75});
 assert.deepEqual(logo.animation,[0,'idle',true]);assert.equal(logo.position.x,520);assert.equal(bar.position.y,475);
 const a=ui.tip(screen,{y:.91,fontSize:15,fill:'white'}),b=ui.tip(screen);
 assert.equal(a.position.y,455);assert.equal(a.style.fill,'white');assert.equal(b.style.fill,'#DAA520');assert.ok(lobbyLoadingTips.includes(a.text));
});

test('RZSH structural left rail spans the stage while adjacent icons stay proportional',()=>{
 const ui=createLobbyElements(PIXI,'rzsh');
 for(const [width,height] of [[1680,881],[1920,1080],[1280,720]]){
  const x=width/height*514/1103,y=1,rail=ui.sprite({},'left_fix');ui.place(rail,{x,y});
  const top=514*.0705+rail.y-750*rail.scale.y/2,bottom=top+750*rail.scale.y;
  assert.ok(top<=0&&bottom>=514*.91,`${width}x${height}: rail meets header and footer`);
  const icon=ui.sprite({},'maisui_btn');ui.place(icon,{x,y});assert.equal(icon.scale.x,icon.scale.y);
 }
});
test('checked-in scenes use common templates and regeneration is idempotent',()=>{
 for(const [kind,path,count]of [['rzsh','如真似幻/scenes.js',16],['shousha','手杀标准UI/native/lobby.js',13]]){
  const source=fs.readFileSync('apps/core/extension/ui/'+path,'utf8');
  assert.equal(fixLobbyElements(source,kind),source);
  assert.equal((source.match(/return sceneUI.sprite\(/g)||[]).length,count);
  assert.ok(!source.includes('三国杀是一款流行的桌面卡牌游戏'));
 }
});

test('RZSH keeps the hoisted decoders interleaved with its former layout declarations',()=>{
 const source=fs.readFileSync('apps/core/extension/ui/如真似幻/scenes.js','utf8').replaceAll('export ','');
 const reached=Symbol('shared layout reached');
 assert.throws(()=>vm.runInNewContext(source+'\ncreateScene({}, {}, {}, {}, {}, {}, {}, lifecycle);',{
  lifecycle:{window:{},timeout(){},interval(){},frame(){},sceneUI(){throw reached;}},
 },{timeout:3000}),error=>error===reached);
});

test('standalone bundling exposes the lightweight loading module as an independent entry',async()=>{
 const require=createRequire(fs.realpathSync('apps/core/node_modules/vite/package.json'));
 const {rollup}=require('rollup');
 const entry=path.resolve('apps/core/noname/ui/lobbyElements.js');
 const bundle=await rollup({input:{noname:'test-host','noname/ui/lobbyElements':entry},preserveEntrySignatures:'strict',treeshake:false,plugins:[{
  name:'test-host',resolveId(id){if(id==='test-host')return id;},load(id){if(id==='test-host')return 'export * from '+JSON.stringify(entry.replaceAll('\\','/'))+';';},
 }]});
 try{
  const {output}=await bundle.generate({format:'es',entryFileNames:'[name].js',chunkFileNames:'[name].js',preserveModules:false});
  const loading=output.find(item=>item.fileName==='noname/ui/lobbyElements.js');
  assert.ok(loading.exports.includes('createLobbyElements'));
  assert.deepEqual(loading.imports,[]);
  assert.ok(!loading.code.includes("from 'noname'"));
 }finally{await bundle.close();}
});
