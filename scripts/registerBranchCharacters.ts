import fs from 'node:fs';
import crypto from 'node:crypto';
const registry='apps/core/game/organized-extensions.json';
const inventory=JSON.parse(fs.readFileSync('output/branch-merge/inventory.json','utf8'));
const source=fs.readFileSync(registry,'utf8');
const hash=crypto.createHash('sha256').update(fs.readFileSync('apps/core/extension/分支武将/extension.js')).digest('hex');
if(!JSON.parse(source).some((x:any)=>x.name==='分支武将')) {
 const row={name:'分支武将',characters:inventory.added,defaultEnabled:false,source:'branch:扩展包/分支版本/src',files:{'extension.js':hash},hash};
 fs.writeFileSync(registry,source.replace(/\]\s*$/,',\n'+JSON.stringify(row,null,2)+'\n]\n'));
}
const groups='apps/core/game/extension-groups.json';
const text=fs.readFileSync(groups,'utf8');
if(!text.includes('分支武将'))fs.writeFileSync(groups,text.replace('"PY武将"','"PY武将",\n\t\t\t"分支武将"'));
fs.writeFileSync('apps/core/extension/分支武将/info.json',JSON.stringify({name:'分支武将',author:'分支原作者；增量整合 PXLNGU',version:'1.0.0',intro:'只增量添加分支武将与依赖；同名定义保留主工程版本。'},null,2)+'\n');
