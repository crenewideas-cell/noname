// Match only animations provided by this model. Generic responses are explicit
// fallbacks, never a fabricated death animation or a special touch interaction.
export function eventMotions(entry, motions = entry.motions || []) {
  const normalize = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const find = names => names.map(name=>motions.find(m=>normalize(m)===normalize(name))).find(Boolean);
  const aliases = {
    enter: ['enter','entrance','login','login_1','start'],
    card: ['usecard','playcard','attack','action','main_1','talk_start'],
    attack: ['attack','usecard','action','main_1','talk_start'],
    respond: ['respond','response','defend','defense','dodge','block','action','main_2','talk_start','attack'],
    skill: ['skill','specialskill','action','main_3','talk_start'],
    damage: ['damage','hurt','hit'],
    death: ['death','die','dead'],
    kill: ['kill','victory','win'],
  };
  return Object.fromEntries(Object.entries(aliases).map(([kind,names])=>[kind,
    (motions.includes(entry.events?.[kind])&&entry.events[kind])||
    (kind==='card'&&motions.includes(entry.events?.attack)&&entry.events.attack)||find(names)
  ]).filter(([,motion])=>motion));
}
