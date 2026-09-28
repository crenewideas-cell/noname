// Shared navigation only: searching never enables/imports packs or eagerly
// renders every character page. Each result opens the existing menu controls.
export function createEnabledFilter(label, refresh) {
	const select = document.createElement("select");
	select.className = "pack-enabled-filter";
	select.setAttribute("aria-label", label);
	for (const [value, title] of [["all", "全部状态"], ["enabled", "已启用"], ["disabled", "已关闭"]]) select.add(new Option(title, value));
	select.addEventListener("change", refresh);
	return select;
}

export function matchesEnabledFilter(enabled, value) {
	return value === "all" || (typeof enabled === "boolean" && enabled === (value === "enabled"));
}

export function revealMenuTarget(target, pane) {
	pane.scrollTop += target.getBoundingClientRect().top - pane.getBoundingClientRect().top;
}

export function installMenuSearch(sidebar, { label, entries }) {
	const form = document.createElement("form");
	form.className = "pack-menu-search";
	form.setAttribute("role", "search");
	const input = document.createElement("input");
	input.type = "search";
	input.placeholder = label;
	input.setAttribute("aria-label", label);
	const enabledFilter = createEnabledFilter(`${label}：启用状态`, () => refresh());
	const status = document.createElement("p");
	status.setAttribute("role", "status");
	const results = document.createElement("div");
	results.className = "pack-menu-search-results";
	const normalize = value =>
		String(value || "")
			.replace(/<[^>]*>/g, "")
			.replace(/\s+/g, "")
			.toLocaleLowerCase();
	const refresh = () => {
		results.replaceChildren();
		const query = normalize(input.value);
		const filtering = !!query || enabledFilter.value !== "all";
		status.hidden = results.hidden = !filtering;
		const matches = filtering ? entries().filter(entry => matchesEnabledFilter(entry.enabled, enabledFilter.value) && normalize([entry.label, entry.path, entry.keywords].join(" ")).includes(query)) : [];
		// Prefer the named child over a parent whose introduction mentions it.
		const rank = entry => (normalize(entry.label) === query ? 0 : normalize(entry.label).startsWith(query) ? 1 : 2);
		matches.sort((a, b) => rank(a) - rank(b));
		status.textContent = matches.length ? `找到 ${matches.length} 项，点击定位` : "未找到匹配项";
		for (const entry of matches) {
			const button = document.createElement("button");
			button.type = "button";
			const title = document.createElement("strong");
			title.textContent = entry.label;
			const path = document.createElement("small");
			path.textContent = [entry.path, typeof entry.enabled === "boolean" ? entry.enabled ? "已启用" : "已关闭" : ""].filter(Boolean).join(" · ");
			button.append(title, path);
			button.onclick = () => {
				entry.open();
				status.textContent = `已定位：${entry.path || entry.label}`;
			};
			results.append(button);
		}
	};
	input.addEventListener("input", refresh);
	form.addEventListener("submit", event => {
		event.preventDefault();
		results.querySelector("button")?.click();
	});
	form.append(input, enabledFilter, status, results);
	sidebar.prepend(form);
	refresh();
	return { refresh };
}
