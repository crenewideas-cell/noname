import fs from 'node:fs/promises';
import path from 'node:path';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const read=async name=>JSON.parse(await fs.readFile(path.join(run,name)));
const inventory=await read('inventory.json'),scope=await read('scope-adjustment.json'),manifest=await read('library-loading-v1/manifest.json');
if(!manifest.finishedAt||manifest.shards.some(s=>s.status!=='complete'))throw Error('Incomplete library scan');
const results=new Map(),history=new Map();
function merge(rows,report){for(const r of rows){const record={report,status:r.status,runtimeSnapshotHash:r.runtimeSnapshotHash,error:r.error?.split('\n')[0]};if(!history.has(r.id))history.set(r.id,[]);history.get(r.id).push(record);results.set(r.id,record);}}
for(const shard of manifest.shards){const file=shard.attempts.at(-1).label+'/report.json';merge(await read(file),file);}
if(results.size!==4895)throw Error('Priority denominator changed');
for(const [folder,expected] of [['library-network-recheck-v2',5],['library-adapter-recheck',13],['spine40-loader-all',660],['unique-renderable-skin',4],['spine38-skins-container',8]]){
 const file=folder+'/report.json',rows=await read(file);if(rows.length!==expected)throw Error('Incomplete recheck '+folder);merge(rows,file);
}
const deferred=new Set(scope.deferredSkinIds),rows=inventory.entries.map(e=>({id:e.id,pack:e.pack,title:e.title,catalogAvailable:e.catalogAvailable,status:deferred.has(e.id)?'user-deferred':results.get(e.id).status,evidence:results.get(e.id),history:history.get(e.id)||[],finalAcceptance:'pending'}));
const counts=rows.reduce((s,r)=>(s[r.status]=(s[r.status]||0)+1,s),{});
const summary={original:4934,priority:4895,deferred:39,counts,finalAcceptancePassed:0,limitation:'Loading and discrete capture only. Subsequent independent correctness, complete actions, interaction, visual review, installation and performance gates remain required.'};
await fs.writeFile(path.join(run,'library-loading-summary.json'),JSON.stringify({summary,rows},null,2));
console.log(JSON.stringify(summary));console.log(JSON.stringify(rows.filter(r=>r.status==='failed').map(r=>({id:r.id,title:r.title,catalogAvailable:r.catalogAvailable,error:r.evidence.error}))));
