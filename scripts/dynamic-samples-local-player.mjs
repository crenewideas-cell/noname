import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184',name='动态皮肤验证扩展',out='output/dynamic-samples';
await fs.mkdir(out,{recursive:true});
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
const reports=[];
try{for(const suite of process.argv.slice(2).length?process.argv.slice(2):['ingame']){
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),report={suite,errors:[],checks:[],missing:[]};reports.push(report);
 page.on('pageerror',e=>{report.errors.push(e.stack);console.log(e.message);});page.on('dialog',d=>{if(!d.message().startsWith('①无名杀是一款基于GPLv3协议的开源软件'))report.errors.push(d.message());void d.accept().catch(()=>{});});
 page.on('response',r=>{if(r.status()>=400&&decodeURI(new URL(r.url()).pathname).includes('/extension/'+name+'/'))report.missing.push(decodeURI(r.url()));});
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?route.abort():route.continue();});
 if(suite==='lobby')await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 await page.route('**/game/config.json',async route=>{
  const response=await route.fetch(),config=await response.json();
  Object.assign(config,{extensions:['千幻聆音',name],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:suite==='lobby'?'always':'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='lobby'?'builtin-rzsh':'builtin-decade-ingame',change_skin:true,change_skin_auto:'off',animation:true,low_performance:false});
  config.mode_config.identity={...config.mode_config.identity,player_number:'2',double_character:true};
  for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
  for(const row of installed)config['extension_'+row.name+'_enable']=['千幻聆音',name].includes(row.name);
  config['extension_'+name+'_enable']=true;await route.fulfill({response,json:config});
 });
 const load=async()=>{await page.evaluate(async()=>{window.__dynamicEnv=await import('/noname.js');});await page.waitForFunction(()=>window.__dynamicEnv.game.qhly_coreReady&&window.__dynamicEnv.game.localDynamicSkinTestHub?.packs['动态皮肤验证扩展']?.entries.length===64,null,{timeout:120000});};
 const setInteraction=async value=>page.evaluate(async value=>{const ext=await import('/extension/动态皮肤验证扩展/extension.js');ext.default().config.interaction.onclick(value);},value);
 const assertNoNewUI=async()=>{
  assert.equal(await page.locator('.local-dynamic-gallery,.local-dynamic-controls,.local-dynamic-interaction').count(),0);
  assert.equal(await page.locator('.local-dynamic-skin button,.local-dynamic-preview button').count(),0);
  assert.deepEqual(await page.evaluate(async()=>Object.keys((await import('/extension/动态皮肤验证扩展/extension.js')).default().config)),['interaction']);
 };

 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});await load();
  await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
  await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});
  await page.waitForFunction(()=>window.__dynamicEnv.game.players?.every(p=>p.name1),null,{timeout:60000});
  await page.evaluate(()=>{const{game,ui,_status}=window.__dynamicEnv;if(_status.auto)ui.click.auto();game.pause2();ui.arena.dataset.framedecoration='bronze';});
  const baseline=await page.evaluate(()=>{const {game}=window.__dynamicEnv;game.pause2();game.me.uninit();game.me.init('caocao');game.me.dataset.dynamicTest='me';game.me.node.framebg.style.cssText='display:block;background-image:url(/theme/style/player/bronze1.png)';return {height:game.me.offsetHeight,width:game.me.offsetWidth,right:game.me.getBoundingClientRect().right,ornaments:[...game.me.children].filter(n=>n.matches('.framebg,.identity,.hp,.count')).map(n=>[n.className,n.getBoundingClientRect().width,n.getBoundingClientRect().height])};});
  await page.evaluate(async()=>{(await import('/noname.js')).openCharacterSkins('caocao',undefined,'skin');});
  const cards=page.locator('.qh-skinchange-shousha-big-skin');
  for(const title of ['验证 · 珍珠号','验证 · c911_00','验证 · 卢莫愁']){
   await cards.filter({hasText:title}).click();
   await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
   const selected=await page.locator('.qh-image-standard iframe').evaluate(e=>new URL(e.src).searchParams.get('id'));
   // No default/apply button: native card selection must update the actual player immediately.
   await page.waitForFunction(id=>document.querySelector('#arena [data-dynamic-test=me] .local-dynamic-skin iframe[data-ready=true]')?.src.includes('id='+id),selected);
   await page.waitForFunction(()=>{const{game}=window.__dynamicEnv,a=document.querySelector('.qh-window.local-skin-landscape')?document.querySelector('.qh-image-standard'):document.querySelector('.qh-shousha-big-avatar'),n=game.me.querySelector('.local-dynamic-skin');return n&&Math.abs(a.offsetWidth/a.offsetHeight-n.offsetWidth/n.offsetHeight)<.006;});
   const sizes=await page.evaluate(()=>{const {game}=window.__dynamicEnv;const a=document.querySelector('.qh-window.local-skin-landscape')?document.querySelector('.qh-image-standard'):document.querySelector('.qh-shousha-big-avatar'),n=game.me.querySelector('.local-dynamic-skin');return {preview:a.offsetWidth/a.offsetHeight,player:n.offsetWidth/n.offsetHeight,height:game.me.offsetHeight,right:game.me.getBoundingClientRect().right};});
   assert.equal(sizes.height,baseline.height);assert.ok(Math.abs(sizes.right-baseline.right)<2);assert.ok(Math.abs(sizes.preview-sizes.player)<.02);
   const ornaments=await page.evaluate(()=>[...window.__dynamicEnv.game.me.children].filter(n=>n.matches('.framebg,.identity,.hp,.count')).map(n=>[n.className,n.getBoundingClientRect().width,n.getBoundingClientRect().height]));
   for(let i=0;i<ornaments.length;i++){assert.equal(ornaments[i][0],baseline.ornaments[i][0]);assert.ok(Math.abs(ornaments[i][1]-baseline.ornaments[i][1])<1);assert.ok(Math.abs(ornaments[i][2]-baseline.ornaments[i][2])<1);}
   const node=page.locator('#arena [data-dynamic-test=me] .local-dynamic-skin iframe'),frame=await (await node.elementHandle()).contentFrame();
   assert.ok(await frame.locator('[data-skin-surface]').count());
   if(title.includes('c911'))assert.ok(await frame.evaluate(()=>{const p=skinPlayer,b=p.fit,a=p.root.toGlobal({x:b.x,y:b.y}),z=p.root.toGlobal({x:b.x+b.width,y:b.y+b.height});return a.x>=-1&&a.y>=-1&&z.x<=innerWidth+1&&z.y<=innerHeight+1;}));
   const expected=title.includes('珍珠')?'main_1':title.includes('c911')?'talk_start':'Attack';
   await page.evaluate(()=>window.__dynamicEnv.game.localDynamicSkinTestHub.playEvent(window.__dynamicEnv.game.me,'card'));
   await frame.waitForFunction(expected=>skinPlayer.lastMotion===expected,expected);
   report.checks.push({title,immediate:true,sizes});
  }
  await assertNoNewUI();
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  // Exercise the engine compiler, not a direct call to the skill function.
  for(const[kind,expected,card='sha']of [['useCard','Attack'],['respond','Attack'],['useSkill','Skill'],['die','Kill'],['enterGame','Enter'],['useCard','Attack','tao'],['logSkill','Skill'],['gameStart','Enter']]){
   await page.evaluate(async({kind,card})=>{const{game,lib}=window.__dynamicEnv;const{GameEvent}=await import('/noname/library/element/gameEvent.ts');const e=new GameEvent('dynamicSkinRegression',false);e.player=game.me;e.triggername=kind==='die'?'dieAfter':kind;e._trigger={name:kind,player:game.me,source:game.me,card:{name:card}};e.waitNext=async()=>{};e.setContent(lib.skill._localDynamicTestEvents.content);await e.content(e);},{kind,card});
   const frame=await (await page.locator('#arena [data-dynamic-test=me] .local-dynamic-skin iframe').elementHandle()).contentFrame();
   await frame.waitForFunction(expected=>skinPlayer.lastMotion===expected,expected);
  }
  report.checks.push('card/response/skill/logSkill/kill/enter/gameStart execute with manual interaction disabled; ornaments retain native dimensions');
  await page.screenshot({path:out+'/local-player-framing.png'});
  await setInteraction(true);
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
  assert.equal(await page.locator('.qh-image-standard iframe').evaluate(n=>n.style.pointerEvents),'auto');
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  await page.locator('#arena [data-dynamic-test=me] > .avatar:not(.removing)').click({position:{x:60,y:90}});
  await page.locator('#qhly_playerwindowbtn2').click();
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
  const manual=await (await page.locator('.qh-image-standard iframe').elementHandle()).contentFrame();
  await manual.locator('[data-skin-surface]').click({position:{x:120,y:120}});
  await manual.waitForFunction(()=>skinPlayer.lastMotion==='Attack');
  await setInteraction(false);
  assert.equal(await page.locator('.qh-image-standard iframe').evaluate(n=>n.style.pointerEvents),'auto');
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  report.checks.push('manual toggle opens interaction view; menu interaction button reopens it; real mouse input plays a motion; session input is separate from saved preview toggle');
  await page.evaluate(()=>{const{game}=window.__dynamicEnv;const e=game.localDynamicSkinTestHub.packs['动态皮肤验证扩展'].entries.find(e=>e.id==='az_102089');game.qhly_setCurrentSkin('caocao',e.skinTitle+'.png');});
  await page.waitForFunction(()=>document.querySelector('#arena [data-dynamic-test=me] iframe[data-ready=true]')?.src.includes('id=az_102089'));
  const deathFrame=await (await page.locator('#arena [data-dynamic-test=me] iframe').elementHandle()).contentFrame();
  await page.evaluate(async()=>{const{game,lib}=window.__dynamicEnv;const{GameEvent}=await import('/noname/library/element/gameEvent.ts');const e=new GameEvent('deathRegression',false);e.player=game.me;e.triggername='dieBegin';e._trigger={name:'die',player:game.me,source:game.players.find(p=>p!==game.me)};e.waitNext=async()=>{};e.setContent(lib.skill._localDynamicTestEvents.content);await e.content(e);game.me.classList.add('dead');game.localDynamicSkinTestHub.refresh();});
  await deathFrame.waitForFunction(()=>skinPlayer.lastMotion==='dead');
  assert.equal(await page.locator('#arena [data-dynamic-test=me] iframe').count(),1);
  await page.waitForSelector('#arena [data-dynamic-test=me] .local-dynamic-skin',{state:'detached',timeout:16000});
  await page.evaluate(()=>{window.__dynamicEnv.game.me.classList.remove('dead');window.__dynamicEnv.game.localDynamicSkinTestHub.refresh();});
  await page.waitForSelector('#arena [data-dynamic-test=me] iframe[data-ready=true]');
  report.checks.push('native dead motion survives dead class, finishes and releases renderer without blocking game');
  await page.evaluate(()=>{const{game,lib}=window.__dynamicEnv;game.players=[...game.players.filter(p=>p!==game.me),game.me];const e=game.localDynamicSkinTestHub.packs['动态皮肤验证扩展'].entries[0];for(const p of game.players.filter(p=>p!==game.me&&p.name1!==game.me.name1))lib.config.qhly_skinset.skin[p.name1]=e.skinTitle+'.png';game.localDynamicSkinTestHub.refresh();});
  await page.waitForSelector('#arena [data-dynamic-test=me] .local-dynamic-skin iframe[data-ready=true]');assert.equal(await page.locator('#arena [data-dynamic-test=me] .local-dynamic-skin iframe[data-ready=true]').count(),1);
  assert.ok(await page.locator('#arena .local-dynamic-skin iframe').count()<=4);
  report.checks.push('local player keeps animation priority even when last in an eight-player list');
  await page.evaluate(()=>{const{game}=window.__dynamicEnv;game.me.classList.add('unseen');});
  await page.waitForSelector('#arena [data-dynamic-test=me] .local-dynamic-skin',{state:'detached'});
  assert.equal(await page.locator('#arena [data-dynamic-test=me]').evaluate(e=>e.offsetWidth),baseline.width);
  await page.evaluate(()=>window.__dynamicEnv.game.me.classList.remove('unseen'));
  await page.waitForSelector('#arena [data-dynamic-test=me] .local-dynamic-skin iframe[data-ready=true]');
  await page.evaluate(async()=>{(await import('/noname.js')).openCharacterSkins('caocao',undefined,'skin');});
  const leftArrow=page.locator('.qh-skinchange-shousha-bigarrow.left');
  await leftArrow.waitFor({state:'attached'});
  for(let i=0;i<64&&await leftArrow.getAttribute('data-visiable')==='true';i++)await leftArrow.click();
  await cards.filter({hasText:'经典形象'}).first().click();
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  await page.waitForSelector('#arena [data-dynamic-test=me] .local-dynamic-skin',{state:'detached'});
  assert.equal(await page.locator('#arena [data-dynamic-test=me]').evaluate(e=>e.offsetWidth),baseline.width);
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);
  report.checks.push('hidden/classic restore returns original player frame');
 }catch(error){report.failure=error.stack;console.log(error.stack);}
 finally{await fs.writeFile(out+'/local-player-report.json',JSON.stringify(reports,null,2));await context.close();}
 console.log(suite,report.checks);
}}finally{await browser.close();}
assert.ok(reports.every(r=>!r.failure),'Local player regression failed');
