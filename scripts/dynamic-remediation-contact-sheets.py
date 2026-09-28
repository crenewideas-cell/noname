import json, math, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat

run = Path(sys.argv[1] if len(sys.argv)>1 else 'output/dynamic-remediation/20260926-r01')
before, after = run/'linked-deform-before', run/'linked-deform-candidate'
expected=json.loads((run/'linked-deform-capture-ids.json').read_text(encoding='utf-8'))
out=run/'linked-deform-review';out.mkdir(exist_ok=True)
rows=[]
for skin in expected:
    row={'id':skin,'frames':[],'review':'pending'}
    for t in [0,1]:
        name=f'{skin}-240-t{t}.png';a,b=before/name,after/name
        if not a.exists() or not b.exists():row['frames'].append({'time':t,'status':'missing'});continue
        x,y=Image.open(a).convert('RGBA'),Image.open(b).convert('RGBA')
        if x.size!=y.size:raise RuntimeError('Mismatched viewport')
        diff=ImageChops.difference(x,y);stats=ImageStat.Stat(diff)
        row['frames'].append({'time':t,'status':'compared','meanChannelDifference':sum(stats.mean)/4,'maxChannelDifference':max(v[1] for v in stats.extrema),'before':str(a),'after':str(b)})
    rows.append(row)
ranked=sorted(rows,key=lambda r:max([f.get('meanChannelDifference',0) for f in r['frames']]),reverse=True)
font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',12)
for first in range(0,len(ranked),24):
    group=ranked[first:first+24];sheet=Image.new('RGB',(960,6*204),(35,35,35));draw=ImageDraw.Draw(sheet)
    for j,row in enumerate(group):
        x,y=j%4*240,j//4*204
        for k,folder in enumerate([before,after]):
            file=folder/f"{row['id']}-240-t1.png"
            if file.exists():
                image=Image.open(file).convert('RGBA');image.thumbnail((120,180));sheet.paste(image,(x+120*k,y),image)
        draw.text((x,y+181),row['id'][-12:],font=font,fill='white')
        draw.text((x,y+193),'before       candidate',font=font,fill='white')
    sheet.save(out/f'sheet-{first//24+1:02}.jpg',quality=92)
report={'expected':len(expected),'compared':sum(all(f['status']=='compared' for f in r['frames']) for r in rows),'changed':sum(any(f.get('maxChannelDifference',0)>0 for f in r['frames']) for r in rows),'limitation':'Old-versus-candidate difference and review index only, not independent visual correctness reference or full acceptance. Sheets show 1-second frames at reduced size.','entries':ranked}
(out/'image-differences.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='entries'},ensure_ascii=False))
