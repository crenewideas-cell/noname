import { emptyPack } from "./schema.js";
import { shoushaManifest } from "./shoushaPreset.js";
import { decadeManifest, completeRzshIngame } from './ingame.js';

export function builtinPacks() {
	const packs = [
		["ink-gold", "墨金", "#e9d6b0", "#222b34", "#aa9061", "#ddbd77"],
		["blue", "霁蓝", "#e3efff", "#182b43", "#759bc5", "#87caff"],
		["jade", "青玉", "#e1eee5", "#19332e", "#7da995", "#95e1bd"],
	].map(([id, name, text, background, border, line]) => {
		const pack = emptyPack(`内置 · ${name}`);
		pack.manifest.id = `builtin-${id}`;
		pack.manifest.author = "UI 工坊";
		pack.manifest.description = "可直接应用，也可按部件混搭后加入自己的图片与字体。";
		for (const part of Object.values(pack.manifest.components)) part.name = `${name} · ${part.name}`;
		for (const key of ["home", "lobby", "menus", "buttons", "players"]) pack.manifest.components[key].style = { color: text, "background-color": background, "border-color": border, "background-image": "none" };
		for (const key of ["menus", "buttons", "players"]) pack.manifest.components[key].style["border-radius"] = "10px";
		pack.manifest.components.home.settings.ui_workshop_home_style = "shousha";
		pack.manifest.components.modes.style.gap = "18px";
		pack.manifest.components.lines = { name: `${name} · 指示线`, settings: { zhishixian: "default" }, assets: {}, style: { color: line, width: "4px", opacity: "0.9", "box-shadow": `0 0 8px ${line}` } };
		return pack;
	});
	packs.unshift({ manifest: { format: "noname-ui-workshop", version: 1, id: "builtin-rzsh", name: "如真似幻", author: "蒸、某个萌新、非凡欧德内里、文和", description: "如真似幻动画大厅、模式选择与武将图鉴；皮肤、设置和联机接入本体，可混搭卡牌与对局外观。所有玩法规则由本体处理。", components: { home: { name: "如真似幻 · 交互大厅", runtime: "rzsh", settings: {}, assets: {}, style: {} } } }, assets: {} });
	packs.unshift({manifest: JSON.parse(JSON.stringify(shoushaManifest)), assets:{}});
	packs.push({manifest: JSON.parse(JSON.stringify(decadeManifest)), assets:{}});
	return packs.map(completeRzshIngame);
}
