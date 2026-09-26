// Reproducible metadata benchmark. Baseline is the pre-optimization algorithm.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {createCatalogIndex} from '../apps/core/extension/ui/动态皮肤验证扩展/catalog-index.js';
const results=[];
for(const count of [64,1000,5000]) {
  const p={entries:Array.from({length:count},(_,i)=>({id:'id'+i,skinTitle:'skin'+i})),byFile:new Map()};
  for(const e of p.entries)p.byFile.set(e.skinTitle+'.png',e);
  const packs={p},active=()=>true,all=()=>Object.values(packs).filter(active).flatMap(p=>p.entries.map(e=>({p,e})));
  const index=createCatalogIndex(packs,active),last=p.entries.at(-1).skinTitle+'.png';
  const measure=fn=>{const start=performance.now();for(let i=0;i<1000;i++)fn();return +(performance.now()-start).toFixed(3);};
  const before={lookup:measure(()=>assert.equal(all().find(({p,e})=>p.byFile.get(last)===e||last==='localdyn_'+e.id+'.png').e,p.entries.at(-1))),table:measure(()=>Object.fromEntries(all().map(({e})=>[e.skinTitle,{localDynamic:true}])))};
  const after={lookup:measure(()=>assert.equal(index.read().byFile.get(last).e,p.entries.at(-1))),table:measure(()=>index.read().byTitle)};
  results.push({count,iterations:1000,beforeMs:before,afterMs:after});
}
await fs.mkdir('output/dynamic-performance',{recursive:true});
await fs.writeFile('output/dynamic-performance/catalog.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
