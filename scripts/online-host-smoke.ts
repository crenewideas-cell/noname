import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, relative, isAbsolute } from "node:path";
import { createReadStream } from "node:fs";
import { GameHost } from "../packages/game-host/src/index.ts";

const root = resolve(process.env.HOST_RUNTIME_DIR || "dist-online-host");
const manifest = JSON.parse(await readFile(resolve(root, "deployment.json"), "utf8"));
const count = Number(process.env.SMOKE_ROOMS || 1);
if (!Number.isInteger(count) || count < 1 || count > 10) throw new Error("SMOKE_ROOMS must be 1..10");
const mediaRequests: string[] = [];
const server = createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url!, "http://localhost").pathname);
    if (/\.(jpg|png|gif|webp|mp3|wav|woff2?)$/i.test(name)) mediaRequests.push(name);
    const file = resolve(root, "." + name);
    const delta = relative(root, file);
    if (delta.startsWith("..") || isAbsolute(delta) || !(await stat(file)).isFile()) throw new Error("Not found");
    const mime: Record<string, string> = { ".js": "application/javascript", ".mjs": "application/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".wasm": "application/wasm" };
    res.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
const address = server.address() as { port: number };
const hosts = new GameHost({ clientUrl: `http://127.0.0.1:${address.port}/index.html`, executablePath: process.env.CHROMIUM_PATH, maxInstances: count });
let failures = 0, choices = 0, started = 0, finished = 0;
const deadline = setTimeout(() => { console.error("Smoke test timed out"); process.exit(1); }, 240000);
try {
  for (let room = 0; room < count; room++) {
    const id = `smoke-${room}`;
    const members = Array.from({ length: 8 }, (_, seat) => ({ id: `seat-${room}-${seat}`, nickname: `Seat ${seat + 1}` }));
    await hosts.start({ instanceId: id, roomId: id, build: manifest.build, modeId: "identity", members }, event => {
      if (event.type === "failed") failures++;
      if (event.type === "choice") choices++;
      if (event.type === "started") started++;
      if (event.type === "finished") finished++;
    });
    for (const member of members) {
      await hosts.receive(id, { accountId: member.id, type: "attach", payload: { generation: 1 } });
      await hosts.receive(id, { accountId: member.id, type: "inited", payload: { generation: 1 } });
    }
    // Offline seats exercise the engine's real AI/timeout path, without fake
    // choices bypassing server validation. This is not an 80-client load test.
    for (const member of members) await hosts.receive(id, { accountId: member.id, type: "disconnect" });
    console.log(JSON.stringify({ room: room + 1, active: hosts.count, started, failures }));
    if (failures) throw new Error("Host failed during startup");
  }
  const until = Date.now() + Number(process.env.SMOKE_HOLD_MS || 45000);
  while (Date.now() < until) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(JSON.stringify({ active: hosts.count, started, choices, finished, failures, nodeMiB: Math.round(process.memoryUsage().rss / 1048576) }));
    if (failures) throw new Error("Host failed during play");
  }
  if (started !== count || choices === 0 || mediaRequests.length) throw new Error(`Smoke failed: started=${started}, choices=${choices}, media=${mediaRequests.length}`);
} finally {
  clearTimeout(deadline);
  await hosts.close();
  await new Promise<void>(resolve => server.close(() => resolve()));
}
