import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {installReferenceScreenBlend} from './reference-spine40-screen.mjs';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve('output/dynamic-remediation/20260926-r01'),work=path.join(run,'continuation-actions-20260926');
const label=process.env.SKIN_ACTION_REFERENCE_LABEL||'reference-pilot',out=path.join(work,label);await fs.mkdir(out,{recursive:true});
const capture=JSON.parse(await fs.readFile(path.join(work,process.env.SKIN_ACTION_CAPTURE||'browser-pilot-v3','report.json')));
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const sha=b=>createHash('sha256').update(b).digest('hex'),origin='http://127.0.0.1:8184';
const identities=[];
for(const file of ['reference/spine-webgl-4.0.official.js','reference/spine-webgl-3.8-20191015.official.js'])identities.push({file,sha256:sha(await fs.readFile(path.join(run,file)))});
const provenance={identities,adapterSHA256:sha(await fs.readFile('scripts/reference-spine40-screen.mjs')),runnerSHA256:sha(await fs.readFile(import.meta.filename)),inputReport:process.env.SKIN_ACTION_CAPTURE||'browser-pilot-v3',selection:'Raw frozen source config and raw assets; primary named event then explicit source idle, background remains on its own clock. Direct-pose oracle, no source-actions.js or candidate action metadata.',limitations:['3.6 APNode renderer shares locally decoded data/renderer; independent Java decode evidence is reused, not independent raster certification.','3.8.75 uses the pinned historical runtime, including its known limitations.','4.0 Screen reference-only adaptation is explicitly reused from the validated blend contract.','Static backgrounds are not composed; those comparisons remain incomplete.','Viewport still uses the existing Qianhuan height/180 policy; neither framing nor automatic entrance policy is certified.']};
await fs.writeFile(path.join(out,'provenance.json'),JSON.stringify(provenance,null,2),{flag:'wx'});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),rows=[];
try{for(const row of capture){
 const e=inventory.entries.find(e=>e.id===row.id),config=e.sourceConfigs[0].config;
 const family=e.sourceModelFacts[0].version.slice(0,3),page=await browser.newPage({viewport:row.viewport,deviceScaleFactor:1});
 const result={id:e.id,family,sourceConfigHash:e.sourceConfigHash,staticBackgroundIncomplete:!!config.background,frames:[]};
 try{
  await page.route('**/source-action-reference.html',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0;background:transparent;overflow:hidden"></body></html>'}));
  await page.goto(origin+'/source-action-reference.html');
  const assetBase=origin+'/@fs/'+path.resolve('temp/动态皮包/无名杀基础扩展/assets/dynamic').replaceAll('\\','/')+'/';
  if(family!=='3.6'){
   const file=family==='4.0'?'reference/spine-webgl-4.0.official.js':'reference/spine-webgl-3.8-20191015.official.js';
   const bytes=await fs.readFile(path.join(run,file)),recorded=JSON.parse(await fs.readFile(path.join(run,file+'.provenance.json')));
   if(sha(bytes)!==recorded.sha256)throw Error('Pinned reference hash changed');
   await page.addScriptTag({content:bytes.toString()});if(family==='4.0')await page.addScriptTag({content:'('+installReferenceScreenBlend.toString()+')(spine)'});
  }
  await page.evaluate(async({config,assetBase,family,versions})=>{
   window.requestAnimationFrame=()=>0;
   const configs=[config.beijing,config,config.qianjing].filter(c=>c?.name),primary=configs.indexOf(config);
   let layers=[],draw;
   if(family==='3.6'){
    const {spine}=await import('/extension/十周年局内UI/vendor/spine.js');
    const {createLegacyParser}=await import('/noname/skin/localDynamic/runtime/legacy-parser.js');
    const {createAnimationRenderer}=await import('/extension/十周年局内UI/animation-renderer.js');
    const {AnimationPlayer}=createAnimationRenderer(spine),renderer=new AnimationPlayer(assetBase,document.body);
    renderer.canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    for(let i=0;i<configs.length;i++){
     const c=configs[i];await new Promise((ok,no)=>renderer.loadSpine(c.name,'skel',ok,()=>no(Error('Reference load failed: '+c.name))));
     const manager=renderer.spine.assetManager,prefix=c.name.slice(0,c.name.lastIndexOf('/')+1);
     const atlas=new spine.TextureAtlas(manager.get(c.name+'.atlas'),name=>manager.get(prefix+name));
     renderer.spine.assets[c.name].skelRawData=createLegacyParser(spine,atlas,{skeleton:c.name+'.skel',version:versions[i]});
     const sprite=renderer.playSpine({...c,loop:true},{x:c.x??[0,.5],y:c.y??[0,.5],scale:(c.scale??1)*innerHeight/180,angle:c.angle??0});
     layers.push({c,skeleton:sprite.skeleton,state:sprite.skeleton.state,idle:c.action??c.animation??sprite.skeleton.defaultAction});
    }
    draw=()=>{renderer.frameTime=0;renderer.render(0);};
   }else{
    const webgl=spine.webgl||spine,canvas=document.createElement('canvas');canvas.width=innerWidth;canvas.height=innerHeight;document.body.append(canvas);
    const context=new webgl.ManagedWebGLRenderingContext(canvas,{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:true}),gl=context.gl;
    const renderer=new webgl.SceneRenderer(canvas,context),assets=new webgl.AssetManager(context);
    renderer.camera.setViewport(innerWidth,innerHeight);renderer.camera.position.set(innerWidth/2,innerHeight/2,0);
    const load=(m,u)=>new Promise((ok,no)=>assets[m](u,(_,data)=>ok(data),(_,error)=>no(Error(String(error)))));
    for(const c of configs){
     const [atlas,payload]=await Promise.all([load('loadTextureAtlas',assetBase+c.name+'.atlas'),load(c.json?'loadText':'loadBinary',assetBase+c.name+(c.json?'.json':'.skel'))]);
     for(const page of atlas.pages){const already=c.premultipliedAlpha??(page.pma||page.name.includes('-pma.'));gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!already);page.texture.update();}gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
     const reader=new(c.json?spine.SkeletonJson:spine.SkeletonBinary)(new spine.AtlasAttachmentLoader(atlas)),data=reader.readSkeletonData(c.json?JSON.parse(payload):payload);
     const skeleton=new spine.Skeleton(data),state=new spine.AnimationState(new spine.AnimationStateData(data));if(c.skin)skeleton.setSkinByName(c.skin);
     layers.push({c,skeleton,state,idle:c.action??c.animation??data.animations[0]?.name});
    }
    const coord=(v,size)=>v==null?size/2:Array.isArray(v)?v[0]+v[1]*size:v;
    draw=()=>{
     gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
     for(const l of layers){const {c,skeleton}=l;skeleton.scaleX=c.flipX?-1:1;skeleton.scaleY=c.flipY?-1:1;skeleton.color.a=c.opacity??1;skeleton.updateWorldTransform();
      for(const slot of skeleton.slots)if(c.hideSlots?.includes(slot.attachment?.name))slot.setAttachment(null);
      renderer.begin();const matrix=renderer.camera.projectionView.copy(),model=new webgl.Matrix4(),scale=(c.scale??1)*innerHeight/180,angle=(c.angle??0)*Math.PI/180;
      model.values[webgl.M00]=Math.cos(angle)*scale;model.values[webgl.M01]=-Math.sin(angle)*scale;model.values[webgl.M10]=Math.sin(angle)*scale;model.values[webgl.M11]=Math.cos(angle)*scale;
      model.values[webgl.M03]=coord(c.x,innerWidth);model.values[webgl.M13]=coord(c.y,innerHeight);matrix.multiply(model);
      renderer.batcherShader.setUniform4x4f(webgl.Shader.MVP_MATRIX,matrix.values);renderer.drawSkeleton(skeleton,true);renderer.end();
     }
    };
   }
   window.renderSourceAction=(kind,t)=>{
    const raw=config[kind],name=typeof raw==='string'?raw:raw.action??raw.animation;
    const duration=layers[primary].skeleton.data.findAnimation(name).duration;
    const trace=[];
    for(let i=0;i<layers.length;i++){
     const l=layers[i],elapsed=t*(l.c.speed??1),event=i===primary&&elapsed<duration;
     const action=event?name:l.idle,time=i===primary&&!event?elapsed-duration:elapsed;
     l.skeleton.setToSetupPose();l.state.clearTracks();l.state.setAnimation(0,action,!event);l.state.update(time);l.state.apply(l.skeleton);l.skeleton.updateWorldTransform();trace.push({action,time});
    }
    draw();return trace;
   };
  },{config,assetBase,family,versions:e.sourceModelFacts.map(m=>m.version)});
  for(const action of row.actions)for(const frame of action.frames){
   const logicalTime=action.samples.find(s=>Math.abs(s.time-frame.time)<1e-7)?.time??frame.time;
   const trace=await page.evaluate(({kind,time})=>renderSourceAction(kind,time),{kind:action.kind,time:logicalTime});
   await page.screenshot({path:path.join(out,frame.file),omitBackground:true});result.frames.push({...frame,logicalTime,kind:action.kind,trace});
  }
  result.status='captured';
 }catch(error){result.status='failed';result.error=String(error);}
 rows.push(result);await page.close();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(rows,null,2));console.log(JSON.stringify({id:result.id,status:result.status,error:result.error}));
}}finally{await browser.close();}
