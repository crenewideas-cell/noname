"""Import cosmetic assets from the six local ZIPs without executing extension code.

Run from the project root: python scripts/import-shi-resources.py
Existing, different assets are never overwritten. Generated catalog metadata is
updated in place, preserving model placement and prior rendering remediation.
"""
import hashlib
import json
import pathlib
import re
import subprocess
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'temp/动态皮包/势魏延'
LOCAL = ROOT / 'apps/core/extension/imports/本地动态皮肤包'
BASE = LOCAL / '无名杀基础扩展'
EXTRA = LOCAL / '势武将资源补充'
QH = ROOT / 'apps/core/extension/ui/手杀标准UI/original/千幻聆音'
ART = ROOT / 'apps/core/extension/ui/千幻聆音/sanguoyuanhua'
BACKUP = ROOT / 'temp/shi-resource-import/before'
report = {'version': 1, 'archives': [], 'files': [], 'dynamicEntries': [], 'staticSkins': [],
          'excluded': ['曹髦版刘谌：独立自定义武将、势力框、背景音乐和视频，与这三位武将无明确资源绑定',
                       '所有 extension.js、animationlist.js、markskill.js：不执行旧技能及全局 UI 覆盖'],
          'effectsStatus': '已导入模型、图集、贴图及美化素材；不接管旧扩展的技能界面或自动触发逻辑'}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read_json(p):
    return json.loads(p.read_text(encoding='utf-8'))


def write_json(p, data):
    content = (json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    if p.exists() and p.read_bytes() == content:
        return
    if p.exists():
        backup = BACKUP / p.relative_to(ROOT)
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            backup.write_bytes(p.read_bytes())
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(content)


def install(data, dest, origin):
    if dest.exists() and dest.read_bytes() != data:
        raise RuntimeError(f'拒绝覆盖不同的已有资源：{dest}')
    existed = dest.exists()
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not existed:
        dest.write_bytes(data)
    assert sha(dest.read_bytes()) == sha(data)
    report['files'].append({'source': origin, 'destination': dest.relative_to(ROOT).as_posix(),
                            'sha256': sha(data), 'bytes': len(data), 'reused': existed})


archives = {}
for archive in sorted(SOURCE.glob('*.zip')):
    with zipfile.ZipFile(archive) as z:
        files = {}
        for item in z.infolist():
            name = item.filename.replace('\\', '/')
            parts = pathlib.PurePosixPath(name)
            if parts.is_absolute() or '..' in parts.parts or ':' in name:
                raise ValueError(f'不安全 ZIP 路径：{name}')
            if not item.is_dir():
                files[name] = z.read(item)
        archives[archive.stem] = files
        report['archives'].append({'name': archive.name, 'sha256': sha(archive.read_bytes()), 'files': len(files)})


def archive(prefix):
    matches = [k for k in archives if k == prefix or k.startswith(prefix + '(') or k.startswith(prefix + '（') or k.startswith(prefix + ' ')]
    if len(matches) != 1:
        raise ValueError(f'无法唯一找到压缩包：{prefix}')
    key = matches[0]
    return key, archives[key]


def copy_from(pack, name, target):
    key, files = pack
    install(files[name], target, key + '.zip/' + name)


cm = archive('曹髦')
supplement = archive('曹髦特效补充')
fix = archive('曹髦绝进特效二合一黄修')
xq = archive('势小乔')
wy = archive('势魏延')
archive('曹髦版刘谌')  # Inventory only; never load the unrelated character extension.

# Exact source bytes, no duplicate skin entry or invented mb_epic_caomao general.
catalog = read_json(BASE / 'catalog.json')
for name in cm[1]:
    copy_from(cm, name, BASE / 'assets/dynamic' / name)

# Keep all useful effects together. The fix replaces the WHOLE atlas/skeleton/page
# family in this new directory; no stale pages from the older variant are mixed in.
media = {'.skel', '.atlas', '.png', '.jpg', '.mp3', '.css'}
for pack, prefix, dest in [
    (supplement, '十周年UI/assets/animation/', EXTRA / 'effects/caomao'),
    (wy, '十周年UI/assets/', EXTRA / 'effects/weiyan'),
    (xq, '势小乔/animation/', EXTRA / 'effects/xiaoqiao/animation'),
    (xq, '势小乔/image/', EXTRA / 'effects/xiaoqiao/image'),
    (wy, '势魏延/audio/', EXTRA / 'audio/weiyan'),
]:
    for name in pack[1]:
        if name.startswith(prefix) and pathlib.PurePosixPath(name).suffix.lower() in media:
            rel = name[len(prefix):]
            if pack is supplement and re.match(r'SS_cmskill(?:\d*\.(?:png|atlas|skel))$', rel):
                continue
            copy_from(pack, name, dest / rel)
for name in fix[1]:
    copy_from(fix, name, EXTRA / 'effects/caomao' / name)


def static(pack, source, owner, title, audio=None):
    copy_from(pack, source, QH / 'sanguoskin' / owner / (title + pathlib.Path(source).suffix))
    report['staticSkins'].append({'characterId': owner, 'title': title})
    for original, mapped in (audio or {}).items():
        copy_from(pack, original, QH / 'sanguoaudio' / owner / title / mapped)


xq_audio = {name: name.split('/')[-1] for name in xq[1] if name.endswith('.mp3')}
static(xq, '势小乔/pot_xiaoqiao.jpg', 'pot_xiaoqiao', '势小乔·扩展原画', xq_audio)
copy_from(xq, '势小乔/pot_xiaoqiao.jpg', ART / 'pot_xiaoqiao/势小乔·扩展原画.jpg')
wy_audio = {}
for name in wy[1]:
    filename = name.split('/')[-1]
    mapped = re.sub(r'^s_(kuanggu|zhuangshi|yinzhan)([12])\.mp3$', r'pot\1\2.mp3', filename)
    if filename == 's_tyinzhan1.mp3':
        mapped = 'potyinzhan1.mp3'
    if re.fullmatch(r'pot(?:kuanggu|zhuangshi|yinzhan)[12]\.mp3', mapped):
        wy_audio[name] = mapped
    elif re.fullmatch(r's_kunfen[12]\.mp3', filename):
        wy_audio[name] = filename.replace('s_kunfen', 'kunfen_pot_weiyan')
for number, title in [('', '势魏延·扩展原画'), ('2', '势魏延·形态二'), ('3', '势魏延·形态三')]:
    static(wy, f'势魏延/s_weiyan{number}.jpg', 'pot_weiyan', title, wy_audio)
    copy_from(wy, f'假装无敌/gameAsset/yuanhua/s_weiyan{number}/s_weiyan{number}.jpg',
              ART / 'pot_weiyan' / (title + '.jpg'))
    copy_from(wy, f'假装无敌/gameAsset/audio/victory/s_weiyan{number}/victory.mp3',
              QH / 'sanguoaudio/pot_weiyan' / title / 'victory.mp3')
static(wy, '假装无敌/gameAsset/image/skin/s_weiyan/性转.jpg', 'pot_weiyan', '势魏延·性转', wy_audio)

cm_prefix = '千幻聆音/sanguoaudio/mb_epic_caomao/枭龙破渊2/'
cm_audio = {name: name.split('/')[-1] for name in supplement[1] if name.startswith(cm_prefix) and name.endswith('.mp3')}
for title in ['枭龙破渊2', '经典形象2']:
    static(supplement, '千幻聆音/sanguoskin/mb_epic_caomao/' + title + '.jpg', 'mb_caomao', title,
           cm_audio if title == '枭龙破渊2' else None)
    copy_from(supplement, '千幻聆音/sanguoyuanhua/mb_epic_caomao/' + title + '.jpg',
              ART / 'mb_caomao' / (title + '.jpg'))

# Metadata supplements survive later ordinary imports. Only media fields change;
# keep already-reviewed scene, camera, model, bindings and animations intact.
patch_path = BASE / 'resource-supplements.json'
patches = read_json(patch_path) if patch_path.exists() else {}
for title in ['枭龙破渊', '枭龙破渊2']:
    matches = [e for e in catalog['entries'] if e['title'] == title and 'mb_caomao' in e.get('characterIds', [])]
    if len(matches) != 1:
        raise ValueError('现有动皮条目不唯一：' + title)
    entry = matches[0]
    voices = []
    audio_name = 'XingXiang1.mp3' if title.endswith('2') else 'XingXiang.mp3'
    voices.append({'file': f'assets/dynamic/曹髦/{title}/{audio_name}', 'label': '形象音效'})
    if title.endswith('2'):
        for name, filename in cm_audio.items():
            relative = 'audio/shi-caomao/' + filename
            copy_from(supplement, name, BASE / relative)
            label = re.sub(r'\d+$', '', filename[:-4])
            label = {'mb_caomao': '阵亡', 'victory': '胜利', 'mbcmfangzhu': '放逐', 'mbcmjiushi': '酒诗',
                     'mbcmqingzheng': '清正', 'mbjuejin': '绝进', 'mbqianlong': '潜龙', 'mbweitong': '卫统'}.get(label, label)
            voices.append({'file': relative, 'label': label})
        thumbnail = 'previews/shi-caomao-xiaolong2.jpg'
        copy_from(supplement, '千幻聆音/sanguoskin/mb_epic_caomao/枭龙破渊2.jpg', BASE / thumbnail)
        patches.setdefault(entry['id'], {})['thumbnail'] = thumbnail
    voice_file = 'audio/shi-caomao/' + entry['id'] + '.json'
    write_json(BASE / voice_file, voices)
    patches.setdefault(entry['id'], {})['voiceFile'] = voice_file
    entry.update(patches[entry['id']])
    detail_path = BASE / 'entries' / (entry['id'] + '.json')
    detail = read_json(detail_path)
    detail.update(patches[entry['id']])
    write_json(detail_path, detail)
    report['dynamicEntries'].append({'id': entry['id'], 'title': title, 'voices': len(voices), 'reusedModels': True})
write_json(BASE / 'catalog.json', catalog)
write_json(patch_path, patches)

# Update summaries without regenerating unrelated models or the shared runtime.
for p in [*(BASE / 'groups').glob('*.json'), *(LOCAL / 'characters').glob('*.json'), BASE / 'library-index.json']:
    rows = read_json(p)
    changed = False
    for row in rows:
        e = row.get('entry', {})
        patch = patches.get(e.get('id')) if row.get('pack') == BASE.name else None
        if patch and patch.get('thumbnail') and e.get('thumbnail') != patch['thumbnail']:
            e['thumbnail'] = patch['thumbnail']
            e['thumbnailRevision'] = sha((BASE / patch['thumbnail']).read_bytes())[:20]
            changed = True
    if changed:
        write_json(p, rows)

# Every standalone effect includes its actual atlas pages, including numbered ones.
report['effects'] = []
for skeleton in sorted(EXTRA.rglob('*.skel')):
    atlas = skeleton.with_suffix('.atlas')
    lines = atlas.read_text(encoding='utf-8').splitlines()
    pages = [line.strip() for i, line in enumerate(lines)
             if line.strip() and (i == 0 or not lines[i-1].strip()) and re.search(r'\.(png|jpe?g)$', line, re.I)]
    if not pages:
        raise ValueError(f'图集没有贴图页：{atlas}')
    for page in pages:
        assert (atlas.parent / page).is_file(), (atlas, page)
    report['effects'].append({'skeleton': skeleton.relative_to(EXTRA).as_posix(),
                              'atlas': atlas.relative_to(EXTRA).as_posix(), 'pages': pages, 'version': '3.6.38'})
write_json(EXTRA / 'resource-manifest.json', report)
subprocess.run(['node', str(ROOT / 'scripts/index-qianhuan-resources.mjs')], cwd=ROOT, check=True)
print(json.dumps({'staticSkins': len(report['staticSkins']), 'reusedDynamicSkins': len(report['dynamicEntries']),
                  'effects': len(report['effects']), 'verifiedFiles': len(report['files'])}, ensure_ascii=False))
