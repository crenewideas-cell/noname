import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { type Account, modePreset, OnlineError, text } from "@noname/online-protocol";
import { Rooms } from "./rooms";
import { Social } from "./social";
type Entry = { account: Account; modeId: string; capacity: number; region: string; since: number };
type Offer = { id: string; entries: Entry[]; accepted: Set<string>; deadline: number };
const maxInstances = () => Math.max(1, Math.min(32, Number(process.env.MAX_GAME_INSTANCES) || 2));
const maintenance = () => process.env.ONLINE_MAINTENANCE === "1" || !!process.env.MAINTENANCE_FILE && existsSync(process.env.MAINTENANCE_FILE);

/** Serializes room admission, invitations and queue cancellation against allocation. */
export class Activity {
  private queue: Promise<unknown> = Promise.resolve();
  private waiting = new Map<string, Entry>();
  private offers = new Map<string, Offer>();
  private timer: NodeJS.Timeout;
  constructor(private rooms: Rooms, private social: Social, private online: (id: string) => boolean, private publish: (id: string | null, type: string, payload: unknown) => void) {
    this.timer = setInterval(() => { void this.serial(() => this.tick()).catch(() => {}); }, 1000);
  }
  status() { return { queued: this.waiting.size, confirming: this.offers.size }; }
  private serial<T>(fn: () => Promise<T>) { const result = this.queue.then(fn); this.queue = result.catch(() => {}); return result; }
  state(id: string) {
    const entry = this.waiting.get(id), offer = [...this.offers.values()].find(value => value.entries.some(entry => entry.account.id === id));
    if (offer) return { state: "confirming", offerId: offer.id, deadline: offer.deadline, modeId: offer.entries[0].modeId, capacity: offer.entries.length, accepted: offer.accepted.has(id), acceptedCount: offer.accepted.size };
    if (entry) return { state: "queued", modeId: entry.modeId, capacity: entry.capacity, region: entry.region, since: entry.since, reason: this.rooms.hosts.count + this.offers.size >= maxInstances() ? "等待服务器空位" : "等待其他玩家" };
    return { state: "idle" };
  }
  private notify(id: string) { this.publish(id, "match.updated", this.state(id)); }
  private busy(id: string) { return this.state(id).state !== "idle"; }
  command(account: Account, type: string, payload: Record<string, any>, isCurrent = () => true) {
    return this.serial(async () => {
      if (!isCurrent()) throw new OnlineError("AUTH_EXPIRED", "此连接已失效");
      if (maintenance() && ["match.join", "match.accept", "room.create", "room.join", "room.start", "room.rematch", "invite.send", "invite.accept"].includes(type)) throw new OnlineError("MAINTENANCE", "服务器正在维护，暂不接受新的对局");
      if (type.startsWith("friend.")) return this.social.command(account, type, payload);
      if (type === "invite.send") {
        const room = this.rooms.current(account.id);
        if (!room || room.state !== "waiting" || room.members.length >= room.capacity) throw new OnlineError("ROOM_FULL", "当前房间不能邀请入席");
        return this.social.invite(account, text(payload.accountId, 36, 36), room.id);
      }
      if (type === "invite.accept" || type === "invite.reject") {
        const id = text(payload.inviteId, 36, 36), invitation = await this.social.invitation(id, account.id);
        if (type === "invite.reject") { await this.social.finishInvite(id, account.id, "rejected"); return {}; }
        if (this.busy(account.id) || this.rooms.current(account.id)) throw new OnlineError("ALREADY_IN_GAME", "先结束匹配或离开当前房间，再接受邀请");
        const room = await this.rooms.joinInvited(account, invitation.sender_id, invitation.room_id, payload.password);
        await this.social.finishInvite(id, account.id, "accepted"); return room;
      }
      if (type === "match.join") {
        const mode = modePreset(payload.modeId), region = process.env.MATCH_REGION || "default";
        if (!mode || !(mode.players as readonly number[]).includes(payload.capacity) || payload.preset !== mode.preset || payload.region !== region) throw new OnlineError("INVALID_ARGUMENT", "匹配规则或区域无效");
        if (payload.partyId || payload.members) throw new OnlineError("FORBIDDEN", "当前匹配仅支持单人排队；邀友请使用私房");
        if (this.rooms.current(account.id)) throw new OnlineError("ALREADY_IN_GAME", "请先离开当前房间");
        if (this.busy(account.id)) return this.state(account.id);
        if (this.waiting.size >= 1000) throw new OnlineError("SERVICE_BUSY", "匹配队列已满");
        this.waiting.set(account.id, { account, modeId: mode.id, capacity: payload.capacity, region, since: Date.now() });
        this.notify(account.id); await this.tick(); return this.state(account.id);
      }
      if (type === "match.cancel") {
        if (this.rooms.current(account.id) && !this.busy(account.id)) throw new OnlineError("MATCH_ASSIGNED", "对局已分配，请在房间中操作");
        await this.cancel(account.id); return this.state(account.id);
      }
      if (type === "match.accept" || type === "match.reject") {
        const offer = this.offers.get(String(payload.offerId));
        if (!offer || !offer.entries.some(entry => entry.account.id === account.id) || offer.deadline < Date.now()) throw new OnlineError("MATCH_EXPIRED", "匹配确认已过期");
        if (type === "match.reject") { await this.cancel(account.id); return this.state(account.id); }
        offer.accepted.add(account.id);
        for (const entry of offer.entries) this.notify(entry.account.id);
        if (offer.accepted.size === offer.entries.length) {
          try {
            if (offer.entries.some(entry => !this.online(entry.account.id))) throw new OnlineError("OFFLINE", "有玩家已断线");
            await this.rooms.createMatched(offer.entries.map(entry => entry.account), offer.entries[0].modeId, offer.entries.length);
            this.offers.delete(offer.id); for (const entry of offer.entries) this.notify(entry.account.id);
          } catch {
            this.requeue(offer);
            for (const entry of offer.entries) this.publish(entry.account.id, "match.notice", { message: "本次分配未完成，已保留原排队时间，等待重新分配。" });
          }
        }
        return this.state(account.id);
      }
      if ((type === "room.create" || type === "room.join") && this.busy(account.id)) throw new OnlineError("ALREADY_QUEUED", "请先取消匹配再进入房间");
      if (type === "room.start" && this.rooms.hosts.count + this.offers.size >= maxInstances()) throw new OnlineError("SERVICE_BUSY", "服务器暂无对局空位");
      return this.rooms.command(account, type, payload, isCurrent);
    });
  }
  private requeue(offer: Offer, exclude?: string) {
    this.offers.delete(offer.id);
    for (const entry of offer.entries) {
      if (entry.account.id !== exclude && offer.accepted.has(entry.account.id) && this.online(entry.account.id) && !this.rooms.current(entry.account.id)) this.waiting.set(entry.account.id, entry);
      this.notify(entry.account.id);
    }
  }
  private async cancel(id: string) {
    this.waiting.delete(id);
    const offer = [...this.offers.values()].find(value => value.entries.some(entry => entry.account.id === id));
    if (offer) this.requeue(offer, id);
    this.notify(id);
  }
  private async tick() {
    for (const offer of this.offers.values()) if (offer.deadline <= Date.now()) this.requeue(offer);
    for (const [id] of this.waiting) if (!this.online(id)) { this.waiting.delete(id); this.notify(id); }
    if (maintenance()) return;
    const groups = new Map<string, Entry[]>();
    for (const entry of [...this.waiting.values()].sort((a, b) => a.since - b.since || a.account.id.localeCompare(b.account.id))) {
      const key = [entry.modeId, entry.capacity, entry.region].join(":");
      const group = groups.get(key) || []; group.push(entry); groups.set(key, group);
    }
    for (const group of groups.values()) {
      while (group.length && group.length >= group[0].capacity && this.rooms.hosts.count + this.offers.size < maxInstances()) {
        const entries = group.splice(0, group[0].capacity), offer: Offer = { id: randomUUID(), entries, accepted: new Set(), deadline: Date.now() + 15000 };
        this.offers.set(offer.id, offer);
        for (const entry of entries) { this.waiting.delete(entry.account.id); this.notify(entry.account.id); }
      }
    }
  }
  presence(id: string, online: boolean) { return this.serial(async () => { if (!online) await this.cancel(id); await this.rooms.presence(id, online); await this.social.presence(id); }); }
  async close() { clearInterval(this.timer); await this.queue; }
}
