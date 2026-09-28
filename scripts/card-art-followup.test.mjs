import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import sharp from 'sharp';
import { compressCardArt, CARD_ART_LIMITS } from './compress-card-art.mjs';
import { createCardPageCache } from '../apps/core/noname/ui/cardPackGallery.js';
import { createMergedExtension } from '../apps/core/extension/_merge.js';

test('card compressor limits dimensions/bytes, retains alpha, never crops or overwrites source', async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'noname-card-art-'));
 try {
  const input=path.join(directory,'input.png'),output=path.join(directory,'output.webp');
  await sharp({create:{width:1600,height:2400,channels:4,background:{r:180,g:90,b:45,alpha:0.5}}}).png().toFile(input);
  const original=await fs.readFile(input), result=await compressCardArt(input,output), encoded=await fs.readFile(output), metadata=await sharp(encoded).metadata();
  assert.deepEqual([metadata.width,metadata.height],[512,768]);assert.equal(metadata.hasAlpha,true);
  const pixel=await sharp(encoded).raw().toBuffer();assert.ok(pixel[3]>120&&pixel[3]<135);
  assert.ok(result.bytes<=CARD_ART_LIMITS.maxBytes);assert.deepEqual(await fs.readFile(input),original);
  await compressCardArt(input,output); // same input is safe to rerun
  await assert.rejects(compressCardArt(input,input),/必须不同/);
 } finally {
  const resolved=path.resolve(directory),temporaryRoot=path.resolve(os.tmpdir())+path.sep;
  assert.ok(resolved.startsWith(temporaryRoot)&&path.basename(resolved).startsWith('noname-card-art-'));
  await fs.rm(resolved,{recursive:true,force:true});
 }
});

test('all generated runtime card assets are compressed and decodable',async()=>{
 for(const file of ['docs/card-art-compression-20260927.json','docs/card-art-honglou-qingyao-20260927.json']) {
  const {images}=JSON.parse(await fs.readFile(file,'utf8'));
  for(const item of images){const bytes=await fs.readFile(item.dest),meta=await sharp(bytes).metadata();
   assert.equal(meta.format,'webp',item.id);assert.ok(bytes.length<=CARD_ART_LIMITS.maxBytes,item.id);
   assert.ok(meta.width<=512&&meta.height<=768,item.id);
  }
 }
});

test('visiting many card packs evicts old pages and revisiting preserves the cache bound',()=>{
 const removed=[];const cache=createCardPageCache(node=>removed.push(node.id));
 const pages=Array.from({length:25},(_,id)=>({id}));
 for(const page of pages)cache.use(page);
 assert.deepEqual(removed,Array.from({length:22},(_,i)=>i));
 cache.use(pages[22]);cache.use(pages[0]);assert.equal(removed.at(-1),23);
});

test('merged fullskin cards retain their member resource directory',async()=>{
 const lib={config:{},card:{},skill:{},character:{}},game={};
 const ext=await createMergedExtension('集合',['成员'],[lib,game],import.meta.url,async()=>({default:()=>({package:{card:{card:{implicit:{fullskin:true},explicit:{fullskin:true,image:'ext:other/custom.webp'}},translate:{},list:[]}}})}));
 await ext.content({},ext.package);
 assert.equal(ext.package.card.card.implicit.image,'ext:集合/members/成员/implicit.png');
 assert.equal(ext.package.card.card.explicit.image,'ext:other/custom.webp');
});

test('赦过宥罪 uses the preparation-phase actor without a target-selection result',async()=>{
 const source=(await fs.readFile('apps/core/extension/packs/怒焰三国/js/lib/skill/strategy.js','utf8')).replace(/^import .*?;\s*/,'').replace('export default skills;','skills;');
 const skills=vm.runInNewContext(source,{lib:{},game:{},ui:{},get:{},ai:{},_status:{}});
 const skill=skills.nysgs_zf_sheguoyouzui;
 for(const abnormal of [false,true]) {
  const calls=[];const player={logSkill(name,target){calls.push(['log',name,target]);}};
  const target={countCards(){return 2;},async chooseToGive(...args){calls.push(['give',...args]);},nysgsHasStatusEffect(){return abnormal;},nysgsrefreshCharacter(){calls.push(['refresh']);}};
  assert.equal(skill.filter({player},player),false);assert.equal(skill.filter({player:target},player),2);
  // Exact failure shape: event.targets is absent in a normal trigger event.
  await skill.content({name:'nysgs_zf_sheguoyouzui'},{player:target},player);
  assert.equal(calls[0][2],target);assert.deepEqual(calls[1],['give',player,2,true]);
  assert.equal(calls.some(c=>c[0]==='refresh'),abnormal);
 }
});
