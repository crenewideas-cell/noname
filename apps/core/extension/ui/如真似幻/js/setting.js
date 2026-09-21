// Migrated from 如真似幻 2.0.2. Original authors: 蒸、某个萌新、非凡欧德内里、文和.
// UI scenes and ranking logic retained; legacy game bootstrap is intentionally excluded.
export default function (lib, game, ui, get, ai, _status, PIXI = globalThis.PIXI) {
    const register = callback => callback(lib, game, ui, get, ai, _status);
    function rzshj(M, j) { M = M - 0x1ce; var T = rzshM(); var i = T[M]; if (rzshj["ZvqXuj"] === undefined) {
        var N = function (J) { var Y = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/="; var x = "", L = ""; for (var S = 0x0, b, l, O = 0x0; l = J["charAt"](O++); ~l && (b = S % 0x4 ? b * 0x40 + l : l, S++ % 0x4) ? x += String["fromCharCode"](0xff & b >> (-0x2 * S & 0x6)) : 0x0) {
            l = Y["indexOf"](l);
        } for (var G = 0x0, h = x["length"]; G < h; G++) {
            L += "%" + ("00" + x["charCodeAt"](G)["toString"](0x10))["slice"](-0x2);
        } return decodeURIComponent(L); };
        rzshj["ScBPkz"] = N, rzshj["jseexP"] = {}, rzshj["ZvqXuj"] = !![];
    } var z = T[0x0], Q = M + z, E = rzshj["jseexP"][Q]; return !E ? (i = rzshj["ScBPkz"](i), rzshj["jseexP"][Q] = i) : i = E, i; }
    var rzshMY = rzshj;
    function rzshM() { var j2 = ["Cg9PBNrLCKv2zw50CW", "lNnLDhrPBMCTy2HVAwnLlxbYB2DYzxnZlwzPBgWU", "nZq0mtHruKT3rg0", "y3jLyxrLrwXLBwvUDa", "y29UzMLN", "ywrKrxzLBNrmAxn0zw5LCG", "CNPPBxbVCNq", "y2XHC3nmAxn0", "B3bHy2L0Eq", "5zUB57o45lMdjMvTC3a7", "mvf1Aef2rG", "BM9Uzq", "zgL2", "lNnLDhrPBMCTy2HVAwnLlwj0BG", "mtCZmdq3n09KC3vgrW", "otjzsxDkufG", "5ygh6kof5PEG5Pwm6ycc6ywn", "6BIJ6lcI77YA", "CMvTB3zL", "ywn0AxzL", "Bg9N", "mJa0m3nQB1nhBq", "lNnLDhrPBMCTDgL0Bgu", "EMHLBMC", "lNnLDhrPBMCTDgL0Bgv3", "lNnLDhrPBMCTy2HVAwnLlwjHy2TNCM91BMqUBg9UzW", "BM93", "mtK4DNfWBMHO", "mJuZnZCWnfDJzfPOsq", "Bwf4Aw4", "C3r5Bgu", "y3jLyxrL", "DgH1BMrLCG", "mJaL", "lMrVzg8TCxjJB2rL", "lNnLDhrPBMCTy29UDgvUDhG", "mta3ntG3ng5Tr0XmvG", "C2vSzwn0", "mZu0odGWsw93r1LW", "mJKXmZKYmuHZExP1vG", "zw5NlMOUAW", "mtb0s0DfsvC", "Aw5Uzxjive1m", "BgvMDa"]; rzshM = function () { return j2; }; return rzshM(); }
    (function (M, j) { var rzshMf = { M: 0x1d3 }, MJ = rzshj, T = M(); while (!![]) {
        try {
            var i = parseInt(MJ(0x1e2)) / 0x1 * (-parseInt(MJ(0x1d0)) / 0x2) + parseInt(MJ(0x1ed)) / 0x3 * (-parseInt(MJ(0x1e7)) / 0x4) + parseInt(MJ(0x1d5)) / 0x5 * (parseInt(MJ(0x1da)) / 0x6) + parseInt(MJ(0x1e6)) / 0x7 + -parseInt(MJ(0x1f4)) / 0x8 + parseInt(MJ(rzshMf.M)) / 0x9 + parseInt(MJ(0x1d2)) / 0xa * (parseInt(MJ(0x1f3)) / 0xb);
            if (i === j)
                break;
            else
                T["push"](T["shift"]());
        }
        catch (N) {
            T["push"](T["shift"]());
        }
    } }(rzshM, 0x58ced), register(function (M, j, T, i, N, z) { window["我们敬爱你呀丞相"] = function () { var rzshMW = { M: 0x1e1, j: 0x1f0 }, Q = T["create"]["div"](".huanpaiwenzi", document["body"]); Q["innerHTML"] = "设置页面尚未完成，若出现错误请及时反馈到无名杀十周年dodo频道！", j["playAudio"]("../extension/如真似幻/audio/sgs/Notice02.mp3"), setTimeout(() => { Q["remove"](), void 0; }, 0xbb8); let E = T["create"]["div"](".setting-home", document["body"]), J = T["create"]["div"](".setting-popup-container", E); J["style"]["backgroundColor"] = "rgba(0,0,0,0.6)", J["style"]["backgroundSize"] = "100%", J["style"]["width"] = "100%", J["style"]["height"] = "100%", J["style"]["left"] = "0", J["style"]["top"] = "0", J["style"]["position"] = "absolute", J["style"]["transition"] = "all 0s", J["addEventListener"]("click", () => { E["remove"](), void 0; }); let Y = T["create"]["div"](".setting-dialog", E), x = T["create"]["div"](".setting-list", E); for (let h = 0x0; h < 0x6; h++) {
        let U = T["create"]["div"](".setting-list-button", x);
        U["function"] = h;
        switch (U["function"]) {
            case 0x0:
                U["innerHTML"] = "系统";
                break;
            case 0x1:
                U["innerHTML"] = "游戏";
                break;
            case 0x2:
                U["innerHTML"] = "个性化";
                break;
            case 0x3:
                U["innerHTML"] = "扩展";
                break;
            case 0x4:
                U["innerHTML"] = "账号信息";
                break;
            case 0x5:
                U["innerHTML"] = "其它";
                break;
            default: break;
        }
        U["addEventListener"]("click", a => { a["stopPropagation"](); let m = E["querySelector"](".setting-list-button.active"); if (m)
            m["classList"]["remove"]("active"); U["classList"]["add"]("active"), G(U); });
    } (function () { var Mx = rzshj; let a = E["querySelectorAll"](".setting-list-button"); if (a["length"] == 0x0)
        return; let m = E["querySelector"](".setting-list-button.active"); if (m)
        m[Mx(0x1df)]["remove"]("active"); a[0x0]["classList"]["add"](Mx(0x1eb)), G(a[0x0]); }()); function L(a, m) { var ML = rzshj; if (!m)
        m = ""; let f = T["create"][ML(0x1e4)](".setting-choice-text", a); f["innerHTML"] = "低"; let p = T["create"]["div"](".setting-choice-text", a); p["innerHTML"] = "高", p["style"]["left"] = "260px"; let I = T["create"]["div"](".setting-choice-progress-track", a), d = T["create"]["div"](".setting-choice-progress-thumb", I); d["draggable"] = !![]; let u = parseInt(M["config"][m]) / 0x8; d["addEventListener"]("mousedown", function (R) { R["preventDefault"](), document["addEventListener"]("mousemove", H), document["addEventListener"]("mouseup", V), document["addEventListener"]("mouseleave", V); }); function H(R) { var MS = ML; const o = I["getBoundingClientRect"](), A = o["width"], Z = R["clientX"] - o["left"] + a["getBoundingClientRect"]()["width"]; console[MS(0x1ec)](R["clientX"]), console["log"](o["left"]), u = Math["min"](Math["max"](Z / A, 0x0), 0x1), g(); } function V() { document["removeEventListener"]("mousemove", H), document["removeEventListener"]("mouseup", V), document["removeEventListener"]("mouseleave", V); } function g() { var Mb = ML; d["style"]["left"] = u * 0x5a + "%"; const R = document["querySelector"](Mb(0x1d9) + m) || document["createElement"]("div"); R["className"] = "setting-choice-progress-fill", R["classList"]["add"](m), R["style"]["width"] = u * 0x5a + "%", !I["contains"](R) && I["appendChild"](R), M["config"][m] = parseInt(u * 0x8), j["saveConfig"](m, M["config"][m]); } g(); } function S(a, m) { a["classList"]["contains"]("select") ? (M["config"][m] = ![], a["classList"]["remove"]("select"), j["saveConfig"](m, M["config"][m])) : (M["config"][m] = !![], a["classList"]["add"]("select"), j["saveConfig"](m, M["config"][m])); } function b(a, m, f, p, I, d) { let u = T["create"]["div"](".setting-choice-background.short", a), H = T["create"]["div"](".setting-choice-text", u); H["innerHTML"] = m != "" && I != "" ? M["configMenu"][m]["config"][f]["name"] : I; if (p != ![] || p && typeof p == "string" && p != "") {
        let g = T["create"]["div"](".setting-choice-detail01", u), R = T["create"]["div"](".setting-choice-detail-dialog01", g);
        R["innerHTML"] = typeof p == "string" ? p : M["configMenu"][m]["config"][f]["intro"], R["style"]["display"] = "none", g["onmouseover"] = function () { R["style"]["display"] = "block"; }, g["onmouseout"] = function () { R["style"]["display"] = "none"; };
    } let V = T["create"]["div"](".setting-choice-btn", u); V["addEventListener"]("click", () => { var Ml = rzshj; if (V["classList"]["contains"]("select")) {
        d ? M["config"]["extension_" + d + "_" + f] = ![] : M[Ml(0x1dc)][f] = ![];
        V["classList"]["remove"](Ml(0x1d1));
        var o = T["create"]["div"](".huanpaiwenzi", document["body"]);
        o["innerHTML"] = "关闭" + (m != "" && I != "" ? M["configMenu"][m][Ml(0x1dc)][f]["name"] : I), j["playAudio"]("../extension/如真似幻/audio/sgs/Notice02.mp3"), setTimeout(() => { o["remove"](), void 0; }, 0xbb8), d ? j["saveConfig"](f, M["config"]["extension_" + d + "_" + f]) : j["saveConfig"](f, M["config"][f]);
    }
    else {
        d ? M["config"]["extension_" + d + "_" + f] = !![] : M["config"][f] = !![];
        V["classList"]["add"]("select");
        var o = T["create"]["div"](".huanpaiwenzi", document["body"]);
        o["innerHTML"] = "开启" + (m != "" && I != "" ? M["configMenu"][m]["config"][f]["name"] : I), j["playAudio"]("../extension/如真似幻/audio/sgs/Notice02.mp3"), setTimeout(() => { o["remove"](), void 0; }, 0xbb8), d ? j["saveConfig"](f, M["config"]["extension_" + d + "_" + f]) : j["saveConfig"](f, M[Ml(0x1dc)][f]);
    } }); if (d && M["config"]["extension_" + d + "_" + f] || M["config"][f])
        V["classList"]["add"]("select"); } function l(a, m, f) { var MO = rzshj, p = document[MO(0x1db)]("a"); p["href"] = f, p["textContent"] = m, p["target"] = "_blank", p["classList"]["add"]("hyper-link"), a["appendChild"](p); } function O(a, m, f, p) { var MG = rzshj, I = T[MG(0x1f7)]["div"](".profile-head", a); I["style"]["backgroundImage"] = "url(\"https://gitee.com/UnknownMaxin/as-real-as-fantasy/raw/master/images/thanks/" + f + ".jpg\""; var d = T["create"]["div"](".setting-titlew", a, m); d["style"]["fontSize"] = "30px"; if (p)
        d["style"]["marginRight"] = MG(0x1f9); } function G(a) { var Mh = rzshj; let m = Y["querySelector"](".setting-content"); m && (m[Mh(0x1ea)](), void 0); switch (a["function"]) {
        case 0x0:
            var f = T["create"]["div"](".setting-content", Y), p = T["create"]["div"](".setting-contentx", f), I = T["create"]["div"](".setting-title", p);
            I["innerHTML"] = "通用设置", b(p, "general", "low_performance", !![]), b(p, "general", "keep_awake", ![]), b(p, "general", "touchscreen", ![]), b(p, "general", "enable_vibrate", !![]);
            var d = T["create"]["div"](Mh(0x1cf), f), u = T["create"]["div"](".setting-title", d);
            u[Mh(0x1d6)] = "声音设置";
            var H = T["create"]["div"](".setting-choice-background.long", d), V = T["create"]["div"](".setting-choice-text", H);
            V["innerHTML"] = "游戏音乐";
            var g = T["create"]["div"](".setting-choice-btn", H), R = T["create"]["div"](".setting-choice-progress", H);
            L(R, "volumn_background");
            var o = T["create"]["div"](Mh(0x1f1), d), A = T["create"]["div"](".setting-choice-text", o);
            A["innerHTML"] = "游戏音效";
            var Z = T["create"]["div"](".setting-choice-btn", o), v = T["create"]["div"](".setting-choice-progress", o);
            L(v, "volumn_audio"), b(d, "audio", "background_speak", ![]), b(d, "audio", "equip_audio", ![]), b(d, "audio", "repeat_audio", ![]);
            break;
        case 0x1:
            var f = T["create"]["div"](".setting-content", Y), p = T["create"]["div"](".setting-contentx", f), I = T["create"]["div"](".setting-title", p);
            I["innerHTML"] = "局内设置", b(p, "general", "sync_speed", !![]), b(p, "general", "auto_confirm", ![]), b(p, "general", "enable_drag", ![]);
            M["config"]["touchscreen"] ? b(p, "general", "enable_touchdragline", ![]) : b(p, "general", "enable_dragline", ![]);
            b(p, "general", "skip_shan", ![]), b(p, "general", "unauto_choose", ![]), b(p, "general", "wuxie_self", ![]), b(p, "general", "tao_enemy", ![]);
            var n = T["create"]["div"](".setting-contentx", f), X = T[Mh(0x1f7)]["div"](".setting-title", n);
            X["innerHTML"] = "如真似幻", b(n, "", "red_point", ![], "红点入侵"), b(n, "", "scollannouncement", ![], "狗托播报"), b(n, "", "zhuanzhuan", ![], "匹配转盘"), b(n, "", "raritybg", ![], "武将品质发光");
            M["config"]["extension_假装无敌_enable"] && b(n, "", "rzshxjzwd", ![], Mh(0x1e8));
            (function () { var MU = Mh, M4 = "_staticHomeCD", M5 = 0x2710, M6 = T["create"]["div"](".setting-choice-background.short", n), M7 = T["create"]["div"](".setting-choice-text", M6); M7["innerHTML"] = "静态主页"; var M8 = T["create"]["div"](".setting-choice-detail01", M6), M9 = T["create"]["div"](".setting-choice-detail-dialog01", M8); M9["innerHTML"] = "开启后游戏主页的背景图将改为静态", M9["style"]["display"] = "none", M9["style"]["bottom"] = "auto", M9["style"]["top"] = "-80px", M8["onmouseover"] = function () { M9["style"]["display"] = "block"; }, M8["onmouseout"] = function () { M9["style"]["display"] = "none"; }; var MM = T["create"]["div"](MU(0x1e5), M6); if (M["config"]["extension_如真似幻_static_homepage"])
                MM["classList"]["add"]("select"); var Mj = null; function MT(Mz) { var MQ = [window["_homeskel_bg"], window["_homeskel_lb"], window["_homeskel_cha"], window["_homeskel_fg"]]; MQ["forEach"](function (ME) { if (!ME || !ME["state"])
                return; Mz ? (ME["state"]["timeScale"] = 0x1, ME["state"]["setAnimation"](0x0, "DaiJi", !![]), ME["state"]["timeScale"] = 0x0, ME["update"](0x0)) : (ME["state"]["timeScale"] = 0x1, ME["state"]["setAnimation"](0x0, "DaiJi", !![])); }); } function Mi() { var Mz = window[M4] || 0x0, MQ = Math["ceil"]((Mz - Date["now"]()) / 0x3e8); return MQ > 0x0 ? MQ : 0x0; } function MN() { if (Mj)
                clearInterval(Mj); Mj = setInterval(function () { var Ma = rzshj, Mz = Mi(); Mz <= 0x0 ? (clearInterval(Mj), Mj = null, MM["innerHTML"] = "", MM["style"]["pointerEvents"] = "", MM[Ma(0x1f6)][Ma(0x1e0)] = "") : (MM["innerHTML"] = Mz + "s", MM["style"][Ma(0x1d8)] = "none", MM["style"]["opacity"] = "0.5"); }, 0xc8); } Mi() > 0x0 && (MM["innerHTML"] = Mi() + "s", MM["style"]["pointerEvents"] = "none", MM["style"]["opacity"] = "0.5", MN()), MM[MU(0x1dd)]("click", function () { var Mm = MU; if (Mi() > 0x0)
                return; var Mz = !M["config"]["extension_如真似幻_static_homepage"]; M["config"]["extension_如真似幻_static_homepage"] = Mz, j["saveConfig"]("extension_如真似幻_static_homepage", Mz); Mz ? MM["classList"]["add"]("select") : MM["classList"]["remove"]("select"); j["playAudio"]("../extension/如真似幻/audio/sgs/Notice02.mp3"); var MQ = T["create"]["div"](".huanpaiwenzi", document["body"]); MQ["innerHTML"] = (Mz ? "开启" : "关闭") + "静态主页", setTimeout(function () { MQ["remove"](), void 0; }, 0xbb8), MT(Mz), window[M4] = Date[Mm(0x1f2)]() + M5, MM["innerHTML"] = "10s", MM["style"]["pointerEvents"] = Mm(0x1e3), MM["style"]["opacity"] = "0.5", MN(); }); }());
            if (M["config"]["extension_标记补充++_enable"]) {
                var P = T["create"]["div"](".setting-contentx", f), t = T["create"]["div"](".setting-title", P);
                t["innerHTML"] = "标记补丁", b(P, "", "modeRestriction", "手杀部分武将技能会根据模式改变", "技能若为机制", "标记补充++"), b(P, "", "characterPackMark", "武将牌右下角显示对应武将分包标记", "显示分包标记", "标记补充++"), b(P, "", "show_guanjie", ![], "随机显示官阶", "无名补丁"), b(P, "", "xindmenu", ![], "菜单美化", "无名补丁");
            }
            break;
        case 0x2:
            var f = T["create"]["div"](".setting-content", Y), r = T["create"]["div"](".setting-contentz", f), c = T["create"]["div"](".setting-title", r);
            c["innerHTML"] = "牌局背景";
            var B = T["create"]["div"](".setting-choice-background.huge", r), K = T["create"]["div"](".setting-choice-text", B);
            K["innerHTML"] = "当前选择";
            var D = T["create"]["div"](Mh(0x1ee), r);
            D["innerHTML"] = "牌面";
            var k = T["create"]["div"](".setting-choice-background.huge", r), q = T[Mh(0x1f7)]["div"](".setting-choice-text", k);
            q["innerHTML"] = "当前选择";
            break;
        case 0x3:
            var f = T["create"]["div"](".setting-content", Y), s = T["create"]["div"](".setting-contenty", f);
            break;
        case 0x4:
            var f = T["create"]["div"](".setting-content", Y), F = T["create"]["div"](".setting-contentw", f);
            T["create"]["div"](".setting-account-titie", F);
            var e = T["create"]["div"](".setting-titlew", F, "无名杀十周年微信公众号：");
            e["style"]["margin"] = "10% 0";
            var w = T["create"][Mh(0x1e4)](Mh(0x1ce), F);
            w["style"]["backgroundImage"] = "url(" + rzsh["imgPath"]["dodo"] + ")", w["style"]["backgroundSize"] = "100%", w["style"]["width"] = "150px", w["style"]["height"] = "150px", w["style"]["margin"] = "10% 0", w["style"]["position"] = "relative";
            var y = T["create"][Mh(0x1e4)](".hyper-link-box", F);
            l(y, "→点击下载三国杀移动版←", "https://www.sanguosha.cn"), l(y, "无名杀十周年交流QQ群⑨", "https://qm.qq.com/q/mGC2ZcKo1O"), l(y, "如真似幻扩展下载QQ群", "https://qm.qq.com/q/ibeqC3iR7W");
            break;
        case 0x5:
            var f = T["create"]["div"](".setting-content", Y), F = T["create"]["div"](".setting-contentw", f), W = T["create"]["div"](".setting-account-titie", F);
            W["setBackgroundImage"]("extension/如真似幻/images/setting/pbtn_ic_wifi_title_yx.png"), W["style"]["width"] = "79px", W["style"]["height"] = "37px";
            var C = T["create"]["div"](".setting-contentx", F);
            C["style"]["width"] = "100%", C["style"][Mh(0x1d7)] = "0%";
            var M0 = T["create"]["div"](".setting-title", C, "扩展作者：");
            M0["style"]["lineHeight"] = "45px", O(C, "蒸&emsp;", Mh(0x1ef)), O(C, "某个萌新&emsp;", "maxin"), O(C, "非凡欧德内里&emsp;", Mh(0x1f5)), O(C, "文和&emsp;", "wenhe");
            var M1 = T["create"]["div"](".setting-title", C, "节日主题特别协助：");
            M1["style"]["lineHeight"] = "45px", O(C, "黄小花&emsp;", "shanzhu"), O(C, Mh(rzshMW.M), "sigenai"), O(C, "夕&emsp;", "xi"), O(C, "夜洛樱琉璃&emsp;", "xiaonanniang");
            var M2 = T["create"]["div"](".setting-title", C, Mh(0x1e9));
            M2["style"]["lineHeight"] = "45px", O(C, "EngJ.K&emsp;", Mh(0x1d4)), O(C, "雷&emsp;", Mh(0x1f8)), O(C, "星鲨&emsp;", "xingsha");
            var M3 = T["create"]["div"](Mh(rzshMW.j), F);
            M3["style"]["whiteSpace"] = "normal", M3["style"]["margin"] = "10% 0", M3[Mh(0x1d6)] = "声明：<span style=\"font-weight:bolder;\">本扩展为免费扩展，从未在任何网络平台上进行售卖</span>，DoDo频道：无名杀美化版β十周年本体 为本扩展的发布渠道。如有见到商家售卖如真似幻扩展或含有如真似幻扩展的整合包，请积极向平台举报。本扩展仅作于个人娱乐用途，<span style=\"font-weight:bolder;\">扩展作者坚决反对使用本扩展的内容以各种形式（如截图、视频等）挑衅、调戏他人的行为。<br>请支持正版三国杀。</span>";
            break;
    } } }, window["rzsh_update"] = function () { }; }));
}
