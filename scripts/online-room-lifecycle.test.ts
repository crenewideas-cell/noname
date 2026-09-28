import assert from "node:assert/strict";
import test from "node:test";
const { Rooms } = await import(process.env.R15_OLD_SERVER ? "../packages/server/src/platform/rooms.r15-before.ts" : "../packages/server/src/platform/rooms.ts");
import { RULESET, type Account, type Room } from "../packages/online-protocol/src/index.ts";
import { type HostEvent, type HostSpec } from "../packages/game-host/src/index.ts";

const owner: Account = { id: "owner", code: "OWNER", nickname: "1号位", avatar: "caocao" };
const guest: Account = { id: "guest", code: "GUEST", nickname: "2号位", avatar: "caocao" };
const createPayload = { name: "退出席位回归", modeId: "identity", preset: RULESET, capacity: 5, visibility: "public" };

async function fixture(t: any) {
  const saved = new Map<string, Room>(), stopped: string[] = [], events: any[] = [], results: any[] = [];
  let callback: (event: HostEvent) => void = () => {};
  const hosts = {
    count: 0,
    async start(_spec: HostSpec, emit: (event: HostEvent) => void) { callback = emit; },
    async stop(id: string) { stopped.push(id); }, async receive() {}, async close() {},
  };
  const db = {
    async saveRoom(view: Room) { saved.set(view.id, structuredClone(view)); },
    async deleteRoom(id: string) { saved.delete(id); },
    async saveResult(instanceId: string, roomId: string, value: unknown) { results.push({ instanceId, roomId, value }); },
  };
  const rooms = new Rooms(db as any, hosts as any, (id, type, payload) => events.push({ id, type, payload: structuredClone(payload) }));
  t.after(() => rooms.close());
  const room = await rooms.command(owner, "room.create", createPayload) as Room;
  const command = (account: Account, type: string, payload = {}) => rooms.command(account, type, { roomId: room.id, ...payload });
  const emit = async (event: HostEvent) => { callback(event); await rooms.read(() => {}); };
  await command(guest, "room.join");
  await command(owner, "room.ai", { seats: [2, 3, 4], enabled: true });
  await command(owner, "room.ready", { ready: true });
  await command(guest, "room.ready", { ready: true });
  await command(owner, "room.start");
  await emit({ type: "ready" });
  await emit({ type: "started" });
  return { rooms, saved, stopped, events, results, command, emit, id: room.id, instanceId: room.instanceId!,
    current: () => rooms.rooms.get(room.id)!.view };
}

for (const departing of [owner, guest]) {
  for (const ending of ["finished", "failed"] as const) {
    test(`${departing.nickname}主动退出后${ending}：结算释放席位，可直接重新入座再准备`, async t => {
      const f = await fixture(t);
      const remaining = departing === owner ? guest : owner;
      const seat = f.current().members.find(member => member.id === departing.id)!.seat;
      await f.command(departing, "room.leave");
      assert.equal(f.rooms.current(departing.id), null);
      assert.equal(f.current().members.length, 5, "对局中保留引擎席位");
      assert.equal(f.current().members.find(member => member.id === departing.id)!.abandoned, true);
      await f.rooms.presence(departing.id, true); // 已回大厅的连接不能重新激活旧席位。
      f.events.length = 0;
      const results = [{ accountId: owner.id, won: false }, { accountId: guest.id, won: true }];
      await f.emit(ending === "finished" ? { type: ending, results } : { type: ending });

      assert.equal(f.current().state, "finished");
      assert.equal(f.current().instanceId, undefined);
      assert.equal(f.current().ownerId, remaining.id);
      assert.equal(f.current().members.length, 4);
      assert(!f.current().members.some(member => member.id === departing.id));
      assert.equal(f.saved.get(f.id)!.members.length, 4);
      assert.equal(f.rooms.list(departing.id, {}).items[0].members.length, 4);
      const updates = f.events.filter(event => event.id === remaining.id && event.type === "room.updated");
      assert.equal(updates.at(-1).payload.members.length, 4);
      assert(f.events.some(event => event.id === null && event.type === "rooms.changed"));
      assert(!f.events.some(event => event.id === departing.id));
      assert(f.stopped.includes(f.instanceId));
      if (ending === "finished") assert.deepEqual(f.results[0].value, results, "离开者的结算记录仍保留");

      await f.command(departing, "room.join");
      assert.equal(f.current().state, "finished", "入房不自动开始下一局");
      assert.equal(f.current().ownerId, remaining.id);
      const member = f.current().members.find(member => member.id === departing.id)!;
      assert.equal(member.seat, seat);
      assert.equal(member.abandoned, undefined);
      assert.equal(member.online, true);
      assert.equal(member.ready, false);
      assert(f.current().members.filter(member => member.isAI).every(member => member.ready));
      await f.command(remaining, "room.rematch");
      await f.command(owner, "room.ready", { ready: true });
      await f.command(guest, "room.ready", { ready: true });
      await f.command(remaining, "room.start");
      assert.equal(f.current().state, "starting");
    });
  }
}

test("暂时断线但仍在房间的玩家在结算后保留席位，可以返回房间", async t => {
  const f = await fixture(t);
  await f.rooms.presence(owner.id, false);
  assert(f.current().members.find(member => member.id === owner.id)!.resumeUntil);
  await f.emit({ type: "finished", results: [] });
  assert.equal(f.current().members.length, 5);
  const member = f.current().members.find(member => member.id === owner.id)!;
  assert(member.resumeUntil && member.resumeUntil > Date.now());
  assert.equal(member.abandoned, undefined);
  assert.equal(f.rooms.current(owner.id)!.id, f.id);
  await f.rooms.presence(owner.id, true);
  assert.equal(member.online, true);
});

test("重连超时已释放的玩家在结算时清除，不再显示满员", async t => {
  const f = await fixture(t);
  await f.rooms.presence(owner.id, false);
  f.current().members.find(member => member.id === owner.id)!.resumeUntil = Date.now() - 1;
  await f.rooms.cleanup();
  assert.equal(f.rooms.current(owner.id), null);
  assert.equal(f.current().members.length, 5);
  await f.emit({ type: "finished", results: [] });
  assert.equal(f.current().members.length, 4);
  assert.equal(f.current().ownerId, guest.id);
  assert.equal(f.rooms.list(owner.id, {}).items[0].members.length, 4);
});

test("旧对局结算清理不能影响退出玩家新建的房间", async t => {
  const f = await fixture(t);
  await f.command(owner, "room.leave");
  const newRoom = await f.rooms.command(owner, "room.create", createPayload) as Room;
  f.events.length = 0;
  await f.emit({ type: "finished", results: [] });
  assert.equal(f.current().members.length, 4);
  assert.equal(f.rooms.current(owner.id)!.id, newRoom.id);
  assert.equal(f.saved.get(newRoom.id)!.members.length, 1);
  assert(!f.events.some(event => event.id === owner.id));
});

test("最后一个真人离房关闭房间，迟到的结算事件不能复活旧房间", async t => {
  const f = await fixture(t);
  await f.command(owner, "room.leave");
  await f.command(guest, "room.leave");
  await f.emit({ type: "finished", results: [] });
  assert.equal(f.rooms.rooms.size, 0);
  assert.equal(f.saved.size, 0);
  assert.equal(f.rooms.current(owner.id), null);
  assert.equal(f.rooms.current(guest.id), null);
});

test("结算后明确离开房间也立即释放席位", async t => {
  const f = await fixture(t);
  await f.emit({ type: "finished", results: [] });
  await f.command(owner, "room.leave");
  assert.equal(f.current().members.length, 4);
  assert.equal(f.current().ownerId, guest.id);
  assert.equal(f.saved.get(f.id)!.members.length, 4);
});

for (const viaCode of [false, true]) {
  test(`2号位结算后离房，可通过${viaCode ? "房间码" : "大厅列表"}立即重新加入`, async t => {
    const f = await fixture(t);
    await f.emit({ type: "finished", results: [] });
    await f.command(guest, "room.leave");
    const listed = f.rooms.list(guest.id, {}).items[0];
    assert.equal(listed.members.length, 4);
    const joined = await f.rooms.command(guest, "room.join", viaCode ? { code: listed.code } : { roomId: listed.id }) as Room;
    assert.equal(joined.state, "finished");
    assert.equal(joined.ownerId, owner.id);
    assert.equal(joined.members.find(member => member.id === guest.id)!.seat, 1);
    assert.equal(f.saved.get(f.id)!.members.length, 5);
    assert.equal(f.rooms.current(guest.id)!.id, f.id);
    await assert.rejects(f.command(guest, "room.ready", { ready: true }), { code: "ALREADY_IN_GAME" });
    await assert.rejects(f.command(guest, "room.rematch"), { code: "FORBIDDEN" });
    await assert.rejects(f.command(owner, "room.start"), { code: "ALREADY_IN_GAME" });
    await f.command(owner, "room.rematch");
    await f.command(owner, "room.ready", { ready: true });
    await f.command(guest, "room.ready", { ready: true });
    await f.command(owner, "room.start");
    assert.equal(f.current().state, "starting");
  });
}

test("已结算房间仍校验密码、容量及玩家已有房间，重复加入不占双席", async t => {
  const f = await fixture(t);
  await f.emit({ type: "finished", results: [] });
  const newcomer = { ...guest, id: "newcomer" };
  await assert.rejects(f.command(newcomer, "room.join"), { code: "ROOM_FULL" });
  await f.command(guest, "room.leave");
  const { hashPassword } = await import("../packages/server/src/platform/database.ts");
  f.rooms.rooms.get(f.id)!.passwordHash = await hashPassword("test-password");
  await assert.rejects(f.command(guest, "room.join", { password: "wrong" }), { code: "FORBIDDEN" });
  assert.equal(f.current().members.length, 4);
  await f.rooms.command(guest, "room.create", createPayload);
  await assert.rejects(f.command(guest, "room.join", { password: "test-password" }), { code: "ALREADY_IN_GAME" });
  await f.command(newcomer, "room.join", { password: "test-password" });
  await f.command(newcomer, "room.join", { password: "test-password" });
  assert.equal(f.current().members.length, 5);
  assert.equal(f.current().members.filter(member => member.id === newcomer.id).length, 1);
});

test("开局分配中和对局中即使有空位也不能加入", async t => {
  const f = await fixture(t);
  await f.emit({ type: "finished", results: [] });
  await f.command(guest, "room.leave");
  for (const state of ["starting", "in_game"] as const) {
    f.current().state = state;
    await assert.rejects(f.command(guest, "room.join"), { code: "ALREADY_IN_GAME" });
    assert.equal(f.rooms.current(guest.id), null);
    assert.equal(f.current().members.length, 4);
  }
});

test("结算时保留断线期限，超过期限的离线席位会释放而不会永远满员", async t => {
  const f = await fixture(t);
  await f.rooms.presence(guest.id, false);
  const deadline = f.current().members.find(m => m.id === guest.id)!.resumeUntil;
  await f.emit({ type: "finished", results: [] });
  assert.equal(f.current().members.find(m => m.id === guest.id)!.resumeUntil, deadline);
  f.current().members.find(m => m.id === guest.id)!.resumeUntil = Date.now() - 1;
  await f.rooms.cleanup();
  assert.equal(f.current().members.length, 4);
  assert.equal(f.saved.get(f.id)!.members.length, 4);
  assert.equal(f.rooms.current(guest.id), null);
  await f.command(guest, "room.join");
  assert.equal(f.current().members.find(m => m.id === guest.id)!.seat, 1);
  assert.equal(f.current().members.filter(m => m.isAI).length, 3);
});
