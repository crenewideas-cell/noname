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
 await page.route('**/noname/util/portraitEffectFit.js',async route=>{const response=await route.fetch();let body=await response.text();body=body.replace('this.scale = nativeWidth / referenceWidth * scale;', 'this.__testFit = {width:rect.width,height:rect.height,nativeWidth,x:rect.width/nativeWidth}; this.scale = nativeWidth / referenceWidth * scale;').replace('return sprite;', '(window.__frameEffects ||= []).push(sprite); return sprite;');await route.fulfill({response,body});});
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?route.abort():route.continue();});
 if(suite==='lobby')await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
 await page.route('**/game/config.json',async route=>{
  const response=await route.fetch(),config=await response.json();
  Object.assign(config,{extensions:['千幻聆音',name],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:suite==='lobby'?'always':'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='lobby'?'builtin-rzsh':'builtin-shousha-standard',change_skin:true,change_skin_auto:'off',animation:true,low_performance:false});
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

  await page.evaluate(()=>{const{game,lib,ui,_status}=window.__dynamicEnv;if(_status.auto)ui.click.auto();game.pause2();game.me.uninit();game.me.init('diaochan');game.me.dataset.dynamicTest='me';for(const list of Object.values(lib.rank.rarity))if(Array.isArray(list))list.remove('diaochan');lib.rank.rarity.rare.add('diaochan');});
  await page.waitForSelector('#arena [data-dynamic-test=me] .ss-rarity-ornament[data-rarity=rare]');
  const dimensions=()=>page.evaluate(()=>{const p=window.__dynamicEnv.game.me;return {height:p.offsetHeight,width:p.offsetWidth,nodes:[...p.children].filter(n=>n.matches('.ss-rarity-ornament,.ss-player-frame,.identity,.hp,.count')).map(n=>({name:n.className,style:n.style.cssText,rect:n.getBoundingClientRect().toJSON(),computed:{width:getComputedStyle(n).width,height:getComputedStyle(n).height,left:getComputedStyle(n).left}}))};});
  report.baseline=await dimensions();
  await page.evaluate(()=>{const n=document.createElement('div');n.className='playerjiu';window.__dynamicEnv.game.me.append(n);});
  await page.waitForFunction(()=>window.__frameEffects?.some(s=>s.name==='jiubuff'&&s.__testFit),null,{timeout:30000});
  report.effectBefore=await page.evaluate(()=>{const s=window.__frameEffects.find(s=>s.name==='jiubuff');return{...s.__testFit,scale:s.scale};});
  await page.screenshot({path:out+'/frame-native-before.png'});
  await page.evaluate(async()=>{(await import('/noname.js')).openCharacterSkins('diaochan',undefined,'skin');});
  await page.locator('.qh-skinchange-shousha-big-skin').filter({hasText:'验证 · 貂蝉 · 桂影婵娟'}).click();
  await page.waitForSelector('.qh-image-standard iframe[data-ready=true]');
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  await page.waitForSelector('#arena [data-dynamic-test=me] iframe[data-ready=true]');
  const frame=await(await page.locator('#arena [data-dynamic-test=me] iframe').elementHandle()).contentFrame();
  report.after=await dimensions();
  await page.waitForFunction(()=>window.__frameEffects.find(s=>s.name==='jiubuff')?.__testFit.x>2);
  report.effectAfter=await page.evaluate(()=>{const s=window.__frameEffects.find(s=>s.name==='jiubuff');return{...s.__testFit,scale:s.scale};});
  assert.ok(Math.abs(report.effectBefore.scale-report.effectAfter.scale)<.01,'wine keeps native vertical scale');
  assert.ok(Math.abs(report.effectAfter.x-report.after.width/report.baseline.width)<.02,'wine follows new frame width');
  await page.screenshot({path:out+'/frame-wine-adapted.png'});
  await page.evaluate(()=>window.__dynamicEnv.game.me.querySelector('.playerjiu').remove());
  assert.equal(report.after.height,report.baseline.height);
  for(const before of report.baseline.nodes.filter(n=>n.name!=='ss-player-frame')){
   const after=report.after.nodes.find(n=>n.name===before.name);
   assert.ok(Math.abs(before.rect.width-after.rect.width)<1,before.name+' width');
   assert.ok(Math.abs(before.rect.height-after.rect.height)<1,before.name+' height');
   if(before.name==='ss-rarity-ornament')assert.ok(Math.abs(before.rect.right-after.rect.right)<1,'dragon right anchor');
  }
  report.model=await frame.evaluate(()=>{const p=skinPlayer;return{fit:p.fit,presentation:p.presentation,layers:p.engine42.layers.map(l=>({role:l.meta.role,bounds:l.skeleton.getBoundsRect()}))};});
  report.coverage=await frame.evaluate(()=>{const source=document.querySelector('[data-render-source]'),c=document.createElement('canvas');c.width=source.width;c.height=source.height;const ctx=c.getContext('2d');ctx.drawImage(source,0,0);const data=ctx.getImageData(0,0,c.width,c.height).data;let opaque=0;for(let i=3;i<data.length;i+=4)if(data[i]>=230)opaque++;return opaque/(c.width*c.height);});
  assert.ok(report.coverage>.95,'original painting covers the frame without a blurred outer mat');
  assert.ok(report.model.fit.width/report.model.fit.height>1.65,'petals do not dictate scene framing');
  await page.screenshot({path:out+'/frame-native-after.png'});
  await page.evaluate(()=>{const{game,ui}=window.__dynamicEnv;ui.arena.classList.remove('selecting');game.me.classList.remove('selectable','target');});
  await page.locator('#arena [data-dynamic-test=me] > .avatar:not(.removing)').click({position:{x:70,y:70}});
  await page.waitForSelector('#qhly_playerwindowbtn2');
  assert.equal(await page.locator('.qhly-interaction-menu > [role=button]').count(),3);
  await page.screenshot({path:out+'/interaction-menu.png'});
  await page.locator('#qhly_playerwindowbtn2').click();
  await page.waitForSelector('.qh-interaction .qh-image-standard iframe[data-ready=true]');
  const view=page.locator('.qh-interaction');
  assert.equal(await view.locator('.qh-button:visible,.qh-shoushabg:visible,.qh-avatar-shoushabuttons:visible').count(),0);
  await page.waitForFunction(()=>{const v=document.querySelector('.qh-interaction');return v.querySelector('.qh-shousha-big-avatar').getBoundingClientRect().bottom<v.querySelector('.qh-page-skin').getBoundingClientRect().top;},null,{timeout:5000});
  const layout=await view.evaluate(v=>({portrait:v.querySelector('.qh-shousha-big-avatar').getBoundingClientRect().toJSON(),list:v.querySelector('.qh-page-skin').getBoundingClientRect().toJSON()}));
  report.layout=layout;
  await page.screenshot({path:out+'/interaction-layout-check.png'});
  assert.ok(layout.portrait.bottom<layout.list.top,'large portrait above existing skin list');
  assert.ok(layout.list.bottom<=900,'skin list stays in viewport');
  assert.ok(layout.portrait.height>900*.72,'interaction uses most of viewport height');
  const interactionFrame=await(await view.locator('iframe').elementHandle()).contentFrame();
  await interactionFrame.locator('[data-skin-surface]').click({position:{x:120,y:120}});
  await interactionFrame.waitForFunction(()=>skinPlayer.lastMotion==='Attack');
  await page.screenshot({path:out+'/interaction-landscape.png'});
  const leftArrow=view.locator('.qh-skinchange-shousha-bigarrow.left');
  const equipped=await page.evaluate(()=>window.__dynamicEnv.game.qhly_getSkin('diaochan'));
  const originalPreview=await view.locator('iframe').getAttribute('src');
  const selectedBefore=await view.locator('.qh-skinchange-shousha-big-skin.sel').getAttribute('id');
  await leftArrow.click();
  await page.waitForFunction(src=>{const f=document.querySelector('.qh-interaction iframe[data-ready=true]');return f&&f.src!==src;},originalPreview);
  assert.equal(Number((await view.locator('.qh-skinchange-shousha-big-skin.sel').getAttribute('id')).slice(12)),Number(selectedBefore.slice(12))-1);
  await view.locator('.qh-skinchange-shousha-bigarrow:not(.left)').click();
  await page.waitForFunction(()=>document.querySelector('.qh-interaction iframe[data-ready=true]')?.src.includes('id=mjs_82e3407c03b9c525'));
  assert.equal(await page.evaluate(()=>window.__dynamicEnv.game.qhly_getSkin('diaochan')),equipped);
  const assertArrowStep=async root=>{
   const before=await root.locator('.qh-skinchange-shousha-big-skin.sel').getAttribute('id');
   await root.locator('.qh-skinchange-shousha-bigarrow.left').click();
   await page.waitForFunction(id=>document.querySelector('.qh-skinchange-shousha-big-skin.sel')?.id!==id,before);
   assert.equal(Number((await root.locator('.qh-skinchange-shousha-big-skin.sel').getAttribute('id')).slice(12)),Number(before.slice(12))-1);
   await root.locator('.qh-skinchange-shousha-bigarrow:not(.left)').click();
   await page.waitForFunction(()=>document.querySelector('.qh-image-standard iframe[data-ready=true]')?.src.includes('id=mjs_82e3407c03b9c525'));
   assert.equal(await root.locator('.qh-skinchange-shousha-big-skin.sel').getAttribute('id'),before);
  };
  // Scroll the original strip without selecting all intermediate models.
  await view.locator('.qh-skinchange-decade-big-area').evaluate(n=>{for(let i=0;i<350;i++)n.dispatchEvent(new WheelEvent('mousewheel',{wheelDelta:-120}));});
  await view.locator('.qh-skinchange-shousha-big-skin').filter({hasText:'验证 · 珍珠号'}).click();
  await page.waitForFunction(()=>document.querySelector('.qh-interaction iframe[data-ready=true]')?.src.includes('id=az_9600141'));
  const pearl=await(await view.locator('iframe').elementHandle()).contentFrame();
  const point=await pearl.evaluate(()=>{for(let y=10;y<innerHeight;y+=6)for(let x=10;x<innerWidth;x+=6)if(skinPlayer.hit(x,y).includes('TouchHead'))return{x,y};});
  assert.ok(point,'visible head hit region');
  const surface=pearl.locator('[data-skin-surface]'),box=await surface.boundingBox(),size=await pearl.evaluate(()=>({w:innerWidth,h:innerHeight}));
  await page.mouse.click(box.x+point.x*box.width/size.w,box.y+point.y*box.height/size.h);
  await pearl.waitForFunction(()=>skinPlayer.lastMotion==='touch_head');
  await page.screenshot({path:out+'/interaction-live2d.png'});
  const togglesBefore=await page.evaluate(()=>JSON.stringify(window.__dynamicEnv.lib.config.qhly_skinset.djtoggle));
  await view.locator('.qh-skinchange-big-dynamicChange').click();
  await view.locator('iframe').waitFor({state:'detached'});
  await view.locator('.qh-skinchange-big-dynamicChange').click();
  await page.waitForSelector('.qh-interaction iframe[data-ready=true]');
  assert.equal(await page.evaluate(()=>JSON.stringify(window.__dynamicEnv.lib.config.qhly_skinset.djtoggle)),togglesBefore);
  for(const viewport of [{width:1024,height:768},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   await page.waitForFunction(()=>{const v=document.querySelector('.qh-interaction'),p=v.querySelector('.qh-shousha-big-avatar').getBoundingClientRect(),l=v.querySelector('.qh-page-skin').getBoundingClientRect();return p.left>=0&&p.right<=innerWidth&&p.top>=0&&p.bottom<l.top&&l.bottom<=innerHeight+1;});
  }
  await page.setViewportSize({width:1440,height:900});
  assert.equal(await page.evaluate(()=>window.__dynamicEnv.game.qhly_getSkin('diaochan')),equipped);
  assert.ok((await page.locator('#arena [data-dynamic-test=me] iframe').getAttribute('src')).includes('id=mjs_82e3407c03b9c525'));
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  assert.equal(await page.evaluate(()=>window.__dynamicEnv.game.qhly_getSkin('diaochan')),equipped);
  await page.evaluate(async()=>{(await import('/noname.js')).openCharacterSkins('diaochan',undefined,'skill');});
  await page.waitForSelector('.qh-shoushabg:visible');
  assert.equal(await page.locator('.qh-interaction').count(),0);
  const normalView=page.locator('.qh-window');
  await assertArrowStep(normalView);
  report.checks.push('interaction arrows select adjacent preview without changing equipped skin; normal arrows select adjacent skin and update the main preview');
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  report.checks.push('three native-menu buttons, interaction layout, bottom list switch, real Spine/Live2D input, normal profile remains unchanged');
  await page.evaluate(()=>{const{lib,game}=window.__dynamicEnv;lib.rank.rarity.rare.remove('diaochan');lib.rank.rarity.epic.add('diaochan');game.me.classList.toggle('frame-regression-refresh');});
  await page.waitForFunction(()=>{const n=document.querySelector('#arena [data-dynamic-test=me] .ss-rarity-ornament');return n?.dataset.rarity==='epic'&&Math.abs(parseFloat(n.style.width)-120*1.45)<1;});
  report.checks.push('rarity changes use original frame dimensions, not widened dimensions');
  await page.evaluate(()=>window.__dynamicEnv.game.qhly_setCurrentSkin('diaochan',null));
  await page.waitForSelector('#arena [data-dynamic-test=me] iframe',{state:'detached'});
  await page.waitForFunction(width=>window.__dynamicEnv.game.me.offsetWidth===width,report.baseline.width);
  assert.equal(await page.locator('#arena [data-dynamic-test=me]').evaluate(n=>n.offsetWidth),report.baseline.width);
  assert.equal(await page.locator('#arena [data-dynamic-test=me] .ss-player-frame').evaluate(n=>n.style.borderImageSource),'');
  assert.equal(await page.locator('#arena [data-dynamic-test=me] .ss-rarity-ornament').evaluate(n=>n.style.width),'');
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);
  report.checks.push('native dragon/HP/identity/count dimensions unchanged; opaque scene fills frame; classic restoration');
 }catch(error){report.failure=error.stack;report.diagnostic=await page.evaluate(()=>{const{game,lib}=window.__dynamicEnv;const n=game.me?.querySelector('.ss-rarity-ornament');return{rarity:n?.dataset.rarity,width:n?.style.width,character:game.me?.node.avatar.dataset.skinCharacter,actualRarity:game.getRarity('diaochan'),rank:lib.rank.rarity.epic.includes('diaochan')};}).catch(()=>null);console.log(error.stack);}
 finally{await fs.writeFile(out+'/frame-regression-report.json',JSON.stringify(reports,null,2));await context.close();}
 console.log(JSON.stringify({suite,checks:report.checks,coverage:report.coverage,errors:report.errors,missing:report.missing,failure:report.failure}));
}}finally{await browser.close();}
assert.ok(reports.every(r=>!r.failure),'Frame regression failed');
