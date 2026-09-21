import { lib, game, ui, get, ai, _status } from "noname";
export const config = {
    uptateLog: {
        name: "更新说明（点击查看）",
        clear: true,
        onclick() {
            if (ui.onclickhokuptate) return;
            ui.onclickhokuptate = true;
            var bg = ui.create.div(".nysgs-beijing", document.body, function () {
                delete ui.onclickhokuptate;
                uptate.delete();
                game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
                bg.delete();
            });
            var h = document.body.offsetHeight / 1.5;
            var w = document.body.offsetWidth / 1.5;
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            var uptate = ui.create.div(".nysgs-update", `<div><iframe  width="${w}px" height="${h}px" style="border:none;" src="${lib.assetURL}extension/怒焰三国/update.html" ></iframe></div>`, ui.window);
            uptate.style.top = ((document.body.offsetHeight - h) / 2) + 'px';
            uptate.style.left = ((document.body.offsetWidth - w) / 2) + 'px';
        },
    },
    qq: {
        name: "联系及反馈（点击查看）",
        clear: true,
        onclick() {
            var bg = ui.create.div(".nysgs-beijing", document.body);
            var h = document.body.offsetHeight / 1.5;
            var w = document.body.offsetWidth / 1.5;
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            var uptate = ui.create.div(".nysgs-update", ui.window);
            uptate.style.top = ((document.body.offsetHeight - h) / 2) + "px";
            uptate.style.left = ((document.body.offsetWidth - w)) + "px";
            var authorq = ui.create.div(".nysgs-authorq", uptate);
            var authorg = ui.create.div(".nysgs-authorg", uptate);
            bg.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function () {
                uptate.delete();
                game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
                bg.delete();
            });
        },
    },
    commonMode: {
        name: "经典模式",
        intro: "禁用战法和符石，基础怒气和怒气上限设置为2/4",
        init: true,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_怒焰三国_commonMode", item);
        },
    },
    refresh: {
        name: "界限突破",
        intro: "怒焰武将替换为界限突破版",
        init: false,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_怒焰三国_refresh", item);
        },
    },
    stratagem: {
        name: "战法符石开关",
        intro: "战法符石开关，请移动至怒焰武将简介即可自主选择战法和符石",
        init: true,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_怒焰三国_stratagem", item);
        },
    },
    stratagemDisplay: {
        name: "战法符石样式显示",
        intro: "战法符石样式显示",
        init: "icon",
        item: {
            mark: "标记",
            icon: "图标",
        },
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_怒焰三国_stratagemDisplay", item);
        },
    },
    addFuryTip: {
        name: "怒气强化使用卡牌提示",
        intro: "消耗怒气强化使用卡牌时显示具体的强化卡牌文本提示内容",
        init: true,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_怒焰三国_addFuryTip", item);
        },
    },
    banOnly: {
        name: "仅用本扩展武将",
        intro: "只启用怒焰三国杀武将",
        init: false,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_怒焰三国_banOnly", item);
        },
    },
    chooseSkin: {
        name: "皮肤技能",
        intro: "登场时获得皮肤技能，请搭配可以开局换肤的扩展使用（如王者荣耀、联机美化、奥拉星）",
        init: true,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_怒焰三国_chooseSkin", item);
        },
    },
    ruleSkill: {
        name: "怒焰官方规则",
        intro: "启用怒焰官方规则",
        init: true,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_怒焰三国_ruleSkill", item);
        },
    },
}

export const help = {

}
export const files = {
    "character": [], "card": [], "skill": []
}