import {fixLobbyElements} from './fix-lobby-elements.mjs';
// Shared source adaptation for checked-in and regenerated lobby programs.
export function fixGalleryControls(source,kind){
 if(kind==='shousha'){
  // Mouse/touch taps have small movement; scrolling must not open a profile.
  source=source.replace(/let distance = event.data.global.x - sprite.startX;\s*if \(distance != 0\) return;/,
   'const tapped = sprite.pressOrigin && !sprite.pressDragged; sprite.pressOrigin = null; if (!tapped) return;');
  source=source.replace('sprite.startX = event.data.global.x;', `sprite.pressOrigin = {x:event.data.global.x,y:event.data.global.y}; sprite.pressDragged = false;
                                            })
                                            sprite.on('pointermove', event => {
                                                if (sprite.pressOrigin && Math.hypot(event.data.global.x-sprite.pressOrigin.x,event.data.global.y-sprite.pressOrigin.y)>8) sprite.pressDragged = true;
                                            });
                                            sprite.on('pointerupoutside', () => { sprite.pressOrigin = null;`);
  source=source.replaceAll('let sprite = new PIXI.Sprite();','let sprite = bridge.own(new PIXI.Sprite());');
  // Regeneration uses the same virtual grid as the decade/RZSH gallery.
  source=source.replace(/function renderSprites\([^)]*\)\s*\{[\s\S]*?(?=function wujiangdonghua\(\))/, `function renderSprites(cards) {
 bridge.grid(cards,bbox,wujiangscrollright,ppw,pph,pixiapp);
}
                                    `);
  if(!source.includes('function openMainTools()'))source=source.replace('function closee() {', `function openMainTools() {
 bridge.openTools(() => { if (!uihome.parent) closee(); uihome.addChild(menuhome); }, () => { if (!uihome.parent) closee(); });
}
function closee() {`);
  source=source.replace("menu1.on('pointertap', () => bridge.openTools(() => uihome.addChild(menuhome)));", "menu1.on('pointertap', openMainTools);")
   .replace(/wujiangmenubtn\.on\('pointerup', \(\) => \{[\s\S]*?\}\)\s*wujiangmenubtn\.on\('pointerdown', \(\) => \{[\s\S]*?\}\)/, "wujiangmenubtn.buttonMode = true;\nwujiangmenubtn.on('pointertap', openMainTools);");
  source=source.replaceAll('filterLabel:quanbuxianshitext,render:', 'filterLabel:quanbuxianshitext,powerBar:jl_bar_fg,allCards:()=>wujiangpool,render:')
   .replaceAll('wujiangpool.filter(sprite=>sprite.fav)','characterTools.popular(wujiangpool)')
   .replaceAll('wujiangpool.filter((sprite) => sprite.fav === true)','characterTools.popular(wujiangpool)')
   .replaceAll("new PIXI.Text(rzshtranslate[i + '_character_config'])", "new PIXI.Text(get.plainText(rzshtranslate[i + '_character_config'] || i))");
  for(const [id,label]of [['left1','公会'],['left2','好友'],['left3','比赛'],['left4','此入口']]){
   source=source.replace(`const ${id} = rzshcreatex('${id}');`,`const ${id} = rzshcreate('${id}');\n${id}.interactive=true;${id}.buttonMode=true;${id}.on('pointertap',()=>bridge.notice('${label}功能暂未开放'));`);
  }
  // The isolated scene window is not the browser global lexical environment.
  source=source.replace(/(?<![.\w])rzsh_(uiimglist|headlist|ideimglist)\b/g,'window.rzsh_$1');
 }else{
  if(!source.includes('function openMainTools()'))source=source.replace('function GE() {', `function openMainTools() {
 lifecycle.openTools(() => { lifecycle.showView("home"); GK.addChild(yU); }, () => lifecycle.showView("home"));
}
function GE() {`);
  source=source.replace('lifecycle.openTools(() => GK.addChild(yU));', 'openMainTools();')
   .replace(/UO\["on"\]\("pointerup", \(\) => \{[^\n]*?\}\), UO\["on"\]\("pointerdown"/, 'UO["buttonMode"] = true, UO["on"]("pointertap", openMainTools), UO["on"]("pointerdown"');
  source=source.replaceAll('filterLabel:Uo,render:', 'filterLabel:Uo,powerBar:Ud,allCards:()=>ye,render:')
   .replaceAll('ye.filter(card => card.fav)','characterTools.popular(ye)')
   .replaceAll('ye["filter"](ki => ki["fav"] === !![])','characterTools.popular(ye)')
   .replaceAll('ye["filter"](kg => kg["fav"] === !![])','characterTools.popular(ye)');
 }
 return fixLobbyElements(source,kind);
}
