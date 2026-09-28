import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {classifiedExtensionsPlugin} from './extension-layout.mjs';

test('classified asset URLs retain literal URI path punctuation through the static server',async()=>{
 const core=await fs.mkdtemp(path.join(os.tmpdir(),'noname-extension-url-'));
 const physical=path.join(core,'extension/imports/测试包');
 await fs.mkdir(physical,{recursive:true});
 try{
  let middleware;classifiedExtensionsPlugin(core).configureServer({middlewares:{use:fn=>middleware=fn}});
  for(const name of ['模型+.model3.json','a;b,c@d=e&f$.atlas','100%.png','普通.json']){
   await fs.writeFile(path.join(physical,name),name);
   const req={method:'GET',url:'/extension/'+['测试包',name].map(encodeURIComponent).join('/')+'?v=1%2B2'};
   let failure;middleware(req,{},error=>{failure=error;});if(failure)throw failure;
   const result=new URL(req.url,'http://localhost');
   assert.equal(result.search,'?v=1%2B2');
   // Vite's static middleware decodes URI paths, preserving reserved escapes.
   const served=path.join(core,decodeURI(result.pathname));
   assert.equal(await fs.readFile(served,'utf8'),name);
  }
 }finally{
  // This exact directory was created above; no computed shared/project target.
  assert.ok(path.resolve(core).startsWith(path.resolve(os.tmpdir())+path.sep));
  await fs.rm(core,{recursive:true,force:true});
 }
});
