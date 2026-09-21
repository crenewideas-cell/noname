import { lib, game, ui, get, ai, _status } from "noname";

const hooks = {
    checkBegin: [
        function mjsSkillDialog(event) {
            return;
            if (!["choosePlayerCard", "discardPlayerCard", "gainPlayerCard"].includes(event.name)) {
                return;
            }
            if (event._mjsSkillDialog) {
                return;
            }
            event._mjsSkillDialog = true;
            let {
                player,
                target,
                skill,
                dialog,
                prompt, 
                position,
                filterButton,
                selectButton,
                _set,
                _args
            } = event;
            let eventName, level = 1;
            do {
                let evt = event.getParent(level);
                eventName = evt.name;
                if (eventName?.startsWith("pre_")) {
                    eventName = eventName.slice("pre_".length);
                }
                if (eventName?.endsWith("_cost")) {
                    eventName = eventName.slice(0, -"_cost".length);
                }
                level++;
            } while (!lib.translate[eventName] && level < 4);
            let addNewRow = [
                dialog => {
                    dialog.classList.add("addNewRow");
                    dialog.classList.add("mjs-skillDialog");
                    dialog.classList.add("fullheight");
                    dialog.setCaption(get.translation(eventName));
                    dialog.css({
                        top: get.is.phoneLayout() ? "5%" : "45%",
                    });
                    const contentx = ui.create.div(".characterBg", dialog);
                    contentx.setBackground(target.name, "character");
                },
                "handle"
            ];
            dialog.add(addNewRow);
            if (prompt) {
                //dialog.add(prompt);
            }
        },
    ],
};
const skillDialog = {};
if (lib.config["extension_名将杀_UI"]) {
    Object.assign(skillDialog, hooks);
}
export default skillDialog;

