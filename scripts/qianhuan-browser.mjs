import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const out='output/qianhuan-phase1';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const reports=[];
try{for(const suite of process.argv.slice(2).length?process.argv.slice(2):['rzsh','shousha','ingame']){
 const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage();
 const report={suite,errors:[],checks:[]};reports.push(report);
 page.on('pageerror',e=>report.errors.push(e.message));page.on('dialog',d=>d.accept());
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
 await context.addInitScript(({lobby})=>{
  sessionStorage.setItem('noname_0.9_disable_extension','true');if(lobby)sessionStorage.setItem('noname_0.9_return_to_lobby','true');
  window.__uiApps=[];let pixi;Object.defineProperty(window,'PIXI',{configurable:true,get:()=>pixi,set(value){const App=value.Application;if(App&&!App.__recorded){const Recorded=class extends App{constructor(...args){super(...args);window.__uiApps.push(this);}};Recorded.__recorded=true;value.Application=Recorded;}pixi=value;}});
 },{lobby:suite!=='ingame'});
 await page.route('**/game/config.json',async r=>{
  const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:[],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:suite==='ingame'?'off':'always',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='rzsh'?'builtin-rzsh':suite==='shousha'?'builtin-shousha-standard':'builtin-decade-ingame',change_skin:true,change_skin_auto:'off'});
  config.mode_config.identity={...config.mode_config.identity,player_number:'2',double_character:true};
  for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
  await r.fulfill({response,json:config});
 });
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  if(suite==='ingame'){
   await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
   await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});
   await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.players?.length&&game.players.every(p=>p.name1&&p.name2);},null,{timeout:60000});
   await page.evaluate(async()=>{const{game}=await import('/noname.js');game.pause2();});
   const entry=await page.evaluate(async()=>{const{game,get,ui}=await import('/noname.js');const p=game.me;const dialog=get.nodeintro(p);dialog.open();window.__intro=dialog;return {primary:p.name1,secondary:p.name2,count:dialog.querySelectorAll('.qhly-skin-entry').length};});
   assert.equal(entry.count,2);report.checks.push('actual in-game double-general intro has two skin entries');
   await page.locator('#nodeintro .qhly-skin-entry').first().click();
  }else{
   if(suite==='shousha'){await page.waitForSelector('iframe[src*="/html/rzsh.html"]',{timeout:90000});await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();}
   await page.waitForSelector('#splash canvas',{timeout:90000});await page.waitForTimeout(10000);
   const rect=await page.evaluate(name=>{
    let found;function visit(n,view,app){if(!n.worldVisible)return;if(n.name===name&&n.interactive){const b=n.getBounds(),c=view.getBoundingClientRect();found={x:c.left+(b.x+b.width/2)*c.width/app.screen.width,y:c.top+(b.y+b.height/2)*c.height/app.screen.height};}n.children?.forEach(child=>visit(child,view,app));}
    for(const app of window.__uiApps)if(app.stage&&app.renderer&&app.view.isConnected)visit(app.stage,app.view,app);return found;
   },suite==='rzsh'?'pifubutton':'under5');
   assert.ok(rect,'skin button should be visible');await page.mouse.click(rect.x,rect.y);
   report.checks.push('actual lobby skin button opens Qianhuan');
  }
  await page.waitForSelector('.qhly-character-skins[open]',{timeout:15000});
  await page.evaluate(async()=>{const{getSkinService}=await import('/noname.js');await getSkinService().apply('caocao',null);});
  await page.locator('.qhly-choose-character').click();await page.locator('.qhly-search').fill('caocao');await page.locator('.qhly-character[title="caocao"]').click();
  const option=page.locator('.qh-skinchange-shousha-big-skin').filter({hasText:'英杰会聚'}).first();await option.waitFor({timeout:15000});
  await option.click();
  const before=await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');window.__rulesBefore=game.players?.map(p=>({name:p.name1,name2:p.name2,hp:p.hp,skin:JSON.stringify(p.skin),skills:p.skills.slice()}));return lib.config.skin?.caocao;});assert.equal(before,undefined);
  await page.locator('.qhly-apply').click();await page.getByText('皮肤已使用并保存',{exact:true}).waitFor();
  report.selection=await page.evaluate(async()=>{const{lib}=await import('/noname.js');return lib.config.skin.caocao;});assert.ok(report.selection[1].includes('/re_caocao/英杰会聚.jpg'));
  if(suite==='rzsh'){
   report.portraits=await page.evaluate(async()=>{
    const{lib,game,get,getSkinService,subscribeCharacterSkins}=await import('/noname.js');
    const{createPortraitLoader}=await import('/extension/如真似幻/bridge.js');
    const{createPortraitTextures}=await import('/extension/手杀标准UI/native/portraits.js');
    const store=getSkinService(),original=store.current('caocao'),timers=[];
    const lifecycle={graphics:window.PIXI,app:{stage:new window.PIXI.Container()},interval(fn,ms){const id=setInterval(fn,ms);timers.push(id);return id;}};
    const rz=createPortraitLoader(lifecycle),sprite=rz.sprite('caocao');lifecycle.app.stage.addChild(sprite);
    const ss=createPortraitTextures({PIXI:window.PIXI,character:get.character.bind(get),assetURL:lib.assetURL,defaultPath:lib.characterDefaultPicturePath,readImage:key=>game.getDB('image',key),url:x=>x,skin:name=>store.current(name)});
    const unsubscribe=subscribeCharacterSkins(()=>ss.refresh());
    const texture=ss.get('caocao'),canvas=texture.baseTexture.resource.source;
    const wait=async predicate=>{const until=Date.now()+12000;while(!predicate()){if(Date.now()>until)throw Error('portrait refresh timeout');await new Promise(r=>setTimeout(r,30));}};
    try{
     await wait(()=>sprite.workshopPortraitLoaded&&canvas.getContext('2d').getImageData(5,5,1,1).data[0]!==48);
     // Allow both decoders to finish before comparing the stable canvas contents.
     await new Promise(r=>setTimeout(r,300));const before=canvas.toDataURL(),oldTexture=sprite.texture;
     const replacement=(await store.list('caocao')).skins.find(s=>s.source==='千幻聆音'&&s.id!==original);
     await store.apply('caocao',replacement.id);
     await wait(()=>sprite.workshopPortraitLoaded&&sprite.texture!==oldTexture&&canvas.toDataURL()!==before);
     await store.apply('caocao',original);
     await wait(()=>sprite.workshopPortraitLoaded&&canvas.toDataURL()===before);
     return {shoushaCanvasRefresh:true,rzshTextureRefresh:true,restoreRefresh:true};
    }finally{unsubscribe();ss.dispose();rz.dispose();timers.forEach(clearInterval);lifecycle.app.stage.destroy({children:true});}
   });report.checks.push('both actual PIXI portrait loaders refresh and restore after skin changes');
  }
  await page.screenshot({path:`${out}/${suite}-desktop.png`});
  await page.setViewportSize({width:852,height:393});await page.waitForTimeout(500);
  if(await page.locator('.qhly-character-skins[open]').count()===0)await page.evaluate(async()=>{const{openCharacterSkins}=await import('/noname.js');openCharacterSkins('caocao');});
  await page.waitForSelector('.qh-skinchange-shousha-big-skin');await page.screenshot({path:`${out}/${suite}-narrow.png`});
  const thumbnail=await page.locator('.primary-avatar').first().boundingBox();assert.ok(thumbnail?.width>50,'thumbnail must not collapse under core div styles');
  const cardBox=await page.locator('.qh-skinchange-shousha-big-skin').first().boundingBox(),trackBox=await page.locator('.qhly-skin-track').boundingBox();assert.ok(cardBox.y>=trackBox.y-1&&cardBox.y+cardBox.height<=trackBox.y+trackBox.height+1,'whole skin card fits narrow screen');
  const geometry=await page.locator('.qhly-apply').boundingBox();assert.ok(geometry&&geometry.y>=0&&geometry.y+geometry.height<=393);
  await page.locator('.qhly-close').click();await page.locator('.qhly-character-skins').waitFor({state:'detached'});
  const rulesIntact=await page.evaluate(async()=>{const{game}=await import('/noname.js');return JSON.stringify(window.__rulesBefore)===JSON.stringify(game.players?.map(p=>({name:p.name1,name2:p.name2,hp:p.hp,skin:JSON.stringify(p.skin),skills:p.skills.slice()})));});assert.equal(rulesIntact,true);
  report.checks.push('preview does not save; apply persists without changing player rules; desktop/narrow layouts close cleanly');
  if(suite==='ingame'){
   report.dynamic=await page.evaluate(async()=>{
    const{game}=await import('/noname.js');const fixture=document.createElement('div');fixture.className='player qhly-dynamic-test';fixture.dataset.position='7';fixture.style.cssText='width:130px;height:180px';
    const avatar=document.createElement('div');avatar.className='avatar';avatar.setBackground('caocao','character');fixture.append(avatar);game.me.parentNode.append(fixture);
    await new Promise(resolve=>setTimeout(resolve,300));const layers=avatar.querySelectorAll('.decade-portrait,.ss-dynamic-portrait').length;fixture.remove();return {layers};
   });assert.equal(report.dynamic.layers,0);report.checks.push('saved static skin suppresses unrelated suite dynamic overlay');
   report.refresh=await page.evaluate(async()=>{
    const{game,getSkinService,lib,get}=await import('/noname.js');const p=game.me;const store=getSkinService();const result={};
    for(const [name,avatar] of [[p.name1,p.node.avatar],[p.name2,p.node.avatar2]]){
     const skins=(await store.list(name)).skins;const entry=skins.find(s=>s.source==='千幻聆音');if(!entry)throw Error('No fixture skin for '+name);
     await store.apply(name,entry.id);result[name]=avatar.style.backgroundImage.includes(entry.path);
    }
    const previous=p.isUnseen;p.isUnseen=()=>true;const hidden=get.nodeintro(p);result.hiddenEntries=hidden.querySelectorAll('.qhly-skin-entry').length;p.isUnseen=previous;hidden.close();
    return result;
   });assert.equal(report.refresh.hiddenEntries,0);assert.ok(Object.entries(report.refresh).filter(([k])=>k!=='hiddenEntries').every(([,v])=>v));
   report.checks.push('actual primary/secondary avatar update; hidden-general intros expose no skin entry');
   report.form=await page.evaluate(async()=>{
    const{lib,getSkinService}=await import('/noname.js');const store=getSkinService(),previous=lib.characterSubstitute.caocao;
    const id='qhly_test_form';lib.characterSubstitute.caocao=[[id,['character:caocao']]];
    const avatar=document.createElement('div');document.body.append(avatar);avatar.setBackground(id,'character');
    try{await store.apply('caocao',store.current('caocao'));return {form:avatar.dataset.skinCharacter,usesSkin:avatar.style.backgroundImage.includes('/sanguoskin/'),formConfig:lib.config.skin[id]};}
    finally{avatar.remove();if(previous)lib.characterSubstitute.caocao=previous;else delete lib.characterSubstitute.caocao;}
   });assert.equal(report.form.form,'qhly_test_form');assert.equal(report.form.usesSkin,false);assert.equal(report.form.formConfig,undefined);report.checks.push('missing alternate-form art retains the form and falls back to its original');
  }
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(async()=>{const{lib}=await import('/noname.js');return lib.config?.skin?.caocao?.[1]?.includes('英杰会聚.jpg');},null,{timeout:90000});
  report.checks.push('selection survives reload');
  assert.deepEqual(report.errors,[]);
 }catch(error){report.failure=error.stack;await page.screenshot({path:`${out}/${suite}-failure.png`}).catch(()=>{});throw error;}
 finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await context.close();}
 console.log(suite+': '+report.checks.join('; '));
}}finally{await browser.close();}
