import { createServer } from "node:http";
import fs from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { listPackages, listCharacters, planDeletion, commitDeletion, type Plan } from "./extension-manager/model.js";

const key = randomBytes(24).toString("hex");
const plans = new Map<string, { plan: Plan; expires: number }>();
let busy = false;
const server = createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  const url = new URL(req.url!, "http://127.0.0.1");
  const address = server.address();
  const origin = typeof address === "object" && address ? `http://127.0.0.1:${address.port}` : "";
  if (url.searchParams.get("key") !== key || (req.headers.origin && req.headers.origin !== origin) || req.headers.host !== origin.slice(7)) { res.writeHead(403).end("禁止访问"); return; }
  const send = (status: number, value: any) => { res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(value)); };
  try {
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(await fs.readFile(new URL("./extension-manager/index.html", import.meta.url), "utf8")); return;
    }
    if (busy) { send(409, { error: "正在删除，请稍候" }); return; }
    if (req.method === "GET" && url.pathname === "/packages") { send(200, await listPackages()); return; }
    if (req.method === "GET" && url.pathname === "/characters") { send(200, await listCharacters(url.searchParams.get("name") || "")); return; }
    if (req.method !== "POST") { send(404, { error: "未知操作" }); return; }
    let body = "";
    for await (const chunk of req) { body += chunk; if (body.length > 8192) throw new Error("请求过大"); }
    const data = JSON.parse(body);
    if (url.pathname === "/plan") {
      const plan = await planDeletion(data.name, data.id);
      const token = randomBytes(24).toString("hex");
      plans.clear(); plans.set(token, { plan, expires: Date.now() + 600000 });
      send(200, { token, name: plan.name, id: plan.id, path: plan.directory, summary: plan.summary }); return;
    }
    if (url.pathname === "/delete") {
      const pending = plans.get(data.token);
      if (!pending || pending.expires < Date.now() || data.confirm !== pending.plan.name) throw new Error("请重新预览，并输入扩展完整名称确认。");
      busy = true;
      try { await commitDeletion(pending.plan); plans.delete(data.token); send(200, { ok: true }); }
      finally { busy = false; }
      return;
    }
    send(404, { error: "未知操作" });
  } catch (error: any) { send(400, { error: error.message }); }
});
// One management process owns source edits at a time; an OS-released port is the lock.
server.listen(8096, "127.0.0.1", () => {
  const address = `http://127.0.0.1:8096/?key=${key}`;
  console.log(`扩展文件管理：\n${address}\n在浏览器中打开以上地址。删除前需预览并输入名称确认。按 Ctrl+C 关闭。`);
  if (process.platform === "win32") {
    const browser = spawn("rundll32.exe", ["url.dll,FileProtocolHandler", address], { windowsHide: true, stdio: "ignore" });
    browser.on("error", () => console.log("请手动在浏览器打开以上地址。"));
    browser.unref();
  }
});
server.on("error", error => { console.error(`无法启动管理器（请检查 8096 端口是否已有管理器运行）：${error.message}`); process.exitCode = 1; });
