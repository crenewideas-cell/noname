#!/usr/bin/env node
import minimist from "minimist";
import { defaultConfig, default as createApp } from "./index";
import { reclaimPort } from "../../../scripts/reclaim-port.mjs";

// 解析命令行参数
// 示例: -s --maxAge 100
const config = minimist(process.argv.slice(2), {
		boolean: true,
		alias: { server: "s" },
		default: defaultConfig,
	}) as any;
async function main() {
	if (config.listen !== false) await reclaimPort(config.port);
	createApp(config);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
