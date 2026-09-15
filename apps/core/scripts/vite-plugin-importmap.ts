import { normalizePath, Plugin } from "vite";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default function vitePluginJIT(importMap: Record<string, string> = {}): Plugin {
	let root = process.cwd();
	let isBuild = false;
	const resolvedImportMap: Record<string, string> = {};

	return {
		name: "vite-plugin-jit",

		configResolved(config) {
			isBuild = config.command === "build";
			root = config.root;
		},

		async buildStart() {
			if (!isBuild) return;
			// Public deployments have no workspace node_modules. Ship standalone
			// browser ESM entries and keep both generated import maps on these URLs.
			if (process.env.NONAME_PUBLIC_BUILD === "1" || process.env.NONAME_DESKTOP_BUILD === "1" || process.env.NONAME_MOBILE_BUILD === "1") {
				const browserEntries: Record<string, string> = {
					vue: require.resolve("vue/dist/vue.esm-browser.prod.js"),
					"pinyin-pro": require.resolve("pinyin-pro/dist/index.mjs"),
					dedent: path.join(path.dirname(require.resolve("dedent")), "dedent.mjs"),
				};
				for (const key of Object.keys(importMap)) {
					if (key === "noname") { resolvedImportMap[key] = "/noname.js"; continue; }
					const entry = browserEntries[key];
					if (!entry) throw new Error(`Missing public browser entry for ${key}`);
					const fileName = `vendor/${key}.js`;
					this.emitFile({ type: "asset", fileName, source: fs.readFileSync(entry) });
					resolvedImportMap[key] = `/${fileName}`;
					const packageRoot = path.dirname(path.dirname(entry));
					const license = ["LICENSE", "LICENSE.md"].map(name => path.join(packageRoot, name)).find(file => fs.existsSync(file));
					if (license) this.emitFile({ type: "asset", fileName: `vendor/${key}.LICENSE.txt`, source: fs.readFileSync(license) });
				}
				return;
			}
			for (const key in importMap) {
				try {
					const resolved = require.resolve(importMap[key]);
					resolvedImportMap[key] = normalizePath("/" + path.relative(root, resolved));
				} catch (e) {
					resolvedImportMap[key] = importMap[key];
				}
			}
		},

		closeBundle() {
			// The compatibility entry and index.html use the same JIT lifecycle.
			const jitEntry = process.env.NONAME_PUBLIC_BUILD === "1" ? ""
				: fs.readFileSync(path.join(path.dirname(require.resolve("@noname/jit")), "entry.js"), "utf8");
			const gameJs = path.resolve("dist/game/game.js");
			fs.mkdirSync(path.dirname(gameJs), { recursive: true });
			fs.writeFileSync(
				gameJs,
				`"use strict";
(() => {
	if (location.protocol.startsWith("file")) {
		alert("您使用的浏览器或客户端正在使用不受支持的file协议运行无名杀\\n请检查浏览器或客户端是否需要更新");
		return;
	}

	for (const link of document.head.querySelectorAll("link")) {
		if (link.href.includes("app/color.css")) {
			link.remove();
			break;
		}
	}
	
	if (typeof window.cordovaLoadTimeout != "undefined") {
		clearTimeout(window.cordovaLoadTimeout);
		delete window.cordovaLoadTimeout;
	}


	const im = document.createElement("script");
	im.type = "importmap";
	im.textContent = \`${JSON.stringify({ imports: resolvedImportMap }, null, 2)}\`;
	document.currentScript.after(im);

	const jit = document.createElement("script");
	jit.textContent = ${JSON.stringify(jitEntry)};
	document.head.appendChild(jit);

	const script = document.createElement("script");
	script.type = "module";
	script.src = "/noname/entry.js";
	document.head.appendChild(script);
})();`
			);
		},

		transformIndexHtml(html) {
			if (!isBuild) return;
			return {
				html,
				tags: [
					{
						tag: "script",
						attrs: {
							type: "importmap",
						},
						children: JSON.stringify({ imports: resolvedImportMap }, null, 2),
						injectTo: "head-prepend",
					},
				],
			};
		},
	};
}
