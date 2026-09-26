import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const installed=JSON.parse(await fs.readFile('apps/core/game/organized-extensions.json','utf8'));
const out='output/qianhuan-features';await fs.mkdir(out,{recursive:true});
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined),args:['--enable-unsafe-swiftshader']});
const reports=[];
try{
 for(const suite of process.argv.slice(2).length?process.argv.slice(2):['themes','gameplay']){
  const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage();
  const report={suite,checks:[],errors:[]};reports.push(report);
  page.on('pageerror',error=>{report.errors.push(error.stack);console.log(error.stack);});page.on('dialog',dialog=>dialog.accept());
  await context.route('**/*',route=>{const url=new URL(route.request().url());return url.hostname!=='127.0.0.1'||url.pathname.startsWith('/api/')||url.pathname.startsWith('/ws/')?route.abort():route.continue();});
  if(suite==='themes')await context.addInitScript(()=>sessionStorage.setItem('noname_0.9_return_to_lobby','true'));
  await page.route('**/game/config.json',async route=>{
   const response=await route.fetch(),config=await response.json();
   Object.assign(config,{extensions:['千幻聆音'],extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:suite==='themes'?'always':'off',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:suite==='themes'?'builtin-rzsh':'builtin-decade-ingame',change_skin:true,change_skin_auto:'off',qhly_skinButton:true,qhly_dragButton:true,qhly_smallwiningame:true,qhly_currentMusic:'audio/background/music_default.mp3',qhly_enableCharacterMusic:true});
   config.mode_config.identity={...config.mode_config.identity,player_number:'2',double_character:true};
   for(const key of Object.keys(config))if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;
   for(const row of installed)config['extension_'+row.name+'_enable']=row.name==='千幻聆音';
   await route.fulfill({response,json:config});
  });
  try{
   await page.goto(origin,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.qhly_coreReady;},null,{timeout:90000});
   if(suite==='themes'){
    await page.waitForSelector('#splash canvas',{timeout:90000});
    await page.waitForFunction(async()=>{const{lib,game}=await import('/noname.js');return game.qhly_coreReady&&!!lib.qhly_viewskin&&!!game.qhly_initShoushaView;},null,{timeout:90000});
    await page.waitForFunction(async()=>{const{get}=await import('/noname.js');return !get.character('caocao').isNull;});
    const themes=await page.evaluate(async()=>Object.keys((await import('/noname.js')).lib.qhly_viewskin));
    for(const theme of themes){
     await page.evaluate(async theme=>{
      const{lib}=await import('/noname.js');lib.config.qhly_currentViewSkin=theme;lib.qhly_viewskin[theme].onchange();
      for(const link of document.querySelectorAll('link[rel=stylesheet]'))if(decodeURI(link.href).includes('/千幻聆音/theme/'))link.remove();
      await new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href=lib.assetURL+'extension/千幻聆音/theme/'+(lib.config.qhly_viewskin_css||'newui')+'.css';link.onload=resolve;link.onerror=reject;document.head.append(link);});
      window.__profile=(await import('/noname/skin/qianhuan/index.js')).openCharacterSkins('caocao');
     },theme);
     const classic=theme==='jingdian',root=classic?'.qhly-chgskin-background':'.qh-background';
     await page.locator(root).waitFor();await page.waitForTimeout(850);
     assert.ok((await page.locator(root).innerText()).includes('曹操'),theme+' should show character information');
     assert.equal(await page.locator('.qhly-core-choose,.qhly-core-picker').count(),0);
     if(!classic){
      const intro=page.locator('.qh-button').filter({hasText:/简.*介/}).first();
      if(await intro.count()){await intro.click();assert.ok((await page.locator(root).innerText()).includes('曹操'));}
     }
     await page.screenshot({path:`${out}/theme-${theme}.png`});
     await page.locator(classic?'.qhly-okbutton':'.qh-back').click();
     await page.locator(root).waitFor({state:'detached'});
     report.checks.push(`${theme}: native profile opens, shows character and closes through original control`);
    }
   }else{
    await page.waitForSelector('#arena .button.character.selectable',{timeout:90000});
    await page.evaluate(async()=>{const{ui,_status}=await import('/noname.js');if(!_status.auto)ui.click.auto();});
    await page.waitForFunction(async()=>{const{game}=await import('/noname.js');return game.players?.length&&game.players.every(p=>p.name1&&p.name2)&&game.qhly_getAllButtons().length>=4;},null,{timeout:60000});
    await page.evaluate(async()=>{const{game}=await import('/noname.js');game.pause2();});
    const players=await page.evaluate(async()=>{const{game}=await import('/noname.js');return game.players.map(player=>({name:player.name1,name2:player.name2,buttons:player.querySelectorAll('.qhly_skinplayerbutton,.qhly_skinplayerbutton2').length}));});
    assert.ok(players.every(player=>player.buttons===(player.name2?2:1)));report.players=players;
    report.checks.push('actual gameStart trigger installs native primary/secondary portrait buttons');
    await page.evaluate(async()=>{const{game}=await import('/noname.js');game.qhly_hideButtons();});
    assert.equal(await page.locator('.qhly_skinplayerbutton:not(.hidden),.qhly_skinplayerbutton2:not(.hidden)').count(),0);
    await page.evaluate(async()=>{const{game}=await import('/noname.js');game.qhly_showButtons();game.me.init('caocao','guojia');});
    // The original timer must use the current player names after a general change.
    await page.evaluate(async()=>{const{lib,game,subscribeCharacterSkins}=await import('/noname.js');window.__changes=[];window.__unsubscribe=subscribeCharacterSkins(event=>window.__changes.push(event));lib.config.qhly_autoChangeSkin='1';game.qhly_autoChangeSkin();game.qhly_autoChangeSkin();});
    await page.waitForFunction(()=>window.__changes.length>0,null,{timeout:12000});
    await page.evaluate(async()=>{const{CONFIG}=await import('/extension/千幻聆音/extension/config.js');CONFIG.qhly_autoChangeSkin.onclick('close');});
    const stopped=await page.evaluate(()=>window.__changes.length);await page.waitForTimeout(1400);assert.equal(await page.evaluate(()=>window.__changes.length),stopped);
    report.checks.push('automatic skin rotation updates core portraits and stops through original configuration');
    report.music=await page.evaluate(async()=>{
     const{lib,game,ui}=await import('/noname.js');lib.config.qhly_characterMusic.caocao='audio/background/music_diaochan.mp3';game.playBackgroundMusic();
     return {chosen:game.qhly_getCurrentMusic(),source:decodeURI(ui.backgroundMusic.src)};
    });
    assert.ok(report.music.source.endsWith(report.music.chosen));assert.equal(report.music.chosen,'audio/background/music_diaochan.mp3');
    report.checks.push('character BGM reaches the real core background audio element');
    await page.evaluate(async()=>{
     const{lib,game}=await import('/noname.js');lib.config.extension_千幻聆音_qhly_mvp=true;game.me.getStat().damage=1;game.over(true);
    });
    await page.waitForFunction(async()=>{const{lib}=await import('/noname.js');return lib.config.qhly_winrecord.caocao&&lib.config.qhly_winrecord.guojia;});
    report.records=await page.evaluate(async()=>{const{lib}=await import('/noname.js');return {primary:lib.config.qhly_winrecord.caocao,secondary:lib.config.qhly_winrecord.guojia};});
    report.checks.push('real game.over runs MVP and saves original win records for both generals');
   }
   assert.deepEqual(report.errors,[]);
  }catch(error){report.failure=error.stack;await page.screenshot({path:`${out}/${suite}-failure.png`}).catch(()=>{});throw error;}
  finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await context.close();}
  console.log(suite+': '+report.checks.join('; '));
 }
}finally{await browser.close();}
