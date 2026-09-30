/** Vite's fallback inline maps duplicate large legacy packs on every response.
 * Keep the executable bytes intact and request debug maps only from DevTools.
 * This plugin is development-only; release builds use their existing pipeline.
 */
export function externalDevSourceMaps() {
  return {
    name: 'noname-external-dev-sourcemaps',
    apply: 'serve',
    enforce: 'post',
    transform(code, id) {
      if (!/\.[cm]?[jt]s(?:\?|$)/.test(id) || id.includes('/node_modules/') || /[#@] sourceMappingURL=/.test(code)) return;
      // An external marker prevents Vite from generating an expensive fallback
      // inline identity map. Actual transform maps remain in Vite's module graph.
      return { code: code + '\n//# sourceMappingURL=noname-dev.map\n', map: null };
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = new URL(req.url, 'http://localhost');
          if (url.searchParams.has('noname-source-map')) {
            url.searchParams.delete('noname-source-map');
            // Only expose a module already served by Vite, retaining its access checks.
            const mod = await server.environments.client.moduleGraph.getModuleByUrl(decodeURI(url.pathname) + url.search);
            const result = mod?.transformResult;
            if (!result) { res.statusCode = 404; res.end(); return; }
            const map = result.map?.mappings ? result.map : {
              version: 3, names: [], sources: [url.pathname + url.search],
              sourcesContent: [result.code],
              mappings: 'AAAA' + ';AACA'.repeat(result.code.split('\n').length - 1),
            };
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');
            res.end(req.method === 'HEAD' ? undefined : JSON.stringify(map));
            return;
          }
          const end = res.end;
          res.end = function (body, ...args) {
            if (typeof body === 'string' && /(?:java|ecma)script/.test(String(res.getHeader('Content-Type')))) {
              const marker = body.lastIndexOf('//# sourceMappingURL=');
              if (marker >= 0 && /^\/\/# sourceMappingURL=(?:data:application\/json[^\r\n]*|noname-dev\.map)\s*$/.test(body.slice(marker))) {
                url.searchParams.set('noname-source-map', '1');
                body = body.slice(0, marker) + '//# sourceMappingURL=' + url.pathname + url.search + '\n';
                res.removeHeader('Content-Length');
              }
            }
            return end.call(this, body, ...args);
          };
          next();
        } catch (error) { next(error); }
      });
    },
  };
}
