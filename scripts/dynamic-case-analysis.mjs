import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8081';
const examples=['base_3360d64ee53fc194','base_e27e902c52bed11d','base_b23c8add24f5bb14','base_38c67eef25ea1c12','base_cd036a9d56e5206a','base_2f7a9300c90e4829','base_adcc4a11974c42be','base_d99abf6cbcdb6af8'];
const variants=process.argv.includes('--variants')?JSON.parse(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/scene-variants.json')).map(e=>e.id):[];
const ids=process.env.SKIN_CASE_IDS?.split(',')||(variants.length?[...new Set([...variants,...examples])]:['base_67e9418133ddae9f','base_cdf8a6c7aee4577a','base_0685a913b002be4e','base_b23c8add24f5bb14','base_e27e902c52bed11d']);
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
await fs.mkdir('output/dynamic-cases',{recursive:true});
const report=[];
try{for(const id of ids){
 const page=await browser.newPage({viewport:{width:360,height:600}});
 const errors=[],missing=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('response',response=>{if(response.status()>=400)missing.push(response.url());});
 await page.goto(origin+'/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/player.html?id='+id+'&presentation=preview');
 await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
 const data=await page.evaluate(()=>{
  if(window.skinPlayerError)throw Error(skinPlayerError);
  const p=skinPlayer,e=p.engine42;e?.pause(true);p.app?.stop();
  return {id:p.entry.id,title:p.entry.title,models:p.entry.models,fit:p.fit,pixiLayers:p.root?.children.map(l=>{const b=l.getLocalBounds();return {bounds:{x:b.x,y:b.y,width:b.width,height:b.height}};}),layers:e?.layers.map(l=>{const o={set(x,y){this.x=x;this.y=y;}},s={...o};l.skeleton.getBounds(o,s,[]);return {bounds:[o.x,o.y,s.x,s.y],exported:[l.skeleton.data.x,l.skeleton.data.y,l.skeleton.data.width,l.skeleton.data.height],root:l.skeleton.bones[0].data,legacy:l.meta.legacy};})};
 });
 data.paintings=await page.evaluate(()=>{
  const p=skinPlayer,layers=p.engine42?.layers.map(l=>l.skeleton)||p.root?.children.map(l=>l.skeleton).filter(Boolean)||[];
  return layers.map(s=>s.slots.filter(slot=>/^(bg|beijing|background)$/.test(slot.attachment?.name||'')).map(slot=>{
   const a=slot.attachment,vertices=new Float32Array(a.worldVerticesLength||8);
   if(a.worldVerticesLength)a.computeWorldVertices(slot,0,a.worldVerticesLength,vertices,0,2);else a.computeWorldVertices(slot.bone,vertices,0,2);
   return {name:a.name,region:[a.region?.width,a.region?.height],vertices:Array.from(vertices)};
  }));
 });
 data.backgroundSlots=await page.evaluate(()=>{
  const p=skinPlayer,s=p.engine42?.layers[0].skeleton||p.root?.children[0].skeleton;
  return s?.slots.filter(slot=>slot.attachment?.region).map(slot=>({name:slot.attachment.name,slot:slot.data.name,blend:slot.data.blendMode,size:[slot.attachment.region.width,slot.attachment.region.height]}));
 });
 data.faces=await page.evaluate(()=>{
  const p=skinPlayer,s=p.engine42?.layers.at(-1).skeleton||p.root?.children.at(-1).skeleton;
  return s?.slots.filter(slot=>/tou|lian|head|face|头|脸/i.test(slot.attachment?.name||'')).map(slot=>({name:slot.attachment.name,bone:slot.bone.data.name,x:slot.bone.worldX,y:slot.bone.worldY}));
 });
 data.clipping=await page.evaluate(()=>skinPlayer.engine42?.layers.map(l=>l.skeleton.slots.filter(s=>s.attachment?.endSlot!==undefined).map(s=>({slot:s.data.name,name:s.attachment.name,end:s.attachment.endSlot?.name,vertices:Array.from(s.attachment.vertices)}))));
 await page.screenshot({path:`output/dynamic-cases/${id}-current.png`});
 if(id==='base_67e9418133ddae9f')assert.ok(data.fit.height>1000,'Camera must include the full transparent figure, not just opaque clothing');
 if(id==='base_0685a913b002be4e')assert.ok(data.fit.height<1000,'Camera must fit the background, excluding off-painting legs and effects');
 if(id==='base_b23c8add24f5bb14'){
  assert.ok(data.fit.x+data.fit.width/2< -150,'Off-center face must stay inside the portrait');
  await page.goto(page.url().replace('presentation=preview','presentation=portrait'));
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
  assert.deepEqual(await page.evaluate(()=>skinPlayer.fit),data.fit,'Opponent portraits must use the same subject focus');
 }
 if(process.argv.includes('--layers')&&data.layers){
  for(let i=0;i<data.layers.length;i++){
   await page.evaluate(i=>{const e=skinPlayer.engine42;e.layers.forEach((l,n)=>l.enabled=n===i);e.draw();},i);
   await page.screenshot({path:`output/dynamic-cases/${id}-layer${i}.png`});
  }
 }
 if(process.argv.includes('--native')&&await page.evaluate(()=>!!skinPlayer.engine42)){
  await page.evaluate(async()=>{
   const {spine}=await import('/extension/十周年局内UI/vendor/spine.js');
   const {createAnimationRenderer}=await import('/extension/十周年局内UI/animation-renderer.js');
   const {restoreMeshUVs}=await import('./mesh-uv.js');
   const {AnimationPlayer}=createAnimationRenderer(spine);
   const p=skinPlayer,canvas=p.engine42.canvas;canvas.style.display='none';
   const renderer=new AnimationPlayer(new URL('../',location.href).href,document.body);
   renderer.canvas.style.cssText='width:100%;height:100%;position:absolute;inset:0';renderer.resized=false;
   for(const m of p.entry.models){
    const name=m.skeleton.replace(/\.skel$/,'');await new Promise((ok,no)=>renderer.loadSpine(name,'skel',ok,no));
    const skeleton=renderer.prepSpine(name);
    for(const skin of skeleton.data.skins)for(const slots of skin.attachments)for(const attachment of Object.values(slots||{}))if(attachment instanceof spine.MeshAttachment)restoreMeshUVs(attachment);
    renderer.playSpine({...m.legacy,name,loop:true},{x:m.legacy.x,y:m.legacy.y,scale:(m.legacy.scale||1)*600/180,angle:m.legacy.angle});
   }
   window.nativeRenderer=renderer;
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  await page.screenshot({path:`output/dynamic-cases/${id}-native.png`});
 }
 const files=new Set(data.models.flatMap(m=>[m.skeleton,m.atlas]));
 for(const m of data.models){
  const atlas=await fs.readFile('temp/动态皮包/无名杀基础扩展/'+m.atlas,'utf8');
  for(const name of atlas.match(/^\S.*\.(?:png|jpg|webp)\s*$/gm)||[])files.add(path.posix.join(path.posix.dirname(m.atlas),name.trim()));
 }
 data.sourceFiles=[];
 for(const file of files){
  const source=await fs.readFile('temp/动态皮包/无名杀基础扩展/'+file);
  const imported=await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/'+file);
  data.sourceFiles.push({file,bytes:source.length,sha256:createHash('sha256').update(source).digest('hex'),identical:source.equals(imported)});
 }
 assert.ok(data.sourceFiles.every(f=>f.identical));assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 report.push(data);console.log(JSON.stringify({id,title:data.title,files:data.sourceFiles.length,unchanged:true}));await page.close();
}}finally{await fs.writeFile('output/dynamic-cases/analysis.json',JSON.stringify(report,null,2));await browser.close();}

