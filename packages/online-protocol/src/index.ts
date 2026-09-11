export const PROTOCOL_VERSION = 2;
export const ONLINE_BUILD = "online-phase3-v1";
export const RULESET = "identity-standard-v1";
export const ONLINE_MODES = [
  { id: "identity", name: "身份", preset: RULESET, players: [2, 4, 6, 8], characterPacks: ["standard"], cardPacks: ["standard"] },
  { id: "doudizhu", name: "斗地主", preset: "doudizhu-standard-v1", players: [3], characterPacks: ["standard"], cardPacks: ["standard"] },
] as const;
export function modePreset(id: unknown) { return ONLINE_MODES.find(mode => mode.id === id); }
export type SessionType = "offline" | "online";
export type RoomState = "waiting" | "starting" | "in_game" | "finished" | "closed";
export interface Account { id: string; code: string; nickname: string; avatar: string; }
export interface Member extends Account { ready: boolean; online: boolean; seat: number; resumeUntil?: number; abandoned?: boolean; }
export interface Room {
  id: string; code: string; name: string; ownerId: string; modeId: string;
  preset: string; capacity: number; visibility: "public" | "invite";
  locked: boolean; state: RoomState; revision: number; members: Member[];
  instanceId?: string; instanceReady?: boolean; createdAt: number;
}
export interface ChatMessage { id: string; accountId: string; nickname: string; text: string; at: number; }
export interface Command { protocolVersion: number; requestId: string; type: string; payload: Record<string, unknown>; }
export class OnlineError extends Error {
  constructor(public code: string, message: string) { super(message); }
}
export function text(value: unknown, min: number, max: number): string {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) throw new OnlineError("INVALID_ARGUMENT", "输入长度不符合要求");
  return value.trim();
}
/** Untrusted payloads must never reach the engine's function deserializer. */
export function assertData(value: unknown, depth = 0): void {
  if (depth > 16) throw new OnlineError("INVALID_ARGUMENT", "消息嵌套过深");
  if (typeof value === "string" && value.startsWith("_noname_func:")) throw new OnlineError("FORBIDDEN", "不允许发送可执行内容");
  if (typeof value === "number" && !Number.isFinite(value)) throw new OnlineError("INVALID_ARGUMENT", "无效数字");
  if (value && typeof value === "object") {
    if (Object.keys(value).length > 1024) throw new OnlineError("INVALID_ARGUMENT", "消息过大");
    for (const [key, item] of Object.entries(value)) {
      if (["__proto__", "constructor", "prototype"].includes(key)) throw new OnlineError("FORBIDDEN", "非法字段");
      assertData(item, depth + 1);
    }
  }
}
export function parseCommand(raw: string): Command {
  const value = JSON.parse(raw);
  assertData(value);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new OnlineError("INVALID_ARGUMENT", "消息格式无效");
  if (value.protocolVersion !== PROTOCOL_VERSION) throw new OnlineError("VERSION_MISMATCH", "联机协议版本不兼容，请更新客户端");
  text(value.requestId, 8, 100); text(value.type, 1, 64);
  if (!value.payload || typeof value.payload !== "object" || Array.isArray(value.payload)) throw new OnlineError("INVALID_ARGUMENT", "消息格式无效");
  return value;
}
