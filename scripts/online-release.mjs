import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

// Installed clients must carry the published code, not a new build of a dirty
// checkout with the server's ID pasted into it. Media is assembled separately.
export async function deployedOnlineRuntime(root, origin, fetchImpl = fetch) {
  const directory = resolve(root, "dist-online-host");
  let manifest;
  try { manifest = JSON.parse(await readFile(resolve(directory, "deployment.json"), "utf8")); }
  catch { throw new Error("缺少已发布联机运行代码 dist-online-host，请先取得与服务器配套的发布产物；仅打单机包可使用 --offline-only。"); }
  if (manifest.kind !== "host" || !/^online-[a-f0-9]{20}$/.test(manifest.build)
    || manifest.origin !== origin) throw new Error("已发布联机运行代码的来源或版本无效，请使用目标服务器对应的 dist-online-host。");
  for (const file of ["index.html", "noname.js", "noname/entry.js", "client.js", "vendor/vue.js"]) {
    await access(resolve(directory, file));
  }
  const client = await readFile(resolve(directory, "client.js"), "utf8");
  if (!client.includes(JSON.stringify(manifest.build)) || !client.includes(JSON.stringify(origin))) {
    throw new Error("已发布联机代码与 deployment.json 不一致，不能只修改版本号。");
  }
  let caps;
  try {
    const response = await fetchImpl(new URL("/api/v1/capabilities", origin), {
      signal: AbortSignal.timeout(15000), headers: { "Cache-Control": "no-cache" }, redirect: "error",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    caps = await response.json();
  } catch (error) { throw new Error(`无法核对联机服务器版本：${error.message}`, { cause: error }); }
  if (caps.ok !== true || caps.build !== manifest.build) {
    throw new Error(`联机发布版本不一致：本地 ${manifest.build}，服务器 ${caps.build || "未知"}。请取得服务器对应的 dist-online-host 后重新打包。`);
  }
  return { directory, build: manifest.build, origin };
}
