import { realpath, readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

export async function onlineEntry(root: string, fragment: unknown) {
  if (typeof fragment !== "string" || !/^#online=[a-z0-9_-]+$/.test(fragment)) throw new Error("Invalid online mode");
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
