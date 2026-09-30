import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Inline the existing 4 KB boot stylesheet during development. The appearance
// is identical, but first paint no longer waits for a separate CSS request.
export function devBootStyle(core) {
  const file = path.join(core, 'layout/default/lobby-theme.css');
  return {
    name: 'noname-dev-boot-style', apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        if (!html.includes('id="noname-boot-status"')) return html;
        const css = (await readFile(file, 'utf8')).replaceAll("url('../../", "url('./");
        return html.replace('<link rel="stylesheet" href="./layout/default/lobby-theme.css" />', `<style>${css}</style>`);
      },
    },
    handleHotUpdate(context) {
      if (path.resolve(context.file) === file) context.server.ws.send({ type: 'full-reload' });
    },
  };
}
