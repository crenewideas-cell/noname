const imageFile = /\.(?:png|jpe?g|webp|avif|gif)$/i;
export function normalizeSkinPath(value) {
	if (typeof value !== "string" || !value.trim()) return null;
	const path = value.replace(/^ext:/, "extension/").replace(/\\/g, "/");
	if (/^(?:[a-z]+:|\/\/)/i.test(path) || /["?#]/.test(path) || [...path].some(char => char.charCodeAt(0) < 32)) return null;
	let decoded;
	try {
		decoded = decodeURIComponent(path);
	} catch {
		return null;
	}
	if (decoded.split("/").some(part => part === ".." || part === ".") || decoded.includes("\\")) return null;
	return path.replace(/^\/+/, "").replace(/\/{2,}/g, "/");
}

export function savedSkinPath(value) {
	const path = Array.isArray(value) && typeof value[0] === "string" ? normalizeSkinPath(value[1]) : null;
	return path && imageFile.test(path) ? path : null;
}

/** Engine-independent store. Providers supply data; they never replace engine methods. */
export function createSkinService({ config, save, directory, readDirectory, exists, substitutes = () => [], refresh = () => {}, characterKey = name => name, discoveryTimeout = 4000 }) {
	const providers = new Map(),
		cache = new Map(),
		revisions = new Map();
	let commitQueue = Promise.resolve();
	function boundedDiscovery(provider, character) {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error("皮肤来源读取超时")), discoveryTimeout);
			Promise.resolve()
				.then(() => provider(character))
				.then(
					value => {
						clearTimeout(timer);
						resolve(value);
					},
					error => {
						clearTimeout(timer);
						reject(error);
					}
				);
		});
	}
	const settings = () => config();
	const safeId = id => typeof id === "string" && id.length && !["__proto__", "prototype", "constructor"].includes(id);
	const current = character => savedSkinPath(settings().skin?.[characterKey(character)]);
	async function list(character, { reload = false } = {}) {
		if (!safeId(character)) return { skins: [], unavailable: true };
		if (reload) cache.delete(character);
		if (!cache.has(character)) {
			const pending = (async () => {
				const skins = new Map();
				let unavailable = false;
				const add = entry => {
					const path = normalizeSkinPath(entry?.path);
					if (!path || !imageFile.test(path)) return;
					skins.set(path, { id: path, name: String(entry.name || path.split("/").pop().replace(imageFile, "")), path, variants: entry.variants || {}, source: entry.source || "本地皮肤" });
				};
				const sources = await Promise.allSettled([...providers.values()].map(provider => boundedDiscovery(provider, character)));
				for (const source of sources) {
					try {
						if (source.status === "rejected") throw source.reason;
						for (const entry of source.value || []) add(entry);
					} catch {
						unavailable = true;
					}
				}
				try {
					const folder = normalizeSkinPath(directory(character));
					if (folder && readDirectory) {
						const files = await readDirectory(folder);
						const atlases = new Set(files.filter(file => typeof file === "string" && /\.(?:atlas|skel)$/i.test(file)).map(file => file.replace(/\.[^.]+$/, "").toLowerCase()));
						for (const file of files) {
							if (typeof file !== "string" || /[/\\]/.test(file) || !imageFile.test(file)) continue;
							if (atlases.has(file.replace(imageFile, "").toLowerCase())) continue;
							const base = folder.replace(/\/?$/, "/");
							const dot = file.lastIndexOf(".");
							const variants = Object.fromEntries(substitutes(character).map(id => [id, `${base}${file.slice(0, dot)}/${id}${file.slice(dot)}`]));
							add({ name: file.slice(0, dot), path: base + file, variants });
						}
					}
				} catch {
					unavailable = true;
				}
				const saved = current(character);
				if (saved && !skins.has(saved)) add({ path: saved, name: settings().skin[characterKey(character)][0], source: "已保存" });
				return { skins: [...skins.values()], unavailable };
			})();
			cache.set(character, pending);
		}
		const result = await cache.get(character);
		// Failed discovery is retryable; do not permanently cache a disconnected file service.
		if (result.unavailable) cache.delete(character);
		return result;
	}
	async function apply(character, id) {
		const key = characterKey(character);
		if (!safeId(character) || !safeId(key)) throw new Error("无效的武将");
		const revision = (revisions.get(key) || 0) + 1;
		revisions.set(key, revision);
		const entry = id == null ? null : (await list(character)).skins.find(skin => skin.id === id);
		if (id != null && !entry) throw new Error("该皮肤已不可用，请刷新列表");
		if (entry && !(await exists(entry.path))) throw new Error("皮肤图片无法加载，已保留当前形象");
		const variants = [];
		if (entry)
			for (const sub of substitutes(character)) {
				const path = normalizeSkinPath(entry.variants[sub]);
				if (path && imageFile.test(path) && (await exists(path))) variants.push([sub, [entry.name, path]]);
			}
		// Serialize persistence across characters so failed saves cannot erase a later selection.
		const commit = commitQueue.then(async () => {
			if (revisions.get(key) !== revision || settings().change_skin === false) return false;
			const before = settings().skin || {};
			const next = { ...before };
			delete next[key];
			for (const sub of substitutes(character)) delete next[sub];
			if (entry) next[key] = [entry.name, entry.path];
			for (const [sub, value] of variants) next[sub] = value;
			await save("skin", next);
			settings().skin = next;
			cache.clear();
			refresh(character);
			return true;
		});
		commitQueue = commit.catch(() => {});
		return commit;
	}
	return {
		list,
		apply,
		register(id, provider) {
			if (typeof provider !== "function") throw new TypeError("皮肤来源必须为函数");
			if (providers.has(id)) throw new Error(`皮肤来源已注册：${id}`);
			providers.set(id, provider);
			cache.clear();
			return () => {
				providers.delete(id);
				cache.clear();
			};
		},
		invalidate: () => cache.clear(),
		current,
	};
}
