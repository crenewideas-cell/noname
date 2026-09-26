import path from 'node:path';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from '../apps/core/node_modules/vite/dist/node/index.js';

// An isolated cold server on an OS-assigned port, leaving the user's dev server
// and browser storage untouched. Do not share dependency optimization caches.
const start = Date.now();
const server = await createServer({ root: path.resolve('apps/core'),
  configFile: path.resolve('apps/core/vite.config.ts'),
  cacheDir: path.resolve('output/dynamic-import/vite-cache'),
  server: { port: 0, open: false, hmr: false } });
const report = {};
try {
  const watching = new Promise(resolve => server.watcher.once('ready', resolve));
  await server.listen();await watching;
  report.readyMs = Date.now() - start;
  const watched = server.watcher.getWatched();
  report.directories = Object.keys(watched).length;
  report.importedDirectories = Object.keys(watched).filter(p => p.includes('本地动态皮肤包'));
  report.memory = process.memoryUsage();
  assert.deepEqual(report.importedDirectories, []);
  const address = server.httpServer.address(), origin = 'http://127.0.0.1:' + address.port;
  const requestStart = Date.now();
  const response = await fetch(origin + '/extension/' + encodeURIComponent('手杀标准UI') + '/files.json');
  assert.equal(response.status, 200);report.inventoryEntries = (await response.json()).length;
  report.inventoryMs = Date.now() - requestStart;
  console.log('cold server', JSON.stringify(report));
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['scripts/dynamic-lazy-browser.mjs', '--shousha'], {
      env: { ...process.env, NONAME_UI_TEST_ORIGIN: origin }, windowsHide: true, stdio: 'inherit' });
    child.on('error', reject);child.on('exit', resolve);
  });
  assert.equal(code, 0);
  const finalWatched = server.watcher.getWatched();
  report.finalDirectories = Object.keys(finalWatched).length;
  report.finalImportedDirectories = Object.keys(finalWatched).filter(p => p.includes('本地动态皮肤包'));
  report.finalMemory = process.memoryUsage();
  assert.deepEqual(report.finalImportedDirectories, []);
  report.passed = true;
} finally {
  await server.close();
  await fs.writeFile('output/dynamic-import/cold-start.json', JSON.stringify(report, null, 2));
}
