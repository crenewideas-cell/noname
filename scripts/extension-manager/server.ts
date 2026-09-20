import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { randomBytes } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { listPackages, listCharacters, planDeletion, commitDeletion, type Plan } from "./model.js";
import { directory, readSource, saveSource, createSource, createPackage, createSubpackage, createDirectory, moveCategory, changePath, characterDetail, saveCharacter, addCharacter } from "./operations.js";
import { prepareExport } from "./export.js";

export function createManagerHandler(prefix: string, authorize: (req: IncomingMessage, url: URL) => boolean) {
  let busy = false;
  const plans = new Map<string, { plan: Plan; expires: number }>();
  const exports = new Map<string, Awaited<ReturnType<typeof prepareExport>>>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const send = (res: ServerResponse, status: number, value: unknown) => { res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(value)); };
  const handler = async (req: IncomingMessage, res: ServerResponse, next?: () => void) => {
    const url = new URL(req.url || "/", "http://localhost");
    if (url.pathname !== prefix && !url.pathname.startsWith(prefix + "/")) { next?.(); return; }
    res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff"); res.setHeader("X-Frame-Options", "DENY");
    if (!authorize(req, url)) { send(res, 403, { error: "仅允许本机管理页面访问" }); return; }
    const route = url.pathname.slice(prefix.length) || "/";
    try {
      if (req.method === "GET" && route === "/") { res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); res.end(await fs.readFile(new URL("./index.html", import.meta.url), "utf8")); return; }
      if (req.method === "GET" && route === "/download") {
        const token = url.searchParams.get("token") || "", item = exports.get(token);
        if (!item) throw new Error("导出文件已过期，请重新导出");
        exports.delete(token);
        res.setHeader("Content-Type", "application/zip"); res.setHeader("Content-Disposition", `attachment; filename="extensions.zip"; filename*=UTF-8''${encodeURIComponent(item.filename)}`);
        res.setHeader("Content-Length", (await fs.stat(item.file)).size);
        try { await pipeline(createReadStream(item.file), res); } finally { await item.dispose(); }
        return;
      }
      if (busy) { send(res, 409, { error: "正在保存或导出，请稍候" }); return; }
      const name = url.searchParams.get("name") || "", relative = url.searchParams.get("path") || "";
      if (req.method === "GET") {
        const result = route === "/packages" ? await listPackages() : route === "/characters" ? await listCharacters(name) : route === "/directory" ? await directory(name, relative) : route === "/source" ? await readSource(name, relative) : route === "/character" ? await characterDetail(name, url.searchParams.get("id") || "", relative) : undefined;
        if (result !== undefined) { send(res, 200, result); return; }
      }
      if (req.method !== "POST") { send(res, 404, { error: "未知操作" }); return; }
      if (!req.headers["content-type"]?.startsWith("application/json")) throw new Error("需要 JSON 请求");
      const chunks: Buffer[] = []; let size = 0;
      for await (const chunk of req) { size += chunk.length; if (size > 5 * 1024 * 1024) throw new Error("请求过大"); chunks.push(chunk); }
      const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (busy) { send(res, 409, { error: "正在执行其他操作" }); return; }
      busy = true;
      try {
        let result;
        if (route === "/plan") {
          const plan = await planDeletion(data.name, data.id), token = randomBytes(24).toString("hex");
          plans.clear(); plans.set(token, { plan, expires: Date.now() + 600000 });
          result = { token, name: plan.name, id: plan.id, path: plan.directory, summary: plan.summary };
        } else if (route === "/delete") {
          const pending = plans.get(data.token);
          if (!pending || pending.expires < Date.now() || data.confirm !== pending.plan.name) throw new Error("请重新预览并输入扩展完整名称");
          await commitDeletion(pending.plan); plans.delete(data.token); result = { ok: true };
        } else if (route === "/export") {
          if (exports.size >= 3) throw new Error("请先下载已导出的文件，或稍后重试");
          const item = await prepareExport(data), token = randomBytes(24).toString("hex"); exports.set(token, item);
          const timer = setTimeout(() => { timers.delete(timer); if (exports.delete(token)) void item.dispose(); }, 600000);
          timer.unref(); timers.add(timer); result = { token, filename: item.filename };
        } else {
          const operations: Record<string, (data: any) => Promise<any>> = { "/source": saveSource, "/source/create": createSource, "/package/create": createPackage, "/package/move": moveCategory, "/subpackage/create": createSubpackage, "/directory/create": createDirectory, "/path/change": changePath, "/character/save": saveCharacter, "/character/create": addCharacter };
          const operation = operations[route]; if (!operation) throw new Error("未知操作"); result = await operation(data);
        }
        send(res, 200, result);
      } finally { busy = false; }
    } catch (error: any) { if (!res.headersSent) send(res, 400, { error: error.message }); else res.destroy(error); }
  };
  const close = async () => { for (const timer of timers) clearTimeout(timer); await Promise.allSettled([...exports.values()].map(item => item.dispose())); exports.clear(); };
  return { handler, close };
}
export function extensionManagerPlugin() {
  return {
    name: "local-extension-manager", apply: "serve",
    configureServer(server: any) {
      const manager = createManagerHandler("/__extensions", req => {
        if (!["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress || "")) return false;
        const address = server.httpServer?.address(), host = req.headers.host || "";
        if (!["127.0.0.1", "localhost", "[::1]"].some(name => host === `${name}:${address?.port}`)) return false;
        return (!req.headers.origin || req.headers.origin === `http://${host}`) && req.headers["sec-fetch-site"] !== "cross-site";
      });
      server.middlewares.use(manager.handler);
      server.httpServer?.once("close", () => { void manager.close(); });
    },
  };
}
