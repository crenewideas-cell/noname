import { createCharacterPack, copyCardAttributes } from "./CharacterCard.js";
import createCardPack from "./cards.js";
import { installCharacterUI, playQiyu } from "./compatibility.js";
import createArtifacts from "./artifacts.js";

/** Character resources only; never execute the APK's UI/engine replacement entry. */
export default function (...args) {
    const [lib, game, ui] = args;
    const character = createCharacterPack(...args);
    const card = createCardPack(...args);
    const artifacts = createArtifacts(...args);
    for (const field of ["card", "skill", "translate"]) Object.assign(card[field], artifacts[field]);
    for (const [id, info] of Object.entries(character.character)) {
        const tags = info[4] ||= [];
        // The old APK resolved this alias with a global death hook.
        const die = tags.indexOf("die:假装无敌");
        if (die !== -1) tags[die] = `die:ext:清瑶葭绮/members/假装无敌/${id}.mp3`;
        if (!tags.some(tag => /^(ext:|db:|character:|img:)/.test(tag))) {
            tags.push(`ext:清瑶葭绮/members/假装无敌/${id}.jpg`);
        }
    }
    return {
        name: "假装无敌",
        config: {},
        package: { character, card, skill: { skill: {}, translate: {} } },
        precontent() {
            installCharacterUI(lib, ui);
            game.setFile ??= [];
            game.qyPlayQiyu ??= auto => playQiyu(lib, game, auto);
            lib.characterLiuwei ??= {};
            lib.qyCopyCardAttributes ??= card => copyCardAttributes(card, args[3]);
            lib.group.add("qingyao_xian");
            lib.translate.qingyao_xian ??= "仙";
            lib.translate.qingyao_xian2 ??= "仙";
            lib.groupnature.qingyao_xian ??= "qingyao_xian";
            // Internal lookups in the original skills need the old ID, not a second menu pack.
            lib.characterPack.假装无敌Pack = character.character;
            window.假装无敌character = Object.fromEntries(Object.entries(character.character).map(([id, info]) => [id, info.slice()]));
            game.qyAddGlobalSkill ??= (...values) => game.addGlobalSkill(...values);
            game.playqysstx ??= (name, dir, sex) => {
                if (!lib.config.background_speak) return;
                return dir ? game.playAudio(...[dir, sex, name].filter(Boolean)) : game.playAudio("..", "extension", "清瑶葭绮", "members", "假装无敌", name);
            };
        },
        content() {},
    };
}
