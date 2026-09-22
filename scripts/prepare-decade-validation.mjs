// A new build context contains formal sources only; no APK, temp or retired media.
import fs from 'node:fs/promises';
import path from 'node:path';
import {PROVIDER_PROGRAMS,isProviderFile} from '../apps/core/noname/ui/workshop/providerFiles.js';
const root=process.cwd(),out=path.resolve(process.argv[2]||'output/decade-validation');
await fs.mkdir(out,{recursive:false});
const core=path.join(out,'apps/core');
await fs.cp(path.join(root,'apps/core'),core,{recursive:true,filter:source=>{
 const rel=path.relative(path.join(root,'apps/core'),source).split(path.sep);
 return !['extension','node_modules','dist','dist-types','.vite','output','audio','image'].includes(rel[0]);
}});
await fs.cp('apps/core/extension/packs',path.join(core,'extension/packs'),{recursive:true});
// Formal base-game media, not migration sources. Hardlinks have independent
// directory entries and remain readable without traversing the source tree.
for(const directory of ['image','audio']){
 const source=path.join(root,'apps/core',directory);
 for(const entry of await fs.readdir(source,{recursive:true,withFileTypes:true}))if(entry.isFile()){
  const file=path.join(entry.parentPath,entry.name),dest=path.join(core,directory,path.relative(source,file));
  await fs.mkdir(path.dirname(dest),{recursive:true});await fs.link(file,dest);
 }
}
await fs.cp('scripts',path.join(out,'scripts'),{recursive:true});
await fs.cp('packages/fs/src',path.join(out,'packages/fs/src'),{recursive:true});
for(const file of ['package.json','tsconfig.json','pnpm-workspace.yaml'])await fs.copyFile(file,path.join(out,file));
await fs.symlink(path.join(root,'node_modules'),path.join(out,'node_modules'),'junction');
await fs.symlink(path.join(root,'apps/core/node_modules'),path.join(core,'node_modules'),'junction');
let files=0,bytes=0;
for(const name of Object.keys(PROVIDER_PROGRAMS)){
 const source=path.join(root,'apps/core/extension/ui',name),dest=path.join(core,'extension/ui',name);
 const inventory=JSON.parse(await fs.readFile(path.join(source,'files.json'),'utf8'));
 for(const file of [...inventory,'files.json'].filter(f=>isProviderFile(name,f))){const next=path.join(dest,file);await fs.mkdir(path.dirname(next),{recursive:true});await fs.copyFile(path.join(source,file),next);files++;bytes+=(await fs.stat(next)).size;}
}
await fs.writeFile(path.join(out,'context.json'),JSON.stringify({at:new Date().toISOString(),root:out,files,bytes,sourceInputs:['apps/core','scripts','package.json'],toolingOnly:['node_modules','apps/core/node_modules'],excluded:['temp','扩展包','retired provider media']},null,2));
console.log(out);
