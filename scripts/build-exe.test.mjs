import test from "node:test";
import assert from "node:assert/strict";
import { includeRuntimeFile, includeWindowsRuntimeFile, parseWindowsArgs, windowsManifest, validateModuleImports } from "./build-exe.mjs";
import { copyDesktopDependencies } from "./desktop-dependencies.mjs";
import { mkdtemp, mkdir, writeFile, readFile, rm, access } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

test("desktop free choice uses the existing browser setting default without changing source or saved choices", async () => {
  const source = await readFile(new URL('../apps/core/noname/library/index.js', import.meta.url), 'utf8');
  const browserDefault = Number(/showMax_character_number:\s*\{[\s\S]*?init:\s*(\d+)/.exec(source)?.[1]);
  assert.equal(browserDefault, 10);
  const config = { theme: 'woodden', layout: 'long2' };
  assert.deepEqual(windowsManifest('game/config.json', config), { showMax_character_number: browserDefault, ui_workshop_active: 'builtin-rzsh', ...config });
  assert.equal(Object.hasOwn(config, 'showMax_character_number'), false);
  assert.equal(windowsManifest('game/config.json', { showMax_character_number: 50 }).showMax_character_number, 50);
  assert.equal(windowsManifest('game/config.json', { ui_workshop_active: 'builtin-shousha-standard' }).ui_workshop_active, 'builtin-shousha-standard');
  assert.equal(windowsManifest('game\\config.json', {}).showMax_character_number, browserDefault);
  assert.deepEqual(windowsManifest('online-client/game/config.json', config), config);
});

test("Windows defaults to the full-resource directory and rejects conflicting targets", () => {
  assert.deepEqual(parseWindowsArgs([]), { help: false, target: "dir", withOnline: true });
  assert.equal(parseWindowsArgs(["--portable"]).target, "portable");
  assert.equal(parseWindowsArgs(["--", "--dir"]).target, "dir");
  assert.equal(parseWindowsArgs(["--installer", "--offline-only"]).withOnline, false);
  for (const args of [["--portable", "--dir"], ["--portabel"], ["--dir&calc"]]) assert.throws(() => parseWindowsArgs(args));
});

test("Windows omits dynamic skin packs and nested temp while retaining static skins and UI effects", () => {
  for (const path of ["extension/本地动态皮肤包", "extension/imports/本地动态皮肤包/pack/model.png",
    "extension/十周年局内UI/assets/dynamic", "extension/手杀标准UI/original/十周年UI/assets/dynamic/曹植/model.skel",
    "online-client/ui-skins/十周年局内UI/assets/dynamic/曹植/model.png", "temp", "image/Temp/a.png", "extension/示例/TEMP/code.js",
    "online-client/audio/temp/voice.mp3"]) {
    assert.equal(includeWindowsRuntimeFile(path), false, path);
    assert.equal(includeWindowsRuntimeFile(path, true), false, path);
    assert.equal(includeWindowsRuntimeFile(path.replaceAll("/", "\\")), false, path);
  }
  for (const path of ["extension/十周年局内UI/assets/animation/effect.skel", "extension/如真似幻/spine/uihome/BeiJing.skel",
    "extension/手杀标准UI/original/十周年UI/assets/animation/effect.atlas", "image/skin/caocao/静态.webp",
    "extension/怒焰三国/image/skin-sets/original/a.jpg", "extension/示例/src/runtime.ts", "noname/skin/localDynamic/index.js",
    "extension/分支武将/assets/extension/EpicFX/asset/skel/emoji/dynamicIcon/a.png"]) assert.equal(includeWindowsRuntimeFile(path), true, path);
});

test("Windows UI catalogs do not advertise removed skins or assets", () => {
  for (const prefix of ["extension", "online-client/ui-skins"]) {
    assert.deepEqual(windowsManifest(`${prefix}/十周年局内UI/files.json`, ["assets/dynamic/a.skel", "assets/animation/a.skel", "temp/a.png"]), ["assets/animation/a.skel"]);
    for (const provider of ["十周年局内UI", "手杀标准UI/native"]) {
      const source = { skins: { caocao: { test: {} } }, effects: { skill: "effect" } };
      assert.deepEqual(windowsManifest(`${prefix}/${provider}/animation-assets.json`, source), { skins: {}, effects: source.effects });
      assert.ok(source.skins.caocao, "source project catalog is unchanged");
    }
  }
});

test("copied extension imports are checked against the standalone tree", async () => {
  const stage = await mkdtemp(join(tmpdir(), "noname-module-check-"));
  try {
    await mkdir(join(stage, "extension/test"), { recursive: true });
    await writeFile(join(stage, "noname.js"), "export const skinEnabled = true;");
    await writeFile(join(stage, "extension/test/extension.js"), "import {skinEnabled} from 'noname'; export * from './bridge.js';");
    await writeFile(join(stage, "extension/test/bridge.js"), "import '../../noname/skin/management.js';");
    await assert.rejects(validateModuleImports(stage, ["extension/test/extension.js"], { noname: "/noname.js" }), /noname\/skin\/management.js.*extension\/test\/bridge.js/);
    await writeFile(join(stage, "extension/test/bridge.js"), "export {skinEnabled} from 'noname';");
    assert.equal(await validateModuleImports(stage, ["extension/test/extension.js"], { noname: "/noname.js" }), 3);
  } finally { await rm(stage, { recursive: true, force: true }); }
});

test("keeps dynamically loaded extension source, media, licenses and JIT", () => {
  for (const path of ["extension/名将杀/src/js/lib/index.js", "extension/示例/extension.ts", "extension/示例/panel.vue", "extension/示例/info.json", "extension/示例/LICENSE.md", "image/hlhj/theme/motion/background.mp4", "identity.jpg", "jit-test.ts", "service-worker.js", "vendor/vue.js", "online-client/vendor/vue.js"]) assert.equal(includeRuntimeFile(path), true, path);
  assert.equal(includeRuntimeFile("extension/名将杀/src", true), true);
});

test("materializes transitive runtime dependencies without dev packages", async () => {
  const temp = await mkdtemp(join(tmpdir(), "noname-dependencies-"));
  try {
    const source = join(temp, "project");
    const output = join(temp, "standalone/node_modules");
    async function fixture(name, dependencies = {}, code = "module.exports = true") {
      const directory = join(source, "node_modules", name);
      await mkdir(directory, { recursive: true });
      await writeFile(join(directory, "package.json"), JSON.stringify({ name, version: "1.0.0", main: "index.js", dependencies, devDependencies: { "missing-dev-tool": "1.0.0" } }));
      await writeFile(join(directory, "index.js"), code);
      return directory;
    }
    await fixture("@electron/remote");
    await fixture("ws");
    await fixture("@noname/fs", { fastify: "1.0.0" }, "module.exports = require('fastify')");
    const fastify = await fixture("fastify", { string_decoder: "1.0.0" }, "module.exports = require('string_decoder/fixture.js')");
    const decoder = await fixture("string_decoder");
    await writeFile(join(decoder, "fixture.js"), "module.exports = 'dependency tree complete'");
    await writeFile(join(fastify, "LICENSE.md"), "license");
    await copyDesktopDependencies(source, output);
    // Remove original dependencies: resolution must work entirely in the output.
    await rm(source, { recursive: true, force: true });
    const require = createRequire(join(temp, "standalone/package.json"));
    assert.equal(require("@noname/fs"), "dependency tree complete");
    await access(join(output, "@noname/fs/node_modules/fastify/LICENSE.md"));
    assert.throws(() => require.resolve("missing-dev-tool"));
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test("excludes development inputs, archives and original media", () => {
  for (const path of ["src/noname/game/index.js", "docs/guide.md", "node_modules/typescript/lib/typescript.js", "extension/示例/archive.zip", "extension/示例/debug.log", "extension/示例/a.test.ts", "extension/示例/a.d.ts", "extension/红楼幻境/theme/动态资源/video.mp4", "extension/红楼幻境/theme/绛珠仙子_配音/001.wav", "extension/红楼幻境/voice/import/hlhj_daiyu.json", "image/.git/config"]) assert.equal(includeRuntimeFile(path), false, path);
  for (const path of ["src", "docs", "node_modules", "Home", ".git"]) assert.equal(includeRuntimeFile(path, true), false, path);
});
