import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../../apps/core/noname/util/backgroundTasks.js", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function fixture(idle = false) {
	let now = 0, next = 0;
	const pending = new Map<number, Function>();
	const listeners = new Map<string, Function>();
	const errors: unknown[] = [];
	const schedule = (callback: Function) => { pending.set(++next, callback); return next; };
	const exports: any = {};
	vm.runInNewContext(code, {
		exports, require: () => ({ perfBegin: () => -1, perfEnd() {}, perfCount() {} }),
		performance: { now: () => now }, navigator: {},
		document: { addEventListener: (type: string, callback: Function) => listeners.set(type, callback), removeEventListener: (type: string) => listeners.delete(type) },
		console: { error: (...args: unknown[]) => errors.push(args) },
		setTimeout: schedule, clearTimeout: (id: number) => pending.delete(id),
		...(idle ? { requestIdleCallback: schedule, cancelIdleCallback: (id: number) => pending.delete(id) } : {}),
	});
	return {
		queue: new exports.BackgroundTasks({ budget: 4 }), pending, listeners, errors,
		advance: (time: number) => { now += time; },
		run(deadline?: unknown) {
			const entry = pending.entries().next().value;
			assert.ok(entry, "expected an outstanding browser task");
			pending.delete(entry[0]); entry[1](deadline);
		},
	};
}

test("fallback yields at the budget between atomic steps and releases listeners", () => {
	const f = fixture(); let count = 0;
	f.queue.schedule(() => { count++; f.advance(3); return count < 4; });
	f.run(); assert.equal(count, 2); assert.equal(f.pending.size, 1);
	f.run(); assert.equal(count, 4); assert.equal(f.pending.size, 0); assert.equal(f.listeners.size, 0);
});

test("visible work preempts idle preparation while FIFO background order is retained", () => {
	const f = fixture(true), calls: string[] = [];
	f.queue.schedule(() => { calls.push("background-1"); f.advance(4); });
	f.queue.schedule(() => { calls.push("background-2"); });
	f.queue.schedule(() => { calls.push("visible"); f.advance(4); }, { priority: "user-visible" });
	assert.equal(f.pending.size, 1);
	f.run(); assert.deepEqual(calls, ["visible"]);
	f.run({ timeRemaining: () => 10 }); assert.deepEqual(calls, ["visible", "background-1"]);
	f.run({ timeRemaining: () => 10 }); assert.deepEqual(calls, ["visible", "background-1", "background-2"]);
});

test("input postpones optional work and expiry allows only one step under pressure", () => {
	const f = fixture(); let count = 0;
	f.queue.schedule(() => { count++; return true; });
	f.listeners.get("keydown")!(); f.run(); assert.equal(count, 0);
	f.advance(1001); f.listeners.get("keydown")!(); f.run(); assert.equal(count, 1);
	f.queue.cancelAll(); assert.equal(f.pending.size, 0); assert.equal(f.listeners.size, 0);
});

test("abort cancels a continuation; failure does not strand subsequent work", () => {
	const f = fixture(), abort = new AbortController(); let count = 0;
	f.queue.schedule(() => { count++; f.advance(4); return true; }, { signal: abort.signal });
	f.run(); abort.abort(); assert.equal(f.pending.size, 0);
	f.queue.schedule(() => { throw new Error("expected"); });
	f.queue.schedule(() => { count++; });
	f.run(); assert.equal(count, 2); assert.equal(f.errors.length, 1); assert.equal(f.pending.size, 0);
});

test("capacity refusal leaves existing jobs intact and pre-aborted work is omitted", () => {
	const f = fixture(), abort = new AbortController(); abort.abort();
	f.queue.limit = 1;
	f.queue.schedule(() => { throw new Error("must not run"); }, { signal: abort.signal });
	assert.equal(f.pending.size, 0);
	f.queue.schedule(() => {});
	assert.throws(() => f.queue.schedule(() => {}), /capacity/);
	f.run(); assert.equal(f.errors.length, 0); assert.equal(f.pending.size, 0);
});
