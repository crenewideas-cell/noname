import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const out='output/dynamic-remediation/20260926-r01/experience-r09/actions',root='apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展',sha=b=>createHash('sha256').update(b).digest('hex');
const impact=JSON.parse(await fs.readFile(out+'/impact.json'));
await fs.mkdir(out+'/rollback',{recursive:true});
const pilot=process.env.SKIN_ACTION_PILOT?.split(',');
const rows=impact.rows.filter(r=>r.accepted.length&&(!pilot||pilot.includes(r.id)));
for(const r of rows){const file=root+'/entries/'+r.id+'.json',old=await fs.readFile(file),next=await fs.readFile(out+'/entries/'+r.id+'.json');if(sha(old)===r.afterSHA256)continue;if(sha(old)!==r.beforeSHA256||sha(next)!==r.afterSHA256)throw Error('Entry changed '+r.id);await fs.writeFile(out+'/rollback/'+r.id+'.json',old,{flag:'wx'});await fs.writeFile(file+'.r09.tmp',next);await fs.rename(file+'.r09.tmp',file);}
console.log(JSON.stringify({delivered:rows.length,pilot:!!pilot}));
