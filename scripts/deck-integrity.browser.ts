import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const root = resolve(import.meta.dirname, "..");
const requireCore = createRequire(resolve(root, "apps/core/package.json"));
const requireHost = createRequire(resolve(root, "packages/game-host/package.json"));
const { createServer } = await import(pathToFileURL(requireCore.resolve("vite")).href);
const { chromium } = requireHost("playwright-core");
const server = await createServer({ configFile: resolve(root, "apps/core/vite.config.ts"), root: resolve(root, "apps/core"), server: { port: 8099, strictPort: true, open: false, watch: null, hmr: false, warmup: { clientFiles: [] } } });
await server.listen();
let browser;
try {
	browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
	const page = await browser.newPage();
	await page.route("**/__deck_tests.html", route => route.fulfill({ contentType: "text/html", body: `<meta charset="utf-8"><script type="module" src="/@fs/${root.replaceAll("\\", "/")}/scripts/deck-integrity.browser.js"></script>` }));
	const errors: string[] = [];
	page.on("pageerror", error => errors.push(error.stack || error.message));
	page.on("dialog", dialog => { errors.push(dialog.message()); void dialog.dismiss(); });
	await page.goto("http://127.0.0.1:8099/__deck_tests.html", { waitUntil: "domcontentloaded", timeout: 120000 });
	await page.waitForFunction(() => (window as any).__deckReport, undefined, { timeout: 120000 });
	const report = await page.evaluate(() => (window as any).__deckReport);
	report.pageErrors = errors;
	await mkdir(resolve(root, "output/deck-integrity"), { recursive: true });
	await writeFile(resolve(root, "output/deck-integrity/browser-report.json"), JSON.stringify(report, null, 2));
	console.log(JSON.stringify(report, null, 2));
	if (report.fatal || report.failures.length || errors.length) process.exitCode = 1;
} finally {
	await browser?.close();
	await server.close();
}
