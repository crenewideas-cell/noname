// Extract lobby/rendering code and copy media from an external distribution.
// This is a source migration, not a test runner. Never reads Home/UserData.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {generateShoushaLobby} from './generate-ui-lobby.mjs';
import {generateUiRenderer} from './generate-ui-renderer.mjs';
import crypto from 'node:crypto';
import {isProviderFile} from '../apps/core/noname/ui/workshop/providerFiles.js';
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
 text=text.replaceAll('character/images/num/%.png','character/images/num/%25.png');
 for(const name of names){
  text=text.replaceAll('extension/'+name+'/', 'extension/手杀标准UI/original/'+name+'/');
  text=text.replaceAll("'extension/"+name+"'", "'extension/手杀标准UI/original/"+name+"'");
  text=text.replaceAll('"extension/'+name+'"', '"extension/手杀标准UI/original/'+name+'"');
 }
 return rebrand(text);
}
let count=0, bytes=0;
function copyTree(relative,out){
 for(const item of fs.readdirSync(path.join(source,relative),{withFileTypes:true})){
  if(['.git','node_modules','Home','UserData','Cache'].includes(item.name))continue;
  const input=relative+'/'+item.name, output=out+'/'+item.name;
  if(item.isDirectory()){copyTree(input,output);continue;}
 if(!isProviderFile('手杀标准UI',output))continue;
 const data=fs.readFileSync(path.join(source,input));
  if(process.argv.includes('--refresh-text')&&!/\.(js|css|html|json)$/i.test(item.name))continue;
  const text=/\.(js|css|html|json)$/i.test(item.name)?remap(data.toString('utf8')):data;
  write(output,text);count++;bytes+=data.length;
 }
}
if(!process.argv.includes('--code-only')||process.argv.includes('--refresh-text')) for(const name of names){if(process.argv.includes('--dependencies-only')&&fs.existsSync(path.join(target,'original',name)))continue;copyTree('extension/'+name,'original/'+name);console.log('Imported '+name);}
// The suite uses the source game's glass HP art, never the user's host skin.
for(const name of ['glass1.png','glass2.png','glass3.png','glass4.png']){
 const relative='theme/style/hp/image/'+name;
 const output=path.join(target,'original/core',relative);
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.copyFileSync(path.join(source,relative),output);
}
// UI-owned backgrounds, fonts, and interface audio are retained separately.
for(const folder of ['image/background','font','audio/effect','audio/background']){
 if(!process.argv.includes('--code-only')&&!process.argv.includes('--dependencies-only')&&fs.existsSync(path.join(source,folder)))copyTree(folder,'original/core/'+folder);
}
function factory(name){const s=read('extension/'+name+'/extension.js');const ast=parse(s);const call=nodes(ast,n=>ts.isCallExpression(n)&&n.expression.getText(ast)==='game.import')[0];return {s,ast,fn:call.arguments[1]};}
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
 const helpers=nodes(pre,n=>ts.isFunctionDeclaration(n)&&['numtoroma','getName_排位'].includes(n.name?.text)).map(n=>n.getText(ast)).join('\n');
 generateShoushaLobby(target,remap(`window.shoushaNativeFactories ||= {};\nwindow.shoushaNativeFactories['如真似幻']=function(lib,game,ui,get,ai,_status,bridge){\nconst localStorage=bridge.storage, sessionStorage=bridge.session;\n${outer}\nreturn {name:'如真似幻',config:{},package:{nopack:true},createHome:function(){\n${uiSprite.getText(ast)}\n${helpers}\n${sceneText}\n}};\n};`));
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
generateUiRenderer(target, read('extension/十周年UI/animation.js'), read('extension/十周年UI/dynamicSkin_default.js'));
const inventory=()=>{const files=[];function visit(dir){for(const e of fs.readdirSync(path.join(target,dir),{withFileTypes:true})){const p=dir?dir+'/'+e.name:e.name;if(e.isDirectory()){if(!['assets','spine','vendor'].includes(p))visit(p);}else if(isProviderFile('手杀标准UI',p))files.push(p);}}visit('');write('files.json',JSON.stringify(files.sort(),null,2));};
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
 for(const file of ['extension.js','native-runtime.js','native.css','ui-workshop.json','native/lobby.js','native/presentation.js','native/presentation.css','native/layout.js','native/portrait-clips.js','native/animations.js','native/animation-renderer.js','native/animation-assets.json'])registration.files[file]=crypto.createHash('sha256').update(fs.readFileSync(path.join(target,file))).digest('hex');
 registration.hash=registration.files['extension.js'];
 const text=JSON.stringify(registrations,null,2)+'\n';
 if(fs.readFileSync(registrationFile,'utf8').replace(/\r\n/g,'\n')!==text)fs.writeFileSync(registrationFile,text);
}
inventory();
const nativeFiles=JSON.parse(fs.readFileSync(path.join(target,'files.json'),'utf8')).filter(file=>file.startsWith('original/'));
write('NATIVE-SOURCE.json',JSON.stringify({source:'三国杀·琉璃版5.5',modules:names,files:nativeFiles.length,bytes:nativeFiles.reduce((sum,file)=>sum+fs.statSync(path.join(target,file)).size,0),onlineRooms:'host',registration:'one-private-ui-provider',personalData:false},null,2));
console.log(JSON.stringify({files:count,bytes}));
