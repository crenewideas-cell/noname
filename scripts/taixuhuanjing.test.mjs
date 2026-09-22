import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root=path.resolve('apps/core/mode/taixuhuanjing');
async function fixture() {
 const saved=[];
 const lib={config:{mode:'taixuhuanjing',mode_config:{taixuhuanjing:{}}},assetURL:'/',skill:{},card:{},translate:{},character:{},characterPack:{},element:{player:{}},skilllist:new Set(),init:{css(){}}};
 const game={saveConfig(key,value){lib.config[key]=value;saved.push(key);}},ui={},get={mode:()=>lib.config.mode,convertedCharacter(data){return {sex:data[0],group:data[1],hp:data[2],skills:[...data[3]],trashBin:data[4]};}};
 const context=vm.createContext({console,document:{createElement(){return {dataset:{}};},head:{append(){}}},navigator:{userAgent:'Desktop'},setTimeout,clearTimeout,setInterval,clearInterval});
 vm.runInContext('window=globalThis',context);
 const exports={lib,game,ui,get,ai:{},_status:{},subscribePresentation:()=>()=>{}};
 const host=new vm.SyntheticModule(Object.keys(exports),function(){for(const [key,value] of Object.entries(exports))this.setExport(key,value);},{context});
 const modules=new Map([['noname',host]]);
 async function load(file) {
  if(modules.has(file))return modules.get(file);
  const mod=new vm.SourceTextModule(await fs.readFile(file,'utf8'),{context,identifier:file});modules.set(file,mod);
  await mod.link((specifier,ref)=>specifier==='noname'?host:load(path.resolve(path.dirname(ref.identifier),specifier)));
  return mod;
 }
 const mod=await load(path.resolve('apps/core/mode/taixuhuanjing.js'));await mod.evaluate();
 return {lib,game,context,saved,create:mod.namespace.default};
}

test('importing/previewing the mode cannot activate rules or create a save',async()=>{
 const f=await fixture();
 assert.deepEqual(Object.keys(f.lib.skill),[]);assert.deepEqual(f.saved,[]);
 const mode=f.create();
 assert.equal(mode.name,'taixuhuanjing');
 assert.deepEqual(Object.keys(f.lib.skill),[]);assert.deepEqual(f.saved,[]);
 assert.equal(f.context.txhj,undefined);
});

test('one initialization loads every season and preserves a resumed challenge',async()=>{
 const f=await fixture(),mode=f.create();
 for(const card of Object.values(mode.card))assert.ok((await fs.stat(path.resolve('apps/core',card.image))).isFile(),card.image);
 const save={name:'caocao',servant:'lulu',coin:735,chapter:2,buff:['buff_txhj_aozhan']};
 f.lib.config.taixuhuanjing=save;
 Object.assign(f.lib.skill,mode.skill);Object.assign(f.lib.card,mode.card);
 mode.startBefore();
 assert.equal(Object.keys(f.game.seasonPack).length,8);
 assert.equal(Object.keys(f.game.NPCPack.character).length,320);
 for(const id of Object.keys(f.game.NPCPack.character))assert.ok((await fs.stat(path.resolve('apps/core',f.lib.character[id].img))).isFile(),id);
 assert.equal(Object.keys(f.game.buffPack).length,132);
 assert.equal(f.lib.config.taixuhuanjing,save);
 let created=0;
 f.game.createEvent=()=>{created++;return {finished:false,setContent(content){this.content=content;},goto(step){this.step=step;}};};
 f.game.chooseCharacterTaiXuHuanJing();
 const battle=f.context.txhj.battleEvent;
 f.game.chooseCharacterTaiXuHuanJing();
 assert.equal(created,1,'continuing cannot nest a second active battle');
 assert.equal(f.context.txhj.battleEvent,battle);
 assert.equal(battle.step,0,'the next encounter reuses the battle initialization');
 assert.equal(save.coin,735);
 assert.equal(f.lib.character.txhj_huangjinxinjun.img,'mode/taixuhuanjing/assets/image/loutou/txhj_huangjinxinjun.jpg');
 const state=f.context.txhj,enter=f.lib.skill._txhj_servant_enter,events=f.game.eventPack;
 mode.startBefore();
 assert.equal(f.context.txhj,state);assert.equal(f.lib.skill._txhj_servant_enter,enter);assert.equal(f.game.eventPack,events);
 const before=Object.keys(f.lib.skill).length;
 new f.context.Servant('lulu');new f.context.Servant('datong');
 assert.equal(Object.keys(f.lib.skill).length,before,'rendering cannot register gameplay');
 assert.equal(f.lib.config.taixuhuanjing,save);
});

test('runtime and assets are self-contained, with no legacy loader or UI rules dependency',async()=>{
 const files=JSON.parse(await fs.readFile(path.join(root,'assets/files.json'),'utf8'));
 assert.equal(new Set(files).size,files.length);
 for(const file of files)assert.ok((await fs.stat(path.join(root,'assets',file))).isFile(),file);
 const programs=(await fs.readdir(root,{recursive:true})).filter(file=>file.endsWith('.js'));
 for(const file of programs){
  const text=await fs.readFile(path.join(root,file),'utf8');
  assert.doesNotMatch(text,/lib\.init\.js\(|game\.import\(|game\.addMode\(|resolveLocalFileSystemURL|(?:\/|\\)temp(?:\/|\\)|extension\/(?:手杀|十周年|太虚幻境)/,file);
  const parsed=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  assert.equal(parsed.parseDiagnostics.length,0,file);
 }
 const servant=await fs.readFile(path.join(root,'servant-view.js'),'utf8');
 assert.doesNotMatch(servant,/lib\.skill|addSkill\(|saveConfig\(/);
 const source=await fs.readFile(path.join(root,'framework.js'),'utf8');
 assert.doesNotMatch(source,/lib\.character\[_status.choiceCharacter\]\[3\]\s*=/);
});
