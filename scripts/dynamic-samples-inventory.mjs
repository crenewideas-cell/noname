import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import yauzl from 'yauzl';
const name='动态皮肤验证扩展',root='apps/core/extension/ui/'+name;
async function hash(stream){const digest=createHash('sha256');for await(const data of stream)digest.update(data);return digest.digest('hex');}
const archive='temp/'+name+'.zip';
let source=JSON.parse(await fs.readFile(root+'/SOURCE.json','utf8').catch(()=>'null'));
if(!source){
 const originalFiles={};
 const zip=await new Promise((resolve,reject)=>yauzl.open(archive,{lazyEntries:true},(err,zip)=>err?reject(err):resolve(zip)));
 await new Promise((resolve,reject)=>{
  zip.on('error',reject);zip.on('end',resolve);zip.on('entry',entry=>{
   if(entry.fileName.endsWith('/'))return zip.readEntry();
   zip.openReadStream(entry,async(err,stream)=>{if(err)return reject(err);try{originalFiles[entry.fileName]=await hash(stream);zip.readEntry();}catch(err){reject(err);}});
  });zip.readEntry();
 });
 source={archive,sha256:await hash(createReadStream(archive)),originalFiles};
}
const files={};
async function scan(dir=''){
 for(const entry of (await fs.readdir(path.join(root,dir),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
  const file=dir?dir+'/'+entry.name:entry.name;
  if(entry.isDirectory())await scan(file);else if(file!=='SOURCE.json')files[file]=await hash(createReadStream(path.join(root,file)));
 }
}
await scan();
source.adaptedFiles=Object.fromEntries(Object.entries(files).filter(([file,hash])=>source.originalFiles[file]&&source.originalFiles[file]!==hash));
source.addedFiles=Object.fromEntries(Object.entries(files).filter(([file])=>!source.originalFiles[file]));
source.notes='64 original models and bundled licenses retained. Runtime and current-core bridge adapted; validation and limitations: docs/dynamic-samples-validation.md.';
await fs.writeFile(root+'/SOURCE.json',JSON.stringify(source,null,2)+'\n');
files['SOURCE.json']=await hash(createReadStream(root+'/SOURCE.json'));
const registryFile='apps/core/game/organized-extensions.json',registry=JSON.parse(await fs.readFile(registryFile,'utf8'));
const record={name,hash:files['extension.js'],characters:[],files};const prior=registry.find(r=>r.name===name);
if(prior)Object.assign(prior,record);else registry.push(record);
await fs.writeFile(registryFile,JSON.stringify(registry,null,2)+'\n');
const catalogFile='apps/core/game/extension-catalog.json',catalog=JSON.parse(await fs.readFile(catalogFile,'utf8'));
if(!catalog.some(r=>r.name===name)){catalog.push({name,category:'ui',path:'extension/ui/'+name});await fs.writeFile(catalogFile,JSON.stringify(catalog,null,2)+'\n');}
console.log('Registered',name,Object.keys(files).length,'files; adapted:',Object.keys(source.adaptedFiles));
