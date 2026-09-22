import { game, lib } from "noname";
import { importOnlineSkin } from './skinTransfer.js';
import { underlyingAppearance } from '../ui/workshop/service.js';

// Native online views have separate storage. Carry only portable appearance
// preferences in the URL fragment, never accounts or rule settings. Custom UI
// assets use the separate local-only native transfer in skinTransfer.js.
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
	const source = JSON.stringify(portableAppearance(underlyingAppearance()));
	const appearance = btoa(encodeURIComponent(source)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
	return `#online=${encodeURIComponent(mode)}&appearance=${appearance}`;
}

export async function importOnlineAppearance() {
	const params = new URLSearchParams(location.hash.slice(1));
	const encoded = params.get("appearance");
	if (!params.has("online")) return;
	// Keep transfer failure visible: silently losing a selected skin looks like
	// a successful switch to the stock UI. A fresh native entry can retry it.
	try { await importOnlineSkin(params); }
	catch (error) {
		// Appearance transfer must not prevent the core from booting/reconnecting.
		// Keep the credential for an explicit retry and clearly report that the
		// requested appearance has not been applied; no successful fallback claim.
		console.warn("联机外观同步失败", error);
		const notice = document.createElement("section");
		notice.setAttribute("role", "alert");
		notice.style.cssText = "position:fixed;left:12px;right:12px;top:12px;z-index:10050;padding:16px;background:#35271f;color:#f4dfae;border:1px solid #ad8d53";
		const message = document.createElement("p");message.textContent = `所选联机外观尚未同步：${error.message || error}。当前保留上次已保存的外观；请在返回大厅后重新进入联机窗口。`;
		const close = document.createElement("button");close.textContent = "知道了";close.onclick = () => notice.remove();
		notice.append(message, close);document.body.append(notice);
		return;
	}
	if (!encoded) { history.replaceState(null, "", location.pathname + location.search + "#" + params); return; }
	try {
		const source = JSON.parse(decodeURIComponent(atob(encoded.replaceAll("-", "+").replaceAll("_", "/"))));
		await Promise.all(Object.entries(portableAppearance(source)).map(([key, value]) => game.promises.saveConfig(key, value)));
	} catch (error) {
		console.warn("无法同步联机外观设置，继续使用本地设置", error);
	}
	params.delete("appearance");
	history.replaceState(null, "", location.pathname + location.search + "#" + params);
}
