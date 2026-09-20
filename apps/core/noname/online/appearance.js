import { game, lib } from "noname";

// Native online views have separate storage. Carry only portable appearance
// preferences, never account data, extensions, rule settings or local assets.
const booleanKeys = ["phonelayout", "image_background_blur", "image_background_random", "hide_card_image"];
const choiceKeys = ["theme", "layout", "presentation_style", "player_style", "border_style", "player_border", "card_style", "cardback_style", "hp_style", "control_style", "menu_style", "radius_size", "cardshape", "player_height", "player_height_nova"];

function portableAppearance(source) {
	const result = {};
	if (!source || typeof source !== "object") return result;
	for (const key of booleanKeys) {
		if (typeof source[key] === "boolean") result[key] = source[key];
	}
	for (const key of choiceKeys) {
		const value = key === "layout" && source[key] === "default" ? "mobile" : source[key];
		// Themes are registered from package.js after the boot CSS is loaded.
		const choices = key === "theme" ? { woodden: true, music: true, simple: true } : lib.configMenu.appearence.config[key]?.item;
		if (typeof value === "string" && value !== "custom" && choices && Object.hasOwn(choices, value)) result[key] = value;
	}
	if (typeof source.ui_zoom === "string" && /^\d{2,3}%$/.test(source.ui_zoom)) {
		const zoom = parseInt(source.ui_zoom);
		if (zoom >= 50 && zoom <= 300) result.ui_zoom = source.ui_zoom;
	}
	return result;
}

export function onlineEntryFragment(mode) {
	const appearance = btoa(encodeURIComponent(JSON.stringify(portableAppearance(lib.config)))).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
	return `#online=${encodeURIComponent(mode)}&appearance=${appearance}`;
}

export async function importOnlineAppearance() {
	const params = new URLSearchParams(location.hash.slice(1));
	const encoded = params.get("appearance");
	if (!params.has("online") || !encoded) return;
	try {
		const source = JSON.parse(decodeURIComponent(atob(encoded.replaceAll("-", "+").replaceAll("_", "/"))));
		await Promise.all(Object.entries(portableAppearance(source)).map(([key, value]) => game.promises.saveConfig(key, value)));
	} catch (error) {
		console.warn("无法同步联机外观设置，继续使用本地设置", error);
	}
	params.delete("appearance");
	history.replaceState(null, "", location.pathname + location.search + "#" + params);
}
