import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { createManagerHandler } from "./extension-manager/server.js";
const key = randomBytes(24).toString("hex");
const manager = createManagerHandler("/__extensions", (req, url) => url.searchParams.get("key") === key && req.headers.host === "127.0.0.1:8096" && (!req.headers.origin || req.headers.origin === "http://127.0.0.1:8096"));
const server = createServer((req, res) => { void manager.handler(req, res, () => { res.writeHead(404).end(); }); });
server.listen(8096, "127.0.0.1", () => {
  const address = `http://127.0.0.1:8096/__extensions/?key=${key}`;
  console.log(`扩展管理：\n${address}\n按 Ctrl+C 关闭。`);
  if (process.platform === "win32") {
    const browser = spawn("rundll32.exe", ["url.dll,FileProtocolHandler", address], { windowsHide: true, stdio: "ignore" });
    browser.on("error", () => console.log("请手动打开以上地址。")); browser.unref();
  }
});
server.once("close", () => { void manager.close(); });
server.on("error", error => { console.error(`无法启动管理器：${error.message}`); process.exitCode = 1; });
