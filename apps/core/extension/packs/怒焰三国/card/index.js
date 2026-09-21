import { game } from "noname";
import card from "./card.js";
import list from "./list.js";
import skill from "./skill.js";
import translate from "./translate.js";

game.import("card", function () {
	return {
		name: "nysgs",
		connect: true,
		card,
		skill,
		translate,
		list,
	};
});
