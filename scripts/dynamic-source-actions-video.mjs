import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const work=path.resolve('output/dynamic-remediation/20260926-r01/continuation-actions-20260926'),out=path.join(work,process.env.SKIN_ACTION_VIDEO_LABEL||'video-pilot');await fs.mkdir(out,{recursive:true});
const cases=JSON.parse(await fs.readFile(path.join(work,'browser-pilot-v3/report.json'))),rows=[];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{for(const c of cases){
 const context=await browser.newContext({viewport:c.viewport,deviceScaleFactor:1});await context.routeWebSocket('**',s=>s.close());
 await context.route('**/runtime/*',async r=>{const name=new URL(r.request().url()).pathname.split('/').at(-1);if(!/^[a-z0-9-]+\.(js|html|css)$/.test(name))return r.continue();try{return r.fulfill({path:path.join(work,'browser-pilot-v3/runtime',name),contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.html')?'text/html':'text/css'});}catch{return r.continue();}});
 await context.route('**/entries/'+c.id+'.json',r=>r.fulfill({path:path.join(work,'entries',c.id+'.json'),contentType:'application/json'}));
 const page=await context.newPage(),row={id:c.id,errors:[],samples:[]};page.on('pageerror',e=>row.errors.push(String(e)));
 try{
  await page.goto('http://127.0.0.1:8184/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/player.html?id='+c.id+'&presentation=preview');
  await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
  const action=c.actions[0];
  row.setup=await page.evaluate(async action=>{
   if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer,ls=p.engine42?.layers||p.root.children,index=p.entry.scene.layers.findIndex(l=>l.role==='primary');
   const duration=action.duration,seconds=(duration+2*action.idleDuration)/action.speed+.3;
   const stream=p.canvas.captureStream(30),chunks=[],recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'});
   recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
   window.videoDone=new Promise(resolve=>recorder.onstop=async()=>{for(const track of stream.getTracks())track.stop();const data=new Uint8Array(await new Blob(chunks,{type:recorder.mimeType}).arrayBuffer());let binary='';for(let i=0;i<data.length;i+=32768)binary+=String.fromCharCode(...data.subarray(i,i+32768));resolve(btoa(binary));});
   window.sourceVideo={recorder,ls,index,start:performance.now(),last:0,samples:[],seconds};recorder.start(500);
   await p.motion(action.command,false);
   const step=()=>{const v=sourceVideo,time=(performance.now()-v.start)/1000,states=v.ls.map(l=>{const t=l.state.getCurrent(0);return{name:t.animation.name,time:t.trackTime,loop:t.loop};});v.samples.push({time,states});if(time<v.seconds)v.raf=requestAnimationFrame(step);else v.finished=true;};step();
   return{seconds,index,action:action.command,duration,idleDuration:action.idleDuration,speed:action.speed};
  },action);
  console.log(JSON.stringify({id:c.id,recordingSeconds:row.setup.seconds}));
  await page.waitForFunction(()=>sourceVideo.finished,null,{timeout:(row.setup.seconds+30)*1000});
  row.samples=await page.evaluate(()=>{sourceVideo.recorder.stop();return sourceVideo.samples;});
  const video=Buffer.from(await page.evaluate(()=>videoDone),'base64'),file=c.id+'.webm';await fs.writeFile(path.join(out,file),video,{flag:'wx'});row.video={file,bytes:video.length,sha256:createHash('sha256').update(video).digest('hex')};
  row.status='recorded';await page.screenshot({path:path.join(out,c.id+'-final.png'),omitBackground:true});
 }catch(e){row.status='failed';row.error=String(e);}
 finally{await context.close();rows.push(row);await fs.writeFile(path.join(out,'report.json'),JSON.stringify(rows,null,2));}
 console.log(JSON.stringify({id:row.id,status:row.status,error:row.error}));
}}finally{await browser.close();}
