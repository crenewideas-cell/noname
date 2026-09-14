import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { core } from "./environment.ts";

export async function seed(page: any, url: string, scenario: string) {
	const manifest = (await readFile(resolve(core, "game/package.js"), "utf8"));
	// JSON config + fixed scenario data only; no production user storage is opened.
	const base = JSON.parse(await readFile(resolve(core, "game/config.json"), "utf8"));
	const config: Record<string, unknown> = { new_tutorial: true, show_splash: "always", splash_style: "style1", presentation_style: "shousha",
		sessionType: "offline", mode: "identity", touchscreen: false, totouched: true, toscrolled: true,
		showMax_character_number: "10", character_dialog_tool: "all", player_number_mode_config_identity: "2", auto_identity: "off", version: "1.11.6", auto_confirm: false,
		change_identity_mode_config_identity: true, free_choose_mode_config_identity: true };
	if (scenario === "minimal") {
		// A clearly labeled test fixture. Never applied to a user's saved configuration.
		const packs = [...manifest.matchAll(/^\s*(\w+): /gm)].map(m => m[1]);
		config.characters = ["standard"]; config.cards = ["standard"];
		config.hiddenCharacterPack = packs.filter(p => p !== "standard");
		config.hiddenCardPack = packs.filter(p => p !== "standard");
		// stock packs are explicitly unhidden by boot unless the stock override list is also scoped.
		config.all = { ...base.all, sgscharacters: ["standard"], sgscards: ["standard"] };
		const installed = JSON.parse(await readFile(resolve(core, "game/organized-extensions.json"), "utf8"));
		const bundled = JSON.parse(await readFile(resolve(core, "game/bundled-extensions.json"), "utf8"));
		const names = [...new Set<string>([...bundled, ...installed.map((item: any) => item.name)])];
		config.organized_extensions_registered = names;
		config.extensions = [];
		for (const name of names) config[`extension_${name}_enable`] = false;
	}
	await page.goto(`${url}/__perf/seed`);
	await page.evaluate(async ({ config, scenario }: any) => {
		localStorage.setItem("gplv3_noname_alerted", "true");
		const db = await new Promise<IDBDatabase>((ok, fail) => {
			const request = indexedDB.open("noname_0.9_data", 4);
			request.onupgradeneeded = () => {
				for (const name of ["image", "audio", "config", "data"]) if (!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name);
				if (!request.result.objectStoreNames.contains("video")) request.result.createObjectStore("video", { keyPath: "time" });
			};
			request.onsuccess = () => ok(request.result); request.onerror = () => fail(request.error);
		});
		await new Promise<void>((ok, fail) => {
			const tx = db.transaction("config", "readwrite");
			for (const [key, value] of Object.entries(config)) tx.objectStore("config").put(value, key);
			tx.oncomplete = () => ok(); tx.onerror = () => fail(tx.error); tx.onabort = () => fail(tx.error);
		}); db.close();
	}, { config, scenario });
	return config;
}
