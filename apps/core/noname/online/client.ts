import { reactive } from "vue";
import { PROTOCOL_VERSION, ONLINE_BUILD, type Account, type Room, type ChatMessage } from "@noname/online-protocol";
export const onlineState = reactive({
  account: null as Account | null, room: null as Room | null, rooms: [] as Room[], total: 0,
  status: "idle", error: "", csrf: "", chat: [] as ChatMessage[], recovery: "",
  match: { state: "idle" } as any, social: { friends: [], blocked: [], invites: [] } as any,
  // Login goes straight to the socket ticket flow. Initialize the build here
  // so a fresh login does not send an empty build before /me is restored.
  region: "default", resumeGraceMs: 120000, reconnectAttempt: 0, maintenance: false,
  build: import.meta.env.VITE_ONLINE_BUILD_ID || ONLINE_BUILD,
});
let socket: WebSocket | undefined;
let handshake: Promise<void> | undefined;
let intentional = false;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let socialTimer: ReturnType<typeof setTimeout> | undefined;
let recoveryStarted = 0;
let generation = 0;
let allowMultiOpen = false;
let sessionToken = sessionStorage.getItem("noname_online_session") || "";
const pending = new Map<string, { resolve: (value: any) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> }>();
const listeners = new Set<(type: string, payload: any) => void>();
export function onlineId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16); crypto.getRandomValues(bytes);
  bytes[6] = bytes[6] & 0x0f | 0x40; bytes[8] = bytes[8] & 0x3f | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export async function copyOnlineText(value: string) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(value); return; } catch { /* Use the HTTP-compatible fallback. */ }
  }
  const input = document.createElement("textarea");
  input.value = value; input.readOnly = true;
  input.style.cssText = "position:fixed;left:-9999px;top:0";
  document.body.append(input); input.select();
  try { if (!document.execCommand("copy")) throw new Error("复制未完成，请手动复制页面上的房间码"); }
  finally { input.remove(); }
}
export const onOnlineEvent = (listener: (type: string, payload: any) => void) => { listeners.add(listener); return () => listeners.delete(listener); };
function emitLocal(type: string, payload: any) {
  for (const listener of listeners) { try { listener(type, payload); } catch (error) { console.error("Online event handler failed", error); } }
}
const terminalErrors = ["AUTH_EXPIRED", "ACCOUNT_BLOCKED", "VERSION_MISMATCH", "FORBIDDEN"];
function invalidateAccount(code: string, message: string) {
  disconnectPlatform(); clearAccount();
  onlineState.status = "blocked"; onlineState.error = message;
  emitLocal("connection.closed", { code: code === "ACCOUNT_BLOCKED" ? 4003 : 4002 });
}
// Development uses Vite's same-origin proxy; production uses the configured
// server origin. No server address is exposed as a player input field.
const base = import.meta.env.DEV ? location.origin : (import.meta.env.VITE_ONLINE_ORIGIN || location.origin);
export async function api(path: string, body?: unknown) {
  const requestGeneration = generation;
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 12000);
  const headers: Record<string, string> = body === undefined ? {} : { "Content-Type": "application/json", "X-CSRF-Token": onlineState.csrf };
  if (allowMultiOpen && sessionToken) headers.Authorization = `Bearer ${sessionToken}`;
  try {
    const response = await fetch(new URL("/api/v1" + path, base), { credentials: allowMultiOpen ? "omit" : "include", signal: controller.signal,
      method: body === undefined ? "GET" : "POST", headers,
      body: body === undefined ? undefined : JSON.stringify(body) });
    const data = await response.json().catch(() => ({ ok: false, code: "SERVICE_UNAVAILABLE", message: "联机服务暂时不可用，请稍后重试" }));
    if (!response.ok || data.ok === false) {
      if (data.code === "MAINTENANCE") onlineState.maintenance = true;
      if (["AUTH_EXPIRED", "ACCOUNT_BLOCKED"].includes(data.code) && requestGeneration === generation
        && !["/auth/login", "/auth/register", "/auth/recover"].includes(path)) invalidateAccount(data.code, data.message || "请重新登录");
      throw Object.assign(new Error(data.message || "联机服务暂不可用"), { code: data.code });
    }
    return data;
  } catch (error: any) { if (error.name === "AbortError") throw new Error("服务器响应超时，请稍后重试"); throw error; }
  finally { clearTimeout(timer); }
}
export async function restoreAccount() {
  const restoreGeneration = generation;
  const caps = await api("/capabilities");
  if (restoreGeneration !== generation) return;
  allowMultiOpen = caps.multiOpen === true;
  const rejectVersion = (message: string): never => {
    disconnectPlatform(); onlineState.status = "blocked"; onlineState.error = message;
    emitLocal("connection.closed", { code: 4004 });
    throw Object.assign(new Error(message), { code: "VERSION_MISMATCH" });
  };
  if (caps.protocolVersion !== PROTOCOL_VERSION) rejectVersion("联机版本不兼容，请更新客户端");
  // A Vite development client has no release manifest of its own. Use the
  // server build for development while keeping release clients strict.
  onlineState.build = import.meta.env.DEV ? caps.build : (import.meta.env.VITE_ONLINE_BUILD_ID || ONLINE_BUILD);
  onlineState.region = caps.region; onlineState.resumeGraceMs = caps.resumeGraceMs;
  onlineState.maintenance = caps.maintenance === true;
  if (!import.meta.env.DEV && onlineState.build !== caps.build) rejectVersion("客户端资源与服务器版本不一致，请更新客户端");
  try {
    const result = await api("/me");
    if (restoreGeneration !== generation) return;
    onlineState.account = result.account; onlineState.csrf = result.csrf; onlineState.room = result.room; onlineState.match = result.match;
    await connectPlatform();
  } catch (error: any) { if (error.code !== "AUTH_EXPIRED") throw error; }
}
export async function login(kind: "register" | "login" | "recover", body: unknown) {
  const caps = await api("/capabilities");
  if (caps.protocolVersion !== PROTOCOL_VERSION) throw Object.assign(new Error("联机协议版本不兼容，请更新客户端"), { code: "VERSION_MISMATCH" });
  allowMultiOpen = caps.multiOpen === true;
  onlineState.region = caps.region; onlineState.resumeGraceMs = caps.resumeGraceMs;
  onlineState.maintenance = caps.maintenance === true;
  // Registration and login can be the first online request, before
  // restoreAccount() runs. Sync the development build before opening the WS.
  if (import.meta.env.DEV) onlineState.build = caps.build;
  const data = await api("/auth/" + kind, body);
  if (data.recovery) onlineState.recovery = data.recovery;
  if (kind === "recover") return;
  if (allowMultiOpen && typeof data.sessionToken === "string") {
    sessionToken = data.sessionToken;
    sessionStorage.setItem("noname_online_session", sessionToken);
  } else if (!allowMultiOpen) {
    sessionToken = "";
    sessionStorage.removeItem("noname_online_session");
  }
  onlineState.account = data.account; onlineState.csrf = data.csrf;
  await connectPlatform();
}
export async function logout() {
  if (onlineState.room) throw new Error("请先离开当前房间再退出账号");
  await api("/auth/logout", {}); disconnectPlatform(); clearAccount();
}
function clearAccount() {
  sessionToken = "";
  sessionStorage.removeItem("noname_online_session");
  onlineState.account = null; onlineState.room = null; onlineState.csrf = ""; onlineState.status = "guest";
  onlineState.social = { friends: [], blocked: [], invites: [] }; onlineState.match = { state: "idle" };
  onlineState.chat = []; onlineState.rooms = []; onlineState.total = 0; onlineState.recovery = ""; onlineState.maintenance = false;
}
export function command(type: string, payload: Record<string, unknown>) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return Promise.reject(new Error("连接已断开，请重新连接"));
  const requestId = onlineId();
  return new Promise<any>((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error("请求超时，请刷新状态后重试")); }, 15000);
    pending.set(requestId, { resolve, reject, timer });
    try { socket!.send(JSON.stringify({ protocolVersion: PROTOCOL_VERSION, requestId, type, payload })); }
    catch (error: any) { clearTimeout(timer); pending.delete(requestId); reject(error instanceof Error ? error : new Error("请求发送失败")); }
  });
}
export async function connectPlatform() {
  if (socket?.readyState === WebSocket.OPEN && onlineState.status === "connected") return;
  if (handshake) return handshake;
  const attemptGeneration = generation;
  handshake = (async () => {
    intentional = false; onlineState.status = "connecting";
    const { ticket } = await api("/socket-ticket", {});
    const url = new URL("/ws/v1", base); url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    if (attemptGeneration !== generation) return;
    const protocols = allowMultiOpen && sessionToken ? ["noname-auth." + sessionToken] : undefined;
    const next = socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => { next.close(); reject(new Error("联机连接超时")); }, 12000);
      next.onmessage = event => {
        if (socket !== next) return;
        let message: any;
        try { message = JSON.parse(event.data); } catch { next.close(1002, "Invalid message"); return; }
        if (message.requestId) {
          const item = pending.get(message.requestId); if (!item) return;
          clearTimeout(item.timer); pending.delete(message.requestId);
          if (message.ok) item.resolve(message.payload); else { if (message.code === "MAINTENANCE") onlineState.maintenance = true; item.reject(Object.assign(new Error(message.message), { code: message.code })); }
          return;
        }
        if (message.type === "room.updated") onlineState.room = message.payload;
        if (message.type === "room.left") { onlineState.room = null; onlineState.chat = []; }
        if (message.type === "room.chat") { onlineState.chat.push(message.payload); if (onlineState.chat.length > 100) onlineState.chat.shift(); }
        if (message.type === "match.updated") onlineState.match = message.payload;
        if (message.type === "social.changed") { clearTimeout(socialTimer); socialTimer = setTimeout(() => { void loadSocial().catch(() => {}); }, 150); }
        for (const listener of listeners) { try { listener(message.type, message.payload); } catch (error) { console.error("Online event handler failed", error); } }
      };
      next.onopen = async () => {
        if (socket !== next) { next.close(); return; }
        try {
          const result = await command("session.authenticate", { ticket, build: onlineState.build });
          if (socket !== next || intentional) { next.close(); reject(new Error("连接已取消")); return; }
          onlineState.room = result.room; onlineState.match = result.match; onlineState.status = "connected"; onlineState.error = "";
          const recovered = onlineState.reconnectAttempt > 0;
          onlineState.reconnectAttempt = 0; recoveryStarted = 0; clearTimeout(reconnectTimer); reconnectTimer = undefined;
          clearTimeout(timeout); resolve();
          void loadSocial().catch(() => {});
          if (recovered) emitLocal("connection.restored", {});
        } catch (error: any) {
          clearTimeout(timeout);
          if (socket === next && terminalErrors.includes(error?.code)) {
            if (["AUTH_EXPIRED", "ACCOUNT_BLOCKED"].includes(error.code)) invalidateAccount(error.code, error.message);
            else { disconnectPlatform(); onlineState.status = "blocked"; onlineState.error = error.message; emitLocal("connection.closed", { code: 4004 }); }
          }
          next.close(); reject(error);
        }
      };
      next.onerror = () => { clearTimeout(timeout); next.close(); reject(new Error("无法连接联机服务，请检查网络")); };
      next.onclose = event => {
        clearTimeout(timeout);
        if (socket !== next) { reject(new Error("连接已取消")); return; }
        for (const item of pending.values()) { clearTimeout(item.timer); item.reject(new Error("联机连接已断开")); }
        pending.clear(); socket = undefined;
        onlineState.status = intentional ? (onlineState.account ? "idle" : "guest") : "disconnected";
        if (!intentional) {
          emitLocal("connection.closed", { code: event.code });
          if (![4001, 4002, 4003, 4004, 1008].includes(event.code)) scheduleReconnect();
          else {
            disconnectPlatform();
            if (event.code !== 4004) clearAccount();
            onlineState.error = event.code === 4001 ? "账号已在其他窗口登录" : event.code === 4003 ? "账号已被限制使用" : event.code === 4004 ? "联机版本不兼容，请更新客户端" : "登录状态已失效，请重新登录";
            onlineState.status = "blocked";
          }
        }
        reject(new Error("连接已断开，请重新连接"));
      };
    });
  })().catch(error => {
    if (attemptGeneration === generation && !intentional && onlineState.status !== "blocked") {
      onlineState.status = onlineState.account ? "disconnected" : "guest";
      onlineState.error = error?.message || "联机连接失败";
    }
    throw error;
  }).finally(() => { handshake = undefined; });
  return handshake;
}
export function disconnectPlatform() {
  generation++; intentional = true; recoveryStarted = 0; onlineState.reconnectAttempt = 0;
  clearTimeout(reconnectTimer); reconnectTimer = undefined; clearTimeout(socialTimer);
  const previous = socket; socket = undefined;
  for (const item of pending.values()) { clearTimeout(item.timer); item.reject(new Error("联机连接已断开")); }
  pending.clear(); previous?.close(1000, "Leaving lobby");
  onlineState.status = onlineState.account ? "idle" : "guest";
}
export async function loadSocial() { const id = onlineState.account?.id; if (id) { const result = await api("/social"); if (onlineState.account?.id === id) onlineState.social = result; } }
function scheduleReconnect() {
  if (intentional || reconnectTimer || !onlineState.account) return;
  recoveryStarted ||= Date.now();
  if (Date.now() - recoveryStarted > onlineState.resumeGraceMs) {
    onlineState.status = "blocked"; onlineState.error = "自动重连已超时，请重新进入大厅查询对局状态"; return;
  }
  onlineState.reconnectAttempt++;
  const delay = Math.min(10000, 1000 * 2 ** Math.min(onlineState.reconnectAttempt - 1, 4)) * (.8 + Math.random() * .4);
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = undefined;
    if (intentional) return;
    try { await restoreAccount(); }
    catch (error: any) {
      if (terminalErrors.includes(error.code)) { disconnectPlatform(); onlineState.status = "blocked"; onlineState.error = error.message; }
      else scheduleReconnect();
    }
  }, delay);
}
export async function searchRooms(modeId: string, q = "", page = 1, state = "all", capacity = "") {
  const result = await api("/rooms?" + new URLSearchParams({ modeId, q, page: String(page), state, capacity }));
  onlineState.rooms = result.items; onlineState.total = result.total;
}
