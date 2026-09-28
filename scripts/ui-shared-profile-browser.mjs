import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:5174';
const out='output/ui-unification';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const reports=[];
try { for(const theme of ['decade','shousha']) {
 const context=await browser.newContext({viewport:{width:1440,height:810}}),page=await context.newPage(),report={theme,errors:[],checks:[]};reports.push(report);
 page.on('pageerror',e=>{report.errors.push(e.stack);console.log(e.stack);});page.on('dialog',d=>d.accept());
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
 await context.addInitScript(()=>{sessionStorage.setItem('noname_0.9_return_to_lobby','true');});
 await page.route('**/game/config.json',async r=>{
  const response=await r.fetch(),config=await response.json();
  for(const key of Object.keys(config))if(key.startsWith('extension_')&&key.endsWith('_enable'))config[key]=false;
  Object.assign(config,{extensions:['千幻聆音'],extension_千幻聆音_enable:true,extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',mode:'identity',characters:['standard'],cards:['standard'],ui_workshop_active:'builtin-rzsh',change_skin:true,change_skin_auto:'off',qhly_currentViewSkin:theme,qhly_viewskin_css:theme==='decade'?'newui_dc':'newui_ss',qhly_enableCharacterMusic:true,identity_banned:['liubei'],guozhan_banned:[],favouriteCharacter:[],qhly_rarity:{},qhly_characterMusic:{}});
  await r.fulfill({response,json:config});
 });
 try {
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.game?.qhly_coreReady===true,null,{timeout:120000});
  await page.waitForFunction(()=>window.get?.character('caocao')?.isNull===false,null,{timeout:60000});
  await page.evaluate(async()=>{const {openCharacterSkins}=await import('/noname.js');window.__sharedProfile=openCharacterSkins('caocao',undefined,'config');});
  await page.locator('#qhconfig_rank_select').waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator('#qhconfig_rank_select option').count(),6);
  await page.locator('#qhconfig_checkbox_text_fav').click();
  await page.waitForFunction(()=>window.lib.config.favouriteCharacter.includes('caocao'));
  await page.locator('#qhconfig_rank_select').selectOption({index:4});
  await page.waitForFunction(()=>window.lib.config.qhly_rarity.caocao==='epic');
  await page.locator('#qhconfig_checkbox_text_all').click();
  await page.waitForFunction(()=>Object.keys(window.lib.mode).filter(m=>m!=='connect').every(m=>window.lib.config[m+'_banned']?.includes('caocao')));
  await page.locator('#qhconfig_checkbox_text_identity').click();
  const bans=await page.evaluate(()=>({identity:window.lib.config.identity_banned,guozhan:window.lib.config.guozhan_banned,all:document.getElementById('qhconfig_checkbox_banned_mode_all').qhly_checked}));
  assert.ok(bans.identity.includes('liubei'));assert.ok(!bans.identity.includes('caocao'));assert.ok(bans.guozhan.includes('caocao'));assert.equal(bans.all,false);
  assert.ok(await page.locator('#qhconfig_music_select option').count()>0);
  if(await page.locator('#qhconfig_music_select option').count()>1){await page.locator('#qhconfig_music_select').selectOption({index:1});await page.waitForFunction(()=>!!window.lib.config.qhly_characterMusic.caocao);}
  await page.screenshot({path:`${out}/${theme}-profile-config.png`});
  report.checks.push('favorite, rarity, independent mode bans, music and theme-specific config layout');
  await page.locator('.qh-back').click();
  await page.waitForFunction(()=>!document.querySelector('.qh-window'));
  await page.evaluate(async()=>{const {openCharacterSkins}=await import('/noname.js');openCharacterSkins('caocao',undefined,'config');});
  await page.locator('#qhconfig_rank_select').waitFor({state:'visible'});
  assert.equal(await page.locator('.qh-window').count(),1);
  assert.equal(await page.locator('#qhconfig_checkbox_fav').evaluate(n=>n.qhly_checked),true);
  assert.equal(await page.locator('#qhconfig_rank_select').evaluate(n=>n.options[n.selectedIndex].getAttribute('rank')),'epic');
  await page.locator('.qh-back').click();
  await page.evaluate(async()=>{const {openCharacterSkins}=await import('/noname.js');openCharacterSkins('caocao',undefined,'skill');});
  await page.locator('.qh-window').waitFor({state:'visible'});await page.screenshot({path:`${out}/${theme}-profile-skills.png`});
  assert.deepEqual(report.errors,[]);report.checks.push('close/reopen preserves settings without duplicate views; skill page opens');
 } catch(error) {report.failure=error.stack;await page.screenshot({path:`${out}/${theme}-failure.png`}).catch(()=>{});throw error;}
 finally {await fs.writeFile(out+'/profile-report.json',JSON.stringify(reports,null,2));await context.close();}
 console.log(theme+': '+report.checks.join('; '));
} } finally {await browser.close();}
