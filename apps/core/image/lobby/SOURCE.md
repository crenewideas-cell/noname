# 公共大厅按钮

`decade-button.png`、`decade-button-active.png` 原样复制自项目已收录的十周年 UI 素材：

- `extension/ui/手杀标准UI/original/十周年UI/assets/image/tnode-C1.png`
- `extension/ui/手杀标准UI/original/十周年UI/assets/image/tnode-C4.png`

使用 CSS 九宫格伸缩保留四角花纹。归属与许可沿用原素材，没有生成或重绘替代图。

对局操作弹窗继续复用 `room-night.png`、`room-frame.svg` 及红金按钮。默认模式大厅和默认载入页现使用 [参考图内置界面素材](REFERENCE.md)；更多模式弹窗仍按运行时模式配置载入海报。

皮肤管理入口直接使用 `extension/ui/如真似幻/images/wujiang.png` 图集的 `biaojibeijing` 区域（x=813、y=1081、w=197、h=64；图集 2043×1179），与大厅的原有按钮一致。

## 联机登录主视觉

`online-battlefield.png` 和 `online-warrior.png` 于 2026-09-27 通过 ImageGen 按用户提供的登录参考图重建为独立插画，用于战场背景与人物画面。参考文件：`codex-clipboard-73a1beff-09d4-430f-b527-ab18e70af846.png`。图片不包含按钮、文案或表单；实际控件由页面渲染，继续使用模板 0 的公共按钮素材。

## 房间参考图（2026-09-27）

内置 ImageGen 根据用户 `C:/Users/1/Desktop/1.png` 风格参考生成 `room-night.png` 和 `room-paper.png`，仅作为背景与纸张插画使用。`room-frame.svg` 是代码绘制的共用描金边框，供席位、设置、消息、好友与关联弹窗复用；按钮未生成新素材。

生成提示词要点：
- room-night：无文字和 UI 的横向中式夜景，深灰山水、宫阙、暖色满月、白鹤、边缘红梅与金线，中央留暗色安静区域。
- room-paper：无文字和控件的米白宣纸纹理，淡金边缘植物纹样、左下浅灰牡丹、右下少量红梅，中央和左上留白。
