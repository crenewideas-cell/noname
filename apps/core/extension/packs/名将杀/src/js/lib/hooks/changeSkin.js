import { lib, game, ui, get, ai, _status } from "noname";

/**
 * @type {(NonameHookType["changeSkin"])[]}
 */
const changeSkin = {
	refreshSkin: [
		function changeSkin(characterName, skinName, sourcenode, avatar) {
            // @ts-ignore
            const goon = !lib.character[skinName];
            if (goon) {
                lib.character[skinName] = get.convertedCharacter(["", "", 0, [], (lib.characterSubstitute[characterName].find((i2) => i2[0] == skinName) || [skinName, []])[1]]);
            }
            /*const imgPath = lib.character[skinName].trashBin.find(i => i.startsWith("ext:"));
            if (imgPath) {
                lib.config.skin[characterName] = [characterName + ".jpg", imgPath.replace(/ext:/, "extension/")];
                game.saveConfig("skin", lib.config.skin);
            }*/
            if (avatar) {
                avatar.parentNode?.changeSkin({ characterName: characterName }, skinName);
            }
            if (sourcenode) {
                //const skinImg = !lib.config.skin[skinName] && lib.character[skinName]?.img;
                //skinImg ? sourcenode.setBackgroundImage(skinImg) : sourcenode.setBackground(skinName, "character");
                sourcenode.setBackground(skinName, "character");
            }
            if (goon) {
                delete lib.character[skinName];
            }
        },
	],
};
export default changeSkin;

