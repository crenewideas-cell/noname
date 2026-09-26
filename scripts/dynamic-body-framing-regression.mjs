import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8081';
const ids=['base_4dd0cde7da7bfa59','base_1fa4362b0a87ef2c','base_4ae89c1e5756ddc2','base_bbcb98cbc6192db8','base_3ff69240b10b81bc','base_efc31a57478fa0e2','base_333f9dfe04aad3d7','base_4e17a73e6db5330d','base_01ddfa65b119a4b1'];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const report=[];
await fs.mkdir('output/dynamic-body-regression',{recursive:true});
try{for(const id of ids){for(const [width,height,presentation] of [[360,600,'preview'],[240,360,'portrait']]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/extension/本地动态皮肤包/无名杀基础扩展/runtime/player.html?id='+id+'&presentation='+presentation);
 await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
 const data=await page.evaluate(async()=>{
  if(window.skinPlayerError)throw Error(skinPlayerError);
  const p=skinPlayer,e=p.engine42;e?.pause(true);p.app?.stop();
  const {subjectBounds}=await import('./composition.js');
  const fg=e?.layers.at(-1)||p.root.children.at(-1),s=fg.skeleton;
  const face=subjectBounds(s,e?fg.transform:{scale:fg.scale.x,angle:fg.angle,x:fg.x,y:fg.y});
  const scale=Math.max(innerWidth/p.fit.width,innerHeight/p.fit.height),cx=p.fit.x+p.fit.width/2,cy=p.fit.y+p.fit.height/2;
  const rect=face&&{left:.5+(face.x-cx)*scale/innerWidth,right:.5+(face.x+face.width-cx)*scale/innerWidth,
   top:.5+(e?cy-face.y-face.height:face.y-cy)*scale/innerHeight,bottom:.5+(e?cy-face.y:face.y+face.height-cy)*scale/innerHeight};
  const canvas=e?.canvas||p.app.view,gl=canvas.getContext('webgl2')||canvas.getContext('webgl'),pixels=new Uint8Array(canvas.width*canvas.height*4);
  gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  let solid=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>=240)solid++;
  const variant=p.entry.models.at(-1).sceneVariant;
  const limbs=variant?.addedLimbs?.filter(name=>s.slots.some(slot=>slot.attachment?.name===name&&slot.color.a>0));
  return {id:p.entry.id,title:p.entry.title,fit:p.fit,subject:rect,opaque:solid/(pixels.length/4),limbs,restoresLimbs:variant?.restoresLimbs};
 });
 report.push({...data,presentation});
 await page.screenshot({path:`output/dynamic-body-regression/${id}-${presentation}.png`});
 assert.deepEqual(errors,[]);
 assert.ok(data.subject,`${id}: subject anchor exists`);
 assert.ok(data.subject.left>=0&&data.subject.right<=1&&data.subject.top>=0&&data.subject.bottom<=1,`${id}: face/body anchor remains inside ${presentation}: ${JSON.stringify(data.subject)}`);
 assert.ok(data.opaque>.97,`${id}: background fills ${presentation}: ${data.opaque}`);
 if(['base_4ae89c1e5756ddc2','base_bbcb98cbc6192db8','base_3ff69240b10b81bc','base_333f9dfe04aad3d7'].includes(id)){
  assert.equal(data.restoresLimbs,true);assert.ok(data.limbs.length>=2,`${id}: complete lower-body attachments are active`);
 }
 await page.close();
}}console.log(JSON.stringify({skins:ids.length,views:report.length,passed:true}));
}finally{await fs.writeFile('output/dynamic-body-regression/report.json',JSON.stringify(report,null,2));await browser.close();}
