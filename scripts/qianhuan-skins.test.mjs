import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {qianhuanSkins} from '../apps/core/noname/skin/qianhuan/catalog.js';
import {skinFiles,skinSharing} from '../apps/core/noname/skin/qianhuan/catalog-data.js';
import {getCurrentSkin,skinCards,skinName,sharedCharacters} from '../apps/core/noname/skin/qianhuan/model.js';
import {createSkinService} from '../apps/core/noname/skin/service.js';
test('migrated catalogue references shipped static images, never texture atlases',()=>{
 let images=0;
 for(const id of Object.keys(skinFiles))for(const entry of qianhuanSkins(id)){
  const url=new URL('../apps/core/'+entry.path.replace('extension/手杀标准UI/','extension/ui/手杀标准UI/'),import.meta.url);
  assert.ok(fs.existsSync(url),entry.path);
  assert.equal(fs.existsSync(new URL(url.href.replace(/\.[^.]+$/,'.atlas'))),false,entry.path);
  images++;
 }
 assert.ok(images>=728);
});
test('explicit sharing supports base/re variants and terminates cycles without guessing prefixes',()=>{
 assert.ok(qianhuanSkins('caocao').some(entry=>entry.path.includes('/re_caocao/')));
 assert.deepEqual(qianhuanSkins('nonexistent_caocao'),[]);
 assert.deepEqual(sharedCharacters('a',{a:'b',b:'a'}),['a','b']);
 assert.ok(Object.keys(skinSharing).length>0);
 assert.ok(qianhuanSkins('caocao','ui-skins').every(entry=>entry.path.startsWith('ui-skins/')));
});
test('classic-first skin cards retain explicit selection and dotted filenames',()=>{
 const entries=[{id:'a',path:'a.jpg',name:'甲'},{id:'b',path:'b.jpg',name:'乙'}];
 const cards=skinCards(entries);
 assert.equal(cards[0].skinId,null);
 assert.equal(getCurrentSkin(cards,'b').name,'乙');
 assert.equal(getCurrentSkin(cards,null).name,'经典形象');
 assert.equal(getCurrentSkin(cards,'missing'),null);
 assert.equal(skinName('春.新.webp'),'春.新');
});
test('Qianhuan application uses core persistence; failure does not notify or overwrite another character',async()=>{
 const config={skin:{other:['旧','image/other.jpg']},change_skin:true};let fail=false,refresh=0;
 const store=createSkinService({config:()=>config,save:async()=>{if(fail)throw Error('disk full');},directory:()=>null,exists:async()=>true,refresh:()=>refresh++});
 store.register('qhly',qianhuanSkins);
 const choice=(await store.list('caocao')).skins[0];
 await store.apply('caocao',choice.id);assert.equal(store.current('caocao'),choice.path);assert.equal(refresh,1);
 fail=true;await assert.rejects(store.apply('caocao',null),/disk full/);assert.equal(store.current('caocao'),choice.path);assert.equal(refresh,1);
 fail=false;await store.apply('caocao',null);assert.equal(store.current('caocao'),null);assert.equal(refresh,2);assert.deepEqual(config.skin.other,['旧','image/other.jpg']);
});
