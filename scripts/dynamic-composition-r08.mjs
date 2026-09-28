import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dynamicPlayerURL} from '../apps/core/noname/skin/localDynamic/runtime-url.js';
import {compileDecadeScene} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='output/dynamic-remediation/20260926-r01/composition-r08', phase=process.env.SKIN_PHASE||'before',out=root+'/'+phase;
const ids=process.env.SKIN_IDS?.split(',')||JSON.parse(await fs.readFile(root+'/ids.json'));
const origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8081';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),report=[];
try{for(const id of ids){
 const page=await browser.newPage({viewport:{width:360,height:600}});await page.routeWebSocket('**',s=>s.close());
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 if(process.env.SKIN_CANDIDATE==='1'){
  await page.route('**/runtime-*/**/*.js',async route=>{const rel=new URL(route.request().url()).pathname.split(/\/runtime-[^/]+\//)[1];await route.fulfill({contentType:'text/javascript',body:await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+rel)});});
  await page.route('**/entries/'+id+'.json',async route=>{try{const e=JSON.parse(await fs.readFile(root+'/paired-entries/'+id+'.json'));const r=await route.fetch(),old=await r.json();await route.fulfill({response:r,json:{...old,models:e.models}});}catch{await route.continue();}});
 }
 if(process.env.SKIN_NO_CONTAIN==='1')await page.route('**/player.js',async route=>{const r=await route.fetch();await route.fulfill({response:r,body:(await r.text()).replace('if(!face?.width&&anonymousSubject(primary.skeleton)){','if(false){')});});
 if(process.env.SKIN_FULL_TRIAL==='1')await page.route('**/entries/'+id+'.json',async route=>{const r=await route.fetch(),e=await r.json();e.models=e.models.map((m,i)=>i?{...m,skeleton:m.skeleton.replace(/daiji2\.skel$/,'daiji.skel'),atlas:m.atlas.replace(/daiji2\.atlas$/,'daiji.atlas'),sceneVariant:undefined}:m);await route.fulfill({response:r,json:e});});
 if(process.env.SKIN_COORD_TRIAL==='1')await page.route('**/composition.js',async route=>{const r=await route.fetch();let s=await r.text();s=s.replace('export function avatarLayerTransform(entry, index, bounds, background) {',`export function avatarLayerTransform(entry,index,bounds,background){
 if(index===1&&entry.legacy?.beijing){const c=entry.legacy,b=c.beijing,v=entry.models[index].sceneVariant?.transform;const coord=(n,size)=>Array.isArray(n)?n[0]+n[1]*size:n??size/2;const scale=c.scale/b.scale,angle=c.angle||0,rad=angle*Math.PI/180;
 const x=(coord(c.x,120)-coord(b.x,120))/b.scale,y=(coord(c.y,180)-coord(b.y,180))/b.scale;
 return {scale:scale*(v?.scale||1),angle:angle+(v?.angle||0),x:x+scale*(Math.cos(rad)*(v?.x||0)-Math.sin(rad)*(v?.y||0)),y:y+scale*(Math.sin(rad)*(v?.x||0)+Math.cos(rad)*(v?.y||0))};}
 `);await route.fulfill({response:r,body:s});});
 if(process.env.SKIN_SOURCE_TRIAL==='1')await page.route('**/entries/'+id+'.json',async route=>{const r=await route.fetch(),e=await r.json();e.scene=compileDecadeScene(e.legacy,{sourceConfigHash:'diagnostic-only'});e.scene.viewport={policy:'source-avatar',referenceHeight:180};e.models=e.models.map(m=>m.sceneVariant?{...m,skeleton:m.sceneVariant.source,atlas:m.sceneVariant.source.replace(/\.skel$/,'.atlas'),sceneVariant:undefined}:m);await route.fulfill({response:r,json:e});});
 await page.goto(dynamicPlayerURL(origin+'/extension/本地动态皮肤包/无名杀基础扩展/',{id,presentation:'preview'},origin+'/noname/skin/localDynamic/runtime-url.js'));
 await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
 if(process.env.SKIN_BONES==='1'){const b=await page.evaluate(()=>{skinPlayer.pause(true);const ls=skinPlayer.engine42?.layers||skinPlayer.root.children;if(ls.length!==2)return[];const a=ls[0].skeleton.bones,b=ls[1].skeleton.bones;return {counts:[a.length,b.length],shared:a.filter(x=>b.some(y=>y.data.name===x.data.name)).map(x=>{const y=b.find(y=>y.data.name===x.data.name);return {name:x.data.name,setupA:{x:x.data.x,y:x.data.y,rotation:x.data.rotation,scaleX:x.data.scaleX,scaleY:x.data.scaleY},setupB:{x:y.data.x,y:y.data.y,rotation:y.data.rotation,scaleX:y.data.scaleX,scaleY:y.data.scaleY},a:[x.worldX,x.worldY],b:[y.worldX,y.worldY]};})};});await fs.writeFile(out+'/'+id+'-bones.json',JSON.stringify(b,null,2));console.log(JSON.stringify({id,bones:b}));}
 if(process.env.SKIN_MATCH_TRIAL==='1'){
 const matches=await page.evaluate(()=>{const p=skinPlayer;p.pause(true);const ls=p.engine42?.layers||p.root.children;if(ls.length!==2)return[];const by=new Map(ls[0].skeleton.slots.map(s=>[s.attachment?.name,s]));const result=[];for(const s of ls[1].skeleton.slots){const a=s.attachment,b=by.get(a?.name)?.attachment;if(!a?.regionUVs||!b||a.worldVerticesLength!==b.worldVerticesLength)continue;const av=new Float32Array(a.worldVerticesLength),bv=new Float32Array(b.worldVerticesLength);a.computeWorldVertices(s,0,av.length,av,0,2);b.computeWorldVertices(by.get(a.name),0,bv.length,bv,0,2);const n=av.length/2;let ax=0,ay=0,bx=0,byy=0;for(let i=0;i<av.length;i+=2){ax+=av[i]/n;ay+=av[i+1]/n;bx+=bv[i]/n;byy+=bv[i+1]/n;}let den=0,re=0,im=0;for(let i=0;i<av.length;i+=2){const x=av[i]-ax,y=av[i+1]-ay,u=bv[i]-bx,v=bv[i+1]-byy;den+=x*x+y*y;re+=x*u+y*v;im+=x*v-y*u;}re/=den;im/=den;const x=bx-re*ax+im*ay,y=byy-im*ax-re*ay;let err=0;for(let i=0;i<av.length;i+=2)err+=(re*av[i]-im*av[i+1]+x-bv[i])**2+(im*av[i]+re*av[i+1]+y-bv[i+1])**2;result.push({name:a.name,transform:{scale:Math.hypot(re,im),angle:Math.atan2(im,re)*180/Math.PI,x,y},error:Math.sqrt(err/n),uvEqual:a.regionUVs.length===b.regionUVs.length&&a.regionUVs.every((v,i)=>Math.abs(v-b.regionUVs[i])<.0001)});}return result;});await fs.writeFile(out+'/'+id+'-matches.json',JSON.stringify(matches,null,2));console.log(JSON.stringify({id,matches}));
 }
 const data=await page.evaluate(()=>{if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.pause(true);const ls=p.engine42?.layers||p.root.children;return {url:location.href,entry:p.entry,fit:p.fit,presentation:p.presentation,fillScene:p.fillScene,layers:ls.map(l=>({idle:l.idle||l.skinIdle,transform:p.engine42?l.transform:{x:l.x,y:l.y,scale:l.scale?.x,angle:l.angle},bounds:l.getLocalBounds?.(),slots:l.skeleton?.slots.map(s=>({name:s.data.name,bone:s.bone.data.name,attachment:s.attachment?.name,type:s.attachment?.type,blend:s.data.blendMode,color:s.color,vertices:s.attachment?.vertices?.length,region:s.attachment?.region&&{name:s.attachment.region.name,width:s.attachment.region.width,height:s.attachment.region.height},x:s.bone.worldX,y:s.bone.worldY})),animations:l.skeleton?.data.animations.map(a=>({name:a.name,duration:a.duration}))}))};});
 await page.screenshot({path:out+'/'+id+'-portrait.png',omitBackground:true});
 for(let i=0;i<data.layers.length;i++){await page.evaluate(i=>{const p=skinPlayer;for(let n=0;n<p.entry.models.length;n++)p.setLayer(String(n),n===i);p.engine42?.draw(0);p.app?.render();},i);await page.screenshot({path:out+'/'+id+'-layer-'+i+'.png',omitBackground:true});}
 await page.evaluate(()=>{const p=skinPlayer;for(let n=0;n<p.entry.models.length;n++)p.setLayer(String(n),true);});
 await page.setViewportSize({width:960,height:540});await page.screenshot({path:out+'/'+id+'-wide.png',omitBackground:true});
 report.push({id,errors,...data});await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({id,fit:data.fit,presentation:data.presentation,layers:data.layers.map(l=>({idle:l.idle,transform:l.transform,slots:l.slots?.length}))}));await page.close();
}}finally{await browser.close();}


