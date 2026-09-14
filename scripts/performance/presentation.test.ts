import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../../apps/core/noname/ui/presentation.js", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

test("host, guest and reconnect presentation is modern without changing saved offline preference", () => {
	const states: { online?: boolean; connectMode?: boolean; mode?: string }[] = [{ online: true }, { connectMode: true }, { mode: "connect" }];
	for (const state of states) {
		const lib = { config: { presentation_style: "classic", mode: state.mode || "identity" } };
		const game = { online: !!state.online }, _status = { connectMode: !!state.connectMode };
		const document = { documentElement: { dataset: { presentation: "classic" } } }, exports: any = {};
		vm.runInNewContext(code, { exports, require: () => ({ lib, game, _status }), document });
		exports.applyPresentation();
		assert.equal(document.documentElement.dataset.presentation, "shousha");
		assert.equal(exports.usesModernPresentation(), true);
		assert.equal(lib.config.presentation_style, "classic");
		game.online = false; _status.connectMode = false; lib.config.mode = "identity";
		exports.applyPresentation();
		assert.equal(document.documentElement.dataset.presentation, "classic");
	}
});
