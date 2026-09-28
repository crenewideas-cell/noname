import test from 'node:test';
import assert from 'node:assert/strict';
import {spine} from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';
import {createLegacyParser} from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';

// Minimal 3.6 binary from the published field layout: one slot, a triangle
// mesh, and two linked meshes with opposite serialized deform flags.
function fixture(){
 const bytes=[];const byte=n=>bytes.push(n&255),int=n=>{do{let b=n&127;n>>>=7;byte(n?b|128:b);}while(n);};
 const float=n=>{const b=Buffer.alloc(4);b.writeFloatBE(n);bytes.push(...b);};
 const string=s=>{if(s==null)return int(0);const b=Buffer.from(s);int(b.length+1);bytes.push(...b);};
 const color=()=>bytes.push(255,255,255,255);
 string(null);string('3.6.38');float(2);float(2);byte(0);
 int(1);string('root');for(const n of [0,0,0,1,1,0,0,0])float(n);int(0);
 int(1);string('slot');int(0);color();color();string('inherit');int(0);
 int(0);int(0);int(0);
 int(1);int(0);int(3);
 string('parent');string(null);byte(2);string(null);color();int(3);
 for(const n of [0,0,1,0,0,1])float(n);
 int(3);for(const n of [0,1,2])bytes.push(0,n);
 byte(0);for(const n of [0,0,2,0,0,2])float(n);int(3);
 for(const [name,inherit] of [['inherit',true],['independent',false]]){string(name);string(null);byte(3);string(null);color();string(null);string('parent');byte(inherit?1:0);}
 int(0);int(0);int(0);return new Uint8Array(bytes);
}
test('binary linked meshes inherit parent deformation only when the source flag is true',()=>{
 const texture={setFilters(){},setWraps(){},getImage(){return{width:4,height:4};}};
 const atlas=new spine.TextureAtlas('\npage.png\nsize: 4,4\nformat: RGBA8888\nfilter: Linear,Linear\nrepeat: none\n'+['parent','inherit','independent'].map(n=>n+'\n  rotate: false\n  xy: 0, 0\n  size: 2, 2\n  orig: 2, 2\n  offset: 0, 0\n  index: -1\n').join(''),()=>texture);
 const original=spine.MeshAttachment.prototype.applyDeform;
 const data=createLegacyParser(spine,atlas,{skeleton:'fixture.skel',version:'3.6.38'}).readSkeletonData(fixture());
 const rig=new spine.Skeleton(data),timeline=new spine.DeformTimeline(1);
 timeline.slotIndex=0;timeline.attachment=data.defaultSkin.getAttachment(0,'parent');timeline.setFrame(0,0,new Float32Array([10,0,12,0,10,2]));
 for(const [name,x] of [['inherit',10],['independent',0],['parent',10]]){
  rig.setAttachment('slot',name);timeline.apply(rig,0,0,null,1,spine.MixPose.setup,spine.MixDirection.in);rig.updateWorldTransform();
  const output=new Float32Array(6);rig.slots[0].attachment.computeWorldVertices(rig.slots[0],0,6,output,0,2);assert.equal(output[0],x,name);
 }
 assert.equal(spine.MeshAttachment.prototype.applyDeform,original,'shared renderer prototype remains untouched');
});
