// Exercise real PIXI scenes with isolated saves and a read-only local server.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { startEnvironment } from './performance/environment.ts';
import { seed } from './performance/seed.ts';
const { chromium } = createRequire(new URL('../packages/game-host/package.json', import.meta.url))('playwright-core');
const output = 'output/lobby-aspect';
await mkdir(output, { recursive: true });
const environment = await startEnvironment('dev', 18085);
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
   Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'always', ui_workshop_active: theme });
   for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
   await route.fulfill({ response, json: config });
  });
  await seed(page, environment.url, 'minimal');
  await page.evaluate(async theme => {
   const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('noname_0.9_data', 4);
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
   });
   await new Promise((resolve, reject) => {
    const tx = db.transaction('config', 'readwrite');
    tx.objectStore('config').put(theme, 'ui_workshop_active');
    tx.oncomplete = resolve; tx.onerror = reject;
   });
   db.close();
  }, theme);
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
  await page.waitForTimeout(2500);
  await page.evaluate(() => { window.__originalLobbyApp = __uiApps.find(a => a.view?.isConnected); });
  let reference;
  for (const size of [{ width: 1680, height: 953 }, { width: 1383, height: 538 }, { width: 1680, height: 881 }, { width: 984, height: 778 }, { width: 538, height: 430 }, { width: 1920, height: 1080 }, { width: 2560, height: 1080 }, { width: 1680, height: 953 }]) {
   await page.setViewportSize(size);
   await page.waitForTimeout(600);
   const state = await page.evaluate(() => {
    const app = __uiApps.find(a => a.view?.isConnected), canvas = app.view.getBoundingClientRect();
    const nodes = {};
    const visit = n => {
     if (['right_classic', 'right_ranking', 'right_activity', 'right_adventure', 'mode1', 'mode2', 'mode3', 'mode4', 'left_fix', 'leftlong', 'left1', 'top_user_bg', 'pica', 'bottom_friend', 'say', 'menu1', 'bigmenu'].includes(n.name) && n.worldVisible) {
      const b = n.getBounds(), m = n.worldTransform;
      nodes[n.name] = { x: b.x / app.stage.scale.x, y: b.y / app.stage.scale.y, width: b.width / app.stage.scale.x, height: b.height / app.stage.scale.y, sx: Math.hypot(m.a, m.b), sy: Math.hypot(m.c, m.d) };
     }
     n.children?.forEach(visit);
    };
    visit(app.stage);
    const bg = app.stage.children.find(n => n.texture?.width > 1000);
    return { sameApp: app === __originalLobbyApp, canvas: canvas.toJSON(), renderer: { width: app.renderer.screen.width, height: app.renderer.screen.height }, scale: app.stage.scale.x, scaleY: app.stage.scale.y, nodes, bounds: bg?.getBounds(), background: bg && { x: bg.x, y: bg.y, sx: bg.scale.x, sy: bg.scale.y } };
   });
   const scale = Math.min(size.width / 1103, size.height / 514);
   assert(state.sameApp, 'resizing must preserve the active scene');
   assert.equal(state.scale, state.scaleY);
   await page.screenshot({ path: `${output}/${theme}-${size.width}x${size.height}.png` });
   assert(Math.abs(state.canvas.width - size.width) < 1, 'canvas fills viewport width');
   assert(Math.abs(state.canvas.height - size.height) < 1, 'canvas fills viewport height');
   assert(Math.abs(state.canvas.x - (size.width - state.canvas.width) / 2) < 1);
   assert(Math.abs(state.canvas.y - (size.height - state.canvas.height) / 2) < 1);
   assert.equal(state.background.sx, state.background.sy);
   if (!reference) reference = state;
   const b = state.bounds;
   assert(b.x <= 1 && b.y <= 1 && b.x + b.width >= size.width - 1 && b.y + b.height >= size.height - 1, 'background covers the viewport');
   for (const [name, node] of Object.entries(state.nodes)) {
    // Preserve authored geometry too (the legacy menu uses 0.72 × 0.7).
    if (['left_fix', 'leftlong'].includes(name)) continue;
    assert(Math.abs(node.sx / node.sy - reference.nodes[name].sx / reference.nodes[name].sy) < .001, `${name}: resizing introduces no deformation`);
    for (const key of ['width', 'height']) assert(Math.abs(node[key] - reference.nodes[name][key]) < .1, `${name}: stable ${key}`);
    if (/right_|bottom_friend|mode[1-4]|menu1|say|left1|pica/.test(name)) {
     // Decorative frames bleed past the edge; their clickable centers must
     // remain visible at both narrow and ultrawide window sizes.
     const x = (node.x + node.width / 2) * scale, y = (node.y + node.height / 2) * scale;
     assert(x > 0 && x < size.width, `${name}: horizontal click target stays visible`);
     assert(y > 0 && y < size.height, `${name}: vertical click target stays visible`);
    }
   }
   report.cases.push({ theme, size, ...state });
   await page.screenshot({ path: `${output}/${theme}-${size.width}x${size.height}.png` });
   console.log(theme, size, 'passed');
  }
  // Use the actual pointer hit region after resizing, not dispatchEvent.
  const target = await page.evaluate(() => {
   const app = __originalLobbyApp;
   let button;
   const visit = n => { if (['mode1', 'right_classic'].includes(n.name) && n.interactive && n.worldVisible) button = n; n.children?.forEach(visit); };
   visit(app.stage);
   const b = button.getBounds(), c = app.view.getBoundingClientRect();
   return { x: c.x + (b.x + b.width / 2) * c.width / app.renderer.screen.width, y: c.y + (b.y + b.height / 2) * c.height / app.renderer.screen.height };
  });
  await page.mouse.click(target.x, target.y);
  await page.waitForFunction(() => {
   const find = n => n.name === 'modesecbg' && n.worldVisible && n.worldAlpha > .9 || n.children?.some(find);
   return find(__originalLobbyApp.stage);
  }, null, { timeout: 10000 });
  await page.screenshot({ path: `${output}/${theme}-mode-panel.png` });
  console.log(theme, 'pointer passed');
  await context.close();
 }
 assert.deepEqual(report.errors, []);
} finally {
 await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
 await browser.close();
 await environment.close();
}
