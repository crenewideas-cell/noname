import { game, lib, ui, _status } from "noname";
import { save } from "@/util/config.js";

let activeDialog;

/** Leave through a full reload so every mode can release its own runtime. */
async function navigate(destination) {
	if (_status.reloading) return;
	const keys = destination === "lobby"
		? ["continue_name", "reconnect_info", "directstartmode", "tmp_user_roomId"]
		: ["continue_name"];
	for (const key of keys) {
		await save(key, "config", undefined);
		delete lib.config[key];
	}
	for (const key of ["playback", "playbackmode"]) {
		localStorage.removeItem(lib.configprefix + key);
	}
	if (destination === "lobby") {
		sessionStorage.setItem(lib.configprefix + "return_to_lobby", "true");
		localStorage.removeItem(lib.configprefix + "directstart");
	} else {
		sessionStorage.removeItem(lib.configprefix + "return_to_lobby");
		localStorage.setItem(lib.configprefix + "directstart", "true");
	}
	// reload waits for outstanding engine database writes and unloads network connections.
	window.onbeforeunload = null;
	game.reload();
}

/** Shared by the toolbar and both local/online settings menus. */
export function openGameNavigation() {
	if (_status.reloading) return;
	if (activeDialog?.isConnected) {
		activeDialog.querySelector("button")?.focus();
		return;
	}
	const online = Boolean(_status.connectMode || game.online || lib.config.mode === "connect");
	const dialog = document.createElement("dialog");
	dialog.className = "game-navigation";
	dialog.setAttribute("aria-labelledby", "game-navigation-title");
	dialog.setAttribute("aria-describedby", "game-navigation-description");
	const title = document.createElement("h2");
	title.id = "game-navigation-title";
	title.textContent = "对局操作";
	const description = document.createElement("p");
	description.id = "game-navigation-description";
	description.textContent = online
		? "返回主界面将离开当前联机房间，之后可重新选择模式。"
		: "返回主界面可重新选择模式；重新开始会结束当前对局，并重新进入本模式。";
	const status = document.createElement("p");
	status.className = "game-navigation-status";
	status.setAttribute("role", "status");
	const actions = document.createElement("div");
	actions.className = "game-navigation-actions";
	let busy = false;
	let ownsPause = false;
	const addAction = (label, action, className = "") => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = className;
		button.textContent = label;
		button.addEventListener("click", action);
		actions.appendChild(button);
		return button;
	};
	const leave = async destination => {
		if (busy) return;
		busy = true;
		actions.querySelectorAll("button").forEach(button => { button.disabled = true; });
		status.textContent = destination === "lobby" ? "正在返回主界面…" : "正在重新开始…";
		try {
			await navigate(destination);
		} catch (error) {
			console.error("对局导航失败:", error);
			status.textContent = "操作未完成，请重试，或关闭此窗口继续游戏。";
			busy = false;
			actions.querySelectorAll("button").forEach(button => { button.disabled = false; });
		}
	};
	addAction("继续游戏", () => {
		dialog.close();
		if (ui.menuContainer && !ui.menuContainer.classList.contains("hidden")) {
			ui.click.configMenu?.();
		}
		if (ui.connectMenuContainer && !ui.connectMenuContainer.classList.contains("hidden")) {
			ui.click.connectMenu?.();
		}
	});
	if (!online) addAction("重新开始", () => leave("restart"));
	addAction(online ? "退出房间并返回主界面" : "返回主界面", () => leave("lobby"), "primary");
	dialog.append(title, description, actions, status);
	// Keep game keyboard shortcuts out of the modal; Escape retains native close behavior.
	for (const event of ["keydown", "keyup", "keypress", "click", "touchend"]) {
		dialog.addEventListener(event, e => e.stopPropagation());
	}
	dialog.addEventListener("cancel", event => { if (busy) event.preventDefault(); });
	dialog.addEventListener("close", () => {
		dialog.remove();
		if (activeDialog === dialog) activeDialog = undefined;
		if (ownsPause && !_status.reloading) game.resume2();
	}, { once: true });
	document.body.appendChild(dialog);
	try {
		dialog.showModal();
		activeDialog = dialog;
		if (!online && !_status.paused2) {
			game.pause2();
			ownsPause = true;
		}
	} catch (error) {
		dialog.remove();
		throw error;
	}
}
