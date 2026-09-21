import { lib, game, get } from "noname";
import { PARTS, BOOL_KEYS, MIME, MAX_BYTES, clone, newId, emptyPack, mixPart, validateRecord } from "./schema.js";
import { catalog, activeId, captureCurrent, savePack, readPack, deletePack, usePack, undoPack, checkNativeSettings } from "./service.js";
import { readArchive, writeArchive } from "./archive.js";
import { mountAppearance } from "./runtime.js";
import { builtinPacks } from "./presets.js";
import css from "./manager.css?inline";

let current;
const SLOT_NAMES = { background: "背景", texture: "纹理 / 图片", alternate: "未翻转卡背", frame: "武将边框", high: "高体力", mid: "中体力", low: "低体力", lost: "已损失体力", font: "自定义字体" };
const STYLE_FIELDS = { color: "文字 / 指示线颜色", "background-color": "底色", "border-color": "边框颜色", "border-radius": "圆角（如 12px）", "font-size": "字号（如 16px）", gap: "间距（如 12px）", "box-shadow": "阴影 / 发光", width: "宽度（指示线如 3px）", opacity: "透明度（0–1）" };

export async function openWorkshop() {
	if (current) { current.focus(); return; }
	const host = document.createElement("noname-ui-workshop");
	host.tabIndex = -1; current = host;
	const shadow = host.attachShadow({ mode: "open" });
	const sheet = document.createElement("style"); sheet.textContent = css; shadow.append(sheet);
	const el = (tag, parent, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; parent?.append(node); return node; };
	const veil = el("div", shadow, undefined, "veil");
	const panel = el("section", veil, undefined, "panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", "UI 工坊");
	const header = el("header", panel); el("h1", header, "UI 工坊"); el("span", header, "整套使用 · 自由混搭 · 素材随包分享", "muted"); el("span", header, "", "spacer");
	const toolbar = el("div", panel, undefined, "toolbar");
	const workspace = el("div", panel, undefined, "workspace");
	const sidebar = el("aside", workspace);
	const editor = el("main", workspace, undefined, "editor");
	const preview = el("section", workspace, undefined, "preview");
	const status = el("div", panel, "正在读取当前外观…", "status"); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
	let draft = emptyPack(), partId = "home", dirty = false, busy = false, selectedLibrary = "";
	const presets = builtinPacks();
	const available = () => [...presets.map(pack => ({ id: pack.manifest.id, name: pack.manifest.name, parts: Object.keys(pack.manifest.components) })), ...catalog()];
	const resolvePack = async id => {
		const preset = presets.find(pack => pack.manifest.id === id);
		if (!preset) return readPack(id);
		return { manifest: clone(preset.manifest), assets: {} };
	};
	let previewDispose, previewURLs = [], thumbnailURLs = [], previewScreen = "home", previewGeneration = 0;
	const priorFocus = document.activeElement;
	const previousInert = [...document.body.children].filter(node => node instanceof HTMLElement).map(node => [node, node.inert]);
	previousInert.forEach(([node]) => { node.inert = true; });
	document.body.append(host); host.focus();
	const message = (text, error = false) => { status.textContent = text; status.classList.toggle("error", error); };
	const action = (parent, text, handler, className) => {
		const button = el("button", parent, text, className); button.type = "button";
		button.onclick = () => run(handler); return button;
	};
	async function run(handler) {
		if (busy) return;
		busy = true; panel.setAttribute("aria-busy", "true"); workspace.inert = true; toolbar.inert = true;
		try { await handler(); } catch (error) { console.error("UI 工坊", error); message(error.message || String(error), true); }
		finally { busy = false; panel.removeAttribute("aria-busy"); workspace.inert = false; toolbar.inert = false; }
	}
	function cleanup() {
		previewDispose?.(); [...previewURLs, ...thumbnailURLs].forEach(url => URL.revokeObjectURL(url));
		previousInert.forEach(([node, inert]) => { node.inert = inert; });
		host.remove(); current = undefined; priorFocus?.focus?.();
	}
	function mayReplace() { return !dirty || confirm("当前搭配有未保存的修改，确定放弃这些修改？"); }
	action(header, "关闭", () => { if (mayReplace()) cleanup(); });
	host.addEventListener("keydown", event => {
		if (event.key === "Escape") { event.stopPropagation(); if (!busy && mayReplace()) cleanup(); }
		if (event.key === "Tab") {
			const nodes = [...shadow.querySelectorAll("button,input,select,textarea,summary,iframe")].filter(node => !node.disabled && node.offsetParent !== null);
			const first = nodes[0], last = nodes[nodes.length - 1];
			if (!shadow.activeElement) { event.preventDefault(); first?.focus(); }
			else if (event.shiftKey && shadow.activeElement === first) { event.preventDefault(); last?.focus(); }
			else if (!event.shiftKey && shadow.activeElement === last) { event.preventDefault(); first?.focus(); }
		}
	});
	for (const type of ["click", "mousedown", "mouseup", "mousemove", "touchstart", "touchmove", "touchend", "keydown", "keyup", "wheel", "contextmenu"]) host.addEventListener(type, event => event.stopPropagation());
	function changed() { dirty = true; updatePreview(); }
	function field(parent, label, value = "", onChange, tag = "input") {
		const wrapper = el("label", parent, undefined, "field"); el("span", wrapper, label);
		const input = el(tag, wrapper); input.value = value;
		input.onchange = () => { onChange?.(input.value); changed(); };
		return input;
	}
	function select(parent, label, values, value, onChange) {
		const input = field(parent, label, "", undefined, "select");
		for (const [key, title] of Object.entries(values)) { const option = el("option", input, title); option.value = key; }
		input.value = value; input.onchange = () => run(() => onChange(input.value)); return input;
	}
	async function pickFile(accept, handle, multiple = false) {
		const input = document.createElement("input"); input.type = "file"; input.accept = accept; input.multiple = multiple;
		input.onchange = () => run(() => handle([...input.files])); input.click();
	}
	async function saved(copy = false) {
		checkNativeSettings(draft.manifest);
		if (!copy && !dirty && (draft.manifest.id.startsWith("builtin-") || catalog().some(item => item.id === draft.manifest.id))) return draft;
		const pack = await savePack(draft, copy || draft.manifest.id === activeId() || draft.manifest.id.startsWith("builtin-"));
		draft = pack; dirty = false; selectedLibrary = pack.manifest.id;
		renderSidebar(); updatePreview(); return pack;
	}
	async function canReload() {
		const { onlineState } = await import("../../online/client.ts");
		if (onlineState.room || onlineState.match.state !== "idle") throw new Error("请先退出房间或取消匹配，再应用 UI；当前搭配可以先保存或导出。");
		const settings = new URLSearchParams(location.search).has("lobbySettings");
		if (!window.inSplash && !settings && game.players?.length) throw new Error("请先返回大厅再应用 UI；当前搭配可以先保存或导出。");
	}
	function reloadLobby() {
		const url = new URL(location.href); url.searchParams.delete("uiSafe"); url.searchParams.delete("lobbySettings");
		history.replaceState(null, "", url);
		sessionStorage.setItem(lib.configprefix + "return_to_lobby", "true");
		localStorage.removeItem(lib.configprefix + "directstart"); game.reload();
	}
	action(toolbar, "保存搭配", async () => { await saved(); message("搭配已保存，尚未更改正在使用的 UI。"); });
	action(toolbar, "另存为套装", async () => { await saved(true); message("已保存为独立套装，素材不会依赖原套装。"); });
	action(toolbar, "应用并返回大厅", async () => {
		await canReload();
		const pack = await saved(); await usePack(pack.manifest.id);
		message("已保存，正在重新载入大厅…"); reloadLobby();
	}, "primary");
	action(toolbar, "导入套装 ZIP", () => pickFile(".zip,application/zip", async ([file]) => {
		if (!file) return;
		message("正在检查套装和素材…");
		const imported = await readArchive(file);
		const stored = await savePack(imported, catalog().some(item => item.id === imported.manifest.id));
		selectedLibrary = stored.manifest.id; renderSidebar(); renderEditor();
		message(`已导入「${stored.manifest.name}」。点击“载入整套”或在部件来源中选取；当前草稿保持不变。`);
	}));
	action(toolbar, "导出当前搭配", async () => {
		checkNativeSettings(draft.manifest); message("正在打包配置和素材…");
		const blob = await writeArchive(draft);
		const name = draft.manifest.name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_").replace(/[. ]+$/, "") || "UI套装";
		game.export(blob, `${name}-UI套装.zip`); message("已调用游戏导出功能，请完成客户端的文件保存。ZIP 可在 UI 工坊或无名杀扩展入口导入。");
	});
	action(toolbar, "恢复原有外观", async () => { await canReload(); await usePack(""); reloadLobby(); });
	action(toolbar, "撤销上次应用", async () => { await canReload(); await undoPack(); reloadLobby(); });

	function renderSidebar() {
		sidebar.replaceChildren(); el("h2", sidebar, "套装库");
		const values = { "": "选择已保存的套装" };
		for (const item of available()) values[item.id] = `${item.name}${item.id === activeId() ? " · 使用中" : ""}`;
		select(sidebar, "套装", values, selectedLibrary, value => { selectedLibrary = value; });
		const commands = el("div", sidebar, undefined, "library-actions");
		action(commands, "一键使用所选套装", async () => {
			if (!selectedLibrary) throw new Error("请先选择套装");
			await canReload();
			if (!mayReplace()) return;
			await usePack(selectedLibrary); reloadLobby();
		}, "primary");
		action(commands, "载入整套到编辑器", async () => {
			if (!selectedLibrary) throw new Error("请先选择套装");
			if (!mayReplace()) return;
			draft = await resolvePack(selectedLibrary); dirty = false; renderEditor(); updatePreview(); message("已载入整套。可以混搭、编辑或应用。");
		});
		action(commands, "从当前游戏外观创建", async () => {
			if (!mayReplace()) return;
			draft = await captureCurrent(); dirty = true; renderEditor(); updatePreview(); message("已读取本体外观配置和自定义素材。第三方扩展自行注入的界面代码不会自动拆分。");
		});
		action(commands, "新建空白搭配", () => { if (mayReplace()) { draft = emptyPack(); dirty = false; renderEditor(); updatePreview(); message("已新建；未设置的项目沿用游戏原有外观。"); } });
		action(commands, "删除所选套装", async () => {
			if (!selectedLibrary) throw new Error("请先选择套装");
			if (presets.some(pack => pack.manifest.id === selectedLibrary)) throw new Error("内置套装不能删除，可以另存为自己的搭配");
			if (!confirm("删除所选套装及其独立素材？已经混搭到其他套装的素材会保留。")) return;
			await deletePack(selectedLibrary); selectedLibrary = ""; renderSidebar(); renderEditor(); message("套装已删除。");
		}, "danger");
		action(commands, "清除撤销记录", async () => { await game.promises.saveConfig("ui_workshop_previous", undefined); message("撤销记录已清除。"); });
		el("h3", sidebar, "选择要搭配的部件"); const parts = el("nav", sidebar, undefined, "parts");
		for (const [id, part] of Object.entries(PARTS)) action(parts, part.name, () => { partId = id; renderSidebar(); renderEditor(); }, id === partId ? "selected" : "");
	}
	function renderEditor() {
		thumbnailURLs.forEach(url => URL.revokeObjectURL(url)); thumbnailURLs = [];
		editor.replaceChildren();
		const metadata = el("div", editor, undefined, "row");
		field(metadata, "套装名称", draft.manifest.name, value => { draft.manifest.name = value; });
		field(metadata, "作者", draft.manifest.author, value => { draft.manifest.author = value; });
		field(editor, "套装说明", draft.manifest.description, value => { draft.manifest.description = value; });
		el("h2", editor, PARTS[partId].name);
		const sources = { "": "当前搭配 / 手动编辑" };
		for (const item of available()) if (item.parts.includes(partId)) sources[item.id] = item.name;
		select(editor, "从其他套装选取这个部件", sources, "", async id => {
			if (!id) return; const source = await resolvePack(id); mixPart(draft, source, partId); changed(); renderEditor(); message(`已搭配「${source.manifest.name}」的${PARTS[partId].name}。`);
		});
		const part = draft.manifest.components[partId] ||= { name: PARTS[partId].name, settings: {}, assets: {}, style: {} };
		part.settings ||= {}; part.assets ||= {}; part.style ||= {};
		field(editor, "部件名称", part.name || PARTS[partId].name, value => { part.name = value; });
		action(editor, "清空此部件，沿用游戏原设置", () => { draft.manifest.components[partId] = { name: PARTS[partId].name, settings: {}, assets: {}, style: {} }; changed(); renderEditor(); });
		if (PARTS[partId].settings.length) el("h3", editor, "本体外观设置");
		const nativeFields = el("div", editor, undefined, "fields");
		for (const key of PARTS[partId].settings) {
			const config = lib.configMenu.appearence.config[key] || {};
			let choices = key === "ui_workshop_home_style" ? { shousha: "手杀入口", classic: "经典入口" } : BOOL_KEYS.includes(key) ? { true: "开启", false: "关闭" } : { ...(config.item || {}) };
			if (key === "theme") choices = { woodden: "木纹", music: "音乐", simple: "简约" };
			if (key === "splash_style") choices = { style1: "样式一", style2: "样式二" };
			for (const value of Object.keys(choices)) if (value === "custom" || /^(custom_|cdv_)/.test(value)) delete choices[value];
			const value = part.settings[key];
			if (value !== undefined && !Object.hasOwn(choices, String(value))) choices[String(value)] = `${value}（检查兼容性）`;
			select(nativeFields, config.name || "主界面模板", { "": "沿用原设置", ...choices }, value === undefined ? "" : String(value), chosen => {
				if (chosen === "") delete part.settings[key]; else part.settings[key] = BOOL_KEYS.includes(key) ? chosen === "true" : chosen;
				changed();
			});
		}
		el("h3", editor, "素材");
		if (part.runtime) el("p", editor, `此部件使用${part.runtime === "shousha" ? "手杀标准UI" : "如真似幻"}内置素材与界面程序，导出时会一并打包。下方可添加自己的覆盖素材。`, "muted");
		el("p", editor, "图片支持 PNG / JPG / WebP / GIF / AVIF；字体支持 WOFF / WOFF2 / TTF / OTF。素材会复制到套装中。", "muted");
		for (const slot of PARTS[partId].slots) assetRow(part, slot);
		if (PARTS[partId].map) {
			for (const slot of Object.keys(part.assets).filter(slot => slot.startsWith(PARTS[partId].map + ":"))) assetRow(part, slot);
			const mapRow = el("div", editor, undefined, "row");
			const input = field(mapRow, partId === "cards" ? "卡牌 ID（如 sha / shan / tao）" : "模式 ID（如 identity / guozhan）", "");
			const list = el("datalist", editor); list.id = "ui-asset-ids"; input.setAttribute("list", list.id);
			const ids = partId === "cards" ? Object.keys(lib.card || {}) : lib.config.all.mode;
			for (const id of ids) { const option = el("option", list, get.translation(id)); option.value = id; }
			action(mapRow, "添加对应图片", () => {
				if (!/^[a-zA-Z0-9_-]{1,100}$/.test(input.value)) throw new Error("请填写有效的卡牌或模式 ID");
				return chooseAsset(part, `${PARTS[partId].map}:${input.value}`);
			});
			action(editor, "批量导入（文件名作为 ID）", () => pickFile(".png,.jpg,.jpeg,.webp,.gif,.avif", async files => {
				const additions = [];
				for (const file of files) {
					const id = file.name.replace(/\.[^.]+$/, "");
					if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new Error(`文件名必须是有效 ID：${file.name}`);
					additions.push([`${PARTS[partId].map}:${id}`, file]);
				}
				const candidate = { manifest: clone(draft.manifest), assets: { ...draft.assets } };
				for (const [slot, file] of additions) await putAsset(candidate, partId, slot, file);
				draft = validateRecord(candidate); changed(); renderEditor(); message(`已加入 ${additions.length} 个素材。`);
			}, true));
		}
		el("h3", editor, "颜色与细节（留空沿用原样式）");
		if (partId === "lines") el("p", editor, "本体特效可直接选择；自定义颜色、粗细和纹理作用于“默认”指示线。画布型攻击动画保留本体实现。", "muted");
		const styles = el("div", editor, undefined, "fields");
		for (const [key, name] of Object.entries(STYLE_FIELDS)) field(styles, name, part.style[key] || "", value => { if (value.trim()) part.style[key] = value.trim(); else delete part.style[key]; });
		const advanced = el("details", editor); el("summary", advanced, "高级：编辑当前部件清单");
		el("p", advanced, "可配置 rules，为部件内部元素调整颜色、间距、网格等。仅接受外观属性；素材使用 assets 内的相对路径。", "muted");
		const json = el("textarea", advanced); json.setAttribute("aria-label", "部件 JSON"); json.value = JSON.stringify(part, null, 2);
		action(advanced, "更新此部件清单", () => {
			const candidate = { manifest: clone(draft.manifest), assets: { ...draft.assets } }; candidate.manifest.components[partId] = JSON.parse(json.value);
			draft = validateRecord(candidate); changed(); renderEditor(); message("部件清单已更新。");
		});
	}
	function assetRow(part, slot) {
		const row = el("div", editor, undefined, "asset"); const path = part.assets[slot];
		if (path && draft.assets[path] && slot !== "font") { const img = el("img", row); img.alt = SLOT_NAMES[slot] || slot; img.src = URL.createObjectURL(draft.assets[path]); thumbnailURLs.push(img.src); }
		else el("span", row, slot === "font" ? "Aa 字体" : "未设置", "muted");
		const description = el("div", row); el("strong", description, SLOT_NAMES[slot] || slot); el("small", description, path ? ` · ${(draft.assets[path]?.size / 1024).toFixed(1)} KB` : " · 沿用原素材", "muted");
		const buttons = el("div", row, undefined, "actions");
		action(buttons, path ? "替换" : "添加", () => chooseAsset(part, slot));
		if (path) action(buttons, "移除", () => { delete part.assets[slot]; changed(); renderEditor(); });
	}
	function chooseAsset(part, slot) {
		const id = partId;
		return pickFile(slot === "font" ? ".woff,.woff2,.ttf,.otf" : ".png,.jpg,.jpeg,.webp,.gif,.avif", async ([file]) => {
			if (!file) return;
			const candidate = { manifest: clone(draft.manifest), assets: { ...draft.assets } };
			await putAsset(candidate, id, slot, file); draft = validateRecord(candidate); changed(); renderEditor();
		});
	}
	async function putAsset(pack, id, slot, file) {
		const extension = file.name.split(".").pop().toLowerCase();
		if (!MIME[extension] || file.size === 0 || file.size > MAX_BYTES) throw new Error("素材格式不支持、文件为空或大于 128 MB");
		const font = /^(woff2?|ttf|otf)$/.test(extension);
		if (font !== (slot === "font")) throw new Error("请为此位置选择正确的图片或字体文件");
		const path = `assets/${newId()}.${extension}`; pack.assets[path] = file; pack.manifest.components[id].assets[slot] = path;
	}
	function updatePreview() {
		const generation = ++previewGeneration;
		previewDispose?.(); previewDispose = undefined; previewURLs.forEach(url => URL.revokeObjectURL(url)); previewURLs = [];
		preview.replaceChildren(); el("h2", preview, "素材搭配预览");
		el("p", preview, "这是素材与样式的示意预览；本体主题、布局和启动模板在应用后生效。", "muted");
		if (draft.manifest.components.home?.runtime === "rzsh") el("p", preview, "已包含如真似幻交互大厅。动画、原版菜单与模式选择会在应用后整套启用；下方仅预览其余素材搭配。", "muted");
		const shousha = Object.values(draft.manifest.components).some(part => part.runtime === "shousha");
		if (shousha) {
			el("p", preview, "手杀标准UI：登录页播放原版动画；大厅、选将和对局展示原版参考图。完整交互在应用套装后启用。所有依赖封装在套装内部，不列为独立扩展。", "muted");
			select(preview, "预览页面", {login:"登录界面",home:"大厅 / 模式选择",arena:"对局 / 卡牌 / 控件"}, previewScreen, value => {previewScreen=value;updatePreview();});
		}
		const frame = el("iframe", preview); frame.title = "UI 素材预览"; frame.setAttribute("sandbox", shousha ? "allow-same-origin allow-scripts" : "allow-same-origin");
		frame.srcdoc = `<!doctype html><html><head><style>body{margin:0;color:#eddfc5;font:14px sans-serif;background:#18283a}#splash{padding:16px;background:#283748}h2{font-size:18px}.lobby-modes{display:flex;gap:10px}.lobby-mode{width:95px;height:106px;background:#596573;border:1px solid #bbab82;border-radius:8px;color:#fff}.lobby-art{width:65px;height:65px;object-fit:cover}.online-lobby{padding:12px;background:#34434c}#window{padding:16px}.cards{display:flex;gap:10px}.card{width:65px;height:88px;padding:8px;border-radius:6px;background:#d4c7a6;color:#1b2a3a}.infohidden{background:#786754}.control{display:inline-block;margin-top:12px;padding:7px 14px;background:#557085;border-radius:6px}.player{padding:6px;margin:12px 0;background:#3c5167}.hp>div{display:inline-block;background:#67b88f;width:15px;height:18px}.linexy{height:48px;width:3px;background:white;margin:8px auto}.menu{padding:9px;background:#334658}</style></head><body><section id="splash"><h2>主界面 · 选择模式</h2><main class="lobby-modes"><button class="lobby-mode" data-ui-mode="identity"><img class="lobby-art" alt="身份"><br>身份</button><button class="lobby-mode" data-ui-mode="guozhan"><img class="lobby-art" alt="国战"><br>国战</button></main></section><main class="online-lobby">联机大厅 · 房间列表</main><section id="window"><div class="cards"><div class="card" data-card-name="sha">杀</div><div class="card" data-card-name="shan">闪</div><div class="card infohidden"></div></div><div class="player">武将框 <div class="hp" data-condition="high"><div></div><div></div><div class="lost"></div></div></div><div class="control">确认出牌</div><div class="linexy"></div><div class="menu">菜单与弹窗</div></section></body></html>`;
		frame.onload = async () => {
			if (!frame.isConnected) return;
			try {
				const valid = validateRecord(draft); const lookup = {};
				let runtimeDispose;
				if (shousha) {
					const provider = await import(/* @vite-ignore */ new URL(`${lib.assetURL}extension/手杀标准UI/extension.js`, document.baseURI).href);
					if (generation !== previewGeneration || !frame.isConnected) return;
					const body = frame.contentDocument.body;
					if (previewScreen !== "arena") body.replaceChildren();
					runtimeDispose = await provider.mountPreview(body, valid.manifest, previewScreen);
					if (generation !== previewGeneration || !frame.isConnected) {runtimeDispose?.();return;}
				}
				for (const [path, blob] of Object.entries(valid.assets)) { lookup[path] = URL.createObjectURL(blob); previewURLs.push(lookup[path]); }
				const appearanceDispose = mountAppearance(valid.manifest, path => lookup[path], frame.contentDocument.head);
				previewDispose = () => {appearanceDispose();runtimeDispose?.();};
			} catch (error) { message(error.message || String(error), true); }
		};
		const lines = Object.entries(draft.manifest.components).map(([id, part]) => `${PARTS[id].name}：${part.name || "自定义"} · ${part.runtime ? "内置界面素材 + " : ""}${Object.keys(part.assets || {}).length} 项自定义素材`);
		el("p", preview, lines.join("\n"), "summary muted");
	}
	busy = true; workspace.inert = true; toolbar.inert = true;
	try { draft = await captureCurrent(); message(lib.uiWorkshop?.error || "已读取当前本体外观。可选取套装部件、添加素材，保存后应用。"); }
	catch (error) { message(`当前外观不能完整提取，已建立空白搭配：${error.message || error}`, true); }
	finally { busy = false; workspace.inert = false; toolbar.inert = false; }
	renderSidebar(); renderEditor(); updatePreview();
}
