import { lib, game } from "noname";
import { character } from "./character/index.js";
import { skill } from "./character/skill.js";
import { createCards } from "./card/card.js";
export const type = "extension";
async function enablePackOnce(name, packName) {
  if (lib.config["extension_" + name + "_charactersInitialized"]) return;
  await game.saveConfig("characters", [...new Set([...(lib.config.characters || []), packName])]);
  await game.saveExtensionConfig(name, "charactersInitialized", true);
}
export default function () {
  return {
    name: "星之梦", editable: false, connect: true,
    package: { author: "凌梦", version: "1.11.5", intro: "武将与配套卡牌，已核对重复武将，归入 PXLNGU。" },
    async precontent() {
      character.name = "星之梦";
      character.skill = skill.skill;
      character.translate = { ...skill.translate, ...character.translate };
      character.characterSort = { "星之梦": character.characterSort.mode_extension_星之梦 || character.characterSort["星之梦"] };
      await game.import("character", () => character);
      await game.import("card", createCards);
      lib.translate.星之梦_character_config = "星之梦";
      lib.translate.xzmCard_card_config = "星之梦·神武再世";
      await enablePackOnce("星之梦", "星之梦");
    },
  };
}
