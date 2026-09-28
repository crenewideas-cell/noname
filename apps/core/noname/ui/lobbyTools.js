import { lib } from "noname";

let activeMenu;

/** Shared host-owned lobby menu; providers supply only their distinct actions. */
export function openLobbyTools({ title = "大厅", onSettings = () => lib.uiWorkshop.openSettings("options"), onSuiteSettings, onOnline, onOriginal, onHome = () => {} }) {
	activeMenu?.destroy();
	const previousFocus = document.activeElement;
	const overlay = document.createElement("div");
	overlay.className = "lobby-tool-menu";
	overlay.setAttribute("role", "dialog");
	overlay.setAttribute("aria-modal", "true");
	overlay.setAttribute("aria-label", `${title}菜单`);
	const panel = document.createElement("section");
	panel.tabIndex = -1;
	const heading = document.createElement("h2");
	heading.textContent = title;
	panel.append(heading);
	overlay.append(panel);
	const menu = {
		destroy() {
			overlay.remove();
			if (activeMenu !== menu) return;
			activeMenu = undefined;
			if (previousFocus?.isConnected) previousFocus.focus?.();
		},
	};
	activeMenu = menu;
	const add = (label, run) => {
		const button = document.createElement("button");
		button.type = "button";
		button.textContent = label;
		button.onclick = () => {
			menu.destroy();
			Promise.resolve().then(run).catch(error => {
				console.error(`${label}打开失败`, error);
				alert(`${label}打开失败：${error.message || error}`);
			});
		};
		panel.append(button);
	};
	add("UI 工坊", () => lib.uiWorkshop.open());
	add("大厅设置", onSettings);
	if (onSuiteSettings && onSuiteSettings !== onSettings) add("界面专属设置", onSuiteSettings);
	add("联机对战", onOnline);
	if (onOriginal) add("原版功能菜单", onOriginal);
	add("返回大厅", onHome);
	overlay.onclick = event => { if (event.target === overlay) menu.destroy(); };
	overlay.onkeydown = event => {
		if (event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			menu.destroy();
		}
	};
	document.body.append(overlay);
	panel.focus();
	return menu;
}
