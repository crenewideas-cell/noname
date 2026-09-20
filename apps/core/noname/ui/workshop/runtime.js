/** Self-contained: this exact renderer is included in exported Noname extensions. */
export function mountAppearance(manifest, resolveAsset, root = document.head, scope = "") {
	const areas = {
		home: ["#splash"], modes: ["#splash .lobby-modes", "#splash .session-entry > div[link]"],
		lobby: [".online-lobby", ".online-dialog"], arena: ["#window", "body > .background"],
		cards: ["#window .card:not(.infohidden):not(:empty)"], cardback: ["#window .card.infohidden", "#window .card:empty"],
		buttons: ["#window .control", "#window #system > div > div", ".menubutton", "#splash button", ".online-dialog button"],
		menus: [".menu", ".menubg", "#window > .dialog"], players: ["#window .player"],
		hp: ["#window .hp > div"], lines: [".linexy:not(.hidden):not(.removing)"], fonts: ["#window", "#splash", ".online-dialog", ".menu"],
	};
	const style = document.createElement("style");
	style.dataset.uiWorkshop = manifest.id;
	const rules = [];
	const add = (selectors, properties) => {
		if (!selectors.length || !properties) return;
		const values = Object.entries(properties).map(([key, value]) => `${key}:${value} !important`).join(";");
		if (values) rules.push(`${selectors.map(selector => `${scope}${selector}`).join(",")}{${values}}`);
	};
	const image = path => `url(${JSON.stringify(resolveAsset(path))})`;
	for (const [id, part] of Object.entries(manifest.components)) {
		const selectors = areas[id];
		if (!selectors) continue;
		add(selectors, part.style);
		for (const rule of part.rules || []) add(selectors.map(selector => `${selector} ${rule.selector}`), rule.style);
		const assets = part.assets || {};
		if (assets.background || assets.texture) add(selectors, { "background-image": image(assets.background || assets.texture), "background-size": part.style?.["background-size"] || (["cards", "cardback", "lines"].includes(id) ? "100% 100%" : "cover"), "background-position": part.style?.["background-position"] || "center" });
		if (id === "players" && assets.frame) add(["#window .player > .framebg"], { "background-image": image(assets.frame), "background-size": "100% 100%", display: "block" });
		if (id === "cardback" && assets.alternate) add(["#window .card.infohidden:not(.infoflip)"], { "background-image": image(assets.alternate) });
		if (id === "cards") for (const [slot, path] of Object.entries(assets)) {
			if (!slot.startsWith("card:")) continue;
			const selector = `#window .card[data-card-name="${slot.slice(5)}"]:not(.infohidden):not(:empty)`;
			add([selector], { "background-image": image(path), "background-size": "100% 100%" });
			add([`${selector} > .image`, `${selector} > .background`], { "background-image": "none" });
		}
		if (id === "modes") for (const [slot, path] of Object.entries(assets)) {
			if (!slot.startsWith("mode:")) continue;
			const mode = slot.slice(5);
			add([`#splash [data-ui-mode="${mode}"] .lobby-art`], { content: image(path) });
			add([`#splash [link="${mode}"] > .avatar`], { "background-image": image(path) });
		}
		if (id === "hp") for (const key of ["high", "mid", "low", "lost"]) {
			if (assets[key]) add([key === "lost" ? "#window .hp:not(.text) > .lost" : `#window .hp:not(.text)[data-condition="${key}"] > div:not(.lost)`], { "background-image": image(assets[key]), "background-size": "100% 100%" });
		}
		if (id === "lines" && part.style?.color && !assets.texture) add(selectors, { background: `linear-gradient(transparent,${part.style.color},${part.style.color})` });
		if (id === "fonts" && assets.font) {
			const family = `ui-workshop-${manifest.id}`;
			rules.push(`@font-face{font-family:"${family}";src:${image(assets.font)};font-display:swap}`);
			add(selectors.flatMap(selector => [selector, `${selector} *`]), { "font-family": `"${family}",sans-serif` });
		}
	}
	style.textContent = rules.join("\n");
	root.appendChild(style);
	const htmlStyle = root.ownerDocument.documentElement.style;
	const previous = {};
	for (const key of ["color", "width", "opacity"]) {
		const value = manifest.components.lines?.style?.[key];
		if (!value) continue;
		const variable = `--ui-workshop-line-${key}`;
		previous[variable] = htmlStyle.getPropertyValue(variable);
		htmlStyle.setProperty(variable, value);
	}
	return () => {
		style.remove();
		for (const [key, value] of Object.entries(previous)) { if (value) htmlStyle.setProperty(key, value); else htmlStyle.removeProperty(key); }
	};
}

/** Canvas drag feedback shares the chosen colors without changing target selection. */
export function styleDragLine(ctx) {
	const style = document.documentElement.style;
	const color = style.getPropertyValue("--ui-workshop-line-color");
	const width = style.getPropertyValue("--ui-workshop-line-width");
	const opacity = style.getPropertyValue("--ui-workshop-line-opacity");
	if (color) ctx.strokeStyle = color;
	if (/^\d+(\.\d+)?px$/.test(width)) ctx.lineWidth = Math.max(1, Math.min(30, parseFloat(width)));
	if (opacity && Number.isFinite(parseFloat(opacity))) ctx.globalAlpha = Math.max(0, Math.min(1, parseFloat(opacity)));
}
