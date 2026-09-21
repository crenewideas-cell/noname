import { lib, game, ui, get, ai, _status } from "noname";
import translate from "./translate.js";
const addSkin = async (path, key) => {
  await game.getFileList(path, async function (folders, files) {
    for (const file of files) {
      if (!lib.characterSubstitute[key]) {
        lib.characterSubstitute[key] = [];
      }
      const skinName = file.slice(0, -4);
      lib.characterSubstitute[key].push([
        skinName, 
        [
          `ext:名将杀/skin/image/${key}/${file}`, 
          `skinAudioPath:名将杀/skin/audio/${key}/`, 
          `die:ext:名将杀/skin/audio/${key}/die/${skinName}.mp3`,
          `die:ext:名将杀/skin/audio/${key}/die/${skinName}2.mp3`
        ]
      ]);
    }
    for (const folder of folders) {
      addSkin(path + "/" + folder, folder);
    }
  });
};
addSkin(`extension/名将杀/skin/image`);
Object.assign(lib.translate, { ...translate });
