import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root='output/dynamic-remediation/20260926-r01/experience-r09';
const files=['apps/core/noname/skin/localDynamic/bridge.js','apps/core/noname/skin/localDynamic/thumbnails.js','apps/core/noname/skin/localDynamic/events.js','apps/core/noname/skin/localDynamic/runtime-release.js','apps/core/noname/skin/localDynamic/runtime-url.js','apps/core/noname/skin/localDynamic/preview-layout.css','apps/core/extension/ui/千幻聆音/theme/shousha/code/shousha.js','scripts/index-dynamic-skins.mjs','scripts/dynamic-scene-variants.mjs'];
for(const n of await fs.readdir('apps/core/noname/skin/localDynamic/runtime'))if(/\.(js|css|html)$/.test(n))files.push('apps/core/noname/skin/localDynamic/runtime/'+n);
const records=[];
for(const file of files){const b=await fs.readFile(file),dest=root+'/before/'+file;await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,b,{flag:'wx'});records.push({file,sha256:createHash('sha256').update(b).digest('hex')});}
await fs.writeFile(root+'/baseline.json',JSON.stringify(records,null,2),{flag:'wx'});
console.log(JSON.stringify({files:records.length,root}));
