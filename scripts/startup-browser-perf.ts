import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, startEnvironment } from './performance/environment.ts';
import { seed } from './performance/seed.ts';

// Isolated browser storage and read-only file APIs; never opens the user's profile.
const label = process.argv[2] || 'current';
const out = resolve('output/startup-browser', label);
await mkdir(out, { recursive: true });
const start = performance.now();
const baseline = process.argv.includes('--baseline');
const server = await startEnvironment('dev', 18191, undefined, true, config => {
 if (!baseline) return;
 config.plugins = config.plugins.filter((p: any) => !['noname-external-dev-sourcemaps', 'noname-dev-boot-style'].includes(p.name));
 // The resolver starts uncached; only its new configResolved hook enables the index.
 const resolver = config.plugins.find((p: any) => p.name === 'classified-extension-sources');
 delete resolver.configResolved;
});
const serverMs = performance.now() - start;
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
 const context = await browser.newContext({ viewport: { width: 1420, height: 800 }, serviceWorkers: 'block' });
 const page = await context.newPage();
 // tsx preserves function names using this helper when serializing callbacks.
 await page.addInitScript('window.__name = value => value;');
 const errors: string[] = [];
 page.on('pageerror', error => errors.push(error.message));
 page.on('dialog', async dialog => { errors.push(dialog.message()); await dialog.dismiss(); });
 await seed(page, server.url, 'defaults');
 await page.evaluate(async () => {
  const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('noname_0.9_data'); r.onsuccess = () => resolve(r.result); });
  await new Promise<void>(resolve => { const tx = db.transaction('config', 'readwrite'); tx.objectStore('config').put('builtin-shousha-standard', 'ui_workshop_active'); tx.oncomplete = () => resolve(); });
  db.close();
 });
 for (const cache of ['cold', 'warm']) {
  errors.length = 0;
  await page.goto(server.url + '/?perf=1', { waitUntil: 'commit', timeout: 120000 });
  let failure: string | undefined;
  try {
   await page.locator('iframe[title="手杀标准UI登录"]').waitFor({ state: 'visible', timeout: 180000 });
   await page.locator('.shousha-native-loading').waitFor({ state: 'hidden', timeout: 180000 });
   await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').waitFor({ state: 'visible', timeout: 180000 });
  }
  catch (error) { failure = String(error); }
  const result = await page.evaluate(() => ({ now: performance.now(), perf: (window as any).__nonamePerf?.snapshot(), text: document.body.innerText.slice(0, 300), frames: [...document.querySelectorAll('iframe')].map(f => f.src) }));
  await page.screenshot({ path: resolve(out, cache + '.png') });
  await writeFile(resolve(out, cache + '.json'), JSON.stringify({ serverMs, failure, errors, ...result }, null, 2));
  console.log(JSON.stringify({ label, cache, serverMs, failure, errors, readyMs: result.now, paint: result.perf?.paint, stages: result.perf?.stages?.entries.filter((s: any) => s.name.startsWith('boot.')) }));
  if (failure) throw new Error(failure);
 }
 if (process.argv.includes('--login-smoke')) {
  await page.evaluate(() => {
   const w = window as any; w.__startupApps = []; let pixi = w.PIXI;
   Object.defineProperty(w, 'PIXI', { configurable: true, get: () => pixi, set(value) {
    const App = value.Application;
    value.Application = class extends App { constructor(...args: any[]) { super(...args); w.__startupApps.push(this); } };
    pixi = value;
   } });
  });
  const loginStart = performance.now();
  await page.frameLocator('iframe[src*="/html/rzsh.html"]').locator('#offlinebutton').click();
  await page.waitForFunction(() => {
   const visibleMode = (n: any): boolean => n.name === 'mode1' && n.worldVisible && n.worldAlpha > .99 || n.children?.some(visibleMode);
   return (window as any).__startupApps.some((app: any) => app.view?.isConnected && visibleMode(app.stage));
  }, undefined, { timeout: 90000 });
  const loginToHomeMs = performance.now() - loginStart;
  await page.screenshot({ path: resolve(out, 'home.png') });
  const state = await page.evaluate(async () => {
   const { lib } = await import('/noname.js');
   return { nickname: lib.config.connect_nickname, activeUI: lib.config.ui_workshop_active, extensions: lib.config.extensions };
  });
  await writeFile(resolve(out, 'login-smoke.json'), JSON.stringify({ loginToHomeMs, errors, state }, null, 2));
  if (errors.length) throw new Error('Login smoke produced errors: ' + errors.join('\n'));
  console.log(JSON.stringify({ loginToHomeMs, loginSmoke: 'passed' }));
 }
 await context.close();
} finally { await browser.close(); await server.close(); }
