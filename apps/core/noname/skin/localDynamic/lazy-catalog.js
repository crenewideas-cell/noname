// Nothing is fetched until a caller requests a character. Only small summaries
// live in the parent page; each player iframe owns its selected model's details.
export function createLazyCatalog({ read, base, bindings = () => ({}), merge }) {
  let indexPromise;
  const requests = new Map(), loaded = new Set();
  function cached(file) {
    if (!requests.has(file)) {
      const job = read(base + file).catch(error => { requests.delete(file); throw error; });
      requests.set(file, job);
    }
    return requests.get(file);
  }
  function index() {
    return indexPromise ||= cached('runtime-index.json').catch(error => {
      if (error.status === 404) return { version: 2, packs: [], characters: {} };
      indexPromise = undefined;throw error;
    });
  }
  const pending = new Map();
  function key(name) { return JSON.stringify([name, bindings()[name]]); }
  return {
    has(name) { return loaded.has(key(name)); },
    async ensure(name) {
      if (!name) return;
      const token = key(name);
      if (loaded.has(token)) return;
      if (pending.has(token)) return pending.get(token);
      const job = (async () => {
        const data = await index(), file = data.characters[name];
        let rows = file ? await cached(file) : [];
        const binding = bindings()[name];
        if (binding && !binding.automatic && data.packs.some(p => p.name === binding.pack)) {
          const prefix = binding.pack + '/', groups = await cached(prefix + 'binding-index.json');
          if (groups[binding.id]) {
            const extra = await cached(prefix + groups[binding.id]);
            rows = [...rows, ...extra.map(row => ({ ...row, entry: { ...row.entry,
              characterIds: [...new Set([...row.entry.characterIds, name])] } }))];
          }
        }
        // A binding may change while a request is in flight.
        if (key(name) !== token) return;
        merge(rows, data);loaded.add(token);
      })().finally(() => pending.delete(token));
      pending.set(token, job);return job;
    },
  };
}
