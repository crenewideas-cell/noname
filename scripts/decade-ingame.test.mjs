import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {decadeManifest,mixIngame,INGAME_PARTS} from '../apps/core/noname/ui/workshop/ingame.js';
import {validateManifest,validateRecord} from '../apps/core/noname/ui/workshop/schema.js';
import {builtinPacks} from '../apps/core/noname/ui/workshop/presets.js';
import {PROVIDER_PROGRAMS,isProviderFile} from '../apps/core/noname/ui/workshop/providerFiles.js';
const root=path.resolve('apps/core/extension/ui/十周年局内UI');
test('display randomness never consumes or changes the gameplay random stream',async()=>{
 const {createDisplayRandom,displayChoice}=await import('../apps/core/noname/util/displayRandom.js');
 const original=Math.random;let calls=0;
 try{Math.random=()=>{calls++;return .5;};const a=createDisplayRandom(123),b=createDisplayRandom(123);for(let i=0;i<1000;i++){const x=a();assert.equal(x,b());assert.ok(x>=0&&x<1);}assert.equal(displayChoice(['a','b'],'a'),'b');assert.equal(displayChoice([]),undefined);assert.equal(calls,0);}finally{Math.random=original;}
});
test('one in-game choice preserves the lobby, overrides and serialized preferences',()=>{
 const pack=builtinPacks().find(p=>p.manifest.id==='builtin-rzsh'),home=structuredClone(pack.manifest.components.home);
 pack.manifest.components.cards={assets:{texture:'assets/test.png'},style:{color:'#ffeeaa'}};pack.assets['assets/test.png']=new Blob(['test'],{type:'image/png'});
 mixIngame(pack,{manifest:decadeManifest,assets:{}});assert.deepEqual(pack.manifest.components.home,home);
 assert.ok(INGAME_PARTS.every(id=>pack.manifest.components[id].runtime==='decade'));
 pack.manifest.components.arena.options={effects:false,sound:false,dynamic:false};
 const copy=validateRecord(pack);assert.deepEqual(copy.manifest.components.arena.options,{effects:false,sound:false,dynamic:false});
 assert.equal(copy.manifest.components.cards.assets.texture,'assets/test.png');assert.equal(copy.assets['assets/test.png'].size,4);
});
test('the plan cannot carry rule settings, executable fields or lobby runtime',()=>{
 for(const change of [m=>m.components.arena.settings.player_number='4',m=>m.components.arena.options.skill='x',m=>m.components.home={runtime:'decade'},m=>m.components.arena.options.effects='false']){
  const manifest=structuredClone(decadeManifest);change(manifest);assert.throws(()=>validateManifest(manifest));
 }
});
test('every inventory resource exists, media provenance hashes match, skeleton pages close',async()=>{
 const files=JSON.parse(await fs.readFile(path.join(root,'files.json'),'utf8'));
 const disk=(await fs.readdir(root,{recursive:true,withFileTypes:true})).filter(e=>e.isFile()).map(e=>path.relative(root,path.join(e.parentPath,e.name)).replaceAll('\\','/')).filter(f=>f!=='files.json').sort();
 assert.deepEqual(files,disk);assert.ok(files.every(f=>isProviderFile('十周年局内UI',f)));
 const source=JSON.parse(await fs.readFile(path.join(root,'SOURCE.json'),'utf8'));
 for(const item of source.resources){const data=await fs.readFile(path.join(root,item.file));assert.equal(data.length,item.bytes,item.file);assert.equal(createHash('sha256').update(data).digest('hex'),item.sha256,item.file);}
 for(const file of files.filter(f=>f.endsWith('.atlas'))){const lines=(await fs.readFile(path.join(root,file),'utf8')).split(/\r?\n/);for(let i=0;i<lines.length;i++)if((i===0||!lines[i-1].trim())&&/\.(png|jpg)$/.test(lines[i]))assert.ok(files.includes(path.posix.join(path.posix.dirname(file),lines[i].trim())),file+': '+lines[i]);}
 for(const file of PROVIDER_PROGRAMS['十周年局内UI'])if(file!=='vendor/spine.js')assert.doesNotMatch(await fs.readFile(path.join(root,file),'utf8'),/game\.(?:import|check|uncheck|over|broadcastAll)\s*\(|lib\.skill\s*\[|lib\.element|\beval\s*\(|new Function\s*\(|(?:\.\.\/|\\)temp[\\/]/,file);
 assert.doesNotMatch(await fs.readFile(path.join(root,'vendor/spine.js'),'utf8'),/Math\.random\s*\(/,'rendering must not consume the game random stream');
});
