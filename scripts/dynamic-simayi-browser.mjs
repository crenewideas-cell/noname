import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=path.resolve('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展');
const runtime=path.resolve(process.env.SKIN_RUNTIME||'apps/core/noname/skin/localDynamic/runtime');
const out=process.env.SKIN_OUT||'output/dynamic-simayi/before';await fs.mkdir(out,{recursive:true});
const catalog=JSON.parse(await fs.readFile(base+'/catalog.json'));
const ids=process.env.SKIN_CASES?JSON.parse(process.env.SKIN_CASES):catalog.entries.filter(e=>e.character==='司马懿').map(e=>e.id);
const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.join(pathname.startsWith('/runtime/')?runtime:base,pathname.replace(/^\/(?:runtime\/)?/,''));const data=await fs.readFile(file);res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const report=[];
try{for(const id of ids){
 const page=await browser.newPage({viewport:{width:360,height:600}});
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto(`http://127.0.0.1:${server.address().port}/runtime/player.html?assetBase=/&id=${id}&presentation=preview`);
 await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000,polling:100});
 if(process.env.SKIN_EXPERIMENT)await page.evaluate(await fs.readFile(process.env.SKIN_EXPERIMENT,'utf8'));
 const data=await page.evaluate(async()=>{
  if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.pause(true);
  const c=await import('./composition.js'),sc=await import('./scene-coordinates.js');const layers=p.engine42?.layers||p.root.children;
  return {id:p.entry.id,title:p.entry.title,fit:p.fit,fill:p.fillScene,presentation:p.presentation,shared:sc.sharedSceneCoordinates(layers[0].skeleton,layers.at(-1).skeleton),layers:layers.map((l,i)=>({meta:p.entry.models[i],idle:l.idle||l.skinIdle,transform:p.engine42?l.transform:{scale:l.scale.x,x:l.x,y:l.y,angle:l.angle},face:c.subjectBounds(l.skeleton,{},true),painting:c.paintingBounds(l.skeleton),bones:l.skeleton.bones.slice(0,12).map(b=>({name:b.data.name,x:b.worldX,y:b.worldY,sx:b.data.scaleX,sy:b.data.scaleY})),slots:l.skeleton.slots.map(s=>({name:s.attachment?.name,bone:s.bone.data.name,blend:s.data.blendMode}))}))};
 });
 data.probe=await page.evaluate(()=>window.skinProbe);report.push(data);await page.screenshot({path:out+'/'+id+'.png'});console.log(JSON.stringify({id,title:data.title,fit:data.fit,guard:data.presentation.cameraGuard,shared:data.shared,probe:data.probe}));
 if(process.env.SKIN_SWEEP){data.frames=[];
  for(const size of [{width:240,height:360},{width:360,height:600}]){await page.setViewportSize(size);
   for(const time of [0,1,3,5,10]){
    const frame=await page.evaluate(time=>{const p=skinPlayer,layers=p.engine42?.layers||p.root.children;
     for(const l of layers){l.skeleton.setToSetupPose();l.state.clearTracks();l.state.setAnimation(0,l.idle||l.skinIdle,true);}
     if(p.engine42)p.engine42.draw(time);else{layers.forEach(l=>l.update(time));p.app.render();}p.renderFrame();
     return {time,fit:p.fit,tracks:layers.map(l=>l.state.getCurrent(0)?.animation.name)};
    },time);
    assert.ok(Object.values(frame.fit).every(Number.isFinite));data.frames.push({size,...frame});
    await page.screenshot({path:out+'/'+id+'-'+size.width+'-'+time+'.png'});
   }
  }
 }
 await page.close();
}}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await browser.close();await new Promise(r=>server.close(r));}


