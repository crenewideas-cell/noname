import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { builtinPacks } from "../apps/core/noname/ui/workshop/presets.js";
import { validateManifest } from "../apps/core/noname/ui/workshop/schema.js";
import {MAX_PROVIDER_BYTES,MAX_PROVIDER_FILES} from "../apps/core/noname/ui/workshop/largeArchive.js";
import {classifiedExtensionsPlugin} from './extension-layout.mjs';

async function serviceFixture() {
 const config={ui_workshop_catalog:[]}, records=new Map();
 const lib={config,configMenu:{appearence:{config:{}}},db:{transaction(){
  const tx={objectStore(store){return {put(value,key){if(store==="data")records.set(key,local(value));},delete(key){records.delete(key);}};},abort(){tx.onabort?.();}};
  queueMicrotask(()=>tx.oncomplete?.());return tx;
 }}};
 const game={getDB:async(store,key)=>records.get(key)};
 const context=vm.createContext({Blob,URL,crypto:globalThis.crypto,console,localStorage:{setItem(){},removeItem(){}},setTimeout,clearTimeout});
 const noname=new vm.SyntheticModule(["lib","game"],function(){this.setExport("lib",lib);this.setExport("game",game);},{context});
 const modules=new Map([["noname",noname]]);
 async function load(filename){
  if(modules.has(filename))return modules.get(filename);
  const mod=new vm.SourceTextModule(await fs.readFile(filename,"utf8"),{context,identifier:filename});modules.set(filename,mod);
  await mod.link((specifier,ref)=>specifier==="noname"?noname:load(path.resolve(path.dirname(ref.identifier),specifier)));return mod;
 }
 const mod=await load(path.resolve("apps/core/noname/ui/workshop/service.js"));await mod.evaluate();
 // Construct records inside the module's realm; schema intentionally rejects foreign prototypes.
 const local=value=>vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`,context);
 return {api:mod.namespace,lib,records,local};
}
test("quick switching builtins is idempotent and does not save copies",async()=>{
 const {api,lib,records}=await serviceFixture();
 for(let i=0;i<8;i++){await api.usePack("builtin-blue");await api.usePack("builtin-shousha-standard");await api.usePack("builtin-shousha-standard");}
 assert.equal(lib.config.ui_workshop_catalog.length,0);assert.equal(records.size,0);
 assert.equal(lib.config.ui_workshop_active,"builtin-shousha-standard");assert.equal(lib.config.ui_workshop_previous,"builtin-blue");
 await api.undoPack();assert.equal(lib.config.ui_workshop_active,"builtin-blue");
});
test("saved packs apply without copies; editing active or undo packs preserves snapshots",async()=>{
 const {api,lib,local}=await serviceFixture();
 const input=local(builtinPacks()[2]);input.manifest.id="personal";
 const original=await api.savePack(input);await api.usePack(original.manifest.id);
 for(let i=0;i<5;i++){await api.usePack("builtin-blue");await api.usePack(original.manifest.id);}
 assert.equal(lib.config.ui_workshop_catalog.length,1);
 input.manifest.name="我的修改";const edited=await api.savePack(input);
 assert.notEqual(edited.manifest.id,original.manifest.id);
 assert.notEqual((await api.readPack(original.manifest.id)).manifest.name,edited.manifest.name);
});
test("repair exact legacy builtin copies, preserve edited/renamed packs and undo targets",async()=>{
 const {api,lib,local,records}=await serviceFixture();
 for(let i=0;i<4;i++){
  const input=local(builtinPacks().find(pack=>pack.manifest.id==="builtin-blue"));input.manifest.id=`old-${i}`;
  if(i===3)input.manifest.name="自定义蓝色";
  await api.savePack(input);
 }
 lib.config.ui_workshop_active="old-1";lib.config.ui_workshop_previous="old-2";
 await api.repairBuiltinCopies();
 assert.deepEqual(Array.from(lib.config.ui_workshop_catalog,x=>x.id),["old-3"]);
 assert.equal(lib.config.ui_workshop_active,"builtin-blue");assert.equal(lib.config.ui_workshop_previous,"builtin-blue");
 assert.equal(records.size,4);await api.repairBuiltinCopies();assert.equal(records.size,4);
});
test("shousha declarations reject room runtime and arbitrary code providers",()=>{
 const manifest=builtinPacks()[0].manifest;validateManifest(manifest);
 manifest.components.lobby={runtime:"shousha"};assert.throws(()=>validateManifest(manifest));
 delete manifest.components.lobby;manifest.components.home.runtime="arbitrary.js";assert.throws(()=>validateManifest(manifest));
});
test("repair also merges identical legacy custom copies without merging different names",async()=>{
 const {api,lib,local}=await serviceFixture();
 for(let i=0;i<3;i++){
  const pack=local(builtinPacks().find(pack=>pack.manifest.id==="builtin-blue"));pack.manifest.id=`custom-${i}`;
  pack.manifest.name=i===2?"另一个名字":"自定义蓝色";pack.manifest.components.home.style.color="#aabbcc";
  await api.savePack(pack);
 }
 lib.config.ui_workshop_active="custom-1";await api.repairBuiltinCopies();
 assert.equal(lib.config.ui_workshop_active,"custom-0");assert.equal(lib.config.ui_workshop_catalog.length,2);
});
test("migrated file inventory and every copied resource are self-contained",async()=>{
 const base=path.resolve("apps/core/extension/ui/手杀标准UI");
 const files=JSON.parse(await fs.readFile(path.join(base,"files.json"),"utf8"));
 assert.ok(files.length<=MAX_PROVIDER_FILES);assert.equal(new Set(files).size,files.length);let bytes=0;
 for(const file of files){assert.ok(!/(^\/|\\|:|\0|(^|\/)\.\.?($|\/))/.test(file));bytes+=(await fs.stat(path.join(base,file))).size;}
 assert.ok(bytes<=MAX_PROVIDER_BYTES);
 // The full provider replaced the old surface-only resources.json index.
 for(const file of ['native-runtime.js','native/core-ui.js','original/皮肤切换/style/adjustBox.css','original/皮肤切换/saveSkinParams.js','original/千幻聆音/skinEdit.js','original/千幻聆音/skinChange.js','original/十周年UI/player_new.css'])assert.ok(files.includes(file),file);
 for(const file of ['extension.js','native-runtime.js','native/resources.js','native/portraits.js'])assert.doesNotMatch(await fs.readFile(path.join(base,file),'utf8'),/(?:\.\.\/|\/|\\)temp(?:\/|\\)/);
});

test('match portraits crop wide and tall art uniformly without changing the frame texture',async()=>{
 const canvases=[];
 class ImageFixture{
  set src(value){this.naturalWidth=value.includes('wide')?600:200;this.naturalHeight=value.includes('wide')?200:600;queueMicrotask(()=>this.onload?.());}
  removeAttribute(){}
 }
 const context=vm.createContext({console,setTimeout,clearTimeout,Image:ImageFixture,document:{createElement(){
  const canvas={width:0,height:0,draws:[],getContext(){return {fillRect(){},clearRect(){},drawImage(image,x,y,w,h){canvas.draws.push({sw:image.naturalWidth,sh:image.naturalHeight,x,y,w,h});}};}};
  canvases.push(canvas);return canvas;
 }}});
 const mod=new vm.SourceTextModule(await fs.readFile('apps/core/extension/ui/手杀标准UI/native/portraits.js','utf8'),{context});
 await mod.link(()=>{throw new Error('Unexpected dependency');});await mod.evaluate();
 const store=mod.namespace.createPortraitTextures({PIXI:{Texture:{from:canvas=>({canvas,baseTexture:{update(){}},destroy(){}})}},character:()=>({sex:'male'}),assetURL:'/',defaultPath:'fallback/',url:x=>x});
 for(const name of ['wide','tall'])store.get(name,{width:166,height:190,priority:true});
 await new Promise(resolve=>setTimeout(resolve,0));
 for(const canvas of canvases){
  assert.equal(canvas.width,332);assert.equal(canvas.height,380);assert.equal(canvas.draws.length,1);
  const draw=canvas.draws[0];assert.equal(draw.w/draw.sw,draw.h/draw.sh);
  assert.ok(draw.w>=canvas.width&&draw.h>=canvas.height);
  assert.equal(draw.x,(canvas.width-draw.w)/2);assert.equal(draw.y,(canvas.height-draw.h)/2);
 }
 store.dispose();
});

test('classified extension edits invalidate logical modules and CSS imports resolve on disk',()=>{
 const core=path.resolve('apps/core'),plugin=classifiedExtensionsPlugin(core);
 const logical=path.join(core,'extension/手杀标准UI/original/十周年UI/splash.js').replaceAll('\\','/');
 const physical=path.join(core,'extension/ui/手杀标准UI/original/十周年UI/splash.js');
 const module={id:logical+'?nativeRevision=1'},invalidated=[];
 const affected=plugin.handleHotUpdate({file:physical,modules:[],server:{moduleGraph:{idToModuleMap:new Map([[module.id,module]]),invalidateModule:node=>invalidated.push(node)}}});
 assert.deepEqual(affected,[module]);assert.deepEqual(invalidated,[module]);
 assert.equal(plugin.resolveId('/extension/手杀标准UI/original/十周年UI/player_new.css?direct'),path.join(core,'extension/ui/手杀标准UI/original/十周年UI/player_new.css').replaceAll('\\','/')+'?direct');
});
