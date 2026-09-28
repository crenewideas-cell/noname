import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const runtime='apps/core/noname/skin/localDynamic/runtime/',pack='/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
const context=await browser.newContext({viewport:{width:240,height:360}});
await context.route('**/runtime/spine-assets.js',route=>route.fulfill({path:path.resolve(runtime,'spine-assets.js'),contentType:'text/javascript'}));
try{
 for(const candidate of [false,true]){
  const page=await context.newPage();
  await page.route('**/runtime/contract-test.html',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"></body></html>'}));
  await page.goto(origin+pack+'runtime/contract-test.html');
  await page.addScriptTag({content:await fs.readFile(runtime+'framing.js','utf8')});
  await page.addScriptTag({content:await fs.readFile((candidate?'':path.join(run,'baseline')+'/')+runtime+'spine42.js','utf8')});
  const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=1;const g=c.getContext('2d');g.fillStyle='#ff2020';g.fillRect(0,0,1,1);return c.toDataURL().split(',')[1];});
  const fixture={skeleton:{spine:'4.2.37'},bones:[{name:'root'}],slots:[{name:'slot',bone:'root',attachment:'quad'}],skins:[{name:'default',attachments:{slot:{quad:{type:'region',width:100,height:100}}}}],animations:{idle:{bones:{root:{translate:[{time:0},{time:1,x:20}]}}}}};
  await page.route('**/fixture.json',r=>r.fulfill({json:fixture}));
  await page.route('**/fixture.atlas',r=>r.fulfill({body:'fixture.png\nsize: 1,1\nformat: RGBA8888\nfilter: Nearest,Nearest\nrepeat: none\nquad\n  rotate: false\n  xy: 0, 0\n  size: 1, 1\n  orig: 1, 1\n  offset: 0, 0\n  index: -1\n'}));
  await page.route('**/fixture.png',r=>r.fulfill({body:Buffer.from(png,'base64'),contentType:'image/png'}));
  const result=await page.evaluate(async()=>{let engine;try{
   engine=await createSpine42({models:[{skeleton:'fixture.json',atlas:'fixture.atlas',version:'4.2.37'}]},p=>new URL(p,location.href).href,{scale:1,x:0,y:0});engine.pause(true);engine.draw(.5);const gl=engine.canvas.getContext('webgl2')||engine.canvas.getContext('webgl'),pixels=new Uint8Array(engine.canvas.width*engine.canvas.height*4);gl.readPixels(0,0,engine.canvas.width,engine.canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);return{loaded:true,rootX:engine.layers[0].skeleton.bones[0].x,visiblePixels:pixels.filter((v,i)=>i%4===3&&v>0).length};
  }catch(error){return{loaded:false,error:String(error)};}finally{engine?.destroy();}});
  results.push({case:'4.2 JSON format routing',candidate,...result});await page.close();
 }
 assert.equal(results[0].loaded,false,'baseline must reproduce wrong binary routing');assert.equal(results[1].loaded,true);assert.ok(results[1].visiblePixels>1000);assert.ok(Math.abs(results[1].rootX-10)<.05);
 const page=await context.newPage();
 await page.route('**/runtime/contract-test.html',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"></body></html>'}));
 await page.goto(origin+pack+'runtime/contract-test.html');await page.addScriptTag({content:await fs.readFile(runtime+'framing.js','utf8')});await page.addScriptTag({content:await fs.readFile(runtime+'spine36.js','utf8')});
 const catalog=JSON.parse(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/catalog.json'));const model=catalog.entries.flatMap(e=>e.models||[]).find(m=>m.version==='3.6.38'&&!m.skeleton.endsWith('.json'));
 const zero=await page.evaluate(async({model,base})=>{const e=await createSpine36({models:[{...model,legacy:{speed:0}}]},p=>new URL(p,base).href,{scale:1,x:0,y:0});e.pause(true);const before=e.layers[0].state.getCurrent(0).trackTime;e.draw(1);const after=e.layers[0].state.getCurrent(0).trackTime;e.destroy();return{before,after,remainingCanvas:document.querySelectorAll('canvas').length};},{model,base:origin+pack});
 assert.equal(zero.before,0);assert.equal(zero.after,0);assert.equal(zero.remainingCanvas,0);results.push({case:'3.6 speed zero and disposal',candidate:true,...zero});await page.close();
}finally{await browser.close();await fs.writeFile(path.join(run,'runtime-contract-browser.json'),JSON.stringify(results,null,2));}
console.log(JSON.stringify(results));
