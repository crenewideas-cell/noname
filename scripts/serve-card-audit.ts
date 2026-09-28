// Isolated read-only development server for card catalogue browser checks.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import config from "../apps/core/vite.config.ts";

const require = createRequire(path.resolve("apps/core/package.json"));
const { createServer } = await import(pathToFileURL(require.resolve("vite")).href);
const server = await createServer({
	...config,
	configFile: false,
	root: path.resolve("apps/core"),
	cacheDir: path.resolve("temp/card-art-vite-cache"),
	plugins: config.plugins.filter(plugin => !["noname-reclaim-dev-port", "extension-manager"].includes(plugin?.name)),
	server: { ...config.server, port: 5176, strictPort: true, open: false, fs: { allow: [path.resolve(".")] }, warmup: undefined },
});
await server.listen();
console.log("Card audit server: http://127.0.0.1:5176");
