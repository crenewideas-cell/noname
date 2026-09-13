import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const root = resolve(import.meta.dirname, "..");
const online = process.argv.includes("--online");
const requireCore = createRequire(resolve(root, "apps/core/package.json"));
const requireHost = createRequire(resolve(root, "packages/game-host/package.json"));
const { createServer } = await import(pathToFileURL(requireCore.resolve("vite")).href);
const { chromium } = requireHost("playwright-core");
const server = await createServer({ configFile: resolve(root, "apps/core/vite.config.ts"), root: resolve(root, "apps/core"), server: { port: 8099, strictPort: true, open: false, hmr: false } });
await server.listen();
let browser;
try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.platform === "win32" ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : undefined) });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.context().route("**/__hlhj_tests.html*", route => route.fulfill({ contentType: "text/html", body: `<meta charset="utf-8"><script type="module" src="/@fs/${root.replaceAll("\\", "/")}/scripts/hlhj-regression.browser.js"></script>` }));
    // The static test page does not use Vite hot reload.
    await page.context().route("**/@vite/client", route => route.fulfill({ contentType: "text/javascript", body: `
        const styles = new Map();
        export const createHotContext = () => ({accept(){},acceptExports(){},dispose(){},prune(){},on(){},off(){},send(){},invalidate(){},data:{}});
        export const injectQuery = url => url;
        export function updateStyle(id, css) {
            let style = styles.get(id);
            if (!style) { style = document.createElement("style"); styles.set(id, style); document.head.append(style); }
            style.textContent = css;
        }
        export function removeStyle(id) { styles.get(id)?.remove(); styles.delete(id); }
    ` }));
    const errors: string[] = [];
    await page.context().addInitScript(() => window.addEventListener("error", event => { (window as any).__hlhjBootError = event.message; }));
    page.on("pageerror", error => errors.push(error.stack || error.message));
    page.on("console", message => {
        if (message.type() === "error") errors.push(message.text());
        if (message.text().startsWith("HLHJ_TEST")) console.log(message.text());
    });
    const url = "http://127.0.0.1:8099/__hlhj_tests.html" + (online ? "?online" : "");
    await page.goto(url);
    await page.waitForFunction(() => (window as any).__hlhjReport || (window as any).__hlhjBootError, undefined, { timeout: 45000 }).catch(async error => {
        console.log(JSON.stringify({ progress: await page.evaluate(() => (window as any).__hlhjProgress), errors }, null, 2));
        throw error;
    });
    const report = await page.evaluate(() => (window as any).__hlhjReport || { fatal: (window as any).__hlhjBootError, failures: [] });
    if (online && !report.fatal && !report.failures.length) {
        const remote = await page.context().newPage();
        remote.on("pageerror", error => errors.push(error.stack || error.message));
        await remote.goto(url);
        await remote.waitForFunction(() => (window as any).__hlhjReport || (window as any).__hlhjBootError, undefined, { timeout: 45000 });
        const remoteReport = await remote.evaluate(() => (window as any).__hlhjReport);
        if (!remoteReport || remoteReport.fatal || remoteReport.failures.length) report.failures.push({ name: "远端引擎初始化", report: remoteReport });
        else {
            const snapshot = await page.evaluate(() => (window as any).__hlhjOnline.snapshot());
            const restored = await remote.evaluate(data => (window as any).__hlhjOnline.restore(data), snapshot);
            if (restored.bond !== "hlhj-test-1" || restored.tears !== 4 || restored.step !== 2 || restored.secret) report.failures.push({ name: "跨页面重连状态", restored });
            else report.passed.push("两个独立页面跨序列化恢复缘、泪、次数，保留秘密信息隔离");
        }
        await remote.close();
    }
    report.pageErrors = errors;
    await mkdir(resolve(root, "output/红楼幻境"), { recursive: true });
    await writeFile(resolve(root, `output/红楼幻境/${online ? "online" : "browser"}-report.json`), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    if (report.fatal || report.failures.length || errors.length) process.exitCode = 1;
} finally { await browser?.close(); await server.close(); }
