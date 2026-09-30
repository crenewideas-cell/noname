import { lib, game, ui, get, ai, _status } from "noname";
import config from "/game/config.json";
import "/noname/init/polyfill.ts";
import { loadCharacter, loadCard, loadExtension } from "/noname/init/loading.ts";
import identity from "/mode/identity.js";
import standardCards from "/card/standard.js";
import extension from "/extension/绯雪·动态/extension.js";
import { groupExtensionMenus } from '/noname/ui/create/menu/extensionGroups.ts';
import { registerOrganizedExtensions } from '/noname/init/organizedExtensions.ts';
import StepCompiler from '/noname/library/element/GameEvent/compilers/StepCompiler.ts';

import { CacheContext } from "/noname/library/cache/cacheContext.js";
import { security, initializeSandboxRealms } from "/noname/util/sandbox.ts";

const report = { passed: [], failures: [] };
window.__feixueProgress = report;
const assert = (value, message) => { if (!value) throw new Error(message); };
const test = async (name, fn) => {
    report.running = name;
    console.log("FEIXUE_TEST " + name);
    try { await fn(); report.passed.push(name); }
    catch (e) {
        report.failures.push({ name, error: e.stack });
        while (_status.eventManager.eventStack.length) _status.eventManager.popStatusEvent();
    }
};
try {
    lib.config = { ...structuredClone(config), mode: "identity", characters: ["standard"], cards: ["standard"], background_speak: false, background_music: "music_off", animation: false, bannedpile: {}, addedpile: {}, ignore_error: false };
    lib.assetURL = "/";
    lib.path = (await import("path-browserify-esm")).default;
    lib.configOL = { mode: "identity", characterPack: ["standard"], banned: [], bannedcards: [] };
    Object.assign(lib, { get, game, ui, ai, connectCharacterPack: [], connectCardPack: [] });
    game.layout = "newlayout";
    _status.mode = "normal";
    lib.status.date = new Date();
    lib.status.dateDelayed = 0;
    ui.css = {}; ui.dialogs = []; ui.controls = [];
    CacheContext.setProxy({ lib, game, get });
    Object.assign(get, identity.get); Object.assign(ai, identity.ai);
    _status.characterlist = [];
    await initializeSandboxRealms(true);
    await security.initSecurity({ lib, game, ui, get, ai, _status });
    ui.window = ui.create.div("#window", document.body);
    ui.arena = ui.create.div("#arena", ui.window);
    ui.background = ui.create.div(".background", document.body);
    ui.backgroundMusic = document.createElement("audio");
    for (const [key, cls] of Object.entries({ cardPile: "card-pile", discardPile: "discard-pile", ordering: "ordering", special: "special", control: "control", system: "system", sidebar: "sidebar", arenalog: "arenalog", historybar: "historybar" })) ui[key] = ui.create.div("." + cls, ui.window);
    for (const key of ["cardPile", "discardPile", "ordering", "special"]) ui[key].id = key;
    ui.system1 = ui.create.div(ui.system); ui.system2 = ui.create.div(ui.system);
    const standard = await import("/character/standard/index.js");
    if (standard.default) await game.import("character", standard.default);
    for (const pack of Object.values(lib.imported.character)) loadCharacter(pack);
    await game.import("card", standardCards);
    for (const pack of Object.values(lib.imported.card)) loadCard(pack);
    const ext = extension(lib, game, ui, get, ai, _status);
    report.running = "loadExtension";
    delete lib.onload;
    ext.precontent();
    await loadExtension([ext.name, ext.content, {}, false, ext.package, ext.connect]);
    game.finishCards();
    _status.event = new lib.element.GameEvent("feixue_test", false);
    game.players = Array.from({ length: 4 }, () => ui.create.player(ui.arena));
    game.dead = []; game.me = game.zhu = game.players[0];
    lib.playerOL = {}; lib.cardOL = {}; lib.vcardOL = {};
    for (const [i, p] of game.players.entries()) {
        p.playerid = "feixue-test-" + i; lib.playerOL[p.playerid] = p;
        p.next = p.nextSeat = game.players[(i + 1) % 4];
        p.previous = p.previousSeat = game.players[(i + 3) % 4];
        p.identity = i ? "fan" : "zhu";
        p.init(i === 0 ? "feixue_changshi" : "caocao");
    }

    const p = game.me;
    _status.auto = true;

    await test('默认登记及独立武将菜单', async () => {
        const values = new Map();
        await registerOrganizedExtensions({get:k=>values.get(k),has:k=>values.has(k)},async(k,v)=>values.set(k,v));
        assert(values.get('extensions').includes(ext.name), '未登记');
        assert(values.get('extension_'+ext.name+'_enable')===true, '未默认启用');
        values.set('extension_'+ext.name+'_enable',false);
        await registerOrganizedExtensions({get:k=>values.get(k),has:k=>values.has(k)},async(k,v)=>values.set(k,v));
        assert(values.get('extension_'+ext.name+'_enable')===false, '覆盖了手动关闭');
        const menus=groupExtensionMenus(['extension_'+ext.name]);
        assert(menus[0].name==='独立武将' && menus[0].members.includes('extension_'+ext.name), '分类错误');
    });
    await test('双形态及全部技能登记与编译', () => {
        assert(Object.keys(lib.characterPack[ext.name]).length===2,'形态数错误');
        assert(!lib.skill['测试6'] && !ext.package.skill.translate['测试6'],'残留测试技能');
        for(const id of ['feixue_changshi','feixue_yuqiu']) {
            for(const skill of lib.character[id].skills) assert(lib.skill[skill],skill+'缺失');
        }
        const scan=(s,name)=>{
            for(const key of ['content','precontent']) if(s[key]) new StepCompiler().compile(s[key]);
            for(const group of s.group||[]) assert(lib.skill[group],group+'缺失');
            for(const [key,sub] of Object.entries(s.subSkill||{})) scan(sub,name+'_'+key);
        };
        for(const [id,s] of Object.entries(ext.package.skill.skill)) scan(s,id);
        assert(p.hasSkill('feixue_jianxin') && !lib.skill.feixue_jianxin.filter({},p),'见心初始状态错误');
    });
    await test('头像、四组动画音频及动画样式可加载', async () => {
        for(const id of ['feixue_changshi','feixue_yuqiu']) {
            const img=new Image(); img.src='/extension/'+ext.name+'/image/character/'+id+'.jpg'; await img.decode();
        }
        for(const id of ['feixue_wanxue','feixue_jianxin','feixue_shuangtian','feixue_guiren']) {
            const img=new Image(); img.src='/extension/'+ext.name+'/image/GIF/'+id+'.gif'; await img.decode();
            const res=await fetch('/extension/'+ext.name+'/audio/skill/'+id+'.mp3');
            assert(res.ok && res.headers.get('content-type').includes('audio'),'音频不可加载');
        }
        const css=await (await fetch('/extension/'+ext.name+'/extension.css')).text();
        assert(css.includes('@keyframes feixue_guiren_animation'),'动画样式缺失');
    });
    // Run compiled steps with real player objects; skip timing and audio only.
    const topVars={lib,game,ui,get,ai,_status};
    const step=async(content,index,event={},trigger={})=>new StepCompiler().compile(content).originals[index](topVars,event,trigger,p);
    game.delay=()=>{}; game.delayx=()=>{}; game.playAudio=()=>{};
    await test('挽雪解锁见心，见心切换预求身', async () => {
        p.addMark('feixue_xinnian',300,false);
        await step(lib.skill.feixue_wanxue.precontent,0);
        assert(p.countMark('feixue_xinnian')===0 && lib.skill.feixue_jianxin.filter({},p),'未解锁见心');
        await step(lib.skill.feixue_jianxin.content,0);
        assert(p.name==='feixue_yuqiu' && p.hasSkill('feixue_shuangtian'),'未切换预求身');
        assert(p.countMark('feixue_wushuangjuhe')===3 && p.countMark('feixue_hanyi')===100,'形态资源错误');
    });
    await test('霜天不可响应并获得归刃，归刃选层可取消或结算', async () => {
        p.addMark('feixue_cuihankushuang',3,false);
        await step(lib.skill.feixue_shuangtian.precontent,0);
        const trigger={directHit:[]};
        await step(lib.skill.feixue_shuangtian_useCard.content,0,{},trigger);
        assert(trigger.directHit.length===4 && p.hasSkill('feixue_guiren'),'霜天后未获得归刃');
        assert(p.countMark('feixue_duanxueguiren')===1 && !p.hasSkill('feixue_shuangtian'),'归刃资源或技能错误');
        const content=lib.skill.feixue_guiren.content;
        const choose=p.chooseControl;
        let controls;
        p.chooseControl=(...args)=>{ controls=args; return {set(){return this;}}; };
        try { await step(content,0); } finally {p.chooseControl=choose;}
        assert(controls[0].join(',')==='0,1' && controls[1]==='cancel2','选层不完整');
        await step(content,1,{_result:{control:'cancel2'}});
        assert(p.name==='feixue_yuqiu' && p.countMark('feixue_duanxueguiren')===1,'取消消耗了资源');
        const damage=[];
        const previous=game.players.slice(1).map(target=>target.damage);
        game.players.slice(1).forEach(target=>target.damage=(n,nature)=>damage.push([n,nature]));
        try {await step(content,1,{_result:{control:'1'}});}
        finally {game.players.slice(1).forEach((target,i)=>target.damage=previous[i]);}
        assert(damage.length===3 && damage.every(([n,nature])=>n===2&&nature==='ice'),'冰伤害错误');
        assert(p.name==='feixue_changshi' && p.countMark('feixue_hanyi')===0 && p.countMark('feixue_duanxueguiren')===0,'未正确返回常世身');
        assert(!lib.skill.feixue_jianxin.filter({},p),'见心未重新锁定');
    });
} catch(e) { report.fatal=e.stack; }
delete report.running;
window.__feixueReport=report;
