import { cp, mkdir, symlink, writeFile, access } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { execFileSync } from "node:child_process";
import { core, root } from "./environment.ts";

// A fresh copy prevents the project's normal build from replacing a user's dist.
const destination = resolve(root, "output/performance/builds", new Date().toISOString().replaceAll(/[:.]/g, "-"));
const snapshot = resolve(destination, "apps/core");
const withoutInstrumentation=process.argv.includes("--without-instrumentation");
await mkdir(snapshot, { recursive: true });
await cp(resolve(root, "tsconfig.json"), resolve(destination, "tsconfig.json"));
const excluded = new Set(["node_modules", "dist", "dist-types", "extension", "image", "audio", ".git"]);
await cp(core, snapshot, { recursive: true, filter: path => !excluded.has(relative(core,path).split(/[\\/]/)[0]) });
// Diagnostic control only: restore the four instrumented engine files in this isolated copy.
if(withoutInstrumentation)for(const file of ["index.html","noname/entry.ts","noname/init/index.ts","noname/library/element/GameEvent/compilers/ContentCompiler.ts"]){
	const original=execFileSync("git",["show",`HEAD:apps/core/${file}`],{cwd:root});
	await writeFile(resolve(snapshot,file),original);
}
await symlink(resolve(core,"node_modules"), resolve(snapshot,"node_modules"), process.platform === "win32" ? "junction" : "dir");
const commit = execFileSync("git", ["rev-parse","HEAD"], { cwd: root, encoding: "utf8" }).trim();
const require = createRequire(resolve(root,"package.json"));
const log: string[] = [];
const processBuild = spawn(process.execPath, [require.resolve("tsx/cli"), resolve(snapshot,"scripts/build.ts")], {
	cwd: snapshot, windowsHide: true, env: { ...process.env, NONAME_PUBLIC_BUILD: "0", VITE_PUBLIC_ONLINE: "0", NONAME_BUILD_COMMIT: commit, NONAME_BUILD_TIME: new Date().toISOString() }, stdio: ["ignore","pipe","pipe"] });
for (const stream of [processBuild.stdout, processBuild.stderr]) stream!.on("data", data => { log.push(data.toString()); process.stdout.write(data); });
const code = await new Promise<number>((ok, fail) => { processBuild.on("error",fail); processBuild.on("exit",value=>ok(value ?? 1)); });
await writeFile(resolve(destination,"build.log"),log.join(""));
await writeFile(resolve(destination,"build.json"),JSON.stringify({commit,code,snapshot,withoutInstrumentation,artifact:resolve(snapshot,"dist"),media:"read-only mounted from source; not a redistributable package"},null,2));
if (code) process.exitCode = code;
else { await access(resolve(snapshot,"dist/index.html")); console.log(`PERF_ARTIFACT=${resolve(snapshot,"dist")}`); }
