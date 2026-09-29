import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const { chromium } = createRequire(new URL('../packages/game-host/package.json', import.meta.url))('playwright-core');
const origin = process.env.NONAME_UI_TEST_ORIGIN || 'http://127.0.0.1:8081';
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', e => errors.push(e.stack));
page.on('console', msg => { if (msg.text().startsWith('QINGYAO_TEST')) console.log(msg.text()); });
await page.route('**/__qingyao_tests.html', r => r.fulfill({ contentType: 'text/html', body: `<meta charset="utf-8"><script type="module" src="/@fs/${path.resolve('scripts/qingyao-import.browser.js').replaceAll('\\', '/')}"></script>` }));
let report;
try {
    await page.goto(origin + '/__qingyao_tests.html');
    await page.waitForFunction(() => window.__qingyaoReport, null, { timeout: 90000 });
    report = await page.evaluate(() => window.__qingyaoReport);
} catch (error) {
    report = { fatal: error.stack, progress: await page.evaluate(() => window.__qingyaoProgress) };
} finally {
    report.pageErrors = errors;
    await mkdir('output/qingyao-import-20260929', { recursive: true });
    await writeFile('output/qingyao-import-20260929/browser.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
}
if (report.fatal || report.failures?.length || errors.length) process.exitCode = 1;
