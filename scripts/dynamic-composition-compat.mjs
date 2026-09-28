import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {avatarLayerTransform as oldTransform} from '../apps/core/noname/skin/localDynamic/releases/runtime-388431d798e52a6d7814/composition.js';
const root='output/dynamic-remediation/20260926-r01/composition-r08',file=root+'/rollback/entry-manifest.json',rows=JSON.parse(await fs.readFile(file)),sha=b=>createHash('sha256').update(b).digest('hex');
await fs.copyFile(file,root+'/rollback/entry-manifest.initial.json',fs.constants.COPYFILE_EXCL);
for(const row of rows){const bytes=await fs.readFile(row.file);assert.equal(sha(bytes),row.afterSHA256);const entry=JSON.parse(bytes),m=entry.models.at(-1),c=m.sceneCoordinates;
 m.layerRegistration={transform:c.transform,source:c.rule,samples:c.samples};
 assert.deepEqual(oldTransform(entry,1,{height:1},{height:1}),c.transform,'retained pre-R08 player understands the scene coordinates');
 const next=Buffer.from(JSON.stringify(entry));await fs.writeFile(row.file,next);await fs.writeFile(root+'/paired-entries/'+row.id+'.json',next);row.afterSHA256=sha(next);
}
await fs.writeFile(file,JSON.stringify(rows,null,2));await fs.writeFile(root+'/compatibility.json',JSON.stringify({entries:rows.length,oldPlayerRegistration:true,visualTransformsUnchanged:true},null,2));console.log('Preserved old-player registration compatibility',rows.length);
