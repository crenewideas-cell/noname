import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(new URL('../packages/game-host/package.json', import.meta.url));
const { _electron, chromium } = require('playwright-core');
const out=resolve('output/selection-performance');
const only=process.argv.includes('--browser-only')?'browser':process.argv.includes('--desktop-only')?'desktop':null;
const versions={};
for(const name of await readdir('output/windows/win-unpacked/resources/app/extension')){
 try{const info=JSON.parse(await readFile(`output/windows/win-unpacked/resources/app/extension/${name}/info.json`,'utf8'));versions[`extension_${name}_changelog`]=info.version;}catch{}
}
await mkdir(out,{recursive:true});
const app=only==='browser'?null:await _electron.launch({executablePath:resolve(out,'electron-runtime/electron.exe'),args:[resolve('scripts/desktop-selection-harness.cjs')],env:{...process.env,NONAME_TEST_PROFILE:resolve(out,`parity-profile-${Date.now()}`)},timeout:60000});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--remote-debugging-port=19345']});
const report={cases:[],errors:[]};
try{
 const desktop=await app?.firstWindow();
 const ctx=await browser.newContext({viewport:{width:1296,height:748}});
 const web=await ctx.newPage();
 for(const [channel,page,origin] of [['desktop',desktop,'http://127.0.0.1:19089'],['browser',web,'http://127.0.0.1:8081']]){
  if(only&&channel!==only)continue;
  page.setDefaultTimeout(20000);
  page.on('dialog',dialog=>dialog.dismiss());
  page.on('pageerror',error=>{report.errors.push({channel,message:error.message});console.log('page error',channel,error.message);});
  for(const theme of ['builtin-rzsh','builtin-shousha-standard','builtin-decade-ingame']){
   console.log('testing',channel,theme);
   await page.goto(origin+'/game/config.json');
   await page.evaluate(async({versions,theme,channel})=>{
    localStorage.setItem('gplv3_noname_alerted','true');
    let prefix='noname_0.9_';
    if(typeof __dirname==='string'&&__dirname.length){for(const part of __dirname.split('/'))if(part)prefix+=/[a-z]/i.test(part[0])?part[0]:'_';prefix+='_';}
    const db=await new Promise((ok,fail)=>{const r=indexedDB.open(prefix+'data',4);r.onupgradeneeded=()=>{for(const name of ['image','audio','config','data'])if(!r.result.objectStoreNames.contains(name))r.result.createObjectStore(name);if(!r.result.objectStoreNames.contains('video'))r.result.createObjectStore('video',{keyPath:'time'});};r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error);});
    const config={...versions,new_tutorial:true,show_splash:'off',version:'1.11.6',mode:'identity',ui_workshop_active:theme,character_dialog_tool:'all',auto_confirm:false,free_choose_mode_config_identity:true,change_choice_mode_config_identity:true,player_number_mode_config_identity:'8',identity_mode_mode_config_identity:'normal',double_character_mode_config_identity:false,change_card_mode_config_identity:'disabled'};
    localStorage.setItem(prefix+'disable_extension','true');
    // Browser fixture matches the user's established View setting. Desktop
    // deliberately starts without it to exercise the packaged default repair.
    if(channel==='browser')config.showMax_character_number=10;
    await new Promise((ok,fail)=>{const tx=db.transaction('config','readwrite');tx.objectStore('config').clear();for(const [k,v]of Object.entries(config))tx.objectStore('config').put(v,k);tx.oncomplete=ok;tx.onerror=()=>fail(tx.error);});db.close();
   },{versions,theme,channel});
   console.log('seeded',channel,theme);
   await page.goto(origin+'/index.html');
   console.log('loaded',channel,theme);
   await page.screenshot({path:`${out}/${channel}-loaded.png`});
   await page.waitForFunction(()=>document.querySelector('#arena .button.character.selectable')||document.querySelector('#control .control')?.textContent==='确定',null,{timeout:120000,polling:500});
   const notice=page.locator('#control .control').filter({hasText:/^确定$/});
   if(await notice.count())await notice.click({force:true});
   await page.waitForSelector('#arena .button.character.selectable',{timeout:120000});
   await page.evaluate(async()=>{window.parityGame=await import('/noname.js');window.parityTasks=[];new PerformanceObserver(list=>window.parityTasks.push(...list.getEntries().map(e=>e.duration))).observe({type:'longtask'});});
   await page.waitForFunction(()=>window.parityGame.ui.cheat2&&!window.parityGame.ui.cheat2.classList.contains('disabled'));
   const start=Date.now();
   await page.locator('#control .control').filter({hasText:/^自由选将$/}).click({force:true});
   await page.waitForSelector('.character-browser-paged');
   await page.waitForTimeout(1000);
   const state=await page.evaluate(()=>{
    const {ui,lib}=window.parityGame,dialog=ui.dialog,pager=dialog.characterPager;
    const rect=n=>{const r=n.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(v=>Math.round(v*10)/10);};
    return {pageSize:pager.pageSize,total:pager.total,materialized:pager.isMaterialized,buttons:dialog.querySelectorAll('.button.character:not(.nodisplay)').length,domButtons:dialog.querySelectorAll('.button.character').length,dialog:rect(dialog),controls:rect(ui.control),first:rect(dialog.querySelector('.button.character:not(.nodisplay)')),theme:lib.config.ui_workshop_active,classes:dialog.className,longTasks:window.parityTasks};
   });
   assert.equal(state.pageSize,10);assert.equal(state.buttons,10);
   const entry={channel,theme,openWallMs:Date.now()-start,...state};report.cases.push(entry);
   await page.screenshot({path:`${out}/${channel}-${theme}.png`});
   for(const target of ['.page-next','.page-prev']){
    await page.locator('.character-browser '+target).click({force:true});
    assert.equal(await page.locator('.character-browser .button.character:not(.nodisplay)').count(),10);
   }
   await page.locator('.character-browser input').fill('^曹操$');await page.locator('.character-browser input').press('Enter');
   await page.waitForFunction(()=>[...document.querySelectorAll('.character-browser .button.character:not(.nodisplay)')].some(b=>b.link==='caocao'));
   const chosen=page.locator('.character-browser .button.character:not(.nodisplay)').filter({hasText:'曹操'}).first();
   const id=await chosen.evaluate(n=>n.link);await chosen.click({force:true});
   await page.locator('#control .control').filter({hasText:/^确定$/}).click({force:true});
   await page.waitForFunction(id=>window.parityGame.game.me?.name===id&&!window.parityGame.ui.arena.classList.contains('choose-character'),id,{timeout:45000,polling:250});
   entry.selected=id;entry.enteredMatch=true;
   console.log(JSON.stringify(entry));
  }
 }
 if(only==='desktop')report.cases.push(...JSON.parse(await readFile(`${out}/browser-parity.json`,'utf8')).cases);
 if(only!=='browser')for(const theme of ['builtin-rzsh','builtin-shousha-standard','builtin-decade-ingame']){
  const a=report.cases.find(c=>c.channel==='desktop'&&c.theme===theme),b=report.cases.find(c=>c.channel==='browser'&&c.theme===theme);
  for(const key of ['dialog','controls','first'])for(let i=0;i<4;i++)assert.ok(Math.abs(a[key][i]-b[key][i])<2,`${theme} ${key}[${i}] layout differs`);
 }
 report.passed=true;
}finally{await writeFile(`${out}/${only||'all'}-parity.json`,JSON.stringify(report,null,2));await browser.close();await app?.close();}
