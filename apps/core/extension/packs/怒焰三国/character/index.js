import { lib, game, ui, get, ai, _status } from "noname";
import characters from "./character.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import perfectPairs from "./perfectPairs.js";
import characterTitles from "./characterTitle.js";
import characterReplaces from "./characterReplace.js";
import dynamicTranslates from "./dynamicTranslate.js";
import characterSubstitutes from "./characterSubstitute.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

game.import("character", function () {
	const nysgs = {
		name: "nysgs",
		connect: true,
		connectBanned: [],
		character: { ...characters },
		characterSort: {
			nysgs: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterReplace: { ...characterReplaces },
		characterTitle: {...characterTitles},
		characterIntro: { ...characterIntros },
		characterSubstitute: {...characterSubstitutes},
		skill: { ...skills },
		perfectPair: { ...perfectPairs },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		dynamicTranslate: { ...dynamicTranslates },
		pinyins: { ...pinyins },
	};
	if (!lib.config[`extension_怒焰三国_characterPack_nysgs_enable`]) {
		game.saveExtensionConfig("怒焰三国", "characterPack_nysgs_enable", true);
		lib.config.characters.add("nysgs");
		game.saveConfig("characters", lib.config.characters);
	}
	return nysgs;
});
