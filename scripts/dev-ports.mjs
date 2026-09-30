import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Share the same local settings between the launcher and Vite's API proxies.
// Keep stable defaults: silently picking another port also changes browser saves.
export function developmentPorts(directory = fileURLToPath(new URL('../apps/core/', import.meta.url)), environment = process.env) {
 const values = {};
 for (const name of ['.env', '.env.local', '.env.development', '.env.development.local']) {
  try { Object.assign(values, parseEnv(readFileSync(join(directory, name), 'utf8'))); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
 }
 Object.assign(values, environment);
 const readPort = (name, fallback) => {
  const raw = values[name] ?? String(fallback);
  if (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > 65535) throw new Error(`${name} 必须为 1–65535 的整数端口`);
  return Number(raw);
 };
 const ports = { client: readPort('NONAME_DEV_PORT', 8081), server: readPort('NONAME_FS_PORT', 8089) };
 if (ports.client === ports.server) throw new Error('开发页面和文件服务不能使用同一端口');
 return ports;
}
