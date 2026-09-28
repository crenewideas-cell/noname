import test from 'node:test';import assert from 'node:assert/strict';
import {primaryCapabilities,eventMotions} from '../apps/core/noname/skin/localDynamic/runtime/motion-catalog.js';
import {subjectBounds} from '../apps/core/noname/skin/localDynamic/runtime/composition.js';
test('primary interaction and entrance never select a background or idle loop',()=>{
 const c=primaryCapabilities({},[{idle:'BeiJing',motions:['BeiJing','BGTeShu']},{idle:'DaiJi',motions:['DaiJi','ChuChang','TeShu','GongJi']}]);
 assert.deepEqual(c.events,{enter:'ChuChang',card:'GongJi',attack:'GongJi',skill:'TeShu'});assert.deepEqual(c.interaction.motions,['TeShu','GongJi','ChuChang']);
});
test('idle-only sources expose no nonfunctional interaction',()=>{
 assert.equal(primaryCapabilities({},[{idle:'play',motions:['play']}]).interaction.available,false);
});
test('foreground effects cannot replace the declared Ren character capability',()=>{
 const c=primaryCapabilities({events:{kill:'Kill'}},[{role:'BgBack',idle:'Idle',motions:['Idle']},{role:'Ren',idle:'Idle',motions:['Idle','Enter','Attack']},{role:'BgFront',idle:'Idle',motions:['Idle']},{role:'VxFront',effectOnly:true,idle:'Idle',motions:['Idle','Kill']}]);
 assert.equal(c.events.enter,'Enter');assert.equal(c.events.attack,'Attack');assert.equal(c.events.kill,'Kill');
});
test('verified separate action metadata enables events without replacing idle scene',()=>{
 const entry={actionScene:{actionContract:{records:[{status:'candidate',command:'source:chuchang'},{status:'candidate',command:'source:gongji'},{status:'unsupported',command:'source:teshu'}]}}};
 const c=primaryCapabilities(entry,[{idle:'play',motions:['play']}]);assert.equal(c.events.enter,'source:chuchang');assert.equal(c.events.attack,'source:gongji');assert.ok(!c.interaction.motions.includes('source:teshu'));assert.equal(entry.scene,undefined);
});
test('explicit event names win over aliases',()=>assert.equal(eventMotions({events:{attack:'alternate'}},['GongJi','alternate']).attack,'alternate'));
test('Jineng is a skill clip; an attack-only rig does not fabricate a skill',()=>{
 assert.equal(eventMotions({},['DaiJi','Jineng','GongJi']).skill,'Jineng');
 assert.equal(eventMotions({},['DaiJi','GongJi']).skill,undefined);
});
const slot=(name,x=0)=>({data:{name},color:{a:1},bone:{},attachment:{name,region:{},worldVerticesLength:8,computeWorldVertices(_s,_a,_b,v){v.set([x,0,x+10,0,x+10,10,x,10]);}}});
test('export-prefixed curtains do not masquerade as faces',()=>{
 const s={slots:[slot('scene_lian_1',-100),slot('scene_lian_2',100),...Array.from({length:10},(_,i)=>slot('scene_body_'+i))]};
 assert.equal(subjectBounds(s,{},true),undefined);
 s.slots.push(slot('scene_toufa'),slot('scene_eye'));assert.ok(subjectBounds(s,{},true)?.width);
});
