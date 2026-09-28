import { game } from "../../main/utils.js";
import card, { cardSkills, prepareCardNatures } from "./card.js";
import cardType from "./type.js";
import list from "./list.js";
import skill from "./skill.js";
import translate from "./translate.js";

prepareCardNatures();
await game.import("card", function () {
	return {
		name: "hxfy",
		card,
		skill: { ...skill, ...cardSkills },
		cardType,
		translate,
		list,
	};
});
