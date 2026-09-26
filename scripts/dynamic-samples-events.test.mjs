import test from 'node:test';
import assert from 'node:assert/strict';
import {eventMotions} from '../apps/core/noname/skin/localDynamic/events.js';

test('dedicated stage motions take precedence over generic actions',()=>{
 const map=eventMotions({events:{attack:'slash'},motions:['action','slash','Respond','Skill','Enter','Dead','Kill']});
 assert.equal(map.card,'slash');assert.equal(map.respond,'Respond');
 assert.equal(map.death,'Dead');assert.equal(map.kill,'Kill');
});
test('a skin without death assets never substitutes a kill or touch animation',()=>{
 const map=eventMotions({motions:['Idle','Kill','touch_special','touch_drag1','main_1','main_2','main_3','login']});
 assert.equal(map.death,undefined);assert.equal(map.damage,undefined);
 assert.equal(map.card,'main_1');assert.equal(map.respond,'main_2');assert.equal(map.skill,'main_3');assert.equal(map.enter,'login');
});
test('runtime-discovered Spine motions work even when absent from the catalog',()=>{
 const map=eventMotions({events:{death:'missing'}},['normal','attack','skill','dead','victory']);
 assert.equal(map.death,'dead');assert.equal(map.kill,'victory');assert.equal(map.card,'attack');
 assert.ok(Object.values(map).every(m=>['normal','attack','skill','dead','victory'].includes(m)));
});
test('idle-only models do not fabricate stage responses',()=>{
 assert.deepEqual(eventMotions({motions:['idle_1']}),{});
});
