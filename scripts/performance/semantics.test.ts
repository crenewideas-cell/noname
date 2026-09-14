import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp } from "node:fs/promises";
import { resolve } from "node:path";
import { prepareSemantics } from "./semantics.ts";
import { root } from "./environment.ts";

test("fixture build does not turn a subsequent dev server into production",async()=>{
	const original=process.env.NODE_ENV;
	try {
		delete process.env.NODE_ENV;
		await mkdir(resolve(root,"output/performance"),{recursive:true});
		const directory=await mkdtemp(resolve(root,"output/performance/env-regression-"));
		const result=await prepareSemantics(directory);
		assert.equal(process.env.NODE_ENV,undefined);
		assert.equal(result.policies.buildSelf.treeshake,false);
		assert.ok(result.cases.buildSelf.includes("step 1"));
	} finally { if(original===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=original; }
});
