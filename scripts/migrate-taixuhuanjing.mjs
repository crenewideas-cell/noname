/** One-time, explicit source import. Runtime/builds never read the reference tree. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';

const source = path.resolve(process.argv[2] || 'temp/三国杀·琉璃版5.5/resources/app/extension/太虚幻境');
const target = path.resolve('apps/core/mode/taixuhuanjing');
const media = 'mode/taixuhuanjing/assets';
const header = '// Migrated from 太虚幻境 2.0.3.4 (琉璃版 5.5), GPL-3.0. Shared core mode; never loaded by a UI provider.\nimport {lib, game, ui, get, ai, _status} from "noname";\n';
const hashes = {};
async function read(file) {
 const buffer = await fs.readFile(path.join(source, file));
 hashes[file] = crypto.createHash('sha256').update(buffer).digest('hex');
 return buffer.toString('utf8');
}
function parse(text) { return ts.createSourceFile('source.js', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS); }
function find(text, predicate) {
 let result;
 function visit(node) { if (!result && predicate(node)) result = node; if (!result) ts.forEachChild(node, visit); }
 visit(parse(text));
 if (!result) throw new Error('Source structure changed: '+predicate);
 return result;
}
function callback(text) {
 const call = find(text, n => ts.isCallExpression(n) && /^(game\.import|window\.txhjModeImport)$/.test(n.expression.getText()));
 return call.arguments.find(n => ts.isFunctionExpression(n));
}
const body = node => node.body.getText().slice(1, -1);
function rewrite(text) {
 return text.replaceAll('extension/太虚幻境', media)
  .replaceAll('ext:太虚幻境/', media+'/')
  .replaceAll("'..', 'extension', '太虚幻境'", "'..', 'mode', 'taixuhuanjing', 'assets'")
  .replaceAll('"..", "extension", "太虚幻境/audio"', '"..", "mode", "taixuhuanjing/assets/audio"')
  .replaceAll('extension/十周年UI/image/card/', 'image/card/')
  .replaceAll('extension/十周年UI/image/decoration/', media+'/image/decoration/')
  .replace(/\.contains\(/g, '.includes(').replace(/\.classList\.includes\(/g,'.classList.contains(')
  .replace(/for\s*\(i\s*=/g,'for (var i =')
  .replaceAll('trigger.num += n;', 'trigger.num += num;')
  .replace(/game\.delay\((100|500|1000)\)/g, (_,ms)=>'game.delay('+(Number(ms)/1000)+')');
}
async function write(file, text) {
 await fs.mkdir(path.dirname(path.join(target, file)), {recursive:true});
 await fs.writeFile(path.join(target, file), text);
}

const extension = await read('extension.js');
const factory = callback(extension);
const descriptor = factory.body.statements.findLast(n => ts.isReturnStatement(n)).expression;
const packageNode = descriptor.properties.find(n => n.name?.getText() === 'package').initializer;
await write('skills-package.js', header+'export default function createSkills() { return '+rewrite(packageNode.getText())+'; }\n');

let framework = body(callback(await read('extension_framework.js')));
const addMode = find(framework, n => ts.isCallExpression(n) && n.expression.getText() === 'game.addMode');
const definition = addMode.arguments[1].getText();
const metadata = addMode.arguments[2];
const config = metadata.properties.find(n => n.name?.getText() === 'config').initializer.getText();
await write('config.js', 'export function createModeConfig(game) { return '+config+'; }\n');
framework = framework.slice(0, addMode.parent.getStart()) + framework.slice(addMode.parent.end);
// No platform file probing, extension loader or legacy UI mutation remains.
const replacements = [];
function strip(node) {
 if (ts.isIfStatement(node) && (node.expression.getText() === 'window.dui' || /lib\.config\['extension_(?:'\+'十周年UI'\+'_enable|手杀ui_enable)'\]/.test(node.expression.getText()))) {
  replacements.push([node.getStart(), node.end, node.elseStatement?.getText().replace(/^\{([\s\S]*)\}$/, '$1') || '']); return;
 }
 if (ts.isExpressionStatement(node) && node.getText().startsWith('game.tsymq_checkFileExist=')) {
  replacements.push([node.getStart(),node.end,'']); return;
 }
 ts.forEachChild(node,strip);
}
strip(parse(framework));
for (const [start,end,value] of replacements.sort((a,b)=>b[0]-a[0])) framework=framework.slice(0,start)+value+framework.slice(end);
framework=framework.replace(/window\.dcdAnim \? false : true/g,'true')
 .replace(/\s*if\(!window\.txhj_libCharacterChg\)\s*\{[\s\S]*?lib\.character\[_status\.choiceCharacter\]\[3\] = _status\.TaiXuHuanJingGame\.skills\.slice\(0\);/, '')
 .replaceAll('game.players[seatnum].init(_status.choiceCharacter);', 'game.players[seatnum].init(_status.choiceCharacter, false);\n                        game.players[seatnum].addSkill(_status.TaiXuHuanJingGame.skills.slice());')
 .replaceAll('game.players[0].init(_status.choiceCharacter);', 'game.players[0].init(_status.choiceCharacter, false);\n                                game.players[0].addSkill(_status.TaiXuHuanJingGame.skills.slice());')
 .replaceAll('navigator.notification.confirm(', 'confirmChoice(')
 .replaceAll('game.reload3()', 'returnToLobby()')
 .replaceAll("divImp2.setBackgroundImage('image/card/yuheng.png');", "(typeof divImp2 === 'undefined' ? divImp : divImp2).setBackgroundImage('image/card/yuheng.png');")
 .replaceAll('txcsanm.hstop(i);', 'window.txcsanm?.hstop(i);')
 .replaceAll('game.players[i].stopDynamic();', '')
 .replaceAll('_status.mbmowang_return[this.playerid]', '_status.mbmowang_return?.[this.playerid]')
 .replaceAll("game.saveConfig('taixuhuanjing',undefined);", '')
 .replaceAll("player.discardPlayerCard(i,Infinity,'hej',true);", "for (const card of player.getCards('hej')) card.remove();")
 .replace('if(!info||!info.length) continue;', 'if(!info || !(info.skills || info[3])) continue;')
 .replaceAll('ui.sidebar3.innerHTML=', 'if (ui.sidebar3) ui.sidebar3.innerHTML=')
 .replaceAll('ui.mebg.remove();','ui.mebg?.remove();')
 .replaceAll('ui.me.remove();','ui.me?.remove();')
 .replaceAll('ui.handcards1Container.remove();','ui.handcards1Container?.remove();')
 .replaceAll('ui.handcards2Container.remove();','ui.handcards2Container?.remove();');
framework=framework.replaceAll('document.body.appendChild(desc);', "home.appendChild(desc);\n                    desc.style.pointerEvents = 'none';")
 .replace("home.update = function(){\n            if (lib.config.taixuhuanjing.equip1", "home.update = function(){\n            for (const tip of home.querySelectorAll('.taixuhuanjing_skillInfoDesc,.taixuhuanjing_equipInfoDesc,.SLBuffDesc')) tip.remove();\n            if (lib.config.taixuhuanjing.equip1");
framework=framework.replace("characterpack == 'mode_extension_太虚幻境'", "characterpack == 'taixuhuanjing_npc'");
// The modern event scheduler keeps the paused battle alive between encounters.
// Reuse it instead of nesting another battle and later rebuilding an active arena.
framework=framework.replace("game.chooseCharacterTaiXuHuanJing = function(){", `game.chooseCharacterTaiXuHuanJing = function(){
        if (txhj.battleEvent && !txhj.battleEvent.finished) {
            txhj.battleEvent.goto(0);
            return txhj.battleEvent;
        }`);
framework=framework.replace("var next=game.createEvent('chooseCharacter',false);", "var next=game.createEvent('chooseCharacter',false);\n        txhj.battleEvent = next;");
await write('framework.js', header+'import {createStyle, confirmChoice, returnToLobby} from "./view.js";\nexport default function installFramework() {\n'+rewrite(framework).replaceAll('game.createCss(', 'createStyle(')+'\n}\n');
let mode=definition;
const start=mode.indexOf("            game.seasonPack = {};");
const end=mode.indexOf('            "step 1"',start);
if(start<0||end<0)throw new Error('Mode start layout changed');
mode=mode.slice(0,start)+mode.slice(end);
mode=mode.replace("_status.mode = 'taixuhuanjing';", "_status.mode = 'taixuhuanjing';\n            lib.init.onfree();");
// Home.off already queues the first encounter before resuming this start event.
mode=mode.replace(/\s*"step 3"\s*game\.chooseCharacterTaiXuHuanJing\(\);/, '');
mode=mode.replace(/if\(lib\.config\['extension_'\+'十周年UI'\+'_enable'\]\)\{[\s\S]*?\};/g,'');
await write('definition.js',header+'export default function createDefinition() { return '+rewrite(mode)+'; }\n');

for(const [sourceFile,output] of Object.entries({
 'extension_character.js':'characters.js','extension_card.js':'cards.js','extension_skill.js':'skills.js',
 'extension_servant.js':'servant.js','event/event_universal.js':'events.js',
})) {
 let text=body(callback(await read(sourceFile)));
 if(output==='characters.js') {
  text=text.replace('game.addCharacterPack(game.NPCPack,"太虚幻境");','');
  text=text.replace(/if\(lib.device\|\|lib.node\)\{[\s\S]*?(?=    game\._nmjsList)/, `for (const [id, data] of Object.entries(game.NPCPack.character)) data[4].push('img:${media}/image/loutou/'+id+'.jpg');\n`);
 }
 if(output==='cards.js') {
  text=text.slice(0,text.lastIndexOf('    if(lib.device||lib.node)'))+`\n for (const [id,card] of Object.entries(txhj_cardPack.card)) card.image='${media}/image/card/'+id+'.png';\n return txhj_cardPack;\n`;
 }
 if(output==='skills.js') {
  const audioStart=text.indexOf('var txhjUseSkill = game.trySkillAudio;');
  const audioEnd=text.indexOf('//宝物栏效果',audioStart);
  text=text.slice(0,audioStart)+text.slice(audioEnd);
  text=text.replace('lib.card[i].subtype="equip5";', 'if (lib.card[i]) lib.card[i].subtype="equip5";');
  const oldEquip=find(text,n=>ts.isExpressionStatement(n)&&n.getText().startsWith('lib.skill._txhj_equip5='));
  text=text.slice(0,oldEquip.getStart())+text.slice(oldEquip.end);
 }
 if(output==='servant.js') {
  // The source class registers gameplay callbacks from its renderer constructor.
  // Keep only servant data here; the mode registers the single entry rule.
  text='window.Servant = ServantView;\n'+text.slice(text.indexOf('    txhj.servantData = servantData ='));
  text=text.replace(/\bservantData\b/g,'window.servantData').replace('txhj.window.servantData', 'txhj.servantData');
 }
 await write(output,header+(output==='servant.js'?'import {ServantView} from "./servant-view.js";\n':'')+'export default function install() {\n'+rewrite(text)+'\n}\n');
}
for(const [sourceFile,output] of Object.entries({'extension_buff.js':'buffs.js','extension_collect.js':'collection.js','extension_csrank.js':'ranks.js'})) {
 await write(output,header+'export default function install() {\n'+rewrite(await read(sourceFile))+'\n}\n');
}
const seasons=(await fs.readdir(path.join(source,'dlc'))).sort();
for(const id of seasons)await write('seasons/'+id+'.js',header+'export default function install() {\n'+rewrite(body(callback(await read('dlc/'+id+'/extension_season.js'))))+'\n}\n');
await write('seasons.js',seasons.map(id=>`import ${id} from './seasons/${id}.js';`).join('\n')+'\nexport default function installSeasons() {\n'+seasons.map(id=>` ${id}();`).join('\n')+'\n}\n');

const files=[];
async function copyAssets(relative='') {
 for(const entry of await fs.readdir(path.join(source,relative),{withFileTypes:true})) {
  const file=path.posix.join(relative,entry.name);
  if(entry.isDirectory()) { if(entry.name!=='更新（日志）')await copyAssets(file); continue; }
  if(!/\.(png|jpe?g|webp|gif|mp3|ogg|wav|skel|atlas|json|css|ttf|woff2?)$/i.test(file))continue;
  const assetFile=file.replace('dlc/HaiWaiFengHe/', 'dlc/HaiWaiFenghe/');
  const destination=path.join(target,'assets',assetFile);
  await fs.mkdir(path.dirname(destination),{recursive:true});
  if(file.endsWith('.css')) await fs.writeFile(destination,rewrite(await read(file)).replaceAll('../../'+media+'/', './').replace('left: :', 'left:'));
  else await fs.copyFile(path.join(source,file),destination);
  files.push(assetFile);
 }
}
await copyAssets();
await fs.copyFile('apps/core/extension/ui/手杀标准UI/native/animation-renderer.js',path.join(target,'animation-renderer.js'));
await write('spine.js',(await fs.readFile('apps/core/extension/ui/手杀标准UI/original/十周年UI/spine.js','utf8'))+'\nexport default spine;\n');
for(const style of ['style1','style2']) {
 const splash=path.resolve('apps/core/image/splash',style);await fs.mkdir(splash,{recursive:true});
 await fs.copyFile(path.join(source,'taixuhuanjing.jpg'),path.join(splash,'taixuhuanjing.jpg'));
}
// Shared mode art previously borrowed from a UI extension is owned here now.
const decorations=path.join(source,'../十周年UI/image/decoration');
await fs.mkdir(path.join(target,'assets/image/decoration'),{recursive:true});
for(const name of (await fs.readdir(decorations)).filter(name=>/^name_.*\.png$|^identity_tx_.*\.png$/.test(name))) {
 const file='image/decoration/'+name;
 await fs.copyFile(path.join(decorations,name),path.join(target,'assets',file));files.push(file);
}
const cardSource=await read('extension_card.js');
const cardPack=find(cardSource,n=>ts.isVariableDeclaration(n)&&n.name.getText()==='txhj_cardPack').initializer;
const cardNames=cardPack.properties.find(n=>n.name?.getText()==='card').initializer.properties.map(n=>n.name.getText().replace(/^['"]|['"]$/g,''));
await fs.mkdir(path.join(target,'assets/image/card'),{recursive:true});
for(const name of cardNames) {
 const file='image/card/'+name+'.png';
 // The reference has no 白鹄 artwork; use its existing defensive-mount art.
 const art=name==='txhj_baihu'?'image/card/hualiu.png':file;
 await fs.copyFile(path.join(source,'../十周年UI',art),path.join(target,'assets',file));files.push(file);
}
await write('assets/files.json',JSON.stringify(files.sort(),null,2)+'\n');
await write('SOURCE.json',JSON.stringify({name:'太虚幻境',version:'2.0.3.4',reference:'三国杀·琉璃版5.5',author:'太虚幻境攻坚小分队',license:'GPL-3.0',seasons,sourceHashes:hashes,assets:files.length},null,2)+'\n');
console.log(`Imported ${seasons.length} seasons and ${files.length} assets into ${target}`);
