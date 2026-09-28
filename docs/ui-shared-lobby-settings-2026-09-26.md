# 公共大厅设置 UI

所有大厅沿用 `noname/ui/lobbySettings.js` 和本体 `ui/create/menu` 创建、保存设置；没有在各个 UI 提供方复制设置表单或配置回调。

- 新增 `layout/default/lobby-settings.css`，由本体初始化统一加载。大厅设置、右下角加号的公共菜单直接使用十周年 `tnode-C1/C4` 原图的雕花金边红色按钮，搭配原有手杀书法字体、暗金页签和沙金色内容区。素材出处见 `image/lobby/SOURCE.md`。
- 设置窗口按可用屏幕尺寸布局，不再缩放固定的 580×460 小窗口，也不把内容横向撑满整屏。1920×1080 下内容框最大宽度 1360px，正文 24px；顶部导航与面板等宽连接；960×540 下使用紧凑布局和独立滚动区域。
- 所有大厅设置保留开始、选项、武将、卡牌、扩展、其它六个分页。统一深色正文、红褐色选项值及清晰的开关状态，固定保留一个“完成 · 返回大厅”出口。
- UI 工坊皮肤规则排除公共设置和工具菜单，防止切换主题后覆盖公共外观。局内菜单仍使用各自主题。
- `lobbyTools.js` 复用一个“大厅设置”入口。只有提供方具有独立功能时才展示“界面专属设置”。
- 修正宽屏右侧下拉菜单的横向溢出，并在关闭设置时清理大厅设置状态。
- 打开设置时将已有底层大厅、武将页工具栏等设为透明且 inert，关闭后恢复先前状态。宿主窗口使用不透明背景，避免高层级按钮或局内画面露在设置页周围。
- 皮肤大厅与武将详情的“皮肤管理”共用 `qianhuan.css` 中的同一按钮样式和 `wujiang.png / biaojibeijing` 图集边框。删除详情页另画的斜角金框、图标，以及大厅独立重写的外观和图集计算。

## 验证

运行本地 Vite 和文件服务后执行：

```text
node scripts/lobby-settings-regression.mjs
node scripts/skin-entry-style-browser.mjs
node --experimental-vm-modules --test scripts/ui-workshop.test.mjs
```

浏览器回归覆盖内置、墨金、十周年、如真似幻和手杀：公共工具入口、窗口尺寸/配色、开关保存、人数下拉保存及对齐、弹层屏幕边界、六分页、返回大厅、重新打开复用同一菜单、小屏边界，以及页面异常检查。

测试隔离配置，不改动用户保存的设置。设置回归禁用可选扩展；皮肤入口回归启用千幻聆音，检查实际大厅与详情页按钮的一致性及管理入口。截图和结果位于 `output/lobby-settings-corrected/`。设置回归可通过 `NONAME_UI_TEST_ORIGIN`、`NONAME_PLAYWRIGHT_MODULE`、`CHROME_PATH` 指定本地测试环境。
