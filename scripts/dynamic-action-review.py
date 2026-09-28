import json,sys,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageChops,ImageStat
run=Path(sys.argv[1] if len(sys.argv)>1 else 'output/dynamic-remediation/20260926-r01')
reference=run/(sys.argv[2] if len(sys.argv)>2 else 'spine38-actions-reference');candidate=run/(sys.argv[3] if len(sys.argv)>3 else 'complete-artwork-actions');out=run/(sys.argv[4] if len(sys.argv)>4 else 'complete-action-review');out.mkdir(exist_ok=True)
refs=json.loads((reference/'report.json').read_text(encoding='utf-8'));candidates=json.loads((candidate/'report.json').read_text(encoding='utf-8'));by_key={(r['id'],r['viewport']['width']):r for r in candidates}
rows=[];overviews=[]
for ref in refs:
    actual=by_key.get((ref['id'],ref['viewport']['width']));row={'id':ref['id'],'viewport':ref['viewport'],'frames':[],'review':'pending'};rows.append(row)
    for f in ref['frames']:
        a,b=reference/f['file'],candidate/f['file'];frame={**f,'status':'missing'};row['frames'].append(frame)
        if not a.exists() or not b.exists():continue
        x,y=Image.open(a).convert('RGBA'),Image.open(b).convert('RGBA');diff=ImageStat.Stat(ImageChops.difference(x,y));alpha_x=x.getchannel('A');alpha_y=y.getchannel('A')
        frame.update(status='compared',meanChannelDifference=sum(diff.mean)/4,maxChannelDifference=max(v[1] for v in diff.extrema),referenceVisibleBounds=alpha_x.getbbox(),candidateVisibleBounds=alpha_y.getbbox())
    if ref['viewport']['width']==240:
        for action in sorted(set(f['action'] for f in ref['frames'])):
            frames=[f for f in row['frames'] if f['action']==action]
            chosen=min(frames,key=lambda f:abs(f['time']-f['duration']/2));overviews.append({'id':ref['id'],**chosen})
font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',12)
for first in range(0,len(overviews),16):
    sheet=Image.new('RGB',(960,4*220),(38,38,38));draw=ImageDraw.Draw(sheet)
    for j,f in enumerate(overviews[first:first+16]):
        x,y=j%4*240,j//4*220
        for k,folder in enumerate([reference,candidate]):
            file=folder/f['file']
            if file.exists():
                im=Image.open(file).convert('RGBA');im.thumbnail((120,180));sheet.paste(im,(x+k*120,y),im)
        draw.text((x,y+181),f['id'][-12:]+' '+f['action'][:16],font=font,fill='white')
        draw.text((x,y+195),'reference    candidate',font=font,fill='white')
    sheet.save(out/f'actions-{first//16+1:02}.jpg',quality=94)
frames=[f for r in rows for f in r['frames']];largest=sorted([{'id':r['id'],'width':r['viewport']['width'],**f} for r in rows for f in r['frames'] if f['status']=='compared'],key=lambda f:f['meanChannelDifference'],reverse=True)[:40]
report={'skins':len(set(r['id'] for r in refs)),'viewportCases':len(refs),'frames':len(frames),'compared':sum(f['status']=='compared' for f in frames),'actionOverviews':len(overviews),'acceptancePassed':0,'limitations':['Discrete samples and image metrics do not replace continuous video or per-skin acceptance.','Cross-backend alpha/filter differences require inspection; no arbitrary pass threshold.'],'largestDifferences':largest,'rows':rows}
(out/'comparison.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in report.items() if k not in ['rows','largestDifferences']}))
