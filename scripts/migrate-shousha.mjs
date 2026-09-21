// Rebuild the visual provider from the supplied Liuli 5.5 distribution.
// Only artwork, fonts, CSS and the Spine renderer are copied, never the old engine.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const postcss = require(require.resolve("postcss", { paths: [path.dirname(require.resolve("vite/package.json", {paths:[path.resolve("apps/core")]}))] }));
const source = path.resolve("temp/三国杀·琉璃版5.5/resources/app");
const target = path.resolve("apps/core/extension/ui/手杀标准UI");
fs.mkdirSync(path.join(target, "assets"), { recursive: true });
const resources = {}, missing = new Set();
function asset(relative) {
 relative = relative.replaceAll("\\", "/");
 if (resources[relative]) return resources[relative];
 const original = path.resolve(source, relative);
 if (!original.startsWith(source + path.sep)) throw new Error(`Outside source: ${relative}`);
 if (!fs.existsSync(original)) { missing.add(relative); return null; }
 const bytes = fs.readFileSync(original);
 const name = `assets/${crypto.createHash("sha256").update(bytes).digest("hex").slice(0,24)}${path.extname(original).toLowerCase()}`;
 fs.writeFileSync(path.join(target, name), bytes); resources[relative] = name; return name;
}
function tree(relative, filter = () => true) {
 for (const file of fs.readdirSync(path.join(source, relative), { withFileTypes: true })) {
  const child = `${relative}/${file.name}`;
  if (file.isDirectory()) tree(child, filter); else if (filter(child)) asset(child);
 }
}
const rz = "extension/如真似幻", ten = "extension/十周年UI", hand = "extension/手杀ui";
// Original hall themes, mode covers, profile frames, login controls and atlases.
tree(`${rz}/images`, file => /\.(png|jpe?g|webp|json)$/i.test(file));
const sheets = {};
for (const theme of fs.readdirSync(path.join(source, rz, "images/uiStyles"))) {
 const file = `${rz}/images/uiStyles/${theme}/ui.json`;
 if (fs.existsSync(path.join(source, file))) sheets[theme] = JSON.parse(fs.readFileSync(path.join(source,file), "utf8"));
}
// Preserve only the default card art, rather than every optional alternate pack.
const cards = {};
for (const file of fs.readdirSync(path.join(source, ten, "image/card"))) {
 const id = path.parse(file).name;
 if (/^[a-zA-Z0-9_-]+$/.test(id) && /\.(webp|png|jpg)$/i.test(file)) {
  if (!cards[id] || file.endsWith(".webp")) cards[id] = `${ten}/image/card/${file}`;
 }
}
for (const [id, file] of Object.entries(cards)) cards[id] = asset(file);
for (const relative of [`${ten}/assets/image`, `${ten}/image/decoration`, `${ten}/image/identity`, `${hand}/skill/images`, `${hand}/lbtn/images`, "extension/选将美化", "extension/手杀MVP"]) {
 tree(relative, file => /\.(png|jpe?g|webp|gif|woff2?|ttf|otf)$/i.test(file));
}
asset("image/background/1.jpg");
asset(`${hand}/line.png`);
asset(`${rz}/fonts/shousha.ttf`);
asset(`${rz}/audio/sgs/Enter.mp3`);
// Spine uses sibling .atlas/.png paths, so retain its directory layout.
for (const folder of ["spine/startSpine/戏志才·举棋若定", "spine/Ot"]) {
 const copy = (from,to) => {
  fs.mkdirSync(to,{recursive:true});
  for (const entry of fs.readdirSync(from,{withFileTypes:true})) {
   if(entry.isDirectory())copy(path.join(from,entry.name),path.join(to,entry.name));
   else fs.copyFileSync(path.join(from,entry.name),path.join(to,entry.name));
  }
 };
 copy(path.join(source,rz,folder), path.join(target,folder));
}
fs.mkdirSync(path.join(target,"vendor"), { recursive:true });
fs.copyFileSync(path.join(source,rz,"js/pixi6.min.js"),path.join(target,"vendor/pixi6.min.js"));

const cssGroups = {
 players: [`${ten}/player1_PC.css`, `${ten}/player_mark.css`],
 cards: [`${ten}/card.css`],
 buttons: [`${hand}/style.css`, `${hand}/skill/main1.css`, `${hand}/lbtn/main1.css`],
 menus: [`${ten}/dialog.css`, `${ten}/newdialog.css`, `${ten}/equip.css`, `${ten}/pause.css`, `${hand}/KGMH/kaiguan.css`],
 fonts: [`${ten}/font.css`],
};
const cssFiles = {};
for (const [part, files] of Object.entries(cssGroups)) {
 const seen = new Set();
 function compile(relative) {
  if (seen.has(relative)) return ""; seen.add(relative);
  const original = path.join(source, relative);
  if (!fs.existsSync(original)) { missing.add(relative); return ""; }
  const root = postcss.parse(fs.readFileSync(original,"utf8"), {from:original});
  root.walkAtRules("import", rule => {
   const match = rule.params.match(/['"]([^'"]+)['"]/);
   if (match) rule.replaceWith(postcss.parse(compile(path.posix.join(path.posix.dirname(relative),match[1])))); else rule.remove();
  });
  root.walkDecls(decl => {
   decl.value = decl.value.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/g,(whole,quote,url) => {
    url=url.trim();
    if (/^(data:|https?:|#)/.test(url)) return whole;
    if(relative===`${ten}/pause.css`)url=url.replace(/^\.\.\/image\//,"image/");
    const file = asset(path.posix.normalize(path.posix.join(path.posix.dirname(relative),url)));
    return file ? `url("${file}")` : "none";
   });
  });
  return root.toString();
 }
 const root = postcss.parse(files.map(compile).join("\n"));
 root.walkRules(rule => {
  if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
  // Prefix every original selector: no styles reach the online room or another pack.
  rule.selectors = rule.selectors.filter(selector => !/\.connect|#splash|#start|\.skill-control \.\s*$/.test(selector)).map(selector => {
   selector = selector.replace(/^html\s*/, "").replace(/^body\s*/, "");
   return `body[data-shousha-parts~="${part}"]:not(.shousha-online) ${selector.trim() || "#window"}`;
  });
  if (!rule.selectors.length) rule.remove();
 });
 cssFiles[part] = `${part}.css`;
 fs.writeFileSync(path.join(target,`${part}.css`), root.toString());
}
const parts = ["home","modes","arena","cards","cardback","buttons","menus","players","hp","lines","fonts"];
const names = ["登录与大厅","模式选择","对局布局","卡牌正面","卡牌背面","操作与技能按钮","菜单与弹窗","武将框与选将","体力","指示线","字体"];
const components = Object.fromEntries(parts.map((id,i) => [id,{name:`手杀标准 · ${names[i]}`,runtime:"shousha",settings:{},assets:{},style:{}}]));
components.arena.settings = {theme:"simple",layout:"mobile",phonelayout:true,image_background:"default",image_background_random:false};
components.players.settings = {player_style:"default",border_style:"auto",presentation_style:"shousha"};
components.cards.settings = {card_style:"default"};
components.cardback.settings = {cardback_style:"default"};
components.hp.settings = {hp_style:"glass"};
components.lines.settings = {zhishixian:"default"};
components.buttons.settings = {control_style:"default"};
components.menus.settings = {menu_style:"default"};
const manifest = {format:"noname-ui-workshop",version:1,id:"shousha-standard",name:"手杀标准UI",author:"琉璃版原作者及各 UI 模块作者",description:"迁移自三国杀·琉璃版5.5：动态登录、主题大厅、模式选择及对局外观。使用本项目游戏接口，联机房间沿用本项目实现。",components};
fs.writeFileSync(path.join(target,"ui-workshop.json"),JSON.stringify(manifest,null,2)+"\n");
fs.writeFileSync("apps/core/noname/ui/workshop/shoushaPreset.js",`// Generated by scripts/migrate-shousha.mjs\nexport const shoushaManifest = ${JSON.stringify({...manifest,id:"builtin-shousha-standard"},null,2)};\n`);
const homeCSS=path.join(target,"home.css");
if(fs.existsSync(homeCSS))fs.writeFileSync(homeCSS,fs.readFileSync(homeCSS,"utf8").replace(/assets\/(?:FONT_PLACEHOLDER|[a-f0-9]{24})\.ttf/,resources[`${rz}/fonts/shousha.ttf`]));
fs.writeFileSync(path.join(target,"resources.json"),JSON.stringify({resources,cards,sheets,cssFiles},null,2)+"\n");
fs.writeFileSync(path.join(target,"info.json"),JSON.stringify({name:"手杀标准UI",translation:"手杀标准UI",author:manifest.author,version:"1.0.0",intro:manifest.description},null,2)+"\n");
fs.writeFileSync(path.join(target,"SOURCE.json"),JSON.stringify({source:"三国杀·琉璃版5.5",modules:["如真似幻","十周年UI","手杀ui","选将美化","手杀MVP"],resources,missing:[...missing].sort()},null,2)+"\n");
const files=[];
function inventory(folder,prefix="") {for(const entry of fs.readdirSync(folder,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())inventory(path.join(folder,entry.name),name+"/");else if(name!=="files.json")files.push(name);}}
inventory(target);
fs.writeFileSync(path.join(target,"files.json"),JSON.stringify(files.sort(),null,2)+"\n");
const catalogPath="apps/core/game/extension-catalog.json";
const catalog=JSON.parse(fs.readFileSync(catalogPath,"utf8"));
if(!catalog.some(item=>item.name==="手杀标准UI")){
 catalog.push({name:"手杀标准UI",category:"ui",path:"extension/ui/手杀标准UI"});
 fs.writeFileSync(catalogPath,JSON.stringify(catalog,null,2)+"\n");
}
const registryPath="apps/core/game/organized-extensions.json";
const registry=JSON.parse(fs.readFileSync(registryPath,"utf8"));
const hashes=Object.fromEntries(["extension.js","home.js","home.css","visuals.js","ui-workshop.json"].map(file=>[file,crypto.createHash("sha256").update(fs.readFileSync(path.join(target,file))).digest("hex")]));
const registration={name:"手杀标准UI",hash:hashes["extension.js"],characters:[],files:hashes,defaultEnabled:false,source:"local-migration:liuli-5.5"};
const old=registry.findIndex(item=>item.name==="手杀标准UI");if(old<0)registry.push(registration);else registry[old]=registration;
fs.writeFileSync(registryPath,JSON.stringify(registry,null,2)+"\n");
console.log(JSON.stringify({target,files:files.length,bytes:files.reduce((sum,f)=>sum+fs.statSync(path.join(target,f)).size,0),missing:[...missing]},null,2));
