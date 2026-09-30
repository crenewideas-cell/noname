import { spawn } from "node:child_process";
import { developmentPorts } from "./dev-ports.mjs";
const port = developmentPorts();
console.log(`开发页面：http://127.0.0.1:${port.client}；文件服务：${port.server}`);
// 子服务直接输出日志，避免未消费的管道缓冲区阻塞服务并隐藏启动错误。
spawn(`pnpm -F @noname/fs run dev --debug --dirname=../../apps/core --port=${port.server}`, { shell: true, stdio: "inherit" });
spawn("pnpm -F ./packages/extension/** run build:watch", { shell: true, stdio: "inherit" });
spawn("pnpm -F noname run dev --open", { shell: true, stdio: "inherit" });
