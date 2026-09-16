import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import vm from "node:vm";
import ts from "typescript";
import preserveLegacySteps from "../apps/core/scripts/vite-plugin-legacy-steps.ts";

const root = resolve(import.meta.dirname, "..");
const requireCore = createRequire(resolve(root, "apps/core/package.json"));
const { build } = await import(pathToFileURL(requireCore.resolve("vite")).href);
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

// Exercise the real StepParser, isolating only browser imports and the outer
// event scheduler. Each returned function is exactly what the runtime executes.
const parserSource = read("apps/core/noname/library/element/GameEvent/compilers/StepCompiler.ts");
const parserCode = ts.transpileModule(parserSource.slice(parserSource.indexOf("class StepParser")), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
function steps(content: Function, topVars: any = {}) {
  const Parser = vm.runInNewContext(`${parserCode}; StepParser`, {
    ...Object.fromEntries(["_status", "ai", "game", "get", "lib", "ui"].map(key => [key, topVars[key] || {}])),
    security: { getIsolatedsFrom: () => [null, null, Function], isSandboxRequired: () => false },
    ErrorManager: { setCodeSnippet() {} }, CodeSnippet: class {},
    ContentCompiler: { compile: (contents: any) => contents },
  });
  return new Parser(content).getResult();
}

function property(code: string, name: string, child?: string) {
  const ast = ts.createSourceFile("fixture.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  let found: ts.Node | undefined;
  function visit(node: ts.Node) {
    if (found) return;
    if (ts.isMethodDeclaration(node) && node.name.getText(ast) === name && !child) { found = node; return; }
    if (ts.isPropertyAssignment(node) && node.name.getText(ast).replace(/["']/g, "") === name) {
      found = child && ts.isObjectLiteralExpression(node.initializer)
        ? node.initializer.properties.find(p => p.name?.getText(ast) === child) : node.initializer;
      if (found) return;
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.ok(found, `Missing ${name}.${child || ""}`);
  const text = found.getText(ast);
  return ts.isMethodDeclaration(found) ? vm.runInNewContext(`({${text}}).${child || name}`) : vm.runInNewContext(`(${text})`);
}

async function bundle(source: string, protect: boolean) {
  const result: any = await build({ configFile: false, logLevel: "silent", root,
    plugins: [{ name: "fixture", resolveId: id => id.replaceAll("\\", "/").endsWith("/fixture.js") || id === "fixture.js" ? "\0fixture.js" : null, load: id => id === "\0fixture.js" ? source : null }, ...(protect ? [preserveLegacySteps()] : [])],
    build: { write: false, minify: false, target: ["chrome91", "safari16.4"], lib: { entry: "fixture.js", formats: ["es"] },
      rollupOptions: { external: ["noname"], treeshake: false } },
  });
  return result[0].output.find((item: any) => item.type === "chunk").code;
}

test("real twzhiqu survives production renaming, repeated use, combat and cancellation", async () => {
  const source = read("apps/core/character/tw/skill.js");
  const unsafe = property(await bundle(source, false), "twzhiqu", "content");
  assert.match(unsafe.toString(), /target2/); // prove this fixture catches the reported build defect
  const code = await bundle(source, true);
  assert.doesNotMatch(code, /__NONAME_STEP_BODY_/);
  const content = property(code, "twzhiqu", "content");
  for (const fight of [false, true]) {
    const used: any[] = [];
    const shown: any[] = [];
    const target = { isIn: () => true, inRange: () => fight };
    const cards = [{ name: "shan", type: "basic" }, { name: "sha", type: "basic" }, { name: "wuzhong", type: "trick" }];
    const player = { isIn: () => true, inRange: () => fight, logSkill() {}, showCards: (cards: any) => shown.push(...cards),
      chooseUseTarget(card: any) { const next: any = { card, set(key: string, value: any) { this[key] = value; return this; } }; used.push(next); return next; } };
    const status: any = {};
    const compiled = steps(content, { _status: status, game: { countPlayer: () => 3, cardsGotoOrdering: (cards: any) => ({ cards }), log() {} },
      get: { cards: () => cards, name: (card: any) => card.name, type2: (card: any) => card.type, translation: () => "严纲" },
      lib: { filter: { targetEnabledx: () => true } } });
    const event: any = { _result: { bool: true, targets: [target] }, redo() {}, finish() { this.finished = true; } };
    if (!fight) assert.throws(() => steps(unsafe)[2](event, null, player), /target2/);
    compiled[1](event, null, player);
    for (let i = 0; i < 4; i++) compiled[2](event, null, player);
    assert.deepEqual(used.map(next => next.card.name), fight ? ["sha", "wuzhong"] : ["sha"]);
    assert.equal(shown.length, used.length);
    for (const next of used) {
      status.event = { name: "chooseTarget", getParent: () => next };
      assert.equal(next.filterTarget(next.card, player, target), true);
      assert.equal(next.filterTarget(next.card, player, {}), false);
    }
    const cancelled: any = { _result: { bool: false }, finish() { this.finished = true; } };
    compiled[1](cancelled, null, player);
    assert.equal(cancelled.finished, true);
  }
});

test("all injected step locals retain their names across scopes and nested callbacks", async () => {
  const names = ["source", "target", "targets", "card", "cards", "skill", "forced", "num", "result"];
  const source = `export function globals(){return [${names.join(",")}];}
    export const skill = { content() { "step 0"; ${names.map(name => `var ${name} = event.seed; event.${name === "result" ? "_result" : name} = ${name};`).join("\n")}
    "step 1"; event.trace = [${names.join(",")}].map(value => value); } };`;
  const content = property(await bundle(source, true), "content");
  const compiled = steps(content);
  const event: any = { seed: { value: 7 } };
  compiled[0](event);
  compiled[1](event);
  assert.equal(event.trace.length, names.length);
  assert.ok(event.trace.every((value: any) => value === event.seed));
});

for (const path of ["apps/core/extension/清瑶葭绮/members/假装无敌/CharacterCard.js", "apps/core/extension/分支武将/packs/pack_36.js"]) {
  test(`${path}: damage/recover filters stop at missing parents and retain the recursion limit`, () => {
    const code = read(path);
    for (const [skill, parentName] of [["ymtianjie", "damage"], ["ymtianyu", "recover"]]) {
      const ast = ts.createSourceFile(path, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      let skillCode = "";
      function visit(node: ts.Node) { if (ts.isPropertyAssignment(node) && node.name.getText(ast) === skill && ts.isObjectLiteralExpression(node.initializer)) skillCode = node.initializer.getText(ast); else ts.forEachChild(node, visit); }
      visit(ast);
      const nested = ts.createSourceFile("nested.js", `(${skillCode})`, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      let filterCode = "";
      function findFilter(node: ts.Node) {
        if (ts.isPropertyAssignment(node) && node.name.getText(nested) === "filter" && /while\(e && e.name\)/.test(node.initializer.getText(nested))) filterCode = node.initializer.getText(nested);
        ts.forEachChild(node, findFilter);
      }
      findFilter(nested);
      assert.ok(filterCode);
      const guarded = vm.runInNewContext(`(${filterCode})`);
      const friend: any = { hp: 1, maxHp: 3 };
      const foe: any = { hp: 2, maxHp: 3 };
      const friends: any = [friend]; friends.contains = friends.includes;
      friends.concat = (...args: any[]) => { const list: any = Array.prototype.concat.apply(friends, args); list.contains = list.includes; return list; };
      const player: any = { next: friend, previous: foe, getFriends: () => friends };
      const parent: any = { name: parentName, source: player, player: { hp: 3, next: foe, previous: friend }, num: 2 };
      for (const end of [undefined, null, {}]) {
        const event: any = { name: "changeHp", num: 2, parent: end, getParent: () => parent };
        assert.equal(guarded(event, player), true);
      }
      let chain: any;
      for (let i = 0; i < 51; i++) chain = { name: `${skill}_${parentName}`, parent: chain };
      assert.equal(guarded({ name: "changeHp", num: 2, parent: chain, getParent: () => parent }, player), false);
    }
  });
}
