import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

folder=Path(sys.argv[1]); rows=json.loads((folder/'report.json').read_text(encoding='utf-8'))
out=folder/'overview';out.mkdir(exist_ok=True)
rows=[r for r in rows if r['status']=='captured' and r['viewport']['width']==240]
font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',12)
for first in range(0,len(rows),30):
    sheet=Image.new('RGB',(960,1320),(38,38,38));draw=ImageDraw.Draw(sheet)
    for j,r in enumerate(rows[first:first+30]):
        f=min(r['frames'],key=lambda f:abs(f['time']-1));im=Image.open(folder/f['file']).convert('RGBA');im.thumbnail((160,240))
        x,y=j%6*160,j//6*264;sheet.paste(im,(x,y),im)
        draw.text((x,y+242),r['id'][:22],font=font,fill='white')
    sheet.save(out/f'sheet-{first//30+1:02}.jpg',quality=94)
print(json.dumps({'skins':len(rows),'sheets':(len(rows)+29)//30,'acceptancePassed':0,'limitation':'Candidate-only coarse overview; no independent correctness reference or continuous motion acceptance'}))
