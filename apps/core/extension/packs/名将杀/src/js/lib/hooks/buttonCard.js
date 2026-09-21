import { lib, game, ui, get, ai, _status } from "noname";

const hooks = {
    checkCard: [
        function buttonCard(card, event) {
            var player = get.player();
            //if (!event.buttonCards) event.buttonCards = [];
            var selected = ui.selected.cards;
            for (const cardx of selected) {
                if (cardx._realid) {
                    cardx.classList.add("selected");
                    cardx.updateTransform(true, 100);
                    if (selected.includes(cardx._realid)) {
                        selected.remove(cardx._realid);
                    }
                    selected[selected.indexOf(cardx)] = cardx._realid;
                }
            }
            if (!event.filterCard(card, player, event)) return;
            if (["h", "s"].includes(get.position(card))) {
                return;
            }
            if (player.hasCard(cardx => cardx._realid == card, "hs")) {
                return;
            }
            if (player.countCards("h", cardx => cardx._realid == card)) return;
            var cardx = ui.create.card();
            cardx.isFake = true;
            cardx._realid = card;
            cardx.init(card);
            cardx.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
                var custom = _status.event.custom;
                if (typeof custom?.replace?.card  == "function") {
                    custom.replace.card (this._realid);
                    return;
                }
                if (!_status.event.isMine()) {
                    return;
                }
                if (this.classList.contains("selectable") == false) {
                    return;
                }
                if (this.classList.contains("selected")) {
                    ui.selected.cards.remove(this);
                    ui.selected.cards.add(this._realid);
                } else {
                    ui.selected.cards.remove(this._realid);
                    //this._realid.updateTransform();
                }
                if (typeof custom?.add?.button == "function") {
                    custom.add.card();
                }
                game.check();
            });            
            cardx.classList.add("selectable");
            cardx.classList.add("glow");
            game.broadcastAll((cardx2) => {
                cardx2.classList.add("selectable");
                cardx2.classList.add("glow");
            }, cardx);
            if (get.is.singleHandcard()) {
                player.node.handcards1.appendChild(cardx);
            } else {
                player.node.handcards2.appendChild(cardx);
            }
            if (player == game.me || _status.video) {
                ui.updatehl();
            }
        },
    ],
    uncheckCard: [
        function buttonCard(card, event) {
            if (card._realid) {
                card.remove();
                card.fix();
                if (event.player == game.me || _status.video) {
                    ui.updatehl();
                }
            }
            delete event._buttonCard;
            //delete event.buttonCards;
        },
    ],
    checkBegin: [
        function buttonCard(event) {
            if (!["chooseButton", "chooseButtonTarget"].includes(event.name)) {
                return;
            }
            var player = event.player;
            if (!player?.node) return;
            var range = event.selectButton;
            if (!Array.isArray(range)) {
                range = [range, range];
            }
            var cards;
            if (get.is.singleHandcard()) {
                cards = player.node.handcards1._childNodesWatcher.childNodes;
            } else {
                cards = player.node.handcards2._childNodesWatcher.childNodes;
            }
            cards = cards.filter(card => card._realid);
            for (var card of cards) {
                if ((() => {
                    if (ui.selected.buttons.includes(card._realid)) return false;
                    if (ui.selected.buttons.length >= range[1]) return true;
                    return !event.filterButton(card._realid, player);
                })()) {
                    card.classList.remove("selectable");
                } else {
                    card.classList.add("selectable")
                }
            }
            if (event._buttonCard) {
                return;
            }
            if ((() => {
                var dialog = get.idDialog(event.dialog) || event.dialog || (Array.isArray(event.createDialog) ? 0 : ui.dialog);
                var bool = true;
                if (!dialog || dialog.buttons?.length > 25) return false;
                if (dialog.videoId !== undefined || _status.dieClose?.includes(dialog)) return false;
                if (dialog.querySelectorAll(".buttons")?.length > 1) {
                    return false;
                }
                return dialog.buttons.every(button => {
                    if (!button.innerText) return false;
                    return get.itemtype(button.link) == (Array.isArray(button) ? "cards" : "card");
                });
            })()) {
                event._buttonCard = true;
                //if (!event.buttonCards) event.buttonCards = [];
                var evt = event.parent;
                var dialog = get.idDialog(event.dialog) || event.dialog || (Array.isArray(event.createDialog) ? 0 : ui.dialog);
                var skill = event.skill || evt.skill || evt.result?.skill || evt.name;
                var buttons = dialog.buttons.filter(button => {
                    return get.itemtype(button.link) == (Array.isArray(button) ? "cards" : "card");
                });
                //if (event.buttonCards?.length && event.buttonCards.every(info => event.buttonCards.includes(info))) return;
                if (!buttons.length) return;
                var hs = player.getCards("hs");
                buttons = buttons.reverse();
                event.hiddenCards = hs;
                hs.forEach(card => card.classList.add("removing"));
                //event.buttonCards.addArray(buttons);
                event.dialog.classList.add("forcehide");

                var description = event.dialog?._args?.length ? event.dialog._args.filter(arg => typeof arg == "string")[0] : get.prompt(skill);
                event.skillInfoDialog = ui.create.dialog(description);

                for (const button of buttons) {
                    var card = ui.create.card();
                    card.isFake = true;
                    card._realid = button;
                    card.button = button;
                    card.link = button.link;
                    card.init(button.link);
                    card.addGaintag(button.link.gaintag);
                    if (get.is.singleHandcard()) {
                        player.node.handcards1.appendChild(card);
                    } else {
                        player.node.handcards2.appendChild(card);
                    }

                    //chooseButtonTarget
                    card.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
                        var custom = _status.event.custom;
                        if (typeof custom?.replace?.button == "function") {
                            custom.replace.button(this.button);
                            return;
                        }
                        if (!_status.event.isMine()) {
                            return;
                        }
                        if (this.classList.contains("selectable") == false) {
                            return;
                        }
                        if (this.classList.contains("selected")) {
                            ui.selected.buttons.add(this.button);
                        } else {
                            ui.selected.buttons.remove(this.button);
                        }
                        if (typeof custom?.add?.button == "function") {
                            custom.add.button();
                        }
                        game.check();
                    });
                    
                    const eles = Array.from(button.link.classList);
                    for (const ele of eles) {
                        if (ele == "removing") {
                            continue;
                        }
                        card.classList.add(ele);
                    }
                    if (!event.filterButton(button, player)) continue;
                    card.classList.add("selectable");
                }

                if (player == game.me || _status.video) {
                    ui.updatehl();
                }
            }
        },
    ],
    uncheckButton: [
        function buttonCard(button, event) {
            var { player } = event;
            if (event.skillInfoDialog) {
                event.skillInfoDialog.remove();
            }
            var cards = event.hiddenCards;
            if (!cards?.length) {
                return;
            }
            cards.forEach(card => card.classList.remove("removing"));
            if (event.player == game.me || _status.video) {
                ui.updatehl();
            }
        }
    ],
    /*uncheckEnd: [
        // => uncheckButton
        function buttonCard(event) {
            if (!event.hiddenCards?.length) return;
            event.hiddenCards.forEach(card => card.classList.remove("removing"));
            if (event.player == game.me || _status.video) {
                ui.updatehl();
            }
        }
    ],*/
};
const checkButton = {};
if (lib.config["extension_名将杀_chooseCardPopup"]) {
    Object.assign(checkButton, hooks);
}
export default checkButton;

