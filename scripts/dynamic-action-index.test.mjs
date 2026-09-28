import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {indexDynamicSkins} from './index-dynamic-skins.mjs';

test('reindex retains verified actions only while the source configuration is unchanged',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'noname-action-index-'));
 await fs.mkdir(root+'/pack/entries',{recursive:true});
 await fs.mkdir(root+'/source/vendor',{recursive:true});await fs.writeFile(root+'/source/player.html','fixture');
 for(const n of ['pixi.min.js','pixi-spine.js','spine-webgl.min.js','live2d.min.js','live2dcubismcore.min.js','spine36.js'])await fs.writeFile(root+'/source/vendor/'+n,n);
 await fs.writeFile(root+'/manifest.json',JSON.stringify({packs:[{name:'pack'}]}));
 const entry={id:'a',character:'测试',title:'动作',characterIds:['test'],type:'spine',models:[{skeleton:'missing.skel'}],legacy:{name:'source/idle'}};
 const actionScene={actionContract:{records:[{status:'candidate',command:'source:gongji'}]}};
 await fs.writeFile(root+'/pack/entries/a.json',JSON.stringify({...entry,actionScene}));
 const catalog=()=>fs.writeFile(root+'/pack/catalog.json',JSON.stringify({entries:[entry]}));
 const opts={runtimeOptions:{activate:false,source:root+'/source',releases:root+'/releases'}};
 await catalog();await indexDynamicSkins(root,opts);
 assert.deepEqual(JSON.parse(await fs.readFile(root+'/pack/entries/a.json')).actionScene,actionScene);
 entry.legacy.name='source/new-idle';await catalog();await indexDynamicSkins(root,opts);
 assert.equal(JSON.parse(await fs.readFile(root+'/pack/entries/a.json')).actionScene,undefined);
});
