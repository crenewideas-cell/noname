import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const {chromium}=playwright;
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const out='output/qianhuan-menu';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
const reports=[];
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));

try {for(const suite of process.argv.slice(2).length?process.argv.slice(2):['decade','shousha','touch']) {
 const touch=suite==='touch', context=await browser.newContext({viewport:{width:1440,height:810},hasTouch:touch});
 const page=await context.newPage(), report={suite,errors:[],checks:[]};reports.push(report);page.setDefaultTimeout(12000);
 page.on('pageerror',e=>{report.errors.push(e.stack);console.error(e.stack)});page.on('dialog',d=>d.accept());
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue()});
 await page.route('**/game/config.json',async r=>{const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='decade'?'builtin-decade-ingame':'builtin-shousha-standard',change_skin:true,change_skin_auto:'off',touchscreen:touch,hover_all:false,right_info:true,longpress_info:true,qhly_smallwindowstyle:'shousha',qhly_currentViewSkin:'shousha'});config.mode_config.identity={...config.mode_config.identity,player_number:'2',double_character:true};for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;for(const row of installed)config['extension_'+row.name+'_enable']=row.name==='千幻聆音';await r.fulfill({response,json:config});});
 try {
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
  await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto('forced');});
  await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.players?.length&&game.players.every(p=>p.name1&&p.name2);},null,{timeout:60000});
  await page.evaluate(async()=>{const{game,ui,_status}=await import('/noname.js');if(_status.auto)ui.click.auto('forced');game.pause2();game.me.init('caocao','guojia');game.me.dataset.menuTest='self';ui.arena.classList.remove('selecting');game.me.classList.remove('selectable','target');});
  const activate=async locator=>touch?locator.tap():locator.click();
  const avatar=page.locator('[data-menu-test="self"]>.avatar:not(.removing)'),deputy=page.locator('[data-menu-test="self"]>.avatar2:not(.removing)');
  const open=async(portrait=avatar)=>{await activate(portrait);await page.locator('#qhly_playerwindowbtn0').waitFor();};
  const closeInfo=async()=>{await activate(page.locator('.qh-back'));await page.locator('.qh-background').waitFor({state:'detached'});};
  const originalLayer=await avatar.evaluate(el=>({z:el.parentElement.style.zIndex,transition:el.parentElement.style.transitionProperty}));
  await open();await page.screenshot({path:out+'/'+suite+'-menu.png'});
  report.hit=await page.locator('#qhly_playerwindowbtn0').evaluate(el=>{const r=el.getBoundingClientRect();return {rect:r.toJSON(),hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.outerHTML,style:getComputedStyle(el).pointerEvents,parent:getComputedStyle(el.parentElement).pointerEvents,player:getComputedStyle(el.parentElement.parentElement).pointerEvents,ancestors:[el,el.parentElement,el.parentElement.parentElement,el.parentElement.parentElement.parentElement].map(n=>({class:n.className,style:n.getAttribute('style'),z:getComputedStyle(n).zIndex,transform:getComputedStyle(n).transform})),bg:getComputedStyle(document.querySelector('#qhly_bigBackground')).zIndex};});assert.equal(report.hit.style,'auto');assert.match(report.hit.hit,/qhly_playerwindowbtn0/);
  await activate(page.locator('#qhly_playerwindowbtn0'));await page.locator('.qh-window').waitFor();
  const profileCards=page.locator('.qh-skinchange-shousha-big-skin');
  await profileCards.nth(1).waitFor();
  const originalSelected=await page.locator('.qh-skinchange-shousha-big-skin.sel').getAttribute('id');
  const originalPreview=await page.locator('.qh-image-standard').evaluate(n=>n.style.backgroundImage);
  await activate(page.locator('.qh-skinchange-shousha-bigarrow:not(.left)'));
  await page.waitForFunction(id=>document.querySelector('.qh-skinchange-shousha-big-skin.sel')?.id!==id,originalSelected);
  assert.equal(Number((await page.locator('.qh-skinchange-shousha-big-skin.sel').getAttribute('id')).slice(12)),Number(originalSelected.slice(12))+1);
  await page.waitForFunction(bg=>document.querySelector('.qh-image-standard')?.style.backgroundImage!==bg,originalPreview);
  await activate(page.locator('.qh-skinchange-shousha-bigarrow.left'));
  await page.waitForFunction(id=>document.querySelector('.qh-skinchange-shousha-big-skin.sel')?.id===id,originalSelected);
  report.checks.push('profile arrows select exactly one adjacent skin and update the main preview on mouse/touch');
  assert.match(await page.locator('.qh-window').innerText(),/奸雄/);await page.screenshot({path:out+'/'+suite+'-info.png'});await closeInfo();report.checks.push('actual portrait and info button click opens native profile');
  await open();await activate(page.locator('#qhly_playerwindowbtn1'));await page.locator('.qh-skinchange-shousha-dialog').waitFor();await page.screenshot({path:out+'/'+suite+'-skin.png'});report.checks.push('actual skin button click opens native hand window');
  const closeSmall=async()=>{const back=page.locator('.qh-skinchange-shousha-background');if(touch)await back.tap({position:{x:5,y:5}});else await back.click({position:{x:5,y:5}});await page.locator('.qh-skinchange-shousha-dialog').waitFor({state:'detached'});};
  const cards=page.locator('.qh-skinchange-shousha-area1 .qh-skinchange-shousha-skin');
  await cards.nth(1).waitFor();await activate(page.locator('.qh-skinchange-shousha-arrow:not(.left)[data-visiable=true]'));
  await page.waitForFunction(()=>document.querySelectorAll('.qh-skinchange-shousha-area1 .qh-skinchange-shousha-skin')[1]?.defaultskin?.getAttribute('data-sel')==='true');
  await page.waitForFunction(async()=>{const{lib,getSkinService,game}=await import('/noname.js');const path=getSkinService().current('caocao');return lib.config.qhly_skinset.skin.caocao&&path&&decodeURI(game.me.node.avatar.style.backgroundImage).includes(path);},null,{timeout:25000});
  await closeSmall();
  await open();await activate(page.locator('#qhly_playerwindowbtn1'));await cards.first().waitFor();await activate(page.locator('.qh-skinchange-shousha-arrow.left[data-visiable=true]'));
  await page.waitForFunction(async()=>{const{lib,getSkinService}=await import('/noname.js');return !lib.config.qhly_skinset.skin.caocao&&!getSkinService().current('caocao');});
  await activate(page.locator('.qh-skinchange-shousha-enlarge'));await page.locator('.qh-window').waitFor();await closeInfo();
  report.checks.push('skin selection refreshes actual avatar; classic reset; enlarge and close work');
  await open(deputy);await activate(page.locator('#qhly_playerwindowbtn0'));await page.locator('.qh-window').waitFor();assert.match(await page.locator('.qh-window').innerText(),/天妒/);await closeInfo();
  await open(deputy);await activate(page.locator('#qhly_playerwindowbtn1'));await page.locator('.qh-skinchange-shousha-area2 .qh-skinchange-shousha-skin').nth(1).waitFor();assert.equal(await page.locator('.qh-skinchange-shousha-cover').getAttribute('data-visible'),'2');await closeSmall();
  report.checks.push('both secondary menu buttons resolve deputy and deputy skin tab');
  // Reproduce the old player-intro gesture through real browser input.
  if(touch){const box=await avatar.boundingBox();const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});await page.waitForTimeout(650);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
  else await avatar.click({button:'right'});
  await page.locator('.qh-window').waitFor();assert.equal(await page.locator('#nodeintro').count(),0);assert.match(await page.locator('.qh-window').innerText(),/奸雄/);await closeInfo();
  report.checks.push('old player-intro gesture opens native skill page with no legacy nodeintro');
  const guards=await page.evaluate(async()=>{const{game,ui,_status,lib}=await import('/noname.js');const{openPlayerSkinMenu}=await import('/noname/skin/qianhuan/index.js');const p=game.me,a=p.node.avatar;const result=[];
   p.classList.add('unseen');p.classList.add('unseen2');result.push(openPlayerSkinMenu(a));ui.click.intro.call(p,{stopPropagation(){}});result.push(!!document.querySelector('.qh-window,#nodeintro'));p.classList.remove('unseen','unseen2');
   p.classList.add('selectable');result.push(openPlayerSkinMenu(a));p.classList.remove('selectable');
   ui.arena.classList.add('selecting');result.push(openPlayerSkinMenu(a));ui.arena.classList.remove('selecting');
   _status.dragged=true;result.push(openPlayerSkinMenu(a));_status.dragged=false;
   return {result,paused:_status.paused2,hover:ui.click.hoverplayer.call(p)};});assert.ok(guards.result.every(v=>v===false));assert.equal(guards.paused,true);assert.equal(guards.hover,undefined);
  report.checks.push('hidden identities stay hidden; selecting/dragging guards; previous pause preserved; legacy hover suppressed');
  await open();const bg=page.locator('#qhly_bigBackground');if(touch)await bg.tap({position:{x:10,y:10}});else await bg.click({position:{x:10,y:10}});await page.locator('#qhly_playerwindowbg').waitFor({state:'detached'});
  await page.evaluate(async()=>{const{game}=await import('/noname.js');game.me.uninit();game.me.init('caocao');});
  assert.equal(await page.evaluate(async()=>!!(await import('/noname.js')).game.me.name2),false);
  await open();await activate(page.locator('#qhly_playerwindowbtn1'));
  await cards.nth(1).waitFor();
  await activate(page.locator('.qh-skinchange-shousha-arrow:not(.left)[data-visiable=true]'));
  await page.waitForFunction(async()=>{const{game,lib,getSkinService}=await import('/noname.js');const current=getSkinService().current('caocao');return lib.config.qhly_skinset.skin.caocao&&current&&decodeURI(game.me.node.avatar.style.backgroundImage).includes(current);});
  await activate(page.locator('.qh-skinchange-shousha-arrow.left[data-visiable=true]'));
  await page.waitForFunction(async()=>!(await import('/noname.js')).game.qhly_getSkin('caocao'));
  await closeSmall();
  report.checks.push('single-general skin window opens without a deputy list; next/previous skin and avatar updates work');
  await open();await activate(page.locator('#qhly_playerwindowbtn0'));await page.locator('.qh-window').waitFor();await closeInfo();
  report.checks.push('outside dismissal restores menu and single-general reinitialization works');
  assert.deepEqual(await avatar.evaluate(el=>({z:el.parentElement.style.zIndex,transition:el.parentElement.style.transitionProperty})),originalLayer);
  assert.deepEqual(report.errors,[]);
 }catch(e){report.failure=e.stack;await page.screenshot({path:out+'/'+suite+'-failure.png'});console.error(e.stack);}finally{await context.close();await fs.writeFile(out+'/report.json',JSON.stringify(reports,null,2));}
}}finally{await browser.close();}
console.log(JSON.stringify(reports,null,2));if(reports.some(r=>r.failure))process.exitCode=1;
