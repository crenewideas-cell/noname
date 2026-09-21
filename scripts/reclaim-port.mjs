import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';

const exec = promisify(execFile);
async function listeners(port) {
 if (process.platform === 'win32') {
  const {stdout} = await exec('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
   `@(Get-NetTCPConnection -State Listen -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique) -join ','`], {windowsHide:true});
  return stdout.trim().split(',').filter(Boolean).map(Number);
 }
 try {
  const {stdout} = await exec('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t']);
  return [...new Set(stdout.trim().split(/\s+/).filter(Boolean).map(Number))];
 } catch (error) {
  if (error.code === 1 && !error.stdout?.trim() && !error.stderr?.trim()) return [];
  throw error;
 }
}

// CLI startup only. The filesystem/server library APIs never kill processes.
export async function reclaimPort(value) {
 const port = Number(value);
 if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error(`无效端口：${value}`);
 if (port === 0) return;
 const owners = await listeners(port);
 for (const pid of owners) {
  if (!Number.isInteger(pid) || pid <= 4 || pid === process.pid || pid === process.ppid) {
   throw new Error(`端口 ${port} 被当前启动进程或系统进程占用，无法自动释放。`);
  }
  console.log(`释放端口 ${port}：停止旧进程 ${pid}`);
  try {
   if (process.platform === 'win32') {
    await exec('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
     `Stop-Process -Id ${pid} -Force -ErrorAction Stop`], {windowsHide:true});
   } else process.kill(pid, 'SIGTERM');
  } catch (error) {
   if ((await listeners(port)).includes(pid)) throw error;
  }
 }
 for (let attempt = 0; attempt < 20; attempt++) {
  const remaining = await listeners(port);
  if (!remaining.length) return;
  if (process.platform !== 'win32' && attempt === 10) {
   for (const pid of remaining) if (owners.includes(pid)) {
    try { process.kill(pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
   }
  }
  await delay(250);
 }
 throw new Error(`端口 ${port} 仍被占用，请关闭自动重启该服务的程序后重试。`);
}

export function reclaimDevPortPlugin() {
 return {name:'noname-reclaim-dev-port', apply:'serve', async configureServer(server) {
  await reclaimPort(server.config.server.port ?? 5173);
 }};
}
