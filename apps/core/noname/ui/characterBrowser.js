import { lib, game, get, ui, _status } from "noname";
import { CharacterSearch } from "../util/characterSearch.js";
import { releasePortraitBackground } from "../util/portraitThumbnails.js";

/** Opt-in directory. Ordinary chooseButton dialogs retain their complete DOM. */
export function createCharacterBrowser({ ids, caption, heightset, noclick, onlypack, expandall }) {
	const dialog = ui.create.dialog("hidden");
	dialog.classList.add("character-browser", "character-browser-paged", "noupdate", "scroll1", "scroll2", "scroll3");
	if (heightset) { dialog.style.height = (game.layout === "long2" || game.layout === "nova" ? 430 : 400) + "px"; dialog._scrollset = true; }
	if (caption) dialog.add(caption);
	const search = ui.create.div(".searcher.caption", dialog.content);
	const searchRow = ui.create.div(".character-search-row", search);
	const input = document.createElement("input");
	input.placeholder = "支持正则搜索和技能搜索";
	input.setAttribute("aria-label", "搜索武将名称或技能，支持正则表达式");
	searchRow.append(input);
	const control = (parent, text, action, translatedHTML = false) => {
		const button = document.createElement("button");
		button.type = "button"; button.className = "tdnode pointerdiv shadowed reduce_radius";
		// Faction translations contain display markup, as in the legacy directory.
		if (translatedHTML) button.innerHTML = text;
		else button.textContent = text;
		button.onclick = action; parent.append(button); return button;
	};
	const searchButton = control(searchRow, "搜索", () => { void pager.search(input.value); });
	searchButton.className = "character-search-submit";
	const filters = ui.create.div(".caption.character-filters", dialog.content);
	const alphabet = ui.create.div(".character-filter-alphabet", filters);
	const groups = ui.create.div(".character-filter-groups", filters);
	const packs = document.createElement("select"); packs.setAttribute("aria-label", "筛选武将包"); groups.append(packs);
	const addOption = (value, label) => { const option = document.createElement("option"); option.value = value; option.textContent = get.plainText(label); packs.append(option); };
	addOption("", "全部武将包");
	for (const name of Object.keys(lib.characterPack)) if (!onlypack || name === onlypack) addOption(name, get.translation(`${name}_character_config`));
	if (onlypack) { packs.value = onlypack; packs.disabled = true; }
	const status = ui.create.div(".caption.character-browser-status", dialog.content); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
	const selection = ui.create.div(".character-browser-selection", dialog.content);
	const grid = ui.create.div(".buttons", dialog.content); grid.setAttribute("role", "group"); grid.setAttribute("aria-label", "人物候选");
	const footer = ui.create.div(".character-browser-pages", dialog.content);
	const previous = control(footer, "上一页", () => pager.go(pager.page - 1));
	const pageNumber = document.createElement("span"); footer.append(pageNumber);
	const next = control(footer, "下一页", () => pager.go(pager.page + 1));
	next.classList.add("page-next"); previous.classList.add("page-prev");
	const pageSize = Math.max(1, parseInt(lib.config.showMax_character_number) || 50);
	const capt = id => { const text = id.slice(id.lastIndexOf("_") + 1).charAt(0).toLowerCase(); return /[a-z]/.test(text) ? text : "自定义"; };
	const nodes = new Map();
	const selected = new Set();
	const disabled = new Map();
	const index = new CharacterSearch();
	let view = [], matches = ids.slice(), full = false, retired = false, token = 0, activeQuery = "", focusedId, legacyButtons;
	let alpha = "", group = "", category = !onlypack && !expandall && lib.characterDialogGroup[lib.config.character_dialog_tool] ? lib.config.character_dialog_tool : "";
	const refreshFilterControls = [];
	const matchesFilters = id => {
		if (!lib.character[id]) return false;
		if (alpha && capt(id) !== alpha) return false;
		if (packs.value && !lib.characterPack[packs.value]?.[id]) return false;
		if (category && lib.characterDialogGroup[category]?.(id, capt(id)) !== capt(id)) return false;
		const double = get.is.double(id);
		return !group || (group === "double" ? !!double : group === "ye" ? lib.character[id][1] === "ye" : !double && lib.character[id][1] === group);
	};
	const make = id => {
		let node = nodes.get(id);
		if (!node) {
			node = ui.create.button(id, "character", undefined, noclick);
			node.group = lib.character[id][1]; node.capt = capt(id);
			if (disabled.get(id) === "unselectable") node.classList.add("unselectable");
			node.tabIndex = 0; node.setAttribute("role", "button");
			node.setAttribute("aria-label", get.plainText(get.translation(id)));
			node.addEventListener("focus", () => { focusedId = id; });
			node.addEventListener("keydown", event => {
				if (!noclick && (event.key === "Enter" || event.key === " ")) {
					event.preventDefault(); event.stopPropagation();
					try { ui.click.button.call(node); } finally { _status.clicked = false; }
				}
			});
			nodes.set(id, node);
		}
		return node;
	};
	const pager = {
		page: 1,
		selectedIds: selected,
		disabledReasons: disabled,
		get total() { return ids.length; },
		get pageSize() { return pageSize; },
		get totalPages() { return Math.max(1, Math.ceil(matches.filter(matchesFilters).length / pageSize)); },
		get isMaterialized() { return full; },
		get buttons() { return full ? legacyButtons || ids.map(make) : [...new Set([...view, ...[...selected].map(id => nodes.get(id)).filter(Boolean)])]; },
		syncSelection() {
			selected.clear();
			for (const node of ui.selected.buttons) if (nodes.get(node.link) === node) selected.add(node.link);
			for (const node of pager.buttons) {
				node.setAttribute("aria-pressed", String(selected.has(node.link)));
				node.setAttribute("aria-disabled", String(disabled.has(node.link)));
			}
			selection.replaceChildren();
			for (const id of selected) control(selection, `取消选择：${get.plainText(get.translation(id))}`, () => {
				if (_status.event.dialog !== dialog) return;
				try { ui.click.button.call(nodes.get(id)); } finally { _status.clicked = false; }
				pager.render();
			});
		},
		reset() { selected.clear(); disabled.clear(); selection.replaceChildren(); for (const node of nodes.values()) node.classList.remove("selected", "selectable"); },
		pause() {
			token++; index.cancel(); searchButton.disabled = false; status.removeAttribute("aria-busy");
			pager.syncSelection();
			if (!full) {
				for (const [id, node] of nodes) if (!selected.has(id)) { releasePortraitBackground(node); node.remove(); nodes.delete(id); }
				view = []; grid.replaceChildren();
			}
		},
		resume() {
			index.clear();
			const version = ++token;
			pager.render(false);
			if (activeQuery) setTimeout(() => { if (version === token) void pager.search(activeQuery); }, 0);
		},
		materialize() {
			if (!full) { full = true; ids.forEach(make); pager.render(false); }
			return ids.map(make);
		},
		render(check = true) {
			if (retired) return;
			pager.syncSelection();
			const filtered = matches.filter(matchesFilters);
			const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
			pager.page = Math.max(1, Math.min(pager.page, pages));
			const pageIds = filtered.slice((pager.page - 1) * pageSize, pager.page * pageSize);
			const keepFocus = grid.contains(document.activeElement);
			view = pageIds.map(make);
			const fragment = document.createDocumentFragment();
			for (const node of full ? nodes.values() : view) {
				node.classList.toggle("nodisplay", !pageIds.includes(node.link));
				node.classList.toggle("selected", selected.has(node.link));
				fragment.append(node);
			}
			grid.replaceChildren(fragment);
			if (!full) for (const [id, node] of nodes) if (!pageIds.includes(id) && !selected.has(id)) { releasePortraitBackground(node); node.remove(); nodes.delete(id); }
			previous.disabled = pager.page === 1; next.disabled = pager.page === pages;
			previous.classList.toggle("no-prev", previous.disabled); next.classList.toggle("no-next", next.disabled);
			pageNumber.textContent = ` ${pager.page} / ${pages} `;
			const filterLabels = [category, alpha && `首字母：${alpha.toUpperCase()}`, group && `势力：${get.plainText(get.translation(group))}`, activeQuery && `搜索：${activeQuery}`].filter(Boolean);
			status.textContent = (filtered.length ? `共 ${filtered.length} 名人物` : "没有匹配的人物") + (filterLabels.length ? `（${filterLabels.join("，")}）` : "");
			if (check && _status.event.dialog === dialog && _status.event.filterButton) { delete _status.event._buttonChoice; game.check(); }
			if (keepFocus) (view.find(node => node.link === focusedId) || view[0])?.focus({ preventScroll: true });
		},
		go(page) { pager.page = page; pager.render(); dialog.contentContainer.scrollTop = 0; },
		async search(value) {
			if (retired) return;
			const version = ++token;
			index.cancel();
			status.removeAttribute("aria-busy");
			try { new RegExp(value); } catch { status.textContent = "正则表达式格式不正确，请修改后搜索"; input.setAttribute("aria-invalid", "true"); return; }
			input.removeAttribute("aria-invalid"); activeQuery = value;
			if (!value) { matches = ids.slice(); pager.page = 1; pager.render(); return; }
			status.textContent = "正在搜索…"; status.setAttribute("aria-busy", "true");
			try {
				const found = await index.find(value, ids);
				if (version !== token || !found) return;
				matches = found; pager.page = 1; pager.render();
			} catch (error) {
				if (version === token) status.textContent = error.message || "搜索未完成，请重试";
			} finally { if (version === token) status.removeAttribute("aria-busy"); }
		},
	};
	dialog.characterPager = pager;
	// Foreign code/AI asking for the historical full button array gets real DOM,
	// never metadata masquerading as a Button. Normal paged checks use pager.buttons.
	Object.defineProperty(dialog, "buttons", {
		configurable: true,
		get() { return legacyButtons ||= pager.materialize(); },
		set(value) {
			pager.pause(); retired = true; delete dialog.characterPager;
			for (const area of [search, filters, footer, selection]) area.remove();
			Object.defineProperty(dialog, "buttons", { configurable: true, writable: true, value });
		},
	});
	const toggle = (parent, values, getValue, setValue, translatedHTML = false) => {
		const controls = values.map(([value, label]) => control(parent, label, () => {
			setValue(getValue() === value ? "" : value);
			for (let i = 0; i < controls.length; i++) { const active = values[i][0] === getValue(); controls[i].classList.toggle("thundertext", active); controls[i].setAttribute("aria-pressed", String(active)); }
			pager.page = 1; pager.render();
		}, translatedHTML));
		const refresh = () => controls.forEach((button, i) => { button.classList.toggle("thundertext", values[i][0] === getValue()); button.setAttribute("aria-pressed", String(values[i][0] === getValue())); });
		refreshFilterControls.push(refresh);
		refresh();
	};
	toggle(alphabet, [...new Set(ids.map(capt))].sort().map(value => [value, value.toUpperCase()]), () => alpha, value => { alpha = value; });
	toggle(groups, [...new Set(ids.map(id => get.is.double(id) ? "double" : lib.character[id][1]))].sort(lib.sort.group).map(value => [value, get.translation(value)]), () => group, value => { group = value; }, true);
	toggle(groups, Object.keys(lib.characterDialogGroup).map(value => [value, value]), () => category, value => { category = value; });
	packs.onchange = () => {
		// Selecting a pack starts a new browse scope. A saved "recent" default,
		// a previous search or faction must not silently hide most of the pack.
		alpha = group = category = "";
		input.value = "";
		refreshFilterControls.forEach(refresh => refresh());
		void pager.search("");
	};
	input.onkeydown = event => { event.stopPropagation(); if (event.key === "Enter" && !event.isComposing) { event.preventDefault(); void pager.search(input.value); } };
	for (const element of [search, filters, footer, selection]) for (const event of ["keydown", "keyup", "keypress", "mousedown", "touchend", "click"]) element.addEventListener(event, e => e.stopPropagation());
	grid.addEventListener("keydown", event => {
		event.stopPropagation();
		if (event.key === "PageDown" || event.key === "PageUp") { event.preventDefault(); event.stopPropagation(); pager.go(pager.page + (event.key === "PageDown" ? 1 : -1)); }
	});
	grid.addEventListener("keyup", event => event.stopPropagation());
	dialog.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", () => { _status.clicked2 = true; });
	pager.render(false);
	return dialog;
}
