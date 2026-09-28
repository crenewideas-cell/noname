import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require('playwright');}catch{playwright=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:5174';
const output='output/ui-unification/boot';await fs.mkdir(output,{recursive:true});
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const report={errors:[],sizes:[]};
try{
 const page=await browser.newPage({viewport:{width:1440,height:810}});
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(origin+'/extension/ui/手杀标准UI/boot.html',{waitUntil:'domcontentloaded'});
 await page.locator('#still').waitFor({state:'detached',timeout:60000});
 for(const viewport of [{width:1440,height:810},{width:960,height:540},{width:600,height:900}]){
  await page.setViewportSize(viewport);await page.waitForTimeout(1200);
  const state=await page.evaluate(()=>({width:document.querySelector('canvas').width,height:document.querySelector('canvas').height,tip:document.querySelector('#tip').textContent}));
  assert.equal(state.width,viewport.width);assert.equal(state.height,viewport.height);assert.ok(state.tip.length>0);
  await page.screenshot({path:`${output}/${viewport.width}x${viewport.height}.png`});report.sizes.push(state);
 }
 // Exercise the provider at the extra directory depth used by workshop exports.
 const relocated='/extension/test-export/providers/shousha/';
 await page.route('**'+relocated+'**',async route=>{
  const requested=new URL(route.request().url());
  const response=await route.fetch({url:origin+'/extension/ui/手杀标准UI/'+requested.pathname.slice(relocated.length)+requested.search});
  await route.fulfill({response});
 });
 await page.goto(origin+relocated+'boot.html?elements='+encodeURIComponent(origin+'/noname/ui/lobbyElements.js'),{waitUntil:'domcontentloaded'});
 await page.locator('#still').waitFor({state:'detached',timeout:60000});
 assert.equal(await page.locator('canvas').count(),1);report.relocatedProvider=true;
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await fs.writeFile(output+'/report.json',JSON.stringify(report,null,2));await browser.close();}
