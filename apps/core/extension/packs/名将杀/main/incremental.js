import { lib, game, ui, get, ai, _status } from "noname";
import createImportedCharacters from "./imported-characters.js";

/** Add the imported definitions to the existing mjs packs, without another pack. */
export function attachIncrementalCharacters(extension) {
    const imported = createImportedCharacters(lib, game, ui, get, ai, _status);
    const options = { enable: true };
    for (const key of ["lutou", "shizuNum", "shizuBtn", "ctlBtn"]) {
        const option = imported.config[key];
        const configKey = `supplement003_${key}`;
        options[key] = lib.config[`extension_名将杀_${configKey}`] ?? option.init;
        extension.config[configKey] = {
            ...option,
            name: `增量武将 · ${option.name}`,
            init: options[key],
        };
    }

    const pack = imported.package;
    delete pack.skill.skill.mjs003_skill_mjs_die_audio;
    for (const [id, definition] of Object.entries(pack.character.character)) {
        const tags = definition[4] ||= [];
        tags.push(...(definition[5] || []));
        tags.push(`die:ext:名将杀/assets/incremental/audio/die/${id}.mp3`);
    }
    for (const [id, card] of Object.entries(pack.card.card)) {
        if (["mjs003_card_mjs_yujian", "mjs003_card_mjs_ju"].includes(id)) { card.fullskin = true; card.artworkLayout = "painting"; card.image = `ext:名将杀/assets/incremental/${id}.webp`; }
        if (!card.image && (card.fullskin || card.fullimage)) {
            card.image = `ext:名将杀/assets/incremental/${id}.${card.fullskin ? "png" : "jpg"}`;
        }
    }
    extension.package.intro += "<br>增量收录高山流水制作的29名武将，已并入原有名将杀分类。";
    const originalPrecontent = extension.precontent;
    const originalContent = extension.content;
    extension.precontent = async function (config, originalPack) {
        await originalPrecontent?.call(this, config, originalPack);
        const characters = lib.imported.character.mjs;
        const cards = lib.imported.card.mjs;
        Object.assign(characters.character, pack.character.character);
        Object.assign(characters.skill, pack.skill.skill);
        // These keys were headings in the standalone package, not faction updates.
        const categories = pack.character.characterSort["名将杀"];
        const translations = { ...pack.character.translate };
        for (const key of Object.keys(categories)) delete translations[key];
        Object.assign(characters.translate, translations, pack.skill.translate);
        const historicalGroups = {
            qin: "mjs_sort_qinsaoliuhe",
            zhao: "mjs_sort_hezonglianheng",
            qi: "mjs_sort_hezonglianheng",
            han_1: "mjs_sort_hezonglianheng",
            caowei: "mjs_sort_sanguoyunqi",
            xishu: "mjs_sort_sanguoyunqi",
            sunwu: "mjs_sort_sanguoyunqi",
            donghan: "mjs_sort_sanguoyunqi",
            xijin: "mjs_sort_jinluoxingti",
            dongjin: "mjs_sort_jinluoxingti",
            xichu: "mjs_sort_chuhanzhizheng",
            xihan: "mjs_sort_hanwushengshi",
        };
        for (const [category, ids] of Object.entries(categories)) {
            const group = historicalGroups[category];
            const existing = characters.characterSort.mjs[group] ||= [];
            existing.push(...ids.filter(id => !existing.includes(id)));
        }
        Object.assign(cards.card, pack.card.card);
        Object.assign(cards.translate, pack.card.translate);
        await imported.precontent?.call(imported, options, pack);
        // Remove only the former generated pack selections. The existing mjs
        // selection, extension switch, and imported character IDs stay intact.
        for (const key of ["characters", "cards"] ) {
            const previous = lib.config[key];
            const next = previous.filter(name => !["名将杀", "mode_extension_名将杀"].includes(name));
            if (next.length !== previous.length) await game.saveConfig(key, next);
        }
    };
    extension.content = async function (config, originalPack) {
        await originalContent?.call(this, config, originalPack);
        await imported.content?.call(imported, options, pack);
    };
}
