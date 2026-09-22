import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import { decadeManifest } from '../apps/core/noname/ui/workshop/ingame.js';
import { isProviderFile } from '../apps/core/noname/ui/workshop/providerFiles.js';
import { builtinPacks } from '../apps/core/noname/ui/workshop/presets.js';
function writeChanged(file,text) {
 if(!fs.existsSync(file)){fs.writeFileSync(file,text);return;}
 if(fs.readFileSync(file,'utf8')===text)return;
 const handle=fs.openSync(file,'r+');
 try{fs.writeFileSync(handle,text);fs.ftruncateSync(handle,Buffer.byteLength(text));}finally{fs.closeSync(handle);}
}
const root=path.resolve('apps/core/extension/ui/十周年局内UI');
writeChanged(path.join(root,'ui-workshop.json'),JSON.stringify({...decadeManifest,id:'decade-ingame-pack'},null,2)+'\n');
const files=fs.readdirSync(root,{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).map(x=>path.relative(root,path.join(x.parentPath,x.name)).replaceAll('\\','/')).filter(x=>x!=='files.json').sort();
for(const file of files)if(!isProviderFile('十周年局内UI',file))throw new Error('Unreviewed provider file: '+file);
writeChanged(path.join(root,'files.json'),JSON.stringify(files,null,2)+'\n');
const registryFile=path.resolve('apps/core/game/organized-extensions.json');
const registrySource=fs.readFileSync(registryFile,'utf8'),registry=JSON.parse(registrySource);
let entry=registry.find(item=>item.name==='十周年局内UI');
if(!entry){entry={name:'十周年局内UI',characters:[],defaultEnabled:false,source:'local-migration:ziqi-decade-1.3.1',files:{}};registry.push(entry);}
entry.files=Object.fromEntries(files.filter(f=>/\.(js|css|json)$/.test(f)&&!f.startsWith('assets/')).map(f=>[f,createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')]));
entry.files['files.json']=createHash('sha256').update(fs.readFileSync(path.join(root,'files.json'))).digest('hex');entry.hash=entry.files['extension.js'];
const hand=registry.find(item=>item.name==='手杀标准UI');
if(hand){hand.files['extension.js']=createHash('sha256').update(fs.readFileSync(path.resolve('apps/core/extension/ui/手杀标准UI/extension.js'))).digest('hex');hand.hash=hand.files['extension.js'];}
const lobby=registry.find(item=>item.name==='如真似幻');
const lobbyRoot=path.resolve('apps/core/extension/ui/如真似幻');
const lobbyManifest={...builtinPacks().find(pack=>pack.manifest.id==='builtin-rzsh').manifest,id:'rzsh-modern'};
writeChanged(path.join(lobbyRoot,'ui-workshop.json'),JSON.stringify(lobbyManifest,null,2)+'\n');
if(lobby)for(const file of ['scenes.js','ui-workshop.json'])lobby.files[file]=createHash('sha256').update(fs.readFileSync(path.join(lobbyRoot,file))).digest('hex');
if(fs.readFileSync(registryFile,'utf8')!==registrySource)throw new Error('Extension registry changed concurrently; rerun the inventory generator');
const registryText=JSON.stringify(registry,null,2)+'\n';if(registrySource.replaceAll('\r\n','\n')!==registryText)writeChanged(registryFile,registryText);
console.log(JSON.stringify({files:files.length,bytes:files.reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0)}));
