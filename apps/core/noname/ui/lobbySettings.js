import { game, lib, ui } from "noname";

const destinations = {
	options: ["选项"],
	log: ["选项", "view"],
	audio: ["选项", "audio"],
	characters: ["武将"],
	cards: ["卡牌"],
	extensions: ["扩展"],
	other: ["其它"],
};
export const lobbySettingsPage = new URLSearchParams(location.search).get("lobbySettings");
export const isLobbySettings = Object.hasOwn(destinations, lobbySettingsPage || "");

export function openLobbySettings(page = "options") {
	if (!Object.hasOwn(destinations, page)) return;
	const url = new URL(location.href);
	url.hash = "";
	url.searchParams.set("lobbySettings", page);
	history.replaceState(null, "", url);
	window.onbeforeunload = null;
	game.reload();
}

export function closeLobbySettings() {
	const url = new URL(location.href);
	url.searchParams.delete("lobbySettings");
	history.replaceState(null, "", url);
	sessionStorage.setItem(lib.configprefix + "return_to_lobby", "true");
	localStorage.removeItem(lib.configprefix + "directstart");
	window.onbeforeunload = null;
	// The engine waits for pending config/extension database writes before reload.
	game.reload();
}

export function showLobbySettings() {
	document.documentElement.classList.add("lobby-settings-page");
	const header = document.createElement("header");
	header.className = "lobby-settings-heading";
	const title = document.createElement("strong");
	title.textContent = "大厅设置";
	const hint = document.createElement("span");
	hint.textContent = "设置自动保存，完成后返回大厅";
	const back = document.createElement("button");
	back.type = "button";
	back.textContent = "完成 · 返回大厅";
	back.onclick = closeLobbySettings;
	header.append(title, hint, back);
	document.body.appendChild(header);
	ui.click.config();
	const [tab, category] = destinations[lobbySettingsPage];
	ui.click.menuTab(tab);
	if (category) {
		ui.menuContainer.querySelector(".menu-content > div")?.selectCategory?.(category);
	}
	clearTimeout(window.resetGameTimeout);
	delete window.resetGameTimeout;
}
