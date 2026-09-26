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
try{for(const suite of process.argv.slice(2).length?process.argv.slice(2):['lobby','ingame']){
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),report={suite,errors:[],checks:[],missing:[]};reports.push(report);
 page.on('pageerror',e=>{report.errors.push(e.stack);console.log(e.message);});page.on('dialog',d=>void d.accept().catch(()=>{}));
 page.on('response',r=>{if(r.status()>=400&&decodeURI(r.url()).includes(name))report.missing.push(decodeURI(r.url()));});
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
  if(suite==='lobby')await page.waitForSelector('#splash canvas',{timeout:90000});
  else{
   await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
   await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});
   await page.waitForFunction(()=>window.__dynamicEnv.game.players?.length&&window.__dynamicEnv.game.players.every(p=>p.name1&&p.name2),null,{timeout:60000});
   await page.evaluate(async()=>{const{game}=await import('/noname.js');game.pause2();game.me.init('caocao','sunquan');game.me.dataset.dynamicTest='me';});
  }
  await assertNoNewUI();
  await page.evaluate(async()=>{(await import('/noname.js')).openCharacterSkins('caocao',undefined,'skin');});
  const cards=page.locator('.qh-skinchange-shousha-big-skin');
  await cards.filter({hasText:'验证 · 珍珠号'}).click();
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]',{timeout:30000});
  assert.equal(await cards.filter({hasText:'验证 · '}).count(),64);
  assert.equal(await page.locator('.qh-image-standard iframe').evaluate(e=>e.style.pointerEvents),'none');
  const interactionButton=page.getByRole('button',{name:'交互',exact:true});
  await interactionButton.waitFor();
  assert.equal(await interactionButton.isEnabled(),true);
  const beforeInteraction=await page.evaluate(()=>({skin:window.__dynamicEnv.game.qhly_getSkin('caocao'),setting:window.__dynamicEnv.lib.config.extension_动态皮肤验证扩展_interaction??false,channel:document.querySelector('.qh-image-standard iframe').dataset.channel}));
  await interactionButton.click();
  await page.waitForFunction(()=>document.querySelector('.qh-skin-preview-interaction')?.getAttribute('aria-pressed')==='true');
  assert.equal(await page.locator('.qh-image-standard iframe').evaluate(e=>e.style.pointerEvents),'auto');
  const interactionFrame=await (await page.locator('.qh-image-standard iframe').elementHandle()).contentFrame();
  await interactionFrame.evaluate(()=>new Promise(resolve=>{let n=0;const tick=()=>++n<30?requestAnimationFrame(tick):resolve();requestAnimationFrame(tick);}));
  for(const touch of [false,true]){
   await interactionFrame.evaluate(async()=>{await skinPlayer.motion(skinPlayer.entry.idle,false);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));skinPlayer.app.render();});
   const point=await interactionFrame.evaluate(()=>{
    const points=[];for(let y=8;y<innerHeight;y+=6)for(let x=8;x<innerWidth;x+=6)if(skinPlayer.hit(x,y).includes('TouchHead'))points.push({x,y});
    const center=points.reduce((c,p)=>({x:c.x+p.x/points.length,y:c.y+p.y/points.length}),{x:0,y:0});
    return points.sort((a,b)=>(a.x-center.x)**2+(a.y-center.y)**2-(b.x-center.x)**2-(b.y-center.y)**2)[0];
   });
   assert.ok(point);
   const box=await interactionFrame.locator('[data-skin-surface]').boundingBox(),size=await interactionFrame.evaluate(()=>({w:innerWidth,h:innerHeight}));
   const x=box.x+point.x*box.width/size.w,y=box.y+point.y*box.height/size.h;
   if(touch){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
   else await page.mouse.click(x,y);
   await interactionFrame.waitForFunction(()=>skinPlayer.lastMotion==='touch_head');
  }
  await page.screenshot({path:out+'/preview-interaction-'+suite+'.png'});
  await page.getByRole('button',{name:'退出交互',exact:true}).click();
  assert.equal(await page.locator('.qh-image-standard iframe').evaluate(e=>e.style.pointerEvents),'none');
  assert.deepEqual(await page.evaluate(()=>({skin:window.__dynamicEnv.game.qhly_getSkin('caocao'),setting:window.__dynamicEnv.lib.config.extension_动态皮肤验证扩展_interaction??false,channel:document.querySelector('.qh-image-standard iframe').dataset.channel})),beforeInteraction);
  report.checks.push('preview interaction button enables real mouse/touch head actions and exits without rebuilding player or changing skin/interaction preference');
  await setInteraction(true);assert.equal(await page.locator('.qh-image-standard iframe').evaluate(e=>e.style.pointerEvents),'auto');
  await setInteraction(false);assert.equal(await page.locator('.qh-image-standard iframe').evaluate(e=>e.style.pointerEvents),'none');await setInteraction(true);
  const toggle=page.locator('.qh-skinchange-big-dynamicChange');await toggle.click();await page.waitForSelector('.qh-image-standard iframe',{state:'detached'});
  assert.equal(await page.locator('.qh-skin-preview-interaction').isDisabled(),true);
  await toggle.click();await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
  assert.equal(await page.locator('.qh-skin-preview-interaction').isEnabled(),true);
  if(suite==='lobby')await page.locator('.qh-avatar-default').click();
  assert.ok(await page.evaluate(()=>window.__dynamicEnv.lib.config.skin.caocao?.[1].includes('/samples/')));
  await assertNoNewUI();
  report.checks.push('existing Qianhuan list contains all 64 skins; native selection/default/static-dynamic controls work; only one extension interaction setting');
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  if(suite==='lobby'){
   await page.reload({waitUntil:'domcontentloaded'});await load();await page.waitForSelector('#splash canvas',{timeout:90000});
   assert.ok(await page.evaluate(()=>window.__dynamicEnv.game.qhly_getSkin('caocao')?.includes('珍珠号')));
   assert.equal(await page.evaluate(()=>window.__dynamicEnv.lib.config.extension_动态皮肤验证扩展_interaction),true);
   report.checks.push('native selected skin and interaction setting persist after reload');
  }else{
   await page.waitForSelector('#arena [data-dynamic-test=me] .local-dynamic-skin iframe[data-ready=true]');
   assert.equal(await page.locator('#arena [data-dynamic-test=me] .decade-portrait').count(),0);
   await page.evaluate(()=>window.__dynamicEnv.ui.arena.classList.add('selecting'));
   await page.waitForFunction(()=>document.querySelector('#arena [data-dynamic-test=me] .local-dynamic-skin iframe')?.style.pointerEvents==='none');
   await page.evaluate(()=>window.__dynamicEnv.ui.arena.classList.remove('selecting'));
   await page.waitForFunction(()=>document.querySelector('#arena [data-dynamic-test=me] .local-dynamic-skin')?.style.pointerEvents==='none');
   for(const cls of ['unseen','dead']){
    await page.evaluate(cls=>window.__dynamicEnv.game.me.classList.add(cls),cls);await page.waitForSelector('#arena [data-dynamic-test=me] .local-dynamic-skin',{state:'detached'});
    await page.evaluate(cls=>window.__dynamicEnv.game.me.classList.remove(cls),cls);await page.waitForSelector('#arena [data-dynamic-test=me] .local-dynamic-skin iframe[data-ready=true]');
   }
   await page.evaluate(async()=>{(await import('/noname.js')).openCharacterSkins('sunquan',undefined,'skin');});
   await cards.filter({hasText:'验证 · 卢莫愁'}).click();await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
   await page.screenshot({path:out+'/qianhuan-native-spine42.png'});
   await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
   await page.waitForFunction(()=>document.querySelectorAll('#arena [data-dynamic-test=me] .local-dynamic-skin iframe[data-ready=true]').length===2);
   const frame=page.frames().find(f=>f.url().includes('id=mjs_3585a21ef01f0707'));
   for(const[kind,expected]of [['useCard','Attack'],['useSkill','Skill'],['die','Kill'],['enterGame','Enter']]){
    await page.evaluate(kind=>{const{game,lib}=window.__dynamicEnv;lib.skill._localDynamicTestEvents.content({triggername:kind==='die'?'dieAfter':kind}, {name:kind,player:game.me,source:game.me,card:{name:'sha'}});},kind);
    await frame.waitForFunction(expected=>skinPlayer.lastMotion===expected,expected);
   }
   for(const cls of ['unseen2','unseen2_v','unseen2_show']){
    await page.evaluate(cls=>window.__dynamicEnv.game.me.classList.add(cls),cls);await page.waitForFunction(()=>document.querySelectorAll('#arena [data-dynamic-test=me] .local-dynamic-skin iframe').length===1);
    await page.evaluate(cls=>window.__dynamicEnv.game.me.classList.remove(cls),cls);await page.waitForFunction(()=>document.querySelectorAll('#arena [data-dynamic-test=me] .local-dynamic-skin iframe[data-ready=true]').length===2);
   }
   await page.screenshot({path:out+'/decade-main-deputy.png'});
   await assertNoNewUI();
   await page.evaluate(()=>{const{game,lib}=window.__dynamicEnv;lib.config.animation=false;game.localDynamicSkinTestHub.refresh();});await page.waitForSelector('#arena .local-dynamic-skin iframe',{state:'detached'});
   await page.evaluate(()=>{const{game,lib}=window.__dynamicEnv;lib.config.animation=true;game.qhly_setCurrentSkin('sunquan',null);});
   report.checks.push('Decade main/deputy render with no new buttons; selection input, hidden/dead cleanup, event adapter and animation setting work');
  }
  await page.evaluate(()=>window.__dynamicEnv.game.qhly_setCurrentSkin('caocao',null));
  await page.waitForSelector('.local-dynamic-skin iframe',{state:'detached'});await assertNoNewUI();
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);
  report.checks.push('classic restore and native page cleanup; no additional skin UI exists');
 }catch(error){report.failure=error.stack;console.log(error.stack);}
 finally{await fs.writeFile(out+'/integration-report.json',JSON.stringify(reports,null,2));await context.close();}
 console.log(suite,report.checks);
}}finally{await browser.close();}
assert.ok(reports.every(r=>!r.failure),'Integration failed: output/dynamic-samples/integration-report.json');
