import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const groups=[
 ['complete-action-review',8,51,'115动作中点概览；早期参考Alpha配置不合格，保留诊断，不计颜色通过'],
 ['pma-pilot-review',2,3,'修正预乘Alpha后的20动作概览；固定相机仍为旧候选，待更新'],
 ['complete-artwork-pma-review',16,249,'1秒参考/候选联系表全部查看；检查主体、图层和暗块，不能替代连续录像'],
 ['gf-loading-candidate/overview',6,179,'Live2D候选1秒概览全部查看；尚无独立正确参考'],
 ['mjs-native-scope-candidate/overview',1,4,'原生4.2候选1秒概览全部查看；完整场景横向构图，待原始参考审查'],
 ['scene40-review',26,413,'源坐标4.0参考/候选1秒对照全部查看；几何普遍相同，但多个源坐标截掉主体，存在未解释混合差异，未通过取景验收'],
 ['spine40-declared-atlas-review',1,12,'实际缩放图集的声明尺寸适配后，12条参考/候选对照已查看；主体与附件恢复，连续时间和最终构图仍待验收'],
 ['spine40-complete-review',3,43,'完整场景参考/候选已查看；包含背景/特效独立资源和小主体，资源显示完整不等于整条人物皮肤完整'],
];
const reviewed=[];
for(const [folder,expected,skins,limitation] of groups){
 const files=(await fs.readdir(path.join(run,folder))).filter(f=>f.endsWith('.jpg')).sort();
 if(files.length!==expected)throw Error('Review evidence count mismatch: '+folder);
 reviewed.push({folder,skins,reviewedAt:new Date().toISOString(),level:'coarse-visual-overview',acceptancePassed:0,limitation,
  files:await Promise.all(files.map(async file=>({file,sha256:createHash('sha256').update(await fs.readFile(path.join(run,folder,file))).digest('hex')})))});
}
const observations=[
 ['04ddf0f51de3','可见人物仅占画框很小部分，远处附件/动作边界撑大固定相机；参考与候选均如此'],
 ['8cd2b9344f43','人物缩成底部小点；完整动作边界策略不能直接视为头像正确取景'],
 ['d29f2a81377e','主体下方出现明显暗色多边形，参考与候选均如此，需要核对源附件/混合语义'],
 ['1faeb18b2510','大面积暗色附件遮挡场景，需独立图层/混合核验'],
];
const document=JSON.parse(await fs.readFile(path.join(run,'defects.json')));
for(const record of [
 {id:'SPINE40-DECLARED-PAGE-UV',status:'code-fixed-12-failures-recovered-category-loading-checked',symptom:'PIXI checked atlas regions against resized physical images, rejecting 12 skins; official 4.0 uses declared page dimensions for UVs.',evidence:['spine40-declared-size-impact.json','spine40-declared-atlas-recheck/report.json','spine40-loader-all/report.json','lifecycle-declared-atlas-browser.json']},
 {id:'RESOURCE-URL-PATH-PUNCTUATION',status:'code-fixed-five-real-failures-recovered',symptom:'Escaped URI path punctuation was left encoded by Vite static serving, returning 404 for existing files.',evidence:['extension-url-before.log','extension-url-after.log','library-network-recheck-v2/report.json']},
 {id:'SPINE40-EMPTY-DEFAULT-SKIN',status:'code-fixed-unique-renderable-variant-captured',skinId:'base_88c084cfa2668f55',symptom:'Default skin contains no drawable attachment; the sole named drawable variant was never selected.',evidence:['spine40-skins-audit-texture-metadata.json','unique-renderable-skin/report.json']},
 {id:'SPINE38-NAMED-SKINS-CONTAINER',status:'code-fixed-official-decode-and-real-capture-passed',symptom:'Three 3.8.75 exports use the old name-keyed skins container, silently losing drawable attachments in PIXI.',evidence:['spine38-json-container-audit-v2.json','spine38-skins-container/report.json']},
 {id:'SOURCE-COORDINATES-NOT-VALIDATED-PORTRAIT',status:'open-category-framing-contract',symptom:'Independent 4.0 reference and candidate agree on source coordinates but can both crop the person out of the portrait. Source-coordinate agreement cannot authorize release.',evidence:['scene40-review/comparison.json','source-provenance.json']}
]){const at=document.defects.findIndex(d=>d.id===record.id);if(at<0)document.defects.push(record);else document.defects[at]=record;}
for(const [suffix,symptom] of observations){
 const entries=inventory.entries.filter(e=>e.id.endsWith(suffix));if(entries.length!==1)throw Error('Nonunique observed identity '+suffix);
 const e=entries[0],id='PMA-OVERVIEW-'+e.id;
 const record={id,skinId:e.id,title:e.title,symptom,status:'open-needs-source-semantics-review',evidence:['complete-artwork-pma-review/comparison.json']};
 const at=document.defects.findIndex(d=>d.id===id);if(at<0)document.defects.push(record);else document.defects[at]=record;
}
await fs.writeFile(path.join(run,'visual-review-20260926-additional.json'),JSON.stringify({reviewed,observations,acceptancePassed:0},null,2));
await fs.writeFile(path.join(run,'defects.json'),JSON.stringify(document,null,2));
console.log(JSON.stringify({reviewedGroups:reviewed.length,defects:document.defects.length}));
