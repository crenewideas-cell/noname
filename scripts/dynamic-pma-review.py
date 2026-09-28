"""Compare frozen candidate images to their exact, independently rendered reference."""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat

run = Path(sys.argv[1] if len(sys.argv) > 1 else 'output/dynamic-remediation/20260926-r01')
candidate = run / (sys.argv[2] if len(sys.argv)>2 else 'complete-artwork-pma-images')
out = run / (sys.argv[3] if len(sys.argv)>3 else 'complete-artwork-pma-review')
out.mkdir(exist_ok=True)
references = {}
for folder in (sys.argv[4:] or ['spine38-pma-reference', 'spine38-historical-pma-reference']):
    for r in json.loads((run / folder / 'report.json').read_text(encoding='utf-8')):
        if r['status'] == 'captured' and r['viewport']['width']==240:
            references[r['id']] = (run / folder, r)
rows = []
for c in json.loads((candidate / 'report.json').read_text(encoding='utf-8')):
    if c['viewport']['width'] != 240:
        continue
    if c['id'] not in references or c['status']!='captured':
        rows.append({'id':c['id'],'reference':None,'frames':[],'review':'missing-successful-pair'})
        continue
    folder, ref = references[c['id']]
    row = {'id': c['id'], 'reference': folder.name, 'frames': [], 'review': 'pending'}
    for f in ref['frames']:
        a, b = folder / f['file'], candidate / f['file']
        frame = {**f, 'status': 'missing'}
        row['frames'].append(frame)
        if not a.exists() or not b.exists():
            continue
        x, y = Image.open(a).convert('RGBA'), Image.open(b).convert('RGBA')
        diff = ImageStat.Stat(ImageChops.difference(x, y))
        frame.update(status='compared', meanChannelDifference=sum(diff.mean)/4,
                     referenceVisibleBounds=x.getchannel('A').getbbox(),
                     candidateVisibleBounds=y.getchannel('A').getbbox())
        frame['compositedMeanDifference'] = {}
        for label, color in [('black', (0,0,0,255)), ('white', (255,255,255,255)), ('gray', (38,38,38,255))]:
            bg = Image.new('RGBA', x.size, color)
            visible = ImageStat.Stat(ImageChops.difference(Image.alpha_composite(bg,x).convert('RGB'), Image.alpha_composite(bg,y).convert('RGB')))
            frame['compositedMeanDifference'][label] = sum(visible.mean)/3
    rows.append(row)
rows.sort(key=lambda r: max((f.get('compositedMeanDifference', {}).get('gray',999) for f in r['frames']),default=999), reverse=True)
font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 12)
for first in range(0, len(rows), 16):
    sheet = Image.new('RGB', (960, 840), (38, 38, 38))
    draw = ImageDraw.Draw(sheet)
    for j, r in enumerate(rows[first:first+16]):
        x, y = j % 4 * 240, j // 4 * 210
        for k, folder in enumerate([run / r['reference'] if r['reference'] else None, candidate]):
            if folder is None or not (folder / f"{r['id']}-240-t1.png").exists(): continue
            im = Image.open(folder / f"{r['id']}-240-t1.png").convert('RGBA')
            im.thumbnail((120, 180))
            sheet.paste(im, (x+k*120, y), im)
        draw.text((x, y+181), r['id'][-12:], font=font, fill='white')
        draw.text((x, y+194), 'reference    candidate', font=font, fill='white')
    sheet.save(out / f'comparison-{first//16+1:02}.jpg', quality=94)
report = {'skins': len(rows), 'frames': sum(len(r['frames']) for r in rows),
          'compared': sum(f['status']=='compared' for r in rows for f in r['frames']),
          'acceptancePassed': 0, 'rows': rows,
          'limitations': ['Overview and discrete image differences are diagnostic, not final acceptance.',
                         'Reference family, upstream revision and viewport policy must be read from each referenced provenance.json.']}
(out / 'comparison.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='rows'}))
