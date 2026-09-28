import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.resolve('output/equipment-display');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage(),report={errors:[],checks:[]};
await context.routeWebSocket('**/*',socket=>socket.close());
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

 await page.evaluate(()=>{const{game,lib}=window.fxHost;for(const p of [game.me,game.players.find(p=>p!==game.me)])for(const name of ['zhuge','bagua','dilu','chitu','muniu']){const card=game.createCard(name,'spade',5);p.addVirtualEquip(new lib.element.VCard(card),[card]);}});
 async function inspect(name){await page.waitForTimeout(600);report[name]=await page.evaluate(()=>{const{game,ui,lib}=window.fxHost;return {layout:lib.config.layout,arena:ui.arena.className,body:document.body.dataset,players:[game.me,game.players.find(p=>p!==game.me)].map(p=>({position:p.dataset.position,rect:p.getBoundingClientRect().toJSON(),equips:p.node.equips.getBoundingClientRect().toJSON(),style:p.node.equips.style.cssText,cards:[...p.node.equips.children].map(c=>{const n=c.node.name2,r=n.getBoundingClientRect(),s=getComputedStyle(n),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {name:c.name,text:n.textContent,rowHeight:getComputedStyle(c).height,rect:c.getBoundingClientRect().toJSON(),label:r.toJSON(),style:{display:s.display,visibility:s.visibility,opacity:s.opacity,color:s.color,zIndex:s.zIndex},hit:hit?.className,shown:!!hit&&c.contains(hit),children:[...c.children].map(n=>({class:n.className,display:getComputedStyle(n).display,z:getComputedStyle(n).zIndex}))};})}))};});await page.screenshot({path:path.join(output,name+'.png')});
 for(const player of report[name].players){const cards=player.cards.filter(c=>!c.name.startsWith('empty_'));assert.ok(cards.length>0);for(const card of cards){assert.ok(Math.abs(parseFloat(card.rowHeight)-22)<.15 && card.rect.height>8,name+' '+card.name+' has row height');assert.ok(card.label.bottom<=player.equips.bottom+1,name+' label fits equipment container');assert.ok(card.shown,name+' '+card.name+' is visible and receives pointer hit');assert.ok(Math.min(...card.style.color.match(/\d+/g).slice(0,3).map(Number))>=150,name+' label contrasts with dark equipment background');}for(let i=1;i<cards.length;i++)assert.ok(cards[i].rect.top>=cards[i-1].rect.bottom-1,name+' rows do not overlap');}
 report.checks.push(name+': self and opponent equipment labels visible, separate, inside the panel');}

 await inspect('shousha-text');
 await page.evaluate(()=>{window.fxHost.game.me.node.equips.firstElementChild.classList.add('selected');});assert.notEqual(await page.locator('#arena>.player[data-position="0"]>.equips>.card.selected').evaluate(c=>getComputedStyle(c).boxShadow),'none');await page.evaluate(()=>window.fxHost.game.me.node.equips.firstElementChild.classList.remove('selected'));

 await page.evaluate(()=>window.fxHost.ui.arena.classList.toggle('textequip'));await inspect('shousha-picture');
 await page.evaluate(()=>{const{game,ui}=window.fxHost;const old=game.me.getVCards('e').find(c=>c.name==='zhuge');for(const c of [...game.me.node.equips.children])if(c.name==='zhuge')c.goto(ui.discardPile);game.me.removeVirtualEquip(old);game.me.directequip(game.createCard('qinggang','club',6));});await inspect('shousha-replaced');
 assert.ok(report['shousha-replaced'].players[0].cards.some(c=>c.name==='qinggang'));assert.ok(!report['shousha-replaced'].players[0].cards.some(c=>c.name==='zhuge'));
 await page.evaluate(()=>{const{game,ui}=window.fxHost;const old=game.me.getVCards('e').find(c=>c.name==='bagua');for(const c of [...game.me.node.equips.children])if(c.name==='bagua')c.goto(ui.discardPile);game.me.removeVirtualEquip(old);});await inspect('shousha-removed');assert.ok(!report['shousha-removed'].players[0].cards.some(c=>c.name==='bagua'));
 await page.setViewportSize({width:960,height:540});await inspect('shousha-small');await page.setViewportSize({width:1440,height:810});
 await page.evaluate(async()=>{const{shoushaManifest}=await import('/noname/ui/workshop/shoushaPreset.js');(await(await import('/extension/手杀标准UI/extension.js')).activate(shoushaManifest))();});
 await page.evaluate(async()=>{const manifest=await(await fetch('/extension/如真似幻/ui-workshop.json')).json();window.fxReleaseDecade=await(await import('/extension/十周年局内UI/extension.js')).activate(manifest);});await inspect('decade-picture');
 await page.evaluate(()=>window.fxHost.ui.arena.classList.add('textequip'));await inspect('decade-text');
 await page.setViewportSize({width:960,height:540});await inspect('decade-small');
 assert.deepEqual(report.errors,[]);
}catch(error){report.failure=error.stack;await page.screenshot({path:path.join(output,'failure.png')});throw error;}
finally{await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify({errors:report.errors,checks:report.checks,failure:report.failure}));}
