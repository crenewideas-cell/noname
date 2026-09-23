"""Read-only comparison against the source APK; never execute its programs.

The report distinguishes unreviewed source media from missing shipped assets.
It deliberately does not equate resource closure with visual completeness.
"""
import argparse
import collections
import hashlib
import io
import json
import pathlib
import re
import subprocess
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True)
parser.add_argument('--output', default='output/decade-audit')
parser.add_argument('--extract-text', action='store_true')
args = parser.parse_args()
root = pathlib.Path(__file__).resolve().parents[1]
provider = root / 'apps/core/extension/ui/十周年局内UI'
output = (root / args.output).resolve()
output.mkdir(parents=True, exist_ok=True)
provenance = json.loads((provider / 'SOURCE.json').read_text('utf8'))
inventory = set(json.loads((provider / 'files.json').read_text('utf8')))
metadata = json.loads((provider / 'animation-assets.json').read_text('utf8'))
prefix = 'extension/十周年UI/'
report = {'source': pathlib.Path(args.source).name, 'mapped': [], 'sourceOnly': [], 'missingRuntime': [], 'sourceAnimationGaps': [], 'sourceStyleGaps': []}

with zipfile.ZipFile(args.source) as apk, zipfile.ZipFile(io.BytesIO(apk.read(provenance['archiveMember']))) as archive:
    source_names = {n for n in archive.namelist() if not n.endswith('/')}
    mapped = {r['source']: r for r in provenance['resources']}
    config_path = 'src/animation/configs/assetList.js'
    data = json.loads(subprocess.run(['node', str(root / 'scripts/decade-source-data.mjs')], input=json.dumps({config_path: archive.read(prefix + config_path).decode('utf8')}), text=True, encoding='utf8', capture_output=True, check=True).stdout)
    for definition in data['assetList']:
        stem = prefix + 'assets/animation/' + definition['name']
        originals = [stem + ext for ext in ('.skel', '.json') if stem + ext in source_names]
        if not originals or not any(name in mapped for name in originals):
            report['sourceAnimationGaps'].append({'name': definition['name'], 'sourcePresent': bool(originals), 'status': 'needs-feature-review' if originals else 'missing-in-source'})
    # Only the styles selected by the reference screenshots, not every alternate theme.
    for style in ['src/styles/player3.css', 'ui/styles/lbtn/xinsha.css', 'ui/styles/skill/xinsha.css']:
        source = archive.read(prefix + style).decode('utf8')
        import posixpath
        for url in sorted(set(re.findall(r'url\([\"\']?([^\)\"\']+)', source))):
            if url.startswith(('#','data:')):
                continue
            resolved = posixpath.normpath(posixpath.join(prefix, posixpath.dirname(style), url))
            if resolved not in mapped:
                report['sourceStyleGaps'].append({'style': style, 'resource': resolved, 'sourcePresent': resolved in source_names, 'status': 'needs-feature-review' if resolved in source_names else 'missing-in-source'})
    for name, item in mapped.items():
        original = archive.read(name)
        actual = (provider / item['file']).read_bytes()
        transformed = item['file'] == 'vendor/spine.js'
        expected = original
        if transformed:
            expected = (b'// Rendering jitter owns its random stream; never consume gameplay randomness.\nlet visualSeed=0x6d2b79f5;\nfunction visualRandom(){visualSeed^=visualSeed<<13;visualSeed^=visualSeed>>>17;visualSeed^=visualSeed<<5;return (visualSeed>>>0)/4294967296;}\n'
                        + original.replace(b'var u = Math.random();', b'var u = visualRandom();') + b'\nexport { spine };\n')
        report['mapped'].append({'file': item['file'], 'source': name, 'matchesSource': actual == expected,
                                 'transformed': transformed, 'inventory': item['file'] in inventory,
                                 'sourceSha256': hashlib.sha256(original).hexdigest()})
    for name in sorted(source_names):
        if not name.startswith(prefix):
            continue
        relative = name[len(prefix):]
        if name not in mapped:
            suffix = pathlib.PurePosixPath(relative).suffix.lower()
            report['sourceOnly'].append({'source': name, 'kind': 'program-reference' if suffix in ('.js', '.ts', '.css', '.html') else 'media-or-data-review'})
        if args.extract_text and pathlib.PurePosixPath(relative).suffix in ('.js', '.css', '.json'):
            destination = (output / 'source-text' / relative).resolve()
            if not destination.is_relative_to(output / 'source-text'):
                raise ValueError('Unsafe source path')
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(archive.read(name))

def check_skeleton(directory, label, definition):
    name = definition.get('name') if isinstance(definition, dict) else definition
    if not name:
        return
    stem = f'assets/{directory}/{name}'
    if not any(stem + ext in inventory for ext in ('.skel', '.json')) or stem + '.atlas' not in inventory:
        report['missingRuntime'].append({'label': label, 'name': name})

for category, definitions in metadata['effects'].items():
    for label, definition in definitions.items():
        check_skeleton('animation', f'{category}:{label}', definition)
for name in ['effect_youxikaishi_shousha','effect_heisha','effect_hongsha','effect_huosha','effect_leisha','effect_bingsha','effect_shan','effect_tao','effect_jiu','effect_loseHp','effect_zhenwang','effect_panding','jineng','card/juedou','juexingji/juexingji1/juexingji','juexingji/juexingji1/xiandingji','juexingji/juexingji1/shimingji','globaltexiao/huifushuzi/shuzi2','globaltexiao/xunishuzi/SS_PaiJu_xunishanghai','globaltexiao/shanghaishuzi/SZN_shuzi']:
    check_skeleton('animation', 'runtime:' + name, name)
for label, definition in metadata['indicators'].items():
    check_skeleton('animation', f'indicator:{label}', definition)
for character, choices in metadata['skins'].items():
    for label, definition in choices.items():
        check_skeleton('dynamic', character + ':' + label, definition)
        if definition.get('beijing'):
            check_skeleton('dynamic', character + ':' + label + ':background', definition['beijing'])
report['summary'] = {'mapped': len(report['mapped']), 'mismatches': sum(not x['matchesSource'] or not x['inventory'] for x in report['mapped']),
                     'sourceAnimationGaps': len(report['sourceAnimationGaps']), 'sourceStyleGaps': len(report['sourceStyleGaps']),
                     'sourceOnly': len(report['sourceOnly']), 'missingRuntime': len(report['missingRuntime']),
                     'sourceOnlyDirectories': dict(collections.Counter('/'.join(x['source'][len(prefix):].split('/')[:2]) for x in report['sourceOnly']))}
report['completenessAccepted'] = False
report['scope'] = 'Byte equality and runtime resource closure are tested. Source assetList and three reference-theme styles are scanned for gaps. Other source features, alternate skins, behavior and visual fidelity still need feature-level acceptance.'
(output / 'source-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
print(json.dumps(report['summary'], ensure_ascii=False, indent=2))
if report['summary']['mismatches'] or report['missingRuntime']:
    raise SystemExit(1)
