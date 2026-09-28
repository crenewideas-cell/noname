import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const folder=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01/live2d-declared-idle');
const rows=JSON.parse(await fs.readFile(path.join(folder,'report.json'))),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const output=path.join(folder,'boundary-frames');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),frames=[];
try{for(const r of rows){
 const page=await browser.newPage();await page.route('**/video-review.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><meta charset="utf-8">'}));await page.goto(origin+'/video-review.html');
 await page.evaluate(async src=>{const v=document.createElement('video');v.muted=true;v.preload='auto';document.body.append(v);await new Promise((resolve,reject)=>{v.onloadeddata=resolve;v.onerror=()=>reject(Error('Video decode failed'));v.src=src;});window.video=v;},origin+'/@fs/'+r.video.replaceAll('\\','/'));
 const d=r.before.duration,times=[d-.2,d,d+.2,2*d-.2,2*d,Math.min(r.observedSeconds-.05,2*d+.2)].filter(t=>t>0&&t<r.observedSeconds);
 for(let i=0;i<times.length;i++){
  const time=times[i];const b64=await page.evaluate(async time=>{await new Promise(resolve=>{video.onseeked=resolve;video.currentTime=time;});const c=document.createElement('canvas');c.width=video.videoWidth;c.height=video.videoHeight;c.getContext('2d').drawImage(video,0,0);return c.toDataURL().split(',')[1];},time);
  const file=`${r.before.id}-${r.candidate?'candidate':'before'}-${i}.png`;await fs.writeFile(path.join(output,file),Buffer.from(b64,'base64'));frames.push({id:r.before.id,candidate:r.candidate,time,file});
 }
 await page.close();
}}finally{await browser.close();await fs.writeFile(path.join(output,'frames.json'),JSON.stringify({note:'Decoded frames from continuous real-time canvas video around two loop boundaries, not re-rendered poses.',frames},null,2));}
console.log(JSON.stringify({clips:rows.length,frames:frames.length}));
