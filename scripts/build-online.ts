import { spawnSync } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, relative } from "node:path";

// Deliberately uses the core dependency graph, not the extension build script.
const root = fileURLToPath(new URL("../", import.meta.url));
const result = spawnSync(process.platform === "win32" ? "pnpm.cmd" : "pnpm", ["--filter", "noname...", "build"], {
  cwd: root, stdio: "inherit", shell: process.platform === "win32",
  env: { ...process.env, NONAME_PUBLIC_BUILD: "1", VITE_PUBLIC_ONLINE: "1", VITE_ONLINE_BUILD_ID: process.env.VITE_ONLINE_BUILD_ID || "online-phase3-v1" },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
const output = resolve(root, "dist-online");
if (relative(root, output) !== "dist-online") throw new Error("Unexpected output directory");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "apps/core/dist"), output, { recursive: true, filter: source => !["src", "extension"].includes(relative(resolve(root, "apps/core/dist"), source).split(/[\\/]/)[0]) });
await cp(resolve(root, "apps/core/image"), resolve(output, "image"), { recursive: true });
await cp(resolve(root, "apps/core/audio"), resolve(output, "audio"), { recursive: true });
await cp(resolve(root, "LICENSE"), resolve(output, "LICENSE"));
console.log("公网本体资源已输出到 dist-online；未包含扩展包。");
