import JSZip from "jszip";
import { FORMAT, VERSION, MAX_BYTES, MAX_ASSETS, MIME, assetPath, referencedAssets, validateManifest, validateRecord, newId } from "./schema.js";
import { mountAppearance } from "./runtime.js";

/** Never evaluate extension.js here. The workshop imports only its data manifest. */
export async function readArchive(file) {
	if (file.size > MAX_BYTES) throw new Error("压缩包不能超过 128 MB");
	const zip = new JSZip();
	zip.load(await file.arrayBuffer(), { checkCRC32: false });
	const entries = Object.entries(zip.files);
	if (entries.length > MAX_ASSETS + 20) throw new Error("压缩包文件过多");
	let bytes = 0;
	for (const [path, entry] of entries) {
		if (/^[\/\\]|[\\\0:]/.test(path) || path.split("/").some(part => part === ".." || part === ".")) throw new Error("压缩包包含非法路径");
		if (entry.dir) continue;
		if (!["ui-workshop.json", "extension.js", "info.json", "README.txt"].includes(path) && !assetPath(path)) throw new Error(`不是可拆分 UI 套装，含有未声明文件：${path}。普通扩展请使用游戏的扩展导入入口。`);
		const size = entry._data?.uncompressedSize;
		if (typeof size === "number") bytes += size;
		if (bytes > MAX_BYTES + 1024 * 1024) throw new Error("解压后的套装超过 128 MB");
	}
	const fileManifest = zip.file("ui-workshop.json");
	if (!fileManifest) throw new Error("此扩展没有 ui-workshop.json 素材清单，不能自动拆分。可在“扩展 → 获取扩展”安装原扩展，或在这里分别添加图片建立套装。");
	if ((fileManifest._data?.uncompressedSize || 0) > 1024 * 1024) throw new Error("套装清单过大");
	const json = fileManifest.asText();
	if (json.length > 1024 * 1024) throw new Error("套装清单过大");
	const manifest = JSON.parse(json);
	// Validate before enumerating paths from the untrusted manifest.
	validateManifest(manifest);
	const assets = {};
	for (const path of referencedAssets(manifest)) {
		const entry = zip.file(path);
		if (!entry) throw new Error(`套装缺少素材：${path}`);
		assets[path] = new Blob([entry.asArrayBuffer()], { type: MIME[path.split(".").pop()] });
	}
	return validateRecord({ manifest, assets });
}

// Kept self-contained so recipients do not need this project's manager installed.
function portableStart(lib, game, ui, manifest, render, extensionName) {
	const selected = lib.config.ui_workshop_portable_active;
	if (selected && selected !== extensionName) return;
	if (!selected) game.saveConfig("ui_workshop_portable_active", extensionName);
	const settings = Object.assign({}, ...Object.values(manifest.components).map(part => part.settings || {}));
	// Older clients share the home and character-presentation preference.
	if (settings.ui_workshop_home_style && !settings.presentation_style) settings.presentation_style = settings.ui_workshop_home_style;
	Object.assign(lib.config, settings);
	if (settings.layout && !lib.layoutfixed?.includes(lib.config.mode)) {
		game.layout = settings.layout;
		if (ui.css?.layout) ui.css.layout.href = settings.layout === "default" ? "" : `${lib.assetURL}layout/${settings.layout}/layout.css`;
	}
	for (const key of ["theme", "card_style", "cardback_style", "hp_style"]) {
		if (!settings[key]) continue;
		const directory = key === "theme" ? `theme/${settings[key]}` : `theme/style/${key.replace("_style", "")}`;
		const old = ui.css?.[key];
		const next = lib.init.css(lib.assetURL + directory, key === "theme" ? "style" : settings[key]);
		if (ui.css) ui.css[key] = next;
		old?.remove();
	}
	if (ui.css?.phone && typeof settings.phonelayout === "boolean") ui.css.phone.href = settings.phonelayout ? `${lib.assetURL}layout/default/phone.css` : "";
	for (const [key, selectors] of Object.entries({ player_style: "#window .player", control_style: "#window .control,.menubutton:not(.active):not(.highlight),#window #system>div>div", menu_style: "html #window>.dialog.popped,html .menu,html .menubg" })) {
		if (!settings[key]) continue;
		const name = key.replace("_style", "_stylesheet");
		ui.css?.[name]?.remove();
		const value = settings[key];
		const background = value === "wood" ? `url("${lib.assetURL}theme/woodden/${key === "menu_style" ? "wood2.png" : "wood.jpg"}")` : value === "music" ? "linear-gradient(#4b4b4b,#464646)" : value === "simple" ? "linear-gradient(#0006,#0006)" : "";
		if (background && ui.css) ui.css[name] = lib.init.sheet(`${selectors}{background-image:${background}}`);
	}
	if (settings.border_style) {
		ui.css?.border_stylesheet?.remove();
		const border = settings.border_style.replace(/^dragon_/, "");
		if (["gold", "silver", "bronze"].includes(border) && ui.css) ui.css.border_stylesheet = lib.init.sheet(`#window .player>.framebg{display:block;background-image:url("${lib.assetURL}theme/style/player/${border}1.png")}`, `#window #arena.long:not(.fewplayer) .player>.framebg,#arena.oldlayout .player>.framebg{background-image:url("${lib.assetURL}theme/style/player/${border}3.png")}`);
	}
	if (settings.zhishixian === "default" && game.zsOriginLineXy) game.linexy = game.zsOriginLineXy;
	else if (settings.zhishixian && typeof game[`zs${settings.zhishixian}LineXy`] === "function") game.linexy = game[`zs${settings.zhishixian}LineXy`];
	lib.uiWorkshopPortableDispose?.();
	lib.uiWorkshopPortableDispose = render(manifest, path => `${lib.assetURL}extension/${encodeURIComponent(extensionName)}/${path}`, document.head);
}

export async function writeArchive(input) {
	const { manifest, assets } = validateRecord(input);
	if (manifest.id.startsWith("builtin-")) manifest.id = newId();
	const extensionName = `UI套装_${manifest.id}`;
	const escape = value => String(value || "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
	const metadata = { name: extensionName, translation: escape(manifest.name), author: escape(manifest.author || "UI 工坊"), intro: "可拆分 UI 套装。支持 UI 工坊导入，也可作为标准 ESM 扩展安装。", version: "1.0.0" };
	const zip = new JSZip();
	zip.file("ui-workshop.json", JSON.stringify(manifest, null, 2));
	zip.file("info.json", JSON.stringify(metadata, null, 2));
	// Use the same ESM extension contract as this repository's extension maker.
	zip.file("extension.js", `import { lib, game, ui } from "noname";
export const type = "extension";
const manifest = ${JSON.stringify(manifest)};
const metadata = ${JSON.stringify(metadata)};
const extensionName = metadata.name;
const render = ${mountAppearance.toString()};
const start = ${portableStart.toString()};
export default function () {
 return {
  name: extensionName,
  editable: false,
  config: {
   apply: { name: "使用此 UI 套装（重启生效）", clear: true, async onclick() {
    try {
     if (lib.uiWorkshop) {
      await lib.uiWorkshop.registerExtension(manifest, extensionName);
      await lib.uiWorkshop.use(manifest.id);
     } else await game.promises.saveConfig("ui_workshop_portable_active", extensionName);
     game.reload();
    } catch (error) { alert("应用 UI 未完成：" + (error.message || error)); }
   } }
  },
  package: { nopack: true, translation: metadata.translation, author: metadata.author, version: "1.0.0", intro: "UI 素材套装；完整混搭请使用 UI 工坊。" },
  async precontent() {
   if (lib.uiWorkshop) await lib.uiWorkshop.registerExtension(manifest, extensionName);
   else start(lib, game, ui, manifest, render, extensionName);
  },
  content() {}
 };
}
`);
	zip.file("README.txt", `套装：${manifest.name}\n格式：${FORMAT} v${VERSION}\n\n推荐：大厅 → UI 工坊 → 导入套装，选择整套或按部件混搭。\n也可通过无名杀的扩展导入入口安装并启用。ZIP 根目录保留 extension.js、info.json、ui-workshop.json 和 assets。\n此包使用支持 ESM 扩展的无名杀版本（本工程 1.11.6 格式），不支持旧版仅执行 game.import 脚本的加载器。\n没有 UI 工坊的客户端可加载样式和本体配置；本工程专有的大厅、模式卡片等选择器在不同客户端可能不适用。\n多套扩展同时启用时，在扩展设置中选择“使用此 UI 套装”。\n本体自带样式/字体依赖接收方相同资源；自定义素材全部包含在 assets。\n不会携带账号、存档、武将技能或游戏规则。\n`);
	for (const [path, blob] of Object.entries(assets)) zip.file(path, await blob.arrayBuffer());
	return zip.generate({ type: "blob", compression: "DEFLATE" });
}
