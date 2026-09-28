import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
const require=createRequire(import.meta.url);
let playwright;
try { playwright=require('playwright'); }
catch { playwright=require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const executablePath=process.env.CARD_AUDIT_BROWSER || (process.platform==='win32' ? path.join(process.env.ProgramFiles || 'C:/Program Files','Google/Chrome/Application/chrome.exe') : undefined);
const browser = await playwright.chromium.launch({headless:true, executablePath});
await fs.mkdir('output',{recursive:true});
const page = await browser.newPage({viewport:{width:1920,height:1080}});
const report = {errors:[],dialogs:[]};
const tag = process.env.CARD_LIVE_TEST ? "live" : process.env.AUDIT_PROVIDER || "all";
page.on('pageerror', e => report.errors.push(e.stack || String(e)));
page.on('dialog', async d => {report.dialogs.push(d.message()); await d.accept();});
const installed = JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json'));
const bundled = JSON.parse(await fs.readFile('apps/core/game/bundled-extensions.json'));
const enabled = process.argv.slice(2).length ? process.argv.slice(2) : ['名将杀','华夏风云','卡牌扩展','星之梦','云中守望','极略','怒焰三国','梦澈涤花','活动武将'];
await page.route('**/game/config.json', async r => {
 const response = await r.fetch(), config = await response.json();
 Object.assign(config,{extensions:enabled,extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard'],cards:['standard','extra'],ui_workshop_active:process.env.AUDIT_PROVIDER||''});
 for(const name of [...installed.map(x=>x.name),...bundled]) config['extension_'+name+'_enable']=!process.env.CARD_LIVE_TEST && enabled.includes(name);
 await r.fulfill({response,json:config});
});
await page.route('**/api/**',r=>r.abort());
await page.routeWebSocket('**',r=>r.close());
try {
 await page.goto((process.env.NONAME_CARD_TEST_ORIGIN || 'http://127.0.0.1:5176')+'/?lobbySettings=cards',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('html.lobby-settings-page .main.menu',{timeout:90000});
 if(process.env.CARD_LIVE_TEST) {
  report.discovery=await page.evaluate(async()=>{
   const {lib,ui}=await import('/noname.js');
   const node=[...document.querySelectorAll('.menubutton')].find(n=>n.unloadedPack==='mjs');
   if(!node) throw Error('disabled extension discovery missing'); node.click();
   const hint=node.link.textContent; node.link.querySelector('.menubutton').click();
   return {hint,selected:!!document.querySelector('details[data-extension="名将杀"][open]'),loaded:!!lib.cardPack.mjs};
  });
  assert.equal(report.discovery.loaded,false);
  const group=page.locator('details[data-extension="名将杀"]');
  await group.locator('.config.toggle').filter({hasText:/^开启/}).first().click();
  await group.locator('[aria-busy="true"]').waitFor({state:'detached',timeout:60000});
  report.live=await page.evaluate(async()=>{
   const {lib,ui}=await import('/noname.js');ui.click.menuTab('卡牌');
   const nodes=[...document.querySelectorAll('.menubutton')].filter(n=>n.mode==='mjs');nodes[0]?.click();
   return {cards:lib.cardPack.mjs?.length,nodes:nodes.length,stubs:[...document.querySelectorAll('.menubutton')].filter(n=>n.unloadedPack==='mjs').length};
  });
  assert.deepEqual(report.live,{cards:88,nodes:1,stubs:0});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('html.lobby-settings-page .main.menu',{timeout:90000});
  report.restarted=await page.evaluate(async()=>{const {lib}=await import('/noname.js');return {parent:lib.config.extension_名将杀_enable,cards:lib.cardPack.mjs?.length,enabled:lib.config.cards.includes('mjs')};});
  assert.deepEqual(report.restarted,{parent:true,cards:88,enabled:true});
 }
 report.audit = await page.evaluate(async()=>{
  const {lib,game,ui,get}=await import('/noname.js');
  const packs=Object.fromEntries(Object.entries(lib.cardPack).map(([id,cards])=>[id,{count:cards.length,label:lib.translate[id+'_card_config'],menu:!![...document.querySelectorAll('.menubutton')].find(n=>n.mode===id)}]));
  const cards=[];
  for(const [pack,ids] of Object.entries(lib.cardPack)) for(const id of ids){
   const def=lib.card[id]; if(!def) continue;
   const node=game.createCard(id); document.body.append(node);
   const urls=[...new Set([node,...node.querySelectorAll('*')].flatMap(n=>[...getComputedStyle(n).backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)].map(m=>m[1])))];
   cards.push({pack,id,title:lib.translate[id],type:def.type,fullskin:def.fullskin,fullimage:def.fullimage,image:def.image,urls,description:lib.translate[id+'_info']}); node.remove();
  }
  return {packs,cards,imported:Object.keys(lib.imported.card||{}),all:lib.config.all.cards,mjs:{count:Object.keys(lib.cardPackInfo.mjs?.card||{}).length,base:Object.keys(lib.cardPackInfo.mjs?.card||{}).filter(id=>!id.startsWith('mjs003_')).length,pile:lib.cardPile.mjs?.length,enabled:lib.config.cards.includes('mjs')}};
 });
 const urls=[...new Set(report.audit.cards.flatMap(c=>c.urls))];
 report.images=await page.evaluate(async urls=>{
  const results=[]; for(let i=0;i<urls.length;i+=30) results.push(...await Promise.all(urls.slice(i,i+30).map(url=>new Promise(resolve=>{const img=new Image();setTimeout(()=>resolve({url,missing:true,timeout:true}),10000);img.onload=()=>resolve({url,width:img.naturalWidth,height:img.naturalHeight});img.onerror=()=>resolve({url,missing:true});img.src=url;})))); return results;
 },urls);
 const failed=new Set(report.images.filter(x=>x.missing).map(x=>x.url));
 report.issues=report.audit.cards.filter(c=>!c.title||(c.title===c.id&&/^[a-zA-Z0-9_]+$/.test(c.id))||c.urls.some(u=>failed.has(u))||(!c.fullskin&&!c.fullimage&&!c.image));
 for(const id of ['mjs','hxfy','standard','import_223da38887','import_693c2a1cfb','mode_derivation']) {
  await page.evaluate(async id=>{const {ui}=await import('/noname.js');ui.click.menuTab('卡牌');[...document.querySelectorAll('.menubutton')].find(n=>n.mode===id)?.click();},id);
  if(id==='standard'&&process.env.AUDIT_PROVIDER){
   await page.waitForFunction(()=>document.querySelector('.card-pack-page .card:is(.decade-card,.ss-card-art)'));
   report.printedLabels=await page.evaluate(()=>[...document.querySelectorAll('.card-pack-page .card:is(.decade-card,.ss-card-art)')].every(c=>getComputedStyle(c.querySelector('.info')).display==='none'));
   assert.equal(report.printedLabels,true);
  }
  await page.screenshot({path:`output/card-art-${tag}-${id}.png`});
 }
 report.missingPortraitSources=report.issues.filter(c=>c.type==='character');
 report.cardIssues=report.issues.filter(c=>c.type!=='character');
 assert.deepEqual(report.issues,[]);
 assert.deepEqual(report.errors,[]);
} finally {
 await fs.writeFile(`output/card-art-${tag}-audit.json`,JSON.stringify(report,null,2));
 console.log(JSON.stringify({packs:report.audit?.packs,issues:report.issues?.map(({pack,id,title,image})=>({pack,id,title,image})),errors:report.errors,dialogs:report.dialogs}));
 await browser.close();
}


