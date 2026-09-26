# 键社

键社武将皮肤扩展，使用与怒焰三国相同的皮肤套装清单和管理服务。

- `extension.js`：扩展入口，向本体皮肤管理服务注册清单。
- `info.json`：扩展名称与版本。
- `image/skin-sets/manifest.json`：角色、中文名、资源路径、形态关联与 SHA-256。
- `image/skin-sets/original/`：19 张随包携带的旧图。
- `image/skin-sets/new/`：19 张键社新装。

将整个目录作为扩展导出，安装目录使用 `extension/键社/`。所有新旧套装图片均使用 `extension/键社/image/skin-sets/...` 路径，不依赖 temp 或原先的本体皮肤资源目录。

目标游戏需提供皮肤管理服务 `getSkinManagement()`，并带有键社武将包。扩展只提供皮肤，不重复导入武将技能；武将 ID `key_*`、武将包 ID `key` 及已有套装 ID 保持兼容。

当前项目通过 `noname/skin/setCatalog.js` 内置加载该清单；作为扩展安装时，入口通过同一个服务注册。相同套装 ID 的重复注册会更新定义，不会新增重复条目。

由于本体缺少鹰原羽未旧图，`original/key_umi2.jpg` 是随包复制的羽未旧图；新套装使用独立的鹰原羽未图片。
