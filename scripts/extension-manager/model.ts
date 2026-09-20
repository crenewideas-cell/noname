import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { createHash } from "node:crypto";
import { extensionEntries, extensionCategories } from "../../packages/fs/src/extensionLayout.mjs";

export const core = path.resolve(import.meta.dirname, "../../apps/core");
export const root = path.join(core, "extension");
const key = (node: ts.Node | undefined): string | undefined => node && (ts.isIdentifier(node) || ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) ? node.text : undefined;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const metadata = new Set(["translate", "translates", "characterSort", "characterReplace", "characterIntro", "characterTitle", "characterFilter", "characterPerfectPair", "perfectPair", "characterPack", "characterSubstitute", "characterSubstitutes", "characterReplace", "characterPrefix", "character", "characters"]);
const skipped = new Set(["node_modules", "assets", "audio", "image", "images", "skin", "skins", "font", "fonts", "pixi", ".git", "voice"]);
type Edit = { start: number; end: number; text: string };
type Source = { file: string; text: string; ast: ts.SourceFile; definitions: Map<string, ts.PropertyAssignment[]> };

export async function files(directory: string, codeOnly = false): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`不能整理符号链接：${file}`);
    if (entry.isDirectory()) {
      if (!codeOnly || !skipped.has(entry.name)) result.push(...await files(file, codeOnly));
    } else if (!codeOnly || /\.(js|ts)$/.test(entry.name)) result.push(file);
  }
  return result;
}

function owner(node: ts.Node) {
  const parent = node.parent;
  if (ts.isPropertyAssignment(parent) || ts.isVariableDeclaration(parent)) return key(parent.name);
  if (ts.isBinaryExpression(parent)) {
    const left = parent.left;
    if (ts.isPropertyAccessExpression(left)) return left.name.text;
  }
}
function isCharacter(value: ts.Expression) {
  if (ts.isArrayLiteralExpression(value)) return value.elements.length >= 4 && ts.isStringLiteralLike(value.elements[0]) && ["male", "female", "double", "none"].includes(value.elements[0].text);
  if (ts.isObjectLiteralExpression(value)) return value.properties.some(item => key(item.name) === "sex") && value.properties.some(item => key(item.name) === "skills");
  return false;
}
export async function sources(directory: string): Promise<Source[]> {
  const result: Source[] = [];
  for (const file of await files(directory, true)) {
    const text = await fs.readFile(file, "utf8");
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.JS);
    const definitions = new Map<string, ts.PropertyAssignment[]>();
    function visit(node: ts.Node) {
      if (ts.isObjectLiteralExpression(node) && (["character", "characters"].includes(owner(node) || "") || (ts.isExportAssignment(node.parent) && /characters?\.[jt]s$/.test(file)))) {
        for (const item of node.properties) {
          const id = key(item.name);
          if (id && ts.isPropertyAssignment(item) && isCharacter(item.initializer)) definitions.set(id, [...(definitions.get(id) || []), item]);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
    result.push({ file, text, ast, definitions });
  }
  return result;
}

async function json(name: string, fallback: any = []) {
  try { return JSON.parse(await fs.readFile(path.join(core, "game", name), "utf8")); }
  catch (error: any) { if (error.code === "ENOENT") return fallback; throw error; }
}
export function entryFor(name: string) {
  const entry = extensionEntries(root, true).find(item => item.name === name);
  if (!entry) throw new Error("扩展目录不存在，请刷新列表");
  return entry;
}

export async function listPackages() {
  const registry = await json("organized-extensions.json");
  return extensionEntries(root, true).map(entry => ({
    name: entry.name, category: entry.category, categoryName: extensionCategories[entry.category],
    path: path.relative(core, entry.directory).replaceAll("\\", "/"),
    registeredCharacters: registry.find(item => item.name === entry.name)?.characters?.length ?? null,
  }));
}
export async function listCharacters(name: string) {
  const entry = entryFor(name);
  const code = await sources(entry.directory);
  const characters = new Map<string, { id: string; name: string; files: string[] }>();
  for (const source of code) for (const id of source.definitions.keys()) {
    const row = characters.get(id) || { id, name: id, files: [] };
    row.files.push(path.relative(entry.directory, source.file).replaceAll("\\", "/"));
    characters.set(id, row);
  }
  for (const source of code) {
    function visit(node: ts.Node) {
      if (ts.isPropertyAssignment(node) && ts.isStringLiteralLike(node.initializer) && (["translate", "translates"].includes(owner(node.parent) || "") || /translates?\.[jt]s$/.test(source.file))) {
        const row = characters.get(key(node.name)!);
        if (row) row.name = node.initializer.text.replace(/<[^>]*>/g, "");
      }
      ts.forEachChild(node, visit);
    }
    visit(source.ast);
  }
  return [...characters.values()];
}

function removeNode(node: ts.Node, source: Source): Edit {
  let end = node.end;
  // Consume the following comma through the syntax scanner, preserving other members.
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, source.text);
  scanner.setTextPos(end);
  if (scanner.scan() === ts.SyntaxKind.CommaToken) end = scanner.getTextPos();
  return { start: node.getStart(source.ast), end, text: "" };
}
function inMetadata(node: ts.Node, file: string) {
  if (/(?:translate|sort|replace|intro|title|perfectPairs?|characterFilter)\.[jt]s$/.test(file)) return true;
  for (let parent = node.parent; parent; parent = parent.parent) {
    if ((ts.isPropertyAssignment(parent) || ts.isVariableDeclaration(parent)) && metadata.has(key(parent.name) || "")) return true;
  }
  return false;
}
function rewrite(source: Source, id: string) {
  const edits: Edit[] = (source.definitions.get(id) || []).map(node => removeNode(node, source));
  function covered(node: ts.Node) { return edits.some(edit => node.getStart(source.ast) >= edit.start && node.end <= edit.end); }
  function collect(node: ts.Node) {
    if (covered(node)) return;
    if (ts.isPropertyAssignment(node) && [id, `${id}_prefix`, `${id}_info`].includes(key(node.name) || "") && inMetadata(node, source.file)) { edits.push(removeNode(node, source)); return; }
    if (ts.isStringLiteralLike(node) && node.text === id && ts.isArrayLiteralExpression(node.parent) && inMetadata(node, source.file)) { edits.push(removeNode(node, source)); return; }
    ts.forEachChild(node, collect);
  }
  collect(source.ast);
  function references(node: ts.Node) {
    if (covered(node)) return;
    if ((ts.isStringLiteralLike(node) || ts.isIdentifier(node)) && node.text === id) throw new Error(`「${id}」仍被 ${path.relative(root, source.file)} 中的其他代码引用，不能单独删除；请先处理引用，或选择删除整个扩展。`);
    ts.forEachChild(node, references);
  }
  references(source.ast);
  let next = source.text;
  for (const edit of edits.sort((a, b) => b.start - a.start)) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
  return next;
}

export type Plan = { name: string; id?: string; directory: string; fingerprint: string; fileCount: number; bytes: number; writes: { file: string; before: string; after: string }[]; summary: string[] };
async function fingerprint(directory: string) {
  const paths = (await files(directory)).sort();
  let bytes = 0;
  const rows: string[] = [];
  for (const file of paths) {
    const stat = await fs.stat(file);
    bytes += stat.size;
    rows.push(`${file}\0${stat.size}\0${stat.mtimeMs}`);
  }
  return { fingerprint: hash(rows.join("\n")), fileCount: paths.length, bytes };
}
export async function planDeletion(name: string, id?: string): Promise<Plan> {
  const entry = entryFor(name);
  // This first-party package is also statically imported by the core hlhj mode.
  if (!id && name === "红楼幻境") {
    const dependency = await fs.readFile(path.join(core, "character/hlhj/index.js"), "utf8").catch(() => "");
    if (/extension\/(?:packs\/)?红楼幻境\//.test(dependency)) throw new Error("红楼幻境同时是本体红楼武将包的源码依赖。请先解除 apps/core/character/hlhj/index.js 的引用，再进行整包删除。");
  }
  const snapshot = await fingerprint(entry.directory);
  const plan: Plan = { name, id, directory: entry.directory, ...snapshot, writes: [], summary: [] };
  if (id) {
    const code = await sources(entry.directory);
    for (const source of code) {
      const errors = (source.ast as ts.SourceFile & { parseDiagnostics: ts.Diagnostic[] }).parseDiagnostics;
      if (errors.length) throw new Error(`源码存在语法问题，无法可靠编辑：${source.file}`);
    }
    if (!code.some(source => source.definitions.has(id))) throw new Error("未找到可直接编辑的武将定义；动态注册内容请在源码中处理，或删除整个扩展。");
    for (const source of code) {
      const after = rewrite(source, id);
      if (after !== source.text) plan.writes.push({ file: source.file, before: source.text, after });
    }
    plan.summary.push(`从「${name}」物理移除武将定义 ${id}，并清理相关静态分类、替换及翻译记录。`, `修改 ${plan.writes.length} 个源码文件。共享技能与素材保留；要释放整个扩展占用的空间，请选择删除整个扩展。`);
  } else plan.summary.push(`永久删除「${name}」整个目录，包括所有子包、武将、技能、界面、图片和音频。`, `删除 ${plan.fileCount} 个文件，共 ${(plan.bytes / 1024 / 1024).toFixed(1)} MB。`);
  plan.summary.push(...plan.writes.map(item => path.relative(core, item.file).replaceAll("\\", "/")), "同步清理登记清单；原始导入 ZIP 和已打包的 EXE/APK 不受影响。操作不可撤销，请先退出正在运行的游戏。");
  return plan;
}

async function metadataWrites(plan: Plan) {
  const result: Plan["writes"] = [];
  const update = async (name: string, edit: (value: any) => any) => {
    const file = path.join(core, "game", name);
    let before: string;
    try { before = await fs.readFile(file, "utf8"); } catch (error: any) { if (error.code === "ENOENT") return; throw error; }
    const after = JSON.stringify(edit(JSON.parse(before)), null, 2) + "\n";
    if (before !== after) result.push({ file, before, after });
  };
  await update("organized-extensions.json", rows => rows.flatMap(row => {
    if (row.name !== plan.name) return [row];
    if (!plan.id) return [];
    const files = { ...row.files };
    for (const write of plan.writes) files[path.relative(plan.directory, write.file).replaceAll("\\", "/")] = hash(write.after);
    return [{ ...row, characters: row.characters.filter(id => id !== plan.id), files }];
  }));
  if (!plan.id) {
    await update("bundled-extensions.json", rows => rows.filter(name => name !== plan.name));
    await update("extension-catalog.json", rows => rows.filter(row => row.name !== plan.name));
    await update("extension-groups.json", rows => rows.map(row => ({ ...row, members: row.members.filter(name => name !== plan.name) })));
    await update("character-menu-groups.json", value => ({ ...value, groups: value.groups.map(row => ({ ...row, members: row.members.filter(name => name !== plan.name) })) }));
    await update("organized-extension-status.json", value => ({ ...value, disabled: value.disabled.filter(row => row.name !== plan.name) }));
  }
  return result;
}

export async function commitDeletion(plan: Plan) {
  const entry = entryFor(plan.name);
  const relative = path.relative(root, await fs.realpath(entry.directory));
  if (entry.directory !== plan.directory || !relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("删除目标路径已改变");
  if ((await fingerprint(entry.directory)).fingerprint !== plan.fingerprint) throw new Error("确认期间扩展文件发生变化，请重新预览并确认。");
  const writes = [...plan.writes, ...await metadataWrites(plan)];
  for (const write of writes) if (await fs.readFile(write.file, "utf8") !== write.before) throw new Error("确认期间文件已改变，请重新操作。");
  const completed: typeof writes = [];
  const writeAtomic = async (file: string, text: string) => {
    const temporary = `${file}.${process.pid}.manager-tmp`;
    try {
      await fs.writeFile(temporary, text, { flag: "wx" });
      await fs.rename(temporary, file);
    } finally { await fs.rm(temporary, { force: true }); }
  };
  try {
    for (const write of writes) {
      await writeAtomic(write.file, write.after);
      completed.push(write);
    }
    if (!plan.id) await fs.rm(plan.directory, { recursive: true });
  } catch (error) {
    for (const write of completed.reverse()) await writeAtomic(write.file, write.before);
    throw error;
  }
}
