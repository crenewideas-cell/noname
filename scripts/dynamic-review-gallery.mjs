import {createRequire} from 'node:module';import fs from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const feedback=process.argv.includes('--feedback');
const rows=JSON.parse(await fs.readFile(feedback?'output/dynamic-body-regression/report.json':'output/dynamic-cases/analysis.json'))
 .filter(e=>!feedback||(e.presentation==='preview'&&['base_4dd0cde7da7bfa59','base_3ff69240b10b81bc','base_efc31a57478fa0e2','base_01ddfa65b119a4b1'].includes(e.id)));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{for(let offset=0;offset<rows.length;offset+=30){
 const chunk=rows.slice(offset,offset+30),page=await browser.newPage({viewport:{width:960,height:feedback?444:1150}});
 const items=await Promise.all(chunk.map(async(e,i)=>`<article><img src="data:image/png;base64,${(await fs.readFile(feedback?'output/dynamic-body-regression/'+e.id+'-preview.png':'output/dynamic-cases/'+e.id+'-current.png')).toString('base64')}"><label>${feedback?'':(offset+i+1)+'. '}${e.title}${feedback?'':'<br>'+e.id.slice(5,13)}</label></article>`));
 await page.setContent(`<style>body{margin:0;background:#e7e5e0;display:grid;align-content:start;grid-template-columns:repeat(${feedback?'4,240':'6,160'}px)}article{margin:0;height:${feedback?444:230}px;text-align:center;font:${feedback?16:11}px sans-serif}img{display:block;width:${feedback?240:120}px;height:${feedback?400:200}px;margin:auto}label{display:block;margin-top:8px}</style>${items.join('')}`);
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await page.screenshot({path:feedback?'output/dynamic-body-regression/feedback-review.png':`output/dynamic-cases/review-${offset/30+1}.png`,fullPage:true});await page.close();
}}finally{await browser.close();}
