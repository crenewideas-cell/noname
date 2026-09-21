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
      if (logical && logical.replaceAll("\\", "/").startsWith(logicalRoot) && physical(logical) !== logical) {
        // PostCSS resolves @import against the module filename on disk, not
        // through Vite's logical extension resolver. Give CSS its real path.
        const resolved = clean.endsWith(".css") ? physical(logical) : logical;
        return resolved.replaceAll("\\", "/") + source.slice(clean.length);
      }
    },
    async load(id) {
      const clean = id.split("?")[0];
      if (!clean.replaceAll("\\", "/").startsWith(logicalRoot)) return;
      const file = physical(clean);
      if (file === clean || !/\.(?:js|ts|css|json)$/.test(clean)) return;
      this.addWatchFile(file);
      return fs.readFile(file, "utf8");
    },
    handleHotUpdate(context) {
      const changed=context.file.replaceAll("\\", "/");
      const affected=new Set(context.modules);
      // Logical extension IDs and their physical source paths differ. Vite's
      // watch event must invalidate the logical modules as well as disk IDs.
      for(const module of context.server.moduleGraph.idToModuleMap.values()) {
        const clean=module.id?.split("?")[0];
        if(clean?.startsWith(logicalRoot)&&physical(clean).replaceAll("\\", "/")===changed) {
          context.server.moduleGraph.invalidateModule(module);
          affected.add(module);
        }
      }
      return [...affected];
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          const url = new URL(req.url, "http://localhost");
          // Legacy assets include literal percent signs (for example %.png).
          // Escape only bare %, retaining already encoded UTF-8 and %25 paths.
          const pathname = url.pathname.replace(/%(?![\da-f]{2})/gi, "%25");
          const name = decodeURIComponent(pathname);
          if (pathname !== url.pathname) req.url = pathname + url.search;
          if (name.startsWith("/extension/") && !/\.(?:js|ts|css)$/.test(name) && !(name.endsWith(".json") && url.searchParams.has("import"))) {
            const file = resolveExtensionPath(core, name);
            req.url = "/" + path.relative(core, file).split(path.sep).map(encodeURIComponent).join("/") + url.search;
          }
          next();
        } catch (error) {
          if (error instanceof URIError) {
            // Invalid UTF-8 is a bad request, not a Vite internal error overlay.
            res.statusCode = 400;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end("Malformed URL encoding");
            return;
          }
          next(error);
        }
      });
    },
  };
}
