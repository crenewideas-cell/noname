// Reproducible migration of the supplied community source. Never writes to temp.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fixScenes } from "./rzsh-scene-fixes.mjs";
const source = path.resolve("temp/UI界面美化扩展_如真似幻");
const target = path.resolve("apps/core/extension/ui/如真似幻");
fs.mkdirSync(target, { recursive: true });
function copy(from, to) {
 fs.mkdirSync(to, { recursive: true });
 for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
  const src = path.join(from, entry.name), dest = path.join(to, entry.name);
  if (entry.isDirectory()) copy(src, dest); else if (!entry.name.endsWith(".bak")) fs.copyFileSync(src, dest);
 }
}
for (const dir of ["audio", "css", "fonts", "images", "spine"]) copy(path.join(source, dir), path.join(target, dir));
fs.mkdirSync(path.join(target, "js"), { recursive: true });
for (const file of ["pixi6.min.js", "gsap.min.js", "dream_corridor.js", "dynamicCorridor.js", "dynamicSkin.js", "character.js", "setting.js"]) fs.copyFileSync(path.join(source, "js", file), path.join(target, "js", file));
const parse = text => ts.createSourceFile("community.js", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const original = parse(fs.readFileSync(path.join(source, "extension.js"), "utf8"));
const strings = ts.transform(original, [context => node => {
 const visit = n => ts.isStringLiteral(n) ? ts.factory.createStringLiteral(n.text) : ts.visitEachChild(n, visit, context);
 return ts.visitNode(node, visit);
}]);
const printer = ts.createPrinter({ neverAsciiEscape: true });
const tree = parse(printer.printFile(strings.transformed[0]));
const text = n => n.getText(tree);
const factory = tree.statements.at(-1).expression.arguments[1];
const object = factory.body.statements[0].expression;
const prop = name => object.properties.find(p => p.name.getText(tree) === name).initializer;
const pre = prop("precontent").body.statements;
const loads = [];
function visit(n) {
 if (ts.isBinaryExpression(n) && ts.isFunctionExpression(n.right) && /\["onload"\]$/.test(text(n.left))) loads.push(n);
 ts.forEachChild(n, visit);
}
visit(prop("precontent"));
const outer = loads.find(n => text(n.left) === 'this["onload"]').right.body.statements;
const main = loads.filter(n => text(n.left) === 'lib["init"]["onload"]').at(-1).right.body.statements;
let scene = [pre[0], pre[1], ...pre.slice(8, 236), ...outer.slice(0, 8), main[0], ...main[17].thenStatement.statements].map(text).join("\n");
// Reparse so nested animation callbacks remain intact while the engine handoff is replaced.
scene = 'let spinelo, homeskel_fg, homeskel_lb; const gsap = lifecycle.animation, setTimeout = lifecycle.timeout.bind(lifecycle), setInterval = lifecycle.interval.bind(lifecycle), requestAnimationFrame = lifecycle.frame.bind(lifecycle);\n' + scene;
let sceneTree = parse(scene);
const edits = [];
function patch(n) {
 if (ts.isFunctionDeclaration(n) && n.name?.text === "U8") edits.push([n.getStart(sceneTree), n.end, 'function U8() { lifecycle.finish(lib.config.mode); }']);
 if (ts.isExpressionStatement(n) && n.getText(sceneTree).startsWith('i["view"]["id"]')) edits.push([n.getStart(sceneTree), n.end, 'i.view.id = "rzsh"; lifecycle.mount(i);']);
 if (ts.isExpressionStatement(n) && n.getText(sceneTree).startsWith('I["resizeTo"]')) edits.push([n.getStart(sceneTree), n.end, 'Object.assign(I, { width: 1600, height: 900, backgroundAlpha: 0, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true });']);
 if (ts.isCallExpression(n) && n.expression.getText(sceneTree) === 'yt["add"]' && n.arguments[0]?.getText(sceneTree) === 'Uf') edits.push([n.getStart(sceneTree),n.end,'lifecycle.addPortrait(yt, Uf)']);
 if (ts.isNewExpression(n) && n.expression.getText(sceneTree) === 'PIXI["Text"]' && n.arguments?.[0]?.getText(sceneTree) === 'yg[kw + "_character_config"]') edits.push([n.getStart(sceneTree),n.end,'new PIXI.Text(lifecycle.packLabel(kw, yg))']);
 if (ts.isCallExpression(n) && n.expression.getText(sceneTree) === 'yH["add"]' && /person_skel/.test(n.arguments[0]?.getText(sceneTree))) edits.push([n.getStart(sceneTree),n.end, 'lifecycle.optionalSpine(yH, '+n.arguments.map(a=>a.getText(sceneTree)).join(',')+')']);
 if (ts.isCaseClause(n) && n.expression.getText(sceneTree) === '"menuwu3"') edits.push([n.getStart(sceneTree),n.end, 'case "menuwu3": lifecycle.restart(); break;']);
 if (ts.isCaseClause(n) && n.expression.getText(sceneTree) === '"menusi5"') edits.push([n.getStart(sceneTree),n.end, 'case "menusi5": lifecycle.settings(); break;']);
 if (ts.isCallExpression(n) && n.expression.getText(sceneTree) === 'fm["on"]' && n.arguments[0]?.text === "pointerup" && n.getText(sceneTree).includes('skinSwitch')) edits.push([n.getStart(sceneTree),n.end, 'fm.on("pointerup", () => { lifecycle.skins(); GK.removeChild(kT); })']);
 if (ts.isCallExpression(n) && n.expression.getText(sceneTree) === 'f9["on"]' && n.arguments[0]?.text === "pointerup" && n.getText(sceneTree).includes('dzxy_mzhl')) edits.push([n.getStart(sceneTree),n.end, 'f9.on("pointerup", () => { lifecycle.corridor(); GK.removeChild(kT); })']);
 if (ts.isBinaryExpression(n) && n.left.getText(sceneTree) === 'window["_rzsh_themeReady"]') edits.push([n.right.getStart(sceneTree),n.right.end,'Promise.resolve().then(() => { window._rzsh_theme = lib.config.rzsh_home_theme || "吕布貂蝉"; window._rzsh_themeLocked = true; })']);
 ts.forEachChild(n, patch);
}
patch(sceneTree);
for (const [start, end, replacement] of edits.sort((a,b) => b[0]-a[0])) scene = scene.slice(0,start)+replacement+scene.slice(end);
scene = scene.replaceAll('images/zhaoWujiang_bg.jpg','images/shop_bg_2.jpg').replaceAll('image/char/', 'image/character/');
// Lottery and its downstream profile scene depend on the shared paiweiui atlas.
// Start them after the shared loader has finished parsing its spritesheets.
scene = scene.replace('ym["load"](yu), yL["load"](yC)', 'ym["load"](() => { yu(); yL["load"](yC); })');
scene = scene.replace(/G2\["width"\] = i\["screen"\]\["width"\], G2\["height"\] = i\["screen"\]\["width"\] \/ 0x536 \* 0x[0-9a-f]+/g, 'lifecycle.cover(G2)');
// The plus menu owns workshop/settings access, keeping the original top bar unobstructed.
scene = scene.replace('case "bottom_plus":\n', 'case "bottom_plus": lifecycle.openTools(() => GK.addChild(yU)); break;\ncase "legacy_bottom_plus":\n');
scene = scene.replace('case "wujiangbutton":', 'case "pifubutton": lifecycle.skins(); break;\ncase "wujiangbutton":');
for (const type of ["Loader", "Ticker", "Container"]) scene = scene.replaceAll(`new PIXI["${type}"]()`, `lifecycle.${type.toLowerCase()}()`);
scene = scene.replace('new PIXI["Application"](I)', 'lifecycle.application(I)');
const banner = '// Migrated from 如真似幻 2.0.2. Original authors: 蒸、某个萌新、非凡欧德内里、文和.\n// UI scenes and ranking logic retained; legacy game bootstrap is intentionally excluded.\n';
function modernize(code) {
 const result = ts.transform(parse(code), [context => node => {
  const walk = n => {
   if (ts.isIfStatement(n) && ts.isPrefixUnaryExpression(n.expression) && ts.isElementAccessExpression(n.expression.operand) && n.expression.operand.argumentExpression?.text === "nonameDecade" && ts.isReturnStatement(n.thenStatement)) return ts.factory.createEmptyStatement();
   if (ts.isDeleteExpression(n) && ts.isIdentifier(n.expression)) return ts.factory.createVoidZero();
   if (ts.isStringLiteral(n)) return ts.factory.createStringLiteral(n.text);
   if (ts.isCallExpression(n) && n.arguments.length === 1 && ts.isFunctionExpression(n.arguments[0]) && n.arguments[0].parameters.length === 6) return ts.factory.createCallExpression(ts.factory.createIdentifier("register"), undefined, [ts.visitNode(n.arguments[0], walk)]);
   return ts.visitEachChild(n, walk, context);
  };
  return ts.visitNode(node, walk);
 }]);
 return printer.printFile(result.transformed[0]);
}
fs.writeFileSync(path.join(target, "scenes.js"), banner + fixScenes(modernize('import { lib, game, ui, get, ai, _status } from "noname";\n' + tree.statements.slice(0,-1).map(text).join("\n") + '\nexport const rankingContent = ' + text(prop("content")) + ';\nexport function createScene(lib, game, ui, get, ai, _status, node, lifecycle) {\n' + scene + '\n}\n')));
for (const file of ["dream_corridor.js", "dynamicCorridor.js", "setting.js"]) {
 const original = fs.readFileSync(path.join(source, "js", file), "utf8");
 fs.writeFileSync(path.join(target,"js",file), banner + modernize('export default function(lib, game, ui, get, ai, _status, PIXI = globalThis.PIXI) { const register = callback => callback(lib, game, ui, get, ai, _status);\n'+original+'\n}'));
}
const font = path.join(target, "css/font.css");
fs.writeFileSync(font, fs.readFileSync(font,"utf8").replaceAll("shoushas.ttf", "shousha.ttf"));
const files = [];
function inventory(dir, prefix = "") {
 for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  const name = prefix + entry.name;
  if (entry.isDirectory()) inventory(path.join(dir,entry.name), name+"/"); else if (name !== "files.json" && !name.endsWith(".bak")) files.push(name);
 }
}
inventory(target);
fs.writeFileSync(path.join(target,"files.json"), JSON.stringify(files,null,2)+"\n");
console.log("Migrated source and assets:", target);
