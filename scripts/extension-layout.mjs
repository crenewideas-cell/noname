import fs from "node:fs/promises";
import path from "node:path";
import { extensionEntries, resolveExtensionPath } from "../packages/fs/src/extensionLayout.mjs";
export { extensionEntries, resolveExtensionPath };

export async function copyExtensions(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  for (const entry of extensionEntries(source)) {
    await fs.cp(entry.directory, path.join(destination, entry.name), { recursive: true });
  }
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    if (entry.isFile() && /\.(js|ts)$/.test(entry.name)) await fs.copyFile(path.join(source, entry.name), path.join(destination, entry.name));
  }
}

/** Keep logical module IDs so relative imports keep the same meaning as releases. */
export function classifiedExtensionsPlugin(core) {
  const logicalRoot = path.join(core, "extension").replaceAll("\\", "/") + "/";
  const physical = id => resolveExtensionPath(core, path.relative(core, id));
  return {
    name: "classified-extension-sources",
    enforce: "pre",
    resolveId(source, importer) {
      const clean = source.split("?")[0];
      let logical;
      if (clean.startsWith("/extension/")) logical = path.join(core, clean.slice(1));
      else if (importer && clean.startsWith(".")) logical = path.resolve(path.dirname(importer.split("?")[0]), clean);
      else if (clean.replaceAll("\\", "/").startsWith(logicalRoot)) logical = clean;
      if (logical && logical.replaceAll("\\", "/").startsWith(logicalRoot) && physical(logical) !== logical) return logical.replaceAll("\\", "/") + source.slice(clean.length);
    },
    async load(id) {
      const clean = id.split("?")[0];
      if (!clean.replaceAll("\\", "/").startsWith(logicalRoot)) return;
      const file = physical(clean);
      if (file === clean || !/\.(?:js|ts|css|json)$/.test(clean)) return;
      this.addWatchFile(file);
      return fs.readFile(file, "utf8");
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          const url = new URL(req.url, "http://localhost");
          const name = decodeURIComponent(url.pathname);
          if (name.startsWith("/extension/") && !/\.(?:js|ts|css)$/.test(name) && !(name.endsWith(".json") && url.searchParams.has("import"))) {
            const file = resolveExtensionPath(core, name);
            req.url = "/" + path.relative(core, file).split(path.sep).map(encodeURIComponent).join("/") + url.search;
          }
          next();
        } catch (error) { next(error); }
      });
    },
  };
}
