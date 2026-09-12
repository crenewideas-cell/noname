import pg from "pg";
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { OnlineError, type Account, type Room } from "@noname/online-protocol";
const scrypt = promisify(scryptCallback);
export const secret = () => randomBytes(32).toString("base64url");
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export async function hashPassword(value: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + (await scrypt(value, salt, 64) as Buffer).toString("hex");
}
export async function verifyPassword(value: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!/^[0-9a-f]{32}$/.test(salt || "") || !/^[0-9a-f]{128}$/.test(hash || "")) return false;
  const actual = await scrypt(value, salt, 64) as Buffer;
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export class Database {
  readonly pool: pg.Pool;
  private lease?: pg.PoolClient;
  constructor(url: string) { this.pool = new pg.Pool({ connectionString: url, max: 8, connectionTimeoutMillis: 5000 }); }
  async migrate() {
    this.lease = await this.pool.connect();
    const { rows } = await this.lease.query("SELECT pg_try_advisory_lock(7102027) AS locked");
    if (!rows[0].locked) { this.lease.release(); this.lease = undefined; throw new Error("Only one platform process may use this database"); }
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock(7102026)");
      await client.query(`
        CREATE TABLE IF NOT EXISTS online_accounts (
          id uuid PRIMARY KEY, username text NOT NULL UNIQUE, public_code text NOT NULL UNIQUE,
          nickname text NOT NULL, password_hash text NOT NULL, recovery_hash text NOT NULL,
          avatar text NOT NULL DEFAULT 'caocao', created_at timestamptz NOT NULL DEFAULT now());
        CREATE TABLE IF NOT EXISTS online_sessions (
          token_hash text PRIMARY KEY, account_id uuid NOT NULL REFERENCES online_accounts(id),
          csrf text NOT NULL, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
        CREATE INDEX IF NOT EXISTS online_sessions_account ON online_sessions(account_id);
        CREATE TABLE IF NOT EXISTS online_rooms (
          id uuid PRIMARY KEY, state text NOT NULL, document jsonb NOT NULL, password_hash text, updated_at timestamptz NOT NULL DEFAULT now());
        ALTER TABLE online_rooms ADD COLUMN IF NOT EXISTS password_hash text;
        CREATE TABLE IF NOT EXISTS online_results (
          instance_id uuid PRIMARY KEY, room_id uuid NOT NULL, results jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now());
        CREATE TABLE IF NOT EXISTS online_migrations (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
        INSERT INTO online_migrations(version) VALUES(1) ON CONFLICT DO NOTHING;
        CREATE TABLE IF NOT EXISTS online_friendships (
          low_id uuid NOT NULL REFERENCES online_accounts(id), high_id uuid NOT NULL REFERENCES online_accounts(id),
          requester uuid NOT NULL REFERENCES online_accounts(id), state text NOT NULL CHECK(state IN ('pending','accepted')),
          created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(low_id,high_id), CHECK(low_id<high_id));
        CREATE INDEX IF NOT EXISTS online_friendships_high ON online_friendships(high_id);
        CREATE TABLE IF NOT EXISTS online_blocks (
          owner_id uuid NOT NULL REFERENCES online_accounts(id), target_id uuid NOT NULL REFERENCES online_accounts(id),
          PRIMARY KEY(owner_id,target_id), CHECK(owner_id<>target_id));
        CREATE TABLE IF NOT EXISTS online_invites (
          id uuid PRIMARY KEY, sender_id uuid NOT NULL REFERENCES online_accounts(id), target_id uuid NOT NULL REFERENCES online_accounts(id),
          room_id uuid NOT NULL, state text NOT NULL, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
        CREATE INDEX IF NOT EXISTS online_invites_target ON online_invites(target_id,expires_at);
        CREATE TABLE IF NOT EXISTS online_bans (
          account_id uuid PRIMARY KEY REFERENCES online_accounts(id), reason text NOT NULL,
          expires_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
        INSERT INTO online_migrations(version) VALUES(2) ON CONFLICT DO NOTHING;
        INSERT INTO online_migrations(version) VALUES(3) ON CONFLICT DO NOTHING;
      `);
      await client.query("UPDATE online_rooms SET state='closed', document=jsonb_set(document,'{state}','\"closed\"') WHERE state NOT IN ('waiting','finished','closed')");
      await client.query("DELETE FROM online_sessions WHERE expires_at < now()");
      await client.query("COMMIT");
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  }
  account(row: any): Account { return { id: row.id, code: row.public_code, nickname: row.nickname, avatar: row.avatar }; }
  async register(username: string, password: string, nickname: string) {
    const recovery = secret();
    try {
      const result = await this.pool.query(`INSERT INTO online_accounts(id, username, public_code, nickname, password_hash, recovery_hash)
        VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [randomUUID(), username, randomBytes(6).toString("hex").toUpperCase(), nickname, await hashPassword(password), digest(recovery)]);
      return { account: this.account(result.rows[0]), recovery };
    } catch (error: any) { if (error.code === "23505") throw new OnlineError("REGISTER_FAILED", "无法使用这些注册信息，请更换用户名"); throw error; }
  }
  async login(username: string, password: string) {
    const { rows } = await this.pool.query("SELECT * FROM online_accounts WHERE username=$1", [username]);
    const row = rows[0];
    // Run the same KDF for unknown accounts to avoid the fast lookup path.
    const stored = row?.password_hash ?? "00000000000000000000000000000000:" + "0".repeat(128);
    if (!(await verifyPassword(password, stored)) || !row) throw new OnlineError("LOGIN_FAILED", "用户名或密码不正确");
    if (await this.isBanned(row.id)) throw new OnlineError("ACCOUNT_BLOCKED", "账号当前被限制登录");
    return this.account(row);
  }
  async session(accountId: string) {
    const token = secret(), csrf = secret();
    await this.pool.query("INSERT INTO online_sessions(token_hash,account_id,csrf,expires_at) VALUES($1,$2,$3,now()+interval '12 hours')", [digest(token), accountId, csrf]);
    return { token, csrf };
  }
  async authenticate(token?: string) {
    if (!token) throw new OnlineError("AUTH_EXPIRED", "请先登录");
    const { rows } = await this.pool.query(`SELECT a.*, s.csrf, s.token_hash, s.expires_at FROM online_sessions s JOIN online_accounts a ON a.id=s.account_id WHERE s.token_hash=$1 AND s.expires_at>now()`, [digest(token)]);
    if (!rows[0]) throw new OnlineError("AUTH_EXPIRED", "会话已过期，请重新登录");
    if (await this.isBanned(rows[0].id)) throw new OnlineError("ACCOUNT_BLOCKED", "账号当前被限制使用");
    return { account: this.account(rows[0]), csrf: rows[0].csrf, tokenHash: rows[0].token_hash, expiresAt: new Date(rows[0].expires_at).getTime() };
  }
  async isBanned(accountId: string) {
    const { rowCount } = await this.pool.query("SELECT 1 FROM online_bans WHERE account_id=$1 AND (expires_at IS NULL OR expires_at>now())", [accountId]);
    return !!rowCount;
  }
  async setBan(accountId: string, reason: string, expiresAt?: Date) {
    const account = await this.pool.query("SELECT 1 FROM online_accounts WHERE id=$1", [accountId]);
    if (!account.rowCount) return false;
    const result = await this.pool.query("INSERT INTO online_bans(account_id,reason,expires_at) VALUES($1,$2,$3) ON CONFLICT(account_id) DO UPDATE SET reason=$2,expires_at=$3", [accountId, reason, expiresAt || null]);
    return result.rowCount === 1;
  }
  async clearBan(accountId: string) { const result = await this.pool.query("DELETE FROM online_bans WHERE account_id=$1", [accountId]); return result.rowCount === 1; }
  async banCount() { return Number((await this.pool.query("SELECT count(*)::int AS count FROM online_bans WHERE expires_at IS NULL OR expires_at>now()")).rows[0].count); }
  async revoke(hash: string) { await this.pool.query("DELETE FROM online_sessions WHERE token_hash=$1", [hash]); }
  async recover(username: string, recovery: string, password: string) {
    const client = await this.pool.connect();
    const next = secret();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query("SELECT id FROM online_accounts WHERE username=$1 AND recovery_hash=$2 FOR UPDATE", [username, digest(recovery)]);
      if (!rows[0]) throw new OnlineError("RECOVERY_FAILED", "恢复信息不正确");
      await client.query("UPDATE online_accounts SET password_hash=$1,recovery_hash=$2 WHERE id=$3", [await hashPassword(password), digest(next), rows[0].id]);
      await client.query("DELETE FROM online_sessions WHERE account_id=$1", [rows[0].id]);
      await client.query("COMMIT"); return { recovery: next, accountId: rows[0].id as string };
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  }
  async saveRoom(room: Room, passwordHash?: string) {
    await this.pool.query(`INSERT INTO online_rooms(id,state,document,password_hash) VALUES($1,$2,$3,$4)
      ON CONFLICT(id) DO UPDATE SET state=$2,document=$3,password_hash=$4,updated_at=now()`, [room.id, room.state, room, passwordHash || null]);
  }
  async deleteRoom(roomId: string) {
    await this.pool.query("DELETE FROM online_rooms WHERE id=$1", [roomId]);
  }
  async clearRooms() {
    await this.pool.query("DELETE FROM online_rooms");
  }
  async saveResult(instanceId: string, roomId: string, results: unknown) {
    await this.pool.query("INSERT INTO online_results(instance_id,room_id,results) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [instanceId, roomId, JSON.stringify(results)]);
  }
  async loadRooms() {
    return (await this.pool.query("SELECT id,state,document,password_hash,updated_at FROM online_rooms WHERE state IN ('waiting','finished') ORDER BY updated_at DESC")).rows;
  }
  async close() { this.lease?.release(); await this.pool.end(); }
}
