import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';
import { sourceRoot, coreRoot, files, parse, walk, key, property, isCharacter } from './auditBranchCharacters.js';

const output = path.join(coreRoot, 'extension/分支武将');
const inventory = JSON.parse(fs.readFileSync('output/branch-merge/inventory.json','utf8'));
const known = new Set(Object.keys(inventory.main));
const fields = ['character','characterSort','characterFilter','characterTitle','characterIntro','characterReplace','characterSubstitute','characterPrefix','dynamicTranslate','perfectPair','translate','skill','card','pinyins'];
const printer = ts.createPrinter({removeComments:false});
const packs: any[] = [];
const mainSkills = new Set<string>();
function dictionarySkills(n: ts.Node, visit: (id:string,n:ts.Node)=>void) {
 if (!ts.isObjectLiteralExpression(n)) return;
 for (const p of n.properties) {
  const id=key(p.name); if(!id || !ts.isPropertyAssignment(p)) continue;
  if(ts.isObjectLiteralExpression(p.initializer)) { visit(id,p.initializer); const sub=property(p.initializer,'subSkill'); if(sub) dictionarySkills(sub,(subid,v)=>visit(`${id}_${subid}`,v)); }
 }
}
// Reserve skills in installed packs even when a user has disabled that pack.
for(const folder of ['character','extension','card','mode','noname/library']) for(const file of files(path.join(coreRoot,folder)).filter(f=>/\.[jt]s$/.test(f)&&!f.startsWith(output))) {
 const text=fs.readFileSync(file,'utf8'); if(!/skill|trigger/.test(text)) continue;
 const sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
 walk(sf,n=>{
  if(ts.isPropertyAssignment(n)&&key(n.name)==='skill') dictionarySkills(n.initializer,id=>mainSkills.add(id));
  if(ts.isVariableDeclaration(n)&&key(n.name)==='skills'&&n.initializer) dictionarySkills(n.initializer,id=>mainSkills.add(id));
  if(ts.isExportAssignment(n)&&/[\\/]skill\.[jt]s$/.test(file)) dictionarySkills(n.expression,id=>mainSkills.add(id));
 });
}
fs.mkdirSync(path.join(output,'packs'),{recursive:true});
const sourceFiles = new Set<string>([...Object.keys(inventory.byFile), 'extension/太虚幻境/extension.js']);
for(const file of fs.readdirSync(path.join(sourceRoot,'card')).filter(f=>f.endsWith('.js')))sourceFiles.add('card/'+file);
for(const file of fs.readdirSync(path.join(sourceRoot,'mode')).filter(f=>f.endsWith('.js')&&f!=='asset.js'))sourceFiles.add('mode/'+file);
for(const relative of sourceFiles) {
 const sf=parse(path.join(sourceRoot,relative));
 const objects = new Set<ts.ObjectLiteralExpression>();
 walk(sf,n=>{
  if(ts.isPropertyAssignment(n)&&isCharacter(n.initializer)&&ts.isObjectLiteralExpression(n.parent)) {
   const parent=n.parent.parent;
   if(ts.isPropertyAssignment(parent)&&key(parent.name)==='character'&&ts.isObjectLiteralExpression(parent.parent)) objects.add(parent.parent);
  }
 });
 // NPC skills live in the extension's package, separately from its character file.
 if(relative==='extension/太虚幻境/extension.js') walk(sf,n=>{if(ts.isPropertyAssignment(n)&&key(n.name)==='package'&&ts.isObjectLiteralExpression(n.initializer)) objects.add(n.initializer);});
 if(relative.startsWith('card/'))walk(sf,n=>{if(ts.isReturnStatement(n)&&n.expression&&ts.isObjectLiteralExpression(n.expression)&&property(n.expression,'card'))objects.add(n.expression);});
 if(relative.startsWith('mode/'))walk(sf,n=>{if(ts.isReturnStatement(n)&&n.expression&&ts.isObjectLiteralExpression(n.expression)&&property(n.expression,'skill'))objects.add(n.expression);});
 for(const obj of objects) {
  let entries = new Map<string,ts.Node[]>();
  if(property(obj,'package')) throw new Error('Unexpected extension root');
  const nested=property(obj,'character');
  const packageShape=nested&&ts.isObjectLiteralExpression(nested)&&property(nested,'character');
  const enclosing=ts.isPropertyAssignment(obj.parent)&&key(obj.parent.name)==='character'&&ts.isObjectLiteralExpression(obj.parent.parent) ? obj.parent.parent : undefined;
  const sectionObjects = packageShape ? ['character','card','skill'].map(k=>property(obj,k)).filter((n):n is ts.ObjectLiteralExpression=>!!n&&ts.isObjectLiteralExpression(n)) : [obj];
  if(enclosing) for(const k of ['card','skill']) {const v=property(enclosing,k); if(v&&ts.isObjectLiteralExpression(v))sectionObjects.push(v);}
  for(const section of sectionObjects) for(const field of relative.startsWith('mode/')?['skill','translate']:fields) { const v=property(section,field); if(v) { const values=entries.get(field)||[]; values.push(v);entries.set(field,values); } }
  const char=entries.get('character')?.[0];
  const ids=char&&ts.isObjectLiteralExpression(char)?char.properties.filter(p=>ts.isPropertyAssignment(p)&&isCharacter(p.initializer)).map(p=>key(p.name)!).filter(Boolean):[];
  const id=`pack_${packs.length}`;
  const text=`// Extracted from ${relative}; legacy startup and engine/UI patches are not executed.\nexport default function(lib, game, ui, get, ai, _status) {\nreturn {\n${[...entries].map(([k,vs])=>`${JSON.stringify(k)}: ${vs.length===1?vs[0].getText(sf):'{'+vs.map(v=>'...'+v.getText(sf)).join(',')+'}'}`).join(',\n')}\n};\n}\n`;
  // An ESM parse rejects strict-mode errors before anything is installed.
  const generated=ts.createSourceFile(id+'.js',text,ts.ScriptTarget.Latest,true);
  const diagnostics=(generated as any).parseDiagnostics;
  if(diagnostics.length)throw new Error(`${relative}: ${diagnostics[0].messageText}`);
  fs.writeFileSync(path.join(output,'packs',id+'.js'),text);
  packs.push({id,source:relative,sourceHash:crypto.createHash('sha256').update(fs.readFileSync(path.join(sourceRoot,relative))).digest('hex'),characters:ids,added:ids.filter(id=>!known.has(id)),npc:relative.startsWith('extension/太虚幻境/'),label:relative.startsWith('character/')?path.basename(relative,'.js'):relative.split('/')[1]});
 }
}
fs.writeFileSync(path.join(output,'catalog.js'),`// Generated by scripts/mergeBranchCharacters.ts\n${packs.map(p=>`import ${p.id} from './packs/${p.id}.js';`).join('\n')}\nexport const packs = [${packs.map(p=>`{...${JSON.stringify(p)}, create:${p.id}}`).join(',\n')}];\nexport const reservedCharacters = new Set(${JSON.stringify([...known])});\nexport const reservedSkills = new Set(${JSON.stringify([...mainSkills])});\n`);
fs.writeFileSync('output/branch-merge/packs.json',JSON.stringify(packs,null,2));
console.log(JSON.stringify({packs:packs.length,characters:packs.reduce((n,p)=>n+p.characters.length,0),added:new Set(packs.flatMap(p=>p.added)).size,reservedSkills:mainSkills.size}));
