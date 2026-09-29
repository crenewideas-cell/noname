# 棕色尘埃扩展

来源为 `temp/动态皮包/棕色尘埃图鉴`，输出为 `temp/动态皮包/棕色尘埃扩展`。这是当前本地动态皮肤系统的资源包，不注册虚构武将或技能。

生成器读取角色的 `resource_manifest.json`、其他素材索引及 `mod_runtime_index.json`，为每个独立骨骼保留一个稳定 ID。名称增加“棕色尘埃扩展 · ”前缀，原名保存在 `originalTitle`。角色、服装、形态及 Mod 来源记录在 `categoryPath` 和 `source` 中，同名 Mod 不合并。图鉴实际的页面名称是 `Mod` 和 `Mod2`；Shared Mod 的原始包名另行保留，不把 `Mod` 改写成 `Mod1`。

资源库通过可选的 `libraryGroup` 显示带扩展名前缀的原分类，原有包继续按角色分组。绑定组与显示分类分开，同一分类不等于同一角色。

## 生成、审核、导入

```powershell
node scripts/build-browndust-skins.mjs --plan
node scripts/build-browndust-skins.mjs
node scripts/audit-browndust-skins.mjs
node scripts/build-browndust-skins.mjs --catalog-only
node scripts/audit-browndust-skins.mjs --render --all --thumbnails
node scripts/build-browndust-skins.mjs --catalog-only
node scripts/import-dynamic-skins.mjs temp/动态皮包 --pack 棕色尘埃扩展
node scripts/audit-browndust-skins.mjs --render --installed
```

生成器不修改图鉴。骨骼、图集、贴图、语音按原路径复制到包内 `assets/`，`资源校验.json` 保存每个文件的 SHA-256。原分类清单和角色元数据另存于 `source-metadata/`。解析审核使用工程自带的 PIXI / Spine 4.1 读取器，并执行每个动作；模型指纹发生变化时拒绝复用过期审核结果。

`--pack` 只复制指定包，默认的 `pnpm skins:import` 仍可读取本包。安装在 `apps/core/extension/imports/本地动态皮肤包/棕色尘埃扩展/`，不依赖图鉴服务或图鉴的 Node 依赖。

游戏内打开“皮肤管理 → 动态资源与分配”，载入或刷新资源库，选择“棕色尘埃扩展”，再按分组筛选或搜索角色/服装。所有条目初始为游离动皮，通过现有分配功能绑定武将，不根据同名猜测归属。角色原版附带可用的原始语音，服装交互语音只跟随对应服装；不将原版语音擅自附到 Mod。

源图鉴中缺文件的条目保留在清单并标记不可用，具体路径见 `迁移报告.json`。补齐原文件后重新生成、审核和导入即可。

## 本次结果

共保留 1,185 条：角色 204、剧情 Cutscene 177、NPC / 杂项 25、Special / 活动 49、其他 9、对话 Talk 18、约会 / 插画 22、Mod 164、Mod2 517。6,741 个源资源文件按 SHA-256 校验，包含原始语音；所有物理图集都已纳入清单。

实际解析并执行 14,819 个动作，全量播放检查及兼容修复复测后，1,164 条可用并带有实际渲染的预览图。21 条保留待修复或配置：1 条源贴图缺失、14 条骨骼引用缺失的图集区域、4 条图集区域超出声明尺寸、2 条默认播放无可见边界（需配置骨骼皮肤或动作）。失败项详情在包内 `model-audit.json`、`render-audit.json`、`迁移报告.json` 和 `皮肤目录.csv`。

播放器沿用图鉴的待机动作优先规则，Spine 4.1 使用图集声明尺寸作为纹理坐标尺寸。全空白开场先推进到首个有几何内容的时刻再测量镜头；不会改写骨骼、图片或动作名称。现有动态皮肤测试 74 项通过。
