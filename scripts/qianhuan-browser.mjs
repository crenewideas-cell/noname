import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const {chromium}=playwright;
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const out='output/qianhuan-native';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
const reports=[];
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
try{for(const suite of process.argv.slice(2).length?process.argv.slice(2):['rzsh','shousha','ingame','static']){
 const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage();
 const report={suite,errors:[],checks:[]};reports.push(report);
 page.on('pageerror',e=>{report.errors.push(e.stack);console.log('ERROR',e.stack);});
 page.on('response',r=>{if(r.status()>=400&&(decodeURI(r.url()).includes('千幻')||r.status()>=500))(report.badRequests||=[]).push([r.status(),decodeURI(r.url())]);});page.on('dialog',d=>d.accept());
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')||(suite==='static'&&u.port==='8089')?r.abort():r.continue();});
 await context.addInitScript(({lobby})=>{
  if(lobby)sessionStorage.setItem('noname_0.9_return_to_lobby','true');
  window.__uiApps=[];let pixi;Object.defineProperty(window,'PIXI',{configurable:true,get:()=>pixi,set(value){const App=value.Application;if(App&&!App.__recorded){const Recorded=class extends App{constructor(...args){super(...args);window.__uiApps.push(this);}};Recorded.__recorded=true;value.Application=Recorded;}pixi=value;}});
 },{lobby:suite!=='ingame'});
 await page.route('**/game/config.json',async r=>{
  const response=await r.fetch(),config=await response.json();Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:suite==='ingame'?'off':'always',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='shousha'?'builtin-shousha-standard':suite==='ingame'?'builtin-decade-ingame':'builtin-rzsh',change_skin:true,change_skin_auto:'off'});
  if(suite==='shousha'){config.qhly_funcLoadInPrecontent=false;config.skin={caocao:['英杰会聚','extension/手杀标准UI/original/千幻聆音/sanguoskin/re_caocao/英杰会聚.jpg']};}
  config.mode_config.identity={...config.mode_config.identity,player_number:'2',double_character:true};
  for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;
  for(const row of installed)config['extension_'+row.name+'_enable']=row.name==='千幻聆音';
  config.extension_千幻聆音_enable=true;
  await r.fulfill({response,json:config});
 });
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  if(suite==='ingame'){
   await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
   await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});
   await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.players?.length&&game.players.every(p=>p.name1&&p.name2);},null,{timeout:60000});
   await page.evaluate(async()=>{const{game}=await import('/noname.js');game.pause2();game.me.init('caocao','guojia');});
   const entry=await page.evaluate(async()=>{const{game,get,ui}=await import('/noname.js');const p=game.me;const dialog=get.nodeintro(p);dialog.open();window.__intro=dialog;return {primary:p.name1,secondary:p.name2,count:dialog.querySelectorAll('.qhly-skin-entry').length};});
   assert.equal(entry.count,2);report.checks.push('actual in-game double-general intro has two skin entries');
   await page.locator('#nodeintro .qhly-skin-entry').first().click();
  }else{
   if(suite==='shousha'){await page.waitForSelector('iframe[src*="/html/rzsh.html"]',{timeout:90000});await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();}
   await page.waitForSelector('#splash canvas',{timeout:90000});await page.waitForTimeout(10000);
   const rect=await page.evaluate(name=>{
    let found;function visit(n,view,app){if(!n.worldVisible)return;if(n.name===name&&n.interactive){const b=n.getBounds(),c=view.getBoundingClientRect();found={x:c.left+(b.x+b.width/2)*c.width/app.screen.width,y:c.top+(b.y+b.height/2)*c.height/app.screen.height};}n.children?.forEach(child=>visit(child,view,app));}
    for(const app of window.__uiApps)if(app.stage&&app.renderer&&app.view.isConnected)visit(app.stage,app.view,app);return found;
   },suite==='shousha'?'under5':'pifubutton');
   assert.ok(rect,'skin button should be visible');await page.mouse.click(rect.x,rect.y);
   report.checks.push('actual lobby skin button opens Qianhuan');
  }
  await page.waitForSelector('.qh-window',{timeout:15000});
  if(suite==='shousha'){assert.equal(await page.evaluate(async()=>{const{lib}=await import('/noname.js');return lib.config.qhly_skinset.skin.caocao;}),'英杰会聚.jpg');report.checks.push('old core skin save imported despite disabled legacy precontent option');}
  assert.equal(await page.locator('.qhly-character-skins').count(),0);
  await page.locator('.qhly-core-choose').click();
  await page.locator('.qhly-core-picker input').fill('caocao');
  await page.locator('.qhly-core-results button[title="caocao"]').click();
  const option=page.locator('.qh-skinchange-shousha-big-skin').filter({hasText:'英杰会聚'}).first();
  await option.waitFor({timeout:20000});
  await page.evaluate(async()=>{const{game}=await import('/noname.js');window.__rulesBefore=game.players?.map(p=>({name:p.name1,name2:p.name2,hp:p.hp,skin:JSON.stringify(p.skin),skills:p.skills.slice()}));});
  await option.click();
  await page.waitForFunction(async()=>{const{lib}=await import('/noname.js');return lib.config.skin?.caocao?.[1]?.endsWith('/英杰会聚.jpg')&&lib.config.qhly_skinset.skin.caocao==='英杰会聚.jpg';});
  report.selection=await page.evaluate(async()=>{const{lib}=await import('/noname.js');return lib.config.skin.caocao;});
  report.checks.push('original card click updates both Qianhuan and core selection');
  if(suite==='rzsh'){
   report.portraits=await page.evaluate(async()=>{
    const{lib,game,get,getSkinService,subscribeCharacterSkins}=await import('/noname.js');
    const{createPortraitLoader}=await import('/extension/如真似幻/bridge.js');
    const{createPortraitTextures}=await import('/extension/手杀标准UI/native/portraits.js');
    const store=getSkinService(),original=store.current('caocao'),timers=[];
    const apply=(name,path)=>new Promise(resolve=>game.qhly_setCurrentSkin(name,path?.split('/').pop()||null,resolve));
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
     await apply('caocao',replacement.id);
     await wait(()=>sprite.workshopPortraitLoaded&&sprite.texture!==oldTexture&&canvas.toDataURL()!==before);
     await apply('caocao',original);
     await wait(()=>sprite.workshopPortraitLoaded&&canvas.toDataURL()===before);
     return {shoushaCanvasRefresh:true,rzshTextureRefresh:true,restoreRefresh:true};
    }finally{unsubscribe();ss.dispose();rz.dispose();timers.forEach(clearInterval);lifecycle.app.stage.destroy({children:true});}
   });report.checks.push('both actual PIXI portrait loaders refresh and restore after skin changes');
  }
  await page.screenshot({path:`${out}/${suite}-desktop.png`});
  await page.locator('.qh-skinchange-shousha-big-skin').filter({hasText:'经典形象'}).first().click();
  await page.waitForFunction(async()=>{const{lib}=await import('/noname.js');return !lib.config.skin?.caocao&&!lib.config.qhly_skinset.skin.caocao;});
  report.checks.push('classic card clears both selections');
  await option.click();
  await page.setViewportSize({width:852,height:393});await page.waitForTimeout(900);
  // Lobby reconstruction disposes owned overlays; reopening must still work.
  if(!await page.locator('.qh-background').count())await page.evaluate(async()=>{const{openCharacterSkins}=await import('/noname/skin/qianhuan/index.js');openCharacterSkins('caocao');});
  await page.waitForFunction(()=>{const r=document.querySelector('.qh-background')?.getBoundingClientRect();return r&&Math.abs(r.width-innerWidth)<3&&Math.abs(r.height-innerHeight)<3;});
  report.geometry=await page.evaluate(()=>Object.fromEntries(['.qh-background','.qh-window','.qh-back','.qh-page-skin','.qh-skinchange-shousha-big-skin'].map(s=>[s,document.querySelector(s).getBoundingClientRect().toJSON()])));
  await page.screenshot({path:`${out}/${suite}-narrow.png`});
  await page.locator('.qh-back').click();await page.waitForSelector('.qh-background',{state:'detached'});
  const intact=await page.evaluate(async()=>{const{game}=await import('/noname.js');return JSON.stringify(window.__rulesBefore)===JSON.stringify(game.players?.map(p=>({name:p.name1,name2:p.name2,hp:p.hp,skin:JSON.stringify(p.skin),skills:p.skills.slice()})));});assert.equal(intact,true);
  if(suite==='ingame'){
   report.players=await page.evaluate(async()=>{
    const {lib,game,get,getSkinService,_status}=await import('/noname.js');const p=game.me,store=getSkinService();
    const result={paused:_status.paused2,checks:[]};
    for(const [name,avatar] of [[p.name1,p.node.avatar],[p.name2,p.node.avatar2]]){
     const skin=(await store.list(name)).skins.find(s=>s.source==='千幻聆音');if(!skin)throw Error('No Qianhuan skin for '+name);
     await new Promise(resolve=>game.qhly_setCurrentSkin(name,skin.path.split('/').pop(),resolve));
     await new Promise(resolve=>setTimeout(resolve,250));
     result.checks.push({name,skin:skin.path,updated:decodeURI(avatar.style.backgroundImage).includes(skin.path)});
     await new Promise(resolve=>game.qhly_setCurrentSkin(name,null,resolve));
     await new Promise(resolve=>setTimeout(resolve,250));
     result.checks.at(-1).restored=!decodeURI(avatar.style.backgroundImage).includes(skin.path);
    }
    const previous=p.isUnseen;p.isUnseen=()=>true;const intro=get.nodeintro(p);result.hiddenEntries=intro.querySelectorAll('.qhly-skin-entry').length;p.isUnseen=previous;intro.close();
    return result;
   });
   assert.equal(report.players.paused,true);assert.equal(report.players.hiddenEntries,0);
   assert.ok(report.players.checks.every(row=>row.updated&&row.restored));
   report.checks.push('actual primary/secondary avatars update and restore; hidden generals expose no entry; prior pause preserved');
  }
  await page.evaluate(async()=>{const{game}=await import('/noname.js');await new Promise(resolve=>game.qhly_setCurrentSkin('caocao','英杰会聚.jpg',resolve));});
  report.audio=await page.evaluate(async()=>{const{lib,game}=await import('/noname.js');return {aliases:lib.qhly_skinShare.caocao,mappings:lib.config.qhly_skinset.audioReplace};});
  assert.ok(report.audio.mappings['skill/jianxiong1']?.endsWith('/英杰会聚/rejianxiong1'));
  await page.evaluate(async()=>{const{lib}=await import('/noname.js');lib.config.repeat_audio=true;});
  const audioResponse=page.waitForResponse(r=>decodeURI(r.url()).endsWith('/英杰会聚/rejianxiong1.mp3'));
  await page.evaluate(()=>window.qhly_TrySkillAudio('jianxiong',{name:'caocao'},false,0));
  assert.ok((await audioResponse).ok());
  report.checks.push('shared skin skill voice preview loads successfully');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(async()=>{const{lib,game}=await import('/noname.js');return game.qhly_coreReady&&lib.config.skin?.caocao?.[1]?.endsWith('/英杰会聚.jpg')&&lib.config.qhly_skinset.skin.caocao==='英杰会聚.jpg';},null,{timeout:90000});
  report.checks.push('selection persists after reload; no player rule changes');
  assert.deepEqual(report.errors,[]);
 }catch(error){report.failure=error.stack;await page.screenshot({path:`${out}/${suite}-failure.png`}).catch(()=>{});throw error;}
 finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await context.close();}
 console.log(suite+': '+report.checks.join('; '));
}}finally{await browser.close();}
