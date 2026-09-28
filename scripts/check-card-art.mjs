import fs from 'node:fs/promises';
import sharp from 'sharp';
import { CARD_ART_LIMITS } from './compress-card-art.mjs';

// Keep generated artwork manifests here so release builds enforce their size budget.
export const manifests = ['docs/card-art-compression-20260927.json','docs/card-art-honglou-qingyao-20260927.json'];
let count=0;
for(const file of manifests) {
 const manifest=JSON.parse(await fs.readFile(file,'utf8'));
 for(const item of manifest.images) {
  const data=await fs.readFile(item.dest),meta=await sharp(data).metadata();
  if(meta.format!=='webp'||meta.width>CARD_ART_LIMITS.width||meta.height>CARD_ART_LIMITS.height||data.length>CARD_ART_LIMITS.maxBytes) {
   throw new Error(`卡面超出发布预算：${item.dest}。请运行 pnpm cards:compress 生成压缩版。`);
  }
  count++;
 }
}
console.log(`卡面压缩检查通过：${count} 张，每张不超过 512×768 / 120 KiB。`);
