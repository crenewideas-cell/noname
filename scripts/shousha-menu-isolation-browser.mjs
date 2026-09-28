// Exercise the real menu decorator and stylesheet cascade without game/save state.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve('apps/core');
const output = path.resolve('output/shousha-menu-isolation');
const provider = '/extension/ui/手杀标准UI/native/';
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = { checks: [], errors: [] };
await fs.mkdir(output, { recursive: true });
try {
 for (const skinFirst of [false, true]) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 911 } });
  page.on('pageerror', error => report.errors.push(error.stack));
  await page.route('**/*', async route => {
   const url = new URL(route.request().url());
   if (url.pathname === '/') return route.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html><head></head><body><div id="window"><div id="arena"></div><div id="system"><div id="system2"></div></div></div></body></html>' });
   const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
   assert(file.startsWith(root + path.sep));
   try {
    const contentType = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }[path.extname(file)];
    await route.fulfill({ body: await fs.readFile(file), contentType });
   } catch (error) { report.errors.push(error.message); await route.abort(); }
  });
  await page.goto('http://127.0.0.1/');
  for (const href of skinFirst ? [provider + 'presentation.css', '/layout/default/menu-presentation.css'] : ['/layout/default/menu-presentation.css', provider + 'presentation.css']) {
   await page.addStyleTag({ url: href });
  }
  await page.evaluate(async provider => {
   const { installNativeMenu } = await import(provider + 'menu.js');
   const group = document.querySelector('#system2');
   const control = label => { const node = document.createElement('button'); node.textContent = label; group.append(node); return node; };
   window.ui = { system2: group, config2: control('选项'), auto: control('托管') };
   control('投降'); control('记牌器');
   window.shortcutsClicked = 0;
   ui.config2.onclick = () => window.shortcutsClicked++;
   window.mountSkin = () => { document.body.dataset.shoushaParts = 'buttons menus'; window.disposeSkin = installNativeMenu({ ui }); };
   window.unmountSkin = () => { disposeSkin(); delete document.body.dataset.shoushaParts; };
   window.openMenu = () => {
    const dialog = document.createElement('dialog');
    dialog.className = 'game-navigation';
    dialog.setAttribute('aria-labelledby', 'game-navigation-title');
    dialog.innerHTML = '<h2 id="game-navigation-title">对局操作</h2><p id="game-navigation-description">返回主界面可重新选择模式</p><div class="game-navigation-actions"><button>继续游戏</button><button>重新开始</button><button class="primary">返回主界面</button><button class="danger">退出程序</button></div><p class="game-navigation-status"></p>';
    dialog.querySelector('button').onclick = () => dialog.close();
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    document.body.append(dialog); dialog.showModal();
   };
  }, provider);
  const appearance = () => page.locator('dialog button').evaluateAll(nodes => nodes.map(node => {
   const style = getComputedStyle(node);
   return { label: node.textContent, image: decodeURI(style.backgroundImage), border: style.borderImageSource, color: style.color, rect: node.getBoundingClientRect().toJSON() };
  }));
  await page.evaluate(() => openMenu());
  const builtin = await appearance();
  assert(builtin.every(button => button.border.includes('decade-button.png')), 'built-in menu keeps its button skin');
  await page.evaluate(() => mountSkin());
  await page.waitForSelector('.ss-game-menu');
  const expected = { '设置': 'SSCD/shezhi.png', '托管': 'SSCD/tuoguan.png', '投降': 'SSCD/touxiang.png', '返回主界面': 'SSCD/taopao.png', '退出程序': 'SSCD/tuichu.png', '重新开始': 'uibutton/cbtn.png' };
  const checkSkin = async () => {
   const buttons = await appearance();
   assert.equal(buttons.length, 7);
   for (const button of buttons) {
    assert.equal(button.border, 'none', button.label + ': built-in frame must not leak');
    if (expected[button.label]) assert(button.image.includes(expected[button.label]), JSON.stringify(button));
    else assert.equal(button.image, 'none');
   }
  };
  await checkSkin();
  for (const [width, height] of [[1920, 911], [844, 480], [390, 844]]) {
   await page.setViewportSize({ width, height });
   await checkSkin();
   for (const { rect } of await appearance()) assert(rect.x >= 0 && rect.y >= 0 && rect.right <= width + 1 && rect.bottom <= height + 1, JSON.stringify(rect));
   await page.screenshot({ path: path.join(output, `${skinFirst ? 'skin-first' : 'host-first'}-${width}.png`) });
  }
  const settings = page.getByRole('button', { name: '设置', exact: true });
  await settings.hover(); await checkSkin();
  await page.mouse.down(); await checkSkin(); await page.mouse.up();
  await page.waitForFunction(() => window.shortcutsClicked === 1 && !document.querySelector('dialog'));
  await page.evaluate(() => openMenu());
  await page.waitForSelector('.ss-game-menu');
  await page.evaluate(() => { document.querySelector('[data-ss-icon="surrender"]').disabled = true; });
  await checkSkin();
  await page.evaluate(() => unmountSkin());
  assert.equal(await page.locator('.ss-menu-shortcuts,.ss-game-menu,.ss-utility-button').count(), 0);
  assert.deepEqual((await appearance()).map(({ label, image, border, color }) => ({ label, image, border, color })), builtin.map(({ label, image, border, color }) => ({ label, image, border, color })), 'unmount restores original built-in appearance');
  await page.evaluate(() => mountSkin()); await checkSkin();
  await page.getByRole('button', { name: '继续游戏', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('dialog'));
  report.checks.push({ skinFirst, passed: true, coverage: 'desktop/mobile, hover/active/disabled, mount/unmount/remount, shortcut and continue callbacks' });
  await page.close();
 }
 if (process.argv.includes('--game')) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 911 } });
  const failures = [];
  page.on('dialog', dialog => dialog.accept());
  page.on('pageerror', error => { report.errors.push(error.stack); console.error(error.stack); });
  page.on('response', response => { if (response.status() >= 400 && decodeURI(response.url()).includes('/手杀标准UI/')) failures.push(response.url()); });
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.addInitScript(() => sessionStorage.setItem('noname_0.9_disable_extension', 'true'));
  await page.route('**/game/config.json', async route => {
   const response = await route.fetch(), config = await response.json();
   Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'off', mode: 'identity', characters: ['standard'], cards: ['standard', 'extra'], ui_workshop_active: 'builtin-shousha-standard' });
   config.mode_config.identity = { ...config.mode_config.identity, player_number: '5', double_character: false, change_card: 'once', identity: 'zhong' };
   for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
   await route.fulfill({ response, json: config });
  });
  await page.goto(process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#arena .button.character.selectable', { timeout: 90000 });
  await page.waitForSelector('.ss-player-frame');
  if (await page.locator('#extension-recovery summary').isVisible()) await page.locator('#extension-recovery summary').click();
  await page.locator('#arena .button.character.selectable').first().click();
  await page.waitForFunction(async () => (await import('/noname.js')).game.me?.getCards('h').length > 0, null, { timeout: 30000 });
  await page.waitForTimeout(3000); // Let the opening visual effect finish before screenshots.
  for (const [width, height] of [[1920, 911], [844, 480]]) {
   await page.setViewportSize({ width, height });
   await page.locator('#roundmenu').click();
   await page.waitForSelector('dialog.ss-game-menu');
   const buttons = await page.locator('dialog.ss-game-menu button').evaluateAll(nodes => nodes.map(node => ({ label: node.textContent, image: decodeURI(getComputedStyle(node).backgroundImage), border: getComputedStyle(node).borderImageSource })));
   assert.equal(buttons.length, 7);
   assert(buttons.every(button => button.border === 'none'));
   assert(buttons.find(button => button.label === '设置').image.includes('SSCD/shezhi.png'));
   assert(buttons.find(button => button.label === '托管').image.includes('SSCD/tuoguan.png'));
   await page.screenshot({ path: path.join(output, `game-${width}.png`) });
   await page.getByRole('button', { name: '继续游戏', exact: true }).click();
   await page.waitForFunction(() => !document.querySelector('dialog.ss-game-menu'));
  }
  assert.deepEqual(failures, []);
  report.checks.push({ realGame: true, passed: true, coverage: 'actual plus-menu entry and continue action at desktop/mobile sizes; no skin resource failures' });
  await page.close();
 }
 assert.deepEqual(report.errors, []);
 console.log(JSON.stringify(report, null, 2));
} catch (error) {
 report.failure = error.stack;
 for (const context of browser.contexts()) for (const page of context.pages()) {
  await page.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {});
 }
 throw error;
} finally {
 await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
 await browser.close();
}
