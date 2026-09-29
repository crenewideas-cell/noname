import { lib, game, ui, get, ai, _status } from "noname";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterTitles from "./characterTitle.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import dynamicTranslates from "./dynamicTranslate.js";
import perfectPairs from "./perfectPairs.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

import { characters as zhaoyunCharacters, skills as zhaoyunSkills, translates as zhaoyunTranslates } from "./zhaoyun.js";
import { characters as trialCharacters, skills as trialSkills, translates as trialTranslates } from "./zhaoyun-trial.js";

game.import("character", function () {
	return {
		name: "bingshi",
		connect: true,
		character: { ...characters, ...zhaoyunCharacters, ...trialCharacters },
		characterSort: {
			bingshi: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: { ...characterTitles },
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		card: { ...cards },
		skill: { ...skills, ...zhaoyunSkills, ...trialSkills },
		perfectPair: { ...perfectPairs },
		translate: { ...translates, ...voices, ...characterSortTranslate, ...zhaoyunTranslates, ...trialTranslates },
		pinyins: { ...pinyins },
	};
});
