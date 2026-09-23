import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createResourceAccess} from '../apps/core/extension/ui/千幻聆音/file-access.js';
const index={'extension/千幻聆音/skins':{folders:['caocao'],files:['old.jpg']}};
const listing=(api,path='extension/千幻聆音/skins')=>new Promise((resolve,reject)=>api.readDirectory(path,(folders,files)=>resolve({folders,files}),reject));
test('installed skins are discovered from live storage, including additions and removals',async()=>{
 const api=createResourceAccess({getFileList(path,cb){cb([],['new.jpg']);}},index);
 assert.deepEqual(await listing(api),{folders:[],files:['new.jpg']});
});
test('static/offline fallback returns copied data and completes missing directories',async()=>{
 const api=createResourceAccess({},index);
 const result=await listing(api);result.files.push('not-real.jpg');
 assert.deepEqual((await listing(api)).files,['old.jpg']);
 await assert.rejects(listing(api,'missing'),/目录不可访问/);
 assert.equal(await new Promise(resolve=>api.checkFile('extension/千幻聆音/skins/old.jpg',resolve)),true);
 assert.equal(await new Promise(resolve=>api.checkFile('extension/千幻聆音/skins/missing.jpg',resolve)),false);
});
test('a stalled file service falls back once, ignoring late callbacks',async()=>{
 let late,calls=0;const api=createResourceAccess({getFileList(path,cb){late=cb;}},index,10);
 await new Promise(resolve=>api.readDirectory('extension/千幻聆音/skins',()=>{calls++;resolve();}));
 late([],['late.jpg']);assert.equal(calls,1);
});
test('file checks accept modern numeric results and do not resurrect deleted indexed files',async()=>{
 const host={checkFile(path,cb){cb(-1);},checkDir(path,cb){cb(1);}};
 const api=createResourceAccess(host,index);
 assert.equal(await new Promise(resolve=>api.checkFile('directory',resolve)),true);
 host.checkDir=(path,cb)=>cb(-1);
 assert.equal(await new Promise(resolve=>api.checkFile('extension/千幻聆音/skins/old.jpg',resolve)),false);
});
