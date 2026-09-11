/** A self-contained, disposable view; cosmetic previews never initialize a player. */
export function createSkinGallery({ characters, initialCharacter, store, portrait, label, enabled, onApply = () => {} }) {
	const previousFocus = document.activeElement;
	const dialog = document.createElement("dialog");
	dialog.className = "noname-skin-gallery";
	dialog.setAttribute("aria-label", "武将衣橱");
	function element(tag, className, text, parent = dialog) {
		const node = document.createElement(tag);
		node.className = className;
		if (text) node.textContent = text;
		parent.append(node);
		return node;
	}
	function button(text, className, parent, action) {
		const node = element("button", className, text, parent);
		node.type = "button";
		node.addEventListener("click", action);
		return node;
	}
	const header = element("header", "skin-header");
	const heading = element("section", "skin-heading", "", header);
	element("small", "skin-eyebrow", "武将 · 风华", heading);
	element("h2", "", "武将衣橱", heading);
	const closeButton = button("关闭", "skin-close", header, () => dialog.close());
	const body = element("section", "skin-body");
	const sidebar = element("aside", "skin-sidebar", "", body);
	const search = element("input", "skin-search", "", sidebar);
	search.type = "search";
	search.placeholder = "搜索武将 / 编号";
	search.setAttribute("aria-label", "搜索武将");
	const characterList = element("nav", "skin-characters", "", sidebar);
	characterList.setAttribute("aria-label", "武将列表");
	const detail = element("article", "skin-detail", "", body);
	const hero = element("section", "skin-hero", "", detail);
	const preview = element("div", "skin-preview", "", hero);
	preview.setAttribute("role", "img");
	const info = element("section", "skin-info", "", hero);
	element("small", "skin-eyebrow", "立绘鉴赏", info);
	const characterName = element("h3", "skin-character-name", "", info);
	const skinName = element("p", "skin-name", "", info);
	const source = element("p", "skin-source", "", info);
	element("p", "skin-hint", "选择形象预览，应用后自动保存。", info);
	const choices = element("section", "skin-choices", "", detail);
	choices.setAttribute("aria-label", "皮肤列表");
	const footer = element("footer", "skin-footer");
	const status = element("p", "skin-status", "", footer);
	status.setAttribute("role", "status");
	status.setAttribute("aria-live", "polite");
	const retry = button("刷新", "skin-retry", footer, () => load(true));
	const apply = button("应用形象", "skin-apply", footer, commit);
	let character = characters.includes(initialCharacter) ? initialCharacter : characters[0];
	let selected = null,
		generation = 0,
		disposed = false,
		busy = false;
	let entries = [],
		discoveryFailed = false;
	const buttons = new Map();
	function showStatus(text, error = false) {
		status.textContent = text;
		status.classList.toggle("skin-error", error);
	}
	function updateApply() {
		const current = store.current(character);
		apply.disabled = busy || !character || !enabled() || current === selected?.id;
		apply.textContent = busy ? "正在保存…" : current === selected?.id ? "使用中" : "应用形象";
	}
	function select(entry) {
		if (busy || disposed) return;
		selected = entry;
		portrait(preview, character, entry.path);
		preview.setAttribute("aria-label", `${label(character)} · ${entry.name}`);
		skinName.textContent = entry.name;
		source.textContent = entry.source;
		for (const [id, node] of buttons) node.setAttribute("aria-pressed", String(id === entry.id));
		showStatus(!enabled() ? "换肤已关闭，请在外观设置中开启。" : discoveryFailed ? "本地目录暂不可用，仍可使用已列出的形象。" : "仅改变立绘，武将技能和属性保持不变。");
		updateApply();
	}
	function renderCharacters() {
		const query = search.value.trim().toLocaleLowerCase();
		const restoreListFocus = characterList.contains(document.activeElement);
		characterList.replaceChildren();
		// Names only: thousands of characters do not trigger thousands of image requests.
		for (const id of characters) {
			if (query && !`${label(id)} ${id}`.toLocaleLowerCase().includes(query)) continue;
			const node = button(label(id), "skin-character", characterList, () => {
				if (busy || character === id) return;
				character = id;
				renderCharacters();
				void load();
			});
			node.title = id;
			node.setAttribute("aria-current", String(character === id));
			node.disabled = busy;
			if (restoreListFocus && character === id && !busy) node.focus();
		}
		if (!characterList.childElementCount) element("p", "skin-empty", "没有匹配的武将", characterList);
	}
	async function load(reload = false) {
		if (busy || disposed) return;
		const version = ++generation;
		buttons.clear();
		choices.replaceChildren();
		selected = null;
		apply.disabled = true;
		if (!character) {
			showStatus("当前没有可展示的武将。");
			retry.disabled = true;
			return;
		}
		characterName.textContent = label(character);
		portrait(preview, character, null);
		skinName.textContent = "经典形象";
		source.textContent = "原始立绘";
		showStatus("正在读取形象…");
		try {
			const result = await store.list(character, { reload });
			if (disposed || version !== generation) return;
			discoveryFailed = result.unavailable;
			entries = [{ id: null, path: null, name: "经典形象", source: "原始立绘" }, ...result.skins];
			for (const entry of entries) {
				const node = button("", "skin-choice", choices, () => select(entry));
				const thumbnail = element("div", "skin-thumbnail", "", node);
				portrait(thumbnail, character, entry.path);
				element("span", "", entry.name, node);
				node.setAttribute("aria-label", entry.name);
				buttons.set(entry.id, node);
			}
			select(entries.find(entry => entry.id === store.current(character)) || entries[0]);
		} catch {
			if (!disposed && version === generation) showStatus("形象读取失败，请点击刷新重试。", true);
		}
	}
	async function commit() {
		if (busy || !selected || !enabled()) return;
		busy = true;
		retry.disabled = true;
		search.disabled = true;
		for (const node of buttons.values()) node.disabled = true;
		renderCharacters();
		updateApply();
		try {
			const applied = await store.apply(character, selected.id);
			if (disposed) return;
			showStatus(applied ? "形象已保存" : "形象已由其他操作更新，请刷新查看。");
			if (applied) {
				try {
					onApply(character);
				} catch (error) {
					console.warn("皮肤应用回调失败", error);
				}
			}
		} catch (error) {
			if (!disposed) showStatus(error?.message || "保存失败，已保留当前形象。", true);
		} finally {
			busy = false;
			if (!disposed) {
				retry.disabled = search.disabled = false;
				for (const node of buttons.values()) node.disabled = false;
				renderCharacters();
				updateApply();
			}
		}
	}
	search.addEventListener("input", renderCharacters);
	// Native modal focus containment; game keyboard and pointer handlers must not run beneath it.
	for (const type of ["keydown", "keyup", "click", "pointerdown", "pointerup", "touchstart", "touchend", "wheel"]) {
		dialog.addEventListener(type, event => event.stopPropagation());
	}
	dialog.addEventListener("click", event => {
		if (event.target === dialog) {
			const rect = dialog.getBoundingClientRect();
			if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
		}
	});
	dialog.addEventListener(
		"close",
		() => {
			disposed = true;
			generation++;
			dialog.remove();
			if (previousFocus?.isConnected) previousFocus.focus();
		},
		{ once: true }
	);
	document.body.append(dialog);
	dialog.showModal();
	closeButton.focus();
	renderCharacters();
	void load();
	return dialog;
}
