import type { IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";
import { WebSocket, WebSocketServer } from "ws";

import type { ServerInstance, ServerOptions } from "../types";

interface Client extends WebSocket {
	wsid: string;
	nickname: string;
	avatar: string;
	clientIp: string;
	onlineKey?: string;
	status?: string;
	owner?: Client;
	room?: Room;
	servermode?: boolean;
	beat?: boolean;
	keyCheck?: NodeJS.Timeout;
	heartbeat?: NodeJS.Timeout;
	tokens: number;
	lastMessageAt: number;
}

interface Room {
	key: string;
	owner?: Client;
	config?: any;
	servermode?: boolean;
}

interface EventItem {
	id: string;
	creator: string;
	nickname: string;
	avatar: string;
	utc: number;
	day: number;
	hour: number;
	content: string;
	members: string[];
}

export function createServer(options: ServerOptions = {}): ServerInstance {
	const port = options.port ?? 8082;
	const maxPayload = options.maxPayload ?? 2 * 1024 * 1024;
	const maxBufferedAmount = options.maxBufferedAmount ?? 8 * 1024 * 1024;
	const messageRate = options.messagesPerSecond ?? 300;
	for (const [name, value] of Object.entries({ maxPayload, maxBufferedAmount, messageRate, maxConnections: options.maxConnections ?? 1000, maxConnectionsPerIp: options.maxConnectionsPerIp ?? 32 })) {
		if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`Invalid ${name}: expected a positive integer`);
	}
	const isText = (value: unknown, max: number): value is string => typeof value === "string" && value.length > 0 && value.length <= max;
	const isConfig = (value: any) => value && typeof value === "object" && !Array.isArray(value)
		&& isText(value.mode, 64)
		&& Number.isInteger(Number(value.number)) && Number(value.number) >= 1 && Number(value.number) <= 16;

	const clients = new Map<string, Client>();
	const rooms = new Map<string, Room>();
	const events: EventItem[] = [];

	const bannedKeys = new Set<string>();
	const bannedIps = new Set<string>();
	const bannedKeyWords: string[] = [];

	let wss: WebSocketServer | undefined;
	let stopping: Promise<void> | undefined;
	let starting: Promise<void> | undefined;
	let broadcastTimer: NodeJS.Timeout | undefined;
	let roomsDirty = false;
	const scheduleBroadcast = (includeRooms: boolean) => {
		if (stopping) return;
		roomsDirty ||= includeRooms;
		if (broadcastTimer) return;
		broadcastTimer = setTimeout(() => {
			broadcastTimer = undefined;
			const roomList = roomsDirty ? util.buildRoomList() : undefined;
			roomsDirty = false;
			const clientList = util.buildClientList();
			clients.forEach(client => {
				if (client.room) return;
				if (roomList) util.sendl(client, "updaterooms", roomList, clientList);
				else util.sendl(client, "updateclients", clientList);
			});
		}, 100);
	};

	const clearClientTimers = (client: Client) => {
		clearTimeout(client.keyCheck);
		clearInterval(client.heartbeat);
	};
	const sendRaw = (client: Client, message: string) => {
		if (client.readyState !== WebSocket.OPEN) return;
		if (client.bufferedAmount + Buffer.byteLength(message) > maxBufferedAmount) {
			client.terminate();
			return;
		}
		client.send(message, error => { if (error) client.terminate(); });
	};

	const util = {
		nickname(str: any): string {
			return typeof str === "string" ? str.slice(0, 12) : "无名玩家";
		},

		isBanned(str: string): boolean {
			return bannedKeyWords.some(k => str.includes(k));
		},

		sendl(client: Client, ...args: any[]) {
			try {
				sendRaw(client, JSON.stringify(args));
			} catch {
				client.close();
			}
		},

		newId(): string {
			return randomUUID();
		},

		buildRoomList(): any[] {
			const roomList: any[] = [];
			const clientCount = new Map<string, number>();

			// init counter
			rooms.forEach((room, key) => clientCount.set(key, 0));

			// count clients per room
			clients.forEach(c => {
				if (c.room && !c.servermode) {
					const key = c.room.key;
					clientCount.set(key, (clientCount.get(key) || 0) + 1);
				}
			});

			// build output list
			rooms.forEach((room, key) => {
				const count = clientCount.get(key) || 0;
				if (room.servermode) {
					roomList.push("server");
				} else if (room.owner && room.config) {
					if (count === 0) {
						util.sendl(room.owner, "reloadroom");
					}
					roomList.push([room.owner.nickname, room.owner.avatar, room.config, count, room.key]);
				}
			});

			return roomList;
		},

		buildClientList(): any[] {
			const out: any[] = [];
			clients.forEach(c => {
				out.push([c.nickname, c.avatar, !c.room, c.status, c.wsid, c.onlineKey]);
			});
			return out;
		},

		updateRooms() {
			scheduleBroadcast(true);
		},

		updateClients() {
			scheduleBroadcast(false);
		},

		checkEvents() {
			const now = Date.now();
			for (let i = 0; i < events.length; i++) {
				if (events[i].utc <= now) {
					events.splice(i--, 1);
				}
			}
			return events;
		},

		updateEvents() {
			util.checkEvents();
			clients.forEach(c => {
				if (!c.room) util.sendl(c, "updateevents", events);
			});
		},
	};

	const handlers: Record<string, (client: Client, ...args: any[]) => void> = {
		create(client: Client, key: string, nickname: string, avatar: string, config: any, mode: string) {
			if (client.onlineKey !== key || client.room || rooms.has(key)) return util.sendl(client, "enterroomfailed", "duplicate");
			if (!isText(avatar, 256)) return;

			client.nickname = util.nickname(nickname);
			client.avatar = avatar;

			const room: Room = { key, owner: client };
			rooms.set(key, room);

			client.room = room;
			delete client.status;

			util.sendl(client, "createroom", key);
			util.updateRooms();
		},

		enter(client: Client, key: string, nickname: string, avatar: string) {
			const room = rooms.get(key);
			if (!room || !room.owner || room.owner.readyState !== WebSocket.OPEN) return util.sendl(client, "enterroomfailed", "missing");
			if (client.room || !isText(avatar, 256)) return util.sendl(client, "enterroomfailed", "duplicate");

			// The host verifies reconnect credentials and spectator policy after init.
			// Rejecting all started games here also locks out disconnected players.
			if (!room.config) {
				return util.sendl(client, "enterroomfailed", "gaming");
			}
			const count = [...clients.values()].filter(member => member.room === room && !member.servermode).length;
			if (!room.config.gameStarted && count >= Number(room.config.number)) return util.sendl(client, "enterroomfailed", "full");
			if (count >= 64) return util.sendl(client, "enterroomfailed", "full");
			client.nickname = util.nickname(nickname);
			client.avatar = avatar;
			client.room = room;
			delete client.status;

			client.owner = room.owner;
			util.sendl(room.owner, "onconnection", client.wsid);
			util.updateRooms();
		},

		changeAvatar(client: Client, nickname: string, avatar: string) {
			if (!isText(avatar, 256)) return;
			client.nickname = util.nickname(nickname);
			client.avatar = avatar;
			util.updateClients();
		},

		key(client: Client, id: any) {
			if (!Array.isArray(id) || !isText(id[0], 128) || (client.onlineKey && client.onlineKey !== id[0])) {
				util.sendl(client, "denied", "key");
				return client.close();
			}
			if (bannedKeys.has(id[0])) {
				bannedIps.add(client.clientIp);
				return client.close();
			}
			client.onlineKey = id[0];
			clearTimeout(client.keyCheck);
			util.updateClients();
		},

		events(client: Client, cfg: any, id: string, type: string) {
			if (bannedKeys.has(id) || typeof id !== "string" || client.onlineKey !== id) {
				bannedIps.add(client.clientIp);
				client.close();
				return;
			}

			let changed = false;
			const now = Date.now();

			if (typeof cfg === "string") {
				// join / leave existing event
				for (let ev of events) {
					if (ev.id === cfg) {
						if (type === "join" && !ev.members.includes(id)) {
							ev.members.push(id);
							changed = true;
						}
						if (type === "leave") {
							const idx = ev.members.indexOf(id);
							if (idx !== -1) {
								ev.members.splice(idx, 1);
								if (ev.members.length === 0) {
									const index = events.indexOf(ev);
									events.splice(index, 1);
								}
								changed = true;
							}
						}
					}
				}
			} else if (cfg && typeof cfg === "object" && Number.isFinite(cfg.utc) && Number.isInteger(cfg.day) && Number.isInteger(cfg.hour) && isText(cfg.content, 2000)) {
				if (events.length >= 20) util.sendl(client, "eventsdenied", "total");
				else if (cfg.utc <= now) util.sendl(client, "eventsdenied", "time");
				else if (util.isBanned(cfg.content)) util.sendl(client, "eventsdenied", "ban");
				else {
					const item: EventItem = {
						utc: cfg.utc,
						day: cfg.day,
						hour: cfg.hour,
						content: cfg.content,
						nickname: util.nickname(cfg.nickname),
						avatar: isText(cfg.avatar, 256) ? cfg.avatar : "caocao",
						creator: id,
						id: util.newId(),
						members: [id],
					};
					events.unshift(item);
					changed = true;
				}
			}

			if (changed) util.updateEvents();
		},

		config(client: Client, config: any) {
			const room = client.room;
			if (!room || room.owner !== client || !isConfig(config)) return;

			if (room.servermode) {
				room.servermode = false;
			}
			room.config = config;
			util.updateRooms();
		},

		status(client: Client, str: any) {
			if (typeof str === "string") client.status = str.slice(0, 120);
			else delete client.status;
			util.updateClients();
		},

		send(client: Client, id: string, message: string) {
			const target = clients.get(id);
			if (target && target.owner === client && isText(message, maxPayload)) {
				try {
					sendRaw(target, message);
				} catch {
					target.close();
				}
			}
		},

		close(client: Client, id: string) {
			const target = clients.get(id);
			if (target && target.owner === client) target.close();
		},
	};

	const handleConnection = (ws: WebSocket, req: IncomingMessage) => {
		const client = ws as Client;
		const ip = req.socket.remoteAddress ?? "";
		client.on("error", () => client.terminate());
		const origin = req.headers.origin;
		if (stopping || clients.size >= (options.maxConnections ?? 1000)
			|| [...clients.values()].filter(c => c.clientIp === ip).length >= (options.maxConnectionsPerIp ?? 32)
			|| (origin && options.allowedOrigins && !options.allowedOrigins.includes(origin))) {
			client.close(1008, "Connection policy");
			return;
		}

		// ban check
		if (bannedIps.has(ip)) {
			util.sendl(client, "denied", "banned");
			return setTimeout(() => ws.close(), 500);
		}

		client.wsid = util.newId();
		client.clientIp = ip;
		client.tokens = messageRate;
		client.lastMessageAt = Date.now();
		clients.set(client.wsid, client);

		client.keyCheck = setTimeout(() => {
			util.sendl(client, "denied", "key");
			setTimeout(() => client.close(), 500);
		}, 10000);

		util.sendl(client, "roomlist", util.buildRoomList(), util.checkEvents(), util.buildClientList(), client.wsid);

		// heartbeat
		client.on("pong", () => { client.beat = false; });
		client.heartbeat = setInterval(() => {
			if (client.beat) {
				client.terminate();
				clearInterval(client.heartbeat);
				return;
			}
			client.beat = true;
			try {
				client.ping();
			} catch {
				client.close();
			}
		}, 30000);

		// message handler
		client.on("message", (msg, isBinary) => {
			if (isBinary) return client.close(1003, "Text messages required");
			const now = Date.now();
			client.tokens = Math.min(messageRate, client.tokens + (now - client.lastMessageAt) * messageRate / 1000);
			client.lastMessageAt = now;
			if (client.tokens < 1) return client.close(1008, "Rate limit");
			client.tokens--;
			const raw = msg.toString();
			if (raw === "heartbeat") {
				client.beat = false;
				return;
			}

			// forward from slave to owner
			if (client.owner) {
				util.sendl(client.owner, "onmessage", client.wsid, raw);
				return;
			}

			let arr: any[];
			try {
				arr = JSON.parse(raw);
				if (!Array.isArray(arr) || arr.length < 2 || arr.length > 16) throw new Error();
			} catch {
				return client.close(1007, "Invalid message");
			}

			if (arr.shift() !== "server") return;

			const type = arr.shift();
			if (typeof type !== "string" || !Object.hasOwn(handlers, type)) return client.close(1008, "Unknown command");
			if (type !== "key" && !client.onlineKey) return client.close(1008, "Identify first");
			try { handlers[type](client, ...arr); }
			catch { client.close(1007, "Invalid arguments"); }
		});

		// disconnect handler
		client.on("close", () => {
			clearClientTimers(client);

			// remove rooms owned by this client
			rooms.forEach((room, key) => {
				if (room.owner === client) {
					// notify all clients in this room
					clients.forEach(c => {
						if (c.room === room && c !== client) {
							util.sendl(c, "selfclose");
							delete c.owner;
							delete c.room;
							c.close(1001, "Room closed");
						}
					});
					rooms.delete(key);
				}
			});

			// notify owner if client was slave
			if (client.owner) util.sendl(client.owner, "onclose", client.wsid);

			clients.delete(client.wsid);

			if (client.room) util.updateRooms();
			else util.updateClients();
		});
	};

	return {
		start() {
			if (stopping) return stopping.then(() => this.start());
			if (starting) return starting;
			if (wss) return Promise.resolve();

			starting = new Promise<void>((resolve, reject) => {
				const server = new WebSocketServer({ port, host: options.host, maxPayload, perMessageDeflate: false });

				const handleError = (error: Error) => {
					server.off("listening", handleListening);
					server.off("connection", handleConnection);
					wss = undefined;
					reject(error);
				};
				const handleListening = () => {
					server.off("error", handleError);
					server.on("error", error => console.error("Lobby server error", error));
					resolve();
				};

				server.once("error", handleError);
				server.once("listening", handleListening);
				server.on("connection", handleConnection);
				wss = server;
			}).finally(() => { starting = undefined; });
			return starting;
		},

		stop() {
			if (stopping) return stopping;
			if (starting) return starting.then(() => this.stop(), () => undefined);
			if (!wss) return Promise.resolve();

			const server = wss;
			wss = undefined;
			clearTimeout(broadcastTimer);
			broadcastTimer = undefined;
			roomsDirty = false;

			const curClients = [...clients];
			for (const [_, client] of curClients) {
				clearClientTimers(client);
				client.close(1001, "Server shutdown");
			}

			stopping = new Promise<void>((resolve, reject) => {
				const deadline = setTimeout(() => {
					for (const client of server.clients) client.terminate();
				}, 3000);
				server.close(error => {
					clearTimeout(deadline);
					if (error) reject(error);
					else resolve();
				});
			}).finally(() => { stopping = undefined; });
			return stopping;
		},
	};
}
