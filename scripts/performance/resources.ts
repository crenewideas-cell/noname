import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, core, root, startEnvironment } from "./environment.ts";

const artifact = process.argv.find(arg => arg.startsWith("--artifact="))?.slice(11);
if (!artifact) throw new Error("Use --artifact=<dist>");
const out = resolve(root, "output/performance", `resources-${new Date().toISOString().replaceAll(/[:.]/g, "-")}`);
await mkdir(out, { recursive: true });
const fonts = JSON.parse(await readFile(resolve(core, "noname/util/generated/font-subsets.json"), "utf8"));
const portraits = JSON.parse(await readFile(resolve(core, "noname/util/generated/portrait-thumbnails.json"), "utf8"));
const server = await startEnvironment("production", 8082, artifact);
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const results: any = {};
try {
	for (const fail of [false, true]) {
		const context = await browser.newContext({ viewport: { width: 1100, height: 750 }, serviceWorkers: "block" });
		const page = await context.newPage();
		if (fail) await page.route(/\/(font\/subsets|thumbnail)\//, (route: any) => route.abort());
		const requests: string[] = [];
		page.on("request", (request: any) => requests.push(request.url()));
		await page.goto(`${server.url}/__perf/seed`);
		const data = await page.evaluate(async ({ fonts, portraits }: any) => {
			const { fontFaces } = await import("/noname/util/fontFaces.js");
			const { setPortraitBackground } = await import("/noname/util/portraitThumbnails.js");
			const style = document.createElement("style");
			style.textContent = `body{background:#f4ecdb;color:#302619;padding:24px}p{font-size:30px;margin:20px 0}.button{display:inline-block;width:120px;height:180px;background-size:cover;background-position:center;margin:10px;border-radius:8px}`;
			for (const family of Object.keys(fonts)) style.textContent += fontFaces(family, "__nonexistent_local_font__", "").join("\n");
			for (const [family, file] of [["NonameSuits", "suits"], ["MotoyaLMaru", "motoyamaru"]]) style.textContent += `@font-face{font-family:${family};font-display:swap;src:url(/font/${file}.woff2)}`;
			document.head.append(style);
			document.body.innerHTML = "<h1>字体与人物资源验收</h1>";
			const rows: any[] = [];
			for (const family of Object.keys(fonts)) {
				// A supported CJK codepoint outside the common chunk exercises lazy ranges.
				const points = fonts[family].slice(1).flatMap((chunk: any) => [...chunk.range.matchAll(/U\+([0-9A-F]+)/g)].map((match: any) => parseInt(match[1], 16)));
				const rare = String.fromCodePoint(points.findLast((cp: number) => cp >= 0x3400 && cp <= 0x9fff));
				const text = `人物图鉴：蒯良、荀彧、甄宓、郗虑、阚泽 ${rare} 杀闪桃`;
				const p = document.createElement("p"); p.textContent = text; p.style.fontFamily = `"${family}", "Microsoft YaHei", sans-serif`; document.body.append(p);
				let loaded = false; try { loaded = (await document.fonts.load(`30px "${family}"`, text)).length > 0; } catch {}
				rows.push({ family, text, loaded, width: p.getBoundingClientRect().width });
			}
			const symbols = document.createElement("p"); symbols.innerHTML = '<span style="font-family:NonameSuits">♠♥♣♦</span> <span style="font-family:MotoyaLMaru">A 2 3 4 5 6 7 8 9 10 J Q K</span>'; document.body.append(symbols);
			const source = Object.keys(portraits).find(path => path.endsWith("xxy_yingyue.jpg"));
			const small = document.createElement("div"); small.className = "button character"; document.body.append(small);
			setPortraitBackground(small, [source], "");
			const sync = small.style.backgroundImage;
			const large = document.createElement("div"); large.className = "button"; document.body.append(large);
			setPortraitBackground(large, [source], "");
			const hidden = document.createElement("div"); hidden.className = "button character"; hidden.style.display = "none"; document.body.append(hidden);
			const hiddenSource = Object.keys(portraits).find(path => path.endsWith("xxy_lianyinshuang.jpg"));
			setPortraitBackground(hidden, [hiddenSource], "");
			(window as any).__resourceNodes = { small, large, source, hiddenSource };
			await document.fonts.ready;
			return { rows, sync, large: large.style.backgroundImage, source, hiddenThumbnail: portraits[hiddenSource] };
		}, { fonts, portraits });
		assert.ok(data.sync.includes("thumbnail/")); assert.ok(!data.large.includes("thumbnail/"));
		assert.ok(data.rows.every((row: any) => row.loaded === !fail && row.width > 0));
		if (fail) await page.waitForFunction(() => !(window as any).__resourceNodes.small.style.backgroundImage.includes("thumbnail/"));
		else await page.waitForFunction(() => performance.getEntriesByType("resource").some((r: any) => r.name.includes("thumbnail/") && r.responseEnd > 0));
		await page.screenshot({ path: resolve(out, `${fail ? "fallback" : "normal"}.png`) });
		assert.equal(requests.some(url => url.includes(data.hiddenThumbnail)), false, "Hidden portrait must not start a request");
		assert.equal(requests.some(url => /\/font\/(xinwei|shousha)\.woff2/.test(url)), false);
		results[fail ? "fallback" : "normal"] = { ...data, requests };
		await context.close();
	}
	await writeFile(resolve(out, "report.json"), JSON.stringify(results, null, 2));
	console.log(`RESOURCE_REPORT=${out}`);
} finally { await browser.close(); await server.close(); }
