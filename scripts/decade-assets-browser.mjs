// Decode the shipped skeletons in a real WebGL renderer, without running a game.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.NONAME_PLAYWRIGHT_MODULE||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.resolve(process.env.NONAME_ASSETS_OUTPUT||'output/decade-audit');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
await page.route('**/__decade-assets',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
const report={};
try{
 await page.goto((process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8181')+'/__decade-assets');
 report.skeletons=await page.evaluate(async()=>{
  const base='/extension/十周年局内UI/';
  const {spine}=await import(base+'vendor/spine.js'),{createAnimationRenderer}=await import(base+'animation-renderer.js');
  const {AnimationPlayer}=createAnimationRenderer(spine);
  const files=await(await fetch(base+'files.json')).json();
  const results=[];
  for(const folder of ['animation','dynamic']){
   const renderer=new AnimationPlayer(base+'assets/'+folder+'/',document.body);
   if(!renderer.gl)throw new Error('WebGL unavailable');
   try{
    for(const file of files.filter(f=>f.startsWith('assets/'+folder+'/')&&/\.(skel|json)$/.test(f))){
     const name=file.slice(('assets/'+folder+'/').length,-5);
     const type=file.endsWith('.json')?'json':'skel';
     await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Timeout '+file)),10000);renderer.loadSpine(name,type,()=>{clearTimeout(timer);resolve();},()=>{clearTimeout(timer);reject(new Error('Cannot load '+file));});});
     const actions=renderer.getSpineActions(name);
     if(!actions?.length)throw new Error('No actions '+file);
     const sprite=renderer.playSpine({name,action:actions[0].name},{scale:.1});
     await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
     renderer.stopSpine(sprite);results.push({file,actions:actions.map(a=>a.name)});
    }
   }finally{cancelAnimationFrame(renderer.requestId);renderer.stopSpineAll();renderer.canvas.remove();renderer.spine.assetManager?.dispose?.();renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();}
  }
  return results;
 });
 for(const[name,actions]of [
  ['globaltexiao/huifushuzi/shuzi2',Array.from({length:9},(_,i)=>String(i+1))],
  ['globaltexiao/shanghaishuzi/SZN_shuzi',Array.from({length:8},(_,i)=>String(i+2))],
  ['globaltexiao/xunishuzi/SS_PaiJu_xunishanghai',Array.from({length:10},(_,i)=>'play'+i)],
  ['effect_panding',['play4','play5']],
  ['effect_shoujidonghua',['play1','play2','play3','play4','play5','play6']],
 ]){const entry=report.skeletons.find(x=>x.file==='assets/animation/'+name+'.skel');assert.ok(entry,name);for(const action of actions)assert.ok(entry.actions.includes(action),name+': '+action);}
 assert.deepEqual(errors,[]);report.passed=true;
}catch(error){report.failure=error.stack;process.exitCode=1;}
finally{report.errors=errors;await fs.writeFile(path.join(output,'skeleton-runtime.json'),JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({passed:report.passed,skeletons:report.skeletons?.length,failure:report.failure,errors},null,2));
