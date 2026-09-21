import { lib, game, ui, get, ai, _status } from "noname";

export function arenaReady() {
    _status.nysgsOnEquip = {};
    lib.element.player.inits = []
        .concat(lib.element.player.inits || [])
        .concat(player => {
            if (!player.nysgs_hidden) {
                player.nysgs_hidden = ui.create.div(".nysgs-hidden", "<div>" + get.verticalStr("隐匿") + "<div>", player);
            }
            player.nysgsBuff = {};
            if (lib.config["extension_怒焰三国_ruleSkill"] && player.name1?.startsWith("nysgs") && player.name2) {
                var name2 = player.name2;
                var list = [player.name1, name2];
                player.storage.nysgs_change = [player.name1, player.hp, player.maxHp];
                var info2 = lib.character[name2];
                player.storage.nysgs_change.push(name2);
                player.storage.nysgs_change.push(info2.hp);
                player.storage.nysgs_change.push(info2.maxHp);
                var cfg = player.storage.nysgs_change;
                player.markSkillCharacter("nysgs_change", { name: cfg[3] }, "背面", "当前体力：" + cfg[4] + "/" + cfg[5]);
                game.broadcastAll(player => {
                    player.smoothAvatar(true);
                    player.node.avatar2.classList.add("hidden");
                    player.classList.remove("fullskin2");
                    player.node.name2.innerHTML = "";
                    player.removeSkill(lib.character[player.name2][3]);
                    player.syncSkills();
                    delete player.name2;
                    if (player == game.me && ui.fakeme) {
                        ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                    }
                }, player);
                player.addSkill("nysgs_change");
                const skills = get.character(name2).skills.filter(skill => get.info(skill)?.dualSideSkill);
                if (skills.length) {
                    player.addAdditionalSkill("nysgs_change", skills);
                }
            }
        })
        .concat(player => {
            const baseFury = player.nysgsGetBaseFury();
            const maxFury = player.nysgsGetMaxFury();
            if (maxFury == 0) return;
            player.nysgsFury = baseFury;
            player.nysgsMaxFury = maxFury;
            player.markSkill("nysgsFury");
            player.addSkill("nysgsFury_use");
            if (lib.config["extension_怒焰三国_stratagem"]) {
                const onEquip = _status.nysgsOnEquip[player.name1];
                if (!onEquip || typeof onEquip != "object") return;
                const list = Object.keys(onEquip).filter(key => key >= 5).map(key => onEquip[key]);
                player.nysgsFury += list.filter(info => info.endsWith("tiannu")).length;
                player.nysgsMaxFury += list.filter(info => info.endsWith("tianchen")).length;
                player.hp += list.filter(info => info.endsWith("tianyan")).length;
                player.maxHp += list.filter(info => info.endsWith("tianyan")).length;
                const skills = Object.values(onEquip).toUniqued()
                    .removeArray(["nysgs_fs_tianchen", "nysgs_fs_tiannu", "nysgs_fs_tianyan", "nysgs_icon_point"]);
                if (skills.length) {
                    player.addSkill(skills);
                    skills.forEach(skill => {
                        if (get.info(skill).runestoneSkill) {
                            player.addMark(skill, 6, false);
                        }
                    });
                    if (lib.config["extension_怒焰三国_stratagemDisplay"] == "icon") {
                        nysgs.createSkillBuff(skills, player);
                    }
                }              
            }
            game.log(player, "的", "#r怒气值", "为", "#r" + player.nysgsFury);
            game.log(player, "的", "#r怒气上限", "为", "#r" + player.nysgsMaxFury);
        });

    game.addNature("nysgswater", "水", {
        audio: {
            damage: {
                nysgswater: "normal",
            },
            hujia_damage: {
                nysgswater: "normal",
            },
            sha: {
                nysgswater: {
                    male: "../extension/怒焰三国/audio/card/sha_water_male.mp3",
                    female: "../extension/怒焰三国/audio/card/sha_water_female.mp3",
                },
            },
        },
        linked: true,
        order: 33,
        lineColor: "#b0d0e2",
        color: "#b0d0e2",
        background: "ext:怒焰三国/image/card/nysgs_shuiyanqijun.png",
    });
    lib.nature.set("nysgswater", 33);

    if (lib.config["extension_怒焰三国_addFuryTip"]) {
        lib.hooks.checkEnd.push(function nysgsFuryTip(event) {
            if (event.name != "chooseToUse" || event.skill != "nysgsFury_use") return;
            const dialog = event.skillDialog;
            if (dialog?.content?.lastChild) {
                if (ui.selected.cards.length) {
                    const card = ui.selected.cards[0];
                    dialog.content.lastChild.innerHTML = `<div><div style="width:100%;text-align:center">你可以失去1点怒气强化使用【${get.translation(card.name)}】，令此牌${get.info("_nysgsFury_buff").getBuff.get(card.name).description}</div></div>`;
                } else {
                    dialog.content.lastChild.innerHTML = `<div><div style="width:100%;text-align:center">${get.info("nysgsFury_use").prompt}</div></div>`;
                }
            }
        });
    }

    if (!lib.characterPack?.nysgs) return;
    let list = Object.keys(lib.characterPack.nysgs);
    for (let name of list) {
        let obj = {};
        if (lib.config["extension_怒焰三国_OnEquip"].hasOwnProperty(name)) {
            obj = lib.config.extension_怒焰三国_OnEquip[name];
        }
        if (!Object.keys(obj).length) obj = nysgs.initSkillBuff(name);
        if (!lib.characterIntro[name]) lib.characterIntro[name] = "";
        lib.characterIntro[name] += "<br/>【简要玩法】<br/><br/>【武将装备】<br/>";
        _status.nysgsOnEquip[name] = obj;
        Object.keys(obj).forEach((key, index) => {
            lib.characterIntro[name] += `<div class ="nysgs-static intro-title"><img onclick ="nysgs.changeOnEquip('${name}')" class="nysgs-intro" src="extension/怒焰三国/image/icon/${obj[key]}.png"/></div>`;
        });
    }
    
}
