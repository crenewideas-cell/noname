// Drive both lobbies into the matching (zhuanzhuan) view and capture how the
// wheel is anchored across window sizes, for comparison with 如真似幻.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { startEnvironment } from './performance/environment.ts';
import { seed } from './performance/seed.ts';
const { chromium } = createRequire(new URL('../packages/game-host/package.json', import.meta.url))('playwright-core');
const output = 'output/matching-wheel';
await mkdir(output, { recursive: true });
const environment = await startEnvironment('dev', 18087);
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const report = { errors: [], cases: [] };
try {
	for (const theme of ['builtin-shousha-standard', 'builtin-rzsh']) {
		const context = await browser.newContext({ viewport: { width: 1680, height: 953 } });
		const page = await context.newPage();
		page.on('pageerror', error => { report.errors.push(error.stack); console.log(error.message); });
		page.on('dialog', dialog => dialog.accept());
		await context.route('**/*', route => new URL(route.request().url()).origin === environment.url ? route.continue() : route.abort());
		await page.routeWebSocket('**', () => {});
		await context.addInitScript(() => {
			localStorage.setItem('gplv3_noname_alerted', 'true');
			sessionStorage.setItem('noname_0.9_return_to_lobby', 'true');
			sessionStorage.setItem('noname-shousha-native:returnHome', 'true');
			window.__uiApps = [];
			let pixi;
			Object.defineProperty(window, 'PIXI', { configurable: true, get: () => pixi, set(value) {
				const App = value.Application;
				if (App && !App.__recorded) {
					const Recorded = class extends App { constructor(...args) { super(...args); window.__uiApps.push(this); } };
					Recorded.__recorded = true; value.Application = Recorded;
				}
				pixi = value;
			} });
		});
		await page.route('**/game/config.json*', async route => {
			const response = await route.fetch(), config = await response.json();
			Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'always', ui_workshop_active: theme, zhuanzhuan: true });
			for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
			await route.fulfill({ response, json: config });
		});
		await seed(page, environment.url, 'minimal');
		await page.goto(environment.url, { waitUntil: 'domcontentloaded' });
		console.log(theme, 'loading');
		await page.waitForFunction(() => {
			const find = n => ['mode1', 'left_fix'].includes(n.name) && n.worldVisible && n.worldAlpha > .99 || n.children?.some(find);
			return window.__uiApps.some(a => a.renderer && a.stage && a.view?.isConnected && find(a.stage));
		}, null, { timeout: 120000 }).catch(async error => {
			await page.screenshot({ path: `${output}/${theme}-failure.png` });
			console.log(await page.locator('body').innerText());
			throw error;
		});
		await page.waitForTimeout(1500);
		// Open the mode panel, then press the battle button.
		const clickNamed = async names => {
			const target = await page.evaluate(names => {
				const app = window.__uiApps.find(a => a.view?.isConnected);
				let button;
				const visit = n => { if (names.includes(n.name) && n.interactive && n.worldVisible) button = n; n.children?.forEach(visit); };
				visit(app.stage);
				if (!button) return null;
				const b = button.getBounds(), c = app.view.getBoundingClientRect();
				return { x: c.x + (b.x + b.width / 2) * c.width / app.renderer.screen.width, y: c.y + (b.y + b.height / 2) * c.height / app.renderer.screen.height };
			}, names);
			if (!target) throw new Error(`no interactive node named ${names} in ${theme}`);
			await page.mouse.click(target.x, target.y);
		};
		await clickNamed(['mode1', 'right_classic']);
		await page.waitForFunction(() => {
			const find = n => n.name === 'modesecbg' && n.worldVisible && n.worldAlpha > .9 || n.children?.some(find);
			return window.__uiApps.some(a => a.view?.isConnected && find(a.stage));
		}, null, { timeout: 15000 });
		await page.waitForTimeout(800);
		await page.screenshot({ path: `${output}/${theme}-mode-panel.png` });
		await clickNamed(['spinekz']);
		console.log(theme, 'matching requested');
		// Freeze the wheel's completion listener so the view stays for probing.
		await page.waitForTimeout(800);
		await page.evaluate(() => {
			const app = window.__uiApps?.find(a => a && a.renderer && a.stage && a.view?.isConnected);
			if (!app) return;
			const visit = n => {
				if (n.spineData && n.state?.tracks?.[0]) n.state.tracks[0].listener = null;
				n.children?.forEach(visit);
			};
			visit(app.stage);
		});
		// Burst frames while the wheel plays; the lobby may auto-finish afterwards.
		for (let frame = 0; frame < 8; frame++) {
			await page.waitForTimeout(450);
			await page.screenshot({ path: `${output}/${theme}-matching-${frame}.png` });
		}
		// Geometry probe at several window sizes; rebuild the wheel each time.
		for (const size of [{ width: 1680, height: 953 }, { width: 1680, height: 881 }, { width: 1383, height: 538 }, { width: 984, height: 778 }, { width: 2560, height: 1080 }]) {
			await page.setViewportSize(size);
			await page.waitForTimeout(700);
			const probe = await page.evaluate(() => {
				const app = window.__uiApps?.find(a => a && a.renderer && a.stage && a.view?.isConnected);
				if (!app) return null;
				const boxes = [];
				const visit = n => {
					if (n.worldVisible && n.worldAlpha > 0 && (n.spineData || n.textures)) {
						const b = n.getBounds();
						boxes.push({ name: n.name || n.constructor.name, y: b.y, height: b.height, bottom: b.y + b.height });
					}
					n.children?.forEach(visit);
				};
				visit(app.stage);
				return { renderer: { w: app.renderer.screen.width, h: app.renderer.screen.height }, boxes };
			}).catch(error => ({ error: error.message }));
			report.cases.push({ theme, size, probe });
			await page.screenshot({ path: `${output}/${theme}-grounded-${size.width}x${size.height}.png` });
			console.log(theme, size, JSON.stringify(probe));
		}
		await context.close();
	}
} finally {
	await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
	await browser.close();
	await environment.close();
}
