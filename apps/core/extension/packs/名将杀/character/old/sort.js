import characters from "./character.js";

const characterSort = {
	mjs_sort_mingjiangjiugai: [],
	mjs_sort_bawangzhiluan: ["mjs_simayu", "mjs_simazhong", "mjs_jiananfeng", "mjs_simaliang", "mjs_simawei", "mjs_simalun", "mjs_simajiong", "mjs_simayong", "mjs_simaying", "mjs_simayixijin", "mjs_simayue"],
	mjs_sort_gongxingtianfa: ["mjs_zhaogao", "mjs_shichangshi", "mjs_jiangchong", "mjs_naochi"],
	mjs_sort_nianshoulaixi: ["mjs_nianshou"],
	mjs_sort_qianlidanqi: [],
	mjs_sort_zhanshanjiedao: ["mjs_shanzeitoumu", "mjs_shanzeiduizhang", "mjs_shanzeijiayi", "mjs_shanzeibingding"],
	mjs_sort_mingrentang: ["mjs_tap_laobing", "mjs_tap_guangzhichen", "mjs_tap_xiaolongbao"],
};

for (const name in characters) {
	if (Object.values(characterSort).flat().includes(name)) {
		continue;
	} else if (name.startsWith("mjs_npc")) {
		characterSort.mjs_sort_qianlidanqi.add(name);
	}
	else {
		characterSort.mjs_sort_mingjiangjiugai.add(name);
	}
}

const characterSortTranslate = {
	mjs_sort_mingjiangjiugai: "名将旧改",
	mjs_sort_bawangzhiluan: "八王之乱",
	mjs_sort_nianshoulaixi: "年兽来袭",
	mjs_sort_gongxingtianfa: "龚行天罚",
	mjs_sort_qianlidanqi: "千里单骑",
	mjs_sort_zhanshanjiedao: "占山劫道",
	mjs_sort_mingrentang: "名人堂",
};

export { characterSort, characterSortTranslate };
