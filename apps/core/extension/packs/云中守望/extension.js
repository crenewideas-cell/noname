import { lib, game } from "noname";
import { DIY } from "./character/DIY/index.js";
import { swTool } from "./main/swTool.js";
export const type = "extension";
async function enablePackOnce(name, packName) {
  if (lib.config["extension_" + name + "_charactersInitialized"]) return;
  await game.saveConfig("characters", [...new Set([...(lib.config.characters || []), packName])]);
  await game.saveExtensionConfig(name, "charactersInitialized", true);
}
export default function () {
  return {
    name: "云中守望", editable: false, connect: true,
    package: { author: "守望", version: "1.55", intro: "DIY 武将与配套技能、卡牌，归入 PXLNGU。" },
    async precontent() {
      // Source skill broadcasts refer to this helper on participating clients.
      globalThis.swTool = swTool;
      await game.import("character", () => DIY);
      lib.translate.swDIY_character_config = "云中守望";
      lib.arenaReady.push(() => DIY.func());
      await enablePackOnce("云中守望", "swDIY");
    },
  };
}
