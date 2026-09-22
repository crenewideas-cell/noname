import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,extname,join,resolve} from 'node:path';
import {PROVIDER_PROGRAMS,isProviderFile} from '../apps/core/noname/ui/workshop/providerFiles.js';

/** Package reviewed UI entry points plus data/media, never legacy rule modules. */
export async function copyOnlineSkins(root:string,output:string){
 for(const [name,allowed] of Object.entries(PROVIDER_PROGRAMS)){
  const source=resolve(root,'apps/core/extension/ui',name),target=join(output,'ui-skins',name);
  const inventory:string[]=JSON.parse(await readFile(join(source,'files.json'),'utf8'));
  const files=[...new Set([...inventory,...allowed,'files.json'])].filter(file=>isProviderFile(name,file));
  for(const file of files){
   if(file==='files.json')continue;
   if(file.includes('\\')||file.includes(':')||file.startsWith('/')||file.split('/').some(part=>part==='.'||part==='..'))throw new Error('Invalid UI asset path');
   const destination=join(target,file);await mkdir(dirname(destination),{recursive:true});
   if(['.js','.html','.css','.json'].includes(extname(file))){
    let text=await readFile(join(source,file),'utf8');
    for(const provider of Object.keys(PROVIDER_PROGRAMS))text=text.replaceAll(`extension/${provider}/`,`ui-skins/${provider}/`);
    // Resource-list regex in the migrated lobby uses escaped slash literals.
    text=text.replaceAll('extension\\/如真似幻\\/','ui-skins\\/如真似幻\\/');
    await writeFile(destination,text);
   }else await cp(join(source,file),destination);
  }
  await writeFile(join(target,'files.json'),JSON.stringify(files.sort(),null,2)+'\n');
 }
}
