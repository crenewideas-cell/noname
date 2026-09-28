import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const { chromium } = createRequire(import.meta.url)(process.env.NONAME_PLAYWRIGHT_MODULE || 'C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = 'output/compact-seats';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const report = { errors: [], cases: [] };
page.on('pageerror', error => report.errors.push(error.message));
page.on('pageerror', error => console.error(error.message));
page.on('dialog', dialog => dialog.accept());
try {
	await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
	await page.routeWebSocket('**', () => {});
	await page.route('**/game/config.json*', async route => {
		const response = await route.fetch(), config = await response.json();
		Object.assign(config, { extensions: [], extension_auto_import: false, new_tutorial: true, version: '1.11.6', show_splash: 'always', mode: 'identity', characters: ['standard'], cards: ['standard'], ui_workshop_active: '' });
		for (const key in config) if (key.startsWith('extension_') && key.endsWith('_enable')) config[key] = false;
		await route.fulfill({ response, json: config });
	});
	await page.goto(process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081', { waitUntil: 'domcontentloaded' });
	console.log('loaded');
	await page.evaluate(async () => window.env = await import('/noname.js'));
	await page.waitForSelector('#splash', { timeout: 120000 });
	console.log('splash');
	await page.evaluate(async () => {
		const { ui, game, lib, get } = env;
		document.querySelector('#splash')?.remove();
		document.querySelector('#noname-boot-status')?.remove();
		ui.window ||= ui.create.div('#window', document.body);
		ui.window.classList.remove('hidden'); ui.window.style.display = '';
		ui.arena ||= ui.create.div('#arena', ui.window);
		ui.arena.className = 'long single-handcard oblongcard textequip';
		ui.arena.style.visibility = 'visible';
		game.layout = 'long2'; game.players = []; game.dead = [];
		lib.config.fold_card = true; lib.config.spread_card = true; lib.config.touchscreen = true;
		const link = document.createElement('link'); link.id = 'fixture-layout'; link.rel = 'stylesheet'; link.href = '/layout/long2/layout.css'; document.head.append(link);
		await import('/character/rank.js'); lib.rank = window.noname_character_rank;
		Object.assign(lib.character, (await import('/character/standard/character.js')).default);
		Object.assign(lib.translate, (await import('/character/standard/translate.js')).default);
		const cards = (await import('/card/standard.js')).default;
		Object.assign(lib.card, cards.card); Object.assign(lib.translate, cards.translate);
		ui.me = ui.create.div('#me', ui.arena);
		ui.handcards1Container = ui.create.div('#handcards1', ui.me); ui.handcards2Container = ui.create.div('#handcards2', ui.me);
		window.setCount = (count, landlordPosition = 0) => {
			for (const player of game.players) player.remove();
			game.players = []; ui.arena.dataset.number = String(count);
			for (let i = 0; i < count; i++) {
				const p = ui.create.player(ui.arena).addTempClass('start'); p.dataset.position = String(i);
				p.name = p.name1 = ['caocao', 'liubei', 'sunquan', 'diaochan'][i % 4];
				p.hp = p.maxHp = 4; p.group = ['wei', 'shu', 'wu', 'qun'][i % 4];
				p.node.name.textContent = get.translation(p.name); p.node.avatar.show(); p.node.avatar.setBackground(p.name, 'character');
				for (let hp = 0; hp < 4; hp++) ui.create.div('', p.node.hp);
				game.players.push(p);
			}
			game.me = game.players[0];
			lib.config.mode = count === 3 ? 'doudizhu' : 'identity';
			game.zhu = game.players[landlordPosition];
			game.players.forEach(p => { p.identity = p === game.zhu ? 'zhu' : 'fan'; });
			ui.handcards1 = game.me.node.handcards1; ui.handcards2 = game.me.node.handcards2;
			ui.handcards1Container.replaceChildren(ui.handcards1); ui.handcards2Container.replaceChildren(ui.handcards2);
			for (let i = 0; i < 7; i++) ui.create.card(ui.handcards1).init(['spade', i + 1, ['sha', 'shan', 'tao'][i % 3]]);
			ui.updatePlayerPositions();
		};
		setCount(8);
		ui.control = ui.create.div('#control.action-controls', ui.arena);
		ui.controls = []; ui.create.control(['结束回合', '托管']);
		window.mount = async provider => {
			window.release?.();
			const { installBuiltinAdaptiveLayout, releaseBuiltinAdaptiveLayout } = await import('/noname/ui/adaptiveLayout.js');
			releaseBuiltinAdaptiveLayout(ui.arena);
			if (['builtin', 'mobile', 'nova'].includes(provider)) {
				game.layout = provider === 'builtin' ? 'long2' : provider;
				await new Promise(resolve => { const link = document.getElementById('fixture-layout'), href = `/layout/${game.layout}/layout.css`; if (link.getAttribute('href') === href && link.sheet) return resolve(); link.onload = resolve; link.href = href; });
				installBuiltinAdaptiveLayout({ game, ui, mode: () => lib.config.mode });
				window.release = () => releaseBuiltinAdaptiveLayout(ui.arena);
			} else {
				game.layout = 'mobile';
				await new Promise(resolve => { const link = document.getElementById('fixture-layout'), href = '/layout/mobile/layout.css'; if (link.getAttribute('href') === href && link.sheet) return resolve(); link.onload = resolve; link.href = href; });
				const { builtinPacks } = await import('/noname/ui/workshop/presets.js');
				const id = provider === 'shousha' ? 'builtin-shousha-standard' : 'builtin-decade-ingame';
				const base = provider === 'shousha' ? '/extension/手杀标准UI/' : '/extension/十周年局内UI/';
				const module = await import(base + (provider === 'shousha' ? 'native/presentation.js' : 'presentation.js'));
				window.release = await (module.mountGamePresentation || module.mountPresentation)({ ...env, base, manifest: builtinPacks().find(p => p.manifest.id === id).manifest, files: await (await fetch(base + 'files.json')).json(), config: { ss_auto_emotion: false, ss_emotion_reply: false }, signal: new AbortController().signal });
			}
		};
		window.hits = [];
		ui.arena.addEventListener('click', event => { const p = event.target.closest('.player'); if (p) { hits.push(Number(p.dataset.position)); event.stopImmediatePropagation(); event.preventDefault(); } }, true);
	});
 console.log('fixture ready');

 const snapshot = () => {
  const {ui,game}=env;
  const rect=n=>n.getBoundingClientRect().toJSON();
  return {arena:rect(ui.arena),players:game.players.map(p=>({position:Number(p.dataset.position),visible:getComputedStyle(p).visibility,...rect(p)})),cards:[...ui.handcards1.children].map(rect),hand:rect(ui.handcards1Container),control:rect(ui.control)};
 };
 function check(result,count,landlordPosition,label) {
  const {arena,players,cards}=result;
  const z=arena.width/result.localWidth;
  const unit=Math.min(arena.width/1920,arena.height/1080);
  const expectedWidth=250.88*unit,expectedHeight=352.8*unit;
  const inset=16*unit+Math.max(0,arena.width-1920*unit)*.2;
  const span=arena.width-2*inset-expectedWidth;
  let slots=count===8?[[6,null],[6,220],[5,80],[4,12],[3,12],[2,12],[1,80],[0,220]]:
   count===5?[[6,null],[6,220],[4,12],[2,12],[0,220]]:
   count===4?[[6,null],[6,220],[3,12],[0,220]]:
   landlordPosition===1?[[6,null],[4,12],[0,220]]:
   landlordPosition===2?[[6,null],[6,220],[2,12]]:[[6,null],[4,12],[2,12]];
  for(const p of players) {
   const [column,top]=slots[p.position];
   const x=arena.x+inset+span*column/6,y=top===null?arena.bottom-expectedHeight-12*unit:arena.y+top*unit;
   assert.equal(p.visible,'visible',label+' visible on first frame');
   assert(Math.abs(p.x-x)<1.2&&Math.abs(p.y-y)<1.2,label+' exact seat '+p.position+': '+JSON.stringify({p,x,y}));
   assert(Math.abs(p.width-expectedWidth)<1.2&&Math.abs(p.height-expectedHeight)<1.2,label+' exact frame size');
  }
  assert(Math.abs(cards[0].width-194.4*unit)<1.2,label+' reference hand width');
  assert(Math.abs(cards[0].height-270*unit)<1.2,label+' reference hand height');
  assert(cards.every(c=>c.bottom<=arena.bottom+1),label+' hand stays in view');
 }
 for (const provider of ['builtin','mobile','nova','shousha','decade']) {
  console.log('mount',provider);
  await page.evaluate(provider=>mount(provider),provider);
  console.log('mounted',provider);
  for(const [width,height] of [[1920,1080],[1366,768],[900,650],[1920,860]]) {
   await page.setViewportSize({width,height});
   for(const [count,landlordPosition]of [[8,0],[5,0],[4,0],[3,0],[3,1],[3,2]]) {
    const frames=await page.evaluate(async({count,landlordPosition,source})=>{
     setCount(count,landlordPosition);hits=[];
     const snapshot=eval('('+source+')'),frames=[];
     for(let i=0;i<12;i++){await new Promise(requestAnimationFrame);frames.push(snapshot());}
     return frames;
    },{count,landlordPosition,source:snapshot.toString()});
    const result=frames[0];report.cases.push({provider,width,height,count,landlordPosition,frames});
    for(const frame of frames)check(frame,count,landlordPosition,provider+'/'+width+'/'+count+'/'+landlordPosition);
    for(const seat of result.players)await page.mouse.click(seat.x+seat.width/2,seat.y+seat.height*.6);
    assert.equal(new Set(await page.evaluate(()=>hits)).size,count,provider+' all seats clickable');
    if(width===1920&&height===1080){await page.waitForTimeout(650);await page.screenshot({path:out+'/'+provider+'-'+count+'-view'+landlordPosition+'.png'});}
   }
  }
  // Minor resizes must immediately commit continuous geometry, with actual
  // production transitions enabled (no test-only animation override).
  await page.evaluate(()=>setCount(8));
  for(let step=0;step<18;step++) {
   await page.setViewportSize({width:1366+step,height:768+step%3});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const result=await page.evaluate(snapshot);check(result,8,0,provider+' live resize '+step);
  }
  // The engine's zoom setting changes the logical coordinate system. Visible
  // frame/card sizes must still match the same physical reference proportions.
  for(const zoom of [.8,1.25,1]) {
   await page.evaluate(zoom=>{env.game.documentZoom=zoom;env.ui.updatez();},zoom);
   const result=await page.evaluate(snapshot);check(result,8,0,provider+' zoom '+zoom);
  }
  await page.setViewportSize({width:1920,height:1080});
  await page.evaluate(()=>{
   setCount(3,1);env.ui.thrown=[];
   for(let i=0;i<2;i++)env.game.me.$throwordered2(env.ui.create.card().init(['heart',i+1,['sha','tao'][i]]),true);
  });
  await page.waitForTimeout(650);
  const thrown=await page.evaluate(()=>env.ui.thrown.map(c=>c.getBoundingClientRect().toJSON()));
  assert(thrown.length===2&&thrown.every(c=>Math.abs(c.width-160.92)<1&&Math.abs(c.height-223.5)<1),provider+' reference discard size');
  assert(thrown[1].left>=thrown[0].right-3,provider+' readable central cards');
  await page.screenshot({path:out+'/'+provider+'-central-cards.png'});
  await page.evaluate(()=>{env.ui.thrown.forEach(c=>c.remove());env.ui.thrown=[];});
 }

	assert.deepEqual(report.errors, []);
	console.log(JSON.stringify({ cases: report.cases.length, errors: report.errors }));
} finally {
	await page.screenshot({path:out+'/last-frame.png'}).catch(()=>{});
	await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
	await browser.close();
}
