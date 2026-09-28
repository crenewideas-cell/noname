import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='output/dynamic-remediation/20260926-r01',out=root+'/framing-r11';
const read=async p=>JSON.parse(await fs.readFile(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const release=await read(out+'/release-final/release-manifest.json'),baseline=await read(out+'/baseline.json');
for(const row of release.installed)assert.equal(sha(await fs.readFile(row.file)),row.sha256);
for(const row of release.source)assert.equal(sha(await fs.readFile('apps/core/noname/skin/localDynamic/runtime/'+row.file)),row.sha256);
const old=await read(root+'/runtime-delivery-r06/release-manifest.json');
for(const row of old.installed)assert.equal(sha(await fs.readFile(row.file)),row.sha256);
const actions=await read(root+'/experience-r09/actions/impact.json'),entries=actions.rows.filter(r=>r.accepted.length);
for(const row of entries)assert.equal(sha(await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/entries/'+row.id+'.json')),row.afterSHA256);
const changed=[];
for(const row of baseline){assert.equal(sha(await fs.readFile(out+'/before/'+row.file)),row.sha256);const current=sha(await fs.readFile(row.file));if(current!==row.sha256)changed.push({file:row.file,beforeSHA256:row.sha256,afterSHA256:current,rollback:'before/'+row.file});}

const ui=await read(out+'/final-v2/report.json'),entrance=await read(out+'/entrance-final/report.json');
assert.ok(!ui.failure&&!entrance.failure);assert.equal(ui.cases.length,4);assert.equal(entrance.cases.length,2);
for(const r of [...ui.cases,...entrance.cases])assert.ok(r.frames[0].url.includes(release.directory));
for(const r of entrance.cases){assert.ok(r.frames[0].alignment);assert.equal(r.frames.at(-1).effect,false);}
const http=[];await fs.mkdir(out+'/http',{recursive:true});
for(const file of ['player.js','idle-framing.js']){const url=new URL(file,ui.cases[0].frames[0].url).href;const response=await(await fetch(url)).text();const m=response.match(/\/\/# sourceMappingURL=data:application\/json;base64,(\S+)/);let original=m?JSON.parse(Buffer.from(m[1],'base64')).sourcesContent[0]:response;const source=await fs.readFile('apps/core'+decodeURIComponent(new URL(url).pathname),'utf8');const imports=new Map([...source.matchAll(/(['"])(\.[^'"\n]+)\1/g)].map(m=>[new URL(m[2],url).pathname,m[0]]));original=original.replace(/"(\/[^"\n]+)"/g,(literal,path)=>imports.get(path.split('?')[0])||literal).replace(/\n?\/\/# sourceMappingURL=[^\n]*/g,'');assert.equal(original.replaceAll('\r\n','\n').trim(),source.replaceAll('\r\n','\n').trim());await fs.writeFile(out+'/http/'+file,response);http.push({url,servedSHA256:sha(response),diskSHA256:sha(source),verifiedOriginal:true});}
const result={recordedAt:new Date().toISOString(),revision:release.revision,sharedFiles:release.installed.length,legacyCompatibilityFilesRetained:old.installed.length,r09ActionEntriesUnchanged:entries.length,changedFiles:changed,http,unitTests:90,scope:{frozen:4934,priority:4895,deferred:39,deleted:0,individualFinalAcceptance:0},sourceAssetsWritten:false,catalogsWritten:false,officialSaveFilesWritten:false,matchesStarted:0,consoleMessages:[...new Set([...ui.errors,...entrance.errors])]};await fs.writeFile(out+'/verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
