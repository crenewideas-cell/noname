import fs from 'node:fs/promises';
import path from 'node:path';
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const inventory=JSON.parse(await fs.readFile(path.join(run,'inventory.json')));
const images=JSON.parse(await fs.readFile(path.join(run,'linked-deform-review/image-differences.json')));
// Human/model visual observations from the displayed contact sheets, not a
// heuristic that silently turns pixel similarity into a correctness pass.
const observations=[
 ['bd938b0f0a3b','主体被独立矩形画面包围，和背景合成关系需核实'],
 ['d60d5c4185cd','主体很小，画框大部空白'],
 ['1bcc88472205','主体位于底部，大部画框空白'],
 ['cd4edb1457f7','主体在底部小块画面内，顶部大片空白'],
 ['01adabfe8d76','仅见小片场景和极少角色，大片空白'],
 ['d49865502b98','主体上部被裁出，底部大片空白'],
 ['906150cf7006','角色很小，主体位置和上下层取景需核实'],
 ['82c172350d6f','上半画框空白，主体及叶片位于下部'],
 ['6e12f7c5bf94','上下叠置小块场景，主体与画框关系异常'],
 ['4d0d3d2de0d6','上下叠置小块场景，主体与画框关系异常'],
 ['9a616bfafdca','上下叠置小块场景，主体与画框关系异常'],
 ['489bf9bbb39d','上下叠置小块场景，主体与画框关系异常'],
 ['b5444d73abdc','上半为大面积特效/空白，主体压在下方'],
 ['3f3aebcf7b26','一秒帧只见局部色块，需区分动作时刻和取景问题'],
 ['3139301f761e','头部被画框裁出，仅见躯干'],
 ['ec3c7fffb9b1','头部被画框裁出，仅见躯干'],
];
const defects=[
 {id:'RENDER-LINKED-DEFORM',status:'code-fixed-validation-in-progress',symptom:'3.6关联网格丢失父网格变形',evidence:['reference/comparisons-before-linked-deform-all.jsonl','reference/comparisons.jsonl','linked-deform-impact.json'],scope:'309 models / 296 skins'},
 {id:'RENDER-42-JSON',status:'code-fixed-browser-contract-passed',symptom:'4.2 JSON被当成二进制读取',evidence:['runtime-contract-browser.json']},
 {id:'PLAYBACK-ZERO-SPEED',status:'code-fixed-browser-contract-passed',symptom:'speed=0被默认值1覆盖',evidence:['runtime-contract-browser.json']},
 ...[['base_2ffdbe289f05a565','顶部空带'],['base_548a5def3d1b73f9','主体裁出'],['base_9ad4a25a34ccc857','人物过度放大']].map(([skinId,symptom])=>({id:'USER-'+skinId,skinId,symptom,status:'open',evidence:['baseline-images/report.json','source-views/report.json']}))
];
const unmatched=[];
for(const [suffix,symptom] of observations){const e=inventory.entries.filter(e=>e.id.endsWith(suffix));if(e.length!==1){unmatched.push(suffix);continue;}defects.push({id:'VISUAL-'+e[0].id,skinId:e[0].id,title:e[0].title,symptom,status:'open-needs-full-size-and-time-review',beforeAndCandidate:true,evidence:['linked-deform-review/image-differences.json']});}
const historical=new Map();
for(const file of await fs.readdir('scripts'))if(/^dynamic-(?:.*regression|.*preservation|case-analysis)\.mjs$/.test(file)){const text=await fs.readFile(path.join('scripts',file),'utf8');for(const id of new Set(text.match(/base_[0-9a-f]{16}/g)||[])){if(!historical.has(id))historical.set(id,[]);historical.get(id).push('scripts/'+file);}}
for(const [skinId,sources] of historical)if(!defects.some(d=>d.skinId===skinId))defects.push({id:'HISTORY-'+skinId,skinId,status:'historical-case-pending-revalidation',sources,meaning:'Historical fixture may be a defect or a preservation control; no inherited pass/fail conclusion'});
const review={reviewedAt:new Date().toISOString(),reviewedSheets:13,overviewSkinCount:images.expected,frameSeconds:1,reducedSize:{width:120,height:180},level:'coarse before/candidate visual overview, not full-size or temporal acceptance',observations:observations.length,unmatchedSuffixes:unmatched,acceptancePassed:0};
if(unmatched.length)throw Error('Observation identity mismatch: '+unmatched.join(','));
await fs.writeFile(path.join(run,'linked-deform-review/visual-review.json'),JSON.stringify(review,null,2));
await fs.writeFile(path.join(run,'defects.json'),JSON.stringify({review,defects},null,2));console.log(JSON.stringify({review,defects: defects.length}));
