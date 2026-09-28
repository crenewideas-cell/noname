import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {compileDecadeScene} from '../apps/core/noname/skin/localDynamic/runtime/source-scene.js';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const results=[];
for(const e of inventory.entries){
 const row={pack:e.pack,id:e.id,sourceConfigHash:e.sourceConfigHash,catalogConfigHash:e.catalogConfigHash,effectiveConfigHash:e.effectiveConfigHash,sourceFacts:e.sourceModelFacts};
 if(e.pack!=='无名杀基础扩展'){row.status='other-source-family';results.push(row);continue;}
 const unique=new Map();for(const c of e.sourceConfigs){const hash=sha(c.config);if(!unique.has(hash))unique.set(hash,{config:c.config,owners:[]});unique.get(hash).owners.push(c.owner);}
 row.sourceVariants=[];
 for(const [hash,{config,owners}] of unique){try{row.sourceVariants.push(compileDecadeScene(config,{sourceFile:'temp/动态皮包/无名杀基础扩展/dynamicSkin.js',sourceConfigHash:hash,owners}));}catch(error){row.sourceVariants.push({status:'uninterpreted',source:config,sourceConfigHash:hash,error:String(error)});}}
 row.status=!unique.size?'missing-source-mapping':row.sourceVariants.some(v=>v.status==='uninterpreted')?'requires-review':unique.size>1?'owner-specific-configs-preserved':'compiled-coordinate-contract';
 row.productionActivation='pending viewport, action, raster and category acceptance';results.push(row);
}
const summary={entries:results.length,statuses:Object.fromEntries([...new Set(results.map(r=>r.status))].map(s=>[s,results.filter(r=>r.status===s).length])),verifiedScenes:0};
await fs.writeFile(path.join(run,'source-scenes.json'),JSON.stringify({summary,entries:results},null,2));console.log(JSON.stringify(summary));
