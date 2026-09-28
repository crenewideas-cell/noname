import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const local='apps/core/noname/skin/localDynamic';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
async function walk(dir,prefix='') {
 const rows=[];
 for(const e of await fs.readdir(dir,{withFileTypes:true})) {
  const name=prefix+e.name;
  if(e.isDirectory())rows.push(...await walk(path.join(dir,e.name),name+'/'));
  else rows.push({name,bytes:await fs.readFile(path.join(dir,e.name))});
 }
 return rows.sort((a,b)=>a.name.localeCompare(b.name));
}
async function immutable(dest,bytes) {
 await fs.mkdir(path.dirname(dest),{recursive:true});
 try{await fs.writeFile(dest,bytes,{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}
 assert.equal(sha(await fs.readFile(dest)),sha(bytes),'Immutable runtime mismatch: '+dest);
}
// Reject conflicting vendors instead of silently choosing one pack's library.
export async function ensureDynamicVendors(directories,{source=local+'/runtime',spine36Source='apps/core/extension/ui/十周年局内UI/vendor/spine.js'}={}) {
 const vendors=new Map();
 for(const directory of [source+'/vendor',...directories]) {
  let files;try{files=await walk(directory);}catch(e){if(e.code==='ENOENT')continue;throw e;}
  for(const row of files){
   if(vendors.has(row.name))assert.equal(sha(row.bytes),sha(vendors.get(row.name)),'Conflicting vendor: '+directory+'/'+row.name);
   else vendors.set(row.name,row.bytes);
  }
 }
 for(const name of ['pixi.min.js','pixi-spine.js','spine-webgl.min.js','live2d.min.js','live2dcubismcore.min.js'])assert.ok(vendors.has(name),'Missing shared vendor: '+name);
 if(!vendors.has('spine36.js'))vendors.set('spine36.js',await fs.readFile(spine36Source));
 for(const [name,bytes] of vendors)await immutable(source+'/vendor/'+name,bytes);
}
export async function publishDynamicRuntime(root,{evidenceDirectory,source=local+'/runtime',releases=local+'/releases',pointer=local+'/runtime-release.js',activate=true}={}) {
 const packs=(JSON.parse(await fs.readFile(path.join(root,'manifest.json')))).packs.map(p=>p.name);
 for(const pack of packs)assert.ok(!/[\\/\0]/.test(pack));
 await ensureDynamicVendors(packs.map(pack=>path.join(root,pack,'runtime/vendor')),{source});
 const code=await walk(source),identity=code.map(r=>({file:r.name,sha256:sha(r.bytes)}));
 const revision=sha(JSON.stringify(identity)).slice(0,20),directory='runtime-'+revision;
 const manifest={revision,directory,architecture:'shared-player/1',packs,source:identity,installed:[],scope:'One shared player; pack catalogs, entries, assets and saves unchanged.'};
 for(const row of code){
  const dest=path.join(releases,directory,row.name);await immutable(dest,row.bytes);
  manifest.installed.push({file:dest.replaceAll('\\','/'),sha256:sha(row.bytes)});
 }
 const contents='// Generated after the single shared release verifies.\nexport const dynamicRuntimeRevision = '+JSON.stringify(revision)+';\nexport const dynamicRuntimeDirectory = '+JSON.stringify(directory)+';\n';
 if(evidenceDirectory){await fs.mkdir(evidenceDirectory,{recursive:true});await fs.writeFile(path.join(evidenceDirectory,'release-manifest.json'),JSON.stringify(manifest,null,2),{flag:'wx'});}
 if(activate){
  let old;try{old=await fs.readFile(pointer);}catch(e){if(e.code!=='ENOENT')throw e;}
  if(old&&evidenceDirectory)await fs.writeFile(path.join(evidenceDirectory,'runtime-release.before.js'),old,{flag:'wx'});
  if(!old||!old.equals(Buffer.from(contents))){
   // Atomic replacement: readers always see a complete release pointer.
   const temporary=pointer+'.'+process.pid+'.tmp';await fs.writeFile(temporary,contents,{flag:'wx'});await fs.rename(temporary,pointer);
  }
 }
 return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename){
 const m=await publishDynamicRuntime('apps/core/extension/imports/本地动态皮肤包',{evidenceDirectory:process.argv[2]});console.log(JSON.stringify({revision:m.revision,files:m.installed.length}));
}
