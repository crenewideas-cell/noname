import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {createLegacyParser} from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';
import {avatarLayerTransform,inferredAvatarZoom,subjectBounds} from '../apps/core/noname/skin/localDynamic/runtime/composition.js';

// Some legacy packs bind an avatar mesh (daiji2) while also shipping its full
// painting (daiji). Select a counterpart only after comparing their attachments
// and UV coverage. Filenames alone are not sufficient evidence.
export async function createSceneVariantResolver() {
  const source=await fs.readFile('apps/core/extension/ui/十周年局内UI/vendor/spine.js','utf8');
  const context=vm.createContext({console,Float32Array,Uint8Array,Int16Array,Uint16Array,DataView,Math,ArrayBuffer,window:{},navigator:{}});
  vm.runInContext(source.replace(/export\s*\{\s*spine\s*\};?/g,''),context);
  const spine=context.spine,cache=new Map();
  async function data(root,model){
    const key=path.join(root,model.skeleton);if(cache.has(key)){const value=cache.get(key);cache.delete(key);cache.set(key,value);return value;}
    const atlas=new spine.TextureAtlas(await fs.readFile(path.join(root,model.atlas),'utf8'),()=>({setFilters(){},setWraps(){},getImage(){return {width:2048,height:2048};}}));
    await Promise.all(atlas.pages.map(page=>fs.access(path.join(root,path.dirname(model.atlas),page.name))));
    const parser=createLegacyParser(spine,atlas,model),bytes=new Uint8Array(await fs.readFile(key));
    const result=parser.readSkeletonData(bytes);cache.set(key,result);
    // Import thousands of rigs without retaining every decoded vertex array.
    if(cache.size>64)cache.delete(cache.keys().next().value);
    return result;
  }
  function meshes(skeleton){
    const result=new Map();
    for(const skin of skeleton.skins)for(const slots of skin.attachments)for(const a of Object.values(slots||{})){
      if(!a.regionUVs?.length)continue;
      const xs=[],ys=[];for(let i=0;i<a.regionUVs.length;i+=2){xs.push(a.regionUVs[i]);ys.push(a.regionUVs[i+1]);}
      result.set(a.name,(Math.max(...xs)-Math.min(...xs))*(Math.max(...ys)-Math.min(...ys)));
    }
    return result;
  }
  function pose(data,animation,time=1/30){
    const skeleton=new spine.Skeleton(data),state=new spine.AnimationState(new spine.AnimationStateData(data));
    const names=data.animations.map(a=>a.name),idle=names.includes(animation)?animation:names.find(n=>/^(idle|normal|daiji|play|stand)$/i.test(n))||names[0];
    if(idle)state.setAnimation(0,idle,true);state.update(time);state.apply(skeleton);skeleton.updateWorldTransform();
    return skeleton;
  }
  function align(original,replacement,animation,options={}){
    const a=pose(original,options.originalAnimation||animation,options.time),b=pose(replacement,animation,options.time),parts=new Map(),points=[];
    for(const slot of b.slots)if(slot.attachment?.regionUVs)parts.set(slot.attachment.name,slot);
    for(const slot of a.slots){
      const m=slot.attachment,next=parts.get(m?.name);if(!m?.regionUVs||!next)continue;
      if(options.names&&!options.names.has(m.name))continue;
      const n=next.attachment;
      if(m.regionUVs.length!==n.regionUVs.length||m.regionUVs.some((u,i)=>Math.abs(u-n.regionUVs[i])>1e-4))continue;
      const av=new Float32Array(m.worldVerticesLength),bv=new Float32Array(n.worldVerticesLength);
      m.computeWorldVertices(slot,0,av.length,av,0,2);n.computeWorldVertices(next,0,bv.length,bv,0,2);
      // Equal weight per attachment; dense effect meshes cannot dominate fit.
      for(let i=0;i<av.length;i+=Math.max(2,Math.ceil(av.length/8/2)*2))points.push([bv[i],bv[i+1],av[i],av[i+1]]);
    }
    if(points.length<12)return;
    const mean=points.reduce((s,p)=>s.map((n,i)=>n+p[i]),[0,0,0,0]).map(n=>n/points.length);
    let denominator=0,real=0,imaginary=0;
    for(const p of points){const x=p[0]-mean[0],y=p[1]-mean[1],u=p[2]-mean[2],v=p[3]-mean[3];denominator+=x*x+y*y;real+=x*u+y*v;imaginary+=x*v-y*u;}
    if(!denominator)return;real/=denominator;imaginary/=denominator;
    const x=mean[2]-real*mean[0]+imaginary*mean[1],y=mean[3]-imaginary*mean[0]-real*mean[1];
    const offset=new spine.Vector2(),size=new spine.Vector2();a.getBounds(offset,size,[]);
    const error=Math.sqrt(points.reduce((s,p)=>s+(real*p[0]-imaginary*p[1]+x-p[2])**2+(imaginary*p[0]+real*p[1]+y-p[3])**2,0)/points.length);
    if(error>Math.hypot(size.x,size.y)*.025)return;
    return {transform:{scale:Math.hypot(real,imaginary),angle:Math.atan2(imaginary,real)*180/Math.PI,x,y},avatarBounds:{x:offset.x,y:offset.y,width:size.x,height:size.y},error};
  }
  const resolve = async (root,entry)=>{
    if(!entry.models?.length)return;
    const index=entry.models.length-1,model=entry.models[index];
    if(!/\/daiji2\.skel$/i.test(model.skeleton)||!/^3\.6\./.test(model.version))return;
    const full={...model,skeleton:model.skeleton.replace(/2\.skel$/i,'.skel'),atlas:model.atlas.replace(/2\.atlas$/i,'.atlas')};
    try{
      const [original,replacement]=await Promise.all([data(root,model),data(root,full)]);
      const a=meshes(original),b=meshes(replacement);
      const shared=[...a.keys()].map(key=>[key,b.has(key)?key:key.replace(/_2$/,'')]).filter(([,key])=>b.has(key));
      // A complete rig may add the hair, cape and legs removed from an avatar.
      // Measure coverage of the original, not of the larger replacement.
      if(shared.length<5||shared.length/a.size<.8)return;
      if(model.animation&&!replacement.animations.some(a=>a.name===model.animation))return;
      const expanded=shared.filter(([key,next])=>b.get(next)>a.get(key)*1.15),shrunk=shared.filter(([key,next])=>b.get(next)<a.get(key)*.9);
      const matchedNames=new Set(shared.map(([,name])=>name));
      const addedLimbs=[...b.keys()].filter(key=>!matchedNames.has(key)&&/(?:tui|jiao|leg|foot|腿|脚)/i.test(key));
      // Full-body exports can restore separate limbs without enlarging any of
      // the existing UVs. Edition flags do not describe this asset coverage.
      const addedBody=addedLimbs.length>=2;
      if(shrunk.length)return;
      const calibration=align(original,replacement,model.animation);if(!calibration)return;
      const addedMeshes=[...b.keys()].filter(key=>!matchedNames.has(key));
      const restored=pose(replacement,model.animation),offset=new spine.Vector2(),size=new spine.Vector2();restored.getBounds(offset,size,[]);
      const angle=calibration.transform.angle*Math.PI/180,c=Math.abs(Math.cos(angle)),s=Math.abs(Math.sin(angle));
      const fullHeight=(s*size.x+c*size.y)*calibration.transform.scale,fullWidth=(c*size.x+s*size.y)*calibration.transform.scale;
      // Some exporters number every body attachment, or restore a single leg
      // plus a hand. Validate the registered geometric coverage as well as
      // semantic names; neither an edition flag nor two named legs is required.
      const numberedBody=[...a.keys()].filter(name=>/^\d+(?:[_-]\d+)*$/.test(name)).length/a.size>.75;
      // Numbered textures alone can be scenery/effects. Confirm a named body
      // chain or a consistently numbered rig, not just numbered image names.
      const bodyChain=replacement.bones.some(b=>b.length>0&&/^(?:xingxiang|zhixin|renwu)\d*$/i.test(b.name));
      const numberedRig=original.slots.filter(slot=>/^\d+(?:[_-]\d+)*$/.test(slot.boneData.name)).length/original.slots.length>.75;
      const bodyEvidence=addedLimbs.length>0||(numberedBody&&(bodyChain||numberedRig));
      // Extra scenery/effects alone are not evidence of a complete character.
      const addedCoverage=bodyEvidence&&shared.length/a.size>=.9&&addedMeshes.length>=2&&(fullHeight>calibration.avatarBounds.height*1.1||fullWidth>calibration.avatarBounds.width*1.1);
      if(!addedBody&&!addedCoverage&&(!expanded.length||!model.avatarPresentation||shared.length/a.size<.9))return;
      // Register restored limbs in the source rig's coordinates. Do not apply
      // the second avatar magnification used for UV-only cropped exports.
      full.sceneVariant={source:model.skeleton,expandedMeshes:expanded.length,sharedMeshes:shared.length,addedLimbs,restoresLimbs:addedBody&&!expanded.length,restoresCoverage:addedCoverage&&!expanded.length,...calibration};
      return entry.models.map((m,i)=>i===index?full:m);
    }catch(error){if(error.code!=='ENOENT')console.warn('场景候选未采用',model.skeleton,error.message);}
  };
  resolve.registerLayers=async(root,entry)=>{
    if(!entry.legacy?.beijing||entry.models?.length!==2||entry.composition?.layers)return;
    const [bg,fg]=entry.models;if(fg.sceneVariant||!entry.models.every(m=>/^3\.[67]\./.test(m.version||'')))return;
    if((bg.legacy?.speed||1)!==(fg.legacy?.speed||1))return;
    try{
      const bodyName=name=>/[a-z]/i.test(name)&&!/^(?:bj|bg|qj|tx|vfx|effect|beijing)[_/-]/i.test(name);
      // Cheap atlas screening avoids decoding thousands of unrelated backgrounds.
      const atlasNames=async m=>new Set([...(await fs.readFile(path.join(root,m.atlas),'utf8')).matchAll(/^([^\s:\r\n][^\r\n]*)\r?\n\s+rotate:/gm)].map(m=>m[1]).filter(bodyName));
      const [left,right]=await Promise.all([atlasNames(bg),atlasNames(fg)]);
      if([...left].filter(name=>right.has(name)).length<3)return;
      const a=await data(root,bg),b=await data(root,fg),background=pose(a,bg.animation),foreground=pose(b,fg.animation);
      const parts=new Map(background.slots.filter(s=>s.attachment?.regionUVs).map(s=>[s.attachment.name,s.attachment]));
      const names=new Set(),textureRatios=[];
      for(const slot of foreground.slots){const m=slot.attachment,n=parts.get(m?.name);
        // Match distinct named geometry, not coincidentally numbered textures or reused effects.
        if(!m?.regionUVs||!n||!bodyName(m.name))continue;
        const rx=m.region.originalWidth/n.region.originalWidth,ry=m.region.originalHeight/n.region.originalHeight;
        if(Math.abs(rx/ry-1)>.03||m.worldVerticesLength!==n.worldVerticesLength||m.triangles.length!==n.triangles.length||m.triangles.some((v,i)=>v!==n.triangles[i]))continue;
        if(m.regionUVs.length===n.regionUVs.length&&m.regionUVs.every((v,i)=>Math.abs(v-n.regionUVs[i])<1e-4)){names.add(m.name);textureRatios.push((rx+ry)/2);}
      }
      if(names.size<3)return;
      // A numbered sequence of one prop (for example a companion/effect) is
      // not independent evidence for aligning the main character's body.
      if(new Set([...names].map(name=>name.replace(/[_-]?\d+$/,''))).size<2)return;
      const textureRatio=textureRatios.reduce((a,b)=>a+b,0)/textureRatios.length;
      if(textureRatios.some(r=>Math.abs(r/textureRatio-1)>.03))return;
      const samples=[1/30,.5,1].map(time=>align(a,b,fg.animation,{names,time,originalAnimation:bg.animation}));
      if(samples.some(s=>!s||s.error>.01))return;
      const t=samples[0].transform;
      if(samples.some(s=>Math.abs(s.transform.scale-t.scale)>1e-4||Math.abs(s.transform.angle-t.angle)>.001||Math.hypot(s.transform.x-t.x,s.transform.y-t.y)>.05))return;
      // Matching geometry proves coordinates, not that the background's full
      // character pose is intended for an avatar. Limit this correction to an
      // existing inferred enlargement, with a recognizable face and partial
      // shared geometry. Never rotate an established portrait or enlarge it.
      const offset=new spine.Vector2(),size=new spine.Vector2();foreground.getBounds(offset,size,[]);
      const old=avatarLayerTransform(entry,1,{x:offset.x,y:offset.y,width:size.x,height:size.y},samples[0].avatarBounds);
      const face=subjectBounds(foreground,t,true),meshCount=foreground.slots.filter(s=>s.attachment?.regionUVs).length;
      // Preserve rigs already sharing scene units; subpixel export round-off
      // is not a reason to move an established composition.
      const diagonal=Math.hypot(samples[0].avatarBounds.width,samples[0].avatarBounds.height);
      if(Math.abs(t.scale-1)<.01&&Math.abs(t.angle)<.1&&Math.hypot(t.x,t.y)<diagonal*.005)return;
      if(!inferredAvatarZoom(entry,old)||t.scale>=old.scale||Math.abs(t.angle)>.1||!face?.width||names.size/meshCount>=.8){
        // Even when composition cannot be safely changed, retain this proof:
        // raw coordinates differ. Pixel recovery must not reset them to identity.
        return [bg,{...fg,layerCoordinateMismatch:t}];
      }
      return [bg,{...fg,layerRegistration:{transform:t,sharedAttachments:[...names],samples:[1/30,.5,1],error:Math.max(...samples.map(s=>s.error))}}];
    }catch{/* Unproven layer alignment keeps the existing rendering policy. */}
  };
  resolve.normalizeAvatars=async(root,entries)=>{
    const signatures=new Map(),declared=new Set(),hashes=new Map();
    const hash=async file=>{if(!hashes.has(file))hashes.set(file,fs.readFile(path.join(root,file)).then(bytes=>createHash('sha256').update(bytes).digest('hex')));return hashes.get(file);};
    for(const entry of entries){
      const main=entry.models?.at(-1);
      if(entry.available===false||!entry.legacy?.beijing||!main||!/(?:^|\/)daiji2\.skel$/i.test(main.skeleton))continue;
      try{
        const signature=JSON.stringify(await Promise.all(entry.models.map(async model=>{
          const c=model.legacy||{};
          return [await hash(model.skeleton),model.atlas?await hash(model.atlas):null,model.animation,c.x,c.y,c.scale,c.angle||0,c.speed||1,c.hideSlots||[]];
        })));
        signatures.set(entry,signature);if(main.legacy?.shizhounian)declared.add(signature);
      }catch{/* Incomplete entries retain their existing availability handling. */}
    }
    // Identical skeletons and placement configuration share one presentation
    // policy, even when a recolor omitted the original edition flag. Distinct
    // exports do not inherit coordinates solely from a filename or title.
    return entries.map(entry=>signatures.has(entry)?{...entry,models:entry.models.map((model,i)=>i===entry.models.length-1?{...model,avatarPresentation:declared.has(signatures.get(entry))}:model)}:entry);
  };
  // A number of legacy configurations omit a shipped companion background.
  // Complete only an exact XingXiang -> BeiJing pair in the same directory,
  // after decoding it and checking every atlas page. Never search other skins.
  resolve.completeBackground=async(root,entry)=>{
    if(!entry.legacy||entry.legacy.beijing||entry.models?.length!==1)return entry;
    const main=entry.models[0],filename=path.posix.basename(main.skeleton);
    if(!/^XingXiang[-_\d]*\.skel$/i.test(filename)||!/^3\.[67]\./.test(main.version))return entry;
    const folder=path.posix.dirname(main.skeleton);
    const name=filename.replace(/^XingXiang/i,'BeiJing');
    try{
      const files=await fs.readdir(path.join(root,folder));
      const exact=files.filter(f=>f.toLowerCase()===name.toLowerCase());
      if(exact.length!==1)return entry;
      const skeleton=path.posix.join(folder,exact[0]),atlas=skeleton.replace(/\.skel$/i,'.atlas');
      const legacy={name:skeleton.replace(/^assets\/dynamic\//,'').replace(/\.skel$/i,''),x:[0,.5],y:[0,.5],scale:main.legacy?.scale||1};
      const background={skeleton,atlas,version:main.version,legacy};
      const parsed=await data(root,background);
      const animation=parsed.animations.find(a=>/^(beijing|background|idle|daiji|play)$/i.test(a.name));
      if(!animation)return entry;
      background.animation=animation.name;legacy.action=animation.name;
      return {...entry,models:[background,main],legacy:{...entry.legacy,beijing:legacy},inferredBackground:{source:'same-directory-companion',skeleton}};
    }catch(error){if(error.code!=='ENOENT')console.warn('背景候选未采用',main.skeleton,error.message);return entry;}
  };
  return resolve;
}
