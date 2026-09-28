import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {readLegacyDefinitions} from './import-dynamic-skins.mjs';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const source='temp/动态皮包/无名杀基础扩展/dynamicSkin.js',text=await fs.readFile(source,'utf8');
const marker='// 2026-09-19 资源整理：附带参数及经骨骼检查的新增基础配置。',boundary=text.indexOf(marker);
if(boundary<0||boundary!==text.lastIndexOf(marker))throw Error('Source provenance boundary is missing or ambiguous');
// Evaluate only the original, complete declarations and aliases, then close the outer import callback.
const original=readLegacyDefinitions(text.slice(0,boundary)+'\n});');
const effective=readLegacyDefinitions(text),inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const rows=inventory.entries.map(e=>{
 if(e.pack!=='无名杀基础扩展')return{id:e.id,category:'other-source-family'};
 const owners=e.sourceConfigs.map(c=>({owner:c.owner,title:c.title,category:original[c.owner]?.[c.title]?'original-declaration':'20260919-supplement',exact:JSON.stringify(effective[c.owner]?.[c.title])===JSON.stringify(c.config)}));
 if(owners.some(o=>!o.exact))throw Error('Frozen source config mismatch '+e.id);
 const categories=new Set(owners.map(o=>o.category));
 return{id:e.id,category:categories.size===0?'unmapped':categories.size===1?[...categories][0]:'mixed-owner-provenance',owners};
});
const report={source,sourceSha256:createHash('sha256').update(text).digest('hex'),boundaryLine:text.slice(0,boundary).split('\n').length,evidence:marker+'\n// 原有配置优先；基础配置的显示位置可在游戏中微调。',interpretation:'Supplement placement is not certified author framing. Original declarations remain independently verifiable; origin alone is not visual correctness.',counts:Object.fromEntries([...new Set(rows.map(r=>r.category))].map(k=>[k,rows.filter(r=>r.category===k).length])),entries:rows};
await fs.writeFile(path.join(run,'source-provenance.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,entries:undefined}));
