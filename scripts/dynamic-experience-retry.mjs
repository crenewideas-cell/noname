import fs from 'node:fs/promises';
let s=await fs.readFile('scripts/dynamic-experience-browser.mjs','utf8');
s=s.replace(" const page=context.pages()[0];",` await context.addInitScript(()=>{const open=indexedDB.open.bind(indexedDB);indexedDB.open=function(name,...args){if(name!=='noname-dynamic-thumbnails')return open(name,...args);const request={};queueMicrotask(()=>request.onblocked?.());return request;};});
 let failures=0;await context.route('**/*.skel',route=>{if(!failures&&route.request().frame().url().includes('thumbnail-')){failures++;report.injectedFailures=failures;return route.abort('failed');}return route.fallback();});
 const page=context.pages()[0];`);
s=s.replace("row.unselected.push({afterMs:ms,cards:await cards()});", "row.unselected.push({afterMs:ms,cards:await cards()});");
s=s.replace("report.messages=await page.evaluate(()=>__messages);", "report.messages=await page.evaluate(()=>__messages);const last=report.cases[0].unselected.at(-1).cards.filter(c=>c.visible&&c.skin?.startsWith('本地 · '));if(!last.length||last.some(c=>c.ready!=='true'))throw Error('Visible unselected thumbnail did not recover');if(report.injectedFailures!==1)throw Error('Failure injection did not run');report.retryPassed=true;");
process.env.SKIN_PHASE='thumbnail-retry';process.env.SKIN_IDS='base_d7df31f97ce73240';
const file='scripts/dynamic-experience-retry-harness.mjs';await fs.writeFile(file,s);await import('./dynamic-experience-retry-harness.mjs');
