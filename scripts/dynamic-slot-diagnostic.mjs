import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
try{
const page=await browser.newPage({viewport:{width:360,height:600}});
const id=process.env.SKIN_DIAGNOSTIC_ID||'base_38c67eef25ea1c12';

if(process.argv.includes('--original-uv'))await page.route('**/mesh-uv.js',route=>route.fulfill({contentType:'application/javascript',body:'export function restoreMeshUVs() {}'}));

await page.goto('http://127.0.0.1:8081/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/player.html?id='+id+'&presentation=preview');
await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
const failure=await page.evaluate(()=>window.skinPlayerError);if(failure)throw Error(failure);
await page.screenshot({path:`output/dynamic-cases/${id}-uv-${process.argv.includes('--original-uv')?'original':'corrected'}.png`});
if(process.env.SKIN_HIDE_SLOT){
 await page.evaluate(name=>{skinPlayer.engine42.pause(true);skinPlayer.engine42.layers[1].meta.legacy.hideSlots=[name];skinPlayer.engine42.draw();},process.env.SKIN_HIDE_SLOT);
 await page.screenshot({path:`output/dynamic-cases/${id}-hidden.png`});
}
const data=await page.evaluate(()=>{
 const e=skinPlayer.engine42;e.pause(true);const l=e.layers[1];e.layers[0].enabled=false;
 const slots=l.skeleton.slots.filter(s=>s.attachment?.region),names=[...new Set(slots.map(s=>s.attachment.name))];
 const gl=e.canvas.getContext('webgl2')||e.canvas.getContext('webgl'),pixels=new Uint8Array(e.canvas.width*e.canvas.height*4);
 function score(){e.draw();gl.readPixels(0,0,e.canvas.width,e.canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let n=0;for(let y=400;y<530;y++)for(let x=0;x<360;x++){const i=(y*360+x)*4;if(pixels[i]>240&&pixels[i+1]>240&&pixels[i+2]>240&&pixels[i+3]>220)n++;}return n;}
 const original=score(),rows=[];
 for(const name of names){l.meta.legacy.hideSlots=[name];const difference=original-score();if(Math.abs(difference)>100){const a=slots.find(s=>s.attachment.name===name).attachment,r=a.region;rows.push({name,difference,blend:slots.find(s=>s.attachment.name===name).data.blendMode,region:{x:r.x,y:r.y,width:r.width,height:r.height,ow:r.originalWidth,oh:r.originalHeight,ox:r.offsetX,oy:r.offsetY,rotate:r.rotate},uv:Array.from(a.regionUVs||[]),atlas:r.page?.name});}}
 l.meta.legacy.hideSlots=[];return {original,rows:rows.sort((a,b)=>b.difference-a.difference)};
});
console.log(JSON.stringify(data));await fs.writeFile('output/dynamic-cases/slot-diagnostic.json',JSON.stringify(data,null,2));
}finally{await browser.close();}
