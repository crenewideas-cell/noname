import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

let require=createRequire(import.meta.url);
try{require.resolve('marked');}catch{require=createRequire('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');}
const {marked}=await import(pathToFileURL(require.resolve('marked')).href);
const source='docs/dynamic-skin-remediation-manual.md';
const destination='output/dynamic-remediation-manual/动态皮肤系统全面整改与验收手册.html';
const markdown=await fs.readFile(source,'utf8');
const version=markdown.match(/版本：([\d.]+)/)?.[1]||'未标记';
let count=0;const headings=[];
const content=marked.parse(markdown).replace(/<h2>([\s\S]*?)<\/h2>/g,(_,label)=>{
  const id='section-'+count++;headings.push({id,label});return `<h2 id="${id}">${label}</h2>`;
});
const navigation=headings.map(h=>`<a href="#${h.id}">${h.label}</a>`).join('');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>动态皮肤系统全面整改与验收手册</title><style>
:root{color-scheme:light;--ink:#213044;--muted:#5b6878;--line:#dae2ec;--accent:#174b7e}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:22px}body{margin:0;background:#edf1f6;color:var(--ink);font:16px/1.85 "Microsoft YaHei","Noto Sans CJK SC",sans-serif}
aside{position:fixed;inset:0 auto 0 0;width:286px;overflow:auto;background:#17354f;color:white;padding:28px 20px}aside strong{display:block;font-size:19px;line-height:1.5;margin-bottom:10px}aside small{color:#c4d5e7;display:block;margin-bottom:15px}nav a{display:block;color:#e4edf5;text-decoration:none;font-size:13px;padding:7px 8px;border-radius:5px;line-height:1.5}nav a:hover{background:#ffffff1c}aside button{background:#e2ecf5;border:0;border-radius:5px;padding:9px 15px;color:#17354f;cursor:pointer;margin-bottom:18px}
main{margin:28px 28px 50px 314px;max-width:1060px;background:white;padding:42px 48px;box-shadow:0 5px 24px #23374d0b;border:1px solid var(--line);border-radius:8px}
h1{font-size:31px;line-height:1.4;color:#17354f;margin:0 0 23px}h2{font-size:24px;line-height:1.5;color:var(--accent);border-bottom:2px solid #dce6f0;padding-bottom:12px;margin-top:56px}h3{font-size:19px;line-height:1.5;margin-top:30px}p{margin:15px 0}ul,ol{padding-left:25px}li{padding-left:3px;margin:7px 0}strong{color:#172c44}hr{border:0;border-top:1px solid var(--line);margin:34px 0}
table{border-collapse:collapse;width:100%;font-size:13px;line-height:1.75;margin:20px 0;table-layout:fixed}th,td{padding:10px 12px;vertical-align:top;border:1px solid var(--line);overflow-wrap:anywhere}th{background:#eaf1f8;text-align:left;color:#174b7e}tr:nth-child(even) td{background:#f8fafc}code{font:0.89em/1.6 Consolas,"Microsoft YaHei",monospace;background:#eff3f7;border-radius:3px;padding:2px 4px;overflow-wrap:anywhere}pre{background:#f3f6fa;border:1px solid var(--line);padding:17px 20px;border-radius:5px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.8}pre code{background:none;padding:0}a{color:var(--accent)}input[type=checkbox]{margin-right:7px}blockquote{border-left:4px solid #aec7df;padding-left:18px;color:var(--muted)}.tag{display:inline-block;color:#174b7e;background:#e7f0f8;border-radius:5px;padding:3px 12px;font-size:12px;margin-bottom:22px}
aside strong{color:white}
@media(max-width:1000px){aside{position:static;width:auto;max-height:300px}nav{columns:2}main{margin:18px;padding:26px}}@media(max-width:600px){nav{columns:1}main{padding:22px 16px}h1{font-size:26px}table{font-size:11px}th,td{padding:6px}}
@media print{@page{size:A4;margin:18mm 15mm}html{scroll-behavior:auto}body{background:white;font-size:10pt;line-height:1.65}aside,.tag{display:none}main{margin:0;max-width:none;padding:0;border:0;box-shadow:none}h1{font-size:22pt}h2{font-size:16pt;margin-top:26px;break-after:avoid}h3{font-size:12pt;break-after:avoid}table{font-size:8pt}tr,pre{break-inside:avoid}pre{font-size:8pt}th{background:#edf2f7!important}a{color:inherit}}
</style></head><body><aside><strong>动态皮肤系统<br>全面整改与验收手册</strong><small>2026-09-26 · 版本 ${version}<br>实施规范，非整改完成报告</small><button onclick="window.print()">打印 / 保存为 PDF</button><nav>${navigation}</nav></aside><main><span class="tag">全库整改 · 独立参考 · 严格验收 · 可回退交付</span>${content}</main></body></html>`;
await fs.mkdir(path.dirname(destination),{recursive:true});
await fs.writeFile(destination,html);
console.log(JSON.stringify({source,destination,sections:headings.length,characters:markdown.length}));
