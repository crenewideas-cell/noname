# 曹髦、势小乔、势魏延资源导入

来源：`temp/动态皮包/势魏延/` 中的六个 ZIP。运行 `python scripts/import-shi-resources.py` 可重复执行；不同内容的已有素材会拒绝覆盖，原压缩包不删除。

已复用工程的 `mb_caomao`、`pot_xiaoqiao`、`pot_weiyan`，未注册新武将、技能或旧扩展。

| 武将 | 导入结果 |
| --- | --- |
| 手杀曹髦 | 两套「枭龙破渊」动皮的 34 个源文件与已有素材完全一致，复用原条目、模型及构图；补入第二套封面和语音。新增「枭龙破渊2」「经典形象2」静态皮肤及对应原画。 |
| 势小乔 | 新增「势小乔·扩展原画」、技能/阵亡/胜利语音；独立皮肤目录避免被普通小乔的共享别名遮蔽。 |
| 势魏延 | 新增扩展原画、形态二、形态三、性转四张皮肤，前三张同时保留高清原画。明确对应的狂骨、壮誓、饮战、困奋语音映射至现有技能名。 |

刷新游戏后，在千幻聆音对应武将的皮肤页选择。曹髦动皮的语音清单可在动态交互界面使用；静态皮肤配套语音走千幻的原有替换机制。魏延各形态作为可选皮肤提供，不自动改写现有使命技换肤。未明确对应的使命语音和 BGM 留在补充资源目录，没有猜测映射。

23 套技能/界面特效、美化图片及相关音频保存在 `apps/core/extension/imports/本地动态皮肤包/势武将资源补充/`。绝进使用「二合一黄修」整套模型、图集和贴图，未混用旧版页面。这里是资源导入，**未接入旧扩展的自动技能特效和自定义技能面板**；原 `extension.js`、`animationlist.js`、`markskill.js` 不加载。小乔和魏延包的这些骨骼是界面/技能特效，不登记为人物动皮。

22 套特效通过当前 Spine 解析器验证。`SS_CM_2025zhenwang.skel` 的源图集缺少 `texture/rwmhgx/rwmhgx_00059`，标记不可用并保留原始字节；详见同目录 `effect-validation.json`。未修复或启用这个残缺效果。

「曹髦版刘谌」实际上包含自定义武将、自定义势力框、音乐和视频，与上述三位武将没有明确绑定，故仅记录来源，不安装这些内容。

动皮补充媒体配置保存在基础包的 `resource-supplements.json`，后续 `skins:import` 会保留封面、语音补充。静态皮肤和原画沿用当前千幻资源目录和索引；素材哈希、来源和去重信息见 `resource-manifest.json`。修改前的动皮元数据备份位于 `temp/shi-resource-import/before/`。

验证命令：

```powershell
node scripts/audit-shi-resources.mjs
node scripts/shi-resources-browser.mjs
node scripts/audit-dynamic-import.mjs
node --test scripts/dynamic-import.test.mjs scripts/dynamic-extension-url.test.mjs
```

浏览器验证使用独立临时存档，检查七张静态皮肤可列出、图片可解码、语音替换生效，以及曹髦两套动态预览就绪和 1 / 18 条语音清单。结果与截图位于 `output/shi-resource-import/`。全量已有动皮依赖检查通过，未发现缺失引用；未将解析成功视为所有技能特效都已完成视觉验收。
