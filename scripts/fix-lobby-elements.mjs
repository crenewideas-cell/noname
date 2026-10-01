import ts from 'typescript';

// Keep migrated scenes on the same UI templates when their sources are rebuilt.
export function fixLobbyElements(source, kind) {
 if (source.includes('const sceneUI = ')) return source;
 const ast = ts.createSourceFile('lobby.js', source, ts.ScriptTarget.Latest, true);
 const edits = [];
 const edit = (start, end, text) => edits.push({start, end, text});
 const interactive = (down, up, extra = '') => `{ down: ${down}, up: ${up}${extra} }`;
 const hand = {
  rzshcreate: ['spritesheet'], rzshcreatex: ['spritesheet', interactive('onButtonDown','onButtonUp')],
  vipcreat: ['vipsprite','{ interactive: true }'], lightcreat1: ['lightsheet',interactive('onButtonDown','onButtonUp')],
  lightcreat2: ['lightanimations',interactive('onButtonDown','onButtonUp',', animated: true, speed: 1')],
  czgcreat: ['czgsprite',interactive('onButtonDown','onButtonUp',', animated: true')],
  modecreate: ['modestexture'], modecreatex: ['modestexture',interactive('onButtonDown','onButtonUp')],
  paiweicreate: ['zloader.resources.paiweiui.textures'], paiweicreatey: ['zloader.resources.paiweiui.data.animations','{ animated: true, speed: 0.3, anchor: 0.5 }'],
  menucreate: ['zloader.resources.menubtn.textures'], setcreate: ['zloader.resources.setting.textures'],
  wujiangcreate: ['gloader.resources.wujiang.textures', undefined, 'if (!gloader.resources.wujiang) return; '],
 };
 const rzsh = {
  Uo: ['Ur'], Uj: ['Ur',interactive('Up','Ud')], UD: ['UM',interactive('Up','Ud')],
  UJ: ['Uu',interactive('Up','Ud',', animated: true')], UI: ['UA',interactive('Up','Ud')],
  Ui: ['Ut','{ animated: true }'], UT: ['Ut',interactive('Up','Ud',', animated: true')],
  Ug: ['UW','{ interactive: true }'], UB: ['Ue','{ animated: true, speed: 1, interactive: true }'],
  Uq: ['Ua',interactive('Up','Ud',', animated: true')], kz: ['kZ'], kN: ['kZ',interactive('Up','kn')],
  yG: ['ym.resources.paiweiui.textures'], yy: ['ym.resources.paiweiui.data.animations','{ animated: true, speed: 0.3, anchor: 0.5 }'],
  yY: ['ym.resources.menubtn.textures'], yW: ['yt.resources.wujiang.textures'],
 };
 const constructors = kind === 'shousha' ? hand : rzsh;
 const places = kind === 'shousha' ? {
  uiinit: 'sceneUI.place(sprite, { x: ppw, y: pph, handlers: bool !== undefined ? { up: onButtonUpx, down: onButtonDownx } : undefined });',
  uiinit2: 'sceneUI.center(fromFrames, 0.29 * pps);',
  uiinit3: 'sceneUI.place(sprite, { raw: true, handlers: bool !== undefined ? { up: onButtonUpx, down: onButtonDownx } : undefined });',
 } : {
  GF: 'sceneUI.place(UU, { x: G7, y: G8, handlers: Uk !== undefined ? { up: U4, down: U5 } : undefined });',
  GC: 'sceneUI.center(UU, 0.29 * G9);',
  Gx: 'sceneUI.place(UU, { raw: true, handlers: Uk !== undefined ? { up: U4, down: U5 } : undefined });',
 };
 function visit(node) {
  if (ts.isFunctionDeclaration(node)) {
   const name = node.name?.text, text = node.getText(ast);
   const spec = constructors[name];
   if (spec && text.includes('new PIXI') && text.includes(spec[0].split('.')[0] + (spec[0].includes('.') ? kind === 'rzsh' ? '["resources"]' : '.resources' : '['))) {
    const param = node.parameters[0].name.getText(ast);
    edit(node.body.getStart(ast), node.body.end, `{ ${spec[2] || ''}return sceneUI.sprite(${spec[0]}, ${param}${spec[1] ? ', ' + spec[1] : ''}); }`);
    return;
   }
   if (places[name]) { edit(node.body.getStart(ast), node.body.end, `{ ${places[name]} }`); return; }
  }
  if (ts.isVariableDeclaration(node) && kind === 'shousha' && node.name.getText(ast) === 'uisprite') {
   const statement = node.parent.parent;
   edit(statement.getStart(ast), statement.end, 'const sceneUI = bridge.sceneUI();');
   return;
  }
  ts.forEachChild(node, visit);
 }
 visit(ast);
 if (kind === 'rzsh') {
  const start = source.indexOf('    const rzshy3 = {};');
  const last = 'const rzshUs = rzshUL;', end = source.indexOf(last, start);
  if (start < 0 || end < 0) throw new Error('RZSH layout source changed');
  // The migrated file interleaves hoisted string decoders with its layout data.
  // Preserve those functions: removing them makes the decoder setup loop forever.
  const decoders=[];
  function preserve(node) {
   if (ts.isFunctionDeclaration(node) && node.getStart(ast)>=start && node.end<=end) { decoders.push(node.getText(ast)); return; }
   ts.forEachChild(node,preserve);
  }
  preserve(ast);
  edit(start, end + last.length, decoders.join('\n')+'\n    const sceneUI = lifecycle.sceneUI();\n    const rzshUs = sceneUI.layout;');
 }
 for (const e of edits.sort((a,b) => b.start-a.start)) source = source.slice(0,e.start)+e.text+source.slice(e.end);
 if (kind === 'rzsh') {
  if (!source.includes('lifecycle.layoutHome(')) {
   source = source.replace('GK["addChild"](Gc, Gd, Gp, Gr);',
    'GK["addChild"](Gc, Gd, Gp, Gr);\n        lifecycle.layoutHome({ top: Gc, left: Gd, right: Gp, bottom: Gr, decoration: Gw, center: GM });');
  }
  source = source.replace(/spinelo = new PIXI\["spine"\]\["Spine"\]\((GG\["resources"\]\["spineloading"\]\["spineData"\])\)/, 'spinelo = sceneUI.idle($1, i.screen, { x: 0.52, scale: 0.75 })')
   .replace(/F = new PIXI\["spine"\]\["Spine"\]\((GG\["resources"\]\["jindutiao"\]\["spineData"\])\)/, 'F = sceneUI.idle($1, i.screen, { y: 0.95, scale: 0.75 })')
   .replace(/, spinelo\["state"\]\["setAnimation"\][\s\S]*?F\["scale"\]\["set"\]\(0.75\)/, '')
   .replace(/let Gk = \["三国杀是一款[\s\S]*?let Gm = new PIXI\["Text"\]\(Gf\(\), GY\); Gm\["anchor"\][\s\S]*?i\["stage"\]\["addChild"\]\(Gm\)/, 'const Gf = sceneUI.randomTip; let Gm = sceneUI.tip(i.screen, { y: 0.91, fontSize: 15, fill: "white" }); i["stage"]["addChild"](Gm)');
 } else {
  if (!source.includes('bridge.layoutHome(')) {
   source = source.replace('uihome.addChild(uihometop, uihomeleft, uihomeright, uihomeunder);',
    'uihome.addChild(uihometop, uihomeleft, uihomeright, uihomeunder);\n                                bridge.layoutHome({top:uihometop,left:uihomeleft,right:uihomeright,bottom:uihomeunder,center:uihomecenter});');
  }
  source = source.replaceAll('spinelo = new PIXI.spine.Spine(xloader.resources.spineloading.spineData);', 'spinelo = sceneUI.idle(xloader.resources.spineloading.spineData, pixiapp.screen);')
   .replace(/spinelo.state.setAnimation\(0, 'idle', true\); bridge.ready\(\);[\s\S]*?let sanguoTexts = \[[\s\S]*?pixiapp.stage.addChild\(sanguoTip\);/, 'bridge.ready();\n                                const getRandomSanguoText = sceneUI.randomTip;\n                                const sanguoTip = sceneUI.tip(pixiapp.screen);\n                                pixiapp.stage.addChild(sanguoTip);')
   .replace(/uibg = new PIXI.Sprite\((xloader.resources.(?:loadingbg2|uiBG).texture)\);[^\r\n]*\r?\n\s*uibg.width = pixiapp.screen.width;\s*uibg.height = pixiapp.screen.height;/g, 'uibg = sceneUI.background($1, pixiapp.screen);')
   .replace(/const hombgSprite = new PIXI.Sprite\((xloader.resources.homBG.texture)\);\s*hombgSprite.width = pixiapp.screen.width;\s*hombgSprite.height = pixiapp.screen.height;/, 'const hombgSprite = sceneUI.background($1, pixiapp.screen);')
   .replace(/spinelo.state.setAnimation\(0, 'idle', true\); bridge.ready\(\);\s*spinelo.x = 0.5 \* pixiapp.screen.width;\s*spinelo.y = 0.5 \* pixiapp.screen.height;\s*spinelo.scale.set\(0.8\);/, 'bridge.ready();');
 }
 return source;
}
