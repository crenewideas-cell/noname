import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { deployedOnlineRuntime } from "./online-release.mjs";
import { assembleOnline } from "./online-artifacts.ts";
import { PROVIDER_PROGRAMS } from "../apps/core/noname/ui/workshop/providerFiles.js";

const build = "online-0123456789abcdef0123", origin = "https://example.test";
async function fixture(t: any) {
  const root = await mkdtemp(join(tmpdir(), "noname-release-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const put = async (name: string, text = "release code") => {
    await mkdir(dirname(join(root, name)), { recursive: true });
    await writeFile(join(root, name), text);
  };
  await put("dist-online-host/deployment.json", JSON.stringify({ kind: "host", build, origin }));
  for (const file of ["index.html", "noname.js", "noname/entry.js", "vendor/vue.js"]) await put(`dist-online-host/${file}`);
  await put("dist-online-host/client.js", `export const build = ${JSON.stringify(build)}, origin = ${JSON.stringify(origin)};`);
  return { root, put };
}
const capabilities = (id = build) => async () => new Response(JSON.stringify({ ok: true, build: id }));

test("uses the published release even when local source differs", async t => {
  const { root, put } = await fixture(t);
  await put("apps/core/dist/client.js", "incompatible local build");
  const release = await deployedOnlineRuntime(root, origin, capabilities());
  assert.equal(release.build, build);
  assert.equal(release.directory, join(root, "dist-online-host"));
});

test("rejects stale releases, mismatched origins, edited manifests and unavailable servers", async t => {
  const { root, put } = await fixture(t);
  await assert.rejects(deployedOnlineRuntime(root, origin, capabilities("online-other")), /发布版本不一致/);
  await assert.rejects(deployedOnlineRuntime(root, "https://another.test", capabilities()), /来源或版本无效/);
  await assert.rejects(deployedOnlineRuntime(root, origin, async () => new Response("unavailable", { status: 503 })), /HTTP 503/);
  await put("dist-online-host/client.js", "export const build = 'some other build';");
  await assert.rejects(deployedOnlineRuntime(root, origin, capabilities()), /不能只修改版本号/);
});

test("assembles actual published client code with local media and a client manifest", async t => {
  const { root, put } = await fixture(t);
  await put("apps/core/dist/client.js", "incompatible local build");
  await put("LICENSE", "license");
  await put("apps/core/dist/font/example.woff2", "font");
  await put("apps/core/dist/theme/example.png", "theme media");
  await put("apps/core/image/character/example.jpg", "local portrait");
  await put("apps/core/audio/example.mp3", "local audio");
  const extension = "apps/core/extension/packs/红楼幻境";
  await put(`${extension}/hlhj_daiyu.svg`, "portrait");
  await put(`${extension}/artwork/example.webp`, "art");
  await put(`${extension}/theme/example.png`, "theme");
  for (const [provider, files] of Object.entries(PROVIDER_PROGRAMS)) {
    await put(`apps/core/extension/ui/${provider}/files.json`, "[]");
    for (const file of files) await put(`apps/core/extension/ui/${provider}/${file}`, "skin code");
  }
  const release = await deployedOnlineRuntime(root, origin, capabilities());
  const output = await assembleOnline(root, true, build, origin, release.directory);
  assert.equal(await readFile(join(output, "client.js"), "utf8"), await readFile(join(release.directory, "client.js"), "utf8"));
  assert.equal(await readFile(join(output, "image/character/example.jpg"), "utf8"), "local portrait");
  assert.equal(await readFile(join(output, "audio/example.mp3"), "utf8"), "local audio");
  assert.equal(await readFile(join(output, "font/example.woff2"), "utf8"), "font");
  assert.equal(await readFile(join(output, "theme/example.png"), "utf8"), "theme media");
  assert.equal(await readFile(join(output, "ui-skins/如真似幻/runtime.js"), "utf8"), "skin code");
  assert.deepEqual(JSON.parse(await readFile(join(output, "deployment.json"), "utf8")), { build, origin, kind: "client" });
  assert.equal(JSON.parse(await readFile(join(release.directory, "deployment.json"), "utf8")).kind, "host");
  await assert.rejects(assembleOnline(root, false, build, origin, release.directory), /outside the output/);
});
