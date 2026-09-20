import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createHash } from "node:crypto";
import { ZipFile } from "yazl";
import ts from "typescript";
import { core, entryFor, files, listCharacters, listPackages } from "./model.js";
import { safePath } from "./operations.js";

const slash = (text: string) => text.replaceAll("\\", "/");
const sourcePattern = /\.(js|ts|json|css|html)$/i;
const selectionHelper = `const ids = new Set(SELECTION);
export function filter(pack) {
  if (!pack || typeof pack !== 'object') return pack;
  if (pack.character) {
    pack.character = Object.fromEntries(Object.entries(pack.character).filter(([id]) => ids.has(id)));
    const walk = value => Array.isArray(value) ? value.filter(id => typeof id !== 'string' || ids.has(id)) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, walk(item)])) : value;
    if (pack.characterSort) pack.characterSort = walk(pack.characterSort);
  }
  return pack;
}
export function wrap(factory) { return function(...args) { const pack = factory.apply(this, args); return pack?.then ? pack.then(filter) : filter(pack); }; }
`;
function filterImports(text: string, file: string, helper: string) {
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const edits: { start: number; end: number; text: string }[] = [];
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "import" && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "game" && node.arguments.length >= 2 && ts.isStringLiteralLike(node.arguments[0]) && node.arguments[0].text === "character") {
      const factory = node.arguments[1];
      edits.push({ start: factory.getStart(ast), end: factory.end, text: `__exportWrap(${factory.getText(ast)})` });
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  if (!edits.length) return text;
  for (const edit of edits.sort((a, b) => b.start - a.start)) text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
  return `import { wrap as __exportWrap } from ${JSON.stringify(helper)};\n` + text;
}
async function exportPackage(name: string, selected: string[] | undefined, output: string) {
  const base = await safePath(name), all = await listCharacters(name);
  if (selected && (!selected.length || selected.some(id => !all.some(row => row.id === id)))) throw new Error(`「${name}」的武将选择已失效，请刷新列表`);
  const ids = selected && [...new Set(selected)].sort();
  const exportName = ids ? `${name}·选录-${createHash("sha256").update(ids.join("\n")).digest("hex").slice(0, 8)}` : name;
  const sourceFiles = await files(base);
  const zip = new ZipFile();
  const done = pipeline(zip.outputStream, createWriteStream(output));
  void done.catch(() => {});
  const snapshots: { file: string; size: number; modified: number }[] = [];
  const entry = sourceFiles.includes(path.join(base, "extension.js")) ? "extension.js" : "extension.ts";
  if (!sourceFiles.includes(path.join(base, entry))) { zip.outputStream.destroy(); await done.catch(() => {}); throw new Error(`「${name}」缺少扩展入口`); }
  if (ids && sourceFiles.some(file => ["_export-original.js", "_export-filter.js"].includes(path.relative(base, file)))) { zip.outputStream.destroy(); await done.catch(() => {}); throw new Error("再次选录请从原始扩展选择武将；现有选录包可以直接整包导出"); }
  try {
    let sharedHelper = false;
    for (const file of sourceFiles) {
      const relative = slash(path.relative(base, file));
      const outputName = relative.endsWith(".ts") ? relative.slice(0, -3) + ".js" : relative;
      if (relative.endsWith(".ts") && sourceFiles.includes(file.slice(0, -3) + ".js")) throw new Error("TS 与 JS 输出文件重名：" + relative);
      if (["info.json", "character-index.json", "export-manifest.json"].includes(relative) || /(?:\.manager-tmp|\.bak|\.log|\.d\.ts)$/.test(relative)) continue;
      const stat = await fs.stat(file);
      snapshots.push({ file, size: stat.size, modified: stat.mtimeMs });
      if (sourcePattern.test(file)) {
        let text = await fs.readFile(file, "utf8");
        // Shared merge helper normally sits outside the extension. Vendor it
        // and rewrite only relative references which actually escape this pack.
        text = text.replace(/(["'])([^"'\n]*_merge\.js)\1/g, (match, quote, specifier) => {
          if (!specifier.startsWith(".")) return match;
          const resolved = path.resolve(path.dirname(file), specifier);
          if (resolved.startsWith(base + path.sep)) return match;
          sharedHelper = true;
          let local = slash(path.relative(path.dirname(file), path.join(base, "_export-merge.js")));
          if (!local.startsWith(".")) local = "./" + local;
          return quote + local + quote;
        });
        if (ids) {
          text = text.replaceAll(`extension/${name}/`, `extension/${exportName}/`).replaceAll(`ext:${name}/`, `ext:${exportName}/`).replaceAll(`ext:${name}:`, `ext:${exportName}:`).replaceAll(`extension_${name}_`, `extension_${exportName}_`);
          // Paths assembled inside composer helpers also use the bare package
          // name. Change string data, never identifiers or executable syntax.
          if (/\.[jt]s$/.test(file)) {
            const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
            const edits: { start: number; end: number; value: string }[] = [];
            function rename(node: ts.Node) {
              if (ts.isStringLiteralLike(node) && (node.text === name || node.text.startsWith(name + "/"))) edits.push({ start: node.getStart(ast), end: node.end, value: JSON.stringify(exportName + node.text.slice(name.length)) });
              if (node.kind === ts.SyntaxKind.TemplateHead && (node as ts.TemplateHead).text.startsWith(name + "/")) edits.push({ start: node.getStart(ast) + 1, end: node.getStart(ast) + 1 + name.length, value: exportName });
              ts.forEachChild(node, rename);
            }
            rename(ast);
            for (const edit of edits.sort((a, b) => b.start - a.start)) text = text.slice(0, edit.start) + edit.value + text.slice(edit.end);
          }
          if (/\.[jt]s$/.test(file)) {
            let helper = slash(path.relative(path.dirname(file), path.join(base, "_export-filter.js")));
            if (!helper.startsWith(".")) helper = "./" + helper;
            text = filterImports(text, file, helper);
          }
        }
        if (/\.[jt]s$/.test(file)) text = text.replace(/(["'])([^"'\n]+)\.ts\1/g, "$1$2.js$1");
        if (file.endsWith(".ts")) text = ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
        zip.addBuffer(Buffer.from(text), ids && relative === entry ? "_export-original.js" : outputName);
      } else zip.addFile(file, relative);
    }
    if (sharedHelper) {
      if (sourceFiles.includes(path.join(base, "_export-merge.js"))) throw new Error("共享依赖文件名冲突");
      zip.addBuffer(await fs.readFile(path.join(core, "extension/_merge.js")), "_export-merge.js");
    }
    if (ids) {
      const source = await fs.readFile(path.join(base, entry), "utf8");
      if (!/export\s+default\b/.test(source)) throw new Error("此旧式扩展暂不支持武将选录，请导出整包或先转换为 ESM");
      zip.addBuffer(Buffer.from(selectionHelper.replace("SELECTION", JSON.stringify(ids))), "_export-filter.js");
      zip.addBuffer(Buffer.from(`import original from './_export-original.js';\nimport { filter } from './_export-filter.js';\nexport const type = 'extension';\nexport default async function(...args) {\n const base = typeof original === 'function' ? await original(...args) : original;\n base.name = ${JSON.stringify(exportName)};\n const content = base.content;\n base.content = async function(config, pack) { await content?.call(this, config, pack); if (pack?.character) filter(pack.character); };\n return base;\n}\n`), "extension.js");
    }
    const originalInfo = await fs.readFile(path.join(base, "info.json"), "utf8").then(JSON.parse).catch(() => ({}));
    zip.addBuffer(Buffer.from(JSON.stringify({ ...originalInfo, name: exportName, version: originalInfo.version || "1.0.0", author: originalInfo.author || "", intro: originalInfo.intro || "完整源码、技能与素材扩展" }, null, 2)), "info.json");
    zip.addBuffer(Buffer.from(JSON.stringify(all.filter(row => !ids || ids.includes(row.id)), null, 2)), "character-index.json");
    zip.addBuffer(Buffer.from(JSON.stringify({ format: 1, source: name, name: exportName, selectedCharacters: ids || null, engine: "noname 1.11.6", exportedAt: new Date().toISOString(), install: "通过游戏扩展导入 ZIP；选录包与原包含相同武将 ID，请按需启用。", uninstall: "扩展设置 → 物理删除此扩展；合集亦可逐包卸载。" }, null, 2)), "export-manifest.json");
    zip.end(); await done;
    for (const item of snapshots) {
      const stat = await fs.stat(item.file);
      if (stat.size !== item.size || stat.mtimeMs !== item.modified) throw new Error("导出期间文件发生变化，请重新导出");
    }
    return exportName;
  } catch (error) { zip.outputStream.destroy(); await done.catch(() => {}); throw error; }
}
export async function prepareExport(data: any) {
  const requested = data.all ? (await listPackages()).map(pack => ({ name: pack.name })) : data.packages;
  if (!Array.isArray(requested) || !requested.length || requested.length > 500 || new Set(requested.map(item => item.name)).size !== requested.length) throw new Error("请选择不重复的扩展");
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "noname-export-"));
  try {
    const entries = [];
    for (const [index, item] of requested.entries()) {
      entryFor(item.name);
      if (item.characters !== undefined && (!Array.isArray(item.characters) || item.characters.some((id: any) => typeof id !== "string"))) throw new Error("无效武将列表");
      const file = path.join(temporary, `${index}.zip`);
      const name = await exportPackage(item.name, item.characters, file);
      entries.push({ name, file, archive: `packages/${index}.zip` });
    }
    let file = entries[0].file, filename = entries[0].name + ".zip";
    if (entries.length > 1) {
      file = path.join(temporary, "bundle.zip"); filename = `武将扩展合集-${entries.length}包.zip`;
      const zip = new ZipFile(), done = pipeline(zip.outputStream, createWriteStream(file));
      void done.catch(() => {});
      zip.addBuffer(Buffer.from(JSON.stringify({ version: 1, packages: entries.map(({ name, archive }) => ({ name, file: archive })) }, null, 2)), "extension-bundle.json");
      zip.addBuffer(Buffer.from("在本项目游戏的扩展导入入口直接选择此 ZIP，可批量安装。每个包独立保留身份，可单独启用、停用或卸载。也可解压后单独导入 packages 内的 ZIP。"), "安装说明.txt");
      for (const item of entries) zip.addFile(item.file, item.archive);
      zip.end(); await done;
    }
    return { file, filename, dispose: () => fs.rm(temporary, { recursive: true, force: true }) };
  } catch (error) { await fs.rm(temporary, { recursive: true, force: true }); throw error; }
}
