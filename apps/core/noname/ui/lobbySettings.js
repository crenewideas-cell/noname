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
export let isLobbySettings = Object.hasOwn(destinations, lobbySettingsPage || "");
let prepareSettings;
let pendingSettings;
let heading;
let previousFocus;

export function configureLobbySettings(prepare) {
	prepareSettings = prepare;
}

export async function openLobbySettings(page = "options") {
	if (!Object.hasOwn(destinations, page)) return;
	previousFocus = document.activeElement;
	isLobbySettings = true;
	if (prepareSettings) {
		pendingSettings ||= prepareSettings();
		await pendingSettings;
	}
	showLobbySettings(page);
}

export function closeLobbySettings() {
	if (window.inSplash) {
		ui.menuContainer.cancelPreparation?.();
		ui.menuContainer.classList.add("hidden");
		ui.window.querySelectorAll(".popup-container").forEach(node => node.classList.add("hidden"));
		ui.window.classList.remove("lobby-settings-overlay");
		ui.window.classList.remove("touchinfohidden");
		ui.arena.classList.remove("menupaused");
		ui.historybar.classList.remove("menupaused");
		ui.config2.classList.remove("pressdown2");
		document.documentElement.classList.remove("lobby-settings-page");
		heading?.remove();
		heading = undefined;
		game.resume2();
		previousFocus?.focus?.();
		return;
	}
	const url = new URL(location.href);
	url.searchParams.delete("lobbySettings");
	history.replaceState(null, "", url);
	sessionStorage.setItem(lib.configprefix + "return_to_lobby", "true");
	localStorage.removeItem(lib.configprefix + "directstart");
	window.onbeforeunload = null;
	// The engine waits for pending config/extension database writes before reload.
	game.reload();
}

export function showLobbySettings(page = lobbySettingsPage || "options") {
	isLobbySettings = true;
	document.documentElement.classList.add("lobby-settings-page");
	if (window.inSplash) ui.window.classList.add("lobby-settings-overlay");
	heading?.remove();
	const header = heading = document.createElement("header");
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
	if (ui.menuContainer.classList.contains("hidden")) ui.click.config();
	const [tab, category] = destinations[page];
	ui.click.menuTab(tab);
	if (category) {
		ui.menuContainer.querySelector(".menu-content > div")?.selectCategory?.(category);
	}
	clearTimeout(window.resetGameTimeout);
	delete window.resetGameTimeout;
}
