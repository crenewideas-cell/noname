import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.resolve('output/ui-effects');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage(),report={errors:[],checks:[]};
page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_disable_extension','true'));
await page.route('**/game/config.json',async r=>{
 const response=await r.fetch(),config=await response.json();
 Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'off',mode:'identity',characters:['standard'],cards:['standard','extra'],ui_workshop_active:'builtin-shousha-standard'});
 config.mode_config.identity={...config.mode_config.identity,player_number:'5',double_character:false,change_card:'once',identity:'zhong'};
 for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
 await r.fulfill({response,json:config});
});
try{
 await page.goto(process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:5174/',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});await page.waitForSelector('.ss-player-frame');
 if(await page.locator('#extension-recovery summary').isVisible())await page.locator('#extension-recovery summary').click();
 await page.locator('#arena .button.character.selectable').first().click();
 await page.waitForSelector('#control [data-action="cancel"]',{timeout:60000});
 await page.evaluate(async()=>{const {game}=await import('/noname.js');game.pause2();window.fxHost=await import('/noname.js');});
 await page.waitForTimeout(6000);
 // Use the real throw renderer, retaining its returned node and engine queue.
 await page.evaluate(()=>{const {game,ui}=window.fxHost;window.fxCards=ui.thrown.slice();window.fxCard=game.me.$throw(game.createCard('sha'),2000);});
 await page.waitForFunction(()=>document.querySelectorAll('.ss-card-phantom').length===2);
 report.phantom=await page.evaluate(()=>[...document.querySelectorAll('.ss-card-phantom')].map(n=>{for(const a of n.getAnimations()){a.pause();a.currentTime=220;}const s=getComputedStyle(n),r=n.getBoundingClientRect();return {inert:n.inert,thrown:n.classList.contains('thrown'),art:n.style.getPropertyValue('--ss-card-art'),delays:n.getAnimations().map(a=>a.effect.getTiming().delay),width:s.width,height:s.height,opacity:s.opacity,visibility:s.visibility,rect:{x:r.x,y:r.y,width:r.width,height:r.height}};}));
 assert.ok(report.phantom.every(n=>n.inert&&!n.thrown&&n.art));assert.deepEqual(report.phantom.map(n=>n.delays[0]),[50,100]);
 assert.ok(report.phantom.every(n=>Math.abs(parseFloat(n.width)-108)<.1&&Math.abs(parseFloat(n.height)-150)<.1&&n.visibility==='visible'&&Number(n.opacity)>0));
 assert.equal(await page.evaluate(()=>window.fxHost.ui.thrown.filter(c=>!window.fxCards.includes(c)).length),1);
 await page.screenshot({path:path.join(output,'card-phantom.png')});
 await page.waitForSelector('.ss-card-phantom',{state:'detached'});report.checks.push('real core throw: two noninteractive delayed shades; engine discard queue unchanged; automatic cleanup');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(()=>window.fxHost.game.me.$throw(window.fxHost.game.createCard('shan'),1000));await page.waitForTimeout(100);
 assert.equal(await page.locator('.ss-card-phantom').count(),0);await page.emulateMedia({reducedMotion:'no-preference'});
 await page.evaluate(()=>window.fxHost.game.me.$throw(window.fxHost.game.createCard('tao'),2000));await page.waitForSelector('.ss-card-phantom');
 await page.evaluate(async()=>{const provider=await import('/extension/手杀标准UI/extension.js');const {shoushaManifest}=await import('/noname/ui/workshop/shoushaPreset.js');(await provider.activate(shoushaManifest))();});
 assert.equal(await page.locator('.ss-card-phantom').count(),0);report.checks.push('reduced motion suppresses shades; provider disposal removes active shades');
 // 如真似幻 uses this shared decade player presentation.
 await page.evaluate(async()=>{const manifest=await(await fetch('/extension/如真似幻/ui-workshop.json')).json();window.fxReleaseDecade=await(await import('/extension/十周年局内UI/extension.js')).activate(manifest);});
 await page.waitForSelector('.decade-frame');await page.waitForTimeout(700);
 report.dragon=await page.locator('.decade-frame').first().evaluate(n=>({art:getComputedStyle(n,'::after').backgroundImage,width:getComputedStyle(n,'::after').width,height:getComputedStyle(n,'::after').height}));
 assert.match(report.dragon.art,/dragon-jade-gold/);assert.ok(Math.abs(parseFloat(report.dragon.width)-55)<.1);assert.ok(Math.abs(parseFloat(report.dragon.height)-187)<.1);
 await page.screenshot({path:path.join(output,'jade-dragon-game.png')});
 await page.locator('#arena>.player').nth(1).screenshot({path:path.join(output,'jade-dragon-player.png')});
 await page.setViewportSize({width:960,height:540});await page.waitForTimeout(350);await page.screenshot({path:path.join(output,'jade-dragon-compact.png')});
 report.checks.push('如真似幻 manifest loads gold/jade dragon with original frame geometry at desktop and compact sizes');
 assert.deepEqual(report.errors,[]);
}catch(error){report.failure=error.stack;await page.screenshot({path:path.join(output,'failure.png')});throw error;}
finally{await fs.writeFile(path.join(output,'browser-report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));}
