import { game, lib, get, _status } from "noname";
import { security } from "@/util/sandbox.js";

export function normalizeAddress(value) {
	if (typeof value !== "string" || !value.trim()) throw new Error("请输入联机地址。");
	const address = value.trim();
	if (/\s/.test(address)) throw new Error("联机地址中不能包含空格或换行。");
	const explicit = /^[a-z][a-z\d+.-]*:\/\//i.test(address);
	const secure = location.protocol === "https:" || get.config("wss_mode", "connect");
	// A bare IPv6 address must be bracketed before passing it to URL.
	const host = !explicit && (address.match(/:/g) || []).length > 1 && !address.startsWith("[") ? `[${address}]` : address;
	let url;
	try { url = new URL(explicit ? address : `${secure ? "wss" : "ws"}://${host}`); }
	catch { throw new Error("地址格式无效，请输入主机:端口或 ws:// / wss:// 地址。"); }
	if (!["ws:", "wss:"].includes(url.protocol) || url.username || url.password || url.hash) {
		throw new Error("仅支持不含账号、密码及片段的 WS/WSS 地址。");
	}
	if (location.protocol === "https:" && url.protocol !== "wss:") throw new Error("HTTPS 页面须连接 WSS 安全地址。");
	const hasPort = /:\d+$/.test(address.split(/[/?#]/)[0]);
	if (!explicit && !hasPort && !url.port && url.pathname === "/") url.port = "8080";
	return url.href;
}

export function connect(ip, callback) {
	if (game.online || (game.ws && game.ws.readyState <= WebSocket.OPEN)) {
		callback?.(false, "已有连接或正在连接，请先取消当前连接。");
		return;
	}
	let url;
	try { url = normalizeAddress(ip); }
	catch (error) { callback?.(false, error.message); if (!callback) alert(error.message); return; }
	disconnect();
	let socket;
	try {
		game.requireSandboxOn(ip.trim());
		game.sandbox = security.createSandbox(ip.trim());
		socket = new WebSocket(url);
	} catch (error) {
		game.sandbox = null;
		callback?.(false, "无法建立连接，请检查地址与安全设置。");
		return;
	}
	game.ws = socket;
	_status.ip = ip.trim();
	let settled = false;
	let timeout;
	const finish = (success, reason) => {
		if (settled) return;
		settled = true;
		clearTimeout(timeout);
		callback?.(success, reason);
	};
	socket._cancelConnect = () => finish(false, "已取消连接。");
	timeout = setTimeout(() => {
		if (game.ws !== socket) return;
		disconnect(false);
		finish(false, "连接超时（12 秒），请检查服务器地址、端口和网络后重试。");
	}, 12000);
	// A TCP/WebSocket open alone is not a successful game handshake. Restore the
	// player's identity immediately before dispatching the first protocol message.
	socket.onmessage = event => {
		if (game.ws !== socket) return;
		if (typeof event.data !== "string" || event.data.length > 4 * 1024 * 1024) {
			socket.close(4009, "Message too large");
			return;
		}
		if (!settled && event.data !== "heartbeat") {
			let message;
			try { message = JSON.parse(event.data); } catch { return; }
			if (!Array.isArray(message)) return;
			if (message[0] === "opened" || message[0] === "roomlist") finish(true);
			else if (message[0] === "denied") finish(false, "服务器拒绝连接，请检查版本或访问权限。");
			else return;
		}
		if (game.ws !== socket) return;
		try { lib.element.ws.onmessage.call(socket, event); }
		catch (error) {
			console.error("联机协议处理失败", error);
			socket.close(4007, "Invalid protocol message");
		}
	};
	socket.onerror = () => {
		if (game.ws !== socket) return;
		if (!settled) {
			disconnect(false);
			finish(false, "连接失败，请检查服务是否启动、端口是否开放及证书是否有效。");
		}
	};
	socket.onclose = event => {
		if (game.ws !== socket || socket._nocallback) return;
		const established = settled;
		finish(false, "服务器已断开连接，请重试。");
		if (game.ws !== socket) return;
		if (established) lib.element.ws.onclose.call(socket, event);
		else { game.ws = null; game.sandbox = null; }
	};
}

export function disconnect(notify = true) {
	const socket = game.ws;
	game.ws = null;
	if (socket) {
		socket._nocallback = true;
		socket.close(1000, "Leaving session");
		if (notify) socket._cancelConnect?.();
	}
	for (const resolve of Object.values(game.dataRequestMap)) resolve(false, "网络连接已断开");
	game.sandbox = null;
}
