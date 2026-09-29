import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {atlasPages} from './build-browndust-skins.mjs';

const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const root=path.resolve(process.argv.includes('--installed')?'apps/core/extension/imports/本地动态皮肤包/棕色尘埃扩展':'temp/动态皮包/棕色尘埃扩展'),runtime=path.resolve('apps/core/noname/skin/localDynamic/runtime');
const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8'));
const render=process.argv.includes('--render'),all=process.argv.includes('--all');
const idsArg=process.argv.indexOf('--ids'),ids=idsArg<0?null:new Set(process.argv[idsArg+1].split(','));
const shardArg=process.argv.indexOf('--shard'),shard=shardArg<0?null:process.argv[shardArg+1].split('/').map(Number);
if(shard&&(!Number.isInteger(shard[0])||!Number.isInteger(shard[1])||shard[0]<0||shard[0]>=shard[1]))throw Error('Invalid shard');
const report={mode:render?'render':'parse',total:catalog.entries.length,results:[],failures:[],sourceMissing:catalog.entries.filter(e=>e.available===false).map(e=>({id:e.id,reason:e.unavailableReason}))};
const output=render?'output/browndust-skins/'+(ids?'render-retry.json':all?'render-all'+(shard?'-'+shard[0]:'')+'.json':'render-samples.json'):path.join(root,'model-audit.json');
async function saveReport(){await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2));}
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(url.pathname);
    if(pathname==='/audit.html'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><body></body></html>');return;}
    if(pathname.startsWith('/pack/entries/')&&!process.argv.includes('--installed')){
      const entry=catalog.entries.find(e=>pathname==='/pack/entries/'+e.id+'.json');
      if(!entry){res.writeHead(404).end();return;}res.setHeader('Content-Type','application/json');res.end(JSON.stringify(entry));return;
    }
    const base=pathname.startsWith('/pack/')?root:runtime,relative=pathname.startsWith('/pack/')?pathname.slice(6):pathname.slice(9);
    if(!pathname.startsWith('/pack/')&&!pathname.startsWith('/runtime/')){res.writeHead(404).end();return;}
    const file=path.resolve(base,relative);if(!file.startsWith(base+path.sep))throw Error('Invalid path');
    const stat=await fs.stat(file);if(!stat.isFile())throw Error('Not a file');
    const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.wav':'audio/wav'};
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Content-Length',stat.size);
    createReadStream(file).pipe(res);
  }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
let page;
async function parserPage(){
  await page?.close();page=await browser.newPage();await page.goto(origin+'/audit.html');
  for(const file of ['pixi.min.js','pixi-spine.js'])await page.addScriptTag({url:origin+'/runtime/vendor/'+file});
}
const url=file=>origin+'/pack/'+file.split('/').map(encodeURIComponent).join('/');
try{
  if(!render)await parserPage();
  let entries=catalog.entries;
  if(!render&&process.argv.includes('--retry')){
    const previous=JSON.parse(await fs.readFile(path.join(root,'model-audit.json'),'utf8'));
    const failed=new Set(previous.failures.map(e=>e.id));entries=entries.filter(e=>failed.has(e.id));
    report.results=previous.results.filter(e=>!failed.has(e.id));
  }
  if(render&&!all&&!ids){
    const representatives=new Map();
    for(const e of entries.filter(e=>e.available!==false))for(const key of [e.category+':'+e.models[0].version+':'+path.extname(e.models[0].skeleton)])if(!representatives.has(key))representatives.set(key,e);
    entries=[...new Map([...representatives.values()].map(e=>[e.id,e])).values()];
  }
  if(shard)entries=entries.filter((_,i)=>i%shard[1]===shard[0]);
  if(ids)entries=entries.filter(e=>ids.has(e.id));
  for(const [i,entry] of entries.entries()){
    const model=entry.models[0],row={id:entry.id,category:entry.category,version:model.version,...(render?{fingerprint:entry.source.fingerprint}:{})};
    try{
      if(render){
        if(entry.available===false&&!process.argv.includes('--include-unavailable')){row.skipped=entry.unavailableReason;report.results.push(row);continue;}
        await page?.close();page=await browser.newPage({viewport:{width:360,height:480}});
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.goto(origin+'/runtime/player.html?assetBase='+encodeURIComponent(origin+'/pack/')+'&id='+entry.id+'&presentation=preview');
        await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError,null,{timeout:60000});
        const result=await page.evaluate(()=>{
          if(window.skinPlayerError)throw Error(window.skinPlayerError);
          const p=window.skinPlayer;p.pause(true);p.capture();
          const c=p.canvas,t=document.createElement('canvas');t.width=c.width;t.height=c.height;const ctx=t.getContext('2d');ctx.drawImage(c,0,0);
          const pixels=ctx.getImageData(0,0,t.width,t.height).data;let visible=0;for(let j=3;j<pixels.length;j+=4)if(pixels[j]>16)visible++;
          return{fit:p.fit,visiblePixels:visible,canvas:[c.width,c.height],motions:p.entry.motions.length};
        });
        Object.assign(row,result);if(!result.visiblePixels)throw Error('No visible pixels');if(errors.length)throw Error(errors.join('\n'));
        if(process.argv.includes('--thumbnails')){
          const png=await page.evaluate(()=>window.skinPlayer.capture());
          await fs.mkdir(path.join(root,'previews'),{recursive:true});
          await fs.writeFile(path.join(root,'previews',entry.id+'.png'),Buffer.from(png.split(',')[1],'base64'));
        }
        // Only ordinary original characters are saved as review screenshots.
        if(!all&&entry.category==='角色'){
          const directory=path.resolve('output/browndust-skins');await fs.mkdir(directory,{recursive:true});await page.screenshot({path:path.join(directory,entry.id+'.png')});
        }
        await page.evaluate(()=>window.skinPlayer.dispose());
      }else{
        if(i&&i%80===0)await parserPage();
        const [bytes,atlas]=await Promise.all([fs.readFile(path.join(root,model.skeleton)),fs.readFile(path.join(root,model.atlas),'utf8')]);
        row.fingerprint=createHash('sha256').update(bytes).update(atlas).digest('hex');
        row.texturePages=atlasPages(atlas).length;
        const result=await page.evaluate(async({address,atlas,isJSON,declared,skin})=>{
          let textures;try{
            const bytes=new Uint8Array(await(await fetch(address)).arrayBuffer());
            textures=new PIXI.spine.TextureAtlas(atlas,(_,done)=>done(new PIXI.BaseTexture(null,{width:32768,height:32768})));
            const parser=new PIXI.spine.SpineParser(),data=isJSON?parser.createJsonParser().readSkeletonData(textures,JSON.parse(new TextDecoder().decode(bytes))):parser.createBinaryParser().readSkeletonData(textures,bytes);
            if(!data.bones.length)throw Error('No bones');
            const names=data.animations.map(a=>a.name),idle=names.includes(declared)?declared:names.find(n=>/^(idle|idle[_ ]?0?1|normal|daiji|stand|animation)$/i.test(n))||names[0];
            const object=new PIXI.spine.Spine(data);object.autoUpdate=false;
            if(skin)object.skeleton.setSkinByName(skin);
            // Exercise every animation against the actual 4.1 runtime, not only JSON syntax.
            for(const animation of data.animations){object.skeleton.setToSetupPose();object.state.clearTracks();object.state.setAnimation(0,animation.name,true);object.update(Math.min(.2,animation.duration/2));
              const bounds=object.getLocalBounds();if(![bounds.x,bounds.y,bounds.width,bounds.height].every(Number.isFinite))throw Error('Nonfinite bounds: '+animation.name);}
            object.destroy({children:true});
            return{animations:data.animations.map(a=>({name:a.name,duration:a.duration})),skins:data.skins.map(s=>s.name),idle,bones:data.bones.length};
          }finally{textures?.dispose();}
        },{address:url(model.skeleton),atlas,isJSON:model.skeleton.endsWith('.json'),declared:model.animation,skin:model.skin});
        Object.assign(row,result);
      }
      row.passed=true;
    }catch(e){row.error=e.message;report.failures.push({id:entry.id,error:e.message});}
    report.results.push(row);
    if((i+1)%(render?20:50)===0){console.log(report.mode,i+1,'/',entries.length,'failures',report.failures.length);await saveReport();}
  }
}finally{
  await browser.close();await new Promise(resolve=>server.close(resolve));
  await saveReport();
  if(render&&all&&!shard&&report.results.length===catalog.entries.length)await fs.writeFile(path.join(root,'render-audit.json'),JSON.stringify(report,null,2));
}
console.log(JSON.stringify({mode:report.mode,checked:report.results.length,failures:report.failures.length,sourceMissing:report.sourceMissing.length}));
if(report.failures.length)process.exitCode=1;
