import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='output/dynamic-remediation/20260926-r01',out=root+'/performance-r10';
const read=async p=>JSON.parse(await fs.readFile(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const release=await read(out+'/release-final/release-manifest.json'),baseline=await read(out+'/baseline.json');
for(const row of release.installed)assert.equal(sha(await fs.readFile(row.file)),row.sha256);
for(const row of release.source)assert.equal(sha(await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+row.file)),row.sha256);
const old=await read(root+'/runtime-delivery-r06/release-manifest.json');
for(const row of old.installed)assert.equal(sha(await fs.readFile(row.file)),row.sha256);
const actions=await read(root+'/experience-r09/actions/impact.json'),entries=actions.rows.filter(r=>r.accepted.length);
for(const row of entries)assert.equal(sha(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/entries/'+row.id+'.json')),row.afterSHA256);
const changed=[];
for(const row of baseline){assert.equal(sha(await fs.readFile(out+'/before-files/'+row.file)),row.sha256);const current=sha(await fs.readFile(row.file));if(current!==row.sha256)changed.push({file:row.file,beforeSHA256:row.sha256,afterSHA256:current,rollback:'before-files/'+row.file});}
const newFiles=await Promise.all(['resource-cache.js','runtime/anchor-geometry.js'].map(async name=>{const file='apps/core/noname/skin/localDynamic/'+name;return{file,sha256:sha(await fs.readFile(file))};}));
const entrance=await read(out+'/entrance-final-v2/report.json'),warm=await read(out+'/warm-final-v2/report.json'),retry=await read(out+'/thumbnail-retry-v2/report.json');
assert.deepEqual(entrance.errors,[]);assert.deepEqual(warm.errors,[]);assert.deepEqual(warm.syncAssetProbes,[]);assert.equal(warm.afterClose.frames.length,0);assert.ok(retry.retryPassed);
for(const row of entrance.cases){assert.ok(row.frames[0].alignment);assert.ok(row.frames[0].url.includes(release.directory));assert.equal(row.frames.at(-1).effect,false);}
for(const sample of warm.samples.filter(s=>s.label.endsWith('100ms')))assert.ok(sample.cards.filter(c=>c.visible&&c.id?.startsWith('本地')).every(c=>c.ready==='true'));
const http=[];
const rows=[...new Map(retry.responses.filter(r=>r.url.includes("/noname/skin/localDynamic/")).map(r=>[r.url.split('?')[0],r])).values()];
rows.push({url:'http://127.0.0.1:8081/noname/skin/localDynamic/effect-host.js'},{url:'http://127.0.0.1:8081/noname/skin/localDynamic/resource-cache.js'},{url:'http://127.0.0.1:8081/extension/千幻聆音/theme/shousha/code/shousha.js'});
await fs.mkdir(out+'/http',{recursive:true});
for(const row of rows){
 const response=await(await fetch(row.url)).text(),m=response.match(/\/\/# sourceMappingURL=data:application\/json;base64,(\S+)/);
 let original=m?JSON.parse(Buffer.from(m[1],'base64')).sourcesContent[0]:response;
 const pathname=decodeURIComponent(new URL(row.url).pathname),file=pathname.startsWith('/extension/')?'apps/core/extension/ui'+pathname.slice('/extension'.length):'apps/core'+pathname;
 const source=await fs.readFile(file,'utf8');
 const imports=new Map([...source.matchAll(/(['"])(\.[^'"\n]+)\1/g)].map(m=>[new URL(m[2],row.url).pathname,m[0]]));
 original=original.replace(/"(\/[^"\n]+)"/g,(literal,path)=>imports.get(path.split('?')[0])||literal);
original=original.replace(/\n?\/\/# sourceMappingURL=[^\n]*/g,'');
assert.equal(original.replaceAll('\r\n','\n').trim(),source.replaceAll('\r\n','\n').trim(),file);
 const filename=pathname.split('/').at(-1);await fs.writeFile(out+'/http/'+filename,response);
 http.push({url:row.url,observedResponseSHA256:row.sha256,servedSHA256:sha(response),diskSHA256:sha(source),verifiedOriginal:true,viteSourceMap:!!m});
}
const result={recordedAt:new Date().toISOString(),revision:release.revision,sharedFiles:release.installed.length,legacyCompatibilityFilesRetained:old.installed.length,r09ActionEntriesUnchanged:entries.length,changedFiles:changed,newFiles,http,unitTests:89,scope:{frozen:4934,priority:4895,deferred:39,deleted:0,individualFinalAcceptance:0},sourceAssetsWritten:false,catalogsWritten:false,officialSaveFilesWritten:false,matchesStarted:0};
await fs.writeFile(out+'/verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify({revision:result.revision,changedFiles:changed.length,http:http.length,oldFiles:old.installed.length}));
