import { createCardPack } from "./CharacterCard.js";

/** Public faction resources can be loaded without enabling the general pack. */
export default function (...args) {
    const pack = createCardPack(...args);
    for (const [, , name] of pack.list) {
        if (!pack.card[name]) continue;
        pack.card[name].qingyaoXian = true;
        pack.card[name].requiredGroups = ["qingyao_xian"];
    }
    return pack;
}
