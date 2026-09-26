import fs from 'node:fs/promises';
import path from 'node:path';
const root = 'apps/core/extension/imports/本地动态皮肤包';
const manifest = JSON.parse(await fs.readFile(root + '/manifest.json'));
const reports = [];
for (const p of manifest.packs) {
  const dir = path.join(root, p.name), refs = new Set(), missing = [], errors = [];
  const read = async file => JSON.parse(await fs.readFile(path.join(dir, file), 'utf8'));
  const add = file => { if (file) refs.add(file.replaceAll('\\', '/')); };
  const entries = (await read('catalog.json')).entries;
  for (const e of entries) {
    if (e.available === false) continue;
    add(e.thumbnail);
    if (e.voiceFile) {
      add(e.voiceFile);
      try { for (const voice of await read(e.voiceFile)) add(voice.file); } catch (error) { errors.push({ id: e.id, message: error.message }); }
    }
    if (e.model) {
      add(e.model);
      try {
        const model = await read(e.model), f = model.FileReferences, base = path.posix.dirname(e.model);
        for (const file of [f.Moc, f.Physics, f.Pose, f.DisplayInfo, ...f.Textures,
          ...Object.values(f.Motions || {}).flat().flatMap(m => [m.File, m.Sound]), ...(f.Expressions || []).map(x => x.File)].filter(Boolean)) add(path.posix.join(base, file));
      } catch (error) { errors.push({ id: e.id, message: error.message }); }
    }
    for (const m of e.models || []) {
      add(m.skeleton); add(m.atlas);
      try {
        const lines = (await fs.readFile(path.join(dir, m.atlas), 'utf8')).split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) if (lines[i].trim() && (i === 0 || !lines[i - 1].trim()) && /\.(png|jpe?g|webp)$/i.test(lines[i].trim())) add(path.posix.join(path.posix.dirname(m.atlas), lines[i].trim()));
      } catch (error) { errors.push({ id: e.id, message: error.message }); }
    }
  }
  for (const file of refs) try { if (!(await fs.stat(path.join(dir, file))).size) missing.push(file); } catch { missing.push(file); }
  const report = { name: p.name, entries: entries.length, unavailable: entries.filter(e => e.available === false).map(e => ({ id: e.id, reason: e.unavailableReason })), references: refs.size, missing, errors };
  reports.push(report); console.log(p.name, entries.length, 'references', refs.size, 'missing', missing.length, 'errors', errors.length);
}
await fs.mkdir('output/dynamic-import', { recursive: true });
await fs.writeFile('output/dynamic-import/dependencies.json', JSON.stringify(reports, null, 2));
if (reports.some(r => r.missing.length || r.errors.length)) process.exitCode = 1;
