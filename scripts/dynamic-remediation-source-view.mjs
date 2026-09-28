import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run = path.resolve(process.argv[2] || 'output/dynamic-remediation/20260926-r01');
const inventory = JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const ids = process.env.SKIN_CASE_FILE?JSON.parse(await fs.readFile(process.env.SKIN_CASE_FILE)):process.env.SKIN_CASE_IDS?.split(',') || ['base_2ffdbe289f05a565','base_548a5def3d1b73f9','base_9ad4a25a34ccc857'];
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8184';
const labelIndex=process.argv.indexOf('--label');
const output = path.join(run,labelIndex<0?'source-views':process.argv[labelIndex+1]);await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const report=[];
try { for(const id of ids) {
  const e=inventory.entries.find(e=>e.id===id);if(!e)throw Error('Unknown ID: '+id);
  if(!e.sourceConfigs[0]?.config)throw Error('No original config: '+id);
  for(const viewport of (process.env.SKIN_VIEWPORTS||'120x180,360x600').split(',').map(v=>{const[width,height]=v.split('x').map(Number);return{width,height};})) {
    const page=await browser.newPage({viewport,deviceScaleFactor:1}),errors=[];
    page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
    const row={id,viewport,sourceConfigHash:e.sourceConfigHash,sourceModels:e.sourceModels,errors,referenceStatus:'candidate',
      blindSpots:['3.6 decoder shared with production but separately cross-checked against official Java; raster library is the existing native vendor, not independently certified upstream','3.8 PIXI reader still requires independent validation','180 height follows current native integration, not an independently established author viewport','No restoreMeshUVs, no sceneVariants, no sceneFocus or pixel fitting']};
    try {
      await page.route('**/dynamic-remediation-reference.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body style="margin:0;overflow:hidden;background:transparent"></body></html>'}));
      await page.goto(origin+'/dynamic-remediation-reference.html');
      const sourceBase=origin+'/@fs/'+path.resolve('temp/动态皮包/'+e.pack+'/assets/dynamic').replaceAll('\\','/')+'/';
      const versions=e.sourceModelFacts.map(m=>m.version);
      row.trace=await page.evaluate(async({config,versions,sourceBase})=>{
        window.requestAnimationFrame=()=>0;
        const layers=[config.beijing,config].filter(Boolean);
        const native=versions.every(v=>/^3\.[67]\./.test(v));
        const coord=(v,size)=>Array.isArray(v)?v[0]+v[1]*size:typeof v==='number'?v:size/2;
        const trace=[];
        if(native){
          const {spine}=await import('/extension/十周年局内UI/vendor/spine.js');
          const {createLegacyParser}=await import('/noname/skin/localDynamic/runtime/legacy-parser.js');
          const {createAnimationRenderer}=await import('/extension/十周年局内UI/animation-renderer.js');
          const {AnimationPlayer}=createAnimationRenderer(spine);
          const renderer=new AnimationPlayer(sourceBase,document.body);window.referenceRenderer=renderer;
          renderer.canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%';
          for(let i=0;i<layers.length;i++){
            const c=layers[i];await new Promise((ok,no)=>renderer.loadSpine(c.name,'skel',ok,()=>no(Error('load '+c.name))));
            const manager=renderer.spine.assetManager,prefix=c.name.slice(0,c.name.lastIndexOf('/')+1);
            const atlas=new spine.TextureAtlas(manager.get(c.name+'.atlas'),name=>manager.get(prefix+name));
            renderer.spine.assets[c.name].skelRawData=createLegacyParser(spine,atlas,{skeleton:c.name+'.skel',version:versions[i]});
            const sprite=renderer.playSpine({...c,action:Array.isArray(c.action)?c.action[0]:c.action??c.animation,loop:true}, {x:c.x??[0,.5],y:c.y??[0,.5],scale:(c.scale??1)*innerHeight/180,angle:c.angle??0});
            trace.push({name:c.name,action:sprite.action||sprite.skeleton.defaultAction,x:coord(c.x,innerWidth),y:coord(c.y,innerHeight),scale:sprite.scale,angle:sprite.angle,version:versions[i]});
          }
          window.renderReference=t=>{
            for(const sprite of renderer.nodes){const s=sprite.skeleton;s.setToSetupPose();s.state.clearTracks();s.state.setAnimation(0,sprite.action||s.defaultAction,true);}
            renderer.frameTime=0;renderer.render(t*1000);cancelAnimationFrame(renderer.requestId);
          };
        }else{
          for(const file of ['pixi.min.js','pixi-spine.js'])await new Promise((ok,no)=>{const s=document.createElement('script');s.src='/extension/本地动态皮肤包/名将杀扩展/runtime/vendor/'+file;s.onload=ok;s.onerror=no;document.head.append(s);});
          const app=new PIXI.Application({width:innerWidth,height:innerHeight,backgroundAlpha:0,antialias:true,preserveDrawingBuffer:true,autoStart:false});document.body.append(app.view);window.referenceApp=app;
          const rigs=[];
          for(let i=0;i<layers.length;i++){
            const c=layers[i],loader=new PIXI.Loader();
            const data=await new Promise((ok,no)=>{loader.onError.once(no);loader.add('rig',sourceBase+c.name+(c.json?'.json':'.skel'),{metadata:{spineAtlasFile:sourceBase+c.name+'.atlas'}}).load((_,res)=>ok(res.rig.spineData));});
            const rig=new PIXI.spine.Spine(data);rig.autoUpdate=false;const action=Array.isArray(c.action)?c.action[0]:c.action||data.animations[0]?.name;
            rig.scale.set((c.scale??1)*innerHeight/180);rig.position.set(coord(c.x,innerWidth),innerHeight-coord(c.y,innerHeight));rig.angle=-(c.angle??0);app.stage.addChild(rig);rigs.push({rig,action,c});
            trace.push({name:c.name,action,x:rig.x,y:rig.y,scale:rig.scale.x,angle:rig.angle,version:versions[i]});
          }
          window.renderReference=t=>{for(const {rig,action,c} of rigs){rig.skeleton.setToSetupPose();rig.state.clearTracks();if(action)rig.state.setAnimation(0,action,true);rig.update(t*(c.speed??1));}app.renderer.render(app.stage);};
        }
        return trace;
      },{config:e.sourceConfigs[0].config,versions,sourceBase});
      row.frames=[];
      for(const t of [0,1,3]){await page.evaluate(t=>renderReference(t),t);const file=`${id}-${viewport.width}-t${t}.png`;await page.screenshot({path:path.join(output,file),omitBackground:true});row.frames.push({time:t,file});}
      row.status='captured';
    }catch(error){row.status='failed';row.error=String(error);}
    report.push(row);await page.close();await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({id,viewport,status:row.status,error:row.error}));
  }
}}finally{await browser.close();}
