import { readFile } from "node:fs/promises";

export async function hasRoomMemory() {
  if (process.platform !== "linux") return true;
  const meminfo = await readFile("/proc/meminfo", "utf8");
  const available = Number(/^MemAvailable:\s+(\d+)/m.exec(meminfo)?.[1]) * 1024;
  if (!Number.isFinite(available) || available < 192 * 1048576) return false;
  for (const [limitFile, usageFile] of [
    ["/sys/fs/cgroup/memory.max", "/sys/fs/cgroup/memory.current"],
    ["/sys/fs/cgroup/memory/memory.limit_in_bytes", "/sys/fs/cgroup/memory/memory.usage_in_bytes"],
  ]) {
    try {
      const [limit, used] = await Promise.all([readFile(limitFile, "utf8"), readFile(usageFile, "utf8")]);
      if (limit.trim() !== "max" && Number(limit) - Number(used) < 96 * 1048576) return false;
      return true;
    } catch (error: any) { if (error.code !== "ENOENT") throw error; }
  }
  return true;
}
