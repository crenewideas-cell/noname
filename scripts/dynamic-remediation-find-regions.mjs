import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const audit=JSON.parse(await fs.readFile(path.join(run,'all-base-models.json')));
const targets=audit.failures.flatMap(f=>{const region=f.error.match(/Region not found in atlas: (.*?) \(/)?.[1];return region?[{model:f.file,atlas:f.atlas,region,matches:[]}]:[];});
const wanted=new Map();for(const t of targets){if(!wanted.has(t.region))wanted.set(t.region,[]);wanted.get(t.region).push(t);}
const atlases=[];
for await(const line of createInterface({input:createReadStream(path.join(run,'baseline-files.jsonl')),crlfDelay:Infinity})){
 const f=JSON.parse(line);if(f.path?.startsWith('temp/动态皮包/')&&f.path.endsWith('.atlas'))atlases.push(f);
}
let next=0,checked=0;const errors=[];
await Promise.all(Array.from({length:8},async()=>{while(next<atlases.length){const file=atlases[next++];try{
 const data=await fs.readFile(file.path),hash=createHash('sha256').update(data).digest('hex');if(hash!==file.sha256)throw Error('Frozen hash changed');
 const lines=data.toString('utf8').split(/\r?\n/);
 for(let i=0;i<lines.length;i++){const name=lines[i].trim();if(!wanted.has(name)||!/^\s+(?:rotate|bounds|xy):/.test(lines[i+1]||''))continue;
 const match={atlas:file.path,sha256:hash,line:i+1};for(const target of wanted.get(name))target.matches.push(match);}
 checked++;
 }catch(error){errors.push({path:file.path,error:String(error)});}}}));
const report={checkedAtlases:checked,expectedAtlases:atlases.length,targets:targets.length,found:targets.filter(t=>t.matches.length).length,errors,limitations:'Exact region-name discovery only. Matching names do not prove matching pixels, dimensions, skeleton or full attachment coverage; no source changes or replacement performed.',results:targets};
await fs.writeFile(path.join(run,'missing-region-candidates.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,results:undefined}));
