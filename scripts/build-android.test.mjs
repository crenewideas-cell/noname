import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { parseArgs, collectRuntime, writeResourceZip, findJavaHome, sameContent, acquireBuildLock } from "./build-android.mjs";
import { validateRuntime } from "./build-exe.mjs";
import { dexClasses } from "./android-apk.mjs";

test("APK checks distinguish a class reference from an actual class definition", () => {
  const data = Buffer.alloc(256); data.write("dex\n035\0");
  data.writeUInt32LE(112, 60); data.writeUInt32LE(120, 68);
  data.writeUInt32LE(1, 96); data.writeUInt32LE(128, 100);
  data.writeUInt32LE(180, 112); data.writeUInt32LE(200, 116);
  data.writeUInt32LE(0, 120); data.writeUInt32LE(1, 124);
  data.writeUInt32LE(0, 128);
  data[180] = 9; data.write("LPresent;\0", 181);
  data[200] = 9; data.write("LMissing;\0", 201);
  assert.deepEqual([...dexClasses(data)], ["LPresent;"]);
});

test("arguments reject typos and shell metacharacters before invoking commands", () => {
  assert.equal(parseArgs([]).variant, "release");
  assert.equal(parseArgs(["--", "--variant=debug"]).variant, "debug");
  for (const args of [["--variant=debug&calc"], ["--varaint=debug"], ["--variant=debug", "--variant=release"]]) assert.throws(() => parseArgs(args));
});

test("concurrent builders cannot overwrite the same output", async () => {
  const dir = await mkdtemp(join(tmpdir(), "noname-build-lock-"));
  try {
    const path = join(dir, "build.lock"), release = await acquireBuildLock(path);
    try { await assert.rejects(acquireBuildLock(path), /已在运行/); } finally { await release(); }
    const second = await acquireBuildLock(path); await second();
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test("JDK detection honors a valid explicit JDK even with the wrong JAVA_HOME", async () => {
  const dir = await mkdtemp(join(tmpdir(), "noname-jdk-"));
  try {
    await mkdir(join(dir, "bin"));
    await writeFile(join(dir, "release"), 'JAVA_VERSION="21.0.8"');
    for (const exe of ["java", "javac"]) await writeFile(join(dir, "bin", exe + (process.platform === "win32" ? ".exe" : "")), "");
    assert.equal(findJavaHome({ ANDROID_JAVA_HOME: dir, JAVA_HOME: "missing", PATH: "" }), dir);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test("resource ZIP preserves Chinese names, runtime source and unpacked overlay paths", async () => {
  const dir = await mkdtemp(join(tmpdir(), "noname-android-"));
  try {
    const source = join(dir, "source"); await mkdir(join(source, "絶伦逸羣", "src"), { recursive: true });
    await writeFile(join(source, "絶伦逸羣", "src", "技能.ts"), "export const fixed = true;");
    await writeFile(join(source, "絶伦逸羣", "original.zip"), "excluded");
    const a = join(dir, "a.bin"), b = join(dir, "b.bin");
    await writeFile(a, "AAAA"); await writeFile(b, "BBBB");
    assert.equal(await sameContent(a, b, 4), false, "same-size media must not be incorrectly deduplicated");
    await writeFile(b, "AAAA"); assert.equal(await sameContent(a, b, 4), true);
    const files = await collectRuntime(source, "extension");
    assert.deepEqual(files.map(file => file.path), ["extension/絶伦逸羣/src/技能.ts"]);
    const archive = join(dir, "resources.zip"); await writeResourceZip(files, archive);
    const yauzl = createRequire(import.meta.url)("yauzl");
    const entries = await new Promise((resolve, reject) => yauzl.open(archive, { lazyEntries: true }, (error, zip) => {
      if (error) return reject(error);
      const result = []; zip.on("error", reject); zip.on("end", () => resolve(result));
      zip.on("entry", entry => zip.openReadStream(entry, (error, stream) => {
        if (error) return reject(error); const chunks = []; stream.on("error", reject);
        stream.on("data", chunk => chunks.push(chunk)); stream.on("end", () => { result.push([entry.fileName, Buffer.concat(chunks).toString()]); zip.readEntry(); });
      })); zip.readEntry();
    }));
    assert.deepEqual(entries, [["extension/絶伦逸羣/src/技能.ts", "export const fixed = true;"]]);
    await assert.rejects(validateRuntime(source, false), /ENOENT/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
