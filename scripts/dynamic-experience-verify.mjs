import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='output/dynamic-remediation/20260926-r01',out=root+'/experience-r09',read=async p=>JSON.parse(await fs.readFile(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const release=await read(out+'/release-multilayer/release-manifest.json'),impact=await read(out+'/actions/impact.json'),baseline=await read(out+'/baseline.json');
for(const r of release.installed)assert.equal(sha(await fs.readFile(r.file)),r.sha256);
for(const r of release.source)assert.equal(sha(await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+r.file)),r.sha256);
const old=await read(root+'/runtime-delivery-r06/release-manifest.json');for(const r of old.installed)assert.equal(sha(await fs.readFile(r.file)),r.sha256);
const deferred=new Set((await read(root+'/scope-adjustment.json')).deferredSkinIds),byId=new Map(impact.rows.filter(r=>r.accepted.length).map(r=>[r.id,r]));
for(const row of byId.values()){
 const before=await fs.readFile(out+'/actions/rollback/'+row.id+'.json'),after=await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/entries/'+row.id+'.json');
 assert.equal(sha(before),row.beforeSHA256);assert.equal(sha(after),row.afterSHA256);assert.ok(!deferred.has(row.id));
 const parsed=JSON.parse(after);delete parsed.actionScene;assert.deepEqual(parsed,JSON.parse(before),'Only action metadata may change');
}
const previous=await read(root+'/composition-r08/rollback/entry-manifest.json');
for(const row of previous){const before=byId.has(row.id)?await fs.readFile(out+'/actions/rollback/'+row.id+'.json'):await fs.readFile(row.file);assert.equal(sha(before),row.afterSHA256,'R08 generated entry changed unexpectedly');}
const changed=[];
for(const row of baseline){assert.equal(sha(await fs.readFile(out+'/before/'+row.file)),row.sha256);const after=sha(await fs.readFile(row.file));if(after!==row.sha256)changed.push({file:row.file,beforeSHA256:row.sha256,afterSHA256:after,rollback:'before/'+row.file});}
const gameFix=await read(out+'/game-fix.json');assert.equal(sha(await fs.readFile(gameFix.file)),gameFix.afterSHA256);assert.equal(sha(await fs.readFile(out+'/before/'+gameFix.file)),gameFix.beforeSHA256);changed.push({...gameFix,rollback:'before/'+gameFix.file});
const controls=await read(out+'/final-r08-controls/report.json');assert.equal(controls.errors.length,0);assert.equal(controls.cases.length,6);assert.ok(!controls.failure);
assert.ok(controls.cases.every(c=>c.player.url.includes('runtime-'+release.revision)));
const http=[];const normalize=s=>s.replaceAll('\r\n','\n').trim();
for(const row of new Map(controls.responses.filter(r=>r.url.includes('/releases/')).map(r=>[r.url,r])).values()){
 const response=Buffer.from(await(await fetch(row.url)).arrayBuffer());assert.equal(sha(response),row.sha256);
 const served=response.toString(),marker=served.match(/\/\/# sourceMappingURL=data:application\/json;base64,(\S+)/),body=marker?served.slice(0,marker.index).trim():served.trim();
 const prefix='"/noname/skin/localDynamic/releases/'+release.directory+'/';
 const restored=body.replace(new RegExp(prefix+'([^"\\n]+)"','g'),(_,p)=>"'./"+p+"'");
 const file=new URL(row.url).pathname.split('/').at(-1);assert.equal(normalize(restored),normalize(await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+file,'utf8')));
 await fs.writeFile(out+'/http-'+file,response);http.push({file,httpSHA256:row.sha256,sourceSHA256:release.source.find(s=>s.file===file).sha256,transform:'Vite relative import rewrite, newline and inline sourcemap only'});
}
assert.ok(http.some(r=>r.file==='player.js'));
const verification={recordedAt:new Date().toISOString(),revision:release.revision,sharedFiles:release.installed.length,legacyCompatibilityFilesRetained:old.installed.length,actionEntries:byId.size,commands:impact.commands,onlyActionMetadataChanged:true,r08EntriesPreserved:previous.length,deferredEntriesTouched:0,sourceAssetsWritten:false,catalogsWritten:false,officialSaveFilesWritten:false,individualFinalAcceptance:0,rejectedActionSkins:impact.rows.filter(r=>r.rejected.length).length,rejectedCommands:impact.rows.reduce((n,r)=>n+r.rejected.length,0),http,changedFiles:changed};
await fs.writeFile(out+'/verification.json',JSON.stringify(verification,null,2));console.log(JSON.stringify({...verification,http:verification.http.length,changedFiles:changed.length}));
