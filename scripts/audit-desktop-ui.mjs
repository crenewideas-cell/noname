import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { PROVIDER_PROGRAMS, isProviderFile } from '../apps/core/noname/ui/workshop/providerFiles.js';
const root=resolve('apps/core'),packed=resolve('output/windows/win-unpacked/resources/app');
const checked=[],differences=[];
async function walk(source,target,provider,prefix=''){
 for(const entry of await readdir(source,{withFileTypes:true})){
  const relative=prefix+entry.name;
  if(entry.isDirectory())await walk(resolve(source,entry.name),resolve(target,entry.name),provider,relative+'/');
  else if(/\.(?:js|css)$/.test(entry.name)&&(!provider||isProviderFile(provider,relative))){
   const contents=await readFile(resolve(source,entry.name));
   const shipped=await readFile(resolve(target,entry.name)).catch(()=>null);
   const record={path:provider?`extension/${provider}/${relative}`:`layout/${relative}`,sha256:createHash('sha256').update(contents).digest('hex')};
   checked.push(record);if(!shipped||!contents.equals(shipped))differences.push(record.path);
  }
 }
}
await walk(resolve(root,'layout'),resolve(packed,'layout'));
for(const provider of Object.keys(PROVIDER_PROGRAMS))await walk(resolve(root,'extension/ui',provider),resolve(packed,'extension',provider),provider);
await writeFile('output/selection-performance/ui-resource-audit.json',JSON.stringify({checked,differences},null,2));
assert.deepEqual(differences,[],'Desktop UI code/styles must match the existing browser sources byte for byte');
console.log(`${checked.length} UI script/style resources match the browser sources byte for byte.`);
