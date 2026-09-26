import {createRequire} from 'node:module';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const results=[];await fs.mkdir('output/dynamic-first-frame',{recursive:true});
try{for(const id of ['base_717914c57043a767','base_92b58928df1733d4','base_a0c323434bdc7cc4','base_4dd0cde7da7bfa59']){
 const page=await browser.newPage({viewport:{width:360,height:600}});
 // Hold the async boundary after the native renderer has drawn its temporary
 // sampling canvas. This deterministically exposes the former startup flash.
 await page.route('**/runtime/player.js',async route=>{const r=await route.fetch();let body=await r.text();body=body.replace("const {compositionFor,avatarLayerTransform", "await new Promise(resolve=>setTimeout(resolve,500));const {compositionFor,avatarLayerTransform");await route.fulfill({response:r,body});});
 await page.addInitScript(()=>{
  window.firstFrames=[];let done=0;
  function sample(){const c=document.querySelector('canvas');if(c){const ready=document.documentElement.hasAttribute('data-skin-ready');firstFrames.push({ready,visible:getComputedStyle(c).visibility!=='hidden',width:c.width,height:c.height});if(ready)done++;}if(done<8)requestAnimationFrame(sample);}
  requestAnimationFrame(sample);
 });
 await page.goto('http://127.0.0.1:8081/extension/本地动态皮肤包/无名杀基础扩展/runtime/player.html?id='+id+'&presentation=preview');
 await page.waitForFunction(()=>window.skinPlayer&&firstFrames.filter(f=>f.ready).length>=8);
 const frames=await page.evaluate(()=>firstFrames);
 if(['base_92b58928df1733d4','base_a0c323434bdc7cc4'].includes(id)){
  const selection=await page.evaluate(()=>({variant:skinPlayer.entry.models.at(-1).sceneVariant,transform:skinPlayer.engine42.layers.at(-1).transform}));
  assert.ok(selection.variant.restoresCoverage);
  assert.deepEqual(selection.transform,selection.variant.transform,'Complete geometry is not enlarged a second time');
 }
 assert.ok(frames.some(f=>!f.ready),'Observed sampling/loading interval');
 assert.ok(frames.filter(f=>!f.ready).every(f=>!f.visible),'Intermediate fitting renders never appear');
 assert.ok(frames.filter(f=>f.visible).every(f=>f.ready&&f.width===360&&f.height===600),'The first visible frame has final viewport geometry');
 await page.screenshot({path:`output/dynamic-first-frame/${id}.png`});results.push({id,frames:frames.length,hiddenLoadingFrames:frames.filter(f=>!f.ready).length,passed:true});await page.close();
}}finally{await fs.writeFile('output/dynamic-first-frame/report.json',JSON.stringify(results,null,2));await browser.close();}
console.log(JSON.stringify(results));
