/** Shared profile controls. Themes own placement, labels and unique options. */
export function createProfileControls({ lib, game, ui, get }) {
	const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
	const heading = (label, key, fallback) => `<h2><img src="${escape(lib.assetURL + get.qhly_getCurrentViewSkinValue(key, 'extension/千幻聆音/image/' + fallback))}" style="width:50px;margin-bottom:-4px;"/>${label}</h2>`;
	const checkboxRow = (id, textId, label) => `<p><span style="display:inline-block;height:30px;"><img id="${escape(id)}"/><span id="${escape(textId)}" style="display:inline-block;position:relative;bottom:25%;">${escape(label)}</span></span></p>`;
	const selectRow = id => `<p><select style="font-size:22px;font-family:qh_youyuan;" id="${id}"></select></p>`;
	const setMember = (key, name, enabled) => {
		const values = new Set(lib.config[key] || []);
		if (enabled) values.add(name); else values.delete(name);
		lib.config[key] = [...values];
		game.saveConfig(key, lib.config[key]);
	};
	const controls = {
		favoriteTemplate(name) {
			return heading('收藏设置', 'favouriteImage', 'newui_fav.png') + '<p>可以选择收藏此武将。进行自由选将操作时，可以更快找到此武将。</p>' + checkboxRow('qhconfig_checkbox_fav', 'qhconfig_checkbox_text_fav', '收藏' + get.translation(name));
		},
		optionsTemplate(name) {
			let html = heading('禁用设置', 'forbidImage', 'newui_forbid.png') + '<p>可以选择在某模式下禁用或启用该武将。该设置将在重启游戏后生效。</p>' + checkboxRow('qhconfig_checkbox_banned_mode_all', 'qhconfig_checkbox_text_all', '所有模式禁用');
			for (const mode of Object.keys(lib.mode)) if (mode !== 'connect') html += checkboxRow('qhconfig_checkbox_banned_mode_' + mode, 'qhconfig_checkbox_text_' + mode, ({tafang:'塔防',chess:'战棋'}[mode] || get.translation(mode)) + '模式禁用');
			html += checkboxRow('qhconfig_checkbox_banned_ai', 'qhconfig_checkbox_text_ai', '仅自由选将可选');
			html += heading('等阶设置', 'rankImage', 'newui_rank_icon.png') + `<p>可以设置${escape(get.translation(name))}的等阶，重启后生效。</p>` + selectRow('qhconfig_rank_select');
			if (lib.config.qhly_enableCharacterMusic) html += heading('音乐设置', 'musicImage', 'newui_music_icon.png') + `<p>可以设置${escape(get.translation(name))}的专属背景音乐，在游戏开始时将自动切换。</p>` + selectRow('qhconfig_music_select');
			return html;
		},
		music(select, name) {
			const current = game.qhly_getCharacterMusic(name);
			select.replaceChildren();
			for (const [path, label] of [['', '无'], ...Object.entries(lib.qhlyMusic || {}).map(([path, music]) => [path, music.name])]) {
				const option = document.createElement('option');
				option.textContent = label; option.setAttribute('musicpath', path); option.selected = path === (current || ''); select.appendChild(option);
			}
			select.onchange = () => {
				const option = select.options[select.selectedIndex];
				if (!option) return;
				const path = option.getAttribute('musicpath'); lib.config.qhly_characterMusic ||= {};
				if (path) lib.config.qhly_characterMusic[name] = path; else delete lib.config.qhly_characterMusic[name];
				game.saveConfig('qhly_characterMusic', lib.config.qhly_characterMusic);
				// Canvas lobbies own their audio; the core music node exists in game.
				if (ui.backgroundMusic) game.qhly_switchBgm();
			};
		},
		favorite(checkbox, name, bindText) {
			ui.qhly_initCheckBox(checkbox, !!lib.config.favouriteCharacter?.includes(name));
			bindText(checkbox, document.getElementById('qhconfig_checkbox_text_fav'));
			checkbox.qhly_onchecked = checked => setMember('favouriteCharacter', name, checked);
		},
		modeBans(owner, name, bindText) {
			const modes = Object.keys(lib.mode).filter(mode => mode !== 'connect');
			const all = document.getElementById('qhconfig_checkbox_banned_mode_all');
			owner.banned_checkbox_mode_all = all;
			const refresh = () => all.qhly_setChecked(modes.length > 0 && modes.every(mode => lib.config[mode + '_banned']?.includes(name)), false);
			ui.qhly_initCheckBox(all, false);
			bindText(all, document.getElementById('qhconfig_checkbox_text_all'));
			for (const mode of modes) {
				const checkbox = document.getElementById('qhconfig_checkbox_banned_mode_' + mode);
				owner['banned_checkbox_mode_' + mode] = checkbox;
				if (!checkbox) continue;
				ui.qhly_initCheckBox(checkbox, !!lib.config[mode + '_banned']?.includes(name));
				bindText(checkbox, document.getElementById('qhconfig_checkbox_text_' + mode));
				checkbox.qhly_onchecked = checked => { setMember(mode + '_banned', name, checked); refresh(); };
			}
			all.qhly_onchecked = checked => {
				for (const mode of modes) owner['banned_checkbox_mode_' + mode]?.qhly_setChecked(checked, true);
				refresh();
			};
			refresh();
			const ai = document.getElementById('qhconfig_checkbox_banned_ai');
			ui.qhly_initCheckBox(ai, game.qhly_isForbidAI(name));
			bindText(ai, document.getElementById('qhconfig_checkbox_text_ai'));
			ai.qhly_onchecked = checked => game.qhly_setForbidAI(name, checked);
		},
		autoSkill(checkbox, skill, bindText) {
			const info = get.info(skill), skills = [...new Set([...(info.frequent ? [skill] : []), ...(info.subfrequent || []).map(sub => skill + '_' + sub)])];
			ui.qhly_initCheckBox(checkbox, skills.some(id => !lib.config.autoskilllist?.includes(id)));
			bindText(checkbox, document.getElementById('qhly_autoskill_text_' + skill));
			checkbox.qhly_onchecked = checked => {
				const disabled = new Set(lib.config.autoskilllist || []);
				for (const id of skills) if (checked) disabled.delete(id); else disabled.add(id);
				lib.config.autoskilllist = [...disabled]; game.saveConfig('autoskilllist', lib.config.autoskilllist);
			};
		},
		rarity(select, name, refreshRank, icons = {}) {
			const ranks = [['默认','default'],['普通','junk'],['精品','common'],['稀有','rare'],['史诗','epic'],['传说','legend']];
			select.replaceChildren();
			for (const [label, value] of ranks) {
				const option = document.createElement('option');
				option.textContent = label + (icons[label] || ''); option.setAttribute('rank', value);
				option.selected = value === (lib.config.qhly_rarity?.[name] || 'default'); select.appendChild(option);
			}
			select.onchange = () => {
				const rank = select.options[select.selectedIndex]?.getAttribute('rank');
				if (!rank) return;
				lib.config.qhly_rarity ||= {};
				if (rank === 'default') delete lib.config.qhly_rarity[name]; else lib.config.qhly_rarity[name] = rank;
				game.saveConfig('qhly_rarity', lib.config.qhly_rarity); refreshRank();
			};
		},
	};
	return controls;
}
