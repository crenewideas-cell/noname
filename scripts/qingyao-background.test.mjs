import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { resolveExtensionPath } from './extension-layout.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const core = path.resolve('apps/core');
const scene = 'extension/清瑶葭绮/members/假装无敌/ymhuajing.jpg';

test('Qingyao opening background remains visible over provider and workshop artwork', async t => {
	const server = createServer(async (req, res) => {
		try {
			const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
			if (pathname === '/') {
				res.setHeader('Content-Type', 'text/html');
				res.end('<!doctype html><html><head></head><body><div class="background"></div><div id="window"><div id="arena"></div></div></body></html>');
				return;
			}
			const file = resolveExtensionPath(core, pathname.slice(1));
			res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg' })[path.extname(file)] || 'application/octet-stream');
			res.end(await readFile(file));
		} catch {
			res.writeHead(404).end();
		}
	});
	await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
	t.after(() => new Promise(resolve => server.close(resolve)));
	const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
	t.after(() => browser.close());
	const page = await browser.newPage();
	await page.goto(`http://127.0.0.1:${server.address().port}/`);
	await page.addStyleTag({ url: '/layout/default/arena-background.css' });
	await page.addStyleTag({ url: '/extension/手杀标准UI/native/presentation.css' });
	await page.evaluate(async () => {
		const { installArenaBackground } = await import('/noname/ui/arenaBackground.js');
		const { installCharacterUI } = await import('/extension/清瑶葭绮/members/假装无敌/compatibility.js');
		const { mountAppearance } = await import('/noname/ui/workshop/runtime.js');
		window.testUI = {
			arena: document.querySelector('#arena'),
			background: document.querySelector('.background'),
			create: { div() {
				const node = document.createElement('div');
				node.className = 'background';
				node.setBackgroundImage = src => { node.style.backgroundImage = `url("${src}")`; };
				return node;
			} },
			refresh(node) { return node.offsetWidth; },
		};
		document.body.dataset.shoushaParts = 'arena';
		installCharacterUI({ config: {} }, window.testUI);
		installArenaBackground({ ui: window.testUI });
		window.mountTestAppearance = runtime => mountAppearance({ id: 'scene-regression', components: {
			arena: { runtime, assets: { background: '/theme.jpg' }, style: { 'background-color': '#123456' } },
		} }, value => value);
	});
	const readScene = () => page.evaluate(() => ({
		active: document.body.hasAttribute('data-arena-scene'),
		image: decodeURI(getComputedStyle(window.testUI.background).backgroundImage),
		layers: ['#window', '#arena'].map(selector => {
			const style = getComputedStyle(document.querySelector(selector));
			return { image: style.backgroundImage, color: style.backgroundColor };
		}),
	}));
	await page.evaluate(src => window.testUI.setFlashBackground(src), scene);
	await page.waitForFunction(() => document.body.hasAttribute('data-arena-scene'));
	const expectedImage = `url("${decodeURI(new URL(scene, page.url()).href)}")`;
	assert.equal((await readScene()).image, expectedImage, 'relative scene URL must resolve against the document, not the arena stylesheet');
	for (const runtime of [undefined, 'decade']) {
		await page.evaluate(runtime => window.mountTestAppearance(runtime), runtime);
		const actual = await readScene();
		assert.equal(actual.image, expectedImage, `workshop (${runtime || 'default'}) must yield to character image`);
		assert.deepEqual(actual.layers, [
			{ image: 'none', color: 'rgba(0, 0, 0, 0)' },
			{ image: 'none', color: 'rgba(0, 0, 0, 0)' },
		], 'foreground arena/window artwork must not cover the character background');
	}
	const resource = await page.evaluate(async () => {
		const image = new Image();
		image.src = getComputedStyle(window.testUI.background).backgroundImage.slice(5, -2);
		await image.decode();
		return { width: image.naturalWidth, height: image.naturalHeight };
	});
	assert.ok(resource.width > 0 && resource.height > 0);
	await page.evaluate(() => window.testUI.arena.remove());
	await page.waitForFunction(() => !document.body.hasAttribute('data-arena-scene'));
	assert.ok((await readSceneWithoutArena(page)).includes('/theme.jpg'), 'normal theme returns after arena disposal');
});

function readSceneWithoutArena(page) {
	return page.evaluate(() => getComputedStyle(window.testUI.background).backgroundImage);
}
