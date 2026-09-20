import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync, createWriteStream, createReadStream } from "node:fs";
import { access, cp, mkdir, open, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, delimiter, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { createHash } from "node:crypto";
import { includeRuntimeFile, validateRuntime } from "./build-exe.mjs";
import { validateApk } from "./android-apk.mjs";
import { extensionEntries, resolveExtensionPath } from "./extension-layout.mjs";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mobile = join(root, "apps/mobile");
const android = join(mobile, "android");
const stage = join(root, "output/android-stage");
const output = join(root, "output/android");

export function parseArgs(args) {
  args = args.filter(arg => arg !== "--");
  for (const arg of args) {
    if (!["--help", "--check", "--aab", "--skip-web-build", "--variant=debug", "--variant=release"].includes(arg)) throw new Error(`未知参数：${arg}；使用 --help 查看用法。`);
  }
  if (args.filter(arg => arg.startsWith("--variant=")).length > 1) throw new Error("只能指定一个 variant。");
  return { help: args.includes("--help"), check: args.includes("--check"), aab: args.includes("--aab"),
    skipWeb: args.includes("--skip-web-build"), variant: args.includes("--variant=debug") ? "debug" : "release" };
}

export function findJavaHome(env = process.env) {
  const executable = process.platform === "win32" ? "java.exe" : "java";
  const candidates = [env.ANDROID_JAVA_HOME, env.JAVA_HOME];
  const parents = [];
  for (const dir of (env.PATH || env.Path || "").split(delimiter)) {
    if (existsSync(join(dir, executable))) {
      const home = resolve(dir, ".."); candidates.push(home); parents.push(resolve(home, ".."));
    }
  }
  parents.push(join(env.USERPROFILE || env.HOME || root, ".jdks"), "C:/Program Files/Java", "C:/Program Files/Eclipse Adoptium", "/usr/lib/jvm");
  candidates.push("C:/Program Files/Android/Android Studio/jbr");
  for (const parent of parents) if (existsSync(parent)) {
    for (const item of readdirSync(parent, { withFileTypes: true })) if (item.isDirectory()) candidates.push(join(parent, item.name));
  }
  for (const home of [...new Set(candidates.filter(Boolean))]) {
    const release = join(home, "release");
    if (!existsSync(release) || !/^JAVA_VERSION="21[."]/m.test(readFileSync(release, "utf8"))) continue;
    if (existsSync(join(home, "bin", executable)) && existsSync(join(home, "bin", process.platform === "win32" ? "javac.exe" : "javac"))) return resolve(home);
  }
  throw new Error("未找到 JDK 21。安装后设置 ANDROID_JAVA_HOME 指向 JDK 21 目录（不会修改系统 Java 设置）。");
}

function run(command, args, cwd, env) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const batch = process.platform === "win32" && /\.(cmd|bat)$/i.test(command);
  const quote = value => {
    if (/["%\r\n]/.test(value)) throw new Error("构建路径/参数不能含双引号、百分号或换行。");
    return `"${value}"`;
  };
  const result = spawnSync(batch ? [command, ...args].map(quote).join(" ") : command, batch ? [] : args,
    { cwd, env, stdio: "inherit", windowsHide: true, shell: batch });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`构建步骤失败（退出码 ${result.status}），已停止打包。`);
}

function environment() {
  const env = { ...process.env };
  env.JAVA_HOME = findJavaHome(env);
  const sdk = env.ANDROID_HOME || env.ANDROID_SDK_ROOT || join(env.LOCALAPPDATA || "", "Android/Sdk");
  if (!existsSync(join(sdk, "platform-tools"))) throw new Error("未找到 Android SDK，请设置 ANDROID_HOME（需要 API 36，已接受 SDK 许可时 Gradle 会自动补齐缺失组件）。");
  env.ANDROID_HOME = env.ANDROID_SDK_ROOT = resolve(sdk);
  const path = env.PATH || env.Path || "";
  for (const key of Object.keys(env)) if (key.toLowerCase() === "path") delete env[key];
  env.PATH = `${join(env.JAVA_HOME, "bin")}${delimiter}${path}`;
  let proxy = env.NONAME_ANDROID_PROXY || env.HTTPS_PROXY || env.HTTP_PROXY;
  if (!proxy && process.platform === "win32") {
    const settings = spawnSync("reg.exe", ["query", "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"], { encoding: "utf8", windowsHide: true }).stdout || "";
    if (/ProxyEnable\s+REG_DWORD\s+0x1/.test(settings)) {
      const server = /ProxyServer\s+REG_SZ\s+([^\r\n]+)/.exec(settings)?.[1]?.trim();
      if (server && /^[\w.-]+:\d+$/.test(server)) proxy = `http://${server}`;
    }
  }
  if (proxy) {
    const url = new URL(proxy);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Android 构建代理请使用不带凭据的 HTTP 代理地址：NONAME_ANDROID_PROXY=http://host:port");
    env.JAVA_TOOL_OPTIONS = `${env.JAVA_TOOL_OPTIONS || ""} -Dhttps.proxyHost=${url.hostname} -Dhttps.proxyPort=${url.port || "80"} -Dhttp.proxyHost=${url.hostname} -Dhttp.proxyPort=${url.port || "80"}`;
    console.log(`使用构建代理：${url.hostname}:${url.port || "80"}`);
  }
  Object.assign(env, { NONAME_MOBILE_BUILD: "1", VITE_NONAME_MOBILE: "1", NONAME_DESKTOP_BUILD: "0", NONAME_PUBLIC_BUILD: "0", VITE_PUBLIC_ONLINE: "0", NONAME_MOBILE_WEB_DIR: stage });
  console.log(`JDK 21: ${env.JAVA_HOME}\nAndroid SDK: ${env.ANDROID_HOME}`);
  return env;
}

export async function collectRuntime(source, prefix = "") {
  const files = [];
  async function walk(dir, key) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const name = [key, item.name].filter(Boolean).join("/");
      if (!includeRuntimeFile(name, item.isDirectory())) continue;
      if (item.isSymbolicLink()) throw new Error(`资源中含符号链接：${name}`);
      if (item.isDirectory()) await walk(join(dir, item.name), name);
      else if (item.isFile()) files.push({ source: join(dir, item.name), path: name, bytes: (await stat(join(dir, item.name))).size });
    }
  }
  await walk(source, prefix);
  return files;
}

export async function writeResourceZip(files, destination) {
  const { ZipFile } = require("yazl");
  const zip = new ZipFile();
  const temporary = `${destination}.${process.pid}.partial`;
  const writing = pipeline(zip.outputStream, createWriteStream(temporary, { flags: "wx" }));
  zip.on("error", error => zip.outputStream.destroy(error));
  for (const file of files) zip.addFile(file.source, file.path);
  zip.end();
  try { await writing; await rename(temporary, destination); }
  finally { await rm(temporary, { force: true }); }
}

export async function acquireBuildLock(path) {
  let handle;
  try { handle = await open(path, "wx"); }
  catch (error) {
    if (error.code !== "EEXIST") throw error;
    const pid = Number(await readFile(path, "utf8"));
    if (!Number.isSafeInteger(pid) || pid <= 0) throw new Error("另一个 Android 打包正在初始化，请稍后重试。");
    try { process.kill(pid, 0); }
    catch (error) {
      if (error.code !== "ESRCH") throw error;
      await rm(path); return acquireBuildLock(path);
    }
    throw new Error(`Android 打包已在运行（PID ${pid}），请等待完成，避免覆盖中间产物。`);
  }
  await handle.writeFile(String(process.pid));
  return async () => { await handle.close(); await rm(path, { force: true }); };
}

async function digest(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

async function forEachFile(files, action) {
  const queue = files.values();
  await Promise.all(Array.from({ length: 8 }, async () => {
    for (const file of queue) await action(file);
  }));
}

export async function sameContent(first, second, bytes) {
  if (bytes > 16 * 1024 * 1024) return await digest(first) === await digest(second);
  const [a, b] = await Promise.all([readFile(first), readFile(second)]);
  return a.equals(b);
}

export async function main(args = process.argv.slice(2)) {
  const options = parseArgs(args);
  if (options.help) {
    console.log("用法：build-android.cmd [--variant=release|debug] [--aab] [--check] [--skip-web-build]\n默认：可直接安装的 release APK + 全部扩展 ZIP；输出 output/android。\n--check 仅检查环境；--skip-web-build 复用 output/android-stage，源码修改后应完整构建。\n需要 Node.js >=22.18、pnpm 10、JDK 21、Android SDK 36。首次构建需要联网。\nANDROID_JAVA_HOME 可指定 JDK；NONAME_ANDROID_PROXY 可指定下载代理。无正式密钥时使用开发签名。");
    return;
  }
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || major === 22 && minor < 18) throw new Error("需要 Node.js 22.18 或更新版本。");
  for (const dep of ["tsx/cli", "yazl", "../apps/mobile/node_modules/@capacitor/cli/package.json"]) require.resolve(dep);
  const env = environment();
  const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  run(join(env.JAVA_HOME, "bin", "java"), ["-version"], root, env);
  if (options.check) { console.log("环境检查通过；首次构建会进一步检查/下载 SDK 和 Gradle 依赖。"); return; }
  await mkdir(output, { recursive: true });
  const releaseLock = await acquireBuildLock(join(root, "output/android-build.lock"));
  try {
  await rm(join(output, "build-report.json"), { force: true });
  if (!options.skipWeb) {
    run(pnpm, ["--filter", "noname...", "build"], root, env);
    run(pnpm, ["--filter", "./packages/extension/**", "build"], root, env);
    if (resolve(stage) !== resolve(root, "output/android-stage")) throw new Error("暂存路径异常");
    await rm(stage, { recursive: true, force: true }); await mkdir(stage, { recursive: true });
    const files = await collectRuntime(join(root, "apps/core/dist"));
    for (const dir of ["audio", "image"]) files.push(...await collectRuntime(join(root, "apps/core", dir), dir));
    const equipment = resolveExtensionPath(join(root, "apps/core"), "extension/絶伦逸羣");
    if (existsSync(equipment)) files.push(...await collectRuntime(equipment, "extension/絶伦逸羣"));
    console.log(`复制 ${files.length} 个本体运行文件…`);
    await forEachFile(files, async file => { await mkdir(dirname(join(stage, file.path)), { recursive: true }); await cp(file.source, join(stage, file.path)); });
    await cp(join(root, "LICENSE"), join(stage, "LICENSE"));
    run(pnpm, ["build:online:client"], root, { ...env, NONAME_MOBILE_BUILD: "0", VITE_NONAME_MOBILE: "0" });
    await forEachFile(await collectRuntime(join(root, "dist/online-client"), "online-client"), async file => {
      const shared = join(stage, file.path.slice("online-client/".length));
      if (/^online-client\/(audio|image|font)\//.test(file.path) && existsSync(shared)
        && (await stat(shared)).size === file.bytes && await sameContent(shared, file.source, file.bytes)) return;
      await mkdir(dirname(join(stage, file.path)), { recursive: true }); await cp(file.source, join(stage, file.path));
    });
  }
  await validateRuntime(stage, true);
  run(pnpm, ["--filter", "@noname/mobile", "sync"], root, env);
  const task = `:app:${options.aab ? "bundle" : "assemble"}${options.variant === "debug" ? "Debug" : "Release"}`;
  run(process.platform === "win32" ? "gradlew.bat" : "bash", [...(process.platform === "win32" ? [] : ["gradlew"]), ":app:clean", task, "--no-daemon", "--max-workers=2", "--console=plain", "--stacktrace"], android, env);
  const extension = options.aab ? "aab" : "apk";
  const artifact = join(android, "app/build/outputs", options.aab ? "bundle" : "apk", options.variant, `app-${options.variant}.${extension}`);
  await access(artifact);
  if (!options.aab) {
    console.log("检查 APK 原生类及游戏入口…", await validateApk(artifact));
    const buildTools = (await readdir(join(env.ANDROID_HOME, "build-tools"))).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    const signer = buildTools.map(version => join(env.ANDROID_HOME, "build-tools", version, process.platform === "win32" ? "apksigner.bat" : "apksigner")).find(existsSync);
    if (!signer) throw new Error("未找到 apksigner，无法确认 APK 签名。");
    run(signer, ["verify", "--verbose", artifact], root, env);
  }
  const packaged = join(output, `noname-${options.variant}.${extension}`); await cp(artifact, packaged);
  console.log("生成全部扩展资源包（大文件，可能需要数分钟）…");
  const extensionRoot = join(root, "apps/core/extension");
  const resources = [];
  for (const entry of extensionEntries(extensionRoot)) resources.push(...await collectRuntime(entry.directory, `extension/${entry.name}`));
  for (const entry of await readdir(extensionRoot, { withFileTypes: true })) {
    if (entry.isFile() && /\.(js|ts)$/.test(entry.name)) {
      const source = join(extensionRoot, entry.name);
      resources.push({ source, path: `extension/${entry.name}`, bytes: (await stat(source)).size });
    }
  }
  const resourceZip = join(output, "noname-extensions.zip"); await writeResourceZip(resources, resourceZip);
  await cp(join(root, "LICENSE"), join(output, "LICENSE"));
  await writeFile(join(output, "安装说明.txt"), `无名杀 Android\n\n1. 安装 noname-${options.variant}.apk（AAB 仅供发布工具使用，不能直接安装）。\n2. 将 noname-extensions.zip 解压到手机普通目录，例如 Documents/noname，确认其下直接有 extension 文件夹。不要选择 Android/data、存储根目录或 Download 根目录。\n3. 首次启动时授予该 noname 目录读写权限。本体从 APK 读取，无须再复制本体。也可先选空目录体验本体，之后退出应用、解压资源到该目录并重启。\n4. 在扩展菜单中按需开启扩展；新发现的扩展默认关闭。\n5. 升级时使用相同签名；正式发布请配置自己的 keystore.properties 并备份密钥。\n\n本体包含絶伦逸羣，修复版本也在资源包内；旧资源覆盖包内同名文件，更新时请同步替换资源包中的 extension/絶伦逸羣。\n源码：https://github.com/libnoname/noname；本包含本工程修改，GPL-3.0-only，见 LICENSE。\n`);
  const artifacts = [];
  for (const path of [packaged, resourceZip]) artifacts.push({ path, bytes: (await stat(path)).size, sha256: await digest(path) });
  await writeFile(join(output, "build-report.json"), JSON.stringify({ builtAt: new Date().toISOString(), variant: options.variant,
    artifacts, extensionFileCount: resources.length, extensionBytes: resources.reduce((sum, file) => sum + file.bytes, 0),
    validation: "Web runtime validated; Gradle build succeeded; APK signature verified when applicable. Device testing is separate." }, null, 2));
  console.log(`\n完成：${output}\n请阅读 output/android/安装说明.txt；校验信息见 build-report.json。`);
  } finally { await releaseLock(); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
