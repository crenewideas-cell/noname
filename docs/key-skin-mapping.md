# 键社 · 键社新装：中文名称映射

在皮肤管理器选择“键社”，点击“键社 · 键社新装 → 一键应用整套”。也可切换到“键社 · 旧版皮肤”。新套装只影响下列 19 个角色 ID，其余键社角色保留原选择。

来源：`temp/静态皮肤_KEY社`。映射依据本体 `character/key/translate.js`，使用精确名称和“瀬／濑”字形归一，未进行随机匹配。所有图片原样复制，清单保存 SHA-256。分配确认后，19 个源文件从 temp 移除。

| 源文件 | 中文显示名称 | 武将 ID | 目标文件 |
| --- | --- | --- | --- |
| 七瀬留美.jpg | 七濑留美 | `key_rumi` | `new/key_rumi.jpg` |
| 仲村由理.jpg | 仲村由理 | `key_yuri` | `new/key_yuri.jpg` |
| 冈崎朋也.jpg | 冈崎朋也 | `key_tomoya` | `new/key_tomoya.jpg` |
| 加藤うみ.jpg | 加藤羽未 | `key_umi` | `new/key_umi.jpg` |
| 古河渚.jpg | 古河渚 | `key_nagisa` | `new/key_nagisa.jpg` |
| 国崎往人.jpg | 国崎往人 | `key_yukito` | `new/key_yukito.jpg` |
| 宫泽有纪宁.jpg | 宫泽有纪宁 | `key_yukine` | `new/key_yukine.jpg` |
| 春原阳平&春原芽衣.jpg | 春原阳平&春原芽衣 | `key_sunohara` | `new/key_sunohara.jpg` |
| 枣恭介.jpg | 枣恭介 | `key_kyousuke` | `new/key_kyousuke.jpg` |
| 此花露西娅.jpg | 此花露西娅 | `key_lucia` | `new/key_lucia.jpg` |
| 水瀬秋子.jpg | 水濑秋子 | `key_akiko` | `new/key_akiko.jpg` |
| 神尾晴子.jpg | 神尾晴子 | `key_haruko` | `new/key_haruko.jpg` |
| 神尾观铃.jpg | 神尾观铃 | `key_misuzu` | `new/key_misuzu.jpg` |
| 美坂栞.jpg | 美坂栞 | `key_shiori` | `new/key_shiori.jpg` |
| 美坂香里.jpg | 美坂香里 | `key_kaori` | `new/key_kaori.jpg` |
| 远野小满.jpg | 远野小满 | `key_michiru` | `new/key_michiru.jpg` |
| 远野美凪.jpg | 远野美凪 | `key_minagi` | `new/key_minagi.jpg` |
| 雾岛佳乃.jpg | 雾岛佳乃 | `key_kano` | `new/key_kano.jpg` |
| 鹰原羽未.jpg | 鹰原羽未 | `key_umi2` | `new/key_umi2.jpg` |

套装文件位于 `apps/core/extension/packs/键社/image/skin-sets/`，`new/` 存新图，`original/` 存旧图；完整映射和哈希记录在同目录的 `manifest.json`。两套图片均随扩展携带，与怒焰三国使用相同的扩展资源路径、套装清单和管理服务。

“加藤うみ”精确匹配 `key_umi`，皮肤管理器中以中文“加藤羽未”显示；“鹰原羽未”单独匹配隐藏形态 `key_umi2`，两张图片不会混用。单独应用加藤羽未的新套装时，也会应用对应的鹰原羽未形态图片；恢复或禁用时一并处理。

本体没有 `image/character/key_umi2.jpg`，旧套装已复制 `key_umi.jpg` 为扩展内的 `original/key_umi2.jpg`，导出时无需引用本体原画。新套装始终使用提供的“鹰原羽未.jpg”。“水瀬秋子”“七瀬留美”分别归一为“水濑秋子”“七濑留美”。

导入与复核：`node scripts/complete-static-skin-sets.mjs`；校验后移除源文件：`node scripts/complete-static-skin-sets.mjs --consume`。重复执行不会重新随机分配或覆盖已保存的映射。
