import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json'))),groups=new Map(),sizeCache=new Map();
for(const e of inventory.entries)for(const stage of ['source','catalog','effective'])for(const f of e[stage+'ModelFacts']||[]){
 const key=(f.atlas.sha256||f.atlas.path)+'|'+(f.pages||[]).map(p=>p.sha256||p.path).join('|');
 let g=groups.get(key);if(!g){g={key,facts:f,uses:[]};groups.set(key,g);}g.uses.push({id:e.id,pack:e.pack,stage,version:f.version});
}
async function dimensions(file){
 if(sizeCache.has(file))return sizeCache.get(file);
 let handle;try{handle=await fs.open(file);const b=Buffer.alloc(24);await handle.read(b,0,b.length,0);
 const value=b.subarray(0,8).toString('hex')==='89504e470d0a1a0a'?{width:b.readUInt32BE(16),height:b.readUInt32BE(20),format:'PNG'}:JSON.parse(execFileSync('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',['-c','import json,sys;from PIL import Image;i=Image.open(sys.argv[1]);print(json.dumps(dict(width=i.width,height=i.height,format=i.format)))',file],{encoding:'utf8',windowsHide:true}));
 sizeCache.set(file,value);return value;}finally{await handle?.close();}
}
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),rows=[];
try{
 const page=await browser.newPage();await page.route('**/atlas-extent-audit.html',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:'<!doctype html><meta charset="utf-8">'}));await page.goto(origin+'/atlas-extent-audit.html');
 const vendor=origin+'/extension/'+encodeURIComponent('本地动态皮肤包')+'/'+encodeURIComponent('无名杀基础扩展')+'/runtime/vendor/';
 for(const name of ['pixi.min.js','pixi-spine.js'])await page.addScriptTag({url:vendor+name});
 await page.evaluate(async()=>window.inspectAtlas=(await import('/noname/skin/localDynamic/runtime/atlas-compat.js')).inspectAtlasPages);
 for(const g of groups.values()){
  const row={atlas:g.facts.atlas.path,atlasSHA256:g.facts.atlas.sha256,uses:g.uses,pages:[]};
  try{
   const text=await fs.readFile(row.atlas,'utf8');if(createHash('sha256').update(text).digest('hex')!==row.atlasSHA256)throw Error('Frozen atlas identity changed');
   const extents=await page.evaluate(text=>[...inspectAtlas(PIXI,text)],text);
   for(const [name,extent] of extents){
    const file=path.join(path.dirname(row.atlas),name);const size=await dimensions(file);
    const excess={x:Math.max(0,extent.width-size.width),y:Math.max(0,extent.height-size.height)};
    row.pages.push({name,...size,required:extent,excess,declaredSizeDiffers:extent.declaredWidth!==size.width||extent.declaredHeight!==size.height,
     fitsDeclared:extent.width<=extent.declaredWidth&&extent.height<=extent.declaredHeight,
     status:!excess.x&&!excess.y?'fits':Math.max(excess.x,excess.y)<=1&&!extent.repeat?'one-pixel-clamp-compatible':'atlas-exceeds-image'});
   }
   row.status=row.pages.some(p=>p.status==='atlas-exceeds-image')?'atlas-exceeds-image':row.pages.some(p=>p.status==='one-pixel-clamp-compatible')?'one-pixel-clamp-compatible':'fits';
  }catch(error){row.status='failed';row.error=String(error);}
  rows.push(row);
  if(rows.length%250===0)console.log(JSON.stringify({checked:rows.length,total:groups.size,issues:rows.filter(r=>r.status!=='fits').length}));
 }
}finally{
 await browser.close();const summary={uniqueAtlasTextureSets:groups.size,checked:rows.length,statuses:rows.reduce((s,r)=>(s[r.status]=(s[r.status]||0)+1,s),{}),scope:4934,limitation:'Physical image extent is not a corruption verdict. Spine 4.0 uses declared atlas dimensions for UVs and permits resized image pages. Declared dimensions, decoder family, reference rendering and actual content must be checked together.'};
 await fs.writeFile(path.join(run,process.env.SKIN_ATLAS_REPORT||'atlas-extent-audit-image-headers.json'),JSON.stringify({summary,entries:rows},null,2));console.log(JSON.stringify(summary));
}
