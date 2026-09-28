import fs from 'node:fs/promises';
import path from 'node:path';
// Generate only browsing metadata; do not rebuild models or run a skin player.
const root=path.resolve('apps/core/extension/imports/本地动态皮肤包');
const index=JSON.parse(await fs.readFile(path.join(root,'runtime-index.json'),'utf8'));
for(const pack of index.packs){
 const directory=path.join(root,pack.name),bindings=JSON.parse(await fs.readFile(path.join(directory,'binding-index.json'),'utf8')),rows=new Map();
 for(const file of new Set(Object.values(bindings)))for(const row of JSON.parse(await fs.readFile(path.join(directory,file),'utf8'))){
  rows.set(row.entry.id,{...row,entry:{...row.entry,group:row.entry.character||'未分类',sex:row.entry.sex||'unknown'},bindingGroup:file});
 }
 await fs.writeFile(path.join(directory,'library-index.json'),JSON.stringify([...rows.values()]));
}
