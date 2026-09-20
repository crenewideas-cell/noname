import { lib, game, ui, get, _status } from "noname";
import { command, onlineState, restoreAccount, onOnlineEvent, disconnectPlatform, onlineId, prepareRoomNavigation } from "./client";
import { security } from "@/util/sandbox.js";
import { assertOnlineCharacterResources } from "./characterPool.js";
import { installSkillControls } from "./ui/skillControls.js";
import { installOpeningUI } from "./ui/openingDialog.js";
import "./ui/online.css";

let statusPanel;
let assignment;
let unsubscribe;
let choiceToken;
let rejectedChoiceToken;
let finished = false;
let leaving = false;
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
	if (leaving) return;
	if (leave) await leaveManagedRoom(true);
	else if (onlineState.status === "connected") await prepareRoomNavigation("lobby");
	clearChoiceClock();
	game.closeOnlineOpening?.(); game.renderOpeningStage?.(null);
	sessionStorage.removeItem("noname_online_game");
	sessionStorage.setItem("noname_online_return", assignment?.modeId || onlineState.room?.modeId || "identity");
	sessionStorage.setItem(lib.configprefix + "return_to_lobby", "true");
	localStorage.removeItem(lib.configprefix + "directstart");
	for (const key of ["reconnect_info", "directstartmode", "tmp_user_roomId", "tmp_owner_roomId"]) await game.promises.saveConfig(key);
	leaving = true;
	choiceToken = undefined;
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
		assertOnlineCharacterResources();
		installSkillControls();
		installOpeningUI();
		game.onlineID = onlineState.account.id;
		_status.ip = "online-platform";
		// Force the existing engine sandbox without the legacy "trust this IP" prompt.
		game.requireSandboxOn();
		game.sandbox = security.createSandbox(_status.ip);
		lib.config.recentIP ||= [];
		game.ws = { readyState: 1, bufferedAmount: 0, send() {}, close: disconnectPlatform };
		game.disconnect = disconnectPlatform;
		// Legacy exit controls must use the same full-reload navigation as the
		// settlement panel, rather than re-entering the old connect event loop.
		ui.click.exit = () => { void returnToOnlineLobby(!finished && !_status.over).catch(fail); };
		// Associate results with the prompt that created the event. A late UI
		// callback must never borrow the token of a later server choice.
		const eventTokens = new WeakMap(), resultTokens = new WeakMap();
		const choiceEvents = new Map();
		const closedChoices = new Set();
		let pendingPrompt, openingChoice = false, flushScheduled = false;
		const closeChoice = token => {
			if (pendingPrompt?.token === token) pendingPrompt = undefined;
			const active = token && eventTokens.get(_status.event) === token;
			const queued = _status.event?.name === "game" && _status.event.next.some(event => eventTokens.get(event) === token);
			for (const event of choiceEvents.get(token) || []) {
				event.finish();
				event.dialog?.close?.();
				event.control?.close?.();
			}
			choiceEvents.delete(token);
			if (active) {
				game.stopCountChoose();
				ui.confirm?.close();
				game.uncheck();
				_status.imchoosing = false;
				game.resume();
			} else if (queued) game.resume();
		};
		let dispatchToken;
		const dispatchEngine = payload => {
			try {
				dispatchToken = payload.token;
				const type = lib.element.ws.onmessage.call(game.ws, { data: payload.raw });
				if (type === "gameStart") { statusPanel?.remove(); statusPanel = undefined; }
			} catch (error) {
				console.error("Online engine message failed", error);
				fail(new Error("对局资源同步失败，请返回房间。"));
			} finally { dispatchToken = undefined; }
		};
		const flushPrompt = () => {
			flushScheduled = false;
			if (!pendingPrompt || finished || leaving) return;
			if (pendingPrompt.token !== choiceToken || closedChoices.has(pendingPrompt.token)) { pendingPrompt = undefined; return; }
			const event = _status.eventManager.getStartedEvent();
			// Only startOnline can declare itself ready for a new prompt. State
			// broadcasts may have queued children while it was paused: requiring
			// next.length === 0 deadlocks, since this prompt's resume() is what
			// lets waitNext() drain those children in the first place.
			if (!event?._onlineWaiting || event.finished || eventTokens.has(event) || !_status.paused) return;
			const prompt = pendingPrompt;
			pendingPrompt = undefined;
			event._onlineWaiting = false;
			dispatchEngine(prompt);
		};
		const schedulePrompt = () => {
			if (!pendingPrompt || flushScheduled) return;
			flushScheduled = true;
			queueMicrotask(flushPrompt);
		};
		lib.announce.subscribe("Noname.Game.Online.Waiting", schedulePrompt);
		lib.announce.subscribe("Noname.Game.Event.Changed", schedulePrompt);
		const createEvent = game.createEvent, startEvent = lib.element.GameEvent.prototype.start;
		game.createEvent = function (...args) {
			const event = createEvent.apply(this, args);
			const token = dispatchToken || eventTokens.get(_status.event);
			if (token) {
				eventTokens.set(event, token);
				if (closedChoices.has(token)) event.finish();
				else {
					if (!choiceEvents.has(token)) choiceEvents.set(token, new Set());
					choiceEvents.get(token).add(event);
				}
			}
			return event;
		};
		lib.element.GameEvent.prototype.start = async function (...args) {
			const token = eventTokens.get(this);
			try {
				await startEvent.apply(this, args);
				if (token && this.result && typeof this.result === "object") resultTokens.set(this.result, token);
			} finally {
				const events = choiceEvents.get(token);
				events?.delete(this);
				if (events && !events.size) choiceEvents.delete(token);
			}
		};
		const submit = async (result, token) => {
			if (!token || token !== choiceToken) return;
			choiceToken = undefined;
			clearChoiceClock();
      try { await attaching; await command("game.result", { ...assignment, token, turnId: token, expectedRevision: token, actionId: onlineId(), generation: seatGeneration, result: get.stringifiedResult(result) }); }
			catch (error) {
				if (finished || leaving || choiceToken || closedChoices.has(token)) return;
				rejectedChoiceToken = token;
				// A rejected result is still pending on the host. Offer its snapshot
				// and prompt again instead of claiming it will advance on its own.
				showStatus("选择提交未完成", error.message + "。可重新同步当前选择；超过行动时限后由服务端托管。", "重新同步", reloadManagedGame);
			}
		};
		game.submitOpeningChoice = (result, token) => {
			game.closeOnlineOpening(token);
			return submit(result, token);
		};
		game.send = (type, ...args) => {
			if (type === "result") {
				// startOnline submits the same result object produced by its child.
				// Never relabel an old result with the current parent event's token.
				const event = _status.event;
				const directToken = event?.result === args[0] || event?._result === args[0] ? eventTokens.get(event) : undefined;
				void submit(args[0], resultTokens.get(args[0]) || directToken);
				return true;
			}
			if (type === "inited" || type === "reinited") { void (async () => { await attaching; await command("game." + type, { ...assignment, generation: seatGeneration }); })().catch(fail); return true; }
			if (type === "auto" || type === "unauto") { void (async () => { await attaching; await command("game.auto", { ...assignment, generation: seatGeneration, enabled: type === "auto" }); })().catch(fail); return true; }
			if (type === "chat") { void command("room.chat", { roomId: assignment.roomId, text: String(args[1] || "") }).catch(fail); return true; }
			// The public protocol has no exec, eval, edit-state or client result reporting.
			return false;
		};
		const stopListening = onOnlineEvent((type, payload) => {
			if (leaving) return;
			if (payload?.instanceId && payload.instanceId !== assignment.instanceId) return;
			if (type === "game.choice") {
				if (finished) return;
				if (rejectedChoiceToken) { rejectedChoiceToken = undefined; statusPanel?.remove(); statusPanel = undefined; }
				choiceToken = payload.token;
				openingChoice = !!payload.opening;
				// The matching engine prompt carries the token. Do not relabel an
				// earlier live event/result merely because a new request has arrived.
				if (payload.opening) clearChoiceClock();
				else showChoiceClock(payload.deadline);
			} else if (type === "game.choiceClosed") {
				game.closeOnlineOpening(payload.token);
				closedChoices.add(payload.token);
				closeChoice(payload.token);
				if (closedChoices.size > 256) closedChoices.delete(closedChoices.values().next().value);
				if (payload.token === choiceToken) { choiceToken = undefined; clearChoiceClock(); }
				if (payload.token === rejectedChoiceToken) { rejectedChoiceToken = undefined; statusPanel?.remove(); statusPanel = undefined; }
			} else if (type === "game.engine") {
				if (finished || payload.token && payload.token !== choiceToken) return;
				if (payload.token && !openingChoice) {
					pendingPrompt = payload;
					schedulePrompt();
				} else dispatchEngine(payload);
			} else if (type === "room.chat") {
				// Render as text through the engine's chat helper (never as a command).
				const player = lib.playerOL?.[payload.accountId];
				if (player) {
					const text = document.createElement("span"); text.textContent = String(payload.text);
					player.say(text.innerHTML);
				}
			} else if (type === "game.finished") {
				pendingPrompt = undefined;
				game.closeOnlineOpening(); game.renderOpeningStage(null);
				finished = true;
				choiceToken = undefined;
				clearChoiceClock();
				_status.over = true;
				game.stopCountChoose();
				game.pause();
				for (const player of [...game.players, ...game.dead]) player.hideTimer();
				ui.confirm?.close();
				ui.tempnowuxie?.close();
				ui.auto?.hide(); ui.wuxie?.hide();
				const won = payload.results?.find(result => result.accountId === onlineState.account?.id)?.won;
				showStatus(won === true ? "战斗胜利" : won === false ? "战斗失败" : won === null ? "本局平局" : "本局已结束", "对局已结算。返回房间后，房主可选择“再来一局”。", "返回房间", () => returnToOnlineLobby());
			} else if (type === "game.resumed" && !finished) { statusPanel?.remove(); statusPanel = undefined; }
			else if (type === "game.failed") fail(new Error(payload.message));
			else if (type === "game.resumeFailed") fail(new Error("快照同步超时，可返回房间重新恢复。"));
			else if (type === "game.resumeExpired") fail(new Error("席位保留时间已过，本局由服务端继续托管。"));
			else if (type === "connection.closed" && !finished) {
				pendingPrompt = undefined;
				game.closeOnlineOpening(); game.renderOpeningStage(null);
				choiceToken = undefined;
				clearChoiceClock();
				const terminal = [4001,4002,4003,4004,1008].includes(payload.code);
				showStatus(terminal ? "连接已停止" : "连接中断，正在恢复", terminal ? (payload.code === 4003 ? "账号已被限制使用，请联系管理员。" : payload.code === 4004 ? "联机版本不兼容，请更新客户端。" : "登录状态发生变化，请返回大厅重新登录。") : "正在自动连接服务器。恢复成功后同步当前手牌、身份与回合，期间由服务器保持对局。", "返回房间", () => returnToOnlineLobby());
			} else if (type === "connection.restored" && !finished) {
				// Reload the presentation runtime to discard interrupted animations and
				// obsolete local events; the server retains the game, not the page.
				void reloadManagedGame().catch(fail);
			}
		});
		unsubscribe = () => {
			pendingPrompt = undefined;
			stopListening();
			lib.announce.unsubscribe("Noname.Game.Online.Waiting", schedulePrompt);
			lib.announce.unsubscribe("Noname.Game.Event.Changed", schedulePrompt);
		};
		ui.create.menu(true);
		lib.init.onfree();
		attaching = command(onlineState.room.state === "in_game" ? "game.resume" : "game.attach", assignment).then(result => { seatGeneration = result.generation; });
		await attaching;
	} catch (error) { fail(error); }
}
async function reloadManagedGame() {
	await prepareRoomNavigation("game", assignment?.instanceId);
	localStorage.setItem(lib.configprefix + "directstart", "true");
	window.onbeforeunload = null; game.reload();
}
function fail(error) { if (finished || leaving) return; clearChoiceClock(); game.closeOnlineOpening?.(); game.renderOpeningStage?.(null); showStatus("暂时无法继续", error.message, "返回房间", () => returnToOnlineLobby()); }
