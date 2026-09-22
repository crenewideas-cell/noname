"""Explicit, optional source import. Normal builds/exports only read formal assets.
Never execute APK programs or extract legacy registration/overrides.
"""
import argparse, hashlib, io, json, pathlib, zipfile, subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True)
args = parser.parse_args()
root = pathlib.Path(__file__).resolve().parents[1]
out = root / 'apps/core/extension/ui/十周年局内UI'
prefix = 'extension/十周年UI/'
effects = ['effect_youxikaishi_shousha','effect_heisha','effect_hongsha','effect_huosha','effect_leisha','effect_bingsha','effect_shan','effect_tao','effect_jiu','effect_wuxiekeji','effect_wuzhongshengyou','effect_guohechaiqiao','effect_shunshouqianyang','effect_nanmanruqin','effect_wanjianqifa','effect_taoyuanjieyi','effect_wugufengdeng','effect_huogong','effect_tiesuolianhuan','effect_lebusishu','effect_bingliangcunduan','effect_shandian','effect_loseHp','effect_zhenwang','effect_panding','jineng','card/juedou','juexingji/juexingji1/juexingji','juexingji/juexingji1/xiandingji','juexingji/juexingji1/shimingji']
fixed = ['image/ui/mark/player_mark.png','image/ui/card/kuang1.png','image/ui/card/card_select.png','image/ui/mask/turn_over_mask_shousha.png','image/styles/xinsha/new_border_camp.png','image/styles/xinsha/new_border_hp.png','image/ui/dialog/dialog5.png','image/ui/misc/control_button.png','image/ui/misc/control_button_disable.png','image/ui/misc/control_button_dwon.png','image/ui/card/kb3.png','image/styles/decade/shield.png','ui/assets/fonts/HYZLSJ.woff2','ui/assets/skill/shousha/btn0.png','ui/assets/skill/shousha/btn1.png','ui/assets/skill/shousha/btn2.png','ui/assets/lbtn/shousha/shezhi.png','ui/assets/lbtn/shousha/tuoguan.png','ui/assets/lbtn/shousha/tuichu.png','ui/assets/lbtn/shousha/btn-paixu.png','ui/assets/lbtn/shousha/button.png']
sounds = ['game_start_shousha','hpLossSund','ss_dead','SkillBtn','BtnSure','card_click','xianding','juexing','shiming','guohechaiqiao','shunshouqianyang','huogong','juedou','nanmanruqin','wanjianqifa','wuxiekeji','taoyuanjieyi','shandian']
with zipfile.ZipFile(args.source) as apk, zipfile.ZipFile(io.BytesIO(apk.read('assets/www/app/noname.zip'))) as source:
    names = set(source.namelist())
    sources={name:source.read(prefix+name).decode('utf8') for name in ['src/animation/configs/skillAnimations.js','src/skins/dynamicSkin.js']}
    metadata=json.loads(subprocess.run(['node',str(root/'scripts/decade-source-data.mjs')],input=json.dumps(sources),text=True,encoding='utf8',capture_output=True,check=True).stdout)
    effects=list(dict.fromkeys(effects+[v['name'] for key in ['skillDefines','cardDefines','chupaiAnimations'] for v in metadata[key].values()]))
    mapping = {prefix + f:'assets/' + f for f in fixed}
    mapping.update({prefix+'audio/'+f+'.mp3':'assets/audio/'+f+'.mp3' for f in sounds})
    mapping[prefix+'LICENSE']='LICENSE'
    for n in names:
        if n.startswith(prefix+'image/ui/judge-mark/') and n.endswith('.png'):mapping[n]='assets/'+n[len(prefix):]
        if n.startswith(prefix+'image/styles/shousha/') and n.rsplit('/',1)[-1].startswith(('identity2_','dead2_')) and n.endswith('.png'):mapping[n]='assets/'+n[len(prefix):]
    mapping['image/background/ol_bg.jpg']='assets/background.jpg'
    for i in range(1,5): mapping[f'theme/style/hp/image/ol{i}.png']=f'assets/hp/{i}.png'
    for n in names:
        if n.startswith(prefix+'image/card-skins/gold/') and n.endswith(('.webp','.png','.jpg')):
            mapping[n]='assets/cards/'+n.rsplit('/',1)[-1]
    missing=[]
    def skeleton(directory,effect):
        stem=prefix+'assets/'+directory+'/'+effect
        if stem+'.skel' not in names and stem+'.json' not in names:
            missing.append(directory+'/'+effect);return False
        for suffix in ['.skel','.json','.atlas']:
            if stem+suffix in names: mapping[stem+suffix]='assets/'+directory+'/'+effect+suffix
        atlas=source.read(stem+'.atlas').decode('utf8')
        # Atlas page names are plain lines followed by size/format, not regions.
        lines=atlas.splitlines()
        for i,line in enumerate(lines):
            if line.strip() and (i==0 or not lines[i-1].strip()) and line.strip().endswith(('.png','.jpg')):
                page=pathlib.PurePosixPath(stem).parent / line.strip()
                mapping[str(page)]='assets/'+directory+'/'+str(pathlib.PurePosixPath(effect).parent / line.strip())
        return True
    for effect in effects: skeleton('animation',effect)
    skins={}
    for character,choices in metadata.get('dynamicSkinConfig',{}).items():
        for label,skin in choices.items():
            if not isinstance(skin,dict) or not skin.get('name') or not skeleton('dynamic',skin['name']): continue
            # Pure rendering layer allowlist; discard transformation/skill rules.
            keys=['name','x','y','scale','angle','speed','action','flipX','flipY']
            clean={key:skin[key] for key in keys if key in skin}
            bg=skin.get('beijing')
            if isinstance(bg,dict) and bg.get('name') and skeleton('dynamic',bg['name']):clean['beijing']={key:bg[key] for key in keys if key in bg}
            skins.setdefault(character,{})[label]=clean
    (out/'animation-assets.json').write_text(json.dumps({'effects':{'skill':metadata['skillDefines'],'card':metadata['cardDefines']},'indicators':metadata['chupaiAnimations'],'skins':skins,'missingSourceSkeletons':sorted(set(missing))},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    mapping[prefix+'src/libs/spine.js']='vendor/spine.js'
    entries=[]
    for src,dest in sorted(mapping.items()):
        target=(out/dest).resolve()
        if not target.is_relative_to(out.resolve()) or '..' in pathlib.PurePosixPath(src).parts: raise ValueError('Unsafe path')
        matches=[i for i in source.infolist() if i.filename==src]
        if not matches: raise ValueError('Missing '+src)
        payloads=[source.read(i) for i in matches]
        if len({hashlib.sha256(b).hexdigest() for b in payloads})!=1: raise ValueError('Conflicting entries '+src)
        data=payloads[0]
        if dest=='vendor/spine.js':
            if data.count(b'var u = Math.random();')!=1:raise ValueError('Unexpected Spine random call')
            data=b'// Rendering jitter owns its random stream; never consume gameplay randomness.\nlet visualSeed=0x6d2b79f5;\nfunction visualRandom(){visualSeed^=visualSeed<<13;visualSeed^=visualSeed>>>17;visualSeed^=visualSeed<<5;return (visualSeed>>>0)/4294967296;}\n'+data.replace(b'var u = Math.random();',b'var u = visualRandom();')+b'\nexport { spine };\n'
        target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
        entries.append({'source':src,'file':dest,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
    (out/'SOURCE.json').write_text(json.dumps({'source':pathlib.Path(args.source).name,'archiveMember':'assets/www/app/noname.zip','sourceVersion':'1.3.1','authors':['短歌','萌新','橙续缘','小依（子琪懒人包版）'],'note':'Media attribution is retained; bundled game artwork has no separate redistribution grant in the extension. The extension LICENSE is preserved. The bundled Spine file has no license header; no additional media or runtime grant is inferred. No source gameplay code is used.','resources':entries},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps({'files':len(entries),'bytes':sum(e['bytes'] for e in entries)}))
