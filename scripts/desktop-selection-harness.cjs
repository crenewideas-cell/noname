// Test-only Electron shell. Uses the shipped Chromium, filesystem server,
// preload and web preferences, with an isolated profile and independent port.
const { app, BrowserWindow } = require('electron');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const root = path.resolve(__dirname, '../output/windows/win-unpacked/resources/app');
const remote = require(path.join(root, 'node_modules/@electron/remote/main/index.js'));
remote.initialize();
app.setPath('userData', process.env.NONAME_TEST_PROFILE);
app.whenReady().then(async () => {
 const { default: createApp } = await import(pathToFileURL(path.join(root, 'node_modules/@noname/fs/dist/index.js')));
 const server = createApp({ dirname: root, listen: false });
 await server.listen({ port: 19089, host: '127.0.0.1' });
 const win = new BrowserWindow({ show: false, width: 1296, height: 748, useContentSize: true,
  webPreferences: { preload: path.resolve(__dirname, 'desktop-selection-preload.cjs'), nodeIntegration: true,
   contextIsolation: false, nodeIntegrationInSubFrames: true, nodeIntegrationInWorker: true,
   webSecurity: false, experimentalFeatures: true, backgroundThrottling: false } });
 remote.enable(win.webContents);
 await win.loadURL('http://127.0.0.1:19089/game/config.json');
 app.on('window-all-closed', () => { void server.close().finally(() => app.quit()); });
});
