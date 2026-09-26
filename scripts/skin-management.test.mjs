import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createSkinManagement, managedPortrait, skinEnabled} from '../apps/core/noname/skin/management.js';
import {migrateKeySkinManagement} from '../apps/core/noname/skin/keyMigration.js';

const sets=[{id:'new',name:'新',entries:{a:{name:'新',path:'image/new.jpg',variants:{a_form:'image/form.jpg'}},b:{name:'新',path:'image/b.jpg'}}},{id:'old',name:'旧',entries:{a:{name:'旧',path:'image/old.jpg',variants:{a_form:'image/old-form.jpg'}}}}];
function setup(extra={}){const config={skin:{a:['个人','image/personal.jpg']}};let saves=0;const manager=createSkinManagement({config:()=>config,save:async()=>{saves++;},sets,...extra});return {config,manager,saves:()=>saves};}
test('whole sets switch atomically, forms follow, unrelated selections survive and disabling retains choice',async()=>{
 const {config,manager,saves}=setup();await manager.applySet('new');
 assert.equal(saves(),1);assert.equal(managedPortrait(config,'a'),'image/new.jpg');assert.equal(managedPortrait(config,'a_form'),'image/form.jpg');
 await manager.setEnabled(['a'],'static',false);assert.equal(managedPortrait(config,'a'),null);
 await manager.setEnabled(['a'],'static',true);assert.equal(managedPortrait(config,'a'),'image/new.jpg');
 await manager.applySet('old',['a']);assert.equal(managedPortrait(config,'a_form'),'image/old-form.jpg');assert.equal(managedPortrait(config,'b'),'image/b.jpg');
 await manager.clear(['a','a_form']);assert.equal(managedPortrait(config,'a'),'image/personal.jpg');
});
test('unloadable image or failed persistence never partially applies a set',async()=>{
 for(const extra of [{exists:async path=>!path.includes('b.jpg')},{save:async()=>{throw Error('disk full');}}]){
  const {manager,config}=setup(extra);await assert.rejects(manager.applySet('new'));assert.equal(config.skin_management,undefined);assert.equal(managedPortrait(config,'a'),'image/personal.jpg');
 }
});
test('concurrent settings writes compose; dynamic and individual skin switches stay independent',async()=>{
 const {manager,config}=setup();await Promise.all([manager.setEnabled(['a'],'dynamic',false),manager.setSkinsEnabled('a',['image/personal.jpg'],false)]);
 assert.equal(skinEnabled(config,'a','dynamic'),false);assert.equal(managedPortrait(config,'a'),null);
 await manager.setSkinsEnabled('a',['image/personal.jpg'],true);assert.equal(managedPortrait(config,'a'),'image/personal.jpg');assert.equal(skinEnabled(config,'a','dynamic'),false);
});
test('saved custom sets and classic choices survive reload',async()=>{
 const {manager,config}=setup();const id=await manager.savePreset('我的搭配','扩展',{a:{classic:true,name:'经典'},b:{name:'动皮',path:'image/preview.png',token:'本地 · 动皮.png',dynamic:true}});
 const reloaded=createSkinManagement({config:()=>config,save:async()=>{},sets});await reloaded.applySet(id);assert.equal(managedPortrait(config,'a'),null);assert.equal(config.skin_management.selections.a.token,null);assert.equal(config.skin_management.selections.b.token,'本地 · 动皮.png');
});
test('individual set disabling also disables and restores its form artwork',async()=>{
 const {manager,config}=setup();await manager.applySet('new',['a']);await manager.setSkinsEnabled('a',['套装 · new.jpg'],false);
 assert.equal(managedPortrait(config,'a'),null);assert.equal(managedPortrait(config,'a_form'),null);
 await manager.setSkinsEnabled('a',['套装 · new.jpg'],true);assert.equal(managedPortrait(config,'a_form'),'image/form.jpg');
});
test('Qingshan assignments keep the exact eight originals, unique random sources, existing old/new images and all forms',async()=>{
 const root='apps/core/extension/packs/怒焰三国',manifest=JSON.parse(await fs.readFile(root+'/image/skin-sets/manifest.json','utf8'));
 assert.equal(manifest.allocations.length,50);assert.equal(manifest.femaleCharacters,56);assert.equal(manifest.randomAssigned,42);assert.equal(manifest.remainingSourceCount,178);
 const fixed=manifest.allocations.filter(row=>!row.random);assert.equal(fixed.length,8);
 assert.deepEqual(fixed.map(row=>row.source).sort(),['canghaiyizhu.jpg','nysgs_BuLianShi.jpg','nysgs_CaiFuRen.jpg','nysgs_DongXie.jpg','nysgs_shen_zhenji.jpg','nysgs_XinXianYing.jpg','nysgs_ZhenJi.jpg','nysgs_ZhenJi_shadow.jpg'].sort());
 const hash=data=>createHash('sha256').update(data).digest('hex');const hashes=new Set();
 for(const row of manifest.allocations){
  const bytes=await fs.readFile(root+'/image/skin-sets/'+row.destination);assert.equal(hash(bytes),row.sha256);
  if(!row.random)assert.equal(hash(await fs.readFile(root+'/image/character/'+row.source)),row.sha256);
  else {assert.ok(!hashes.has(row.sha256));hashes.add(row.sha256);}
  if(row.originalDestination)assert.equal(hash(await fs.readFile(root+'/'+row.originalDestination)),row.sha256);
 }
 for(const set of manifest.sets)for(const entry of Object.values(set.entries))for(const resource of [entry.path,...Object.values(entry.variants||{})])await fs.access(path.join('apps/core',resource.replace('extension/怒焰三国/','extension/packs/怒焰三国/')));
 const current=manifest.sets.find(set=>set.id==='nuyan-qingshan');assert.ok(current.entries.nysgs_zhenji.variants.nysgs_zhenji_shadow);assert.equal(current.entries.nysgs_caifuren.path,current.entries.nysgs_jie_caifuren.path);
 for(const id of ['nysgs_yangwan','nysgs_malingli','nysgs_huan_sunshangxiang','nysgs_zhurong'])assert.ok(current.entries[id]);
 assert.equal(current.entries.nysgs_zhurong.path,current.entries.nysgs_jie_zhurong.path);
});
test('Key studio filenames map uniquely to the correct characters, normalize Chinese variants and preserve original bytes',async()=>{
 const manifest=JSON.parse(await fs.readFile('apps/core/extension/packs/键社/image/skin-sets/manifest.json','utf8'));
 const expected={'春原阳平&春原芽衣':'key_sunohara','此花露西娅':'key_lucia','冈崎朋也':'key_tomoya','宫泽有纪宁':'key_yukine','古河渚':'key_nagisa','国崎往人':'key_yukito','加藤うみ':'key_umi','美坂栞':'key_shiori','美坂香里':'key_kaori','七瀬留美':'key_rumi','神尾观铃':'key_misuzu','神尾晴子':'key_haruko','水瀬秋子':'key_akiko','雾岛佳乃':'key_kano','鹰原羽未':'key_umi2','远野美凪':'key_minagi','远野小满':'key_michiru','枣恭介':'key_kyousuke','仲村由理':'key_yuri'};
 assert.deepEqual(Object.fromEntries(manifest.allocations.map(row=>[row.sourceName,row.character])),expected);
 assert.equal(new Set(manifest.allocations.map(row=>row.character)).size,19);
 for(const row of manifest.allocations)for(const [file,expectedHash] of [[row.destination,row.sha256],[row.originalDestination,row.originalSha256]]){const bytes=await fs.readFile('apps/core/extension/packs/键社/image/skin-sets/'+file);assert.equal(createHash('sha256').update(bytes).digest('hex'),expectedHash);}
 for(const set of manifest.sets)for(const entry of Object.values(set.entries))for(const file of [entry.path,...Object.values(entry.variants||{})]){assert.ok(file.startsWith('extension/键社/image/skin-sets/'));await fs.access('apps/core/'+file.replace('extension/键社/','extension/packs/键社/'));}
 const set=manifest.sets.find(set=>set.id==='key-key-studio');assert.equal(set.name,'键社 · 键社新装');assert.equal(set.entries.key_umi.variants.key_umi2,set.entries.key_umi2.path);
 assert.equal(manifest.characters.key_umi.displayName,'加藤羽未');
 const {config}=setup();const manager=createSkinManagement({config:()=>config,save:async()=>{},sets:manifest.sets});
 await manager.applySet(set.id,['key_umi']);assert.equal(managedPortrait(config,'key_umi2'),set.entries.key_umi2.path);
 await manager.applySet('key-original',['key_umi']);assert.equal(managedPortrait(config,'key_umi2'),'extension/键社/image/skin-sets/original/key_umi2.jpg');
});
test('legacy Key selections, disabled resources and custom presets migrate without changing IDs or other packs',async()=>{
 const old={selections:{key_lucia:{set:'key-key-studio',path:'image/skin-sets/key/key_lucia.jpg'},key_umi:{set:'key-original',path:'image/character/key_umi.jpg',variants:{key_umi2:'image/character/key_umi.jpg'}},nysgs_yangwan:{path:'extension/怒焰三国/image/character/nysgs_yangwan.jpg'}},hidden:{key_lucia:{'image/skin-sets/key/key_lucia.jpg':true}},presets:[{id:'custom',name:'二次元 · 我的搭配',pack:'二次元',entries:{key_lucia:{path:'image/skin-sets/key/key_lucia.jpg'}}}]};
 const next=migrateKeySkinManagement(old);assert.equal(next.selections.key_lucia.path,'extension/键社/image/skin-sets/new/key_lucia.jpg');assert.equal(next.selections.key_umi.variants.key_umi2,'extension/键社/image/skin-sets/original/key_umi2.jpg');assert.deepEqual(next.selections.nysgs_yangwan,old.selections.nysgs_yangwan);
 assert.equal(next.hidden.key_lucia[next.selections.key_lucia.path],true);assert.equal(next.presets[0].pack,'键社');assert.equal(next.presets[0].name,'键社 · 我的搭配');assert.equal(next.presets[0].id,'custom');assert.match(old.selections.key_lucia.path,/^image\//);
 assert.deepEqual(migrateKeySkinManagement(next),next);
 const {manager,config}=setup();config.skin_management=old;await manager.migrate(migrateKeySkinManagement);assert.equal(config.skin_management.selections.key_lucia.path,next.selections.key_lucia.path);
});
test('exported Key extension uses the same manifest and idempotent registration service',async()=>{
 const manifest=JSON.parse(await fs.readFile('apps/core/extension/packs/键社/image/skin-sets/manifest.json','utf8'));
 const {manager}=setup();manager.registerSets(manifest.sets);manager.registerSets(manifest.sets);
 assert.equal(manager.listSets().filter(set=>set.pack==='键社').length,2);
 const source=await fs.readFile('apps/core/extension/packs/键社/extension.js','utf8');assert.match(source,/registerSets\(manifest.sets\)/);
 const info=JSON.parse(await fs.readFile('apps/core/extension/packs/键社/info.json','utf8'));assert.equal(info.name,'键社');
});
