import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import ts from 'typescript';

function parse(name, text) { return ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true); }
function exportedNames(file) {
 const names = new Set();
 for (const statement of file.statements) {
  if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
   for (const item of statement.exportClause.elements) names.add(item.name.text);
  } else if (statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
   if (statement.name) names.add(statement.name.text);
   if (ts.isVariableStatement(statement)) for (const item of statement.declarationList.declarations) {
    if (ts.isIdentifier(item.name)) names.add(item.name.text);
   }
  }
 }
 return names;
}

// Skins can be newer than the published rules engine. Only reviewed, visual
// APIs may be supplied here; unknown missing APIs must stop the package build.
export async function prepareOnlineSkinCompatibility(root, output) {
 const core = exportedNames(parse('noname.js', await readFile(join(output, 'noname.js'), 'utf8')));
 const changes = [];
 async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
   if (entry.name === 'compat') continue;
   const path = join(directory, entry.name);
   if (entry.isSymbolicLink()) throw new Error(`Unexpected UI symlink: ${path}`);
   if (entry.isDirectory()) { await walk(path); continue; }
   if (!entry.isFile() || !/\.[cm]?js$/.test(entry.name)) continue;
   const text = await readFile(path, 'utf8'), file = parse(path, text), edits = [];
   for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)
     || !['noname', '/ui-skins/compat/noname.js'].includes(statement.moduleSpecifier.text)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    const missing = bindings.elements.map(item => (item.propertyName || item.name).text).filter(name => !core.has(name));
    if (missing.some(name => name !== 'installCompactSeatLayout')) {
     throw new Error(`联机界面与发布核心不兼容：${path} 缺少 ${missing.join(', ')}。请使用配套界面或补充经过验证的展示兼容接口。`);
    }
    if (missing.length) edits.push({ start: statement.moduleSpecifier.getStart(file), end: statement.moduleSpecifier.end });
   }
   if (edits.length) {
    let updated = text;
    for (const edit of edits.reverse()) updated = updated.slice(0, edit.start) + JSON.stringify('/ui-skins/compat/noname.js') + updated.slice(edit.end);
    changes.push({ path, text: updated });
   }
  }
 }
 await walk(join(output, 'ui-skins'));
 if (!changes.length) return { adapted: 0 };
 const helper = join(root, 'apps/core/noname/ui/compactSeats.js');
 const helperSource = parse(helper, await readFile(helper, 'utf8'));
 if (helperSource.statements.some(statement => ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement) && statement.moduleSpecifier)) {
  throw new Error('联机布局兼容模块必须独立于游戏规则模块');
 }
 const directory = join(output, 'ui-skins/compat');
 await mkdir(directory, { recursive: true });
 await cp(helper, join(directory, 'compactSeats.js'));
 await cp(join(root, 'apps/core/layout/default/compact-seats.css'), join(directory, 'compact-seats.css'));
 await writeFile(join(directory, 'noname.js'), `export * from '/noname.js';
import { installCompactSeatLayout as install } from './compactSeats.js';
let style;
export function installCompactSeatLayout(options) {
 if (!style?.isConnected) {
  style = document.createElement('link'); style.rel = 'stylesheet';
  style.href = new URL('./compact-seats.css', import.meta.url).href;
  document.head.append(style);
 }
 return install(options);
}
`);
 for (const change of changes) await writeFile(change.path, change.text);
 return { adapted: changes.length };
}
