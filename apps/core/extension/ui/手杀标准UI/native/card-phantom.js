// Adapted from 琉璃版5.5/史诗卡牌/cardPhantom.js (phantom4).
// Observe disposable arena cards; never replace the engine's card movement.
export function mountCardPhantoms({ui, enabled, decorate = () => {}}) {
 const entries = new Map(), seen = new WeakSet();
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let disposed = false;
 const allowed = () => !disposed && enabled() && !motion.matches && !document.hidden;
 const eligible = card => card instanceof HTMLElement && !card.judge && card.matches('.card.thrown:not(.drawingcard):not(.infohidden):not([data-presentation-role])') && card.parentNode === ui.arena;
 function remove(card) {
  const entry = entries.get(card); if (!entry) return;
  clearTimeout(entry.timer);
  for (const {node, animations} of entry.shades) { animations.forEach(a => a.cancel()); node.remove(); }
  entries.delete(card);
 }
 function add(card, initial) {
  if (seen.has(card) || !eligible(card) || !allowed() || entries.size >= 24) return;
  seen.add(card);
  // oldValue contains the source position before the host lays out its discard.
  const style = document.createElement('div').style; style.cssText = initial || card.style.cssText;
  const from = style.transform || 'none', to = card.style.transform || 'none';
  if (from === to) return;
  const entry = {shades: [], timer: 0}; entries.set(card, entry);
  const geometry = getComputedStyle(card);
  for (const [delay, opacity] of [[50, .5], [100, .3]]) {
   const node = card.cloneNode(true);
   node.removeAttribute('id'); node.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
   node.classList.remove('thrown', 'hidden', 'removing', 'selected', 'selectable');
   node.classList.add('ss-card-phantom'); node.setAttribute('aria-hidden', 'true'); node.inert = true;
   decorate(node, card);
   Object.assign(node.style, {pointerEvents:'none', transition:'none', transform:to, opacity:String(opacity), width:geometry.width, height:geometry.height});
   card.before(node);
   const animations = [node.animate([{transform:from}, {transform:to}], {duration:460, delay, easing:'ease', fill:'backwards'}),
    node.animate([{opacity}, {opacity:0}], {duration:500, delay:delay+260, fill:'forwards'})];
   entry.shades.push({node, animations});
  }
  entry.timer = setTimeout(() => remove(card), 900);
 }
 const observer = new MutationObserver(records => {
  if (!allowed()) { clear(); return; }
  const added = new Set(), starts = new Map();
  for (const record of records) {
   if (record.type === 'childList') for (const node of record.addedNodes) if (eligible(node)) added.add(node);
   if (record.type === 'attributes' && record.attributeName === 'style' && eligible(record.target) && !starts.has(record.target)) starts.set(record.target, record.oldValue);
  }
  for (const card of added) add(card, starts.get(card));
  for (const card of entries.keys()) if (!card.isConnected || card.classList.contains('infohidden') || card.classList.contains('removing')) remove(card);
 });
 function clear() { for (const card of entries.keys()) remove(card); }
 observer.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['style','class'], attributeOldValue:true});
 const visibility = () => { if (document.hidden) clear(); };
 const motionChange = () => { if (motion.matches) clear(); };
 document.addEventListener('visibilitychange', visibility); motion.addEventListener('change', motionChange);
 return () => { disposed = true; observer.disconnect(); clear(); document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', motionChange); };
}
