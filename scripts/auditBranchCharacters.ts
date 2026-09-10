import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export const sourceRoot = path.resolve('扩展包/分支版本/src');
export const coreRoot = path.resolve('apps/core');
export const key = (n: ts.Node | undefined): string | undefined => n && (ts.isIdentifier(n) || ts.isStringLiteralLike(n) || ts.isNumericLiteral(n)) ? n.text : undefined;
export function walk(n: ts.Node, f: (n: ts.Node) => void) { f(n); ts.forEachChild(n, c => { walk(c, f); }); }
export function files(root: string): string[] { return fs.readdirSync(root, { withFileTypes: true }).flatMap(e => ['node_modules', '.git', 'dist', 'node7zip-bin'].includes(e.name) ? [] : e.isDirectory() ? files(path.join(root, e.name)) : [path.join(root, e.name)]); }
export function parse(file: string) { return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS); }
export function property(n: ts.ObjectLiteralExpression, name: string) { const p = n.properties.find(p => key(p.name) === name); return p && ts.isPropertyAssignment(p) ? p.initializer : undefined; }
export function isCharacter(n: ts.Node) {
 if (ts.isArrayLiteralExpression(n)) return n.elements.length >= 4 && ['male','female','double','none'].includes(key(n.elements[0]) || '') && ts.isArrayLiteralExpression(n.elements[3]);
 return ts.isObjectLiteralExpression(n) && !!property(n, 'sex') && !!property(n, 'skills');
}
export function inventory(root: string, folders = ['character', 'extension']) {
 const result: Record<string, { file: string, line: number, definition: string, skills: string[] }[]> = {};
 for (const folder of folders) for (const file of files(path.join(root, folder)).filter(f => /\.[jt]s$/.test(f) && !f.endsWith('.d.ts'))) {
  if(root===coreRoot && path.relative(root,file).replaceAll('\\','/').startsWith('extension/分支武将/'))continue;
  const sf = parse(file);
  walk(sf, n => {
   if (!ts.isPropertyAssignment(n) || !isCharacter(n.initializer)) return;
   const id = key(n.name); if (!id) return;
   const skills = ts.isArrayLiteralExpression(n.initializer) ? n.initializer.elements[3] : property(n.initializer as ts.ObjectLiteralExpression, 'skills');
   (result[id] ||= []).push({file:path.relative(root,file).replaceAll('\\','/'), line:sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1,definition:n.initializer.getText(sf),skills:skills && ts.isArrayLiteralExpression(skills) ? skills.elements.map(key).filter(Boolean) as string[] : []});
  });
 }
 return result;
}
if (import.meta.main) {
 const source = inventory(sourceRoot), main = inventory(coreRoot);
 const added = Object.keys(source).filter(id => !main[id]);
 const byFile: Record<string, { total: number, added: string[] }> = {};
 for (const [id, rows] of Object.entries(source)) for (const row of rows) { const entry = byFile[row.file] ||= { total:0, added:[] }; entry.total++; if (!main[id]) entry.added.push(id); }
 fs.mkdirSync('output/branch-merge', {recursive:true});
 fs.writeFileSync('output/branch-merge/inventory.json', JSON.stringify({source,main,added,byFile},null,2));
 console.log(JSON.stringify({source:Object.keys(source).length,main:Object.keys(main).length,added:added.length,byFile},null,2));
}
