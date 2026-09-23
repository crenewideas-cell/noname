import fs from 'node:fs/promises';
import path from 'node:path';
const core='apps/core', target=path.join(core,'extension/ui/千幻聆音');
const directories={};
async function scan(disk,url) {
 const entries=await fs.readdir(disk,{withFileTypes:true});
 directories[url]={folders:entries.filter(e=>e.isDirectory()).map(e=>e.name),files:entries.filter(e=>e.isFile()).map(e=>e.name)};
 for(const e of entries)if(e.isDirectory())await scan(path.join(disk,e.name),url+'/'+e.name);
}
await scan(target,'extension/千幻聆音');
for(const dir of ['sanguoskin','sanguoaudio'])await scan(path.join(core,'extension/ui/手杀标准UI/original/千幻聆音',dir),'extension/手杀标准UI/original/千幻聆音/'+dir);
await fs.writeFile(path.join(target,'resource-index.json'),JSON.stringify(directories)+'\n');
console.log(`Indexed ${Object.keys(directories).length} Qianhuan resource directories`);
