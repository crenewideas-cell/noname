import { lib, game, ui, get, ai, _status } from "noname";

export default {
    nysgsStarLevel(name) {
        var num = 4;
        if (lib.character[name]?.runestone?.length) num++;
        if (name.startsWith("nysgs_shen_")) num++;
        return num;
    },
};
