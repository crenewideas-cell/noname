import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const dir=path.join(run,'live2d-declared-idle-all');
const impact=JSON.parse(await fs.readFile(path.join(dir,'impact.json')));
const results=JSON.parse(await fs.readFile(path.join(dir,'report.json')));
if(impact.count!==8||results.length!==16)throw Error('Incomplete declared-idle evidence');
const hash=async file=>createHash('sha256').update(await fs.readFile(file)).digest('hex');
const rows=[];
for(const e of impact.entries){
 const pair=results.filter(r=>r.before.id===e.id),before=pair.find(r=>!r.candidate),candidate=pair.find(r=>r.candidate);
 if(!before||!candidate||before.after.looping||!candidate.after.looping||candidate.after.restarts!==0)throw Error('Loop regression '+e.id);
 const sheet=path.join(dir,'boundary-frames',e.id+'-boundaries.jpg');
 rows.push({...e,beforeRestarts:before.after.restarts,candidateRestarts:candidate.after.restarts,observedSeconds:candidate.observedSeconds,
  evidence:await Promise.all([sheet,before.video,candidate.video].map(async file=>({file:path.relative(run,file),sha256:await hash(file)}))),
  visualReview:'Six actual recorded-video boundary frames per variant viewed at full logical frame size.',
  observation:e.id==='gf_jiangyu_dress'?'Both source login clips include dark fades and large black surrounds. Timer restart defect is fixed; idle/action choice and presentation remain open.':'No new missing body, layer, or crop observed at the sampled loop boundaries. This is a temporal regression check, not whole-skin acceptance.'});
}
await fs.writeFile(path.join(dir,'visual-review.json'),JSON.stringify({reviewedAt:new Date().toISOString(),skins:8,clips:16,frames:96,acceptancePassed:0,rows},null,2));
const document=JSON.parse(await fs.readFile(path.join(run,'defects.json')));
for(const record of [
 {id:'LIVE2D-DECLARED-IDLE-LOOP',status:'code-fixed-all-affected-temporal-regression-passed',skinIds:impact.entries.map(e=>e.id),symptom:'Declared idle names outside a regex were forcibly made one-shot and restarted by a timer, conflicting with SDK idle playback.',evidence:['live2d-declared-idle-all/report.json','live2d-declared-idle-all/visual-review.json']},
 {id:'LIVE2D-LOGIN-IDLE-PRESENTATION',skinId:'gf_jiangyu_dress',status:'open-source-action-selection-review',symptom:'The selected login_1 motion includes dark scene fades on each loop; source Loop=true is preserved but does not independently certify idle selection.',evidence:['live2d-declared-idle-all/boundary-frames/gf_jiangyu_dress-boundaries.jpg']}
]){const at=document.defects.findIndex(d=>d.id===record.id);if(at<0)document.defects.push(record);else document.defects[at]=record;}
await fs.writeFile(path.join(run,'defects.json'),JSON.stringify(document,null,2));
console.log(JSON.stringify({reviewed:rows.length,defects:document.defects.length}));
