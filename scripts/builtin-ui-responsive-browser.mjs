import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = 'output/builtin-ui-responsive';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const report = { errors: [], cases: [] };
page.on('pageerror', e => report.errors.push(e.message));
page.on('dialog', d => d.accept());
try {
 await page.route('**/*', r => new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
 // Isolated visual fixture: ignore dev-server reloads and live sessions.
 await page.routeWebSocket('**', () => {});
 await page.route('**/game/config.json*', async r => {
  const response = await r.fetch(), config = await response.json();
  Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'always', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: '' });
  for (const k in config) if (k.startsWith('extension_') && k.endsWith('_enable')) config[k] = false;
  await r.fulfill({ response, json: config });
 });
 await page.goto(process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081', { waitUntil: 'domcontentloaded' });
 await page.evaluate(async () => window.env = await import('/noname.js'));
 await page.waitForSelector('#splash', { timeout: 120000 });
 await page.evaluate(async () => {
  const { ui, game, lib } = env;
  document.querySelector('#splash')?.remove();
  document.querySelector('#noname-boot-status')?.remove();
  ui.window ||= ui.create.div('#window', document.body);
  ui.window.classList.remove('hidden'); ui.window.style.display = '';
  ui.arena ||= ui.create.div('#arena', ui.window);
  ui.arena.className = 'long single-handcard oblongcard'; ui.arena.dataset.number = '4';
  game.layout = 'long2'; game.players = []; game.dead = []; lib.config.fold_card = true; lib.config.spread_card = true; lib.config.touchscreen = true;
  for (const file of ['layout/long2/layout.css', 'layout/default/skill-presentation.css']) {
   const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = '/' + file; document.head.append(link);
  }
  for (let i = 0; i < 4; i++) {
   const p = ui.create.player(ui.arena); p.dataset.position = String(i); p.node.avatar.setBackground(['diaochan','liubei','caocao','sunquan'][i], 'character'); p.node.avatar.show(); game.players.push(p);
  }
  game.me = game.players[0];
  ui.me = ui.create.div('#me', ui.arena);
  ui.handcards1Container = ui.create.div('#handcards1', ui.me); ui.handcards2Container = ui.create.div('#handcards2', ui.me);
  ui.handcards1 = game.me.node.handcards1; ui.handcards2 = game.me.node.handcards2;
  ui.handcards1Container.append(ui.handcards1); ui.handcards2Container.append(ui.handcards2);
  const cards = (await import('/card/standard.js')).default;
  Object.assign(lib.card, cards.card);
  // Preserve lazy descriptions; a visual fixture must not execute rule getters.
  Object.defineProperties(lib.translate, Object.getOwnPropertyDescriptors(cards.translate));
  window.fillHand = count => {
   ui.handcards1.replaceChildren();
   for (let i = 0; i < count; i++) ui.create.card(ui.handcards1).init(['spade', (i % 13) + 1, ['sha', 'shan', 'tao', 'wuzhong'][i % 4]]);
   ui.updatehl();
  };
  fillHand(10);
  ui.control = ui.create.div('#control.action-controls', ui.arena);
  ui.system = ui.create.div('#system.with-game-navigation', ui.window);
  ui.system1 = ui.create.div('#system1', ui.system); ui.system2 = ui.create.div('#system2', ui.system);
  for (const label of ['选项','日志','暂停','托管','♫','整理手牌','战绩']) ui.create.system(label, () => {});
  for (const label of ['记牌器','显示身份','退出']) ui.create.system(label, () => {}, true);
  ui.system1.children[2].classList.add('disabled');
  ui.controls = []; ui.create.control(['结束回合', '托管', '祈愿', '许愿', '寻宝']);
  const { installBuiltinAdaptiveLayout } = await import('/noname/ui/adaptiveLayout.js');
  installBuiltinAdaptiveLayout({ game, ui, mode: 'identity' });
  const { updateSelectionGuide } = await import('/noname/ui/selectionGuide.js');
  window.promptEvent = { isMine: () => true, filterTarget: () => true, filterCard: () => true, selectCard: [1,1], selectTarget: [1,1] };
  updateSelectionGuide(promptEvent, false);
  ui.dialogs = []; const dialog = ui.create.dialog('请选择要使用的牌'); dialog.open();
  ui.arena.style.visibility = 'visible'; ui.arena.classList.remove('hidden');
 });
 for (const [width, height, count] of (process.env.NONAME_PROMPT_ONLY ? [[1366,768,10]] : [[1920,1080,10],[1806,856,10],[1366,768,10],[996,591,10],[800,450,10],[1920,1080,24],[996,591,24]])) {
  await page.setViewportSize({ width, height });
  await page.evaluate(count => fillHand(count), count);
  await page.waitForTimeout(1600);
  await page.evaluate(() => { env.ui.handcards1.firstChild.classList.add('selected'); env.ui.updatehl(); });
  await page.waitForTimeout(550);
  // A viewport resize can recheck the engine's idle event. Restore the fixture's
  // active choice after that check, just as a running choose event would.
  await page.evaluate(async()=>{const {updateSelectionGuide}=await import('/noname/ui/selectionGuide.js');updateSelectionGuide(promptEvent,false);});
  await page.waitForTimeout(100);
  await page.screenshot({ path: `${out}/${width}-${height}-${count}.png` });
  const data = await page.evaluate(() => {
   const { ui } = env, cards = [...ui.handcards1.children];
   const rect = n => n.getBoundingClientRect().toJSON();
   return { arena: rect(ui.arena), hand: rect(ui.handcards1Container), cards: cards.map(rect), controls: rect(ui.control), guide: rect(document.querySelector('.selection-guide')), prompt: rect(ui.dialog), scroll: ui.handcards1Container.classList.contains('scrollh'), scale: getComputedStyle(ui.arena).getPropertyValue('--builtin-card-scale') };
  });
  report.cases.push({ width, height, count, ...data });
  if (!process.env.NONAME_PROMPT_ONLY) {
  const expectedCardWidth = 194.4 * Math.min(data.arena.width / 1920, data.arena.height / 1080);
  assert(Math.abs(data.cards[0].width - expectedCardWidth) < 1, 'reference card proportions');
   assert(data.cards.every(c => c.bottom <= height + 2), 'cards stay inside viewport');
  }
  assert(data.controls.bottom <= data.cards[0].top + 2, 'controls clear selected cards');
  assert(data.guide.bottom <= data.controls.top + 2, 'guide clears controls');
  assert(data.prompt.bottom <= data.guide.top + 2, 'prompt clears guide');
  assert(Math.abs(data.prompt.x+data.prompt.width/2-data.arena.x-data.arena.width/2)<2, 'short prompts remain centered');
  if (!process.env.NONAME_PROMPT_ONLY && !data.scroll) assert(data.cards.at(-1).right <= data.hand.right + 4, 'folded cards fit hand (border rounding)');
  if (!process.env.NONAME_PROMPT_ONLY && data.scroll) {
   const visible = await page.evaluate(() => {
    const hand = env.ui.handcards1Container; hand.scrollLeft = hand.scrollWidth;
    const card = env.ui.handcards1.lastChild, r = card.getBoundingClientRect();
    return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('.card') === card;
   });
   assert(visible, 'last card remains reachable after scrolling');
  }
 }
 await page.setViewportSize({ width: 1366, height: 768 });
 await page.evaluate(async()=>{
  const {ui,game,_status}=env;
  const {updateSelectionGuide}=await import('/noname/ui/selectionGuide.js');
  window.promptEvent=Object.assign(new env.lib.element.GameEvent('chooseToUse',false),promptEvent);
  ui.selected.cards=[ui.handcards1.firstChild];
  updateSelectionGuide(promptEvent,false);
  _status.event=promptEvent;
  window.originalPromptCheck=game.check;
  game.check=()=>updateSelectionGuide(promptEvent,ui.selected.targets.length===1);
 });
 assert.equal(await page.locator('.selection-guide-step[aria-current="step"]').textContent(),'2目标0/1');
 await page.evaluate(async()=>{
  const {ui,game}=env;
  ui.selected.targets=[game.players[1]];game.players[1].nickname='目标甲';
  (await import('/noname/ui/selectionGuide.js')).updateSelectionGuide(promptEvent,true);
 });
 await page.waitForTimeout(400);
 assert.equal(await page.locator('.selection-guide-step[data-state="complete"]').count(),2);
 await page.screenshot({path:`${out}/selection-ready.png`});
 await page.getByRole('button',{name:'撤销最后目标',exact:true}).click();
 assert.equal(await page.evaluate(()=>env.ui.selected.targets.length),0);
 assert.equal(await page.locator('.selection-guide-chosen').getAttribute('data-kind'),'legend');
 await page.evaluate(()=>{env.game.check=window.originalPromptCheck;env.ui.selected.cards=[];});
 await page.evaluate(async () => {
  const { ui, lib } = env;
  (await import('/noname/ui/selectionGuide.js')).clearSelectionGuide();
  ui.dialog.close();
  fillHand(0); ui.arena.classList.add('choose-character');
  for (const control of [...ui.controls]) control.close();
  ui.create.control(['更换', '自由选将']);
  await import('/character/rank.js'); lib.rank = window.noname_character_rank;
  const characters = (await import('/character/standard/character.js')).default;
  Object.assign(lib.character, characters); lib.characterPack.standard = characters;
  Object.assign(lib.translate, (await import('/character/standard/translate.js')).default);
  lib.config.banned ||= [];
  const dialog = ui.create.dialog('选择角色', [['caocao', 'liubei', 'sunquan'], 'character']);
  dialog.classList.add('forcebutton');
  dialog.add('选择身份'); dialog.add([['随机','主公','忠臣','反贼','内奸'], 'tdnodes']);
  dialog.add('选择座位'); dialog.add([['二','三','四','五'], 'tdnodes']);
  dialog.querySelectorAll('.tdnode')[3].classList.add('bluebg');
  dialog.querySelectorAll('.tdnode')[5].classList.add('bluebg');
 });
 await page.waitForTimeout(1800);
 assert(await page.evaluate(() => env.ui.dialog.getBoundingClientRect().bottom <= env.ui.control.getBoundingClientRect().top + 2), 'character dialog clears controls');
 await page.screenshot({ path: `${out}/character-selection.png` });
 assert(await page.evaluate(() => {
  const pane = env.ui.dialog.contentContainer.getBoundingClientRect();
  return [...env.ui.dialog.querySelectorAll('.tdnode')].every(n => n.getBoundingClientRect().bottom <= pane.bottom + 1);
 }), 'identity and seat choices fit the selection form');
 assert(await page.evaluate(() => [...env.ui.dialog.querySelectorAll('.bluebg')].every(n => getComputedStyle(n).borderImageSource.includes('decade-button-active.png'))), 'selected choices reuse the shared pressed asset');
 await page.setViewportSize({width:800,height:450});
 await page.waitForTimeout(500);
 await page.locator('.dialog .tdnode').last().scrollIntoViewIfNeeded();
 await page.screenshot({path:`${out}/character-selection-small.png`});
 assert(await page.evaluate(() => {
  const choice = env.ui.dialog.querySelector('.tdnode:last-child').getBoundingClientRect();
  const pane = env.ui.dialog.contentContainer.getBoundingClientRect();
  return pane.top >= 0 && choice.top >= pane.top && choice.bottom <= pane.bottom + 1 && env.ui.dialog.getBoundingClientRect().bottom <= env.ui.control.getBoundingClientRect().top;
 }), 'small-screen selection remains scrollable above actions');
 await page.setViewportSize({width:1366,height:768});
 await page.evaluate(() => { env.ui.dialog.close(); env.ui.create.characterDialog('heightset', 'paged').open(); });
 await page.waitForTimeout(700);
 const search = page.locator('.dialog.character-browser input').first();
 await search.fill('曹操');
 await search.press('Enter');
 await page.waitForTimeout(500);
 assert(await page.locator('.dialog.character-browser').isVisible(), 'existing character browser remains usable');
 assert(await page.evaluate(() => env.ui.dialog.getBoundingClientRect().bottom <= env.ui.control.getBoundingClientRect().top + 2), 'search dialog clears controls');
 await page.screenshot({ path: `${out}/character-search.png` });
 await page.evaluate(() => {
  const {ui} = env; ui.dialog.close(); ui.arena.classList.remove('choose-character');
  for (const control of [...ui.controls]) control.close();
  ui.create.control(['ok', 'cancel2']);
  ui.create.dialog('是否发动【雄狐】？', '其他角色出牌阶段开始时，若其手牌数大于你，你可以翻面，然后将所有手牌交给该角色并令其回复一点体力。');
 });
 await page.waitForTimeout(700);
 const skin = await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('#control > .control > div, #system > div > div')];
  return { buttons: buttons.map(n => getComputedStyle(n).borderImageSource), panel: getComputedStyle(env.ui.dialog).backgroundColor };
 });
 assert(skin.buttons.every(source => source.includes('decade-button.png')), 'action and toolbar buttons reuse the workshop asset');
 assert(await page.evaluate(()=>{
  const css=getComputedStyle(env.ui.dialog);
  return css.backgroundImage.includes('linear-gradient')&&css.borderTopWidth==='1px'&&css.borderRadius==='8px'&&css.color==='rgb(232, 224, 208)';
 }), 'skill confirmations share the readable ink-and-gold prompt surface');
 await page.screenshot({ path: `${out}/skill-confirmation.png` });
 await page.evaluate(()=>{
  const {ui}=env;
  window.promptReading=ui.create.dialog('hidden');
  promptReading.add('技能详情');
  promptReading.addText(Array.from({length:12},(_,i)=>`第${i+1}项：出牌阶段，你可以选择一张手牌和一名其他角色。此说明用于检查较长技能文字的换行、阅读间距与滚动，目标和结算仍由游戏规则决定。`).join('<br><br>'));
  promptReading.id='nodeintro';promptReading.classList.add('popped','skill-reading-panel');
  ui.window.append(promptReading);promptReading.style.cssText='left:20px;top:90px;width:440px;height:340px;display:block;opacity:1;';
 });
 await page.waitForTimeout(300);
 assert(await page.evaluate(()=>{
  const n=promptReading.contentContainer,css=getComputedStyle(promptReading);
  return n.scrollHeight>n.clientHeight&&css.backgroundImage.includes('linear-gradient')&&css.borderTopWidth==='1px'&&getComputedStyle(promptReading.querySelector('.text')).textAlign==='start';
 }), 'long skill details share the prompt skin and can scroll');
 await page.screenshot({path:`${out}/skill-reading.png`});
 await page.evaluate(()=>{promptReading.contentContainer.scrollTop=promptReading.contentContainer.scrollHeight;});
 assert(await page.evaluate(()=>promptReading.contentContainer.scrollTop>0),'long description remains reachable');
 await page.evaluate(()=>promptReading.remove());
 for(const id of ['builtin-ink-gold','builtin-blue','builtin-jade']){
  const result=await page.evaluate(async id=>{
   const {builtinPacks}=await import('/noname/ui/workshop/presets.js');
   const {mountAppearance}=await import('/noname/ui/workshop/runtime.js');
   const remove=mountAppearance(builtinPacks().find(p=>p.manifest.id===id).manifest,x=>x);
   const css=getComputedStyle(env.ui.dialog),result={background:css.backgroundImage,color:css.color};remove();return result;
  },id);
  assert.ok(result.background.includes('linear-gradient')&&result.color==='rgb(232, 224, 208)',`${id}: prompt remains readable`);
 }
 for (const attribute of ['data-decade-parts', 'data-shousha-parts']) {
  assert(await page.evaluate(attribute => {
   document.body.setAttribute(attribute, 'buttons menus');
   const untouched = !getComputedStyle(env.ui.control.querySelector('.control > div')).borderImageSource.includes('decade-button');
   document.body.removeAttribute(attribute); return untouched;
  }, attribute), 'built-in surface releases provider-owned controls');
 }
 await page.evaluate(async () => (await import('/noname/ui/gameNavigation.js')).openGameNavigation());
 assert(await page.locator('.game-navigation').evaluate(n => getComputedStyle(n).backgroundImage.includes('linear-gradient')&&getComputedStyle(n).borderTopWidth==='1px'), 'native navigation uses the same prompt surface');
 await page.screenshot({path:`${out}/game-navigation.png`});
 await page.getByRole('button', {name:'继续游戏',exact:true}).click();
 assert.equal(await page.locator('.game-navigation').count(), 0, 'continue closes native navigation');
 await page.evaluate(() => {
  document.querySelector('#window').style.display = 'none';
  const boot = document.createElement('div'); boot.id = 'noname-boot-status'; boot.innerHTML = '<strong class="boot-title lobby-brand">无名杀</strong><span class="boot-motto">群雄聚首 · 共竞风云</span><span class="boot-progress"></span><span class="boot-message">正在载入游戏…</span>'; document.body.append(boot);
 });
 await page.setViewportSize({ width: 1920, height: 1080 });
 await page.screenshot({ path: `${out}/loading.png` });
 assert.deepEqual(report.errors, []);
 console.log(JSON.stringify({ cases: report.cases.map(c => ({ width: c.width, height: c.height, count: c.count, cardWidth: c.cards[0].width, scroll: c.scroll })), errors: report.errors }));
} finally {
 await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
 await browser.close();
}
