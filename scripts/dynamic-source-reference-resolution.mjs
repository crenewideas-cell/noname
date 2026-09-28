import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import path from 'node:path';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const read=async name=>JSON.parse(await fs.readFile(path.join(run,name)));
const [definitions,inventory,refs]=await Promise.all([read('source-definitions.json'),read('inventory.json'),read('source-extra-references.json')]);
const definitionsByKey=new Map(definitions.map(d=>[d.pack+'/'+d.owner+'/'+d.title,d]));
const frozen=new Map();for await(const line of createInterface({input:createReadStream(path.join(run,'baseline-files.jsonl')),crlfDelay:Infinity})){const f=JSON.parse(line);frozen.set(f.path.toLowerCase(),f);}
const resolved=[];
for(const ref of refs){
 const row={id:ref.id,pack:ref.pack,field:ref.field,name:ref.config.name,originalStatus:ref.status};
 if(ref.kind==='skin-config-reference'){
  const target=definitionsByKey.get(ref.pack+'/'+ref.config.name);
  if(target){
   const targets=inventory.entries.filter(e=>e.pack===ref.pack&&e.sourceConfigs.some(c=>c.owner===target.owner&&c.title===target.title&&JSON.stringify(c.config)===JSON.stringify(target.config)));
   Object.assign(row,{status:'exact-source-config-resolved',target:{owner:target.owner,title:target.title,configHash:target.configHash,skinIds:targets.map(e=>e.id)},runtimeConsumption:'not-yet-implemented'});
  }else row.status='missing-source-config';
 }else{
  const skeleton=frozen.get(ref.requested.toLowerCase()),atlas=frozen.get(ref.atlas.toLowerCase());
  if(skeleton&&atlas)Object.assign(row,{status:'exact-windows-resource-resolved',skeleton:{path:skeleton.path,sha256:skeleton.sha256},atlas:{path:atlas.path,sha256:atlas.sha256},runtimeConsumption:'requires-action-graph'});
  else{
   const opposite=ref.requested.replace(/\.(?:json|skel)$/i,ref.requested.endsWith('.json')?'.skel':'.json'),alternate=frozen.get(opposite.toLowerCase());
   Object.assign(row,{status:alternate&&atlas?'alternate-format-requires-contract':'missing-required-action-resource',missing:{skeleton:!skeleton,atlas:!atlas},alternate:alternate?{path:alternate.path,sha256:alternate.sha256}:null});
  }
 }
 resolved.push(row);
}
const summary={total:resolved.length,previousUnresolved:refs.filter(r=>r.status!=='present').length,statuses:resolved.reduce((s,r)=>(s[r.status]=(s[r.status]||0)+1,s),{}),
 limitation:'Reference identity only. Does not certify action selection, transform conditions, source intent or playback. Cross-owner references are preserved, not guessed or rebound.'};
await fs.writeFile(path.join(run,'source-reference-resolution.json'),JSON.stringify({summary,entries:resolved},null,2));console.log(JSON.stringify(summary));
