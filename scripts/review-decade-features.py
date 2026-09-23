"""Keep resource preservation separate from feature acceptance.

This records the 49+49 entries identified by the September audit. It does not
convert a successful copy or skeleton decode into a visual acceptance result.
"""
import json, pathlib, argparse
root = pathlib.Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--baseline',required=True);args=parser.parse_args()
old = json.loads(pathlib.Path(args.baseline).read_text('utf8'))
assert len(old['sourceAnimationGaps'])==49 and len(old['sourceStyleGaps'])==49, 'Use the original September audit baseline, not a refreshed audit.'
implemented = {'effect_jisha1', 'zhuanhuanji', 'qingnangjishi', 'shenyimiaoshou',
               'shoupo','lianpo','sanpo','sipo','wupo','liupo','qipo'}
implemented.update('qy_SF_eff_lianzhan_lv'+str(n)+'_zi' for n in range(2,8))
implemented.update(['wanfumodi','shenweizhengqiankun','card/effect_guguoanbang','card/effect_haolingtianxia','card/effect_kefuzhongyuan','card/effect_wenheluanwu'])
implemented.update(['guohechaiqiao','shunshouqianyang','SS_jiuwo'])
pending = {'wanfumodi','shenweizhengqiankun','guohechaiqiao','shunshouqianyang','SS_jiuwo',
           'card/effect_guguoanbang','card/effect_haolingtianxia','card/effect_kefuzhongyuan','card/effect_wenheluanwu'}
animations=[]
for item in old['sourceAnimationGaps']:
    name=item['name']
    status='wired-needs-full-scenario-acceptance' if name in implemented else 'preserved-feature-pending' if name in pending else 'preserved-alternate'
    animations.append({'name':name,'status':status,'reason':
        'Uses public host presentation messages; no source skills or delays imported.' if name in implemented else
        'Media is present, but source-specific trigger/scenario is not accepted.' if name in pending else
        'Alternate style/preload preserved; not selected by the current reference-style provider.'})
styles=[]
wired=['new_huanfu_new','new_jilu_new','new_xiaolian_new','new_juexingji','new_mark_duty','new_mark_yang','new_mark_ying','new_xiandingji','new_count5','falu_','starcanxi_','mark_jie','mark_shen','mark_sp','mark_tw']
for item in old['sourceStyleGaps']:
    resource=item['resource']
    status='missing-in-source' if not item['sourcePresent'] else 'wired-needs-full-scenario-acceptance' if any(n in resource for n in wired) or '/SFTS/' in resource else 'preserved-feature-pending'
    styles.append({'resource':resource,'style':item['style'],'status':status})
report={'scope':'The unresolved entries from the prior audit, not the entire source package.',
        'complete':False,'animations':animations,'styles':styles,
        'requestedSubset':{'implemented':True,'scope':['host-captured hand-limit counter','falu/canxi marks','visible jie/shen/SP/TW prefix marks','guohe/shunshou target effects','dying loop'],
                           'handLimitPolicy':'Shows the last value returned by an existing core getHandcardLimit call; shows — before first calculation. Does not poll modifiers. Reset when player is uninitialized; retained through UI switches.',
                           'evidence':'output/decade-extras/'},
        'unresolved':[
                      'Alternate appearance selection, complete card-target/equipment scenarios, replay/online/spectator and device acceptance remain open.',
                      'Reference screenshots differ from the current cards, toolbar and some dialog details. Pixel parity is not accepted.']}
dest=root/'docs/decade-ingame-ui-feature-review-2026-09-23.json'
dest.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'animations':len(animations),'styles':len(styles),'complete':False}))
