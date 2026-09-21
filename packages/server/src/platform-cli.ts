import { createPlatform } from "./platform/index";
import { reclaimPort } from "../../../scripts/reclaim-port.mjs";
const port = Number(process.env.PORT || 8082);
await reclaimPort(port);
const app = await createPlatform();
await app.listen({ port, host: process.env.HOST || "127.0.0.1" });
let stopping = false;
async function stop() {
  if (stopping) return; stopping = true;
  // Upgraded sockets are not owned by Fastify's HTTP close operation.
  const deadline = setTimeout(() => process.exit(1), 10000); deadline.unref();
  await app.close(); clearTimeout(deadline);
}
process.on("SIGTERM", () => { void stop(); });
process.on("SIGINT", () => { void stop(); });
