import { createRequire } from "node:module";
const { open } = createRequire(import.meta.url)("yauzl");

// A type reference in DEX does not mean the class is actually packaged.
// Read class_defs, not just string_ids, to detect incomplete incremental D8 outputs.
export function dexClasses(data) {
  if (data.length < 112 || data.toString("ascii", 0, 4) !== "dex\n") throw new Error("Invalid DEX header");
  const stringsOffset = data.readUInt32LE(60), typesOffset = data.readUInt32LE(68);
  const count = data.readUInt32LE(96), offset = data.readUInt32LE(100);
  const classes = new Set();
  for (let i = 0; i < count; i++) {
    const type = data.readUInt32LE(offset + i * 32);
    const string = data.readUInt32LE(typesOffset + type * 4);
    let start = data.readUInt32LE(stringsOffset + string * 4);
    while (data[start] & 128) start++;
    start++;
    const end = data.indexOf(0, start);
    if (end < 0) throw new Error("Invalid DEX string");
    classes.add(data.toString("utf8", start, end));
  }
  return classes;
}

export async function validateApk(path) {
  const entries = new Set(), classes = new Set();
  // Android's APK writer uses UTF-8 names even when ZIP bit 11 is unset.
  await new Promise((resolve, reject) => open(path, { lazyEntries: true, decodeStrings: false }, (error, zip) => {
    if (error) return reject(error);
    zip.on("error", reject); zip.on("end", resolve);
    zip.on("entry", entry => {
      const name = entry.fileName.toString("utf8");
      entries.add(name);
      if (!/^classes\d*\.dex$/.test(name)) return zip.readEntry();
      zip.openReadStream(entry, (error, stream) => {
        if (error) return reject(error);
        const chunks = []; stream.on("data", chunk => chunks.push(chunk)); stream.on("error", reject);
        stream.on("end", () => {
          try { for (const name of dexClasses(Buffer.concat(chunks))) classes.add(name); zip.readEntry(); }
          catch (error) { zip.close(); reject(error); }
        });
      });
    }); zip.readEntry();
  }));
  const requiredClasses = ["com/libnoname/noname/MainActivity", "com/libnoname/noname/SafFsPlugin", "com/libnoname/noname/SafOverlayStore",
    "com/libnoname/noname/JsAwarePathHandler", "com/libnoname/noname/OnlineLobbyPlugin", "com/libnoname/noname/OnlineLobbyActivity",
    "com/libnoname/noname/R$string", "com/getcapacitor/BridgeActivity", "com/getcapacitor/android/R$layout", "androidx/startup/R$string"];
  const missing = requiredClasses.filter(name => !classes.has(`L${name};`));
  if (missing.length) throw new Error(`APK 缺少原生类，不能正常启动：${missing.join(", ")}`);
  for (const file of ["index.html", "noname.js", "noname/entry.js", "preload.js", "service-worker.js", "vendor/vue.js", "game/config.json", "extension/絶伦逸羣/extension.js", "online-client/deployment.json"]) {
    if (!entries.has(`assets/public/${file}`)) throw new Error(`APK 缺少运行资源：${file}`);
  }
  return { dexClasses: classes.size, apkEntries: entries.size };
}
