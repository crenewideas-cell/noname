import { lib, game, ui, get, ai, _status } from "noname";

export function prepare() {
    //console.log("prepare")
    const origin_player_canEquip = lib.element.player.canEquip;
    lib.element.player.canEquip = function (name, replace) {
        if (this.hasMJSEquip()) {
            if (get.itemtype(name) == "card") {
                const owner = get.owner(name, "judge");
                if (owner && !lib.filter.canBeGained(name, this, owner)) {
                    return false;
                }
            }
            let num = this.mjsGetEquipLimit();
            let num2 = this.getVCards("e").length;
            if (!replace) {
                num += this.getVCards("e").filter(card => lib.filter.canBeReplaced(card, this)).length;
            }
            if (num <= 0) {
                return false;
            }
            return true;
        }
        return origin_player_canEquip.apply(this, arguments);
    };

    //武库
    lib.skill._mjsduwuku = {
        charlotte: true,
        ruleSkill: true,
        trigger: {
            global: "gameDrawBefore",
        },
        silent: true,
        firstDo: true,
        filter(event, player) {
            return !_status.cardPile;
        },
        async content(event, trigger, player) {
            _status.cardPile = Array.from(ui.cardPile.childNodes).flat();
        },
    };

    //姗姗来迟
    lib.skill.rule_mjsshanshanlaichi = {
        charlotte: true,
        ruleSkill: true,
        group: "undist",
        init(player) {
            if (!player.isIn()) {
                return;
            }
            game.broadcastAll(function (player) {
                player.classList.add("out");
                player.classList.add("shanshanlaichi");
            }, player);
        },
        onremove(player, skill) {
            for (var i = 0; i < lib.element.player.inits.length; i++) {
                const func = lib.element.player.inits[i];
                if (func && func.name && func.name == "deferHide") {
                    lib.element.player.inits.splice(i--, 1);
                }
            }
            if (player.isOut()) {
                game.broadcastAll(function (player) {
                    player.classList.remove("out");
                    player.classList.remove("shanshanlaichi");
                }, player);
            }
            player.getStorage(skill).forEach(node => player.node[node].show());
            delete player.storage[skill];
        },
        trigger: {
            global: "roundStart",
        },
        silent: true,
        firstDo: true,
        forceOut: true,
        forceDie: true,
        filter(event, player) {
            return game.roundNumber > 1;
        },
        async content(event, trigger, player) {
            player.removeSkill(event.name);
            const next = game.createEvent("enterGame");
            next.player = player;
            next.setContent("emptyEvent");
        },
    };
    const hide = function(player) {
        var name = player.name || player.name1;
        if (name && lib.character[name]) {
            const nodeList = Object.keys(player.node);
            nodeList.removeArray([
                "avatar",
                "avatar2",
                "turnedover",
                "framebg",
                "intro",
                "identity",
                //"hp",
                //"name",
                //"name2",
                //"nameol",
                //"count",
                "equips",
                "judges",
                "marks",
                "chain",
                "handcards1",
                "handcards2",
                "expansions",
                "action",
                "link",
                "name_seat"
            ]);
            for (const node of nodeList) {
                if (!player.node[node]?.classList?.contains("hidden")) {
                    player.markAuto("rule_mjsshanshanlaichi", node);
                    player?.node?.[node]?.hide();
                }
            }
        }
        player.addSkill("rule_mjsshanshanlaichi");
    };
    lib.element.player.inits = []
        .concat(lib.element.player.inits || [])
        .concat(function deferHide(player) {
            if (player.hasSkillTag("deferHide")) {
                hide(player);
            }
        });
    
    const addKuilei = (player, name) => {
        const info2 = lib.character[name];
        if (!info2) {
            return;
        }
        const skills = info2?.skills?.filter(skill => {
            const info = get.info(skill);
            if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
                return false;
            }
            return true;
        });
        const info = {
            name: name,
            hp: info2.hp,
            maxHp: info2.maxHp ?? info2.hp,
            maxHandcard: null,
            maxEquip: null,
            skills: skills,
            hasHidden: true,
        };
        player.setStorage("mjszaohuatonggong", info);
        return info;
    };
    //造化同功
    lib.skill._mjszaohuatonggong = {
        ruleSkill: true,
        trigger: {
            player: "chooseButtonEnd",
        },
        silent: true,
        charlotte: true,
        filter(event, player) {
            if (event.getParent().name != "chooseCharacter") {
                return false;
            }
            if (!event.result?.links?.length) {
                return false;
            }
            const names = event.result.links;
            return names.some(name => get.character(name)?.skills?.includes("mjszaohuatonggong"));
        },
        async content(event, trigger, player) {
            let targets = [player];
            const names = trigger.result.links.filter(name => {
                return get.character(name)?.skills?.includes("mjszaohuatonggong");
            });
            const buttons = trigger.result.buttons.filter(button => {
                return get.character(button.link)?.skills?.includes("mjszaohuatonggong");
            });
            trigger.result.buttons.removeArray(buttons);
            trigger.result.links.removeArray(names);
            
            switch (get.mode()) {
                case "single": {
                    if (player.name) {
                        targets = [player.next];
                    }
                }
                break;
            }

            if (names.length) {
                game.addRecentCharacter(names[0]);
                for (const target of targets) {
                    addKuilei(target, names[0]);
                }
            }
        },
    };
    const origin_player_init = lib.element.player.init;
    const init = function(character, character2, skill, update) {
        var player = this;
        if (player == game.me) {
            return character;
        }
        if (typeof character == "string" && !lib.character[character]) {
            lib.character[character] = get.character(character);
        }
        if (typeof character2 == "string" && !lib.character[character2]) {
            lib.character[character2] = get.character(character2);
        }
        if (!lib.character[character]) {
            return;
        }
        var info = lib.character[character];
        if (!info) {
            info = get.convertedCharacter(["", "", 1, [], []]);
        }
        var skills = info.skills.slice(0);
        var oldCharacter = character;
        if (skills.includes("mjszaohuatonggong")) {
            var list = get.info("mjszaohuatonggong").getList();
            var newCharacter = list.randomGet();
            if (newCharacter) {
                addKuilei(player, oldCharacter);
                return newCharacter;
            }
        }
        return character;
    };
    lib.element.player.init = function(character, character2, skill, update) {
        if (_status.event.name != "chooseCharacter") {
            return origin_player_init.apply(this, arguments);
        } else {
            arguments[0] = init.apply(this, arguments) || character;
        }
        var player = origin_player_init.apply(this, arguments);
        const originSkills = player.getStorage("mjszaohuatonggong", {}).skills || [];
        if (originSkills.length) {
            player.addInvisibleSkill(originSkills);
        }
        return player;
    };

}
