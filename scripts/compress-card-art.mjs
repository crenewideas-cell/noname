import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

export const CARD_ART_LIMITS = Object.freeze({ width: 512, height: 768, maxBytes: 120 * 1024 });

/** Resize before encoding; preserve aspect ratio/alpha and never upscale or crop. */
export async function compressCardArt(input, output, options = {}) {
 const { width, height, maxBytes } = { ...CARD_ART_LIMITS, ...options };
 if (![width,height,maxBytes].every(n=>Number.isInteger(n)&&n>0)) throw new Error('尺寸和字节上限必须为正整数');
 if(path.resolve(input)===path.resolve(output)) throw new Error('源文件与输出必须不同，保留原始素材');
 if(path.extname(output).toLowerCase()!=='.webp') throw new Error('输出必须使用 .webp 扩展名');
 const original=await fs.readFile(input);
 const metadata=await sharp(original).metadata();
 if((metadata.pages||1)>1) throw new Error('只处理静态牌面，不会把动画静默转成单帧');
 let scale=1, selected;
 for(let attempt=0;attempt<6&&!selected;attempt++,scale*=0.85) {
  for(const quality of [82,76,70,64]) {
   const result=await sharp(original).rotate().resize({width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale)),fit:'inside',withoutEnlargement:true})
    .webp({quality,alphaQuality:100,effort:6}).toBuffer({resolveWithObject:true});
   if(result.data.length<=maxBytes){selected={...result,quality};break;}
  }
 }
 if(!selected) throw new Error('无法在画质下限内满足大小限制，请调整 maxBytes');
 await fs.mkdir(path.dirname(output),{recursive:true});
 // Refuse overwriting a different asset. Identical reruns are safe and idempotent.
 const existing=await fs.readFile(output).catch(e=>{if(e.code!=='ENOENT')throw e;return null;});
 if(existing&&!existing.equals(selected.data)) throw new Error('输出已存在且内容不同：'+output);
 if(!existing) await fs.writeFile(output,selected.data,{flag:'wx'});
 return {input,output,originalBytes:original.length,bytes:selected.data.length,width:selected.info.width,height:selected.info.height,quality:selected.quality,alpha:metadata.hasAlpha||false};
}

async function main(args) {
 if(args[0]==='--manifest') {
  const file=args[1], manifest=JSON.parse(await fs.readFile(file,'utf8'));
  const results=[];
  for(const item of manifest.images) {
   const result=await compressCardArt(item.source,item.dest);
   item.compression=result;results.push(result);
  }
  await fs.writeFile(file,JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({images:results.length,before:results.reduce((n,r)=>n+r.originalBytes,0),after:results.reduce((n,r)=>n+r.bytes,0)},null,2));
 } else if(args.length===2) console.log(JSON.stringify(await compressCardArt(args[0],args[1]),null,2));
 else throw new Error('用法：pnpm cards:compress 原图 输出.webp，或 pnpm cards:compress --manifest 清单.json（images: source/dest）');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) main(process.argv.slice(2)).catch(error=>{console.error(error.message);process.exitCode=1;});
