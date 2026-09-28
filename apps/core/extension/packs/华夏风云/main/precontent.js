import { lib, game, ui, get, ai, _status } from "./utils.js";
import "../function/Win/win.js";
export async function precontent(config, pack) {

    // Import explicit modules and await registration before the core loads packs.
    await Promise.all([
        import("../card/hxfy/index.js"),
        import("../character/hxfy/index.js"),
        import("../character/yxscq/index.js"),
    ]);
    if (!lib.config.extension_华夏风云_characterPacksInitialized) {
        await game.saveConfig("characters", [...new Set([...lib.config.characters, "hxfy", "yxscq"])]);
        await game.saveExtensionConfig("华夏风云", "characterPacksInitialized", true);
    }
    lib.translate.hxfy_card_config = "华夏风云";

	//定义新势力
	lib.group.add("GXS_jun");
	lib.translate.GXS_jun = "君";
	lib.translate.GXS_jun2 = "君";
	lib.groupnature["GXS_jun"] = lib.groupnature["shu"];
	lib.group.add("GXS_chen");
	lib.translate.GXS_chen = "臣";
	lib.translate.GXS_chen2 = "臣";
	lib.groupnature["GXS_chen"] = lib.groupnature["wei"];
	lib.group.add("GXS_min");
	lib.translate.GXS_min = "民";
	lib.translate.GXS_min2 = "民";
	lib.groupnature["GXS_min"] = lib.groupnature["wu"];
	lib.group.add("GXS_hun");
	lib.translate.GXS_hun = "魂";
	lib.translate.GXS_hun2 = "魂";
	lib.groupnature["GXS_hun"] = lib.groupnature["shen"];
	lib.group.add("GXS_mo");
	lib.translate.GXS_mo = "魔";
	lib.translate.GXS_mo2 = "魔";
	lib.groupnature["GXS_mo"] = lib.groupnature["mo"];
	lib.group.add("GXS_yao");
	lib.translate.GXS_yao = "妖";
	lib.translate.GXS_yao2 = "妖";
	lib.groupnature["GXS_yao"] = lib.groupnature["jin"];
    lib.translate.hxfy_character_config = "华夏风云";
    lib.translate.yxscq_character_config = "英雄杀（三端全英雄）";
	
}
