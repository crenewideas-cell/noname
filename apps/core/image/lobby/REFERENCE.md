# 内置界面参考素材（2026-09-27）

用户提供参考图 `codex-clipboard-04bd3831-f0eb-4278-a7df-417b5cbc3c5c.png`，要求保留书法标题、左右锦旗、灯笼、分组布局和底部装饰。后续明确要求移除所有“三国”主题文字。

## 生产资源

- `reference-atlas.png`：1672×941，参考图经内置 ImageGen 定向修改。标题右侧印章移除；右侧锦旗改为“群雄再临”；底部改为“在这里，遇见不一样的世界”。主界面使用完整场景和同图集中的独立按钮区域。
- `reference-scene.png`：1672×941，同一参考图经内置 ImageGen 去除 UI 并补全景物，供加载页使用；右侧锦旗同样改为“群雄再临”。
- `reference-logo.png`：2123×741，RGBA 透明图。内置 ImageGen 从修订后的字标提取的配套书法标题，用于加载页。没有印章或额外文字。加载页采用透明版本，避免搬移原图字标时把天空一起贴到中央。

全部资源均保存在本目录，运行时没有临时目录或在线图片依赖。未使用 CLI/API fallback。生成过程中的未采用版本没有接入工程。

## 最终生成提示词

### 图集

Use case: text-localization. Edit the exact supplied game UI atlas, with STRICT minimal changes. 1) Remove the small red 三国 seal immediately right of the large top-center 无名杀 calligraphy logo entirely, filling only that little seal area with matching dark ink background. Preserve the 无名杀 calligraphy EXACTLY. 2) Change the far right red hanging banner from 三国再临 to 群雄再临, vertically written in the same gold brush style, SAME position. 3) Change the bottom small centered subtitle 在这里，遇见不一样的三国 to 在这里，遇见不一样的世界, in the exact same small gold brush font and same position. Absolutely no 三国 text anywhere. Preserve ALL other pixels as closely as possible: exact 11 card positions and all their labels/artwork, all mode group titles, all four top navigation buttons, all border ornaments, skyline, left hanging parchment, lanterns, foreground and footer. Keep the original 1672x941 framing/aspect ratio; do not crop. This is an existing interactive UI texture atlas; layouts cannot shift.

### 场景最终文字修订

Use case: text-localization. Edit this exact loading background. Replace the ONLY large right-side vertical red banner's text 三国再临 with 群雄再临 (four vertically stacked characters, gold calligraphy, same size/position). Remove any other occurrence of 三国 anywhere in the image including tiny seals or plaques. Preserve every other pixel/composition as closely as possible: left parchment banner with 以智会友 以牌传道, right glowing 杀 lantern, architecture, mountains, foreground desk and scrolls, lighting and color. Keep original landscape aspect ratio and full framing. Do NOT add a logo, central text or any interface. Absolutely no 三国 text anywhere.

### 透明标题

Use case: background-extraction. Production transparent logo asset extraction. Extract ONLY the existing 3 GOLD brush characters 无名杀 and their gold trailing brush strokes from the top center of this image. Keep the exact original lettering shape and understated matte gold texture, NO 3D extrusion, NO new glow, NO redesign. Remove ALL scenery between and around strokes; every non-gold pixel must be fully transparent, including the holes within the letters. NO seals, NO red marks, NO additional words, NO 三国, NO subtitle. Output a tightly fitted wide transparent PNG containing just that exact gold 无名杀 lettering. Do not include any dark rectangle, mountain, sky, vignette or backdrop.

## 实现与验证

`layout/default/lobby-reference.css` 使用响应式网格布置模式卡片，大分组等宽、内边距与卡片间距随窗口调整，身份与挑战共享相同尺寸。模式人物使用 `image/splash/shousha/` 中的原始素材，SVG 以单一比例填充并裁切可视区域；边框、标题和编号独立绘制，不再拉伸合成截图。顶部导航及更多模式人物仍取自图集。保持 Vue 模式回调、键盘焦点、禁用状态、联机切换和设置入口。没有启用的模式灰显；更多模式始终保留，空列表显示说明。额外模式继续使用动态图片。

`layout/default/lobby-theme.css` 统一场景、字标和字体资源。场景独立以 cover 铺满窗口，不留两侧底色。宽屏三列、中等窗口两列、窄窗口单列并允许纵向滚动，不锁定卡片像素尺寸。窄窗口的文字使用容器单位，兼容引擎的页面缩放。动态文字使用本地行楷。

运行 `node scripts/reference-lobby-browser.mjs`。覆盖 1672×941、1920×911、2560×1080、1366×768、960×540 和 390×844，检查对应卡片尺寸一致、人物横纵缩放系数一致、窗口变化后的自适应尺寸、模式命中、所有卡片纵向滚动可达、更多弹窗、选项菜单八个入口与展开位置、单机/联机切换、键盘进入模式、加载页和减少动画设置。结果和截图在 `output/reference-lobby/`。本次交付为源码与资源，不包含重新打包的安装程序。

### 配色覆盖修复

用户实际使用墨金配色时，工坊对 `#splash button` 输出的 `background-image:none!important` 和深色填充覆盖了图集；公共按钮样式中的 `background:none!important` 也会清空图集定位。修复在工坊渲染器和公共按钮外观规则中排除参考大厅的模式卡片、顶部导航按钮，保留其它按钮的配色功能；对已保存或混搭的配色同样生效，无需重置用户配置。

浏览器回归新增墨金、霁蓝、青玉三套真实配色渲染，检查全部 15 个美术按钮的图片、裁切尺寸、圆角和边框，同时确认普通控件仍应用配色。修复前该回归复现失败，修复后通过。UI 工坊原有 10 项测试也通过。
