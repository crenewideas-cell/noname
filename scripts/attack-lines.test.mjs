import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {renderAttackLine,clearAttackLines} from '../apps/core/noname/ui/attackLines.js';
import {builtinPacks} from '../apps/core/noname/ui/workshop/presets.js';
import {validateManifest} from '../apps/core/noname/ui/workshop/schema.js';

function fixture(){
 const nodes=[],parent={appendChild(node){nodes.push(node);node.parentNode=this;}};
 globalThis.document={createElement(){return {style:{},dataset:{},animations:[],setAttribute(){},remove(){this.removed=true;},animate(keyframes,options){
  let resolve,reject;const finished=new Promise((yes,no)=>{resolve=yes;reject=no;});
  const animation={keyframes,options,finished,finish:resolve,cancel(){this.cancelled=true;reject(new Error('cancelled'));}};
  this.animations.push(animation);return animation;
 }}}};
 return {nodes,parent};
}
test('original resources retain exact SHA-256 and all choices validate as workshop settings',async()=>{
 const source=JSON.parse(await fs.readFile('apps/core/image/pointer/migrated/SOURCE.json','utf8'));
 assert.equal(source.resources.length,3);
 for(const row of source.resources)assert.equal(crypto.createHash('sha256').update(await fs.readFile('apps/core/'+row.file)).digest('hex'),row.sha256);
 const manifest=builtinPacks().find(p=>p.manifest.id==='builtin-shousha-standard').manifest;
 assert.equal(manifest.components.lines.settings.zhishixian,'Liuli');
 for(const style of ['Liuli','ZipYulong','ZipJingdian','ZipBaoji','default']){
  const copy=structuredClone(manifest);copy.components.lines.settings.zhishixian=style;validateManifest(copy);
 }
});
test('saved Liuli option renders the reference gold artwork, never the old pink primitive',async()=>{
 const {parent}=fixture();const node=renderAttackLine({style:'Liuli',path:[200,150,500,150],parent});
 assert.equal(node.style.width,'302px');assert.equal(node.style.height,'60px');assert.equal(node.style.top,'120px');
 assert.ok(node.style.background.includes('yulongLineXy/line.png'));
 assert.equal(node.animations[0].options.duration,1400);assert.equal(node.animations[0].keyframes[1].offset,50/1400);
 for(const animation of node.animations)animation.finish();await new Promise(r=>setImmediate(r));assert.equal(node.removed,true);
});
test('ZIP artwork preserves dimensions, extension/retraction timing, direction and shared cleanup',async()=>{
 const {parent}=fixture();
 for(const [style,height,folder] of [['ZipYulong',50,'yulongLineXy'],['ZipJingdian',60,'jingdianLineXy'],['ZipBaoji',60,'baojilinexy']]){
  const node=renderAttackLine({style,path:[100,200,100,100],parent,assetURL:'/game/'});
  assert.equal(node.style.height,height+'px');assert.equal(node.style.width,'102px');assert.equal(node.style.top,'170px');
  assert.ok(node.style.background.includes('/game/image/pointer/migrated/'+folder+'/line.png'));
  assert.equal(node.animations[0].keyframes[1].offset,50/1400);assert.equal(node.animations[0].options.duration,1400);
  assert.ok(node.animations[0].keyframes[2].transform.startsWith('rotate(-90deg)'));
  clearAttackLines();assert.ok(node.removed);assert.ok(node.animations.every(a=>a.cancelled));
 }
 await new Promise(r=>setImmediate(r));
});
test('zero-length / invalid paths allocate nothing, same-style multitarget coexists, switching clears old lines',async()=>{
 const {nodes,parent}=fixture();
 for(const path of [[0,0,0,0],[0,0,NaN,4],[0,0,Infinity,4],[0]])assert.equal(renderAttackLine({style:'Liuli',path,parent}),null);
 assert.equal(nodes.length,0);
 const a=renderAttackLine({style:'Liuli',path:[0,0,40,50],parent}),b=renderAttackLine({style:'Liuli',path:[0,0,60,80],parent});
 assert.ok(!a.removed&&!b.removed);
 const c=renderAttackLine({style:'ZipYulong',path:[0,0,40,50],parent,duration:2000,opacity:.4});
 assert.ok(a.removed&&b.removed&&!c.removed);assert.equal(c.animations[0].options.duration,2000);assert.equal(c.style.opacity,'.4'.replace(/^\./,'0.'));
 clearAttackLines();await new Promise(r=>setImmediate(r));delete globalThis.document;
});
