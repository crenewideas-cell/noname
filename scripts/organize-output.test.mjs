import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { organizeOutput } from "./organize-output.mjs";

test("archives root artifacts by purpose without overwriting or moving source files", async () => {
  const root = await mkdtemp(join(tmpdir(), "noname-output-"));
  try {
    await mkdir(join(root, "output/android/logs"), { recursive: true });
    await writeFile(join(root, "output/android/logs/output-android-build.log"), "old");
    for (const name of ["output-android-build.log", "output-android-debug.png", "output-inventory.tmp", "package.json", "output-source.js"])
      await writeFile(join(root, name), name);
    const moved = await organizeOutput(root);
    assert.equal(moved.length, 3);
    assert.equal(await readFile(join(root, "output/android/logs/output-android-build.log"), "utf8"), "old");
    assert.equal(await readFile(join(root, "output/android/logs/output-android-build.log.1"), "utf8"), "output-android-build.log");
    assert.ok(moved.includes(join(root, "output/android/screenshots/output-android-debug.png")));
    assert.ok(moved.includes(join(root, "output/misc/tmp/output-inventory.tmp")));
    assert.deepEqual((await readdir(root)).sort(), ["output", "output-source.js", "package.json"]);
    assert.deepEqual(await organizeOutput(root), []);
  } finally { await rm(root, { recursive: true, force: true }); }
});
