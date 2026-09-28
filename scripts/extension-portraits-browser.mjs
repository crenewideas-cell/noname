import { createRequire } from "node:module";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const { chromium } = createRequire(import.meta.url)("C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const installed = JSON.parse(await fs.readFile("apps/core/game/organized-extensions.json"));
const bundled = JSON.parse(await fs.readFile("apps/core/game/bundled-extensions.json"));
const enabled = ["手杀新赵襄", "新诸葛果", "觉醒突破", "分支武将", "卡牌扩展"];
const provider = process.argv[2] || "";
const output = "output/extension-portraits" + (provider ? "-shousha" : "");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({headless:true, executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
const context = await browser.newContext({viewport:{width:1600,height:1000}});
const page = await context.newPage();
const report = {errors:[], dialogs:[], packs:[]};
page.on("pageerror", e => report.errors.push(e.message));
page.on("dialog", async d => { if (!d.message().includes("GPLv3")) report.dialogs.push(d.message()); await d.accept(); });
await page.route("**/api/**", r => r.abort());
await page.routeWebSocket("**", r => r.close());
await page.route("**/game/config.json", async r => {
  const response = await r.fetch(), config = await response.json();
  Object.assign(config,{extensions:enabled,extension_auto_import:false,new_tutorial:true,version:"1.11.6",show_splash:"always",mode:"identity",characters:["standard"],cards:["standard"],ui_workshop_active:provider,show_charactercard:true});
  for (const name of [...installed.map(x=>x.name),...bundled]) config[`extension_${name}_enable`] = enabled.includes(name);
  await r.fulfill({response,json:config});
});
try {
  await page.goto("http://127.0.0.1:5174/?lobbySettings=extensions",{waitUntil:"domcontentloaded"});
  await page.waitForSelector("html.lobby-settings-page .main.menu",{timeout:90000});
  const menu = page.locator(".menu-container:not(.hidden) > .main.menu");
  const search = menu.getByRole("searchbox",{name:"搜索扩展 / 功能",exact:true});
  await page.evaluate(async()=> (await import("/noname.js")).ui.click.menuTab("扩展"));
  const before = await page.evaluate(async()=>JSON.stringify((await import("/noname.js")).lib.config.characters));
  for (const name of enabled.filter(n=>n!=="卡牌扩展")) {
    await search.fill(name);
    await menu.locator(".pack-menu-search-results button").first().click();
    const group = menu.locator(`details[data-extension="${name}"]`);
    await group.locator(".button.character").first().waitFor({state:"visible",timeout:15000});
    const result = await group.evaluate(n=>({name:n.dataset.extension, packs:[...n.querySelectorAll("[data-character-pack]")].map(p=>({name:p.dataset.characterPack,ids:[...p.querySelectorAll(".button.character")].map(c=>c.link)}))}));
    for (const pack of result.packs) {
      const expected = name === "新诸葛果" ? ["mb_zhugeguo"] : await page.evaluate(async mode=>Object.entries((await import("/noname.js")).lib.characterPack[mode]).filter(([,c])=>!c.isUnseen).map(([id])=>id).sort(),pack.name);
      assert.deepEqual(pack.ids.sort(),expected);
    }
    report.packs.push(result);
    const allIds = result.packs.flatMap(p=>p.ids);
    assert.equal(new Set(allIds).size,allIds.length);
    if (name==="手杀新赵襄") {
      assert.ok(result.packs.some(p=>p.ids.includes("xin_zhaoxiang")));
      await search.fill("");
      await group.scrollIntoViewIfNeeded();
      await page.screenshot({path:`${output}/zhaoxiang.png`});
      await group.locator('.button.character').first().click();
      // The engine consumes a stale global click after search input focus.
      if (!await page.locator('.popup-container .charactercard').count()) await group.locator('.button.character').first().click();
      await page.locator('.popup-container .charactercard').waitFor({state:'visible',timeout:3000});
      report.characterClick = true;
      // Close the native character sheet with its existing close control.
      await page.waitForTimeout(600);
      await page.locator('.popup-container').filter({has:page.locator('.charactercard')}).click({position:{x:5,y:5}});
      await page.locator('.popup-container .charactercard').waitFor({state:'detached'});
    }
  }
  assert.equal(await page.evaluate(async()=>JSON.stringify((await import("/noname.js")).lib.config.characters)),before);
  await page.evaluate(async()=> (await import("/noname.js")).ui.click.menuTab("武将"));
  const characters = menu.getByRole("searchbox",{name:"搜索武将 / 武将包",exact:true});
  await characters.fill("手杀新赵襄");
  await menu.locator(".pack-menu-search-results button").first().click();
  assert.ok(await menu.locator('.right.pane .button.character').count());
  await page.evaluate(async()=> (await import("/noname.js")).ui.click.extensionTab("卡牌扩展"));
  report.cardSettings = await menu.locator('.right.pane').textContent();
  assert.ok(report.cardSettings.includes("导入卡面") && report.cardSettings.includes("OL 卡牌序列帧特效"));
  assert.deepEqual(report.errors,[]);
  report.passed=true;
} catch(e) { report.failure=e.stack; await page.screenshot({path:`${output}/failure.png`}); throw e; }
finally { await fs.writeFile(`${output}/report.json`,JSON.stringify(report,null,2)); console.log(JSON.stringify({...report,packs:report.packs.map(p=>({name:p.name,count:p.packs.reduce((sum,x)=>sum+x.ids.length,0)})),cardSettings:undefined})); await browser.close(); }
