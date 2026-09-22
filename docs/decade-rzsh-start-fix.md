# 如真似幻开始对局未加载十周年：修复记录

2026-09-22。用户报告：启用如真似幻后点击开始，局内没有迁移后的十周年外观。

## 原因与修正

内置 `builtin-rzsh` 和旧 `rzsh-modern` 登记清单只声明了 `home.runtime = rzsh`。工坊启动器按清单加载提供者，缺少任何 `runtime = decade` 部件时不会启用十周年。先前单独构造的组合 ZIP 绕过了这个缺口，未覆盖用户直接使用如真似幻的路径。

- 内置如真似幻现在默认包含完整十周年局内部件，同时保留原大厅。
- 读取/保存已有的“仅如真似幻大厅”记录时补齐局内默认方案；读取不覆盖数据库原记录，不生成额外副本。用户已经明确保存任意局内部件（包括空部件）时不自动替换该搭配。
- 登记用 `ui-workshop.json` 与内置方案同步生成；更新登记哈希，避免重新生成恢复大厅独占声明。
- 修正限于外观清单、兼容读取与生成器，没有更改游戏选择、技能、出牌、结算或联机业务。

涉及 `noname/ui/workshop/ingame.js`、`presets.js`、`service.js`、如真似幻 `ui-workshop.json` 及 `scripts/decade-inventory.mjs`。

## 实际验证

- `node --experimental-vm-modules --test scripts/ui-workshop.test.mjs scripts/decade-ingame.test.mjs`：13/13 通过。包含旧记录升级、不覆盖显式混搭和不变更旧存储等回归。
- `node scripts/decade-rzsh-start-regression.mjs`：Chrome 新用户配置中启用 `builtin-rzsh`，重新加载如真似幻大厅，鼠标点击真实画布控件“人机对战”和“开战”，进入本体选将。没有设置 directstart 跳过大厅。
- 实际状态：活动套装仍为 `builtin-rzsh`；9 个十周年局内部件启用，背景来自正式十周年目录，5 个武将装饰框，无页面错误。
- 证据：`references/decade-ingame-ui/evidence/rzsh-start-fix-tests.log`、`rzsh-start-fix-browser.json`，以及 `rzsh-start-fixed-lobby.png`、`rzsh-start-fixed-mode.png`、`rzsh-start-fixed-selection.png`。
- 两个交付 ZIP 同步更新并由实际工坊读写器完成序列化往返，见 `dist/ui/decade-export-report.json` 和 `rzsh-start-fix-export.log`。包读写不代表重新做了全部客户端导入验收。

## 使用

重启更新后的工程，再从如真似幻大厅开始对局即可。已经保存过明确局内混搭的用户，在工坊选“局内 UI 方案 → 十周年局内 UI”并应用；该操作保留大厅。无需清除存档或重建用户配置。

本次仅验证这个问题及其兼容路径，不声明完整迁移的所有视觉、玩法、原生平台或联网回归均通过。之前交接报告中的其它待验项目仍有效。
