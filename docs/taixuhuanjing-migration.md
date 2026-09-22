# 太虚幻境迁移说明

## 归属与入口

参考源为琉璃版 5.5 中的「太虚幻境 2.0.3.4」。现有工程通过 `game/package.js` 登记本体模式 `taixuhuanjing`，手杀大厅原有的「太虚幻境」按钮提交这个模式 ID；默认界面和其它工坊皮肤也进入同一个模式。

- `apps/core/mode/taixuhuanjing.js`：唯一模式入口，统一注册卡牌、技能、NPC、事件、赛季和侍灵规则。
- `apps/core/mode/taixuhuanjing/`：共享玩法实现、模式面板和独立绘图层。
- `apps/core/mode/taixuhuanjing/assets/`：模式自有素材；包含原版借用十周年 UI 的卡图、姓名和身份装饰。
- `apps/core/noname/init/index.ts`：登记共享模式设置；不通过 UI 扩展启动玩法。
- `apps/core/scripts/build.ts`：独立客户端编译模式后，显式复制同名目录下的模式素材，避免被通用入口排除规则跳过。

迁入 8 个赛季、320 个 NPC、132 项祝福及 32 张专属卡牌定义，共 1,831 项素材。`SOURCE.json` 记录来源、作者和源码摘要。原参考包未提供 `txhj_baihu`（白鹄）图片，使用包内骅骝坐骑图作为回退。

日常运行、构建和上述测试均不读取 `temp`。只有显式运行的一次性导入脚本 `scripts/migrate-taixuhuanjing.mjs` 需要外部参考源码；删除 `temp` 后不必重新运行导入脚本。此轮未删除参考目录。

## 只有一套业务

存档继续使用本体的 `taixuhuanjing`、`taixuhuanjingNode`、`taixuhuanjingRecord`、`txhj_collect` 等键。UI 不另建挑战进度、经济、奖励、AI、判胜或统计实现。这里保留的是相同存储结构，不会自动读取另一应用浏览器配置目录内的旧存档。

模式工厂在预览或加载时不安装规则；`startBefore` 在本体载入卡牌和武将之后统一安装，并有重复初始化保护。赛季静态导入，不再扫描扩展文件、调用旧扩展加载器，或依赖十周年 UI 的对象和设置。侍灵的技能由模式入口登记，动画类仅订阅展示事件；关闭动画、静音或换皮肤不会取消侍灵技能，也不会改变技能使用次数。

迁移适配包括现代武将数据结构、本体双宝物槽、技能统计事件、音频路径、选将技能隔离、结算存档保留、对局节点清理、事件延迟单位及大小写敏感路径。连续关卡复用同一个本体对局事件，移除启动流程的重复建局；每次挑战重新准备对应人数的战场。NPC 目录不参与普通点将。技能、装备和祝福的悬浮说明随模式面板清理，且不拦截点击。手杀武将框自带不透明底色，已将其移到本体立绘下方；这项修复仅修改展示 CSS。

## 验证

```powershell
node --experimental-vm-modules --test scripts/taixuhuanjing.test.mjs
pnpm exec tsx scripts/taixuhuanjing-build-regression.ts
```

单元验证覆盖加载隔离、重复初始化、存档保留、连续关卡事件复用、侍灵绘图不注册规则、全部 NPC/专属卡图存在、全部素材清单及迁入脚本语法。独立模式构建验证导出、旧 step 内容保留、绘图库分块、全部模式素材复制及无参考目录依赖。

本地 Vite 服务运行后，可使用 `scripts/taixuhuanjing-browser-regression.mjs` 验证交互。环境变量 `NONAME_UI_TEST_ORIGIN` 指定地址，`NONAME_PLAYWRIGHT_MODULE`、`CHROME_PATH` 指定测试工具，`NONAME_TEST_SKIN` 指定工坊皮肤，`NONAME_TEST_OUTPUT` 指定报告目录。`--ui-cycle` 额外验证从默认皮肤切到手杀大厅后续玩同一存档。

已在隔离的 Chromium 配置中验证默认、手杀标准、十周年局内三种外观：八赛季首页切换、选将、侍灵、原生战斗、双宝物槽、奖励选择和首关结算。默认转手杀的大厅入口与存档逐字段一致性、继续三人战斗、失败结算及战绩记录也已验证；手杀和十周年另验证不刷新页面的连续关卡共用同一对局事件。报告和截图位于 `output/taixuhuanjing-validation/`，三种外观均未出现页面运行异常或模式素材请求失败。

战斗结束测试通过本体死亡事件触发，用于验证结算链路，并非完整 AI 通关。尚未逐一通关全部赛季和难度，也未生成 Electron、Android 安装包；需要完整构建后才能用于现有安装版。开发服务中与本模式无关的原有文件服务/主题请求失败保留在报告中，没有算作模式素材验证通过。
