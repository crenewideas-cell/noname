/// <reference lib="WebWorker" />
const worker = globalThis as unknown as ServiceWorkerGlobalScope;
import * as CompileStrategy from "./compile-strategy";

worker.addEventListener("install", event => {
	// The promise that skipWaiting() returns can be safely ignored.
	worker.skipWaiting();
});

worker.addEventListener("activate", event => {
	// Startup waits for controllerchange; activation must not reload a running
	// game or a renderer that is currently saving and quitting.
	event.waitUntil(worker.clients.claim());
});

worker.addEventListener("message", event => {
	console.log(event.data);
	const { action } = event.data;
	switch (action) {
		case "reload":
			sendReload();
			break;
		// case "allowJs": {
		// 	const tsStrategy = strategies.find(i => i instanceof CompileStrategy.TSStrategy);
		// 	if (tsStrategy) tsStrategy.allowJs = event.data.enabled || false;
		// 	break;
		// }
		default:
			console.log("Unknown action");
	}
});

function sendReload() {
	worker.clients.matchAll().then(clients => {
		clients.forEach(client => {
			client.postMessage({ type: "reload" });
		});
	});
}

const strategies: CompileStrategy.BaseStrategy[] = [
	new CompileStrategy.RawResourceStrategy(),
	new CompileStrategy.WorkerResourceStrategy(),
	new CompileStrategy.UrlResourceStrategy(),
	new CompileStrategy.JSONStrategy(),
	new CompileStrategy.TSStrategy({ allowJs: false }),
	new CompileStrategy.CSSStrategy(),
	new CompileStrategy.VueSFCStrategy(),
];

const proxyedPath = ["/extension", "/jit-test.ts"];
// --- fetch 拦截入口 ---
worker.addEventListener("fetch", (event: FetchEvent) => {
	const request = event.request;
	if (typeof request.url !== "string") return;

	const url = new URL(request.url);
	// 非相关请求
	if (!["localhost", "127.0.0.1", "10.0.2.2"].includes(url.hostname)) return;
	if (!proxyedPath.some(i => url.pathname.startsWith(i))) return;

	const strategy = strategies.find(s => s.match({ event, request, url }));
	if (strategy) {
		try {
			event.respondWith(strategy.process({ event, request, url }));
		} catch (e) {
			console.error(request.url, e);
			event.respondWith(Response.error());
		}
	}
});
