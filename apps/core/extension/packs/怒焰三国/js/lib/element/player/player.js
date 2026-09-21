import { lib, game, ui, get, ai, _status } from "noname";
export default {
    nysgsCountFury(max) {
        if (max) return (this.nysgsMaxFury - this.nysgsFury) || 0;
        return this.nysgsFury || 0;
    },
    nysgsCountMaxFury() {
        return this.nysgsMaxFury || 0;
    },
    nysgsGetBaseFury() {
        let charge = 0;
        if (this.name.startsWith("nysgs")) {
            charge = 2;
        }
        return charge;
    },
    nysgsGetMaxFury() {
        let charge = 0;
        if (this.name.startsWith("nysgs")) {
            charge = 4;
        }
        return charge;
    },
    nysgsAddFury(num, log) {
        if (typeof num != "number" || !num) num = 1;
        var maxFury = this.nysgsMaxFury;
        num = Math.min(num, maxFury - this.nysgsFury);
        if (typeof this.nysgsFury != "number") this.nysgsFury = 0;
        var next = game.createEvent("nysgsAddFury");
        next.player = this;
        next.log = log;
        next.num = num;
        next.setContent("nysgsAddFury");
        next.filterStop = function() {
            if (this.num < 0) {
                delete this.filterStop;
                this.finish();
                this._triggered = null;
                return true;
            }
        };
        return next;
    },
    nysgsRemoveFury() {
        var next = game.createEvent("nysgsRemoveFury");
        next.player = this;
        var event = _status.event;
        for (let i = 0; i < arguments.length; i++) {
            if (get.itemtype(arguments[i]) == "player") {
                next.source = arguments[i];
            }
            else if (typeof arguments[i] == "number") {
                next.num = arguments[i];
            }
            else if (arguments[i] == "nosource") {
                next.nosource = true;
            }
        }
        if (next.source == undefined && !next.nosource) {
            next.source = event.customSource || event.player;
        }
        if (next.num == undefined) {
            next.num = (event.baseDamage || 1) + (event.extraDamage || 0);
        }
        if (typeof this.nysgsFury != "number") this.nysgsFury = 0;
        if (typeof this.nysgsMaxFury != "number") this.nysgsMaxFury = 0;
        next.filterStop = function () {
            if (this.num <= 0 || this.player.nysgsCountFury(true)) {
                delete this.filterStop;
                this.finish();
                this._triggered = null;
                return true;
            }
        };
        next.setContent("nysgsRemoveFury");
        return next;
    },
    nysgsAddMaxFury(num, log) {
        if (typeof num != "number" || !num) num = 1;
        let maxFury = this.nysgsMaxFury;
        //if (maxFury >= 6) return;
        if (num > 0) {
            if (typeof this.nysgsMaxFury != "number") this.nysgsMaxFury = 0;
            var next = game.createEvent("nysgsAddMaxFury");
            next.player = this;
            next.log = log;
            next.num = num;
            next.setContent(async (event, trigger, player) => {
                player.nysgsMaxFury += num;
                if (log !== false) {
                    game.log(player, "增加了", num, "点", "#r怒气上限");
                }
                player.updateMark("nysgsFury");
            });
        }
    },
    nysgsRemoveMaxFury(num, log) {
        if (typeof num != "number" || !num) num = 1;
        num = Math.min(num, this.nysgsMaxFury);
        if (num > 0) {
            if (typeof this.nysgsMaxFury != "number") this.nysgsMaxFury = 0;
            var next = game.createEvent("nysgsRemoveMaxFury");
            next.player = this;
            next.log = log;
            next.num = num;
            next.setContent(async (event, trigger, player) => {
                player.nysgsMaxFury -= num;
                if (log !== false) {
                    game.log(player, "减少了", num, "点", "#r怒气上限");
                }
                if (player.nysgsFury > player.nysgsMaxFury) player.nysgsFury = player.nysgsMaxFury;
                player.updateMark("nysgsFury");
            });
        }
    },
    nysgsStarLevel() {
        let num = 4;
        if (lib.character[this.name1]?.runestone?.length) num++;
        if (this.name1?.startsWith("nysgs_Shen")) num++;
        return num;
    },
    nysgsGetDestroyedCards() {
        return this.getCards("h", card => {
            const gaintag = card.gaintag;
            return Array.isArray(gaintag) && gaintag.some(tag => {
                if (tag.startsWith("eternal_")) {
                    return tag.slice(8).startsWith("nysgs_destroy");
                }
                return tag.startsWith("nysgs_destroy");
            });
        });
    },
    nysgsDestroyCards() {
        let next = game.createEvent("nysgsDestroyCards");
        next.player = this;
        for (let i = 0; i < arguments.length; i++) {
            if (get.itemtype(arguments[i]) == "player") {
                next.source = arguments[i];
            }
            else if (get.itemtype(arguments[i]) == "cards") {
                next.cards = arguments[i].slice(0);
            }
            else if (get.itemtype(arguments[i]) == "card") {
                next.cards = [arguments[i]];
            }
            else if (arguments[i] == "notBySelf") {
                next.notBySelf = true;
            }
        }
        if (!next.cards.length) {
            _status.event.next.remove(next);
            next.resolve();
        }
        next.skills = [];
        next.protected_cards = [];
        let event = _status.event;
        if (typeof event !== "string") {
            event = event.getParent().name;
        }
        let skills = [];
        if (typeof this.getModableSkills === "function") {
            skills = this.getModableSkills();
        } else if (typeof this.getSkills === "function") {
            skills = this.getSkills().concat(lib.skill.global);
            game.expandSkills(skills);
            skills = skills.filter(i => {
                const info = get.info(i);
                return info && info.mod;
            });
            skills.sort((a, b) => get.priority(a) - get.priority(b));
        }
        for (let skill of skills) {
            let mod = get.info(skill).mod.nysgsCanBeDestroyed;
            if (mod) {
                for (let i = 0; i < next.cards.length; i++) {
                    let arg = [next.cards[i], next.source, this, event, "unchanged"],
                        result = mod.call(game, ...arg);
                    if (result !== undefined && typeof arg[arg.length - 1] !== "object") {
                        arg[arg.length - 1] = result;
                    }
                    if (!arg[arg.length - 1]) {
                        next.skills.add(skill);
                        next.protected_cards.push(next.cards.splice(i--, 1)[0]);
                    }
                }
            }
            mod = get.info(skill).mod.nysgsCardDestroyable;
            if (mod) {
                for (let i = 0; i < next.cards.length; i++) {
                    let arg = [next.cards[i], this, event, "unchanged"],
                        result = mod.call(game, ...arg);
                    if (result !== undefined && typeof arg[arg.length - 1] !== "object") {
                        arg[arg.length - 1] = result;
                    }
                    if (!arg[arg.length - 1]) {
                        next.skills.add(skill);
                        next.protected_cards.push(next.cards.splice(i--, 1)[0]);
                    }
                }
            }
        }
        next.setContent("nysgsDestroyCards");
        return next;
    },
    nysgsGetBuffSkills() {
        return Object.keys(this.nysgsBuff);
    },
    nysgsCanAddFuryBuff(card) {
        if (this.hasSkillTag("nysgsFreeFury")) return true;
        return this.nysgsCountFury() || card._nysgsFury || card.storage?.nysgsFuryBuff;
    },
    nysgsHiddenCharacter() {
        var next = game.createEvent("nysgsHiddenCharacter");
        next.player = this;
        next.includeOut = true;
        next.setContent("nysgsHiddenCharacter");
        if (typeof bool == "boolean") {
            if (bool) {
                if (this.classList.contains("nysgs-hidden")) {
                    _status.event.next.remove(next);
                    next.resolve();
                }
            } else {
                if (!this.classList.contains("nysgs-hidden")) {
                    _status.event.next.remove(next);
                    next.resolve();
                }
            }
        }
        return next;
    },
    nysgsIsHidden() {
        return this.classList.contains("nysgs-hidden");
    },
    isFirstShowCharacter() {
        return game
            .getAllGlobalHistory("everything", evt => {
                return evt.name == "showCharacter" && evt.player == this && evt.toShow.includes(this.name1);
            })
            .length == 1;
    },
    nysgsHasStatusEffect() {
        if (this.isLinked() || this.isTurnedOver()) return true;
        if (this.nysgsIsHidden()) return true;
        return ["fengyin", "nysgs_xuanyun"].some(skill => this.hasSkill(skill));
    },
    nysgsrefreshCharacter() {
        var next = game.createEvent("nysgsrefreshCharacter");
        next.player = this;
        next.includeOut = true;
        next.setContent("nysgsrefreshCharacter");
        return next;
    },
};
