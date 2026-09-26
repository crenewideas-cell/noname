import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const entries=(await read('apps/core/extension/ui/动态皮肤验证扩展/catalog.json')).entries;
const rendered=await read('output/dynamic-samples/render-report.json');
const interactions=await read('output/dynamic-samples/interaction-report.json');
const integration=await read('output/dynamic-samples/integration-report.json');
assert.equal(rendered.length,64);assert.equal(interactions.length,38);
assert.ok([...rendered,...interactions,...integration].every(r=>!r.failure&&!r.errors.length));
const lines=['# 动态皮肤逐样本验收','',
 '浏览器渲染与动作加载全部通过。语音列是该样本引用的语音条目数（角色多个皮肤共用的语音清单可能重复），不代表全部自动关联。区域列为原始区域数 / 无对应动作数。完整边界见 [验收说明](dynamic-samples-validation.md)。','',
 '| 样本 ID | 分组 | 角色 | 格式 | 动作 | 区域 / 缺映射 | 表情动画 | 语音条目 | 输入与控制 |',
 '|---|---|---|---|---:|---:|---:|---:|---|'];
for(const e of entries){
 const r=rendered.find(r=>r.id===e.id),i=interactions.find(r=>r.id===e.id);assert.ok(r);
 const input=i?(r.info.hits.length?'鼠标/触屏、跟随、参数、图元通过':e.motions.some(m=>/^touch_/.test(m))?'通用触摸、跟随、参数、图元通过；无部位定义':'跟随、参数、图元通过；无部位定义'):(r.pointerPreview?'鼠标/触屏轮播、图层通过':'待机、图层通过');
 lines.push(`| ${e.id} | ${e.testCategory} | ${e.character} | ${e.type} | ${r.actions.length} | ${r.info.hits.length} / ${r.unmapped.length} | ${r.info.expressions.length} | ${r.info.voices.length} | ${input} |`);
}
await fs.writeFile('docs/dynamic-samples-results.md',lines.join('\n')+'\n');
console.log('Wrote 64 sample results');
