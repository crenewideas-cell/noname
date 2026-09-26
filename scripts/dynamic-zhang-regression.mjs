import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展',dir='output/dynamic-zhang';
const registered=JSON.parse(await fs.readFile(root+'/layer-registrations.json'));
const examples=['base_83d753e6d2a0f18f','base_aa87b209d784abc4','base_dc9bb99af8e089d0','base_f1a362b7ea17bcc1'];
const ids=[...new Set([...examples,...registered.map(e=>e.id)])],report=[];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
try{for(const id of ids){for(const size of examples.includes(id)?[[360,600],[240,360]]:[[360,600]]){
 const page=await browser.newPage({viewport:{width:size[0],height:size[1]}});await page.goto('http://127.0.0.1:8081/extension/本地动态皮肤包/无名杀基础扩展/runtime/player.html?id='+id+'&presentation=preview');await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
 const data=await page.evaluate(async()=>{
  if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer,e=p.engine42;e?.pause(true);p.app?.stop();const samples=[];
  for(const dt of [0,1,2,2]){
   e?.draw(dt);if(p.app){p.root.children.forEach(s=>s.update(dt));p.app.render();}
   const canvas=e?.canvas||p.app.view,gl=canvas.getContext('webgl2')||canvas.getContext('webgl'),pixels=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let solid=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>=240)solid++;
   let maxError=0,matched=0;
   const fg=e?.layers.at(-1),registration=fg?.meta.layerRegistration;
   if(registration){const bg=e.layers[0].skeleton,t=fg.transform,r=t.angle*Math.PI/180,c=Math.cos(r)*t.scale,s=Math.sin(r)*t.scale;
    for(const name of registration.sharedAttachments){const a=bg.slots.find(s=>s.attachment?.name===name),b=fg.skeleton.slots.find(s=>s.attachment?.name===name);if(!a||!b)continue;const av=new Float32Array(a.attachment.worldVerticesLength),bv=new Float32Array(b.attachment.worldVerticesLength);a.attachment.computeWorldVertices(a,0,av.length,av,0,2);b.attachment.computeWorldVertices(b,0,bv.length,bv,0,2);for(let i=0;i<av.length;i+=2)maxError=Math.max(maxError,Math.hypot(av[i]-(c*bv[i]-s*bv[i+1]+t.x),av[i+1]-(s*bv[i]+c*bv[i+1]+t.y)));matched++;}
   }
   samples.push({solid:solid/(pixels.length/4),matched,maxError});
  }
  return {id:p.entry.id,title:p.entry.title,fit:p.fit,recovered:e?.recoveredPainting,transform:e?.layers.at(-1).transform,registered:!!p.entry.models.at(-1).layerRegistration,samples};
 });
 if(examples.includes(id))for(const s of data.samples)assert.ok(s.solid>.97,id+' background must fill frame '+s.solid);
 if(id==='base_83d753e6d2a0f18f'||id==='base_aa87b209d784abc4'){assert.ok(data.recovered);assert.equal(data.transform,undefined,'Rejected effect bounds cannot justify magnifying the avatar');}
 if(id==='base_dc9bb99af8e089d0')assert.ok(data.fit.x+data.fit.width/2< -100,'Honor the authored left-side focus instead of a torso bone');
 if(data.registered)for(const s of data.samples){assert.ok(s.matched>=3);assert.ok(s.maxError<.05,id+' shared animated geometry remains registered: '+s.maxError);}
 report.push({...data,size});await page.screenshot({path:dir+'/'+id+'-'+size[0]+'.png'});await page.close();
}}}finally{await fs.writeFile(dir+'/regression.json',JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({views:report.length,registered:registered.length,passed:true}));
