import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { finished } from "node:stream/promises";
import { join } from "node:path";
import { organizeOutput, projectRoot } from "./organize-output.mjs";

await organizeOutput();
const directory = join(projectRoot, "output/android/logs");
await mkdir(directory, { recursive: true });
const path = join(directory, `build-${new Date().toISOString().replace(/[:.]/g, "-")}-${process.pid}.log`);
const log = createWriteStream(path, { flags: "wx" });
const logging = finished(log);
console.log(`构建日志：${path}`);
const child = spawn(process.execPath, [join(projectRoot, "scripts/build-android.mjs"), ...process.argv.slice(2)], {
  cwd: projectRoot, stdio: ["inherit", "pipe", "pipe"], windowsHide: true,
});
child.stdout.on("data", data => { process.stdout.write(data); log.write(data); });
child.stderr.on("data", data => { process.stderr.write(data); log.write(data); });
log.on("error", () => child.kill());
child.on("error", error => { console.error(error); log.write(`${error.stack}\n`); });
const code = await new Promise(resolve => child.on("close", code => resolve(code ?? 1)));
log.end();
await logging;
process.exitCode = code;
