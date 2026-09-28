import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {installReferenceScreenBlend} from './reference-spine40-screen.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE_PATH||'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01'),origin=process.env.NONAME_UI_TEST_ORIGIN||'http://127.0.0.1:8184';
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const ids=process.env.SKIN_CASE_FILE?JSON.parse(await fs.readFile(process.env.SKIN_CASE_FILE)):(process.env.SKIN_CASE_IDS||'base_548a5def3d1b73f9').split(',');
const viewports=(process.env.SKIN_VIEWPORTS||'360x600,240x360').split(',').map(v=>{const [width,height]=v.split('x').map(Number);return{width,height};});
const times=(process.env.SKIN_TIMES||'0,1,3').split(',').map(Number),output=path.join(run,process.env.SKIN_REFERENCE_LABEL||'spine38-reference');await fs.mkdir(output,{recursive:true});
const policy=process.env.SKIN_REFERENCE_POLICY||'source-coordinates';
const family=process.env.SKIN_REFERENCE_FAMILY||'3.8';
if(!['3.8','4.0'].includes(family))throw Error('Unsupported independent reference family');
if(family==='4.0'&&!process.env.SKIN_REFERENCE_VENDOR)throw Error('4.0 requires pinned upstream build provenance');
const vendorFile=process.env.SKIN_REFERENCE_VENDOR||path.join(run,'reference/spine-webgl-3.8.official.js');
const vendor=await fs.readFile(vendorFile,'utf8');
const provenance={upstream:'https://github.com/EsotericSoftware/spine-runtimes',commit:'8b4844bd4b193ba9e54487ed397a777993cbad56',file:'spine-ts/build/spine-webgl.js',sha256:createHash('sha256').update(vendor).digest('hex'),independence:'Raw source config and assets; official upstream SkeletonJson, animation, geometry, atlas, WebGL renderer. No production PIXI reader, source-scene.js, scene variants, UV restoration or camera inference.',viewportPolicy:'Current native Qianhuan integration scales by height/180; not asserted as the universal author viewport',limitations:['external clipSlots and source action graphs require separate validation','alpha/blend and raster tolerances must be measured, not inferred from successful loading']};
provenance.viewportPolicy=policy==='complete-artwork'?'Fixed union of official clipped draw triangles with nonzero vertex alpha over declared animation samples; no source placeholder placement':provenance.viewportPolicy;
provenance.alphaContract='Transparent canvas uses premultiplied framebuffer output. Upload each straight-alpha atlas page with UNPACK_PREMULTIPLY_ALPHA_WEBGL; preserve source pages explicitly marked pma. Official shader/blend configured premultiplied. Earlier straight-alpha reports are retained as invalid alpha configuration diagnostics.';
if(process.env.SKIN_REFERENCE_VENDOR){const recorded=JSON.parse(await fs.readFile(vendorFile+'.provenance.json'));if(recorded.sha256!==provenance.sha256)throw Error('Vendor hash mismatch');Object.assign(provenance,{commit:recorded.commit,upstream:recorded.upstream,file:recorded.source||provenance.file,pinnedReference:recorded,limitations:[...provenance.limitations,'Pinned official runtime is not current certification; known exporter warnings remain applicable']});}
provenance.family=family;
const adaptScreen=process.env.SKIN_REFERENCE_SCREEN_CONTRACT==='1';
if(adaptScreen){
 if(family!=='4.0')throw Error('Screen reference adaptation is validated only for pinned 4.0');
 const evidence=JSON.parse(await fs.readFile(path.join(run,'blend-contract/report.json')));
 if(!evidence.pass||evidence.vendorSHA256!==provenance.sha256)throw Error('Missing exact pinned blend contract evidence');
 provenance.referenceAdapter={file:'scripts/reference-spine40-screen.mjs',sha256:createHash('sha256').update(await fs.readFile(new URL('./reference-spine40-screen.mjs',import.meta.url))).digest('hex'),contract:'W3C source-over Screen PMA',evidence:'blend-contract/report.json',scope:'Screen converter only; upstream file bytes unchanged, rendering behavior explicitly adapted'};
}
await fs.writeFile(path.join(output,'provenance.json'),JSON.stringify(provenance,null,2));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'}),rows=[];
try{for(const id of ids)for(const viewport of viewports){
 const e=inventory.entries.find(e=>e.id===id);if(!e)throw Error('Unknown source identity: '+id);
 const page=await browser.newPage({viewport,deviceScaleFactor:1});const row={id,viewport,sourceConfigHash:e.sourceConfigHash,sourceModels:e.sourceModels,frames:[],errors:[]};
 page.on('pageerror',error=>row.errors.push(String(error)));
 try{
  if(new Set(e.sourceConfigs.map(c=>JSON.stringify(c.config))).size!==1)throw Error('Independent reference requires unambiguous source config');
  await page.route('**/independent-spine38.html',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0;overflow:hidden;background:transparent"></body></html>'}));
  await page.goto(origin+'/independent-spine38.html');await page.addScriptTag({content:vendor});
  if(adaptScreen)await page.addScriptTag({content:'('+installReferenceScreenBlend.toString()+')(spine);'});
  const assetBase=origin+'/@fs/'+path.resolve('temp/动态皮包/无名杀基础扩展/assets/dynamic').replaceAll('\\','/')+'/';
  row.layers=await page.evaluate(async({config,assetBase,policy,family})=>{
   // Version-specific namespace adapter only; upstream code stays untouched.
   const webgl=spine.webgl||spine;
   const canvas=document.createElement('canvas');canvas.width=innerWidth;canvas.height=innerHeight;document.body.append(canvas);
   const context=new webgl.ManagedWebGLRenderingContext(canvas,{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:true});const gl=context.gl;
   const renderer=new webgl.SceneRenderer(canvas,context),assets=new webgl.AssetManager(context),layers=[];
   renderer.camera.setViewport(innerWidth,innerHeight);renderer.camera.position.set(innerWidth/2,innerHeight/2,0);
   const load=(method,url)=>new Promise((resolve,reject)=>assets[method](url,(_,data)=>resolve(data),(_,error)=>reject(Error(String(error)))));
   const coord=(v,size)=>v==null?size/2:Array.isArray(v)?v[0]+v[1]*size:v;
   for(const c of [config.beijing,config,config.qianjing].filter(c=>c?.name)){
    const [atlas,payload]=await Promise.all([load('loadTextureAtlas',assetBase+c.name+'.atlas'),load(c.json?'loadText':'loadBinary',assetBase+c.name+(c.json?'.json':'.skel'))]);
    for(const page of atlas.pages){const already=c.premultipliedAlpha??(page.pma||page.name.includes('-pma.'));gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!already);page.texture.update();}gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
    const reader=new (c.json?spine.SkeletonJson:spine.SkeletonBinary)(new spine.AtlasAttachmentLoader(atlas));
    const data=reader.readSkeletonData(c.json?JSON.parse(payload):payload),skeleton=new spine.Skeleton(data);
    if(!data.version.startsWith(family+'.'))throw Error('Exact reference version mismatch: '+data.version);
    if(c.skin)skeleton.setSkinByName(c.skin);const state=new spine.AnimationState(new spine.AnimationStateData(data));
    const action=c.action??c.animation??data.animations[0]?.name;if(Array.isArray(action))throw Error('Action sequence outside reference category');
    layers.push({config:c,skeleton,state,action,x:coord(c.x,innerWidth),y:coord(c.y,innerHeight),scale:(c.scale??1)*innerHeight/180});
   }
   if(policy==='complete-artwork'){
    if(layers.length!==1)throw Error('Complete-artwork reference requires one source layer');
    const l=layers[0],samples=[];l.actionCameras={};
    const pose=(action,time)=>{l.skeleton.setToSetupPose();l.state.clearTracks();l.state.setAnimation(0,action,true);l.state.update(time);l.state.apply(l.skeleton);l.skeleton.updateWorldTransform();};
    for(const a of l.skeleton.data.animations){
     let x=Infinity,y=Infinity,right=-Infinity,top=-Infinity;
     const d=a.duration,epsilon=1/60,sampleTimes=[...new Set([0,d/4,d/2,3*d/4,Math.max(0,d-epsilon),d+epsilon,Math.max(0,2*d-epsilon),2*d+epsilon])];
     for(const t of sampleTimes){
      pose(a.name,t);
      // Observe actual upstream clipping/draw output. getBounds also includes
      // fully transparent and clipped-away attachments, which are not artwork.
      let vertices=0,transparentVertices=0;
      renderer.skeletonRenderer.draw({setBlendMode(){},draw(texture,data,triangles){
       const stride=renderer.skeletonRenderer.vertexSize;
       for(const index of new Set(triangles)){const at=index*stride;if(!(data[at+5]>0)){transparentVertices++;continue;}const px=data[at],py=data[at+1];if(!Number.isFinite(px)||!Number.isFinite(py))throw Error('Nonfinite rendered source vertex');x=Math.min(x,px);y=Math.min(y,py);right=Math.max(right,px);top=Math.max(top,py);vertices++;}
      }},l.skeleton);
      samples.push({action:a.name,time:t,duration:d,vertices,transparentVertices});
     }
     if(!(right>x&&top>y))throw Error('Empty reference bounds: '+a.name);
     let bounds={x,y,width:right-x,height:top-y};const geometryBounds={...bounds},refinements=[];
     // Raster evidence removes transparent texture padding, not backgrounds or
     // named attachments. Refine offline; the runtime camera stays fixed.
     const size=1024,pixels=new Uint8Array(size*size*4);canvas.width=canvas.height=size;
     for(let pass=0;pass<3;pass++){
      const scale=size/Math.max(bounds.width,bounds.height),cx=bounds.x+bounds.width/2,cy=bounds.y+bounds.height/2;
      renderer.camera.setViewport(size/scale,size/scale);renderer.camera.position.set(cx,cy,0);
      let left=size,bottom=size,rightPixel=-1,topPixel=-1;
      for(const t of sampleTimes){pose(a.name,t);gl.viewport(0,0,size,size);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);renderer.begin();renderer.drawSkeleton(l.skeleton,true);renderer.end();gl.readPixels(0,0,size,size,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
       for(let py=0;py<size;py++)for(let px=0;px<size;px++)if(pixels[(py*size+px)*4+3]>0){left=Math.min(left,px);bottom=Math.min(bottom,py);rightPixel=Math.max(rightPixel,px);topPixel=Math.max(topPixel,py);}
      }
      if(rightPixel<left)throw Error('No visible source pixels: '+a.name);
      const next={x:cx+(left-2-size/2)/scale,y:cy+(bottom-2-size/2)/scale,width:(rightPixel-left+5)/scale,height:(topPixel-bottom+5)/scale};
      refinements.push({pass,input:bounds,pixelBounds:{left,bottom,right:rightPixel,top:topPixel},output:next,resolution:size,alphaThreshold:0,paddingPixels:2});bounds=next;
     }
     l.actionCameras[a.name]={bounds,geometryBounds,refinements,sampleTimes,duration:d};
    }
    l.cameraBounds=l.actionCameras[l.action].bounds;l.boundSamples=samples;canvas.width=innerWidth;canvas.height=innerHeight;
    const b=l.cameraBounds,scale=Math.min(innerWidth/b.width,innerHeight/b.height);renderer.camera.setViewport(innerWidth/scale,innerHeight/scale);renderer.camera.position.set(b.x+b.width/2,b.y+b.height/2,0);
    l.x=l.y=0;l.scale=1;
   }
   window.renderReference=(t,actionName)=>{
    if(policy==='complete-artwork'){
     const l=layers[0],b=l.actionCameras[actionName||l.action].bounds,scale=Math.min(innerWidth/b.width,innerHeight/b.height);
     renderer.camera.setViewport(innerWidth/scale,innerHeight/scale);renderer.camera.position.set(b.x+b.width/2,b.y+b.height/2,0);
    }
    gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    for(const l of layers){const {skeleton,state,config:c}=l;skeleton.setToSetupPose();state.clearTracks();if(actionName||l.action)state.setAnimation(0,actionName||l.action,true);state.update(t*(c.speed??1));state.apply(skeleton);skeleton.scaleX=c.flipX?-1:1;skeleton.scaleY=c.flipY?-1:1;skeleton.color.a=c.opacity??1;skeleton.updateWorldTransform();
     for(const slot of skeleton.slots)if(c.hideSlots?.includes(slot.attachment?.name))slot.setAttachment(null);
     renderer.begin();const matrix=renderer.camera.projectionView.copy(),model=new webgl.Matrix4();
     const radians=(c.angle??0)*Math.PI/180,cos=Math.cos(radians)*l.scale,sin=Math.sin(radians)*l.scale;
     model.values[webgl.M00]=cos;model.values[webgl.M01]=-sin;model.values[webgl.M10]=sin;model.values[webgl.M11]=cos;
     model.values[webgl.M03]=l.x;model.values[webgl.M13]=l.y;
     matrix.multiply(model);renderer.batcherShader.setUniform4x4f(webgl.Shader.MVP_MATRIX,matrix.values);renderer.drawSkeleton(skeleton,true);renderer.end();
    }
   };
   return layers.map(l=>({name:l.config.name,version:l.skeleton.data.version,animations:l.skeleton.data.animations.map(a=>({name:a.name,duration:a.duration})),action:l.action,x:l.x,y:l.y,scale:l.scale,cameraBounds:l.cameraBounds,boundSamples:l.boundSamples,actionCameras:l.actionCameras}));
  },{config:e.sourceConfigs[0].config,assetBase,policy,family});
  const frames=process.env.SKIN_CAPTURE_ACTIONS==='1'?Object.entries(row.layers[0].actionCameras).flatMap(([action,c])=>c.sampleTimes.map(time=>({action,time,duration:c.duration}))):times.map(time=>({time}));
  for(const frame of frames){await page.evaluate(({time,action})=>renderReference(time,action),frame);const file=`${id}-${viewport.width}-${frame.action?encodeURIComponent(frame.action)+'-':''}t${frame.time.toFixed(6).replace(/\.?0+$/,'')||'0'}.png`;await page.screenshot({path:path.join(output,file),omitBackground:true});row.frames.push({...frame,file});}row.status='captured';
 }catch(error){row.status='failed';row.error=String(error);}
 rows.push(row);await page.close();await fs.writeFile(path.join(output,'report.json'),JSON.stringify(rows,null,2));console.log(JSON.stringify({id,viewport,status:row.status,error:row.error?.slice(0,180)}));
}}finally{await browser.close();}
if(rows.some(r=>r.status==='failed'))process.exitCode=1;
