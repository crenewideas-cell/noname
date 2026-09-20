import installed from "../../game/organized-extensions.json";
import validation from "../../game/organized-extension-status.json";
import bundled from "../../game/bundled-extensions.json";
import apkCleanup from "../../game/apk-extension-cleanup.json";
import restructure from "../../game/extension-restructure.json";
import characterGroups from "../../game/character-menu-groups.json";

const renamed = Object.entries(restructure.renamed);
const merged = Object.entries(restructure.merged);
const mergedSources = merged.flatMap(([target, sources]) => sources.filter(name => name !== target));
// The pack historically returned a display name different from its directory.
// Only the directory identity can be used as a load entry.
const canonicalExtensionName = (name: string) => name === "红楼幻梦" ? "红楼幻境" : name;
// These are private 名将杀 options, not directory identities. Older registration
// inferred them from *_enable keys and persisted them in both extension lists.
const privateOptionNames = new Set(["mjs", "mjsold", "mjsnew"].map(pack => `名将杀_characterPack_${pack}`));
const retiredExtensions = new Set([
	...apkCleanup.removed,
	...apkCleanup.merged.map(item => item.name),
	...restructure.removed,
	...renamed.map(([name]) => name),
	...mergedSources,
]);
export const isRetiredExtension = (name: string) => retiredExtensions.has(name);
// Compatibility export for the first APK cleanup migration and its tests.
export const isRetiredApkExtension = isRetiredExtension;
export const isValidExtensionName = (name: unknown): name is string => typeof name === "string" && !!name.trim() &&
	!/[\\/\0]/.test(name) && name !== "." && name !== ".." && !["characters", "packs", "collections", "ui", "imports", "archived"].includes(name) && !isRetiredExtension(name) && !privateOptionNames.has(name);

/** Register this repository's installed packages once, preserving later user choices. */
export async function registerOrganizedExtensions(config: { get: (key: string) => any; has: (key: string) => boolean }, save: (key: string, value: any) => Promise<unknown>, savedKeys: string[] = [], availableNames?: string[]) {
	// Preserve old options for rollback; explicit choices under the real name win.
	// Repeat safely after a failed write, without overwriting later user choices.
	for (const key of new Set(["extension_红楼幻梦_enable", ...savedKeys])) {
		if (!key.startsWith("extension_红楼幻梦_") || !config.has(key)) continue;
		const target = key.replace("extension_红楼幻梦_", "extension_红楼幻境_");
		if (!config.has(target)) await save(target, config.get(key));
	}
	const previousExtensions: string[] = config.get("extensions") || [];
	const previousRegistered: string[] = config.get("organized_extensions_registered") || [];
	const extensions = [...new Set(previousExtensions.filter(isValidExtensionName).map(canonicalExtensionName))];
	const registered = new Set<string>(previousRegistered.filter(isValidExtensionName).map(canonicalExtensionName));
	let changed = extensions.length !== previousExtensions.length || registered.size !== previousRegistered.length ||
		previousExtensions.includes("红楼幻梦") || previousRegistered.includes("红楼幻梦");
	// Clear only the two switches which used to import the seven removed crossover packs.
	for (const key of ["extension_杀海拾遗_gwent", "extension_杀海拾遗_mtg", "extension_群雄并起_member_3_gwent", "extension_群雄并起_member_3_mtg"]) {
		if (config.get(key) === true) await save(key, false);
	}
	if (config.get("apk_extension_cleanup_version") !== apkCleanup.version) {
		// Keep legacy private settings intact for rollback; migrate only member switches.
		for (const item of apkCleanup.merged) {
			const key = `extension_${apkCleanup.target}_${item.key}`;
			const old = `extension_${item.name}_enable`;
			if (!config.has(key) && config.has(old)) await save(key, config.get(old) === true);
		}
		await save("apk_extension_cleanup_previous", {
			extensions: previousExtensions.filter(isRetiredApkExtension),
			characters: config.get("characters"), cards: config.get("cards"),
		});
		await save("apk_extension_cleanup_version", apkCleanup.version);
	}
	if (config.get("extension_restructure_version") !== restructure.version) {
		if (config.has("extension_EpicFX_enable")) await save("extension_EpicFX_enable", false);
		for (const [oldName, newName] of renamed) {
			const oldKey = `extension_${oldName}_enable`;
			const newKey = `extension_${newName}_enable`;
			if (!config.has(newKey) && config.has(oldKey)) await save(newKey, config.get(oldKey) === true);
		}
		for (const [target, sources] of merged) {
			const targetKey = `extension_${target}_enable`;
			if (config.has(targetKey)) continue;
			const choices = sources
				.map(name => `extension_${name}_enable`)
				.filter(key => config.has(key))
				.map(key => config.get(key) === true);
			if (choices.length) await save(targetKey, choices.some(Boolean));
		}
		await save("extension_restructure_previous", {
			extensions: previousExtensions.filter(isRetiredExtension),
			characters: config.get("characters"), cards: config.get("cards"), plays: config.get("plays"),
		});
		await save("extension_restructure_version", restructure.version);
	}
	for (const key of ["characters", "cards", "plays"]) {
		const previous = config.get(key);
		if (!Array.isArray(previous)) continue;
		const next = [...new Set(previous.filter(name => !characterGroups.removed.includes(name) && !isRetiredExtension(name) && !isRetiredExtension(name.replace(/^mode_extension_/, "")))
			.map(name => name === "mode_extension_红楼幻梦" ? "mode_extension_红楼幻境" : canonicalExtensionName(name)))];
		if (next.length !== previous.length || next.some((name, index) => name !== previous[index])) await save(key, next);
	}
	const disabled = new Set(validation.disabled.map(p => p.name));
	const defaultDisabled = new Set(installed.filter(item => "defaultEnabled" in item && item.defaultEnabled === false).map(item => item.name));
	// An arbitrary *_enable key may belong to an extension's private options.
	// Restore only manifest/registration identities; new directories are verified
	// by getExtensionList's file discovery or registered through explicit import.
	const names = new Set([...bundled, ...installed.map(item => item.name), ...registered]);
	const deleted = new Set<string>(config.get("deleted_extensions") || []);
	for (const name of names) {
		if (deleted.has(name)) continue;
		// Mobile extensions may be supplied later through the external resource pack.
		if (availableNames && !availableNames.includes(name)) continue;
		if (registered.has(name)) {
			// Registration history is not the load list. Repair a missing enabled
			// entry, while respecting explicit disable/uninstall choices.
			if (!extensions.includes(name) && config.get(`extension_${name}_enable`) === true) {
				extensions.push(name);
				changed = true;
			}
			continue;
		}
		if (!extensions.includes(name)) extensions.push(name);
		// Enable the first-party pack on first registration, but retain an
		// explicit saved choice, including one migrated from its old name.
		if (!config.has(`extension_${name}_enable`)) {
			await save(`extension_${name}_enable`, availableNames ? false : name === "红楼幻境" || (!bundled.includes(name) && !disabled.has(name) && !defaultDisabled.has(name)));
		}
		registered.add(name);
		changed = true;
	}
	// Retain identities of manually imported packs as well as bundled packages.
	for (const name of extensions) {
		if (!registered.has(name)) { registered.add(name); changed = true; }
	}
	if (changed) {
		await save("extensions", extensions);
		await save("organized_extensions_registered", [...registered]);
	}
	// Validation describes defaults, not permission to reset an existing save.
	// Adding packages or changing the report version must preserve user switches.
	if (config.get("organized_extensions_validation") !== validation.version) {
		await save("organized_extensions_validation", validation.version);
	}
}
