// Applied to the printed migration output and the checked-in scene source.
import {fixMatchingScenes} from './fix-matching-scenes.mjs';
// Keep adaptations here so regenerating community scenes preserves the fixes.
export function fixScenes(source) {
 const replace = (from, to) => {
  if (!source.includes(from)) throw new Error(`Missing migration anchor: ${from.slice(0, 90)}`);
  source = source.replace(from, to);
 };
 replace('export function createScene(lib, game, ui, get, ai, _status, node, lifecycle) {',
  'export function createScene(lib, game, ui, get, ai, _status, node, lifecycle) {\n    const PIXI = lifecycle.pixi;');
 source = source.replaceAll('i["renderer"]["screen"]', 'i["screen"]');
 replace('UY = lifecycle.addPortrait(yt, Uf);', '// Portraits are requested only when their cards become visible.');
 const avatarStart = source.indexOf('                    let kM = new PIXI["Sprite"]();');
 const avatarEnd = source.indexOf('                    let ku = new PIXI["Sprite"]();', avatarStart);
 if (avatarStart < 0 || avatarEnd < 0) throw new Error("Missing character construction anchors");
 source = source.slice(0, avatarStart) + source.slice(avatarEnd);
 replace('                    let kt = new PIXI[(KX(0x28f, "2^^M"))]();', `                    ku.workshopBuild = () => {
                    const kM = lifecycle.portraits.sprite(kr);
                    Object.assign(kM, {width:lib.config.sprite_avatar.w, height:lib.config.sprite_avatar.h, x:lib.config.sprite_avatar.x, y:lib.config.sprite_avatar.y, name:"avatar"});
                    let kt = new PIXI[(KX(0x28f, "2^^M"))]();`);
 replace('ku["scale"]["set"](0.7 * G7, 0.7 * G8), ye["push"](ku);', 'ku["scale"]["set"](0.7 * G9);\n                    };\n                    ye["push"](ku);');
 replace('ye[0x0]["getChildByName"]("avatar")[kJ["propertyName"]]', '(ye[0]?.getChildByName("avatar")?.[kJ.propertyName] ?? lib.config.sprite_avatar[({width:"w",height:"h"})[kJ.propertyName] || kJ.propertyName])');
 const gridStart = source.indexOf('            function kb(kJ, kI) {');
 const gridEnd = source.indexOf('            function kK()', gridStart);
 if (gridStart < 0 || gridEnd < 0) throw new Error("Missing character grid anchors");
 source = source.slice(0, gridStart) + `            function kb(kJ, kI) {
                lifecycle.grid.show(kJ, kI, yn, G7, G8);
            }
` + source.slice(gridEnd);
 replace('new PIXI["Sprite"](yt["resources"][yB["randomGet"]()]["texture"])', 'lifecycle.portraits.sprite(yB["randomGet"]())');
 // The local player's portrait is already part of the small matchmaking atlas.
 replace('UA["texture"] = yx["resources"]["avatar_1"]["texture"];', '{ UA["texture"] = yx["resources"]["avatar_1"]["texture"]; UA.workshopPortraitLoaded = true; }');
 // This file is a screenshot of an unrelated achievements page, not a backdrop.
 replace('yL["add"]("shop_bg_2", lib["assetURL"] + "extension/如真似幻/images/shop_bg_2.jpg")',
  'yL["add"]("shop_bg_2", lib["assetURL"] + "extension/如真似幻/images/bg.jpg")');
 // Positions follow the viewport; button art retains its natural aspect ratio.
 replace('UU["scale"]["set"](rzshUs[Uf]["scale"] * G7, rzshUs[Uf]["scale"] * G8);',
  'UU["scale"]["set"](rzshUs[Uf]["scale"] * (/bg|kuang/.test(Uf) ? G7 : G9), rzshUs[Uf]["scale"] * (/bg|kuang/.test(Uf) ? G8 : G9));');
 // Enter pages only after their small UI atlases have initialized. Keep the
 // current page visible while resources load, including after a window resize.
 replace('yt["load"](yX)', 'yt["load"](() => { yX(); lifecycle.readyView("characters", yA, () => U3(yA)); })');
 replace('yL["load"](yC)', 'yL["load"](() => { yC(); lifecycle.readyView("recruit", ys, () => U3(ys)); })');
 replace('yH["load"](yh)', 'yH["load"](() => { yh(); lifecycle.readyView("profile", yQ, () => U3(yQ)); })');
 replace('yx["load"](U2)', 'yx["load"](() => { U2(); lifecycle.readyView("matching", U1, () => U3(U1)); })');
 replace('yx["load"](() =>', 'lifecycle.readyView("mode", Ga, () => Gl(Ga)); lifecycle.readyView("ranking", y6, () => U3(y6)); lifecycle.readyView("home", GK, () => GE());\n            yx["load"](() =>');
 // Replace navigation sites, not the callbacks registered above.
 source = source.replaceAll('                        U3(yA);', '                        lifecycle.showView("characters");');
 source = source.replaceAll('                        U3(ys);', '                        lifecycle.showView("recruit");');
 source = source.replaceAll('                        U3(yQ);', '                        lifecycle.showView("profile");');
 source = source.replaceAll('"shenfen", Gl(Ga)', '"shenfen", lifecycle.showView("mode")');
 source = source.replaceAll('"doudizhu", Gl(Ga)', '"doudizhu", lifecycle.showView("mode")');
 return finishScenes(source);
}

export function finishScenes(source) {
 source = source.replace('let ku = new PIXI["Sprite"]();', 'let ku = lifecycle.own(new PIXI["Sprite"]());');
 source = source.replace('function U7() { U3(U1); }', 'function U7() { lifecycle.showView("matching"); }');
 source = source.replace('                        U3(y6);', '                        lifecycle.showView("ranking");');
 // The startup timer must not pull an already opened/restored page back home.
 source = source.replace('                Gl(GK);\n                try {', '                lifecycle.initialHome(() => { Gl(GK);\n                try {');
 source = source.replace('                catch (f9) { }\n                try {', '                catch (f9) { } });\n                try {');
 source = source.replace('G2[bC(0x23f)] = GG["resources"][bC(0x234)]["texture"]', 'lifecycle.isHome && (G2[bC(0x23f)] = GG["resources"][bC(0x234)]["texture"])');
 return gateViews(source);
}

export function gateViews(source) {
 return repairLobbyAndPortraits(source.replace('catch (fG) { }\n            }, 0xbb8), Gb', 'catch (fG) { }\n                lifecycle.markHomeReady();\n            }, 0xbb8), Gb'));
}

export function repairLobbyAndPortraits(source) {
 source = source.replace("if (Yi[w7(0x2b9)](YT))", "if (Yi && Object.hasOwn(Yi, YT))");
 source = source.replace(/        function U9\(Uw, Uc\) \{[^\n]*\}/, `        function U9(Uw, Uc) {
            const targetX = rzshUs[Uw.name] ? rzshUs[Uw.name].x * G7 : (Uw.workshopHomeX ??= Uw.x);
            gsap.fromTo(Uw, {x:i.screen.width + Uw.width}, {x:targetX, duration:Uc, ease:"power2.out", overwrite:true});
        }`);
 source = source.replace('GM["addChild"](kY, km, kb, kK, kK)', 'GM["addChild"](kY, km, kb, kK), lifecycle.sessionButtons(GM, 0x39a * G7, 432 * G8, G9)');
 source = source.replaceAll('i["stage"]["children"]["forEach"]', 'i["stage"]["children"].slice()["forEach"]');
 source = source.replace('function Gl(UU) {\n            const K6 = K0;', 'function Gl(UU) {\n            if (GP !== null) { clearTimeout(GP); GP = null; }\n            if (UU === GK) window.isOnhide = false;\n            const K6 = K0;');
 source = source.replace('Object.assign(kM, {width:lib.config.sprite_avatar.w, height:lib.config.sprite_avatar.h, x:lib.config.sprite_avatar.x, y:lib.config.sprite_avatar.y, name:"avatar"});', 'kM.name = "avatar";');
 source = source.replace('ku["addChild"](kM);', 'ku["addChild"](kM); lifecycle.portraits.fit(kM, ku);');
 source = source.replace('function U7() { lifecycle.showView("matching"); }', 'function U7() { lifecycle.startGame(lib.config.mode, true); }');
 source = source.replace('function U8() { lifecycle.finish(lib.config.mode); }', 'function U8() { lifecycle.startGame(lib.config.mode); }');
 return fixMatchingScenes(source,'rzsh');
}
