import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createDevExtensionResolver } from './dev-extension-resolver.mjs';
import { resolveExtensionPath } from '../packages/fs/src/extensionLayout.mjs';
import { classifiedExtensionsPlugin } from './extension-layout.mjs';
import { externalDevSourceMaps } from './dev-sourcemaps.mjs';
import { devBootStyle } from './dev-boot-style.mjs';

async function fixture(t) {
 const root = await fs.mkdtemp(path.join(os.tmpdir(), 'noname-startup-'));
 t.after(async () => {
  assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
  assert.ok(path.basename(root).startsWith('noname-startup-'));
  await fs.rm(root, { recursive: true, force: true });
 });
 return root;
}

test('directory index matches uncached resolver after immediate add/move/rename/delete', async t => {
 const root = await fixture(t), ext = path.join(root, 'extension');
 await fs.mkdir(path.join(ext, 'packs', '测试'), { recursive: true });
 await fs.mkdir(path.join(ext, 'archived', '旧包'), { recursive: true });
 const resolve = createDevExtensionResolver(root);
 const compare = name => assert.equal(resolve(name), resolveExtensionPath(root, name), name);
 for (const name of ['extension/测试/skill.js', '/extension/旧包/a.png', 'extension/packs/测试/a.js', 'extension/_merge.js', 'game/config.json', 'extension/missing/a.js', 'extension\\测试\\a.js']) compare(name);
 await fs.mkdir(path.join(ext, 'imports', '新包'), { recursive: true });
 compare('extension/新包/a.js');
 await fs.rename(path.join(ext, 'packs', '测试'), path.join(ext, 'imports', '改名'));
 compare('extension/测试/a.js'); compare('extension/改名/a.js');
 await fs.rmdir(path.join(ext, 'imports', '改名'));
 compare('extension/改名/a.js');
 await fs.mkdir(path.join(ext, 'packs', '新包'));
 assert.throws(() => resolve('extension/新包/a.js'), /重名/);
 assert.throws(() => resolve('extension/测试/../secret'), /无效/);
});

const requireCore = createRequire(new URL('../apps/core/package.json', import.meta.url));
const { createServer } = await import(pathToFileURL(requireCore.resolve('vite')).href);
const executable = text => text.replace(/^\/\/[#@] sourceMappingURL=.*(?:\r?\n|$)/gm, '').trimEnd();

test('Vite serves identical executable JS, lazy JS/TS maps, 304s and fresh edited modules', async t => {
 const root = await fixture(t);
 const js = 'export function legacy() { "step 0"; var target = 1; "step 1"; return target; }\n';
 const ts = 'export const amount: number = 42;\n';
 await fs.writeFile(path.join(root, 'plain.js'), js);
 await fs.writeFile(path.join(root, 'typed.ts'), ts);
 await fs.mkdir(path.join(root, 'extension', 'packs', '测试'), { recursive: true });
 await fs.writeFile(path.join(root, 'extension', 'packs', '测试', 'extension.js'), js);
 async function start(optimized) {
  const server = await createServer({ configFile: false, root, logLevel: 'error',
   plugins: [classifiedExtensionsPlugin(root), ...(optimized ? [externalDevSourceMaps()] : [])],
   server: { host: '127.0.0.1', port: 0 }, optimizeDeps: { noDiscovery: true, include: [] } });
  await server.listen();
  return { server, url: `http://127.0.0.1:${server.httpServer.address().port}` };
 }
 const baseline = await start(false);
 const original = {};
  try { for (const file of ['/plain.js', '/typed.ts', '/extension/测试/extension.js']) original[file] = await (await fetch(baseline.url + file, { headers: { Connection: 'close' } })).text(); }
 finally { await baseline.server.close(); }
 const { server, url } = await start(true);
 try {
  for (const file of Object.keys(original)) {
   const response = await fetch(url + file), body = await response.text();
   assert.equal(executable(body), executable(original[file]), file);
   assert.doesNotMatch(body, /sourceMappingURL=data:/);
   const mapUrl = body.match(/\/\/# sourceMappingURL=(.*)\n?$/)[1];
   const mapResponse = await fetch(new URL(mapUrl, url));
   assert.equal(mapResponse.status, 200);
   assert.match(mapResponse.headers.get('content-type'), /json/, file + ': ' + mapUrl);
   const map = await mapResponse.json();
   assert.equal(map.version, 3); assert.ok(map.mappings); assert.ok(map.sourcesContent.some(s => s.includes(file.endsWith('.ts') ? 'amount: number' : '"step 0"')));
   const cached = await fetch(url + file, { headers: { 'If-None-Match': response.headers.get('etag') } });
   assert.equal(cached.status, 304);
  }
  await fs.writeFile(path.join(root, 'plain.js'), 'export const changed = 123;\n');
  let updated = '';
  for (let attempt = 0; attempt < 30; attempt++) {
   updated = await (await fetch(url + '/plain.js')).text();
   if (updated.includes('changed')) break;
   await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.match(updated, /changed = 123/);
  const map = await (await fetch(url + '/plain.js?noname-source-map=1')).json();
  assert.ok(map.sourcesContent.some(s => s.includes('changed = 123')));
  assert.equal((await fetch(url + '/missing.js?noname-source-map=1')).status, 404);
 } finally { await server.close(); }
});

test('boot CSS is unchanged apart from relative URL base and is dev-only', async () => {
 const core = path.resolve('apps/core'), plugin = devBootStyle(core);
 const original = await fs.readFile(path.join(core, 'layout/default/lobby-theme.css'), 'utf8');
 const html = await plugin.transformIndexHtml.handler(await fs.readFile(path.join(core, 'index.html'), 'utf8'));
 assert.equal(plugin.apply, 'serve');
 assert.equal(html.match(/<style>([\s\S]*?)<\/style>/)[1], original.replaceAll("url('../../", "url('./"));
 assert.equal(await plugin.transformIndexHtml.handler('<html>other page</html>'), '<html>other page</html>');
 assert.equal(externalDevSourceMaps().apply, 'serve');
});
