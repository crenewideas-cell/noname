# 华夏风云（模块化扩展）

## 目录说明

| 路径 | 作用 |
|------|------|
| `extension.js` | 扩展入口，引用 `package.js`、`precontent.js` |
| `package.js` | 组装 `character` / `card` / `skill` 三块并合并进无名杀 `package` |
| `precontent.js` | 加载时逻辑（如 `lib.dynamicTranslate`） |
| `character/data.js` | 武将：`{ id: { sex, group, hp, maxHp, hujia, skills } }` |
| `character/translate.js` | 武将译名、卡包名等 |
| `character/title.js` | 武将称号 `characterTitle` |
| `character/intro.js` | 武将简介 `characterIntro` |
| `character/patchAssets.js` | 自动写 `img`、`dieAudios` 路径（本扩展目录） |
| `card/data.js` | 扩展卡牌定义 |
| `card/translate.js` | 卡牌名与 `*_info` |
| `card/patchAssets.js` | 卡牌插画 `ext:群友设计/image/card/...` |
| `skill/skills.js` | 技能对象 `lib.skill` 内容 |
| `translate/skill.js` | 技能译名与 `*_info` |
| `translate/dynamicTranslate.js` | 局内动态描述（可选） |

## 资源文件

- 武将立绘：`image/character/{武将id}.jpg`
- 阵亡：`audio/die/{武将id}.mp3`
- 卡牌图：`image/card/{卡牌键名}.jpg`

在 **`extension.js` → `files`** 中登记用到的图片/音频文件名后，打包/联机更稳妥。


### 特别鸣谢以下设计者和素材作者，由于有些时间比较久远，如有遗漏，欢迎补充。感谢感谢！！

- `秋礼`
- `千芬`
- `御.sky`
- `天想子虚`
- `鸽子精`
- `新繁`
- `诺离鸡`
- `美妙世界`
- `欧磊磊`
- `永乐店（贴吧）`
- `仁王盾（B站）`
- `秦夫人`
- `昆凌灵零（贴吧）`
- `杰劼夫长（贴吧）`
- `洪武大魔王（B站）`
- `Vesperi.`
- `bu变随缘`
- `吃棉花糖`
- `留恋与回忆`
- `39`
- `玛格丽特本特`
- `李寻欢_Y（频道）`
- `汉武~大帝（频道）`
- `九域印象宣传（贴吧）`
- `枭瞳（贴吧）`
- `全险大运车（贴吧）`
- `J72eEZP（贴吧）`
- `少年铁匠（贴吧）`
- `凡特西-`
- `古锭刀酒杀小乔`
- `KaYkA（贴吧）`
- `泡泡龙`
- `沐云天`
- `！天命所归（B站）`
- `奶声~奶气`
