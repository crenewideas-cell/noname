import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreMeshUVs } from '../apps/core/noname/skin/localDynamic/runtime/mesh-uv.js';
import { transformBounds, paintingBounds, sceneFocus, avatarLayerTransform, faceAnchor, subjectBounds, idleAnimation, portraitClipBounds, cameraSubjectX, inferredAvatarZoom } from '../apps/core/noname/skin/localDynamic/runtime/composition.js';
import { usePremultipliedTexture } from '../apps/core/noname/skin/localDynamic/runtime/texture-alpha.js';
import { createLegacyParser, usesSpine36 } from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createSceneVariantResolver} from './dynamic-scene-variants.mjs';

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);
const backdrop=(name,x,y,width,height)=>({data:{blendMode:0},bone:{},attachment:{name,region:{width,height},computeWorldVertices(bone,out){out.set([x,y,x+width,y,x+width,y+height,x,y+height]);}}});
test('explicit off-frame placement outranks a numeric torso hint but never a detected face',()=>{
  const entry={models:[{legacy:{x:[0,1.11]}}]},torso={x:30,y:50,width:0,height:0};
  assert.equal(cameraSubjectX(entry,torso),undefined);
  assert.equal(cameraSubjectX(entry,{...torso,width:40,height:50}),50);
  entry.models[0].legacy.x=[0,.45];assert.equal(cameraSubjectX(entry,torso),30);
});
test('cross-layer registration outranks guessed avatar zoom and remains protected during recovery',()=>{
  const transform={scale:1.9,x:19,y:88,angle:0},m={skeleton:'a/daiji2.skel',avatarPresentation:true,legacy:{scale:1},layerRegistration:{transform}};
  const entry={legacy:{beijing:{}},models:[{legacy:{scale:.3}},m]};
  assert.deepEqual(avatarLayerTransform(entry,1,{height:400},{height:1500}),transform);
  assert.equal(inferredAvatarZoom(entry,transform),false);
  delete m.layerRegistration;assert.equal(inferredAvatarZoom(entry,transform),true);
  m.sceneVariant={};assert.equal(inferredAvatarZoom(entry,transform),false);
});
test('background entrances use an available steady animation without overriding foreground actions',()=>{
  const names=['ChuChang','BeiJing'];
  assert.equal(idleAnimation({animation:'ChuChang'},names,true),'BeiJing');
  assert.equal(idleAnimation({animation:'ChuChang'},names,false),'ChuChang');
  assert.equal(idleAnimation({animation:'custom'},['custom','idle'],true),'custom');
  assert.equal(idleAnimation({animation:'ChuChang'},['ChuChang'],true),'ChuChang');
});
test('only an unambiguous rectangular avatar mask paired with a loaded backdrop defines the viewport',()=>{
  const end={},slot={data:{},attachment:{endSlot:end,worldVerticesLength:8,computeWorldVertices(s,o,n,v){v.set([-10,-20,10,-20,10,20,-10,20]);}}};
  const skeleton={data:{animations:[{name:'daiji'},{name:'daiji_touxiang'}]},slots:[slot,...Array.from({length:5},()=>({data:{}})),{data:end}]};
  const entry={staticBackground:'bg.png',models:[{animation:'daiji'}]};
  assert.deepEqual(portraitClipBounds(entry,skeleton),{x:-10,y:-20,width:20,height:40});
  assert.equal(portraitClipBounds({...entry,staticBackground:undefined},skeleton),undefined);
  assert.equal(portraitClipBounds({...entry,models:[{},{}]},skeleton),undefined);
  slot.attachment.computeWorldVertices=(s,o,n,v)=>v.set([-10,-20,10,0,10,20,-10,0]);
  assert.equal(portraitClipBounds(entry,skeleton),undefined,'Nonrectangular scene masks retain their original framing');
});
test('compact exporter prefixes identify the person rather than a dragon companion',()=>{
  const head=backdrop('ywtou',100,50,40,50),dragon=backdrop('ywlongtou',-900,-500,1000,1000);
  const skeleton={slots:[head,dragon,...['ywshenti','ywshou','ywtui','ywyifu','ywyaodai'].map(n=>backdrop(n,0,0,10,10))]};
  assert.equal(subjectBounds(skeleton,{},true).x,100);
  assert.equal(faceAnchor(skeleton),undefined,'The new convention does not silently move established cameras');
  skeleton.slots.push(backdrop('head',-50,0,20,20));
  assert.equal(subjectBounds(skeleton,{},true).x,-50,'Existing recognized faces take priority over the new prefix fallback');
});
test('import shares presentation only between identical rigs and placement, not similarly named skins',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'noname-rig-signature-'));
  try{
    for(const name of ['a','b','c']){await fs.mkdir(path.join(root,name));await fs.writeFile(path.join(root,name,'daiji2.skel'),name==='c'?'different rig':'same rig');}
    await fs.writeFile(path.join(root,'bg.skel'),'same background');
    const entry=(name,flag,x=.5)=>({id:name,legacy:{beijing:{}},models:[{skeleton:'bg.skel',legacy:{scale:.3}},{skeleton:name+'/daiji2.skel',legacy:{scale:1,x:[0,x],shizhounian:flag}}]});
    const resolve=await createSceneVariantResolver();
    const rows=await resolve.normalizeAvatars(root,[entry('a',true),entry('b',false),entry('c',false),entry('b',false,.7)]);
    assert.deepEqual(rows.map(e=>e.models.at(-1).avatarPresentation),[true,true,false,false]);
  }finally{
    for(const name of ['a','b','c']){await fs.unlink(path.join(root,name,'daiji2.skel'));await fs.rmdir(path.join(root,name));}
    await fs.unlink(path.join(root,'bg.skel'));await fs.rmdir(root);
  }
});
test('camera uses the base painting and ignores outlying cloth and particles',()=>{
  const result=paintingBounds({slots:[backdrop('bg',-500,-300,1000,600),backdrop('cloth',-300,-900,600,1400)]});
  assert.deepEqual(result,{x:-500,y:-300,width:1000,height:600});
  const hidden=backdrop('bg_hidden',-1000,400,2000,1200);hidden.color={a:0};
  assert.deepEqual(paintingBounds({slots:[hidden,backdrop('bg',-500,-300,1000,600)]}),result);
});
test('scrolling tiles form one camera width; repeated ornaments do not',()=>{
  const tiles=[-1500,-500,500].map(x=>backdrop('cloud',x,-300,1000,600));
  assert.deepEqual(paintingBounds({slots:tiles},{x:-100,width:200}),{x:-500,y:-300,width:1000,height:600});
  assert.equal(paintingBounds({slots:[backdrop('leaf',0,0,100,50),backdrop('leaf',25,75,100,50)]},{x:0,width:100}),null);
});
test('overlapping background copies use their shared plane, excluding effect overhang',()=>{
  assert.deepEqual(paintingBounds({slots:[backdrop('123',-300,-200,600,400),backdrop('123',-320,-220,640,440)]}),{x:-300,y:-200,width:600,height:400});
  assert.deepEqual(paintingBounds({slots:[backdrop('01bg_001',-300,-200,600,400),backdrop('cloth',-500,-500,1000,1600)]}),{x:-300,y:-200,width:600,height:400});
  assert.deepEqual(paintingBounds({slots:[backdrop('bg_01',-300,-400,600,800),backdrop('bg_02',0,0,160,160)]}),{x:-300,y:-400,width:600,height:800});
  assert.deepEqual(paintingBounds({slots:[backdrop('hero_beijing',-300,-200,600,400)]}),{x:-300,y:-200,width:600,height:400});
  assert.deepEqual(paintingBounds({slots:[backdrop('bu-bg',-300,-200,600,400),backdrop('bg-huo1',100,-100,120,160),backdrop('bg-huo1',240,-100,120,160)]}),{x:-300,y:-200,width:600,height:400});
  assert.deepEqual(paintingBounds({slots:[backdrop('25',-300,-200,600,400),backdrop('TX/hero_bg_tx_00',0,200,120,60)]}),{x:-300,y:-200,width:600,height:400});
});
test('face anchor follows the composed layer transform and ignores hair/crown attachments',()=>{
  const skeleton={slots:[backdrop('31tou',100,200,40,60),backdrop('30toufa',-200,0,300,200)]};
  assert.equal(faceAnchor(skeleton,{scale:2,x:-20,y:40}),220);
  assert.equal(faceAnchor({slots:[backdrop('unknown',0,0,100,100)]}),undefined);
  assert.equal(faceAnchor({slots:[backdrop('r-tou',100,200,40,60),backdrop('r-toufayy1',-200,0,300,200)]}),120);
  assert.equal(faceAnchor({slots:[backdrop('tou1_tou',0,200,40,60),backdrop('xiongmao3_tou',200,-200,300,300)]}),20);
  const modern=backdrop('head',0,0,40,60),draw=modern.attachment.computeWorldVertices;
  modern.attachment.computeWorldVertices=(slot,out)=>{assert.equal(slot,modern);draw(slot.bone,out);};
  assert.equal(faceAnchor({data:{version:'4.2.0'},slots:[modern]}),20);
});
test('subject anchoring supports exporter prefixes and numeric body rigs without following companions',()=>{
  const slots=['hero_tou3','hero_hair','hero_arm','hero_leg','hero_cloth','hero_body'].map(n=>backdrop(n,100,200,40,60));
  slots.push(backdrop('animal_tou',-400,0,200,200));
  assert.equal(faceAnchor({slots}),120);
  assert.equal(faceAnchor({slots:[backdrop('rentou',100,200,40,60)]}),120);
  const skeleton={slots:[backdrop('4608_1',0,0,100,100),backdrop('4608_2',0,0,100,100)],bones:[
    {data:{name:'qianjing3',length:100},worldX:900,worldY:10},
    {data:{name:'xingxiang3',length:69},worldX:-60,worldY:30}]};
  assert.equal(faceAnchor(skeleton,{scale:2,x:10}),-110);
});
test('restored full limbs retain the registered scale instead of avatar enlargement',()=>{
  const transform={scale:.58,x:-67,y:-31,angle:0};
  const entry={legacy:{beijing:{}},models:[{legacy:{scale:.3}},{legacy:{scale:.88},sceneVariant:{restoresLimbs:true,transform}}]};
  assert.deepEqual(avatarLayerTransform(entry,1,{x:-600,y:-800,width:1200,height:1340},{x:-550,y:-350,width:1130,height:750}),transform);
  entry.models[1].sceneVariant={restoresCoverage:true,transform};
  assert.deepEqual(avatarLayerTransform(entry,1,{x:-600,y:-800,width:1200,height:1340},{x:-550,y:-350,width:1130,height:750}),transform);
});
test('exporter label alone cannot change the composition of identical models',()=>{
  const entry={legacy:{beijing:{}},models:[{legacy:{scale:.3}},{skeleton:'scene/daiji2.skel',avatarPresentation:true,legacy:{scale:1.05}}]};
  const figure={x:-225,y:-253,width:703,height:465},background={x:-717,y:-399,width:1400,height:853};
  const before=avatarLayerTransform(entry,1,figure,background);
  entry.models[1].legacy.shizhounian=true;
  assert.deepEqual(avatarLayerTransform(entry,1,figure,background),before);
  entry.models[1].skeleton='scene/daiji.skel';
  assert.equal(avatarLayerTransform(entry,1,figure,background),undefined,'A full-scene figure must not receive avatar magnification');
});
test('camera reuses avatar focus while full-scene rigs keep shared coordinates',()=>{
  const bounds={x:-500,y:-300,width:1000,height:600};
  const entry={legacy:{beijing:{}},models:[{legacy:{scale:.3}},{legacy:{scale:.6,x:[0,1.5],shizhounian:true}}]};
  const result=sceneFocus(entry,bounds,.6);
  assert.equal(result.x+result.width/2,-180);assert.equal(result.height,600);
  entry.models[1].sceneVariant={source:'avatar.skel'};
  assert.deepEqual(sceneFocus(entry,bounds,.6),bounds);
  assert.equal(avatarLayerTransform(entry,1,{x:0,y:0,width:100,height:200},bounds),undefined);
  delete entry.models[1].sceneVariant;entry.models[1].legacy.x=[0,.5];
  assert.deepEqual(sceneFocus(entry,{...bounds,x:-300},.6),{...bounds,x:-300});
});
test('alpha upload remains consistent after restore and preserves shared GL state', () => {
  for (const premultiplied of [false, true]) {
    let setting = true;
    const uploads=[],gl={UNPACK_PREMULTIPLY_ALPHA_WEBGL:1,getParameter:()=>setting,pixelStorei:(_,v)=>setting=v};
    const texture={getImage:()=>({}),update(){uploads.push(setting);},restore(){this.update();}};
    usePremultipliedTexture(texture,gl,premultiplied);
    texture.restore();
    assert.deepEqual(uploads,[!premultiplied,!premultiplied]);
    assert.equal(setting,true);
  }
});
test('only the validated legacy binary family enters the legacy reader',()=>{
  assert.equal(usesSpine36({skeleton:'a.skel',version:'3.6.38'}),true);
  assert.equal(usesSpine36({skeleton:'a.skel',version:'3.7.94'}),true);
  for(const version of ['3.3.07','3.5.49','3.8.99','4.0.56'])assert.equal(usesSpine36({skeleton:'a.skel',version}),false);
});
test('3.6 non-default skin starts with slots, without consuming newer bone fields',()=>{
  const spine={AtlasAttachmentLoader:class{},MeshAttachment:class{},Skin:class{constructor(name){this.name=name;this.attachments=[];}setAttachment(...args){this.attachments.push(args);}},SkeletonBinary:class{constructor(){this.linkedMeshes=[];}readSkin(){throw Error('wrong dialect');}readAttachment(){return {name:'part'};}readSkeletonData(){return {skins:[this.readSkin(this.input,{},false,false)]};}}};
  const parser=createLegacyParser(spine,{}, {skeleton:'a.skel',version:'3.6.38'});
  const ints=[1,2,1],strings=['alternate','part'];
  parser.input={index:0,readInt(){this.index++;return ints.shift();},readString(){this.index++;return strings.shift();}};
  const data=parser.readSkeletonData(new Uint8Array(5)).skins[0];
  assert.equal(data.name,'alternate');assert.deepEqual(data.attachments,[[2,'part',{name:'part'}]]);
});
test('layer presentation transforms its bounds after the rig, preserving source coordinates', () => {
  const bounds = {x:1,y:2,width:3,height:4};
  const transformed = transformBounds(bounds,{scale:2,angle:90,x:10,y:-5});
  for (const [key,value] of Object.entries({x:-2,y:-3,width:8,height:6})) near(transformed[key],value);
  assert.deepEqual(bounds,{x:1,y:2,width:3,height:4});
});
test('trimmed mesh corners map to the atlas rectangle instead of stretching the seam', () => {
  for (const rotate of [false, true]) {
    const mesh = { region: { x: 100, y: 200, width: 80, height: 40, originalWidth: 120, originalHeight: 90,
      offsetX: 15, offsetY: 20, rotate, texture: { getImage: () => ({ width: 1024, height: 512 }) } },
      regionUVs: [15 / 120, 30 / 90, 95 / 120, 70 / 90] };
    restoreMeshUVs(mesh);
    const expected = rotate ? [100, 280, 140, 200] : [100, 200, 180, 240];
    mesh.uvs.forEach((value, i) => near(value, expected[i] / (i % 2 ? 512 : 1024)));
  }
});
test('untrimmed rotated and ordinary pages preserve the old mapping', () => {
  for (const rotate of [false, true]) {
    const mesh = { region: { x: 100, y: 200, width: 80, height: 40, originalWidth: 80, originalHeight: 40,
      offsetX: 0, offsetY: 0, rotate, texture: { getImage: () => ({ width: 1024, height: 512 }) } },
      regionUVs: [.2, .3, .8, .9] };
    restoreMeshUVs(mesh);
    for (let i = 0; i < 4; i += 2) {
      const u = mesh.regionUVs[i], v = mesh.regionUVs[i + 1];
      near(mesh.uvs[i], (100 + (rotate ? v * 40 : u * 80)) / 1024);
      near(mesh.uvs[i + 1], (200 + (rotate ? (1 - u) * 80 : v * 40)) / 512);
    }
  }
});
