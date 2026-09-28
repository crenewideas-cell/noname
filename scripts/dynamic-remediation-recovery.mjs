import fs from 'node:fs/promises';
import path from 'node:path';
import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import {createHash} from 'node:crypto';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const baseline=new Map();for await(const l of createInterface({input:createReadStream(path.join(run,'baseline-files.jsonl')),crlfDelay:Infinity})){const r=JSON.parse(l);baseline.set(r.path,r);}
const source='apps/core/noname/skin/localDynamic/';
const files=[...['bridge.js','thumbnails.js',...['legacy-parser.js','player.js','spine36.js','spine42.js','atlas-compat.js','source-scene.js','spine-assets.js','skeleton-skin.js','spine-json.js','live2d-assets.js'].map(f=>'runtime/'+f)].map(f=>source+f),'scripts/extension-layout.mjs'];
const rows=[];const hash=b=>createHash('sha256').update(b).digest('hex');
const label=process.argv[3]||'recovery-drill-v2';if(!/^[a-z0-9-]+$/.test(label))throw Error('Invalid isolated drill label');
const target=path.join(run,label);await fs.mkdir(target);
for(const file of files){
 const entry=baseline.get(file);if(entry&&!entry.recovery)throw Error('No frozen recovery file: '+file);
 const original=entry?await fs.readFile(path.join(run,entry.recovery)):null;if(entry&&hash(original)!==entry.sha256)throw Error('Invalid frozen baseline: '+file);
 const candidate=await fs.readFile(file),sandboxFile=path.join(target,file);
 if(!path.resolve(sandboxFile).startsWith(path.resolve(target)+path.sep))throw Error('Drill path escaped isolation');
 await fs.mkdir(path.dirname(sandboxFile),{recursive:true});
 if(original)await fs.writeFile(sandboxFile,original);const initial=original?hash(await fs.readFile(sandboxFile)):null;
 await fs.writeFile(sandboxFile,candidate);const installed=hash(await fs.readFile(sandboxFile));
 if(original)await fs.writeFile(sandboxFile,original);else await fs.unlink(sandboxFile);
 const restored=await fs.readFile(sandboxFile).then(hash).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
 rows.push({file,operation:entry?'replace-and-restore':'add-and-remove',initial,candidate:hash(candidate),installed,restored,pass:initial===restored&&installed===hash(candidate)});
}
const report={scope:'isolated changed-runtime file installation and rollback; no production files or formal browser storage changed',limitation:'File recovery drill only; full package install, upgrade, cache and in-game rollback remain pending',pass:rows.every(r=>r.pass),results:rows};
await fs.writeFile(path.join(run,label+'.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
