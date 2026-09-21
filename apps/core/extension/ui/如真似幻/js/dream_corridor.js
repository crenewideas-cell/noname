// Migrated from 如真似幻 2.0.2. Original authors: 蒸、某个萌新、非凡欧德内里、文和.
// UI scenes and ranking logic retained; legacy game bootstrap is intentionally excluded.
export default function (lib, game, ui, get, ai, _status, PIXI = globalThis.PIXI) {
    const register = callback => callback(lib, game, ui, get, ai, _status);
    (function (g, B) { const BL = rzshB, z = g(); while (!![]) {
        try {
            const K = parseInt(BL(0xd7)) / 0x1 + -parseInt(BL(0x9a)) / 0x2 * (-parseInt(BL(0xbe)) / 0x3) + parseInt(BL(0x92)) / 0x4 * (-parseInt(BL(0xae)) / 0x5) + parseInt(BL(0xbc)) / 0x6 * (-parseInt(BL(0x101)) / 0x7) + parseInt(BL(0x9e)) / 0x8 * (parseInt(BL(0x8b)) / 0x9) + -parseInt(BL(0x109)) / 0xa * (-parseInt(BL(0xb1)) / 0xb) + -parseInt(BL(0xe8)) / 0xc;
            if (K === B)
                break;
            else
                z["push"](z["shift"]());
        }
        catch (p) {
            z["push"](z["shift"]());
        }
    } }(rzshg, 0x5cd5a), register(function (g, B, z, K, p, Z) { ; window["dzxy_mzhl"] = function () { const BF = rzshB; let f = z["create"]["div"](".dz-bigBg2", document[BF(0x112)]); f[BF(0xdb)]["zIndex"] = "9"; let X = Math["max"](window[BF(0xc0)] * (B["documentZoom"] ? B["documentZoom"] : 0x1), 0x1), a, y, T; const W = {}; W["resizeTo"] = document[BF(0x112)], W["resolution"] = X, W[BF(0xec)] = 0x0, W["autoDensity"] = !![], a = new PIXI["Application"](W), f["appendChild"](a["view"]), a["view"]["id"] = "dzxy", a["view"]["style"]["position"] = "absolute", a[BF(0xb8)]["style"]["left"] = "0", a["view"]["style"]["top"] = "0", a["view"]["style"]["zIndex"] = "-1"; const D = {}; D["resizeTo"] = document["body"], D["resolution"] = X, D["backgroundAlpha"] = 0x0, D["autoDensity"] = !![], y = new PIXI["Application"](D), f["appendChild"](y["view"]), y[BF(0xb8)]["id"] = "dzxy_front", y[BF(0xb8)]["style"]["position"] = BF(0xac), y["view"]["style"]["left"] = "0", y["view"][BF(0xdb)]["top"] = "0", y["view"]["style"]["zIndex"] = "20", y["view"]["style"]["pointerEvents"] = "none"; const x = {}; x["url"] = g[BF(0x8f)] + "extension/如真似幻/audio/sgs/Label.mp3", x["volume"] = g["config"]["volumn_audio"] / 0x8, PIXI["sound"]["add"](BF(0xcb), x); const o = {}; o["url"] = g["assetURL"] + "extension/如真似幻/audio/sgs/TinyButton.mp3", o["volume"] = g["config"][BF(0xad)] / 0x8, PIXI["sound"][BF(0x8a)](BF(0xc5), o); const c = {}; c["url"] = g["assetURL"] + "extension/如真似幻/audio/sgs/MidButton.mp3", c["volume"] = g["config"]["volumn_audio"] / 0x8, PIXI["sound"]["add"]("MidButton", c); let E, q, u, R, n = ![], O = z["create"]["div"](BF(0x98), f); z["create"]["div"](BF(0xa6), O), z[BF(0xb2)]["div"](".dz-yuanbaojia.mzhl", BF(0x10e), f), z[BF(0xb2)]["div"](".pub-btn-qmark", f, () => { const BU = BF; PIXI[BU(0xa2)]["play"]("TinyButton"), F["show"](), I(); }); let L = z["create"]["div"](".dz-returnBtn", f, () => { const BG = BF; PIXI["sound"]["play"]("MidButton"), PIXI["utils"][BG(0xc9)](); T && (T["destroy"](), T = null); y && (y["destroy"](), y = null); a && (a["destroy"](), a = null); f["remove"](), void 0; if (window["inSplash"]) {
        if (z["window"])
            z["window"]["remove"]();
        delete z[BG(0xba)];
        if (z["arena"])
            z["arena"]["remove"]();
        delete z["arena"];
    } }); L["style"]["zIndex"] = "10"; const F = z["create"]["div"](".stat-bg", f), U = z[BF(0xb2)]["div"](BF(0x100), F); U["innerHTML"] = "x", U["listen"](() => { F["hide"](); }); const G = z["create"][BF(0x10b)](".stat-text", F); F["hide"](); const I = () => { const BI = BF; let gC = 0x0; for (let ga in g2["count"]) {
        gC += g2[BI(0x107)][ga];
    } let gt = "  累计抽取" + gC + "次\n\n", gf = []; for (let gy in g2["items"]) {
        gf["push"](g2["items"][gy]);
    } gf["sort"]((gT, gW) => { let gD = gT["weight"] || 0xbb8, gx = gW["weight"] || 0xbb8; return gD - gx; }); let gX = [gt]; for (let gT of gf) {
        gX["push"](gT["name"] + " --- " + gT["count"]);
    } G["innerText"] = gX["join"]("\n"); }; let V, g0 = ![]; const g1 = {}; g1["shadeList"] = {}, g1["exList"] = {}, g1["shadeNumber"] = {}, g1["routineItem"] = {}, g1[BF(0x107)] = {}, g1["items"] = {}; let g2 = g1; const g3 = {}; g3["id"] = "620046", g3[BF(0x107)] = 0x2, g3["name"] = "菜篮子", g3["weight"] = 9.495; const g4 = {}; g4["id"] = BF(0xa8), g4["count"] = 0x32, g4["name"] = "欢乐豆", g4["weight"] = 0x5; const g5 = {}; g5["id"] = BF(0x10a), g5["count"] = 0x2, g5[BF(0xdd)] = "点将卡", g5["weight"] = 0xf; const g6 = {}; g6["id"] = "600007", g6["count"] = 0x2, g6["name"] = BF(0xfa), g6["weight"] = 0x14; const g7 = {}; g7["id"] = BF(0xe9), g7[BF(0x107)] = 0x2, g7["name"] = "手气卡", g7[BF(0xe3)] = 0x14; const g8 = {}; g8["id"] = "620039", g8["count"] = 0x1, g8["name"] = "进阶丹", g8["weight"] = 0xa; const g9 = {}; g9["id"] = BF(0xe5), g9["count"] = 0x1, g9["name"] = "雁翎甲", g9["weight"] = 0xa; const gg = {}; gg["id"] = "600008", gg[BF(0x107)] = 0x1, gg["name"] = BF(0xe7), gg["weight"] = 0x6; const gB = {}; gB["id"] = "620149", gB["count"] = 0x1, gB["name"] = BF(0xd0), gB["weight"] = 0x4; const gz = {}; gz["id"] = "620150", gz["count"] = 0x1, gz["name"] = BF(0xfd), gz["weight"] = 0.5, gz[BF(0xed)] = !![]; const gK = {}; gK["id"] = "620150", gK["count"] = 0x42, gK[BF(0xdd)] = "史诗宝珠", gK[BF(0xe3)] = 0.005, gK["gaoji"] = !![]; let gp = [g3, g4, g5, g6, g7, g8, g9, gg, gB, gz, gK]; const gZ = {}; gZ["id"] = "600012", gZ["count"] = 0x64, gZ["name"] = "将魂"; const gH = {}; gH["id"] = "20003", gH["count"] = 0x29a, gH["name"] = "欢乐豆"; const gP = {}; gP["id"] = BF(0xd5), gP["count"] = 0x1, gP["name"] = "一堆银币"; const gk = {}; gk["id"] = BF(0xc4), gk["count"] = 0x3e8, gk["name"] = "雁翎"; const gJ = {}; gJ["id"] = "600003", gJ["count"] = 0x19, gJ["name"] = "手气卡"; const gs = {}; gs["id"] = BF(0x9d), gs["count"] = 0x4, gs["name"] = BF(0xe1); const gv = {}; gv["id"] = "600020", gv["count"] = 0x1, gv["name"] = "雁翎甲"; const gw = {}; gw["id"] = "600008", gw["count"] = 0x1, gw["name"] = "招募令"; const ge = {}; ge["id"] = BF(0xdf), ge["count"] = 0x1, ge["name"] = BF(0xd0); const gS = {}; gS["id"] = "600002", gS["count"] = 0x1, gS["name"] = "双倍经验卡"; let gN = [gZ, gH, gP, gk, gJ, gs, gv, gw, ge, gS]; function gr(gC) { const BV = BF; for (let gf = gC["length"] - 0x1; gf > 0x0; gf--) {
        var gt = Math[BV(0xce)](Math["random"]() * gf + 0x1);
        [gC[gf], gC[gt]] = [gC[gt], gC[gf]];
    } return gC; } gp = gm(gp); if (!g[BF(0xe6)]["extension_如真似幻_dreamCorridor"])
        B["saveExtensionConfig"]("如真似幻", "dreamCorridor", {}); if (!g[BF(0xe6)]["extension_如真似幻_dreamCorridor"]["minimum"])
        g["config"]["extension_如真似幻_dreamCorridor"]["minimum"] = {}; if (!g["config"][BF(0xf0)]["maximum"])
        g["config"]["extension_如真似幻_dreamCorridor"]["maximum"] = {}; let gM = z["create"]["div"](BF(0xde), f); for (let gC in dzxy_mzhl_dynamic) {
        for (let gt in dzxy_mzhl_dynamic[gC]) {
            if (dzxy_mzhl_dynamic[gC][gt]["mzhl"] && dzxy_mzhl_dynamic[gC][gt]["mzhl"]["hidden"])
                continue;
            let gf = z["create"]["div"](".mzhl-skin-btn", gM);
            gf["charID"] = gC, gf["charName"] = g["translate"][gC], gf["skinName"] = gt, gf[BF(0x10f)] = JSON["parse"](JSON["stringify"](dzxy_mzhl_dynamic[gC][gt])), gf["spine_bg"] = JSON[BF(0xf7)](JSON[BF(0x102)](dzxy_mzhl_dynamic[gC][gt]["beijing"])), a["loader"]["add"](gf["charID"] + "-" + gf["skinName"] + "-XingXiang", g["assetURL"] + gf["spine"]["name"] + ".skel"), a["loader"]["add"](gf["charID"] + "-" + gf["skinName"] + "-BeiJing", g["assetURL"] + gf[BF(0xd6)]["name"] + ".skel");
            if (!g2["shadeNumber"][gf["charID"] + "-" + gf["skinName"]] || !g2[BF(0xa1)][gf[BF(0xf6)] + "-" + gf["skinName"]]) {
                g2["shadeNumber"][gf[BF(0xf6)] + "-" + gf["skinName"]] = [], g2["routineItem"][gf["charID"] + "-" + gf["skinName"]] = gN;
                for (var gb = 0x0; gb < 0x19; gb++) {
                    g2["shadeNumber"][gf["charID"] + "-" + gf[BF(0xb6)]][gb] = Math["floor"](Math["random"]() * 0x64 + 0x1);
                }
                gr(g2["routineItem"][gf["charID"] + "-" + gf["skinName"]]);
            }
            if (!g2["count"][gf[BF(0xf6)] + "-" + gf["skinName"]])
                g2["count"][gf["charID"] + "-" + gf[BF(0xb6)]] = 0x0;
            if (!g["config"]["extension_如真似幻_dreamCorridor"][BF(0xd8)][gf["charID"] + "-" + gf[BF(0xb6)]])
                g["config"]["extension_如真似幻_dreamCorridor"]["minimum"][gf[BF(0xf6)] + "-" + gf["skinName"]] = "";
            if (!g["config"]["extension_如真似幻_dreamCorridor"][BF(0xf1)][gf["charID"] + "-" + gf["skinName"]])
                g["config"]["extension_如真似幻_dreamCorridor"]["maximum"][gf["charID"] + "-" + gf["skinName"]] = "";
            if (dzxy_mzhl_dynamic[gC][gt]["mzhl"]) {
                gf[BF(0x90)] = dzxy_mzhl_dynamic[gC][gt]["mzhl"]["deadline"], gf["bundled"] = dzxy_mzhl_dynamic[gC][gt]["mzhl"]["bundled"];
                if (dzxy_mzhl_dynamic[gC][gt]["mzhl"]["变身"]) {
                    let gX = dzxy_mzhl_dynamic[gC][gt]["mzhl"]["变身"]["split"]("/");
                    if (gX["length"] != 0x2)
                        alert("检测到<" + gC + gt + ">皮肤变身参数错误");
                    else {
                        if ("chfZi" !== "aXzjX") {
                            let ga = gX[0x0], gy = gX[0x1];
                            gf["charID2"] = ga, gf["charName2"] = g["translate"][ga], gf["skinName2"] = gy, gf["spine2"] = JSON[BF(0xf7)](JSON["stringify"](dzxy_mzhl_dynamic[ga][gy])), gf[BF(0xa7)] = JSON["parse"](JSON["stringify"](dzxy_mzhl_dynamic[ga][gy][BF(0x8e)])), a["loader"][BF(0x8a)](gf["charID2"] + "-" + gf["skinName2"] + "-XingXiang", g["assetURL"] + gf["spine2"]["name"] + ".skel"), a[BF(0xcd)]["add"](gf["charID2"] + "-" + gf["skinName2"] + "-BeiJing", g["assetURL"] + gf["spine2_bg"]["name"] + ".skel");
                        }
                        else
                            x["destroy"](), o = null;
                    }
                }
            }
            gf["innerHTML"] = gf["skinName"], gf["addEventListener"]("click", gT => { const z0 = BF; if (g0 || n)
                return; PIXI["sound"]["play"](z0(0xcb)), clearInterval(V), gT["stopPropagation"](); let gW = f["querySelector"](".mzhl-skin-btn.active"); if (gW)
                gW["classList"]["remove"]("active"); gf["classList"]["add"]("active"), gQ(gf); });
        }
    } (function () { let gT = f["querySelectorAll"](".mzhl-skin-btn"); if (gT["length"] == 0x0)
        return; let gW = f["querySelector"](".mzhl-skin-btn.active"); if (gW)
        gW["classList"]["remove"]("active"); gT[0x0]["classList"]["add"]("active"), gQ(gT[0x0]); }()); function gA(gT, gW, gD, gx, go) { const z1 = BF; let gc = z["create"]["div"](".icon-box", gT); gc["bg"] = z["create"][z1(0x10b)](".icon-bg", gc); if (gD)
        gc["name"] = z["create"]["div"](z1(0xc3), gD, gc["bg"]); gc["Img"] = z["create"]["div"](".icon-img", gc), gc["Img"][z1(0x91)]("extension/皮肤切换/images/cangZhenGe/items/" + gW + z1(0xeb)); if (gx)
        gc["count"] = z["create"]["div"](".icon-num", "X" + String(gx), gc["bg"]); if (go)
        gc["Img"]["setBackgroundImage"](go); return gc[z1(0xc8)] = z[z1(0xb2)]["div"](".icon-black", gc), gc["gou"] = z["create"]["div"](".icon-gou", gc), gc; } ; function gi(gT, gW) { let gD = z["create"]["div"](gW == ![] ? ".dz-bigBgx" : ".dz-bigBg", gT ? gT : document["body"]); return gD["addEventListener"]("click", gx => { const z2 = rzshB; gx["stopPropagation"](), gD[z2(0xf5)](); }), gD; } ; function gQ(gT) { const z3 = BF; let gW = ![]; n = !![], PIXI["utils"]["clearTextureCache"](); let gD = document["body"]["querySelector"]("#mzhl"); gD && (T && (T["destroy"](), T = null), gD["remove"](), void 0); let gx = f["querySelector"](z3(0x96)); gx && (gx["remove"](), void 0), u && (u[z3(0xff)](), u = null), R && (R["destroy"](), R = null), E && (E["destroy"](), E = null), q && (q["destroy"](), q = null), a["loader"][z3(0xcc)](() => { const z4 = z3; let go = z["create"]["div"](z4(0x96), f); E = new PIXI["spine"]["Spine"](a["loader"]["resources"][gT["charID"] + "-" + gT[z4(0xb6)] + "-XingXiang"]["spineData"]), E["name"] = "skin_chr", E["state"]["setAnimation"](0x0, "ChuChang", ![]), E["interactive"] = ![], E["state"]["addListener"]({ "complete": () => { E["state"]["setAnimation"](0x0, "DaiJi", !![]), E["interactive"] = !![]; } }), E["on"]("pointerdown", () => { const z5 = z4; B["playAudio"]("../" + gT["spine"]["name"] + z5(0x9c)), E[z5(0xd3)]["setAnimation"](0x0, "GongJi", ![]), E["state"][z5(0xa5)]({ "complete": () => { const z6 = z5; E["state"][z6(0xd1)](0x0, "DaiJi", !![]); } }); }), E["scale"]["set"](gT["spine"]["scale"]), E[z4(0xe2)]["set"](gT["spine"]["x"][0x1] * a["screen"][z4(0xf3)] + gT[z4(0x10f)]["x"][0x0], gT[z4(0x10f)]["y"][0x1] * a["screen"]["height"] + gT["spine"]["y"][0x0]), q = new PIXI["spine"]["Spine"](a["loader"]["resources"][gT["charID"] + "-" + gT["skinName"] + "-BeiJing"]["spineData"]), q["name"] = "skin_bg", q[z4(0xd3)]["setAnimation"](0x0, "ChuChang", ![]), q["state"]["addListener"]({ "complete": () => { const z7 = z4; q[z7(0xd3)]["setAnimation"](0x0, "BeiJing", !![]); } }), E["scale"][z4(0xf4)](gT["spine_bg"]["scale"]), q["position"]["set"](gT["spine_bg"]["x"][0x1] * a["screen"]["width"] + gT[z4(0xd6)]["x"][0x0], gT["spine_bg"]["y"][0x1] * a["screen"]["height"] + gT["spine_bg"]["y"][0x0]), a[z4(0xfb)]["addChild"](q, E); gT["spine2"] && gT["spine2_bg"] && (u = new PIXI["spine"][(z4(0x97))](a["loader"]["resources"][gT["charID2"] + "-" + gT["skinName2"] + "-XingXiang"]["spineData"]), u["name"] = "skin_chr2", u["state"]["setAnimation"](0x0, "ChuChang", ![]), u["interactive"] = ![], u["state"]["addListener"]({ "complete": () => { u["state"]["setAnimation"](0x0, "DaiJi", !![]), u["interactive"] = !![]; } }), u["on"]("pointerdown", () => { const z8 = z4; B["playAudio"]("../" + gT[z8(0x108)]["name"] + ".mp3"), u[z8(0xd3)]["setAnimation"](0x0, "GongJi", ![]), u["state"]["addListener"]({ "complete": () => { u["state"]["setAnimation"](0x0, "DaiJi", !![]); } }); }), u["scale"][z4(0xf4)](gT["spine2"]["scale"]), u["position"]["set"](gT["spine2"]["x"][0x1] * a["screen"]["width"] + gT[z4(0x108)]["x"][0x0], gT[z4(0x108)]["y"][0x1] * a["screen"]["height"] + gT["spine2"]["y"][0x0]), R = new PIXI["spine"]["Spine"](a["loader"]["resources"][gT["charID2"] + "-" + gT["skinName2"] + "-BeiJing"]["spineData"]), R["name"] = "skin_bg2", R["state"]["setAnimation"](0x0, "ChuChang", ![]), R["state"]["addListener"]({ "complete": () => { const z9 = z4; R["state"][z9(0xd1)](0x0, "BeiJing", !![]); } }), u["scale"]["set"](gT[z4(0xa7)]["scale"]), R["position"]["set"](gT["spine2_bg"]["x"][0x1] * a[z4(0xc1)]["width"] + gT["spine2_bg"]["x"][0x0], gT["spine2_bg"]["y"][0x1] * a["screen"]["height"] + gT["spine2_bg"]["y"][0x0])); let gc = z["create"][z4(0x10b)](".dz-cid-bg-box", go, B4 => { const zg = z4; B4[zg(0xda)](); }), gE = z["create"]["div"](".dz-cid-bg-fram", gc), gq = "#e1c43c"; gE[z4(0xb5)] = z["create"][z4(0x10b)](".mzhl-remainder", gc), gE["text"] = z["create"]["div"](".title-text", gE), gE["text"][z4(0xcf)] = "每次回忆后获得<span style=\"color:" + gq + ";\">随机奖励</span>及<span style=\"color:" + gq + ";\">随机记忆拼图,记忆拼图</span>连线后将<span style=\"color:" + gq + z4(0xa0); let gu = z[z4(0xb2)]["div"](".dz-cid-bg-woody", gE); z[z4(0xb2)][z4(0x10b)](".dz-cid-bg-charimg", gu)["setBackgroundImage"](gT["spine"]["name"]["substring"](0x0, gT["spine"]["name"]["lastIndexOf"]("/")) + "/skin2.jpg"), z["create"]["div"](z4(0xf2), gu); let gR = z["create"]["div"](".dz-cid-bg-shades", gu); for (let B4 = 0x0, B5 = 0x0; B4 < 0x5; B4++) {
        for (let B6 = 0x0; B6 < 0x5; B6++) {
            let B7 = z["create"]["div"](".dz-cid-bg-shade", gR);
            B7["text"] = z["create"]["div"](".dz-shade-text", B7), B7["text"][z4(0xcf)] = g2["shadeNumber"][gT[z4(0xf6)] + "-" + gT["skinName"]][B4 * 0x5 + B6], B7["pos"] = [B4, B6], B7["index"] = B5, B5++;
        }
    } const gj = {}; gj["resizeTo"] = gc, gj["resolution"] = X, gj["backgroundAlpha"] = 0x0, gj["autoDensity"] = !![], T = new PIXI[(z4(0xb9))](gj), gc["appendChild"](T["view"]), T["view"]["id"] = "mzhl", T["view"]["style"]["position"] = "absolute", T["view"]["style"]["left"] = "0", T["view"]["style"][z4(0xb4)] = "0", globalThis["__PIXI_APP__"] = T; let gn = z["create"][z4(0x10b)](".cid-gn-box", go); z["create"]["div"](".cid-title-reward", go); let gO = z["create"]["div"](".cid-bg-wenzi", go); gO["innerHTML"] = "<img src=" + g["assetURL"] + "extension/如真似幻/images/dreamCorridor/cid_bg_wenzi1.png style=width:8px;height:8px;position:relative;margin-right:4px;margin-bottom:1px;/>" + z4(0x10d) + ("<img src=" + g["assetURL"] + "extension/十周年UI/assets/image/rarity_legend.png style=width:40px;height:42.8px;margin-top:-40px;bottom:-20px;position:relative;margin-left:-4px;margin-right:-4px;/>") + "皮肤【" + gT["skinName"] + "*" + gT["charName"] + "】" + ("<img src=" + g["assetURL"] + "extension/如真似幻/images/dreamCorridor/cid_bg_wenzi3.png style=width:8px;height:8px;position:relative;margin-left:-2px;margin-bottom:1px;/>"); let gL = z["create"]["div"](".skinbook_detils_btn", gn); gL["addEventListener"]("click", B8 => { const zB = z4; B8["stopPropagation"](), g[zB(0xe6)][zB(0x9b)] && ("YgFQx" !== zB(0xc6) ? D["state"]["setAnimation"](0x0, zB(0xbf), !![]) : (z["window"] = z["create"]["div"](zB(0xd4)), z[zB(0xb0)]["qycharactercard"](sprite["name"]))); }); let gF; gT["spine2"] && (gF = z["create"]["div"](".cid-btn-qh", gn), gF["addEventListener"]("click", B8 => { const zz = z4; B8["stopPropagation"](); if (a["stage"]["getChildByName"]("skin_chr") || a[zz(0xfb)]["getChildByName"]("skin_bg"))
        a[zz(0xfb)]["removeChild"](E, q), a["stage"]["addChild"](R, u), u["state"][zz(0xd1)](0x0, "ChuChang", ![]), R[zz(0xd3)]["setAnimation"](0x0, "ChuChang", ![]), u["interactive"] = ![], u["state"]["addListener"]({ "complete": () => { const zK = zz; u["state"]["setAnimation"](0x0, zK(0xbf), !![]), u["interactive"] = !![]; } }), u["on"]("pointerdown", () => { B["playAudio"]("../" + gT["spine2"]["name"] + ".mp3"), u["state"]["setAnimation"](0x0, "GongJi", ![]), u["state"]["addListener"]({ "complete": () => { u["state"]["setAnimation"](0x0, "DaiJi", !![]); } }); }), R["state"][zz(0xa5)]({ "complete": () => { R["state"]["setAnimation"](0x0, "BeiJing", !![]); } });
    else
        (a["stage"]["getChildByName"]("skin_chr2") || a["stage"]["getChildByName"]("skin_bg2")) && (a["stage"]["removeChild"](u, R), a["stage"]["addChild"](q, E), E["state"]["setAnimation"](0x0, "ChuChang", ![]), q["state"]["setAnimation"](0x0, "ChuChang", ![]), E[zz(0xd3)]["addListener"]({ "complete": () => { E["state"]["setAnimation"](0x0, "DaiJi", !![]), E["interactive"] = !![], E["on"]("pointerdown", () => { const zp = rzshB; B["playAudio"]("../" + gT["spine"]["name"] + zp(0x9c)), E["state"]["setAnimation"](0x0, zp(0xe0), ![]), E["state"]["addListener"]({ "complete": () => { const zZ = zp; E["state"][zZ(0xd1)](0x0, "DaiJi", !![]); } }); }); } }), q["state"]["addListener"]({ "complete": () => { q["state"]["setAnimation"](0x0, "BeiJing", !![]); } })); })); let gU = z["create"]["div"](".cid-btn-ym", gn); gU["addEventListener"]("click", B8 => { const zH = z4; B8["stopPropagation"](); let B9 = gi(go), Bg = z["create"]["div"](".cid-bg-ym", B9), BB = z["create"]["div"](".cid-bg-ym-title", Bg); BB["innerHTML"] = "梦圆榜"; let Bz = z["create"]["div"](".cid-bg-ym-time", Bg); Bz["innerHTML"] = "最少次数：" + (g["config"]["extension_如真似幻_dreamCorridor"]["minimum"][gT["charID"] + "-" + gT["skinName"]] ? g["config"]["extension_如真似幻_dreamCorridor"]["minimum"][gT[zH(0xf6)] + "-" + gT["skinName"]] : ""); let BK = z["create"]["div"](".cid-bg-ym-time", Bg); BK["style"]["top"] = "52%", BK[zH(0xcf)] = "最多次数：" + (g["config"]["extension_如真似幻_dreamCorridor"][zH(0xf1)][gT["charID"] + "-" + gT["skinName"]] ? g["config"]["extension_如真似幻_dreamCorridor"]["maximum"][gT["charID"] + "-" + gT["skinName"]] : ""); let Bp = z["create"]["div"](".cid-bg-ym-title", Bg); Bp["innerHTML"] = "当前次数：" + g2["count"][gT[zH(0xf6)] + "-" + gT["skinName"]], Bp[zH(0xdb)]["fontSize"] = "18px", Bp["style"]["top"] = "72.5%"; }); let gG = z["create"]["div"](".dz-cid-btn-recall", gE); gG["style"]["left"] = "9.7%"; let gI = z[z4(0xb2)]["div"](".dz-cid-btn-recall", gE); gI["style"]["left"] = "51.4%", gI["setBackgroundImage"]("extension/如真似幻/images/dreamCorridor/huiyi_10.png"); if (gT["deadline"]) {
        var gV = new Date(gT["deadline"]);
        function B3() { var B8 = new Date(), B9 = gV - B8; if (B9 <= 0x0) {
            clearInterval(V);
            return;
        } var Bg = Math["floor"](B9 / (0x3e8 * 0x3c * 0x3c * 0x18)), BB = Math["floor"](B9 % (0x3e8 * 0x3c * 0x3c * 0x18) / (0x3e8 * 0x3c * 0x3c)), Bz = Math["floor"](B9 % (0x3e8 * 0x3c * 0x3c) / (0x3e8 * 0x3c)), BK = Math["floor"](B9 % (0x3e8 * 0x3c) / 0x3e8); gE["remainder"]["innerHTML"] = "<span style='color:" + gq + ";'>活动剩余时间: " + Bg + "天" + BB + "小时" + Bz + "分钟" + BK + "秒<span>"; }
        B3(), V = setInterval(B3, 0x3e8);
    } let B0 = gT["spine"]["name"]["substring"](gT["spine"]["name"]["indexOf"]("extension/十周年UI/assets/dynamic/") + "extension/十周年UI/assets/dynamic/"["length"], gT["spine"][z4(0xdd)]["lastIndexOf"]("/")), B1 = "extension/如真似幻/spine/dreamCorridor/" + B0; g["device"] == "ios" || g["device"] == "android" ? window["resolveLocalFileSystemURL"](g["assetURL"] + B1, () => { const zP = z4; B0 = gT["spine"]["name"][zP(0x9f)](gT[zP(0x10f)]["name"]["indexOf"]("extension/十周年UI/assets/dynamic/") + "extension/十周年UI/assets/dynamic/"["length"], gT[zP(0x10f)]["name"]["lastIndexOf"]("/")); }, () => { const zk = z4; B0 = zk(0xc2); }) : B["getFileList"](B1, () => B0 = "init"); T["loader"]["add"]("Ss_MZHL_ChouJiang_DanGe", g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/" + B0 + "/Ss_MZHL_ChouJiang_DanGe.skel")[z4(0x8a)]("Ss_MZHL_ChouJiang_HengXian", g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/" + B0 + "/Ss_MZHL_ChouJiang_HengXian.skel")["add"]("Ss_MZHL_ChouJiang_ShuXian", g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/" + B0 + "/Ss_MZHL_ChouJiang_ShuXian.skel")["add"]("Ss_MZHL_ChouJiang_XieXian1", g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/" + B0 + "/Ss_MZHL_ChouJiang_XieXian1.skel")["add"]("Ss_MZHL_ChouJiang_XieXian2", g["assetURL"] + z4(0x111) + B0 + "/Ss_MZHL_ChouJiang_XieXian2.skel")["add"]("Ss_MZHL_ChouJiang_JiYiXunDe", g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/" + B0 + "/Ss_MZHL_ChouJiang_JiYiXunDe.skel")["add"]("Ss_MZHL_ChouJiang_MengYuan", g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/" + B0 + "/Ss_MZHL_ChouJiang_MengYuan.skel")["add"](z4(0xbd), g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/Ss_MZHL_ChouJiang_DaoJu.skel")["add"]("gongxihuode_daojuchuxian", g["assetURL"] + z4(0xa4))["add"](z4(0x8c), g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/gongxihuode_gaojidaoju.skel")["add"]("gongxihuode_lizi", g["assetURL"] + "extension/如真似幻/spine/dreamCorridor/gongxihuode_lizi.skel"); let B2 = [{ "id": gT["charID"] + gT["skinName"], "count": 0x1, "name": gT["skinName"] + "*" + gT["charName"] + "(动)", "gaoji": !![], "path": gT["spine"][z4(0xdd)]["substring"](0x0, gT[z4(0x10f)]["name"]["lastIndexOf"]("/")) + z4(0xbb) }]; T[z4(0xcd)]["load"](() => { const zJ = z4; n = ![]; let B8 = z["create"]["div"](".dz-icons-right", gu), B9 = g2["routineItem"][gT["charID"] + "-" + gT["skinName"]]["slice"](0x0, 0x5); const Bg = {}; Bg["id"] = "620150", Bg["count"] = 0x1, Bg[zJ(0xdd)] = "史诗宝珠", Bg["gaoji"] = !![], B9[zJ(0xfc)](Bg); for (let Bs of B9) {
        let Bv = gA(B8, Bs["id"], null, Bs["count"] <= 0x1 ? 0x0 : Bs[zJ(0x107)]);
        Bv[zJ(0xf9)] = Bs;
    } let BB = z["create"]["div"](".dz-icons-bottom", gu), Bz = g2["routineItem"][gT[zJ(0xf6)] + "-" + gT["skinName"]]["slice"](0x5); Bz["push"]({ "id": gT["bundled"], "count": 0x1, "name": gT["bundled"], "gaoji": !![], "path": gT["spine"][zJ(0xdd)]["substring"](0x0, gT["spine"]["name"]["lastIndexOf"]("/")) + "/bundled.jpg" }); for (let Bw of Bz) {
        let Be = gA(BB, Bw["id"], null, Bw[zJ(0x107)] <= 0x1 ? 0x0 : Bw["count"], Bw["path"]);
        Be["daoju"] = Bw;
    } if (!g2["shadeList"][gT["charID"] + "-" + gT["skinName"]])
        g2["shadeList"][gT["charID"] + "-" + gT["skinName"]] = []; let BK = g2["shadeList"][gT["charID"] + "-" + gT["skinName"]], Bp = gR["querySelectorAll"](".dz-cid-bg-shade"); BK["forEach"](BS => Bp[BS][zJ(0xe4)]()); if (!g2["exList"][gT["charID"] + "-" + gT["skinName"]])
        g2["exList"][gT["charID"] + "-" + gT["skinName"]] = []; let BZ = g2[zJ(0xf8)][gT[zJ(0xf6)] + "-" + gT["skinName"]], BH = gc["querySelectorAll"](".icon-box"); BZ[zJ(0xb7)](BS => BH[BS][zJ(0xdc)]["add"]("igou", "iblack")); for (var BP = 0x0; BP < 0x2; BP++) {
        let BS = new PIXI["spine"]["Spine"](T[zJ(0xcd)]["resources"]["Ss_MZHL_ChouJiang_DaoJu"]["spineData"]);
        BS["x"] = BP == 0x0 ? 0.1525 * T["screen"]["width"] : 0.8525 * T["screen"]["width"], BS["y"] = 0.7325 * T[zJ(0xc1)]["height"], BS["scale"]["set"](0.64), BS["state"]["setAnimation"](0x0, zJ(0x105), !![]), T["stage"]["addChild"](BS);
    } if (BK[zJ(0x93)] == 0x19)
        gW = !![]; if (gW) {
        let BN = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_MengYuan"]["spineData"]);
        BN["state"][zJ(0xd1)](0x0, "play", ![]), BN["state"]["time"] = BN["animationDuration"] * BN["animationSpeed"], BN["scale"]["set"](0.74), BN["position"]["set"](0.505 * T["screen"][zJ(0xf3)], 0.375 * T[zJ(0xc1)]["height"]), T["stage"]["addChild"](BN), gG["style"]["filter"] = "grayscale(100%)", gI["style"][zJ(0xfe)] = "grayscale(100%)";
    }
    else
        gG["addEventListener"](zJ(0xb0), Br => { Bk(0x1); }), gI["addEventListener"]("click", Br => { Bk(0xa); }); function Bk(Br) { const zs = zJ; if (g0 || gW)
        return; g0 = !![], g2["count"][gT["charID"] + "-" + gT["skinName"]] += Br, I(); let BM = gR["querySelectorAll"](".dz-cid-bg-shade"), Bb = [], BA = [], Bi = {}, BQ = gc["querySelectorAll"](".icon-box"), Bm = []; for (let BY = 0x0; BY < 0x19; BY++)
        Bm["push"](BY); for (let Bd = 0x0; Bd < Br; Bd++) {
        let BC = 0x0, Bt = Bm[zs(0xfe)](BD => !BK["includes"](BD));
        if (gh(BK["length"] + 0x1))
            BC = Bt["randomGet"]();
        else
            BC = BK["randomGet"]();
        let Bf = Math["random"]() * 0x64, BX;
        for (let BD of gp) {
            if (Bf > BD["weight"][0x0] && Bf < BD[zs(0xe3)][0x1]) {
                BX = Object["assign"]({}, BD);
                break;
            }
        }
        Bi = gl(Bi, BX);
        let Ba = [0.28, 0.39, 0.5, 0.6075, 0.715], By = [0.155, 0.2625, 0.3725, 0.48, 0.59], BT = Ba[BM[BC][zs(0x104)][0x1]], BW = By[BM[BC]["pos"][0x0]];
        setTimeout(() => { const zv = zs; let Bx = new PIXI[(zv(0x10f))]["Spine"](T[zv(0xcd)]["resources"]["Ss_MZHL_ChouJiang_DanGe"]["spineData"]); Bx["state"]["setAnimation"](0x0, "play", ![]); let Bo = 0.74; if (g["device"] == "ios" || g["device"] == "android") {
            if ("xzAHo" === "xzAHo")
                window["resolveLocalFileSystemURL"](g["assetURL"] + B1, () => { Bo = 0.74; }, () => { Bo = 0.64; });
            else {
                let BE = new gJ["spine"]["Spine"](gs[zv(0xcd)][zv(0xd9)]["gongxihuode_daojuchuxian"]["spineData"]);
                BE["scale"]["set"](0.64), BE["position"]["set"]((gv["getBoundingClientRect"]()[zv(0xd2)] + gw[zv(0xaf)]()[zv(0xf3)] / 0x2) * (ge["device"] == "ios" || gS["device"] == "android" ? 1.43 : 0x1), (gj["getBoundingClientRect"]()[zv(0xb4)] + Bg[zv(0xaf)]()["height"] / 0x2) * (a["device"] == "ios" || BW["device"] == "android" ? 1.43 : 0x1)), BE["state"]["setAnimation"](0x0, "play", ![]), T["stage"]["addChild"](BE);
                if (W["gaoji"]) {
                    let Bq = new L["spine"][(zv(0x97))](F["loader"]["resources"]["gongxihuode_gaojidaoju"]["spineData"]);
                    Bq["name"] = "icon_gaoji", Bq["scale"]["set"](0.64), Bq["position"]["set"]((U["getBoundingClientRect"]()["left"] + G["getBoundingClientRect"]()[zv(0xf3)] / 0x2) * (I["device"] == "ios" || V["device"] == "android" ? 1.43 : 0x1), (g0["getBoundingClientRect"]()["top"] + g1[zv(0xaf)]()["height"] / 0x2) * (g2["device"] == "ios" || g3[zv(0x99)] == "android" ? 1.43 : 0x1)), Bq[zv(0xd3)]["setAnimation"](0x0, "play", !![]), g4["stage"]["addChild"](Bq);
                }
            }
        }
        else
            B["getFileList"](B1, () => Bo = 0.64); Bx["scale"]["set"](Bo), Bx["position"][zv(0xf4)]((Bo == 0.64 ? BT : BT + 0.0075) * T["screen"][zv(0xf3)], BW * T["screen"]["height"]), T["stage"]["addChild"](Bx), B["playAudio"]("../extension/如真似幻/audio/sgs/bingo_danxiao.mp3"), BM[BC][zv(0xe4)](); }, Bd * 0x12c);
        if (!BK["includes"](BC)) {
            BK["add"](BC);
            let Bx = 0x0, Bo = 0x0, Bc = 0x0, BE = 0x0;
            for (let Bq of BK) {
                if (BM[Bq]["pos"][0x0] == BM[BC]["pos"][0x0])
                    Bx++;
                if (BM[Bq]["pos"][0x1] == BM[BC]["pos"][0x1])
                    Bo++;
                if (BM[Bq]["pos"][0x0] == BM[Bq]["pos"][0x1] && BM[BC]["pos"][0x0] == BM[BC]["pos"][0x1])
                    Bc++;
                if (BM[Bq]["pos"][0x0] + BM[Bq]["pos"][0x1] == 0x4 && BM[BC]["pos"][0x0] + BM[BC]["pos"][0x1] == 0x4)
                    BE++;
                Bx == 0x5 && (Bb["add"](["shade_hengxian", 0.505 * T["screen"]["width"], (BW + 0.005) * T["screen"]["height"]]), BA["add"](BQ[BM[BC][zs(0x104)][0x0]]), BZ["add"](BM[BC]["pos"][0x0])), Bo == 0x5 && (Bb["add"](["shade_shuxian", (BT + 0.0075) * T[zs(0xc1)][zs(0xf3)], 0.3725 * T["screen"]["height"]]), BA["add"](BQ[0xa - BM[BC]["pos"][0x1]]), BZ["add"](0xa - BM[BC][zs(0x104)][0x1])), Bc == 0x5 && (Bb[zs(0x8a)](["shade_xiexian1", 0.505 * T["screen"][zs(0xf3)], 0.375 * T["screen"]["height"]]), BA[zs(0x8a)](BQ[0x5]), BZ["add"](0x5)), BE == 0x5 && (Bb["add"](["shade_xiexian2", 0.505 * T["screen"]["width"], 0.375 * T["screen"]["height"]]), BA[zs(0x8a)](BQ[0xb]), BZ["add"](0xb));
            }
        }
    } BA["forEach"](Bu => { Bi = gl(Bi, Bu["daoju"]); }); let Bl = 0x0; for (let Bu = 0x0; Bu < Bb["length"]; Bu++) {
        Bl++, setTimeout(() => { const zw = zs; let BR = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_HengXian"]["spineData"]), Bj = new PIXI[(zw(0x10f))]["Spine"](T[zw(0xcd)]["resources"]["Ss_MZHL_ChouJiang_ShuXian"]["spineData"]), Bn = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_XieXian1"]["spineData"]), BO = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_XieXian2"]["spineData"]); BR["state"]["setAnimation"](0x0, zw(0x105), ![]), BR["scale"]["set"](0.74), Bj["state"]["setAnimation"](0x0, "play", ![]), Bj["scale"]["set"](0.74), Bn["state"]["setAnimation"](0x0, "play", ![]), Bn["scale"]["set"](0.74), BO[zw(0xd3)]["setAnimation"](0x0, "play", ![]), BO["scale"]["set"](0.74); switch (Bb[Bu][0x0]) {
            case "shade_hengxian":
                BR["position"]["set"](Bb[Bu][0x1], Bb[Bu][0x2]), T["stage"]["addChild"](BR);
                break;
            case "shade_shuxian":
                Bj["position"]["set"](Bb[Bu][0x1], Bb[Bu][0x2]), T["stage"]["addChild"](Bj);
                break;
            case "shade_xiexian1":
                Bn["position"]["set"](Bb[Bu][0x1], Bb[Bu][0x2]), T["stage"][zw(0x103)](Bn);
                break;
            case "shade_xiexian2":
                BO["position"]["set"](Bb[Bu][0x1], Bb[Bu][0x2]), T[zw(0xfb)]["addChild"](BO);
                break;
        } B["playAudio"]("../extension/如真似幻/audio/sgs/bingo_lianxiao.mp3"), BA[Bu]["classList"][zw(0x8a)]("igou", "iblack"); }, Br * 0x12c + Bl * 0x12c);
    } if (BK["length"] != 0x19) {
        if (Bl)
            setTimeout(() => { const ze = zs; let BR = new PIXI[(ze(0x10f))]["Spine"](T[ze(0xcd)]["resources"]["Ss_MZHL_ChouJiang_JiYiXunDe"]["spineData"]); BR[ze(0xd3)]["setAnimation"](0x0, "play1", ![]), BR["scale"][ze(0xf4)](0.74), BR["position"]["set"](0.505 * T["screen"]["width"], 0.375 * T["screen"]["height"]), T["stage"]["addChild"](BR), B["playAudio"]("../extension/如真似幻/audio/sgs/bingo_jiyixunde.mp3"); }, Br * 0x12c + (Bl + 0x2) * 0x12c);
        for (var Bh in Bi) {
            g2["items"] = gl(g2["items"], Bi[Bh]);
        }
        setTimeout(() => { I(), BJ(Bi); }, Br * 0x12c + (Bl ? (Bl + 0x5) * 0x12c : 0x12c));
    }
    else {
        B2["forEach"](BR => { Bi = gl(Bi, BR); });
        for (var Bh in Bi) {
            g2["items"] = gl(g2["items"], Bi[Bh]);
        }
        setTimeout(() => { const zS = zs; (g2[zS(0x107)][gT["charID"] + "-" + gT["skinName"]] <= g["config"]["extension_如真似幻_dreamCorridor"]["minimum"][gT["charID"] + "-" + gT["skinName"]] || g[zS(0xe6)]["extension_如真似幻_dreamCorridor"][zS(0xd8)][gT["charID"] + "-" + gT["skinName"]] == "") && (g[zS(0xe6)]["extension_如真似幻_dreamCorridor"]["minimum"][gT["charID"] + "-" + gT["skinName"]] = g2["count"][gT["charID"] + "-" + gT["skinName"]], B["saveExtensionConfig"]("如真似幻", "dreamCorridor", g["config"]["extension_如真似幻_dreamCorridor"])); if (g2["count"][gT[zS(0xf6)] + "-" + gT["skinName"]] >= g["config"][zS(0xf0)]["maximum"][gT["charID"] + "-" + gT["skinName"]] || g["config"]["extension_如真似幻_dreamCorridor"]["maximum"][gT["charID"] + "-" + gT["skinName"]] == "") {
            if ("fKXfC" === "zDjAT") {
                let Bn = new g4[(zS(0x10f))]["Spine"](gb["loader"]["resources"]["Ss_MZHL_ChouJiang_MengYuan"]["spineData"]);
                Bn["state"]["setAnimation"](0x0, zS(0x105), ![]), Bn["state"]["time"] = Bn["animationDuration"] * Bn["animationSpeed"], Bn["scale"]["set"](0.74), Bn[zS(0xe2)]["set"](0.505 * g5["screen"]["width"], 0.375 * g6["screen"]["height"]), g7["stage"]["addChild"](Bn), g8["style"]["filter"] = "grayscale(100%)", g9["style"]["filter"] = "grayscale(100%)";
            }
            else
                g["config"]["extension_如真似幻_dreamCorridor"]["maximum"][gT["charID"] + "-" + gT["skinName"]] = g2["count"][gT["charID"] + "-" + gT["skinName"]], B["saveExtensionConfig"]("如真似幻", "dreamCorridor", g[zS(0xe6)]["extension_如真似幻_dreamCorridor"]);
        } gW = !![], a["view"][zS(0xdb)]["zIndex"] = "7"; let BR = ![]; gG["style"]["filter"] = "grayscale(100%)", gI["style"]["filter"] = "grayscale(100%)"; if (a["stage"]["getChildByName"]("skin_chr") || a["stage"]["getChildByName"](zS(0xc7)))
            a["stage"]["addChild"](q, E), E["state"]["setAnimation"](0x0, "ChuChang", ![]), q["state"][zS(0xd1)](0x0, zS(0x10c), ![]), E["interactive"] = ![], q[zS(0x88)] = ![], E["state"]["addListener"]({ "complete": () => { const zN = zS; a["view"]["style"]["zIndex"] = "0", E["state"][zN(0xd1)](0x0, zN(0xbf), !![]), E["interactive"] = !![]; if (!BR) {
                    let Bn = new PIXI[(zN(0x10f))]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_JiYiXunDe"]["spineData"]);
                    Bn["state"]["setAnimation"](0x0, "play2", ![]), Bn["scale"][zN(0xf4)](0.64), Bn["position"]["set"](0.5 * y["screen"]["width"], 0.5 * y["screen"]["height"]), y["stage"][zN(0x103)](Bn), B["playAudio"]("../extension/如真似幻/audio/sgs/bingo_jiyixunde.mp3"), Bn["state"]["addListener"]({ "complete": () => { const zr = zN; let BO = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_MengYuan"]["spineData"]); BO["state"]["setAnimation"](0x0, "play", ![]), BO["scale"]["set"](0.74), BO["position"]["set"](0.505 * T["screen"]["width"], 0.375 * T["screen"]["height"]), T["stage"][zr(0x103)](BO), B["playAudio"]("../extension/如真似幻/audio/sgs/bingo_mengyuan.mp3"), BO["state"][zr(0xa5)]({ "complete": () => { I(), BJ(Bi), BR = !![]; } }); } });
                } } }), q["state"]["addListener"]({ "complete": () => { const zM = zS; q["state"][zM(0xd1)](0x0, "BeiJing", !![]); } });
        else
            (a["stage"][zS(0x8d)]("skin_chr2") || a["stage"]["getChildByName"](zS(0xa9))) && (a["stage"]["addChild"](R, u), u[zS(0xd3)]["setAnimation"](0x0, "ChuChang", ![]), R[zS(0xd3)]["setAnimation"](0x0, zS(0x10c), ![]), u[zS(0x88)] = ![], R[zS(0x88)] = ![], u["state"]["addListener"]({ "complete": () => { const zb = zS; a["view"]["style"]["zIndex"] = "0", u["state"]["setAnimation"](0x0, "DaiJi", !![]), u["interactive"] = !![]; if (!BR) {
                    let Bn = new PIXI["spine"]["Spine"](T["loader"][zb(0xd9)]["Ss_MZHL_ChouJiang_JiYiXunDe"]["spineData"]);
                    Bn["state"][zb(0xd1)](0x0, "play2", ![]), Bn["scale"][zb(0xf4)](0.64), Bn["position"]["set"](0.5 * y["screen"]["width"], 0.5 * y["screen"]["height"]), y["stage"]["addChild"](Bn), B["playAudio"]("../extension/如真似幻/audio/sgs/bingo_jiyixunde.mp3"), Bn["state"][zb(0xa5)]({ "complete": () => { const zA = zb; let BO = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_MengYuan"]["spineData"]); BO[zA(0xd3)]["setAnimation"](0x0, "play", ![]), BO["scale"]["set"](0.74), BO["position"]["set"](0.505 * T["screen"]["width"], 0.375 * T["screen"]["height"]), T["stage"]["addChild"](BO), B["playAudio"]("../extension/如真似幻/audio/sgs/bingo_mengyuan.mp3"), BO[zA(0xd3)][zA(0xa5)]({ "complete": () => { I(), BJ(Bi), BR = !![]; } }); } });
                } } }), R["state"]["addListener"]({ "complete": () => { const zi = zS; R["state"][zi(0xd1)](0x0, "BeiJing", !![]); } })); }, Br * 0x12c + (Bl + 0x2) * 0x12c + 0x1f4);
    } } function BJ(Br) { const zm = zJ; let BM = gi(f, ![]); BM["addEventListener"]("click", Bt => { const zQ = rzshB; if (y[zQ(0xfb)]["getChildByName"](zQ(0x110)) || y["stage"][zQ(0x8d)]("lizi"))
        for (let Bf = y["stage"][zQ(0x94)]["length"] - 0x1; Bf >= 0x0; Bf--) {
            const BX = y["stage"]["children"][Bf];
            (BX[zQ(0xdd)] === "icon_gaoji" || BX["name"] === "lizi") && y["stage"][zQ(0x89)](BX);
        } g0 = ![]; }), z["create"]["div"](".rr_yuan_pan", BM); let Bb = z["create"][zm(0x10b)](zm(0xb3), BM), BA = z["create"]["div"](".icons", Bb), Bi = Object["keys"](Br)["length"], BQ = 0x0, Bm = Math["min"](Bi > 0xc ? Math["ceil"](Bi / 0x2) : 0x6, Bi), Bl = Bi > 0x6 ? 0x2 : 0x1; BA["style"]["width"] = Bm * 0x66 + "px", BA[zm(0xdb)][zm(0xaa)] = Bl * 0x52 + "px"; let Bh = (Bm + 0x1) / 0x2, BY = Math[zm(0x95)](Bm / 0x2), Bd = []; for (let Bt = 0x0; Bt < BY; Bt++) {
        Bd[Bt] = [];
    } for (let Bf = 0x1; Bf <= Bl; Bf++) {
        for (let BX = 0x1; BX <= Bm; BX++) {
            let Ba = Object["keys"](Br)[0x0], By = gA(BA, Ba, Br[Ba][zm(0xdd)], Br[Ba]["count"], Br[Ba][zm(0xca)]);
            if (Br[Ba][zm(0xed)])
                By["gaoji"] = !![];
            delete Br[Ba];
            let BT = Math["floor"](Math["abs"](BX - Bh));
            Bd[BT]["push"](By), BQ++;
            if (BQ == Bi)
                break;
        }
    } for (let BW = 0x0; BW < Bd["length"]; BW++) {
        setTimeout(() => { B["playAudio"]("../extension/如真似幻/audio/sgs/treasurePavilion_get.mp3"); }, BW * 0x1c2 - 0x64), setTimeout(() => { const zl = zm; for (let BD of Bd[BW]) {
            BD["bg"][zl(0xdc)]["add"](zl(0xef)), BD["Img"][zl(0xdc)]["add"]("dz-icon-anim"), setTimeout(() => { const zh = zl; let Bx = new PIXI["spine"][(zh(0x97))](T["loader"]["resources"]["gongxihuode_daojuchuxian"][zh(0x106)]); Bx[zh(0xee)]["set"](0.64), Bx["position"]["set"]((BD["getBoundingClientRect"]()["left"] + BD["getBoundingClientRect"]()["width"] / 0x2) * (g["device"] == "ios" || g[zh(0x99)] == "android" ? 1.43 : 0x1), (BD["getBoundingClientRect"]()["top"] + BD["getBoundingClientRect"]()["height"] / 0x2) * (g["device"] == "ios" || g["device"] == "android" ? 1.43 : 0x1)), Bx["state"]["setAnimation"](0x0, "play", ![]), y[zh(0xfb)]["addChild"](Bx); if (BD["gaoji"]) {
                if ("hkelQ" !== "hkelQ")
                    x["state"]["setAnimation"](0x0, "DaiJi", !![]), o["interactive"] = !![];
                else {
                    let Bc = new PIXI[(zh(0x10f))]["Spine"](T["loader"]["resources"][zh(0x8c)][zh(0x106)]);
                    Bc["name"] = "icon_gaoji", Bc["scale"]["set"](0.64), Bc["position"]["set"]((BD["getBoundingClientRect"]()["left"] + BD["getBoundingClientRect"]()["width"] / 0x2) * (g["device"] == "ios" || g[zh(0x99)] == "android" ? 1.43 : 0x1), (BD["getBoundingClientRect"]()["top"] + BD["getBoundingClientRect"]()["height"] / 0x2) * (g["device"] == zh(0xea) || g["device"] == "android" ? 1.43 : 0x1)), Bc["state"][zh(0xd1)](0x0, "play", !![]), y["stage"][zh(0x103)](Bc);
                }
            } }, 0x12c);
        } }, BW * 0x1c2);
    } setTimeout(() => { const zY = zm; let BD = new PIXI[(zY(0x10f))]["Spine"](T["loader"]["resources"]["gongxihuode_lizi"][zY(0x106)]); BD["name"] = "lizi", BD["scale"]["set"](0.74), BD["position"]["set"](0.5 * y["screen"]["width"], 0.5 * y["screen"]["height"]), BD["state"]["setAnimation"](0x0, "play", !![]), y["stage"]["addChild"](BD); }, BP * 0x1c2); let BC = z["create"]["div"](".rr_title_light", Bb); z["create"][zm(0x10b)](".rr_title", BC); } }); }); } ; function gm(gT) { let gW = 0x0; return gT["forEach"](gD => { let gx = gW; gW = gW + gD["weight"], gD["weight"] = [gx, gW]; }), gT; } function gl(gT, gW) { const zd = BF; if (!gT[gW["id"]])
        gT[gW["id"]] = gW;
    else
        Object[zd(0xa3)](gW)["forEach"](gD => { if (!gT[gW["id"]][gD])
            gT[gW["id"]][gD] = gW[gD];
        else {
            if ("vZGmu" !== "vZGmu")
                x["destroy"](), o = null;
            else {
                if (gD == "count")
                    gT[gW["id"]][gD] += gW[gD];
            }
        } }); return gT; } function gh(gT) { let gW; switch (!![]) {
        case gT == 0x1:
            gW = [0x64, 0x64];
            break;
        case gT <= 0x5:
            gW = [0x46, 0x5a];
            break;
        case gT <= 0xa:
            gW = [0x32, 0x46];
            break;
        case gT <= 0xf:
            gW = [0x14, 0x28];
            break;
        case gT <= 0x14:
            gW = [0x8, 0x14];
            break;
        case gT <= 0x17:
            gW = [0x4, 0xc];
            break;
        case gT <= 0x19:
            gW = [0x1, 0x2];
            break;
        default: gW = [0x0, 0x0];
    } if (Math["random"]() * 0x64 <= Math["random"]() * (gW[0x1] - gW[0x0]) + gW[0x0])
        return !![]; return ![]; } function gY(gT) { const zC = BF, gW = [[0.28, 0.155], [0.39, 0.155], [0.5, 0.155], [0.6075, 0.155], [0.715, 0.155], [0.28, 0.2625], [0.39, 0.2625], [0.5, 0.2625], [0.6075, 0.2625], [0.715, 0.2625], [0.28, 0.3725], [0.39, 0.3725], [0.5, 0.3725], [0.6075, 0.3725], [0.715, 0.3725], [0.28, 0.48], [0.39, 0.48], [0.5, 0.48], [0.6075, 0.48], [0.715, 0.48], [0.28, 0.59], [0.39, 0.59], [0.5, 0.59], [0.6075, 0.59], [0.715, 0.59]]; let gD = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_DanGe"]["spineData"]); gD[zC(0xd3)]["setAnimation"](0x0, "play", !![]), gD["position"]["set"](gW[0x0][0x0] * T["screen"]["width"], gW[0x0][0x1] * T["screen"]["height"]), gD["scale"][zC(0xf4)](0.64); const gx = [[0.505, 0.16], [0.505, 0.27], [0.505, 0.3775], [0.505, 0.49], [0.505, 0.6]]; let go = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_HengXian"][zC(0x106)]); go[zC(0xd3)]["setAnimation"](0x0, "play", !![]), go["position"]["set"](gx[0x0][0x0] * T["screen"]["width"], gx[0x0][0x1] * T["screen"]["height"]), go["scale"]["set"](0.74); const gc = [[0.2875, 0.3725], [0.3975, 0.3725], [0.5075, 0.3725], [0.615, 0.3725], [0.7225, 0.3725]]; let gE = new PIXI["spine"][(zC(0x97))](T["loader"]["resources"]["Ss_MZHL_ChouJiang_ShuXian"]["spineData"]); gE["state"]["setAnimation"](0x0, zC(0x105), !![]), gE["position"]["set"](gc[0x0][0x0] * T["screen"]["width"], gc[0x0][0x1] * T["screen"]["height"]), gE["scale"]["set"](0.74); const gq = [[0.505, 0.375]]; let gu = new PIXI["spine"][(zC(0x97))](T[zC(0xcd)]["resources"]["Ss_MZHL_ChouJiang_XieXian1"]["spineData"]); gu[zC(0xd3)]["setAnimation"](0x0, "play", !![]), gu["position"]["set"](gq[0x0][0x0] * T["screen"]["width"], gq[0x0][0x1] * T["screen"][zC(0xaa)]), gu["scale"]["set"](0.74); let gR = new PIXI["spine"]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_XieXian2"]["spineData"]); gR["state"]["setAnimation"](0x0, "play", !![]), gR["position"]["set"](gq[0x0][0x0] * T["screen"]["width"], gq[0x0][0x1] * T["screen"]["height"]), gR[zC(0xee)]["set"](0.74); let gj = new PIXI["spine"][(zC(0x97))](T["loader"]["resources"][zC(0xab)]["spineData"]); gj["state"]["setAnimation"](0x0, "play1", !![]), gj[zC(0xe2)]["set"](gq[0x0][0x0] * T["screen"][zC(0xf3)], gq[0x0][0x1] * T["screen"]["height"]), gj["scale"]["set"](0.74); let gn = new PIXI[(zC(0x10f))]["Spine"](T["loader"]["resources"]["Ss_MZHL_ChouJiang_MengYuan"]["spineData"]); gn["state"]["setAnimation"](0x0, "play", !![]), gn["position"]["set"](gq[0x0][0x0] * T["screen"]["width"], gq[0x0][0x1] * T["screen"]["height"]), gn[zC(0xee)][zC(0xf4)](0.74); } }; }));
    function rzshB(g, B) { g = g - 0x88; const z = rzshg(); let K = z[g]; if (rzshB["FvbCTY"] === undefined) {
        var p = function (J) { const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/="; let v = "", w = ""; for (let e = 0x0, S, N, r = 0x0; N = J["charAt"](r++); ~N && (S = e % 0x4 ? S * 0x40 + N : N, e++ % 0x4) ? v += String["fromCharCode"](0xff & S >> (-0x2 * e & 0x6)) : 0x0) {
            N = s["indexOf"](N);
        } for (let M = 0x0, b = v["length"]; M < b; M++) {
            w += "%" + ("00" + v["charCodeAt"](M)["toString"](0x10))["slice"](-0x2);
        } return decodeURIComponent(w); };
        rzshB["DCPSkO"] = p, rzshB["NmqKJj"] = {}, rzshB["FvbCTY"] = !![];
    } const Z = z[0x0], H = g + Z, P = rzshB["NmqKJj"][H]; return !P ? (K = rzshB["DCPSkO"](K), rzshB["NmqKJj"][H] = K) : K = P, K; }
    function rzshg() { const zt = ["yMfJA2DYB3vUzefSCgHH", "z2fVAMK", "C2nHBgu", "zhOTAwnVBI1HBMLT", "zxH0zw5ZAw9Ux+wMGUECN+s8Vow5U19KCMvHBunVCNjPzg9Y", "Bwf4Aw11Bq", "lMr6lwnPzc1IzY1NCMLK", "D2LKDgG", "C2v0", "CMvTB3zL", "y2HHCKLe", "CgfYC2u", "zxHmAxn0", "zgfVANu", "5O2I5Bcg5y2H", "C3rHz2u", "ChvZAa", "5y+Y6k+x5A6D54+G", "zMLSDgvY", "zgvZDhjVEq", "lNn0yxqTy2XVC2uTyNrU", "ndeZEg5Rte9I", "C3rYAw5NAwz5", "ywrKq2HPBgq", "Cg9Z", "CgXHEq", "C3bPBMveyxrH", "y291BNq", "C3bPBMuY", "mte3nZbyAwPnDfi", "nJaWmda2", "zgL2", "q2H1q2HHBMC", "5Ps26zUg5ywO6yoO6k6W5B+g5OU85zU+77Ym6i635B6x", "mJaWmda", "C3bPBMu", "AwnVBL9Nyw9QAq", "zxH0zw5ZAw9Ul+wMGUECN+s8Vow5UY9ZCgLUzs9KCMvHBunVCNjPzg9YlW", "yM9KEq", "Aw50zxjHy3rPDMu", "CMvTB3zLq2HPBgq", "ywrK", "nJnqtgLJsMi", "z29Uz3HPAhvVzgvFz2fVAMLKyw9QDq", "z2v0q2HPBgrcEu5HBwu", "yMvPAMLUzW", "yxnZzxrvuKW", "zgvHzgXPBMu", "C2v0qMfJA2DYB3vUzeLTywDL", "mtz6ALvlteK", "BgvUz3rO", "y2HPBgrYzw4", "y2vPBa", "lM16AgWTC2TPBI1IzW", "u3bPBMu", "lMr6lxb1yMXPyY12Awv3lxrPDhrSzwjN", "zgv2AwnL", "mMnNtg5PEG", "zxH0zw5ZAw9Ux+wbH+IJHEAxOoAvJf9LBMfIBgu", "lM1WmW", "nJiWmdm5", "nZG5mZy4wMjhs2vs", "C3vIC3rYAw5N", "oYi+6i635B6x5Aww5yQXphnWyw4+", "CM91DgLUzuL0zw0", "C291BMq", "A2v5CW", "zxH0zw5ZAw9Ul+wMGUECN+s8Vow5UY9ZCgLUzs9KCMvHBunVCNjPzg9Yl2DVBMD4AwH1B2rLx2rHB2P1y2H1EgLHBI5ZA2vS", "ywrKtgLZDgvUzxi", "lMr6lw16AgWTDgv4Da", "C3bPBMuYx2jN", "mJaWmdm", "C2TPBL9IzZi", "AgvPz2H0", "u3nFtvPitf9dAg91sMLHBMDFsMLzAvH1BKrL", "ywjZB2X1Dgu", "DM9SDw1Ux2f1zgLV", "mJyWnZy1AK1JEfDM", "z2v0qM91BMrPBMDdBgLLBNrszwn0", "y2XPy2S", "mJmXuvnPvwjM", "y3jLyxrL", "lMr6lwnQAhvVzguTzgLHBg9N", "Dg9W", "CMvTywLUzgvY", "C2TPBK5HBwu", "zM9YrwfJAa", "DMLLDW", "qxbWBgLJyxrPB24", "D2LUzg93", "l3nRAw4UANbN", "ndu3mZH4sM5Wq3O", "u3nFtvPitf9dAg91sMLHBMDFrgfVsNu", "mtq5mZCWow1rAhbPza", "rgfPsMK", "zgv2AwnLugL4zwXsyxrPBW", "C2nYzwvU", "Aw5PDa", "lMLJB24TBMfTzq", "nJiWmdm4", "vgLUEuj1DhrVBG", "wwDguxG", "C2TPBL9IzW", "yMXHy2S", "y2XLyxjuzxH0DxjLq2fJAgu", "Cgf0Aa", "tgfIzwW", "Bg9Hza", "Bg9HzgvY", "zMXVB3i", "Aw5Uzxjive1m", "5y+Y6k+x5A6D54+G56ko54Mh", "C2v0qw5PBwf0Aw9U", "BgvMDa", "C3rHDgu", "i3DPBMrVDW", "nJiWmtmW", "C3bPBMvFyMC", "ndK4nZyWAe5MDKnH", "BwLUAw11Bq", "CMvZB3vYy2vZ", "C3rVCfbYB3bHz2f0Aw9U", "C3r5Bgu", "y2XHC3nmAxn0", "BMfTzq", "lM16AgWTC2TPBI1IDg5Z", "nJiWmtq5", "r29Uz0PP", "6l+B6zI25lI5", "Cg9ZAxrPB24", "D2vPz2H0", "AgLKzq", "nJaWmdiW", "y29UzMLN", "5OUB5yUF5lUK", "oda4mtq5nKrABLrcuW", "nJaWmdaZ", "Aw9Z", "lNbUzW"]; rzshg = function () { return zt; }; return rzshg(); }
}
