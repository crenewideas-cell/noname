import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { once } from 'node:events';

const project = path.resolve(import.meta.dirname, '..');
const run = path.resolve(process.argv[2] || 'output/dynamic-remediation/20260926-r01');
const resume = process.argv.includes('--resume');
const git = (...args) => execFileSync('git', args, { cwd: project, maxBuffer: 128 * 1024 * 1024 });
const relative = p => path.relative(project, p).replaceAll('\\', '/');
async function hash(file) {
  const h = createHash('sha256');
  for await (const chunk of createReadStream(file)) h.update(chunk);
  return h.digest('hex');
}
async function* walk(root) {
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) yield* walk(file);
    else if (entry.isFile()) yield file;
    else throw Error('Unexpected non-regular file: ' + file);
  }
}
await fs.mkdir(run, { recursive: true });
// Refuse to overwrite a prior baseline, including an incomplete one.
const lock = await fs.open(path.join(run, resume ? 'freeze-resumed.json' : 'freeze-started.json'), resume ? 'w' : 'wx');
await lock.writeFile(JSON.stringify({ startedAt: new Date().toISOString(), pid: process.pid, project }));
await lock.close();
const started = Date.now();
const status = git('status', '--porcelain=v1', '--untracked-files=all').toString();
const metadata = { schema: 1, project, run, head: git('rev-parse', 'HEAD').toString().trim(),
  status, startedAt: new Date().toISOString(), node: process.version, platform: os.platform(), release: os.release(),
  cpu: os.cpus()[0]?.model, memory: os.totalmem(), target: 'This Windows machine, browser only (explicit user scope)',
  scopeBaseline: 4934, previouslyUnavailable: 54,
  assetPolicy: 'Original source and installed large assets retained in place and SHA-256 inventoried; no hard links, no source writes. Mutable tracked files and installed metadata/runtime copied.',
  savePolicy: 'No access to formal browser profile. Tests must use a fresh isolated browser context. Formal browser save backup/restore remains pending.' };
if (!resume) {
  await fs.writeFile(path.join(run, 'run.json'), JSON.stringify(metadata, null, 2));
  await fs.writeFile(path.join(run, 'git-status.txt'), status);
  await fs.writeFile(path.join(run, 'unstaged.patch'), git('diff', '--binary'));
  await fs.writeFile(path.join(run, 'staged.patch'), git('diff', '--cached', '--binary'));
}
const files = resume ? JSON.parse(await fs.readFile(path.join(run, 'workspace-files.json'))) : [...new Set([...git('ls-files', '-z').toString().split('\0'), ...git('ls-files', '--others', '--exclude-standard', '-z').toString().split('\0')].filter(Boolean))];
if (!resume) await fs.writeFile(path.join(run, 'workspace-files.json'), JSON.stringify(files));
const previous = new Map();
if (resume) {
  const raw = await fs.readFile(path.join(run, 'baseline-files.jsonl'), 'utf8');
  const end = raw.lastIndexOf('\n') + 1;
  if (end !== raw.length) await fs.truncate(path.join(run, 'baseline-files.jsonl'), Buffer.byteLength(raw.slice(0, end)));
  for (const line of raw.slice(0, end).split('\n').filter(Boolean)) { const row = JSON.parse(line); previous.set(row.path, row); }
}
const out = createWriteStream(path.join(run, 'baseline-files.jsonl'), { flags: resume ? 'a' : 'wx' });
out.setMaxListeners(32);
let total = 0, bytes = 0, copied = 0;
async function record(file, copy, category) {
  const prior = previous.get(relative(file));
  if (prior) {
    const current = await fs.stat(file);
    if (current.size !== prior.bytes || current.mtimeMs !== prior.mtimeMs) {
      if (path.resolve(file) !== import.meta.filename) throw Error('Frozen input changed during resume: ' + file);
      // This newly created freeze tool may itself be improved for resumability;
      // retain its first saved version and explicitly record the current one.
      await fs.writeFile(path.join(run, 'freeze-tool-update.json'), JSON.stringify({ baseline: prior.sha256, current: await hash(file), reason: 'Resumable bounded concurrency and narrower mutable-path selection; user files unchanged' }, null, 2));
    }
    if (copy && (await fs.stat(path.join(run, prior.recovery))).size !== prior.bytes) throw Error('Recovery copy missing or changed: ' + file);
    total++; bytes += prior.bytes; copied += Number(prior.recovery !== 'retained-original'); return;
  }
  const before = await fs.stat(file), sha256 = await hash(file), after = await fs.stat(file);
  if (before.size !== after.size || before.mtimeMs !== after.mtimeMs) throw Error('File changed while freezing: ' + file);
  const name = relative(file);
  if (copy) {
    const target = path.join(run, 'baseline', name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    // A stopped operation may leave an unrecorded target; overwrite only our own exact recovery path.
    await fs.copyFile(file, target, resume ? 0 : 1);
    if (await hash(target) !== sha256) throw Error('Copy verification failed: ' + name);
    copied++;
  }
  const row = { path: name, category, bytes: before.size, mtimeMs: before.mtimeMs, sha256, recovery: copy ? 'baseline/' + name : 'retained-original' };
  if (!out.write(JSON.stringify(row) + '\n')) await once(out, 'drain');
  total++; bytes += before.size;
  if (total % 2500 === 0) console.log(JSON.stringify({ total, copied, bytes, seconds: Math.round((Date.now() - started) / 1000), file: name }));
}
let batch = [];
async function queue(file, copy, category) {
  batch.push(record(file, copy, category));
  if (batch.length >= 12) { await Promise.all(batch); batch = []; }
}
for (const file of files) await queue(path.join(project, file), true, 'workspace');
await Promise.all(batch); batch = [];
const roots = ['temp/动态皮包', 'apps/core/extension/imports/本地动态皮肤包'];
for (const root of roots) {
  const source = root.startsWith('temp/');
  for await (const file of walk(path.join(project, root))) {
    const within = path.relative(path.join(project, root), file).replaceAll('\\', '/');
    const mutable = /^(?:[^/]+\/)?(runtime|entries|groups|characters)\//.test(within) || !/\//.test(within) || /^[^/]+\/[^/]+\.(json|js|md)$/.test(within);
    await queue(file, mutable, source ? 'source' : 'installation');
  }
}
await Promise.all(batch);
out.end(); await once(out, 'finish');
const complete = { completedAt: new Date().toISOString(), total, copied, bytes, manifestHash: await hash(path.join(run, 'baseline-files.jsonl')), elapsedSeconds: (Date.now() - started) / 1000 };
await fs.writeFile(path.join(run, 'freeze-complete.json'), JSON.stringify(complete, null, 2));
console.log(JSON.stringify(complete));
