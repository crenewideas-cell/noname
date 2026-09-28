import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import {fixMatchingScenes} from './fix-matching-scenes.mjs';
import {fixGalleryControls} from './fix-gallery-controls.mjs';

// Regeneration must not revive the legacy gameplay content callback.
export function generateShoushaLobby(root, source) {
 if(typeof source!=='string')throw new Error('Pass the external migrated lobby source explicitly; legacy modules are not stored in the provider.');
 const file='external-lobby.js';
 const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);
 let factory;
 function visit(node){if(ts.isBinaryExpression(node)&&node.left.getText(ast).startsWith('window.shoushaNativeFactories['))factory=node.right;else ts.forEachChild(node,visit);}
 visit(ast);
 if(!factory||!ts.isFunctionExpression(factory))throw new Error('Missing lobby factory');
 const returned=factory.body.statements.find(n=>ts.isReturnStatement(n));
 const home=returned.expression.properties.find(n=>n.name?.getText(ast)==='createHome');
 if(!home)throw new Error('Missing lobby scene');
 const helpers=factory.body.statements.filter(n=>n!==returned&&!/liulikill_rz_codeFix|rzPaiweiNext|rz_nextIsPaiwei/.test(n.getText(ast))).map(n=>{
  if(ts.isExpressionStatement(n)&&ts.isBinaryExpression(n.expression)&&n.expression.left.getText(ast)==='window.playAudioRZ')return "window.playAudioRZ=(...args)=>game.playAudio('audio',...args);";
  return n.getText(ast);
 }).join('\n');
 let scene=home.getText(ast);
 scene=scene.replace('let openCharactersWhenReady=false;', 'let openCharactersWhenReady=false;\nwindow.qhlyOpenCharacters=function(){openCharactersWhenReady=true;bridge.notice("武将界面正在载入…");};')
  .replace('let currentwujiang = null;', "let currentwujiang = null;\nwindow.qhlyRefreshFavorites=function(){for(const sprite of wujiangpool)sprite.fav=(!lib.config.rzLock_jsc&&lib.config.favouriteCharacter.includes(sprite.name))||(!lib.config.rzLock_jzj&&game.rz_remen_cha.includes(sprite.name));if(currentwujiang==='btn_lvl1_1a'){if(renderProcess!=null)cancelAnimationFrame(renderProcess);bbox.removeChildren();filteredSprites=wujiangpool.filter(sprite=>sprite.fav);addSprites(filteredSprites.slice(),bbox);}};")
  .replace('function oppeen(container,smooth) {','window.qhlyOpenCharacters=function(){if(game.isUnlockDialogs.g){game.cls_wjbg=true;oppeen(wujianghome);}else{openCharactersWhenReady=true;bridge.notice("武将界面正在载入…");}};\nfunction oppeen(container,smooth) {');
 // Retain the ranked page, labels and transition, but never deduct stars or
 // manufacture match bookkeeping when its start button is clicked.
 scene=scene.replace(/case "versustwobtn":[\s\S]*?(?=entermodegame\('versus', 'two'\);)/, 'case "versustwobtn":\n');
 // Core skin dialogs do not require fake game/arena nodes or old skin modules.
 scene=scene.replaceAll("if( lib.config.extension_皮肤切换_czgEnable)","if(true)")
  .replaceAll('if (lib.config.extension_千幻聆音_enable && lib.config.rzshxqhly)', 'if (true)')
  .replace(/ui\.window\s*=\s*ui\.create\.div\('#window',\s*document\.body\);/g,'')
  .replace(/ui\.arena\s*=\s*ui\.create\.div\('#arena.nome',\s*ui\.window\);/g,'');
 // Bind the actual skin button and retire the legacy dependency toggle.
 scene=scene.replace('case "under6":','case "under5": bridge.skins(); break;\ncase "under6":')
  .replace('[under1,shop,under3,under4,under5].forEach','[under1,shop,under3,under4].forEach')
  .replace(/wujiangmenupifu\.on\('pointerup', \(\) => \{[\s\S]*?(?=                                    \/\/右下角按钮加)/, "wujiangmenupifu.on('pointerup', () => { bridge.skins(); });\n");
 // Lobby tools use the shared host menu without waiting for legacy settings.
 // Guild has no host implementation; do not run its legacy press handlers.
 scene=scene.replace("const under3 = rzshcreatex('under3');", "const under3 = rzshcreate('under3');\nunder3.interactive = true;\nunder3.buttonMode = true;\nunder3.on('pointertap', () => bridge.notice('公会功能暂未开放'));")
  .replace('uiinit(menu1, true);', "uiinit(menu1);\nmenu1.interactive = true;\nmenu1.buttonMode = true;\nmenu1.on('pointertap', () => bridge.openTools(() => uihome.addChild(menuhome)));")
  .replace(/case "menu1":[\s\S]*?break;/, '');
 // Search/filter controls use the core index in the current gallery.
 scene=scene.replace(/if\(!lib\.config\.extension_斗转星移_enable\) \{[\s\S]*?(?=\/\/quanbuxianshitext\.scale)/, "const quanbuxianshitext = new PIXI.Text('全部武将', {fontFamily:'shousha',fontSize:22,fill:'#FFE4B5'});\n")
  .replace(/\/\/搜索，跳转至全能搜索[\s\S]*?(?=uiinit\(search_btn\);)/, '')
  .replace('let currentgroup = null;', 'let currentgroup = null;\nconst characterTools = bridge.characterTools({page:wujianghome,filterButton:quanbuxianshi,searchButton:search_btn,filterLabel:quanbuxianshitext,render:renderSprites,canvas:pixiapp.view,renderer:pixiapp.renderer,ticker:pixiapp.ticker});')
  .replace('function addSprites(filteredSpritess, bbox) {', `function addSprites(filteredSpritess, bbox) { characterTools.show(filteredSpritess); }
function renderSprites(filteredSpritess) {
 if(renderProcess!=null)cancelAnimationFrame(renderProcess);
 bbox.removeChildren();
 wujiangscrollright.resize({scrollWidth:wujiangscrollright.boxWidth,scrollHeight:Math.max(wujiangscrollright.boxHeight,(Math.ceil(filteredSpritess.length/4)*192+14)*pph)});
 wujiangscrollright.scrollTop=0;`);
 const output=`// Generated by scripts/generate-ui-lobby.mjs: lobby only, no gameplay content.\nwindow.shoushaLobbyFactory = function(lib,game,ui,get,ai,_status,bridge){\n${helpers.replace('const config = jjGradeConfig[','const config = window.jjGradeConfig[')}\nreturn {${scene}};\n};\n`;
 const fixed=fixGalleryControls(fixMatchingScenes(output,'shousha'),'shousha');
 fs.writeFileSync(path.join(root,'native/lobby.js'),fixed);
 return fixed;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))throw new Error('Use migrate-shousha-native.mjs --source=<external resources/app>; no archived engine module is needed in the UI directory.');
