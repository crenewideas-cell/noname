import { spawn } from "node:child_process";
// 子服务直接输出日志，避免未消费的管道缓冲区阻塞服务并隐藏启动错误。
spawn("pnpm -F @noname/fs run dev --debug --dirname=../../apps/core", { shell: true, stdio: "inherit" });
spawn("pnpm -F ./packages/extension/** run build:watch", { shell: true, stdio: "inherit" });
spawn("pnpm -F noname run dev --open", { shell: true, stdio: "inherit" });
