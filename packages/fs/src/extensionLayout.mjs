import { existsSync, readdirSync, lstatSync } from "node:fs";
import path from "node:path";
import fs from "node:fs/promises";

// Source folders are classified; published games retain extension/<identity> URLs.
export const extensionCategories = {
  characters: "独立武将", packs: "武将扩展包", collections: "合并扩展包",
  ui: "界面与特效", archived: "已停用归档", imports: "新导入待分类",
};

export function extensionEntries(root, includeArchived = false) {
  if (!existsSync(root)) return [];
  const result = [];
  const add = (name, directory, category) => {
    if (name.startsWith(".") || name.startsWith("_") || lstatSync(directory).isSymbolicLink()) return;
    if (result.some(item => item.name === name)) throw new Error(`扩展目录重名：${name}`);
    result.push({ name, directory, category });
  };
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (Object.hasOwn(extensionCategories, entry.name)) {
      if (entry.name === "archived" && !includeArchived) continue;
      for (const child of readdirSync(path.join(root, entry.name), { withFileTypes: true })) {
        if (child.isDirectory()) add(child.name, path.join(root, entry.name, child.name), entry.name);
      }
    } else add(entry.name, path.join(root, entry.name), "imports");
  }
  return result;
}

export function resolveExtensionPath(core, relative, forWrite = false) {
  const normalized = relative.replaceAll("\\", "/").replace(/^\/+/, "");
  const parts = normalized.split("/");
  if (parts.some(part => part === ".." || part.includes("\0"))) throw new Error("无效资源路径");
  const root = path.join(core, "extension");
  if (parts[0] !== "extension" || !parts[1] || parts[1].startsWith("_") || Object.hasOwn(extensionCategories, parts[1])) return path.resolve(core, normalized);
  const entry = extensionEntries(root, true).find(item => item.name === parts[1]);
  if (entry) return path.join(entry.directory, ...parts.slice(2));
  // Only a classified source tree redirects new imports. A published game stays flat.
  if (forWrite && existsSync(path.join(root, "imports"))) return path.join(root, "imports", ...parts.slice(1));
  return path.resolve(core, normalized);
}

/** Remove source registrations after a confirmed game-side directory deletion. */
export async function forgetExtension(core, name) {
  const update = async (file, edit) => {
    const target = path.join(core, "game", file);
    let value;
    try { value = JSON.parse(await fs.readFile(target, "utf8")); }
    catch (error) { if (error.code === "ENOENT") return; throw error; }
    await fs.writeFile(target, JSON.stringify(edit(value), null, 2) + "\n");
  };
  await update("organized-extensions.json", rows => rows.filter(row => row.name !== name));
  await update("bundled-extensions.json", rows => rows.filter(item => item !== name));
  await update("extension-catalog.json", rows => rows.filter(row => row.name !== name));
  await update("extension-groups.json", rows => rows.map(row => ({ ...row, members: row.members.filter(item => item !== name) })));
  await update("character-menu-groups.json", value => ({ ...value, groups: value.groups.map(row => ({ ...row, members: row.members.filter(item => item !== name) })) }));
  await update("organized-extension-status.json", value => ({ ...value, disabled: value.disabled.filter(row => row.name !== name) }));
}
