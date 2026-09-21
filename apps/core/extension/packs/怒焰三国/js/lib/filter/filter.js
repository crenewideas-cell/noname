import { lib, game, ui, get, ai, _status } from "noname";

const filter = {
    //摧毁
    nysgsCardDestroyable: (card, player, event) => {
        event = event || _status.event;
        if (typeof event != "string") {
            event = event.getParent().name;
        }
        if (card.storage?.nysgsdestroy) return false;
        var mod = game.checkMod(card, player, event, "unchanged", "nysgsCardDestroyable", player);
        if (mod != "unchanged") {
            return mod;
        }
        return true;
    },
};
if (lib.config["extension_怒焰三国_banOnly"]) {
    const origin_characterDisabled = lib.filter.characterDisabled;
    filter.characterDisabled = function (i, libCharacter) {
        if (!lib.character[i]) return true;
        if (lib.character[i].isUnseen) return true;
        if (!i.startsWith("nysgs")) return true;
        return origin_characterDisabled.apply(this, arguments);
    };
}
export default filter;
