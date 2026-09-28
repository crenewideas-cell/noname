// Exercise bounded galleries with real extension registration and card renderers.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import os from 'node:os';
const require=createRequire(import.meta.url);
let playwright;
try { playwright=require('playwright'); } catch { playwright=require(process.env.PLAYWRIGHT_MODULE || path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CARD_AUDIT_BROWSER || (process.platform==='win32' ? path.join(process.env.ProgramFiles || 'C:/Program Files','Google/Chrome/Application/chrome.exe'):undefined)});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
const provider=process.env.AUDIT_PROVIDER || 'builtin-shousha-standard';
const enabled=['名将杀','华夏风云','卡牌扩展','星之梦','云中守望','极略','怒焰三国','梦澈涤花','活动武将','红楼幻境','清瑶葭绮'];
const report={provider,errors:[]};
page.on('pageerror',error=>report.errors.push(error.stack || String(error)));
page.on('dialog',dialog=>dialog.accept());
await page.route('**/game/config.json',async route=>{
 const response=await route.fetch(),config=await response.json();
 Object.assign(config,{extensions:enabled,extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard'],cards:['standard','extra'],ui_workshop_active:provider});
 for(const name of enabled)config['extension_'+name+'_enable']=true;
 await route.fulfill({response,json:config});
});
await page.route('**/api/**',route=>route.abort());
await page.routeWebSocket('**',route=>route.close());
await fs.mkdir('output',{recursive:true});
try {
 await page.goto((process.env.NONAME_CARD_TEST_ORIGIN || 'http://127.0.0.1:5176')+'/?lobbySettings=cards',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('html.lobby-settings-page .main.menu',{timeout:90000});
 report.stress=await page.evaluate(async()=>{
  const {lib,ui}=await import('/noname.js');ui.click.menuTab('卡牌');
  const nav=[...document.querySelectorAll('.menubutton')].filter(node=>lib.cardPack[node.mode]?.length);
  let switches=0,maxVisible=0,maxRetained=0;
  for(let round=0;round<6;round++)for(const node of nav){
   node.click();await new Promise(resolve=>requestAnimationFrame(resolve));switches++;
   const cards=[...node.link.querySelectorAll('.card-gallery-grid .card')];
   const expected=Math.min(72,lib.cardPack[node.mode].length);
   if(cards.length!==expected)throw Error(`${node.mode}: expected ${expected} cards, got ${cards.length}`);
   if(cards.some(card=>!card.name || !card.querySelector('.name')?.textContent.trim()))throw Error(`${node.mode}: uninitialized card`);
   const pane=node.link.closest('.right.pane').getBoundingClientRect();
   if(cards.some(card=>{const rect=card.getBoundingClientRect();return rect.width<20||rect.left<pane.left||rect.right>pane.right+1;}))throw Error(`${node.mode}: gallery overflows horizontally`);
   const retained=nav.filter(item=>item.link?.querySelector('.card-pack-gallery')).length;
   if(retained>3)throw Error(`retained ${retained} pack pages`);
   maxVisible=Math.max(maxVisible,cards.length);maxRetained=Math.max(maxRetained,retained);
  }
  const largest=nav.reduce((a,b)=>lib.cardPack[a.mode].length>lib.cardPack[b.mode].length?a:b);largest.click();
  const host=largest.link.querySelector('.card-pack-gallery'),grid=host.querySelector('.card-gallery-grid');
  const buttons=[...host.querySelectorAll('button')];
  const first=grid.querySelector('.card').name;
  buttons.find(button=>button.textContent==='下一页').click();
  if(first===grid.querySelector('.card').name)throw Error('pagination did not change cards');
  const search=host.querySelector('input');search.value=first;search.dispatchEvent(new Event('input'));
  if(![...grid.querySelectorAll('.card')].some(card=>card.name===first))throw Error('search result missing');
  const old=grid.firstChild;buttons.find(button=>button.textContent==='重新加载牌面').click();
  if(old===grid.firstChild)throw Error('retry did not rebuild cards');
  search.value='';search.dispatchEvent(new Event('input'));
  const standard=nav.find(node=>node.mode==='standard');standard.click();
  const id=standard.link.querySelector('.card').link[2];const key='identity_bannedcards',saved=lib.config[key];
  lib.config[key]=[id];nav.find(node=>node!==standard).click();standard.click();
  if(!standard.link.querySelector('.card').classList.contains('banned'))throw Error('nested banned status not updated');
  lib.config[key]=saved;
  return {switches,maxVisible,maxRetained,largest:{id:largest.mode,count:lib.cardPack[largest.mode].length},paging:true,search:true,reload:true,banned:true};
 });
 report.handArt=await page.evaluate(async()=>{
  const {game,ui}=await import('/noname.js');
  const holder=document.createElement('div');holder.className='handcards';ui.arena.append(holder);
  const card=game.createCard('仙露');holder.append(card);
  const style=getComputedStyle(card.querySelector('.image'));
  const result={top:style.top,left:style.left,fit:style.backgroundSize};holder.remove();return result;
 });
 assert.deepEqual(report.handArt,{top:'7px',left:'5px',fit:'contain'});
 for(const pack of ['红楼幻境','清瑶葭绮','import_223da38887','standard']){
  await page.evaluate(pack=>{const node=[...document.querySelectorAll('.menubutton')].find(node=>node.mode===pack);node.click();node.scrollIntoView({block:'nearest'});},pack);
  await page.evaluate(async()=>{
   const urls=[...document.querySelectorAll('.card-pack-page .card, .card-pack-page .card *')].flatMap(node=>[...getComputedStyle(node).backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)].map(match=>match[1]));
   await Promise.all([...new Set(urls)].map(url=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=()=>reject(Error(url));image.src=url;})));
  });
  const artwork=await page.evaluate(()=>[...document.querySelectorAll('.card-pack-page .card:is(.card-art-painting,.card-art-sprite)')].map(card=>{
   const frame=card.getBoundingClientRect(),art=card.querySelector('.image').getBoundingClientRect(),style=getComputedStyle(card.querySelector('.image'));
   return {id:card.name,inset:art.left>frame.left&&art.top>frame.top&&art.right<frame.right&&art.bottom<frame.bottom,fit:style.backgroundSize};
  }));
  for(const card of artwork){assert.equal(card.inset,true,card.id);assert.equal(card.fit,'contain',card.id);}
  (report.artwork ||= {})[pack]=artwork;
  await page.screenshot({path:`output/card-gallery-${provider}-${pack}.png`});
  await page.locator('.card-pack-page .card-gallery-grid').screenshot({path:`output/card-preview-${provider}-${pack}.png`});
 }
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify(report));
} finally {
 await fs.writeFile(`output/card-gallery-${provider}.json`,JSON.stringify(report,null,2));
 await browser.close();
}
