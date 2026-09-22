import JSZip from "jszip";
import { FORMAT, VERSION, MAX_BYTES, MAX_ASSETS, MIME, assetPath, referencedAssets, validateManifest, validateRecord, newId } from "./schema.js";
import { mountAppearance } from "./runtime.js";
import { providerDirectory } from './provider.js';
import { isProviderFile } from './providerFiles.js';
import { openLargeArchive, writeLargeArchive, MAX_PROVIDER_BYTES, MAX_PROVIDER_FILES } from "./largeArchive.js";

/** Never evaluate extension.js here. The workshop imports only its data manifest. */
export async function readArchive(file) {
	if (file.size > 512 * 1024 * 1024) return readProviderArchive(file);
	const zip = new JSZip();
	zip.load(await file.arrayBuffer(), { checkCRC32: false });
	const entries = Object.entries(zip.files);
	const fileManifest = zip.file("ui-workshop.json");
	if (!fileManifest || (fileManifest._data?.uncompressedSize || 0) > 1024 * 1024) throw new Error("缺少有效的 UI 工坊套装清单");
	const manifestText = fileManifest.asText();
	if (manifestText.length > 1024 * 1024) throw new Error("套装清单过大");
	const manifest = validateManifest(JSON.parse(manifestText));
	const provider = runtimeProvider(manifest);
	const interactive = !!provider;
	const limit = interactive ? MAX_PROVIDER_BYTES : MAX_BYTES;
	if (entries.length > (interactive ? MAX_PROVIDER_FILES : MAX_ASSETS + 20)) throw new Error("压缩包文件过多");
	// Interactive code is installed by the engine's extension importer only.
	// The workshop uses its bundled, migrated provider and reads the data manifest.
	const providerFiles = await allowedProviderFiles(manifest);
	let bytes = 0;
	for (const [path, entry] of entries) {
		if (/^[\/\\]|[\\\0:]/.test(path) || path.split("/").some(part => part === ".." || part === ".")) throw new Error("压缩包包含非法路径");
		if (entry.dir) continue;
		if (!["ui-workshop.json", "extension.js", "info.json", "README.txt"].includes(path) && !assetPath(path) && !providerFiles.has(path)) throw new Error(`不是可拆分 UI 套装，含有未声明文件：${path}。普通扩展请使用游戏的扩展导入入口。`);
		const size = entry._data?.uncompressedSize;
		if (typeof size === "number") bytes += size;
		if (bytes > limit + 1024 * 1024) throw new Error("解压后的套装超过允许大小");
	}
	const assets = {};
	for (const path of referencedAssets(manifest)) {
		const entry = zip.file(path);
		if (!entry) throw new Error(`套装缺少素材：${path}`);
		assets[path] = new Blob([entry.asArrayBuffer()], { type: MIME[path.split(".").pop()] });
	}
	return validateRecord({ manifest, assets });
}
async function readProviderArchive(file) {
	const archive=await openLargeArchive(file);
	const manifest=validateManifest(JSON.parse(await(await archive.read("ui-workshop.json",1024*1024)).text()));
	const provider=runtimeProvider(manifest);
	if(!provider)throw new Error("此套装不能超过 512 MB");
	const allowed=await allowedProviderFiles(manifest);
	for(const [path,entry] of archive.entries)if(!entry.dir&&!allowed.has(path)&&!["ui-workshop.json","extension.js","info.json","README.txt"].includes(path)&&!assetPath(path))throw new Error(`套装含有未声明文件：${path}`);
	const assets={};let size=0;
	for(const path of referencedAssets(manifest)){const blob=await archive.read(path,MAX_BYTES);size+=blob.size;if(size>MAX_BYTES)throw new Error("自定义素材过大");assets[path]=new Blob([blob],{type:MIME[path.split(".").pop()]});}
	return validateRecord({manifest,assets});
}
function runtimeProvider(manifest) {
	if (Object.values(manifest.components).some(part => part.runtime === "decade")) return "十周年局内UI";
	if (Object.values(manifest.components).some(part => part.runtime === "shousha")) return "手杀标准UI";
	if (manifest.components.home?.runtime === "rzsh") return "如真似幻";
}
function runtimeProviders(manifest) {
	return [Object.values(manifest.components).some(part => part.runtime === "decade") ? "十周年局内UI" : null, manifest.components.home?.runtime === "rzsh" ? "如真似幻" : null,
		Object.values(manifest.components).some(part => part.runtime === "shousha") ? "手杀标准UI" : null].filter(Boolean);
}
async function allowedProviderFiles(manifest) {
	const allowed = new Set();
	for (const provider of runtimeProviders(manifest)) for (const file of await runtimeFiles(provider)) {
		// Accept previous single-provider exports and namespaced mixed exports.
		allowed.add(file); allowed.add(`providers/${provider}/${file}`);
	}
	return allowed;
}
async function runtimeResource(path, provider) {
	const response = await fetch(providerDirectory(provider)+path);
	if (!response.ok) throw new Error(`${provider}文件缺失：${path}`);
	return response;
}
async function runtimeFiles(provider) {
	const files = await (await runtimeResource("files.json", provider)).json();
	if (!Array.isArray(files) || files.length > MAX_PROVIDER_FILES || files.some(path => typeof path !== "string" || /(^\/|\\|:|\0|(^|\/)\.\.?($|\/))/.test(path))) throw new Error(`${provider}文件清单无效`);
	return [...new Set([...files, "files.json"])].filter(file => isProviderFile(provider, file));
}

// Kept self-contained so recipients do not need this project's manager installed.
function portableStart(lib, game, ui, manifest, render, extensionName) {
	const selected = lib.config.ui_workshop_portable_active;
	if (selected && selected !== extensionName) return;
	if (!selected) game.saveConfig("ui_workshop_portable_active", extensionName);
	lib.uiWorkshopPortableDispose?.();
	const releases = [], originals = new Map();
	let disposed = false;
	lib.uiWorkshopPortableDispose = () => {
		if (disposed) return; disposed = true;
		for (const release of releases.splice(0).reverse()) try { release(); } catch (error) { console.warn("UI 资源释放失败", error); }
		for (const [key, {value, projected}] of originals) if (lib.config[key] === projected) {
			if (value === undefined) delete lib.config[key]; else lib.config[key] = value;
		}
	};
	const sheet = (key, next) => {
		const old = ui.css?.[key], parent = old?.parentNode, sibling = old?.nextSibling;
		if (ui.css) ui.css[key] = next;
		old?.remove();
		releases.push(() => {
			next?.remove();
			if (!ui.css || ui.css[key] !== next) return;
			if (old) { ui.css[key] = old; if (parent) parent.insertBefore(old, sibling?.parentNode === parent ? sibling : null); }
			else delete ui.css[key];
		});
	};
	const href = (node, value) => {
		if (!node) return;
		const old = node.getAttribute("href"); node.setAttribute("href", value);
		releases.push(() => { if (node.getAttribute("href") === value) { if (old === null) node.removeAttribute("href"); else node.setAttribute("href", old); } });
	};
	const settings = Object.assign({}, ...Object.values(manifest.components).map(part => part.settings || {}));
	// Older clients share the home and character-presentation preference.
	if (settings.ui_workshop_home_style && !settings.presentation_style) settings.presentation_style = settings.ui_workshop_home_style;
	for (const [key, value] of Object.entries(settings)) { originals.set(key, {value: lib.config[key], projected: value}); lib.config[key] = value; }
	if (settings.layout && !lib.layoutfixed?.includes(lib.config.mode)) {
		const previous = game.layout;
		game.layout = settings.layout;
		releases.push(() => { if (game.layout === settings.layout) game.layout = previous; });
		href(ui.css?.layout, settings.layout === "default" ? "" : `${lib.assetURL}layout/${settings.layout}/layout.css`);
	}
	for (const key of ["theme", "card_style", "cardback_style", "hp_style"]) {
		if (!settings[key]) continue;
		const directory = key === "theme" ? `theme/${settings[key]}` : `theme/style/${key.replace("_style", "")}`;
		const next = lib.init.css(lib.assetURL + directory, key === "theme" ? "style" : settings[key]);
		sheet(key, next);
	}
	if (typeof settings.phonelayout === "boolean") href(ui.css?.phone, settings.phonelayout ? `${lib.assetURL}layout/default/phone.css` : "");
	for (const [key, selectors] of Object.entries({ player_style: "#window .player", control_style: "#window .control,.menubutton:not(.active):not(.highlight),#window #system>div>div", menu_style: "html #window>.dialog.popped,html .menu,html .menubg" })) {
		if (!settings[key]) continue;
		const name = key.replace("_style", "_stylesheet");
		const value = settings[key];
		const background = value === "wood" ? `url("${lib.assetURL}theme/woodden/${key === "menu_style" ? "wood2.png" : "wood.jpg"}")` : value === "music" ? "linear-gradient(#4b4b4b,#464646)" : value === "simple" ? "linear-gradient(#0006,#0006)" : "";
		sheet(name, background ? lib.init.sheet(`${selectors}{background-image:${background}}`) : undefined);
	}
	if (settings.border_style) {
		const border = settings.border_style.replace(/^dragon_/, "");
		sheet("border_stylesheet", ["gold", "silver", "bronze"].includes(border) ? lib.init.sheet(`#window .player>.framebg{display:block;background-image:url("${lib.assetURL}theme/style/player/${border}1.png")}`, `#window #arena.long:not(.fewplayer) .player>.framebg,#arena.oldlayout .player>.framebg{background-image:url("${lib.assetURL}theme/style/player/${border}3.png")}`) : undefined);
	}
	releases.push(render(manifest, path => `${lib.assetURL}extension/${encodeURIComponent(extensionName)}/${path}`, document.head));
}

export async function writeArchive(input) {
	const { manifest, assets } = validateRecord(input);
	if (manifest.id.startsWith("builtin-")) manifest.id = newId();
	const extensionName = `UI套装_${manifest.id}`;
	const escape = value => String(value || "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
	const metadata = { name: extensionName, translation: escape(manifest.name), author: escape(manifest.author || "UI 工坊"), intro: "可拆分 UI 套装。支持 UI 工坊导入，也可作为标准 ESM 扩展安装。", version: "1.0.0" };
	const zip = new JSZip();
	const provider = runtimeProvider(manifest);
	const providers = runtimeProviders(manifest);
	zip.file("ui-workshop.json", JSON.stringify(manifest, null, 2));
	zip.file("info.json", JSON.stringify(metadata, null, 2));
	// Use the same ESM extension contract as this repository's extension maker.
	zip.file("extension.js", `import { lib, game, ui } from "noname";
export const type = "extension";
const manifest = ${JSON.stringify(manifest)};
const metadata = ${JSON.stringify(metadata)};
const extensionName = metadata.name;
const providers = ${JSON.stringify(providers)};
const render = ${mountAppearance.toString()};
const start = ${portableStart.toString()};
let started, activeToken;
async function startPortable() {
 if (started) return started;
 const token = activeToken = {};
 started = (async () => {
  const selected = lib.config.ui_workshop_portable_active;
  if (selected && selected !== extensionName) return;
  start(lib, game, ui, manifest, render, extensionName);
  const releases = [lib.uiWorkshopPortableDispose];
  lib.uiWorkshopPortableDispose = () => { if (activeToken === token) { activeToken = undefined; started = undefined; } for (const release of releases.splice(0).reverse()) { try { release?.(); } catch (error) { console.warn("UI 资源释放失败",error); } } };
  for (const name of providers) {
   const provider = await import(new URL('providers/' + name + '/extension.js', import.meta.url).href);
   if (activeToken !== token) return;
   const release = await provider.activate(manifest);
   if (activeToken !== token) { release?.(); return; }
   releases.push(release);
  }
 })().catch(error => { if (activeToken === token) { lib.uiWorkshopPortableDispose?.(); started = undefined; } throw error; });
 return started;
}
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
   else await startPortable();
  },
  content() {}
 };
}
`);
	zip.file("README.txt", `套装：${manifest.name}\n格式：${FORMAT} v${VERSION}\n\n推荐：大厅 → UI 工坊 → 导入套装，选择整套或按部件混搭。\n也可通过无名杀的扩展导入入口安装并启用。ZIP 根目录保留 extension.js、info.json、ui-workshop.json 和 assets。\n此包使用支持 ESM 扩展的无名杀版本（本工程 1.11.6 格式），不支持旧版仅执行 game.import 脚本的加载器。\n没有 UI 工坊的客户端可加载样式和本体配置；本工程专有的大厅、模式卡片等选择器在不同客户端可能不适用。\n多套扩展同时启用时，在扩展设置中选择“使用此 UI 套装”。\n本体自带样式/字体依赖接收方相同资源；自定义素材全部包含在 assets。\n不会携带账号、存档、武将技能或游戏规则。\n`);
	if (provider) {
		zip.file("README.txt", `${manifest.name}：包含全部已选展示提供者及自定义素材。请优先通过本工程 UI 工坊导入；普通扩展入口需要相同版本的本体展示接口。混搭提供者位于 providers 中，不运行其归档旧业务模块。联机房间使用宿主服务，不含个人配置或账号。\n`);
		const resources = new Map(), inventories = new Map();
		for (const name of providers) {
			const files = await runtimeFiles(name); inventories.set(name, files);
			for (const file of files) resources.set(`providers/${name}/${file}`, {name, file});
		}
		const generated = {...assets};
		for (const path of ["extension.js", "info.json", "ui-workshop.json", "README.txt"]) generated[path] = new Blob([zip.file(path).asText()]);
		return writeLargeArchive([...resources.keys(), ...Object.keys(generated)], async path => {
			if (Object.hasOwn(generated, path)) return generated[path];
			const {name, file} = resources.get(path);
			if (file === "files.json") return new Blob([JSON.stringify(inventories.get(name), null, 2) + "\n"]);
			const response = await runtimeResource(file, name);
			if (!/\.(js|mjs|html|css|json)$/.test(file)) return response.blob();
			let source = await response.text();
			for (const name of providers) {
				const destination = `extension/${extensionName}/providers/${name}/`;
				for (const prefix of ["extension", "ui-skins"]) source = source.replaceAll(`${prefix}/${name}/`, destination).replaceAll(`${prefix}\\/${name}\\/`, destination.replaceAll("/", "\\/"));
			}
			return new Blob([source]);
		});
	}
	for (const [path, blob] of Object.entries(assets)) zip.file(path, await blob.arrayBuffer());
	return zip.generate({ type: "blob", compression: "DEFLATE" });
}
