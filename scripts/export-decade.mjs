// Use the workshop's real archive writer/reader without starting the game.
// No source APK or extraction directory is consulted.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const root=path.resolve(process.argv[2]||'.'),destination=path.resolve(process.argv[3]||'dist/ui');
const core=path.join(root,'apps/core'),require=createRequire(path.join(core,'package.json'));
const context=vm.createContext({console,Blob,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,DataView,crypto:globalThis.crypto,Response,
 fetch:async url=>{const relative=decodeURIComponent(String(url).replace('provider:/',''));const file=path.resolve(core,'extension/ui',relative);if(!file.startsWith(path.join(core,'extension/ui')+path.sep))throw new Error('Unsafe provider path');return new Response(await fs.readFile(file));}});
const modules=new Map();
async function load(file){
 if(modules.has(file))return modules.get(file);
 let mod;
 if(file==='jszip')mod=new vm.SyntheticModule(['default'],function(){this.setExport('default',require('jszip'));},{context});
 else if(file.endsWith('/provider.js'))mod=new vm.SourceTextModule('export const providerDirectory=name=>"provider:/"+name+"/";',{context,identifier:file});
 else mod=new vm.SourceTextModule(await fs.readFile(file,'utf8'),{context,identifier:file});
 modules.set(file,mod);await mod.link((specifier,parent)=>load(specifier==='jszip'?specifier:path.resolve(path.dirname(parent.identifier),specifier).replaceAll('\\','/')));return mod;
}
const module=await load(path.join(core,'noname/ui/workshop/archive.js').replaceAll('\\','/'));await module.evaluate();
const presets=await load(path.join(core,'noname/ui/workshop/presets.js').replaceAll('\\','/'));await presets.evaluate();
const ingame=await load(path.join(core,'noname/ui/workshop/ingame.js').replaceAll('\\','/'));await ingame.evaluate();
const packs=presets.namespace.builtinPacks(),single=packs.find(p=>p.manifest.id==='builtin-decade-ingame'),combo=packs.find(p=>p.manifest.id==='builtin-rzsh');
ingame.namespace.mixIngame(combo,single);combo.manifest.id='rzsh-decade-ingame';combo.manifest.name='如真似幻＋十周年局内';
await fs.mkdir(destination,{recursive:true});
const report=[];
for(const pack of [single,combo]){
 const archive=await module.namespace.writeArchive(pack),file=path.join(destination,pack.manifest.name+'-UI套装.zip');
 await fs.writeFile(file,Buffer.from(await archive.arrayBuffer()));
 const imported=await module.namespace.readArchive(archive);
 const again=await module.namespace.readArchive(await module.namespace.writeArchive(imported));
 if(JSON.stringify(imported.manifest)!==JSON.stringify(again.manifest))throw new Error('Round trip changed manifest');
 report.push({file,bytes:archive.size,sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex'),roundtrip:true,components:Object.keys(imported.manifest.components)});
}
await fs.writeFile(path.join(destination,'decade-export-report.json'),JSON.stringify({at:new Date().toISOString(),report},null,2));console.log(JSON.stringify(report,null,2));
