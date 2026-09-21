import { lib, game, ui, get, ai, _status } from "noname";

export async function precontent() {
lib.init.css(lib.assetURL + "extension/梦澈涤花", "extension");

    game.addGroup("mcdh_ark", "舟", "方舟", { color: "#456ca4" });
    
    Object.assign(lib.element.player, {
        //技力
        mcdh_countCharge(bool) {
            if (bool) return this.mcdhChargeMax - this.mcdhCharge;
            return this.mcdhCharge;
        },
        mcdh_countChargeMax() {
            return this.mcdhChargeMax;
        },
        mcdh_hasCharge(skill) {
            if (skill) return this.mcdhCharge >= (get.info(skill).mcdhCharge || 0);
            return this.mcdhCharge > 0;
        },
        mcdh_getCharge(bool) {
            const charges = [];
            if (!this.isUnseen(0)) {
                let info = lib.character[this.name1];
                if (info && info.trashBin) charges.addArray(info.trashBin.filter(trash => trash.startsWith("mcdhCharge")));
            }
            if (this.name2 && (!this.isUnseen(1))) {
                let info = lib.character[this.name2];
                if (info && info.trashBin) charges.addArray(info.trashBin.filter(trash => trash.startsWith("mcdhCharge")));
            }
            let charge1 = 0, charge2 = 0;
            for(const charge of charges){
                let infoCharge = charge.split(':').slice(1)[0];
                charge1 += get.infoHp(infoCharge);
                charge2 += get.infoMaxHp(infoCharge);
            }
            if (bool) return charge2;
            return charge1;
        },
        mcdh_addCharge(num, log) {
            if (typeof num != "number" || !num) num = 1;
            let maxCharge = this.mcdhChargeMax;
            num = Math.min(num, maxCharge - this.mcdhCharge);
            if (num > 0) {
                if (typeof this.mcdhCharge != "number") this.mcdhCharge = 0;
                var next = game.createEvent("mcdh_addCharge", false, get.event());
                next.player = this;
                next.log = log;
                next.num = num;
                next.setContent("mcdh_addCharge");
            }
        },
        mcdh_removeCharge(num, log) {
            if (typeof num != "number" || !num) num = 1;
            num = Math.min(num, this.mcdhCharge);
            if (num > 0) {
                if (typeof this.mcdhCharge != "number") this.mcdhCharge = 0;
                var next = game.createEvent("mcdh_removeCharge", false, get.event());
                next.player = this;
                next.log = log;
                next.num = num;
                next.setContent("mcdh_removeCharge");
            }
        },
        mcdh_addChargeMax(num, log) {
            if (typeof num != "number" || !num) num = 1;
            let maxCharge = this.mcdhChargeMax;
            if (maxCharge >= 5) return;
            num = Math.min(num, maxCharge - this.mcdhChargeMax);
            if (num > 0) {
                if (typeof this.mcdhChargeMax != "number") this.mcdhChargeMax = 0;
                var next = game.createEvent("mcdh_addChargeMax");
                next.player = this;
                next.log = log;
                next.num = num;
                next.setContent(async(event,trigger,player) => {
                    player.mcdhChargeMax += num;
                    if (log !== false) {
                        game.log(player, "增加了", num, "点", "#g技力上限");
                    }
                });
            }
        },
        mcdh_removeChargeMax(num, log) {
            if (typeof num != "number" || !num) num = 1;
            num = Math.min(num, this.mcdhChargeMax);
            if (num > 0) {
                if (typeof this.mcdhChargeMax != "number") this.mcdhChargeMax = 0;
                var next = game.createEvent("mcdh_removeChargeMax");
                next.player = this;
                next.log = log;
                next.num = num;
                next.setContent(async(event,trigger,player) => {
                    player.mcdhChargeMax -= num;
                    if (log !== false) {
                        game.log(player, "减少了", num, "点", "#g技力上限");
                    }
                    if (player.mcdhCharge > player.mcdhChargeMax) player.mcdhCharge = player.mcdhChargeMax;
                })
            }
        },
        //弹药
        mcdh_countAmmo(bool) {
            if (bool) return this.mcdhAmmoMax - this.mcdhAmmo;
            return this.mcdhAmmo;
        },
        mcdh_countAmmoMax() {
            return this.mcdhAmmoMax;
        },
        mcdh_hasAmmo(skill) {
            if (skill) return this.mcdhAmmo >= (get.info(skill).mcdhAmmo || 0);
            return this.mcdhAmmo > 0;
        },
        mcdh_getAmmo(bool) {
            const Ammos = [];
            if (!this.isUnseen(0)) {
                let info = lib.character[this.name1];
                if (info && info.trashBin) Ammos.addArray(info.trashBin.filter(trash => trash.startsWith("mcdhAmmo")));
            }
            if (this.name2 && (!this.isUnseen(1))) {
                let info = lib.character[this.name2];
                if (info && info.trashBin) Ammos.addArray(info.trashBin.filter(trash => trash.startsWith("mcdhAmmo")));
            }
            let Ammo1 = 0, Ammo2 = 0;
            for(const Ammo of Ammos){
                let infoAmmo = Ammo.split(':').slice(1)[0];
                Ammo1 += get.infoHp(infoAmmo);
                Ammo2 += get.infoMaxHp(infoAmmo);
            }
            if (bool) return Ammo2;
            return Ammo1;
        },
        mcdh_addAmmo(num, log) {
            if (typeof num != "number" || !num) num = 1;
            let maxAmmo = this.mcdhAmmoMax;
            num = Math.min(num, maxAmmo - this.mcdhAmmo);
            if (num > 0) {
                if (typeof this.mcdhAmmo != "number") this.mcdhAmmo = 0;
                var next = game.createEvent("mcdh_addAmmo");
                next.player = this;
                next.log = log;
                next.num = num;
                next.setContent("mcdh_addAmmo");
            }
        },
        mcdh_removeAmmo(num, log) {
            if (typeof num != "number" || !num) num = 1;
            num = Math.min(num, this.mcdhAmmo);
            if (num > 0) {
                if (typeof this.mcdhAmmo != "number") this.mcdhAmmo = 0;
                var next = game.createEvent("mcdh_removeAmmo", false, get.event());
                next.player = this;
                next.log = log;
                next.num = num;
                next.forceDie = true;
                next.includeOut = true;
                next.setContent("mcdh_removeAmmo");
            }
        },
        mcdh_addAmmoMax(num, log) {
            if (typeof num != "number" || !num) num = 1;
            let maxAmmo = this.mcdhAmmoMax;
            if(maxAmmo >= 5) return;
            num = Math.min(num, maxAmmo - this.mcdhAmmoMax);
            if (num > 0) {
                if (typeof this.mcdhAmmoMax != "number") this.mcdhAmmoMax = 0;
                var next = game.createEvent("mcdh_addAmmoMax");
                next.player = this;
                next.log = log;
                next.num = num;
                next.setContent(async(event,trigger,player) => {
                    player.mcdhAmmoMax += num;
                    if (log !== false) {
                        game.log(player, "增加了", num, "点", "#g弹药上限");
                    }
                });
            }
        },
        mcdh_removeAmmoMax(num, log) {
            if (typeof num != "number" || !num) num = 1;
            num = Math.min(num, this.mcdhAmmoMax);
            if (num > 0) {
                if (typeof this.mcdhAmmoMax != "number") this.mcdhAmmoMax = 0;
                var next = game.createEvent("mcdh_removeAmmoMax");
                next.player = this;
                next.log = log;
                next.num = num;
                next.setContent(async(event,trigger,player) => {
                    player.mcdhAmmoMax -= num;
                    if (log !== false) {
                        game.log(player, "减少了", num, "点", "#g弹药上限");
                    }
                    if (player.mcdhAmmo > player.mcdhAmmoMax) player.mcdhAmmo = player.mcdhAmmoMax;
                });
            }
        },
    });
    Object.assign(lib.element.content, {
        async mcdh_addCharge(event, trigger, player) {
            event.forceDie = true;
            event.includeOut = true;
            await event.trigger("mcdh_addChargeBegin1");
            let maxCharge = player.mcdh_countChargeMax();
            if (maxCharge == Infinity) {
                player.mcdhCharge += event.num;
                if (event.log !== false) {
                    game.log(player, "回复了", event.num, "点", "#g技力");
                }
            } else {
                event.num = Math.min(event.num, maxCharge - player.mcdh_countCharge());
                if (event.num > 0) {
                    player.mcdhCharge += event.num;
                    if (event.log !== false) {
                        game.log(player, "回复了", event.num, "点", "#g技力");
                    }
                }
            }
            player.updateMark("mcdh_charge");
        },
        async mcdh_removeCharge(event, trigger, player) {
            event.forceDie = true;
            event.includeOut = true;
            await event.trigger("mcdh_removeChargeBegin1");
            event.num = Math.min(event.num, player.mcdh_countCharge());
            if (event.num > 0) {
                player.mcdhCharge -= event.num;
                if (event.log !== false) {
                    game.log(player, "失去了", event.num, "点", "#g技力");
                }
            }
            player.updateMark("mcdh_charge");
        },
        async mcdh_addAmmo(event, trigger, player) {
            event.forceDie = true;
            event.includeOut = true;
            await event.trigger("mcdh_addAmmoBegin1");
            let maxAmmo = player.mcdh_countAmmoMax();
            if (maxAmmo == Infinity) {
                player.mcdhAmmo += event.num;
                if (event.log !== false) {
                    game.log(player, "回复了", event.num, "点", "#g弹药");
                }
            } else {
                event.num = Math.min(event.num, maxAmmo - player.mcdh_countAmmo());
                if (event.num > 0) {
                    player.mcdhAmmo += event.num;
                    if (event.log !== false) {
                        game.log(player, "回复了", event.num, "点", "#g弹药");
                    }
                }
            }
            player.updateMark("mcdh_ammo");
        },
        async mcdh_removeAmmo(event, trigger, player) {
            event.forceDie = true;
            event.includeOut = true;
            await event.trigger("mcdh_removeAmmoBegin1");
            event.num = Math.min(event.num, player.mcdh_countAmmo());
            if (event.num > 0) {
                player.mcdhAmmo -= event.num;
                if (event.log !== false) {
                    game.log(player, "失去了", event.num, "点", "#g弹药");
                }
            }
            player.updateMark("mcdh_ammo");
        },
    });
    Object.assign(lib.skill,{
        mcdh_charge: {
            mark: true,
            marktext: "技力",
            intro: {
                markcount(skill,player) {
                    return `${player.mcdh_countCharge()}/${player.mcdh_countChargeMax()}`;
                },
                content: (storage,player) => `<li>技力值：${player.mcdh_countCharge()}<br><li>技力上限：${player.mcdh_countChargeMax()}`,
            },
        },
        _mcdh_charge_add: {
            trigger: {
                player: "phaseBegin",
                global: "phaseEnd",
            },
            silent: true,
            charlotte: true,
            ruleSkill: true,
            filter(event, player, name){
                if (!player.mcdh_countCharge(true)) return false;
                return name == "phaseBegin" || player.hasHistory("damage");
            },
            async content(event, trigger, player) {
                await player.mcdh_addCharge();
            },
        },
        //弹药
        mcdh_ammo: {
            mark: true,
            marktext: "弹药",
            intro: {
                markcount(skill,player){
                    return `${player.mcdh_countAmmo()}/${player.mcdh_countAmmoMax()}`;
                },
                content: (storage,player) => `当前弹药值：${player.mcdh_countAmmo()}`,
            },
        },
        _mcdh_ammo_add: {
            trigger: {
                player: "phaseDrawBegin2",
            },
            charlotte: true,
            filter (event,player){
                if (!player.mcdh_countAmmo(true)) return false;
                if (player.hasSkillTag("mcdh_cannotSupply")) return false;
                return !event.numFixed;
            },
            async cost(event, trigger, player) {
                const num = Math.min(trigger.num, player.mcdh_countAmmo(true));
                const list = Array.from({length: num}).map((_, index) => `${get.cnNumber(index + 1)}张`);
                event.result = await player
                    .chooseControl(list, "cancel2")
                    .set("prompt", `###弹药补给###摸牌阶段，你可以少摸任意张牌，装填等量的弹药。`)
                    .set("ai", () => {
                        const { player, controls } = get.event();
                        return 1;
                    })
                    .forResult();
                if (event.result.control != "cancel2") {
                    event.result.cost_data = event.result.index + 1;
                }
            },
            async content(event, trigger, player) {
                const num = event.cost_data;
                trigger.num -= num;
                await player.mcdh_addAmmo(num);
            },
        },
    })
    Object.assign(lib.translate,{
        visible_mcdh: "明置牌",
        mcdh_charge: "技力",
        mcdh_ammo: "弹药",
        rule_mcdh_chargeSkill: "蓄力技",
        rule_mcdh_chargeSkill_info: "蓄力技：<li>发动流程：<br>时机正确→技力足够→失去相应技力→发动蓄力技→执行相关效果<li>技力的获取：<br>回合开始时，你回复1点技力；每名角色的回合结束时，若你受到过伤害，则你回复1点技力。",
        rule_mcdh_ammoSkill: "装填技",
        rule_mcdh_ammoSkill_info: "装填技：<li>发动流程：<br>时机正确→弹药足够→失去相应弹药→发动装填技→执行相关效果<li>弹药的获取：<br>摸牌阶段，你可以少摸任意张牌并装填等量枚弹药。",
    });

    lib.element.player.inits = []
        .concat(lib.element.player.inits || [])
        .concat(player => {
            const charge1 = player.mcdh_getCharge(), 
                charge2 = player.mcdh_getCharge(true);
            if (charge1 && charge2) {
                player.mcdhCharge = charge1;
                player.mcdhChargeMax = charge2;
                player.markSkill("mcdh_charge");
                game.log(player, "的", "#y技力值", "为", "#g" + player.mcdhCharge);
                game.log(player, "的", "#y技力上限", "为", "#g" + player.mcdhChargeMax);
            }
            const ammo1 = player.mcdh_getAmmo(), ammo2 = player.mcdh_getAmmo(true);
            if (ammo1 && ammo2) {
                player.mcdhAmmo = ammo1;
                player.mcdhAmmoMax = ammo2;
                player.markSkill("mcdh_ammo");
                game.log(player, "的", "#y弹药值", "为", "#g" + player.mcdhAmmo);
                game.log(player, "的", "#y弹药上限", "为", "#g" + player.mcdhAmmoMax);
            }
        });

	await import("../character/index.js");
	lib.translate.mcdh_character_config = "梦澈涤花";
}