import { shoushaManifest } from "./shoushaPreset.js";
import { decadeManifest, completeRzshIngame } from './ingame.js';
import { nativePack } from './nativePreset.js';

export function builtinPacks() {
	const packs = [
		["ink-gold", "墨金", "#e9d6b0", "#222b34", "#aa9061", "#ddbd77"],
		["blue", "霁蓝", "#e3efff", "#182b43", "#759bc5", "#87caff"],
		["jade", "青玉", "#e1eee5", "#19332e", "#7da995", "#95e1bd"],
	].map(([id, name, text, background, border, line]) => {
		// Palette packs must carry a complete native layout. Empty settings
		// inherited phone layout and hidden toolbar flags from the previous UI.
		const pack = nativePack();
		pack.manifest.name = `内置 · ${name}`;
		pack.manifest.id = `builtin-${id}`;
		pack.manifest.author = "UI 工坊";
		pack.manifest.description = "可直接应用，也可按部件混搭后加入自己的图片与字体。";
		for (const part of Object.values(pack.manifest.components)) part.name = `${name} · ${part.name}`;
		for (const key of ["home", "lobby", "menus", "buttons", "players"]) pack.manifest.components[key].style = { color: text, "background-color": background, "border-color": border, "background-image": "none" };
		// Keep the shared lobby scenery visible beneath a built-in palette.
		delete pack.manifest.components.home.style["background-image"];
		for (const key of ["menus", "buttons", "players"]) pack.manifest.components[key].style["border-radius"] = "10px";
		pack.manifest.components.home.settings.ui_workshop_home_style = "shousha";
		pack.manifest.components.modes.style.gap = "18px";
		pack.manifest.components.lines = { name: `${name} · 指示线`, settings: { zhishixian: "default" }, assets: {}, style: { color: line, width: "4px", opacity: "0.9", "box-shadow": `0 0 8px ${line}` } };
		return pack;
	});
	packs.unshift({ manifest: { format: "noname-ui-workshop", version: 1, id: "builtin-rzsh", name: "如真似幻", author: "蒸、某个萌新、非凡欧德内里、文和", description: "如真似幻动画大厅、模式选择与武将图鉴；皮肤、设置和联机接入本体，可混搭卡牌与对局外观。所有玩法规则由本体处理。", components: { home: { name: "如真似幻 · 交互大厅", runtime: "rzsh", settings: {}, assets: {}, style: {} } } }, assets: {} });
	packs.unshift({manifest: JSON.parse(JSON.stringify(shoushaManifest)), assets:{}});
	packs.push({manifest: JSON.parse(JSON.stringify(decadeManifest)), assets:{}});
	packs.push(nativePack());
	return packs.map(completeRzshIngame);
}

/** Complete old saved copies of the three stock palettes without changing
 * explicit personal settings, textures, styles or mixed runtime providers. */
export function completeBuiltinPalette(pack) {
	const stock = builtinPacks().find(item => ["builtin-ink-gold", "builtin-blue", "builtin-jade"].includes(item.manifest.id) && item.manifest.name === pack.manifest.name);
	if (!stock || pack.manifest.author !== stock.manifest.author) return pack;
	const parts = pack.manifest.components;
	if (Object.entries(stock.manifest.components).some(([id, part]) => !parts[id] || parts[id].runtime || parts[id].name !== part.name)) return pack;
	for (const [id, part] of Object.entries(stock.manifest.components)) {
		parts[id].settings = { ...part.settings, ...parts[id].settings };
	}
	// Upgrade only the old stock flat background; retain custom art and colors.
	const home = parts.home, stockHome = stock.manifest.components.home;
	if (!home.assets?.background && !home.assets?.texture && home.style?.["background-image"] === "none" &&
		["color", "background-color", "border-color"].every(key => home.style[key] === stockHome.style[key])) {
		delete home.style["background-image"];
	}
	return pack;
}
