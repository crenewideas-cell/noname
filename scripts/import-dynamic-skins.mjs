import fs from 'node:fs/promises';
import { existsSync, readFileSync, openSync, readSync, closeSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { indexDynamicSkins } from './index-dynamic-skins.mjs';
import { ensureDynamicVendors } from './publish-dynamic-runtime.mjs';

const project = path.resolve(import.meta.dirname, '..');
const source = path.resolve(process.argv[2] || path.join(project, 'temp/动态皮包'));
const destination = path.join(project, 'apps/core/extension/imports/本地动态皮肤包');
const report = { packs: [], repairs: [], unresolved: [], missingLayers: [] };
const digest = value => createHash('sha256').update(value).digest('hex').slice(0, 16);
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJSON = (file, data) => fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
const normalize = value => value.normalize('NFC').toLowerCase().replaceAll('\\', '/');

async function copyDirectory(from, to) {
  await fs.mkdir(to, { recursive: true });
  if (process.platform !== 'win32') return fs.cp(from, to, { recursive: true });
  // No /MIR: importing never deletes an existing local pack or source file.
  const code = await new Promise((resolve, reject) => {
    const child = spawn('robocopy', [from, to, '/E', '/MT:8', '/R:1', '/W:1', '/NFL', '/NDL', '/NJH', '/NJS', '/NP'], { windowsHide: true, stdio: 'ignore' });
    child.once('error', reject); child.once('exit', resolve);
  });
  if (code >= 8) throw Error('复制失败：' + from + ' (robocopy ' + code + ')');
}

export function readLegacyDefinitions(text) {
  const decadeUI = { get: { extend: Object.assign } };
  vm.runInNewContext(text, { decadeUI, decadeModule: { import: fn => fn({}, {}, {}, {}, {}, {}) } }, { timeout: 10000 });
  return decadeUI.dynamicSkin;
}

async function convertLegacy(root, name) {
  const defs = readLegacyDefinitions(await fs.readFile(path.join(root, 'dynamicSkin.js'), 'utf8'));
  const assetRoot = path.join(root, 'assets/dynamic');
  const files = (await fs.readdir(assetRoot, { recursive: true })).map(f => f.replaceAll('\\', '/'));
  const skeletons = files.filter(f => /\.(skel|json)$/i.test(f) && existsSync(path.join(assetRoot, f.replace(/\.(skel|json)$/i, '.atlas'))));
  const exact = new Map(skeletons.map(f => [normalize(f), f]));
  const byDirectory = new Map();
  const versions = new Map();
  for (const file of skeletons) {
    const dir = normalize(path.posix.dirname(file));
    if (!byDirectory.has(dir)) byDirectory.set(dir, []);
    byDirectory.get(dir).push(file);
  }
  function resolveLayer(definition, primary = false) {
    if (!definition?.name) return null;
    const requested = definition.name.replaceAll('\\', '/');
    let file = exact.get(normalize(requested + (definition.json ? '.json' : '.skel'))) ||
      exact.get(normalize(requested + '.json')) || exact.get(normalize(requested + '.skel'));
    if (!file && primary) {
      const corrections = { '蔡文姬/傅佥/XingXiang': '傅佥/XingXiang', '关银屏/巾帼花武/skin_Decennial_GuanYinPing_JinGuoHuaWu': '关银屏/巾帼花武/daiji2', '黄盖/炙索击艟/daiji2': '黄盖/炙索击艟/daiji', '_果包/孙尚香/战场荣耀/daiji2': '孙尚香/战场荣耀/daiji2', '果包/张嫙/双姝绰约/daiji2': '张嫙/双姝绰约/daiji2', '张嫙/落榜张嫙骨骼/zhangxuan': '张嫙/落榜骨骼/zhangxuan', '赵云-真龙之意/xingxiang': 'sp赵云/真龙之意/xingxiang' };
      const corrected = corrections[requested];
      if (corrected) file = exact.get(normalize(corrected + '.skel')) || exact.get(normalize(corrected + '.json'));
    }
    if (!file && primary) {
      const candidates = (byDirectory.get(normalize(path.posix.dirname(requested))) || [])
        .filter(f => !/(beijing|background|bg|chuchang|gongji|jineng|shouji|zhishixian|effect)/i.test(path.posix.basename(f)));
      if (candidates.length === 1) file = candidates[0];
    }
    if (!file) return null;
    if (normalize(file.replace(/\.(skel|json)$/i, '')) !== normalize(requested)) report.repairs.push({ requested, resolved: file });
    if (!versions.has(file)) {
      let version;
      if (file.endsWith('.json')) version = JSON.parse(readFileSync(path.join(assetRoot, file))).skeleton?.spine;
      else { const fd = openSync(path.join(assetRoot, file), 'r'), header = Buffer.alloc(100); try { readSync(fd, header, 0, 100, 0); version = header.toString('latin1').match(/[34]\.[0-9]+\.[0-9]+/)?.[0]; } finally { closeSync(fd); } }
      versions.set(file, version);
    }
    const version = versions.get(file);
    return { skeleton: 'assets/dynamic/' + file, atlas: 'assets/dynamic/' + file.replace(/\.(skel|json)$/i, '.atlas'), version,
      animation: Array.isArray(definition.action) ? definition.action[0] : definition.action,
      legacy: definition };
  }
  const entries = new Map();
  for (const [characterId, skins] of Object.entries(defs)) for (const [title, definition] of Object.entries(skins)) {
    const primary = resolveLayer(definition, true);
    if (!primary) {
      report.unresolved.push({ pack: name, characterId, title, source: definition.name });
      const key = 'unavailable:' + definition.name + '\0' + title;
      if (entries.has(key)) entries.get(key).characterIds.push(characterId);
      else entries.set(key, { id: 'base_' + digest(key), type: 'spine', title, character: characterId,
        characterIds: [characterId], models: [], available: false, unavailableReason: '源包缺少主模型或图集：' + definition.name,
        thumbnail: 'previews/base_' + digest(key) + '.svg' });
      continue;
    }
    const key = primary.skeleton + '\0' + title;
    if (entries.has(key)) { entries.get(key).characterIds.push(characterId); continue; }
    const background = resolveLayer(definition.beijing);
    if (definition.beijing?.name && !background) report.missingLayers.push({ characterId, title, layer: definition.beijing.name });
    const models = [background, primary].filter(Boolean);
    const id = 'base_' + digest(key);
    const character = definition.name.split('/').filter(Boolean).slice(-3, -2)[0] || characterId;
    const oldBinary = model => !model.skeleton.endsWith('.json') && /^3\.[67]\./.test(model.version || '');
    const type = primary.version?.startsWith('4.2') ? 'spine42' : models.every(oldBinary) ? 'spine36' : 'spine';
    entries.set(key, { id, type, character, title, characterIds: [characterId],
      group: 'base_' + characterId, models, idle: primary.animation, motions: [],
      thumbnail: 'previews/' + id + '.svg', legacy: definition });
  }
  // Keep assets lacking a definition available as unbound skins. One entry per
  // unconfigured directory, avoiding background/action layers as separate skins.
  const represented = new Set([...entries.values()].filter(e => e.models.length).map(e => normalize(path.posix.dirname(e.models.at(-1).skeleton).replace('assets/dynamic/', ''))));
  for (const [dir, candidates] of byDirectory) {
    if (represented.has(dir)) continue;
    const primary = candidates.filter(f => !/(beijing|background|bg|chuchang|gongji|jineng|shouji|zhishixian|effect)/i.test(path.posix.basename(f)));
    if (!primary.length) continue;
    const file = primary.find(f => /^(daiji2?|xingxiang|idle)\./i.test(path.posix.basename(f))) || primary[0];
    const model = resolveLayer({ name: file.replace(/\.(skel|json)$/i, ''), json: file.endsWith('.json') });
    const id = 'base_' + digest(file), parts = path.posix.dirname(file).split('/');
    const type = model.version?.startsWith('4.2') ? 'spine42' : !file.endsWith('.json') && /^3\.[67]\./.test(model.version || '') ? 'spine36' : 'spine';
    entries.set(file, { id, type, character: parts.at(-2) || '未绑定', title: parts.at(-1), characterIds: [],
      models: [model], motions: [], thumbnail: 'previews/' + id + '.svg', group: id });
  }
  await fs.mkdir(path.join(root, 'previews'), { recursive: true });
  const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  for (const entry of entries.values()) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="#233340"/><text x="150" y="160" text-anchor="middle" fill="#eee" font-size="28">${escape(entry.character)}</text><text x="150" y="220" text-anchor="middle" fill="#ccc" font-size="16">${escape(entry.title)}</text><text x="150" y="290" text-anchor="middle" fill="#9ba" font-size="18">动态皮肤</text></svg>`;
    if (!existsSync(path.join(root, entry.thumbnail))) await fs.writeFile(path.join(root, entry.thumbnail), svg);
  }
  return { name, version: 1, entries: [...entries.values()] };
}

async function main() {
  await fs.mkdir(destination, { recursive: true });
  const names = (await fs.readdir(source, { withFileTypes: true })).filter(e => e.isDirectory() &&
    (existsSync(path.join(source, e.name, 'catalog.json')) || existsSync(path.join(source, e.name, 'dynamicSkin.js')))).map(e => e.name);
  if (!names.length) throw Error('没有可导入的 catalog.json 或 dynamicSkin.js');
  await ensureDynamicVendors(names.map(n => path.join(source,n,'runtime/vendor')));
  let manifest = await json(path.join(destination, 'manifest.json')).catch(() => ({ version: 1, packs: [] }));
  for (const name of names) {
    const root = path.join(destination, name), from = path.join(source, name);
    console.log('导入', name);
    if (!process.argv.includes('--refresh')) {
      await fs.mkdir(root,{recursive:true});
      // Pack runtime directories are historical code, never pack data.
      for(const item of await fs.readdir(from,{withFileTypes:true})) {
        if(/^runtime(?:-|$)/.test(item.name))continue;
        const src=path.join(from,item.name),dest=path.join(root,item.name);
        if(item.isDirectory())await copyDirectory(src,dest);else await fs.copyFile(src,dest);
      }
    }
    let catalog;
    if (existsSync(path.join(from, 'catalog.json'))) {
      catalog = await json(path.join(from, 'catalog.json'));
      // Only the 名将杀 namespace is eligible for this game's same-named heroes.
      const mjs = { '卢莫愁': 'mjs_lumochou', '虞姬': 'mjs_yuji', '貂蝉': 'mjs_diaochan', '曹操': 'mjs_caocao', '韩娥': 'mjs_hane' };
      for (const e of catalog.entries) e.characterIds = e.characterIds || (e.characterId ? [e.characterId] : name === '名将杀扩展' && mjs[e.character] ? [mjs[e.character]] : []);
    } else catalog = await convertLegacy(root, name);
    // Preserve incomplete source entries for repair, but never offer them as
    // working skins. Atlas page names follow a blank line; regions may end .png too.
    const validation = await json(path.join(root, 'model-validation.json')).catch(() => ({ failures: [] }));
    const failures = new Map();
    for (const failure of validation.failures) {
      if (!failure.atlas || !existsSync(path.join(root, failure.file)) || !existsSync(path.join(root, failure.atlas))) continue;
      const fingerprint = createHash('sha256').update(await fs.readFile(path.join(root, failure.file))).update(await fs.readFile(path.join(root, failure.atlas))).digest('hex');
      if (fingerprint === failure.fingerprint) failures.set(failure.file, failure.error.split('\n')[0]);
    }
    for (const entry of catalog.entries) for (const model of entry.models || []) {
      if (failures.has(model.skeleton)) { entry.available = false; entry.unavailableReason = '模型与图集不配套或边界无效：' + model.skeleton + ' — ' + failures.get(model.skeleton); }
      if (!existsSync(path.join(root, model.atlas))) {
        entry.available = false; entry.unavailableReason = '源包缺少图集：' + model.atlas; continue;
      }
      const lines = (await fs.readFile(path.join(root, model.atlas), 'utf8')).split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) if (lines[i].trim() && (i === 0 || !lines[i - 1].trim()) && /\.(png|jpe?g|webp)$/i.test(lines[i].trim())) {
        const file = path.posix.join(path.posix.dirname(model.atlas), lines[i].trim());
        if (!existsSync(path.join(root, file))) { entry.available = false; entry.unavailableReason = '源包缺少贴图：' + file; }
      }
    }
    // Preserve additive media imports without changing owners or scene data.
    const supplements = await json(path.join(root, 'resource-supplements.json')).catch(error => {
      if (error.code === 'ENOENT') return {};
      throw error;
    });
    for (const entry of catalog.entries) for (const key of ['thumbnail', 'voiceFile']) {
      const value = supplements[entry.id]?.[key];
      if (typeof value !== 'string') continue;
      const relative = path.relative(root, path.resolve(root, value));
      if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || !existsSync(path.join(root, relative))) throw Error('无效补充资源：' + value);
      entry[key] = value;
    }
    await writeJSON(path.join(root, 'catalog.json'), catalog);
    const row = { name, entries: catalog.entries.length, available: catalog.entries.filter(e => e.available !== false).length,
      bound: catalog.entries.filter(e => e.characterIds.length && e.available !== false).length,
      unbound: catalog.entries.filter(e => !e.characterIds.length && e.available !== false).length,
      unavailable: catalog.entries.filter(e => e.available === false).map(e => ({ id: e.id, title: e.title, reason: e.unavailableReason })) };
    report.packs.push(row);
    manifest.packs = [...manifest.packs.filter(p => p.name !== name), row];
    console.log('已导入', JSON.stringify({ ...row, unavailable: row.unavailable.length }));
  }
  await writeJSON(path.join(destination, 'manifest.json'), manifest);
  await indexDynamicSkins(destination);
  await writeJSON(path.join(destination, 'import-report.json'), report);
  const lines = ['# 本地动态皮肤导入清单', '', '| 包 | 目录项 | 可用 | 已绑定 | 游离 | 待修复 |', '| --- | ---: | ---: | ---: | ---: | ---: |',
    ...manifest.packs.map(p => `| ${p.name} | ${p.entries} | ${p.available} | ${p.bound} | ${p.unbound} | ${p.unavailable.length} |`), '',
    '共享别名合并为一个目录项，保留全部 characterIds。游离条目不出现在任何武将的皮肤列表中。', '',
    '## 待修复条目（保留素材，暂不提供选择）', '',
    ...manifest.packs.flatMap(p => p.unavailable.map(e => `- ${p.name} / ${e.title}：${e.reason}`)), '',
    '## 源包缺少的可选背景层（主模型仍可播放）', '',
    ...report.missingLayers.map(e => `- ${e.characterId} / ${e.title}：${e.layer}`), ''];
  await fs.writeFile(path.join(destination, '导入清单.md'), lines.join('\n'));
  console.log('完成；未解析配置', report.unresolved.length, '缺少背景层', report.missingLayers.length);
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) await main();
