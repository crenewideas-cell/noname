import { lib, game, ui, get, ai, _status } from "noname";
import cardPile from "../src/js/setting/cardPile.js";

export function arenaReady(config, pack) {
    //console.log("arenaReady")
    const packs = { ...lib.characterPack.mjs, ...lib.characterPack.mjsnew, ...lib.characterPack.mjsold };
    const ranks = ["junk", "rare", "epic", "legend"];
    for (let i in packs) {
        for (let rank of ranks) {
            if (lib.character[i]?.trashBin?.includes(rank)) {
                lib.rank.rarity[rank].add(i);
                break;
            }
        }
    }

    // 名将百科
    const createSlideBg = function () {
        const slidebg = ui.create.div(".slidebg slideins", document.body);
        const mjbklist = ui.create.div(".mjbklist", slidebg);
        
        const placeholder = document.createComment("");
        mjbklist.appendChild(placeholder);
        
        const mjbk_back = ui.create.div(".mjbk_back", slidebg);
        
        const baikeHead = document.createElement("div");
        baikeHead.className = "baike_head";
        mjbklist.appendChild(baikeHead);

        const menuTab = document.createElement("div");
        menuTab.className = "baike_menu_tab";
        baikeHead.appendChild(menuTab);

        const allLink = document.createElement("a");
        allLink.className = "baike-more1 cur";
        allLink.textContent = "全部";

        menuTab.appendChild(allLink);

        // swiper 容器
        const swiperDiv = document.createElement("div");
        swiperDiv.className = "swiper mjSwiper2";
        swiperDiv.setAttribute("thumbsslider", "");
        swiperDiv.setAttribute("data-v-a692b834", "");

        const swiperWrapper = document.createElement("div");
        swiperWrapper.className = "swiper-wrapper";
        swiperWrapper.setAttribute("data-v-a692b834", "");

        // 势力
        const dynasties = ["西汉", "蜀汉", "曹魏", "魏", "东汉", "孙吴", "楚", "黄巾", "秦", "燕", "齐", "韩", "赵", "张楚", "西楚"];
        dynasties.forEach((name, idx) => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            slide.setAttribute("s", idx.toString());

            const link = document.createElement("a");
            link.className = "baike-more1";
            link.textContent = name;

            slide.appendChild(link);
            swiperWrapper.appendChild(slide);
        });

        const scrollbar = document.createElement("div");
        scrollbar.className = "swiper-scrollbar swiper-scrollbar-horizontal";

        const scrollbarDrag = document.createElement("div");
        scrollbarDrag.className = "swiper-scrollbar-drag";

        scrollbar.appendChild(scrollbarDrag);

        swiperDiv.appendChild(swiperWrapper);
        swiperDiv.appendChild(scrollbar);

        menuTab.appendChild(swiperDiv);


        // baike_search 搜索区域
        const searchDiv = document.createElement("div");
        searchDiv.className = "baike_search";

        const searchInput = document.createElement("input");
        searchInput.value = "";
        searchInput.type = "text";
        searchInput.placeholder = "输入人物名称";

        const searchBtn = document.createElement("a");
        searchBtn.className = "baike_search_btn";

        searchDiv.appendChild(searchInput);
        searchDiv.appendChild(searchBtn);

        baikeHead.appendChild(menuTab);
        baikeHead.appendChild(searchDiv);

        const baikeList = ui.create.div(".baike_list dhs", mjbklist);
        // 武将列表
        const characters = packs;
        for (let i in characters) {
            const baikeC = ui.create.div(".baike_character", baikeList);
            const div = document.createElement("div");
            const div22 = document.createElement("div");
            div22.className = "baike_character2";
            const node = document.createElement("div");
            node.className = "baike_character2";
            node.link = i;
            node.setBackground(i, "character");
            div22.appendChild(node);
            div.appendChild(div22);
            node.listen(function () {
                const audioList = get.character(this.link)?.enterAudios?.slice();
                if (audioList?.length) {
                    const audio = audioList.randomRemove();
                    game.playAudio(audio);
                }
                ui.click.charactercard(this.link, this);
            });
            node.classList.add("nodeintro");
            node.classList.add("character");
            lib.setIntro(node);
            const span = document.createElement("span");
            span.textContent = get.translation(i);
            div.appendChild(span);
            baikeC.appendChild(div);
        }

        mjbk_back.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function () {
            slidebg.delete();
        });
    };
    

    // 伙伴
    lib.init.css(lib.assetURL + "extension/名将杀/src/css", "buddy");
    ui.create.buddy = function() {
        let buddy = window.buddy || ui.create.div("#buddy", ui.window);
        window.buddy = buddy;
        buddy.style.setProperty("background-image", `url(${lib.assetURL}extension/名将杀/image/buddy/${game.getExtensionConfig("名将杀", "buddy")}/default.png)`);
        let transform = game.getExtensionConfig("名将杀", "buddy_transform");
        if (transform) {
            buddy.style.setProperty("left", transform[0]);
            buddy.style.setProperty("top", transform[1]);
        }
        const defaultBuddyImage = () => {
            return `url(${lib.assetURL}extension/名将杀/image/buddy/${game.getExtensionConfig("名将杀", "buddy")}/default.png)`;
        };
        const dragBuddyImage = () => {
            return `url(${lib.assetURL}extension/名将杀/image/buddy/${game.getExtensionConfig("名将杀", "buddy")}/drag.png)`;;
        };
        let originalBg;
        let OW, OH, ow, oh;
        let cilentW = document.getElementById("window").clientWidth;
        let cilentH = document.getElementById("window").clientHeight;
        if (lib.config.touchscreen) {
            buddy.addEventListener("touchstart", function (e) {
                buddy.classList.add("buddyDrag");
                originalBg = buddy.style.getPropertyValue("background-image") || defaultBuddyImage();
                buddy.style.setProperty("background-image", dragBuddyImage());
                OW = e.touches[0].clientX - buddy.offsetLeft;
                OH = e.touches[0].clientY - buddy.offsetTop;
                document.addEventListener("touchmove", defaultEvent, { passive: false });
            }, false)
            buddy.addEventListener("touchmove", function (e) {
                ow = buddy.style.left = Math.min(cilentW - buddy.clientWidth, Math.max(-buddy.clientWidth, parseInt(e.touches[0].clientX - OW))) + "px";
                oh = buddy.style.top = Math.min(cilentH - buddy.clientHeight, Math.max(-buddy.clientHeight, parseInt(e.touches[0].clientY - OH))) + "px";
            }, false)
            buddy.addEventListener("touchend", function () {
                buddy.classList.remove("buddyDrag");
                buddy.style.setProperty("background-image", originalBg);
                document.removeEventListener("touchmove", defaultEvent, { passive: false });
                game.saveExtensionConfig("名将杀", "buddy_transform", [ow, oh]);
            });
            function defaultEvent(e) {
                e.preventDefault()
            }
        } else {
            buddy.addEventListener("mousedown", function (e) {
                e.preventDefault();
                buddy.classList.add("buddyDrag");
                originalBg = buddy.style.getPropertyValue("background-image") || defaultBuddyImage();
                buddy.style.setProperty("background-image", dragBuddyImage());
                OW = e.clientX - buddy.offsetLeft;
                OH = e.clientY - buddy.offsetTop;
                document.addEventListener("mousemove", mousemove);
                document.addEventListener("mouseup", mouseup);
            });
            function mousemove(e) {
                ow = buddy.style.left = Math.min(cilentW - buddy.clientWidth, Math.max(-buddy.clientWidth, parseInt(e.clientX - OW))) + "px";
                oh = buddy.style.top = Math.min(cilentH - buddy.clientHeight, Math.max(-buddy.clientHeight, parseInt(e.clientY - OH))) + "px";
            }
            function mouseup() {
                buddy.classList.remove("buddyDrag");
                buddy.style.setProperty("background-image", originalBg);
                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mouseup", mouseup);
                game.saveExtensionConfig("名将杀", "buddy_transform", [ow, oh]);
            }
        }
    };
    if (lib.config["extension_名将杀_buddy"] != "off") {
        //ui.create.buddy();
    }

    // 销毁区与烧毁区
    _status.destroy = [];
    _status.burnDown = [];
    if (lib.commonArea) {
        lib.commonArea.set("destroy", {
            translate: "销毁牌",
            areaStatusName: "destroy",
            toName: "toDestroy",
            fromName: "fromDestroy",
            async addHandeler(event, trigger, player) {
                const { cards } = event;
                _status.destroy.addArray(
                    cards.filter(function (card) {
                        return !card.willBeDestroyed("destroy", null, event.relatedEvent);
                    })
                );
                game.broadcast(function (destroy) {
                    _status.destroy = destroy;
                }, _status.destroy);
            },
            async removeHandeler(event, trigger, player) {
                const { cards } = event;
                _status.destroy.removeArray(cards);
                game.broadcast(function (destroy) {
                    _status.destroy = destroy;
                }, _status.destroy);
            }
        });
        lib.commonArea.set("burnDown", {
            translate: "烧毁牌",
            areaStatusName: "burnDown",
            toName: "toBurnDown",
            fromName: "fromBurnDown",
            async addHandeler(event, trigger, player) {
                const { cards } = event;
                _status.burnDown.addArray(
                    cards.filter(function (card) {
                        return !card.willBeDestroyed("burnDown", null, event.relatedEvent);
                    })
                );
                game.broadcast(function (burnDown) {
                    _status.burnDown = burnDown;
                }, _status.burnDown);
            },
            async removeHandeler(event, trigger, player) {
                const { cards } = event;
                _status.burnDown.removeArray(cards);
                game.broadcast(function (burnDown) {
                    _status.burnDown = burnDown;
                }, _status.burnDown);
            }
        });
    }

    // 卡牌转化属性
    const origin_card_init = lib.element.Card.prototype.init;
    game.origin_card_init = origin_card_init;
    lib.element.Card.prototype.init = function (card) {
        const result = origin_card_init.call(this, card);
        if (get.itemtype(result) == "card") {
            if (!result.converted) {
                result.converted = true;
            } else {
                result.addGaintag("eternal_mjs_converted");
            }
            if (_status._mjs_shaNature) {
                if (result.name == "sha") {
                    if (result.suit == "heart") {
                        //game.setNature(result, "fire");
                        card[3] = "fire";
                        //result.$init(card);
                        result.$init([result.suit, result.number, result.name, "fire"]);
                    } else if (result.suit == "diamond" && result.number == 4) {
                        //game.setNature(result, "thunder");
                        card[3] = "thunder";
                        //result.$init(card);
                        result.$init([result.suit, result.number, result.name, "thunder"]);
                    }
                }
            }
        }
        return result;
    };
    
    // 卡牌专属配音
    const original_playCardAudio = game.playCardAudio;
    game.original_playCardAudio = original_playCardAudio;
    game.playCardAudio = function (card, sex) {
        // 名将的卡牌语音男女老少甚至太监都有，很精彩
        if (typeof card === "string") {
            card = { name: card };
        }
        if (card.name.startsWith("mjs")) {
            if (get.itemtype(sex) === "player") {
                if (!lib.config.background_audio || get.type(card) == "equip" && !lib.config.equip_audio) {
                    return;
                }
                if (lib.card[card.name].cardAudio) {
                    const cardaudio = lib.card[card.name].cardAudio[sex.name];
                    if (cardaudio) {
                        game.playAudio(cardaudio);
                        return;
                    }
                }
                sex = sex.sex == "female" ? "female" : "male";
            }else if (typeof sex == "string") {
                sex = sex == "female" ? "female" : "male";
            }
            game.playAudio(`ext:名将杀/audio/card/${sex}/${card.name}.mp3`);
            return;
        }
        return original_playCardAudio.apply(this, arguments);
    };

    // 名将牌堆
    if (lib.config["extension_名将杀_cardPile"]) {
        lib.card.list = [];
        lib.card.list = cardPile;
        lib.card.list.randomSort();
        const list = ["sha", "shan", "tao", "jiu", "shunshou"];
        for (const name of list) {
            if (!lib.card[name]) {
                continue;
            }
            lib.card[name].image = `ext:名将杀/image/card/${name}.png`;
        }
    }

    // 胜利结算
    /*lib.onover.push(
        result => {
            if (result === true && game.me && get.character(game.me.name)?.victoryAudios?.length) {
                const audioList = get.character(game.me.name).victoryAudios.slice();
                const audio = audioList.randomRemove();
                game.playAudio(audio);
            }
        }
    );*/
    
    //手牌上限变化
    lib.element.player.inits = []
        .concat(lib.element.player.inits || [])
        .concat(function maxHandcardSet(player) {
            player.setStorage("maxHandcard", player.getHandcardLimit());
        });
    /*lib.element.player.updates = []
        .concat(lib.element.player.updates || [])
        .concat(function maxHandcardUpdate(player) {
            const max = player.storage.maxHandcard;
            if (max != player.getHandcardLimit()) {
                const next = game.createEvent("maxHandcardChange");
                next.player = player;
                next.setContent("emptyEvent");
            }
            player.setStorage("maxHandcard", player.getHandcardLimit());
        });*/
    const createInteraction = () => {
        lib.init.css(lib.assetURL + "extension/名将杀/src/css", "interaction");

        const interaction = ui.create.div(".mj-interaction", ui.window);
        const Sort = () => {
            if (!game.me) {
                return;
            }
            const sort = _status.tempHandcardSort;
            game.me.sortHandcardOL(sort);
        };

        const Chat = () => {
            let shuru = null;
            const container = ui.create.div(".popup-container", ui.window, e => {
                if (e.target === container) {
                    container.hide();
                    if (shuru) {
                        shuru.value = "";
                        shuru.style.display = "none";
                    }
                }
            });
            const bg = ui.create.div(".mj-chatbg", container);
            const searchDiv = document.createElement("div");
            searchDiv.className = "chat_search";

            const searchInput = document.createElement("input");
            searchInput.value = "";
            searchInput.type = "text";
            searchInput.placeholder = "每3秒可以发言一次，请友善发言";



            const searchBtn = document.createElement("a");
            searchBtn.className = "chat_search_btn";

            function sendSelfMessage(name, text) {

            };

            searchInput.addEventListener("click", () => {
                sendSelfMessage(searchInput.value);
                searchInput.value = "";
            });

            searchBtn.addEventListener("click", () => {
                if (e.key === "Enter") {
                    searchInput.click();
                }
            });

            searchDiv.appendChild(searchInput);
            searchDiv.appendChild(searchBtn);

            bg.appendChild(searchDiv);
            
        };
        const sort = ui.create.div(".mj-interac", interaction, "整理", Sort);
        const dist = ui.create.div(".mj-interac", interaction, "距离");
        const chat = ui.create.div(".mj-interac", interaction, "聊天", Chat);
        const gift = ui.create.div(".mj-interac", interaction, "礼物");
    };

    // 轮次
    if (lib.config["extension_名将杀_phaseLoop"]) {
        // 可以直接改phaseLoop + phase
        /*lib.element.content.phaseLoop = async (event, trigger, player) => {
            if (!_status._mjs_phaseLoop?.length) {
                _status._mjs_phaseLoop = game.filterPlayer().sortBySeat();
            }
            let num = 1,
                current = player;
            while (current.getSeatNum() === 0) {
                current.setSeatNum(num);
                current = current.next;
                num++;
            }
            while (true) {
                if (game.players.includes(event.player)) {
                    lib.onphase.forEach(i => i());
                    const phase = event.player.phase();
                    event.next.remove(phase);
                    let isRoundEnd = false;
                    if (lib.onround.every(i => i(phase, event.player))) {
                        isRoundEnd = _status.roundSkipped;
                        if (_status.isRoundFilter) {
                            isRoundEnd = _status.isRoundFilter(phase, event.player);
                        } else if (_status.seatNumSettled) {
                            const seatNum = event.player.getSeatNum();
                            if (seatNum != 0) {
                                if (get.itemtype(_status.lastPhasedPlayer) != "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
                                    isRoundEnd = true;
                                }
                            }
                        } else if (event.player == _status.roundStart) {
                            isRoundEnd = true;
                        }
                        if (isRoundEnd && _status.globalHistory.some(i => i.isRound)) {
                            game.log();
                            await event.trigger("roundEnd");
                        }
                    }
                    event.next.push(phase);
                    await phase;
                }
                await event.trigger("phaseOver");
                let findNext = current => {
                    let targets = game.filterPlayer(target => {
                        return !_status._mjs_phaseLoop.includes(target);
                    });
                    let players = _status._mjs_phaseLoop;
                    if (targets.length) {
                        players.addArray(targets);
                    }
                    let position = players.indexOf(current);
                    for (let i = 0; i < players.length; i++) {
                        if (players.indexOf(players[i]) > position) {
                            return players[i];
                        }
                    }
                    return players[0];
                };
                event.player = findNext(event.player);
            }
        };
        lib.element.content.phase = function () {};*/
        Object.assign(lib.skill, {
            _mjs_phaseLoop: {
                trigger: {
                    player: ["phaseBefore", "phaseAfter"],
                },
                silent: true,
                charlotte: true,
                ruleSkill: true,
                forceDie: true,
                forceOut: true,
                async content(event, trigger, player) {
                    if (event.triggername == "phaseBefore") {
                        if (!_status._mjs_phaseLoop) {
                            _status._mjs_phaseLoop = game.filterPlayer().sortBySeat();
                        }
                        player
                            .when("phaseBeforeStart")
                            .filter(evt => evt._roundStart)
                            .then(() => {
                                _status._mjs_phaseLoop = game.filterPlayer().sortBySeat();
                            });
                        _status.isRoundFilter = (phase, player) => {
                            return _status._mjs_phaseLoop[0] == player;
                        };
                    } else if (event.triggername == "phaseAfter") {
                        _status.isRoundFilter = (phase, player) => {
                            return _status._mjs_phaseLoop.slice(0).reverse()[0] == player;
                        };
                    }
                },
                onRound(event) {
                    return event.getParent().skill != "_mjs_phaseLoop_phase" && (event.relatedEvent || event.getParent(2)).name != "_mjs_phaseLoop_phase";
                },
                getPhases() {
                    let evts = game.getAllGlobalHistory("everything", evt => evt.name == "phase");
                    const evt = evts.slice(0).reverse().find(evt => evt._roundStart);
                    if (evt) {
                        evts = evts.slice(evts.indexOf(evt));
                    }
                    return evts.filter(evt => !evt._cancelled && !evt._finished);
                },
                checkx(source, player) {
                    const players = _status._mjs_phaseLoop;
                    const num = players.indexOf(source),
                        num2 = players.indexOf(player);
                    return num2 - num == 1 || (num == players.length - 1 && num2 == 0);
                },
                subSkill: {
                    phase: {
                        trigger: {
                            global: "phaseOver",
                        },
                        silent: true,
                        charlotte: true,
                        ruleSkill: true,
                        filter(event, player) {
                            if (player.hasSkill("mjs_phaseLoop_skip")) {
                                return false;
                            }
                            const evts = get.info("_mjs_phaseLoop").getPhases();
                            if (evts.some(evt => evt.player == player)) {
                                return false;
                            }
                            return get.info("_mjs_phaseLoop").checkx(event.player, player);
                        },
                        content() {
                            player.addTempSkill("mjs_phaseLoop_skip", "roundStart");
                            const next = player.insertPhase();
                            delete next.skill;
                            next.phaseList = trigger.phaseList;
                            next.relatedEvent = trigger.relatedEvent || trigger.getParent(2);
                            next._mjs_phaseLoop_phase = true;
                            next.pushHandler("_mjs_phaseLoop_phase", (event, option) => {
                                if (event.step === 0 && option.state === "begin") {
                                    event.step = 4;
                                    _status.globalHistory.push({
                                        cardMove: [],
                                        custom: [],
                                        useCard: [],
                                        changeHp: [],
                                        everything: [],
                                    });
                                    var players = game.players.slice(0).concat(game.dead);
                                    for (var i = 0; i < players.length; i++) {
                                        var current = players[i];
                                        current.actionHistory.push({
                                            useCard: [],
                                            respond: [],
                                            skipped: [],
                                            lose: [],
                                            gain: [],
                                            sourceDamage: [],
                                            damage: [],
                                            custom: [],
                                            useSkill: [],
                                        });
                                        current.stat.push({ card: {}, skill: {} });
                                    }
                                }
                            });
                        },
                    },
                },
            },
            mjs_phaseLoop_skip: {
                trigger: {
                    player: "phaseBefore",
                },
                silent: true,
                charlotte: true,
                ruleSkill: true,
                onremove: true,
                filter(event, player) {
                    return !event.skill && !event._mjs_phaseLoop_phase;
                },
                async content(event, trigger, player) {
                    trigger.cancel();
                },
            },
        });
    }
    // 出杀次数显示
    if (lib.config["extension_名将杀_getShaUsable"]) {
        /*lib.element.player.updates = []
            .concat(lib.element.player.updates || [])
            .concat(player => {
                if (player.isPhaseUsing()) {
                    var num = player.getCardUsable("sha");
                    if (num >= 114514) num = "∞";
                    player.node.getShaUsable.innerHTML = num.toString();
                }
            });*/
        lib.element.player.inits = []
            .concat(lib.element.player.inits || [])
            .concat(player => {
                if (!player.node?.getShaUsable) {
                    player.node.getShaUsable = ui.create.div(".getShaUsable", player);
                }
                player.node.getShaUsable.hide();
            });
        lib.skill._mjs_getShaUsable = {
            trigger: {
                player: "phaseUseBegin",
            },
            popup: false,
            forced: true,
            firstDo: true,
            charlotte: true,
            async content(event, trigger, player) {
                var num = player.getCardUsable("sha");
                if (num >= 114514) num = "∞";
                player.node.getShaUsable.innerHTML = num.toString();
                player.node.getShaUsable.show();
                player
                    .when({ global: "phaseAny" })
                    .step(async (event, trigger, player) => {
                        player.node.getShaUsable.hide();
                    });
            },
        };
    }
    //手牌可视
    game.viewHandcardUptate = player => {
        if (!lib.config["extension_名将杀_UI"]) {
            return;
        }
        game.broadcast(
            player => {
                const me = game.me;
                if (!player.node?.viewHandcard) {
                    player.node.viewHandcard = ui.create.div(".viewHandcard", player.node.avater, () => {
                        const cards = player.getCards("h", card => {
                            return player.isUnderControl() || (me && me.hasSkillTag("viewHandcard", null, player, true));
                        });
                        if (!cards.length) {
                            player.node?.viewHandcard?.hide();
                            return;
                        }
                        function createDialogWithControl(result) {
                            const dialog = ui.create.dialog(`${get.translation(player)}的手牌`, "peaceDialog");
                            dialog.add(result, true);
                            const control = ui.create.control("确定", () => dialog.close());
                            dialog._close = dialog.close;
                            dialog.hide = dialog.close = function (...args) {
                                control.close();
                                return dialog._close(...args);
                            };
                            if (_status.olsbzhitian_clickable) {
                                _status.olsbzhitian_clickable.close();
                            }
                            _status.olsbzhitian_clickable = dialog;
                            dialog.open();
                        }
                        if (cards instanceof Promise) {
                            cards.then(([ok, result]) => createDialogWithControl(result));
                        } else {
                            createDialogWithControl(cards);
                        }
                    });
                    player.appendChild(player.node.viewHandcard);
                }
                const cards = player.getCards("h", card => {
                    return player.isUnderControl() || (me && me.hasSkillTag("viewHandcard", null, player, true));
                });
                if (!cards.length) {
                    player.node?.viewHandcard?.hide();
                    return;
                }
                if (!_status.gameStarted) {
                    player.node.viewHandcard.hide();
                }
                const rect = player.node.avatar.getBoundingClientRect();
                if (rect.left <= 50) {
                    player.node.viewHandcard.classList.add("viewHandcard-rigth");
                }
            },
            player
        );
        const me = game.me;
        if (!player.node?.viewHandcard) {
            player.node.viewHandcard = ui.create.div(".viewHandcard", player.node.avater, () => {
                const cards = player.getCards("h", card => {
                    return player.isUnderControl() || (me && me.hasSkillTag("viewHandcard", null, player, true));
                });
                if (!cards.length) {
                    player.node?.viewHandcard?.hide();
                    return;
                }
                function createDialogWithControl(result) {
                    const dialog = ui.create.dialog(`${get.translation(player)}的手牌`, "peaceDialog");
                    dialog.add(result, true);
                    const control = ui.create.control("确定", () => dialog.close());
                    dialog._close = dialog.close;
                    dialog.hide = dialog.close = function (...args) {
                        control.close();
                        return dialog._close(...args);
                    };
                    if (_status.olsbzhitian_clickable) {
                        _status.olsbzhitian_clickable.close();
                    }
                    _status.olsbzhitian_clickable = dialog;
                    dialog.open();
                }
                if (cards instanceof Promise) {
                    cards.then(([ok, result]) => createDialogWithControl(result));
                } else {
                    createDialogWithControl(cards);
                }
            });
            player.appendChild(player.node.viewHandcard);
        }
        const cards = player.getCards("h", card => {
            return player.isUnderControl() || (me && me.hasSkillTag("viewHandcard", null, player, true));
        });
        if (!cards.length) {
            player.node?.viewHandcard?.hide();
            return;
        }
        if (!_status.gameStarted) {
            player.node.viewHandcard.hide();
        }
        const rect = player.node.avatar.getBoundingClientRect()
        player.node.viewHandcard?.classList.toggle("viewHandcard-rigth", rect.left <= 50);
        player.node.viewHandcard?.show();
        const nameList = cards.reduce((list, card) => {
            list.push(get.translation(card.name).slice(0, 2));
            return list;
        }, []);
        player.node.viewHandcard?.replaceChildren();
        for (const name of nameList) {
            const view = ui.create.div(".viewHandcard-card", player.node.viewHandcard, name);
            player.node.viewHandcard?.appendChild(view);
        }
    };
    //座次
    game.setSeatNumberOfPlayer = player => {
        if (!lib.config["extension_名将杀_UI"]) {
            return;
        }
        game.broadcast(
            player => {
                if (!player.node?.seatNumber) {
                    player.node.seatNumber = ui.create.div(".seatNumber", player.node.avater);
                    player.appendChild(player.node.seatNumber);
                }
                if (player.getSeatNum() == 0) {
                    player.node.seatNumber.hide();
                    return;
                }
                player.node.seatNumber.show();
                player.node.seatNumber.innerHTML = get.cnNumber(player.getSeatNum(), true);
            },
            player
        );
        if (!player.node?.seatNumber) {
            player.node.seatNumber = ui.create.div(".seatNumber", player.node.avater);
            player.appendChild(player.node.seatNumber);
        }
        if (player.getSeatNum() == 0) {
            player.node.seatNumber.hide();
            return;
        }
        player.node.seatNumber.show();
        player.node.seatNumber.innerHTML = get.cnNumber(player.getSeatNum(), true);
    };
    // 名将UI
    if (lib.config["extension_名将杀_UI"]) {}
}
