import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { minify } from "terser";
import ts from "typescript";
import { core, root, requireCore } from "./environment.ts";

export async function prepareSemantics(out: string) {
	// Vite build defaults NODE_ENV to production. Do not let a fixture build change a later dev server.
	const previousNodeEnv=process.env.NODE_ENV;
	try { return await buildFixtures(out); }
	finally { if(previousNodeEnv===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=previousNodeEnv; }
}

async function buildFixtures(out: string) {
	const source = await readFile(resolve(root, "scripts/performance/step-fixtures.js"), "utf8");
	const buildSource = await readFile(resolve(core, "scripts/build.ts"), "utf8");
	const ast = ts.createSourceFile("build.ts", buildSource, ts.ScriptTarget.Latest, true);
	const policies: Record<string, any> = {};
	for (const node of ast.statements) {
		if (!ts.isFunctionDeclaration(node) || !["buildSelf", "buildIndividual"].includes(node.name?.text || "")) continue;
		const settings: any = {};
		function visit(n: ts.Node) {
			if (ts.isPropertyAssignment(n) && ["minify", "treeshake"].includes(n.name.getText(ast))) {
				const value = n.initializer.getText(ast);
				if (!["true", "false", '"terser"', '"esbuild"'].includes(value)) throw new Error("Review changed build policy before running semantic guard");
				settings[n.name.getText(ast)] = JSON.parse(value);
			} ts.forEachChild(n, visit);
		} visit(node); policies[node.name!.text] = settings;
	}
	if (Object.keys(policies).length !== 2) throw new Error("Build policy extraction failed");
	const { build } = await import(pathToFileURL(requireCore.resolve("vite")).href);
	const cases: Record<string, string> = { source };
	// Keep the formerly failing tree-shaken build as an explicit negative
	// control, so a broken assertion cannot silently certify the new policy.
	const variants = { ...policies, unsafeTreeShake: { minify: false, treeshake: true } };
	for (const [name, policy] of Object.entries(variants)) {
		const result: any = await build({ configFile: false, logLevel: "silent", root: core,
			build: { write: false, minify: policy.minify, target: ["chrome91", "safari16.4"], lib: { entry: resolve(root, "scripts/performance/step-fixtures.js"), formats: ["es"] }, rollupOptions: { treeshake: policy.treeshake } } });
		cases[name] = result[0].output.find((item: any) => item.type === "chunk").code;
	}
	cases.unsafeTerser = (await minify(source, { module: true })).code!;
	await mkdir(resolve(out,"semantics"), { recursive: true });
	for (const [name, code] of Object.entries(cases)) await writeFile(resolve(out,`semantics/${name}.js`),code);
	return { cases, policies, hashes: Object.fromEntries(Object.entries(cases).map(([name, code]) => [name, createHash("sha256").update(code).digest("hex")])) };
}

export async function verifySemantics(page: any, prepared: Awaited<ReturnType<typeof prepareSemantics>>) {
	return page.evaluate(async ({ cases, policies, hashes }: any) => {
		const { lib } = await import("/noname.js");
		// Source builds preserve this module; for bundled channels get the same compiler from a real event.
		const results: any[] = [];
		for (const [variant, code] of Object.entries(cases)) {
			const url = URL.createObjectURL(new Blob([code as string], { type: "text/javascript" }));
			try {
				const fixtures = await import(/* @vite-ignore */ url);
				for (const [name, expected] of Object.entries({ legacyRedo: ["start", "value:1:result:7", "value:2:result:7", "end:3"], legacyGoto: ["start", "end"], modernAsync: ["start", "end"] })) {
					try {
						const event = new lib.element.GameEvent("perfFixture", false);
						event.trace = []; let yields = 0;
						event.waitNext = async () => { if (++yields > 12) throw new Error("Fixture runaway"); return { answer: 7 }; };
						event.setContent(fixtures[name]);
						const cached = new lib.element.GameEvent("perfFixture", false).setContent(fixtures[name]);
						if (cached.content !== event.content) throw new Error("Compiler cache identity changed");
						await event.content.call(event, event);
						const pass = JSON.stringify(event.trace) === JSON.stringify(expected);
						results.push({ variant, name, pass, trace: event.trace, yields, expected });
					} catch (error) { results.push({ variant, name, pass: false, error: String(error) }); }
				}
			} finally { URL.revokeObjectURL(url); }
		}
		const controls = ["unsafeTerser", "unsafeTreeShake"];
		const positive = results.filter(r => !controls.includes(r.variant));
		const negativeControlsDetected = controls.every(variant => results.some(r => r.variant === variant && r.name.startsWith("legacy") && !r.pass));
		return { policies, hashes, results, passed: positive.every(r => r.pass) && negativeControlsDetected,
			note: "Unsafe Terser and the former tree-shaken build are intentional negative controls; each must expose a legacy semantic change. Build-policy fixtures are actual Vite outputs, not proof that the full game production build works." };
	}, prepared);
}
