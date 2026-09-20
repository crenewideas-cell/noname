import { menuContainer, popupContainer, updateActive, setUpdateActive, updateActiveCard, setUpdateActiveCard, menux, menuxpages, menuUpdates, openMenu, clickToggle, clickSwitcher, clickContainer, clickMenuItem, createMenu, createConfig } from "../index.js";
import { ui, game, get, ai, lib, _status } from "noname";

export const cardPackMenu = function (connectMenu, context) {
	/**
	 * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
	 */
	// const cacheMenuContainer = menuContainer;
	// const cachePopupContainer = popupContainer;
	const cacheMenux = context?.menux || menux;
	const cacheMenuxpages = context?.menuxpages || menuxpages;
	/** @type { HTMLDivElement } */
	// @ts-expect-error ignore
	var start = cacheMenuxpages.shift();
	var rightPane = start.lastChild;
	lib.config.customcardpile ||= {};
	lib.config.bannedpile ||= {};
	lib.config.addedpile ||= {};
	var pileCreated = false;
	var recreatePile = function () {
		lib.config.customcardpile["当前牌堆"] = get.copy([lib.config.bannedpile, lib.config.addedpile]);
		game.saveConfig("customcardpile", lib.config.customcardpile);
		game.saveConfig("cardpilename", "当前牌堆", true);
		pileCreated = false;
	};
	const loadEditingPile = () => {
		const pile = lib.config.customcardpile[get.config("cardpilename") || "当前牌堆"];
		lib.config.bannedpile = get.copy(pile?.[0] || {});
		lib.config.addedpile = get.copy(pile?.[1] || {});
		// A changed deck must rebuild cached pack editors with its own checkboxes.
		for (const node of start.firstChild.children) {
			if (!node._initLink) continue;
			node.link?.remove();
			delete node.link;
		}
	};

	var clickMode = function () {
		var active = this.parentNode.querySelector(".active");
		if (active === this) {
			return;
		}
		active?.classList.remove("active");
		active?.link?.remove();
		rightPane.querySelector(":scope > .menu-preparing")?.remove();
		active = this;
		this.classList.add("active");
		updateActiveCard(this);
		if (this.mode == "cardpile") {
			this.create();
		}
		if (this.link) {
			rightPane.appendChild(this.link);
		} else {
			this._initLink();
			rightPane.appendChild(this.link);
		}
	};
	const updateActiveCard = function (node) {
		if (!node) {
			node = start.firstChild.querySelector(".active");
			if (!node) {
				return;
			}
		}
		if (!node.link) {
			node._initLink();
		}
		for (var i = 0; i < node.link.childElementCount; i++) {
			if (node.link.childNodes[i].updateBanned) {
				node.link.childNodes[i].updateBanned();
			}
		}
	};
	setUpdateActiveCard(updateActiveCard);
	var updateNodes = function () {
		for (var i = 0; i < start.firstChild.childNodes.length; i++) {
			var node = start.firstChild.childNodes[i];
			if (node.mode) {
				if (node.mode.startsWith("mode_")) {
					// 扩展卡牌包开启逻辑
					if (node.mode.startsWith("mode_extension")) {
						const extName = node.mode.slice(15);
						if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) {
							continue;
						}
						if (lib.config[`extension_${extName}_cards_enable`] == true) {
							node.classList.remove("off");
							node.link?.firstChild?.classList.add("on");
						} else {
							node.classList.add("off");
							if (node.link) {
								node.link.firstChild.classList.remove("on");
							}
						}
					}
					continue;
				}
				if (node.mode == "custom") {
					continue;
				}
				if (node.mode == "cardpile") {
					continue;
				}
				if (connectMenu) {
					if (!lib.config.connect_cards.includes(node.mode)) {
						node.classList.remove("off");
						if (node.link) {
							node.link.firstChild.classList.add("on");
						}
					} else {
						node.classList.add("off");
						if (node.link) {
							node.link.firstChild.classList.remove("on");
						}
					}
				} else {
					if (lib.config.cards.includes(node.mode)) {
						node.classList.remove("off");
						if (node.link) {
							node.link.firstChild.classList.add("on");
						}
					} else {
						node.classList.add("off");
						if (node.link) {
							node.link.firstChild.classList.remove("on");
						}
					}
				}
			}
		}
	};
	var togglePack = function (bool) {
		var name = this._link.config._name;
		// 扩展卡牌包开启逻辑
		if (name.startsWith("mode_extension")) {
			const extName = name.slice(15);
			if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) {
				return false;
			}
			game.saveExtensionConfig(extName, "cards_enable", bool);
		}
		// 原逻辑
		else {
			if (connectMenu) {
				if (!bool) {
					lib.config.connect_cards.add(name);
				} else {
					lib.config.connect_cards.remove(name);
				}
				game.saveConfig("connect_cards", lib.config.connect_cards);
			} else {
				if (bool) {
					lib.config.cards.add(name);
				} else {
					lib.config.cards.remove(name);
				}
				game.saveConfig("cards", lib.config.cards);
			}
		}
		updateNodes();
	};
	var toggleCardPile = function (bool) {
		var name = this._link.config._name;
		var number = this._link.config._number;
		if (!lib.config.bannedpile[name]) {
			lib.config.bannedpile[name] = [];
		}
		if (bool) {
			lib.config.bannedpile[name].remove(number);
		} else {
			lib.config.bannedpile[name].add(number);
		}
		recreatePile();
	};

	var createModeConfig = function (mode, position) {
		var info = lib.cardPack[mode] || [];
		let cardPack = lib.cardPackInfo[mode];
		if (!lib.cardPile[mode] && cardPack && cardPack.list && Array.isArray(cardPack.list)) {
			lib.cardPile[mode] = get.copy(cardPack.list);
		}
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", lib.translate[mode + "_card_config"] || mode, position, clickMode);
		if (node.innerHTML.length >= 5) {
			node.classList.add("smallfont");
		}
		node.mode = mode;
		node._initLink = function () {
			ui.create.cancelButtonPreparation(page);
			page.replaceChildren();
			info = lib.cardPack[mode] || info;
			cardPack = lib.cardPackInfo[mode];
			node.link = page;
			var list = [];
			for (var i = 0; i < info.length; i++) {
				if (!lib.card[info[i]]) {
					continue;
				}
				list.push([get.translation(get.type(info[i], "trick")), "", info[i]]);
			}
			var sortCard = function (card) {
				var type = lib.card[card[2]].type;
				var subtype = lib.card[card[2]].subtype;
				if (lib.cardType[subtype]) {
					return lib.cardType[subtype];
				}
				if (lib.cardType[type]) {
					return lib.cardType[type];
				}
				switch (type) {
					case "basic":
						return 0;
					case "chess":
						return 1.5;
					case "trick":
						return 2;
					case "delay":
						return 3;
					case "equip": {
						switch (lib.card[card[2]].subtype) {
							case "equip1":
								return 4.1;
							case "equip2":
								return 4.2;
							case "equip3":
								return 4.3;
							case "equip4":
								return 4.4;
							case "equip5":
								return 4.5;
							default:
								return 4;
						}
					}
					case "zhenfa":
						return 5;
					default:
						return 6;
				}
			};
			list.sort(function (a, b) {
				var sort1 = sortCard(a);
				var sort2 = sortCard(b);
				if (sort1 == sort2) {
					return b[2] < a[2] ? 1 : -1;
				} else if (sort1 > sort2) {
					return 1;
				} else {
					return -1;
				}
			});
			var cfgnode = createConfig({
				name: "开启",
				_name: mode,
				init: (() => {
					if (connectMenu) return !lib.config.connect_cards.includes(mode);
					// 扩展卡牌包开启逻辑
					if (mode.startsWith("mode_extension")) {
						const extName = mode.slice(15);
						if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) {
							return false;
						}
						// 这块或许应该在加载扩展时候写
						if (lib.config[`extension_${extName}_cards_enable`] === undefined) {
							game.saveExtensionConfig(extName, "cards_enable", true);
						}
						return lib.config[`extension_${extName}_cards_enable`] === true;
					}
					// 原逻辑
					else {
						return lib.config.cards.includes(mode);
					}
				})(),
				onclick: togglePack,
			});
			if (!mode.startsWith("mode_") || (cardPack && cardPack.closeable)) {
				page.appendChild(cfgnode);
			} else {
				page.style.paddingTop = "8px";
			}
			if (lib.translate[mode + "_cardsInfo"]) {
				var modeTranslation = "<p style=\"padding-left: 2em;\">" + lib.translate[mode + "_cardsInfo"] + "</p>";
				page.insertAdjacentHTML('beforeend', modeTranslation);
			}
			var banCard = function (e) {
				if (_status.clicked) {
					_status.clicked = false;
					return;
				}
				if (mode.startsWith("mode_") && !mode.startsWith("mode_extension_") && mode != "mode_banned") {
					return;
				}
				ui.click.touchpop();
				this._banning = connectMenu ? "online" : "offline";
				ui.click.intro.call(this, e);
				_status.clicked = false;
				delete this._banning;
			};
			var updateBanned = function () {
				var list;
				if (connectMenu) {
					var mode = cacheMenux.pages[0].firstChild.querySelector(".active");
					if (mode && mode.mode) {
						list = lib.config["connect_" + mode.mode + "_bannedcards"];
					}
				} else {
					list = lib.config[get.mode() + "_bannedcards"];
				}
				if (list && list.includes(this.link[2])) {
					this.classList.add("banned");
				} else {
					this.classList.remove("banned");
				}
			};
			var buttons = ui.create.buttons(list, "vcard", page);
			for (var i = 0; i < buttons.length; i++) {
				buttons[i].classList.add("noclick");
				buttons[i].listen(banCard);
				if (mode != "mode_banned") {
					buttons[i].updateBanned = updateBanned;
				}
			}
			page.classList.add("menu-buttons");
			page.classList.add("leftbutton");
			if (!connectMenu && !lib.config.all.sgscards.includes(mode) && !mode.startsWith("mode_")) {
				ui.create.div(".config.pointerspan", "<span>隐藏卡牌包</span>", page, function () {
					if (this.firstChild.innerHTML == "隐藏卡牌包") {
						this.firstChild.innerHTML = "卡牌包将在重启后隐藏";
						lib.config.hiddenCardPack.add(mode);
						if (!lib.config.prompt_hidepack) {
							alert("隐藏的扩展包可通过选项-其它-重置隐藏内容恢复");
							game.saveConfig("prompt_hidepack", true);
						}
					} else {
						this.firstChild.innerHTML = "隐藏卡牌包";
						lib.config.hiddenCardPack.remove(mode);
					}
					game.saveConfig("hiddenCardPack", lib.config.hiddenCardPack);
				});
			}
			if (!connectMenu && (!mode.startsWith("mode_") || (cardPack && cardPack.closeable)) && lib.cardPile[mode]) {
				var cardpileNodes = [];
				var cardpileexpanded = false;
				const setDefaultCards = enabled => {
					const banned = lib.config.bannedpile[mode];
					for (const node of cardpileNodes) {
						if (node.type !== "defaultcards") continue;
						const index = node._link.config._number;
						if (enabled) banned.remove(index);
						else banned.add(index);
						node.classList.toggle("on", enabled);
					}
					// One snapshot/write for the whole deck, not one per physical card.
					recreatePile();
				};
				if (!lib.config.bannedpile[mode]) {
					lib.config.bannedpile[mode] = [];
				}
				if (!lib.config.addedpile[mode]) {
					lib.config.addedpile[mode] = [];
				}
				ui.create.div(".config.more.pile", "编辑牌堆 <div>&gt;</div>", page, function () {
					if (cardpileexpanded) {
						this.classList.remove("on");
						for (var k = 0; k < cardpileNodes.length; k++) {
							cardpileNodes[k].style.display = "none";
						}
					} else {
						this.classList.add("on");
						for (var k = 0; k < cardpileNodes.length; k++) {
							cardpileNodes[k].style.display = "";
						}
					}
					cardpileexpanded = !cardpileexpanded;
				});
				var cfgnode = ui.create.div(page, ".config.pointerspan.cardpilecfg.toggle");
				var cfgaddcard = ui.create.node("button", "", "添加卡牌", cfgnode, function () {
					this.parentNode.nextSibling.classList.toggle("hidden");
				});
				var cfgbancard = ui.create.node("button", "", "全部关闭", cfgnode, function () {
					setDefaultCards(false);
				});
				var cfgenablecard = ui.create.node("button", "", "全部开启", cfgnode, function () {
					setDefaultCards(true);
				});
				cfgbancard.style.marginLeft = "5px";
				cfgenablecard.style.marginLeft = "5px";
				cardpileNodes.push(cfgnode);
				cfgnode.style.display = "none";
				cfgnode.classList.add("cardpilecfg");
				cfgnode.classList.add("toggle");
				cfgnode.style.marginTop = "5px";
				page.appendChild(cfgnode);

				var cardpileadd = ui.create.div(".config.toggle.hidden.cardpilecfg.cardpilecfgadd", page);
				var pileaddlist = [];
				const addFromPacks = [...new Set([...lib.config.cards, mode])];
				const addedNames = new Set();
				for (var i = 0; i < addFromPacks.length; i++) {
					if (!lib.cardPack[addFromPacks[i]]) {
						continue;
					}
					for (var j = 0; j < lib.cardPack[addFromPacks[i]].length; j++) {
						var cname = lib.cardPack[addFromPacks[i]][j];
						if (!lib.card[cname] || addedNames.has(cname)) continue;
						addedNames.add(cname);
						pileaddlist.push([cname, get.translation(cname)]);
						if (cname == "sha") {
							pileaddlist.push(["huosha", "火杀"]);
							pileaddlist.push(["leisha", "雷杀"]);
							pileaddlist.push(["icesha", "冰杀"]);
							pileaddlist.push(["cisha", "刺杀"]);
						}
					}
				}
				var cardpileaddname = ui.create.selectlist(pileaddlist, null, cardpileadd);
				cardpileaddname.style.width = "75px";
				cardpileaddname.style.marginRight = "2px";
				cardpileaddname.style.marginLeft = "-1px";
				var cardpileaddsuit = ui.create.selectlist(
					[
						["heart", "红桃"],
						["diamond", "方片"],
						["club", "梅花"],
						["spade", "黑桃"],
					],
					null,
					cardpileadd
				);
				cardpileaddsuit.style.width = "53px";
				cardpileaddsuit.style.marginRight = "2px";
				var cardpileaddnumber = ui.create.selectlist([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], null, cardpileadd);
				cardpileaddnumber.style.width = "43px";
				cardpileaddnumber.style.marginRight = "2px";
				var button = document.createElement("button");
				button.innerHTML = "确定";
				button.style.width = "40px";
				var deletecard = function () {
					this.parentNode.remove();
					var info = this.parentNode._info;
					var list = lib.config.addedpile[mode];
					const index = list.indexOf(info);
					if (index !== -1) list.splice(index, 1);
					cardpileNodes.remove(this.parentNode);
					recreatePile();
				};
				button.onclick = function () {
					if (!cardpileaddname.value) return;
					var card = [cardpileaddsuit.value, Number(cardpileaddnumber.value), cardpileaddname.value];
					lib.config.addedpile[mode].push(card);
					recreatePile();
					var cfgnode = ui.create.div(".config.toggle.cardpilecfg");
					cfgnode._info = card;
					cfgnode.innerHTML = get.translation(card[2]) + " " + get.translation(card[0]) + get.strNumber(card[1]);
					var cfgnodedelete = document.createElement("span");
					cfgnodedelete.classList.add("cardpiledelete");
					cfgnodedelete.innerHTML = "删除";
					cfgnodedelete.onclick = deletecard;
					cfgnode.appendChild(cfgnodedelete);
					cardpileNodes.push(cfgnode);
					page.insertBefore(cfgnode, cardpileadd.nextSibling);
				};
				cardpileadd.appendChild(button);
				cardpileadd.style.whiteSpace = "nowrap";
				cardpileNodes.push(cardpileadd);

				for (var i = 0; i < lib.config.addedpile[mode].length; i++) {
					var card = lib.config.addedpile[mode][i];
					var cfgnode = ui.create.div(".config.toggle.cardpilecfg");
					cfgnode._info = card;
					cfgnode.innerHTML = (card[2] === "sha" && card[3] ? get.translation(card[3]) : "") + get.translation(card[2]) + " " + get.translation(card[0]) + card[1];
					var cfgnodedelete = document.createElement("span");
					cfgnodedelete.classList.add("cardpiledelete");
					cfgnodedelete.innerHTML = "删除";
					cfgnodedelete.onclick = deletecard;
					cfgnode.appendChild(cfgnodedelete);
					cfgnode.style.display = "none";
					cardpileNodes.push(cfgnode);
					page.appendChild(cfgnode);
				}

				for (var i = 0; i < lib.cardPile[mode].length; i++) {
					var card = lib.cardPile[mode][i];
					var cfgnode = createConfig({
						name: (card[2] == "sha" && card[3] ? get.translation(card[3]) : "") + get.translation(card[2]) + " " + get.translation(card[0]) + get.strNumber(card[1]),
						_number: i,
						_name: mode,
						init: !lib.config.bannedpile[mode].includes(i),
						onclick: toggleCardPile,
					});
					cfgnode.type = "defaultcards";
					cardpileNodes.push(cfgnode);
					cfgnode.style.display = "none";
					cfgnode.classList.add("cardpilecfg");
					page.appendChild(cfgnode);
				}
				ui.create.div(".menuplaceholder", page);
			}
		};
		if (!context?.lazy && !get.config("menu_loadondemand")) {
			node._initLink();
		}
		return node;
	};
	if (!connectMenu && lib.config.show_ban_menu) {
		lib.cardPack.mode_banned = [];
		for (var i = 0; i < lib.config.all.mode.length; i++) {
			var banned = lib.config[lib.config.all.mode[i] + "_bannedcards"];
			if (banned) {
				for (var j = 0; j < banned.length; j++) {
					lib.cardPack.mode_banned.add(banned[j]);
				}
			}
		}
		var bannednode = createModeConfig("mode_banned", start.firstChild);
		if (lib.cardPack.mode_banned.length == 0) {
			bannednode.style.display = "none";
		}
		delete lib.cardPack.mode_banned;
	}
	for (var i = 0; i < lib.config.all.cards.length; i++) {
		if (!lib.cardPack[lib.config.all.cards[i]]) continue;
		if (connectMenu && !lib.connectCardPack.includes(lib.config.all.cards[i])) {
			continue;
		}
		createModeConfig(lib.config.all.cards[i], start.firstChild);
	}
	{
		Object.keys(lib.cardPack).forEach(key => {
			if (connectMenu && !lib.connectCardPack.includes(key)) return;
			if (!lib.config.all.cards.includes(key)) {
				createModeConfig(key, start.firstChild);
			}
		});
	}
	var active = start.firstChild.querySelector(".active");
	if (!active) {
		active = Array.from(start.firstChild.children).find(node => node.style.display !== "none");
		active?.classList.add("active");
		if (active) updateActiveCard(active);
	}
	if (active && !active.link) {
		active._initLink();
	}
	if (active) rightPane.appendChild(active.link);
	else ui.create.div(".menu-preparing", "暂无可用卡牌包", rightPane);

	(function () {
		if (connectMenu) {
			return;
		}
		var page = ui.create.div(".menu-buttons");
		var node = ui.create.div(".menubutton.large", "牌堆", clickMode);
		start.firstChild.insertBefore(node, start.firstChild.querySelector(".lefttext"));
		node.link = page;
		node.mode = "cardpile";
		node.create = function () {
			if (pileCreated) {
				return;
			}
			pileCreated = true;
			page.innerHTML = "";

			var pileList = null;
			var createList = function () {
				if (pileList) {
					pileList.remove();
				}
				var list = ["默认牌堆"];
				if (lib.config.customcardpile["当前牌堆"]) {
					list.push("当前牌堆");
				}
				for (var i in lib.config.customcardpile) {
					list.add(i);
				}
				var currentpile = get.config("cardpilename");
				if (!currentpile || !list.includes(currentpile)) {
					if (list.includes("当前牌堆")) {
						currentpile = "当前牌堆";
					} else {
						currentpile = "默认牌堆";
					}
				}
				pileList = ui.create.selectlist(list, currentpile, pileChoose, function (e) {
					game.saveConfig("cardpilename", this.value, true);
					loadEditingPile();
					restart.style.display = "";
				});
				pileList.style.float = "right";
			};
			var pileChoose = ui.create.div(".config.toggle.cardpilecfg.nomarginleft", "选择牌堆", page);
			createList();

			var pileDel = function () {
				delete lib.config.customcardpile[this.parentNode.link];
				this.parentNode.remove();
				game.saveConfig("customcardpile", lib.config.customcardpile);
				for (var i in lib.config.mode_config) {
					if (i == "global") {
						continue;
					}
					if (lib.config.mode_config[i].cardpilename == this.parentNode.link) {
						game.saveConfig("cardpilename", "默认牌堆", i);
					}
				}
				loadEditingPile();
				restart.style.display = "";
				createList();
			};

			var restart = ui.create.div(".config.more", "重新启动", game.reload, page);
			restart.style.display = "none";
			var createPileNode = function (name) {
				var node = ui.create.div(".config.toggle.cardpilecfg.nomarginleft");
				node.textContent = name;
				node.link = name;
				var del = document.createElement("span");
				del.innerHTML = "删除";
				del.classList.add("cardpiledelete");
				del.onclick = pileDel;
				node.appendChild(del);
				if (name == "当前牌堆") {
					page.insertBefore(node, pileChoose.nextSibling);
				} else {
					page.insertBefore(node, restart);
				}
			};
			for (var i in lib.config.customcardpile) {
				createPileNode(i);
			}
			var exportCardPile;
			ui.create.div(".config.more", "保存当前牌堆 <div>&gt;</div>", page, function () {
				this.classList.toggle("on");
				if (this.classList.contains("on")) {
					exportCardPile.classList.remove("hidden");
				} else {
					exportCardPile.classList.add("hidden");
				}
			});
			exportCardPile = ui.create.div(".config.cardpileadd.indent", page);
			exportCardPile.classList.add("hidden");
			ui.create.div("", '名称：<input type="text"><button>确定</button>', exportCardPile);
			var input = exportCardPile.firstChild.lastChild.previousSibling;
			input.value = "自定义牌堆";
			input.style.marginRight = "3px";
			input.style.width = "120px";
			exportCardPile.firstChild.lastChild.onclick = function () {
				const requested = input.value.trim() || "自定义牌堆";
				var name = requested;
				let suffix = 1;
				while (name in lib.config.customcardpile || name === "默认牌堆" || name === "当前牌堆") {
					name = `${requested}(${suffix++})`;
				}
				lib.config.customcardpile[name] = get.copy([lib.config.bannedpile, lib.config.addedpile]);
				game.saveConfig("cardpilename", name, true);
				game.saveConfig("customcardpile", lib.config.customcardpile);
				createPileNode(name);
				createList();
			};
		};
	})();

	if (!connectMenu) {
		const setAllPacks = enabled => {
			const names = [];
			for (const node of start.firstChild.children) {
				const name = node.mode;
				if (!name || name === "custom" || name === "cardpile") continue;
				if (name.startsWith("mode_extension_")) {
					const extension = name.slice(15);
					if (game.hasExtensionLoaded(extension)) game.saveExtensionConfig(extension, "cards_enable", enabled);
				} else if (!name.startsWith("mode_")) names.push(name);
			}
			game.saveConfig("cards", enabled ? names : []);
			updateNodes();
		};
		// 下面使用了var的特性，请不要在这里直接改为let
		var node1 = ui.create.div(".lefttext", "全部开启", start.firstChild, function () {
			setAllPacks(true);
		});
		var node3 = ui.create.div(".lefttext", "全部关闭", start.firstChild, function () {
			setAllPacks(false);
		});
		var node2 = ui.create.div(".lefttext", "恢复默认", start.firstChild, function () {
			game.saveConfig("cards", lib.config.defaultcards.slice());
			updateNodes();
		});
		node1.style.marginTop = "12px";
		node3.style.marginTop = "7px";
		node2.style.marginTop = "2px";
	}

	updateNodes();

	/**
	 * 在菜单栏初始化完成后，如果又加载了卡牌包，进行刷新
	 *
	 * @param { string } packName
	 */
	return function (packName) {
		packName = packName.replace(/^mode_extension_/, "");
		if (!lib.cardPack[packName] || (connectMenu && !lib.connectCardPack.includes(packName))) return;
		// 判断菜单栏有没有加载过这个卡牌包
		const existing = Array.from(start.firstChild.children).find(node => node.mode === packName);
		if (existing) {
			if (existing.link) {
				existing._initLink();
				updateActiveCard(existing);
			}
			return;
		}
		const node = createModeConfig(packName, start.firstChild);
		if (node1) start.firstChild.insertBefore(node, node1);
		if (!start.firstChild.querySelector(".active")) {
			rightPane.replaceChildren();
			clickMode.call(node);
		}
		updateNodes();
	};
};
