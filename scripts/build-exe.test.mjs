import test from "node:test";
import assert from "node:assert/strict";
import { includeRuntimeFile } from "./build-exe.mjs";
import { copyDesktopDependencies } from "./desktop-dependencies.mjs";
import { mkdtemp, mkdir, writeFile, rm, access } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

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
