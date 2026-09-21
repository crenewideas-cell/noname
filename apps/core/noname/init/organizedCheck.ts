import { lib, get, _status } from "noname";
import installed from "../../game/organized-extensions.json";

/** Explicit developer-only diagnostics. No storage writes or game actions. */
export function showOrganizedCheck() {
	const missingCharacters: string[] = [],
		missingSkills: string[] = [],
		missingDependencies: string[] = [];
	const packs = installed.map(p => {
		const packNames = "characterPacks" in p ? p.characterPacks : [p.name];
		const registered = Object.assign({}, ...packNames.map(name => lib.characterPack[name] || {}));
		const optional = "optionalCharacters" in p ? p.optionalCharacters : undefined;
		const expected = [...p.characters, ...(optional && (lib.config[optional.config] ?? false) === optional.when ? optional.characters : [])];
		const enabled = !!lib.config[`extension_${p.name}_enable`];
		// Incremental imports deliberately reuse existing core characters with the same ID.
		const reused = enabled ? expected.filter(id => !registered[id] && lib.character[id]) : [];
		const missing = enabled ? expected.filter(id => !registered[id] && !lib.character[id]) : [];
		missingCharacters.push(...missing.map(id => `${p.name}/${id}`));
		for (const id of enabled ? expected : []) {
			const character = registered[id];
			if (!character) continue;
			const skills: string[] = Array.isArray(character) ? character[3] : character.skills;
			const visited = new Set<string>();
			function check(skill: string, parent?: string) {
				if (visited.has(skill)) return;
				visited.add(skill);
				const info = lib.skill[skill];
				if (!info) {
					(parent ? missingDependencies : missingSkills).push(`${p.name}/${id}/${parent ? `${parent}->` : ""}${skill}`);
					return;
				}
				const group = typeof info.group === "string" ? [info.group] : info.group || [];
				for (const dependency of [...group, ...(info.inherit ? [info.inherit] : [])]) check(dependency, skill);
			}
			for (const skill of skills || []) check(skill);
		}
		return { name: p.name, enabled, expected: expected.length, registered: Object.keys(registered).length, reused, missing };
	});
	const node = document.createElement("details");
	node.id = "organized-extension-check";
	node.style.cssText = "position:fixed;z-index:100000;left:8px;bottom:8px;max-height:70vh;max-width:95vw;overflow:auto;background:white;color:black;padding:12px;font:14px monospace;user-select:text";
	const summary = document.createElement("summary");
	summary.textContent = `扩展检查：已启用 ${packs.filter(p => p.enabled).length}/${packs.length} 包，缺失武将 ${missingCharacters.length}，缺失技能 ${missingSkills.length}，缺失技能依赖 ${missingDependencies.length}`;
	const pre = document.createElement("pre");
	pre.textContent = JSON.stringify({ mode: get.mode(), loaded: _status.extensionLoaded, packs, missingCharacters, missingSkills, missingDependencies }, null, 2);
	node.append(summary, pre);
	document.body.append(node);
	console.info(summary.textContent);
}
