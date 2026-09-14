import { themes } from "./theme/catalog.js";

// Add another character's resource descriptor here (or use runtime.register).
// Paths use the supplied extension/built-in roots; rules stay in the descriptor.
export function appearanceCatalog(paths) {
    return [{
        character: "hlhj_daiyu", label: "黛玉", root: paths.theme, stylesheet: paths.theme + "appearance.css",
        original: paths.original, originalLabel: "绛珠题笺",
        legacyConfig: "hlhj_appearance",
        subtitle: "一窗竹影，一枕归梦。",
        hint: "随泪数模式达到归梦阈值的一半切为归梦，下降后恢复竹影。",
        themes: Object.fromEntries(Object.entries(themes).map(([key, theme]) => [key, {
            ...theme, portrait: { ...theme.portrait, fallback: `daiyu-${key}.png` },
        }])),
        portraitModes: {
            fate: {
                label: "随泪数转换",
                resolve(player, lib) {
                    const limit = lib.skill.hlhj_guimeng?.appearanceThreshold?.() || Infinity;
                    return (player?.countMark?.("hlhj_lei") || 0) >= Math.ceil(limit / 2) ? "dream" : "bamboo";
                },
            },
        },
    }];
}
