import { randomUUID, randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { GameHost, type HostEvent } from "@noname/game-host";
import { OnlineError, ONLINE_BUILD, modePreset, type Account, type Room, type ChatMessage, text } from "@noname/online-protocol";
import { Database, hashPassword, verifyPassword } from "./database";
type InternalRoom = { view: Room; passwordHash?: string; chat: ChatMessage[]; startupTimer?: NodeJS.Timeout; touchedAt?: number };
const maxInstances = () => Math.max(1, Math.min(4, Number(process.env.MAX_GAME_INSTANCES) || 2));
const maxRooms = () => Math.max(1, Math.min(10, Number(process.env.MAX_ROOMS) || 10));
const resumeGrace = () => Math.max(30000, Math.min(900000, Number(process.env.RESUME_GRACE_MS) || 120000));
const maintenance = () => process.env.ONLINE_MAINTENANCE === "1" || !!process.env.MAINTENANCE_FILE && existsSync(process.env.MAINTENANCE_FILE);
export class Rooms {
  readonly rooms = new Map<string, InternalRoom>();
  private active = new Map<string, string>();
  private queue: Promise<unknown> = Promise.resolve();
  private generations = new Map<string, number>();
  constructor(private db: Database, readonly hosts: GameHost, private publish: (accountId: string | null, type: string, payload: unknown) => void) {}
  async restore() {
    const rows = await this.db.loadRooms();
    for (const row of rows) {
      const view = row.document as Room;
      if (!view?.id || view.state !== row.state || !Array.isArray(view.members)) continue;
      delete view.instanceReady;
      const passwordHash = row.password_hash || undefined;
      // Phase 1/2 kept password hashes only in memory. Never restore such a
      // locked room as an unlocked room after a platform restart.
      if (view.locked && !passwordHash) {
        view.state = "closed";
        delete view.instanceId;
        await this.db.saveRoom(view);
        continue;
      }
      // Finished games retain abandoned seats for their result/history, but
      // those seats must not reclaim an account's newer room after restart.
      view.members = view.members.filter(member => !member.abandoned && !this.active.has(member.id))
        .map(member => { const restored = { ...member, online: false, ready: false }; delete restored.resumeUntil; return restored; });
      if (!view.members.length) {
        view.state = "closed"; delete view.instanceId;
        await this.db.saveRoom(view, passwordHash); continue;
      }
      if (!view.members.some(member => member.id === view.ownerId)) view.ownerId = view.members[0].id;
      if (view.state === "finished") delete view.instanceId;
      await this.db.saveRoom(view, passwordHash);
      const room: InternalRoom = { view, passwordHash, chat: [], touchedAt: new Date(row.updated_at).getTime() };
      this.rooms.set(view.id, room);
      for (const member of view.members) if (!this.active.has(member.id)) this.active.set(member.id, view.id);
    }
  }
  status() {
    const states: Record<string, number> = {};
    for (const room of this.rooms.values()) states[room.view.state] = (states[room.view.state] || 0) + 1;
    return { total: this.rooms.size, activeSeats: this.active.size, states };
  }
  async adminClose(roomId: string, message = "房间已由管理员关闭") {
    return this.serial(async () => {
      const room = this.rooms.get(roomId);
      if (!room || room.view.state === "closed") throw new OnlineError("ROOM_CLOSED", "房间不存在或已关闭");
      const instanceId = room.view.instanceId;
      if (instanceId) await this.hosts.stop(instanceId);
      room.view.state = "closed"; delete room.view.instanceId; delete room.view.instanceReady;
      await this.save(room);
      for (const member of room.view.members) {
        if (this.active.get(member.id) !== roomId) continue;
        this.active.delete(member.id);
        this.publish(member.id, instanceId ? "game.failed" : "room.left", { roomId, instanceId, message });
      }
      this.rooms.delete(roomId);
      return {};
    });
  }
  serial<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.queue.then(async () => {
      // The first release is one process. Serialize mutations and roll back memory
      // if persistence rejects, so an unsuccessful join cannot occupy a seat.
      const before = new Map([...this.rooms].map(([id, room]) => [id, { room, view: structuredClone(room.view), chat: room.chat.slice(), touchedAt: room.touchedAt }]));
      const activeBefore = new Map(this.active);
      const generationsBefore = new Map(this.generations);
      try { return await operation(); }
      catch (error) {
        this.rooms.clear();
        for (const [id, state] of before) { state.room.view = state.view; state.room.chat = state.chat; state.room.touchedAt = state.touchedAt; this.rooms.set(id, state.room); }
        this.active = activeBefore; this.generations = generationsBefore;
        throw error;
      }
    });
    this.queue = result.catch(() => {}); return result;
  }
  private require(id: string, accountId: string) {
    const room = this.rooms.get(id);
    if (!room || room.view.state === "closed") throw new OnlineError("ROOM_CLOSED", "房间已关闭");
    if (this.active.get(accountId) !== id || !room.view.members.some(member => member.id === accountId && !member.abandoned)) throw new OnlineError("FORBIDDEN", "你不在此房间");
    return room;
  }
  private owner(room: InternalRoom, id: string) {
    if (room.view.ownerId !== id) throw new OnlineError("FORBIDDEN", "仅房主可以操作");
  }
  private transferOwner(room: InternalRoom) {
    const members = room.view.members.filter(member => !member.abandoned && this.active.get(member.id) === room.view.id);
    room.view.ownerId = members.find(member => member.online)?.id || members[0]?.id || "";
  }
  private waiting(room: InternalRoom) {
    if (room.view.state !== "waiting") throw new OnlineError("ALREADY_IN_GAME", "当前房间不能修改");
  }
  private async save(room: InternalRoom) {
    room.view.revision++;
    await this.db.saveRoom(structuredClone(room.view), room.passwordHash);
    room.touchedAt = Date.now();
    for (const member of room.view.members) if (this.active.get(member.id) === room.view.id) this.publish(member.id, "room.updated", room.view);
    this.publish(null, "rooms.changed", {});
  }
  list(accountId: string, query: Record<string, unknown>) {
    const mode = String(query.modeId || "identity"), keyword = String(query.q || "").trim().toLowerCase();
    const page = Math.max(1, Math.min(1000, Number(query.page) || 1));
    const list = [...this.rooms.values()].map(room => room.view).filter(room => room.state !== "closed" && room.modeId === mode
      && (room.visibility === "public" || this.active.get(accountId) === room.id)
      && (!keyword || room.name.toLowerCase().includes(keyword) || room.code.toLowerCase() === keyword)
      && (!query.state || query.state === "all" || room.state === query.state)
      && (!query.capacity || room.capacity === Number(query.capacity)))
      .sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id));
    const items = list.slice((page - 1) * 12, page * 12).map(room => {
      const authorized = this.active.get(accountId) === room.id;
      const result: Room = authorized ? { ...room, members: room.members.map(member => ({ ...member })) } : {
        id: room.id, code: room.code, name: room.name, ownerId: "", modeId: room.modeId, preset: room.preset,
        capacity: room.capacity, visibility: room.visibility, locked: room.locked, state: room.state,
        revision: room.revision, createdAt: room.createdAt,
        // Search results only need seat occupancy. Account identifiers,
        // player codes, presence and the worker instance stay private.
        members: room.members.map(member => ({ id: "", code: "", nickname: "", avatar: "", ready: false, online: false, seat: member.seat })),
      };
      return result;
    });
    return { items, total: list.length, page };
  }
  current(accountId: string) { const id = this.active.get(accountId); return id ? this.rooms.get(id)?.view : null; }
  read<T>(snapshot: () => T): Promise<T> { return this.queue.then(snapshot); }
  async command(account: Account, type: string, payload: Record<string, any>, isCurrent = () => true) {
    return this.serial(async () => {
      if (!isCurrent()) throw new OnlineError("AUTH_EXPIRED", "此连接已失效");
      if (maintenance() && ["room.create", "room.join", "room.start", "room.rematch"].includes(type)) throw new OnlineError("MAINTENANCE", "服务器正在维护，暂不接受新的对局");
      if (type === "room.create") {
        if (this.active.has(account.id)) throw new OnlineError("ALREADY_IN_GAME", "请先离开当前房间");
        if (this.rooms.size >= maxRooms()) throw new OnlineError("SERVICE_BUSY", "服务器房间数量已达上限，请稍后再试");
        const mode = modePreset(payload.modeId);
        if (!mode || payload.preset !== mode.preset || !(mode.players as readonly number[]).includes(payload.capacity)) throw new OnlineError("INVALID_ARGUMENT", "不支持此玩法或人数规则");
        if (!["public", "invite"].includes(payload.visibility)) throw new OnlineError("INVALID_ARGUMENT", "无效房间类型");
        const password = payload.password ? text(payload.password, 4, 64) : undefined;
        const room: InternalRoom = { view: {
          id: randomUUID(), code: randomBytes(6).toString("hex").toUpperCase(), name: text(payload.name, 1, 32), ownerId: account.id,
          modeId: mode.id, preset: mode.preset, capacity: payload.capacity, visibility: payload.visibility, locked: !!password,
          state: "waiting", revision: 0, members: [{ ...account, ready: false, online: true, seat: 0 }], createdAt: Date.now(),
        }, passwordHash: password ? await hashPassword(password) : undefined, chat: [] };
        await this.save(room); this.rooms.set(room.view.id, room); this.active.set(account.id, room.view.id);
        return room.view;
      }
      if (type === "room.join") {
        const code = payload.code ? text(payload.code, 1, 32).toUpperCase() : undefined;
        const room = code ? [...this.rooms.values()].find(item => item.view.code === code) : this.rooms.get(String(payload.roomId));
        if (!room || (room.view.visibility === "invite" && room.view.code !== code)) throw new OnlineError("ROOM_CLOSED", "房间不存在或邀请码无效");
        if (room.view.members.some(member => member.id === account.id) && this.active.get(account.id) === room.view.id) return room.view;
        if (this.active.has(account.id)) throw new OnlineError("ALREADY_IN_GAME", "请先离开当前房间");
        this.waiting(room);
        if (room.view.members.length >= room.view.capacity) throw new OnlineError("ROOM_FULL", "房间已满");
        if (room.passwordHash && !(await verifyPassword(String(payload.password || ""), room.passwordHash))) throw new OnlineError("FORBIDDEN", "房间密码不正确");
        let seat = 0; while (room.view.members.some(member => member.seat === seat)) seat++;
        room.view.members.push({ ...account, ready: false, online: true, seat });
        this.active.set(account.id, room.view.id); await this.save(room); return room.view;
      }
      const room = this.require(String(payload.roomId), account.id), view = room.view;
      if (payload.revision !== undefined && payload.revision !== view.revision) throw new OnlineError("STALE_REVISION", "房间状态已更新，请重试");
      if (type === "room.leave" || type === "room.kick") {
        const target = type === "room.kick" ? text(payload.accountId, 1, 100) : account.id;
        if (type === "room.kick") { this.owner(room, account.id); this.waiting(room); if (target === account.id) throw new OnlineError("INVALID_ARGUMENT", "请使用离房操作"); }
        const member = view.members.find(item => item.id === target);
        if (!member) throw new OnlineError("FORBIDDEN", "席位不存在");
        if (view.state === "starting") throw new OnlineError("ROOM_STARTING", "游戏正在分配，请稍后再离开");
        if (view.state === "in_game") {
          member.online = false; member.abandoned = true; delete member.resumeUntil;
          // The worker may already have crashed. Leaving the room still needs
          // to release the seat and let the remaining players continue/finish.
          await this.hosts.receive(view.instanceId!, { accountId: target, type: "disconnect" }).catch(() => {});
        } else view.members = view.members.filter(item => item.id !== target);
        if (this.active.get(target) === view.id) this.active.delete(target);
        if (view.ownerId === target) this.transferOwner(room);
        if (!view.members.length) view.state = "closed";
        await this.save(room); this.publish(target, "room.left", {});
        if (view.state === "closed") this.rooms.delete(view.id);
        return null;
      }
      if (type === "room.ready") {
        this.waiting(room);
        if (typeof payload.ready !== "boolean") throw new OnlineError("INVALID_ARGUMENT", "无效准备状态");
        view.members.find(item => item.id === account.id)!.ready = payload.ready;
      } else if (type === "room.update") {
        this.waiting(room); this.owner(room, account.id);
        view.name = text(payload.name, 1, 32); view.members.forEach(member => member.ready = false);
      } else if (type === "room.rematch") {
        this.owner(room, account.id);
        if (view.state !== "finished") throw new OnlineError("INVALID_ARGUMENT", "对局尚未结束");
        view.members = view.members.filter(member => this.active.get(member.id) === view.id);
        view.state = "waiting"; delete view.instanceId; delete view.instanceReady;
        view.members.forEach(member => { member.ready = false; delete member.abandoned; delete member.resumeUntil; });
      } else if (type === "room.start") {
        this.waiting(room); this.owner(room, account.id);
        if (view.members.length !== view.capacity || !view.members.every(member => member.ready && member.online)) throw new OnlineError("NOT_READY", "需要所有席位到齐并准备");
        if (this.hosts.count >= maxInstances()) throw new OnlineError("SERVICE_BUSY", "服务器对局已满，请稍后再试");
        view.state = "starting"; view.instanceId = randomUUID(); view.instanceReady = false;
        await this.save(room);
        const instanceId = view.instanceId;
        room.startupTimer = setTimeout(() => { void this.recoverHostFailure(room, instanceId); }, 120000);
        void this.hosts.start({ instanceId, roomId: view.id, modeId: view.modeId, build: process.env.ONLINE_BUILD_ID || ONLINE_BUILD, members: [...view.members].sort((a, b) => a.seat - b.seat) }, event => this.hostEvent(room, instanceId, event))
          .catch(() => this.recoverHostFailure(room, instanceId));
        return view;
      } else if (type === "room.chat") {
        const message: ChatMessage = { id: randomUUID(), accountId: account.id, nickname: account.nickname, text: text(payload.text, 1, 300), at: Date.now() };
        room.chat.push(message); if (room.chat.length > 100) room.chat.shift();
        for (const member of view.members) if (this.active.get(member.id) === view.id) this.publish(member.id, "room.chat", message);
        return message;
      } else throw new OnlineError("UNKNOWN_COMMAND", "未开放此操作");
      await this.save(room); return view;
    });
  }
  private hostEvent(room: InternalRoom, instanceId: string, event: HostEvent) {
    if (room.view.instanceId !== instanceId) return;
    if (event.type === "ready") {
      void this.serial(async () => {
        if (room.view.instanceId !== instanceId || room.view.state !== "starting") return;
        room.view.instanceReady = true;
        await this.save(room);
        for (const member of room.view.members) if (this.active.get(member.id) === room.view.id) this.publish(member.id, "game.assigned", { roomId: room.view.id, instanceId, modeId: room.view.modeId });
      }).catch(() => this.recoverHostFailure(room, instanceId));
    } else if (event.type === "started") {
      void this.serial(async () => {
        if (room.view.instanceId !== instanceId || room.view.state !== "starting") return;
        room.view.state = "in_game";
        await this.save(room);
        clearTimeout(room.startupTimer); room.startupTimer = undefined;
      }).catch(() => this.recoverHostFailure(room, instanceId));
    } else if (event.type === "resumed") {
      if (event.accountId) this.publish(event.accountId, "game.resumed", { instanceId });
    } else if (event.type === "resumeFailed") {
      if (event.accountId) this.publish(event.accountId, "game.resumeFailed", { instanceId });
    } else if (event.type === "choiceClosed") {
      if (event.accountId && this.active.get(event.accountId) === room.view.id) this.publish(event.accountId, "game.choiceClosed", { instanceId, token: event.token });
    } else if (event.type === "engine" || event.type === "choice") {
      if (event.accountId && room.view.members.some(member => member.id === event.accountId && this.active.get(member.id) === room.view.id)) this.publish(event.accountId, "game." + event.type, { instanceId, raw: event.raw, token: event.token, deadline: event.deadline });
    } else if (event.type === "finished") {
      void this.serial(async () => {
        if (room.view.instanceId !== instanceId || room.view.state === "finished") return;
        await this.db.saveResult(instanceId, room.view.id, event.results);
        room.view.state = "finished"; delete room.view.instanceId; delete room.view.instanceReady;
        room.view.members.forEach(member => { member.ready = false; delete member.resumeUntil; });
        await this.save(room);
        clearTimeout(room.startupTimer); room.startupTimer = undefined;
        for (const member of room.view.members) if (this.active.get(member.id) === room.view.id) this.publish(member.id, "game.finished", { roomId: room.view.id, instanceId, results: event.results });
        await this.hosts.stop(instanceId);
      }).catch(() => this.recoverHostFailure(room, instanceId));
    } else if (event.type === "failed") void this.recoverHostFailure(room, instanceId);
  }
  private async recoverHostFailure(room: InternalRoom, instanceId: string) {
    try { await this.hostFailed(room, instanceId); }
    catch (error: any) {
      console.error("Online game host failure cleanup failed", { roomId: room.view.id, instanceId, message: String(error?.message || error).slice(0, 300) });
      if (room.view.instanceId === instanceId) {
        clearTimeout(room.startupTimer);
        room.startupTimer = setTimeout(() => { void this.recoverHostFailure(room, instanceId); }, 5000);
      }
    }
  }
  private hostFailed(room: InternalRoom, instanceId: string) {
    return this.serial(async () => {
      if (room.view.instanceId !== instanceId || room.view.state === "finished") return;
      const startupTimer = room.startupTimer;
      await this.hosts.stop(instanceId);
      room.view.state = room.view.state === "starting" ? "waiting" : "finished";
      delete room.view.instanceId; delete room.view.instanceReady;
      room.view.members.forEach(member => { member.ready = false; delete member.resumeUntil; });
      await this.save(room);
      clearTimeout(startupTimer); room.startupTimer = undefined;
      for (const member of room.view.members) if (this.active.get(member.id) === room.view.id) this.publish(member.id, "game.failed", { instanceId, message: "托管实例未能继续运行，已释放对局资源。请返回房间重试。" });
    });
  }
  async gameCommand(accountId: string, type: string, payload: Record<string, any>, isCurrent = () => true) {
    return this.serial(async () => {
    if (!isCurrent()) throw new OnlineError("AUTH_EXPIRED", "此连接已失效");
    const room = this.require(String(payload.roomId), accountId);
    if (!room.view.instanceId || room.view.instanceId !== payload.instanceId) throw new OnlineError("RESUME_EXPIRED", "对局已结束或分配已失效");
    if (this.active.get(accountId) !== room.view.id) throw new OnlineError("FORBIDDEN", "你已离开此对局");
    const member = room.view.members.find(member => member.id === accountId)!;
    if (member.abandoned || member.resumeUntil && member.resumeUntil < Date.now()) throw new OnlineError("RESUME_EXPIRED", "席位保留时间已过");
    if (!["attach", "resume", "inited", "reinited", "result", "auto"].includes(type)) throw new OnlineError("FORBIDDEN", "无效游戏操作");
    if (!["starting", "in_game"].includes(room.view.state)) throw new OnlineError("RESUME_EXPIRED", "对局不可用");
    if (type === "attach" || type === "resume") {
      if (!room.view.instanceReady) throw new OnlineError("ROOM_STARTING", "托管实例正在准备，请稍后重试");
      const generation = (this.generations.get(accountId) || 0) + 1; this.generations.set(accountId, generation);
      await this.hosts.receive(room.view.instanceId, { accountId, type: room.view.state === "in_game" ? "resume" : "attach", payload: { ...payload, generation } });
      return { generation };
    }
    if (payload.generation !== this.generations.get(accountId)) throw new OnlineError("STALE_GENERATION", "此连接的席位控制权已失效");
    await this.hosts.receive(room.view.instanceId, { accountId, type, payload });
    if (type === "inited" || type === "reinited") {
      delete member.resumeUntil;
      member.online = true;
      await this.save(room);
    }
    return {};
    });
  }
  async presence(accountId: string, online: boolean) {
    return this.serial(async () => {
      const view = this.current(accountId); if (!view) return;
      const room = this.rooms.get(view.id)!; const member = view.members.find(item => item.id === accountId)!;
      member.online = online;
      if (!online) {
        member.ready = false;
        if (view.instanceId && ["starting", "in_game"].includes(view.state)) {
          member.resumeUntil ||= Date.now() + resumeGrace();
          this.generations.set(accountId, (this.generations.get(accountId) || 0) + 1);
          await this.hosts.receive(view.instanceId, { accountId, type: "disconnect" }).catch(() => {});
        }
      }
      if ((!online && view.ownerId === accountId) || !view.members.some(item => item.id === view.ownerId && !item.abandoned && this.active.get(item.id) === view.id)) this.transferOwner(room);
      await this.save(room);
    });
  }
  async cleanup() {
    await this.serial(async () => {
      for (const [id, room] of this.rooms) {
        for (const member of room.view.members) {
          if (member.resumeUntil && member.resumeUntil < Date.now() && !member.abandoned) {
            member.abandoned = true; member.online = false; delete member.resumeUntil;
            const wasActive = this.active.get(member.id) === id;
            if (wasActive) this.active.delete(member.id);
            if (room.view.ownerId === member.id) this.transferOwner(room);
            if (wasActive) this.generations.set(member.id, (this.generations.get(member.id) || 0) + 1);
            if (room.view.instanceId) await this.hosts.receive(room.view.instanceId, { accountId: member.id, type: "disconnect" }).catch(() => {});
            if (wasActive) this.publish(member.id, "game.resumeExpired", { roomId: id });
            await this.save(room);
          }
        }
        if (!["waiting", "finished"].includes(room.view.state) || room.view.members.some(member => member.online) || Date.now() - (room.touchedAt || room.view.createdAt) < 10 * 60000) continue;
        room.view.state = "closed"; await this.save(room);
        for (const member of room.view.members) if (this.active.get(member.id) === id) this.active.delete(member.id);
        this.rooms.delete(id);
      }
    });
  }
  async createMatched(accounts: Account[], modeId: string, capacity: number) {
    const mode = modePreset(modeId);
    if (!mode || !(mode.players as readonly number[]).includes(capacity) || accounts.length !== capacity) throw new OnlineError("INVALID_ARGUMENT", "匹配规则无效");
    const view = await this.serial(async () => {
      if (accounts.some(account => this.active.has(account.id))) throw new OnlineError("ALREADY_IN_GAME", "匹配玩家已进入其他房间");
      const room: InternalRoom = { view: { id: randomUUID(), code: randomBytes(6).toString("hex").toUpperCase(), name: mode.name + " · 匹配对局", ownerId: accounts[0].id,
        modeId, preset: mode.preset, capacity, visibility: "invite", locked: false, state: "waiting", revision: 0, createdAt: Date.now(),
        members: accounts.map((account, seat) => ({ ...account, seat, ready: true, online: true })) }, chat: [] };
      await this.save(room);
      this.rooms.set(room.view.id, room); for (const account of accounts) this.active.set(account.id, room.view.id);
      return room.view;
    });
    try { return await this.command(accounts[0], "room.start", { roomId: view.id }); }
    catch (error) {
      await this.serial(async () => {
        const room = this.rooms.get(view.id)!; room.view.state = "closed"; await this.save(room);
        for (const account of accounts) { this.active.delete(account.id); this.publish(account.id, "room.left", {}); }
        this.rooms.delete(view.id);
      });
      throw error;
    }
  }
  async joinInvited(account: Account, senderId: string, roomId: string, password: unknown) {
    const room = this.rooms.get(roomId);
    if (!room || !room.view.members.some(member => member.id === senderId)) throw new OnlineError("INVITE_EXPIRED", "邀请者已离开房间");
    return this.command(account, "room.join", { code: room.view.code, password });
  }
  async close() {
    for (const room of this.rooms.values()) clearTimeout(room.startupTimer);
    await this.queue;
    await this.hosts.close();
  }
}
