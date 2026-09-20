import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { createHash, randomUUID } from "node:crypto";
import { core, root, entryFor, files, sources, listCharacters } from "./model.js";
import { extensionCategories } from "../../packages/fs/src/extensionLayout.mjs";

const digest = (text: string) => createHash("sha256").update(text).digest("hex");
const slash = (value: string) => value.replaceAll("\\", "/");
const editable = /\.(js|ts|json|css|html|md|txt)$/i;
export function validName(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || value !== value.trim() || value.length > 100 || /[<>:"/\\|?*\x00-\x1f]/.test(value) || /[. ]$/.test(value) || /^(con|prn|aux|nul|com\d|lpt\d)(\.|$)/i.test(value) || value.startsWith(".")) throw new Error("名称不能为空，且不能包含路径分隔符、保留字符或点前缀");
  return value;
}
export async function safePath(name: string, relative = "") {
  const entry = entryFor(name);
  const base = await fs.realpath(entry.directory);
  if (!path.relative(root, base) || path.relative(root, base).startsWith("..") || path.isAbsolute(path.relative(root, base))) throw new Error("扩展路径超出管理目录");
  if (typeof relative !== "string" || path.isAbsolute(relative) || relative.includes("\\") || relative.split("/").some(part => part === "." || part === ".." || part && /[:\x00-\x1f]/.test(part))) throw new Error("无效相对路径");
  const target = path.resolve(base, relative);
  if (path.relative(base, target).startsWith("..") || path.isAbsolute(path.relative(base, target))) throw new Error("路径超出扩展目录");
  let current = base;
  for (const segment of relative.split("/").filter(Boolean)) {
    current = path.join(current, segment);
    const stat = await fs.lstat(current).catch((error: any) => { if (error.code !== "ENOENT") throw error; return null; });
    if (stat?.isSymbolicLink()) throw new Error("不允许访问符号链接");
  }
  return target;
}
export async function writeAtomic(file: string, text: string) {
  const temporary = `${file}.${randomUUID()}.manager-tmp`;
  try { await fs.writeFile(temporary, text, { flag: "wx" }); await fs.rename(temporary, file); }
  finally { await fs.rm(temporary, { force: true }); }
}
async function writeChanges(changes: { file: string; before: string; after: string }[]) {
  for (const item of changes) if (await fs.readFile(item.file, "utf8") !== item.before) throw new Error("文件已被其他编辑器修改，请重新读取");
  const done: typeof changes = [];
  try { for (const item of changes) { await writeAtomic(item.file, item.after); done.push(item); } }
  catch (error) { for (const item of done.reverse()) await writeAtomic(item.file, item.before); throw error; }
}
export async function directory(name: string, relative = "") {
  const target = await safePath(name, relative);
  const entries = await fs.readdir(target, { withFileTypes: true });
  return { path: relative, entries: entries.filter(item => !item.isSymbolicLink() && !item.name.startsWith(".")).map(item => ({ name: item.name, path: [relative, item.name].filter(Boolean).join("/"), directory: item.isDirectory(), editable: editable.test(item.name) })).sort((a, b) => Number(b.directory) - Number(a.directory) || a.name.localeCompare(b.name, "zh-CN")) };
}
export async function readSource(name: string, relative: string) {
  const file = await safePath(name, relative);
  if (!editable.test(file) || (await fs.stat(file)).size > 4 * 1024 * 1024) throw new Error("仅支持编辑 4 MB 以内的文本源码");
  const text = await fs.readFile(file, "utf8");
  return { path: relative, text, revision: digest(text) };
}
function validateSource(file: string, text: string) {
  if (file.endsWith(".json")) JSON.parse(text);
  if (/\.[jt]s$/.test(file)) {
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const errors = (ast as any).parseDiagnostics;
    if (errors.length) throw new Error("无法保存：" + ts.flattenDiagnosticMessageText(errors[0].messageText, "\n"));
  }
}
export async function saveSource(data: any) {
  const current = await readSource(data.name, data.path);
  if (current.revision !== data.revision) throw new Error("文件已变化，请重新打开后编辑");
  if (typeof data.text !== "string" || data.text.length > 4 * 1024 * 1024) throw new Error("源码过大");
  validateSource(data.path, data.text);
  await writeAtomic(await safePath(data.name, data.path), data.text);
  return { revision: digest(data.text) };
}
export async function createSource(data: any) {
  const file = await safePath(data.name, [data.path, validName(data.leaf)].filter(Boolean).join("/"));
  if (!editable.test(file)) throw new Error("请选择 JS、TS、JSON、CSS、HTML、MD 或 TXT 文件名");
  const text = file.endsWith(".json") ? "{}\n" : "";
  await fs.writeFile(file, text, { flag: "wx" });
  return { path: [data.path, data.leaf].filter(Boolean).join("/") };
}
const runtime = `// Generated extension composition; every resource remains inside this extension.
export async function compose(base, args, names, url) {
  base.package ||= {};
  const children = [];
  for (const name of names) {
    const module = await import(new URL('./managed/' + encodeURIComponent(name) + '/extension.js', url).href);
    children.push(typeof module.default === 'function' ? await module.default(...args) : module.default);
  }
  const precontent = base.precontent, content = base.content;
  base.precontent = async function(...parameters) {
    await precontent?.apply(this, parameters);
    for (const child of children) await child.precontent?.({ enable: true }, child.package);
  };
  base.content = async function(config, pack) {
    await content?.call(this, config, pack);
    for (const child of children) {
      await child.content?.({ enable: true }, child.package);
      for (const section of ['character', 'card', 'skill']) {
        const target = pack[section] ||= {};
        for (const [field, value] of Object.entries(child.package?.[section] || {})) {
          if (Array.isArray(value)) (target[field] ||= []).push(...value);
          else if (value && typeof value === 'object') Object.assign(target[field] ||= {}, value);
        }
      }
    }
  };
  return base;
}
`;
function template(name: string) {
  return `export const type = "extension";\nexport default { name: ${JSON.stringify(name)}, editable: false, content() {}, package: { character: { character: {}, translate: {} }, card: { card: {}, list: [], translate: {} }, skill: { skill: {} }, author: "", version: "1.0.0" }, files: { character: [], card: [], skill: [] } };\n`;
}
async function register(name: string, category: string) {
  const file = path.join(core, "game/bundled-extensions.json");
  const before = await fs.readFile(file, "utf8"), list = JSON.parse(before);
  const catalogueFile = path.join(core, "game/extension-catalog.json");
  const catalogueBefore = await fs.readFile(catalogueFile, "utf8"), catalogue = JSON.parse(catalogueBefore);
  if (!list.includes(name)) list.push(name);
  if (!catalogue.some((item: any) => item.name === name)) catalogue.push({ name, category, path: `extension/${category}/${name}` });
  await writeChanges([{ file, before, after: JSON.stringify(list, null, 2) + "\n" }, { file: catalogueFile, before: catalogueBefore, after: JSON.stringify(catalogue, null, 2) + "\n" }]);
}
export async function createPackage(data: any) {
  const name = validName(data.name), category = data.category || "imports";
  if (name.startsWith("_") || Object.hasOwn(extensionCategories, name)) throw new Error("不能使用分类名或下划线前缀作为扩展名");
  if (!Object.hasOwn(extensionCategories, category)) throw new Error("无效分类");
  if ((await fs.readdir(root, { recursive: false })).includes(name)) throw new Error("名称与现有目录冲突");
  try { entryFor(name); throw new Error("扩展名称已存在"); } catch (error: any) { if (!error.message.includes("目录不存在")) throw error; }
  const target = path.join(root, category, name);
  await fs.mkdir(target);
  try {
    await fs.writeFile(path.join(target, "extension.js"), template(name));
    await fs.writeFile(path.join(target, "info.json"), JSON.stringify({ name, version: "1.0.0", author: "", intro: "自建武将扩展" }, null, 2));
    await register(name, category);
  } catch (error) { await fs.rm(target, { recursive: true }); throw error; }
  return { name };
}
async function managed(name: string) {
  const file = await safePath(name, "manager.json");
  try { const result = JSON.parse(await fs.readFile(file, "utf8")); if (result.version !== 1 || !Array.isArray(result.children)) throw new Error("无效子包清单"); return result; }
  catch (error: any) { if (error.code === "ENOENT") return { version: 1, children: [] }; throw error; }
}
async function installComposition(name: string, children: string[]) {
  const entry = await safePath(name, "extension.js"), original = await safePath(name, "_manager-original.js");
  const existing = await fs.readFile(entry, "utf8");
  const installed = await fs.stat(original).then(() => true, () => false);
  if (!installed && !/export\s+default\b/.test(existing)) throw new Error("旧式扩展请先通过源码编辑转换为 ESM，再添加子包");
  const wrapper = `import base from "./_manager-original.js";\nimport { compose } from "./_manager-runtime.js";\nexport const type = "extension";\nexport default async function(...args) { return compose(typeof base === "function" ? await base(...args) : base, args, ${JSON.stringify(children)}, import.meta.url); }\n`;
  const updates = [
    { file: await safePath(name, "_manager-runtime.js"), after: runtime },
    { file: await safePath(name, "manager.json"), after: JSON.stringify({ version: 1, children }, null, 2) },
    { file: entry, after: wrapper },
  ];
  const snapshots = await Promise.all(updates.map(async update => ({ ...update, before: await fs.readFile(update.file, "utf8").catch((error: any) => { if (error.code === "ENOENT") return null; throw error; }) })));
  if (!installed) await fs.writeFile(original, existing, { flag: "wx" });
  const done: typeof snapshots = [];
  try {
    for (const item of snapshots) { await writeAtomic(item.file, item.after); done.push(item); }
  } catch (error) {
    for (const item of done.reverse()) { if (item.before === null) await fs.rm(item.file, { force: true }); else await writeAtomic(item.file, item.before); }
    if (!installed) await fs.rm(original, { force: true }); throw error;
  }
}
export async function createDirectory(data: any) {
  const leaf = validName(data.leaf), parent = await safePath(data.name, data.path || "");
  const target = await safePath(data.name, [data.path, leaf].filter(Boolean).join("/"));
  if (!(await fs.stat(parent)).isDirectory()) throw new Error("父目录不存在");
  await fs.mkdir(target);
  return {};
}
export async function createSubpackage(data: any) {
  const leaf = validName(data.leaf), config = await managed(data.name);
  if (config.children.includes(leaf)) throw new Error("子包已存在");
  const parent = await safePath(data.name, "managed");
  await fs.mkdir(parent, { recursive: true });
  const target = await safePath(data.name, "managed/" + leaf);
  await fs.mkdir(target);
  try {
    await fs.writeFile(path.join(target, "extension.js"), template(leaf));
    await installComposition(data.name, [...config.children, leaf]);
  } catch (error) { await fs.rm(target, { recursive: true }); throw error; }
  return { path: "managed/" + leaf };
}
export async function moveCategory(data: any) {
  if (!Object.hasOwn(extensionCategories, data.category)) throw new Error("无效分类");
  const source = await safePath(data.name), destination = path.join(root, data.category, data.name);
  if (source === destination) return {};
  await fs.mkdir(path.dirname(destination), { recursive: true });
  if (await fs.stat(destination).then(() => true, () => false)) throw new Error("目标目录已存在");
  await fs.rename(source, destination);
  const file = path.join(core, "game/extension-catalog.json");
  try {
    const rows = JSON.parse(await fs.readFile(file, "utf8"));
    const row = rows.find((row: any) => row.name === data.name);
    if (row) { row.category = data.category; row.path = slash(path.relative(core, destination)); }
    else rows.push({ name: data.name, category: data.category, path: slash(path.relative(core, destination)) });
    await writeAtomic(file, JSON.stringify(rows, null, 2));
  } catch (error) { await fs.rename(destination, source); throw error; }
  return {};
}
// General directories can be renamed or deleted only after callers detach code
// references. Managed subpackages additionally update their composition entry.
export async function changePath(data: any) {
  if (!data.path || ["extension.js", "info.json", "_manager-original.js", "_manager-runtime.js", "manager.json"].includes(data.path)) throw new Error("扩展入口请使用源码编辑或整包管理");
  const target = await safePath(data.name, data.path), base = await safePath(data.name);
  const stat = await fs.stat(target);
  const leaf = path.basename(target), config = await managed(data.name);
  const isManaged = data.path === "managed/" + leaf && config.children.includes(leaf);
  const destination = data.action === "rename" ? await safePath(data.name, slash(path.join(path.dirname(data.path), validName(data.leaf)))) : null;
  if (destination && await fs.stat(destination).then(() => true, () => false)) throw new Error("目标已存在");
  if (data.action !== "rename" && data.action !== "delete") throw new Error("无效目录操作");
  if (data.action === "delete" && data.confirm !== data.path) throw new Error("请输入完整相对路径确认删除");
  for (const source of await files(base, true)) {
    if (source === target || source.startsWith(target + path.sep) || isManaged && ["extension.js", "manager.json", "_manager-runtime.js"].includes(path.relative(base, source))) continue;
    const text = await fs.readFile(source, "utf8");
    if (text.includes(data.path) || text.includes(leaf)) throw new Error(`目录仍被 ${slash(path.relative(base, source))} 引用。请先编辑该文件解除引用，再操作目录。`);
  }
  if (destination) {
    await fs.rename(target, destination);
    try { if (isManaged) await installComposition(data.name, config.children.map((name: string) => name === leaf ? data.leaf : name)); }
    catch (error) { await fs.rename(destination, target); throw error; }
  } else {
    // Stage outside installed extensions so a failed metadata update can roll back.
    const trash = path.join(core, "../..", "temp", "extension-manager", randomUUID());
    await fs.mkdir(path.dirname(trash), { recursive: true });
    await fs.rename(target, trash);
    try { if (isManaged) await installComposition(data.name, config.children.filter((name: string) => name !== leaf)); }
    catch (error) { await fs.rename(trash, target); throw error; }
    await fs.rm(trash, { recursive: stat.isDirectory(), force: true });
  }
  return {};
}
export async function characterDetail(name: string, id: string, file: string) {
  const target = await safePath(name, file);
  const source = (await sources(entryFor(name).directory)).find(source => source.file === target);
  const definitions = source?.definitions.get(id);
  if (!source || definitions?.length !== 1) throw new Error("定义不存在或有多个同名定义，请使用源码编辑");
  return { id, file, definition: definitions[0].initializer.getText(source.ast), revision: digest(source.text) };
}
export async function saveCharacter(data: any) {
  const file = await safePath(data.name, data.file);
  const source = (await sources(entryFor(data.name).directory)).find(source => source.file === file);
  const nodes = source?.definitions.get(data.id);
  if (!source || nodes?.length !== 1 || digest(source.text) !== data.revision) throw new Error("定义已变化，请重新打开");
  const value = String(data.definition);
  const parsed = ts.createSourceFile("character.js", `const character = { value: ${value} };`, ts.ScriptTarget.Latest, true);
  if ((parsed as any).parseDiagnostics.length) throw new Error("武将定义语法无效");
  const expression = ((parsed.statements[0] as ts.VariableStatement).declarationList.declarations[0].initializer as ts.ObjectLiteralExpression)?.properties?.[0];
  if (!expression || !ts.isPropertyAssignment(expression) || !(ts.isArrayLiteralExpression(expression.initializer) || ts.isObjectLiteralExpression(expression.initializer)) || parsed.statements.length !== 1) throw new Error("请填写数组或对象形式的武将定义");
  const node = nodes[0].initializer;
  const after = source.text.slice(0, node.getStart(source.ast)) + value + source.text.slice(node.end);
  validateSource(file, after);
  await writeChanges([{ file, before: source.text, after }]);
  return {};
}
export async function addCharacter(data: any) {
  if (typeof data.id !== "string" || !/^[a-zA-Z][a-zA-Z0-9_]{0,99}$/.test(data.id)) throw new Error("武将 ID 须以字母开头，只能包含字母、数字、下划线");
  if ((await listCharacters(data.name)).some(row => row.id === data.id)) throw new Error("扩展内已存在此武将 ID");
  if (!["male", "female", "double", "none"].includes(data.sex) || typeof data.group !== "string" || !/^[\w\u4e00-\u9fff]{1,30}$/.test(data.group) || !Number.isInteger(data.hp) || data.hp < 1 || data.hp > 99) throw new Error("请填写有效性别、势力和 1—99 的体力");
  if (typeof data.title !== "string" || !data.title.trim() || data.title.length > 100 || !Array.isArray(data.skills) || data.skills.some((id: any) => typeof id !== "string" || !/^[\w]{1,100}$/.test(id))) throw new Error("名称或技能 ID 无效");
  const target = await safePath(data.name, data.file);
  const source = (await sources(entryFor(data.name).directory)).find(source => source.file === target);
  if (!source) throw new Error("请先在目录页选择用于保存武将的 JS/TS 文件");
  const objects: ts.ObjectLiteralExpression[] = [], translations: ts.ObjectLiteralExpression[] = [];
  const nodeName = (node: any) => node?.name?.text;
  function visit(node: ts.Node) {
    if (ts.isObjectLiteralExpression(node)) {
      if ((["character", "characters"].includes(nodeName(node.parent)) || ts.isExportAssignment(node.parent) && /characters?\.[jt]s$/.test(target)) && !node.properties.some(item => ["character", "translate", "skill"].includes(nodeName(item)))) objects.push(node);
      if (["translate", "translates"].includes(nodeName(node.parent))) translations.push(node);
    }
    ts.forEachChild(node, visit);
  }
  visit(source.ast);
  if (objects.length !== 1) throw new Error("此文件没有唯一的 character 对象，请选择具体武将文件，或使用源码编辑");
  const insert = (object: ts.ObjectLiteralExpression, text: string) => ({ start: object.end - 1, text: `${object.properties.length && !object.properties.hasTrailingComma ? "," : ""}\n${text}\n` });
  const edits = [insert(objects[0], `${JSON.stringify(data.id)}: ${JSON.stringify([data.sex, data.group, data.hp, data.skills, []])}`)];
  const changes: { file: string; before: string; after: string }[] = [];
  const localTranslations = translations.filter(node => node.parent.parent === objects[0].parent.parent);
  if (localTranslations.length === 1) edits.push(insert(localTranslations[0], `${JSON.stringify(data.id)}: ${JSON.stringify(data.title.trim())}`));
  else {
    const translationFile = path.join(path.dirname(target), "translate.js");
    const before = await fs.readFile(translationFile, "utf8").catch(() => "");
    const ast = ts.createSourceFile(translationFile, before, ts.ScriptTarget.Latest, true);
    const candidates: ts.ObjectLiteralExpression[] = [];
    function find(node: ts.Node) { if (ts.isObjectLiteralExpression(node) && (ts.isExportAssignment(node.parent) || ["translate", "translates"].includes(nodeName(node.parent)))) candidates.push(node); ts.forEachChild(node, find); }
    find(ast);
    if (candidates.length !== 1) throw new Error("未找到唯一翻译对象，请在源码编辑中同时添加武将和翻译，或在新建子包内新增武将");
    const edit = insert(candidates[0], `${JSON.stringify(data.id)}: ${JSON.stringify(data.title.trim())}`);
    changes.push({ file: translationFile, before, after: before.slice(0, edit.start) + edit.text + before.slice(edit.start) });
  }
  let after = source.text;
  for (const edit of edits.sort((a, b) => b.start - a.start)) after = after.slice(0, edit.start) + edit.text + after.slice(edit.start);
  changes.push({ file: target, before: source.text, after });
  for (const change of changes) validateSource(change.file, change.after);
  await writeChanges(changes);
  return {};
}
