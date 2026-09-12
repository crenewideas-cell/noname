import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assembleOnline, onlineBuildId } from "./online-artifacts.ts";

// Deliberately uses the core dependency graph, not the extension build script.
const root = fileURLToPath(new URL("../", import.meta.url));
const client = process.argv.includes("--client");
const build = await onlineBuildId(root);
const origin = new URL(process.env.VITE_ONLINE_ORIGIN || "http://139.196.192.5").origin;
if (!/^https?:\/\//.test(origin)) throw new Error("Invalid online server origin");
const result = spawnSync(process.platform === "win32" ? "pnpm.cmd" : "pnpm", ["--filter", "noname...", "build"], {
  cwd: root, stdio: "inherit", shell: process.platform === "win32",
  env: { ...process.env, NONAME_PUBLIC_BUILD: "1", VITE_PUBLIC_ONLINE: "1", VITE_ONLINE_ORIGIN: origin, VITE_ONLINE_BUILD_ID: build },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
const output = await assembleOnline(root, client, build, origin);
console.log(`${client ? "本地联机客户端（含媒体资源）" : "服务端对局运行代码（不含媒体资源）"}: ${output}\nBuild: ${build}`);
