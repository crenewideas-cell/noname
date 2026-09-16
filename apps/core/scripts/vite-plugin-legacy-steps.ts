import { createHash } from "node:crypto";
import ts from "typescript";
import type { Plugin } from "vite";

/** StepCompiler splits function source into separate scopes at runtime.
 * Even non-minifying esbuild renames locals that shadow globals (target ->
 * target2), breaking the names reintroduced by StepCompiler in later steps.
 * Keep these bodies opaque until ALL bundler transforms have finished.
 */
export default function preserveLegacySteps(): Plugin {
	const bodies = new Map<string, string>();
	return {
		name: "noname-preserve-legacy-steps",
		apply: "build",
		enforce: "pre",
		buildStart() { bodies.clear(); },
		transform(code, id) {
			if (!/\.[cm]?[jt]s(?:\?|$)/.test(id) || !/["']step 0["']/.test(code)) return;
			const source = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true);
			const edits: { start: number; end: number; text: string }[] = [];
			function visit(node: ts.Node) {
				if ((ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node))
					&& node.body && ts.isBlock(node.body) && !node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)
					&& !("asteriskToken" in node && node.asteriskToken)
					&& node.body.statements.some(s => ts.isExpressionStatement(s) && ts.isStringLiteral(s.expression) && s.expression.text === "step 0")) {
					const body = code.slice(node.body.getStart(source) + 1, node.body.end - 1);
					const marker = `__NONAME_STEP_BODY_${createHash("sha256").update(id + ":" + node.pos + ":" + body).digest("hex")}__`;
					// TypeScript's emitter preserves identifiers and step labels while
					// lowering syntax to the same ES2021 baseline as Chromium 91.
					bodies.set(marker, ts.transpileModule(body, { compilerOptions: { target: ts.ScriptTarget.ES2021, module: ts.ModuleKind.ESNext } }).outputText);
					edits.push({ start: node.body.getStart(source) + 1, end: node.body.end - 1, text: `\n"${marker}";\n` });
					return;
				}
				ts.forEachChild(node, visit);
			}
			visit(source);
			if (!edits.length) return;
			for (const edit of edits.reverse()) code = code.slice(0, edit.start) + edit.text + code.slice(edit.end);
			return { code, map: null };
		},
		generateBundle: {
			order: "post",
			handler(_options, bundle) {
				for (const item of Object.values(bundle)) {
					if (item.type !== "chunk") continue;
					item.code = item.code.replace(/["'](__NONAME_STEP_BODY_[a-f0-9]+__)["'];?/g, (_match, marker) => {
						const body = bodies.get(marker);
						if (body === undefined) throw new Error(`Missing legacy step body: ${marker}`);
						return body;
					});
				}
			},
		},
	};
}
