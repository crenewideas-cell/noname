# 本体内置 UI 恢复

参考用户提供的原界面截图，恢复使用现有本体组件，不添加新的局内渲染器、CSS、图片或按钮。

原组件位置：

- `apps/core/noname/ui/create/index.js`：顶部 `system1/system2` 工具栏、退出入口，以及 `me/mebg/handcards1/handcards2` 手牌容器。
- `apps/core/layout/long2/layout.css`：本体桌面武将布局与底部手牌位置。
- `apps/core/theme/simple/style.css`：本体按钮、卡牌、武将框与手牌底板样式。
- `apps/core/layout/default/phone.css`：触屏布局会把顶部按钮移出画面；本体在触屏布局下显示 `roundmenu`，局数移至右上方。这些控件没有被删除。

工坊原来的“恢复原有外观”只执行 `usePack("")`，取消套装后仍然继承保存的外观配置。如果保存的是 `layout: mobile`、`phonelayout: true`，就不会恢复截图里的本体桌面布局。

现在原有恢复入口选择 `builtin-native`（本体内置 UI）：仅声明本体已有配置，明确使用 `long2`、关闭触屏布局、恢复原按钮显示和卡牌/武将样式；资源仍由本体原代码加载。该配置也能在工坊套装库中直接选取。没有自动重置用户存档，没有把用户自定义或其他套装迁移成原生 UI；应用后经现有重新加载流程生效。上一个套装仍可撤销，原底层外观偏好仍保留，千幻和动皮配置不受影响。

验证：

```powershell
node --experimental-vm-modules --test scripts/ui-workshop.test.mjs
node scripts/native-ui-regression.mjs
```

浏览器回归从保存的手机布局和墨金覆盖开始，实际点击恢复入口，进入对局，在 1200 和 1920 宽度下检查原按钮命中、局数位置、手牌父容器与位置，并检查日志/退出回调、皮肤偏好和撤销目标。截图及报告输出至 `output/builtin-ui/`。


## 三套内置配色修正

墨金、霁蓝、青玉原先由空配置创建，只包含配色，未声明布局和顶部按钮偏好，导致继承此前保存的手机布局。仅增加“恢复本体内置 UI”入口没有修正这三套本身。

现在三套均以 nativePack 的现有本体布局为基础，再保留各自配色：long2、非手机布局、原顶部按钮及手牌栏、原生卡牌和武将框配置。旧的同名配色套装副本读取时补齐缺失的设置；已有明确的自定义设置、素材和混搭运行时不覆盖。没有增加新 UI 设计。

本次遵照用户要求不运行测试；此前的恢复入口测试不能代表这三套配色已验证。
