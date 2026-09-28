import { game } from "../../main/utils.js";
import character from "./character.js";
import characterSubstitute from "./characterSubstitute.js";
import characterIntro from "./intro.js";
import dynamicTranslates from "./dynamicTranslate.js";
import perfectPair from "./perfectPair.js";
import skill from "./skill.js";
import characterTitle from "./title.js";
import translate from "./translate.js";
import { characterSort, characterSortTranslate } from "./sort.js";

await game.import("character", function () {
	return {
		name: "hxfy",
		connect: true,
		character,
		characterSort: {
			hxfy: characterSort,
		},
		characterSubstitute: {
			...characterSubstitute,
		},
		dynamicTranslate: {
			...dynamicTranslates
		},
		characterIntro,
		characterTitle,
		perfectPair,
		skill,
		translate: {
			...translate, ...characterSortTranslate,
		},
	};
});
