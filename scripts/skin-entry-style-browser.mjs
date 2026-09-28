import {createRequire} from 'node:module';
import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const out='output/lobby-settings-corrected';await fs.mkdir(out,{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:810}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
await page.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname!=='127.0.0.1'||u.pathname.startsWith('/api/')||u.pathname.startsWith('/ws/')?r.abort():r.continue();});
await page.addInitScript(()=>{sessionStorage.setItem('noname_0.9_return_to_lobby','true');window.__uiApps=[];let pixi;Object.defineProperty(window,'PIXI',{configurable:true,get:()=>pixi,set(value){const App=value.Application;if(App&&!App.__recorded){const Recorded=class extends App{constructor(...args){super(...args);window.__uiApps.push(this);}};Recorded.__recorded=true;value.Application=Recorded;}pixi=value;}});});
await page.route('**/game/config.json',async r=>{const response=await r.fetch(),config=await response.json();for(const k of Object.keys(config))if(k.startsWith('extension_')&&k.endsWith('_enable'))config[k]=false;Object.assign(config,{extensions:['千幻聆音'],extension_千幻聆音_enable:true,extension_auto_import:false,new_tutorial:true,version:'1.11.6',show_splash:'always',ui_workshop_active:'builtin-rzsh',change_skin:true,change_skin_auto:'off'});await r.fulfill({response,json:config});});
async function clickSprite(name){const h=await page.waitForFunction(name=>{let result;function visit(n,app){if(!n.worldVisible)return;if(n.name===name&&n.interactive){const r=n.getBounds(),b=app.view.getBoundingClientRect();const x=b.left+(r.x+r.width/2)*b.width/app.screen.width,y=b.top+(r.y+r.height/2)*b.height/app.screen.height;if(x>0&&y>0&&x<innerWidth&&y<innerHeight)result={x,y};}n.children?.forEach(c=>visit(c,app));}for(const app of window.__uiApps)if(app.stage&&app.view.isConnected)visit(app.stage,app);return result;},name,{timeout:90000});const p=await h.jsonValue();console.log(name,p);await page.mouse.click(p.x,p.y);}
const style=selector=>page.locator(selector).evaluate(n=>{const s=getComputedStyle(n);return {image:s.backgroundImage,size:s.backgroundSize,position:s.backgroundPosition,color:s.color,before:getComputedStyle(n,'::before').display,icon:getComputedStyle(n.querySelector('.skin-management-entry-icon')).display};});
try{
 await page.goto('http://127.0.0.1:5174',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.game?.qhly_coreReady===true,null,{timeout:120000});
 await page.waitForTimeout(6000);
 await clickSprite('wujiangbutton');await page.locator('.lobby-character-manage').waitFor({state:'visible',timeout:15000});
 await page.waitForTimeout(500);const gallery=await style('.lobby-character-manage');await page.screenshot({path:out+'/skin-gallery.png'});
 await page.evaluate(async()=>{const {lib}=await import('/noname.js');await lib.uiWorkshop.openSettings('options');});
 assert.equal(await page.locator('.lobby-character-tools').evaluate(n=>getComputedStyle(n).opacity==='0'&&n.inert),true);
 await page.screenshot({path:out+'/settings-over-gallery.png'});
 await page.getByRole('button',{name:'完成 · 返回大厅',exact:true}).click();
 await page.waitForFunction(()=>{const n=document.querySelector('.lobby-character-tools');return getComputedStyle(n).opacity==='1'&&!n.inert;});
 await page.evaluate(async()=>{const {openCharacterSkins}=await import('/noname.js');openCharacterSkins('caocao');});
 await page.locator('.qhly-manage-entry').waitFor();await page.waitForTimeout(700);const detail=await style('.qhly-manage-entry');
 assert.deepEqual(detail,gallery);await page.screenshot({path:out+'/skin-detail.png'});
 await page.locator('.qhly-manage-entry').click();await page.locator('.skin-manager').waitFor();
 assert.deepEqual(errors,[]);await fs.writeFile(out+'/skin-entry-report.json',JSON.stringify({gallery,detail,errors,checks:['same atlas frame and colors in gallery/detail','no icon or alternate frame','settings fully hides and restores actual gallery toolbar','detail button opens skin manager']},null,2));console.log('Skin entry: identical shared atlas, settings isolation and manager action passed');
}catch(error){await page.screenshot({path:out+'/skin-entry-failure.png'});console.log(JSON.stringify({errors,toolbar:await page.locator('.lobby-character-tools').evaluate(n=>n.outerHTML.slice(0,1000))}));throw error;}finally{await browser.close();}
