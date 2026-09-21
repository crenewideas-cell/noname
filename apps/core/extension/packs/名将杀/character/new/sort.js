import characters from "./character.js";

const characterSort = {
	mjs_sort_mingjiangxinxiu: [],
	mjs_sort_mingjiangqianzhan: [],
	mjs_sort_mingjiangxianxia: [],
	mjs_sort_baijiazhengming: [],
	mjs_sort_mingjianggongchuang: [],
};

for (const name in characters) {
	if (name.startsWith("mjs_new")) {
		characterSort.mjs_sort_mingjiangxinxiu.add(name);
	} else if (name.startsWith("mjs_tbd")) {
		characterSort.mjs_sort_mingjiangqianzhan.add(name);
	} else if (name.startsWith("mjs_pen")) {
		characterSort.mjs_sort_mingjianggongchuang.add(name);
	} else if (name.startsWith("mjs_10")) {
		characterSort.mjs_sort_baijiazhengming.add(name);
	} else {
		characterSort.mjs_sort_mingjiangxianxia.add(name);
	}
}

const characterSortTranslate = {
	mjs_sort_mingjiangxinxiu: "名将新修",
	mjs_sort_mingjiangqianzhan: "名将前瞻",
	mjs_sort_mingjiangxianxia: "名将线下",
	mjs_sort_mingjianggongchuang: "名将共创",
	mjs_sort_baijiazhengming: "百家争鸣",
	mjs_sort_bimozhengfeng: "笔墨争锋",
};

export { characterSort, characterSortTranslate };
