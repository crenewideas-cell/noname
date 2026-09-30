import { statSync } from 'node:fs';
import path from 'node:path';
import { extensionCategories, extensionEntries } from '../packages/fs/src/extensionLayout.mjs';

/** Index directory names, never module contents. Check parent metadata on every
 * lookup so add/remove/rename/move works even before watcher events arrive.
 */
export function createDevExtensionResolver(core) {
  const root = path.join(core, 'extension');
  const parents = [root, ...Object.keys(extensionCategories).map(name => path.join(root, name))];
  let previous, entries;
  return relative => {
    const normalized = relative.replaceAll('\\', '/').replace(/^\/+/, '');
    const parts = normalized.split('/');
    if (parts.some(part => part === '..' || part.includes('\0'))) throw new Error('无效资源路径');
    if (parts[0] !== 'extension' || !parts[1] || parts[1].startsWith('_') || Object.hasOwn(extensionCategories, parts[1])) return path.resolve(core, normalized);
    const signature = parents.map(dir => {
      try { const s = statSync(dir, { bigint: true }); return `${s.ino}:${s.mtimeNs}:${s.ctimeNs}`; }
      catch (error) { if (error.code === 'ENOENT') return '-'; throw error; }
    }).join('|');
    if (signature !== previous) {
      entries = new Map(extensionEntries(root, true).map(entry => [entry.name, entry.directory]));
      previous = signature;
    }
    const directory = entries.get(parts[1]);
    return directory ? path.join(directory, ...parts.slice(2)) : path.resolve(core, normalized);
  };
}
