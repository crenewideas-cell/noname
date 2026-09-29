// These IDs already belong to native packs or the installed 征战虎牢 extension.
// Keep their existing definitions and menu entries when both packs are enabled.
export const existingCharacters = [
    "ol_nianshou",
    "hulaoguan_lijue", "hulaoguan_guosi", "hulaoguan_fanchou", "hulaoguan_zhangji",
    "hulaoguan_huaxiong", "hulaoguan_chengong", "hulaoguan_gaoshun", "hulaoguan_dongxie",
    "hulaoguan_fengyaojun", "hulaoguan_hubenjun", "hulaoguan_feixiongjun", "hulaoguan_tanlangjun",
];

export function skipExistingCharacters(pack) {
    for (const id of existingCharacters) {
        delete pack.character[id];
        delete pack.translate[id];
        delete pack.translate[`${id}_prefix`];
        if (pack.characterIntro) delete pack.characterIntro[id];
        if (pack.characterTitle) delete pack.characterTitle[id];
    }
    function clean(groups) {
        for (const [key, value] of Object.entries(groups)) {
            if (Array.isArray(value)) groups[key] = value.filter(id => !existingCharacters.includes(id));
            else if (value && typeof value === "object") clean(value);
        }
    }
    clean(pack.characterSort || {});
    return pack;
}
