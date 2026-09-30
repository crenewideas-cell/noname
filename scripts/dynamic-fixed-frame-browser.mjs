import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='output/dynamic-fixed-frame/'+(process.env.SKIN_PHASE||'before');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const ids=JSON.parse(process.env.SKIN_CASES||'["base_074ec858223f73a5","base_b5dbffb9a7b60f34","base_69bf4c9ca71ca0dd"]'),report=[];
try{for(const id of ids){
 const page=await browser.newPage({viewport:{width:360,height:600}});
 await page.goto('http://127.0.0.1:18084/noname/skin/localDynamic/'+(process.env.SKIN_RUNTIME||'runtime')+'/player.html?presentation=preview&assetBase='+encodeURIComponent('/extension/本地动态皮肤包/无名杀基础扩展/')+'&id='+id);
 await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
 const state=await page.evaluate(async()=>{
  if(skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.pause(true);
  const comp=await import('./composition.js'),layers=p.engine42?.layers||p.root.children;
  return{fit:p.fit,presentation:p.presentation,fillScene:p.fillScene,layers:layers.map(l=>({idle:l.idle||l.skinIdle,transform:p.engine42?(l.transform||{}):{scale:l.scale.x,x:l.x,y:l.y,angle:l.angle},face:comp.subjectBounds(l.skeleton,{},true),slots:l.skeleton.slots.map(s=>({name:s.attachment?.name,bone:s.bone.data.name,blend:s.data.blendMode})),bounds:comp.paintingBounds(l.skeleton)}))};
 });
 report.push({id,...state});await page.screenshot({path:out+'/'+id+'.png'});
 if(id==='base_074ec858223f73a5'){
  const frames=[];report.at(-1).frames=frames;
  for(const t of [0,1,3,5,10,20]){
   frames.push(await page.evaluate(async t=>{const p=skinPlayer,layers=p.engine42?.layers||p.root.children,c=await import('./composition.js');for(const l of layers){l.skeleton.setToSetupPose();l.state.clearTracks();const tr=l.state.setAnimation(0,l.idle||l.skinIdle,true);tr.trackTime=t;l.state.apply(l.skeleton);l.skeleton.updateWorldTransform();}p.renderFrame();return {t,layers:layers.map(l=>({track:l.state.getCurrent(0).animation.name,duration:l.state.getCurrent(0).animation.duration,face:c.subjectBounds(l.skeleton,{},true)}))};},t));
   await page.screenshot({path:out+'/'+id+'-t'+t+'.png'});
  }
  await page.evaluate(async()=>{const p=skinPlayer;await p.motion('ChuChang',false);for(let i=0;i<500;i++)p.engine42.draw(.05);});
  report.at(-1).afterEntrance=await page.evaluate(async()=>{const p=skinPlayer,c=await import('./composition.js');return p.engine42.layers.map(l=>({track:l.state.getCurrent(0)?.animation.name,face:c.subjectBounds(l.skeleton),bones:l.skeleton.bones.filter(b=>Math.abs(b.scaleX-b.data.scaleX)>.01).map(b=>({name:b.data.name,scale:b.scaleX,setup:b.data.scaleX}))}));});
  await page.screenshot({path:out+'/'+id+'-after-entrance.png'});
 }
 console.log(JSON.stringify({id,fit:state.fit,presentation:state.presentation}));await page.close();
}}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await browser.close();}

