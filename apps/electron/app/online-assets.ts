import { realpath, readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { extname } from "node:path";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { once } from "node:events";
import type { ProtocolRequest, ProtocolResponse } from "electron";

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".wasm": "application/wasm",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".avif": "image/avif",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf",
  ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav", ".m4a": "audio/mp4",
  ".mp4": "video/mp4", ".webm": "video/webm", ".txt": "text/plain; charset=utf-8",
};

export function onlineTextResponse(text: string, statusCode: number): ProtocolResponse {
  return { statusCode, headers: { "content-type": "text/plain; charset=utf-8" }, data: Readable.from([Buffer.from(text)]) };
}

// Return Electron's native Node stream response directly. Do not pass navigation
// through protocol.handle's Request/Response and WHATWG stream conversion layer.
export async function onlineAssetResponse(root: string, request: ProtocolRequest): Promise<ProtocolResponse> {
  const file = await onlineAssetPath(root, new URL(request.url).pathname);
  const info = await stat(file);
  if (!info.isFile()) throw new Error(`联机资源不是文件：${new URL(request.url).pathname}`);
  const headers: Record<string, string> = {
    "content-type": contentTypes[extname(file).toLowerCase()] || "application/octet-stream",
    "accept-ranges": "bytes", "cache-control": "no-cache",
  };
  let start = 0, end = info.size - 1, status = 200;
  const range = Object.entries(request.headers).find(([name]) => name.toLowerCase() === "range")?.[1];
  if (range && request.method === "GET") {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      return { statusCode: 416, headers: { "content-range": `bytes */${info.size}` }, data: Readable.from([]) };
    }
    start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
    end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= info.size) {
      return { statusCode: 416, headers: { "content-range": `bytes */${info.size}` }, data: Readable.from([]) };
    }
    status = 206;
    headers["content-range"] = `bytes ${start}-${end}/${info.size}`;
  }
  headers["content-length"] = String(Math.max(0, end - start + 1));
  if (request.method === "HEAD" || info.size === 0) return { statusCode: status, headers, data: Readable.from([]) };
  const stream = createReadStream(file, { start, end });
  // Surface open/permission errors before handing the stream to Chromium.
  await once(stream, "open");
  return { statusCode: status, headers, data: stream };
}

export async function onlineEntry(root: string, fragment: unknown) {
  if (typeof fragment !== "string" || !/^#online=[a-z0-9_-]+(?:&appearance=[A-Za-z0-9_-]{1,8192})?$/.test(fragment)) throw new Error("Invalid online mode");
  let manifest;
  try { manifest = JSON.parse(await readFile(resolve(root, "deployment.json"), "utf8")); }
  catch { throw new Error("缺少本地联机资源，请安装完整客户端。"); }
  const origin = new URL(manifest.origin);
  if (!["http:", "https:"].includes(origin.protocol) || origin.username || origin.password || manifest.kind !== "client") throw new Error("Invalid online client manifest");
  const entry = new URL("/index.html", origin.origin);
  entry.hash = fragment;
  return entry;
}

export async function onlineAssetPath(root: string, pathname: string) {
  const name = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
  if (name.includes("\\") || name.includes("\0") || name.includes(":")) throw new Error("Invalid asset path");
  const parts = name.split("/").filter(Boolean);
  if (parts.some(part => part === ".." || part === ".") || /^(extension|src|preload\.js|\.env|\.git|readFile|readFileAsText|writeFile|removeFile|createDir|removeDir|getFileList|checkFile|checkDir)$/.test(parts[0])) throw new Error("Forbidden asset path");
  const base = await realpath(root);
  const file = await realpath(resolve(base, ...parts));
  const delta = relative(base, file);
  if (!delta || delta === ".." || delta.startsWith(".." + sep) || isAbsolute(delta)) throw new Error("Asset outside client directory");
  return file;
}
