import { lib, game, ui, get, _status } from "noname";
import { command, onlineState, restoreAccount, onOnlineEvent, disconnectPlatform, onlineId } from "./client";
import { security } from "@/util/sandbox.js";
import "./ui/online.css";

let statusPanel;
let assignment;
let unsubscribe;
let choiceToken;
let finished = false;
let seatGeneration;
let attaching;
let choiceClock, choiceTimer;
function clearChoiceClock() { clearInterval(choiceTimer); choiceClock?.remove(); choiceClock = undefined; }
function showChoiceClock(deadline) {
	clearChoiceClock();
	if (!Number.isFinite(deadline)) return;
	choiceClock = document.createElement("aside"); choiceClock.className = "online-turn-clock";
	choiceClock.setAttribute("aria-label", "本次行动服务端截止倒计时"); document.body.append(choiceClock);
	const update = () => { if (choiceClock) choiceClock.textContent = "本次行动 · " + Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) + " 秒后托管"; };
	update(); choiceTimer = setInterval(update, 250);
}

function showStatus(title, description, actionLabel, action) {
	statusPanel?.remove();
	const panel = statusPanel = document.createElement("section");
	panel.className = "online-game-status";
	panel.setAttribute("role", "status");
	const heading = document.createElement("h2"), text = document.createElement("p");
	heading.textContent = title; text.textContent = description; panel.append(heading, text);
	if (action) {
		const button = document.createElement("button"); button.textContent = actionLabel;
		button.onclick = async () => { button.disabled = true; try { await action(); } catch (error) { text.textContent = error.message; button.disabled = false; } };
		panel.append(button);
	}
	document.body.append(panel);
}

/** Return to the same room after settlement; explicit departure releases the seat. */
export async function returnToOnlineLobby(leave = false) {
	if (leave) await leaveManagedRoom(true);
	clearChoiceClock();
	sessionStorage.removeItem("noname_online_game");
	sessionStorage.setItem("noname_online_return", assignment?.modeId || onlineState.room?.modeId || "identity");
	sessionStorage.setItem(lib.configprefix + "return_to_lobby", "true");
	localStorage.removeItem(lib.configprefix + "directstart");
	for (const key of ["reconnect_info", "directstartmode", "tmp_user_roomId", "tmp_owner_roomId"]) await game.promises.saveConfig(key);
	unsubscribe?.(); disconnectPlatform(); window.onbeforeunload = null; game.reload();
}

export async function leaveManagedRoom(bestEffort = false) {
	try {
		if (!onlineState.account || onlineState.status !== "connected") await restoreAccount();
		if (onlineState.room) await command("room.leave", { roomId: onlineState.room.id });
	} catch (error) {
		if (!bestEffort) throw error;
		console.warn("联机离房请求未完成，连接关闭后由服务器清理席位", error);
	}
}

export async function startManagedGame() {
	showStatus("正在入席", "正在同步房间与对局资源，请保持在线…");
	try {
		assignment = JSON.parse(sessionStorage.getItem("noname_online_game") || "null");
		if (!assignment?.roomId || !assignment.instanceId) throw new Error("对局分配已失效，请返回大厅。");
		await restoreAccount();
		if (!onlineState.account) throw new Error("登录已过期，请返回大厅登录。");
		if (onlineState.room?.id !== assignment.roomId || onlineState.room?.instanceId !== assignment.instanceId) throw new Error("房间已经变化，请返回大厅。");
		if (!["starting", "in_game"].includes(onlineState.room.state)) throw new Error("本场对局已结束，可返回房间继续。");
		if (onlineState.room.members.find(member => member.id === onlineState.account.id)?.abandoned) throw new Error("席位保留时间已过，无法恢复本局控制权。");
		assignment.modeId = onlineState.room.modeId;
		game.onlineID = onlineState.account.id;
		_status.ip = "online-platform";
		// Force the existing engine sandbox without the legacy "trust this IP" prompt.
		game.requireSandboxOn();
		game.sandbox = security.createSandbox(_status.ip);
		lib.config.recentIP ||= [];
		game.ws = { readyState: 1, bufferedAmount: 0, send() {}, close: disconnectPlatform };
		game.disconnect = disconnectPlatform;
		// Associate results with the prompt that created the event. A late UI
		// callback must never borrow the token of a later server choice.
		const eventTokens = new WeakMap(), resultTokens = new WeakMap();
		const createEvent = game.createEvent, startEvent = lib.element.GameEvent.prototype.start;
		game.createEvent = function (...args) {
			const event = createEvent.apply(this, args);
			if (choiceToken) eventTokens.set(event, choiceToken);
			return event;
		};
		lib.element.GameEvent.prototype.start = async function (...args) {
			await startEvent.apply(this, args);
			const token = eventTokens.get(this);
			if (token && this.result && typeof this.result === "object") resultTokens.set(this.result, token);
		};
		const submit = async (result, token) => {
			if (!token || token !== choiceToken) return;
			choiceToken = undefined;
			clearChoiceClock();
      try { await attaching; await command("game.result", { ...assignment, token, turnId: token, expectedRevision: token, actionId: onlineId(), generation: seatGeneration, result: get.stringifiedResult(result) }); }
			catch (error) {
				const notice = document.createElement("div"); notice.className = "online-game-notice";
				notice.textContent = error.message + "。本次选择由服务端处理，请等待后续行动。";
				document.body.append(notice); setTimeout(() => notice.remove(), 6000);
			}
		};
		game.send = (type, ...args) => {
			if (type === "result") { void submit(args[0], resultTokens.get(args[0]) || eventTokens.get(_status.event)); return true; }
			if (type === "inited" || type === "reinited") { void (async () => { await attaching; await command("game." + type, { ...assignment, generation: seatGeneration }); })().catch(fail); return true; }
			if (type === "auto" || type === "unauto") { void (async () => { await attaching; await command("game.auto", { ...assignment, generation: seatGeneration, enabled: type === "auto" }); })().catch(fail); return true; }
			if (type === "chat") { void command("room.chat", { roomId: assignment.roomId, text: String(args[1] || "") }).catch(fail); return true; }
			// The public protocol has no exec, eval, edit-state or client result reporting.
			return false;
		};
		unsubscribe = onOnlineEvent((type, payload) => {
			if (payload?.instanceId && payload.instanceId !== assignment.instanceId) return;
			if (type === "game.choice") {
				choiceToken = payload.token;
				// The host emits the choice after the engine event has started. Bind
				// this token to the live event/result so a later prompt can never be
				// selected by a stale UI callback.
				const current = _status.event;
				if (current && typeof current === "object") {
					eventTokens.set(current, payload.token);
					if (current.result && typeof current.result === "object") resultTokens.set(current.result, payload.token);
				}
				showChoiceClock(payload.deadline);
			} else if (type === "game.choiceClosed") {
				choiceToken = undefined; clearChoiceClock();
			} else if (type === "game.engine") {
				try {
					const message = JSON.parse(payload.raw);
					lib.element.ws.onmessage.call(game.ws, { data: payload.raw });
					if (message[0] === "gameStart") { statusPanel?.remove(); statusPanel = undefined; }
				} catch { fail(new Error("对局资源同步失败，请返回房间。")); }
			} else if (type === "room.chat") {
				// Render as text through the engine's chat helper (never as a command).
				const player = lib.playerOL?.[payload.accountId];
				if (player) {
					const text = document.createElement("span"); text.textContent = String(payload.text);
					player.say(text.innerHTML);
				}
			} else if (type === "game.finished") {
				finished = true;
				clearChoiceClock();
				const won = payload.results?.find(result => result.accountId === onlineState.account?.id)?.won;
				showStatus(won === null ? "本局平局" : won ? "此战告捷" : "胜负乃兵家常事", "对局已结算。返回房间可查看席位，等待房主开始下一局。", "返回房间", () => returnToOnlineLobby());
			} else if (type === "game.resumed") { statusPanel?.remove(); statusPanel = undefined; }
			else if (type === "game.failed") fail(new Error(payload.message));
			else if (type === "game.resumeFailed") fail(new Error("快照同步超时，可返回房间重新恢复。"));
			else if (type === "game.resumeExpired") fail(new Error("席位保留时间已过，本局由服务端继续托管。"));
			else if (type === "connection.closed" && !finished) {
				choiceToken = undefined;
				clearChoiceClock();
				const terminal = [4001,4002,4003,4004,1008].includes(payload.code);
				showStatus(terminal ? "连接已停止" : "连接中断，正在恢复", terminal ? (payload.code === 4003 ? "账号已被限制使用，请联系管理员。" : payload.code === 4004 ? "联机版本不兼容，请更新客户端。" : "登录状态发生变化，请返回大厅重新登录。") : "正在自动连接服务器。恢复成功后同步当前手牌、身份与回合，期间由服务器保持对局。", "返回房间", () => returnToOnlineLobby());
			} else if (type === "connection.restored" && !finished) {
				// Reload the presentation runtime to discard interrupted animations and
				// obsolete local events; the server retains the game, not the page.
				localStorage.setItem(lib.configprefix + "directstart", "true");
				window.onbeforeunload = null; game.reload();
			}
		});
		ui.create.menu(true);
		lib.init.onfree();
		attaching = command(onlineState.room.state === "in_game" ? "game.resume" : "game.attach", assignment).then(result => { seatGeneration = result.generation; });
		await attaching;
	} catch (error) { fail(error); }
}
function fail(error) { clearChoiceClock(); showStatus("暂时无法继续", error.message, "返回房间", () => returnToOnlineLobby()); }
