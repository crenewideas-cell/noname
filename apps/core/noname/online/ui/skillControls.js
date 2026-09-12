import { lib, ui, get, _status } from "noname";

/** Keep the engine's availability decisions and click handlers authoritative. */
export function installSkillControls() {
	document.body.classList.add("online-managed-game");
	const textbuttons = ui.create.textbuttons;
	ui.create.textbuttons = function (list, dialog, ...args) {
		const result = textbuttons.call(this, list, dialog, ...args);
		decorateChoiceDialog(dialog);
		return result;
	};
	for (const name of ["skills", "skills2", "skills3"]) {
		const create = ui.create[name];
		ui.create[name] = function (...args) {
			const result = create.apply(this, args);
			const control = ui[name];
			if (control) decorateSkillControl(control, _status.event.player);
			ui.updatec();
			return result;
		};
	}
}

export function decorateChoiceDialog(dialog) {
	dialog.classList.add("online-choice-dialog");
	for (const button of dialog.buttons) {
		if (button.classList.contains("textbutton")) button.title = button.textContent;
	}
}

export function decorateSkillControl(control, player) {
	control.classList.add("online-skill-control");
	control.setAttribute("role", "group");
	control.setAttribute("aria-label", "当前可发动的技能");
	for (const button of control.children) {
		const skill = button.link,
			info = lib.skill[skill];
		if (!info) continue;
		button.classList.add("online-skill-action");
		button.setAttribute("role", "button");
		button.tabIndex = 0;
		const name = get.skillTranslation(skill, player, true);
		const limit = typeof info.usable === "number" ? info.usable : undefined;
		const remaining = limit === undefined ? undefined : Math.max(0, limit - get.skillCount(skill, player));
		const state = remaining === undefined ? "可发动" : `可发动 · 余${remaining}次`;
		button.dataset.state = state;
		const text = document.createElement("div");
		text.innerHTML = get.skillInfoTranslation(skill, player) || "";
		button.title = `${name}｜${state}\n${text.textContent}`;
		button.setAttribute("aria-label", `${name}，${state}`);
		button.onkeydown = event => {
			if (event.key !== "Enter" && event.key !== " ") return;
			event.preventDefault();
			if (!control.isConnected || control.classList.contains("removing") || control.classList.contains("disabled") || !control.skills?.includes(skill) || !_status.event.isMine()) return;
			// Use the same control callback as a pointer activation.
			ui.click.control.call(button);
		};
	}
}
