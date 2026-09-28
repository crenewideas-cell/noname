import fs from 'node:fs/promises';import path from 'node:path';
const root='output/dynamic-remediation/20260926-r01/composition-r08';
const text='最新进展为R08分层坐标与构图整改：公共播放器3705419a383cb98d1a2a；依据共同静态根组与同源模型检查更新260条生成entry的models，原始catalog/素材/存档未改。虚拟天团、花好月圆、明智春馨、智飞巧慧、临水照花五项构图反馈已在真实千幻预览及缩略图复核；万圣节wife_full4_3036源切边独立官方参考同样存在，仍未修复。71+3+2测试通过；六条两周期与三尺寸抽测通过不等于全库视觉验收。真实对局60秒动态宿主正常播放，但ArrayCompiler.ts:26:34异常阻断回合，对局耐久失败。四包仍共用一个公共播放器，旧a5兼容副本保留。冻结4934/优先4895/暂缓39/删除0/逐条最终验收0不变。详情docs/dynamic-skin-composition-r08.md，收尾output/dynamic-remediation/20260926-r01/composition-r08/composition-close.json，画面对照同目录review.html。完整R07回退需同时恢复260条entry与rollback/runtime-release.r07.js；不要误用过渡版本指针。以下历史记录保留。\n\n';
for(const file of ['docs/dynamic-skin-next-window-prompt.txt','docs/dynamic-skin-runtime-delivery.md','docs/dynamic-skin-shared-runtime.md','docs/dynamic-skin-remediation-status.md','docs/dynamic-skin-new-chat-handoff.md']){
 const previous=await fs.readFile(file,'utf8');if(previous.startsWith(text))continue;
 await fs.mkdir(root+'/rollback/docs',{recursive:true});await fs.writeFile(root+'/rollback/docs/'+path.basename(file),previous,{flag:'wx'});
 const temp=file+'.r08.tmp';await fs.writeFile(temp,text+previous);await fs.rename(temp,file);
}
await fs.writeFile(root+'/rollback/README.md',`R08回退归档（不自动执行）\n\nentry-manifest.json：260条entry的原始SHA256和最终SHA256。先确认当前文件仍等于afterSHA256，再逐项恢复entries原件。不要覆盖后续修改。\n\nruntime-release.r07.js：完整R07版本388431d798e52a6d7814。恢复entry后配套恢复此指针。\nruntime-release.js：entry交付前的过渡3705419a383cb98d1a2a，不是完整回退指针。\nentry-manifest.initial.json：添加旧播放器兼容字段前的中间记录。\ndocs：本轮添加R08提示之前的完整文档。\n\n旧公共发布目录及四个a5兼容副本仍在，不删除。源素材、原catalog、正式存档没有写入。源码回退按before目录快照逐文件对比，保留其他任务改动。\n`);
console.log('Updated R08 handoff; preserved prior documents.');
