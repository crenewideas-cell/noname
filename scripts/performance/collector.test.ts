import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../../apps/core/noname/util/performance.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function load(enabled: boolean, supportedObserver = true) {
	let ticks=0,measureCalls=0;
	const observers: any[]=[];
	class Observer {
		static supportedEntryTypes=["resource","longtask","event","paint"];
		options:any; stopped=false;
		constructor(public callback:Function){observers.push(this);}
		observe(options:any){this.options=options;}
		disconnect(){this.stopped=true;}
	}
	const window:any={},exports:any={};
	vm.runInNewContext(code,{window,exports,URL,URLSearchParams,location:{search:enabled?"?perf=1":"",href:"http://localhost/"},PerformanceObserver:supportedObserver?Observer:undefined,
		performance:{now:()=>++ticks,timeOrigin:1,measure:()=>measureCalls++,clearMeasures:()=>{},clearResourceTimings:()=>{},getEntriesByType:()=>[]}});
	return {api:window.__nonamePerf,exports,observers,calls:()=>measureCalls};
}
test("disabled collection creates no observer, global API or timing entries and preserves Promise identity",async()=>{
	const c=load(false);assert.equal(c.api,undefined);assert.equal(c.observers.length,0);
	const promise=Promise.resolve(42);assert.equal(c.exports.perfAwait("test",()=>promise),promise);
	c.exports.perfEnd("manual",0);c.exports.perfMark("x");assert.equal(c.calls(),0);
});
test("missing PerformanceObserver keeps manual diagnostics usable",()=>{
	const c=load(true,false);assert.equal(c.observers.length,0);c.exports.perfMark("manual");
	assert.equal(c.api.snapshot().stages.total,2);assert.equal(c.api.snapshot().supported.length,0);
});
test("ring buffers bound retention and keep order; stop freezes collection",()=>{
	const c=load(true);
	for(let i=0;i<5000;i++)c.exports.perfMark(`sample-${i}`);
	const snapshot=c.api.snapshot();assert.equal(snapshot.stages.entries.length,2048);assert.equal(snapshot.stages.total,5001);
	assert.equal(snapshot.stages.entries.at(-1).name,"sample-4999");assert.equal(snapshot.stages.dropped,2953);
	c.api.stop();c.exports.perfMark("late");assert.equal(c.api.snapshot().stages.total,5001);assert.ok(c.observers.every(o=>o.stopped));
});
test("async timings start before task work, preserve values and rejection identities",async()=>{
	const c=load(true);const error=new Error("expected");
	assert.equal(await c.exports.perfAwait("success",()=>Promise.resolve(7)),7);
	await assert.rejects(c.exports.perfAwait("async-error",()=>Promise.reject(error)),e=>e===error);
	assert.throws(()=>c.exports.perfAwait("sync-error",()=>{throw error;}),e=>e===error);
	const entries=c.api.snapshot().stages.entries;
	assert.ok(entries.some(e=>e.name==="success"&&e.duration>0));assert.ok(entries.some(e=>e.name==="sync-error:failed"));
});
test("resource records discard query secrets and count observations independently of buffer size",()=>{
	const c=load(true),observer=c.observers.find(o=>o.options.type==="resource");
	observer.callback({getEntries:()=>[{name:"http://localhost/image.png?token=secret",startTime:3,duration:4,transferSize:8,encodedBodySize:6,decodedBodySize:6,initiatorType:"img"}]});
	assert.equal(c.api.snapshot().resource.entries[0].name,"/image.png");
});
