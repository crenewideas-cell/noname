import { perfBegin, perfEnd, perfCount } from "./performance.js";

/** Cooperative UI work only. A step is atomic and returns true for more work. */
export class BackgroundTasks {
	constructor({ budget = 4, limit = 128 } = {}) {
		this.budget = budget;
		this.limit = limit;
		this.jobs = [];
		this.pending = null;
		this.lastInput = -Infinity;
		this.input = () => { this.lastInput = performance.now(); };
		this.listening = false;
	}
	schedule(step, { priority = "background", signal, label = "ui" } = {}) {
		if (signal?.aborted) return () => {};
		if (this.jobs.length >= this.limit) throw new Error("UI background queue capacity exceeded");
		const job = { step, priority, signal, label, queued: performance.now() };
		const cancel = () => {
			const index = this.jobs.indexOf(job);
			if (index >= 0) this.jobs.splice(index, 1);
			signal?.removeEventListener("abort", cancel);
			if (!this.jobs.length) this.stop();
		};
		job.cancel = cancel;
		signal?.addEventListener("abort", cancel, { once: true });
		this.jobs.push(job);
		perfCount("background.queued");
		this.listen();
		// User-requested work must not wait for a pending idle callback.
		if (priority === "user-visible") this.unschedule();
		this.wake();
		return cancel;
	}
	listen() {
		if (!this.listening && this.jobs.length) {
			for (const type of ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"]) document.addEventListener(type, this.input, { capture: true, passive: true });
			this.listening = true;
		}
	}
	unschedule() {
		if (!this.pending) return;
		if (this.pending.idle) cancelIdleCallback(this.pending.id);
		else clearTimeout(this.pending.id);
		this.pending = null;
	}
	stop() {
		this.unschedule();
		if (this.listening) for (const type of ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"]) document.removeEventListener(type, this.input, true);
		this.listening = false;
	}
	cancelAll() {
		for (const job of this.jobs.slice()) job.cancel();
		this.stop();
	}
	wake() {
		if (this.pending || !this.jobs.length) return;
		const urgent = this.jobs.some(job => job.priority === "user-visible");
		if (!urgent && typeof requestIdleCallback === "function" && typeof cancelIdleCallback === "function") {
			this.pending = { idle: true, id: requestIdleCallback(deadline => this.run(deadline), { timeout: 1000 }) };
		} else {
			this.pending = { idle: false, id: setTimeout(() => this.run(), urgent ? 0 : 16) };
		}
	}
	run(deadline) {
		this.pending = null;
		const start = performance.now();
		let steps = 0;
		while (this.jobs.length && performance.now() - start < this.budget) {
			const job = this.jobs.find(item => item.priority === "user-visible") || this.jobs[0];
			const expired = performance.now() - job.queued >= 1000;
			if (job.priority !== "user-visible" && !expired) {
				if (performance.now() - this.lastInput < 120 || navigator.scheduling?.isInputPending?.()) break;
				if (deadline && !deadline.didTimeout && deadline.timeRemaining() < 1) break;
			}
			const begin = perfBegin();
			try {
				if (job.step() !== true) job.cancel();
				else if (this.jobs.includes(job)) {
					// Round-robin within each priority; a large button batch cannot
					// monopolize every slice ahead of unrelated UI preparation.
					this.jobs.splice(this.jobs.indexOf(job), 1);
					this.jobs.push(job);
				}
			} catch (error) {
				job.cancel();
				console.error(`后台任务失败 (${job.label})`, error);
			} finally {
				perfEnd(`background:${job.label}`, begin);
			}
			steps++;
			// Even expired work yields after one atomic step under input pressure.
			if (performance.now() - this.lastInput < 120 || steps >= 100) break;
		}
		if (this.jobs.length) this.wake();
		else this.stop();
	}
}

export const backgroundTasks = new BackgroundTasks();
// No pending work or listeners until a task is submitted.
if (typeof window !== "undefined") {
	window.addEventListener("pagehide", event => {
		// A bfcache entry may resume the same game; retain its atomic callbacks.
		if (event.persisted) backgroundTasks.stop();
		else backgroundTasks.cancelAll();
	});
	window.addEventListener("pageshow", event => {
		if (event.persisted) { backgroundTasks.listen(); backgroundTasks.wake(); }
	});
}
