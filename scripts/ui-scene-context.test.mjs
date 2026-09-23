import test from 'node:test';
import assert from 'node:assert/strict';
import {copySceneData} from '../apps/core/noname/ui/workshop/sceneContext.js';

test('scene metadata copy never evaluates dynamic translations or accessor probes', () => {
 let reads=0;
 const metadata={translate:{stable:'杀',get qingsuan(){reads++;throw new Error('gameplay accessor');}},get sex(){reads++;return 'male';}};
 metadata.self=metadata;
 const copy=copySceneData(metadata);
 assert.equal(reads,0);
 assert.equal(copy.translate.stable,'杀');
 assert.equal(Object.hasOwn(copy.translate,'qingsuan'),false);
 assert.equal(copy.self,copy);
 copy.translate.stable='changed';
 assert.equal(metadata.translate.stable,'杀');
});

test('scene portrait compatibility retains legacy character indices as detached data', () => {
 class PortraitMetadata {
  sex='male';skills=['rende'];
  get 0(){return this.sex;}
  get 3(){return this.skills;}
 }
 const original=new PortraitMetadata(),copy=copySceneData(original);
 assert.equal(copy[0],'male');
 assert.deepEqual(copy[3],['rende']);
 copy[3].push('test');
 assert.deepEqual(original.skills,['rende']);
 assert.equal(Object.getPrototypeOf(copy),null);
});
