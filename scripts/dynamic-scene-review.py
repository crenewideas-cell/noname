import json,sys,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageChops,ImageStat
run=Path(sys.argv[1] if len(sys.argv)>1 else 'output/dynamic-remediation/20260926-r01')
candidate=run/'scene-candidate-images';reference=run/'spine38-supported-reference-fixed';out=run/'scene-review';out.mkdir(exist_ok=True)
rows=[]
for ref in json.loads((reference/'report.json').read_text(encoding='utf-8')):
    row={'id':ref['id'],'frames':[],'status':'requires-visual-review'}
    for t in [0,1,3]:
        name=f"{ref['id']}-240-t{t}.png";a,b=reference/name,candidate/name
        if not a.exists() or not b.exists():row['frames'].append({'time':t,'status':'missing-candidate-or-reference'});continue
        x,y=Image.open(a).convert('RGBA'),Image.open(b).convert('RGBA');diff=ImageStat.Stat(ImageChops.difference(x,y))
        row['frames'].append({'time':t,'status':'compared','meanChannelDifference':sum(diff.mean)/4,'maxChannelDifference':max(v[1] for v in diff.extrema)})
    rows.append(row)
font=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',12)
def sheets(ids,folders,label):
    n=len(folders);cols=4 if n==2 else 8;per=cols*4
    for start in range(0,len(ids),per):
        sheet=Image.new('RGB',(cols*n*120,4*205),(40,40,40));d=ImageDraw.Draw(sheet)
        for j,id in enumerate(ids[start:start+per]):
            x,y=j%cols*n*120,j//cols*205
            for k,folder in enumerate(folders):
                file=folder/f'{id}-240-t1.png'
                if file.exists():
                    im=Image.open(file).convert('RGBA');im.thumbnail((120,180));sheet.paste(im,(x+k*120,y),im)
            d.text((x,y+181),id[-12:],font=font,fill='white')
            if n==2:d.text((x,y+193),'reference    candidate',font=font,fill='white')
        sheet.save(out/f'{label}-{start//per+1:02}.jpg',quality=94)
rows.sort(key=lambda r:max((f.get('meanChannelDifference',999) for f in r['frames']),default=999),reverse=True)
sheets([r['id'] for r in rows],[reference,candidate],'comparison')
sheets(json.loads((run/'scene-candidate/ids.json').read_text(encoding='utf-8')),[candidate],'overview')
report={'referenceCount':len(rows),'completePairs':sum(all(f['status']=='compared' for f in r['frames']) for r in rows),'acceptancePassed':0,'limitations':['One-second reduced-size sheets are an overview; no temporal/full-size acceptance.','Both paths use the same explicitly assumed height/180 viewport policy; independent runtime agreement does not prove portrait framing.','3.8.75 exports are not accepted by the unmodified official reference and remain pending.'],'rows':rows}
(out/'comparison.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({k:v for k,v in report.items() if k!='rows'}))
