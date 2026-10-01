// One-off visual check: identity free-choose dialog must now use the legacy
// characterDialog UI (2v2 style), not the paged character browser.
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { startEnvironment } from './performance/environment.ts';
const { chromium } = createRequire(new URL('../packages/game-host/package.json', import.meta.url))('playwright-core');
const output = 'output/selection-unify';
await mkdir(output, { recursive: true });
const environment = await startEnvironment('dev', 18087);
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
try {
	const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
	const page = await context.newPage();
	page.on('pageerror', error => console.log('PAGEERROR', error.message));
	page.on('dialog', dialog => dialog.accept());
	await context.addInitScript(() => sessionStorage.setItem('noname_0.9_disable_extension', 'true'));
	await page.route('**/*', route => new URL(route.request().url()).origin === environment.url ? route.continue() : route.abort());
	await page.routeWebSocket('**', () => {});
	await page.route('**/game/config.json*', async route => {
		const response = await route.fetch(), config = await response.json();
		Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'off', mode: 'identity' });
		config.mode_config.identity = { ...config.mode_config.identity, player_number: '8', double_character: false, change_choice: true, free_choose: true, recentCharacter: ['caocao'] };
		for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
		await route.fulfill({ response, json: config });
	});
	await page.goto(environment.url, { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('#arena .button.character.selectable', { timeout: 180000 });
	console.log('arena ready, clicking 自由选将');
	await page.evaluate(async () => {
		const { lib, ui } = await import('/noname.js');
		if (!ui.cheat2) throw new Error('自由选将 control missing');
		ui.cheat2.dispatchEvent(new Event(lib.config.touchscreen ? 'touchend' : 'click', { bubbles: true }));
	});
	await page.waitForFunction(() => {
		const dialogs = [...document.querySelectorAll('.dialog')];
		return dialogs.some(dialog => dialog.querySelector('.searcher input') && dialog.querySelector('.buttons')?.children.length);
	}, null, { timeout: 180000 });
	await page.waitForTimeout(2500);
	const info = await page.evaluate(async () => {
		const { ui } = await import('/noname.js');
		const dialog = [...document.querySelectorAll('.dialog')].find(node => node.querySelector('.searcher input'));
		if (!dialog) return { error: 'dialog not found' };
		const paginationHost = [...dialog.querySelectorAll('*')].find(node => node.classList?.contains('number-ellipsis'));
		const paginationRoot = paginationHost?.closest('.dialog') === dialog ? paginationHost.parentElement : null;
		return {
			isPagedBrowser: !!dialog.characterPager,
			searchInput: !!dialog.querySelector('.searcher input'),
			searchSubmit: !!dialog.querySelector('.character-search-submit'),
			factionSelect: !!dialog.querySelector('select[aria-label="筛选势力"]'),
			packSelect: !!dialog.querySelector('select'),
			categoryToggles: [...dialog.querySelectorAll('.character-filters .tdnode')].slice(0, 8).map(node => node.textContent.trim()),
			alphabetSpans: dialog.querySelectorAll('.character-filters span[link]').length,
			buttonCount: dialog.querySelectorAll('.buttons .button.character').length,
			hasLegacyPagination: !!paginationRoot,
			statusText: dialog.querySelector('.character-browser-status')?.textContent || null,
		};
	});
	console.log(JSON.stringify(info, null, 2));
	await page.screenshot({ path: `${output}/identity-freechoose.png` });
	if (info.isPagedBrowser) throw new Error('FAIL: free-choose dialog still uses the paged browser');
	if (!info.hasLegacyPagination || !info.categoryToggles.length) throw new Error('FAIL: legacy 2v2-style UI missing');
	console.log('PASS');
} finally {
	await browser.close();
	await environment.close();
}
