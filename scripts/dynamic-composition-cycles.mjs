import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {dynamicPlayerURL} from '../apps/core/noname/skin/localDynamic/runtime-url.js';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='output/dynamic-remediation/20260926-r01/composition-r08',out=root+'/cycles-final',origin='http://127.0.0.1:8081';await fs.mkdir(out,{recursive:true});
const ids=JSON.parse(await fs.readFile(root+'/ids.json')),rows=[];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{for(const id of ids){const page=await browser.newPage({viewport:{width:360,height:600}}),row={id,errors:[],frames:[],resizes:[]};rows.push(row);page.on('pageerror',e=>row.errors.push(String(e)));await page.routeWebSocket('**',s=>s.close());
 await page.goto(dynamicPlayerURL(origin+'/extension/本地动态皮肤包/无名杀基础扩展/',{id,presentation:'preview'},origin+'/noname/skin/localDynamic/runtime-url.js'));await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
 const duration=await page.evaluate(()=>{if(window.skinPlayerError)throw Error(skinPlayerError);skinPlayer.pause(true);window.elapsed=0;const ls=skinPlayer.engine42?.layers||skinPlayer.root.children;return Math.max(...ls.map(l=>l.state.getCurrent(0).animation.duration));});
 for(const time of [0,duration/2,duration,duration*1.5,duration*2]){
  const data=await page.evaluate(time=>{const p=skinPlayer;while(elapsed<time-1e-8){const dt=Math.min(1/30,time-elapsed);if(p.engine42)p.engine42.draw(dt);else p.root.children.forEach(l=>l.update(dt));elapsed+=dt;}p.engine42?.draw(0);p.app?.render();const canvas=p.canvas,c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;const ctx=c.getContext('2d');ctx.drawImage(canvas,0,0);const pixels=ctx.getImageData(0,0,c.width,c.height).data;let visible=0,transparent=0;for(let i=3;i<pixels.length;i+=4){if(pixels[i]>16)visible++;if(pixels[i]<240)transparent++;}return {time,visible,transparentFraction:transparent/(c.width*c.height),fit:p.fit,revision:location.pathname};},time);
  assert.ok(data.visible>1000);row.frames.push(data);await page.screenshot({path:out+'/'+id+'-t'+time.toFixed(2)+'.png',omitBackground:true});
 }
 for(const size of [{width:240,height:360},{width:110,height:180},{width:480,height:720}]){await page.setViewportSize(size);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:out+'/'+id+'-'+size.width+'.png',omitBackground:true});row.resizes.push(size);}
 assert.deepEqual(row.errors,[]);row.passed=true;await page.close();await fs.writeFile(out+'/report.json',JSON.stringify(rows,null,2));console.log(JSON.stringify({id,frames:row.frames.length,transparent:row.frames.map(f=>f.transparentFraction)}));
}}finally{await browser.close();}
