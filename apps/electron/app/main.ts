/// <reference types="vite/client" />
import { app, BrowserWindow, crashReporter, dialog, ipcMain, Menu, shell, session, net } from "electron";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { onlineEntry, onlineAssetPath } from "./online-assets";
import fs from "fs";
import path from "path";
import remote from "@electron/remote/main/index.js";
import createApp from "@noname/fs";
remote.initialize();
const dirname = path.join(import.meta.dirname, "../");
const onlineWindows = new Map<number, BrowserWindow>();
const configuredOnlineSessions = new Set<string>();
ipcMain.handle("noname:open-online", async (event, address: unknown) => {
  const caller = new URL(event.sender.getURL());
  if (!["http://localhost:8080", "http://localhost:8089"].includes(caller.origin) || typeof address !== "string") throw new Error("Invalid online entry");
  const assetRoot = path.join(dirname, "online-client");
  const url = await onlineEntry(assetRoot, address);
  const partition = "persist:noname-online-" + createHash("sha256").update(url.origin).digest("hex").slice(0, 16);
  const onlineSession = session.fromPartition(partition);
  if (!configuredOnlineSessions.has(partition)) {
    for (const scheme of ["http", "https"]) {
    onlineSession.protocol.handle(scheme, async request => {
      const target = new URL(request.url);
      if (target.origin !== url.origin) return new Response("Forbidden", { status: 403 });
      if (target.pathname.startsWith("/api/v1/")) return onlineSession.fetch(request, { bypassCustomProtocolHandlers: true });
      if (!["GET", "HEAD"].includes(request.method)) return new Response("Method not allowed", { status: 405 });
      try { return await net.fetch(pathToFileURL(await onlineAssetPath(assetRoot, target.pathname)).href); }
      catch { return new Response("Local client asset missing", { status: 404 }); }
    });
    }
    configuredOnlineSessions.add(partition);
  }
  const ownerId = event.sender.id;
  const existing = onlineWindows.get(ownerId);
  if (existing && !existing.isDestroyed()) { existing.show(); existing.focus(); return; }
  const win = new BrowserWindow({
    width: 1100, height: 800, title: "无名杀 · 联机", parent: BrowserWindow.fromWebContents(event.sender) || undefined,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true, partition },
  });
  onlineWindows.set(ownerId, win);
  win.removeMenu();
  win.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  const restrictNavigation = (navigation: Electron.Event, target: string) => {
    if (new URL(target).origin !== url.origin) navigation.preventDefault();
  };
  win.webContents.on("will-navigate", restrictNavigation);
  win.webContents.on("will-redirect", restrictNavigation);
  win.on("closed", () => onlineWindows.delete(ownerId));
  try { await win.loadURL(url.href); } catch (error) { if (!win.isDestroyed()) win.close(); throw error; }
});

// 获取单实例锁
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	// 如果获取失败，说明已经有实例在运行了，直接退出
	app.quit();
}
const fileService = gotTheLock ? createApp({ port: 8089, dirname, server: true }) : undefined;
let servicesClosed = false;
let closingServices = false;
app.on("will-quit", event => {
	if (servicesClosed || !fileService) return;
	event.preventDefault();
	if (closingServices) return;
	closingServices = true;
	const timeout = setTimeout(() => app.exit(0), 5000);
	fileService.close().catch(error => console.error("文件服务关闭失败", error)).finally(() => {
		clearTimeout(timeout);
		servicesClosed = true;
		app.quit();
	});
});

app.setAppUserModelId("com.libnoname.noname");

//防止32位无名杀的乱码
app.setName("无名杀");

function setPath(path1: any, path2: any) {
	app.getPath(path1);
	fs.mkdirSync(path2, { recursive: true });
	app.setPath(path1, path2);
}

setPath("home", path.join(dirname, "Home"));
setPath("appData", path.join(dirname, "Home", "AppData"));
setPath("userData", path.join(dirname, "Home", "UserData"));
setPath("temp", path.join(dirname, "Home", "Temp"));
setPath("cache", path.join(dirname, "Home", "Cache"));
//崩溃转储文件存储的目录
setPath("crashDumps", path.join(dirname, "Home", "crashDumps"));
//日志目录
setPath("logs", path.join(dirname, "Home", "logs"));

//崩溃处理
crashReporter.start({
	productName: "无名杀",
	//崩溃报告将被收集并存储在崩溃目录中，不会上传
	uploadToServer: false,
	compress: false,
});

// 其他实例启动时，主实例会通过 second-instance 事件接收其他实例的启动参数 `argv`
app.on("second-instance", (event, argv) => {
	// Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
	if (process.platform === "win32") {
		createWindow();
	}
});

// macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
app.on("open-url", (event, urlStr) => {
	createWindow();
});

app.setAboutPanelOptions({
	iconPath: "noname.ico",
	website: "https://github.com/libnoname/noname",
});

process.env["ELECTRON_DEFAULT_ERROR_MODE"] = "true";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
process.noDeprecation = true;

function createWindow() {
	createMainWindow();
}

function createMainWindow() {
	let win = new BrowserWindow({
		width: 1000,
		height: 800,
		title: "无名杀",
		icon: path.join(dirname, "noname.ico"),
		webPreferences: {
			webSecurity: false,
			preload: path.join(dirname, "app/preload.js"),
			nodeIntegration: true, //主页面用node
			nodeIntegrationInSubFrames: true, //子页面用node
			nodeIntegrationInWorker: true, //worker用node
			contextIsolation: false, //必须为false
			plugins: true, //启用插件
			// @ts-ignore
			enableRemoteModule: true, //可以调用Remote
			experimentalFeatures: true, //启用Chromium的实验功能
		},
	});
	if (import.meta.env.DEV) {
		win.loadURL(`http://localhost:8080`);
	} else {
		win.loadURL(`http://localhost:8089/index.html`);
	}
	remote.enable(win.webContents);
	const menuTemplate: Electron.MenuItemConstructorOptions[] = [
		{
			label: "操作",
			submenu: [
				{ label: "退出程序", role: "quit", accelerator: "CmdOrCtrl+Q" },
				{ type: "separator" },
				{
					label: "打开无名杀目录",
					click: () => {
						shell.showItemInFolder(path.join(app.getAppPath(), "app"));
					},
				},
			],
		},
		{
			label: "窗口",
			submenu: [
				{
					label: "重新加载当前窗口",
					role: "reload",
				},
				{
					label: "打开/关闭控制台",
					role: "toggleDevTools",
				},
				{
					type: "separator",
				},
				{
					label: "全屏模式",
					role: "togglefullscreen",
				},
				{
					label: "最小化",
					role: "minimize",
				},
				{
					type: "separator",
				},
			],
		},
		{
			label: "帮助",
			submenu: [
				{
					label: "bug反馈",
					click: () => {
						shell.openExternal("https://tieba.baidu.com/p/9117747182");
					},
				},
				{
					label: "版权声明",
					click: () => {
						dialog.showMessageBoxSync(win, {
							message:
								"【无名杀】属于个人（水乎）开发项目且【完全免费】。如非法倒卖用于牟利将承担法律责任 开发团队将追究到底",
							type: "info",
							title: "版权声明",
							icon: path.join(app.getAppPath(), "app", "noname.ico"),
						});
					},
				},
			],
		},
	];
	Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
	return win;
}

app.whenReady().then(() => {
	if (!gotTheLock) return;
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
