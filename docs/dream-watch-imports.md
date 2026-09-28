# 星之梦、云中守望导入记录

来源为 `temp/扩展武将/星之梦.zip`（凌梦，1.11.5）和 `temp/扩展武将/云中守望.zip`（守望，1.55），原始 ZIP 保留。

| 扩展 | 原可用武将定义 | 排除重复 | 导入 | 武将菜单位置 |
| --- | ---: | ---: | ---: | --- |
| 星之梦 | 256 | 11 | 245 | PXLNGU → 星之梦 |
| 云中守望 | 48 | 0 | 48 | PXLNGU → 云中守望 |

两个扩展首次登记默认启用，武将子包也在首次加载时自动启用，桌面与移动端一致；之后保留用户手动关闭的选择。正在运行的游戏需要重新加载源码版本。既有 EXE/APK 不会随源码自动更新。

## 去重依据

对本体和当前目录索引内有效武将扩展进行了静态扫描，共检查 6812 条定义，并另外核对已安装扩展登记表。同 ID 保留项目现有实现，不导入压缩包中的同 ID 定义；不同 ID 但性别、势力、体力、体力上限和技能组合相同的条目也排除。同名但技能不同的旧版、DIY 版本保留，不按历史人物姓名直接合并。

| 未导入 ID | 名称 | 项目现有 ID |
| --- | --- | --- |
| old_zhugejin | 旧诸葛瑾 | zhugejin |
| old_zhanghua | 旧张华 | zhanghua |
| old_re_zhangchunhua | 旧界张春华 | re_zhangchunhua |
| old_sp_zhujun | 旧严朱儁 | sp_zhujun |
| old_sp_lvfan | 旧严吕范 | sp_lvfan |
| old_pot_dengai | 旧势邓艾 | old_pot_dengai |
| wangtaowangyue | 王桃王悦 | bilibili_wangwang |
| unlock_dongzhao | OL董昭 | ol_dongzhao |
| unlock_tianchuan | 田钏 | yj_tianchuan |
| pot_xiaoqiao | 势小乔 | pot_xiaoqiao |
| v_mateng | 威马腾 | v_mateng |

星之梦另有 9 个无性别、无技能、隐藏的头像占位定义，不作为武将导入，不计入上述 256 名武将。重复定义已从源码删除，对应武将分类和元数据也已清理；原素材保留以支持其他技能的动态资源引用。

## 兼容处理

- 采用本体 `game.import` 登记武将和配套卡牌，等待登记完成后继续启动。武将 ID 保持原名；星之梦与项目重名的技能及其卡牌定义采用 `xzm_` 内部前缀，语音继续使用原资源名。
- 本次接入范围为武将、配套技能、卡牌、立绘和语音。源包额外的联机协议替换、大厅改造、独立模式、远程更新和资源同步功能不接入；云中守望保留武将实际调用的工具函数。
- 星之梦 3 个过时的技能引用对应为本体现有的 `dczhongji`、`twjiwei`、`nzry_jieying`。3 张缺失的本体立绘改用项目已有同人物立绘：谌祗、陆抗、孙权。
- 云中守望修正配套卡牌遗漏的 `game/ui` 导入；“渐营”引用实际存在的 `buff` 子技能；移除原包残留的 `swq_gushou_reset` 和已注释的 `swe_tianqi_fail` 引用。“固守”原有回合结束清理回调保留。
- 清理两个包指向不存在武将的分类项。源包未提供雕弓图片，使用引擎文字卡牌展示。

## 验证

- `node --experimental-vm-modules --test scripts/dream-watch-imports.test.mjs`：模块加载、导入数量、剔重结果、立绘文件、语法、默认配置和关闭选择保留。
- `node --import tsx --test scripts/extension-organizer/registration.test.ts`：登记与移动端默认启用回归。
- 使用隔离浏览器存档同时开启两个扩展，进入身份模式选将；检查 293 名武将注册、启用状态、直接技能及 `group/inherit` 依赖、页面异常。
- 既有 `groups.test.ts` 另有 3 项失败，涉及界面扩展和未知扩展的分组预期；本次未修改分组函数，它们与两个新增武将包无关。

完整武将名单、排除依据、同名版本对照、来源 SHA-256 与内部名称映射见 `apps/core/game/dream-watch-imports.json`。文件哈希及武将包标识同步记录在 `organized-extensions.json`。加载检查不等于逐个技能完成整局对局测试。
