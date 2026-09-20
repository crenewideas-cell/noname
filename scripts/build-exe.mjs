import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { cp, mkdir, readdir, readFile, rm, stat, writeFile, access } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const runtimeDirectories = new Set(["audio", "image", "extension", "card", "character", "mode", "font", "game", "layout", "theme", "thumbnail", "noname", "vendor", "online-client"]);
const ignoredDirectories = new Set([".git", ".github", ".cache", ".vite", "__pycache__", "Home"]);

// Scope exclusions to known non-runtime content. In particular, extension/src,
// .ts/.vue files and JSON manifests can be loaded by the game at runtime.
export function includeRuntimeFile(name, isDirectory = false) {
  const parts = name.replaceAll("\\", "/").split("/");
  const base = parts.at(-1);
  if (parts.some(part => ignoredDirectories.has(part))) return false;
  if (parts.some(part => part === "动态资源" || part.endsWith("_配音"))) return false;
  if (parts[0] === "extension" && parts[1] === "红楼幻境" && parts[2] === "voice" && parts[3] === "import") return false;
  if (parts.length > 1 && !runtimeDirectories.has(parts[0])) return false;
  if (isDirectory) return parts.length > 1 || runtimeDirectories.has(base);
  if (/license|copying|notice/i.test(base)) return true;
  if (/\.(?:map|md|log|tmp|bak|orig|rej|zip|7z|rar|psd|aep|blend)$/i.test(base)) return false;
  if (/^(?:thumbs\.db|desktop\.ini|\.DS_Store|pnpm-lock\.yaml|package-lock\.json|yarn\.lock)$/i.test(base)) return false;
  if (/\.(?:test|spec)\.[cm]?[jt]s$/i.test(base) || /\.d\.ts$/.test(base)) return false;
  return parts.length > 1 || /\.(?:[cm]?js|css|html|json|wasm|ts|ico|png|jpe?g|webp|gif|svg|avif|mp[34]|ogg|wav|woff2?|ttf|otf)$/.test(base);
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
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("用法：pnpm build:exe [--dir | --portable | --installer] [--offline-only]\n默认生成 Windows x64 免安装运行目录（内含 noname.exe）；--portable 生成自解压单文件 EXE；--installer 生成安装包。\n--offline-only 不包含公共联机客户端，仍保留本地大厅、单机和扩展。输出：output/windows。");
    return;
  }
  if (args.some(arg => !["--dir", "--portable", "--installer", "--offline-only"].includes(arg)) || args.filter(arg => ["--dir", "--portable", "--installer"].includes(arg)).length > 1) throw new Error("参数错误，请使用 --help 查看用法。");
  if (process.platform !== "win32") throw new Error("请在 Windows 上运行 EXE 打包脚本。");
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 18)) throw new Error("请使用 Node.js 22.18 或更新版本（核心构建使用 import.meta.main）。");
  // Resolve tools before doing expensive builds; do not silently install packages.
  for (const name of ["tsx/cli", "./../apps/electron/node_modules/electron-builder/package.json"]) require.resolve(name);
  const stage = resolve(root, "output/windows-stage");
  if (relative(root, stage).replaceAll("\\", "/") !== "output/windows-stage") throw new Error("打包暂存路径异常");
  await rm(stage, { recursive: true, force: true });
  await mkdir(stage, { recursive: true });
  const withOnline = !args.includes("--offline-only");
  const target = args.includes("--portable") ? "portable" : args.includes("--installer") ? "nsis" : "dir";
  const env = { NONAME_DESKTOP_BUILD: "1", NONAME_PUBLIC_BUILD: "0", VITE_PUBLIC_ONLINE: "0" };
  run(["--filter", "noname...", "build"], env);
  run(["--filter", "./packages/extension/**", "build"], env);

  const files = [];
  const excluded = [];
  let totalBytes = 0;
  async function copyTree(source, prefix = "") {
    async function walk(dir, sub = "") {
      for (const item of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, item.name);
        const name = [prefix, sub, item.name].filter(Boolean).join("/");
        if (!includeRuntimeFile(name, item.isDirectory())) { excluded.push(name); continue; }
        if (item.isSymbolicLink()) throw new Error(`不打包符号链接：${path}`);
        if (item.isDirectory()) await walk(path, [sub, item.name].filter(Boolean).join("/"));
        else if (item.isFile()) {
          const bytes = (await stat(path)).size;
          await mkdir(dirname(join(stage, name)), { recursive: true });
          await cp(path, join(stage, name));
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
    run(["build:online:client"], { NONAME_DESKTOP_BUILD: "0" });
    await copyTree(join(root, "dist/online-client"), "online-client");
  }
  await validateRuntime(stage, withOnline);
  await mkdir(join(root, "output/windows"), { recursive: true });
  await writeFile(join(root, "output/windows/package-report.json"), JSON.stringify({
    builtAt: new Date().toISOString(), target, withOnline, stage, totalBytes,
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
