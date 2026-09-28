import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const out='output/dynamic-remediation/20260926-r01/skill-effects-r12';
const read=async p=>JSON.parse(await fs.readFile(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const v=await read(out+'/verification.json'),audit=await read(out+'/metadata-audit.json');
const ui=[];
for(const folder of ['final','fire-form','modern-control']){
 const r=await read(out+'/'+folder+'/report.json');assert.ok(!r.failure);
 for(const c of r.cases){assert.ok(c.finished);assert.ok(c.before.url.includes(v.revision));const f=c.frames.find(f=>f.visible==='visible');assert.ok(f);assert.equal(f.rect.width,f.viewport.width);assert.equal(f.rect.height,f.viewport.height);}
 ui.push({report:folder+'/report.json',cases:r.cases.length});
}
await fs.mkdir(out+'/rollback/docs-original',{recursive:true});
await fs.writeFile(out+'/rollback/manifest.json',JSON.stringify({targetRevision:'57ad14bfa7eb38c0ce3d',files:v.changedFiles,entriesChanged:0,legacyCompatibilityRetained:100},null,2));
await fs.writeFile(out+'/rollback/README.md',`# R12 回退归档

未执行回退。目标为 R11 公共播放器 57ad14bfa7eb38c0ce3d。

关闭动态皮肤页面；先确认 verification.json 五个 changedFiles 仍匹配 afterSHA256，避免覆盖后续修改。只将 ../before/<原路径> 的对应原字节恢复，包含 effect-host.js 与 runtime-release.js；不要覆盖目录。保留新增测试及全部不可变 release、过渡版本和旧 a5 的 100 文件。源素材、entry、catalog、正式存档均未改，不需要恢复。docs-original 保存本轮更新前的接续文档字节。禁止 reset/clean。
`);
const summary='最新进展为R12技能特效路由修复：公共播放器76a45a82cbc187aa950c；确认全屏层已有，合并骨骼TeShu/Jineng误走头像裁剪属于BUG，已接入同源已核验屏幕动作并按整段几何包络适配。基础包293条同类元数据适用，不等于逐条验收。实际千幻页面三种势魏延、魏延显式技能、荀彧4.0技能消息入口抽测，特效出框并恢复；93项测试与实际HTTP核验通过。未开对局，游戏自然触发由用户测试。视频中按具体技能切换多形态/连续分镜尚未完整实现，部分导入特效背景切片边界仍有差异，不宣称一比一复现。R11貂蝉两图修复及R10性能/出场对齐保留。旧a5的100文件、R09的1214动作条目不变；源素材、catalog、正式存档未改。大乔缺脚、万圣节源切边仍未解决。冻结4934/优先4895/暂缓39/删除0/逐条最终验收0不变。详情docs/dynamic-skin-skill-effects-r12.md，收尾skill-effects-r12/skill-effects-close.json，回退同目录rollback/README.md。以下历史保留。\n\n';
const docs=['docs/dynamic-skin-next-window-prompt.txt','docs/dynamic-skin-runtime-delivery.md','docs/dynamic-skin-shared-runtime.md','docs/dynamic-skin-remediation-status.md','docs/dynamic-skin-new-chat-handoff.md'],changes=[];
for(const file of docs){const before=await fs.readFile(file);if(before.toString().startsWith(summary))continue;await fs.writeFile(out+'/rollback/docs-original/'+path.basename(file),before,{flag:'wx'});const after=Buffer.from(summary+before.toString());await fs.writeFile(file+'.r12-tmp',after);await fs.rename(file+'.r12-tmp',file);changes.push({file,beforeSHA256:sha(before),afterSHA256:sha(after)});}
if(changes.length)await fs.writeFile(out+'/rollback/docs-original/manifest.json',JSON.stringify(changes,null,2));
const close={recordedAt:new Date().toISOString(),revision:v.revision,scope:v.scope,sharedFiles:30,legacyCompatibilityFilesRetained:100,r09ActionEntriesUnchanged:1214,changedRuntimeFiles:v.changedFiles,unitTests:93,actualUI:ui,validationMode:'Real game skin UI; injected skill message to production player; no match started',metadataApplicable:audit.discoveredSameRigSkills,verification:'verification.json',documentation:'docs/dynamic-skin-skill-effects-r12.md',rollback:'rollback/README.md',remaining:['Skill-specific multi-form and cinematic state machine not fully implemented','Imported background slices can retain visible edges in screen effects','Natural match trigger acceptance delegated to user','Daqiao foot and Halloween source edge defects unresolved']};
await fs.writeFile(out+'/skill-effects-close.json',JSON.stringify(close,null,2));
const figure=(label,src)=>`<figure><figcaption>${label}</figcaption><img loading="lazy" src="${src}"></figure>`;
await fs.writeFile(out+'/review.html',`<!doctype html><html lang="zh"><meta charset="utf-8"><title>R12 技能特效路由</title><style>body{max-width:1500px;margin:32px auto;padding:0 24px;background:#17202b;color:#eee;font:16px/1.6 system-ui}section{display:flex;gap:18px}article{padding:20px;margin:24px 0;background:#242f3d}figure{flex:1;min-width:0;margin:0}img{width:100%}a{color:#9fd4ff}</style><h1>技能动画从头像裁剪切换到屏幕层</h1><p>公共播放器 ${v.revision} · 93项测试通过。实际游戏千幻页注入技能消息，未启动对局。</p><p>修复合并骨骼 TeShu/Jineng 的路由。按技能切形态和连续分镜未完整实现，导入背景切片仍可能有边界；不能当作原视频的一比一复现。</p><p><a href="skill-effects-close.json">收尾记录</a> · <a href="verification.json">代码核验</a> · <a href="rollback/README.md">回退</a></p><article><h2>势魏延·狂志吞天</h2><section>${figure('修复前：技能留在头像内','before/base_c91c6e99ad20de11-1500.png')}${figure('修复后：在屏幕层播放','final/base_c91c6e99ad20de11-700.png')}</section></article><article><h2>同类另两形态（各自皮肤的动作）</h2><section>${figure('火焰形态','fire-form/base_a2f334bef37e642b-700.png')}${figure('旗帜形态','final/base_fa2f27cbb12d918e-700.png')}</section></article><article><h2>Spine 4.0 JiNeng 与恢复待机</h2><section>${figure('技能','modern-control/base_013338968fd64bed-700.png')}${figure('恢复','modern-control/base_013338968fd64bed-finished.png')}</section></article></html>`);
console.log(JSON.stringify({close:out+'/skill-effects-close.json',docsUpdated:changes.length,actualUICases:ui.reduce((n,r)=>n+r.cases,0)}));
