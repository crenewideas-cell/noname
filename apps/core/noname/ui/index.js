import { lib, game, get, _status } from "noname";
import { Click } from "./click/index.js";
import { Create } from "./create/index.js";
import { refreshCompactSeatLayout } from "./compactSeats.js";

export class UI {
	updates = [];
	thrown = [];
	touchlines = [];
	todiscard = {};
	/**
	 * @type { HTMLStyleElement[] }
	 */
	playerPositions = [];
	create = new Create();
	click = new Click();
	selected = {
		/**
		 * @type { Button[] }
		 */
		buttons: [],
		/**
		 * @type { Card[] }
		 */
		cards: [],
		/**
		 * @type { Player[] }
		 */
		targets: [],
	};
	/**
	 * @type { Dialog[] }
	 */
	dialogs;
	/**
	 * @type { Dialog }
	 */
	dialog;
	/**
	 * @type { HTMLDivElement }
	 */
	system;
	/**
	 * @type { HTMLDivElement }
	 */
	arena;
	/**
	 * @type { Control[] }
	 */
	controls;
	/**
	 * @type { Control }
	 */
	control;
	/**
	 * @type { Control | undefined }
	 */
	confirm;
	/**
	 * @type { Control | undefined }
	 */
	skills;
	/**
	 * @type { Control | undefined }
	 */
	skills1;
	/**
	 * @type { Control | undefined }
	 */
	skills2;
	/**
	 * @type { Control | undefined }
	 */
	skills3;
	/**
	 * @type { HTMLDivElement }
	 */
	window;
	/**
	 * @type { HTMLDivElement }
	 */
	pause;
	/**
	 * @type { HTMLAudioElement }
	 */
	backgroundMusic;
	/**
	 * @type { HTMLDivElement }
	 */
	special;
	/**
	 * @type { HTMLDivElement }
	 */
	fakeme;
	/**
	 * @type { HTMLDivElement }
	 */
	chess;
	/**
	 * 手动在菜单栏中添加一个武将包的ui
	 * @type { ((packName: string) => void)[] }
	 */
	updateCharacterPackMenu = [];
	/**
	 * 手动在菜单栏中添加一个卡牌包的ui
	 * @type { ((packName: string) => void)[] }
	 */
	updateCardPackMenu = [];
	/**
	 * @type { HTMLDivElement } 挑战模式下正在操作的角色
	 */
	mebg;
	/**
	 * @type { Function | undefined }
	 */
	updateUpdate;
	/**
	 * @type {HTMLDivElement}
	 */
	commandnode;
	/**
	 * @type {() => void}
	 */
	updateVideoMenu;
	/**
	 * @type {HTMLDivElement}
	 */
	menuContainer;
	/**
	 * @type {HTMLDivElement}
	 */
	auto;
	/**
	 * @type {HTMLDivElement}
	 */
	wuxie;
	/**
	 * @type {HTMLDivElement}
	 */
	tempnowuxie;
	/**
	 * @type {HTMLDivElement[]}
	 */
	toastQueue = [];

	/**
	 * @type {HTMLDivElement}
	 */
	cardPile;
	/**
	 * @type {HTMLDivElement}
	 */
	discardPile;
	/**
	 * @type {HTMLDivElement}
	 */
	ordering;
	/**
	 * @type {HTMLDivElement}
	 */
	coin;
	/**
	 * @type {Record<string, HTMLLinkElement | HTMLStyleElement>}
	 */
	css;
	/**
	 * PC端悬浮的手牌
	 * @type {HTMLElement | null}
	 */
	_handcardHover = null;
	/**
	 * @type {(HTMLDivElement & {
	 * 	fillnode: HTMLDivElement;
	 * 	popnode: HTMLDivElement;
	 * 	position: number;
	 * 	set(text: string | number, percentage: number): void;
	 * }) | undefined}
	 */
	timer;
	/**
	 * 计算手牌展开偏移量
	 * - 触屏设备：点击选中时展开
	 * - PC端：仅鼠标悬浮时展开
	 * @param {HTMLElement[]} cards - 手牌数组
	 * @param {{cardWidth?: number, currentMargin?: number}} [options] - 配置选项
	 * @returns {{spreadIndex: number, spreadLeft: number, spreadRight: number}}
	 */
	getSpreadOffset(cards, options = {}) {
		const result = { spreadIndex: -1, spreadLeft: 0, spreadRight: 0 };
		// Compact desktop hands reveal hovered cards in place via CSS. Moving
		// neighbours here would change the hit target under a stationary mouse.
		if (ui.arena?.classList.contains("compact-seats") && !lib.config.touchscreen) return result;
		if (!lib.config.spread_card) return result;

		const cardWidth = options.cardWidth || 112;
		const currentMargin = options.currentMargin || cardWidth;
		if (currentMargin >= cardWidth - 2) return result;

		const isTouchscreen = lib.config.touchscreen;
		for (let i = 0; i < cards.length; i++) {
			let shouldSpread = false;
			if (isTouchscreen) {
				shouldSpread = cards[i].classList?.contains("selected");
			} else {
				shouldSpread = cards[i] === ui._handcardHover;
			}
			if (shouldSpread) {
				if (result.spreadIndex !== -1) {
					result.spreadIndex = -1;
					break;
				}
				result.spreadIndex = i;
			}
		}

		if (result.spreadIndex !== -1) {
			const spreadOffset = Math.max(0, cardWidth - currentMargin);
			result.spreadLeft = Math.round(spreadOffset * 0.2);
			result.spreadRight = spreadOffset;
		}

		return result;
	}
	refresh(node) {
		void window.getComputedStyle(node, null).getPropertyValue("opacity");
	}
	clear() {
		game.addVideo("uiClear");
		var thrown = document.getElementsByClassName("thrown");
		var nodes = [];
		var i;
		for (i = 0; i < thrown.length; i++) {
			nodes.push(thrown[i]);
		}
		for (i = 0; i < nodes.length; i++) {
			if (!nodes[i].fixed) {
				nodes[i].delete();
			}
		}
	}
	updatec() {
		if (_status.noupdatec) {
			return;
		}
		if (ui.control?.classList.contains("action-controls")) {
			// CSS owns wrapping and spacing. Old centering offsets and fixed widths
			// would move flex items over adjacent buttons after replace/open.
			for (const control of ui.control.children) {
				if (!control.classList.contains("control")) continue;
				control.style.width = "";
				control.style.transform = "";
				delete control._offset;
				control.classList.toggle("auxiliary-control", !!control.stayleft && !!lib.config.wuxie_right);
			}
			return;
		}
		var length = 0,
			minoffset = -Infinity;
		var controls = [];
		var widths = [];
		var leftwidths = [];
		var add = function (node, first) {
			var thiswidth = parseInt(node.style.width);
			if (thiswidth) {
				thiswidth += 8;
				length += thiswidth;
				if (first) {
					leftwidths.push(thiswidth);
				} else {
					widths.push(thiswidth);
				}
			} else {
				length += node.offsetWidth;
				if (first) {
					leftwidths.push(node.offsetWidth);
				} else {
					widths.push(node.offsetWidth);
				}
			}
			if (first) {
				controls.unshift(node);
			} else {
				controls.push(node);
			}
		};
		widths = leftwidths.concat(widths);
		var staylefts = [];
		for (var i = 0; i < ui.control.childNodes.length; i++) {
			if (ui.control.childNodes[i].classList.contains("removing")) {
				continue;
			}
			if (lib.config.wuxie_right && ui.control.childNodes[i].stayleft) {
				staylefts.push(ui.control.childNodes[i]);
			} else {
				add(ui.control.childNodes[i]);
			}
		}
		if (staylefts.length) {
			var fullwidth = 0;
			var fullright = game.layout == "long" || game.layout == "long2" || game.chess || (game.layout != "nova" && parseInt(ui.arena.dataset.number) <= 5);
			for (var i = 0; i < widths.length; i++) {
				fullwidth += widths[i] + 6;
				if (get.is.phoneLayout()) {
					fullwidth += 6;
				}
			}
			fullwidth /= 2;
			var currentLeft = 0;
			for (var stayleft of staylefts) {
				stayleft.currentLeft = currentLeft;
				fullwidth += stayleft.offsetWidth;
				currentLeft += stayleft.offsetWidth;
				if (get.is.phoneLayout()) {
					fullwidth += 18;
					currentLeft += 18;
				} else {
					fullwidth += 12;
					currentLeft += 12;
				}
			}
			if (fullright) {
				fullwidth += 124;
				if ((game.layout == "long2" || game.layout == "nova") && ui.arena.dataset.number == "8" && get.mode() != "boss") {
					fullwidth += game.me.getLeft();
				}
			} else {
				fullwidth += 154;
			}
			for (var stayleft of staylefts) {
				if (game.layout != "default") {
					var current_offset = stayleft._offset;
					if (fullright) {
						stayleft._offset = Math.ceil(-ui.arena.offsetWidth / 2) + 135;
						if ((game.layout == "long2" || game.layout == "nova") && ui.arena.dataset.number == "8" && get.mode() != "boss") {
							stayleft._offset += game.me.getLeft();
						}
					} else {
						stayleft._offset = Math.ceil(-ui.arena.offsetWidth / 2) + 165;
					}
					stayleft._offset += stayleft.currentLeft;

					if (current_offset != stayleft._offset) {
						stayleft.addTempClass("controlpressdownx", 500);
						stayleft.style.transform = "translateX(" + stayleft._offset + "px)";
					}
				} else {
					add(stayleft, true);
				}
			}
			if (staylefts.length && controls.length) {
				var last = staylefts[staylefts.length - 1];
				minoffset = last._offset + last.offsetWidth + (get.is.phoneLayout() ? 18 : 12);
			}
		}
		if (!controls.length) {
			return;
		}
		var offset = -length / 2;
		if (minoffset > offset) {
			offset = minoffset;
		}
		var control = controls.shift();
		if (control._offset != offset) {
			control.addTempClass("controlpressdownx", 500);
			control.style.transform = "translateX(" + offset + "px)";
			control._offset = offset;
		}
		while (controls.length) {
			var control = controls.shift();
			var width = widths.shift();
			offset += width + 6;
			if (get.is.phoneLayout()) {
				offset += 6;
			}
			if (control._offset != offset) {
				control.addTempClass("controlpressdownx", 500);
				control.style.transform = "translateX(" + offset + "px)";
				control._offset = offset;
			}
		}
	}
	updatex() {
		ui.update.apply(this, arguments);
		ui.updatehl();
		for (var i = 0; i < lib.onresize.length; i++) {
			lib.onresize[i]();
		}
		var cfg = game.documentZoom / game.deviceZoom;
		ui.updated();
		game.documentZoom = cfg * game.deviceZoom;
		ui.updatez();
		delete ui._updatexr;
	}
	updatexr() {
		// The table cannot wait for the legacy 500ms dialog/update debounce:
		// body dimensions and seat coordinates must describe the same frame.
		if (ui.arena?.classList.contains("compact-seats") && game.documentZoom > 0) ui.updatez();
		if (ui._updatexr) {
			clearTimeout(ui._updatexr);
		}
		ui._updatexr = setTimeout(ui.updatex, 500);
	}
	updatejm(player, nodes, start, inv) {
		if (typeof start != "number") {
			start = 0;
		}
		var str;
		if (get.is.mobileMe(player) || game.layout == "default" || player.classList.contains("linked")) {
			str = "translateX(";
			if (inv) {
				str += "-";
			}
		} else {
			str = "translateY(";
		}
		var num = 0;
		for (var i = 0; i < nodes.childElementCount; i++) {
			var node = nodes.childNodes[i];
			if (i < start) {
				node.style.transform = "";
			} else if (node.classList.contains("removing")) {
				start++;
			} else {
				ui.refresh(node);
				node.classList.remove("drawinghidden");
				const spacing = nodes === player.node.marks ? 36 : 28;
				node._transform = str + (i - start) * spacing + "px)";
				node.style.transform = node._transform;
			}
		}
	}
	updatem(player) {
		if (player) {
			var start = 0;
			if (!player.classList.contains("linked2") || !ui.arena.classList.contains("nolink")) {
				start = 1;
			}
			ui.updatejm(player, player.node.marks, start, get.is.mobileMe(player));
		} else {
			for (var i = 0; i < game.players.length; i++) {
				ui.updatem(game.players[i]);
			}
		}
	}
	updatej(player) {
		if (player) {
			ui.updatejm(player, player.node.judges);
		} else {
			for (var i = 0; i < game.players.length; i++) {
				ui.updatej(game.players[i]);
			}
		}
	}
	updatehl() {
		if (!game.me) return;
		const containers = [ui.handcards1Container, ui.handcards2Container];
		if (containers.some(container => !container?.firstChild)) return;
		const handEdgeAllowance = ui.arena?.classList.contains("compact-seats") && lib.config.touchscreen && lib.config.spread_card ? 224 : 128;
		// Read both rows before changing any styles. A layout read per card after
		// writing the preceding card makes large hands repeatedly lay out the table.
		const rows = containers.map(container => {
			const cards = Array.from(container.firstChild.children).filter(card => !card.classList.contains("removing"));
			const gap = !lib.config.fold_card || cards.length < 2 ? 112 : Math.min(112, (container.offsetWidth - handEdgeAllowance) / (cards.length - 1));
			const offset = Math.max(32, gap);
			const overlap = Math.max(0, 100 - offset);
			return {
				container, cards, offset, overlap,
				scroll: !lib.config.fold_card || gap < 32,
				spread: ui.getSpreadOffset(cards, { currentMargin: offset }),
				infoWidths: overlap > 40 ? cards.map(card => card.node.info.offsetWidth) : [],
			};
		});
		const drawing = [];
		const setStyle = (node, key, value) => {
			if (node.style[key] !== value) node.style[key] = value;
		};
		for (const { container, cards, offset, overlap, scroll, spread, infoWidths } of rows) {
			if (container.classList.contains("scrollh") !== scroll) container.classList.toggle("scrollh", scroll);
			for (const [index, card] of cards.entries()) {
				let x = index * offset;
				if (index < spread.spreadIndex) x -= spread.spreadLeft;
				else if (index > spread.spreadIndex) x += spread.spreadRight;
				const transform = "translateX(" + x + "px)";
				card._transform = transform;
				setStyle(card, "transform", card.classList.contains("selected") ? transform + " translateY(-20px)" : transform);
				if (card.classList.contains("drawinghidden")) drawing.push(card);
				const { info, name } = card.node;
				const span = info.querySelector("span");
				if (overlap > 40) {
					if (span) setStyle(span, "display", "none");
					setStyle(name, "transform", name.classList.contains("long") ? "translateY(16px) scale(0.85)" : "translateY(16px)");
					setStyle(name, "transformOrigin", name.classList.contains("long") ? "left top" : "");
					setStyle(info, "transform", "translateX(" + (infoWidths[index] - 90) + "px) translateY(-3px)");
				} else {
					if (span) setStyle(span, "display", "");
					setStyle(name, "transform", "");
					setStyle(name, "transformOrigin", "");
					setStyle(info, "transform", "translateX(" + -overlap + "px)");
				}
			}
			setStyle(container.firstChild, "width", Math.max(0, offset * (cards.length - 1) + 118 + spread.spreadLeft + spread.spreadRight) + "px");
		}
		// Commit the hidden starting state once for the whole draw animation.
		// Ordinary selection/hover updates need no synchronous style flush.
		if (drawing.length) {
			ui.refresh(drawing[0]);
			for (const card of drawing) card.classList.remove("drawinghidden");
		}
	}
	updateh(compute) {
		if (!game.me) {
			return;
		}
		if (!ui.handcards1Container) {
			return;
		}
		if (lib.config.low_performance) {
			if (compute) {
				ui.updatehl();
				setTimeout(ui.updatehl, 1000);
			}
			return;
		}
		if (compute) {
			ui.handcards1Container._handcardsWidth = ui.handcards1Container.offsetWidth;
			ui.handcards2Container._handcardsWidth = ui.handcards2Container.offsetWidth;
		}
		ui.updatehx(game.me.node.handcards1);
		ui.updatehx(game.me.node.handcards2);
	}
	updatehx(node) {
		var width = node.parentNode._handcardsWidth;
		var num = node.childElementCount - node.getElementsByClassName("removing").length;
		node.classList.remove("fold0");
		node.classList.remove("fold1");
		node.classList.remove("fold2");
		node.classList.remove("fold3");
		if (num * 78 + 40 >= width) {
			// node.dataset.fold=3;
			node.classList.add("fold3");
		} else if (num * 93 + 25 >= width) {
			// node.dataset.fold=2;
			node.classList.add("fold2");
		} else if (num * 112 + 6 >= width) {
			// node.dataset.fold=1;
			node.classList.add("fold1");
		} else {
			// node.dataset.fold=0;
			node.classList.add("fold0");
		}
	}
	updated() {
		if (document.documentElement.offsetWidth < 900 || document.documentElement.offsetHeight < 500) {
			game.deviceZoom = Math.min(Math.round(document.documentElement.offsetWidth / 98) / 10, Math.round(document.documentElement.offsetHeight / 50) / 10);
		} else {
			game.deviceZoom = 1;
		}
	}
	updatez() {
		var width = document.documentElement.offsetWidth;
		var height = document.documentElement.offsetHeight;
		var zoom = game.documentZoom;
		if (zoom != 1) {
			document.body.style.width = Math.round(width / zoom) + "px";
			document.body.style.height = Math.round(height / zoom) + "px";
			document.body.style.transform = "scale(" + Math.floor(zoom * 100) / 100 + ")";
		} else {
			document.body.style.width = width + "px";
			document.body.style.height = height + "px";
			document.body.style.transform = "";
		}
		refreshCompactSeatLayout(ui.arena);
	}
	update() {
		for (var i = 0; i < ui.updates.length; i++) {
			ui.updates[i]();
		}
		if (ui.dialog && !ui.dialog.classList.contains("noupdate")) {
			if (game.chess) {
				if (ui.dialog.content.scrollHeight < 240 && (!ui.dialog.buttons || !ui.dialog.buttons.length) && !ui.dialog.forcebutton) {
					ui.dialog.style.height = ui.dialog.content.offsetHeight + "px";
					ui.dialog.classList.add("slim");
				} else {
					ui.dialog.style.height = "";
					ui.dialog.classList.remove("slim");
				}
			} else {
				if ((!ui.dialog.buttons || !ui.dialog.buttons.length) && !ui.dialog.forcebutton && ui.dialog.classList.contains("fullheight") == false && get.mode() != "stone") {
					if (!ui.dialog.classList.contains("addNewRow")) {
						ui.dialog.classList.add("nobutton");
					}
					if (ui.dialog.content.offsetHeight < 240) {
						if (!ui.dialog._heightset) {
							ui.dialog._heightset = ui.dialog.style.height || true;
						}
						ui.dialog.style.height = ui.dialog.content.offsetHeight + "px";
						if (lib.config.show_log != "off") {
							ui.dialog.classList.add("scroll1");
							ui.dialog.classList.add("scroll2");
							return;
						}
					} else {
						if (typeof ui.dialog._heightset == "string") {
							ui.dialog.style.height = ui.dialog._heightset;
						} else if (ui.dialog._heightset) {
							ui.dialog.style.height = "";
						}
						delete ui.dialog._heightset;
					}
				} else {
					if (typeof ui.dialog._heightset == "string") {
						ui.dialog.style.height = ui.dialog._heightset;
					} else if (ui.dialog._heightset) {
						ui.dialog.style.height = "";
					}
					delete ui.dialog._heightset;
					if (!ui.dialog.classList.contains("addNewRow")) {
						ui.dialog.classList.remove("nobutton");
					}
				}
			}
			var height1 = ui.dialog.content.offsetHeight;
			var height2 = ui.dialog.contentContainer.offsetHeight;
			if (game.chess) {
				if (height1 < 240) {
					ui.dialog.style.height = height1 + "px";
				}
			} else {
				if (!ui.dialog.forcebutton && !ui.dialog._scrollset && (height1 <= 190 || (height2 >= height1 && height2 >= 210))) {
					ui.dialog.classList.remove("scroll1");
					ui.dialog.classList.remove("scroll2");
				} else {
					ui.dialog.classList.add("scroll1");
					ui.dialog.classList.add("scroll2");
					if (game.layout != "default") {
						ui.dialog.style.height = Math.min(height1, (game.layout == "long2" || game.layout == "nova") && ui.arena.classList.contains("choose-character") ? 380 : 350) + "px";
						ui.dialog._scrollset = true;
					}
				}
				if (game.layout == "long2" || game.layout == "nova") {
					if (height1 + 240 >= ui.arena.offsetHeight) {
						ui.dialog.classList.add("scroll3");
					} else {
						ui.dialog.classList.remove("scroll3");
					}
				}
			}
		}
	}
	recycle(node, key) {
		if (!ui._recycle) {
			ui._recycle = {};
		}
		if (typeof node == "string") {
			return ui._recycle[node];
		}
		ui._recycle[key] = node;
	}
	/**
	 * @author curpond
	 * @author Tipx-L
	 * @param {number} [numberOfPlayers]
	 */
	updateConnectPlayerPositions(numberOfPlayers) {
		if (typeof numberOfPlayers != "number") {
			const configOL = lib.configOL;
			numberOfPlayers = parseInt(configOL.player_number) || configOL.number;
		}
		if (!numberOfPlayers) {
			return;
		}
		const playerPositions = ui.playerPositions;
		playerPositions.forEach(position => {
			game.dynamicStyle.remove(position);
		});
		playerPositions.length = 0;
		const temporaryPlayer = ui.create.div(".player.connect", ui.window).hide();
		const computedStyle = getComputedStyle(temporaryPlayer);
		const halfWidth = parseFloat(computedStyle.width) / 2;
		const halfHeight = parseFloat(computedStyle.height) / 2;
		temporaryPlayer.remove();
		const halfNumberOfPlayers = Math.round(numberOfPlayers / 2);
		const upperPercentage = 100 / (halfNumberOfPlayers + 1);
		const scale = 10 / numberOfPlayers;
		for (let ordinal = 0; ordinal < halfNumberOfPlayers; ordinal++) {
			const selector = `#window>.player.connect[data-position='${ordinal}']`;
			const css = {
				left: `calc(${upperPercentage * (ordinal + 1)}% - ${halfWidth}px)`,
				top: `calc(${100 / 3}% - ${halfHeight}px)`,
			};
			if (scale < 1) {
				css["transform"] = `scale(${scale})`;
			}

			game.dynamicStyle.add(selector, css);
			playerPositions.push(selector);
		}
		const lowerPercentage = 100 / (numberOfPlayers - halfNumberOfPlayers + 1);
		for (let ordinal = halfNumberOfPlayers; ordinal < numberOfPlayers; ordinal++) {
			const selector = `#window>.player.connect[data-position='${ordinal}']`;
			const css = {
				left: `calc(${lowerPercentage * (ordinal - halfNumberOfPlayers + 1)}% - ${halfWidth}px)`,
				top: `calc(${(100 * 2) / 3}% - ${halfHeight}px)`,
			};
			if (scale < 1) {
				css["transform"] = `scale(${scale})`;
			}

			game.dynamicStyle.add(selector, css);
			playerPositions.push(selector);
		}
	}
	/**
	 * @author curpond
	 * @author Tipx-L
	 * @param {number} [numberOfPlayers]
	 */
	updatePlayerPositions(numberOfPlayers) {
		if (typeof numberOfPlayers != "number") {
			numberOfPlayers = ui.arena.dataset.number;
		}
		// The shared compact layout owns opponents in every presentation. Remove
		// the old many-player transform so it cannot shrink the portrait twice.
		if (ui.arena.classList.contains("compact-seats") || ui.arena.classList.contains("builtin-responsive")) {
			for (const position of ui.playerPositions) game.dynamicStyle.remove(position);
			ui.playerPositions.length = 0;
			refreshCompactSeatLayout(ui.arena);
			return;
		}
		//当人数不超过8人时，还是用以前的布局
		if (!numberOfPlayers || numberOfPlayers <= 8) {
			return;
		}
		const playerPositions = ui.playerPositions;
		playerPositions.forEach(position => {
			game.dynamicStyle.remove(position);
		});
		playerPositions.length = 0;
		//单个人物的宽度，这里要设置玩家的实际的宽度
		const temporaryPlayer = ui.create.div(".player", ui.arena).hide();
		const computedStyle = getComputedStyle(temporaryPlayer);
		const scale = 6 / numberOfPlayers;
		//玩家顶部距离父容器上边缘的距离偏移的单位距离
		const quarterHeight = (parseFloat(computedStyle.height) / 4) * scale;
		const halfWidth = parseFloat(computedStyle.width) / 2;
		temporaryPlayer.remove();
		//列数，即假如8人场，除去自己后，上面7个人占7列
		const columnCount = numberOfPlayers - 1;
		const percentage = 90 / (columnCount - 1);
		//仅当游戏人数大于8人，且玩家的座位号大于0时，设置玩家的位置；因为0号位是game.me在最下方，无需设置
		for (let ordinal = 1; ordinal < numberOfPlayers; ordinal++) {
			const reversedOrdinal = columnCount - ordinal;
			//动态计算玩家的top属性，实现拱桥的效果；只让两边的各两个人向下偏移一些
			const top = Math.max(0, Math.round(numberOfPlayers / 5) - Math.min(Math.abs(ordinal - 1), Math.abs(reversedOrdinal))) * quarterHeight;
			const selector = `#arena[data-number='${numberOfPlayers}']>.player[data-position='${ordinal}']`;
			game.dynamicStyle.add(selector, {
				left: `calc(${percentage * reversedOrdinal + 5}% - ${halfWidth}px)`,
				top: `${top}px`,
				transform: `scale(${scale})`,
			});
			playerPositions.push(selector);
		}
	}
	updateRoundNumber(roundNumber, cardPileNumber) {
		if (ui.cardPileNumber) {
			ui.cardPileNumber.innerHTML = `${roundNumber}轮 剩余牌: ${cardPileNumber}`;
		}
	}
}

export let ui = new UI();

/**
 * @param { InstanceType<typeof UI> } [instance]
 */
export let setUI = instance => {
	ui = instance || new UI();
	if (lib.config.dev) {
		window.ui = ui;
	}
};
