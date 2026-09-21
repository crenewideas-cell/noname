import { lib, game, ui, get, ai, _status } from "noname";
export default {
    async nysgsAddFury(event, trigger, player) {
        event.forceDie = true;
        event.includeOut = true;
        await event.trigger("nysgsAddFuryBegin1");
        let maxFury = player.nysgsCountMaxFury();
        if (maxFury == Infinity) {
            player.nysgsFury += event.num;
            if (event.log !== false) {
                game.log(player, "获得了", event.num, "点", "#r怒气");
            }
        } else {
            event.num = Math.min(event.num, maxFury - player.nysgsCountFury());
            if (event.num == 0) {
                event.outRange = true;
            }
            else if (event.num > 0) {
                if (player.nysgsFury + event.num > player.nysgsCountMaxFury()) {
                    event.outRange = true;
                }
                player.nysgsFury += event.num;
                if (event.log !== false) {
                    game.log(player, "获得了", event.num, "点", "#r怒气");
                }
            }
        }
        if (player.nysgsCountMaxFury()) {
            player.updateMark("nysgsFury");
        }
    },
    async nysgsRemoveFury(event, trigger, player) {
        let { num, source } = event;
        if (num > player.nysgsFury) {
            num = player.nysgsFury;
            event.num = num;
        }
        if (num > 0) {
            delete event.filterStop;
            game.log(player, "失去了", num, "点", "#r怒气");

            player.nysgsFury -= num;
            player.updateMark("nysgsFury");
        } else {
            event._triggered = null;
        }
    },
    async nysgsDestroyCards(event, trigger, player) {
        const cards = event.cards;
        for (const card of cards) {
            card.storage.nysgsdestroy = true;
        }
        player.addGaintag(cards, "nysgs_destroy");
        if (event.log != false) {
            if (event.source) game.log(player, "的", get.cnNumber(cards.length), "张牌被", event.source, "#r摧毁");
            else game.log(player, "#r摧毁", "了", get.cnNumber(cards.length), "张牌");
        }
        await event.trigger("nysgsdestroyCardsEnd");
        const num = player.nysgsGetDestroyedCards().length;
        if (num > 0) {
            player.markSkill("nysgs_destroy");
            player.updateMark("nysgs_destroy");
            player.addTip("nysgs_destroy", get.translation("nysgs_destroy") + " " + num);
        }
    },
    async nysgsMouYi(event, trigger, player) {
        const target = event.target;
        game.broadcastAll(
            function (list, translationList = []) {
                var list2 = ["nysgsdb_atk1", "nysgsdb_atk2", "nysgsdb_atk3", "nysgsdb_def1", "nysgsdb_def2", "nysgsdb_def3"];
                for (var i = 0; i < 6; i++) {
                    lib.translate[list2[i]] = list[i];
                    lib.translate[list2[i] + "_info"] = translationList[i];
                }
            },
            event.namelist,
            event.translationList
        );
        if (!event.title) {
            event.title = "谋弈";
        }
        game.log(player, "向", target, "发起了", "#y" + event.title);
        if (!event.ai) {
            event.ai = function () {
                return 1 + Math.random();
            };
        }
        const list = ["nysgsdb_def1", "nysgsdb_def2", "nysgsdb_def3"].map(info => [info, get.translation(info + "_info")]);
        event.videoId = lib.status.videoId++;
        const func = (id, list, event) => {
            const dialog = ui.create.dialog(event.title, [list, "tdnodes"]);
            dialog.id = "nysgsMouYi";
            dialog.classList.add("nysgs_ZhangQiYing_Width");
            dialog.buttons.forEach((button, index) => {
                button.dataset.condition = event.getParent().name;
                let node = ui.create.div(".nysgsMouYiTitle", button);
                node.innerHTML = get.translation(list[index][0]);
            });
            dialog.add(`<div><div style="width:100%;text-align:center">选择1项计谋，若计谋成功，则执行对应的效果</div></div>`);
            dialog.videoId = id;
            return dialog;
        };
        if (player.isOnline2()) {
            player.send(func, event.videoId, list, event);
        } else func(event.videoId, list, event);
        const result = await player
            .chooseButton(true)
            .set("createDialog", event.videoId)
            .set("ai", event.ai)
            .forResult();
        game.broadcastAll("closeDialog", event.videoId);
        if (result?.bool) {
            event.mes = result.links[0];
            const list = ["nysgsdb_atk1", "nysgsdb_atk2", "nysgsdb_atk3"].map(info => [info, get.translation(info + "_info")]);
            event.videoId = lib.status.videoId++;
            const func = (id, list, event) => {
                const dialog = ui.create.dialog(event.title, [list, "tdnodes"]);
                dialog.id = "nysgsMouYi";
                dialog.classList.add("nysgs_ZhangQiYing_Width");
                dialog.buttons.forEach((button, index) => {
                    button.dataset.condition = event.getParent().name;
                    let node = ui.create.div(".nysgsMouYiTitle", button);
                    node.innerHTML = get.translation(list[index][0]);
                });
                dialog.add(`<div><div style="width:100%;text-align:center">选择1种策略，若防御成功，则对应的计谋无效</div></div>`);
                dialog.videoId = id;
                return dialog;
            };
            if (target.isOnline2()) {
                target.send(func, event.videoId, list, event);
            } else func(event.videoId, list, event);
            const result2 = await target
                .chooseButton(true)
                .set("createDialog", event.videoId)
                .set("ai", event.ai)
                .forResult();
            game.broadcastAll("closeDialog", event.videoId);

            event.tes = result2.links[0];
            game.broadcast(function () {
                ui.arena.classList.add("thrownhighlight");
            });
            ui.arena.classList.add("thrownhighlight");
            game.addVideo("thrownhighlight1");

            game.log(player, "选择的计谋为", "#g" + get.translation(event.mes));
            game.log(target, "选择的策略为", "#g" + get.translation(event.tes));
            await game.delay(0, lib.config.game_speed == "vvfast" ? 4000 : 1500);
            var mes = event.mes.slice(11);
            var tes = event.tes.slice(11);
            var str;
            if (mes != tes) {
                str = get.translation(player) + event.title + "成功";
                player.popup("胜", "wood");
                target.popup("负", "fire");
                game.log(player, "#g胜");
                event.result = { bool: true };
            } else {
                str = get.translation(player) + event.title + "失败";
                target.popup("胜", "wood");
                player.popup("负", "fire");
                game.log(target, "#g胜");
                event.result = { bool: false };
            }
            event.result.player = event.mes;
            event.result.target = event.tes;
            game.broadcastAll(function (str) {
                var dialog = ui.create.dialog(str);
                dialog.classList.add("center");
                setTimeout(function () {
                    dialog.close();
                }, 1000);
            }, str);
            game.broadcastAll(function () {
                ui.arena.classList.remove("thrownhighlight");
            });
            game.addVideo("thrownhighlight2");
            if (event.clear !== false) {
                game.broadcastAll(ui.clear);
            }
        }
    },
    nysgsHiddenCharacter() {
        const bool = player.nysgsIsHidden();
        game.log(player, (bool ? "解除" : "进入") + "隐匿");
        game.broadcastAll(player => {
            player.classList.toggle("nysgs-hidden");
        }, player);
        player[bool ? "removeSkill" : "addSkill"]("nysgs_hiddenCharacter");
    },
    async nysgsrefreshCharacter(event, trigger, player) {
        player.removeSkill("fengyin");
        player.removeSkill("nysgs_xuanyun");
        await player.link(false);
        await player.turnOver(false);
        await player.nysgsHiddenCharacter(false);
    },
};
