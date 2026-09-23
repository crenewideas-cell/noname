import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../../apps/core/noname/ui/presentation.js", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

test("host, guest and reconnect retain the local presentation preference independently of room rules", () => {
	const states: { online?: boolean; connectMode?: boolean; mode?: string }[] = [{ online: true }, { connectMode: true }, { mode: "connect" }];
	for (const state of states) for (const preference of ["classic", "shousha"]) {
		const lib = { config: { presentation_style: preference, mode: state.mode || "identity" } };
		const game = { online: !!state.online }, _status = { connectMode: !!state.connectMode };
		const document = { documentElement: { dataset: { presentation: "classic" } } }, exports: any = {};
		vm.runInNewContext(code, { exports, require: () => ({ lib, game, _status }), document });
		exports.applyPresentation();
		assert.equal(document.documentElement.dataset.presentation, preference);
		assert.equal(exports.usesModernPresentation(), preference !== "classic");
		assert.equal(lib.config.presentation_style, preference);
		game.online = false; _status.connectMode = false; lib.config.mode = "identity";
		exports.applyPresentation();
		assert.equal(document.documentElement.dataset.presentation, preference);
	}
});
