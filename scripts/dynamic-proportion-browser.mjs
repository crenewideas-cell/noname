import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const root = 'apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展';
const catalog = JSON.parse(await fs.readFile(root + '/catalog.json'));
const samples = catalog.entries.filter(e => e.available !== false && e.characterIds?.includes('luyi'));
for (const type of ['spine36', 'spine', 'spine42']) {
  const eligible = e => e.available !== false && e.type === type && e.legacy && !samples.includes(e);
  const sample = catalog.entries.find(e => eligible(e) && e.models?.length > 1) || catalog.entries.find(eligible);
  if (sample) samples.push(sample);
}
await fs.mkdir('output/dynamic-proportions', { recursive: true });
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const report = [];
try {
  for (const entry of samples) {
    const page = await browser.newPage({ viewport: { width: 840, height: 600 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/extension/' + encodeURIComponent('本地动态皮肤包') + '/' + encodeURIComponent('无名杀基础扩展') + '/runtime/player.html?id=' + entry.id + '&presentation=preview');
    await page.waitForFunction(() => window.skinPlayer || window.skinPlayerError, null, { timeout: 60000 });
    assert.equal(await page.evaluate(() => window.skinPlayerError), null);
    const info = await page.evaluate(() => {
      const p = skinPlayer, engine = p.engine42;
      if (engine) { engine.pause(true); engine.draw(.5); }
      else { p.app.stop(); p.app.render(); }
      return { fit: p.fit, presentation: SkinFraming.compose(p.entry, p.fit),
        roots: engine?.layers.map(l => ({ scale: [l.skeleton.bones[0].scaleX, l.skeleton.bones[0].scaleY], angle: l.skeleton.bones[0].rotation })),
        syntheticBackground: !!document.querySelector('[data-skin-surface]') };
    });
    assert.equal(info.presentation.nativePortrait, true);
    assert.equal(info.presentation.orientation, 'portrait');
    assert.equal(info.syntheticBackground, false);
    if (entry.id === 'base_e27e902c52bed11d') {
      assert.deepEqual(info.roots.map(r => r.scale), [[1, 1], [1, 1]]);
      assert.ok(info.roots.every(r => r.angle === 0), 'Avatar rotation must not distort rig constraints');
      await page.screenshot({ path: 'output/dynamic-proportions/luyi-after.png' });
    }
    await page.screenshot({ path: `output/dynamic-proportions/${entry.id}-scene.png` });
    await page.setViewportSize({ width: 360, height: 600 });
    await page.evaluate(() => skinPlayer.engine42 ? skinPlayer.engine42.draw() : window.dispatchEvent(new Event('resize')));
    assert.deepEqual(await page.evaluate(() => skinPlayer.fit), info.fit, 'Resizing must preserve the scene coordinates');
    await page.screenshot({ path: `output/dynamic-proportions/${entry.id}-portrait.png` });
    assert.deepEqual(errors, []);
    report.push({ id: entry.id, character: entry.character, title: entry.title, type: entry.type, ...info });
    await page.close();
  }
} finally {
  await fs.writeFile('output/dynamic-proportions/report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log('PASS composition', report.map(r => `${r.character}/${r.title} (${r.type})`).join(', '));
