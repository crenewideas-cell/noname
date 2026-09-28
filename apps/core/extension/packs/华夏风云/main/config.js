import { lib, game, ui, get, ai, _status } from "./utils.js";

const config = {
    hxfy_openWinDialog: {
        name: "点我打开战绩",
        clear: true,
        onclick: function() {
            game.openWinDialog();
        },
    },
    exportPz: {
        name: "复制本扩展配置",
        clear: true,
        onclick: function () {
            let txt = "{", op = "extension_华夏风云_";
            for (let i in lib.config) {
                if (i.indexOf(op) === 0) {
                    txt += "\r" + i.slice(op.length) + " : " + JSON.stringify(lib.config[i]).replace("\n", "\r") + ",";
                }
            }
            txt += "\r}";
            let textarea = document.createElement("textarea");
            textarea.setAttribute("readonly", "readonly");
            textarea.value = txt;
            document.body.appendChild(textarea);
            textarea.select();
            if (document.execCommand("copy")) {
                document.execCommand("copy");
                alert("本扩展配置已成功复制到剪切板，请您及时粘贴保存");
            } else {
                alert("复制失败");
            }
            document.body.removeChild(textarea);
        }
    },
    loadPz: {
        name: "载入本扩展配置",
        clear: true,
        onclick: function () {
            ui.create.editor({
                value: "//完整粘贴你保存的本扩展配置到等号右端\n_status.extension_config = ",
                saveInput(code) {
                    eval(code);
                    if (Object.prototype.toString.call(_status.extension_config) !== "[object Object]") {
                        throw new TypeError("扩展配置必须是对象");
                    }
                    for (const key in _status.extension_config) {
                        game.saveConfig("extension_华夏风云_" + key, _status.extension_config[key]);
                    }
                    alert("配置已成功载入！即将重启游戏");
                    game.reload();
                },
            });
        }
    },
};

export default config;
