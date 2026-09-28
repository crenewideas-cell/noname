import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { cp, copyFile, mkdir, readdir, readFile, rm, stat, writeFile, access } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PROVIDER_PROGRAMS, isProviderFile } from "../apps/core/noname/ui/workshop/providerFiles.js";
import { deployedOnlineRuntime } from "./online-release.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const runtimeDirectories = new Set(["audio", "image", "extension", "ui-skins", "card", "character", "mode", "font", "game", "layout", "theme", "thumbnail", "noname", "vendor", "online-client"]);
const ignoredDirectories = new Set([".git", ".github", ".cache", ".vite", "__pycache__", "home", "temp"]);

// Scope exclusions to known non-runtime content. In particular, extension/src,
// .ts/.vue files and JSON manifests can be loaded by the game at runtime.
export function includeRuntimeFile(name, isDirectory = false) {
  const parts = name.replaceAll("\\", "/").split("/");
  const base = parts.at(-1);
  if (parts.some(part => ignoredDirectories.has(part.toLowerCase()))) return false;
  if (parts.some(part => part === "动态资源" || part.endsWith("_配音"))) return false;
  if (parts[0] === "extension" && parts[1] === "红楼幻境" && parts[2] === "voice" && parts[3] === "import") return false;
  if (parts.length > 1 && !runtimeDirectories.has(parts[0])) return false;
  // Shared by Electron and Android collection. Source leftovers and an old
  // dist directory must not reintroduce legacy UI programs into a new package.
  const providerIndex = ["extension", "ui-skins"].includes(parts[0]) ? 1 : parts[0] === "online-client" && parts[1] === "ui-skins" ? 2 : -1;
  const provider = parts[providerIndex];
  if (Object.hasOwn(PROVIDER_PROGRAMS, provider)) {
    const file = parts.slice(providerIndex + 1).join("/");
    if (provider === "手杀标准UI" && /^(?:assets|spine|vendor)(?:\/|$)/.test(file)) return false;
    if (!isDirectory && !isProviderFile(provider, file)) return false;
  }
  if (isDirectory) return parts.length > 1 || runtimeDirectories.has(base);
  if (/license|copying|notice/i.test(base)) return true;
  if (/\.(?:map|md|log|tmp|bak|orig|rej|zip|7z|rar|psd|aep|blend)$/i.test(base)) return false;
  if (/^(?:thumbs\.db|desktop\.ini|\.DS_Store|pnpm-lock\.yaml|package-lock\.json|yarn\.lock)$/i.test(base)) return false;
  if (/\.(?:test|spec)\.[cm]?[jt]s$/i.test(base) || /\.d\.ts$/.test(base)) return false;
  return parts.length > 1 || /\.(?:[cm]?js|css|html|json|wasm|ts|ico|png|jpe?g|webp|gif|svg|avif|mp[34]|ogg|wav|woff2?|ttf|otf)$/.test(base);
}

// This Windows release ships static skins and UI effects, but no character
// animation packs. Do not exclude all Spine files: lobbies and effects use them.
export function includeWindowsRuntimeFile(name, isDirectory = false) {
  const normalized = name.replaceAll("\\", "/");
  if (normalized.split("/").includes("本地动态皮肤包")) return false;
  if (/(?:^|\/)assets\/dynamic(?:\/|$)/i.test(normalized)) return false;
  return includeRuntimeFile(normalized, isDirectory);
}

export function parseWindowsArgs(args) {
  args = args.filter(arg => arg !== "--");
  if (args.some(arg => !["--help", "--dir", "--portable", "--installer", "--offline-only"].includes(arg)) || args.filter(arg => ["--dir", "--portable", "--installer"].includes(arg)).length > 1) throw new Error("参数错误，请使用 --help 查看用法。");
  return { help: args.includes("--help"), withOnline: !args.includes("--offline-only"),
    target: args.includes("--portable") ? "portable" : args.includes("--installer") ? "nsis" : "dir" };
}

export function windowsManifest(name, value) {
  const normalized = name.replaceAll("\\", "/");
  const parent = normalized.slice(0, normalized.lastIndexOf("/"));
  if (normalized === "game/config.json") {
    // The browser's existing View settings initialize this option to 10.
    // Desktop profiles are separate and can reach free choice before opening
    // that settings page. Supply the same default in the packaged config only;
    // saved preferences still override it in the unchanged engine loadConfig.
    return { showMax_character_number: 10, ui_workshop_active: "builtin-rzsh", ...value };
  }
  if (normalized.endsWith("/files.json") && Array.isArray(value)) {
    return value.filter(file => typeof file !== "string" || includeWindowsRuntimeFile(`${parent}/${file}`));
  }
  if (/\/(?:十周年局内UI|手杀标准UI\/native)\/animation-assets\.json$/.test(normalized)) {
    return { ...value, skins: {} };
  }
  return value;
}

function run(args, env = {}, cwd = root) {
  console.log(`\n> pnpm ${args.join(" ")}`);
  const child = spawnSync(process.platform === "win32" ? "pnpm.cmd" : "pnpm", args, {
    cwd, stdio: "inherit", shell: process.platform === "win32", windowsHide: true,
    env: { ...process.env, ...env },
  });
  if (child.error) throw child.error;
  if (child.status !== 0) throw new Error(`构建失败（退出码 ${child.status}），停止打包。`);
}

export async function validateRuntime(stage, withOnline) {
  const required = ["index.html", "noname.js", "noname/entry.js", "vendor/vue.js", "vendor/pinyin-pro.js", "vendor/dedent.js", "game/config.json", "service-worker.js", "jit-test.ts", "LICENSE"];
  if (withOnline) required.push("online-client/index.html", "online-client/deployment.json");
  for (const name of required) await access(join(stage, name));
  const html = await readFile(join(stage, "index.html"), "utf8");
  const map = /<script[^>]*type="importmap"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  if (!map) throw new Error("入口缺少 importmap");
  for (const url of Object.values(JSON.parse(map[1]).imports)) {
    if (typeof url !== "string" || !url.startsWith("/") || url.includes("..") || url.includes("node_modules")) throw new Error(`非独立运行依赖：${url}`);
    await access(join(stage, url));
  }
  const entries = ["noname.js", "noname/entry.js"];
  for (const entry of await readdir(join(stage, "extension"), { withFileTypes: true }).catch(error => {
    if (error.code === "ENOENT") return [];
    throw error;
  })) {
    if (!entry.isDirectory()) continue;
    for (const extension of ["js", "ts"]) {
      const name = `extension/${entry.name}/extension.${extension}`;
      try { await access(join(stage, name)); entries.push(name); } catch (error) { if (error.code !== "ENOENT") throw error; }
    }
  }
  await validateModuleImports(stage, entries, JSON.parse(map[1]).imports);
}

// Extensions are copied without bundling. Their static imports must resolve in
// the published tree too; copying engine source would instantiate a second core.
export async function validateModuleImports(stage, entries, imports = {}) {
  const ts = require("typescript");
  const visited = new Set();
  async function visit(name, importer) {
    name = name.replaceAll("\\", "/");
    if (visited.has(name)) return;
    visited.add(name);
    let source;
    try { source = await readFile(join(stage, name), "utf8"); }
    catch (error) { throw new Error(`打包模块缺失：${name}（引用自 ${importer || "入口"}）`, { cause: error }); }
    if (!/\.[cm]?[jt]s$/.test(name)) return;
    const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, false);
    for (const statement of file.statements) {
      if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
      const specifier = statement.moduleSpecifier;
      if (!specifier || !ts.isStringLiteral(specifier)) continue;
      const url = imports[specifier.text] || specifier.text;
      if (!url.startsWith(".") && !url.startsWith("/")) continue;
      const target = url.startsWith("/") ? resolve(stage, url.slice(1)) : resolve(stage, dirname(name), url);
      const key = relative(resolve(stage), target).replaceAll("\\", "/");
      if (key.startsWith("../")) throw new Error(`打包模块越界：${name} → ${url}`);
      await visit(key, name);
    }
  }
  for (const name of entries) await visit(name);
  return visited.size;
}

async function main() {
  const { help, withOnline, target } = parseWindowsArgs(process.argv.slice(2));
  if (help) {
    console.log("用法：pnpm build:exe [--dir | --portable | --installer] [--offline-only]\n默认生成 Windows x64 免安装运行目录（内含 noname.exe），分发时保留整个目录。\n--portable 生成单文件 EXE；--installer 生成安装包；两者受 NSIS 约 2 GiB 容量限制，当前完整资源应使用默认目录形式。\n本轮排除动态皮肤资源和所有 temp 目录，保留静态皮肤、音频和界面特效。\n--offline-only 不包含公共联机客户端，仍保留本地大厅、单机和扩展。输出：output/windows。");
    return;
  }
  if (process.platform !== "win32") throw new Error("请在 Windows 上运行 EXE 打包脚本。");
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 18)) throw new Error("请使用 Node.js 22.18 或更新版本（核心构建使用 import.meta.main）。");
  // Resolve tools before doing expensive builds; do not silently install packages.
  for (const name of ["tsx/cli", "./../apps/electron/node_modules/electron-builder/package.json"]) require.resolve(name);
  // Fail before expensive media collection if this checkout no longer has the
  // running server's release. Do not silently ship an incompatible new build.
  if (withOnline) await deployedOnlineRuntime(root, new URL(process.env.VITE_ONLINE_ORIGIN || "http://139.196.192.5").origin);
  const stage = resolve(root, "output/windows-stage");
  if (relative(root, stage).replaceAll("\\", "/") !== "output/windows-stage") throw new Error("打包暂存路径异常");
  await rm(stage, { recursive: true, force: true });
  await mkdir(stage, { recursive: true });
  const env = { NONAME_DESKTOP_BUILD: "1", NONAME_MOBILE_BUILD: "0", VITE_NONAME_MOBILE: "0", NONAME_PUBLIC_BUILD: "0", VITE_PUBLIC_ONLINE: "0" };
  run(["cards:check-art"], env);
  run(["--filter", "noname...", "build"], env);
  run(["--filter", "./packages/extension/**", "build"], env);

  const files = [];
  const excluded = [];
  let totalBytes = 0;
  async function copyTree(source, prefix = "") {
    if (prefix && !includeWindowsRuntimeFile(prefix, true)) { excluded.push(prefix); return; }
    async function walk(dir, sub = "") {
      for (const item of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, item.name);
        const name = [prefix, sub, item.name].filter(Boolean).join("/");
        if (!includeWindowsRuntimeFile(name, item.isDirectory())) { excluded.push(name); continue; }
        if (item.isSymbolicLink()) throw new Error(`不打包符号链接：${path}`);
        if (item.isDirectory()) await walk(path, [sub, item.name].filter(Boolean).join("/"));
        else if (item.isFile()) {
          await mkdir(dirname(join(stage, name)), { recursive: true });
          if (name === "game/config.json" || item.name === "files.json" || item.name === "animation-assets.json") {
            const contents = JSON.parse(await readFile(path, "utf8"));
            await writeFile(join(stage, name), JSON.stringify(windowsManifest(name, contents), null, 2) + "\n");
          } else await copyFile(path, join(stage, name));
          const bytes = (await stat(join(stage, name))).size;
          files.push({ path: name, bytes }); totalBytes += bytes;
          if (files.length % 5000 === 0) console.log(`已收集 ${files.length} 个运行文件…`);
        } else throw new Error(`不打包特殊文件：${path}`);
      }
    }
    await walk(source);
  }
  console.log("\n收集游戏运行文件（不复制整个工程）…");
  await copyTree(join(root, "apps/core/dist"));
  for (const name of ["audio", "image"]) await copyTree(join(root, "apps/core", name), name);
  const { extensionEntries } = await import("./extension-layout.mjs");
  const extensionRoot = join(root, "apps/core/extension");
  for (const entry of extensionEntries(extensionRoot)) await copyTree(entry.directory, `extension/${entry.name}`);
  for (const entry of await readdir(extensionRoot, { withFileTypes: true })) {
    if (entry.isFile() && /\.(js|ts)$/.test(entry.name)) {
      const name = `extension/${entry.name}`;
      const bytes = (await stat(join(extensionRoot, entry.name))).size;
      await mkdir(dirname(join(stage, name)), { recursive: true });
      await cp(join(extensionRoot, entry.name), join(stage, name));
      files.push({ path: name, bytes }); totalBytes += bytes;
    }
  }
  await cp(join(root, "LICENSE"), join(stage, "LICENSE"));
  const attribution = "无名杀 / noname\n源码出处：https://github.com/libnoname/noname\n许可证：GPL-3.0-only，详见 LICENSE。\n本包包含本工程修改及第三方扩展，各扩展许可证随运行资源保留。\n";
  await writeFile(join(stage, "NOTICE.txt"), attribution);
  if (withOnline) {
    run(["build:online:client", "--deployed-runtime"], { ...env, NONAME_DESKTOP_BUILD: "0" });
    await copyTree(join(root, "dist/online-client"), "online-client");
  }
  await validateRuntime(stage, withOnline);
  await mkdir(join(root, "output/windows"), { recursive: true });
  await writeFile(join(root, "output/windows/package-report.json"), JSON.stringify({
    builtAt: new Date().toISOString(), target, withOnline, dynamicSkins: false, excludeTemp: true, stage, totalBytes,
    fileCount: files.length, files: files.sort((a, b) => a.path.localeCompare(b.path)), excluded,
    note: "游戏资源暂存清单；桌面生产依赖另由 desktop-dependencies.mjs 收集，Electron 由打包器附带。LICENSE、NOTICE.txt 另行保留。",
  }, null, 2));
  console.log(`游戏资源 ${(totalBytes / 1024 ** 3).toFixed(2)} GiB，${files.length} 个文件；已排除 ${excluded.length} 个文件/目录。`);
  run(["--filter", "@noname/electron", "exec", "tsx", "build.ts", "win", target], { NONAME_DESKTOP_STAGE: stage });
  console.log(`\n完成：${join(root, "output/windows")}\n文件清单：output/windows/package-report.json`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
