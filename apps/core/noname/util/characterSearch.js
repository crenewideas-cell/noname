import { lib, get } from "noname";

/** Per-directory, cancellable search. No global skill scan at dialog creation. */
export class CharacterSearch {
	rows = new Map();
	queries = new Map();
	version = 0;
	ids = [];
	stopWorker;
	cancel() { this.version++; this.stopWorker?.(); }
	clear() { this.cancel(); this.rows.clear(); this.queries.clear(); this.ids = []; }
	async matchInWorker(value, ids, exactSkill) {
		if (typeof Worker === "undefined") return undefined;
		// Self-contained classic worker survives both preserveModules and merged
		// builds. A pathological regex can be terminated without freezing the UI.
		const source = function () {
			self.onmessage = ({ data }) => {
				try {
					const regexp = new RegExp(data.value);
					const ids = data.rows.filter(row => row.texts.some(text => regexp.test(text)) || (data.exactSkill && row.skills.includes(data.value))).map(row => row.id);
					self.postMessage({ ids });
				} catch (error) { self.postMessage({ error: String(error) }); }
			};
		};
		let worker, url;
		try {
			url = URL.createObjectURL(new Blob([`(${source.toString()})()`], { type: "text/javascript" }));
			worker = new Worker(url);
		} catch { if (url) URL.revokeObjectURL(url); return undefined; }
		return new Promise((resolve, reject) => {
			let settled = false;
			const finish = (result, error) => {
				if (settled) return;
				settled = true;
				clearTimeout(timer); worker.terminate(); URL.revokeObjectURL(url);
				this.stopWorker = undefined;
				if (error) reject(error); else resolve(result);
			};
			const timer = setTimeout(() => finish(null, new Error("搜索表达式耗时过长，请缩短或简化后重试")), 3000);
			this.stopWorker = () => finish(null);
			worker.onmessage = ({ data }) => finish(data.ids, data.error ? new Error(data.error) : undefined);
			worker.onerror = event => { event.preventDefault(); finish(undefined); };
			try {
				worker.postMessage({ value, exactSkill, rows: ids.map(id => ({ id, texts: this.rows.get(id).texts, skills: this.rows.get(id).skills })) });
			} catch { finish(undefined); }
		});
	}
	async find(value, ids) {
		this.cancel();
		const version = this.version;
		const regexp = new RegExp(value);
		if (!value) return ids.slice();
		if (ids.length !== this.ids.length || ids.some((id, i) => id !== this.ids[i])) { this.queries.clear(); this.ids = ids.slice(); }
		let budget = performance.now();
		if (this.rows.size !== ids.length) this.queries.clear();
		const current = new Set(ids);
		for (const id of this.rows.keys()) if (!current.has(id)) { this.rows.delete(id); this.queries.clear(); }
		for (const id of ids) {
			if (version !== this.version) return null;
			const skills = lib.character[id]?.skills || [];
			const texts = [get.translation(id), get.translation(`${id}_ab`), ...skills.map(skill => lib.translate[skill] || "")];
			const signature = JSON.stringify([texts, skills]);
			if (this.rows.get(id)?.signature !== signature) {
				this.rows.set(id, { signature, texts, skills: [...skills] });
				// Invalidate immediately: a canceled partial rebuild must not leave old hits.
				this.queries.clear();
			}
			if (performance.now() - budget >= 4) { await new Promise(resolve => setTimeout(resolve, 0)); budget = performance.now(); }
		}
		if (version !== this.version) return null;
		// Skill existence participates in the key; late registration changes exact-ID hits.
		const key = JSON.stringify([value, Object.hasOwn(lib.skill, value)]);
		let found = this.queries.get(key);
		if (!found) {
			found = await this.matchInWorker(value, ids, Object.hasOwn(lib.skill, value));
			if (version !== this.version || found === null) return null;
		}
		if (!found) {
			// Older embedded browsers/CSP may not permit workers. Simple expressions
			// remain supported; compound regex needs the cancellable worker path.
			if (/[()[\]{}|+*?\\]/.test(value)) throw new Error("当前环境不支持复杂正则搜索，请使用人物或技能名称");
			found = [];
			for (const id of ids) {
				if (version !== this.version) return null;
				const row = this.rows.get(id);
				if (row.texts.some(text => regexp.test(text)) || (Object.hasOwn(lib.skill, value) && row.skills.includes(value))) found.push(id);
				if (performance.now() - budget >= 4) { await new Promise(resolve => setTimeout(resolve, 0)); budget = performance.now(); }
			}
		}
		if (version !== this.version) return null;
		this.queries.delete(key); this.queries.set(key, found);
		while (this.queries.size > 16) this.queries.delete(this.queries.keys().next().value);
		return found;
	}
}
