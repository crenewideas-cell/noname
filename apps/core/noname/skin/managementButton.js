import { openSkinManager } from './manager.js';
import { lib } from 'noname';

/** The same entry is used by character details and both lobby galleries. */
export function createSkinManagementButton(character, onChange) {
	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'skin-management-entry';
	button.title = '皮肤管理 · 套装与批量设置';
	const icon = document.createElement('span');
	icon.className = 'skin-management-entry-icon';
	icon.setAttribute('aria-hidden', 'true');
	const label = document.createElement('span');
	label.textContent = '皮肤管理';
	button.append(icon, label);
	button.onclick = event => {
		event.stopPropagation();
		const before = lib.config.skin_management;
		const enabled = lib.config.change_skin;
		const manager = openSkinManager(typeof character === 'function' ? character() : character);
		if (onChange) manager.addEventListener('close', () => {
			if (before !== lib.config.skin_management || enabled !== lib.config.change_skin) onChange();
		}, { once: true });
	};
	return button;
}
