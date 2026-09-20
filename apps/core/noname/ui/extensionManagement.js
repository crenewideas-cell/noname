/** A native dialog keeps focus and Escape behavior without browser confirm(). */
export function confirmExtensionRemoval(name) {
	return new Promise(resolve => {
		const dialog = document.createElement("dialog");
		dialog.className = "extension-management-dialog";
		const heading = document.createElement("h2"), description = document.createElement("p"), scope = document.createElement("div");
		heading.textContent = "物理删除扩展";
		description.textContent = "扩展包、包内子包、武将和素材会一起删除，并清理该扩展的配置。此操作无法撤销。";
		scope.className = "extension-removal-scope"; scope.textContent = name;
		const label = document.createElement("label"), input = document.createElement("input");
		label.textContent = "输入扩展完整名称确认"; input.autocomplete = "off"; input.placeholder = name;
		label.append(input);
		const actions = document.createElement("div"), cancel = document.createElement("button"), commit = document.createElement("button");
		actions.className = "extension-management-actions";
		cancel.textContent = "保留扩展"; commit.textContent = "确认物理删除"; commit.className = "danger"; commit.disabled = true;
		input.oninput = () => { commit.disabled = input.value !== name; };
		let settled = false;
		const finish = value => { if (settled) return; settled = true; dialog.close(); dialog.remove(); resolve(value); };
		cancel.onclick = () => finish(false); commit.onclick = () => { if (input.value === name) finish(true); };
		dialog.addEventListener("cancel", event => { event.preventDefault(); finish(false); });
		dialog.addEventListener("close", () => finish(false));
		actions.append(cancel, commit); dialog.append(heading, description, scope, label, actions); document.body.append(dialog); dialog.showModal(); input.focus();
	});
}
