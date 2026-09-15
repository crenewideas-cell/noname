/// <reference types="vite/client" />
import { app, BrowserWindow, crashReporter, dialog, ipcMain, Menu, shell, session } from "electron";
import { createHash } from "node:crypto";
import { onlineEntry } from "./online-assets";
import { installOnlineProtocol } from "./online-protocol";
import fs from "fs";
import path from "path";
import remote from "@electron/remote/main/index.js";
import createApp from "@noname/fs/dist/index.js";
remote.initialize();
const dirname = path.join(import.meta.dirname, "../");
const onlineWindows = new Map<number, BrowserWindow>();
const configuredOnlineSessions = new Set<string>();
const onlineFailures = new Map<string, string>();

function reportOnlineError(partition: string, stage: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  onlineFailures.set(partition, `${stage}：${detail}`);
  console.error(stage, error);
  try {
    const log = path.join(app.getPath("logs"), "online.log");
    fs.appendFileSync(log, `${new Date().toISOString()} [${stage}] ${error instanceof Error ? error.stack || detail : detail}\n`, "utf8");
  } catch (logError) {
    console.error("联机错误日志写入失败", logError);
  }
}
let quitting = false;
let relaunchRequested = false;
let serviceReady = false;
let mainWindow: BrowserWindow | undefined;
ipcMain.handle("noname:open-online", async (event, address: unknown) => {
  if (quitting) throw new Error("程序正在退出，请重新打开后进入联机。");
  const caller = new URL(event.sender.getURL());
  if (!["http://localhost:8081", "http://localhost:8089"].includes(caller.origin) || typeof address !== "string") throw new Error("Invalid online entry");
  const assetRoot = path.join(dirname, "online-client");
  const url = await onlineEntry(assetRoot, address);
  const partition = "persist:noname-online-" + createHash("sha256").update(url.origin).digest("hex").slice(0, 16);
  const onlineSession = session.fromPartition(partition);
  if (!configuredOnlineSessions.has(partition)) {
    try {
      installOnlineProtocol(onlineSession, assetRoot, url.origin,
        (stage, error) => reportOnlineError(partition, stage, error));
    } catch (error) {
      reportOnlineError(partition, "联机协议初始化", error);
      throw error;
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
  win.webContents.on("will-prevent-unload", event => {
    if (quitting) event.preventDefault();
  });
  const restrictNavigation = (navigation: Electron.Event, target: string) => {
    if (new URL(target).origin !== url.origin) navigation.preventDefault();
  };
  win.webContents.on("will-navigate", restrictNavigation);
  win.webContents.on("will-redirect", restrictNavigation);
  win.on("closed", () => { if (onlineWindows.get(ownerId) === win) onlineWindows.delete(ownerId); });
  onlineFailures.delete(partition);
  try { await win.loadURL(url.href); }
  catch (error) {
    const cause = onlineFailures.get(partition) || (error instanceof Error ? error.message : String(error));
    reportOnlineError(partition, "联机页面加载失败", error);
    if (!win.isDestroyed()) win.close();
    throw new Error(`联机页面加载失败：${cause}\n错误日志：${path.join(app.getPath("logs"), "online.log")}`);
  }
});

app.setAppUserModelId("com.libnoname.noname");

//防止32位无名杀的乱码
app.setName("无名杀");

function setPath(path1: any, path2: any) {
	app.getPath(path1);
	fs.mkdirSync(path2, { recursive: true });
	app.setPath(path1, path2);
}

// Portable EXEs extract to a temporary directory. Keep saves outside that tree.
const dataRoot = app.commandLine.getSwitchValue("user-data-dir")
	|| (app.isPackaged ? path.join(app.getPath("appData"), "noname-desktop") : path.join(dirname, "Home"));
setPath("userData", path.join(dataRoot, "UserData"));
setPath("temp", path.join(dataRoot, "Temp"));
setPath("cache", path.join(dataRoot, "Cache"));
//崩溃转储文件存储的目录
setPath("crashDumps", path.join(dataRoot, "crashDumps"));
//日志目录
setPath("logs", path.join(dataRoot, "logs"));

// The lock and Chromium must use the same, stable profile directory.
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();
const fileService = gotTheLock ? createApp({ port: 8089, dirname, server: true, listen: false }) : undefined;
let closingServices = false;
app.on("before-quit", () => { quitting = true; });
app.on("will-quit", event => {
	if (!fileService) return;
	event.preventDefault();
	if (closingServices) return;
	closingServices = true;
	quitting = true;
	const finish = () => {
		if (relaunchRequested) app.relaunch();
		app.exit(0);
	};
	const timeout = setTimeout(finish, 5000);
	void (async () => {
		const sessions = [session.defaultSession, ...Array.from(configuredOnlineSessions, partition => session.fromPartition(partition))];
		await Promise.allSettled(sessions.map(async current => {
			current.flushStorageData();
			await current.cookies.flushStore();
		}));
		fileService.server.closeAllConnections();
		await fileService.close();
	})().catch(error => console.error("退出清理失败", error)).finally(() => {
		clearTimeout(timeout);
		finish();
	});
});

//崩溃处理
crashReporter.start({
	productName: "无名杀",
	//崩溃报告将被收集并存储在崩溃目录中，不会上传
	uploadToServer: false,
	compress: false,
});

// 其他实例启动时，主实例会通过 second-instance 事件接收其他实例的启动参数 `argv`
app.on("second-instance", () => {
	// Never open a new renderer against a file server that is shutting down.
	if (quitting) { relaunchRequested = true; return; }
	createWindow();
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
	if (quitting || !serviceReady || !app.isReady()) return;
	if (mainWindow && !mainWindow.isDestroyed()) {
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.show(); mainWindow.focus();
		return;
	}
	mainWindow = createMainWindow();
	mainWindow.on("closed", () => { mainWindow = undefined; });
}

function createMainWindow() {
	let win = new BrowserWindow({
		width: 1000,
		height: 800,
		title: "无名杀",
		icon: path.join(dirname, "noname.ico"),
		webPreferences: {
			webSecurity: false,
			preload: path.join(dirname, "app/preload.cjs"),
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
	remote.enable(win.webContents);
	win.webContents.on("will-prevent-unload", event => {
		if (quitting) event.preventDefault();
	});
	if (import.meta.env.DEV) {
		win.loadURL(`http://localhost:8081`);
	} else {
		win.loadURL(`http://localhost:8089/index.html#desktop-lobby`);
	}
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
				{ label: "开源许可（GPLv3）", click: () => { shell.openPath(path.join(dirname, "LICENSE")); } },
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

app.whenReady().then(async () => {
	if (!gotTheLock) return;
	try {
		await fileService!.listen({ port: 8089, host: "localhost" });
		serviceReady = true;
	} catch (error) {
		dialog.showErrorBox("无名杀启动失败", `无法启动本地文件服务，请关闭占用 8089 端口的开发服务或其他客户端后重试。\n${error}`);
		app.quit();
		return;
	}
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
