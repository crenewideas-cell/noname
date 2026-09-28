import test from 'node:test';import assert from 'node:assert/strict';
import {createSkinResourceCache} from '../apps/core/noname/skin/localDynamic/resource-cache.js';
test('shared immutable loads coalesce; cancelling one consumer does not break the other',async()=>{
 let calls=0,finish;const cache=createSkinResourceCache({fetcher:async(_,{signal})=>{calls++;return await new Promise((resolve,reject)=>{finish=()=>resolve({ok:true,blob:async()=>new Blob(['abc'])});signal.addEventListener('abort',()=>reject(signal.reason));});}});
 const a=new AbortController(),b=new AbortController(),one=cache.blob('/atlas',{signal:a.signal}),two=cache.blob('/atlas',{signal:b.signal});await new Promise(r=>setTimeout(r,0));a.abort();await assert.rejects(one,{name:'AbortError'});finish();assert.equal(await(await two).text(),'abc');assert.equal(calls,1);await cache.blob('/atlas');assert.equal(calls,1);
});
test('failed and abandoned resources can retry; cache budgets and expiry are bounded',async()=>{
 let calls=0,time=0;const cache=createSkinResourceCache({blobBudget:4,imageBudget:16,ttl:5,now:()=>time,fetcher:async()=>{if(++calls===1)throw Error('failed');return{ok:true,blob:async()=>new Blob(['abc'])};},decode:async()=>({width:2,height:2})});
 await assert.rejects(cache.blob('/a'));await cache.blob('/a');await cache.blob('/b');assert.ok(cache.stats().blobBytes<=4);await cache.image('/a');await cache.image('/b');assert.ok(cache.stats().imageBytes<=16);time=10;cache.prune();assert.equal(cache.stats().blobBytes,0);assert.equal(cache.stats().imageBytes,0);
});
