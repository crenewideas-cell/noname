import { chromium, type Browser, type Page } from "playwright-core";
export interface HostSpec { instanceId: string; roomId: string; modeId: string; build: string; members: { id: string; nickname: string }[]; }
export interface HostEvent { type: string; accountId?: string; raw?: string; token?: string; deadline?: number; results?: { accountId: string; won: boolean | null }[]; }
export class GameHost {
  private instances = new Map<string, { browser?: Browser; page?: Page; ended: boolean; timer?: NodeJS.Timeout; fail?: (error: Error) => void }>();
  constructor(private options: { clientUrl: string; executablePath?: string; maxInstances: number; }) {}
  async start(spec: HostSpec, emit: (event: HostEvent) => void): Promise<void> {
    if (this.instances.size >= this.options.maxInstances) throw new Error("SERVICE_BUSY");
    if (this.instances.has(spec.instanceId)) throw new Error("DUPLICATE_INSTANCE");
    const instance: { browser?: Browser; page?: Page; ended: boolean; timer?: NodeJS.Timeout; fail?: (error: Error) => void } = { ended: false };
    this.instances.set(spec.instanceId, instance);
    let ready!: () => void, failed!: (error: Error) => void;
    const waiting = new Promise<void>((resolve, reject) => { ready = resolve; failed = reject; });
    instance.fail = failed;
    // Attach rejection handling immediately: Chromium launch itself may take time.
    void waiting.catch(() => {});
    const timeout = setTimeout(() => failed(new Error("HOST_BOOT_TIMEOUT")), 60000);
    try {
      instance.browser = await chromium.launch({ headless: true, executablePath: this.options.executablePath, chromiumSandbox: true, timeout: 45000,
        args: ["--disable-background-timer-throttling", "--disable-renderer-backgrounding"] });
      if (instance.ended) { await instance.browser.close(); throw new Error("HOST_CANCELLED"); }
      const context = await instance.browser.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: "block" });
      const origin = new URL(this.options.clientUrl).origin;
      await context.route("**/*", route => {
        const url = new URL(route.request().url());
        if (url.origin !== origin || /^\/(extension|api|ws|readFile|readFileAsText|writeFile|removeFile|createDir|removeDir|getFileList|checkFile|checkDir|src)(\/|$)/i.test(url.pathname)) return route.abort();
        return route.continue();
      });
      const page = instance.page = await context.newPage();
      page.on("dialog", dialog => { if (instance.ended) return; void dialog.dismiss(); failed(new Error("HOST_UNEXPECTED_DIALOG")); emit({ type: "failed" }); });
      page.on("pageerror", () => { if (instance.ended) return; failed(new Error("HOST_SCRIPT_ERROR")); emit({ type: "failed" }); });
      page.on("crash", () => { if (instance.ended) return; failed(new Error("HOST_CRASH")); emit({ type: "failed" }); });
      instance.browser.on("disconnected", () => { if (!instance.ended) { failed(new Error("HOST_DISCONNECTED")); emit({ type: "failed" }); } });
      await page.exposeFunction("__nonameHostEmit", (event: HostEvent) => {
        if (instance.ended) return;
        if (event.type === "ready") ready();
        emit(event);
      });
      await page.addInitScript(data => {
        Object.defineProperty(window, "__nonameHost", { value: data, writable: false });
        localStorage.setItem("gplv3_noname_alerted", "true");
      }, spec);
      await page.goto(this.options.clientUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      await waiting;
      instance.timer = setTimeout(() => { emit({ type: "failed" }); void this.stop(spec.instanceId); }, 4 * 60 * 60 * 1000);
    } catch (error: any) {
      console.error("Game host startup failed", { roomId: spec.roomId, instanceId: spec.instanceId, message: String(error.message).slice(0, 300) });
      await this.stop(spec.instanceId); throw error;
    }
    finally { clearTimeout(timeout); }
  }
  async receive(instanceId: string, message: { accountId: string; type: string; payload?: unknown }) {
    const instance = this.instances.get(instanceId);
    if (!instance?.page || instance.ended) throw new Error("INSTANCE_UNAVAILABLE");
    await instance.page.evaluate(data => {
      const receiver = (window as any).__nonameHostReceive;
      if (typeof receiver !== "function") throw new Error("HOST_NOT_READY");
      return receiver(data);
    }, message);
  }
  async stop(id: string) {
    const instance = this.instances.get(id);
    if (!instance) return;
    instance.ended = true; clearTimeout(instance.timer); instance.fail?.(new Error("HOST_CANCELLED"));
    try { await instance.browser?.close(); }
    catch (error: any) { console.error("Game host close failed", { instanceId: id, message: String(error?.message || error).slice(0, 300) }); }
    finally { this.instances.delete(id); }
  }
  async close() { await Promise.allSettled([...this.instances.keys()].map(id => this.stop(id))); }
  get count() { return this.instances.size; }
}
