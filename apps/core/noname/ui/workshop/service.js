import { lib, game } from "noname";
import { PARTS, SETTING_KEYS, MIME, clone, newId, emptyPack, validateManifest, validateRecord, referencedAssets } from "./schema.js";
import { mountAppearance } from "./runtime.js";
import { builtinPacks } from "./presets.js";

const PREFIX = "ui-workshop:";
/** @typedef {{version: number, registerExtension: typeof registerExtension, use: typeof usePack, ownsSetting: (key: string) => boolean, open: () => Promise<void>, openRooms?: (mode: string) => Promise<unknown>, openSkins?: (id?: string) => Promise<unknown>, openSettings?: (page: string) => Promise<void>, openSuiteSettings?: () => void, prepareCharacters?: () => Promise<void>, error?: string}} WorkshopAPI */
let dispose;
let urls = [];
let baseline;
let loaded;
let disposeProvider;
let mutation = Promise.resolve();
const serial = action => { const result = mutation.then(action); mutation = result.catch(() => {}); return result; };
export const catalog = () => Array.isArray(lib.config.ui_workshop_catalog) ? lib.config.ui_workshop_catalog : [];
export const activeId = () => lib.config.ui_workshop_active || "";
export async function readPack(id) {
	if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new Error("套装 ID 无效");
	const preset = builtinPacks().find(pack => pack.manifest.id === id);
	if (preset) return validateRecord(preset);
	const data = await game.getDB("data", PREFIX + id);
	if (!data) throw new Error("套装素材不存在，请重新导入");
	return validateRecord(data);
}
function requireStorage() {
	if (!lib.db) throw new Error("当前环境的 IndexedDB 不可用，无法保存 UI 素材。请允许本地存储后重试。");
}
/** Commit package bytes and their index together in the existing engine database. */
function commit(config, data = []) {
	requireStorage();
	return new Promise((resolve, reject) => {
		const transaction = lib.db.transaction(["data", "config"], "readwrite");
		transaction.oncomplete = () => { Object.assign(lib.config, config); resolve(); };
		transaction.onabort = () => reject(transaction.error || new Error("UI 素材保存失败，请检查存储空间"));
		try {
			for (const [key, value] of Object.entries(config)) transaction.objectStore("config").put(value, key);
			for (const [key, value] of data) {
				if (value === undefined) transaction.objectStore("data").delete(PREFIX + key);
				else transaction.objectStore("data").put(value, PREFIX + key);
			}
		} catch (error) { transaction.abort(); reject(error); }
	});
}
export function savePack(input, copy = false) {
	return serial(async () => {
		requireStorage();
		const record = validateRecord(input);
		if (copy || record.manifest.id.startsWith("builtin-") || record.manifest.id === activeId() || record.manifest.id === lib.config.ui_workshop_previous) record.manifest.id = newId();
		const id = record.manifest.id;
		const entry = { id, name: record.manifest.name, author: record.manifest.author || "", parts: Object.keys(record.manifest.components), updated: Date.now(), bytes: Object.values(record.assets).reduce((n, blob) => n + blob.size, 0) };
		await commit({ ui_workshop_catalog: [...catalog().filter(item => item.id !== id), entry] }, [[id, record]]);
		return record;
	});
}
export function deletePack(id) {
	return serial(async () => {
		if (!catalog().some(item => item.id === id)) throw new Error("套装不存在");
		if (id === activeId() || id === lib.config.ui_workshop_previous) throw new Error("此套装正在使用或用于撤销，请先切换并清除撤销记录");
		await commit({ ui_workshop_catalog: catalog().filter(item => item.id !== id) }, [[id, undefined]]);
	});
}
export function usePack(id) {
	return serial(async () => {
		const pack = id ? await readPack(id) : undefined;
		if (pack) checkNativeSettings(pack.manifest);
		const previous = activeId();
		if (previous === id) { cacheBootAppearance(pack); return; }
		await commit({ ui_workshop_previous: previous, ui_workshop_active: id });
		cacheBootAppearance(pack);
	});
}
function cacheBootAppearance(pack) {
	try {
		const runtime = pack?.manifest.components.home?.runtime;
		localStorage.setItem("noname-ui-workshop-boot", ["rzsh", "shousha"].includes(runtime) ? runtime : "default");
		window.nonameApplyBootAppearance?.(runtime);
	} catch { /* Optional first-paint cache; IndexedDB remains authoritative. */ }
}
export async function undoPack() {
	if (lib.config.ui_workshop_previous === undefined) throw new Error("没有可撤销的应用记录");
	const previous = lib.config.ui_workshop_previous || "";
	await usePack(previous);
}
export function releaseAppearance() {
	disposeProvider?.(); disposeProvider = undefined;
	dispose?.(); dispose = undefined;
	urls.forEach(url => URL.revokeObjectURL(url)); urls = [];
}
function render(pack) {
	releaseAppearance();
	const lookup = {};
	for (const [path, blob] of Object.entries(pack.assets)) { lookup[path] = URL.createObjectURL(blob); urls.push(lookup[path]); }
	dispose = mountAppearance(pack.manifest, path => lookup[path], document.head);
}
/** Called before layout/CSS initialization; managed settings never overwrite originals. */
export async function initializeWorkshop() {
	baseline = Object.fromEntries(SETTING_KEYS.map(key => [key, lib.config[key]]));
	lib.uiWorkshop = { version: 1, registerExtension, use: usePack, ownsSetting: key => !!loaded && Object.values(loaded.manifest.components).some(part => Object.hasOwn(part.settings || {}, key)), open: async () => (await import("./manager.js")).openWorkshop() };
	lib.uiWorkshop.openRooms = async mode => (await import("../../online/entry.js")).openOnlineRooms(mode);
	lib.uiWorkshop.openSkins = async id => (await import("../skinGallery.js")).openSkinGallery(id);
	lib.uiWorkshop.openSettings = async page => (await import("../lobbySettings.js")).openLobbySettings(page);
	lib.uiWorkshop.prepareCharacters = async () => {
		for (const [name, pack] of Object.entries(lib.imported.character || {})) {
			if (pack.character) lib.characterPack[name] = pack.character;
			Object.assign(lib.translate, pack.translate || {});
			lib.translate[name + "_character_config"] ||= pack.translate?.[name] || lib.translate[name] || name;
		}
	};
	await repairBuiltinCopies().catch(error => {
		console.warn("UI 套装重复记录暂未整理，下次启动会重试", error);
		lib.uiWorkshop.error = "旧套装重复记录暂未整理，请检查本地存储空间；仍可正常选择和使用套装。";
	});
	window.addEventListener("keydown", event => {
		if (!event.ctrlKey || !event.shiftKey || event.code !== "KeyU") return;
		event.preventDefault(); event.stopImmediatePropagation();
		void lib.uiWorkshop.open().catch(error => alert(`无法打开 UI 工坊：${error.message || error}`));
	}, { capture: true });
	if (new URLSearchParams(location.search).has("uiSafe")) return;
	if (!activeId()) { cacheBootAppearance(); return; }
	try {
		loaded = await readPack(activeId());
		cacheBootAppearance(loaded);
		checkNativeSettings(loaded.manifest);
		for (const part of Object.values(loaded.manifest.components)) Object.assign(lib.config, part.settings || {});
		render(loaded);
		if (loaded.manifest.components.home?.runtime === "rzsh") {
			const provider = await import(/* @vite-ignore */ new URL(`${lib.assetURL}extension/如真似幻/extension.js`, document.baseURI).href);
			await provider.activate();
		}
		if (Object.values(loaded.manifest.components).some(part => part.runtime === "shousha")) {
			const provider = await import(/* @vite-ignore */ new URL(`${lib.assetURL}extension/手杀标准UI/extension.js`, document.baseURI).href);
			disposeProvider = await provider.activate(loaded.manifest);
		}
	} catch (error) {
		loaded = undefined;
		cacheBootAppearance();
		Object.assign(lib.config, baseline);
		releaseAppearance();
		console.error("UI 套装加载失败，已回退原有外观", error);
		lib.uiWorkshop.error = `UI 套装加载失败，已使用原有外观：${error.message || error}`;
	}
}

/** Old quick-apply saved fresh copies of builtin, active and undo packs.
 * Collapse byte-identical legacy copies once; keep edited/renamed variants. */
export function repairBuiltinCopies() {
	return serial(async () => {
		if (!lib.db || lib.config.ui_workshop_builtin_repair === 2) return;
		const stable = value => JSON.stringify(value, function (key, item) {
			return item && typeof item === "object" && !Array.isArray(item)
				? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item;
		});
		const fingerprint = manifest => { const { id, ...content } = manifest; return stable(content); };
		const candidates = new Map(builtinPacks().map(pack => [fingerprint(pack.manifest), [pack]]));
		const aliases = new Map();
		const digests = new WeakMap();
		async function digest(pack) {
			if (!digests.has(pack)) digests.set(pack, Promise.all(Object.entries(pack.assets).sort(([a],[b]) => a.localeCompare(b)).map(async ([name,blob]) => {
				const hash = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
				return [name, ...new Uint8Array(hash)].join(":");
			})).then(parts => parts.join("|")));
			return digests.get(pack);
		}
		for (const entry of catalog()) {
			try {
				const pack = await readPack(entry.id);
				const key = fingerprint(pack.manifest), matches = candidates.get(key) || [];
				let canonical;
				for (const match of matches) if (await digest(match) === await digest(pack)) {canonical=match.manifest.id;break;}
				if (canonical) aliases.set(entry.id, canonical);
				else {matches.push(pack);candidates.set(key,matches);}
			} catch { /* Keep damaged entries visible for manual recovery/deletion. */ }
		}
		await commit({
			ui_workshop_builtin_repair: 2,
			ui_workshop_catalog: catalog().filter(entry => !aliases.has(entry.id)),
			ui_workshop_active: aliases.get(activeId()) || activeId(),
			...(lib.config.ui_workshop_previous !== undefined ? { ui_workshop_previous: aliases.get(lib.config.ui_workshop_previous) || lib.config.ui_workshop_previous } : {}),
		});
		// Keep old data records for recovery. They no longer appear in the catalog.
	});
}
export function checkNativeSettings(manifest) {
	for (const part of Object.values(manifest.components)) for (const [key, value] of Object.entries(part.settings || {})) {
		if (typeof value === "boolean") continue;
		if (key === "ui_workshop_home_style") { if (!["classic", "shousha"].includes(value)) throw new Error("主界面风格无效"); continue; }
		if (key === "splash_style" && !["style1", "style2"].includes(value)) throw new Error("自定义启动页包含代码，请保留其原扩展；套装只管理其可声明的素材");
		// Menus with runtime-filled choices are checked against the engine's stock list below.
		if (key === "theme" && !["woodden", "music", "simple"].includes(value)) throw new Error(`主题 ${value} 来自外部扩展，请先将其素材加入套装`);
		if (key === "image_background" && /^(custom_|cdv_|db:|ext:)/.test(value)) throw new Error("本地背景尚未打包，请重新添加背景图片");
		if (value === "custom") throw new Error(`配置 ${key} 的自定义素材尚未打包，请重新添加对应图片`);
		const choices = lib.configMenu.appearence.config[key]?.item;
		if (choices && Object.keys(choices).length && !["theme", "image_background"].includes(key) && !Object.hasOwn(choices, value) && value !== "default") throw new Error(`此客户端不支持 ${key} = ${value}`);
	}
}
/** Read an extension resource through the platform's existing file API, or HTTP. */
async function resource(path, type) {
	if (game.readFile) {
		const data = await game.promises.readFile(path);
		return new Blob([data], { type });
	}
	const response = await fetch(lib.assetURL + path);
	if (!response.ok) throw new Error(`无法读取素材：${path}`);
	return new Blob([await response.arrayBuffer()], { type });
}
export async function registerExtension(input, name) {
	const manifest = validateManifest(input);
	if (manifest.id.startsWith("builtin-")) throw new Error("builtin- 前缀保留给内置套装，请使用其他 ID");
	if (typeof name !== "string" || /[\\/\0:]/.test(name)) throw new Error("扩展名称无效");
	const previous = await game.getDB("data", PREFIX + manifest.id);
	// Never overwrite a locally edited copy or read hundreds of files on every boot.
	if (previous) {
		if (!catalog().some(item => item.id === manifest.id)) await savePack(previous);
		return;
	}
	const assets = {};
	for (const path of referencedAssets(manifest)) assets[path] = await resource(`extension/${name}/${path}`, MIME[path.split(".").pop()]);
	await savePack({ manifest, assets });
}

async function addCaptured(pack, id, slot, source) {
	let blob = source;
	if (typeof source === "string" && source.startsWith("data:")) blob = await (await fetch(source)).blob();
	if (!(blob instanceof Blob)) throw new Error(`无法读取本地自定义素材：${PARTS[id].name}/${slot}`);
	const ext = Object.keys(MIME).find(key => MIME[key] === blob.type) || "png";
	const path = `assets/${newId()}.${ext}`;
	pack.assets[path] = blob;
	pack.manifest.components[id].assets[slot] = path;
}
export async function captureCurrent() {
	const pack = emptyPack();
	for (const [id, spec] of Object.entries(PARTS)) for (const key of spec.settings) {
		const value = lib.config[key] ?? lib.configMenu.appearence.config[key]?.init;
		if (typeof value === "string" || typeof value === "boolean") pack.manifest.components[id].settings[key] = value;
	}
	pack.manifest.components.home.settings.ui_workshop_home_style = lib.config.ui_workshop_home_style || (lib.config.presentation_style === "classic" ? "classic" : "shousha");
	const custom = { cards: ["card_style", ["texture"]], cardback: ["cardback_style", ["texture", "alternate"]], buttons: ["control_style", ["texture"]], menus: ["menu_style", ["texture"]], players: ["player_style", ["texture"]], hp: ["hp_style", ["high", "mid", "low", "lost"]] };
	for (const [id, [key, slots]] of Object.entries(custom)) {
		if (lib.config[key] !== "custom") continue;
		for (let i = 0; i < slots.length; i++) {
			const dbKey = key === "hp_style" ? `hp_style${i + 1}` : i ? "cardback_style2" : key;
			const blob = await game.getDB("image", dbKey);
			if (!blob && i > 0 && key === "cardback_style") continue;
			await addCaptured(pack, id, slots[i], blob);
		}
		pack.manifest.components[id].settings[key] = "default";
	}
	if (lib.config.border_style === "custom") {
		await addCaptured(pack, "players", "frame", await game.getDB("image", "border_style"));
		pack.manifest.components.players.settings.border_style = "auto";
	}
	const background = lib.config.image_background;
	if (typeof background === "string" && /^(custom_|cdv_)/.test(background)) {
		const blob = background.startsWith("cdv_") ? await resource(`image/background/${background}.jpg`, "image/jpeg") : await game.getDB("image", background);
		await addCaptured(pack, "arena", "background", blob);
		pack.manifest.components.arena.settings.image_background = "default";
		pack.manifest.components.arena.settings.image_background_random = false;
	}
	if (loaded) {
		for (const [id, part] of Object.entries(loaded.manifest.components)) {
			pack.manifest.components[id] = { ...clone(part), settings: { ...pack.manifest.components[id].settings, ...part.settings } };
		}
		Object.assign(pack.assets, loaded.assets);
	}
	// The interactive provider selects its splash for this boot only. Capturing
	// it as a stock mode template would make the otherwise valid mix uneditable.
	if (pack.manifest.components.home.runtime === "rzsh" && pack.manifest.components.modes.settings.splash_style === "rzsh-modern") {
		pack.manifest.components.modes.settings.splash_style = ["style1", "style2"].includes(baseline?.splash_style) ? baseline.splash_style : "style1";
	}
	if (pack.manifest.components.home.runtime === "shousha" && pack.manifest.components.modes.settings.splash_style === "shousha-standard") {
		pack.manifest.components.modes.settings.splash_style = ["style1", "style2"].includes(baseline?.splash_style) ? baseline.splash_style : "style1";
	}
	checkNativeSettings(pack.manifest);
	return validateRecord(pack);
}
