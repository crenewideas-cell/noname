import {createRequire} from 'node:module';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir='output/dynamic-feedback';await fs.mkdir(dir,{recursive:true});
const baselineDir=process.env.SKIN_BASELINE_DIR||dir+'/baseline-runtime';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
const url=id=>'http://127.0.0.1:8081/extension/本地动态皮肤包/无名杀基础扩展/runtime/player.html?id='+id+'&presentation=preview';
const controls=['base_4dd0cde7da7bfa59','base_1fa4362b0a87ef2c','base_4ae89c1e5756ddc2','base_bbcb98cbc6192db8','base_3ff69240b10b81bc','base_efc31a57478fa0e2','base_333f9dfe04aad3d7','base_4e17a73e6db5330d','base_01ddfa65b119a4b1','base_92b58928df1733d4','base_a0c323434bdc7cc4','base_717914c57043a767','base_cdf8a6c7aee4577a','base_b23c8add24f5bb14','base_e27e902c52bed11d'];
const report={controls:[],targets:[]};
if(process.env.SKIN_EXTRA_CONTROLS)controls.push(...JSON.parse(process.env.SKIN_EXTRA_CONTROLS).filter(id=>!controls.includes(id)));
async function open(id,old=false,viewport={width:360,height:600}){
 const page=await browser.newPage({viewport});
 // Compare the same authored initial pose. Asset-load timing must not allow
 // one renderer's ticker to advance before its camera has been established.
 await page.addInitScript(()=>{const raf=requestAnimationFrame.bind(window);window.requestAnimationFrame=callback=>raf(function wait(t){if(!window.skinPlayer)raf(wait);else callback(t);});});
 if(old)await page.route(/\/runtime\/[^/]+\.js$/,async route=>{const name=new URL(route.request().url()).pathname.split('/').at(-1);await route.fulfill({status:200,contentType:'text/javascript',body:await fs.readFile(baselineDir+'/'+name,'utf8')});});
 await page.goto(url(id));await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{polling:50});await page.evaluate(()=>{if(window.skinPlayerError)throw Error(skinPlayerError);skinPlayer.engine42?.pause(true);skinPlayer.app?.stop();});return page;
}
try{
 for(const id of controls){const fits=[];for(const old of [true,false]){const page=await open(id,old);fits.push(await page.evaluate(()=>({fit:skinPlayer.fit,transforms:skinPlayer.engine42?.layers.map(l=>l.transform)||skinPlayer.root.children.map(l=>({x:l.x,y:l.y,scale:l.scale.x,angle:l.angle}))})));await page.close();}
  const viewport=b=>{const scale=Math.max(360/b.width,600/b.height),width=360/scale,height=600/scale;return{x:b.x+b.width/2-width/2,y:b.y+b.height/2-height/2,width,height};};
  const views=fits.map(f=>viewport(f.fit));
  for(const k of ['x','y','width','height'])assert.ok(Math.abs(views[0][k]-views[1][k])<Math.max(1,views[0].height*.005),id+' unchanged visible camera '+k+' '+JSON.stringify(fits));
  assert.deepEqual(fits[1].transforms,fits[0].transforms,id+' unchanged layer registration');report.controls.push({id,unchanged:true});
 }
 for(const [id,title] of [['base_13541023a48ab6f6','avatar-mask'],['base_d6138dd1931cd5b7','transparent-figure'],['base_971f22c4e6a0f7c2','steady-background']]){
  for(const viewport of [{width:360,height:600},{width:240,height:360}]){const page=await open(id,false,viewport);
   const data=await page.evaluate(async()=>{const p=skinPlayer,e=p.engine42;
    if(p.entry.id==='base_13541023a48ab6f6'){
      const {portraitClipBounds}=await import('./composition.js');
      return {fit:p.fit,clip:portraitClipBounds(p.entry,e.layers[0].skeleton),keptMask:e.layers[0].skeleton.slots.some(s=>s.attachment?.endSlot),background:p.entry.staticBackground,composite:p.canvas!==e.canvas,capture:p.capture()===p.canvas.toDataURL('image/png')};
    }
    if(p.entry.id==='base_d6138dd1931cd5b7'){
      const b=p.root.getBounds(),screen=p.app.screen;return {fill:p.fillScene,within:b.x>=-2&&b.y>=-2&&b.x+b.width<=screen.width+2&&b.y+b.height<=screen.height+2,bounds:{x:b.x,y:b.y,width:b.width,height:b.height}};
    }
    const samples=[];let previous=0;
    for(const time of [0,1,3.4,5,7,10.2]){
      e.draw(time-previous);previous=time;
      const b=e.layers[0],f=e.layers[1],o={set(x,y){this.x=x;this.y=y;}},s={...o};b.skeleton.getBounds(o,s,[]);
      const gl=e.canvas.getContext('webgl2')||e.canvas.getContext('webgl'),pixels=new Uint8Array(e.canvas.width*e.canvas.height*4);gl.readPixels(0,0,e.canvas.width,e.canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      let solid=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>=240)solid++;
      samples.push({time,bounds:{x:o.x,y:o.y,width:s.x,height:s.y},solid:solid/(pixels.length/4),foregroundTime:f.state.getCurrent(0).trackTime});
    }
    return {idle:e.layers[0].idle,samples};
   });
   if(title==='avatar-mask'){assert.deepEqual(data.fit,data.clip);assert.ok(data.keptMask&&data.background&&data.composite&&data.capture);}
   if(title==='transparent-figure')assert.ok(!data.fill&&data.within,JSON.stringify(data));
   if(title==='steady-background'){assert.equal(data.idle,'BeiJing');for(const s of data.samples){assert.deepEqual(s.bounds,data.samples[0].bounds);assert.ok(s.solid>.97);}assert.ok(data.samples.at(-1).foregroundTime>10);}
   report.targets.push({id,title,viewport,...data});await page.screenshot({path:dir+'/'+title+'-'+viewport.width+'.png'});await page.close();
  }
 }
}finally{await fs.writeFile(dir+'/regression.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({controls:report.controls.length,targets:report.targets.length,passed:true}));
