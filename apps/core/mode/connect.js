import { lib, game, ui, get, ai, _status } from "noname";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "connect",
		// Resolve through the shared engine so the separately built mode does not
		// bundle a second platform socket/store alongside the lobby's copy.
		start: sessionStorage.getItem("noname_online_game") ? async () => {
			await game.startManagedGame();
		} : function () {
			var directstartmode = lib.config.directstartmode;
			ui.create.menu(true);
			event.textnode = ui.create.div("", "输入联机地址");
			var createNode = function () {
				if (event.created) {
					return;
				}
				if (directstartmode && lib.node) {
					ui.exitroom = ui.create.system(
						"退出房间",
						function () {
							game.saveConfig("directstartmode");
							game.reload();
						},
						true
					);
					game.switchMode(directstartmode);
					return;
				}
				if (lib.node && window.require) {
					ui.startServer = ui.create.system(
						"启动服务器",
						function (e) {
							ui.click.shortcut(false);
							e.stopPropagation();
							ui.click.connectMenu();
						},
						true
					);
				}

				event.created = true;
				var node = ui.create.div(".shadowed");
				node.style.width = "400px";
				node.style.height = "30px";
				node.style.lineHeight = "30px";
				node.style.fontFamily = "xinwei";
				node.style.fontSize = "30px";
				node.style.padding = "10px";
				node.style.left = "calc(50% - 210px)";
				node.style.top = "calc(50% - 20px)";
				node.style.whiteSpace = "nowrap";
				node.textContent = lib.config.last_ip || lib.hallURL;
				node.contentEditable = true;
				node.classList.add("connect-address");
				node.setAttribute("role", "textbox");
				node.setAttribute("aria-label", "联机服务器地址");
				node.setAttribute("aria-multiline", "false");
				node.spellcheck = false;
				node.addEventListener("paste", e => {
					e.preventDefault();
					node.textContent = e.clipboardData.getData("text/plain").trim();
				});
				node.style.webkitUserSelect = "text";
				node.style.textAlign = "center";
				node.style.overflow = "hidden";

				let connecting = false;
				let invitation;
				var connect = function (e) {
					e?.preventDefault();
					if (connecting) { game.disconnect(); return; }
					connecting = true;
					node.contentEditable = false;
					button.textContent = "取消";
					text.dataset.state = "connecting";
					event.textnode.textContent = "正在连接...";
					clearTimeout(event.timeout);
					const ip = node.textContent.trim();
					game.connect(ip, function (success, reason) {
						connecting = false;
						node.contentEditable = true;
						button.textContent = "连接";
						text.dataset.state = success ? "connected" : "error";
						if (success) {
							game.saveConfig("last_ip", ip);
							event.textnode.textContent = "连接成功，正在进入…";
							if (invitation) _status.read_clipboard_text = invitation;
							var info = lib.config.reconnect_info;
							if (info && info[0] == _status.ip) {
								game.onlineID = info[1];
								if (typeof (game.roomId = info[2]) == "string") {
									game.roomIdServer = true;
								}
							}
							return;
						}
						if (event.textnode) {
							event.textnode.textContent = reason || "连接失败，请重试。";
						}
					});
				};
				node.addEventListener("keydown", function (e) {
					if (e.key == "Enter" && !e.isComposing) {
						connect(e);
					}
				});
				ui.window.appendChild(node);
				ui.ipnode = node;

				var text = event.textnode;
				text.classList.add("connect-status");
				text.setAttribute("role", "status");
				text.setAttribute("aria-live", "polite");
				text.style.width = "400px";
				text.style.height = "30px";
				text.style.lineHeight = "30px";
				text.style.fontFamily = "xinwei";
				text.style.fontSize = "30px";
				text.style.padding = "10px";
				text.style.left = "calc(50% - 200px)";
				text.style.top = "calc(50% - 80px)";
				text.style.textAlign = "center";
				ui.window.appendChild(text);
				ui.iptext = text;

				var button = ui.create.div(".menubutton.highlight.large.pointerdiv", "连接", connect);
				button.classList.add("connect-submit");
				button.setAttribute("role", "button");
				button.tabIndex = 0;
				button.addEventListener("keydown", e => {
					if (e.key === "Enter" || e.key === " ") connect(e);
				});
				button.style.width = "70px";
				button.style.left = "calc(50% - 35px)";
				button.style.top = "calc(50% + 60px)";
				ui.window.appendChild(button);
				ui.ipbutton = button;

				ui.hall_button = ui.create.system(
					"联机大厅",
					function () {
						node.textContent = get.config("hall_ip") || lib.hallURL;
						connect();
					},
					true
				);
				if (!get.config("hall_button")) {
					ui.hall_button.style.display = "none";
				}
				ui.recentIP = ui.create.system("最近连接", null, true);
				var clickLink = function () {
					node.textContent = this.textContent;
					connect();
				};
				lib.setPopped(
					ui.recentIP,
					function () {
						if (!lib.config.recentIP.length) {
							return;
						}
						var uiintro = ui.create.dialog("hidden");
						uiintro.listen(function (e) {
							e.stopPropagation();
						});
						var list = ui.create.div(".caption");
						for (var i = 0; i < lib.config.recentIP.length; i++) {
							ui.create.div(".text.textlink", list, clickLink).textContent = get.trimip(lib.config.recentIP[i]);
						}
						uiintro.add(list);
						var clear = uiintro.add('<div class="text center">清除</div>');
						clear.style.paddingTop = 0;
						clear.style.paddingBottom = "3px";
						clear.listen(function () {
							lib.config.recentIP.length = 0;
							game.saveConfig("recentIP", []);
							uiintro.delete();
						});
						return uiintro;
					},
					220
				);
				if (get.config("read_clipboard", "connect")) {
					var ced = false;
					var read = text => {
						try {
							const text2 = text.split(/\r?\n/).find(line => line.startsWith("联机地址:"));
							const ip = text2?.slice(5).trim();
							if (ip && (ced || confirm("是否根据剪贴板的邀请链接以进入联机地址和房间？"))) {
								if (connecting) return;
								node.textContent = ip;
								invitation = text;
								connect();
							}
						} catch (e) {
							console.log(e);
						}
					};
					window.focus();
					if (navigator.clipboard && lib.node) {
						navigator.clipboard
							.readText()
							.then(read)
							.catch(_ => {});
					} else {
						var input = ui.create.node("textarea", ui.window, { opacity: "0" });
						input.select();
						var result = document.execCommand("paste");
						input.blur();
						ui.window.removeChild(input);
						if (result || input.value.length > 0) {
							read(input.value);
						} else if (confirm("是否输入邀请链接以进入联机地址和房间？")) {
							ced = true;
							game.prompt("请输入邀请链接", text => {
								if (typeof text === "string" && text.length > 0) {
									read(text);
								}
							});
						}
					}
				}
				lib.init.onfree();
				const reconnectAddress = sessionStorage.getItem(lib.configprefix + "reconnect_requested");
				if (reconnectAddress) {
					sessionStorage.removeItem(lib.configprefix + "reconnect_requested");
					node.textContent = reconnectAddress;
					setTimeout(() => { if (node.isConnected && !connecting && !game.online) connect(); }, 0);
				}
			};
			createNode();
			if (!game.onlineKey) {
				game.onlineKey = localStorage.getItem(lib.configprefix + "key");
				if (!game.onlineKey) {
					game.onlineKey = get.id();
					localStorage.setItem(lib.configprefix + "key", game.onlineKey);
				}
			}
			_status.connectDenied = createNode;
			setTimeout(lib.init.onfree, 1000);
		},
	};
};
