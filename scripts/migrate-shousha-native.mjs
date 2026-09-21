// Import the actual Liuli UI programs and their complete local resource trees.
// This is a source migration, not a test runner. Never reads Home/UserData.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {generateShoushaLobby} from './generate-ui-lobby.mjs';
import crypto from 'node:crypto';
import {optionalScriptDefaults} from '../apps/core/extension/ui/手杀标准UI/native/script-policy.mjs';
const sourceArgument=process.argv.find(arg=>arg.startsWith('--source='))?.slice('--source='.length);
if(!sourceArgument)throw new Error('请通过 --source=<参考工程的 resources/app 目录> 指定一次性迁移来源。日常运行、构建和导出均不需要参考工程。');
const source=path.resolve(sourceArgument);
const target=path.resolve('apps/core/extension/ui/手杀标准UI');
const names=['如真似幻','十周年UI','手杀ui','选将美化','手杀MVP','皮肤切换','千幻聆音','标记补充','电脑适配'];
const read=p=>fs.readFileSync(path.join(source,p),'utf8');
const write=(p,s)=>{fs.mkdirSync(path.dirname(path.join(target,p)),{recursive:true});fs.writeFileSync(path.join(target,p),s);};
const parse=s=>ts.createSourceFile('source.js',s,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
function nodes(root,predicate){const found=[];function walk(n){if(predicate(n))found.push(n);ts.forEachChild(n,walk);}walk(root);return found;}
function edits(text,changes){for(const [start,end,value] of changes.sort((a,b)=>b[0]-a[0]))text=text.slice(0,start)+value+text.slice(end);return text;}
function rebrand(text){return text.replace(/三国杀\s*[·•・]?\s*琉璃版\s*(?:5\.5)?|琉璃版\s*(?:5\.5)?/g,'手杀标准UI');}
function remap(text){
 // The source filename is a literal percent sign; its request URL must escape it.
 text=text.replaceAll('character/images/num/%.png','character/images/num/%25.png');
 if(text.includes("game.removeGlobalSkill('mx_start')")){
  const ast=parse(text),changes=[];
  for(const node of nodes(ast,n=>ts.isPropertyAssignment(n)&&n.name.getText(ast)==='content'&&n.initializer.getText(ast).includes("game.removeGlobalSkill('mx_start')"))){
   let fn=node.initializer.getText(ast).replace(/^function/,'async function').replace(/var bounds = animation\.getSpineBounds\('([^']+)'\);/g,
    "if (!animation.hasSpine('$1')) await new Promise((resolve,reject)=>animation.loadSpine('$1','skel',resolve,()=>reject(new Error('开局动画加载失败：$1')))); var bounds = animation.getSpineBounds('$1');");
   fn=`async function(){const present=${fn};void present.call(this).catch(error=>console.warn('手杀标准UI：开场特效不可用',error));}`;
   changes.push([node.initializer.getStart(ast),node.initializer.end,fn]);
  }
  text=edits(text,changes);
 }
 if(text.includes('AnimationPlayer.prototype.loadSpine = function')){
  text=text.replace('var fileNameList = fileList.concat();',`var fileNameList = (fileList || []).slice();
 var priorityEffects = ['skeleton','skeletonxHp','shoushakaizhan','effect_youxikaishi_SZN'];
 fileNameList.sort((a,b)=>(priorityEffects.includes(b.name)?1:0)-(priorityEffects.includes(a.name)?1:0));`);
  text=text.replace('var file = fileNameList.shift();',`if(!priorityEffects.includes(fileNameList[0].name)&&!game.roundNumber){setTimeout(read,500);return;}
 var file = fileNameList.shift();`);
  text=text.replace('};read();read();','};read();');
  text=text.replace(/\bread\(\);(?=\r?\n)/g,'setTimeout(read,150);');
  text=text.replace('animation.prepSpine(this.name);','// Parse skeletons when played, rather than decoding the whole library during selection.');
  text=text.replace(/(animation(?:\.cap)?\.loadSpine\(file\.name, file\.fileType, function\(\)\{[\s\S]*?)\}\);/g,'$1}, function(){setTimeout(read,150);});');
  text=text.replace('return AnimationPlayer;',`// Share on-demand and background loads of the same skeleton.
 var loadSpineOnce=AnimationPlayer.prototype.loadSpine;
 AnimationPlayer.prototype.loadSpine=function(name,type,onload,onerror){
  if(this.hasSpine(name)){onload?.call({name});return;}
  var loads=this._shoushaLoads ||= new Map(),listeners=loads.get(name);
  if(listeners){listeners.push([onload,onerror]);return;}
  listeners=[[onload,onerror]];loads.set(name,listeners);
  const finish=(index)=>{loads.delete(name);for(const pair of listeners){try{pair[index]?.call({name});}catch(error){console.error(error);}}};
  try{return loadSpineOnce.call(this,name,type,()=>finish(0),()=>finish(1));}catch(error){finish(1);console.error(error);}
 };
 return AnimationPlayer;`);
 }
 if(text.includes('game.chooseCharacterHuanle = function()')){
  text=text.replace('game.delay(5);','game.delay(0.35);').replace('game.delay(2);','game.delay(0.35);');
  text=text.replace(/}\s*else \{\s*setTimeout\(function\(\) \{\s*redo\(\);\s*},1000\);/, "}else if(dialog.isConnected) {\n                    setTimeout(function() {\n                        redo();\n                    },100);");
 }
 for(const name of names){
  text=text.replaceAll('extension/'+name+'/', 'extension/手杀标准UI/original/'+name+'/');
  text=text.replaceAll("'extension/"+name+"'", "'extension/手杀标准UI/original/"+name+"'");
  text=text.replaceAll('"extension/'+name+'"', '"extension/手杀标准UI/original/'+name+'"');
 }
 text=text.replaceAll("'extension/' + decadeUIName + '/'", "'extension/手杀标准UI/original/' + decadeUIName + '/'");
 text=text.replaceAll("'extension/' + extensionName + '/'", "'extension/手杀标准UI/original/' + extensionName + '/'");
 text=text.replaceAll("'extension/' + app.name", "'extension/手杀标准UI/original/' + app.name");
 text=text.replaceAll("'extension/'+app.name", "'extension/手杀标准UI/original/'+app.name");
 text=text.replace(/document\.body\.appendChild\((\w*script\w*)\)/gi,'document.head.appendChild($1)');
 text=text.replace('window.extTraList[tratype]', '(window.extTraList?.[tratype] || {})');
 text=text.replace('var a = ImageIsExist(url);', 'var a = bridge.resourceExists(url);');
 text=text.replace('?.hasWei(game.me)', '?.hasWei?.(game.me)');
 text=text.replaceAll('_status.event.parent.name', '_status.event.parent?.name');
 text=text.replace("if (skills1[k]) item.classList.add('used');", `if (!item) {
 item = ui.create.div('.skillMarkItem.zhuanhuanji', node, get.skillTranslation(k, player));
 item.setBackgroundImage('extension/手杀标准UI/original/手杀ui/skill/images/ditu_yang.png');
 item.style.setProperty('--w', '42px');
 }
 if (skills1[k]) item.classList.add('used');`);
 text=text.replace(/let SC_fun=showCharacter_function\.toString\(\);[\s\S]*?lib\.element\.player\.\$showCharacter=eval\(SC_new\);/,
  'lib.element.player.$showCharacter=function(...args){const result=showCharacter_function.apply(this,args);window.yinni_character(this);return result;};');
 return rebrand(text);
}
let count=0, bytes=0;
function copyTree(relative,out){
 for(const item of fs.readdirSync(path.join(source,relative),{withFileTypes:true})){
  if(['.git','node_modules','Home','UserData','Cache'].includes(item.name))continue;
  const input=relative+'/'+item.name, output=out+'/'+item.name;
  if(item.isDirectory()){copyTree(input,output);continue;}
 const data=fs.readFileSync(path.join(source,input));
  if(process.argv.includes('--refresh-text')&&!/\.(js|css|html|json)$/i.test(item.name))continue;
  const text=/\.(js|css|html|json)$/i.test(item.name)?remap(data.toString('utf8')):data;
  write(output,text);count++;bytes+=data.length;
 }
}
if(!process.argv.includes('--code-only')||process.argv.includes('--refresh-text')) for(const name of names){if(process.argv.includes('--dependencies-only')&&fs.existsSync(path.join(target,'original',name)))continue;copyTree('extension/'+name,'original/'+name);console.log('Imported '+name);}
// These adapters also change during code-only migrations; assets remain local.
for(const file of ['animation.js','skill.js','doudizhu.js'])write('original/十周年UI/'+file,remap(read('extension/十周年UI/'+file)));
// The suite uses the source game's glass HP art, never the user's host skin.
for(const name of ['glass1.png','glass2.png','glass3.png','glass4.png']){
 const relative='theme/style/hp/image/'+name;
 const output=path.join(target,'original/core',relative);
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.copyFileSync(path.join(source,relative),output);
}
// Source CSS contains disabled snippets written with nested comments. Browsers
// tolerated them, but PostCSS stops loading the entire imported stylesheet.
{
 const file='original/十周年UI/equip_new.css';
 let css=fs.readFileSync(path.join(target,file),'utf8');
 css=css.replace(/\/\*\.player>\.equips>\.card>\.image \{ \/\*图片效果\*\/\*\/[\s\S]*?\n\}/,'/* Disabled equipment image effect: intentionally no declarations. */');
 write(file,css);
 const alternate='original/十周年UI/player.css';
 css=fs.readFileSync(path.join(target,alternate),'utf8');
 css=css.replace(/^([ \t]*)\/\*([^\r\n]*?)\/\*([^\r\n]*?)\*\/\*\/[ \t]*$/gm,'$1/* $2 $3 */');
 write(alternate,css);
}
// UI-owned backgrounds, fonts, and interface audio are retained separately.
for(const folder of ['image/background','font','audio/effect','audio/background']){
 if(!process.argv.includes('--code-only')&&!process.argv.includes('--dependencies-only')&&fs.existsSync(path.join(source,folder)))copyTree(folder,'original/core/'+folder);
}
function factory(name){const s=read('extension/'+name+'/extension.js');const ast=parse(s);const call=nodes(ast,n=>ts.isCallExpression(n)&&n.expression.getText(ast)==='game.import')[0];return {s,ast,fn:call.arguments[1]};}
for(const name of names.filter(n=>n!=='如真似幻')){
 let {s,fn}=factory(name);s=fn.getText();
 if(name==='皮肤切换'){
  const ast=parse(s),changes=[];
  for(const node of nodes(ast,n=>ts.isPropertyAssignment(n)&&n.name.getText(ast)==='qhly_hasExtension'))changes.push([node.initializer.getStart(ast),node.initializer.end,'function(name){return bridge.hasModule(name);}']);
  for(const node of nodes(ast,n=>ts.isPropertyAssignment(n)&&n.name.getText(ast)==='qhly_checkFileExist'))changes.push([node.initializer.getStart(ast),node.initializer.end,'function(path,callback){return bridge.checkFileExist(path,callback);}']);
  s=edits(s,changes);
 }
 // Legacy extension registration is controlled by the provider, not game.import.
 if(name==='千幻聆音'){
  // Modern content is an array of async steps. Never stringify and recompile it
  // as a legacy synchronous function, even if a proxy ignores the assignment.
  const ast=parse(s),changes=[];
  for(const n of nodes(ast,n=>ts.isVariableDeclaration(n)&&n.name.getText(ast)==='qhly_oldinit')){
   changes.push([n.initializer.getStart(ast),n.initializer.end,'bridge.playerInit']);
  }
  for(const n of nodes(ast,n=>ts.isFunctionDeclaration(n)&&n.name?.text==='qhly_reinit')){
   changes.push([n.getStart(ast),n.end,`function qhly_reinit(...args){
 const result=bridge.playerReinit.apply(this,args);
 if(window.doubleKuang)window.doubleKuang(this);
 return result;
}`]);
  }
  for(const n of nodes(ast,n=>ts.isExpressionStatement(n)&&ts.isBinaryExpression(n.expression)&&['lib.element.content.useSkill','lib.element.content.useCard'].includes(n.expression.left.getText(ast)))){
   changes.push([n.getStart(ast),n.end,n.expression.left.getText(ast).endsWith('useSkill')?'bridge.installSkinEvents();':'// Card skin audio is adapted through playCardAudio, not engine content.']);
  }
  for(const n of nodes(ast,n=>ts.isFunctionDeclaration(n)&&['qhly_changeUseSkill','qhly_changeUseCard'].includes(n.name?.text)))changes.push([n.getStart(ast),n.end,'']);
  for(const n of nodes(ast,n=>ts.isBinaryExpression(n)&&['game.qhly_checkFileExist','game.thunderFileExist','game.qhly_readFileAsText'].includes(n.left.getText(ast)))){
   const replacement={
    'game.qhly_checkFileExist':'function(path,callback){return bridge.checkFileExist(path,callback);}',
    'game.thunderFileExist':'function(path){return bridge.resourceExists(path);}',
    'game.qhly_readFileAsText':'function(path,callback){return bridge.readResourceText(path,callback);}',
   }[n.left.getText(ast)];
   changes.push([n.right.getStart(ast),n.right.end,replacement]);
  }
  s=edits(s,changes);
 }
 if(name==='十周年UI'){
  s=s.replace("this.js(decadeUIPath + 'vconsole.min.js');",'// Optional debugger was not present in the supplied distribution.');
  s=s.replaceAll("'extension/' + encodeURI(extensionName)","'original/' + encodeURI(extensionName)");
  s=s.replace("var player = ui.create.div('.player', position);","var player = new lib.element.Player(position); player.buildProperty();");
  s=s.replace("var card = ui.create.div('.card');","var card = new lib.element.Card(); card.buildProperty();");
  s=s.replace('decadeUI.get.extend(player, playerExtend);','var modernStorage=player.storage, modernStat=player.stat; decadeUI.get.extend(player, playerExtend); player.storage=modernStorage; player.stat=modernStat;');
  s=s.replace('decadeUI.get.extend(player, lib.element.player);','bridge.finishPlayer(player);');
  // Manifest enumeration can finish synchronously, before dui.statics exists.
  // readFiles already closes over the cards object returned by this initializer.
  s=s.replace('var cards = dui.statics.cards;','// Use the enclosing cards object during initialization.');
  // Keep script loading deterministic: content consumes decadeModule.modules.
  const ast=parse(s), changes=[];
  for(const n of nodes(ast,n=>ts.isPropertyAssignment(n)&&n.name.getText(ast)==='init'&&n.initializer.getText(ast).includes('var imgFormat = decadeUI.config.cardPrettify'))){
   changes.push([n.initializer.getStart(ast),n.initializer.end,'function(...args){return bridge.initCard(this,args);}']);
  }
  for(const n of nodes(ast,n=>ts.isBinaryExpression(n)&&['decadeModule.js','decadeModule.css'].includes(n.left.getText(ast))))changes.push([n.right.getStart(ast),n.right.end,n.left.getText(ast).endsWith('.js')?'function(path){return bridge.script(path);}':'function(path){return bridge.css(path);}']);
  for(const n of nodes(ast,n=>ts.isIfStatement(n)&&n.expression.getText(ast)==='window.fs'&&n.thenStatement.getText(ast).includes('readFiles(files)'))){
   changes.push([n.getStart(ast),n.end,"game.getFileList(decadeUIPath + 'image/card/', function(folders,files){readFiles(files);});"]);
  }
  s=edits(s,changes);
  // The selection UI must also be available in local games.
  s=s.replace("lib.config.extension_十周年UI_JBDDZ&&offline!='offline'",'lib.config.extension_十周年UI_JBDDZ');
 }
 if(name==='手杀ui'){
  const ast=parse(s), changes=[];
  // This callback-style initializer is awaited by our modern content adapter.
  for(const n of nodes(ast,n=>ts.isPropertyAssignment(n)&&n.name.getText(ast)==='loadPlugins')){
   changes.push([n.initializer.getStart(ast),n.initializer.end,`function(callback){bridge.handPlugins(app).then(callback);}`]);
  }
  // Do not replace the host engine bootstrap with the bundled 1.10 bootstrap.
  for(const n of nodes(ast,n=>ts.isExpressionStatement(n)&&ts.isBinaryExpression(n.expression)&&n.expression.left.getText(ast)==='lib.init.onload'))changes.push([n.getStart(ast),n.end,';']);
  s=edits(s,changes);
 }
 if(name==='选将美化'){
  const ast=parse(s),changes=[];
  // Skill packs and subskill names differ across engine releases. Decorate
  // existing marks only; missing legacy skills are not gameplay definitions.
  for(const n of nodes(ast,n=>ts.isExpressionStatement(n)&&ts.isBinaryExpression(n.expression)&&/^lib\.skill\.[\w$]+\.intro$/.test(n.expression.left.getText(ast)))){
   const owner=n.expression.left.expression.getText(ast);
   changes.push([n.getStart(ast),n.end,`if(${owner}) { ${n.getText(ast)} }`]);
  }
  s=edits(s,changes);
 }
 s=remap(s).replace(/^function\s*\(([^)]*)\)/,'function($1, bridge)');
 s=s.replace(/^(function[^\{]+\{)/,'$1\nconst localStorage=bridge.storage, sessionStorage=bridge.session;\n');
 write('native/'+name+'.js','window.shoushaNativeFactories ||= {};\nwindow.shoushaNativeFactories['+JSON.stringify(name)+'] = '+s+';\n');
}
// Extract the entire PIXI scene, leaving the obsolete engine bootstrap behind.
{
 const {s,ast,fn}=factory('如真似幻');
 const returned=fn.body.statements.find(ts.isReturnStatement).expression;
 const pre=returned.properties.find(p=>p.name?.getText(ast)==='precontent').initializer;
 const uiSprite=nodes(pre,n=>ts.isVariableStatement(n)&&n.declarationList.declarations.some(d=>d.name.getText(ast)==='uisprite'))[0];
 const scene=nodes(pre,n=>ts.isIfStatement(n)&&n.expression.getText(ast).startsWith('!lib.imported.mode')) .find(n=>n.thenStatement.getText(ast).includes('const pixiapp'));
 if(!scene)throw new Error('Liuli scene source not found');
 let sceneText=scene.thenStatement.getText(ast).slice(1,-1);
 const sceneAst=parse(sceneText), changes=[];
 for(const n of nodes(sceneAst,n=>ts.isFunctionDeclaration(n)&&n.name?.text==='rzshkz'))changes.push([n.body.getStart(sceneAst),n.body.end,'{bridge.finish(lib.config.mode);}']);
 sceneText=edits(sceneText,changes);
 sceneText=sceneText.replace('resizeTo: document.body,','width: bridge.screen.width, height: bridge.screen.height,');
 sceneText=sceneText.replace('document.body.appendChild(pixiapp.view);','bridge.mount(pixiapp);');
 sceneText=sceneText.replaceAll("spinelo.state.setAnimation(0, 'idle', true);","spinelo.state.setAnimation(0, 'idle', true); bridge.ready();");
 sceneText=sceneText.replaceAll('new PIXI.Loader()','bridge.own(new PIXI.Loader())').replaceAll('new PIXI.Ticker()','bridge.own(new PIXI.Ticker())');
 sceneText=sceneText.replace(/gsap\.(to|from|fromTo|timeline|set)\(/g,"bridge.tween('$1',");
 sceneText=sceneText.replaceAll('skinSwitch.cangZhenGe()','bridge.collection()').replaceAll("game.qhly_open_new(sprite.name, 'skill')",'bridge.character(sprite.name)');
 // The independent character browser owns every atlas it reads, including
 // navigation artwork previously borrowed from the settings/ranked loader.
 sceneText=sceneText.replace("gloader.add('shadow',",`gloader.add('paiweiui', lib.assetURL + 'extension/如真似幻/images/jj.json');
 gloader.add('menubtn', lib.assetURL + 'extension/如真似幻/images/menu.json');
 gloader.add('spritesui', lib.assetURL + 'extension/如真似幻/images/uiStyles/'+uis+'/ui.json');
 gloader.add('shadow',`);
 const localAst=parse(sceneText),localEdits=[];
 for(const n of nodes(localAst,n=>ts.isCaseClause(n)&&n.expression.getText(localAst)==='"solobtn"')){
  localEdits.push([n.statements.pos,n.end,'\n bridge.notice("暂未开放");\n break;\n']);
 }
 for(const n of nodes(localAst,n=>ts.isCaseClause(n)&&n.expression.getText(localAst)==='"mode3"'&&n.getText(localAst).includes('freegameModes'))){
  localEdits.push([n.statements.pos,n.end,'\n bridge.openOnlineLobby();\n break;\n']);
 }
 for(const n of nodes(localAst,n=>ts.isFunctionDeclaration(n)&&n.name?.text==='setupg')){
  const body=n.body.getText(localAst).replaceAll('zloader.resources.paiweiui','gloader.resources.paiweiui').replaceAll('zloader.resources.menubtn','gloader.resources.menubtn').replaceAll('yloader.resources.spritesui','gloader.resources.spritesui');
  localEdits.push([n.body.getStart(localAst),n.body.end,body]);
 }
 for(const n of nodes(localAst,n=>ts.isBinaryExpression(n)&&n.left.getText(localAst)==='window.rzsh_menuLock')){
  const fn=n.right.getText(localAst).replace("['上一项','开启','下一项']","['上一项','开启','下一项','退出']").replace("['上一项','禁用','下一项']","['上一项','禁用','下一项','退出']").replace('case 0:','case 0: case 4:').replaceAll('game.saveConfig([menuList[num][1]],','game.saveConfig(menuList[num][1],');
  localEdits.push([n.right.getStart(localAst),n.right.end,fn]);
 }
 sceneText=edits(sceneText,localEdits);
 // Character browsing must not wait for settings/ranked/matchmaking pages or
 // eagerly download portraits from the old engine's flat image directory.
 sceneText=sceneText.replace(/case "under6":\s*if\(game.isUnlockDialog\)/,'case "under6":\n if(game.isUnlockDialogs.g)');
 sceneText=sceneText.replace('oppeen(wujianghome)\n                                              }','oppeen(wujianghome)\n                                              }else{openCharactersWhenReady=true;bridge.notice("武将界面正在载入…");}');
 sceneText=sceneText.replace(/\s*gloader\.load\(setupg\)/g,'');
 sceneText=sceneText.replace("game.isUnlockDialogDo('g');",'');
 sceneText=sceneText.replace("resources = gloader.add(j, lib.assetURL + 'image/character/' + j + '.jpg');",'// Portrait textures are resolved lazily through the host character metadata.');
 sceneText=sceneText.replaceAll('gloader.resources[j].texture','PIXI.Texture.EMPTY').replaceAll('gloader.resources[imgpl].texture','bridge.characterTexture(imgpl, {width:166,height:190,priority:true})');
 // jbg is 184x274. Its portrait opening starts at (-83,-136), above
 // the level/rank labels. The original 253-high portrait overflowed its top.
 sceneText=sceneText.replace('player1_1.width = 138;','player1_1.width = 166;')
  .replace('player1_1.height = 253;','player1_1.height = 190;')
  .replace('player1_1.y = -35;','player1_1.y = -41;')
  .replace('player.addChild(player1_1, playerB, player1_2);',`player.addChild(player1_1, playerB, player1_2);
 const matchMask=new PIXI.Graphics().beginFill(0xffffff).drawRoundedRect(-83,-136,166,190,4).endFill();
 player.addChild(matchMask);player1_1.mask=matchMask;
 bridge.framePortrait(player,player1_1,playerB);`);
 // The source's -23/250 placement exposes art above the 176x234 frame.
 // Use a cover-cropped portrait window independent of obsolete saved offsets.
 sceneText=sceneText.replace('spritea.width = lib.config.sprite_avatar.w;', 'spritea.width = 135;')
  .replace('spritea.height = lib.config.sprite_avatar.h;', 'spritea.height = 224;')
  .replace('spritea.x = lib.config.sprite_avatar.x;', 'spritea.x = 33;')
  .replace('spritea.y = lib.config.sprite_avatar.y;', 'spritea.y = 4;')
  .replace('sprite.addChild(spritea);', `sprite.addChild(spritea);
 bridge.watchPortrait(spritea,j,{width:135,height:224});
 const portraitMask=new PIXI.Graphics().beginFill(0xffffff).drawRoundedRect(33,4,135,224,5).endFill();
 sprite.addChild(portraitMask);spritea.mask=portraitMask;`);
 const browserAst=parse(sceneText),browserEdits=[];
 for(const n of nodes(browserAst,n=>ts.isCallExpression(n)&&n.expression.getText(browserAst)==='game.getFileList'&&n.arguments[0]?.getText(browserAst)==="'image/character'"))browserEdits.push([n.getStart(browserAst),n.end,`(window.rzshcharactersimg=[...rzshcharacters], gloader.load(()=>{try{setupg();game.isUnlockDialogDo('g');if(openCharactersWhenReady){game.cls_wjbg=true;oppeen(wujianghome);openCharactersWhenReady=false;}}catch(error){console.error(error);bridge.notice('武将界面加载失败：'+error.message);}}))`]);
 sceneText=edits(sceneText,browserEdits);
 sceneText='let openCharactersWhenReady=false;\n'+sceneText;
 sceneText='const setTimeout=bridge.timeout, setInterval=bridge.interval, requestAnimationFrame=bridge.frame;\n'+sceneText;
 sceneText=sceneText.replaceAll("window.location.href = lib.assetURL + 'extension/如真似幻/html/rzsh.html';",'bridge.login();');
 const outer=fn.body.statements.filter(n=>!ts.isReturnStatement(n)).map(n=>n.getText(ast)).join('\n');
 const content=returned.properties.find(p=>p.name?.getText(ast)==='content').initializer.getText(ast);
 const helpers=nodes(pre,n=>ts.isFunctionDeclaration(n)&&['numtoroma','getName_排位'].includes(n.name?.text)).map(n=>n.getText(ast)).join('\n');
 write('native/如真似幻.js',remap(`window.shoushaNativeFactories ||= {};\nwindow.shoushaNativeFactories['如真似幻']=function(lib,game,ui,get,ai,_status,bridge){\nconst localStorage=bridge.storage, sessionStorage=bridge.session;\n${outer}\nreturn {name:'如真似幻',config:{},package:{nopack:true},content:${content},createHome:function(){\n${uiSprite.getText(ast)}\n${helpers}\n${sceneText}\n}};\n};`));
}
// Carry over UI-only additions to the original core as a dependency module.
{
 const s=read('game/game.js'), ast=parse(s);
 const candidates=nodes(ast,n=>ts.isPropertyAssignment(n)&&ts.isFunctionExpression(n.initializer));
 const used=new Set();
 function collectHelpers(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
   const file=path.join(dir,entry.name);
   if(entry.isDirectory()){if(!['node_modules','.git'].includes(entry.name))collectHelpers(file);continue;}
   if(!entry.name.endsWith('.js')||entry.name.endsWith('.min.js'))continue;
   const text=fs.readFileSync(file,'utf8');
   for(const m of text.matchAll(/\b(game|get|ui)\.([A-Za-z_$][\w$]*)\s*\(/g))used.add(m[1]+'.'+m[2]);
  }
 }
 for(const name of names)collectHelpers(path.join(source,'extension',name));
 const roots=new Map();
 for(const n of candidates){const object=n.parent; if(object.properties.length>100){const keys=object.properties.map(p=>p.name?.getText(ast));if(keys.includes('createEvent')&&keys.includes('saveConfig'))roots.set('game',object);if(keys.includes('translation')&&keys.includes('type'))roots.set('get',object);}}
 // Resolve transitive dependencies among the old core's additional UI helpers.
 const selected=new Map();let progress=true;
 const exclude=/^(reload|reload2|reload3|loop|loop2|resume|pause|pause2|resume2|createEvent|import|saveConfig|save|deleteDB|loadMode|loadScript|update|check|uncheck|over|switchMode|switchPlayer|swapPlayer|swapControl|addPlayer|removePlayer|prepareArena|finishCards|finishSkill|start|download|send|broadcast|broadcastAll|connect|createServer|exit|closePopped|playAudio|playBackgroundMusic)$/;
 while(progress){progress=false;for(const [scope,root] of roots){for(const p of root.properties){const key=p.name?.getText(ast), id=scope+'.'+key;if(!used.has(id)||selected.has(id)||exclude.test(key)||!p.initializer||!ts.isFunctionExpression(p.initializer))continue;selected.set(id,p.initializer.getText(ast));progress=true;for(const m of p.initializer.getText(ast).matchAll(/\b(game|get)\.([A-Za-z_$][\w$]*)\s*\(/g))used.add(m[1]+'.'+m[2]);}}}
 const globals=ast.statements.filter(n=>ts.isExpressionStatement(n)&&ts.isBinaryExpression(n.expression)&&/^window\.(playerNickName|getStrength|getStrengthList|getStrengthLength|getStrengthNode|extTraList)$/.test(n.expression.left.getText(ast))).map(n=>n.getText(ast)).join('\n');
 write('native/core-ui.js',remap(`window.shoushaCoreUI=function(lib,game,ui,get,ai,_status,bridge){\nconst localStorage=bridge.storage,sessionStorage=bridge.session;\n${globals}\n${[...selected].map(([id,value])=>`if(typeof ${id} !== 'function') ${id}=${value};`).join('\n')}\n};`));
 write('native/core-dependencies.json',JSON.stringify([...selected.keys()],null,2));
}
// Keep the original standalone login markup, all controls, and three Spine layers.
{
 let html=read('extension/如真似幻/html/rzsh.html');
 html=html.replace(/<script[\s\S]*?<\/script>/g,'');
 html=html.replace('</head>','<link rel="stylesheet" href="../../../native/login.css"></head>');
 html=html.replace('</body>','<script src="../js/pixi6.min.js"></script><script src="../../../native/login-bridge.js"></script></body>');
 write('original/如真似幻/html/rzsh.html',rebrand(html));
 const js=read('extension/如真似幻/js/rzsh.js'), ast=parse(js);
 const backgrounds=ast.statements.find(n=>n.getText(ast).startsWith('window.chgBackgroundlist'));
 write('native/login-backgrounds.js',backgrounds.getText(ast));
}
generateShoushaLobby(target);
const inventory=()=>{const files=[];function visit(dir){for(const e of fs.readdirSync(path.join(target,dir),{withFileTypes:true})){const p=dir?dir+'/'+e.name:e.name;if(e.isDirectory()){if(!['assets','spine','vendor'].includes(p))visit(p);}else if(!['home.js','home.css','visuals.js','resources.json','SOURCE.json','players.css','cards.css','buttons.css','menus.css','fonts.css'].includes(p))files.push(p);}}visit('');write('files.json',JSON.stringify(files.sort(),null,2));};
// The source distribution generates this only after editing a skin. Ship an
// empty initializer for fresh installs, while preserving existing user edits.
for(const [file,source] of Object.entries(optionalScriptDefaults)){
 if(!fs.existsSync(path.join(target,file)))write(file,'// Default for a fresh install; preserve user edits.\n'+source);
}
const manifest=JSON.parse(fs.readFileSync(path.join(target,'ui-workshop.json'),'utf8'));
manifest.author='原界面及各 UI 模块作者；PXLNGU整合';
manifest.description='手杀标准UI：原素材登录与大厅，本体节点的卡牌、武将框、按钮及结算展示；选将、技能、AI、胜负与联机统一使用本体逻辑。';
write('ui-workshop.json',JSON.stringify(manifest,null,2));
fs.writeFileSync(path.resolve('apps/core/noname/ui/workshop/shoushaPreset.js'),'// Generated by scripts/migrate-shousha-native.mjs\nexport const shoushaManifest = '+JSON.stringify({...manifest,id:'builtin-shousha-standard'},null,2)+';\n');
write('info.json',JSON.stringify({name:'手杀标准UI',author:manifest.author,version:'2.0.0',intro:manifest.description},null,2));
const registrationFile=path.resolve('apps/core/game/organized-extensions.json');
const registrations=JSON.parse(fs.readFileSync(registrationFile,'utf8'));
const registration=registrations.find(item=>item.name==='手杀标准UI');
if(registration){
 registration.files={};
 for(const file of ['extension.js','native-runtime.js','native.css','ui-workshop.json','native/lobby.js','native/presentation.js','native/presentation.css'])registration.files[file]=crypto.createHash('sha256').update(fs.readFileSync(path.join(target,file))).digest('hex');
 registration.hash=registration.files['extension.js'];
 const text=JSON.stringify(registrations,null,2)+'\n';
 if(fs.readFileSync(registrationFile,'utf8').replace(/\r\n/g,'\n')!==text)fs.writeFileSync(registrationFile,text);
}
// Preserve classic-script globals inside the provider's compatibility loader.
const scriptGlobals={};
function collectGlobals(dir){for(const entry of fs.readdirSync(path.join(target,dir),{withFileTypes:true})){
 const file=dir+'/'+entry.name;if(entry.isDirectory()){collectGlobals(file);continue;}if(!file.endsWith('.js'))continue;
 const ast=parse(fs.readFileSync(path.join(target,file),'utf8')),declared=[],variables=[];
 function binding(name){if(ts.isIdentifier(name))declared.push(name.text);else if(ts.isObjectBindingPattern(name)||ts.isArrayBindingPattern(name))for(const element of name.elements)if(ts.isBindingElement(element))binding(element.name);}
 for(const node of ast.statements){if(ts.isVariableStatement(node)){const start=declared.length;for(const decl of node.declarationList.declarations)binding(decl.name);if(!(node.declarationList.flags&ts.NodeFlags.BlockScoped))variables.push(...declared.slice(start));}else if((ts.isFunctionDeclaration(node)||ts.isClassDeclaration(node))&&node.name)declared.push(node.name.text);}
 const exports=declared.filter(name=>!['lib','game','ui','get','ai','_status','document','window','localStorage','sessionStorage','bridge'].includes(name));
 if(exports.length)scriptGlobals[file]={exports:[...new Set(exports)],variables:[...new Set(variables.filter(name=>exports.includes(name)))]};
}}
collectGlobals('original');write('native/script-globals.json',JSON.stringify(scriptGlobals));
inventory();
const nativeFiles=JSON.parse(fs.readFileSync(path.join(target,'files.json'),'utf8')).filter(file=>file.startsWith('original/'));
write('NATIVE-SOURCE.json',JSON.stringify({source:'三国杀·琉璃版5.5',modules:names,files:nativeFiles.length,bytes:nativeFiles.reduce((sum,file)=>sum+fs.statSync(path.join(target,file)).size,0),onlineRooms:'host',registration:'one-private-ui-provider',personalData:false},null,2));
console.log(JSON.stringify({files:count,bytes}));
