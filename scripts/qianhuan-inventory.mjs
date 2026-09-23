import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import './index-qianhuan-resources.mjs';

const root='apps/core/extension/ui/千幻聆音';
const digest=data=>createHash('sha256').update(data).digest('hex');
const source=JSON.parse(await fs.readFile(path.join(root,'SOURCE.json'),'utf8'));
const files={};
async function scan(dir='') {
 for(const entry of (await fs.readdir(path.join(root,dir),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
  const name=dir?`${dir}/${entry.name}`:entry.name;
  if(entry.isDirectory())await scan(name);
  else if(name!=='SOURCE.json')files[name]=digest(await fs.readFile(path.join(root,name)));
 }
}
await scan();
source.adaptedFiles=Object.fromEntries(Object.entries(files).filter(([file,hash])=>source.originalFiles[file]&&source.originalFiles[file]!==hash));
source.addedFiles=Object.fromEntries(Object.entries(files).filter(([file])=>!source.originalFiles[file]));
source.resources={root:'extension/手杀标准UI/original/千幻聆音/',directories:['sanguoskin','sanguoaudio'],sharing:'resource-sharing.json records explicit resource aliases (including voice skill aliases) from the existing resource pack; the new ZIP program takes precedence.'};
source.adapterNotes=[
 'Original hand theme and skin business retained; compatibility changes are listed in adaptedFiles.',
 'Initialization, scoped file/metadata access, core skin persistence and DOM/PIXI refresh are adapted to the current core.',
 'Legacy useSkill source rewriting is disabled. Legacy dynamic renderer hooks require decadeUI and duilib.',
 'Viewport scaling and page lifecycle support both current lobbies and in-game character entry points.',
 'See docs/qianhuan-skin-migration.md for validation and remaining phases.'
];
await fs.writeFile(path.join(root,'SOURCE.json'),JSON.stringify(source,null,2)+'\n');
files['SOURCE.json']=digest(await fs.readFile(path.join(root,'SOURCE.json')));
const registryFile='apps/core/game/organized-extensions.json';
const registry=JSON.parse(await fs.readFile(registryFile,'utf8'));
const entry=registry.find(row=>row.name==='千幻聆音');
if(!entry)throw Error('Missing 千幻聆音 installation entry');
entry.files=files;entry.hash=files['extension.js'];
await fs.writeFile(registryFile,JSON.stringify(registry,null,2)+'\n');
console.log(`Recorded ${Object.keys(files).length} installed files; ${Object.keys(source.adaptedFiles).length} upstream files adapted`);
