import fs from 'node:fs/promises';import{createRequire}from'node:module';
const{chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir='output/dynamic-zhang',rows=JSON.parse(await fs.readFile(dir+'/regression.json')).filter(e=>e.size[0]===360&&e.registered);
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
try{const cards=[];for(const e of rows){const page=await browser.newPage({viewport:{width:360,height:600}});
 await page.route(/\/runtime\/[^/]+\.js$/,async route=>{const name=new URL(route.request().url()).pathname.split('/').at(-1);await route.fulfill({status:200,contentType:'text/javascript',body:await fs.readFile(dir+'/baseline-runtime/'+name,'utf8')});});
 await page.goto('http://127.0.0.1:8081/extension/本地动态皮肤包/无名杀基础扩展/runtime/player.html?id='+e.id+'&presentation=preview');await page.waitForFunction(()=>window.skinPlayer||window.skinPlayerError);
 await page.evaluate(()=>{if(window.skinPlayerError)throw Error(skinPlayerError);const p=skinPlayer;p.engine42?.pause(true);p.app?.stop();p.engine42?.draw(5);if(p.app){p.root.children.forEach(s=>s.update(5));p.app.render();}});
 const old=await page.screenshot();await page.close();const current=await fs.readFile(dir+'/'+e.id+'-360.png');
 cards.push(`<article><div><img src="data:image/png;base64,${old.toString('base64')}"><img src="data:image/png;base64,${current.toString('base64')}"></div><label>${e.title}：修改前 / 修改后</label></article>`);
}const page=await browser.newPage({viewport:{width:1080,height:330}});await page.setContent(`<style>body{margin:0;display:grid;grid-template-columns:repeat(3,360px);background:#ddd}article{height:330px;text-align:center;font:14px sans-serif}article div{display:flex}img{width:180px;height:300px}label{display:block;margin:6px}</style>${cards.join('')}`);await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));await page.screenshot({path:dir+'/registration-comparison.png',fullPage:true});}finally{await browser.close();}
