/// <reference types="vite/client" />
(() => {
	const state = window as Window & { nonameJITReady?: Promise<void> };
	if (state.nonameJITReady) return;
	state.nonameJITReady = new Promise<void>((resolve, reject) => {
		if (!("serviceWorker" in navigator)) {
			reject(new Error("当前客户端不支持扩展即时编译（Service Worker）。"));
			return;
		}
		const scope = new URL("./", location.href).href;
		const workerURL = new URL("service-worker.js", scope).href;
		const workers = navigator.serviceWorker;
		let registered = false;
		const cleanup = () => {
			clearTimeout(timeout);
			workers.removeEventListener("controllerchange", controlled);
		};
		const controlled = () => {
			if (!registered || workers.controller?.scriptURL !== workerURL) return;
			cleanup(); resolve();
		};
		const timeout = setTimeout(() => {
			cleanup(); reject(new Error("扩展编译服务启动超时，请关闭程序后重新打开。"));
		}, 20000);
		workers.addEventListener("controllerchange", controlled);
		// Reuse registrations across launches. Unregister + reload raced with
		// IndexedDB initialization and could leave the next launch blank.
		workers.register(workerURL, { type: "module", updateViaCache: "none", scope })
			.then(() => { registered = true; controlled(); })
			.catch(error => { cleanup(); reject(error); });
	});
	// The game entry awaits this promise and presents startup errors itself.
	void state.nonameJITReady.catch(error => console.error("扩展编译服务启动失败", error));
})();
