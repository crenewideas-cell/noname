/** Project character packages shipped in both online artifacts. Never accept paths or executable extensions from a room. */
export const ONLINE_CHARACTER_PACKS = [
  { id: "standard", name: "标准" }, { id: "shenhua", name: "神话再临" }, { id: "extra", name: "经典神将" },
  { id: "yijiang", name: "一将成名" }, { id: "refresh", name: "界限突破" }, { id: "sp", name: "璀璨星河" },
  { id: "sp2", name: "系列专属" }, { id: "newjiang", name: "新一将成名" }, { id: "onlyOL", name: "OL专属" },
  { id: "yingbian", name: "文德武备" }, { id: "clan", name: "门阀士族" }, { id: "huicui", name: "群英荟萃" },
  { id: "xianding", name: "限定专属" }, { id: "mobile", name: "移动版" }, { id: "shiji", name: "始计篇" },
  { id: "sb", name: "谋攻篇" }, { id: "bingshi", name: "兵势篇" }, { id: "tw", name: "外服武将" },
  { id: "collab", name: "联动卡" }, { id: "old", name: "怀旧" }, { id: "offline", name: "线下武将" },
  { id: "jsrg", name: "江山如故" }, { id: "sxrm", name: "蚀心入魔" }, { id: "sixiang", name: "四象封印" },
  { id: "diy", name: "设计比赛20" }, { id: "key", name: "二次元" },
  { id: "hlhj", name: "红楼幻境" },
] as const;
export const DEFAULT_CHARACTER_PACKS = ["standard", "shenhua", "refresh"];
export interface CharacterPool { packs: string[]; banned: string[]; }
export const defaultCharacterPool = (): CharacterPool => ({ packs: [...DEFAULT_CHARACTER_PACKS], banned: [] });
export function characterPoolLabel(pool?: CharacterPool) {
  const value = pool || defaultCharacterPool();
  return value.packs.map(id => ONLINE_CHARACTER_PACKS.find(pack => pack.id === id)?.name || id).join("、")
    + (value.banned.length ? ` · 禁用 ${value.banned.length} 名武将` : "");
}
