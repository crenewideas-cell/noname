import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import path from 'node:path';
import vm from 'node:vm';
import { createLegacyParser } from '../apps/core/noname/skin/localDynamic/runtime/legacy-parser.js';
import { readLegacyDefinitions } from './import-dynamic-skins.mjs';

const run = path.resolve(process.argv[2] || 'output/dynamic-remediation/20260926-r01');
const out = path.join(run, 'reference');
const sourceRoot = 'temp/动态皮包/无名杀基础扩展';
const sha = b => createHash('sha256').update(b).digest('hex');
const definitions = readLegacyDefinitions(await fs.readFile(sourceRoot + '/dynamicSkin.js', 'utf8'));
const inputs = new Map();
for (const [owner, skins] of Object.entries(definitions)) for (const [title, config] of Object.entries(skins)) {
  for (const c of [config.beijing, config].filter(Boolean)) {
    if (!c.name || c.json) continue;
    const file = sourceRoot + '/assets/dynamic/' + c.name + '.skel', atlas = file.replace(/\.skel$/, '.atlas');
    if (inputs.has(file)) { inputs.get(file).owners.push({ owner, title }); continue; }
    try {
      const fd = await fs.open(file); let bytes = Buffer.alloc(128);
      try { await fd.read(bytes, 0, bytes.length, 0); } finally { await fd.close(); }
      const version = bytes.toString('latin1').match(/3\.[67]\.\d+/)?.[0];
      if (!version) continue;
      await fs.access(atlas);
      inputs.set(file, { file, atlas, version, animation: typeof c.action === 'string' ? c.action : Array.isArray(c.action) ? c.action[0] : null, owners: [{ owner, title }] });
    } catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
}
let requests = [...inputs.values()];
const filesIndex = process.argv.indexOf('--files');
if(filesIndex >= 0){const files=new Set(JSON.parse(await fs.readFile(process.argv[filesIndex+1])));requests=requests.filter(r=>files.has(r.file));for(const r of requests)r.details=true;}
const limitIndex = process.argv.indexOf('--limit');
if (limitIndex >= 0) requests = requests.slice(0, Number(process.argv[limitIndex + 1]));
const suffix = filesIndex >= 0 ? '-diagnostic' : limitIndex >= 0 ? '-pilot' : '';
await fs.mkdir(out, { recursive: true });
const inputFile = path.join(out, 'requests' + suffix + '.json');
await fs.writeFile(inputFile, JSON.stringify(requests));
const vendorFile = 'apps/core/extension/ui/十周年局内UI/vendor/spine.js';
const source = await fs.readFile(vendorFile, 'utf8');
const context = vm.createContext({ console, Float32Array, Uint8Array, Int16Array, Uint16Array, DataView, Math, ArrayBuffer, window: {}, navigator: {} });
vm.runInContext(source.replace(/export\s*\{\s*spine\s*\};?/g, ''), context);
const spine = context.spine;
const classpath = [path.join(out, 'gdx-1.9.10.jar'), path.join(out, 'classes')].join(path.delimiter);
const provenance = {
  referenceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: path.join(out, 'spine-runtimes-3.6') }).toString().trim(),
  referenceURL: 'https://github.com/EsotericSoftware/spine-runtimes/tree/654c20e5b0e523040b6366bbd1042510d2645134/spine-libgdx/spine-libgdx/src',
  referenceAdapterSHA256: sha(await fs.readFile('scripts/DynamicSpine36Reference.java')),
  gdxSHA256: sha(await fs.readFile(path.join(out, 'gdx-1.9.10.jar'))),
  localVendorSHA256: sha(source), localParserSHA256: sha(await fs.readFile('apps/core/noname/skin/localDynamic/runtime/legacy-parser.js')),
  inputSHA256: sha(await fs.readFile(inputFile)), totalSourceModels: inputs.size, tested: requests.length,
  independence: { modelSelection: 'exact raw dynamicSkin.js references; no entry.models or inferred replacements', binaryReader: 'unmodified official Java SkeletonBinary versus local JS createLegacyParser', geometry: 'official Java runtime versus local JS runtime', uv: 'official atlas UVs versus unmodified local parser UVs; local restoreMeshUVs intentionally absent', limitation: 'CPU decoding/geometry only; not rasterization, authored viewport, animation transitions, all-action or final visual acceptance' }
};
await fs.writeFile(path.join(out, 'provenance' + suffix + '.json'), JSON.stringify(provenance, null, 2));
const child = spawn('java', ['-Xmx2g', '-Dfile.encoding=UTF-8', '-cp', classpath, 'DynamicSpine36Reference', inputFile], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
let stderr = ''; child.stderr.on('data', c => stderr += c);
const completed = new Promise(resolve => child.on('close', code => resolve(code)));
const rows = [], stream = createWriteStream(path.join(out, 'comparisons' + suffix + '.jsonl'));
for await (const line of createInterface({ input: child.stdout, crlfDelay: Infinity })) {
  let ref;
  try { ref = JSON.parse(line); } catch (e) {
    const invalid = path.join(out, 'invalid-reference-' + rows.length + '.txt');await fs.writeFile(invalid, line);
    ref = { file:requests[rows.length].file, status:'invalid-output', error:'Invalid JSON from reference; raw evidence: ' + invalid };
  }
  const req = inputs.get(ref.file);
  const row = { file: ref.file, version: req.version, owners: req.owners, referenceStatus: ref.status, referenceError: ref.error, referenceCause: ref.cause };
  try {
    const bytes = await fs.readFile(req.file), atlasText = await fs.readFile(req.atlas, 'utf8');
    row.skeletonSHA256 = sha(bytes); row.atlasSHA256 = sha(atlasText);
    const sizes = new Map();
    for (const block of atlasText.trim().split(/\r?\n\s*\r?\n/)) {
      const name = block.split(/\r?\n/)[0].trim(), imageFile = path.join(path.dirname(req.atlas), name);
      const fd = await fs.open(imageFile); const b = Buffer.alloc(32);
      try { await fd.read(b, 0, b.length, 0); } finally { await fd.close(); }
      if (b.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw Error('Reference image dimensions require PNG: ' + imageFile);
      sizes.set(name, { width: b.readUInt32BE(16), height: b.readUInt32BE(20) });
    }
    const atlas = new spine.TextureAtlas(atlasText, name => ({ setFilters() {}, setWraps() {}, getImage() { return sizes.get(name); } }));
    const parser = createLegacyParser(spine, atlas, { skeleton: req.file, version: req.version });
    const data = parser.readSkeletonData(new Uint8Array(bytes));
    row.localStatus = 'decoded'; row.skinTableFormat = parser.skinTableFormat;
    row.animations = data.animations.map(a => ({ name: a.name, duration: a.duration }));
    if (ref.status === 'decoded') {
      row.structureMatches = data.bones.length === ref.bones && data.slots.length === ref.slots && data.skins.length === ref.skins && data.animations.length === ref.animations.length;
      row.maxVertexError = 0; row.maxUVError = 0; row.comparedCoordinates = 0; row.attachmentMismatches = [];
      for (const sample of ref.samples) {
        const skeleton = new spine.Skeleton(data), state = new spine.AnimationState(new spine.AnimationStateData(data));
        if (ref.animation) { state.setAnimation(0, ref.animation, true); state.update(Math.fround(sample.time)); state.apply(skeleton); } skeleton.updateWorldTransform();
        for(const b of sample.bones||[]){const actual=skeleton.bones.find(x=>x.data.name===b.name);for(const [kind,fields] of [['local',['x','y','rotation','scaleX','scaleY','shearX','shearY']],['world',['a','b','c','d','worldX','worldY']]])for(let i=0;i<fields.length;i++){const error=Math.abs(actual[fields[i]]-b[kind][i]);if(error>(row[kind+'BoneError']||0)){row[kind+'BoneError']=error;row[kind+'BoneDifference']={time:sample.time,bone:b.name,field:fields[i],actual:actual[fields[i]],expected:b[kind][i]};}}}
        for (const expected of sample.slots) {
          const slot = skeleton.slots.find(s => s.data.name === expected.slot), a = slot?.attachment;
          if (a?.name !== expected.attachment) { row.attachmentMismatches.push({ time: sample.time, slot: expected.slot, expected: expected.attachment, actual: a?.name }); continue; }
          for(const kind of ['deform','setup'])if(expected[kind]){const actual=kind==='deform'?slot.attachmentVertices:a.vertices;if(actual.length!==expected[kind].length)(row.dataLengthDifferences||=[]).push({time:sample.time,slot:expected.slot,kind,actual:actual.length,expected:expected[kind].length});else for(let j=0;j<actual.length;j++){const error=Math.abs(actual[j]-expected[kind][j]);if(error>(row[kind+'Error']||0)){row[kind+'Error']=error;row[kind+'Difference']={time:sample.time,slot:expected.slot,index:j,actual:actual[j],expected:expected[kind][j]};}}}
          const v = new Float32Array(a.worldVerticesLength || 8);
          if (a.worldVerticesLength) a.computeWorldVertices(slot, 0, v.length, v, 0, 2); else a.computeWorldVertices(slot.bone, v, 0, 2);
          if (v.length !== expected.vertices.length) { row.attachmentMismatches.push({ time: sample.time, slot: expected.slot, expectedVertices: expected.vertices.length, actualVertices: v.length }); continue; }
          // Java RegionAttachment emits BR,BL,UL,UR; JS emits BL,UL,UR,BR.
          // Normalize the documented vertex order, never select nearest vertices.
          const index = i => expected.kind === 'RegionAttachment' ? (i + 2) % 8 : i;
          for (let i = 0; i < v.length; i++) {
            const error = Math.abs(v[i] - expected.vertices[index(i)]);
            if (!Number.isFinite(error)) throw Error('Non-finite vertex');
            row.comparedCoordinates++;
            if (error > row.maxVertexError) { row.maxVertexError = error; row.largestDifference = { time: sample.time, slot: expected.slot, index: i, local: v[i], reference: expected.vertices[index(i)] }; }
          }
          if (expected.uv && a.uvs?.length === expected.uv.length) for (let i = 0; i < a.uvs.length; i++) row.maxUVError = Math.max(row.maxUVError, Math.abs(a.uvs[i] - expected.uv[index(i)]));
        }
      }
    }
  } catch (error) { row.localStatus = 'failed'; row.localError = String(error); }
  rows.push(row); stream.write(JSON.stringify(row) + '\n');
  if (rows.length % 100 === 0) console.log(JSON.stringify({ checked: rows.length, expected: requests.length, referenceFailed: rows.filter(r => r.referenceStatus !== 'decoded').length, localFailed: rows.filter(r => r.localStatus !== 'decoded').length }));
}
stream.end();
const code = await completed;
const summary = { expected: requests.length, checked: rows.length, javaExitCode: code, referenceFailed: rows.filter(r => r.referenceStatus !== 'decoded').length,
  localFailed: rows.filter(r => r.localStatus !== 'decoded').length, structuralDifferences: rows.filter(r => r.structureMatches === false || r.attachmentMismatches?.length).length,
  vertexDifferencesAboveDiagnosticThreshold: rows.filter(r => r.maxVertexError > .05).length, maxVertexError: Math.max(0, ...rows.map(r => r.maxVertexError || 0)),
  uvDifferences: rows.filter(r => r.maxUVError > 1e-5).length, acceptance: 'pending; .05 bone units is a diagnostic filter, not the logical-pixel acceptance tolerance', stderr };
await fs.writeFile(path.join(out, 'summary' + suffix + '.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
if (code || rows.length !== requests.length) process.exitCode = 1;
