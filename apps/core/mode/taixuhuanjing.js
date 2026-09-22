import { lib, game, get, _status } from 'noname';
import createDefinition from './taixuhuanjing/definition.js';
import createCards from './taixuhuanjing/cards.js';
import createSkills from './taixuhuanjing/skills-package.js';
import installFramework from './taixuhuanjing/framework.js';
import installCharacters from './taixuhuanjing/characters.js';
import installSkills from './taixuhuanjing/skills.js';
import installRanks from './taixuhuanjing/ranks.js';
import installBuffs from './taixuhuanjing/buffs.js';
import installCollection from './taixuhuanjing/collection.js';
import installEvents from './taixuhuanjing/events.js';
import installSeasons from './taixuhuanjing/seasons.js';
import installServant from './taixuhuanjing/servant.js';

export const type = 'mode';
const assets = 'mode/taixuhuanjing/assets';

/** One mode, one save namespace and one set of rules, regardless of UI skin. */
export default function createTaixuhuanjing() {
 const mode = createDefinition();
 const cards = createCards();
 const pack = createSkills();
 Object.assign(mode, {
  card: cards.card,
  cardPack: {mode_taixuhuanjing: Object.keys(cards.card)},
  skill: {...pack.skill.skill, ...cards.skill},
  translate: {...pack.skill.translate, ...cards.translate, taixuhuanjing:'太虚幻境'},
 });
 let installed = false;
 mode.startBefore = () => {
  if (installed) return;
  installed = true;
  // Legacy step contents are compiled by the engine. Their shared mode state
  // must remain reachable after compilation; UI providers never own this state.
  window.txhj = {isInitCardPileTx:false};
  window.txhjPack = {path:lib.assetURL+assets};
  game.seasonPack = {};
  game.eventPack = {};
  installRanks();
  window.txhjPack.cardPack = window.txhjPack.cardRank.slice();
  installCharacters();
  for (const [id, data] of Object.entries(game.NPCPack.character)) {
   const character = get.convertedCharacter(data);
   character.img = assets+'/image/loutou/'+id+'.jpg';
   lib.character[id] = character;
   for (const skill of character.skills) lib.skilllist.add(skill);
  }
  // A mode_* pack forces the old image/mode convention and ignores img paths.
  lib.characterPack.taixuhuanjing_npc = game.NPCPack.character;
  lib.translate.taixuhuanjing_npc_character_config = '太虚幻境·幻象';
  Object.assign(lib.translate, game.NPCPack.translate);
  Object.assign(lib.skill, game.NPCPack.skill);
  installSkills();
  installBuffs();
  installCollection();
  installEvents();
  installSeasons();
  window.seasonPacks = Object.keys(game.seasonPack);
  for (const [id, season] of Object.entries(game.seasonPack)) lib.translate[id] = season.name;
  installAudio();
  lib.init.css(lib.assetURL+assets, 'extension_style');
  lib.init.css(lib.assetURL+assets, 'extension_servant');
  installFramework();
  installServant();
  lib.skill._txhj_servant_enter = {
   trigger:{global:'gameDrawBefore'}, forced:true, popup:false,
   filter(event,player) { return player===game.me; },
   content() {
    const name=lib.config.taixuhuanjing.servant;
    for(const skill of Object.keys(window.txhj.servantData.skillDesc[name] || {}))game.me.addSkill(skill);
    window.txhj.servant?.initZuodian();
   },
  };
  lib.skill._txhj_treasure_slots = {
   trigger:{global:'gameDrawBefore'}, forced:true, popup:false, priority:100,
   filter(event,player) { return player.countEnabledSlot(5)<2; },
   content() { player.expandEquip(5); },
  };
  // Statistics follow actual skill events, independent of audio and UI settings.
  lib.skill._txhj_skill_statistics = {
   trigger:{player:'logSkillBegin'}, silent:true,
   filter(event,player) { return player===game.me && !!_status.modeNode?.score; },
   content() { _status.modeNode.score.skill++; },
  };
  // StartBefore runs after character/card registration and before arena setup.
  // All seasons are ready synchronously before the first home or save is read.
 };
 return mode;
}

function installAudio() {
 game.txhj_playAudioCall = (name, count) => game.playAudio({
  path:'../'+assets+'/image/audio/'+name+(count ? Math.ceil(Math.random()*count) : '')+'.mp3', addVideo:false,
 });
 game.txhj_playGameAudio = (...args) => game.playAudio(...args);
 game.txhj_TrySkillAudio = (skill, player) => {
  if (skill) game.trySkillAudio(skill, player, true, true);
 };
}
