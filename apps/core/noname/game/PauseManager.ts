import { lib, _status } from "noname";

export default class PauseManager {
	pause = new Deferred();
	pause2 = new Deferred();
	pause3 = new Deferred();
	over = new Deferred();
	delay = new Deferred();
	#delayList: Promise<void>[] = [];

	setDelay(promise: Promise<void>) {
		if (!this.delay.isStarted) {
			this.delay.start();
		}
		const newValue = promise.finally(() => {
			if (!this.#delayList.includes(newValue)) {
				return;
			}
			this.#delayList.remove(newValue);
			if (this.#delayList.length === 0) {
				this.delay.resolve();
			}
		});
		this.#delayList.push(newValue);
		return newValue;
	}

	async waitPause() {
		if (_status.paused2 || _status.imchoosing) {
			if (!lib.status.dateDelaying) {
				lib.status.dateDelaying = new Date();
			}
		}
		// A new pause can begin while an earlier pause is being released.
		// Always observe the current gates before advancing the event loop.
		while (true) {
			const pending = [this.pause, this.pause2, this.pause3, this.over, this.delay].filter(i => i.isStarted);
			if (!pending.length) break;
			await Promise.all(pending);
		}
		if (lib.status.dateDelaying) {
			lib.status.dateDelayed += lib.getUTC(new Date()) - lib.getUTC(lib.status.dateDelaying);
			delete lib.status.dateDelaying;
		}
	}
}

class Deferred {
	#promise: Promise<void> | null;
	#resolver: (() => void) | null;
	get isStarted() {
		return !!this.#promise;
	}
	start() {
		if (this.isStarted) {
			return;
		}
		({ promise: this.#promise, resolve: this.#resolver } = Promise.withResolvers());
	}
	resolve() {
		if (!this.isStarted) {
			return;
		}
		// Detach synchronously: resume() followed by pause() must create a new
		// gate, and releasing the old gate must never clear that new pause.
		const resolve = this.#resolver;
		this.#promise = null;
		this.#resolver = null;
		resolve?.();
	}
	then(onfulfilled?: ((value: void) => void | PromiseLike<void>) | null, onrejected?: ((reason: any) => never | PromiseLike<never>) | null) {
		if (!this.#promise) {
			return Promise.resolve().then(onfulfilled, onrejected);
		}
		return this.#promise.then(onfulfilled, onrejected);
	}
}
