import { build as buildElectron, Platform, Arch, type PackagerOptions, type Configuration } from "electron-builder";
import { build as buildVite } from "vite";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { existsSync } from "node:fs";
import { copyDesktopDependencies } from "../../scripts/desktop-dependencies.mjs";
import { resolve } from "node:path";
import { rm, mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let electronDist: string | undefined;
try { const binary = require("electron"); if (existsSync(binary)) electronDist = dirname(binary); } catch { /* builder downloads the locked version when not installed */ }

async function main(targets: PackagerOptions["targets"], config: Partial<Configuration> = {}) {
	const desktopStage = process.env.NONAME_DESKTOP_STAGE;
	const dependencyStage = resolve(import.meta.dirname, "../../output/windows-dependencies");
	if (desktopStage) {
		if (dependencyStage !== resolve(import.meta.dirname, "../../output", "windows-dependencies")) throw new Error("Invalid dependency stage");
		await rm(dependencyStage, { recursive: true, force: true });
		await mkdir(dependencyStage, { recursive: true });
		const packages = await copyDesktopDependencies(import.meta.dirname, dependencyStage);
		await mkdir(resolve(import.meta.dirname, "../../output/windows"), { recursive: true });
		await writeFile(resolve(import.meta.dirname, "../../output/windows/dependency-report.json"), JSON.stringify(packages, null, 2));
		console.log(`已收集 ${packages.length} 个桌面生产依赖（含 workspace 传递依赖）`);
	}
	const appPaths = await buildElectron({
		config: {
			asar: false,
			electronDist,
			appId: "com.libnoname.noname",
			productName: "noname",
			directories: {
				output: desktopStage ? "../../output/windows" : "../../output",
			},
			files: desktopStage ? [
				{ from: "dist/app", to: "app" },
				{ from: desktopStage, to: "", filter: ["**/*"] },
				{ from: dependencyStage, to: "node_modules", filter: ["**/*"] },
				"noname.ico", "package.json",
			] : [
				{ from: "dist", to: "" },
				{ from: "../../dist", to: "" },
				{ from: "../../dist/node_modules", to: "node_modules" },
				"package.json",
			],
			npmRebuild: false,
			extraMetadata: {
				main: "app/main.js",
				...(desktopStage ? { dependencies: {} } : {}),
			},
			...config,
		},
		targets,
	});
	if (desktopStage && process.platform === "win32") {
		const packagedRoot = resolve(import.meta.dirname, "../../output/windows/win-unpacked/resources/app");
		const packagedRequire = createRequire(resolve(packagedRoot, "package.json"));
		packagedRequire("ws");
		packagedRequire.resolve("@electron/remote");
		const { default: createApp } = await import(pathToFileURL(resolve(packagedRoot, "node_modules/@noname/fs/dist/index.js")).href);
		const server = createApp({ dirname: packagedRoot, server: true, listen: false });
		try {
			const response = await server.inject({ url: "/index.html" });
			if (response.statusCode !== 200) throw new Error(`打包后入口验证失败：HTTP ${response.statusCode}`);
		} finally { await server.close(); }
		console.log("打包后的文件服务、传递依赖、页面入口验证通过");
	}
	console.log("打包完成");
}

await buildVite();

switch (process.argv[2]) {
	case "win":
		await main(Platform.WINDOWS.createTarget(process.argv[3] || "nsis", Arch.x64), {
			win: {
				// Unsigned folder builds need no winCodeSign download or symlink privilege.
				signAndEditExecutable: process.env.NONAME_DESKTOP_STAGE && (!process.argv[3] || process.argv[3] === "dir") ? false : undefined,
				verifyUpdateCodeSignature: false,
				icon: "noname.ico",
			},
			portable: { artifactName: "noname-${version}-win-${arch}-portable.${ext}" },
			nsis: {
				oneClick: false,
				allowToChangeInstallationDirectory: true,
			},
		});
		break;
	case "linux":
		await main(Platform.LINUX.createTarget("AppImage", Arch.x64));
		break;
	case "macos":
		await main(Platform.MAC.createTarget("dmg", Arch.arm64, Arch.x64), {
			mac: {
				identity: null,
			},
		});
		break;
	default:
		throw new Error(`未知平台: ${process.argv[2]}`);
}
