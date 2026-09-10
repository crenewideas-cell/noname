import { packs, reservedCharacters, reservedSkills } from './catalog.js';
import assets from './asset-map.js';

export const type = 'extension';
const name = '分支武将';
const labels = {app:'小程序', bingshi:'兵势篇', clan:'门阀士族',collab:'活动场',diy:'DIY',dragon:'龙血玄黄',extra:'神将',huicui:'群英荟萃',jiange:'守卫剑阁',jiangshan:'江山如故',mobile:'移动版',mouding:'谋定天下',offline:'线下武将',old:'怀旧',refresh:'界限突破',sb:'谋攻篇',shangbing:'上兵伐谋',sp:'璀璨星河',sp2:'南征北战',swd:'轩辕剑',tw:'外服武将',wei:'威震天下',xiake:'侠客',xianding:'限定专属',xinghuoliaoyuan:'星汉灿烂',yijiang:'一将成名',zhuogui:'捉鬼'};
const tokens = value => {
    const result = new Set();
    const visit = value => {
        if (typeof value === 'function' || typeof value === 'string') {
            for (const token of String(value).match(/[\p{L}\p{N}_$]+/gu) || []) result.add(token);
        } else if (value && typeof value === 'object') for (const item of Object.values(value)) visit(item);
    };
    visit(value);
    return result;
};
const skillsOf = character => Array.isArray(character) ? character[3] : character.skills || [];

export default function (lib, game, ui, get, ai, _status) {
    const args = [lib, game, ui, get, ai, _status];
    const data = packs.map(pack => ({ ...pack, data: pack.create(...args) }));
    const skillIndex = new Map();
    const cardIndex = new Map();
    for (const pack of data) {
        for(const [id,info] of Object.entries(pack.data.card || {}))if(!cardIndex.has(id))cardIndex.set(id,{pack,info});
        const add = dictionary => {
            for (const [id, info] of Object.entries(dictionary || {})) {
                const full = id;
                if (!skillIndex.has(full)) skillIndex.set(full, { pack, info, root: full });
                // Resolve subskill references back to the parent; the engine expands subSkill.
                const sub = (dictionary, root, prefix) => {
                    for (const [id, info] of Object.entries(dictionary || {})) {
                        skillIndex.set(prefix + id, { pack, info, root });
                        sub(info.subSkill, root, prefix + id + '_');
                    }
                };
                sub(info.subSkill, full, full + '_');
            }
        };
        add(pack.data.skill);
    }
    const packageData = {
        character: { character: {}, characterSort: { [name]: {} }, characterFilter: {}, characterIntro: {}, characterTitle: {}, dynamicTranslate: {}, perfectPair: {}, translate: {} },
        card: { card: {}, translate: {}, list: [] },
        skill: { skill: {}, translate: {} },
        author: '分支原作者；增量整合 PXLNGU', version: '1.0.0',
        intro: '从分支版本增量补充武将、技能和素材。保留主工程同名定义。副本角色保留原隐藏属性；缺失技能的角色暂不可选。详情见 docs/branch-character-merge.md。',
    };
    const report = { characters: {}, skills: [], missing: {}, sources: data.map(p => p.source) };
    const resource = path => assets[path] || path;
    const chooseResource = paths => paths.find(path => assets[path]);
    const normalizeAudio = (id, info, pack) => {
        const ext = pack.source.startsWith('extension/') ? pack.source.split('/')[1] : null;
        if (typeof info.audio === 'number' || info.audio === true) {
            const suffixes = typeof info.audio === 'number' ? Array.from({length: info.audio}, (_, i) => `${i+1}`) : [''];
            const found = suffixes.map(suffix => chooseResource([...(ext ? [`extension/${ext}/audio/skill/${id}${suffix}.mp3`, `extension/${ext}/${id}${suffix}.mp3`] : []), `audio/skill/${id}${suffix}.mp3`])).filter(Boolean);
            info.audio = found.length ? found.map(path => resource(path)) : false;
        }
        for (const [sub, value] of Object.entries(info.subSkill || {})) normalizeAudio(`${id}_${sub}`, value, pack);
    };
    const loaded = new Set();
    const checkedExisting = new Set();
    const external = ['EpicFX','dui','decadeUI','duilib','dcdAnim','_Thunder','_ThAnim'];
    const requirements = new Map();
    function needCard(id) {
        if(id in lib.card || id in packageData.card.card)return;
        const entry=cardIndex.get(id);if(!entry)return;
        packageData.card.card[id]=entry.info;
        const image=chooseResource([`image/card/${id}.png`,`image/card/${id}.jpg`]);
        if(image)entry.info.image=resource(image);
        for(const skill of entry.info.skills || [])needSkill(skill,entry.pack);
        for(const dependency of tokens(entry.info)) {
            if(skillIndex.has(dependency))needSkill(dependency,entry.pack);
            if(cardIndex.has(dependency))needCard(dependency);
        }
    }
    function needSkill(id, preferred) {
        // Core/previously loaded extension definitions always win. A definition
        // merely present in a disabled source file cannot satisfy a live dependency.
        if (loaded.has(id)) return;
        if (id in lib.skill) {
            if (checkedExisting.has(id)) return;
            checkedExisting.add(id);
            for (const dependency of tokens(lib.skill[id])) if (skillIndex.has(dependency)) needSkill(dependency, preferred);
            return;
        }
        const entry = preferred?.data.skill?.[id] ? {pack:preferred,info:preferred.data.skill[id],root:id} : skillIndex.get(id);
        if (!entry) return;
        if (entry.root !== id) { needSkill(entry.root, entry.pack); return; }
        loaded.add(id);
        const dependencies = tokens(entry.info);
        requirements.set(id, external.filter(global => dependencies.has(global)));
        normalizeAudio(id, entry.info, entry.pack);
        packageData.skill.skill[id] = entry.info;
        for (const dependency of dependencies) {
            if (skillIndex.has(dependency)) needSkill(dependency, entry.pack);
            if (cardIndex.has(dependency)) needCard(dependency);
        }
    }
    function skillProblems(ids, seen = new Set()) {
        const problems = [];
        for (const id of ids) {
            if (seen.has(id)) continue;
            seen.add(id);
            const info = lib.skill[id] || packageData.skill.skill[id];
            if (!info) { problems.push(`缺失技能 ${id}`); continue; }
            for (const global of requirements.get(id) || []) if (!globalThis[global]) problems.push(`缺失扩展依赖 ${global}`);
            const group = typeof info.group === 'string' ? [info.group] : info.group || [];
            const nested = group.filter(sub => !(sub.startsWith(id+'_') && info.subSkill?.[sub.slice(id.length+1)]));
            problems.push(...skillProblems([...nested,...(info.inherit ? [info.inherit] : [])],seen));
        }
        return [...new Set(problems)];
    }
    return {
        name, editable: false,
        config: { details: { name: '增量武将与原包分组；副本角色保留为隐藏资料', clear: true, nopointer: true } },
        package: packageData,
        content() {
            for (const pack of data) {
                const added = [];
                for (const [id, character] of Object.entries(pack.data.character || {})) {
                    if (reservedCharacters.has(id) || id in lib.character || id in packageData.character.character) continue;
                    added.push(id);
                    const ext = pack.source.startsWith('extension/') ? pack.source.split('/')[1] : null;
                    const portrait = chooseResource([...(ext ? [`extension/${ext}/image/loutou/${id}.jpg`, `extension/${ext}/image/character/${id}.jpg`, `extension/${ext}/${id}.jpg`, `extension/${ext}/image/yuanhua/${id}.jpg`] : []), `image/character/${id}.jpg`, `image/character/${id}.png`, `image/character/${id}.webp`]);
                    const die = chooseResource([...(ext ? [`extension/${ext}/audio/die/${id}.mp3`, `extension/${ext}/${id}.mp3`] : []), `audio/die/${id}.mp3`]);
                    if (Array.isArray(character)) {
                        const tags = character[4] ||= [];
                        if (portrait) {
                            for (let i=tags.length-1;i>=0;i--) if (/^(ext:|db:|img:)/.test(tags[i])) tags.splice(i,1);
                            tags.push(`img:${resource(portrait)}`);
                        } else if (!tags.some(tag => /^(ext:|db:|img:|character:)/.test(tag))) tags.push(`character:${id}`);
                        if (die) {
                            for (let i=tags.length-1;i>=0;i--) if (tags[i].startsWith('die:')) tags.splice(i,1);
                            tags.push(`die:${resource(die)}`);
                        }
                    } else { if(portrait) character.img=resource(portrait); if(die) character.dieAudios=[resource(die)]; }
                    packageData.character.character[id] = character;
                    const required = skillsOf(character);
                    for (const skill of required) needSkill(skill, pack);
                    const originalFilter = pack.data.characterFilter?.[id];
                    packageData.character.characterFilter[id] = function(...args) {
                        if (pack.npc && get.mode() !== 'taixuhuanjing') return false;
                        if (skillProblems(required).length) return false;
                        return originalFilter ? originalFilter(...args) : true;
                    };
                    report.characters[id] = {source: pack.source,npc:pack.npc,portrait:portrait ? resource(portrait) : null,die:die ? resource(die) : null,skills:required};
                    for (const field of ['characterIntro','characterTitle','dynamicTranslate','perfectPair']) {
                        if (pack.data[field]?.[id] !== undefined && !(id in (lib[field] || {}))) packageData.character[field][id] = pack.data[field][id];
                    }
                }
                if (added.length) {
                    const group = `branch_${pack.id}`;
                    packageData.character.characterSort[name][group] = added;
                    packageData.character.translate[group] = labels[pack.label] || pack.label;
                }
            }
            // Copy supporting translations and skill descriptions only after dependency collection.
            const relevant = new Set([...Object.keys(packageData.character.character), ...Object.keys(packageData.card.card), ...loaded]);
            for (const id of loaded) for(const token of tokens(packageData.skill.skill[id])) relevant.add(token);
            for (const pack of data) {
                for (const [id,value] of Object.entries(pack.data.translate || {})) {
                    if(id in lib.translate || id in packageData.character.translate) continue;
                    let base = id.replace(/^#/, '').replace(/:die$/, '');
                    let wanted = relevant.has(base);
                    while (!wanted && base.includes('_')) { base=base.slice(0,base.lastIndexOf('_')); wanted=relevant.has(base); }
                    if (wanted) packageData.character.translate[id]=value;
                }
                for (const [id,value] of Object.entries(pack.data.characterPrefix || {})) if (id in packageData.character.character && !(`${id}_prefix` in lib.translate)) packageData.character.translate[`${id}_prefix`] ??= value;
                for (const [id,value] of Object.entries(pack.data.dynamicTranslate || {})) if (loaded.has(id) && !(id in lib.dynamicTranslate)) packageData.character.dynamicTranslate[id] ??= value;
                for (const [id,value] of Object.entries(pack.data.card || {})) if (relevant.has(id) && !(id in lib.card) && !(id in packageData.card.card)) packageData.card.card[id]=value;
            }
            for (const [id,record] of Object.entries(report.characters)) {
                const missing = skillProblems(record.skills);
                if(missing.length)report.missing[id]=missing;
            }
            report.skills = [...loaded];
            lib.branchCharacterAudit = report;
        },
        files: { character: [], card: [], skill: [] },
    };
}
