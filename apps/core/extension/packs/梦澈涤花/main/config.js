import { lib, game, ui, get, ai, _status } from "noname";

export const config = {
    uptateLog: {
        name: "更新说明（点击查看）",
        clear: true,
        onclick() {
            if (ui.onclickhokuptate) return;
            ui.onclickhokuptate = true;
            var bg = ui.create.div(".mcdh-beijing", document.body, function () {
                delete ui.onclickhokuptate;
                uptate.delete();
                game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
                bg.delete();
            });
            var h = document.body.offsetHeight / 1.5;
            var w = document.body.offsetWidth / 1.5;
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            var uptate = ui.create.div(".mcdh-update", `<div><iframe  width="${w}px" height="${h}px" style="border:none;" src="${lib.assetURL}extension/梦澈涤花/update.html" ></iframe></div>`, ui.window);
            uptate.style.top = ((document.body.offsetHeight - h) / 2) + 'px';
            uptate.style.left = ((document.body.offsetWidth - w) / 2) + 'px';
        },
    },
    qq: {
        name: "联系及反馈（点击查看）",
        clear: true,
        onclick() {
            var bg = ui.create.div(".mcdh-beijing", document.body);
            var h = document.body.offsetHeight / 1.5;
            var w = document.body.offsetWidth / 1.5;
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            var uptate = ui.create.div(".mcdh-update", ui.window);
            uptate.style.top = ((document.body.offsetHeight - h) / 2) + "px";
            uptate.style.left = ((document.body.offsetWidth - w)) + "px";
            var authorq = ui.create.div(".mcdh-authorq", uptate);
            var authorg = ui.create.div(".mcdh-authorg", uptate);
            bg.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function () {
                uptate.delete();
                game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
                bg.delete();
            });
        },
    },
}

export const help = {

}
export const files = {
    "character": [], "card": [], "skill": []
}