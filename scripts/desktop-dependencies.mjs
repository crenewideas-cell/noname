import { createRequire } from "node:module";
import { cp, mkdir, readFile, realpath, access } from "node:fs/promises";
import { join } from "node:path";

// electron-builder's pnpm collector can miss dependencies behind workspace links.
// Materialize the runtime dependency tree, without development tools or symlinks.
export async function copyDesktopDependencies(project, output) {
  const copied = [];
  async function copy(name, parent, destination, ancestors = new Map()) {
    const require = createRequire(join(parent, "package.json"));
    let source;
    for (const base of require.resolve.paths(`${name}/package.json`) || []) {
      try { await access(join(base, name, "package.json")); source = await realpath(join(base, name)); break; } catch { /* Continue through Node's package lookup paths. */ }
    }
    if (!source) throw new Error(`缺少桌面运行依赖 ${name}（来源 ${parent}），请执行 pnpm install --frozen-lockfile。`);
    if (ancestors.get(name) === source) return;
    const target = join(destination, name);
    const manifest = JSON.parse(await readFile(join(source, "package.json"), "utf8"));
    await mkdir(target, { recursive: true });
    await cp(source, target, { recursive: true, dereference: true, filter: path => {
      const relative = path.slice(source.length).replaceAll("\\", "/");
      if (/^\/(node_modules|\.git|test|tests|docs|example|examples|coverage)(\/|$)/.test(relative)) return false;
      if (/license|copying|notice/i.test(relative.split("/").at(-1))) return true;
      return !/\.(?:d\.ts|map|md)$/.test(relative);
    } });
    copied.push({ name, version: manifest.version });
    const chain = new Map(ancestors).set(name, source);
    for (const dependency of Object.keys(manifest.dependencies || {})) {
      if (manifest.optionalDependencies?.[dependency]) continue;
      await copy(dependency, source, join(target, "node_modules"), chain);
    }
  }
  for (const name of ["@electron/remote", "@noname/fs", "ws"]) await copy(name, project, output);
  return copied;
}
