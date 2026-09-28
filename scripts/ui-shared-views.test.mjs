import test from 'node:test';
import assert from 'node:assert/strict';
import { createLobbyViews } from '../apps/core/noname/ui/lobbyViews.js';
import { createProfileControls } from '../apps/core/noname/skin/profileControls.js';
import { createCharacterGrid } from '../apps/core/noname/ui/characterGrid.js';

test('profile and treasure sessions are owned once and refresh favorites once', () => {
 const profile = new EventTarget(), treasure = new EventTarget(), calls = [], refreshes = [];
 for (const view of [profile, treasure]) { view.count = 0; view.close = () => { view.count++; view.dispatchEvent(new Event('close')); }; }
 const lib = {config:{favouriteCharacter:['caocao'],qhly_listdefaultpage:'skill'}};
 const views = createLobbyViews({lib,openCharacter:(...args)=>{calls.push(args);return profile;},openTreasure:()=>treasure,graphics:()=>({}),showCharacters:()=>calls.push('directory'),syncFavorites:(...args)=>refreshes.push(args)});
 views.skins(); views.character('xiaoqiao'); views.treasure(); views.treasure();
 assert.equal(calls[1][2],'skin'); assert.equal(calls[2][2],'skin');
 lib.config.favouriteCharacter.push('xiaoqiao'); profile.close();
 assert.deepEqual(refreshes,[[['caocao','xiaoqiao'],true]]);
 views.characters(); views.character('caocao'); assert.equal(calls.at(-1)[2],'skill');
 views.destroy(); views.destroy();
 assert.equal(profile.count,2); assert.equal(treasure.count,1); assert.equal(refreshes.length,1);
 assert.equal(views.character('caocao'),undefined);
});

function controlsFixture(t) {
 const elements = new Map(), saves = [];
 const node = () => ({options:[],selectedIndex:0,appendChild(option){this.options.push(option);if(option.selected)this.selectedIndex=this.options.length-1;},replaceChildren(){this.options=[];},setAttribute(key,value){this[key]=value;},getAttribute(key){return this[key];}});
 const previous = globalThis.document;
 globalThis.document = {getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id);},createElement:node};
 t.after(()=>{globalThis.document=previous;});
 const lib = {config:{identity_banned:['caocao','liubei'],guozhan_banned:['caocao'],connect_banned:['sunquan']},mode:{identity:{},guozhan:{},connect:{}}};
 const game = {saveConfig:(key,value)=>saves.push([key,structuredClone(value)]),qhly_isForbidAI:()=>false,qhly_setForbidAI:(...args)=>saves.push(args)};
 const ui = {qhly_initCheckBox(checkbox,value){checkbox.qhly_checked=value;checkbox.qhly_setChecked=(next,notify)=>{checkbox.qhly_checked=next;if(notify)checkbox.qhly_onchecked?.(next);};}};
 const controls = createProfileControls({lib,game,ui,get:{info:()=>({frequent:true,subfrequent:['a','b']}),translation:id=>id,qhly_getCurrentViewSkinValue:(key,fallback)=>fallback}});
 return {lib,game,ui,controls,element:id=>document.getElementById(id),saves};
}
test('profile templates supply common controls once while respecting optional music', t => {
 const {lib,controls}=controlsFixture(t);lib.assetURL='/';
 const favorite=controls.favoriteTemplate('<test>');
 assert.ok(favorite.includes('收藏&lt;test&gt;'));
 let html=controls.optionsTemplate('caocao');
 assert.ok(html.includes('qhconfig_checkbox_banned_mode_identity'));assert.ok(!html.includes('qhconfig_checkbox_banned_mode_connect'));assert.ok(!html.includes('qhconfig_music_select'));
 lib.config.qhly_enableCharacterMusic=true;html=controls.optionsTemplate('caocao');
 assert.equal(html.split('id="qhconfig_music_select"').length,2);assert.equal(html.split('id="qhconfig_rank_select"').length,2);
});
test('profile music saves in a lobby without a core audio node and plays in game', t => {
 const {lib,game,ui,controls,element}=controlsFixture(t);let played=0;
 game.qhly_getCharacterMusic=()=>'';game.qhly_switchBgm=()=>played++;
 lib.qhlyMusic={'audio/test.mp3':{name:'测试音乐'}};
 controls.music(element('music'),'caocao');element('music').selectedIndex=1;element('music').onchange();
 assert.equal(lib.config.qhly_characterMusic.caocao,'audio/test.mp3');assert.equal(played,0);
 ui.backgroundMusic={};element('music').selectedIndex=0;element('music').onchange();
 assert.equal(lib.config.qhly_characterMusic.caocao,undefined);assert.equal(played,1);
});
test('shared bans update one mode independently and retain other characters and online settings', t => {
 const {lib,controls,element}=controlsFixture(t),owner={};
 controls.modeBans(owner,'caocao',()=>{});
 const all=owner.banned_checkbox_mode_all;
 assert.equal(all.qhly_checked,true);
 owner.banned_checkbox_mode_identity.qhly_setChecked(false,true);
 assert.equal(all.qhly_checked,false);assert.deepEqual(lib.config.identity_banned,['liubei']);assert.deepEqual(lib.config.guozhan_banned,['caocao']);
 all.qhly_setChecked(true,true);assert.equal(all.qhly_checked,true);
 all.qhly_setChecked(false,true);assert.deepEqual(lib.config.identity_banned,['liubei']);assert.deepEqual(lib.config.guozhan_banned,[]);assert.deepEqual(lib.config.connect_banned,['sunquan']);
 controls.favorite(element('favorite'),'caocao',()=>{});
 element('favorite').qhly_setChecked(true,true);element('favorite').qhly_setChecked(true,true);assert.deepEqual(lib.config.favouriteCharacter,['caocao']);
 element('favorite').qhly_setChecked(false,true);assert.deepEqual(lib.config.favouriteCharacter,[]);
});
test('shared auto-skill and rarity controls retain unrelated settings and theme labels', t => {
 const {lib,controls,element}=controlsFixture(t);
 lib.config.autoskilllist=['unrelated'];controls.autoSkill(element('auto'),'skill',()=>{});
 element('auto').qhly_setChecked(false,true);assert.deepEqual(lib.config.autoskilllist,['unrelated','skill','skill_a','skill_b']);
 element('auto').qhly_setChecked(true,true);assert.deepEqual(lib.config.autoskilllist,['unrelated']);
 lib.config.qhly_rarity={liubei:'rare',caocao:'epic'};let refreshes=0;
 controls.rarity(element('rank'),'caocao',()=>refreshes++,{'史诗':'SS'});
 assert.equal(element('rank').options[4].textContent,'史诗SS');assert.equal(element('rank').selectedIndex,4);
 element('rank').selectedIndex=0;element('rank').onchange();assert.deepEqual(lib.config.qhly_rarity,{liubei:'rare'});assert.equal(refreshes,1);
 controls.rarity(element('rank'),'caocao',()=>{});assert.equal(element('rank').options.length,6);assert.equal(element('rank').options[4].textContent,'史诗');
});

test('both gallery layouts share bounded rendering, scrolling, hide/resume and ticker cleanup', () => {
 class Container {
  constructor(){this.children=[];this.worldVisible=true;this.position={set:(x,y)=>{this.x=x;this.y=y;}};}
  addChild(child){if(child.parent)child.parent.removeChild(child);this.children.push(child);child.parent=this;}
  removeChild(child){this.children=this.children.filter(c=>c!==child);child.parent=null;}
  removeChildren(){for(const child of [...this.children])this.removeChild(child);}
  getChildByName(){return null;}
  destroy(){this.parent?.removeChild(this);this.destroyed=true;}
 }
 class AnimatedSprite {play(){this.playing=true;}stop(){this.playing=false;}}
 const tickers=[],stage=new Container(),container=new Container();stage.addChild(container);
 const scrollbox={boxWidth:800,boxHeight:400,scrollTop:0,resize(size){Object.assign(this,size);}};
 const grid=createCharacterGrid({graphics:{Sprite:Container,Texture:{WHITE:{}},AnimatedSprite},app:{stage},ticker(){const ticker={add(fn){this.update=fn;},start(){},stop(){},remove(){},destroy(){this.destroyed=true;}};tickers.push(ticker);return ticker;}});
 const cards=Array.from({length:1000},()=>{const card=new Container();card.children.push(new AnimatedSprite());return card;});
 grid.show(cards,container,scrollbox,1,1,{columnWidth:179});
 assert.equal(cards.length,1000);assert.ok(container.children.length<30);assert.equal(cards[1].x,181);
 scrollbox.scrollTop=1920;tickers[0].update();assert.equal(cards[0].parent,null);assert.ok(cards[40].parent);assert.equal(cards[0].children[0].playing,false);
 container.worldVisible=false;tickers[0].update();assert.equal(cards[40].children[0].playing,false);
 container.worldVisible=true;tickers[0].update();assert.equal(cards[40].children[0].playing,true);
 grid.show(cards,container,scrollbox,1,1);assert.equal(cards[1].x,191);assert.equal(tickers[0].destroyed,true);
 grid.dispose();assert.ok(tickers.every(t=>t.destroyed));
});
