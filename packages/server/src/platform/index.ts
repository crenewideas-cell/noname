import Fastify from "fastify";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { Database, secret, digest } from "./database";
import { Rooms } from "./rooms";
import { Social } from "./social";
import { Activity } from "./activity";
import { GameHost } from "@noname/game-host";
import { ONLINE_MODES, ONLINE_BUILD, PROTOCOL_VERSION, OnlineError, parseCommand, text, type Account } from "@noname/online-protocol";

export async function createPlatform() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  const allowMultiOpen = process.env.ALLOW_MULTI_OPEN === "1";
  const origin = new URL(process.env.PUBLIC_ORIGIN || "http://localhost:8081").origin;
  const secure = origin.startsWith("https:");
  const build = process.env.ONLINE_BUILD_ID || ONLINE_BUILD;
  const resumeGraceMs = Math.max(30000, Math.min(900000, Number(process.env.RESUME_GRACE_MS) || 120000));
  const app = Fastify({ trustProxy: process.env.TRUST_PROXY === "1", bodyLimit: 32 * 1024, logger: { redact: ["req.headers.cookie", "req.headers.authorization", "body.password", "body.recovery"] } });
  const db = new Database(databaseUrl);
  await db.migrate();
  const maxGameInstances = Math.max(1, Math.min(4, Number(process.env.MAX_GAME_INSTANCES) || 2));
  const hosts = new GameHost({ clientUrl: process.env.HOST_CLIENT_URL || "http://127.0.0.1:8081/index.html", executablePath: process.env.CHROMIUM_PATH, maxInstances: maxGameInstances });
  const tickets = new Map<string, { account: Account; sessionHash: string; expires: number }>();
  const sockets = new Map<string, WebSocket>();
  const socketAuth = new Map<WebSocket, { token: string; csrf: string }>();
  const limits = new Map<string, { count: number; expires: number }>();
  const metrics = { connections: 0, commands: 0, failedCommands: 0 };
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let sequence = 0;
  let stopping = false;
  function send(socket: WebSocket, message: unknown) {
    if (socket.readyState !== WebSocket.OPEN) return;
    const encoded = JSON.stringify(message);
    if (socket.bufferedAmount + Buffer.byteLength(encoded) > 8 * 1024 * 1024) { socket.terminate(); return; }
    socket.send(encoded, error => { if (error) socket.terminate(); });
  }
  function publish(accountId: string | null, type: string, payload: unknown) {
    const event = { protocolVersion: PROTOCOL_VERSION, type, payload, eventId: randomUUID(), streamId: "platform", sequence: ++sequence };
    if (accountId) { const socket = sockets.get(accountId); if (socket) send(socket, event); }
    else for (const socket of sockets.values()) send(socket, event);
  }
  const rooms = new Rooms(db, hosts, publish);
  await rooms.restore();
  const social = new Social(db, id => sockets.get(id)?.readyState === WebSocket.OPEN, publish);
  const activity = new Activity(rooms, social, id => sockets.get(id)?.readyState === WebSocket.OPEN, publish);
  const cookieToken = (request: { headers: { cookie?: string } }) => request.headers.cookie?.split(";").map(value => value.trim()).find(value => value.startsWith("noname_session="))?.slice(15);
  const bearerToken = (request: { headers: { authorization?: string } }) => request.headers.authorization?.match(/^Bearer\s+([A-Za-z0-9_-]{32,})$/i)?.[1];
  // Multi-open test sessions use a per-window bearer token. The default path
  // remains the original HttpOnly cookie session.
  const sessionToken = (request: any) => allowMultiOpen ? (bearerToken(request) || cookieToken(request)) : cookieToken(request);
  const websocketToken = (request: { headers: { "sec-websocket-protocol"?: string } }) => {
    if (!allowMultiOpen) return undefined;
    return String(request.headers["sec-websocket-protocol"] || "").split(",").map(value => value.trim())
      .find(value => value.startsWith("noname-auth."))?.slice("noname-auth.".length);
  };
  const authenticate = (request: any) => db.authenticate(sessionToken(request));
  function rate(key: string, max: number, ms: number) {
    const old = limits.get(key), now = Date.now();
    const item = old && old.expires > now ? old : { count: 0, expires: now + ms };
    item.count++; limits.set(key, item);
    if (item.count > max) throw new OnlineError("RATE_LIMIT", "操作过于频繁，请稍后重试");
  }
  app.addHook("onRequest", async request => {
    rate("http:" + request.ip, 240, 60000);
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      if (request.headers.origin !== origin) throw new OnlineError("FORBIDDEN", "请求来源不被允许");
      if (["POST", "PUT", "PATCH"].includes(request.method) && !request.headers["content-type"]?.startsWith("application/json")) throw new OnlineError("INVALID_ARGUMENT", "请使用 JSON 请求");
    }
  });
  app.setErrorHandler((error: any, request, reply) => {
    const known = error instanceof OnlineError;
    if (!known) request.log.error({ code: error.code, message: error.message }, "Platform request failed");
    reply.code(error.code === "AUTH_EXPIRED" ? 401 : error.code === "ACCOUNT_BLOCKED" ? 403 : error.code === "RATE_LIMIT" ? 429 : known ? 400 : 500)
      .send({ ok: false, code: known ? error.code : "SERVER_ERROR", message: known ? error.message : "服务暂不可用，请稍后重试" });
  });
  app.get("/healthz", async () => ({ ok: true }));
  app.get("/readyz", async () => { await db.pool.query("SELECT 1"); return { ok: true }; });
  const maintenance = () => process.env.ONLINE_MAINTENANCE === "1" || !!process.env.MAINTENANCE_FILE && existsSync(process.env.MAINTENANCE_FILE);
  app.get("/api/v1/capabilities", async (_request, reply) => { reply.header("Cache-Control", "no-store"); return { ok: true, protocolVersion: PROTOCOL_VERSION, build, modes: ONLINE_MODES, friends: true, matchmaking: true, automaticResume: true, multiOpen: allowMultiOpen, maintenance: maintenance(), region: process.env.MATCH_REGION || "default", resumeGraceMs }; });
  app.get("/api/v1/admin/status", async (request, reply) => {
    const expected = process.env.ADMIN_STATUS_TOKEN;
    const supplied = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!expected || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) throw new OnlineError("FORBIDDEN", "管理状态凭据无效");
    const accounts = await db.pool.query("SELECT count(*)::int AS count FROM online_accounts");
    // Deployment enables maintenance before reading this endpoint. Wait for
    // already accepted room mutations so a pending start cannot look idle.
    const roomStatus = await rooms.read(() => rooms.status());
    reply.header("Cache-Control", "no-store");
    return { ok: true, build, maintenance: maintenance(), accounts: accounts.rows[0].count, activeBans: await db.banCount(), sockets: sockets.size, rooms: roomStatus, matchmaking: activity.status(), hosts: { active: hosts.count, limit: maxGameInstances }, metrics, memory: process.memoryUsage() };
  });
  const requireAdmin = (request: any) => {
    const expected = process.env.ADMIN_STATUS_TOKEN;
    const supplied = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!expected || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) throw new OnlineError("FORBIDDEN", "管理凭据无效");
  };
  app.post("/api/v1/admin/accounts/:accountId/ban", async request => {
    requireAdmin(request);
    const body = request.body as any, accountId = text((request.params as any).accountId, 36, 36);
    if (!uuidPattern.test(accountId)) throw new OnlineError("INVALID_ARGUMENT", "账号标识无效");
    const reason = text(body?.reason, 1, 200);
    let expiresAt: Date | undefined;
    if (body?.expiresAt !== undefined) { expiresAt = new Date(body.expiresAt); if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) throw new OnlineError("INVALID_ARGUMENT", "封禁截止时间无效"); }
    if (!(await db.setBan(accountId, reason, expiresAt))) throw new OnlineError("NOT_FOUND", "账号不存在");
    sockets.get(accountId)?.close(4003, "Account blocked");
    request.log.warn({ accountId, expiresAt: expiresAt?.toISOString() }, "Online account blocked");
    return { ok: true };
  });
  app.delete("/api/v1/admin/accounts/:accountId/ban", async request => {
    requireAdmin(request);
    const accountId = text((request.params as any).accountId, 36, 36);
    if (!uuidPattern.test(accountId)) throw new OnlineError("INVALID_ARGUMENT", "账号标识无效");
    return { ok: true, changed: await db.clearBan(accountId) };
  });
  app.post("/api/v1/admin/rooms/:roomId/close", async request => {
    requireAdmin(request);
    const roomId = text((request.params as any).roomId, 36, 36);
    if (!uuidPattern.test(roomId)) throw new OnlineError("INVALID_ARGUMENT", "房间标识无效");
    const message = text((request.body as any)?.message || "房间已由管理员关闭", 1, 200);
    request.log.warn({ roomId }, "Online room closed by administrator");
    return { ok: true, ...(await rooms.adminClose(roomId, message)) };
  });
  function credentials(body: any) {
    if (!body || typeof body !== "object") throw new OnlineError("INVALID_ARGUMENT", "请填写账号信息");
    const username = text(body.username, 3, 32).toLowerCase();
    if (!/^[a-z0-9_]+$/.test(username)) throw new OnlineError("INVALID_ARGUMENT", "用户名须为 3–32 位字母、数字或下划线");
    if (typeof body.password !== "string" || body.password.length < 10 || body.password.length > 128) throw new OnlineError("INVALID_ARGUMENT", "密码须为 10–128 个字符");
    const password = body.password;
    return { username, password };
  }
  const setSession = async (reply: any, account: Account) => {
    const session = await db.session(account.id);
    reply.header("Set-Cookie", `noname_session=${session.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200${secure ? "; Secure" : ""}`);
    return { ok: true, account, csrf: session.csrf, ...(allowMultiOpen ? { sessionToken: session.token } : {}) };
  };
  app.post("/api/v1/auth/register", async (request, reply) => {
    rate("auth:" + request.ip, 12, 60000);
    const body = request.body as any, { username, password } = credentials(body);
    const nickname = text(body.nickname, 1, 12);
    if (/[<>&\u0000-\u001f]/.test(nickname)) throw new OnlineError("INVALID_ARGUMENT", "昵称不能含有标签或控制字符");
    const { account, recovery } = await db.register(username, password, nickname);
    return { ...await setSession(reply, account), recovery };
  });
  app.post("/api/v1/auth/login", async (request, reply) => {
    rate("auth:" + request.ip, 12, 60000);
    const { username, password } = credentials(request.body);
    return setSession(reply, await db.login(username, password));
  });
  app.post("/api/v1/auth/recover", async request => {
    rate("recover:" + request.ip, 5, 60000);
    const body = request.body as any, { username, password } = credentials(body);
    const { recovery, accountId } = await db.recover(username, text(body.recovery, 32, 128), password);
    sockets.get(accountId)?.close(4002, "Credentials changed");
    return { ok: true, recovery };
  });
  app.get("/api/v1/me", async request => {
    const auth = await authenticate(request);
    return { ok: true, account: auth.account, csrf: auth.csrf, match: activity.state(auth.account.id), room: await rooms.read(() => structuredClone(rooms.current(auth.account.id))) };
  });
  const requireCsrf = async (request: any) => {
    const auth = await authenticate(request);
    if (request.headers["x-csrf-token"] !== auth.csrf) throw new OnlineError("FORBIDDEN", "页面会话已变化，请刷新");
    return auth;
  };
  app.post("/api/v1/auth/refresh", async (request, reply) => {
    const auth = await requireCsrf(request); await db.revoke(auth.tokenHash);
    sockets.get(auth.account.id)?.close(4002, "Session renewed");
    return setSession(reply, auth.account);
  });
  app.post("/api/v1/auth/logout", async (request, reply) => {
    const auth = await requireCsrf(request);
    if (rooms.current(auth.account.id)) throw new OnlineError("ALREADY_IN_GAME", "请先离开当前房间");
    await activity.command(auth.account, "match.cancel", {});
    await db.revoke(auth.tokenHash);
    sockets.get(auth.account.id)?.close(1000, "Logged out");
    // A multi-open window authenticates with its own bearer token. Clearing
    // the shared browser cookie would log out every other test window.
    if (!allowMultiOpen) reply.header("Set-Cookie", `noname_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`);
    return { ok: true };
  });
  app.post("/api/v1/socket-ticket", async request => {
    const auth = await requireCsrf(request), ticket = secret();
    if (tickets.size > 5000) throw new OnlineError("SERVICE_BUSY", "服务繁忙，请稍后再试");
    tickets.set(digest(ticket), { account: auth.account, sessionHash: auth.tokenHash, expires: Date.now() + 30000 });
    return { ok: true, ticket };
  });
  app.get("/api/v1/rooms", async request => { const auth = await authenticate(request); return { ok: true, ...await rooms.read(() => structuredClone(rooms.list(auth.account.id, request.query as any))) }; });
  app.get("/api/v1/session/active", async request => { const auth = await authenticate(request); return { ok: true, room: await rooms.read(() => structuredClone(rooms.current(auth.account.id))) }; });
  app.get("/api/v1/results", async request => {
    const auth = await authenticate(request);
    const { rows } = await db.pool.query("SELECT instance_id,room_id,results,created_at FROM online_results WHERE results @> $1::jsonb ORDER BY created_at DESC LIMIT 20", [JSON.stringify([{ accountId: auth.account.id }])]);
    return { ok: true, items: rows };
  });
  app.get("/api/v1/social", async request => { const auth = await authenticate(request); return { ok: true, ...await social.snapshot(auth.account.id) }; });
  app.get("/api/v1/players", async request => {
    const auth = await authenticate(request); rate("player-search:" + auth.account.id, 30, 60000);
    return { ok: true, account: await social.find(auth.account.id, (request.query as any).code) };
  });

  const wss = new WebSocketServer({
    noServer: true, maxPayload: 64 * 1024, perMessageDeflate: false,
    handleProtocols: protocols => [...protocols].find(value => value.startsWith("noname-auth.")) || false,
  });
  app.server.on("upgrade", (request, socket, head) => {
    void (async () => {
      if (request.url !== "/ws/v1" || request.headers.origin !== origin) throw new Error("Forbidden upgrade");
      const token = websocketToken(request) || sessionToken(request);
      const auth = await db.authenticate(token);
      rate("ws:" + auth.account.id, 10, 60000);
      if (wss.clients.size >= 1000) throw new Error("Connection limit");
      wss.handleUpgrade(request, socket, head, ws => {
        socketAuth.set(ws, { token: token!, csrf: auth.csrf });
        wss.emit("connection", ws);
      });
    })().catch(() => { socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n"); socket.destroy(); });
  });
  wss.on("connection", socket => {
    metrics.connections++;
    let account: Account | undefined, sessionHash = "", alive = true, chain = Promise.resolve(), queued = 0;
    let sessionExpiry: NodeJS.Timeout | undefined, checkingSession = false;
    const cache = new Map<string, { fingerprint: string; response: unknown }>();
    const handshake = setTimeout(() => socket.close(1008, "Authentication timeout"), 10000);
    socket.on("error", () => socket.terminate());
    socket.on("pong", () => { alive = true; });
    const heartbeat = setInterval(() => {
      if (!alive) { socket.terminate(); return; }
      if (socket.readyState !== WebSocket.OPEN) return;
      alive = false; socket.ping();
      // Idle clients still receive room/game pushes. Recheck revocation and
      // bans even when no business command arrives on this connection.
      if (!account || checkingSession) return;
      checkingSession = true;
      void db.authenticate(socketAuth.get(socket)?.token).catch(error => {
        if (socket.readyState !== WebSocket.OPEN) return;
        if (error instanceof OnlineError && error.code === "ACCOUNT_BLOCKED") socket.close(4003, "Account blocked");
        else if (error instanceof OnlineError && error.code === "AUTH_EXPIRED") socket.close(4002, "Session expired");
        else socket.close(1011, "Session check unavailable");
      }).finally(() => { checkingSession = false; });
    }, 30000);
    socket.on("message", (raw, binary) => {
      if (binary) { socket.close(1003); return; }
      if (++queued > 32) { socket.close(1008, "Too many pending commands"); return; }
      chain = chain.then(async () => {
        if (socket.readyState !== WebSocket.OPEN) return;
        let command: ReturnType<typeof parseCommand> | undefined;
        try {
          command = parseCommand(raw.toString());
          if (!account) {
            if (command.type !== "session.authenticate") throw new OnlineError("AUTH_EXPIRED", "需要身份验证");
            const key = digest(text(command.payload.ticket, 32, 128)), ticket = tickets.get(key); tickets.delete(key);
            const auth = await db.authenticate(socketAuth.get(socket)?.token);
            if (!ticket || ticket.expires < Date.now() || ticket.account.id !== auth.account.id || ticket.sessionHash !== auth.tokenHash) throw new OnlineError("AUTH_EXPIRED", "连接票据已失效");
            if (command.payload.build !== build) throw new OnlineError("VERSION_MISMATCH", "客户端资源版本与服务器不匹配");
            account = auth.account; sessionHash = auth.tokenHash;
            sessionExpiry = setTimeout(() => socket.close(4002, "Session expired"), Math.max(0, auth.expiresAt - Date.now()));
            const previous = sockets.get(account.id); if (previous && previous !== socket) previous.close(4001, "Session replaced");
            sockets.set(account.id, socket); clearTimeout(handshake);
            // Replacing a live connection also invalidates its seat generation.
            if (previous && previous !== socket) await activity.presence(account.id, false);
            await activity.presence(account.id, true);
            if (sockets.get(account.id) !== socket || socket.readyState !== WebSocket.OPEN) throw new OnlineError("AUTH_EXPIRED", "此连接已失效");
            send(socket, { requestId: command.requestId, ok: true, payload: { account, room: rooms.current(account.id), match: activity.state(account.id) } }); return;
          }
          if (sockets.get(account.id) !== socket) throw new OnlineError("AUTH_EXPIRED", "已在另一窗口登录");
          rate("command:" + account.id, 240, 60000);
          metrics.commands++;
          if (command.type === "invite.send" || command.type === "friend.request") rate("social:" + account.id, 10, 60000);
          if (command.type === "room.chat") rate("chat:" + account.id, 20, 10000);
          if (command.type === "room.join") rate("room-join:" + account.id, 60, 60000);
          const fingerprint = digest(raw.toString());
          // Validate the live session before serving an idempotent response. A
          // cached success must never survive logout, refresh, recovery or ban.
          const auth = await db.authenticate(socketAuth.get(socket)?.token);
          if (auth.tokenHash !== sessionHash || sockets.get(account.id) !== socket || socket.readyState !== WebSocket.OPEN) throw new OnlineError("AUTH_EXPIRED", "会话已变化");
          const cached = cache.get(command.requestId);
          if (cached) {
            if (cached.fingerprint !== fingerprint) throw new OnlineError("INVALID_ARGUMENT", "请求标识已被使用");
            send(socket, cached.response); return;
          }
          const payload = command.type.startsWith("game.")
            ? await rooms.gameCommand(account.id, command.type.slice(5), command.payload, () => sockets.get(account!.id) === socket && socket.readyState === WebSocket.OPEN)
            : await activity.command(account, command.type, command.payload, () => sockets.get(account!.id) === socket && socket.readyState === WebSocket.OPEN);
          const response = { requestId: command.requestId, ok: true, payload };
          app.log.info({ requestId: command.requestId, accountId: account.id, command: command.type, roomId: typeof command.payload.roomId === "string" ? command.payload.roomId : undefined, instanceId: typeof command.payload.instanceId === "string" ? command.payload.instanceId : undefined }, "Online command accepted");
          cache.set(command.requestId, { fingerprint, response: structuredClone(response) }); if (cache.size > 256) cache.delete(cache.keys().next().value!);
          send(socket, response);
        } catch (error: any) {
          metrics.failedCommands++;
          const code = error instanceof OnlineError ? error.code : "REQUEST_FAILED";
          send(socket, { requestId: command?.requestId, ok: false, code, message: error instanceof OnlineError ? error.message : "操作未完成，请刷新房间状态后重试" });
          if (code === "ACCOUNT_BLOCKED") socket.close(4003, "Account blocked");
          else if (code === "AUTH_EXPIRED") socket.close(4002, "Session expired");
          else if (code === "VERSION_MISMATCH") socket.close(4004, "Version mismatch");
          else if (!account) socket.close(1008);
        }
      }).catch(() => socket.close(1011)).finally(() => { queued--; });
    });
    socket.on("close", () => {
      clearTimeout(handshake); clearTimeout(sessionExpiry); clearInterval(heartbeat); socketAuth.delete(socket);
      if (account && sockets.get(account.id) === socket) { sockets.delete(account.id); if (!stopping) void activity.presence(account.id, false).catch(() => {}); }
    });
  });
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of tickets) if (value.expires < now) tickets.delete(key);
    for (const [key, value] of limits) if (value.expires < now) limits.delete(key);
    void rooms.cleanup().catch(error => app.log.error({ message: error.message }, "Room cleanup failed"));
    void db.pool.query("DELETE FROM online_sessions WHERE expires_at < now()").catch(() => {});
    void db.pool.query("DELETE FROM online_invites WHERE expires_at < now()-interval '1 day'").catch(() => {});
  }, 30000);
  app.addHook("preClose", async () => { stopping = true; clearInterval(cleanup); for (const socket of wss.clients) socket.terminate(); });
  app.addHook("onClose", async () => { wss.close(); await activity.close(); await rooms.close(); await db.close(); });
  return app;
}
