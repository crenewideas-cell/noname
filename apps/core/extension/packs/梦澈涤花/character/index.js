import { lib, game, ui, get, ai, _status } from "noname";
import characters from "./character.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import characterTitles from "./characterTitle.js";
import characterReplaces from "./characterReplace.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

game.import("character", function () {
	const mcdh = {
		name: "mcdh",
		connect: true,
		character: { ...characters },
		characterSort: {
			mcdh: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: {...characterTitles},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		characterReplace: { ...characterReplaces },
		dynamicTranslate: { ...dynamicTranslates },
		skill: { ...skills },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
    if (!lib.config[`extension_梦澈涤花_characterPack_mcdh_enable`]) {
		game.saveExtensionConfig("梦澈涤花", "characterPack_mcdh_enable", true);
		lib.config.characters.add("mcdh");
		game.saveConfig("characters", lib.config.characters);
	}
    return mcdh;
});

