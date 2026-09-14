/** Opt in with ?perf=1. No engine imports, observers or timers when disabled. */
export const perfEnabled = typeof window !== "undefined" && new URLSearchParams(location.search).get("perf") === "1";
type Sample = { name: string; startTime: number; duration: number; [key: string]: unknown };
const limit = 2048;
const buckets = new Map<string, { values: Sample[]; total: number }>();
const observers: PerformanceObserver[] = [];
const counters = new Map<string, number>();
let stopped = false;

function record(kind: string, sample: Sample) {
	if (!perfEnabled || stopped) return;
	let bucket = buckets.get(kind);
	if (!bucket) buckets.set(kind, bucket = { values: [], total: 0 });
	bucket.values[bucket.total++ % limit] = sample;
}

export function perfBegin() { return perfEnabled && !stopped ? performance.now() : -1; }
export function perfEnd(name: string, start: number) {
	if (!perfEnabled || start < 0 || stopped) return;
	const end = performance.now();
	record("stages", { name, startTime: start, duration: end - start });
	// User Timing also appears in CDP/DevTools traces. Clear entries to bound the timeline buffer.
	try {
		performance.measure(`noname:${name}`, { start, end });
		performance.clearMeasures(`noname:${name}`);
	} catch { /* Numeric measure options are unavailable on some older clients. */ }
}
export function perfMark(name: string) { perfEnd(name, perfBegin()); }
export function perfCount(name: string) {
	if (!perfEnabled || stopped || (!counters.has(name) && counters.size >= 128)) return;
	counters.set(name, (counters.get(name) || 0) + 1);
}
export function perfAwait<T>(name: string, task: () => Promise<T>): Promise<T> {
	if (!perfEnabled || stopped) return task();
	const start = perfBegin();
	try {
		return task().then(value => { perfEnd(name, start); return value; }, error => { perfEnd(`${name}:failed`, start); throw error; });
	} catch (error) { perfEnd(`${name}:failed`, start); throw error; }
}

if (perfEnabled) {
	const supported = typeof PerformanceObserver === "undefined" ? [] : PerformanceObserver.supportedEntryTypes || [];
	const consume = (kind: string, entries: PerformanceEntry[]) => {
		for (const entry of entries) {
			if (kind === "resource") {
				const resource = entry as PerformanceResourceTiming;
				// Paths only: query strings can contain private credentials.
				record(kind, { name: new URL(resource.name, location.href).pathname, startTime: entry.startTime, duration: entry.duration,
					transferSize: resource.transferSize, encodedBodySize: resource.encodedBodySize, decodedBodySize: resource.decodedBodySize,
					initiatorType: resource.initiatorType, responseStart: resource.responseStart, requestStart: resource.requestStart });
			} else if (kind === "event") {
				const event = entry as PerformanceEventTiming & { interactionId?: number };
				record(kind, { name: entry.name, startTime: entry.startTime, duration: entry.duration, processingStart: event.processingStart,
					processingEnd: event.processingEnd, interactionId: event.interactionId });
			} else record(kind, { name: entry.name, startTime: entry.startTime, duration: entry.duration });
		}
	};
	for (const kind of ["longtask", "resource", "event", "paint"]) {
		if (!supported.includes(kind)) continue;
		try {
			const observer = new PerformanceObserver(list => { consume(kind, list.getEntries()); if (kind === "resource") performance.clearResourceTimings(); });
			observer.observe({ type: kind, buffered: true, ...(kind === "event" ? { durationThreshold: 16 } : {}) });
			observers.push(observer);
		} catch { /* Capability detection, no application failure. */ }
	}
	const api = {
		begin: perfBegin, end: perfEnd, mark: perfMark,
		snapshot() {
			const data: Record<string, unknown> = {};
			for (const [kind, bucket] of buckets) {
				const cursor = bucket.total % limit;
				data[kind] = { total: bucket.total, dropped: Math.max(0, bucket.total - limit),
					entries: bucket.total <= limit ? bucket.values.slice() : [...bucket.values.slice(cursor), ...bucket.values.slice(0, cursor)] };
			}
			return { version: 1, limit, supported, stopped, counters: Object.fromEntries(counters), now: performance.now(), timeOrigin: performance.timeOrigin,
				navigation: performance.getEntriesByType("navigation").map(entry => entry.toJSON()), ...data };
		},
		stop() { observers.forEach(observer => observer.disconnect()); stopped = true; performance.clearResourceTimings(); },
	};
	(window as any).__nonamePerf = api;
	perfMark("collector.ready");
}
