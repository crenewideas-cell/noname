import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import extension from '../../apps/core/extension/分支武将/extension.js';
import {packs,reservedSkills,reservedCharacters} from '../../apps/core/extension/分支武将/catalog.js';
import installed from '../../apps/core/game/organized-extensions.json';

function fixture() {
 const lib:any={config:{},filter:{},skill:Object.fromEntries([...reservedSkills].map(id=>[id,{existing:id}])),character:{},card:{},translate:{},dynamicTranslate:{}};
 return {lib, create:()=>extension(lib,{}, {},{mode:()=> 'identity',translation:x=>x},{},{})};
}
test('every branch character is either reserved in the original project or present in the additive pack',()=>{
 const {lib,create}=fixture();const pack=create();pack.content();
 const chars=pack.package.character.character;
 const expected=new Set(packs.flatMap(p=>p.characters).filter(id=>!reservedCharacters.has(id)));
 assert.equal(new Set(packs.flatMap(p=>p.characters)).size,2449);
 assert.equal(expected.size,855);
 assert.deepEqual(new Set(Object.keys(chars)),expected);
 assert.deepEqual(new Set(installed.find(p=>p.name==='分支武将')!.characters),expected);
 assert.equal(Object.keys(lib.branchCharacterAudit.characters).length,855);
 assert.equal(Object.values(lib.branchCharacterAudit.characters).filter((x:any)=>x.npc).length,648);
});
test('existing character, skill, translation and configuration identities survive the merge',()=>{
 const {lib,create}=fixture();lib.character.app_liuling={existing:true};lib.translate.app_simayi='current name';lib.config.extension_分支武将_enable=false;
 const before={characters:{...lib.character},skills:{...lib.skill},translations:{...lib.translate},config:{...lib.config}};
 const pack=create();pack.content();
 assert.deepEqual(lib.character,before.characters);assert.deepEqual(lib.skill,before.skills);assert.deepEqual(lib.translate,before.translations);assert.deepEqual(lib.config,before.config);
 assert.ok(!('app_liuling' in pack.package.character.character));assert.ok(!('app_simayi' in pack.package.character.translate));
 assert.ok(Object.keys(pack.package.skill.skill).every(id=>!reservedSkills.has(id)));
});
test('NPCs stay out of ordinary matches and missing skills never become empty placeholders',()=>{
 const {lib,create}=fixture();const pack=create();pack.content();Object.assign(lib.skill,pack.package.skill.skill);
 for(const [id,record] of Object.entries(lib.branchCharacterAudit.characters) as [string,any][]){
  if(record.npc)assert.equal(pack.package.character.characterFilter[id](),false,id);
 }
 assert.equal(pack.package.character.characterFilter.xk_fujianhan(),false);
 assert.equal(lib.skill.zuijian,undefined);
 lib.skill.zuijian={realImplementation:true};assert.equal(pack.package.character.characterFilter.xk_fujianhan(),true);
});
test('all recorded branch assets exist with their source SHA-256 hash',()=>{
 const root=path.resolve('apps/core');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'extension/分支武将/assets-manifest.json'),'utf8'));
 for(const item of manifest){
  const destination=path.resolve(root,item.target);assert.ok(!path.relative(root,destination).startsWith('..'));
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(destination)).digest('hex'),item.sha256,item.target);
 }
});
