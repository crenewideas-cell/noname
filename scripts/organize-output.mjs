import { readdir, mkdir, lstat, rename } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function outputCategory(name) {
  if (!/^output-.+\.(log|tmp|png|jpg|jpeg|webp|json|txt|html|csv)$/i.test(name)) return null;
  const area = /^output-android-/i.test(name) ? "android" : "misc";
  const kind = /\.log$/i.test(name) ? "logs" : /\.(png|jpg|jpeg|webp)$/i.test(name) ? "screenshots" : /\.tmp$/i.test(name) ? "tmp" : "reports";
  return join("output", area, kind);
}

// Only move recognized root-level files. Never overwrite an earlier run or
// follow a directory/symlink into another workspace.
export async function organizeOutput(root = projectRoot) {
  const moved = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const category = outputCategory(entry.name);
    if (!entry.isFile() || !category) continue;
    const directory = join(root, category);
    let parent = root;
    for (const segment of category.split(/[\\/]/)) {
      parent = join(parent, segment);
      await mkdir(parent).catch(error => { if (error.code !== "EEXIST") throw error; });
      const info = await lstat(parent);
      if (!info.isDirectory() || info.isSymbolicLink()) throw new Error(`输出目录不是普通目录：${parent}`);
    }
    let destination = join(directory, entry.name);
    for (let suffix = 1; ; suffix++) {
      try { await lstat(destination); }
      catch (error) { if (error.code === "ENOENT") break; throw error; }
      destination = join(directory, `${entry.name}.${suffix}`);
    }
    await rename(join(root, entry.name), destination);
    moved.push(destination);
  }
  return moved;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const moved = await organizeOutput();
  console.log(`已归档 ${moved.length} 个文件。`, ...moved.map(path => `\n${path}`));
}
