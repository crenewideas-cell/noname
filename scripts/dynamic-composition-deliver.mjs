import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
import {publishDynamicRuntime} from './publish-dynamic-runtime.mjs';
const out='output/dynamic-remediation/20260926-r01/composition-r08',root='apps/core/extension/imports/本地动态皮肤包',pack=root+'/无名杀基础扩展';
const rows=JSON.parse(await fs.readFile(out+'/paired-candidates.json')),rollback=out+'/rollback';
await fs.mkdir(rollback+'/entries',{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex'),manifest=[];
for(const row of rows){const file=pack+'/entries/'+row.id+'.json',before=await fs.readFile(file),next=await fs.readFile(out+'/paired-entries/'+row.id+'.json');
 const a=JSON.parse(before),b=JSON.parse(next);if(JSON.stringify({...a,models:null})!==JSON.stringify({...b,models:null}))throw Error('Non-model data changed '+row.id);
 await fs.writeFile(rollback+'/entries/'+row.id+'.json',before,{flag:'wx'});
 manifest.push({id:row.id,file,beforeSHA256:sha(before),afterSHA256:sha(next)});
}
await fs.writeFile(rollback+'/entry-manifest.json',JSON.stringify(manifest,null,2),{flag:'wx'});
await fs.copyFile('apps/core/noname/skin/localDynamic/runtime-release.js',rollback+'/runtime-release.js',fs.constants.COPYFILE_EXCL);
for(const row of manifest){await fs.copyFile(out+'/paired-entries/'+row.id+'.json',row.file);if(sha(await fs.readFile(row.file))!==row.afterSHA256)throw Error('Entry delivery verification failed');}
const release=await publishDynamicRuntime(root,{evidenceDirectory:out+'/release'});
await fs.writeFile(out+'/delivery.json',JSON.stringify({entries:manifest.length,release},null,2));console.log(JSON.stringify({entries:manifest.length,revision:release.revision}));
