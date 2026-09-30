# 浏览器开发模式启动性能优化（2026-09-30）

本轮仅修改开发服务器的资源处理，不修改游戏启动、登录、武将、技能、卡牌、扩展注册或存档业务代码。现有未提交业务修改保留。所有优化仅在 Vite `serve` 生效，生产构建不启用。

## 改动

- `scripts/dev-sourcemaps.mjs`：把开发脚本的内联源码映射改为按需请求。原来 Vite 每次发送大型 JS 时会生成并附加大量调试数据；现在普通 JS 不再重复生成内联映射，实际编译产生的映射仍由 Vite 保存。DevTools 可以请求映射；未转换 JS 使用行级映射，TS 等使用原始转换映射。未压缩、合并、改写业务函数。
- `scripts/dev-extension-resolver.mjs`：复用扩展目录索引，每次解析仍检查根目录和分类目录的纳秒级修改时间。增加、删除、重命名、跨分类移动都会立即刷新索引，保持原路径规则和重名检查。模块内容仍由原来的读取和热更新流程管理。
- `scripts/dev-boot-style.mjs`：将现有约 4 KB 加载画面 CSS 内联到开发 HTML，仅调整相对资源 URL 的基准；样式内容、图片和动画不变，减少首屏的阻塞请求。
- `apps/core/vite.config.ts`、`scripts/extension-layout.mjs`：接入上述开发插件。没有更改端口、代理、扩展开关、初始化顺序、登录判断或计时逻辑。

## 测量方法与结果

独立无头 Chrome，1420×800，本机 localhost，默认完整扩展配置加内置手杀标准 UI，使用全新测试 IndexedDB；文件 API 只读，外部联机 API 不可用。没有打开或写入用户浏览器资料。冷启动指新浏览器上下文首次导航，保留磁盘上的 Vite 依赖缓存；刷新指同一上下文第二次导航。

终点同时要求登录 iframe 可见、加载遮罩消失、单机按钮可见，并保存截图。下列数字为单次测量，不是统计分位数或所有设备的保证。

| 指标 | 优化前 | 优化后（依赖重新优化） | 优化后复测（已有依赖缓存） |
| --- | ---: | ---: | ---: |
| 首次导航到真实登录页 | 34.73 秒 | 14.16 秒 | 11.24 秒 |
| 刷新到真实登录页 | 23.08 秒 | 4.77 秒 | 4.58 秒 |
| 首次导航 first-paint | 1.92 秒 | 1.30 秒 | 0.98 秒 |
| 刷新 first-paint | 0.076 秒 | 0.108 秒 | 0.080 秒 |
| 主文档记录的资源解码体积 | 434.39 MiB | 86.01 MiB | — |

资源体积是主文档 Resource Timing 中记录的 `decodedBodySize` 合计，不包含全部子 iframe 资源，也不是网络压缩后的传输体积。58 次扩展导入调用的名称和顺序前后一致，完整扩展仍在登录前按原流程初始化。

最后一次验证点击真实单机按钮，约 **3.52 秒**后大厅模式卡可见，登录和大厅均没有 `pageerror` 或错误弹窗。未验证真实联机账号鉴权或每个技能分支。首次重新优化依赖时开发服务器就绪另需约 19.7 秒，已有缓存时约 7.5 秒；表格的页面启动时间从浏览器导航开始计算，没有把服务器就绪时间混在其中。

证据位于 `output/startup-browser/verified-before/`、`verified-after/`、`final/`，每个目录包含 JSON 和截图，`final/login-smoke.json` 保存登录到大厅结果。较早的 `before/`、`baseline/`、`optimized/` 是诊断过程数据，终点未完整检查父 iframe 的可见性，不作为最终对照结果。

## 回归验证

`pnpm exec tsx --test scripts/dev-startup.test.mjs scripts/dev-ports.test.mjs scripts/performance/semantics.test.ts`

验证真实 Vite 响应中的可执行 JS/TS 内容前后一致（只排除调试映射注释），旧式 step 函数保持原内容；中文逻辑扩展路径、目录即时增删移动、JS/TS 调试映射、304 缓存、文件编辑后的新响应、CSS 内容与资源路径、开发端口、性能测试构建环境均有覆盖。

额外运行 `scripts/legacy-runtime.test.ts` 时，4 项中有 1 项失败：`real twzhiqu survives production renaming, repeated use, combat and cancellation`，在 `steps(...)` 中报 `await is only valid in async functions and the top level bodies of modules`。该测试自身使用 `configFile: false`，不加载本次任何开发插件；测试文件、技能文件、StepCompiler 和构建保护插件相对 HEAD 均无改动。本轮没有修改该技能或测试来掩盖失败。

可复现性能测试：

```powershell
pnpm exec tsx scripts/startup-browser-perf.ts comparison-before --baseline
pnpm exec tsx scripts/startup-browser-perf.ts comparison-after --login-smoke
```

`--baseline` 仅在测试服务器内关闭本轮三个优化，不回退或改写工作区文件。测试辅助文件 `scripts/performance/environment.ts` 补上了只读 API 对分类扩展路径的解析，以免测试环境误报目录不存在。

生效方式：结束原有开发服务后重新运行 `pnpm dev`，继续使用原地址。无需清除浏览器缓存、配置或存档。
