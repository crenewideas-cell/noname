import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spine } from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';
import { createLegacyParser, usesSpine36 } from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';
const option = (name, fallback) => { const i = process.argv.indexOf(name); return i < 0 ? fallback : process.argv[i + 1]; };
const installedRoot = path.resolve('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展');
const root = path.resolve(option('--root', installedRoot));
const output = path.resolve(option('--out', 'output/dynamic-import/models.json'));
if (process.argv.includes('--quarantine')) {
  const formal = await fs.realpath(path.dirname(installedRoot)), resolved = await fs.realpath(root);
  const relative = path.relative(formal, resolved);
  if (!relative || (!relative.startsWith('..'+path.sep) && relative !== '..' && !path.isAbsolute(relative))) throw Error('正式安装不能由诊断结果直接隔离。请使用 --root 指定已冻结的候选目录并先复核失败证据。');
}
const catalog = JSON.parse(await fs.readFile(root + '/catalog.json'));
let models = [...new Map(catalog.entries.flatMap(e => e.models || []).map(m => [m.skeleton + '\0' + m.atlas, m])).values()];
const totalModels = models.length;
if (process.argv.includes('--unavailable-only')) {
  const affected = new Set(catalog.entries.filter(e => e.available === false).flatMap(e => e.models || []).map(m => m.skeleton + '\0' + m.atlas));
  models = models.filter(m => affected.has(m.skeleton + '\0' + m.atlas));
}
if (process.argv.includes('--retry')) {
  const previous = JSON.parse(await fs.readFile(output));
  models = models.filter(m => previous.failures.some(f => f.file === m.skeleton));
}
const report = { totalModels, expected: models.length, checked: 0, includesUnavailable: true, catalogEntries: catalog.entries.length, unavailableEntries: catalog.entries.filter(e => e.available === false).map(e => ({ id:e.id, models:e.models || [], reason:e.unavailableReason })), retry: process.argv.includes('--retry'), failures: [], versions: {}, results: [] };
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright'); } catch { playwright = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  let page;
  const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
  async function resetParserPage(){
   await page?.close().catch(()=>{});page=await browser.newPage();
   await page.route('**/model-audit.html',route=>route.fulfill({body:'<!doctype html><html><body></body></html>',contentType:'text/html'}));
   await page.goto(origin+'/model-audit.html');
   for(const file of ['pixi.min.js','pixi-spine.js','spine-webgl.min.js'])await page.addScriptTag({url:origin+'/extension/本地动态皮肤包/名将杀扩展/runtime/vendor/'+file});
  }
  await resetParserPage();
  for (const m of models) {
    if(report.checked&&report.checked%100===0)await resetParserPage();
    const resultRow = { file:m.skeleton, atlas:m.atlas, declaredVersion:m.version, status:'pending' };
    try {
      const [buffer, atlasText] = await Promise.all([fs.readFile(path.join(root, m.skeleton)), fs.readFile(path.join(root, m.atlas), 'utf8')]);
      const isJSON = m.skeleton.toLowerCase().endsWith('.json');
      const actualVersion = isJSON ? JSON.parse(buffer).skeleton?.spine : buffer.subarray(0,128).toString('latin1').match(/[234]\.\d+\.\d+/)?.[0];
      if (!actualVersion) throw Error('未知骨骼版本，不套用默认读取器');
      resultRow.actualVersion = actualVersion;
      resultRow.fingerprint = createHash('sha256').update(buffer).update(atlasText).digest('hex');
      const actualModel = { ...m, version: actualVersion };
      if (usesSpine36(actualModel)) {
        resultRow.parser = 'createLegacyParser';
        const texture = { setFilters() {}, setWraps() {}, getImage() { return { width: 4096, height: 4096 }; } };
        const atlas = new spine.TextureAtlas(atlasText, () => texture);
        const parser = createLegacyParser(spine, atlas, actualModel);
        const data = parser.readSkeletonData(Uint8Array.from(buffer));
        resultRow.skinTableFormat = parser.skinTableFormat;
        resultRow.animations = data.animations.map(a => ({ name:a.name, duration:a.duration }));
        const skeleton = new spine.Skeleton(data), state = new spine.AnimationState(new spine.AnimationStateData(data));
        const idle = data.animations.find(a => a.name === m.animation) || data.animations.find(a => /^(idle|normal|daiji|play)$/i.test(a.name)) || data.animations[0];
        if (idle) { state.setAnimation(0, idle.name, true); state.update(1 / 30); state.apply(skeleton); }
        skeleton.updateWorldTransform();
        const offset = new spine.Vector2(), size = new spine.Vector2(); skeleton.getBounds(offset, size, []);
        if (![offset.x, offset.y, size.x, size.y].every(Number.isFinite)) throw Error('Invalid model bounds');
      } else {
        resultRow.parser = actualVersion.startsWith('4.2.') ? 'spine42' : 'pixi-spine';
        const assetURL=new URL(origin);assetURL.pathname='/@fs/'+path.join(root,m.skeleton).replaceAll(String.fromCharCode(92),'/');
        const result = await page.evaluate(async ({ m, address, atlasText }) => {
          try {
            const response=await fetch(address);if(!response.ok)throw Error('Audit transport HTTP '+response.status);
            const buffer = new Uint8Array(await response.arrayBuffer());
            if (m.version?.startsWith('4.2')) {
              const atlas = new spine.TextureAtlas(atlasText);
              const reader = m.skeleton.endsWith('.json') ? new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas)) : new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas));
              reader.readSkeletonData(m.skeleton.endsWith('.json') ? JSON.parse(new TextDecoder().decode(buffer)) : buffer);
            } else {
              const atlas = new PIXI.spine.TextureAtlas(atlasText, (name, done) => done(new PIXI.BaseTexture(null, { width: 32768, height: 32768 })));
              const parser = new PIXI.spine.SpineParser();
              const data = m.skeleton.endsWith('.json') ? parser.createJsonParser().readSkeletonData(atlas, JSON.parse(new TextDecoder().decode(buffer))) : parser.createBinaryParser().readSkeletonData(atlas, buffer);
              if (!data.bones.length) throw Error('No bones');
              atlas.dispose();
            }
            return null;
          } catch (e) { return String(e.stack || e); }
        }, { m:actualModel, address:assetURL.href, atlasText });
        if (result) throw Error(result);
      }
      resultRow.status = 'parsed';
    } catch (e) {
      if (/ReferenceError: (PIXI|spine) is not defined|Execution context was destroyed|Target page, context or browser has been closed|Page crashed/.test(e.message)) {report.infrastructureError=e.message;throw e;}
      resultRow.status = 'failed'; resultRow.error = e.message;
      report.failures.push({ file: m.skeleton, atlas: m.atlas, version: resultRow.actualVersion || m.version, fingerprint:resultRow.fingerprint || null, error: e.message });
    }
    report.results.push(resultRow);
    report.checked++;
    const version=resultRow.actualVersion||m.version||'unknown';report.versions[version] = (report.versions[version] || 0) + 1;
    if (report.checked % 250 === 0) console.log('模型解析', report.checked, '/', models.length, '失败', report.failures.length);
  }
} finally {
  await browser.close();
  await fs.mkdir(path.dirname(output), { recursive:true });
  await fs.writeFile(output + '.tmp', JSON.stringify(report, null, 2));
  await fs.rename(output + '.tmp', output);
}
console.log('模型解析完成', report.checked, '失败', report.failures.length);
if (process.argv.includes('--quarantine')) {
  const previous = JSON.parse(await fs.readFile(root + '/model-validation.json').catch(() => '{"failures":[]}'));
  const tested = new Set(models.map(m => m.skeleton));
  const validation = { ...report, failures: [...previous.failures.filter(f => !tested.has(f.file)), ...report.failures] };
  await fs.writeFile(root + '/model-validation.json', JSON.stringify(validation, null, 2));
}
else if (report.failures.length) process.exitCode = 1;
