# 假装无敌 UI 迁移：命令与执行手册

版本：2026-09-29。配套：[指导手册](jzwd-ui-migration-guide.md)、[完整启动指令](jzwd-ui-migration-prompt.md)。

本文区分可复制给执行者的任务指令与终端命令。编写时只核对相关源码和现有脚本，没有执行这里的测试、构建或打包命令。标注“待新增”的命令必须先实现，不能直接执行或冒称现有能力。

## 1. 推荐使用方式

在本项目的新聊天中粘贴配套启动指令，要求连续实施至完成。也可以在当前聊天明确要求按该指令实施。创建本文不会自动开始开发，不需要新建分支或新聊天才能阅读使用。

执行者先读指导手册，再按 A—H 阶段工作，维护进度和覆盖清单。下面的阶段指令用于续接工作，不要求用户每阶段重新授权。

## 2. 阶段指令

### A：来源与功能盘点

```text
执行 jzwd-ui-migration-guide.md 的阶段 A。检查实时工作区和来源 ZIP，记录来源哈希、全部条目及资源依赖。从入口加载链、设置项、CSS/DOM、媒体目录四路交叉盘点，创建功能覆盖清单和进度记录。复核缺失皮肤脚本、js/db、gameAsset、atlas 图集页和多版本 Spine。确认现有清瑶规则入口，禁止执行或重复接入旧扩展。记录所有 UI 的变体、状态、宿主数据、目标组件和原版依据；不要只统计文件数。完成后继续阶段 B。
```

### B—C：组件契约与第一条完整链路

```text
按指导手册定义细粒度组件、类型化参数、锚点、渲染所有权、优先级和旧套装兼容。实现组件库选择、局部替换、参数、真实预览、保存、应用和分享。先用一个图片指示线与一个势力组件，在两个不同底座上贯通导出导入，证明不依赖整套启用；更新现有提供者，避免旧粗粒度效果与新效果双播。保留既有用户数据、显式关闭和自定义覆盖。基础链路通过后继续 D—F，不以样例完成替代全量迁移。
```

### D—F：覆盖迁移

```text
按功能清单持续迁移所有具备条件的静态 UI、指示线、卡牌/技能/装备/状态特效、对局演出、音效、资料/换肤和结算展示。缺展示数据时完善通用只读通知，禁止注册全局技能或执行来源代码字符串。每完成一个功能，补齐配置入口、预览、独立混搭、资源闭包、清理和证据。追查未使用媒体与未覆盖配置，重建可有依据重建的配置；缺来源要具体列明，继续完成其他项。不要把技能、换牌、势力变更或旧评分混入 UI。
```

### G—H：往返、多端与最终验收

```text
完成真实工坊导出导入、旧库升级、两个不同底座混搭、联机外观传递和资源打包。按指导手册验收矩阵验证视觉、规则一致、隐藏信息、缩放、双将、多目标、失败降级、卸载和重连。用干净用户配置及无来源访问环境检查资源闭包；程序随 ZIP 导出不能当作接收端已安装。逐项复核功能清单并修复发现的问题，清理本任务残留，生成真实 ZIP、哈希与验收报告。平台不可用及缺来源项如实列出，不用静态搜索、旧报告或只读写清单来宣称整体通过。
```

### 中断后续接

```text
继续执行 docs/jzwd-ui-migration-guide.md。先读取状态、覆盖清单、最新验收证据和当前 git diff，核对上次工作确实落盘，再从第一个未完成出口条件继续。保留已有实现与并行改动，不重做已验证步骤；仅在代码变化或新问题需要时重验。原目标不变：纯展示、现有套装逐部件配置、尽量完整覆盖、实际导入导出及证据交付。不要将编写报告或完成几个示例当作迁移结束。
```

## 3. 工作区与工具：现有命令

以下命令使用 PowerShell，在项目根目录执行。先检查本地工具可用性，不为文档检查自动安装依赖。

```powershell
Set-Location -LiteralPath 'C:\pxlngu\projects\noname'
git status --short
git diff --stat
rg --files --hidden -g AGENTS.md -g '!node_modules' -g '!.git'
Get-Command node,pnpm,rg -ErrorAction SilentlyContinue
node --version
pnpm --version
Get-Item -LiteralPath 'temp/扩展UI/假装无敌完整包v2.0.4.zip' | Select-Object Name,Length,LastWriteTime
Get-FileHash -LiteralPath 'temp/扩展UI/假装无敌完整包v2.0.4.zip' -Algorithm SHA256
```

`rg` 未匹配时退出码可能为 1，需区分无匹配与错误。祖先目录存在适用 `AGENTS.md` 时也应读取，不仅搜索仓库内部。已有工作区修改不是本任务成果，记录后保护。

## 4. ZIP 只读目录盘点：无需解压或执行来源脚本

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$jzwdSource = (Resolve-Path -LiteralPath 'temp/扩展UI/假装无敌完整包v2.0.4.zip').Path
$jzwdArchive = [IO.Compression.ZipFile]::Open(
    $jzwdSource,
    [IO.Compression.ZipArchiveMode]::Read,
    [Text.Encoding]::GetEncoding(936)
)
try {
    $jzwdFiles = @($jzwdArchive.Entries | Where-Object { -not $_.FullName.EndsWith('/') })
    [pscustomobject]@{
        Entries = $jzwdArchive.Entries.Count
        Files = $jzwdFiles.Count
        NonemptyFiles = @($jzwdFiles | Where-Object Length -gt 0).Count
        UncompressedBytes = ($jzwdFiles | Measure-Object Length -Sum).Sum
    } | Format-List
    $jzwdFiles |
        Group-Object { [IO.Path]::GetExtension($_.FullName).ToLowerInvariant() } |
        Sort-Object Count -Descending |
        Select-Object Count,Name
    $jzwdFiles |
        Where-Object { $_.FullName -match '\.(js|json|css|html|md|txt)$' -and $_.FullName -notmatch '/dist/' } |
        Select-Object FullName,Length
} finally {
    $jzwdArchive.Dispose()
}
```

该命令只是目录盘点，不验证资源闭包。需要保存清单时，将枚举结果写到本任务证据目录并记录哈希；不要先整包展开到正式扩展目录。后续提取器必须校验路径、重复条目及大小限制。

## 5. 架构定位：现有命令

```powershell
Get-Content -LiteralPath 'docs/ui-workshop.md'
Get-Content -LiteralPath 'apps/core/noname/ui/workshop/schema.js'
rg -n 'runtime|provider|options|mixPart|mixIngame' apps/core/noname/ui/workshop -g '*.js'
rg -n 'subscribePresentation|emitPresentation|playerPresentation' apps/core/noname/ui/presentationEvents.js apps/core/noname/library/element/player.js
rg -n 'linexy|renderAttackLine|migratedAttackLine' apps/core/noname/game/index.js apps/core/noname/ui
Get-Content -LiteralPath 'apps/core/extension/collections/清瑶葭绮/members/假装无敌/characters.js'
Get-Content -LiteralPath 'apps/core/noname/ui/workshop/providerFiles.js'
Get-Content -LiteralPath 'scripts/online-ui-assets.ts'
```

源码搜索只用于定位；匹配到单词不等于违规，未匹配也不等于逻辑隔离成立。尤其需要核对动态加载、字符串路径、图集页和导出兼容入口。

## 6. 针对性测试：现有脚本

这些脚本在编写时存在。执行前读其依赖、输出与测试内容，以实时接口为准；当前通过与否未知。按受影响范围分组执行，不要求每次修改都跑全部脚本。

### 工坊与既有局内套装

```powershell
node --experimental-vm-modules --test scripts/ui-workshop.test.mjs scripts/decade-ingame.test.mjs
```

### 指示线与展示事件

```powershell
node --experimental-vm-modules --test scripts/attack-lines.test.mjs scripts/ui-health-presentation.test.mjs scripts/ui-skill-presentation.test.mjs scripts/ui-extras-presentation.test.mjs
```

### 皮肤服务、已有清瑶规则及联机兼容

```powershell
pnpm exec tsx --test scripts/skin-system.test.ts
node --experimental-vm-modules --test scripts/qingyao-import.test.mjs scripts/online-ui-compat.test.mjs
```

每条命令执行后检查退出码并记录结果。失败时区分已有基线问题与本次回归；不能删关键断言以适应错误实现。上述测试不能代替新组件、旧数据转换、分享及真实视觉验收。

## 7. 实施阶段需要新增的工具：命令契约

以下脚本在本手册编写时未创建。命名是建议的交付契约，实施者可结合项目工具合并或调整；调整后必须同步本节与报告中的可执行命令，不能留下假命令。

| 建议文件 | 必需职责 |
| --- | --- |
| `scripts/jzwd-ui-inventory.mjs` | 只读来源 ZIP，输出条目、哈希、图集依赖/版本/缺口；不执行来源代码 |
| `scripts/jzwd-ui-migrate.mjs` | 按明确映射生成或更新纯媒体/数据；默认拒绝覆盖人工维护代码；输出来源到目标映射 |
| `scripts/jzwd-ui-components.test.mjs` | 部件隔离、类型参数、所有权、旧配置转换、失败与卸载等有意义行为检查 |
| `scripts/jzwd-ui-resources.test.mjs` | 正式提供者媒体闭包、清单和程序白名单；日常检查不依赖源 ZIP |
| `scripts/jzwd-ui-browser.mjs` | 本地独立浏览器配置下的工坊真实操作、混搭、隐藏状态、动效和生命周期证据 |
| `scripts/export-jzwd-ui.mjs` | 使用真实工坊写读器导出预设与两个混搭包，校验配置往返，输出大小/哈希/资源报告 |

建议 CLI 应实现并记录 `--help`。参数含义：`--source` 为只读来源；`--output` 为任务证据/产物目录；浏览器 `--origin` 仅指本地测试服务。迁移器默认输出到任务暂存目录，正式落盘须有明确选项或经过审阅的补丁，不提供隐式覆盖整个扩展树的行为。

实现后才可运行的示例：

```powershell
node scripts/jzwd-ui-inventory.mjs --source 'temp/扩展UI/假装无敌完整包v2.0.4.zip' --output 'output/jzwd-ui/source-audit'
node --experimental-vm-modules --test scripts/jzwd-ui-components.test.mjs scripts/jzwd-ui-resources.test.mjs
node scripts/jzwd-ui-browser.mjs --origin 'http://127.0.0.1:8181' --output 'output/jzwd-ui/browser'
node --experimental-vm-modules scripts/export-jzwd-ui.mjs --output 'dist/ui'
```

不要为已有人维护的适配代码强制生成器重写。若采用直接维护干净展示代码，只需资源提取工具和映射；报告说明哪些文件生成、哪些手工维护。

## 8. 本地浏览器验证

现有 `scripts/decade-presentation-regression.mjs`、`scripts/shousha-presentation-regression.mjs` 可作方法参考，不能原样作为假装无敌验收。部分脚本写死浏览器/依赖路径或套装 ID，先适配本机环境。

本地开发服务示例（前台运行，另一个终端进行检查）：

```powershell
$jzwdListeners = @(Get-NetTCPConnection -State Listen -LocalPort 8181 -ErrorAction SilentlyContinue)
if ($jzwdListeners.Count -gt 0) {
    throw '8181 已被占用。请核对并复用已有服务，或选择空闲端口，不直接启动占用回收。'
}
pnpm --filter noname exec vite --host 127.0.0.1 --port 8181 --strictPort
```

启动前检查当前 Vite 配置、端口占用及 `scripts/reclaim-port.mjs`：该插件当前会停止目标端口的已有监听进程，因此即使指定 `--strictPort` 也不能省略占用检查。不终止不相关服务；已有服务合适时复用并记录版本。控制台成功启动才代表可访问。该服务不自动启动文件 API 或本地联机平台。

当前 Vite 配置有远端 API 代理，验证脚本应限制请求到本地页面/资源并禁止触及生产 API。联机验收另用受控本地平台和测试数据。浏览器使用新的临时用户配置，不清空用户真实存档来构造“干净环境”。

浏览器验收顺序：

1. 从旧套装进入工坊，逐个替换部件，查看实际预览和生效配置。
2. 保存、返回大厅、进入本地对局，核对独立部件与原底座共存。
3. 触发真实用牌/指向/状态事件；另用明确标注的展示夹具覆盖稀有动画，不能把夹具当作真实规则验收。
4. 切回原部件、关闭效果、退出再进入；记录重复节点、资源错误、订阅和声音情况。
5. 使用真实工坊导出，在另一干净配置导入、应用并进入对局；核对参数和依赖。
6. 截图与动效录像分别保存。记录来源参考、实装预览、实装对局的证据类型。

## 9. 本地构建与套装导出

先核对脚本的删除/写入目标和并行任务。根命令 `pnpm build` 当前会删除并重建根 `dist`，不应在已有重要产物或其他任务使用该目录时直接执行。可在隔离且包含本次改动的副本中构建；只 checkout HEAD 不会包含未提交改动，不能拿它验收本次工作。

以下是已有构建入口，并非本轮已执行：

```powershell
pnpm --filter 'noname...' build
pnpm build:online:client
```

第一条构建本体及工作区依赖，不等于完整安装包。第二条构建本地联机客户端资源，不是部署；先配置适当的本地测试服务地址并核对输出范围。全量 `pnpm build`、`pnpm build:exe`、`pnpm build:android` 仅在相应平台验证需要、工具链可用、输出可安全重建时执行。

原有套装导出参考命令（只生成原有十周年及其组合，**不会**生成假装无敌）：

```powershell
node --experimental-vm-modules scripts/export-decade.mjs . output/jzwd-ui/existing-pack-regression
```

新增导出器必须走实际工坊读写链，不能另写一个看似同格式但缺依赖的 ZIP。先完成构建，再导出到可能被构建清理的 `dist/ui`；保留需交付产物，避免后续构建覆盖。导出后检查名称、条目、大小、哈希、版本要求并完成浏览器往返。

## 10. 最终检查及汇报

```powershell
git diff --check
git diff --stat
git status --short
```

`git diff --check` 只检查差异文本格式，不能作为迁移验证。若创建了未跟踪文件，另外检查其内容和引用。

最终报告至少给出：

- 功能清单总数及各状态数量，UI 缺口和非 UI 排除项分开；不预先要求虚假的 100%。
- 当前能独立配置的部件、变体与示例组合，旧套装兼容方式。
- 真实运行的命令、通过/失败/未验证、截图/动效与环境。
- 默认预设和混搭 ZIP 的绝对路径、大小、哈希及接收方安装要求。
- 纯展示隔离、资源独立性、导入导出、卸载和联机验证结论。
- 任务清理明细、缺失来源、原版差异及尚需用户验证的平台。

不要自动提交、推送、发布或部署。不要把新增文档、复制素材或清单校验通过描述为整个任务完成。
