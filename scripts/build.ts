import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import { copyExtensions } from "./extension-layout.mjs";
const cardArtCheck = spawnSync(process.execPath, ["scripts/check-card-art.mjs"], { stdio: "inherit" });
if (cardArtCheck.status !== 0) throw new Error("卡牌素材检查未通过，已停止构建");
spawnSync("pnpm -F noname... build", {
	shell: true,
	stdio: "inherit",
});

spawnSync("pnpm -F ./packages/extension/** build", {
	shell: true,
	stdio: "inherit",
});

console.log("合并打包结果");
await fs.rm("dist", { recursive: true, force: true });
await fs.mkdir("dist", { recursive: true });
await Promise.all([
	fs.cp("apps/core/dist", "dist", { recursive: true }),
	fs.cp("apps/core/audio", "dist/audio", { recursive: true }),
	fs.cp("apps/core/image", "dist/image", { recursive: true }),
	copyExtensions("apps/core/extension", "dist/extension"),
	fs.cp("docs", "dist/docs", { recursive: true }),
	fs.cp(".nomedia", "dist/.nomedia"),
	fs.cp("LICENSE", "dist/LICENSE"),
	fs.cp("README.md", "dist/README.md")
]);
