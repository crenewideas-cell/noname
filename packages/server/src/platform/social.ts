import { randomUUID } from "node:crypto";
import { type Account, OnlineError, text } from "@noname/online-protocol";
import { Database } from "./database";

export class Social {
  constructor(private db: Database, private online: (id: string) => boolean, private publish: (id: string | null, type: string, payload: unknown) => void) {}
  async snapshot(id: string) {
    const friends = await this.db.pool.query(`SELECT a.*, f.requester, f.state FROM online_friendships f JOIN online_accounts a ON a.id=CASE WHEN f.low_id=$1 THEN f.high_id ELSE f.low_id END WHERE (f.low_id=$1 OR f.high_id=$1) AND f.state IN ('pending','accepted') ORDER BY a.nickname LIMIT 300`, [id]);
    const blocked = await this.db.pool.query("SELECT a.* FROM online_blocks b JOIN online_accounts a ON a.id=b.target_id WHERE b.owner_id=$1 ORDER BY a.nickname LIMIT 200", [id]);
    const invites = await this.db.pool.query(`SELECT i.id,i.room_id AS "roomId",i.sender_id AS "senderId",a.nickname,i.expires_at AS "expiresAt" FROM online_invites i JOIN online_accounts a ON a.id=i.sender_id WHERE i.target_id=$1 AND i.state='pending' AND i.expires_at>now() ORDER BY i.created_at DESC LIMIT 30`, [id]);
    return { friends: friends.rows.map(row => ({ ...this.db.account(row), state: row.state, incoming: row.requester !== id, online: this.online(row.id) })), blocked: blocked.rows.map(row => this.db.account(row)), invites: invites.rows };
  }
  async find(id: string, code: unknown) {
    const { rows } = await this.db.pool.query(`SELECT a.* FROM online_accounts a WHERE a.public_code=$1 AND a.id<>$2 AND NOT EXISTS(SELECT 1 FROM online_blocks WHERE (owner_id=$2 AND target_id=a.id) OR (owner_id=a.id AND target_id=$2))`, [text(code, 12, 12).toUpperCase(), id]);
    return rows[0] ? this.db.account(rows[0]) : null;
  }
  async areFriends(a: string, b: string) {
    const [low, high] = [a, b].sort();
    const { rowCount } = await this.db.pool.query(`SELECT 1 FROM online_friendships WHERE low_id=$1 AND high_id=$2 AND state='accepted' AND NOT EXISTS(SELECT 1 FROM online_blocks WHERE (owner_id=$1 AND target_id=$2) OR (owner_id=$2 AND target_id=$1))`, [low, high]);
    return !!rowCount;
  }
  async changed(...ids: string[]) { for (const id of new Set(ids)) this.publish(id, "social.changed", {}); }
  async presence(id: string) {
    const { rows } = await this.db.pool.query("SELECT CASE WHEN low_id=$1 THEN high_id ELSE low_id END AS id FROM online_friendships WHERE (low_id=$1 OR high_id=$1) AND state='accepted'", [id]);
    for (const row of rows) this.publish(row.id, "social.changed", {});
  }
  async command(account: Account, type: string, payload: Record<string, any>) {
    const target = text(payload.accountId, 36, 36);
    if (!/^[0-9a-f-]{36}$/.test(target) || target === account.id) throw new OnlineError("INVALID_ARGUMENT", "请选择其他玩家");
    const [low, high] = [account.id, target].sort();
    const client = await this.db.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [low + high]);
      const exists = await client.query("SELECT 1 FROM online_accounts WHERE id=$1", [target]);
      if (!exists.rowCount) throw new OnlineError("NOT_FOUND", "玩家不存在");
      if (type === "friend.block") {
        const count = await client.query("SELECT count(*)::int AS n FROM online_blocks WHERE owner_id=$1", [account.id]);
        if (count.rows[0].n >= 200) throw new OnlineError("LIMIT_REACHED", "屏蔽名单已满");
        await client.query("INSERT INTO online_blocks(owner_id,target_id) VALUES($1,$2) ON CONFLICT DO NOTHING", [account.id, target]);
        await client.query("DELETE FROM online_friendships WHERE low_id=$1 AND high_id=$2", [low, high]);
        await client.query("UPDATE online_invites SET state='revoked' WHERE (sender_id=$1 AND target_id=$2) OR (sender_id=$2 AND target_id=$1)", [low, high]);
      } else if (type === "friend.unblock") {
        await client.query("DELETE FROM online_blocks WHERE owner_id=$1 AND target_id=$2", [account.id, target]);
      } else {
        const blocked = await client.query("SELECT 1 FROM online_blocks WHERE (owner_id=$1 AND target_id=$2) OR (owner_id=$2 AND target_id=$1)", [low, high]);
        if (blocked.rowCount) throw new OnlineError("FORBIDDEN", "当前无法与此玩家互动");
        if (type === "friend.request") {
          const count = await client.query("SELECT count(*)::int AS n FROM online_friendships WHERE low_id=$1 OR high_id=$1", [account.id]);
          const targetCount = await client.query("SELECT count(*)::int AS n FROM online_friendships WHERE low_id=$1 OR high_id=$1", [target]);
          if (count.rows[0].n >= 200 || targetCount.rows[0].n >= 200) throw new OnlineError("LIMIT_REACHED", "好友或申请数量已满");
          await client.query("INSERT INTO online_friendships(low_id,high_id,requester,state) VALUES($1,$2,$3,'pending') ON CONFLICT DO NOTHING", [low, high, account.id]);
        } else if (type === "friend.accept" || type === "friend.reject") {
          const result = await client.query(type === "friend.accept"
            ? "UPDATE online_friendships SET state='accepted' WHERE low_id=$1 AND high_id=$2 AND requester=$3 AND state='pending'"
            : "DELETE FROM online_friendships WHERE low_id=$1 AND high_id=$2 AND requester=$3 AND state='pending'", [low, high, target]);
          if (!result.rowCount) throw new OnlineError("INVITE_EXPIRED", "好友申请已处理或失效");
        } else if (type === "friend.remove" || type === "friend.cancel") {
          await client.query(type === "friend.cancel" ? "DELETE FROM online_friendships WHERE low_id=$1 AND high_id=$2 AND requester=$3 AND state='pending'" : "DELETE FROM online_friendships WHERE low_id=$1 AND high_id=$2", type === "friend.cancel" ? [low, high, account.id] : [low, high]);
          await client.query("UPDATE online_invites SET state='revoked' WHERE (sender_id=$1 AND target_id=$2) OR (sender_id=$2 AND target_id=$1)", [low, high]);
        } else throw new OnlineError("UNKNOWN_COMMAND", "无效好友操作");
      }
      await client.query("COMMIT");
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
    await this.changed(account.id, target);
    return {};
  }
  async invite(sender: Account, target: string, roomId: string) {
    if (!(await this.areFriends(sender.id, target))) throw new OnlineError("FORBIDDEN", "只能邀请未屏蔽的好友");
    if (!this.online(target)) throw new OnlineError("OFFLINE", "好友当前不在线");
    const { rows } = await this.db.pool.query(`INSERT INTO online_invites(id,sender_id,target_id,room_id,state,expires_at) VALUES($1,$2,$3,$4,'pending',now()+interval '2 minutes') RETURNING id,expires_at AS "expiresAt"`, [randomUUID(), sender.id, target, roomId]);
    await this.changed(target); return rows[0];
  }
  async invitation(id: string, target: string) {
    const { rows } = await this.db.pool.query("SELECT * FROM online_invites WHERE id=$1 AND target_id=$2 AND state='pending' AND expires_at>now()", [id, target]);
    if (!rows[0] || !(await this.areFriends(rows[0].sender_id, target))) throw new OnlineError("INVITE_EXPIRED", "邀请已过期、撤销或不属于你");
    return rows[0];
  }
  async finishInvite(id: string, target: string, state: string) {
    await this.db.pool.query("UPDATE online_invites SET state=$1 WHERE id=$2 AND target_id=$3 AND state='pending'", [state, id, target]);
    await this.changed(target);
  }
}
