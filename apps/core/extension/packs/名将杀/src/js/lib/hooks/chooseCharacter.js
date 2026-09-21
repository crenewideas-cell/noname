import { lib, game, ui, get, ai, _status } from "noname";

const chooseCharacter = {
    checkEnd: [
        function mjszaohuatonggongCheck(event, { ok, auto, autoConfirm }) {
            if (event.name != "chooseButton" || event.getParent().name != "chooseCharacter") {
                return;
            }
            const { player, dialog } = event;
            const buttons = ui.selected.buttons;
            if (buttons.some(button => button.link == "mjs_yanshi")) {
                if (event._mjszaohuatonggongCheck) {
                    return;
                }
                event._mjszaohuatonggongCheck = true;
                game.initCharacterList();
                event.initCharacterList ??= get.info("mjszaohuatonggong").getList().randomGets(3);
                const names = event.initCharacterList;
                const func = () => {
                    const parentNode = dialog.buttons[0].parentElement;
                    for (const name of names) {
                        const button = ui.create.button(name, "characterx", parentNode);
                        button.classList.add("mjs_class_puppet");
                        if (Array.isArray(dialog.buttons)) {
                            dialog.buttons.push(button);
                        }
                    }
                    const filter = event.filterButton;
                    const select = event.selectButton;
                    event.set("originalFilter", filter);
                    event.set("filterButton", button => {
                        if (!get.event().originalFilter(button)) return false;
                        return button.classList.contains("mjs_class_puppet");
                    });
                    event.set("originSelect", select);
                    event.set("complexSelect", true);
                    event.set("selectButton", () => {
                        const num = get.event().originSelect;
                        if (ui.selected.buttons.some(button => button.link == "mjs_yanshi")) {
                            return 2;
                        }
                        return num;
                    });
                    game.check();
                };
                event.isMine() ? func() : player.send(func);
            } else if (event._mjszaohuatonggongCheck) {
                delete event._mjszaohuatonggongCheck;
                const func = () => {
                    const parentNode = dialog.buttons[0].parentElement;
                    const buttons = dialog.buttons.filter(button => button.classList.contains("mjs_class_puppet"));
                    for (const button of buttons) {
                        parentNode.removeChild(button);
                    }
                    if (buttons.length) {
                        dialog.buttons.removeArray(buttons);
                    }
                    event.set("filterButton", event.originalFilter);
                    event.set("selectButton", event.originSelect);
                    game.uncheck();
                    game.check();
                };
                event.isMine() ? func() : player.send(func);
            }
        },
    ],
};
export default chooseCharacter;

