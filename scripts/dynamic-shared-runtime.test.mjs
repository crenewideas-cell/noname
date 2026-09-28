import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {publishDynamicRuntime} from './publish-dynamic-runtime.mjs';
import {dynamicPlayerURL,dynamicThumbnailKey} from '../apps/core/noname/skin/localDynamic/runtime-url.js';
import {sourcePortraitLayers} from '../apps/core/noname/skin/localDynamic/runtime/source-portrait.js';
import {layoutDecadeLayer} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';

test('one code URL with independent encoded pack data, identical IDs cannot share thumbnails',()=>{
 const module='https://local.invalid/nested/noname/skin/localDynamic/runtime-url.js';
 const a='https://local.invalid/nested/extension/甲 %23 +/',b='https://local.invalid/nested/extension/乙/';
 const ua=new URL(dynamicPlayerURL(a,{id:'same',presentation:'preview'},module));
 const ub=new URL(dynamicPlayerURL(b,{id:'same',presentation:'portrait'},module));
 assert.equal(ua.pathname,ub.pathname);assert.equal(ua.searchParams.get('assetBase'),new URL(a).href);
 assert.ok(ua.pathname.startsWith('/nested/noname/skin/localDynamic/releases/'));
 assert.notEqual(dynamicThumbnailKey({base:a},{id:'same'}),dynamicThumbnailKey({base:b},{id:'same'}));
 assert.notEqual(dynamicThumbnailKey({base:a},{id:'same'}),dynamicThumbnailKey({base:a},{id:'same',thumbnailRevision:'changed'}));
 assert.throws(()=>dynamicPlayerURL('https://else.invalid/pack/',{},module));
 assert.throws(()=>dynamicPlayerURL(a+'?bad=1',{},module));
});
test('publisher creates one release, fails closed on corruption and works without pack runtimes',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'noname-shared-runtime-'));
 const root=dir+'/packs',source=dir+'/source',releases=dir+'/releases',pointer=dir+'/pointer.js';
 await fs.mkdir(root);await fs.mkdir(source+'/vendor',{recursive:true});
 await fs.writeFile(root+'/manifest.json',JSON.stringify({packs:[{name:'甲'},{name:'乙'}]}));
 await fs.writeFile(source+'/player.html','test player');
 for(const n of ['pixi.min.js','pixi-spine.js','spine-webgl.min.js','live2d.min.js','live2dcubismcore.min.js','spine36.js'])await fs.writeFile(source+'/vendor/'+n,n);
 const options={source,releases,pointer};const first=await publishDynamicRuntime(root,options),before=await fs.readFile(pointer);
 assert.equal(first.installed.length,7);assert.deepEqual(await fs.readdir(root),['manifest.json']);
 const second=await publishDynamicRuntime(root,options);assert.equal(first.revision,second.revision);
 await fs.writeFile(releases+'/'+first.directory+'/player.html','corrupt');
 await assert.rejects(publishDynamicRuntime(root,options),/Immutable runtime mismatch/);
 assert.deepEqual(await fs.readFile(pointer),before);
 await fs.writeFile(source+'/player.html','new player');
 const changed=await publishDynamicRuntime(root,options);assert.notEqual(changed.revision,first.revision);
 await fs.mkdir(root+'/甲/runtime/vendor',{recursive:true});await fs.writeFile(root+'/甲/runtime/vendor/pixi.min.js','incompatible');
 const active=await fs.readFile(pointer);await assert.rejects(publishDynamicRuntime(root,options),/Conflicting vendor/);assert.deepEqual(await fs.readFile(pointer),active);
});
test('authored anonymous scene retains placement rather than scale-only alignment; derived models stay untouched',()=>{
 const c={name:'hero/main',json:true,x:[8,.54],y:[-2,.08],scale:.18,beijing:{name:'hero/bg',json:true,x:[0,.4],y:[0,.46],scale:.27}};
 const entry={legacy:c,models:[c.beijing,c].map(v=>({skeleton:'assets/'+v.name+'.json',version:'3.8.75',legacy:v}))};
 const layers=sourcePortraitLayers(entry);assert.equal(layers.length,2);
 const bg=layoutDecadeLayer(layers[0],{width:120,height:180,referenceHeight:180});
 const fg=layoutDecadeLayer(layers[1],{width:120,height:180,referenceHeight:180});
 assert.equal(bg.x,48);assert.equal(bg.y,82.8);assert.equal(fg.x,72.80000000000001);assert.equal(fg.y,12.4);
 assert.ok(Math.abs(fg.scale/bg.scale-2/3)<1e-10);
 for(const field of ['sceneVariant','layerRegistration','layerCoordinateMismatch']){const copy=structuredClone(entry);copy.models[1][field]={};assert.equal(sourcePortraitLayers(copy),null);}
 const other=structuredClone(entry);other.models[1].skeleton='assets/other.json';assert.equal(sourcePortraitLayers(other),null);
 const unverified=structuredClone(entry);unverified.models.forEach(m=>m.version='4.0.56');assert.equal(sourcePortraitLayers(unverified),null);
});
