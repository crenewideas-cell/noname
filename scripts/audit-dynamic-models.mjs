import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spine } from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';
const root = 'apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展';
const catalog = JSON.parse(await fs.readFile(root + '/catalog.json'));
let models = [...new Map(catalog.entries.filter(e => e.available !== false).flatMap(e => e.models).map(m => [m.skeleton, m])).values()];
const totalModels = models.length;
if (process.argv.includes('--retry')) {
  const previous = JSON.parse(await fs.readFile('output/dynamic-import/models.json'));
  models = models.filter(m => previous.failures.some(f => f.file === m.skeleton));
}
const report = { totalModels, checked: 0, retry: process.argv.includes('--retry'), failures: [], versions: {} };
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const browser = await playwright.chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  const page = await browser.newPage();
  await page.route('**/@vite/client', route => route.fulfill({ body: '', contentType: 'application/javascript' }));
  const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
  await page.goto(origin + '/noname/skin/localDynamic/runtime/player.html');
  await page.addScriptTag({ url: origin + '/extension/本地动态皮肤包/名将杀扩展/runtime/vendor/pixi.min.js' });
  await page.addScriptTag({ url: origin + '/extension/本地动态皮肤包/名将杀扩展/runtime/vendor/pixi-spine.js' });
  await page.addScriptTag({ url: origin + '/extension/本地动态皮肤包/名将杀扩展/runtime/vendor/spine-webgl.min.js' });
  for (const m of models) {
    try {
      const [buffer, atlasText] = await Promise.all([fs.readFile(path.join(root, m.skeleton)), fs.readFile(path.join(root, m.atlas), 'utf8')]);
      if (!m.skeleton.endsWith('.json') && parseFloat(m.version) < 3.8) {
        const texture = { setFilters() {}, setWraps() {}, getImage() { return { width: 4096, height: 4096 }; } };
        const atlas = new spine.TextureAtlas(atlasText, () => texture);
        const data = new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(Uint8Array.from(buffer));
        const skeleton = new spine.Skeleton(data), state = new spine.AnimationState(new spine.AnimationStateData(data));
        const idle = data.animations.find(a => a.name === m.animation) || data.animations.find(a => /^(idle|normal|daiji|play)$/i.test(a.name)) || data.animations[0];
        if (idle) { state.setAnimation(0, idle.name, true); state.update(1 / 30); state.apply(skeleton); }
        skeleton.updateWorldTransform();
        const offset = new spine.Vector2(), size = new spine.Vector2(); skeleton.getBounds(offset, size, []);
        if (![offset.x, offset.y, size.x, size.y].every(Number.isFinite)) throw Error('Invalid model bounds');
      } else {
        const result = await page.evaluate(({ m, data, atlasText }) => {
          try {
            const buffer = Uint8Array.from(atob(data), c => c.charCodeAt(0));
            if (m.version?.startsWith('4.2')) {
              const atlas = new spine.TextureAtlas(atlasText);
              new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(buffer);
            } else {
              const atlas = new PIXI.spine.TextureAtlas(atlasText, (name, done) => done(new PIXI.BaseTexture(null, { width: 32768, height: 32768 })));
              const parser = new PIXI.spine.SpineParser();
              const data = m.skeleton.endsWith('.json') ? parser.createJsonParser().readSkeletonData(atlas, JSON.parse(new TextDecoder().decode(buffer))) : parser.createBinaryParser().readSkeletonData(atlas, buffer);
              if (!data.bones.length) throw Error('No bones');
              atlas.dispose();
            }
            return null;
          } catch (e) { return String(e.stack || e); }
        }, { m, data: buffer.toString('base64'), atlasText });
        if (result) throw Error(result);
      }
    } catch (e) {
      if (/ReferenceError: (PIXI|spine) is not defined|Execution context was destroyed/.test(e.message)) throw e;
      const fingerprint = createHash('sha256').update(await fs.readFile(path.join(root, m.skeleton))).update(await fs.readFile(path.join(root, m.atlas))).digest('hex');
      report.failures.push({ file: m.skeleton, atlas: m.atlas, version: m.version, fingerprint, error: e.message });
    }
    report.checked++;
    report.versions[m.version] = (report.versions[m.version] || 0) + 1;
    if (report.checked % 250 === 0) console.log('模型解析', report.checked, '/', models.length, '失败', report.failures.length);
  }
} finally {
  await browser.close();
  await fs.writeFile('output/dynamic-import/models.json', JSON.stringify(report, null, 2));
}
console.log('模型解析完成', report.checked, '失败', report.failures.length);
if (process.argv.includes('--quarantine')) {
  const previous = JSON.parse(await fs.readFile(root + '/model-validation.json').catch(() => '{"failures":[]}'));
  const tested = new Set(models.map(m => m.skeleton));
  const validation = { ...report, failures: [...previous.failures.filter(f => !tested.has(f.file)), ...report.failures] };
  await fs.writeFile(root + '/model-validation.json', JSON.stringify(validation, null, 2));
}
else if (report.failures.length) process.exitCode = 1;
