import { get, lib } from 'noname';
import { CharacterSearch } from '../util/characterSearch.js';
import { createSkinManagementButton } from '../skin/managementButton.js';
import { characterGalleryPacks } from './workshop/characterGallery.js';

/** Wire the existing canvas controls to the core search index and scene grid. */
export function createLobbyCharacterTools({ page, filterButton, searchButton, filterLabel, powerBar, allCards, render, canvas, renderer, ticker }) {
	const index = new CharacterSearch();
	let source = [], revision = 0, disposed = false, composing = false;
	const host = document.createElement('div');
	host.className = 'lobby-character-tools';
	host.hidden = !page.parent;
	const manage = createSkinManagementButton();
	manage.classList.add('lobby-character-manage');
	manage.setAttribute('aria-label', '皮肤管理');
	// Draw both text and frame on the clickable DOM control. Never depend on a
	// separate scene sprite being visible, or hide this entry for lack of space.
	manage.hidden = true;
	const panel = document.createElement('form');
	panel.className = 'lobby-character-search';
	panel.hidden = true;
	panel.setAttribute('aria-label', '武将筛选与搜索');
	const heading = document.createElement('strong');
	heading.textContent = '寻将 · 筛选';
	const input = document.createElement('input');
	input.type = 'search';
	input.placeholder = '武将名称 / 技能，支持正则搜索';
	input.setAttribute('aria-label', '搜索武将名称或技能');
	const category = document.createElement('select');
	category.setAttribute('aria-label', '武将筛选');
	for (const [value, label] of [['', '全部武将'], ['favourite', '收藏武将'], ['male', '男武将'], ['female', '女武将']]) category.add(new Option(label, value));
	const faction = document.createElement('select');
	faction.setAttribute('aria-label', '势力筛选');
	const pack = document.createElement('select');
	pack.setAttribute('aria-label', '将包分类');
	pack.add(new Option('当前左侧分类', ''));
	const galleryPacks = characterGalleryPacks(Object.fromEntries(Object.entries(lib.characterPack || {}).map(([id, character]) => [id, { character }])));
	for (const [id, members] of Object.entries(galleryPacks)) if (Object.keys(members.character).length) pack.add(new Option(id === 'huodongcharacter' ? '其他武将' : get.plainText(get.translation(id + '_character_config')), id));
	const filters = document.createElement('div');
	filters.className = 'lobby-character-search-filters';
	filters.append(pack, category, faction);
	const actions = document.createElement('div');
	actions.className = 'lobby-character-search-actions';
	const button = (label, type, action) => {
		const node = document.createElement('button');
		node.type = type; node.textContent = label;
		if (action) node.onclick = action;
		actions.append(node);
		return node;
	};
	button('搜索', 'submit');
	button('重置', 'button', () => { input.value = category.value = faction.value = pack.value = ''; void apply(); });
	const status = document.createElement('p');
	status.className = 'lobby-character-search-status';
	status.setAttribute('role', 'status');
	status.setAttribute('aria-live', 'polite');
	status.hidden = true;
	panel.append(heading, input, filters, actions);
	host.append(manage, panel, status);
	document.body.append(host);
	let placement;
	const powerLayout = powerBar ? { x: powerBar.x, scaleX: powerBar.scale.x } : null;
	const positionManage = () => {
		if (disposed) return;
		if (host.hidden || !canvas?.isConnected) { placement = undefined;return; }
		// Align to the filter frame and reserve the actual gap after the power bar.
		const frame = filterButton.texture.orig, anchor = filterButton.anchor;
		const corner = filterButton.toGlobal({ x: -anchor.x * frame.width, y: -anchor.y * frame.height });
		const end = filterButton.toGlobal({ x: (1 - anchor.x) * frame.width, y: (1 - anchor.y) * frame.height });
		const bounds = { x: corner.x, y: corner.y, width: end.x - corner.x, height: end.y - corner.y };
		const rect = canvas.getBoundingClientRect(), outer = host.getBoundingClientRect();
		if (!bounds.width || !bounds.height || !rect.width || !rect.height || !outer.width || !outer.height) return;
		const parent = powerBar?.parent?.worldTransform;
		const key = [bounds.x,bounds.y,bounds.width,bounds.height,parent?.a,parent?.d,parent?.tx,parent?.ty,rect.left,rect.top,rect.width,rect.height,outer.left,outer.top,outer.width,outer.height,host.clientWidth,host.clientHeight].join(':');
		if (placement === key) return;
		placement = key;
		// PIXI world bounds -> canvas viewport -> this DOM overlay's CSS units.
		const sx = host.clientWidth / outer.width, sy = host.clientHeight / outer.height;
		const scaleX = rect.width / renderer.screen.width, scaleY = rect.height / renderer.screen.height;
		const gutter = bounds.height * .16;
		const height = bounds.height;
		const width = height * 2.5;
		const x = bounds.x - gutter - width;
		const y = bounds.y;
		// Keep the accepted button size and row. Reserve its slot by fitting the
		// power bar's right edge, preserving the bar's left edge and vertical size.
		if (powerLayout && powerBar.parent) {
			powerBar.x = powerLayout.x;
			powerBar.scale.x = powerLayout.scaleX;
			const power = { ...powerBar.getBounds() };
			const available = x - gutter - power.x;
			if (power.width > available && available > 0) {
				powerBar.scale.x *= available / power.width;
				const shifted = powerBar.getBounds();
				const origin = powerBar.toGlobal({ x: 0, y: 0 });
				powerBar.x = powerBar.parent.toLocal({ x: origin.x + power.x - shifted.x, y: origin.y }).x;
			}
		}
		const cssWidth = width * scaleX * sx, cssHeight = height * scaleY * sy;
		manage.style.left = ((rect.left + x * scaleX - outer.left) * sx) + 'px';
		manage.style.top = ((rect.top + y * scaleY - outer.top) * sy) + 'px';
		manage.style.setProperty('--skin-entry-width', cssWidth + 'px');
		manage.style.setProperty('--skin-entry-height', cssHeight + 'px');
		manage.style.fontSize = Math.min(cssHeight * .44, cssWidth / 5.4) + 'px';
		manage.style.fontFamily = filterLabel.style.fontFamily;
		// The shared skin-management-entry CSS owns the frame in both locations.
		manage.hidden = false;
	};
	ticker?.add(positionManage);
	positionManage();
	const groups = card => Array.isArray(card.secgroup) ? card.secgroup : [card.secgroup];
	async function apply() {
		const token = ++revision, query = input.value.trim();
		const cards = (pack.value && allCards ? allCards() : source).slice();
		index.cancel();
		status.hidden = false;
		status.textContent = query ? '正在寻找武将…' : '';
		panel.setAttribute('aria-busy', 'true');
		try {
			// CharacterSearch supplies the same name/skill/regex matching as the core browser.
			const ids = query ? await index.find(query, [...new Set(cards.map(card => card.name))]) : cards.map(card => card.name);
			if (disposed || token !== revision || ids === null) return;
			const matched = new Set(ids);
			const visible = cards.filter(card => matched.has(card.name)
				&& (!pack.value || card.pack === pack.value || Object.hasOwn(galleryPacks[pack.value]?.character || {}, card.name))
				&& (!category.value || (category.value === 'favourite' ? card.fav : get.character(card.name).sex === category.value))
				&& (!faction.value || groups(card).includes(faction.value)));
			render(visible);
			const labels = [pack.value, category.value && category.selectedOptions[0].textContent, faction.value && faction.selectedOptions[0].textContent, query && '搜索中'].filter(Boolean);
			filterLabel.text = labels.length ? `已筛选 · ${visible.length}` : '全部武将';
			status.textContent = visible.length ? `找到 ${visible.length} 位武将` : '没有符合条件的武将，可重置筛选或切换武将包';
			status.hidden = visible.length > 0 && !labels.length;
		} catch (error) {
			if (!disposed && token === revision) { status.hidden = false; status.textContent = `搜索失败：${error.message || error}`; }
		} finally {
			if (!disposed && token === revision) panel.removeAttribute('aria-busy');
		}
	}
	function show(cards) {
		if (disposed) return;
		source = cards.slice();
		const selected = faction.value;
		faction.replaceChildren(new Option('全部势力', ''));
		for (const group of new Set((allCards?.() || source).flatMap(groups).filter(Boolean))) faction.add(new Option(get.plainText(get.translation(group)), group));
		faction.value = [...faction.options].some(option => option.value === selected) ? selected : '';
		void apply();
	}
	const open = focus => { panel.hidden = false; focus.focus(); };
	const openFilter = () => open(category), openSearch = () => open(input);
	for (const sprite of [filterButton, searchButton]) { sprite.interactive = true; sprite.buttonMode = true; }
	filterButton.on('pointertap', openFilter);
	searchButton.on('pointertap', openSearch);
	input.oncompositionstart = () => { composing = true; };
	input.oncompositionend = () => { composing = false; };
	panel.onsubmit = event => { event.preventDefault(); if (!composing) void apply(); };
	input.onsearch = () => { void apply(); };
	category.onchange = faction.onchange = pack.onchange = () => { void apply(); };
	const outside = event => { if (!panel.hidden && !panel.contains(event.target)) panel.hidden = true; };
	document.addEventListener('pointerdown', outside, true);
	document.addEventListener('contextmenu', outside, true);
	for (const type of ['keydown', 'keyup', 'keypress', 'pointerdown', 'pointerup', 'click', 'touchend']) host.addEventListener(type, event => {
		event.stopPropagation();
		if (type === 'keydown' && event.key === 'Escape') { event.preventDefault(); panel.hidden = true; }
	});
	const enter = () => { host.hidden = false; placement = undefined; positionManage(); if (source.length) void apply(); };
	const leave = () => { host.hidden = true; panel.hidden = true; revision++; index.cancel(); panel.removeAttribute('aria-busy'); };
	page.on('added', enter); page.on('removed', leave);
	return {
		show,
		popular(cards) {
			const recent = [...new Set([...(get.config('recentCharacter') || []), ...Object.values(lib.config.mode_config || {}).flatMap(mode => mode.recentCharacter || [])])];
			const usage = lib.config.character_usage || {};
			return cards.filter(card => usage[card.name]?.count || recent.includes(card.name)).sort((a,b) => (usage[b.name]?.count || 0) - (usage[a.name]?.count || 0) || (usage[b.name]?.last || 0) - (usage[a.name]?.last || 0) || recent.indexOf(a.name) - recent.indexOf(b.name));
		},
		destroy() {
			if (disposed) return;
			disposed = true; revision++; index.clear(); host.remove();
			if (powerLayout && !powerBar.destroyed) { powerBar.x = powerLayout.x; powerBar.scale.x = powerLayout.scaleX; }
			ticker?.remove(positionManage);
			document.removeEventListener('pointerdown', outside, true);
			document.removeEventListener('contextmenu', outside, true);
			if (!page.destroyed) { page.off('added', enter); page.off('removed', leave); }
			if (!filterButton.destroyed) filterButton.off('pointertap', openFilter);
			if (!searchButton.destroyed) searchButton.off('pointertap', openSearch);
		},
	};
}
