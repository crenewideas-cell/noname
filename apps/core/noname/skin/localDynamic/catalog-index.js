// Index explicit ownership; display names and cross-pack aliases are not IDs.
export function createCatalogIndex(packs, active) {
  let previous = [], snapshot;
  const empty = Object.freeze({ files: Object.freeze([]), byTitle: Object.freeze({}) });
  function read() {
    const current = Object.values(packs).filter(active);
    if (snapshot && current.length === previous.length && current.every((pack, i) =>
      pack === previous[i].pack && pack.entries === previous[i].entries && pack.entries.length === previous[i].length)) return snapshot;
    const byFile = new Map(), byCharacter = new Map(), unbound = [];
    for (const p of current) p.entries.forEach((e, order) => {
      if (e.available === false) return;
      const row = { p, e, order }, file = e.skinTitle + '.png';
      // Preserve the original first-pack lookup and last-title table behavior.
      for (const key of [file, 'localdyn_' + e.id + '.png']) if (!byFile.has(key)) byFile.set(key, row);
      const owners = [...new Set(e.characterIds || [])];
      if (!owners.length) unbound.push(row);
      for (const name of owners) {
        let table = byCharacter.get(name);
        if (!table) byCharacter.set(name, table = { files: [], byTitle: Object.create(null) });
        table.files.push(file);
        table.byTitle[e.skinTitle] = { localDynamic: true };
      }
    });
    previous = current.map(pack => ({ pack, entries: pack.entries, length: pack.entries.length }));
    return snapshot = { byFile, byCharacter, unbound };
  }
  return { read, forCharacter: name => read().byCharacter.get(name) || empty,
    owns: (name, row) => !!name && !!row?.e.characterIds?.includes(name),
    invalidate() { snapshot = undefined; } };
}
