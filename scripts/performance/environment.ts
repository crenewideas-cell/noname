import { createRequire } from "node:module";
import { createReadStream } from "node:fs";
import { readFile, stat, readdir, realpath } from "node:fs/promises";
import { createServer as httpServer } from "node:http";
import { resolve, relative, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const root = resolve(import.meta.dirname, "../..");
export const core = resolve(root, "apps/core");
export const requireCore = createRequire(resolve(core, "package.json"));
export const { chromium } = createRequire(resolve(root, "packages/game-host/package.json"))("playwright-core");
const fileRoutes = new Set(["/checkFile", "/checkDir", "/getFileList", "/readFile", "/readFileAsText"]);
const writes = new Set(["/writeFile", "/removeFile", "/createDir", "/removeDir"]);
export async function contained(base: string, name: string) {
	const path = resolve(base, name);
	if (relative(base, path).startsWith("..") || relative(base, path).includes(`:${sep}`)) throw new Error("Outside test root");
	const actual = await realpath(path);
	if (relative(await realpath(base), actual).startsWith("..")) throw new Error("Outside test root via symlink");
	return actual;
}

/** Test-only read API: never imports/removes a user's noname.config.txt or writes source files. */
async function middleware(req: any, res: any, next: () => void) {
	const url = new URL(req.url, "http://localhost");
	const json = (data: unknown, success = true) => { res.setHeader("Content-Type", "application/json"); res.setHeader("Cache-Control", "no-store"); res.end(JSON.stringify({ success, code: success ? 200 : 403, data, errorMsg: success ? undefined : "Read-only performance harness" })); };
	if (writes.has(url.pathname)) return json(null, false);
	if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/ws/")) { res.statusCode = 503; return json(null, false); }
	if (url.pathname === "/__perf/seed") { res.setHeader("Content-Type", "text/html"); res.setHeader("Cache-Control", "no-store"); return res.end("<!doctype html><title>Isolated performance seed</title>"); }
	if (url.pathname.startsWith("/__perf/")) {
		try {
			const file = await contained(resolve(root, "scripts/performance"), decodeURIComponent(url.pathname.slice(8)));
			res.setHeader("Content-Type", file.endsWith(".html") ? "text/html" : "text/javascript"); res.setHeader("Cache-Control", "no-store"); return res.end(await readFile(file));
		} catch { res.statusCode = 404; return res.end(); }
	}
	if (!fileRoutes.has(url.pathname)) return next();
	try {
		const name = url.searchParams.get("fileName") || url.searchParams.get("dir") || "";
		if (name.replaceAll("\\", "/").endsWith("noname.config.txt")) return json({});
		let file: string;
		try { file = await contained(core, name); } catch { return json({}); }
		if (url.pathname === "/checkFile" || url.pathname === "/checkDir") return json((await stat(file)).isFile() ? "file" : "directory");
		if (url.pathname === "/getFileList") {
			const entries = await readdir(file, { withFileTypes: true });
			return json({ folders: entries.filter(e => e.isDirectory()).map(e => e.name), files: entries.filter(e => e.isFile()).map(e => e.name) });
		}
		const data = await readFile(file);
		json(url.pathname === "/readFile" ? [...data] : data.toString("utf8"));
	} catch { json(null, false); }
}

export async function startEnvironment(channel: string, port: number, artifact?: string) {
	if (channel === "dev") {
		const { createServer } = await import(pathToFileURL(requireCore.resolve("vite")).href);
		const server = await createServer({ configFile: resolve(core, "vite.config.ts"), root: core,
			plugins: [{ name: "performance-read-only", configureServer(server: any) { server.middlewares.use((req: any, res: any, next: any) => { void middleware(req, res, next); }); } }],
			server: { port, host: "localhost", strictPort: true, open: false } });
		try { await server.listen(); } catch(error) { await server.close(); throw error; }
		return { url: `http://localhost:${port}`, close: () => server.close(), cache: "existing Vite dependency cache; first navigation separately labeled" };
	}
	if (!artifact) throw new Error("Production requires --artifact=<fresh core dist path>");
	const types: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".mp4": "video/mp4" };
	const server = httpServer((req, res) => { void middleware(req, res, () => { void (async () => {
		try {
			const url = new URL(req.url!, "http://localhost");
			const name = decodeURIComponent(url.pathname === "/" ? "index.html" : url.pathname.slice(1));
			const dependency = name.startsWith("apps/core/node_modules/");
			const base = /^(image|audio|extension)\//.test(name) ? core : resolve(artifact);
			// preserveModules emits transformed dependency files here: always serve those first.
			let file: string;
			try { file=await contained(base,name); }
			catch(error) { if(!dependency)throw error; file=await contained(resolve(core,"node_modules"),name.slice("apps/core/node_modules/".length)); }
			const info = await stat(file);
			if (!info.isFile()) throw new Error("Not a file");
			const tag = `W/"${info.size}-${Math.floor(info.mtimeMs)}"`;
			res.setHeader("Cache-Control", "public, max-age=0"); res.setHeader("ETag", tag);
			if (req.headers["if-none-match"] === tag) { res.statusCode = 304; return res.end(); }
			res.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
			res.setHeader("Content-Length", info.size);
			createReadStream(file).on("error", () => res.destroy()).pipe(res);
		} catch { res.statusCode = 404; res.end("Not found in performance artifact"); }
	})(); }); });
	await new Promise<void>((ok, fail) => { server.once("error", fail); server.listen(port, "localhost", ok); });
	return { url: `http://localhost:${port}`, close: async () => { server.closeAllConnections(); await new Promise<void>(r => server.close(() => r())); }, cache: "test static server, max-age=0/ETag, uncompressed, not deployment server" };
}
