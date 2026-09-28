import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run = path.resolve(process.argv[2] || 'output/dynamic-remediation/20260926-r01');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8184';
const health=await fetch(origin+'/noname/skin/localDynamic/runtime/player.html');
if(!health.ok)throw Error('Test server unavailable: '+health.status);
const ids = process.env.SKIN_CASE_FILE?JSON.parse(await fs.readFile(process.env.SKIN_CASE_FILE)):process.env.SKIN_CASE_IDS?.split(',') || ['base_2ffdbe289f05a565', 'base_548a5def3d1b73f9', 'base_9ad4a25a34ccc857'];
const viewports=(process.env.SKIN_VIEWPORTS||'360x600,240x360').split(',').map(v=>{const [width,height]=v.split('x').map(Number);return{width,height};});
const times=(process.env.SKIN_TIMES||'0,1,3').split(',').map(Number);
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const identityById=new Map(inventory.entries.map(e=>[e.id,e]));
if(new Set(ids).size!==ids.length||ids.some(id=>!identityById.has(id)))throw Error('Capture identities must be unique and present in frozen inventory');
const candidate=process.argv.includes('--candidate');
const labelIndex=process.argv.indexOf('--label');
const output = path.join(run, labelIndex<0?(candidate?'candidate-images':'baseline-images'):process.argv[labelIndex+1]);await fs.mkdir(output, { recursive: true });
const runtimeFiles=new Map(),entryFiles=new Map(),snapshot=[];
if(candidate){
 const source=path.resolve(process.env.SKIN_RUNTIME_ROOT||'apps/core/noname/skin/localDynamic/runtime');await fs.mkdir(path.join(output,'runtime-snapshot'),{recursive:true});
 for(const name of (await fs.readdir(source)).filter(n=>/\.(js|html|css)$/.test(n)).sort()){
  const body=await fs.readFile(path.join(source,name));runtimeFiles.set(name,body);await fs.writeFile(path.join(output,'runtime-snapshot',name),body);snapshot.push({name,sha256:createHash('sha256').update(body).digest('hex')});
 }
}
if(process.env.SKIN_ENTRY_ROOT){await fs.mkdir(path.join(output,'entry-snapshot'),{recursive:true});for(const id of ids){const name=id+'.json';try{const body=await fs.readFile(path.join(process.env.SKIN_ENTRY_ROOT,name));entryFiles.set(name,body);await fs.writeFile(path.join(output,'entry-snapshot',name),body);}catch(e){if(e.code!=='ENOENT')throw e;}}}
const runtimeSnapshotHash=createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
await fs.writeFile(path.join(output,'capture-provenance.json'),JSON.stringify({candidate,runtimeSnapshotHash,files:snapshot,runnerSha256:createHash('sha256').update(await fs.readFile(import.meta.filename)).digest('hex'),entryOverrides:[...entryFiles.keys()],frozenVendorEvidence:'../baseline-files.jsonl'},null,2));
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
try {
  for (const id of ids) for (const viewport of viewports) {
    const pack=identityById.get(id).pack;
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    if(process.env.SKIN_ENTRY_ROOT)await page.route('**/entries/*.json',async route=>{
      const name=new URL(route.request().url()).pathname.split('/').at(-1);if(!/^[a-z0-9_]+\.json$/.test(name))return route.continue();
      if(entryFiles.has(name))return route.fulfill({body:entryFiles.get(name),contentType:'application/json'});return route.continue();
    });
    if(candidate)await page.route('**/runtime/*',async route=>{
      const name=new URL(route.request().url()).pathname.split('/').at(-1);
      if(!/^[a-z0-9-]+\.(?:js|html|css)$/.test(name))return route.continue();
      if(runtimeFiles.has(name))return route.fulfill({body:runtimeFiles.get(name),contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.html')?'text/html':'text/css'});return route.continue();
    });
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('response', r => { if (r.status() >= 400) requests.push({ url: r.url(), status: r.status() }); });
    page.on('requestfailed',r=>requests.push({url:r.url(),failure:r.failure()?.errorText}));
    const result = { id, pack, viewport, presentation: 'preview',runtimeSnapshotHash, evidenceKind: candidate?'candidate source overlay; not correctness reference':'old-behavior-only; not correctness reference', errors, requests, frames: [] };
    try {
      await page.goto(origin + '/extension/' + encodeURIComponent('本地动态皮肤包') + '/' + encodeURIComponent(pack) + '/runtime/player.html?id=' + id + '&presentation=preview');
      await page.waitForFunction(() => window.skinPlayer || window.skinPlayerError, null, { timeout: Number(process.env.SKIN_LOAD_TIMEOUT_MS||30000) });
      result.state = await page.evaluate(() => {
        if (window.skinPlayerError) throw Error(window.skinPlayerError);
        const p = skinPlayer; p.engine42?.pause(true); p.app?.stop();
        const canvas = p.engine42?.canvas || p.app?.view, gl = canvas?.getContext('webgl') || canvas?.getContext('webgl2'), dbg = gl?.getExtension('WEBGL_debug_renderer_info');
        return { entry: p.entry, fit: p.fit, layers: p.engine42?.layers.map(l => ({ meta: l.meta, transform: l.placementTrace||l.transform, idle: l.idle, animations: l.skeleton.data.animations.map(a => ({ name: a.name, duration: a.duration })) }))||p.root?.children.map(l=>({transform:l.skinPlacementTrace,idle:l.skinIdle})),
          timing: p.model?'Live2D fixed-step increments after loaded idle; physics/random state is not an independent deterministic reference':'Spine reset to setup pose then sampled idle',
          renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null, userAgent: navigator.userAgent, dpr: devicePixelRatio };
      });
      result.effectiveConfigHash = createHash('sha256').update(JSON.stringify(result.state.entry)).digest('hex');
      const frames=process.env.SKIN_CAPTURE_ACTIONS==='1'?Object.entries(result.state.entry.scene.viewport.actionCameras).flatMap(([action,c])=>c.sampleTimes.map(time=>({action,time,duration:c.duration}))):times.map(time=>({time}));
      for (const frame of frames) {
        await page.evaluate(({time:t,action}) => {
          const p = skinPlayer, e = p.engine42;
          if(p.model){
            const previous=p.__captureTime||0;if(t<previous)throw Error('Live2D capture times must be monotonic');
            let remaining=(t-previous)*1000;while(remaining>0){const step=Math.min(1000/60,remaining);p.model.update(step);remaining-=step;}
            p.__captureTime=t;p.capture();
          }else if (e) {
            for (const l of e.layers) { l.skeleton.setToSetupPose(); l.state.clearTracks(); if (l.idle) l.state.setAnimation(0, l.idle, true); }
            e.draw(t); p.capture();
          } else { for (const l of p.root?.children || []) { if(l.skinSeek){l.skinSeek(action||l.skinIdle,t);continue;}l.skeleton?.setToSetupPose(); l.state?.clearTracks(); if(action||l.skinIdle) l.state.setAnimation(0,action||l.skinIdle,true); l.update?.(t); } p.setView({});p.capture(); }
        }, frame);
        const file = `${id}-${viewport.width}-${frame.action?encodeURIComponent(frame.action)+'-':''}t${frame.time.toFixed(6).replace(/\.?0+$/,'')||'0'}.png`;
        await page.screenshot({ path: path.join(output, file), omitBackground: true });result.frames.push({ ...frame, file });
      }
      result.status = 'captured';
    } catch (e) { result.status = 'failed';result.error = String(e);result.diagnostics=await page.evaluate(()=>({status:document.getElementById('status')?.textContent,ready:document.documentElement.dataset.skinReady,playerError:window.skinPlayerError,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,duration:r.duration,bytes:r.transferSize}))})).catch(()=>null); }
    results.push(result);console.log(JSON.stringify({ id, viewport, status: result.status, error: result.error?.slice(0,220), renderer: result.state?.renderer }));
    await page.close();
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(results, null, 2));
  }
} finally { await browser.close(); }
if (results.some(r => r.status !== 'captured')) process.exitCode = 1;
