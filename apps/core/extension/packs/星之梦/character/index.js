import { lib, game, ui, get, ai, _status } from "noname";
import characters from "./character.js";
import characterIntros from "./intro.js";
import characterReplaces from "./replace.js";
import characterSorts from "./sort.js";
import characterSubstitute from "./characterSubstitute.js";
import characterTitles from "./characterTitle.js";
import perfectPairs from "./perfectPairs.js";
import dynamicTranslates from "./dynamicTranslate.js";
import translates from "./translate.js";
const lmCharacter = {
	name: "lmCharacter",
	connect: true,
	character: { ...characters }, //武将信息
	characterIntro: { ...characterIntros }, //武将简介
	characterReplace: { ...characterReplaces }, //武将切换
	characterSort: { ...characterSorts }, //武将分类
	characterTitle: { ...characterTitles }, //武将称号
	characterSubstitute: { ...characterSubstitute }, //转换技切换皮肤
	perfectPair: { ...perfectPairs }, //珠联璧合
	dynamicTranslate: { ...dynamicTranslates }, //动态翻译
	translate: { ...translates }, //翻译信息
};
for (const [id, info] of Object.entries(characters)) {
  info.img ||= "extension/星之梦/image/character/" + id + ".jpg";
  info.dieAudios ||= ["ext:星之梦/audio/die/" + id + ".mp3"];
}
for (const group of Object.values(lmCharacter.characterSort)) {
  for (const key of Object.keys(group)) group[key] = group[key].filter(id => Object.hasOwn(characters, id));
}
export const character = lmCharacter;
