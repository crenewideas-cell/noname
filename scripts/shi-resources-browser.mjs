import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8081';
const output='output/shi-resource-import';await fs.mkdir(output,{recursive:true});
const manifest=JSON.parse(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/势武将资源补充/resource-manifest.json'));
const report={static:[],dynamic:[],errors:[]};
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 await context.route('**/*',route=>new URL(route.request().url()).hostname!=='127.0.0.1'?route.abort():route.fallback());
 await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 await page.route('**/game/config.json',async route=>{
  const response=await route.fetch(),config=await response.json();
  Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard','mobile','bingshi'],cards:['standard'],ui_workshop_active:'builtin-rzsh',change_skin:true,change_skin_auto:'off',animation:true,low_performance:false});
  for(const key of Object.keys(config))if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=key==='extension_千幻聆音_enable';
  await route.fulfill({response,json:config});
 });
 page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#splash canvas',{timeout:120000});
 await page.evaluate(async()=>{window.__env=await import('/noname.js');await __env.game.localDynamicPacksReady;});
 for(const {characterId,title} of manifest.staticSkins){
  const row=await page.evaluate(async({characterId,title})=>{
   const {game}=__env;
   const list=await new Promise(resolve=>game.qhly_getSkinList(characterId,(ok,list)=>resolve(list||[])));
   const file=list.find(f=>f===title+'.jpg');
   if(!file)throw Error(characterId+' missing '+title+' in '+list);
   const path=game.qhly_getSkinFile(characterId,file);
   const image=new Image();image.src=path;await image.decode();
   await new Promise(resolve=>game.qhly_setCurrentSkin(characterId,file,resolve));
   return{characterId,title,path,width:image.naturalWidth,audio:Object.entries(__env.lib.config.qhly_skinset.audioReplace).filter(([,v])=>v.includes('/'+title+'/')).length};
  },{characterId,title});
  assert.ok(row.width>0);report.static.push(row);console.log('static',row.characterId,row.title,row.audio);
 }
 for(const expected of manifest.dynamicEntries){
  await page.evaluate(()=>__env.openCharacterSkins('mb_caomao',undefined,'skin'));
  await page.waitForSelector('.qh-skinchange-shousha-big-skin',{timeout:30000});
  const token=await page.evaluate(id=>__env.game.localDynamicSkinTestHub.listSkins('mb_caomao').find(e=>e.id===id).token,expected.id);
  await page.locator('.qh-skinchange-shousha-big-skin').evaluateAll((cards,token)=>{
   const card=cards.find(card=>card.skin?.skinId===token);
   if(!card)throw Error('Missing dynamic card '+token+' '+JSON.stringify(cards.map(c=>c.skin)));
   card.click();
  },token);
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]',{timeout:60000});
  const frame=await (await page.locator('.qh-image-standard iframe').elementHandle()).contentFrame();
  await frame.waitForFunction(id=>window.skinPlayer?.entry.id===id,expected.id,{timeout:60000});
  const actual=await frame.evaluate(()=>({id:skinPlayer.entry.id,voices:skinPlayer.info().voices.length,bounds:skinPlayer.fit}));
  assert.equal(actual.voices,expected.voices);report.dynamic.push(actual);console.log('dynamic',actual.id,actual.voices);
  await page.screenshot({path:output+'/'+expected.id+'.png'});
  await page.evaluate(()=>document.querySelector('.qh-skinchange-shousha')?.close?.());
 }
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify(report));
}finally{await fs.writeFile(output+'/browser.json',JSON.stringify(report,null,2));await browser.close();}
