import json,sys
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
folder=Path(sys.argv[1]);rows=json.loads((folder/'frames.json').read_text(encoding='utf-8'))['frames']
font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',14)
for id in dict.fromkeys(r['id'] for r in rows):
    group=[r for r in rows if r['id']==id];sheet=Image.new('RGB',(1440,784),(38,38,38));draw=ImageDraw.Draw(sheet)
    for candidate in [False,True]:
        for i,r in enumerate(x for x in group if x['candidate']==candidate):
            image=Image.open(folder/r['file']).convert('RGB');image.thumbnail((240,360));x,y=i*240,int(candidate)*392;sheet.paste(image,(x,y));draw.text((x,y+362),('candidate' if candidate else 'before')+f" {r['time']:.3f}s",font=font,fill='white')
    sheet.save(folder/f'{id}-boundaries.jpg',quality=95)
