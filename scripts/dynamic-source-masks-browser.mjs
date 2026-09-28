import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='output/dynamic-remediation/20260926-r01/effect-viewport-r04/masks-'+(process.env.SKIN_MASK_LABEL||'v1');await fs.mkdir(out);
const source=await fs.readFile('apps/core/noname/skin/localDynamic/runtime/source-masks.js'),report={sourceSHA256:createHash('sha256').update(source).digest('hex'),rows:[]};await fs.writeFile(out+'/source-masks.js',source);
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{for(const version of ['3.8.99','4.0.56']){
 const context=await browser.newContext(),page=await context.newPage();await context.routeWebSocket('**',s=>s.close());
 const base='http://127.0.0.1:8184/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/';
 await page.goto('http://127.0.0.1:8184');
 await page.addScriptTag({url:base+'vendor/pixi.min.js'});await page.addScriptTag({url:base+'vendor/pixi-spine.js'});
 await context.route('**/mask-module.js',r=>r.fulfill({body:source,contentType:'text/javascript'}));
 const raw={skeleton:{spine:version},bones:[{name:'root'}],slots:[{name:'mask',bone:'root',attachment:'mask'},{name:'body',bone:'root',attachment:'white'},{name:'after',bone:'root',attachment:'white'}],skins:[{name:'default',attachments:{mask:{mask:{type:'clipping',end:'body',vertexCount:4,vertices:[-40,-40,0,-40,0,40,-40,40]}},body:{white:{type:'region',path:'white',width:80,height:80}},after:{white:{type:'region',path:'white',x:100,width:80,height:80}}}}],animations:{idle:{slots:{body:{attachment:[{time:0,name:'white'}]}}}}};
 const atlas='white.png\nsize: 4,4\nformat: RGBA8888\nfilter: Nearest,Nearest\nrepeat: none\nwhite\n  rotate: false\n  xy: 0,0\n  size: 4,4\n  orig: 4,4\n  offset: 0,0\n  index: -1\n';
 await context.route('**/fixture.json',r=>r.fulfill({json:raw}));
 const row=await page.evaluate(async({atlas,version})=>{
  const {installSourceMasks}=await import('/mask-module.js');
  const tex=document.createElement('canvas');tex.width=tex.height=4;const c=tex.getContext('2d');c.fillStyle='white';c.fillRect(0,0,4,4);
  const baseTexture=PIXI.BaseTexture.from(tex),loader=new PIXI.Loader();
  const data=await new Promise((resolve,reject)=>{loader.onError.once(reject);loader.add('fixture','/fixture.json',{metadata:{atlasRawData:atlas,imageLoader:()=>((name,callback)=>callback(baseTexture))}}).load((l,r)=>resolve(r.fixture.spineData));});
  const s=new PIXI.spine.Spine(data);s.autoUpdate=false;s.state.setAnimation(0,'idle',true);
  let hidden=[];installSourceMasks(s,()=>hidden);
  const app=new PIXI.Application({width:220,height:120,resolution:1,backgroundAlpha:0,antialias:false,preserveDrawingBuffer:true,autoStart:false});document.body.replaceChildren(app.view);app.stage.addChild(s);s.position.set(50,60);
  const sample=(names)=>{hidden=names;s.update(0);app.render();const pixels=app.renderer.plugins.extract.pixels();let count=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>128)count++;return count;};
  // hideSlots addresses attachment names, so rename only the second attachment
  // to distinguish the clip end slot from the unrelated following region.
  s.skeleton.slots[2].attachment.name='following';
  const baseline=sample([]),hideBody=sample(['white']),again=sample(['white']),restored=sample([]),hideClip=sample(['mask']),clipRestored=sample([]);
  return{version,baseline,hideBody,again,restored,hideClip,clipRestored,clips:s.skeleton.slots.filter(s=>s.attachment?.type===6).length};
 },{atlas,version});
 report.rows.push(row);await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await page.screenshot({path:out+'/'+version+'.png'});await context.close();
 assert.equal(row.baseline,9600);assert.equal(row.hideBody,6400);assert.equal(row.again,6400);assert.equal(row.restored,9600);assert.equal(row.hideClip,12800);assert.equal(row.clipRestored,9600);
}}finally{await browser.close();}
console.log(JSON.stringify(report.rows));
