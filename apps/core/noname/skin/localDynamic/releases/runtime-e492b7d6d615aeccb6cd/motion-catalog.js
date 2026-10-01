// Public capabilities describe the primary character, never a background loop.
export function eventMotions(entry, motions = entry.motions || []) {
  const normalize = value => value.toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]/g, '');
  const find = names => names.map(name=>motions.find(m=>normalize(m)===normalize(name))).find(Boolean);
  const source={enter:'source:chuchang',card:'source:gongji',attack:'source:gongji',skill:'source:teshu',dodge:'source:shan'};
  const aliases={
    enter:['chuchang','出场','enter','entrance','login','login_1','start'],
    card:['gongji','攻击','usecard','playcard','attack','action','main_1','talk_start'],
    attack:['gongji','攻击','attack','usecard','action','main_1','talk_start'],
    respond:['respond','response','defend','defense','dodge','block','action','main_2','talk_start','attack'],
    skill:['teshu','jineng','技能','特殊','skill','specialskill','action','main_3','talk_start'],
    dodge:['shan','闪','dodge','respond','response','defend','defense','block','action','main_2','talk_start','attack'],
    damage:['damage','hurt','hit'],death:['death','die','dead'],kill:['kill','victory','win'],
  };
  return Object.fromEntries(Object.entries(aliases).map(([kind,names])=>[kind,
    (motions.includes(entry.events?.[kind])&&entry.events[kind])||
    (kind==='card'&&motions.includes(entry.events?.attack)&&entry.events.attack)||
    (kind==='dodge'&&motions.includes(entry.events?.respond)&&entry.events.respond)||
    (motions.includes(source[kind])&&source[kind])||find(names)
  ]).filter(([,motion])=>motion));
}
export function primaryCapabilities(entry, layers, live2d=false) {
  const primary=layers.find(l=>/^(primary|ren|main|character)$/i.test(l.role||''))||layers.filter(l=>!l.effectOnly&&!/^(bg|vx)/i.test(l.role||'')).at(-1)||layers.at(-1);
  const source=((entry.actionScene||entry.scene)?.actionContract?.records||[]).filter(a=>a.status==='candidate').map(a=>a.command);
  const names=live2d?entry.motions||[]:[...new Set([...(primary?.motions||[]),...Object.values(entry.events||{}).filter(n=>layers.some(l=>l.motions?.includes(n))),...source])];
  const idle=new Set([primary?.idle].filter(Boolean));if(entry.idle)idle.add(entry.idle);
  const choices=names.filter(n=>!idle.has(n)&&!(/^(beijing|background|idle|normal|daiji|play|stand)$/i.test(n)));
  const events=eventMotions(entry,names);
  const preferred=[events.skill,events.attack,...choices].filter(n=>n&&choices.includes(n));
  const interactions=[...new Set(preferred)];
  return {events,interaction:{available:interactions.length>0,motions:interactions,reason:interactions.length?'':'此素材仅提供待机动画'}};
}
