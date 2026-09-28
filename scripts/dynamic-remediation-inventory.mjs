import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { readLegacyDefinitions } from './import-dynamic-skins.mjs';

const project = path.resolve(import.meta.dirname, '..');
const run = path.resolve(process.argv[2] || 'output/dynamic-remediation/20260926-r01');
const installed = 'apps/core/extension/imports/本地动态皮肤包', source = 'temp/动态皮包';
const hash = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const exists = async p => fs.access(p).then(() => true, () => false);
const write = async (name, value) => { const p = path.join(run, name); await fs.writeFile(p + '.tmp', JSON.stringify(value, null, 2)); await fs.rename(p + '.tmp', p); };
await fs.mkdir(run, { recursive: true });
const frozen = new Map();
const frozenComplete = await exists(path.join(run, 'freeze-complete.json'));
if (frozenComplete) for await (const line of createInterface({ input: createReadStream(path.join(run, 'baseline-files.jsonl')), crlfDelay: Infinity })) {
  const f = JSON.parse(line); frozen.set(f.path, f);
}
const identities = new Map(), modelFacts = new Map(), fields = new Map(), rawFields = new Map();
async function identity(p) {
  p = p.replaceAll('\\', '/');
  if (identities.has(p)) return identities.get(p);
  let result;
  try {
    const s = await fs.stat(p), baseline = frozen.get(p);
    result = { path: p, bytes: s.size, status: s.size ? 'present' : 'empty', sha256: baseline?.sha256 || null,
      frozenMetadataMatches: baseline ? baseline.bytes === s.size && baseline.mtimeMs === s.mtimeMs : null };
    if (!baseline && /\.(js|json|atlas|skel)$/i.test(p)) result.sha256 = hash(await fs.readFile(p));
  } catch (e) { if (e.code !== 'ENOENT') throw e; result = { path: p, status: 'missing', sha256: null }; }
  identities.set(p, result); return result;
}
function scanFields(value, prefix, map, owner) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  for (const [key, v] of Object.entries(value)) {
    const field = prefix ? prefix + '.' + key : key, type = v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v;
    const row = map.get(field) || { field, occurrences: 0, types: {}, zero: 0, null: 0, emptyArray: 0, entries: new Set(), status: 'pending-semantic-review' };
    row.occurrences++; row.types[type] = (row.types[type] || 0) + 1;
    row.zero += Number(v === 0); row.null += Number(v === null); row.emptyArray += Number(Array.isArray(v) && !v.length); row.entries.add(owner);
    map.set(field, row); if (type === 'object') scanFields(v, field, map, owner);
  }
}
function atlasPages(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/), names = [];
  for (let i = 0; i < lines.length; i++) if (lines[i].trim() && (i === 0 || !lines[i - 1].trim())) names.push(lines[i].trim());
  return names;
}
async function modelFact(root, model) {
  const key = root + '/' + model.skeleton + '\0' + model.atlas;
  if (modelFacts.has(key)) return modelFacts.get(key);
  const skeleton = await identity(root + '/' + model.skeleton), atlas = model.atlas ? await identity(root + '/' + model.atlas) : { status: 'missing-reference' };
  let version = null, animations = null, pages = [], error = null;
  try {
    if (skeleton.status === 'present') {
      if (/\.json$/i.test(model.skeleton)) { const data = await read(skeleton.path); version = data.skeleton?.spine || null; animations = Object.keys(data.animations || {}); }
      else { const fd = await fs.open(skeleton.path); try { const b = Buffer.alloc(128); await fd.read(b, 0, b.length, 0); version = b.toString('latin1').match(/(?:^|[^0-9])([234]\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9]+)?)/)?.[1] || null; } finally { await fd.close(); } }
    }
    if (atlas.status === 'present') pages = await Promise.all(atlasPages(await fs.readFile(atlas.path, 'utf8')).map(p => identity(root + '/' + path.posix.join(path.posix.dirname(model.atlas), p))));
  } catch (e) { error = String(e); }
  const json = /\.json$/i.test(model.skeleton);
  const expectedRoute = !json && /^3\.[67]\./.test(version || '') ? 'legacy-3.6-family (3.7 dialect pending)' : /^4\.2\./.test(version || '') ? 'spine-4.2' : /^(3\.[5678]|4\.[01])\./.test(version || '') ? 'pixi-spine (exact capability pending)' : 'unknown';
  const result = { skeleton, atlas, pages, version, metadataVersion: model.version ?? null, versionMismatch: !!model.version && model.version !== version, format: json ? 'json' : 'binary', expectedRoute, animations, error };
  modelFacts.set(key, result); return result;
}
const manifest = await read(installed + '/manifest.json'), inventory = [], packs = [], sourceDefinitions = [];
for (const pack of manifest.packs) {
  const dest = installed + '/' + pack.name, src = source + '/' + pack.name;
  const catalog = await read(dest + '/catalog.json');
  const srcCatalog = await exists(src + '/catalog.json') ? await read(src + '/catalog.json') : null;
  const definitions = !srcCatalog ? readLegacyDefinitions(await fs.readFile(src + '/dynamicSkin.js', 'utf8')) : null;
  const sourceConfig = await identity(src + '/' + (srcCatalog ? 'catalog.json' : 'dynamicSkin.js'));
  if (definitions) for (const [owner, skins] of Object.entries(definitions)) for (const [title, config] of Object.entries(skins)) {
    sourceDefinitions.push({ pack: pack.name, owner, title, config, configHash: hash(config) });
    scanFields(config, '', rawFields, owner + '/' + title);
  }
  for (const entry of catalog.entries) {
    const key = pack.name + '/' + entry.id;
    const originals = srcCatalog ? srcCatalog.entries.filter(e => e.id === entry.id) : (entry.characterIds || []).flatMap(owner => definitions[owner]?.[entry.title] ? [{ owner, title: entry.title, config: definitions[owner][entry.title] }] : []);
    const effectivePath = dest + '/entries/' + entry.id + '.json';
    const effective = await exists(effectivePath) ? await read(effectivePath) : null;
    const sourceModels = [];
    if (srcCatalog) sourceModels.push(...(originals[0]?.models || []));
    else for (const { config } of originals.slice(0, 1)) for (const [role, c] of [['background', config.beijing], ['primary', config]]) {
      if (!c?.name) continue;
      const prefix = 'assets/dynamic/' + c.name.replaceAll('\\', '/');
      const desired = prefix + (c.json ? '.json' : '.skel');
      // Exact source references only: no importer correction, model substitution or background inference.
      sourceModels.push({ skeleton: desired, atlas: prefix + '.atlas', animation: c.action, role, legacy: c });
    }
    const sourceModelFacts = await Promise.all(sourceModels.map(m => modelFact(src, m)));
    const catalogModelFacts = await Promise.all((entry.models || []).map(m => modelFact(dest, m)));
    const effectiveModelFacts = await Promise.all((effective?.models || []).map(m => modelFact(dest, m)));
    const dependencies = [];
    for (const [root, data, stage] of [[dest, entry, 'catalog'], [src, srcCatalog ? originals[0] : null, 'source']]) {
      if (!data) continue;
      for (const file of [data.thumbnail, data.staticBackground, data.voiceFile].filter(v => typeof v === 'string')) dependencies.push({ stage, ...await identity(root + '/' + file) });
      if (data.voiceFile) { try { for (const voice of await read(root + '/' + data.voiceFile)) if (voice.file) dependencies.push({ stage, ...await identity(root + '/' + voice.file) }); } catch (e) { dependencies.push({ stage, status: 'read-error', path: data.voiceFile, error: String(e) }); } }
      if (data.model) {
        dependencies.push({ stage, ...await identity(root + '/' + data.model) });
        try {
          const model = await read(root + '/' + data.model), f = model.FileReferences;
          const refs = [f?.Moc, f?.Physics, f?.Pose, f?.DisplayInfo, ...(f?.Textures || []), ...Object.values(f?.Motions || {}).flat().flatMap(m => [m.File, m.Sound]), ...(f?.Expressions || []).map(e => e.File)].filter(Boolean);
          for (const ref of refs) dependencies.push({ stage, ...await identity(root + '/' + path.posix.join(path.posix.dirname(data.model), ref)) });
        } catch (e) { dependencies.push({ stage, status: 'read-error', path: data.model, error: String(e) }); }
      }
    }
    scanFields(srcCatalog ? originals[0] : originals[0]?.config || {}, '', fields, key);
    const issues = [];
    if (!originals.length) issues.push('no-explicit-source-config (unbound asset entries require separate provenance)');
    if (originals.length > 1 && new Set(originals.map(o => hash(o.config || o))).size > 1) issues.push('merged-owner-configs-differ');
    if (entry.available !== false && !effective) issues.push('missing-effective-entry');
    const missing = [...sourceModelFacts, ...catalogModelFacts, ...effectiveModelFacts].flatMap(m => [m.skeleton, m.atlas, ...m.pages]).concat(dependencies).filter(f => f.status !== 'present');
    if (missing.length) issues.push('missing-or-invalid-dependencies');
    if (catalogModelFacts.some(m => m.versionMismatch)) issues.push('catalog-version-mismatch');
    inventory.push({ pack: pack.name, id: entry.id, title: entry.title, characterIds: entry.characterIds || [], catalogAvailable: entry.available !== false,
      priorUnavailableReason: entry.unavailableReason || null, sourceConfig, sourceConfigs: originals, sourceConfigHash: hash(originals), sourceModels, sourceModelFacts,
      catalog: entry, catalogConfigHash: hash(entry), catalogModelFacts, effective, effectiveConfigHash: effective ? hash(effective) : null, effectiveModelFacts, dependencies,
      classification: { source: srcCatalog ? 'catalog' : 'legacy-dynamicSkin', type: entry.type, versions: [...new Set(catalogModelFacts.map(m => m.version))], layerCount: entry.models?.length || 0,
        mixedVersions: new Set(catalogModelFacts.map(m => m.version?.split('.').slice(0, 2).join('.'))).size > 1, bound: !!entry.characterIds?.length },
      issues, missing, acceptance: 'pending', visualReview: 'pending' });
  }
  packs.push({ name: pack.name, count: catalog.entries.length, unavailable: catalog.entries.filter(e => e.available === false).length, declaredCount: pack.entries });
  console.log(JSON.stringify(packs.at(-1)));
}
const keys = inventory.map(e => e.pack + '/' + e.id), counts = {};
for (const row of inventory) { const c = JSON.stringify(row.classification); counts[c] = (counts[c] || 0) + 1; }
const summary = { generatedAt: new Date().toISOString(), frozenComplete, total: inventory.length, expected: 4934, delta: inventory.length - 4934,
  duplicateIds: keys.length - new Set(keys).size, packs, unavailable: inventory.filter(e => !e.catalogAvailable).length,
  entriesWithMissingDependencies: inventory.filter(e => e.missing.length).length, entriesWithIssues: inventory.filter(e => e.issues.length).length,
  resources: identities.size, resourcesWithoutHash: [...identities.values()].filter(f => f.status === 'present' && !f.sha256).length,
  passed: 0, failed: 0, blocked: 0, pending: inventory.length, note: 'Inventory presence and directory availability are not acceptance.' };
await write('inventory.json', { summary, entries: inventory });
await write('resources.json', [...identities.values()]);
await write('classifications.json', counts);
await write('source-definitions.json', sourceDefinitions);
await write('field-coverage.json', { fields: [...fields.values()].map(f => ({ ...f, entries: [...f.entries] })), legacySourceFields: [...rawFields.values()].map(f => ({ ...f, entries: [...f.entries] })) });
await write('unavailable.json', inventory.filter(e => !e.catalogAvailable));
await write('inventory-summary.json', summary);
console.log(JSON.stringify(summary));
if (summary.delta || summary.duplicateIds) process.exitCode = 1;
