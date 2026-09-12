import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const root = resolve(import.meta.dirname, "..");
const requireCore = createRequire(resolve(root, "apps/core/package.json"));
const requireHost = createRequire(resolve(root, "packages/game-host/package.json"));
const { createServer } = await import(pathToFileURL(requireCore.resolve("vite")).href);
const { chromium } = requireHost("playwright-core");
const server = await createServer({ configFile: resolve(root, "apps/core/vite.config.ts"), root: resolve(root, "apps/core"), server: { port: 8098, strictPort: true, open: false } });
await server.listen();
let browser;
try {
	browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.platform === "win32" ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : undefined) });
	const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
	await page.route("**/__skill_tests.html", route => route.fulfill({ contentType: "text/html", body: `<meta charset="utf-8"><script type="module" src="/@fs/${root.replaceAll("\\", "/")}/scripts/online-skill-regression.browser.js"></script>` }));
	const errors: string[] = [];
	page.on("pageerror", error => errors.push(error.stack || error.message));
	await page.goto("http://127.0.0.1:8098/__skill_tests.html");
	await page.waitForFunction(() => (window as any).__skillReport, undefined, { timeout: 180000 });
	const report = await page.evaluate(() => (window as any).__skillReport);
	if (!report.fatal) await page.evaluate(() => (window as any).__skillPreview());
	if (!report.fatal)
		await page.waitForFunction(() => {
			const control = document.querySelector(".online-skill-control");
			return control && Number(getComputedStyle(control).opacity) > 0.95;
		});
	report.pageErrors = errors;
	await mkdir(resolve(root, "output/online-skills"), { recursive: true });
	await writeFile(resolve(root, "output/online-skills/report.json"), JSON.stringify(report, null, 2));
	await page.screenshot({ path: resolve(root, "output/online-skills/desktop.png"), animations: "disabled" });
	await page.setViewportSize({ width: 740, height: 420 });
	await page.screenshot({ path: resolve(root, "output/online-skills/mobile.png"), animations: "disabled" });
	console.log(JSON.stringify(report, null, 2));
	if (report.fatal || report.failures.length || report.audit.errors.length || errors.length) process.exitCode = 1;
} finally {
	await browser?.close();
	await server.close();
}
