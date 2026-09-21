// Migrated from 如真似幻 2.0.2. Original authors: 蒸、某个萌新、非凡欧德内里、文和.
// UI scenes and ranking logic retained; legacy game bootstrap is intentionally excluded.
import { lib, game, ui, get, ai, _status } from "noname";
var rzshB = rzshU;
(function (G, y) {
    var rzshn = { G: 0xc8 }, g = rzshU, T = rzshy, U = G();
    while (!![]) {
        try {
            var k = -parseInt(T(0xc2)) / 0x1 * (-parseInt(T(0xcb)) / 0x2) + -parseInt(T(0xc5)) / 0x3 * (parseInt(g(0xc9, "5QTC")) / 0x4) + parseInt(g(0xce, "]9HT")) / 0x5 * (parseInt(g(0xca, "f03(")) / 0x6) + -parseInt(g(rzshn.G, "1F3q")) / 0x7 * (-parseInt(g(0xc7, "K%N)")) / 0x8) + -parseInt(T(0xcc)) / 0x9 + parseInt(g(0xc6, "z&oX")) / 0xa + -parseInt(g(0xcd, "1ybK")) / 0xb;
            if (k === y)
                break;
            else
                U["push"](U["shift"]());
        }
        catch (f) {
            U["push"](U["shift"]());
        }
    }
}(rzshG, 0x8f921));
var rzshu = {};
rzshu["dodo"] = "https://gitee.com/UnknownMaxin/as-real-as-fantasy/raw/master/images/loginui/pdm1.png", rzshu["wx"] = "https://gitee.com/UnknownMaxin/as-real-as-fantasy/raw/master/images/loginui/sqm.jpg", rzshu["nonamekill"] = "https://gitee.com/UnknownMaxin/as-real-as-fantasy/raw/master/images/loginui/nunder.png", rzshu["against"] = "https://gitee.com/UnknownMaxin/as-real-as-fantasy/raw/master/images/loginui/page.png";
var rzsht = {};
rzsht["x"] = 0.5, rzsht["y"] = 0.55, rzsht["scale"] = 0.9;
var rzshW = {};
rzshW["x"] = 0.5, rzshW["y"] = 0.65, rzshW["scale"] = 0.75;
var rzshe = {};
rzshe["uihomeskelbg"] = rzsht, rzshe["uihomeskel"] = rzshW;
var rzshA = {};
rzshA["x"] = 0.5, rzshA["y"] = 0.55, rzshA["scale"] = 0.8;
var rzsha = {};
rzsha["uihomeskel"] = rzshA;
var rzsho = {};
rzsho["x"] = 0.42, rzsho["y"] = 0.45, rzsho["scale"] = 1.05;
var rzshj = {};
function rzshG() { var N = ["WQJcHSoeW5eucaxdMNyYxc8", "eSoZumoBlZKtDq", "mJKWnJC2zgLJwKDx", "mJe3mti1C2Ttt3bJ", "WO0QWRZcLXH5vmoEeaRcUSk1W5Lg", "ttOblSkHumkWp8oyWRH3kCoT", "nLbPsgnAsq", "WQhdQ8o9W5ZdK8kuWQddMu7cGZyAua", "6AQK5BIS5lM55AEL", "mtHizurAuvq", "W6xcPCk4WOZcUSonW7ZdIu/cLdG3Ea", "dCkShs8DdCoZW6pcMvm", "Dtmkp0aIWO7cQ3ZdP8kH"]; rzshG = function () { return N; }; return rzshG(); }
rzshj["x"] = 0.5, rzshj["y"] = 0.5, rzshj["scale"] = 0x2;
function rzshU(G, y) {
    G = G - 0xc2;
    var U = rzshG();
    var k = U[G];
    if (rzshU["AnxgjC"] === undefined) {
        var f = function (w) {
            var c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
            var d = "", p = "";
            for (var r = 0x0, M, u, t = 0x0; u = w["charAt"](t++); ~u && (M = r % 0x4 ? M * 0x40 + u : u, r++ % 0x4) ? d += String["fromCharCode"](0xff & M >> (-0x2 * r & 0x6)) : 0x0) {
                u = c["indexOf"](u);
            }
            for (var W = 0x0, e = d["length"]; W < e; W++) {
                p += "%" + ("00" + d["charCodeAt"](W)["toString"](0x10))["slice"](-0x2);
            }
            return decodeURIComponent(p);
        };
        var K = function (w, c) {
            var d = [], p = 0x0, r, M = "";
            w = f(w);
            var u;
            for (u = 0x0; u < 0x100; u++) {
                d[u] = u;
            }
            for (u = 0x0; u < 0x100; u++) {
                p = (p + d[u] + c["charCodeAt"](u % c["length"])) % 0x100, r = d[u], d[u] = d[p], d[p] = r;
            }
            u = 0x0, p = 0x0;
            for (var t = 0x0; t < w["length"]; t++) {
                u = (u + 0x1) % 0x100, p = (p + d[u]) % 0x100, r = d[u], d[u] = d[p], d[p] = r, M += String["fromCharCode"](w["charCodeAt"](t) ^ d[(d[u] + d[p]) % 0x100]);
            }
            return M;
        };
        rzshU["HfGYks"] = K, rzshU["ShpLNl"] = {}, rzshU["AnxgjC"] = !![];
    }
    var Y = U[0x0], m = G + Y, b = rzshU["ShpLNl"][m];
    return !b ? (rzshU["TbLORU"] === undefined && (rzshU["TbLORU"] = !![]), k = rzshU["HfGYks"](k, y), rzshU["ShpLNl"][m] = k) : k = b, k;
}
var rzshD = {};
rzshD["x"] = 0.42, rzshD["y"] = 0.45, rzshD["scale"] = 1.05;
var rzshJ = {};
rzshJ["x"] = 0.9, rzshJ["y"] = 0.5, rzshJ["scale"] = 0x2;
function rzshy(G, y) {
    G = G - 0xc2;
    var U = rzshG();
    var k = U[G];
    if (rzshy["XkLapw"] === undefined) {
        var f = function (K) {
            var w = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
            var c = "", d = "";
            for (var p = 0x0, r, M, u = 0x0; M = K["charAt"](u++); ~M && (r = p % 0x4 ? r * 0x40 + M : M, p++ % 0x4) ? c += String["fromCharCode"](0xff & r >> (-0x2 * p & 0x6)) : 0x0) {
                M = w["indexOf"](M);
            }
            for (var t = 0x0, W = c["length"]; t < W; t++) {
                d += "%" + ("00" + c["charCodeAt"](t)["toString"](0x10))["slice"](-0x2);
            }
            return decodeURIComponent(d);
        };
        rzshy["TGsewS"] = f, rzshy["FPETJe"] = {}, rzshy["XkLapw"] = !![];
    }
    var Y = U[0x0], m = G + Y, b = rzshy["FPETJe"][m];
    return !b ? (k = rzshy["TGsewS"](k), rzshy["FPETJe"][m] = k) : k = b, k;
}
var rzshI = {};
rzshI["uihomeskel"] = rzsho, rzshI["uihomeskelbg"] = rzshj, rzshI["uihomeskelfg"] = rzshD, rzshI["uihomeskellb"] = rzshJ;
var rzshi = {};
rzshi[rzshB(0xc4, "!@F9")] = rzshe, rzshi["周瑜小乔"] = rzsha, rzshi["吕布貂蝉"] = rzshI, window["rzsh"] = { "imgPath": rzshu, "spineData": rzshi, "function": { "alert": function (G) {
            var q = rzshB;
            if (_status["rzsh_alerting"])
                return;
            var y = ui["create"]["div"](".huanpaiwenzi", document["body"]);
            y["innerHTML"] = G, y["style"]["zIndex"] = "1001", game["playAudio"]("audio/sgs/Notice02.mp3"), _status[q(0xc3, "z&oX")] = !![], setTimeout(() => { y["remove"](), void 0, _status["rzsh_alerting"] = ![], delete _status["rzsh_alerting"]; }, 0xbb8);
        } }, "author": "某个萌新" };
export const rankingContent = function (config, pack) {
    (function (G, y) {
        var rzshN = { G: 0x1cd }, j = rzshy, o = rzshU, U = G();
        while (!![]) {
            try {
                var k = parseInt(o(0x1cb, "7*ld")) / 0x1 * (-parseInt(j(0x1d6)) / 0x2) + parseInt(j(0x1d7)) / 0x3 * (-parseInt(j(0x1d3)) / 0x4) + -parseInt(j(0x1c7)) / 0x5 + parseInt(o(0x1d1, "HR1]")) / 0x6 * (-parseInt(j(rzshN.G)) / 0x7) + -parseInt(o(0x1d4, "UdgS")) / 0x8 + parseInt(j(0x1d2)) / 0x9 * (-parseInt(o(0x1d5, "x$Gt")) / 0xa) + parseInt(o(0x1c9, "ksgJ")) / 0xb;
                if (k === y)
                    break;
                else
                    U["push"](U["shift"]());
            }
            catch (f) {
                U["push"](U["shift"]());
            }
        }
    }(rzshG, 0x3fe20));
    function rzshU(G, y) {
        G = G - 0x1c3;
        var U = rzshG();
        var k = U[G];
        if (rzshU["BpmnMa"] === undefined) {
            var f = function (w) {
                var c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
                var d = "", p = "";
                for (var r = 0x0, M, u, t = 0x0; u = w["charAt"](t++); ~u && (M = r % 0x4 ? M * 0x40 + u : u, r++ % 0x4) ? d += String["fromCharCode"](0xff & M >> (-0x2 * r & 0x6)) : 0x0) {
                    u = c["indexOf"](u);
                }
                for (var W = 0x0, e = d["length"]; W < e; W++) {
                    p += "%" + ("00" + d["charCodeAt"](W)["toString"](0x10))["slice"](-0x2);
                }
                return decodeURIComponent(p);
            };
            var K = function (w, c) {
                var d = [], p = 0x0, r, M = "";
                w = f(w);
                var u;
                for (u = 0x0; u < 0x100; u++) {
                    d[u] = u;
                }
                for (u = 0x0; u < 0x100; u++) {
                    p = (p + d[u] + c["charCodeAt"](u % c["length"])) % 0x100, r = d[u], d[u] = d[p], d[p] = r;
                }
                u = 0x0, p = 0x0;
                for (var t = 0x0; t < w["length"]; t++) {
                    u = (u + 0x1) % 0x100, p = (p + d[u]) % 0x100, r = d[u], d[u] = d[p], d[p] = r, M += String["fromCharCode"](w["charCodeAt"](t) ^ d[(d[u] + d[p]) % 0x100]);
                }
                return M;
            };
            rzshU["uibQzc"] = K, rzshU["remwwV"] = {}, rzshU["BpmnMa"] = !![];
        }
        var Y = U[0x0], m = G + Y, b = rzshU["remwwV"][m];
        return !b ? (rzshU["qWuuYL"] === undefined && (rzshU["qWuuYL"] = !![]), k = rzshU["uibQzc"](k, y), rzshU["remwwV"][m] = k) : k = b, k;
    }
    function rzshG() { var F = ["mGpdGeZdRJlcGZm", "nJu2ntK1ANbvr3zi", "mta0AuzRtLDv", "EK8FW57dHmkKkchcUSkPW4JdTW", "WPlcLCkjleBcHCk/WQO", "nhvkzvDUDq", "mZCXntHpEKDvvM0", "C3ZdJW", "W5ldISkp", "Bw9Kzq", "WQVdKSoWW6i", "DgLHBNrPx3zLCNn1C190D28", "W5z0W79Xz33dLre", "D2LU", "CMfUza", "mJm1mZm0meL4vuTLAq", "x3j6C2HFy3vYCMvUDa", "nslcJCkSDIhdO8kEW7DybSkUWO5A", "ECkNWRdcILHCW7m", "WQNcOSoci27dQ3xdLgZdPtVcTG", "Dg9W", "nJy1mtrAzxrbD3q", "vJvvWOG", "E2ZcR8ojpSkbeW", "kmk0uN4"]; rzshG = function () { return F; }; return rzshG(); }
    function rzshy(G, y) {
        G = G - 0x1c3;
        var U = rzshG();
        var k = U[G];
        if (rzshy["SfuXQw"] === undefined) {
            var f = function (K) {
                var w = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
                var c = "", d = "";
                for (var p = 0x0, r, M, u = 0x0; M = K["charAt"](u++); ~M && (r = p % 0x4 ? r * 0x40 + M : M, p++ % 0x4) ? c += String["fromCharCode"](0xff & r >> (-0x2 * p & 0x6)) : 0x0) {
                    M = w["indexOf"](M);
                }
                for (var t = 0x0, W = c["length"]; t < W; t++) {
                    d += "%" + ("00" + c["charCodeAt"](t)["toString"](0x10))["slice"](-0x2);
                }
                return decodeURIComponent(d);
            };
            rzshy["IZHcQE"] = f, rzshy["zHFiNH"] = {}, rzshy["SfuXQw"] = !![];
        }
        var Y = U[0x0], m = G + Y, b = rzshy["zHFiNH"][m];
        return !b ? (k = rzshy["IZHcQE"](k), rzshy["zHFiNH"][m] = k) : k = b, k;
    }
    if (lib["config"]["mode"] == "versus" && lib["config"]["mode_config"]["versus"]["versus_mode"] == "two") {
        let rzshr, rzshM, rzshu, rzsht, rzshW, rzshe, rzshA, rzsha;
        function rzshp(G) {
            var D = rzshU;
            try {
                window["_rzsh_current"] = G;
                const y = "tianti_" + get[D(0x1db, "ekin")]() + "_" + _status["mode"];
                lib["config"][y] = Object["assign"]({}, G);
                if (window["_rzsh_seasonDB"]) {
                    const U = window["_rzsh_seasonDB"]["transaction"]("data", "readwrite");
                    U["objectStore"]("data")["put"](G, "current");
                }
            }
            catch (k) {
                console["warn"]("[rzsh] DB sync failed", k);
            }
        }
        function rzshd() { const G = window["_rzsh_current"] && window["_rzsh_current"]["xxingnum"] !== undefined ? window["_rzsh_current"] : lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]] || {}; rzshr = G["count"] || 0x0, rzshM = G["top"] || 0x28, rzshu = G["win"] || 0x0, rzsht = G["fail"] || 0x0, rzshW = G["num"] || 0x0, rzshe = G["top_win"] || 0x0, rzshA = G["win_Cty"] || 0x0, rzsha = G["xxingnum"] || 0x0; }
        function rzshc(k, f) {
            var J = rzshU;
            rzshw();
            let Y, m = 0x0;
            rzshr + k >= rzshM ? (Y = rzshr + k - rzshM, m++) : Y = Math["min"](rzshr + k, rzshM);
            var b = {};
            b["count"] = Y, b["top"] = rzshM, b["win"] = rzshu, b["fail"] = rzsht, b["num"] = rzshW, b["top_win"] = rzshe, b["win_Cty"] = rzshA, b["xxingnum"] = rzsha + m;
            if (!f || f == undefined)
                game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], b);
            else {
                var K = {};
                K["count"] = k, K["top"] = rzshM, K["win"] = rzshu, K["fail"] = rzsht, K["num"] = rzshW, K["top_win"] = rzshe, K["win_Cty"] = rzshA, K["xxingnum"] = rzsha, game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status[J(0x1d0, "^jaI")], K);
            }
            var w = {};
            w["name"] = window["_rzsh_current"] && window["_rzsh_current"]["name"] || "", rzshp(Object["assign"](w, lib["config"]["tianti_" + get["mode"]() + "_" + _status[J(0x1db, "ekin")]])), rzshw();
        }
        function rzshw() {
            var rzshH = { G: 0x1da }, i = rzshy, I = rzshU;
            rzshd();
            if (!lib["config"]["tianti_0星"]) {
                if (rzsha < 0x7)
                    rzshM = 0x28;
                else {
                    if (rzsha < 0x13)
                        rzshM = 0x41;
                    else {
                        if (rzsha < 0x2c)
                            rzshM = 0x64;
                        else {
                            if (rzsha < 0x45)
                                rzshM = 0xfa;
                            else {
                                if (rzsha < 0x63)
                                    rzshM = 0x190;
                                else {
                                    if (rzsha >= 0x63)
                                        rzshM = 0x226;
                                }
                            }
                        }
                    }
                }
            }
            else {
                if (rzsha < 0x6)
                    rzshM = 0x28;
                else {
                    if (rzsha < 0x12)
                        rzshM = 0x41;
                    else {
                        if (rzsha < 0x2b)
                            rzshM = 0x64;
                        else {
                            if (rzsha < 0x44)
                                rzshM = 0xfa;
                            else {
                                if (rzsha < 0x61)
                                    rzshM = 0x190;
                                else {
                                    if (rzsha >= 0x62)
                                        rzshM = 0x226;
                                }
                            }
                        }
                    }
                }
            }
            var U = {};
            U["count"] = rzshr, U["top"] = rzshM, U["win"] = rzshu, U["fail"] = rzsht, U["num"] = rzshW, U["top_win"] = rzshe, U["win_Cty"] = rzshA, U[I(0x1c4, "8QfT")] = rzsha, game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status[i(rzshH.G)], U);
            var k = {};
            k["name"] = window["_rzsh_current"] && window["_rzsh_current"]["name"] || "", rzshp(Object["assign"](k, lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]])), rzshd();
        }
        function rzshK(k, f) {
            var g = rzshy, T = rzshU;
            rzshw();
            var Y = {};
            Y["count"] = rzshr, Y["top"] = rzshM, Y["win"] = rzshu + k, Y["fail"] = rzsht, Y["num"] = rzshW, Y[T(0x1cf, "%)NG")] = rzshe, Y["win_Cty"] = rzshA, Y["xxingnum"] = rzsha;
            if (!f || f == undefined)
                game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], Y);
            else {
                var m = {};
                m["count"] = rzshr, m["top"] = rzshM, m[g(0x1c5)] = k, m["fail"] = rzsht, m["num"] = rzshW, m["top_win"] = rzshe, m["win_Cty"] = rzshA, m["xxingnum"] = rzsha, game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status[T(0x1ce, "f)hC")], m);
            }
            var b = {};
            b["name"] = window["_rzsh_current"] && window["_rzsh_current"]["name"] || "", rzshp(Object["assign"](b, lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]])), rzshw();
        }
        function rzshb(k, f) {
            var B = rzshU;
            rzshw();
            var Y = {};
            Y["count"] = rzshr, Y["top"] = rzshM, Y["win"] = rzshu, Y["fail"] = rzsht + k, Y["num"] = rzshW, Y["top_win"] = rzshe, Y["win_Cty"] = rzshA, Y["xxingnum"] = rzsha;
            if (!f || f == undefined)
                game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], Y);
            else {
                var m = {};
                m["count"] = rzshr, m[B(0x1d8, "ksgJ")] = rzshM, m["win"] = rzshu, m["fail"] = k, m["num"] = rzshW, m["top_win"] = rzshe, m["win_Cty"] = rzshA, m["xxingnum"] = rzsha, game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], m);
            }
            var b = {};
            b["name"] = window["_rzsh_current"] && window["_rzsh_current"]["name"] || "", rzshp(Object["assign"](b, lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]])), rzshw();
        }
        function rzshm(k, f) {
            rzshw();
            var Y = {};
            Y["count"] = rzshr, Y["top"] = rzshM, Y["win"] = rzshu, Y["fail"] = rzsht, Y["num"] = rzshW + k, Y["top_win"] = rzshe, Y["win_Cty"] = rzshA, Y["xxingnum"] = rzsha;
            if (!f || f == undefined)
                game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], Y);
            else {
                var m = {};
                m["count"] = rzshr, m["top"] = rzshM, m["win"] = rzshu, m["fail"] = rzsht, m["num"] = k, m["top_win"] = rzshe, m["win_Cty"] = rzshA, m["xxingnum"] = rzsha, game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], m);
            }
            var b = {};
            b["name"] = window["_rzsh_current"] && window["_rzsh_current"]["name"] || "", rzshp(Object["assign"](b, lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]])), rzshw();
        }
        function rzshY(k, f) {
            var q = rzshU;
            rzshw();
            var Y = {};
            Y["count"] = rzshr, Y[q(0x1d9, "x$Gt")] = rzshM, Y["win"] = rzshu, Y["fail"] = rzsht, Y["num"] = rzshW, Y["top_win"] = rzshe + k, Y["win_Cty"] = rzshA, Y["xxingnum"] = rzsha;
            if (!f || f == undefined)
                game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], Y);
            else {
                var m = {};
                m["count"] = rzshr, m["top"] = rzshM, m["win"] = rzshu, m["fail"] = rzsht, m["num"] = rzshW, m["top_win"] = k, m["win_Cty"] = rzshA, m["xxingnum"] = rzsha, game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], m);
            }
            var b = {};
            b["name"] = window["_rzsh_current"] && window["_rzsh_current"]["name"] || "", rzshp(Object["assign"](b, lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]])), rzshw();
        }
        function rzshf(k, f) {
            var n = rzshy;
            rzshd();
            var Y = {};
            Y["count"] = rzshr, Y["top"] = rzshM, Y["win"] = rzshu, Y["fail"] = rzsht, Y["num"] = rzshW, Y["top_win"] = rzshe, Y["win_Cty"] = rzshA + k, Y["xxingnum"] = rzsha;
            if (!f || f == undefined)
                game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], Y);
            else {
                var m = {};
                m["count"] = rzshr, m[n(0x1cc)] = rzshM, m["win"] = rzshu, m["fail"] = rzsht, m["num"] = rzshW, m["top_win"] = rzshe, m["win_Cty"] = k, m["xxingnum"] = rzsha, game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], m);
            }
            var b = {};
            b["name"] = window["_rzsh_current"] && window["_rzsh_current"]["name"] || "", rzshp(Object["assign"](b, lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]])), rzshd();
        }
        function rzshk(k, f) {
            var Z = rzshU;
            rzshw();
            var Y = {};
            Y["count"] = rzshr, Y["top"] = rzshM, Y["win"] = rzshu, Y["fail"] = rzsht, Y["num"] = rzshW, Y["top_win"] = rzshe, Y["win_Cty"] = rzshA, Y["xxingnum"] = rzsha + k;
            if (!f || f == undefined)
                game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], Y);
            else {
                var m = {};
                m["count"] = rzshr, m["top"] = rzshM, m["win"] = rzshu, m["fail"] = rzsht, m["num"] = rzshW, m["top_win"] = rzshe, m["win_Cty"] = rzshA, m["xxingnum"] = k, game["saveConfig"](Z(0x1ca, "HAV7") + get["mode"]() + "_" + _status["mode"], m);
            }
            var b = {};
            b["name"] = window["_rzsh_current"] && window["_rzsh_current"]["name"] || "", rzshp(Object["assign"](b, lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]])), rzshw();
        }
        lib["onover"]["push"](function (y) {
            var z = rzshy;
            if (!lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]] || !lib["config"]["tianti_" + get["mode"]() + "_" + _status["mode"]]["xxingnum"]) {
                var U = {};
                U["count"] = 0x0, U["top"] = 0x28, U["win"] = 0x0, U["fail"] = 0x0, U["num"] = 0x0, U["top_win"] = 0x0, U["win_Cty"] = 0x0, U["xxingnum"] = 0x0, game["saveConfig"]("tianti_" + get["mode"]() + "_" + _status["mode"], U);
            }
            ;
            var k = (window["_rzsh_current"] && window["_rzsh_current"]["xxingnum"] !== undefined ? window[z(0x1c8)] : lib["config"]["tianti_versus_two"] || {})["top"] || 0x0;
            game["saveConfig"]("currentShiQiTop", k);
            var f = (window["_rzsh_current"] && window["_rzsh_current"]["xxingnum"] !== undefined ? window["_rzsh_current"] : lib["config"]["tianti_versus_two"] || {})["count"] || 0x0;
            game["saveConfig"]("currentShiQiCount", f);
            function Y(c) {
                if (!lib["config"]["tianti_0星"]) {
                    if (c < 0x7)
                        return "青铜";
                    else {
                        if (c < 0x13)
                            return "白银";
                        else {
                            if (c < 0x2c)
                                return "黄金";
                            else {
                                if (c < 0x45)
                                    return "翡翠";
                                else
                                    return c < 0x63 ? "大师" : "传说";
                            }
                        }
                    }
                }
                else {
                    if (c < 0x6)
                        return "青铜";
                    else {
                        if (c < 0x12)
                            return "白银";
                        else {
                            if (c < 0x2b)
                                return "黄金";
                            else {
                                if (c < 0x44)
                                    return "翡翠";
                                else
                                    return c < 0x62 ? "大师" : "传说";
                            }
                        }
                    }
                }
            }
            function m(c) {
                let d, p;
                if (!lib["config"]["tianti_0星"]) {
                    if (c < 0x1)
                        d = 0x0, p = 0x2;
                    else {
                        if (c < 0x7)
                            d = (c - 0x1) % 0x2 + 0x1, p = 0x2;
                        else {
                            if (c < 0x13)
                                d = (c - 0x7) % 0x4 + 0x1, p = 0x4;
                            else {
                                if (c < 0x2c)
                                    d = (c - 0x13) % 0x5 + 0x1, p = 0x5;
                                else {
                                    if (c < 0x45)
                                        d = (c - 0x2c) % 0x5 + 0x1, p = 0x5;
                                    else
                                        c < 0x63 ? (d = (c - 0x45) % 0x5 + 0x1, p = 0x5) : (d = c - 0x62, p = 0x3e8);
                                }
                            }
                        }
                    }
                }
                else {
                    if (c < 0x1)
                        d = 0x0, p = 0x2;
                    else {
                        if (c < 0x6)
                            d = (c - 0x1) % 0x2 + 0x1, p = 0x2;
                        else {
                            if (c < 0x12) {
                                d = (c - 0x6) % 0x4 + 0x1;
                                if (c == 0x6 || c == 0xa || c == 0xe)
                                    d = 0x0;
                                p = 0x4;
                            }
                            else {
                                if (c < 0x2b) {
                                    d = (c - 0x12) % 0x5 + 0x1;
                                    if (c == 0x12 || c == 0x17 || c == 0x1c || c == 0x21 || c == 0x26)
                                        d = 0x0;
                                    p = 0x5;
                                }
                                else {
                                    if (c < 0x44) {
                                        d = (c - 0x2b) % 0x5 + 0x1;
                                        if (c == 0x2b || c == 0x30 || c == 0x35 || c == 0x3a || c == 0x3f)
                                            d = 0x0;
                                        p = 0x5;
                                    }
                                    else {
                                        if (c < 0x62) {
                                            d = (c - 0x44) % 0x5 + 0x1;
                                            if (c == 0x44 || c == 0x49 || c == 0x4e || c == 0x53 || c == 0x58 || c == 0x5d)
                                                d = 0x0;
                                            p = 0x5;
                                        }
                                        else
                                            d = c - 0x62, p = 0x3e8;
                                    }
                                }
                            }
                        }
                    }
                }
                return [d, p];
            }
            function b(c) {
                let d = Y(c), p;
                if (d === "传说")
                    p = "传说Ⅰ";
                else {
                    let r;
                    if (!lib["config"]["tianti_0星"]) {
                        if (c < 0x3)
                            r = "Ⅲ";
                        else {
                            if (c < 0x5)
                                r = "Ⅱ";
                            else {
                                if (c < 0x7)
                                    r = "Ⅰ";
                                else {
                                    if (c < 0xb)
                                        r = "Ⅲ";
                                    else {
                                        if (c < 0xf)
                                            r = "Ⅱ";
                                        else {
                                            if (c < 0x13)
                                                r = "Ⅰ";
                                            else {
                                                if (c < 0x18)
                                                    r = "Ⅴ";
                                                else {
                                                    if (c < 0x1d)
                                                        r = "Ⅳ";
                                                    else {
                                                        if (c < 0x22)
                                                            r = "Ⅲ";
                                                        else {
                                                            if (c < 0x27)
                                                                r = "Ⅱ";
                                                            else {
                                                                if (c < 0x2c)
                                                                    r = "Ⅰ";
                                                                else {
                                                                    if (c < 0x31)
                                                                        r = "Ⅴ";
                                                                    else {
                                                                        if (c < 0x36)
                                                                            r = "Ⅳ";
                                                                        else {
                                                                            if (c < 0x3b)
                                                                                r = "Ⅲ";
                                                                            else {
                                                                                if (c < 0x40)
                                                                                    r = "Ⅱ";
                                                                                else {
                                                                                    if (c < 0x45)
                                                                                        r = "Ⅰ";
                                                                                    else {
                                                                                        if (c < 0x4a)
                                                                                            r = "Ⅵ";
                                                                                        else {
                                                                                            if (c < 0x4f)
                                                                                                r = "Ⅴ";
                                                                                            else {
                                                                                                if (c < 0x54)
                                                                                                    r = "Ⅳ";
                                                                                                else {
                                                                                                    if (c < 0x59)
                                                                                                        r = "Ⅲ";
                                                                                                    else {
                                                                                                        if (c < 0x5e)
                                                                                                            r = "Ⅱ";
                                                                                                        else {
                                                                                                            if (c < 0x63)
                                                                                                                r = "Ⅰ";
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (c < 0x3)
                            r = "Ⅲ";
                        else {
                            if (c < 0x5)
                                r = "Ⅱ";
                            else {
                                if (c < 0x6)
                                    r = "Ⅰ";
                                else {
                                    if (c < 0xa)
                                        r = "Ⅲ";
                                    else {
                                        if (c < 0xe)
                                            r = "Ⅱ";
                                        else {
                                            if (c < 0x12)
                                                r = "Ⅰ";
                                            else {
                                                if (c < 0x17)
                                                    r = "Ⅴ";
                                                else {
                                                    if (c < 0x1c)
                                                        r = "Ⅳ";
                                                    else {
                                                        if (c < 0x21)
                                                            r = "Ⅲ";
                                                        else {
                                                            if (c < 0x26)
                                                                r = "Ⅱ";
                                                            else {
                                                                if (c < 0x2b)
                                                                    r = "Ⅰ";
                                                                else {
                                                                    if (c < 0x30)
                                                                        r = "Ⅴ";
                                                                    else {
                                                                        if (c < 0x35)
                                                                            r = "Ⅳ";
                                                                        else {
                                                                            if (c < 0x3a)
                                                                                r = "Ⅲ";
                                                                            else {
                                                                                if (c < 0x3f)
                                                                                    r = "Ⅱ";
                                                                                else {
                                                                                    if (c < 0x44)
                                                                                        r = "Ⅰ";
                                                                                    else {
                                                                                        if (c < 0x49)
                                                                                            r = "Ⅵ";
                                                                                        else {
                                                                                            if (c < 0x4e)
                                                                                                r = "Ⅴ";
                                                                                            else {
                                                                                                if (c < 0x53)
                                                                                                    r = "Ⅳ";
                                                                                                else {
                                                                                                    if (c < 0x58)
                                                                                                        r = "Ⅲ";
                                                                                                    else {
                                                                                                        if (c < 0x5d)
                                                                                                            r = "Ⅱ";
                                                                                                        else {
                                                                                                            if (c < 0x62)
                                                                                                                r = "Ⅰ";
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    p = r;
                }
                return d === "传说" ? p : "" + d + p;
            }
            game["saveConfig"]("currenVersusZhuName", Y((window["_rzsh_current"] && window["_rzsh_current"]["xxingnum"] !== undefined ? window["_rzsh_current"] : lib["config"]["tianti_versus_two"] || {})["xxingnum"])), game["saveConfig"]("currenVersusName", b((window["_rzsh_current"] && window["_rzsh_current"]["xxingnum"] !== undefined ? window["_rzsh_current"] : lib["config"][z(0x1c3)] || {})["xxingnum"])), game["saveConfig"]("currentStarNum", (window["_rzsh_current"] && window["_rzsh_current"]["xxingnum"] !== undefined ? window[z(0x1c8)] : lib["config"]["tianti_versus_two"] || {})["xxingnum"]), game["saveConfig"]("currenHasFilledStar", m((window["_rzsh_current"] && window["_rzsh_current"]["xxingnum"] !== undefined ? window["_rzsh_current"] : lib["config"]["tianti_versus_two"] || {})["xxingnum"])[0x0]), game["saveConfig"]("currenHasEmptyStar", m((window["_rzsh_current"] && window["_rzsh_current"]["xxingnum"] !== undefined ? window["_rzsh_current"] : lib["config"]["tianti_versus_two"] || {})["xxingnum"])[0x1]), rzshw(), rzshm(0x1);
            if (y == !![]) {
                rzshk(0x1), rzshw(), rzshK(0x1), rzshf(0x1), game["saveConfig"]("tianti_0星", ![]);
                if (rzsha < 0x7) {
                    if (rzshr < rzshM) {
                        var K = get["rand"](0x15, 0x1a);
                        _status["temp_排位"] = K, rzshc(K);
                    }
                    else
                        rzshc(0x0, !![]), rzshk(0x1);
                }
                else {
                    if (rzsha >= 0x7 && rzsha < 0x13) {
                        if (rzshr < rzshM) {
                            var K = get["rand"](0x15, 0x1a);
                            _status["temp_排位"] = K, rzshc(K);
                        }
                        else
                            rzshc(0x0, !![]), rzshk(0x1);
                    }
                    else {
                        if (rzsha >= 0x13 && rzsha < 0x2c) {
                            if (rzshr < rzshM) {
                                var K = get["rand"](0x14, 0x19);
                                _status["temp_排位"] = K, rzshc(K);
                            }
                            else
                                rzshc(0x0, !![]), rzshk(0x1);
                        }
                        else {
                            if (rzsha >= 0x2c && rzsha < 0x45) {
                                if (rzshr < rzshM) {
                                    var K = get["rand"](0x13, 0x18);
                                    _status["temp_排位"] = K, rzshc(K);
                                }
                                else
                                    rzshc(0x0, !![]), rzshk(0x1);
                            }
                            else {
                                if (rzsha >= 0x45 && rzsha < 0x63) {
                                    if (rzshr < rzshM) {
                                        var K = get[z(0x1c6)](0x13, 0x18);
                                        _status["temp_排位"] = K, rzshc(K);
                                    }
                                    else
                                        rzshc(0x0, !![]), rzshk(0x1);
                                }
                                else {
                                    if (rzsha >= 0x63) {
                                        if (rzshr < rzshM) {
                                            var K = get["rand"](0x10, 0x15);
                                            _status["temp_排位"] = K, rzshc(K);
                                        }
                                        else
                                            rzshc(0x0, !![]), rzshk(0x1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                if (rzsha < 0x7) {
                    if (rzshr < rzshM) {
                        var K = get["rand"](0xa, 0xd);
                        _status["temp_排位"] = K, rzshc(K);
                    }
                }
                else {
                    if (rzsha >= 0x7 && rzsha < 0x13) {
                        if (rzshr < rzshM / 0x3) {
                            var K = get["rand"](0xa, 0xd);
                            _status["temp_排位"] = K, rzshc(K), rzshk(-0x1), game["saveConfig"]("tianti_0星", ![]);
                            if (rzsha == 0x6 || rzsha == 0xa || rzsha == 0xe)
                                game["saveConfig"]("tianti_0星", !![]);
                        }
                        else
                            rzshc(0x0, !![]);
                    }
                    else {
                        if (rzsha >= 0x13 && rzsha < 0x2c) {
                            if (rzshr < rzshM / 0x3) {
                                var K = get["rand"](0xa, 0xc);
                                _status["temp_排位"] = K, rzshc(K), rzshk(-0x1), game["saveConfig"]("tianti_0星", ![]);
                                if (rzsha == 0x12 || rzsha == 0x17 || rzsha == 0x1c || rzsha == 0x21 || rzsha == 0x26)
                                    game["saveConfig"]("tianti_0星", !![]);
                            }
                            else
                                rzshc(0x0, !![]);
                        }
                        else {
                            if (rzsha >= 0x2c && rzsha < 0x45) {
                                if (rzshr < rzshM / 0x3) {
                                    var K = get["rand"](0xa, 0xc);
                                    _status["temp_排位"] = K, rzshc(K), rzshk(-0x1), game["saveConfig"]("tianti_0星", ![]);
                                    if (rzsha == 0x2b || rzsha == 0x30 || rzsha == 0x35 || rzsha == 0x3a || rzsha == 0x3f)
                                        game["saveConfig"]("tianti_0星", !![]);
                                }
                                else
                                    rzshc(0x0, !![]);
                            }
                            else {
                                if (rzsha >= 0x45 && rzsha < 0x63) {
                                    if (rzshr < rzshM / 0x3) {
                                        var K = get["rand"](0x9, 0xc);
                                        _status["temp_排位"] = K, rzshc(K), rzshk(-0x1), game["saveConfig"]("tianti_0星", ![]);
                                        if (rzsha == 0x44 || rzsha == 0x49 || rzsha == 0x4e || rzsha == 0x53 || rzsha == 0x58 || rzsha == 0x5d)
                                            game["saveConfig"]("tianti_0星", !![]);
                                    }
                                    else
                                        rzshc(0x0, !![]);
                                }
                                else {
                                    if (rzsha >= 0x63) {
                                        if (rzshr < rzshM) {
                                            var K = get["rand"](0x8, 0xb);
                                            _status["temp_排位"] = K, rzshc(K), rzshk(-0x1), game["saveConfig"]("tianti_0星", ![]);
                                            if (rzsha == 0x62)
                                                game["saveConfig"]("tianti_0星", !![]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                rzshb(0x1), rzshw(), rzshf(0x0, !![]);
            }
            ;
            rzshw();
            let w = Math["max"](rzshe, rzshA);
            rzshY(w, !![]);
            ;
        });
    }
};
export function createScene(lib, game, ui, get, ai, _status, node, lifecycle) {
    const PIXI = lifecycle.pixi;
    let spinelo, homeskel_fg, homeskel_lb;
    const gsap = lifecycle.animation, setTimeout = lifecycle.timeout.bind(lifecycle), setInterval = lifecycle.interval.bind(lifecycle), requestAnimationFrame = lifecycle.frame.bind(lifecycle);
    const rzshbm = rzshU, rzshbY = rzshy;
    (function (G, y) {
        const rzshwX = { G: "sxFt" }, bf = rzshU, bk = rzshy, U = G();
        while (!![]) {
            try {
                const k = -parseInt(bk(0x1cf)) / 0x1 + parseInt(bk(0x263)) / 0x2 + -parseInt(bk(0x29c)) / 0x3 * (parseInt(bk(0x1a7)) / 0x4) + -parseInt(bf(0x21c, "v*9j")) / 0x5 * (parseInt(bf(0x2a4, "SdeW")) / 0x6) + -parseInt(bf(0x2ae, "!2E0")) / 0x7 * (parseInt(bk(0x262)) / 0x8) + parseInt(bk(0x2e3)) / 0x9 * (parseInt(bf(0x208, rzshwX.G)) / 0xa) + parseInt(bk(0x2ac)) / 0xb;
                if (k === y)
                    break;
                else
                    U["push"](U["shift"]());
            }
            catch (f) {
                U["push"](U["shift"]());
            }
        }
    }(rzshG, 0x25fc6));
    const rzshy3 = {};
    rzshy3["x"] = 0xac, rzshy3["y"] = 0xa, rzshy3["scale"] = 0.68;
    const rzshy4 = {};
    rzshy4["x"] = 0x133, rzshy4["y"] = 0xa, rzshy4["scale"] = 0.68;
    const rzshy5 = {};
    rzshy5["x"] = 0xad, rzshy5["y"] = 0xa, rzshy5["scale"] = 0.67;
    const rzshy6 = {};
    rzshy6["x"] = 0x49, rzshy6["y"] = 0x71, rzshy6["scale"] = 0.9;
    const rzshy7 = {};
    rzshy7["x"] = 0xda, rzshy7["y"] = 0x2b, rzshy7["scale"] = 0.69;
    const rzshy8 = {};
    rzshy8["x"] = 0x3, rzshy8["y"] = 0x3f, rzshy8["scale"] = 0.8;
    const rzshy9 = {};
    rzshy9["x"] = 0x118, rzshy9["y"] = 0x37, rzshy9["scale"] = 0.7;
    const rzshyG = {};
    rzshyG["x"] = 0x4a, rzshyG["y"] = 0x7f, rzshyG["scale"] = 0.69;
    const rzshyy = {};
    rzshyy["x"] = 0x0, rzshyy["y"] = 0x0, rzshyy["scale"] = 0.69;
    const rzshyU = {};
    rzshyU["x"] = 0x0, rzshyU["y"] = 0x0, rzshyU[rzshbm(0x14c, "TK2T")] = 0.69;
    const rzshyk = {};
    rzshyk["x"] = 0x0, rzshyk["y"] = 0x0, rzshyk["scale"] = 0.69;
    const rzshyf = {};
    rzshyf["x"] = 0x2, rzshyf["y"] = 0xda, rzshyf["scale"] = 0.69;
    const rzshyY = {};
    rzshyY["x"] = 0x144, rzshyY["y"] = 0xa, rzshyY["scale"] = 0.7;
    const rzshym = {};
    rzshym["x"] = 0x167, rzshym["y"] = 0xf, rzshym["scale"] = 0.7;
    function rzshy(G, y) {
        G = G - 0x147;
        const U = rzshG();
        let k = U[G];
        if (rzshy["wBYQNC"] === undefined) {
            var f = function (K) {
                const w = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
                let c = "", d = "";
                for (let p = 0x0, r, M, u = 0x0; M = K["charAt"](u++); ~M && (r = p % 0x4 ? r * 0x40 + M : M, p++ % 0x4) ? c += String["fromCharCode"](0xff & r >> (-0x2 * p & 0x6)) : 0x0) {
                    M = w["indexOf"](M);
                }
                for (let t = 0x0, W = c["length"]; t < W; t++) {
                    d += "%" + ("00" + c["charCodeAt"](t)["toString"](0x10))["slice"](-0x2);
                }
                return decodeURIComponent(d);
            };
            rzshy["PovSGk"] = f, rzshy["aflukT"] = {}, rzshy["wBYQNC"] = !![];
        }
        const Y = U[0x0], m = G + Y, b = rzshy["aflukT"][m];
        return !b ? (k = rzshy["PovSGk"](k), rzshy["aflukT"][m] = k) : k = b, k;
    }
    const rzshyb = {};
    rzshyb["x"] = 0x423, rzshyb["y"] = 0.5, rzshyb["scale"] = 0.7;
    const rzshyK = {};
    function rzshU(G, y) {
        G = G - 0x147;
        const U = rzshG();
        let k = U[G];
        if (rzshU["axoiUp"] === undefined) {
            var f = function (w) {
                const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
                let d = "", p = "";
                for (let r = 0x0, M, u, t = 0x0; u = w["charAt"](t++); ~u && (M = r % 0x4 ? M * 0x40 + u : u, r++ % 0x4) ? d += String["fromCharCode"](0xff & M >> (-0x2 * r & 0x6)) : 0x0) {
                    u = c["indexOf"](u);
                }
                for (let W = 0x0, e = d["length"]; W < e; W++) {
                    p += "%" + ("00" + d["charCodeAt"](W)["toString"](0x10))["slice"](-0x2);
                }
                return decodeURIComponent(p);
            };
            const K = function (w, c) {
                let d = [], p = 0x0, r, M = "";
                w = f(w);
                let u;
                for (u = 0x0; u < 0x100; u++) {
                    d[u] = u;
                }
                for (u = 0x0; u < 0x100; u++) {
                    p = (p + d[u] + c["charCodeAt"](u % c["length"])) % 0x100, r = d[u], d[u] = d[p], d[p] = r;
                }
                u = 0x0, p = 0x0;
                for (let t = 0x0; t < w["length"]; t++) {
                    u = (u + 0x1) % 0x100, p = (p + d[u]) % 0x100, r = d[u], d[u] = d[p], d[p] = r, M += String["fromCharCode"](w["charCodeAt"](t) ^ d[(d[u] + d[p]) % 0x100]);
                }
                return M;
            };
            rzshU["RUQmWT"] = K, rzshU["asNVFs"] = {}, rzshU["axoiUp"] = !![];
        }
        const Y = U[0x0], m = G + Y, b = rzshU["asNVFs"][m];
        return !b ? (rzshU["kfwJcX"] === undefined && (rzshU["kfwJcX"] = !![]), k = rzshU["RUQmWT"](k, y), rzshU["asNVFs"][m] = k) : k = b, k;
    }
    rzshyK["x"] = 0x423, rzshyK["y"] = 0x1d6, rzshyK["scale"] = 0.7;
    const rzshyw = {};
    rzshyw["x"] = 0x96, rzshyw["y"] = 0xa, rzshyw["scale"] = 0x1;
    const rzshyc = {};
    rzshyc["x"] = 0x0, rzshyc["y"] = -0x5, rzshyc["scale"] = 0.64;
    const rzshyd = {};
    rzshyd["x"] = 0x0, rzshyd["y"] = -0x5, rzshyd["scale"] = 0.64;
    const rzshyp = {};
    rzshyp["x"] = 0x0, rzshyp["y"] = -0x5, rzshyp["scale"] = 0.64;
    const rzshyr = {};
    rzshyr["x"] = 0x40c, rzshyr["y"] = 0x43, rzshyr["scale"] = 0.69;
    const rzshyM = {};
    rzshyM["x"] = 0x3d, rzshyM["y"] = 0x2b, rzshyM["scale"] = 0x1;
    const rzshyu = {};
    rzshyu["x"] = 0x0, rzshyu["y"] = 0x0, rzshyu["scale"] = 0x1;
    const rzshyt = {};
    rzshyt["x"] = 0x0, rzshyt["y"] = 0xa, rzshyt["scale"] = 0.81;
    const rzshyW = {};
    rzshyW["x"] = 0x0, rzshyW["y"] = 0x0, rzshyW["scale"] = 0.74;
    const rzshye = {};
    rzshye["x"] = 0x0, rzshye["y"] = 0x12, rzshye["scale"] = 0.54;
    const rzshyA = {};
    rzshyA["x"] = 0x0, rzshyA["y"] = 0x0, rzshyA["scale"] = 0.74;
    const rzshya = {};
    rzshya["x"] = 0x0, rzshya["y"] = 0x0, rzshya["scale"] = 0.74;
    const rzshyo = {};
    rzshyo["x"] = 0x0, rzshyo["y"] = 0x0, rzshyo["scale"] = 0.74;
    function rzshG() { const u3 = ["Cg9ZAxrPB24", "a8o8W4tcIqW", "tMLUzvnSAwnLugXHBMu", "t2RdMZC", "fxpcN8oJWRfVWRq", "zxH0zw5ZAw9UCW", "iM/dOv8", "qqCwWR3cOSkJW7pdMSoDwW", "C2nYB2XSyMfYqMfJA2DYB3vUzefSCgHH", "jqhcKSoXW4pcTKpdSSohb3RcT2VdKG", "xmkpWRSqgg0IW6C", "C2v0", "Cg93zxiYlMLUt3v0", "krldUmo2WP1m", "BgLUANu", "ie0rBYddKsqyrfZcGmkr", "odC0mZjiDfHfAe4", "z2v0rwXLBwvUDhncEunSyxnZtMfTzq", "yNvZAw5LC3nJyxjKx3rHCf9IzW", "aCkrmCkuhLRdUdGvsG", "y2vUDgvY", "qUERMEAqNca8C3bHBIbJBgfZCZ0ICNPZAenVChLuzxH0iJ7PNz7LH6hMRkFLVRFLHOxPH4W8l3nWyw4+ioI/M+IHJoABToAwSa", "DCo4W4NdLCkdWOS", "nxbQEG", "CgXHEwvK", "y3vZDg9Ty2fYzhbPBgu", "WQy2FSkyW4NdG8k2BCkNW5dcThldNSo6", "jmk6W6pcGrFcMmojzJJcRG", "57Yv57QZ6lYL5OY55AAt6lEN77YM6k2Q5QgP5P6X5zce6ysF6k+B", "xaSGWRBcPCkJ", "WOhdKmkwsgpdKW", "WO/cPSk1", "W7ldOXW", "v2LUqNv0Dg9U", "W6z5WOO", "t8kBWQSRkNGVW5m3wZLeE8k5gmoTWQK5g0qv", "W7zUWPTzWQXhESkkt2/dUmotkq", "vY3dJmk7W64T", "W7ddSN/cRW", "mCk2qmoRW6tdUazVxa", "qWCTWQxcPq", "zhvYyxrPB24", "fM5S", "e8oNW4VcMWddGa", "W7ddNGXqWPnMrmk+ndjMySkRWOi", "W7PuW7TJWQxdOW", "5RsB5Rc056wE6z+1WRFNLitLP6WQmE+8IowkQcVPNzNVViK", "CwLQAwfUzW", "oMVdVfb5sG", "C2nYzwvU", "zg91zgL6Ahu", "q29UDgfPBMvY", "xmo2WQbDCmk3WR4xl8o0", "d8kBnSkhme8", "wtroWRxcGSkLW4q", "WQtcICouWPZdRsPFWR/cOIm", "WR8QBraIW7NcGhFcNW", "W4NdQsXdW5mKWP/cOG", "C2nHBgu", "lKmhBG", "WR4PuSkcW4NdK8k1zG", "W5VdQsD9W44PWOtcPa", "C3rHCNrczwzVCMu", "CMvSB2fK", "WR/dSSkAiYZdUJSIW6aV", "W6bgW5RdRCki", "D3vQAwfUz2jHy2S", "wqeRWRJcOCkY", "vs/dHSkWW6O", "DwLFCgvYC29UDa", "W63dSeddPCoJ", "zwfZzq", "zgvZDhjVEq", "W7Hxj8kstSoVW4GJ", "W7DPWO1rWRzhtmkvswpdR8ozaLOFWQpdLSosWRWxWRe7", "CgvYC29Uv2fYv29YA19HBM5PDv8X", "W7HvW7zTWQpdTG", "WQdcH8ouWOBdJI9cWR/cOJ8", "Emkbp8kzhhRcT1HNWQqI", "nghdU0nxx8otEmopDW", "WOddKdC/", "o8kute7dTSkYW79IWRbrrH/dIW", "6Bkl5lQA5AQzWOe4", "F8o6W6S/AgDqWQPhrvpcMG", "W6v5WOXlWRDmAmkhwfxdSSopnNeCWRtcVW", "W7qHF8oMW5a", "waSNWRBcUCk/", "lMnHCMqUAw5MB2HPzgrLBJPUB3qOlMLUzM9MBgLWkxTIywnRz3jVDw5KlwLTywDLoNvYBcG", "t3xdGc1fW7ukWOPk", "iZvfndiYqq", "DgfYz2v0", "AMPFz3jHzgvFzMvPy3vP", "BMvP", "o8ovzmohxYBdHhTgWP0FW7iw", "CgXHEwvYx3n0EwXLC2HLzxq", "Dg9gAxHLza", "WQNdUmkgjaxdTqeQW74bt8kVb8kZwsa4omkwWPO", "gsHCWPNdNt4", "xuJdOW", "oSkKWQ9+WPCQW64", "y2HHCMfJDgvYCW", "WOddLJuNvKiyW5xdJmoA", "WQ3dUmkmiX/dQtm", "6lQR5lU95zY6", "EMHVBMC", "yxv0B0rLBNnPDhK", "WOVdKmoMW5lcUG", "wCkbWQCadM0SW6u4tq", "562j5OIr5zAD5y+J6yws", "WQ4UBbS", "nCkTW6ZcSH4", "y2f0y2G", "CNPZAg11C2LJ", "AMjNC2HHzg93", "AgvPz2H0", "zg9JDw1LBNrAB29T", "DSkjWOvtWRD3", "DwLcrW", "W6xdQqTUWRldJ8oDWP56FCoNWPjzW65K", "Aw5PDa", "B2zMAwnPywXIzW", "W6z0WPfnWQTkxG", "zwXLBwvUDa", "BM9Uzq", "lNj6C2HvCgrHDgvjBMzVvgL0Bgu", "WONcQSkEpSoE", "C3bLzwq", "W7vxW43dVG", "Dgv4DhvYzq", "W7zDW5ZdUSkmWR4", "uSo2W7KI", "W6NdTLhdV8oV", "WRT0WO4cWRzns8oobhBdUmofkqDeWR3dPSodW7LjWQqHBCoCCgr5WOpdKCkAdmkTWO8lzSkvW6zLWOHpqSoseSkDW5dcLavpWRyWW7tdKSkSF3tdI3FcRtHzWO3dTCkmWQXkBCouj8oNWPhcKsqgWRBdQ8o4W7ykhCkYqmkRWOvvWR3cSdJdJq", "iSkIwSoUW73dPHv3vSorWRSeW73cPG", "W6jFW4pdUSk7WRxcJwOcW4m", "zM9UDezHBwLSEq", "uCkpWQqr", "W64mlJXNW4JdKW", "fmkBkW", "WQC1ymkzW4/dM8kJ", "CMvZDwX0", "AmoCW7vE", "vqOTWRtcQq", "u3bPBMu", "iSkOvW", "zMLSBa", "y2HHCMfJDgvYugfJAW", "WPZdNmkGq2tdK0a6rGrkj8ohWQuoxb5Rea", "v+wkLEI/SowSOUATIq", "C2TPBgW", "y2fYzfbHy2S", "DwLFCgvYC29U", "y8kknSkteLdcKG", "zxH0CMfFBw9IAwXLCMvU", "WOFdNt8", "iemnBrNdLW", "yM9KEq", "csrtWPpdKq", "y2HHCMfJDgvYu29YDa", "WRuvWPdcLfpcMIS", "D2LU", "W7hdQGL4WRRdGSoCWOzBDmoW", "W6JdUM/cOSkoer1m", "mtm1mLvOC1zfwa", "mtK1nJq2q01eq1vS", "zxjQAwfUzW", "W63dOYDE", "WPxdMJO/Dq", "AgLKzgvUq2HHCMfJDgvYCW", "C3r5Bgu", "s1xdOW7dT8ohWRTuzW", "W7pdHrzuWPX3xSkIoqbKy8krWOtdVmoqWQldPJO", "W6hdT2/cHmkwgrjd", "pCkyz33dU8kPW6bPWPC", "WQmPrCko", "pMVdOun0tmoTyCocBCk9dfm", "meKx", "zSoCW79DdCoe", "5BE+5BI86iQX6iIEWRFPQAZKUPhNPOqQmE+8IowkQcVPNzNVViK", "i0mWqZbdma", "W6JdQbX+WQ3dI8oqWP5wz8oN", "AhbFC3r5BguZ", "D8o5W4tdK8kjWPRcMW", "Dg91y2HZy3jLzw4", "vgv4Da", "WOVdHCo3", "W7zZWPbmWRLluCkv", "W6hdVwlcQSkFbbDiWOJdImokW5S1dW", "WOZdJ8oZ", "Bw9Kzq", "BwvUDv9ZDhLSzq", "vWyOWQpcKSkWW7xdNSolr1i1W4nJibVdQqm", "naRcICoVW43cRf3dVmoBnM3dOa", "jmkEwM/dP8keW7bPWOS", "W6K7zW", "x3j6C2HFDgHLBwvmB2nRzwq", "ec5CWPJdJJhcVa", "yNrUx25LDW", "nWZcICo5W4FcRa", "WRNdHmoPW4lcRCkgDZ1XqgxcVSoTWQjFW7a", "wIRdNmkN", "6jgJ5ywbW5CX", "DgLHBNrPxZdMMj8", "kq7cKSoVW5FcQ1NdTSomoa", "BgvUz3rO", "CMLNAhq", "BmkoWOftWRT2W54RWPum", "WQK9Cq8eW6pcGNBcGYa", "emk8qCoQW6JdTW", "Bw9Kzv9KzxjPDMf0Aw9U", "ywrKq2HPBgq", "W63dUKe", "c14nkbzrW6ddQSkg", "W7DBW4pdSmkFWRxcQ3mvW4NcUSoqWRzcgfFcQmk3WPe", "zSoZW5NdKSkzWOVcJmo0W7m", "WRVdVmkxpa3dQtK+W6iYyCkXhmkewq", "DwLSAwDODa", "zhjHz29U", "fmkfW6JcH8oewW", "C29YDa", "WQRdVSkgmG/dTq", "nLfKA1rSBq", "emkUBdhcSCkd", "zeBdNSolW79RBCkArmktxmo+W7ZcQmof", "WQKGFqO6W67cJwBcTJJcSCos", "de0llq12W73dR8keWONdNfpcNHKsc8oIo3K", "W5xdOXbV", "5lIa5B6a5PEG5yMnWRFOOOhNU40QmE+8IowkQcVPNzNVViK", "BfNdVCogW70", "FSkYE3ZdQ8klW4a", "CMvTB3zL", "WRpdRr1+ka", "fSk5DJlcTSkxACkmW6pcQ+wMOEECQUs/MEw4RSkCWPe6W7niW7hdQCoeWRBdJvPFWQiiAxFdJmkoj8kJtmkWW7xcTIuwxILjW6vtEmoAW6dcItasWRJcM8kaWOlcMaRdNCo4WP5FEq", "f8o9W4RcHWhdHSo2", "WORdMci8zvC", "Dg9tDhjPBMC", "usldGSk2W5m6W6FcUfbs", "nta5mZG0n1jKwxj3yq", "Cgf0Aa", "WOJcTMGEWPidWPVcN8kfBCkO", "cf8oaHb+W6xdOG", "WRZcMmoSWOZdOSo9W4TkmSkKWPW", "D2LKDgG", "pHZdPmo3WPfF", "bCkpW6VcJSoBwq", "j0KqFWldNZ4", "WPOxaCk9w8o8", "bviznq", "AgLKzgvUugXHEvbHy2S", "W6JdQXH0WQ3dNSowWO4", "AgfZt3DUuhjVCgvYDhK", "sSkhWPyelx4YW6m6qa", "CMvZB3vYy2vZ", "ywrKzwq", "BCodW45iemoArSoQW4RdNsBdQSohEq", "BCkfp8ktohRcL198WQW", "54MB5BM05lId5AsvWRFMRAxNU4pLUiJLIQJMGihLJiuQmE+8IowkQcVPNzNVViK", "CMvUzgvYzxi", "C3rHDgu", "W7HZWPfCWR0", "WQ3dUmkmiX/dQtm4", "CSoAW7vpda", "A8kcWOrtWQb2W64OWPKmtq", "WRJdUCkqmG4", "fCkOBJS", "pbFdRSosWPbrxsa", "mwldVfj/sSoN", "WQemASoMW6e", "WRKQzGSIW7NcHMe", "5A6H55IZvmkg", "y2X0x2X2BdnFyNrUx29MzG", "rtFdJSkHW7u", "iZuYnemZrq", "ubS7WRdcUCk+W6JdKq", "z8o9W6i+zNS", "jCkHW6pcUblcIq", "dSknhSkskLRdRa", "ntaW", "qaSXWQxcUmkLW6i", "yMfJA2DYB3vUza", "W7rYWP1qWRDq", "BMfTzq", "WQKQBbyHW6RcL3VcGZK", "y29UzMLN", "qSo7WQDvAmkMWQSqaSoD", "W6PsqCoGBmkQW6W", "vqOTWPlcPCk+W6VdMW", "rwZdGYPbW58mWQezWRFdMCoz", "WR3dVmkEpGVdTteHW7K4F8kTbCkp", "W6FdSMBcOSkSfr1iWPtdVW", "C2nYB2XSyMfYu2L6zq", "WQ0Pt8knW5tdNq", "mtG3ntaZm1P3BgvzAW", "W7ddLaf+WPP7qCk1", "ChvZAa", "WPeIW6W", "y2fYzhm", "yMfJA2DYB3vUzfbVC2L0Aw9U", "zhjVCfnOywrVD0jSDxi", "wMZdHs8", "lSkEvNNdMmk6W75VWPvg", "yM9ZCW", "W4NdOY1zW4GJWQFcRCkfxSkiifVdGIldO1FdPKtdLW", "y3jLyxrLrwXLBwvUDa", "CgXHEq", "WP/cRmkVlmoaW6i", "ESkliCkFhNBcM14", "WQiNq8koW5e", "y2HHCMfJDgvY", "5yAf5Aw46kEb6Aoo5l2/6iI177Ym5yE75RQd5y+n6ls877Ym6lcl5A6Z5B+G6iEJ77Ym5PYa5zco6k+B5P2a5lI75ywS6i635B6x6ioC5yIP", "C2XPy2u", "zNjVBvrV", "Bg9N", "DgH1BMrLCG", "WOxdLJu1Euq", "DMvYC3vZ", "amoNW4ZcKX3dGSoQAsa", "W6/cTmodWQddL8kHW7O", "W73dT1tdUCoMtmoXjSkF", "tMddMIXvW4miWPTy", "WQ/cN8oKWPddT8o7W41ll8kdWPmBW4a", "B8kCjSktbgZcNv9GW6FLP4tNNOxKVBpLUkqoWOm4W4lcTvWSgCkrl8oWW4ras+MQHEw7Pos7OUwLK1pdSWRdLqinbSkYWQFcGdddS8oG", "ywrK", "y29UBMvJDa", "CgvYC29UD2fYyMCZ", "6zw/6kgR44gU5AsP54MI5lUKkJeWma", "kXRcJ8o7W4pcR08", "zxH0zw5ZAw9Ul+wMGUECN+s8Vow5UY9PBwfNzxmVywn0AxzPDhLFEMHFDhCVywn0AxzPDhLFBw9Kzv90AxrSzte0lNbUzW", "D3vQAwfUzW", "u8kbWQOvpguUW6i", "waCNWRVcUa", "AxrLBq", "WRBcG8ocWPZdNJLx", "WRldUmknja", "W7pdShNcOSkBhG", "EwfU", "6iQX5A655PYi6lkmWRFLRzNOJlKQmE+8IowkQcVPNzNVViK", "W7qTEmoTW5fY", "qIBdL8kNW7qTW6e", "CgvYC29Uv2fYv29YA19HBM5PDte", "DxbKyxrLEG", "uSo7WQ1iA8k1WRO", "W6ldKXDyWPD8", "kL8IEqldKt4", "W6DFW4ddSCkmWRtcNMWCW4i", "p2hdSvi", "y29UBMvJDenHCMrqywnR", "CMvTB3zLq2HPBgq", "C2v0q29UDgvUDa", "WR0cc8kGwSoRW4W", "qSo6WQ9uCG", "W43dOYDEW5i/WPxcVW", "xu7dTGFdVa", "ECkhimktd3e", "ESkfjSkE", "zCo8W7eV", "C3bPBMveyxrH", "hCoNW4hcMa", "Bw9IAwXL", "WOJdM8kCr2tdLq", "ywrKqw5PBwf0Aw9U", "WPdcOSk4jCoCW7e", "W5q+EmoHW4b5", "54MB5BM056Ul5yASWRFLJ7JPQAZMH78QmE+8IowkQcVPNzNVViK", "WRZdPCkamGtdQd8KW6j55AAI55+c5l2q5BQxfYqL", "yNvZAw5LC3nJyxjKx3bYB2DYzxnZx2jHCG", "W7bxW7hdQ8kE", "WR/cLmoKWO7dSW", "W6ldQqz9WRBdJq", "DCoNW7m5yMXJWP0CfGNdH8oth8k2", "WPxdJsi/Dq", "zM9UDfDLAwDODa", "WR/cKSoMWOxdPmo3W4XE", "lXBdP8o+WO5D", "5PsF5zkt5ysVcIG", "oaVdUSooWO1iaa", "iZu2ztrMyq", "z2v0rei", "WQ0camkGxCo2W5a", "56EB5PUh5PgJsmoy", "CgfNztfIDg4", "B8kCjSktbgZcNv9GW6FLP4tNNOxKVBpLUkqoWPKLW4RcVfXWq8knlSkXW4nwc8kh", "DwLFDhC", "zxH0zw5ZAw9Ul+wnGEwrQow5Tfvjl2fZC2v0CY9KEw5HBwLJl+wqLEEoSUE7RI/MIjJLNlRNU53NIyGVyMvPAMLUzY5ZA2vS", "W4VdOYXfW5i/WPpcQCke", "lMPWzW", "BgvMDdm", "mg/dTLX2tmorzmonAG", "DgfIx2j0BL9WCMvZC2vKmq", "vCo7WQe", "yxzHDgfY", "W6zrW4ddUCkaWRC", "WO/cOmkZl8omW6S", "z2v0", "imkJxCoLW7xdTq", "C8owW6nieCoq", "jqpcLW", "C8o6W54MBhTeWPOBaq", "yNrUx2X2BdfFmwe", "5Bcg5yQB77YAotG5mdaVotG5mda", "W6TwW7LYWQ/dTq", "WPSnWOu", "DMfSDwu", "AhbFC3r5BgvZAgvLDdi", "BgfIzwW", "uMtdHcy", "yw5JAg9Y", "qSo/WQfD", "WQ4GCbK+W6W", "BeFdQmoaW70", "W6bFW53dUG", "WQRdMSkrw2RdJLO6rG", "ghr4W6JdNSoYW7ykiHhcGmkVWR3dIComWRFdOmk0c8o0ud1P", "WPKbWOamomo8WQRdHmouW7C", "55M76zsl6zM36zI1WRFLVkdOVR0QmE+8IowkQcVPNzNVViK", "e1mFibzTW6hdS8klWOa", "W5FdPZjp", "WR3dVmkanG", "W6mRECo8W4zZrW", "W7ldSGLVWRO", "hmkNzdVcSCkkzCkxW6JdVfC", "WReuWPhcJL0", "WO/dICoNW4pcTG", "WO7dHCoXW4tcQ8kb", "z2v0q2HPBgrcEu5HBwu", "tuldUq3dSmot", "iw3dP1j0ua", "z8oZW54", "WO/cQ8kUp8oAW63cOa", "wNtcRSonWRSE", "FSkbkSkch23cKum", "y3jLyxrL", "cfGEibm", "yMX1CIG4ChGP", "EgLH", "Bw9KzxnLy29MzG", "cLqejXfW", "W6NdVwlcSW", "hgHNW60", "yxnZzxrvuKW", "W63dVg/cOG", "W7ZdKrzw", "y1tdOmol", "WO8OW7ZdGW", "WRJdUCkqfaldSJOV", "WOJdLCoWW58", "WRW6Ca", "ywn0AxzPDhLFAMLHB3H1zq", "5Bcp5Bcp5Ogq6B6z", "rWS9", "BgvMDa", "uSoXWQvJA8k0WROlmSoaWQWWW6e", "C2v0qw5PBwf0Aw9U", "b8kGCddcVCkq", "AMPFz3jHzgvFzgfZAgK", "jmk8W6JcVXdcUCokjGpdRa", "WRiyWO3cJKdcJsa", "u3bYAxrL", "nJG5nJrQweXrruW", "CNPZAgS", "amklmmkAmfRdUW", "WOddKdCNDveg", "AxnoB25HBwvtzxj2zxi", "r0NdSGxdRCoDWQzc", "y2fYza", "EMHHB211yNv0Dg9U", "W7ldSGLPWQS", "C2HLzxq", "wCkpWR8", "uwRdJsztW5qiWPff", "Dgv4DhvYzxm", "BCowW7HCdmox", "C2vJ", "zMXVB3i", "WRtdUmkAiHpdSMa", "CgHVBMu", "WQCoWOBcN0hcQHCD", "zM9UDfnPEMu", "WRhcLmoz", "y2HPBgrYzw4", "gvqzkaX+W6BdQa", "DCo7W64JEMfw"]; rzshG = function () { return u3; }; return rzshG(); }
    const rzshyj = {};
    rzshyj["x"] = 0x0, rzshyj["y"] = 0x0, rzshyj["scale"] = 0.74;
    const rzshyD = {};
    rzshyD["x"] = 0x0, rzshyD["y"] = 0x0, rzshyD[rzshbm(0x266, "J*tF")] = 0.74;
    const rzshyJ = {};
    rzshyJ["x"] = 0x1b, rzshyJ["y"] = 145.5, rzshyJ["scale"] = 0.7;
    const rzshyI = {};
    rzshyI["x"] = 0x36a, rzshyI["y"] = 0x14, rzshyI["scale"] = 0.69;
    const rzshyi = {};
    rzshyi["x"] = 0x1b, rzshyi["y"] = 0x116, rzshyi["scale"] = 0.7;
    const rzshyT = {};
    rzshyT["x"] = 0x2d, rzshyT["y"] = 0.5, rzshyT["scale"] = 0.7;
    const rzshyg = {};
    rzshyg["x"] = 308.5, rzshyg["y"] = -3.5, rzshyg["scale"] = 0.71;
    const rzshyB = {};
    rzshyB["x"] = 0x20c, rzshyB["y"] = 17.5, rzshyB["scale"] = 0.6;
    const rzshyq = {};
    rzshyq["x"] = 0x248, rzshyq["y"] = 18.5, rzshyq["scale"] = 0.6;
    const rzshyn = {};
    rzshyn["x"] = 0x284, rzshyn["y"] = 18.5, rzshyn["scale"] = 0.6;
    const rzshyZ = {};
    rzshyZ["x"] = 0x2c0, rzshyZ["y"] = 17.5, rzshyZ["scale"] = 0.6;
    const rzshyz = {};
    rzshyz["x"] = 0x2fc, rzshyz["y"] = 17.5, rzshyz["scale"] = 0.6;
    const rzshyN = {};
    rzshyN["x"] = 0x333, rzshyN["y"] = 17.5, rzshyN["scale"] = 0.6;
    const rzshyR = {};
    rzshyR["x"] = 0x36f, rzshyR["y"] = 17.5, rzshyR["scale"] = 0.6;
    const rzshyS = {};
    rzshyS["x"] = 0x3ab, rzshyS["y"] = 17.5, rzshyS["scale"] = 0.6;
    const rzshyX = {};
    rzshyX["x"] = 0x1bd, rzshyX["y"] = 0xd, rzshyX["scale"] = 0.67;
    const rzshyH = {};
    rzshyH["x"] = 0x23f, rzshyH["y"] = 0xd, rzshyH["scale"] = 0.67;
    const rzshyO = {};
    rzshyO["x"] = 0x195, rzshyO["y"] = 0xd, rzshyO["scale"] = 0.55;
    const rzshyQ = {};
    rzshyQ["x"] = 0x1d3, rzshyQ["y"] = 0xe, rzshyQ["scale"] = 0.8;
    const rzshyh = {};
    rzshyh["x"] = 0x1ea, rzshyh["y"] = 0xd, rzshyh["scale"] = 0.55;
    const rzshyL = {};
    rzshyL["x"] = 0x217, rzshyL["y"] = 0xd, rzshyL["scale"] = 0.55;
    const rzshys = {};
    rzshys["x"] = 0x276, rzshys["y"] = 0xd, rzshys["scale"] = 0.55;
    const rzshyv = {};
    rzshyv["x"] = 0x195, rzshyv["y"] = 0xd, rzshyv["scale"] = 0.55;
    const rzshyV = {};
    rzshyV["x"] = 0x95, rzshyV["y"] = 0x35, rzshyV["scale"] = 0.2;
    const rzshyP = {};
    rzshyP["x"] = 0xcd, rzshyP["y"] = 0x37, rzshyP["scale"] = 0.7;
    const rzshyl = {};
    rzshyl["x"] = 0x49, rzshyl["y"] = 0x22, rzshyl["scale"] = 0.69;
    const rzshyE = {};
    rzshyE["x"] = 0x0, rzshyE["y"] = 0x0, rzshyE["scale"] = 0x1;
    const rzshyF = {};
    rzshyF["x"] = 27.5, rzshyF["y"] = 147.5, rzshyF["scale"] = 0.7;
    const rzshyC = {};
    rzshyC["x"] = 0x226, rzshyC["y"] = 0xfa, rzshyC["scale"] = 0.63;
    const rzshyx = {};
    rzshyx["x"] = 0x24e, rzshyx["y"] = 0x100, rzshyx["scale"] = 0.67;
    const rzshU0 = {};
    rzshU0["x"] = 0x1a6, rzshU0["y"] = 0x66, rzshU0["scale"] = 0.69;
    const rzshU1 = {};
    rzshU1["x"] = 0x1a6, rzshU1["y"] = 0x66, rzshU1["scale"] = 0.69;
    const rzshU2 = {};
    rzshU2["x"] = 0xdd, rzshU2["y"] = 0x66, rzshU2["scale"] = 0.69;
    const rzshU3 = {};
    rzshU3["x"] = 0xe1, rzshU3["y"] = 0x9e, rzshU3["scale"] = 0.7;
    const rzshU4 = {};
    rzshU4["x"] = 0xe1, rzshU4["y"] = 0x9e, rzshU4["scale"] = 0.7;
    const rzshU5 = {};
    rzshU5["x"] = 0xe1, rzshU5["y"] = 0xda, rzshU5["scale"] = 0.7;
    const rzshU6 = {};
    rzshU6["x"] = 0xe1, rzshU6["y"] = 0x116, rzshU6["scale"] = 0.7;
    const rzshU7 = {};
    rzshU7["x"] = 0xe1, rzshU7["y"] = 0x9f, rzshU7["scale"] = 0.7;
    const rzshU8 = {};
    rzshU8["x"] = 0xe1, rzshU8["y"] = 0xdb, rzshU8["scale"] = 0.7;
    const rzshU9 = {};
    rzshU9["x"] = 0xe3, rzshU9["y"] = 0x118, rzshU9[rzshbY(0x1f9)] = 0.7;
    const rzshUG = {};
    rzshUG["x"] = 0x1e8, rzshUG["y"] = 0x67, rzshUG["scale"] = 0.65;
    const rzshUy = {};
    rzshUy["x"] = 1055.5, rzshUy["y"] = 0x29, rzshUy["scale"] = 0.47;
    const rzshUU = {};
    rzshUU["x"] = 0xe6, rzshUU["y"] = 0xf0, rzshUU["scale"] = 0.8;
    const rzshUk = {};
    rzshUk["x"] = 0xe6, rzshUk["y"] = 0xde, rzshUk["scale"] = 0.8;
    const rzshUf = {};
    rzshUf["x"] = 0xe6, rzshUf["y"] = 0x168, rzshUf["scale"] = 0.8;
    const rzshUY = {};
    rzshUY["x"] = 0xe6, rzshUY["y"] = 0xa0, rzshUY["scale"] = 0.8;
    const rzshUm = {};
    rzshUm["x"] = 0xe6, rzshUm["y"] = 0xb4, rzshUm["scale"] = 0x1;
    const rzshUb = {};
    rzshUb["x"] = 0xe6, rzshUb["y"] = 0xb4, rzshUb["scale"] = 0x1;
    const rzshUK = {};
    rzshUK["x"] = 0xe6, rzshUK["y"] = 0xb4, rzshUK["scale"] = 0x1;
    const rzshUw = {};
    rzshUw["x"] = 0xe6, rzshUw["y"] = 0xb4, rzshUw["scale"] = 0x1;
    const rzshUc = {};
    rzshUc["x"] = 0xe6, rzshUc["y"] = 0xb4, rzshUc["scale"] = 0x1;
    const rzshUd = {};
    rzshUd["x"] = 0xc8, rzshUd["y"] = 0x12c, rzshUd["scale"] = 0.8;
    const rzshUp = {};
    rzshUp["x"] = 0xc8, rzshUp["y"] = 0x12c, rzshUp["scale"] = 0.8;
    const rzshUr = {};
    rzshUr["x"] = 0x64, rzshUr["y"] = 0xdc, rzshUr["scale"] = 0x1;
    const rzshUM = {};
    rzshUM["x"] = 0x64, rzshUM["y"] = 0xaa, rzshUM["scale"] = 0.7;
    const rzshUu = {};
    rzshUu["x"] = 0x64, rzshUu["y"] = 0x140, rzshUu["scale"] = 0.7;
    const rzshUt = {};
    rzshUt["x"] = 0x64, rzshUt["y"] = 0x32, rzshUt["scale"] = 1.2;
    const rzshUW = {};
    rzshUW["x"] = 0x64, rzshUW["y"] = 0x14, rzshUW["scale"] = 0.7;
    const rzshUe = {};
    rzshUe["x"] = 0x8c, rzshUe["y"] = 0x1e, rzshUe["scale"] = 0.8;
    const rzshUA = {};
    rzshUA["x"] = 0xb4, rzshUA["y"] = 0x14, rzshUA["scale"] = 0.7;
    const rzshUa = {};
    rzshUa["x"] = 551.5, rzshUa["y"] = 0x136, rzshUa["scale"] = 1.05;
    const rzshUo = {};
    rzshUo["x"] = 551.5, rzshUo["y"] = 0x101, rzshUo["scale"] = 0x1;
    const rzshUj = {};
    rzshUj["x"] = 0x155, rzshUj["y"] = 0x45, rzshUj["scale"] = 0.68;
    const rzshUD = {};
    rzshUD["x"] = -0x1d6, rzshUD["y"] = 0x10e, rzshUD["scale"] = 0x1;
    const rzshUJ = {};
    rzshUJ["x"] = 0xac, rzshUJ["y"] = -0x4e, rzshUJ[rzshbY(0x1f9)] = 0.98;
    const rzshUI = {};
    rzshUI["x"] = -0xe4, rzshUI["y"] = -0x12, rzshUI["scale"] = 0x1;
    const rzshUi = {};
    rzshUi["x"] = -0xbe, rzshUi["y"] = 0x98, rzshUi["scale"] = 0x1;
    const rzshUT = {};
    rzshUT["x"] = -0xd2, rzshUT["y"] = -0x47, rzshUT[rzshbm(0x22d, "C4@w")] = 1.2;
    const rzshUg = {};
    rzshUg["x"] = -0x33, rzshUg["y"] = -0x47, rzshUg[rzshbY(0x1f9)] = 0x1;
    const rzshUB = {};
    rzshUB["x"] = -0x159, rzshUB["y"] = -0x1e, rzshUB["scale"] = 0.5;
    const rzshUq = {};
    rzshUq["x"] = 0x314, rzshUq["y"] = 0x19, rzshUq["scale"] = 0.9;
    const rzshUn = {};
    rzshUn["x"] = 0x390, rzshUn["y"] = 0x19, rzshUn["scale"] = 0.69;
    const rzshUZ = {};
    rzshUZ["x"] = 0x415, rzshUZ["y"] = 0x2b, rzshUZ["scale"] = 0.69;
    const rzshUz = {};
    rzshUz["x"] = 0x39a, rzshUz["y"] = 0x142, rzshUz["scale"] = 0.67;
    const rzshUN = {};
    rzshUN["x"] = 0x356, rzshUN["y"] = 0xfe, rzshUN["scale"] = 0.67;
    const rzshUR = {};
    rzshUR["x"] = 0x39a, rzshUR["y"] = 0x190, rzshUR["scale"] = 0.67;
    const rzshUS = {};
    rzshUS["x"] = 0x3e0, rzshUS["y"] = 0xfe, rzshUS["scale"] = 0.67;
    const rzshUX = {};
    rzshUX["x"] = 0x226, rzshUX["y"] = 17.5, rzshUX["scale"] = 0.69;
    const rzshUH = {};
    rzshUH["x"] = 0x120, rzshUH["y"] = 0xe, rzshUH["scale"] = 0.7;
    const rzshUO = {};
    rzshUO["x"] = 0x3c5, rzshUO["y"] = 0x13, rzshUO["scale"] = 0.69;
    const rzshUQ = {};
    rzshUQ["x"] = 0x42, rzshUQ["y"] = -0x2b, rzshUQ["scale"] = 0.7;
    const rzshUh = {};
    rzshUh["x"] = 0xc, rzshUh["y"] = 0x6, rzshUh["scale"] = 0x1;
    const rzshUL = {};
    rzshUL[rzshbm(0x18d, "0ka9")] = rzshy3, rzshUL["actbk"] = rzshy4, rzshUL["activeea"] = rzshy5, rzshUL["maisui_line"] = rzshy6, rzshUL["top_user_bg"] = rzshy7, rzshUL[rzshbm(0x1a0, "FbmE")] = rzshy8, rzshUL["top_light_bg"] = rzshy9, rzshUL["maisui_btn"] = rzshyG, rzshUL["chengzhangbutton"] = rzshyy, rzshUL["shitubutton"] = rzshyU, rzshUL["shequbutton"] = rzshyk, rzshUL["left_fix"] = rzshyf, rzshUL["exp_up1"] = rzshyY, rzshUL["exp_double"] = rzshym, rzshUL["bottom_plus"] = rzshyb, rzshUL["pubbtn_close"] = rzshyK, rzshUL["player_nan"] = rzshyw, rzshUL["zongyoushanchuanbutton"] = rzshyc, rzshUL["yuanbaoshubutton"] = rzshyd, rzshUL["youjianbutton"] = rzshyp, rzshUL["top_btn_square"] = rzshyr, rzshUL["top_btn_round_pressed"] = rzshyM, rzshUL["top_btn_square_bg"] = rzshyu, rzshUL["yukasaoguang"] = rzshyt, rzshUL["pub_func_icon"] = rzshyW, rzshUL["pub_selchr_namebg"] = rzshye, rzshUL["tehui"] = rzshyA, rzshUL["fightservant"] = rzshya, rzshUL["adventure"] = rzshyo, rzshUL["shenjiangge"] = rzshyj, rzshUL["pray"] = rzshyD, rzshUL["rightacbg"] = rzshyJ, rzshUL["top_btn_round"] = rzshyI, rzshUL["ro2"] = rzshyi, rzshUL["bottom_friend"] = rzshyT, rzshUL["uactive1"] = rzshyg, rzshUL["shop"] = rzshyB, rzshUL["zhaomubutton"] = rzshyq, rzshUL["cangzhengebutton"] = rzshyn, rzshUL["gonghuibutton"] = rzshyZ, rzshUL["guanjiebutton"] = rzshyz, rzshUL["shilingbutton"] = rzshyN, rzshUL["pifubutton"] = rzshyR, rzshUL["wujiangbutton"] = rzshyS, rzshUL["top_btn2"] = rzshyX, rzshUL["top_btn3"] = rzshyH, rzshUL["vip_level"] = rzshyO, rzshUL["vip_jie"] = rzshyQ, rzshUL["vip_btn"] = rzshyh, rzshUL["yuanbao"] = rzshyL, rzshUL["yuanbao_btn"] = rzshys, rzshUL["battle_icon"] = rzshyv, rzshUL["dajiangjun_pic"] = rzshyV, rzshUL["dajiangjun_text"] = rzshyP, rzshUL["pica"] = rzshyl, rzshUL["avatarframe"] = rzshyE, rzshUL["riactive"] = rzshyF, rzshUL["modesecbg"] = rzshyC, rzshUL["mode1bbg"] = rzshyx, rzshUL["modetta"] = rzshU0, rzshUL["modettb"] = rzshU1, rzshUL["mode1tt"] = rzshU2, rzshUL["modesecoff"] = rzshU3, rzshUL["modesecoff1"] = rzshU4, rzshUL["modesecoff2"] = rzshU5, rzshUL["modesecoff3"] = rzshU6, rzshUL["5pjz"] = rzshU7, rzshUL["8pjz"] = rzshU8, rzshUL["guowar"] = rzshU9, rzshUL["whelp"] = rzshUG, rzshUL["top_back"] = rzshUy, rzshUL["ttrankbg1"] = rzshUU, rzshUL["ttrankbg2"] = rzshUk, rzshUL["ttrankbg3"] = rzshUf, rzshUL["ttrank"] = rzshUY, rzshUL["jj_grade_qingtong"] = rzshUm, rzshUL["jj_grade_baiyin"] = rzshUb, rzshUL["jj_grade_huangjin"] = rzshUK, rzshUL["jj_grade_feicui"] = rzshUw, rzshUL["jj_grade_dashi"] = rzshUc, rzshUL["jj_star_on"] = rzshUd, rzshUL["jj_star_off"] = rzshUp, rzshUL["tiantibg"] = rzshUr, rzshUL["solobtn"] = rzshUM, rzshUL["versustwobtn"] = rzshUu, rzshUL["jj_dianfeng"] = rzshUt, rzshUL["jj_tittle"] = rzshUW, rzshUL["publicui_title_bg"] = rzshUe, rzshUL["s0"] = rzshUA, rzshUL["bigmenu"] = rzshUa, rzshUL["set_dialog"] = rzshUo, rzshUL["warr_info_bg"] = rzshUj, rzshUL["wujiangchangkuang"] = rzshUD, rzshUL["jl_bar_fg"] = rzshUJ, rzshUL["jianghun"] = rzshUI, rzshUL["warr_info_dec"] = rzshUi, rzshUL["offical_dayuanshuai"] = rzshUT, rzshUL["warr_arr_official"] = rzshUg, rzshUL["officalui_icon_10"] = rzshUB, rzshUL["biaojibeijing"] = rzshUq, rzshUL["search_btn"] = rzshUn, rzshUL["wujiangback"] = rzshUZ, rzshUL["right_classic"] = rzshUz, rzshUL["right_activity"] = rzshUN, rzshUL["right_ranking"] = rzshUR, rzshUL["right_adventure"] = rzshUS, rzshUL["bottom_bg"] = rzshUX, rzshUL["bottom_chat"] = rzshUH, rzshUL["top_right_bg"] = rzshUO, rzshUL["lobby_bg_btn_bg1"] = rzshUQ, rzshUL["lobby_bg_btn"] = rzshUh;
    const rzshUs = rzshUL;
    const rzshwV = { G: 0x203 };
    if (!lib["config"]["tianti_versus_two"] || !((window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})["xxingnum"] || 0x0)) {
        const Y = {};
        Y["count"] = 0x0, Y["top"] = 0x28, Y["win"] = 0x0, Y["fail"] = 0x0, Y["num"] = 0x0, Y["top_win"] = 0x0, Y["win_Cty"] = 0x0, Y["xxingnum"] = 0x0, game["saveConfig"]("tianti_versus_two", Y);
    }
    ;
    function y(m) {
        switch (m) {
            case 0x1: return "Ⅰ";
            case 0x2: return "Ⅱ";
            case 0x3: return "Ⅲ";
            case 0x4: return "Ⅳ";
            case 0x5: return "Ⅴ";
            case 0x6: return "Ⅵ";
            default: return null;
        }
    }
    function U(m) {
        let b, K, w, c, d;
        if (m < 0x1)
            K = "青铜", b = 0x3, c = 0x0, d = 0x2;
        else {
            if (m < 0x7)
                K = "青铜", b = 0x3 - Math["floor"]((m - 0x1) / 0x2), c = (m - 0x1) % 0x2 + 0x1, d = 0x2;
            else {
                if (m < 0x13)
                    K = "白银", b = 0x3 - Math["floor"]((m - 0x7) / 0x4), c = (m - 0x7) % 0x4 + 0x1, d = 0x4;
                else {
                    if (m < 0x2c)
                        K = "黄金", b = 0x5 - Math["floor"]((m - 0x13) / 0x5), c = (m - 0x13) % 0x5 + 0x1, d = 0x5;
                    else {
                        if (m < 0x45)
                            K = "翡翠", b = 0x5 - Math["floor"]((m - 0x2c) / 0x5), c = (m - 0x2c) % 0x5 + 0x1, d = 0x5;
                        else
                            m < 0x63 ? (K = "大师", b = 0x6 - Math["floor"]((m - 0x45) / 0x5), c = (m - 0x45) % 0x5 + 0x1, d = 0x5) : (K = "传说", b = 0x1, c = m - 0x62, d = 0x3e8);
                    }
                }
            }
        }
        return w = y(b), [K + w, c, d];
    }
    function k(m) {
        const bK = rzshy, bb = rzshU, b = {};
        b["width"] = "100%", b[bb(0x1f4, "EZZT")] = "100%", b["left"] = "0", b["top"] = "0", b["zIndex"] = "1000", b["backgroundColor"] = "rgba(0,0,0,0.4)", b["cursor"] = "pointer";
        var K = ui[bK(0x18c)]["div"](".rzshUpdateInfo1", document["body"])["css"](b);
        K["addEventListener"]("click", function () { K["remove"](); });
        const w = {};
        w["width"] = "60%", w["height"] = "85%", w["left"] = "20%", w["top"] = "12.5%", w["borderImageSource"] = "url(" + lib["assetURL"] + "extension/如真似幻/images/loginui/loginbg2.png)", w["borderImageSlice"] = "10 fill", w["borderImageWidth"] = "10px 10px", w["cursor"] = "auto", w["overflowY"] = "auto", w["padding"] = "20px";
        var c = ui["create"]["div"](".rzshUpdateInfo2", K)["css"](w), d = ui["create"]["div"](bK(0x23b), c);
        d["innerText"] = "有新版本：V" + m["version"];
        var p = ui["create"]["div"](".rzshUpdateInfoTip", c);
        p["innerHTML"] = bK(0x1d4), c["addEventListener"](bb(rzshwV.G, "Y&Q6"), function (u) {
            const bc = bb;
            u["stopPropagation"]();
            if (u["target"]["classList"]["contains"]("rzshCopyText")) {
                var t = "非凡欧德内里", W = function () {
                    const bw = rzshU;
                    var A = document[bw(0x1e3, "vV5]")]("textarea");
                    A["value"] = t, A["style"]["position"] = "fixed", A["style"]["top"] = "0", A["style"]["left"] = "0", A["style"]["opacity"] = "0", A["style"]["userSelect"] = "text", A["style"]["webkitUserSelect"] = "text", document["body"]["appendChild"](A), A["focus"](), A["select"]();
                    try {
                        var a = document["execCommand"]("copy");
                        a ? rzsh["function"]["alert"]("复制到剪贴板成功！") : rzsh["function"]["alert"]("复制失败，请手动输入");
                    }
                    catch (o) {
                        rzsh["function"]["alert"]("复制失败，请手动输入");
                    }
                    document["body"]["removeChild"](A);
                };
                navigator["clipboard"] && window[bc(0x29e, "rz96")] ? navigator["clipboard"]["writeText"](t)["then"](function () { rzsh["function"]["alert"]("复制到剪贴板成功！"); })["catch"](function () { W(); }) : W();
            }
        });
        var r = ui["create"]["div"](".rzshUpdateInfo3", c), M = ui["create"]["div"](".rzshUpdateInfoInfo", r);
        M["innerHTML"] = m["info"];
    }
    async function f() {
        try {
            console["log"]("开始加载");
            const m = await fetch("https://raw.gitcode.com/Ryan_shiji/rzsh/raw/main/update.json");
            if (!m["ok"]) {
                alert("网络连接失败！状态： " + m["status"]);
                throw new Error("HTTP error! status: " + m["status"]);
            }
            const b = await m["json"](), K = Object["keys"](b)[0x0];
            rzsh["updateInfo"] = b[K], rzsh["updateInfo"]["version"] !== lib["extensionPack"]["如真似幻"]["version"] && k(rzsh["updateInfo"]);
        }
        catch (w) {
            rzsh["function"]["alert"]("校验失败");
        }
    }
    ;
    const rzshMx = { G: 0x231, y: 0x15a, U: 0x261, k: 0x27f }, rzshMa = { G: 0x197, y: 0x24e }, rzshMb = { G: "EZZT", y: 0x2da, U: "hZEd", k: 0x1f9, f: 0x226, Y: "tF)Q", m: 0x199, b: "v*9j", K: 0x1ba }, rzshdj = { G: "vQIC" }, rzshd2 = { G: 0x2f3 }, rzshd0 = { G: "rkb@" }, bg = rzshU, bT = rzshy;
    let J = Math["max"](window["devicePixelRatio"] * (game["documentZoom"] ? game["documentZoom"] : 0x1), 0x1);
    window[bT(0x282)] = ![], window["_rzsh_theme"] = "吕布貂蝉", window["_rzsh_themeReady"] = Promise.resolve().then(() => { window._rzsh_theme = lib.config.rzsh_home_theme || "吕布貂蝉"; window._rzsh_themeLocked = true; }), async function GU() {
        const bl = bT, Gk = "extraordinary_rzsh2", Gf = 0x1, GY = "data", Gm = "幻惑众生", Gb = "https://raw.gitcode.com/Ryan_shiji/rzsh/raw/main/season.json", GK = await new Promise((Go, Gj) => { const bV = rzshy, GD = indexedDB["open"](Gk, Gf); GD["onupgradeneeded"] = GJ => { const GI = GJ["target"]["result"]; !GI["objectStoreNames"]["contains"](GY) && GI["createObjectStore"](GY); }, GD["onsuccess"] = GJ => Go(GJ["target"]["result"]), GD["onerror"] = GJ => Gj(GJ[bV(0x219)]["error"]); });
        function Gw(Go) { return new Promise((Gj, GD) => { const GJ = GK["transaction"](GY, "readonly"), GI = GJ["objectStore"](GY)["get"](Go); GI["onsuccess"] = Gi => Gj(Gi["target"]["result"]), GI["onerror"] = Gi => GD(Gi["target"]["error"]); }); }
        function Gc(Go, Gj) { return new Promise((GD, GJ) => { const GI = GK["transaction"](GY, "readwrite"), Gi = GI["objectStore"](GY)["put"](Gj, Go); Gi["onsuccess"] = () => GD(), Gi["onerror"] = GT => GJ(GT["target"]["error"]); }); }
        function Gd() { const bP = rzshU, Go = {}; return Go["count"] = 0x0, Go["top"] = 0x28, Go["win"] = 0x0, Go["fail"] = 0x0, Go[bP(0x281, "f@0[")] = 0x0, Go["top_win"] = 0x0, Go["win_Cty"] = 0x0, Go["xxingnum"] = 0x0, Go; }
        function Gp(Go) { const Gj = Object["keys"](Go); let GD = -Infinity, GJ = Gj[0x0]; return Gj["forEach"](GI => { Go[GI]["order"] > GD && (GD = Go[GI]["order"], GJ = GI); }), Go[GJ]["name"]; }
        let Gr = null, GM = {};
        try {
            Gr = await Gw("current");
        }
        catch (Go) { }
        try {
            GM = await Gw("history") || {};
        }
        catch (Gj) { }
        const Gu = !!Gr;
        let Gt = null, GW = null;
        try {
            const GD = await fetch(Gb);
            GD["ok"] && (Gt = await GD["json"](), GW = Gp(Gt));
        }
        catch (GJ) { }
        let Ge, GA;
        if (!Gu) {
            const GI = GW || Gm, Gi = lib["config"]["tianti_versus_two"] || {}, GT = {};
            GT["name"] = GI, GT["count"] = Gi["count"] || 0x0, GT["top"] = Gi["top"] || 0x28, GT["win"] = Gi["win"] || 0x0, GT["fail"] = Gi["fail"] || 0x0, GT["num"] = Gi["num"] || 0x0, GT["top_win"] = Gi["top_win"] || 0x0, GT["win_Cty"] = Gi["win_Cty"] || 0x0, GT["xxingnum"] = Gi["xxingnum"] || 0x0, Ge = GT, GA = {}, Gt && Object["keys"](Gt)["forEach"](Gg => { const GB = Gt[Gg]["name"]; GB !== GI && (GA[GB] = GM[GB] || Gd()); });
        }
        else {
            Ge = Gr, GA = GM;
            if (GW && GW !== Gr["name"]) {
                const Gg = Gr["name"], { name: GB, ...Gq } = Gr;
                GA[Gg] = Gq;
                const Gn = {};
                Gn["name"] = GW, Gn["count"] = 0x0, Gn["top"] = 0x28, Gn[bl(0x25f)] = 0x0, Gn["fail"] = 0x0, Gn["num"] = 0x0, Gn["top_win"] = 0x0, Gn["win_Cty"] = 0x0, Gn["xxingnum"] = 0x0, Ge = Gn, Gt && Object["keys"](Gt)["forEach"](GZ => { const Gz = Gt[GZ]["name"]; Gz !== GW && !GA[Gz] && (GA[Gz] = Gd()); });
            }
        }
        await Gc("current", Ge), await Gc("history", GA), window["_rzsh_seasonDB"] = GK, window["_rzsh_current"] = Ge, window["_rzsh_history"] = GA;
        const Ga = {};
        Ga["current"] = Ge, Ga["history"] = GA, console["log"]("[rzsh] seasonDB 初始化完成", Ga);
    }()[bT(0x22e)](Gk => console["error"]("[rzsh] seasonDB 初始化失败", Gk));
    const I = {};
    Object.assign(I, { width: 1600, height: 900, backgroundAlpha: 0, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true });
    const i = lifecycle.application(I);
    i.view.id = "rzsh";
    lifecycle.mount(i);
    const T = {};
    T["name"] = "Label", T["path"] = "extension/如真似幻/audio/sgs/Label.mp3";
    const g = {};
    g["name"] = "Menu", g["path"] = "extension/如真似幻/audio/sgs/Menu.mp3";
    const B = {};
    B["name"] = "MidButton", B["path"] = "extension/如真似幻/audio/sgs/MidButton.mp3";
    const q = {};
    q["name"] = "Notice02", q["path"] = "extension/如真似幻/audio/sgs/Notice02.mp3";
    const n = {};
    n["name"] = "Pop", n["path"] = "extension/如真似幻/audio/sgs/Pop.mp3";
    const Z = {};
    Z["name"] = "Report01", Z["path"] = "extension/如真似幻/audio/sgs/Report01.mp3";
    const z = {};
    z["name"] = "PopUp", z["path"] = "extension/如真似幻/audio/sgs/PopUp.mp3";
    const N = {};
    N["name"] = "TinyButton", N["path"] = "extension/如真似幻/audio/sgs/TinyButton.mp3";
    const R = {};
    R["name"] = "TinyWindow", R[bg(0x1e5, "@0B1")] = "extension/如真似幻/audio/sgs/TinyWindow.mp3";
    const S = {};
    S["name"] = "Unlock", S["path"] = "extension/如真似幻/audio/sgs/Unlock.mp3";
    const X = {};
    X[bg(0x247, "5r0j")] = bT(0x1e0), X["path"] = "extension/如真似幻/audio/sgs/WinButton.mp3";
    const H = {};
    H["name"] = "QuickStart", H["path"] = "extension/如真似幻/audio/sgs/QuickStart.mp3";
    const O = {};
    O["name"] = "PiPei1", O["path"] = "extension/如真似幻/audio/sgs/pipei1.mp3";
    const Q = {};
    Q["name"] = "PiPei2", Q["path"] = "extension/如真似幻/audio/sgs/pipei2.mp3";
    const h = {};
    h["name"] = "HugeButtom", h["path"] = "extension/如真似幻/audio/sgs/HugeButtom.mp3";
    const L = {};
    L[bT(0x2d8)] = "Money01", L[bg(0x321, "v*9j")] = "extension/如真似幻/audio/sgs/Money01.mp3";
    const s = {};
    s["name"] = "Money02", s[bg(0x1c5, "KsXd")] = "extension/如真似幻/audio/sgs/Money02.mp3";
    const v = [T, g, B, q, n, Z, z, N, R, S, X, H, O, Q, h, L, s];
    i["view"]["style"]["position"] = "absolute", i["view"]["style"]["left"] = "0px", i["view"]["style"]["zIndex"] = "0", i["view"][bT(0x268)]["top"] = "0px";
    const V = {};
    V["gamma"] = 0x1;
    let P = new PIXI["filters"][(bg(0x286, "rkb@"))](V);
    const l = {};
    l["brightness"] = 0.5;
    const E = new PIXI["filters"]["AdjustmentFilter"](l);
    function D(Gk, Gf, GY) { const Gm = {}; Gm["y"] = GY; let Gb = Gm; const GK = {}; GK["y"] = Gk["y"]; let Gw = GK, Gc = "none"; const Gd = {}; Gd["ease"] = Gc, gsap["fromTo"](Gk, Gf, Gb, Gw, Gd)["restart"](); }
    let F, C, x, G0, G1, G2, G3, G4, G5, G6 = null;
    const G7 = i["screen"]["width"] / 0x44f, G8 = i["screen"]["height"] / 0x202, G9 = Math["min"](G7, G8), GG = lifecycle.loader();
    GG["add"]("spineloading", lib["assetURL"] + "extension/如真似幻/spine/loding.skel"), GG["add"]("jindutiao", lib["assetURL"] + "extension/如真似幻/spine/jindutiao.skel"), GG[bT(0x301)]("loadingbg", lib["assetURL"] + "extension/如真似幻/images/bg.jpg"), GG[bg(0x24f, "2^^M")]("loadingbg2", lib["assetURL"] + "extension/如真似幻/images/hom.jpg"), GG["add"]("uiBG", lib["assetURL"] + "extension/如真似幻/images/background.jpg"), GG["load"](() => { const rzshdr = { G: 0x301 }, bF = bg, bE = bT; spinelo = new PIXI["spine"]["Spine"](GG["resources"]["spineloading"]["spineData"]), F = new PIXI["spine"]["Spine"](GG["resources"]["jindutiao"]["spineData"]), G2 = new PIXI["Sprite"](GG["resources"]["loadingbg2"]["texture"]), lifecycle.cover(G2), G2["x"] = 0.5 * i["screen"]["width"], G2["y"] = 0.5 * i["screen"]["height"], G2[bE(0x173)]["set"](0.5), i["stage"][bF(0x2dd, "P9FJ")](G2, spinelo, F), i["stage"]["setChildIndex"](G2, 0x0), spinelo["state"]["setAnimation"](0x0, "idle", !![]), spinelo["x"] = 0.52 * i["screen"]["width"], spinelo["y"] = 0.5 * i["screen"]["height"], spinelo["scale"]["set"](0.75), F["state"]["setAnimation"](0x0, "idle", !![]), F["x"] = 0.5 * i["screen"]["width"], F["y"] = 0.95 * i["screen"]["height"], F["scale"]["set"](0.75); let Gk = ["三国杀是一款流行的桌面卡牌游戏，基于三国历史背景。", "在三国杀中，玩家需要策略地使用各种角色卡牌来击败对手。", "诸葛亮、曹操和刘备是三国杀中的著名角色。", "游戏中的卡牌包括杀、闪、桃等各种不同的功能。", "每位角色都有独特的技能和特点，增加了游戏的变化性。", "三国杀的策略性和战术性使其成为一款受欢迎的卡牌游戏。", "在三国杀中，胜利需要巧妙地使用卡牌和角色技能。", "游戏中的合作和背叛元素增加了战局的紧张感。", "使用你喜欢的武将，积累武将经验，可以获得炫酷的武将表现效果", "付费购买的武将及招募的武将均可以分解成一定数量的将魂", "开通会员后，可以加速等级的提升哦"]; function Gf() { return Gk[Math["floor"](Math["random"]() * Gk["length"])]; } const GY = {}; GY["fontSize"] = 0xf, GY[bF(0x193, "f)#4")] = "white", GY["fontFamily"] = "shousha"; let Gm = new PIXI["Text"](Gf(), GY); Gm["anchor"]["set"](0.5), Gm["x"] = 0.51 * i["screen"]["width"], Gm["y"] = 0.91 * i["screen"]["height"], i["stage"]["addChild"](Gm), setInterval(function () { Gm["text"] = Gf(); }, 0x258), setTimeout(function () { const bC = bE; i["stage"]["removeChild"](Gm, F), lifecycle.isHome && (G2[bC(0x23f)] = GG["resources"][bC(0x234)]["texture"]), lifecycle.cover(G2); }, 0xbb8), v["forEach"](Gb => { const bx = bE; PIXI["sound"][bx(rzshdr.G)](Gb["name"], { "url": lib["assetURL"] + Gb["path"], "volume": lib["config"]["volumn_audio"] / 0x8 }); }); }), game["getFileList"]("extension/如真似幻/audio/music", function (Gk) {
        const rzshMF = { G: 0x157, y: 0x2b4 }, rzshMY = { G: 0x1b3 }, rzshMf = { G: "PA38", y: 0x204 }, rzshpF = { G: 0x27b, y: 0x2c7 }, rzshpH = { G: "PA38", y: 0x1a5, U: 0x2fb, k: "UEd7" }, rzshpX = { G: 0x2b1 }, rzshpR = { G: 0x2bb }, rzshpD = { G: 0x2eb }, K1 = bg, K0 = bT;
        window["rzshmusic"] = Gk;
        let Gf = window[K0(0x22f)];
        delete window["rzshmusic"];
        let GY;
        if (!lib["config"]["rzshbgm"] || !Gf["includes"](lib["config"]["rzshbgm"]))
            GY = Gf[0x0];
        else
            GY = lib["config"]["rzshbgm"];
        const Gm = {};
        Gm["url"] = lib["assetURL"] + "extension/如真似幻/audio/music/" + GY + "/outgame.mp3", Gm["loop"] = !![], Gm["volume"] = lib["config"]["volumn_background"] / 0x8, PIXI["sound"]["add"](K1(0x305, "hs^2"), Gm), setTimeout(function () { PIXI["sound"]["play"]("outgame"); }, 0xaf0);
        const Gb = lifecycle.loader(), GK = lifecycle.container();
        GK["width"] = i["screen"]["width"], GK["height"] = i["screen"]["height"];
        const Gw = lifecycle.container();
        Gw["width"] = i["screen"]["width"], Gw["height"] = i["screen"]["height"];
        const Gc = lifecycle.container();
        Gc["width"] = i["screen"]["width"], Gc["height"] = i["screen"]["height"] * 0.2;
        const Gd = lifecycle.container();
        Gd["width"] = i["screen"]["width"] * 0.2, Gd["height"] = i["screen"]["height"] * 0.9, Gd["y"] = i["screen"]["height"] * 0.0705;
        const Gp = lifecycle.container();
        Gp["width"] = i["screen"]["width"] * 0.1, Gp["height"] = i["screen"]["height"] * 0.9, Gp["y"] = i["screen"]["height"] * 0.0705, Gp["x"] = i["screen"]["width"] * 0.9;
        const Gr = lifecycle.container();
        Gr["width"] = i["screen"]["width"], Gr["height"] = i["screen"][K0(rzshMx.G)] * 0.1, Gr["y"] = 0.91 * i[K1(0x240, "vQIC")]["height"];
        const GM = lifecycle.container();
        GM["width"] = i["screen"]["width"], GM["height"] = i["screen"][K0(0x231)];
        const Gu = lifecycle.container();
        Gu["width"] = i["screen"]["width"], Gu["height"] = i["screen"]["height"], GK["addChild"](Gc, Gd, Gp, Gr);
        function Gt(Uy, UU) {
            let Uk = 0.5;
            const Uf = "power2.out";
            let UY, Um;
            switch (UU) {
                case "top":
                    const UK = {};
                    UK["y"] = -0x12c, UY = UK;
                    const Uw = {};
                    Uw["y"] = 0x0, Um = Uw, Uk = 0.3;
                    break;
                case "under":
                    const Uc = {};
                    Uc["y"] = 1.5 * i["screen"]["height"], UY = Uc;
                    const Ud = {};
                    Ud["y"] = 0.91 * i["screen"]["height"], Um = Ud, Uk = 0.3;
                    break;
                case "left":
                    const Up = {};
                    Up["x"] = -0x12c, UY = Up;
                    const Ur = {};
                    Ur["x"] = 0x0, Um = Ur;
                    break;
                case "right":
                    const UM = {};
                    UM["x"] = 1.5 * i["screen"]["width"], UY = UM;
                    const Uu = {};
                    Uu["x"] = i["screen"]["width"] * 0.9, Um = Uu;
                    break;
                default:
                    console["error"]("Invalid direction: $ {\n                                                direction\n                                            }");
                    return;
            }
            const Ub = {};
            Ub["ease"] = Uf, gsap["fromTo"](Uy, Uk, UY, Um, Ub)["restart"]();
        }
        function GW(Uy, UU) {
            const K2 = K0;
            let Uk = 0.8, Uf = "power2.out", UY, Um;
            switch (UU) {
                case "top":
                    const UK = {};
                    UK["y"] = -0x12c, UY = UK;
                    const Uw = {};
                    Uw["y"] = 0x0, Um = Uw;
                    break;
                case "under":
                    const Uc = {};
                    Uc["y"] = 1.5 * i["screen"]["height"], UY = Uc;
                    const Ud = {};
                    Ud["y"] = i["screen"]["height"] * 0.91, Um = Ud;
                    break;
                case "left":
                    const Up = {};
                    Up["x"] = -0x12c, UY = Up;
                    const Ur = {};
                    Ur["x"] = 0x0, Um = Ur;
                    break;
                case K2(0x28c):
                    const UM = {};
                    UM["x"] = 1.5 * i["screen"]["width"], UY = UM;
                    const Uu = {};
                    Uu["x"] = i["screen"][K2(0x2b1)] * 0.9, Um = Uu;
                    break;
                default:
                    console["error"]("Invalid direction: $ {\n                                                direction\n                                            }");
                    return;
            }
            const Ub = {};
            Ub["ease"] = Uf, gsap["fromTo"](Uy, Uk, Um, UY, Ub)["restart"]();
        }
        GK["on"]("added", () => { GK["addChild"](GM), GK["addChild"](Gu), Gt(Gc, "top"), Gt(Gr, "under"), Gt(Gd, "left"), Gt(Gp, "right"), GK["addChild"](Gw), GK["setChildIndex"](GM, 0x2), GK["setChildIndex"](Gd, 0x2), GK["setChildIndex"](Gw, 0x3), GK["setChildIndex"](Gc, 0x3); });
        const Ge = lifecycle.container();
        Ge["width"] = i["screen"]["width"], Ge["height"] = i["screen"]["height"];
        const GA = lifecycle.container();
        GA["width"] = i["screen"]["width"], GA["height"] = i["screen"]["height"] * 0.2, Ge["addChild"](GA);
        const Ga = lifecycle.container();
        Ga["width"] = i["screen"]["width"], Ga["height"] = i["screen"]["height"];
        const Go = {};
        Go["name"] = "spritesui", Go["path"] = K1(rzshMx.y, "v*9j");
        const Gj = {};
        Gj["name"] = K0(0x297), Gj["path"] = "extension/如真似幻/images/light.json";
        const GD = {};
        GD["name"] = "uiczg", GD["path"] = "extension/如真似幻/images/btn.json";
        const GJ = {};
        GJ["name"] = "uivip", GJ["path"] = "extension/如真似幻/images/vip.json";
        const GI = {};
        GI["name"] = "pic", GI["path"] = "extension/如真似幻/images/avatar/554903.png";
        const Gi = {};
        Gi["name"] = "avatarframe", Gi["path"] = "extension/如真似幻/images/avatar/avatarframe_big/avatarFrame_1.png";
        const GT = {};
        GT["name"] = "pic_horizon", GT["path"] = "extension/如真似幻/images/avatar/607.png";
        const Gg = {};
        Gg["name"] = "ui_tw", Gg["path"] = "extension/如真似幻/images/ui_tw.json";
        const GB = {};
        GB["name"] = "btn_new", GB["path"] = "extension/如真似幻/images/btn_new.json";
        const Gq = {};
        Gq["name"] = "chongzhi", Gq["path"] = "extension/如真似幻/images/chongzhi.json";
        const Gn = {};
        Gn["name"] = "activity_bg", Gn["path"] = "extension/如真似幻/images/activity_mode_bg.png";
        const GZ = {};
        GZ["name"] = "activity_taixu", GZ["path"] = "extension/如真似幻/images/activity/activity_mode_pic15.png";
        const Gz = {};
        Gz["name"] = "activity_taixu_txt", Gz["path"] = "extension/如真似幻/images/activity_zh_tw/activity_mode_title16.png";
        const GN = {};
        GN["name"] = "activity_huanhua", GN["path"] = "extension/如真似幻/images/activity_zh_tw/activity_mode_pic15.png";
        const GR = {};
        GR["name"] = "activity_huanhua_txt", GR["path"] = K1(0x2a7, "]!s^");
        const GS = {};
        GS["name"] = "activity_jiaoxue", GS["path"] = "extension/如真似幻/images/activity/activity_mode_pic14.png";
        const GX = {};
        GX[K1(0x17d, "!2E0")] = "activity_jiaoxue_txt", GX["path"] = K0(0x306);
        const GH = {};
        GH["name"] = "activity_xianqu", GH["path"] = "extension/如真似幻/images/activity/activity_mode_pic41.png";
        const GO = {};
        GO["name"] = "activity_xianqu_txt", GO["path"] = "extension/如真似幻/images/activity_zh_tw/activity_mode_pic_title41.png";
        const GQ = {};
        GQ["name"] = "firstpay_char1", GQ["path"] = "image/character/sbfm_jiangwei.jpg";
        const Gh = {};
        Gh["name"] = "firstpay_char2", Gh["path"] = "image/character/caojinyu.jpg";
        const GL = {};
        GL["name"] = "firstpay_char3", GL["path"] = "image/character/dc_xh_zhangchunhua.jpg";
        const Gs = [Go, Gj, GD, GJ, GI, Gi, GT, Gg, GB, Gq, Gn, GZ, Gz, GN, GR, GS, GX, GH, GO, GQ, Gh, GL];
        Gs["forEach"](Uy => { Gb["add"](Uy["name"], lib["assetURL"] + Uy["path"]); }), Gb["load"](y4);
        let Gv = lifecycle.ticker();
        if (lib["config"]["scollannouncement"]) {
            let Uy = new PIXI["Graphics"]();
            Uy["beginFill"](0x0, 0.65), Uy["drawRect"](0x0, 0x0, i["screen"]["width"], 0x14), Uy["endFill"](), GK["addChild"](Uy);
            var GV = function () { const K4 = K1, K3 = K0; let UU = lifecycle.container(); UU["width"] = i["screen"][K3(0x2b1)], UU["height"] = 0.1 * i["screen"]["height"], UU[K3(0x2d8)] = "textcon", Uy["addChild"](UU); var Uk = "玩家", Uf = lib["config"]["connect_nickname"], UY = ["氪金抽66", "卡宝真可爱", "蒸蒸日上", "√卡视我如父", "麒麟弓免疫枸杞", "坏可宣（老坏批）", "六千大败而归", "蒸", "夕宝", "黄小花", "山猪", "开局酒古锭", "遇事不决刷个乐", "见面两刀喜相逢", K4(0x153, "FbmE"), "时代的六万五", "韩旭", "司马长衫", "ogx", "狗卡不如无名杀", "王八万", "一拳兀突骨", "开局送神将", "丈八二桃", "装甲车车", K3(0x22b), "Samuri", "马", "kimo鸡～木木", "Log-Frunki", "aoe银钱豹", "没有丈八就托管", "无中yyds", "给咸鱼鸽鸽打call", "小零二哟～", "长歌最帅了", "大猫有侠者之风", "布灵布灵❤️", "我爱～摸鱼🐠～", "小寻寻真棒", "呲牙哥超爱笑", "是俺杀哒", "阿七阿七", "祖安·灰晖是龙王", "吃颗桃桃好遗计", "好可宣✓良民", "藏海表锅好", "金乎？木乎？水乎！！", "无法也无天", "西风不识相", "神秘喵酱", "星城在干嘛？", "子鱼今天摸鱼了吗？", "阳光苞里有阳光", "诗笺的小裙裙", "轮回中的消逝", "乱踢jb的云野", "小一是不是...是不是...", "美羊羊爱瑟瑟", "化梦的星辰", "杰哥带你登dua郎", "世中君子人", "叹年华未央", "短咕咕", "若石", "很可爱的小白", "沉迷踢jb的云野", "厉不厉害你坤哥", "东方太白", "恶心的死宅", "风回太初", "隔壁的戴天", "林柒柒", "洛神", "ikun", "蒙娜丽喵", "只因无中", "女宝", "远道", "翘课吗？", "失败的man", "晚舟", "叙利亚野🐒", "幸运女神在微笑", "知天意，逆天寒", "明月栖木", "路卡利欧", "兔兔", "香蕉", "douyun", "启明星阿枫", "雨夜寒稠", "洛天依？！", "黄老板是好人～", "来点瑟瑟文和", "鲨鱼配辣椒", "萝卜～好萝卜", "废城君", "E佬细节鬼才", "感到棘手要怀念谁？", "半价小薯片", "JK欧拉欧拉欧拉", "新年快乐", "乔姐带你飞", "12345678？", "缘之空", K3(0x19d), "教主：杀我！", "才思泉涌的司马", "我是好人", "喜怒无常的大宝", "黄赌毒", "阴间杀～秋", "敢于劈瓜的关羽", "暮暮子", "潜龙在渊"]["randomGet"](), Um = [UY, Uf]["randomGet"](), Ub = ["通过", "使用", "开启"]["randomGet"](), UK = ["周年", "五一", "踏青", "牛年", "开黑", "冬至", "春分", "鼠年", "盛典", "魏魂", "群魂", "蜀魂", "吴魂", "猪年", "圣诞", "国庆", "狗年", "金秋", "奇珍", "元旦", "小雪", "冬日", "招募", "梦之回廊", "虎年", "新春", "七夕", "大雪", "端午", "武将", "中秋", "庆典"]["randomGet"](), Uw = ["盒子", "宝盒", "礼包", "福袋", "礼盒", "庆典", "盛典"]["randomGet"](), Uc = "获得了", Ud = ["界钟会×1", "王朗×1", "马钧×1", "司马昭×1", "司马师×1", "王平×1", "诸葛瞻×1", "张星彩×1", K3(0x288), "关索×1", "骆统×1", "周处*1", "界步练师*1", "界朱然*1", "贺齐*1", "苏飞*1", "公孙康×1", "杨彪×1", "刘璋×1", "张仲景×1", "司马徽×1", "曹婴×1", "徐荣×1", "史诗宝珠*66", "史诗宝珠*33", "麒麟生角·魏延*1", "史诗宝珠*10", "刘焉×1", "孙寒华×1", "戏志才×1", "界曹真×1", "曹婴×1", "王粲×1", "界于禁×1", "郝昭×1", "界黄忠×1", K4(0x211, "r6vR"), "周群×1", "赵襄×1", "马云禄×1", K4(0x2cc, "rkb@"), "留赞×1", "吴景×1", "界徐盛×1", "许攸×1", "杜预×1", "界李儒×1", "张让×1", "麹义×1", "司马徽×1", "界左慈×1", "鲍三娘×1", "界徐盛×1", "南华老仙×1", "韩旭の大饼*100", "神郭嘉×1", "吴景×1", "周处×1", "杜预×1", "司马师×1", "羊微瑜×1", K4(0x158, rzshdj.G)]["randomGet"](), Up = ["谋定天下·陆逊*1（动+静）", "龙困于渊·刘协（动+静）*1", "星花柔矛·张星彩*1（动+静）", "呼啸生风·许褚*1（动+静）", K3(0x148), "鹰视狼顾·司马懿*1（动+静）", K3(0x1ed), K3(0x17b), "十胜十败·郭嘉*1（动+静）", "猪年端午·曹丕*1（动+静）", "背水一战·张郃*1（动+静）", "神兵天降·邓艾*1（动+静）", "独来固志·王基*1（动+静）", "猪年圣诞·刘备*1（动+静）", "哮风从龙·关羽*1（动+静）", "西凉雄狮·马超*1（动+静）", "鏖战赤壁·黄盖*1（动+静）", "星流霆击·孙尚香*1（动+静）", "猪年圣诞·陆逊*1（动+静）", "鼠年七夕·貂蝉*1（动+静）", "迅雷风烈·张角*1（动+静）", K3(0x2a2), "盛气凌人·许攸*1（动+静）", "玄冥天通·神曹操*1（动+静）", "魂牵梦绕·灵雎*1（动+静）", "肝胆相照·⭐甘宁*1（动+静）", "超脱于世·庞德公*1（动+静）", "雄踞益州·刘焉*1（动+静）", "鼠年春节·兀突骨*1（动+静）", "牛年端午·孙鲁班*1（动+静）", "灵魂歌王·留赞*1（动+静）", K3(0x30f), "猪年春节·孙鲁育*1（动+静）", "长沙桓王·孙笨*1（动+静）", "如花似朵·小乔*1（动+静）", "嫣然一笑·鲍三娘*1", "锐不可当·张翼*1（动+静）", "鼠年中秋·关索*1（动+静）", "花海舞枪·马云禄*1（动+静）", "木牛流马·黄月英*1（动+静）", "锋芒毕露·曹婴*1（动+静）", "长坂败备·曹纯*1（动+静）", "龙袭星落·王朗*1（动+静）", "举棋若定·戏志才*1（动+静）", "泰山捧日·程昱*1（动+静）", "冬日·王元姬（动态+静态）*1", K3(0x2bf), "神甘宁×1", K3(0x271), "银币*66666", "将魂*66666", "琪花瑶草·徐氏*1（动+静）", "肝胆相照·星甘宁*1（动+静）", "星流霆击·孙尚香（动+静）*1", "锋芒毕露·曹婴*1（动+静）", K3(0x304)]["randomGet"](), Ur = [",大家快恭喜TA吧！", ",大家快恭喜TA吧。无名杀是一款非盈利游戏(づ ●─● )づ", ",祝你新的一年天天开心，万事如意"]["randomGet"](), UM = K4(0x1be, "r6vR"), Uu = "#efe8dc", Ut = "#22c622"; const UW = {}; UW["fontFamily"] = UM, UW["fontSize"] = 0x12, UW["fill"] = K3(0x155); const Ue = {}; Ue["fontFamily"] = UM, Ue["fontSize"] = 0x12, Ue["fill"] = "#f3c20f"; var UA = [new PIXI["Text"](" " + Ud, UW), new PIXI["Text"](" " + Up, Ue)]["randomGet"](); const Ua = {}; Ua["fontFamily"] = UM, Ua["fontSize"] = 0x12, Ua["fill"] = Uu; let Uo = new PIXI["Text"](" " + Uk, Ua); const Uj = {}; Uj["fontFamily"] = UM, Uj["fontSize"] = 0x12, Uj["fill"] = Uu, Uo["addChild"](new PIXI["Text"](" " + Um, Uj)); const UD = {}; UD["fontFamily"] = UM, UD["fontSize"] = 0x12, UD["fill"] = "white", Uo["addChild"](new PIXI["Text"](" " + Ub, UD)); const UJ = {}; UJ["fontFamily"] = UM, UJ["fontSize"] = 0x12, UJ["fill"] = Ut, Uo["addChild"](new PIXI["Text"](" " + UK + Uw, UJ)); const UI = {}; UI["fontFamily"] = UM, UI["fontSize"] = 0x12, UI["fill"] = "white", Uo["addChild"](new PIXI["Text"](" " + Uc, UI)), Uo["addChild"](UA); const Ui = {}; Ui[K4(0x20e, "KsXd")] = UM, Ui["fontSize"] = 0x12, Ui["fill"] = "white", Uo["addChild"](new PIXI[(K4(0x2a1, "JHx]"))](" " + Ur, Ui)), Uo["children"]["forEach"]((UT, Ug) => { const K5 = K3; UT["x"] = Ug > 0x0 ? Uo["children"][Ug - 0x1]["x"] + Uo[K5(0x1bc)][Ug - 0x1]["width"] + 0x1 : Uo["width"], UT["y"] = 0x0; }), UU["x"] = i["screen"]["width"], UU["addChild"](Uo), window["bbgp"] = !![], window["bbcount"] = 0x0; };
            GV(), Gv["add"](UG), Gv["start"]();
            function UG(UU) {
                window["bbgp"] == ![] && (window["bbcount"]++, window["bbcount"] > 0x3e8 && Math["random"]() < 0.01 && (Uy["visible"] = !![], GV()));
                if (window["bbgp"] == !![]) {
                    let Uk = Uy["getChildByName"]("textcon");
                    Uk["x"] -= 1.5, Uk["x"] < -0x2bc * G7 && (Uk["destroy"](), Math["random"]() < 0.8 ? GV() : (Uy["visible"] = ![], window["bbgp"] = ![]));
                }
            }
        }
        let GP = null;
        function Gl(UU) {
            if (GP !== null) { clearTimeout(GP); GP = null; }
            if (UU === GK) window.isOnhide = false;
            const K6 = K0;
            UU != GK ? (window["isOnhide"] = !![], GK["removeChild"](Gw), GK[K6(0x31a)](Gu), GK["removeChild"](GM), GW(Gc, "top"), GW(Gr, "under"), GW(Gd, "left"), GW(Gp, K6(0x28c)), GP = setTimeout(function () {
                window["isOnhide"] = ![], i["stage"]["removeChild"](GK);
                if (GP != null)
                    clearTimeout(GP);
                GP = null;
            }, 0x1f4), i["stage"]["addChild"](UU)) : (i["stage"]["children"].slice()["forEach"](function (Uk) { Uk !== G2 && i["stage"]["removeChild"](Uk); }), i["stage"]["addChild"](UU)), window["container"] = UU;
        }
        function GE() { const K7 = K1; Gl(GK), G2["texture"] = GG[K7(0x15d, "!2E0")]["uiBG"]["texture"], lifecycle.cover(G2); }
        function GF(UU, Uk) {
            const Uf = UU["name"];
            Uk !== undefined && (UU["interactive"] = !![], UU["on"]("pointerup", U4), UU["on"]("pointerdown", U5));
            if (!rzshUs[Uf])
                return;
            UU["x"] = rzshUs[Uf]["x"] * G7, UU["y"] = rzshUs[Uf]["y"] * G8, UU["anchor"]["set"](0.5), UU["scale"]["set"](rzshUs[Uf]["scale"] * (/bg|kuang/.test(Uf) ? G7 : G9), rzshUs[Uf]["scale"] * (/bg|kuang/.test(Uf) ? G8 : G9));
        }
        function GC(UU) { UU["anchor"]["set"](0.5), UU["scale"]["set"](0.29 * G9); }
        function Gx(UU, Uk) {
            const Uf = UU["name"];
            Uk !== undefined && (UU["interactive"] = !![], UU["on"]("pointerup", U4), UU["on"]("pointerdown", U5));
            if (!rzshUs[Uf])
                return;
            UU["x"] = rzshUs[Uf]["x"], UU["y"] = rzshUs[Uf]["y"], UU["anchor"]["set"](0.5), UU["scale"]["set"](rzshUs[Uf]["scale"], rzshUs[Uf]["scale"]);
        }
        const y0 = {};
        y0["repeat"] = -0x1, y0["yoyo"] = !![];
        let y1 = gsap["timeline"](y0);
        const y2 = {};
        y2["repeat"] = -0x1, y2["yoyo"] = !![];
        let y3 = gsap["timeline"](y2);
        function y4() {
            let UU = ![];
            function Uk() {
                if (UU)
                    return;
                UU = !![], window["_rzsh_themeLocked"] = !![], y5();
            }
            if (window["_rzsh_themeLocked"]) {
                Uk();
                return;
            }
            const Uf = setTimeout(() => {
                if (!window["_rzsh_themeLocked"]) {
                    try {
                        const UY = Date["now"](), Um = new Date("2026-08-31T23:23:59+08:00")["getTime"]();
                        window["_rzsh_theme"] = UY <= Um ? "马年七夕" : "吕布貂蝉";
                    }
                    catch (Ub) {
                        window["_rzsh_theme"] = "吕布貂蝉";
                    }
                    console["warn"]("[rzsh] 主题检测超时，兜底:", window["_rzsh_theme"]);
                }
                Uk();
            }, 0xbb8);
            Promise["resolve"](window["_rzsh_themeReady"])["then"](() => { clearTimeout(Uf), Uk(); })["catch"](() => { clearTimeout(Uf), Uk(); });
        }
        function y5() {
            const rzshds = { G: "jS]8" }, Kp = K0, K8 = K1;
            console["timeEnd"]("y加载完毕");
            const UU = new PIXI["Sprite"]();
            UU["name"] = "mode1bbg";
            const Uk = new PIXI["Sprite"]();
            Uk[K8(0x247, "5r0j")] = "mode1tt";
            const Uf = new PIXI["Sprite"](), UY = new PIXI["Sprite"]();
            UY["position"]["set"](0x154 * G7, 0x5a * G8), UY["scale"]["set"](G9);
            const Um = new PIXI["Sprite"]();
            Um["name"] = "modesecoff1", Um["interactive"] = !![], Um["on"]("pointerup", Ud), Um["on"]("pointerdown", U5);
            const Ub = new PIXI["Sprite"]();
            Ub["name"] = "modesecoff2", Ub["interactive"] = !![], Ub["on"]("pointerup", Ud), Ub["on"]("pointerdown", U5);
            const UK = new PIXI["Sprite"]();
            UK["name"] = "modesecoff3", UK["interactive"] = !![], UK["on"]("pointerup", Ud), UK["on"]("pointerdown", U5), GF(Um), GF(Ub), GF(UK), Uf["name"] = "5pjz";
            const Uw = new PIXI["Sprite"]();
            Uw["name"] = "8pjz";
            const Uc = new PIXI["Sprite"]();
            Uc["name"] = "guowar", Ga["on"]("added", () => {
                const rzshdX = { G: 0x1a1 }, KG = rzshy, K9 = K8;
                G2["texture"] = GG["resources"]["loadingbg"]["texture"];
                let kn = Gb["resources"]["modesecb"]["textures"];
                if (window["moode"] == K9(0x25e, "Q@V7"))
                    UU["texture"] = ym["resources"]["shenfen"]["texture"], GF(UU), Uk["texture"] = kn["mode1tt"], Uf["texture"] = kn["5pjz"], Uw["texture"] = kn["8pjz"], Uc["texture"] = kn["guowar"], UY["texture"] = kn[KG(0x1d6)], Um["texture"] = kn[K9(0x1b2, "Z6A)")], Ub["texture"] = kn["modesecoff"], UK["texture"] = kn["modesecoff"], G3["state"]["setAnimation"](0x0, "kaishi", ![]), G3["state"]["tracks"][0x0]["onComplete"] = function () { G3["state"]["setAnimation"](0x0, "jingzhi", !![]); }, U6("identity", "normal", 0x5);
                else
                    window["moode"] == "doudizhu" && (UU["texture"] = ym["resources"][KG(0x1f1)]["texture"], GF(UU), UU["scale"]["set"](0.57 * G9), UU["x"] -= 0x73 * G7, Uk["texture"] = kn["hhddz"], Uf["texture"] = kn["ddzxx"], Uw["texture"] = kn[K9(0x31d, "FbmE")], Uc["texture"] = kn["ddzbl"], UY["texture"] = kn["ddzxx"], Um["texture"] = kn["modesecon"], Ub["texture"] = kn["modesecoff"], UK["texture"] = kn["modesecoff"], G3["state"]["setAnimation"](0x0, "kaishi", ![]), G3["state"]["tracks"][0x0]["onComplete"] = function () { const Ky = KG; G3["state"][Ky(rzshdX.G)](0x0, "jingzhi", !![]); }, U6("doudizhu", "normal", 0x3));
            }), Ga["on"]("removed", () => { });
            function Ud(kn) {
                const Kk = K8, KU = rzshy;
                let kZ = Gb["resources"]["modesecb"]["textures"];
                if (window["currentSprite"] != kn["target"])
                    return;
                window["currentSprite"] = null;
                switch (kn["target"]["name"]) {
                    case "right_classic":
                        window["moode"] = "shenfen", lifecycle.showView("mode");
                        break;
                    case "right_activity":
                        window["moode"] = "doudizhu", lifecycle.showView("mode");
                        break;
                    case "right_adventure":
                        Gl(Ge);
                        break;
                    case "modesecoff1":
                        Um["texture"] = kZ["modesecon"], Ub["texture"] = kZ[KU(0x190)], UK[Kk(0x2d5, "P9FJ")] = kZ["modesecoff"];
                        window["moode"] == "shenfen" && (UU["texture"] = ym["resources"]["shenfen"]["texture"], UY[KU(0x23f)] = kZ["5pjz"], U6("identity", "normal", 0x5));
                        window[Kk(0x2c2, "vV5]")] == "doudizhu" && (UY["texture"] = kZ["ddzxx"], U6("doudizhu", "normal", 0x3));
                        G3["state"]["setAnimation"](0x0, "kaishi", ![]), G3["state"]["tracks"][0x0]["onComplete"] = function () { G3["state"]["setAnimation"](0x0, "jingzhi", !![]); };
                        break;
                    case "modesecoff2":
                        Um["texture"] = kZ["modesecoff"], Ub["texture"] = kZ["modesecon"], UK["texture"] = kZ["modesecoff"];
                        window["moode"] == "shenfen" && (UU["texture"] = ym["resources"]["shenfen"]["texture"], UY["texture"] = kZ["8pjz"], U6("identity", "normal", 0x8));
                        window["moode"] == KU(0x1f1) && (UY["texture"] = kZ["ddzhl"], U6("doudizhu", "huanle", 0x3));
                        G3["state"]["setAnimation"](0x0, "kaishi", ![]), G3["state"]["tracks"][0x0]["onComplete"] = function () { G3["state"]["setAnimation"](0x0, "jingzhi", !![]); };
                        break;
                    case "modesecoff3":
                        Um["texture"] = kZ["modesecoff"], Ub[KU(0x23f)] = kZ["modesecoff"], UK["texture"] = kZ["modesecon"];
                        window["moode"] == "shenfen" && (UU["texture"] = ym["resources"]["guozhan"]["texture"], UY["texture"] = kZ["guowar"], U6("guozhan"));
                        window["moode"] == "doudizhu" && (UY["texture"] = kZ["ddzbl"], U6("doudizhu", "binglin", 0x3));
                        G3["state"]["setAnimation"](0x0, "kaishi", ![]), G3["state"]["tracks"][0x0]["onComplete"] = function () { G3["state"]["setAnimation"](0x0, "jingzhi", !![]); };
                        break;
                    case "right_ranking":
                        lifecycle.showView("ranking");
                        break;
                    case "mode3":
                        let kN = [["single", "dianjiang"], ["identity", "normal", 0x5], ["identity", "normal", 0x8], ["doudizhu", "huanle", 0x3], ["guozhan"], ["doudizhu", "binglin", 0x3], ["doudizhu", "normal", 0x3], ["identity", "zhong"], ["identity", "purple"], ["versus", "two"], ["versus", "four"]];
                        const kR = Math["floor"](Math["random"]() * kN["length"]);
                        U6(...kN[kR]), U8();
                        break;
                    case "mode4":
                        U6("brawl"), U8();
                        break;
                    case "pifubutton":
                        lifecycle.skins();
                        break;
                    case "wujiangbutton":
                        lifecycle.showView("characters");
                        break;
                    case KU(0x15f):
                        if (confirm(lib["config"]["zhuanzhuan"] == !![] ? "是否关闭转盘效果" : "是否打开转盘效果")) {
                            if (lib["config"]["zhuanzhuan"])
                                game["saveConfig"]("zhuanzhuan");
                            else
                                game["saveConfig"]("zhuanzhuan", !![]);
                        }
                        break;
                    case "cangzhengebutton":
                        GK["addChild"](kT);
                        break;
                    case "zhaomubutton":
                        lifecycle.showView("recruit");
                        break;
                    case "pica":
                        lifecycle.showView("profile");
                        break;
                    case "lobby_bg_btn_bg1":
                        if (lib["config"]["extension_如真似幻_menuInit"] == "1" || lib["config"]["extension_如真似幻_menuInit"] == "2")
                            GK["getChildByName"]("publicui_changebg") ? (kp["texture"] = Gb["resources"]["ui_tw"]["textures"]["lobby_bg_btn_bg1"], GK["removeChild"](kB)) : (kp["texture"] = Gb["resources"]["ui_tw"]["textures"]["lobby_bg_btn_bg"], GK["addChild"](kB));
                        else {
                            var kz = ui["create"]["div"](".huanpaiwenzi", document["body"]);
                            kz["innerHTML"] = "没有可以切换的背景", PIXI[Kk(0x205, "6)6d")]["play"]("Notice02"), setTimeout(() => { const Kf = Kk; kz[Kf(0x152, rzshds.G)](), void 0; }, 0xbb8);
                        }
                        break;
                    case "lobby_bg_close_btn":
                        GK[KU(0x185)]("publicui_changebg") && (kp["texture"] = Gb["resources"]["ui_tw"]["textures"]["lobby_bg_btn_bg1"], GK["removeChild"](kB));
                        break;
                    default: rzsh["function"]["alert"]("功能暂未开启，敬请期待！<br>关注微信公众号【无名杀十周年】了解更多资讯"), console["log"](kn["target"]);
                }
            }
            function Up(kn) {
                const Km = rzshy, KY = K8;
                var kZ = kn["target"];
                window["currentSprite"] = kn[KY(0x1a2, "]!s^")];
                var kz = kZ["scale"]["x"], kN = kZ["scale"]["y"];
                switch (kZ["name"]) {
                    case "right_classic":
                    case "right_ranking":
                    case "right_activity":
                    case "right_adventure":
                        PIXI["sound"]["play"]("HugeButtom");
                        kZ["isOndown"] != !![] && (kZ["isOndown"] = !![], gsap["to"](kZ["scale"], { "duration": 0.15, "x": 0.95 * kz, "y": 0.95 * kN, "ease": "power2.inOut", "onComplete": () => { gsap["to"](kZ["scale"], { "duration": 0.15, "x": kz, "y": kN, "ease": "power2.inOut", "onComplete": () => { kZ["isOndown"] = ![]; } }); } }));
                        break;
                    case "uactive1":
                        PIXI["sound"]["play"]("PopUp");
                        break;
                    case "vip_btn":
                        PIXI["sound"]["play"]("Pop"), kZ["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { kZ["filters"] = [P]; }, "onComplete": () => { kZ["filters"] = null; } });
                        break;
                    case "yuanbao_btn":
                        let kR = Math["round"](Math["random"]());
                        if (kR == 0x0)
                            PIXI[KY(0x214, "f@0[")][Km(0x2ef)]("Money01");
                        else
                            PIXI["sound"]["play"]("Money02");
                        kZ["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { kZ["filters"] = [P]; }, "onComplete": () => { kZ["filters"] = null; } });
                        break;
                    case "publicui_changebtn1":
                    case "publicui_changebtn2":
                        PIXI["sound"]["play"]("Menu");
                        break;
                    default: PIXI["sound"]["play"]("MidButton"), kZ["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { kZ["filters"] = [P]; }, "onComplete": () => { kZ["filters"] = null; } });
                }
            }
            const Ur = Gb["resources"]["ui_tw"]["textures"], UM = Gb["resources"]["btn_new"]["textures"], Uu = Gb["resources"]["btn_new"]["data"]["animations"], Ut = Gb["resources"]["chongzhi"]["data"]["animations"], UW = Gb["resources"]["uilight"]["textures"], Ue = Gb["resources"]["uilight"]["data"]["animations"], UA = Gb["resources"]["uivip"][K8(0x31e, "!2E0")], Ua = Gb["resources"]["uiczg"]["data"]["animations"];
            function Uo(kn) { const kZ = new PIXI["Sprite"](Ur[kn]); return kZ["name"] = kn, kZ; }
            function Uj(kn) { const kZ = new PIXI["Sprite"](Ur[kn]); return kZ["name"] = kn, kZ["interactive"] = !![], kZ["on"]("pointerdown", Up), kZ["on"]("pointerup", Ud), kZ; }
            function UD(kn) { const kZ = new PIXI["Sprite"](UM[kn]); return kZ["name"] = kn, kZ["interactive"] = !![], kZ["on"]("pointerdown", Up), kZ["on"]("pointerup", Ud), kZ; }
            function UJ(kn) { const Kb = K8, kZ = new PIXI["AnimatedSprite"]["fromFrames"](Uu[kn]); return kZ["name"] = kn, kZ["interactive"] = !![], kZ[Kb(0x244, "2^^M")] = 0.5, kZ["play"](), kZ["on"]("pointerdown", Up), kZ["on"]("pointerup", Ud), kZ; }
            function UI(kn) { const kZ = new PIXI["Sprite"](UA[kn]); return kZ["name"] = kn, kZ["interactive"] = !![], kZ["on"]("pointerdown", Up), kZ["on"]("pointerup", Ud), kZ; }
            function Ui(kn) { const kZ = new PIXI["AnimatedSprite"]["fromFrames"](Ut[kn]); return kZ["name"] = kn, kZ["animationSpeed"] = 0.5, kZ["play"](), kZ; }
            function UT(kn) { const KK = K8, kZ = new PIXI["AnimatedSprite"]["fromFrames"](Ut[kn]); return kZ["name"] = kn, kZ["interactive"] = !![], kZ["animationSpeed"] = 0.5, kZ["play"](), kZ["on"](KK(0x2b0, "TK2T"), Up), kZ["on"]("pointerup", Ud), kZ; }
            function Ug(kn) { const kZ = new PIXI["Sprite"](UW[kn]); return kZ["name"] = kn, kZ["interactive"] = !![], kZ; }
            function UB(kn) { const kZ = new PIXI["AnimatedSprite"]["fromFrames"](Ue[kn]); return kZ["name"] = kn, kZ["interactive"] = !![], kZ["animationSpeed"] = 0x1, kZ["play"](), kZ; }
            function Uq(kn) { const kZ = new PIXI["AnimatedSprite"]["fromFrames"](Ua[kn]); return kZ["name"] = kn, kZ["interactive"] = !![], kZ["animationSpeed"] = 0.5, kZ["play"](), kZ["on"]("pointerdown", Up), kZ["on"]("pointerup", Ud), kZ; }
            Gb["add"]("modesecb", lib["assetURL"] + "extension/如真似幻/images/mode.json"), Gb["add"]("spinekss", lib["assetURL"] + "extension/如真似幻/spine/kaizhan.skel"), Gb["add"]("maisuiskel", lib["assetURL"] + "extension/如真似幻/spine/SSHW_eff_maisui.skel"), Gb["add"]("SSHW_DT_eff_yuanbaoshudiguang", lib["assetURL"] + "extension/如真似幻/spine/SSHW_DT_eff_yuanbaoshudiguang.skel"), Gb[K8(0x259, "J*tF")]("SSHW_DT_eff_yuanbaoshushanshuo", lib["assetURL"] + "extension/如真似幻/spine/SSHW_DT_eff_yuanbaoshushanshuo.skel"), Gb["add"]("ui_lottery_entrance", lib["assetURL"] + "extension/如真似幻/images/anim_pick2.json"), Gb["add"]("coranim", lib["assetURL"] + "extension/如真似幻/spine/lottery/Ss_CangZhenGe_cj_1.skel"), Gb["add"]("czganim", lib["assetURL"] + "extension/如真似幻/spine/lottery/Ss_CangZhenGe_cj_2.skel");
            window["_rzsh_theme"] === "马年七夕" ? (Gb["add"]("uihomeskelbg", lib["assetURL"] + K8(0x300, "v*9j")), Gb["add"]("uihomeskel", lib["assetURL"] + "extension/如真似幻/spine/uihome/马年七夕/XingXiang.skel")) : (Gb["add"]("uihomeskelbg", lib["assetURL"] + "extension/如真似幻/spine/uihome/吕布貂蝉/beijing.json"), Gb["add"](K8(0x28d, "4(Dr"), lib["assetURL"] + "extension/如真似幻/spine/uihome/吕布貂蝉/daiji.json"), Gb["add"]("uihomeskelfg", lib["assetURL"] + "extension/如真似幻/spine/uihome/吕布貂蝉/qianjing.json"), Gb["add"]("uihomeskellb", lib["assetURL"] + "extension/如真似幻/spine/uihome/吕布貂蝉/吕布/daiji.json"));
            Gb["load"](() => {
                const Kd = K8, Kc = rzshy;
                function kn(kL) {
                    const Kw = rzshU;
                    kL["target"]["alpha"] = 0x1;
                    switch (kL[Kw(0x1cc, "jS]8")]["name"]) {
                        case "spinekz":
                            if (lib["config"][Kw(0x17c, "0ka9")] && (lib["config"]["mode"] == "doudizhu" || lib["config"]["mode"] == "identity" || lib["config"]["mode"] == "guozhan"))
                                U7();
                            else
                                U8();
                            break;
                        default:
                    }
                }
                let kZ = Gb["resources"]["modesecb"]["textures"];
                function kz(kL) { const ks = new PIXI["Sprite"](kZ[kL]); return ks["name"] = kL, ks; }
                function kN(kL) { const ks = new PIXI["Sprite"](kZ[kL]); return ks["name"] = kL, ks["interactive"] = !![], ks["on"]("pointerup", kn), ks["on"]("pointerdown", Up), ks; }
                const kR = kz("modesecbg");
                GF(kR), Ga["addChild"](kR), Ga["setChildIndex"](kR, 0x0), GF(UU), Ga["addChild"](UU);
                const kS = kz("modettb");
                GF(kS), Ga["addChild"](kS), GF(Uk), Ga["addChild"](Uk), Ga["addChild"](Um, Ub, UK);
                const kX = kz("whelp");
                GF(kX), Ga["addChild"](kX), GF(Uf), GF(Uw), GF(Uc), Ga["addChild"](Uf, Uw, Uc), Ga["addChild"](UY);
                const kH = Uo("top_back");
                GF(kH, !![]), kH["x"] = i["screen"]["width"] - kH["width"] * kH["scale"]["x"], Ga["addChild"](kH), G3 = new PIXI["spine"]["Spine"](Gb["resources"]["spinekss"]["spineData"]), G3["name"] = "spinekz", G3["interactive"] = !![], G3["on"]("pointerup", kn), G3["on"]("pointerdown", Up), Ga["addChild"](G3), G3["x"] = 0x320 * G7, G3["y"] = 0x12c * G8, G3["scale"]["set"](0.7 * G9);
                const kO = !!lib["config"]["extension_如真似幻_static_homepage"], kQ = window["_rzsh_theme"] || "吕布貂蝉";
                kQ === "马年七夕" ? (C = new PIXI["spine"]["Spine"](Gb["resources"]["uihomeskelbg"]["spineData"]), x = new PIXI["spine"][(Kc(0x24e))](Gb["resources"]["uihomeskel"]["spineData"]), homeskel_fg = null, homeskel_lb = null, window["_homeskel_bg"] = C, window["_homeskel_cha"] = x, window["_homeskel_fg"] = null, window["_homeskel_lb"] = null, C["_isHomeSkel"] = !![], x["_isHomeSkel"] = !![], GM["addChild"](C, x), GM["setChildIndex"](C, 0x0), GM[Kd(0x210, "SdeW")](x, 0x1), kO ? (C["state"]["setAnimation"](0x0, "DaiJi", !![]), C["state"]["timeScale"] = 0x0, C["update"](0x0), x["state"]["setAnimation"](0x0, "DaiJi", !![]), x["state"]["timeScale"] = 0x0, x["update"](0x0)) : (C["state"]["setAnimation"](0x0, "ChuChang", ![]), C["state"]["addAnimation"](0x0, "DaiJi", !![], 0x0), x["state"]["setAnimation"](0x0, "ChuChang", ![]), x["state"]["addAnimation"](0x0, "DaiJi", !![], 0x0)), C["x"] = rzsh["spineData"]["马年七夕"]["uihomeskelbg"]["x"] * i["screen"]["width"], C["y"] = rzsh["spineData"]["马年七夕"]["uihomeskelbg"]["y"] * i["screen"]["height"], C["scale"]["set"](rzsh["spineData"]["马年七夕"]["uihomeskelbg"]["scale"] * G9), x["x"] = rzsh["spineData"]["马年七夕"]["uihomeskel"]["x"] * i["screen"]["width"], x["y"] = rzsh["spineData"]["马年七夕"]["uihomeskel"]["y"] * i[Kd(0x285, "hs^2")]["height"], x["scale"]["set"](rzsh["spineData"]["马年七夕"]["uihomeskel"]["scale"] * G9)) : (x = new PIXI["spine"]["Spine"](Gb["resources"]["uihomeskel"]["spineData"]), C = new PIXI["spine"]["Spine"](Gb["resources"]["uihomeskelbg"]["spineData"]), homeskel_fg = new PIXI["spine"]["Spine"](Gb["resources"]["uihomeskelfg"]["spineData"]), homeskel_lb = new PIXI["spine"]["Spine"](Gb["resources"]["uihomeskellb"]["spineData"]), window["_homeskel_cha"] = x, window["_homeskel_bg"] = C, window["_homeskel_fg"] = homeskel_fg, window["_homeskel_lb"] = homeskel_lb, C["_isHomeSkel"] = !![], homeskel_lb["_isHomeSkel"] = !![], x["_isHomeSkel"] = !![], homeskel_fg["_isHomeSkel"] = !![], GM["addChild"](C, homeskel_lb, x, homeskel_fg), GM["setChildIndex"](C, 0x0), GM["setChildIndex"](homeskel_lb, 0x1), GM["setChildIndex"](x, 0x2), GM["setChildIndex"](homeskel_fg, 0x3), kO ? (C["state"]["setAnimation"](0x0, "DaiJi", !![]), C["state"]["timeScale"] = 0x0, C["update"](0x0)) : (C["state"]["setAnimation"](0x0, "ChuChang", ![]), C["state"]["addAnimation"](0x0, "DaiJi", !![], 0x0)), C["x"] = rzsh["spineData"]["吕布貂蝉"]["uihomeskelbg"]["x"] * i["screen"][Kc(0x2b1)], C["y"] = rzsh["spineData"]["吕布貂蝉"]["uihomeskelbg"]["y"] * i["screen"]["height"], C["scale"]["set"](rzsh["spineData"]["吕布貂蝉"]["uihomeskelbg"][Kc(0x1f9)] * G9), kO ? (homeskel_lb["state"]["setAnimation"](0x0, "DaiJi", !![]), homeskel_lb["state"]["timeScale"] = 0x0, homeskel_lb["update"](0x0)) : (homeskel_lb["state"]["setAnimation"](0x0, "ChuChang", ![]), homeskel_lb["state"]["addAnimation"](0x0, "DaiJi", !![], 0x0)), homeskel_lb["x"] = rzsh["spineData"]["吕布貂蝉"]["uihomeskellb"]["x"] * i["screen"]["width"], homeskel_lb["y"] = rzsh[Kc(0x323)]["吕布貂蝉"]["uihomeskellb"]["y"] * i["screen"]["height"], homeskel_lb["scale"]["set"](rzsh["spineData"]["吕布貂蝉"]["uihomeskellb"]["scale"] * G9), kO ? (x["state"]["setAnimation"](0x0, "DaiJi", !![]), x["state"]["timeScale"] = 0x0, x["update"](0x0)) : (x["state"][Kc(0x1a1)](0x0, "ChuChang", ![]), x["state"][Kc(0x327)](0x0, "DaiJi", !![], 0x0)), x["x"] = rzsh["spineData"]["吕布貂蝉"]["uihomeskel"]["x"] * i["screen"]["width"], x["y"] = rzsh["spineData"]["吕布貂蝉"]["uihomeskel"]["y"] * i["screen"]["height"], x["scale"]["set"](rzsh["spineData"]["吕布貂蝉"]["uihomeskel"]["scale"] * G9), x["skeleton"]["scaleX"] = -0x1, x["skeleton"]["updateWorldTransform"](), kO ? (homeskel_fg["state"]["setAnimation"](0x0, "DaiJi", !![]), homeskel_fg["state"]["timeScale"] = 0x0, homeskel_fg["update"](0x0)) : (homeskel_fg["state"]["setAnimation"](0x0, "ChuChang", ![]), homeskel_fg["state"][Kc(0x327)](0x0, "DaiJi", !![], 0x0)), homeskel_fg["x"] = rzsh["spineData"]["吕布貂蝉"]["uihomeskelfg"]["x"] * i["screen"]["width"], homeskel_fg["y"] = rzsh["spineData"]["吕布貂蝉"]["uihomeskelfg"]["y"] * i["screen"]["height"], homeskel_fg["scale"]["set"](rzsh["spineData"]["吕布貂蝉"]["uihomeskelfg"]["scale"] * G9), homeskel_fg["skeleton"]["scaleX"] = -0x1, homeskel_fg["skeleton"]["updateWorldTransform"]());
                G5 = new PIXI["spine"]["Spine"](Gb["resources"][Kd(0x28a, "hs^2")][Kc(0x323)]), Gw["addChild"](G5), G5["state"]["setAnimation"](0x0, "play", !![]), G5["x"] = 0x4c, G5["y"] = 0x10d, G5["scale"][Kd(0x2e6, "OEFF")](0.9);
                function kh(kL) {
                    switch (kL["target"]["name"]) {
                        case "homeskel_cha":
                            x["state"]["setAnimation"](0x0, "TeShu", ![]), x["state"]["addListener"]({ "complete": () => { x["state"]["setAnimation"](0x0, "DaiJi", !![]); } });
                            break;
                        case "homeskel_cha2":
                            G1["state"]["setAnimation"](0x0, "TeShu", ![]), G1["state"]["addListener"]({ "complete": () => { G1["state"]["setAnimation"](0x0, "DaiJi", !![]); } });
                            break;
                    }
                }
                ;
            });
            const Un = Uo("left_fix");
            GF(Un), Gd["addChild"](Un), Gd["setChildIndex"](Un, 0x0);
            const UZ = Uo("maisui_line");
            GF(UZ), Gw["addChild"](UZ);
            const Uz = new PIXI["NineSlicePlane"](Gb["resources"][K8(0x23c, "xQ$a")]["textures"]["top_light_bg"], 0x11, 0x0, 0x2b, 0x0);
            GF(Uz), Uz["scale"]["set"](0.69), Uz["width"] = 0x318 * G7, Uz["position"]["set"](0x78 * G7, 0x28 * G8);
            const UN = Uo("top_user_bg");
            GF(UN), Gc[K8(0x2af, "0ka9")](Uz, UN);
            let UR = new PIXI["Sprite"](Gb["resources"]["pic"]["texture"]);
            UR["name"] = "pica", GF(UR), UR["interactive"] = !![], UR["on"]("pointerdown", Up), UR["on"]("pointerup", Ud), Gc["addChild"](UR);
            let US = new PIXI["Sprite"](Gb["resources"]["avatarframe"]["texture"]);
            US["name"] = "avatarframe", GF(US), UR["addChild"](US);
            const UX = new PIXI["Text"](lib["config"]["connect_nickname"]);
            UX["style"]["fontFamily"] = "shousha", UX["style"][Kp(0x1ba)] = 0x10, UX["position"]["set"](0x84 * G7, 0x2 * G8), UX["style"][K8(0x2ea, "Z6A)")] = "#C0C0C0";
            const UH = new PIXI["Text"]("Lv 220");
            UH["style"]["fontFamily"] = "shousha", UH["style"]["fontSize"] = 0x10, UH["position"]["set"](0xf4 * G7, 0x2 * G8), UH["style"]["fill"] = "#DAA520", Gc["addChild"](UX, UH);
            const UO = ["biao", "fen", "lin", "huo", "shan", "yin", "lei", "shen", "phone", "linju", "guo", "yijiang", "erjiang", "sanjiang", "sijiang", "wujiang", "liujiang", "qijiang", "sp", "kun", "xing", "zhi", "xin", "ren", "yon", Kp(0x30e), "mou_zhi", "mou_shi", "mou_tong", "mou_yu", "mou_neng", "xuan", "xia", "ding"], UQ = ["yin", "lei", "shen", Kp(0x1b8), "linju", "wujiang", "liujiang", "qijiang", "xuan", "xia", "ding"];
            for (let kn = 0x0; kn < UO["length"]; kn++) {
                const kZ = UO[kn];
                var Uh, UL, Us;
                kn <= 0x10 ? (UL = 0xfe + 0x18 * kn, Us = 0x35) : (UL = 0x18 * kn - 0x9a, Us = 0x4c), !UQ["includes"](kZ) ? (Uh = UB(kZ), GC(Uh), Uh["x"] = G7 * UL, Uh["y"] = G8 * Us, Gc["addChild"](Uh)) : (Uh = Ug(kZ), GC(Uh), Uh["x"] = G7 * UL, Uh["y"] = G8 * Us, Gc[K8(0x26b, "@0B1")](Uh));
            }
            const Uv = Uo("player_nan");
            GF(Uv);
            const UV = Uj(K8(0x154, "jS]8"));
            GF(UV);
            const UP = UT("exp_double");
            UP[K8(0x1eb, rzshpH.G)] = 0.4, GF(UP);
            const Ul = Uj("dajiangjun_pic");
            GF(Ul);
            const UE = Uo("dajiangjun_text");
            GF(UE);
            const UF = Uo("top_btn2");
            GF(UF);
            const UC = Ui("top_btn3");
            UC["animationSpeed"] = 0.4, GF(UC);
            const Ux = Uo("vip_level");
            GF(Ux);
            const k0 = lifecycle.container(), k1 = UI("vip_5");
            k1["x"] = 0x19e * G7, k1["y"] = -0x3 * G8, k1["scale"]["set"](0.8 * G9);
            const k2 = UI("vip_0");
            k2["x"] = 0x1b0 * G7, k2["y"] = -0x4 * G8, k2["scale"]["set"](0.8 * G9);
            const k3 = Uo("vip_jie");
            GF(k3);
            const k4 = Uj("vip_btn");
            GF(k4);
            const k5 = Uo("yuanbao");
            GF(k5);
            const k6 = new PIXI["Text"]("20000");
            k6["style"]["fontFamily"] = "shousha", k6["style"]["fontSize"] = 0x10, k6["position"]["set"](0x230 * G7, 0x3 * G8), k6["style"]["fill"] = "#C0C0C0";
            const k7 = UT("yuanbao_btn");
            k7["animationSpeed"] = 0.4, GF(k7), Gc["addChild"](Uv, UV, UP, Ul, UE, UF, UC, Ux, k4, k5, k6, k7);
            const k8 = Uo("top_right_bg");
            GF(k8), Gc["addChild"](k8), Gb["load"](() => {
                const KM = Kp, Kr = K8;
                for (let kz = 0x0; kz <= 0x2; kz++) {
                    const kN = Uo("top_btn_round");
                    GF(kN), kN["x"] = kN["x"] + kz * 0x44 * G7;
                    switch (kz) {
                        case 0x0:
                            const kR = UD("zongyoushanchuanbutton");
                            GF(kR);
                            const kS = {};
                            kS["fontFamily"] = "shousha", kS["fill"] = "#FAD8A5", kS["fontWeight"] = "lighter", kS["fontSize"] = 0x14, kS["align"] = "center";
                            const kX = new PIXI["Text"]("纵游山川", kS);
                            kX["anchor"]["set"](0.5), kX["position"]["set"](0x0, 0xf * G8), y1["to"](kR["scale"], { "x": 0x0, "duration": 0.5, "ease": "power1.inOut", "onComplete": () => { kR["texture"] == Gb["resources"]["btn_new"]["textures"]["zongyoushanchuanbutton"] ? (kR["texture"] = Gb["resources"]["btn_new"]["textures"]["mail_state_system"], kX["text"] = "在线礼包") : (kR["texture"] = Gb["resources"]["btn_new"]["textures"]["zongyoushanchuanbutton"], kX["text"] = "纵游山川"); } }, "+=" + 0x1), kN["addChild"](kR, kX);
                            break;
                        case 0x1:
                            const kH = new PIXI["spine"]["Spine"](Gb["resources"]["SSHW_DT_eff_yuanbaoshudiguang"]["spineData"]);
                            kH["state"]["setAnimation"](0x0, "play", !![]);
                            const kO = UD("yuanbaoshubutton");
                            GF(kO);
                            const kQ = new PIXI["spine"]["Spine"](Gb["resources"]["SSHW_DT_eff_yuanbaoshushanshuo"]["spineData"]);
                            kQ["state"]["setAnimation"](0x0, "play", !![]), kQ["position"]["set"](-0x3 * G7, 0x0);
                            const kh = {};
                            kh["fontFamily"] = "shousha", kh[Kr(0x20f, "J*tF")] = "#FAD8A5", kh["fontWeight"] = "lighter", kh["fontSize"] = 0x14, kh["align"] = "center";
                            const kL = new PIXI["Text"]("元宝树", kh);
                            kL["anchor"]["set"](0.5), kL["position"][Kr(0x292, "6)6d")](0x0, 0xf * G8), kN["addChild"](kH, kO, kQ, kL);
                            break;
                        case 0x2:
                            const ks = UD("youjianbutton");
                            GF(ks);
                            const kv = {};
                            kv["fontFamily"] = "shousha", kv["fill"] = "#FAD8A5", kv["fontWeight"] = "lighter", kv[KM(0x1ba)] = 0x14, kv["align"] = KM(0x1d3);
                            const kV = new PIXI["Text"]("邮件", kv);
                            kV["anchor"]["set"](0.5), kV["position"]["set"](0x0, 0xf * G8), kN["addChild"](ks, kV);
                            break;
                    }
                    Gc["addChild"](kN);
                }
            });
            for (let kz = 0x0; kz <= 0x3; kz++) {
                const kN = Uo("top_btn_square");
                GF(kN), kN["x"] = kN["x"] - kz * 0x43 * G7, kN["name"] = "topbtn" + kz, Gc["addChild"](kN);
                switch (kz) {
                    case 0x0:
                        const kR = Uq("yukasaoguang");
                        GF(kR), kR["animationSpeed"] = 0.3;
                        const kS = {};
                        kS[K8(0x224, "J*tF")] = "shousha", kS["fill"] = "#FAD8A5", kS["fontWeight"] = "500", kS["fontSize"] = 0x14, kS["align"] = "center", kS["Stroke"] = "#310C03", kS["strokeThickness"] = 0x5, kS["dropShadow"] = !![], kS["dropShadowColor"] = "#310C03", kS["dropShadowAngle"] = Math["PI"] / 0x4, kS["dropShadowDistance"] = 0x5, kS["dropShadowDistance"] = 0x2, kS["letterSpacing"] = 0x3;
                        const kX = new PIXI["Text"]("月卡", kS);
                        kX["anchor"]["set"](0.5), kX["position"]["set"](0x0, 0x1d * G8), kN["addChild"](kR, kX);
                        break;
                    case 0x1:
                        kN["texture"] = Gb["resources"]["ui_tw"]["textures"]["top_btn_square_firstpay"];
                        let kH = Uo("top_btn_square_bg");
                        GF(kH);
                        let kO = 0x1, kQ = Uj("top_btn_square_bg");
                        GF(kQ), kQ["scale"]["set"](0.7), kQ[K8(0x196, "PA38")] = kH, kQ["texture"] = Gb["resources"]["firstpay_char3"][K8(rzshpH.y, "Q@V7")];
                        const kh = {};
                        kh["fontFamily"] = "shousha", kh["fill"] = "#FAD8A5", kh["fontWeight"] = "500", kh["fontSize"] = 0x14, kh["align"] = "center", kh["Stroke"] = "#310C03", kh[K8(0x14e, "r6vR")] = 0x5, kh["dropShadow"] = !![], kh["dropShadowColor"] = "#310C03", kh["dropShadowAngle"] = Math["PI"] / 0x4, kh["dropShadowDistance"] = 0x5, kh["dropShadowDistance"] = 0x2, kh["letterSpacing"] = 0x3;
                        const kL = new PIXI["Text"]("一将成名", kh);
                        kL["anchor"]["set"](0.5), kL["position"]["set"](0x0, 0x1d * G8), kN["addChild"](kH, kQ, kL);
                        break;
                    case 0x2:
                        const ks = UD("tehui");
                        GF(ks);
                        const kv = {};
                        kv["fontFamily"] = "shousha", kv["fill"] = "#FAD8A5", kv["fontWeight"] = "500", kv["fontSize"] = 0x14, kv["align"] = "center", kv["Stroke"] = "#310C03", kv["strokeThickness"] = 0x5, kv["dropShadow"] = !![], kv["dropShadowColor"] = "#310C03", kv["dropShadowAngle"] = Math["PI"] / 0x4, kv["dropShadowDistance"] = 0x5, kv["dropShadowDistance"] = 0x2, kv["letterSpacing"] = 0x3;
                        const kV = new PIXI["Text"]("特惠", kv);
                        kV["anchor"][K8(0x1df, "JHx]")](0.5), kV["position"]["set"](0x0, 0x1d * G8), kN["addChild"](ks, kV);
                        break;
                    case 0x3:
                        kN["texture"] = Gb["resources"]["ui_tw"]["textures"]["top_btn_diamond"], kN["y"] = kN["y"] + 0x2 * G8;
                        const kP = [["fightservant", "斗灵场"], ["adventure", "寻宝"], ["shenjiangge", "神将阁"], ["pray", "祈福"]];
                        let kl = 0x0;
                        const kE = UD("pub_func_icon");
                        GF(kE);
                        const kF = {};
                        kF[K8(0x1d2, "EZZT")] = "shousha", kF["fill"] = "#FAD8A5", kF["fontWeight"] = Kp(0x2d4), kF["fontSize"] = 0x14, kF["align"] = "center", kF["Stroke"] = "#310C03", kF["strokeThickness"] = 0x5, kF[K8(0x28e, "VwJt")] = !![], kF["dropShadowColor"] = "#310C03", kF["dropShadowAngle"] = Math["PI"] / 0x4, kF["dropShadowDistance"] = 0x5, kF["dropShadowDistance"] = 0x2, kF["letterSpacing"] = 0x3;
                        const kC = new PIXI["Text"](kP[kl][0x1], kF);
                        kC["anchor"]["set"](0.5), kC["position"]["set"](0x0, 0x1b * G8), kN["addChild"](kE, kC), kE["on"](K8(rzshpH.U, rzshpH.k), kq), y3["to"](kE["scale"], { "x": 0x0, "duration": 0.5, "ease": "power1.inOut", "onComplete": () => {
                                const Kt = K8, Ku = Kp;
                                if (kE["texture"] == Gb["resources"]["btn_new"]["textures"]["pub_func_icon"] || kE["texture"] == Gb["resources"]["btn_new"]["textures"][kP[kP["length"] - 0x1][0x0]])
                                    kE["texture"] = Gb["resources"][Ku(0x284)]["textures"][kP[0x0][0x0]], kC["text"] = kP[0x0][0x1], kl = 0x0;
                                else
                                    kE[Kt(0x30b, "tCfC")] == Gb["resources"]["btn_new"]["textures"][kP[kl][0x0]] && (kE["texture"] = Gb[Kt(0x295, "og)$")]["btn_new"]["textures"][kP[kl + 0x1][0x0]], kC["text"] = kP[kl + 0x1][0x1], kl++);
                            } }, "+=" + 0x1);
                        let kx = new PIXI["Graphics"]();
                        kx["beginFill"](0x0), kx["drawRect"](0x0, 0x0, i["screen"]["width"], i["screen"]["height"]), kx["endFill"](), kx[K8(0x2a3, "rz96")] = 0x0, kx["interactive"] = !![], kx["on"]("pointerup", () => { const KW = Kp; kN["texture"] = Gb["resources"][KW(0x15b)]["textures"]["top_btn_diamond"], kE[KW(0x23f)] = Gb["resources"]["btn_new"]["textures"][kP[kl][0x0]], kC["text"] = kP[kl][0x1], y3["restart"](), GM["removeChild"](kx), kN["removeChild"](f0); });
                        let f0 = new PIXI["NineSlicePlane"](Gb["resources"]["ui_tw"]["textures"]["top_btn_pressed_bg"], 0x10, 0x10, 0x10, 0x10);
                        f0["name"] = "pub_func_bg", f0["width"] = 4.5 * kN["width"] / 0.69, f0["height"] = (Math["floor"](kP["length"] / 0x5) + 0x1) * kN["height"] / 0.69, f0["position"]["set"](-0x66 * G7, 0x2a * G8);
                        for (let f1 = 0x0; f1 < kP["length"]; f1++) {
                            const f2 = Uo("top_btn_round_pressed");
                            GF(f2), f2["x"] = f2["x"] + f1 % 0x5 * kN["width"] / 0.69, f2["y"] = f2["y"] + Math[Kp(0x1b6)](f1 / 0x5) * kN["height"] / 0.69, f2["name"] = "roundbg" + f1, f0[Kp(0x291)](f2);
                            const f3 = UD(kP[f1][0x0]);
                            GF(f3), f3["scale"]["set"](0.64);
                            const f4 = Uo("pub_selchr_namebg");
                            GF(f4), f4["scale"]["set"](0.49, 0.54);
                            const f5 = {};
                            f5["fontFamily"] = "shousha", f5["fill"] = "#FAD8A5", f5["fontWeight"] = "lighter", f5["fontSize"] = 0x14, f5["align"] = "center";
                            const f6 = new PIXI[(Kp(0x277))](kP[f1][0x1], f5);
                            f6["anchor"]["set"](0.5), f6["position"]["set"](0x0, 0x11 * G8), f2["addChild"](f3, f4, f6);
                        }
                        function kq(f7) {
                            const KA = Kp, Ke = K8;
                            switch (f7["target"]["name"]) {
                                case "pub_func_icon":
                                    kN["getChildByName"]("pub_func_bg") == null ? (kN["texture"] = Gb["resources"]["ui_tw"]["textures"]["top_btn_diamond_pressed"], kE["texture"] = Gb["resources"]["btn_new"]["textures"]["pub_func_icon"], kC["text"] = "热门活动", y3["kill"](), GM[Ke(0x2c8, "jS]8")](kx), kN["addChild"](f0)) : (kN[Ke(0x31c, "sxFt")] = Gb["resources"][KA(0x15b)]["textures"]["top_btn_diamond"], kE["texture"] = Gb["resources"]["btn_new"]["textures"][kP[kl][0x0]], kC["text"] = kP[kl][0x1], y3["restart"](), GM["removeChild"](kx), kN["removeChild"](f0));
                                    break;
                            }
                        }
                        break;
                }
            }
            const k9 = Uo("maisui_btn");
            GF(k9);
            const kG = UD("chengzhangbutton");
            GF(kG);
            const ky = Uo("maisui_btn");
            GF(ky), ky["y"] = ky["y"] + 0x3d * G8;
            const kU = UD("shitubutton");
            GF(kU);
            const kk = Uo("maisui_btn");
            GF(kk), kk["y"] = kk["y"] + 0x7a * G8;
            const kf = UD("shequbutton");
            GF(kf), Gw["addChild"](kk, ky, k9), kk["addChild"](kf), ky["addChild"](kU), k9["addChild"](kG), Gw["on"]("added", () => { const Ko = Kp, Ka = K8, f7 = gsap["timeline"](), f8 = {}; f8["y"] = -0x74; const f9 = {}; f9["y"] = -0x37, f9["speed"] = 0.5, f9["duration"] = 0.9, f9["ease"] = "power1.inOut", f7["fromTo"](UZ, f8, f9); const fG = {}; fG["y"] = -0x38; const fy = {}; fy["y"] = 0x7f, fy["speed"] = 0.5, fy["duration"] = 0.9, fy["ease"] = "power1.inOut", f7["fromTo"](k9, fG, fy, "-=" + 0.9); const fU = {}; fU["y"] = -0x38; const fk = {}; fk["y"] = 0x7f, fk["speed"] = 0.5, fk["duration"] = 0.9, fk["ease"] = "power1.inOut", f7["fromTo"](ky, fU, fk, "-=" + 0.9); const ff = {}; ff["y"] = -0x38; const fY = {}; fY["y"] = 0x7f, fY["speed"] = 0.5, fY["duration"] = 0.9, fY["ease"] = "power1.inOut", f7["fromTo"](kk, ff, fY, "-=" + 0.9); const fm = {}; fm["y"] = -0x24; const fb = {}; fb["y"] = 0x93, fb["speed"] = 0.5, fb["duration"] = 0.9, fb["ease"] = "power1.inOut", f7["fromTo"](G5, fm, fb, "-=" + 0.9); const fK = {}; fK["y"] = -0x37; const fw = {}; fw["y"] = 0x6, fw[Ka(0x229, "rkb@")] = 0.5, fw["duration"] = 0.3, fw["ease"] = "power1.inOut", f7["fromTo"](UZ, fK, fw); const fc = {}; fc["y"] = 0x7f; const fd = {}; fd["y"] = 0xbc, fd["speed"] = 0.5, fd[Ka(0x2d0, "P9FJ")] = 0.3, fd["ease"] = "power1.inOut", f7["fromTo"](ky, fc, fd, "-=" + 0.3); const fp = {}; fp["y"] = 0x7f; const fr = {}; fr["y"] = 0xbc, fr["speed"] = 0.5, fr["duration"] = 0.3, fr[Ka(0x177, "vQIC")] = "power1.inOut", f7["fromTo"](kk, fp, fr, "-=" + 0.3); const fM = {}; fM["y"] = 0x93; const fu = {}; fu["y"] = 0xd0, fu["speed"] = 0.5, fu["duration"] = 0.3, fu["ease"] = "power1.inOut", f7["fromTo"](G5, fM, fu, "-=" + 0.3); const ft = {}; ft["y"] = 0x6; const fW = {}; fW["y"] = 0x43, fW["speed"] = 0.5, fW["duration"] = 0.3, fW[Ko(0x206)] = "power1.inOut", f7["fromTo"](UZ, ft, fW); const fe = {}; fe["y"] = 0xbc; const fA = {}; fA["y"] = 0xf9, fA[Ko(0x23d)] = 0.5, fA["duration"] = 0.3, fA["ease"] = "power1.inOut", f7["fromTo"](kk, fe, fA, "-=" + 0.3); const fa = {}; fa["y"] = 0xd0; const fo = {}; fo["y"] = 0x10d, fo["speed"] = 0.5, fo["duration"] = 0.3, fo["ease"] = "power1.inOut", f7["fromTo"](G5, fa, fo, "-=" + 0.3); });
            const kY = Uj("right_classic");
            GF(kY);
            const km = Uj("right_ranking");
            GF(km);
            const kb = Uj("right_activity");
            GF(kb);
            const kK = Uj("right_adventure");
            GF(kK), GM["addChild"](kY, km, kb, kK), lifecycle.sessionButtons(GM, 0x39a * G7, 432 * G8, G9), GM["on"](K8(0x24d, "P9FJ"), () => { U9(kY, 0.4), U9(km, 0.4), U9(kb, 0.4), U9(kK, 0.4); });
            const kw = Uo("bottom_bg");
            GF(kw);
            const kc = Uj("bottom_friend");
            GF(kc);
            const kd = Uj("bottom_chat");
            GF(kd);
            const kp = Uj("lobby_bg_btn_bg1");
            GF(kp);
            const kr = Uo("lobby_bg_btn");
            GF(kr), kp["addChild"](kr);
            const kM = Uo("actbk");
            GF(kM);
            const ku = Uj("uactive1");
            GF(ku);
            const kt = Uo("actak");
            GF(kt), Gr["addChild"](kw, kc, kd, kM, ku, kt);
            lib["config"]["extension_如真似幻_menuInit"] != "0" && Gr["addChild"](kp);
            const kW = Uj("activeea");
            GF(kW), Gr["addChild"](kW);
            for (let f7 = 0x0; f7 <= 0x5; f7++) {
                const f8 = Uo("rightbg");
                GF(f8), f8["x"] = f8["x"] + (f7 * 0x4e - 284.5) * G7, f8["y"] = 7.5 * G8, f8["scale"]["set"](0.64 * G9), Gr["addChild"](f8);
            }
            const ke = Uq("shop");
            GF(ke), ke[K8(0x1c8, "hs^2")] = 0.3;
            const kA = UJ(Kp(0x1ae));
            GF(kA), kA["animationSpeed"] = 0.3;
            const ka = UJ("cangzhengebutton");
            GF(ka), ka["animationSpeed"] = 0.3;
            const ko = UD("gonghuibutton");
            GF(ko);
            const kj = UD("guanjiebutton");
            GF(kj);
            const kD = UD("shilingbutton");
            GF(kD);
            const kJ = UD("pifubutton");
            GF(kJ);
            const kI = UD("wujiangbutton");
            GF(kI);
            const ki = Uo("bottom_plus");
            GF(ki, !![]), ki["x"] = i["screen"]["width"] - ki["width"] / 0x4, Gr["addChild"](kA, ka, ko, kj, kD, kJ, kI, ki), setTimeout(function () {
                lifecycle.initialHome(() => { Gl(GK);
                try {
                    G2["texture"] = GG["resources"]["uiBG"]["texture"];
                }
                catch (f9) { } });
                try {
                    F["destroy"]();
                }
                catch (fG) { }
                lifecycle.markHomeReady();
            }, 0xbb8), Gb["load"](() => {
                const KD = Kp, Kj = K8, f9 = new PIXI["NineSlicePlane"](Gb["resources"]["ui_tw"]["textures"]["top_light_bg"], 0x11, 0x0, 0x2b, 0x0);
                GF(f9), f9[Kj(0x31f, "hJkg")]["set"](0.69), f9["width"] = 0x318 * G7, f9["position"]["set"](0x78 * G7, 0x28 * G8);
                const fG = Uo("top_user_side");
                GF(fG);
                const fy = Uo("top_user_bg");
                GF(fy);
                let fU = new PIXI["Sprite"](Gb["resources"]["pic"]["texture"]);
                fU["name"] = "pica", GF(fU), fU["interactive"] = !![], fU["on"]("pointerdown", Up), fU["on"]("pointerup", Ud);
                let fk = new PIXI["Sprite"](Gb["resources"]["avatarframe"]["texture"]);
                fk["name"] = "avatarframe", GF(fk), fU["addChild"](fk), GA["addChild"](f9, fG, fy, fU), GA["setChildIndex"](fy, 0x1);
                const ff = new PIXI["Text"](lib["config"]["connect_nickname"]);
                ff["style"]["fontFamily"] = "shousha", ff["style"]["fontSize"] = 0x10, ff["position"]["set"](0x84 * G7, 0x2 * G8), ff["style"]["fill"] = KD(0x272);
                const fY = new PIXI["Text"]("Lv 220");
                fY["style"]["fontFamily"] = "shousha", fY["style"]["fontSize"] = 0x10, fY["position"]["set"](0xf4 * G7, 0x2 * G8), fY["style"]["fill"] = "#DAA520", GF(ff, fY), GA["addChild"](ff, fY);
                const fm = ["biao", "fen", "lin", "huo", "shan", "yin", "lei", "shen", "phone", KD(0x1cd), "guo", "yijiang", "erjiang", "sanjiang", "sijiang", "wujiang", "liujiang", KD(0x1ee), "sp", "kun", "xing", "zhi", "xin", "ren", "yon", "yan", "mou_zhi", "mou_shi", "mou_tong", "mou_yu", "mou_neng", "xuan", KD(0x18f), "ding"], fb = ["yin", "lei", "shen", "phone", KD(0x1cd), "wujiang", "liujiang", "qijiang", "xuan", "xia", "ding"];
                for (let fi = 0x0; fi < fm["length"]; fi++) {
                    const fT = fm[fi];
                    var fK, fw, fc;
                    fi <= 0x10 ? (fw = 0xfe + 0x18 * fi, fc = 0x35) : (fw = 0x18 * fi - 0x9a, fc = 0x4c), !fb["includes"](fT) ? (fK = UB(fT), GC(fK), fK["x"] = G7 * fw, fK["y"] = G8 * fc, GA["addChild"](fK)) : (fK = Ug(fT), GC(fK), fK["x"] = G7 * fw, fK["y"] = G8 * fc, GA["addChild"](fK));
                }
                const fd = Uj("exp_up1");
                GF(fd);
                const fp = UT("exp_double");
                fp["animationSpeed"] = 0.4, GF(fp);
                const fr = Uj(Kj(0x2df, "PYEN"));
                GF(fr);
                const fM = Uo("dajiangjun_text");
                GF(fM), GA["addChild"](fd, fp, fr, fM);
                const fu = Uo("top_back");
                GF(fu, !![]), fu["x"] = i["screen"]["width"] - fu["width"] * fu["scale"]["x"], GA["addChild"](fu);
                const ft = Uo("yuanbao");
                GF(ft);
                const fW = Ui("top_btn3");
                fW["animationSpeed"] = 0.4, GF(fW);
                const fe = new PIXI["Text"]("20000");
                fe["style"][Kj(rzshpD.G, "SdeW")] = "shousha", fe["style"]["fontSize"] = 0x10, fe["position"][KD(0x1ca)](0x230 * G7, 0x3 * G8), fe["style"]["fill"] = "#C0C0C0", GF(fe);
                const fA = UT("yuanbao_btn");
                fA["animationSpeed"] = 0.4, GF(fA), GA["addChild"](fW, ft, fe, fA);
                const fa = Uo("top_btn2");
                GF(fa);
                const fo = Uj("vip_btn");
                GF(fo);
                const fj = Uo("battle_icon");
                GF(fj), GA["addChild"](fa, fj, fo);
                const fD = {};
                fD[Kj(0x1fc, "!2E0")] = i["screen"][KD(0x2b1)], fD["boxHeight"] = 0.75 * i["screen"]["height"], fD["passiveWheel"] = ![], fD["scrollbarBackgroundAlpha"] = 0x0, fD["scrollbarSize"] = 0x0, fD["stopPropagation"] = !![], fD["divWheel"] = i["view"], fD["interaction"] = i["renderer"]["plugins"]["interaction"];
                const fJ = new PIXI["Scrollbox"](fD);
                let fI = ["activity_taixu", "activity_huanhua", KD(0x19c), "activity_xianqu"];
                for (let fg = 0x0; fg < fI["length"]; fg++) {
                    let fB = new PIXI["Sprite"](Gb["resources"]["activity_bg"]["texture"]);
                    fB["scale"]["set"](0.7), GF(fB), fB["x"] = fB["width"] * fg + 0x1b * G7 * fg, console["log"](fB["width"]);
                    let fq = new PIXI["Sprite"](Gb["resources"][fI[fg]]["texture"]);
                    fq["name"] = fI[fg], GF(fq), fq["position"]["set"](-0xd * G7, 0x1a * G8), fq["interactive"] = !![], fq["on"]("pointerup", Ud), fq["on"]("pointerdown", Up);
                    let fn = new PIXI["Sprite"](Gb["resources"][fI[fg] + "_txt"]["texture"]);
                    GF(fn), fn["position"]["set"](-0xd * G7, 0x1a * G8), fB["addChild"](fq, fn), fJ["content"]["addChild"](fB), Ge["on"]("added", () => { setTimeout(() => { fq["filters"] = [P], gsap["to"](P, { "duration": 0.4, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { fq["filters"] = [P]; }, "onComplete": () => { fq["filters"] = null; } }); }, 0x190); });
                }
                fJ["content"]["width"] < i["screen"]["width"] ? fJ["boxWidth"] = fJ["content"]["width"] : fJ["boxWidth"] = i["screen"]["width"], fJ["position"]["set"](0.5 * (i["screen"]["width"] - fJ["boxWidth"]), 0.75 * (i["screen"]["height"] - fJ["boxHeight"])), Ge["on"](KD(0x2bc), () => { G2["texture"] = GG["resources"]["loadingbg"]["texture"], Gt(GA, "top"), U9(fJ, 0.4), Ge["addChild"](fJ); }), Ge["on"]("removed", () => { GW(GA, "top"); });
            });
            let kT = lifecycle.container();
            kT["width"] = i["screen"]["width"], kT["height"] = i["screen"]["height"];
            let kg = new PIXI["Graphics"]();
            kg["beginFill"](0x0, 0.8), kg["drawRect"](0x0, 0x0, i["screen"]["width"], i["screen"]["height"]), kg["endFill"](), kg["interactive"] = !![], kg["on"]("pointerup", () => { setTimeout(function () { GK["removeChild"](kT); }, 0x64); }), kT["addChild"](kg), Gb["load"](() => {
                const Kg = Kp, KJ = K8;
                let f9 = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["lobby_corridor_bg"]);
                f9["name"] = KJ(0x280, "SdeW"), GF(f9), f9["anchor"]["set"](0.5), f9["scale"]["set"](0.72), f9["position"]["set"](0.35 * i["screen"]["width"], 0.5 * i["screen"]["height"]), f9["interactive"] = !![], f9.on("pointerup", () => { lifecycle.corridor(); GK.removeChild(kT); }), f9["on"]("pointerdown", fr);
                let fG = new PIXI["Graphics"]();
                fG["beginFill"](0xffffff), fG["drawRect"](f9["x"] - 0.5 * f9["width"], f9["y"] - 0.5 * f9["height"], f9["width"], f9["height"]), fG["endFill"]();
                let fy = new PIXI["spine"]["Spine"](Gb["resources"]["coranim"]["spineData"]);
                fy[KJ(0x180, "JHx]")]["setAnimation"](0x0, "play", !![]), fy["position"]["set"](-0.1 * f9["width"], 0x0), fy["mask"] = fG;
                let fU = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["lobby_corridor_title"]);
                GF(fU), fU["position"]["set"](-0.7 * f9["width"], -0.055 * f9["height"]);
                let fk = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["lobby_item_bg_frame"]);
                GF(fk), fk["position"]["set"](-0.75 * f9["width"], -0.85 * f9["height"]);
                let ff = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["追寻旧的回忆"]);
                GF(ff), ff["position"]["set"](-0.3 * f9["width"], 0.55 * f9["height"]);
                let fY = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["全天开放"]);
                GF(fY), fY["position"]["set"](-0.125 * f9["width"], 0.63 * f9["height"]), f9["addChild"](fy, fk, fU, ff, fY);
                let fm = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["lobby_czg_bg"]);
                fm["name"] = "lobby_czg", GF(fm), fm["anchor"]["set"](0.5), fm["scale"]["set"](0.72), fm["position"]["set"](0.65 * i["screen"]["width"], 0.5 * i["screen"]["height"]), fm["interactive"] = !![], fm.on("pointerup", () => { lifecycle.skins(); GK.removeChild(kT); }), fm["on"]("pointerdown", fr);
                let fb = new PIXI["Graphics"]();
                fb["beginFill"](0xffffff), fb["drawRect"](fm["x"] - 0.5 * fm["width"], fm["y"] - 0.5 * fm["height"], fm["width"], fm["height"]), fb["endFill"]();
                let fK = new PIXI["spine"]["Spine"](Gb["resources"]["czganim"]["spineData"]);
                fK["state"]["setAnimation"](0x0, Kg(0x2ef), !![]), fK["position"]["set"](-0.1 * f9["width"], 0x0), fK["mask"] = fb;
                let fw = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["lobby_czg_title"]);
                GF(fw), fw["position"]["set"](-0.7 * fm["width"], -0.06 * fm["height"]);
                let fc = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["lobby_item_bg_frame"]);
                GF(fc), fc[KJ(0x2f1, "v*9j")]["set"](-0.75 * fm["width"], -0.85 * fm["height"]);
                let fd = new PIXI["Sprite"](Gb[Kg(rzshpR.G)][KJ(0x252, "hZEd")]["textures"]["稀有珍宝等你来拿"]);
                GF(fd), fd["position"]["set"](-0.425 * fm["width"], 0.55 * fm["height"]);
                let fp = new PIXI["Sprite"](Gb["resources"]["ui_lottery_entrance"]["textures"]["全天开放"]);
                GF(fp), fp["position"]["set"](-0.125 * fm["width"], 0.63 * fm["height"]), fm["addChild"](fK, fc, fw, fd, fp), kT["addChild"](f9, fm);
                function fr(fM) {
                    const KB = Kg;
                    var fu = fM["target"];
                    window["currentSprite"] = fM[KB(0x219)];
                    var ft = fu["scale"]["x"], fW = fu["scale"]["y"];
                    switch (fu[KB(0x2d8)]) {
                        case "lobby_cor":
                        case "lobby_czg":
                            PIXI["sound"]["play"]("TinyButton");
                            fu["isOndown"] != !![] && (fu["isOndown"] = !![], gsap["to"](fu["scale"], { "duration": 0.15, "x": 0.95 * ft, "y": 0.95 * fW, "ease": "power2.inOut", "onComplete": () => { gsap["to"](fu["scale"], { "duration": 0.15, "x": ft, "y": fW, "ease": "power2.inOut", "onComplete": () => { fu["isOndown"] = ![]; } }); } }));
                            break;
                        default:
                            PIXI["sound"]["play"]("MidButton"), fu["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { fu["filters"] = [P]; }, "onComplete": () => { fu["filters"] = null; } });
                            break;
                    }
                }
            });
            let kB = lifecycle.container();
            kB["width"] = i["screen"]["width"], kB["height"] = i["screen"]["height"], kB["name"] = "publicui_changebg", Gb["load"](() => {
                const Kn = Kp, Kq = K8;
                let f9 = new PIXI["Graphics"]();
                f9["beginFill"](0x0), f9["drawRect"](0x0, 0x0, i["screen"]["width"], i["screen"]["height"]), f9["endFill"](), f9["position"]["set"](0x0, 0x0), f9["alpha"] = 0x0, f9["interactive"] = !![], kB["addChild"](f9);
                let fG = new PIXI["NineSlicePlane"](Gb["resources"]["ui_tw"]["textures"]["public-dialog-bg"], 0x56, 0x1e, 0x56, 0x60);
                fG["scale"]["set"](0.69), fG["width"] = 0x1d1 * G7, fG[Kq(0x1b4, "p[Aj")] = 0x135 * G8, fG["position"]["set"](0x23 * G7, 0xcd * G8);
                let fy = Uj("lobby_bg_close_btn");
                GF(fy), fy["scale"]["set"](0.91), fy["anchor"]["set"](0.5), fy["position"]["set"](1.03 * fG["width"], 0.5 * fG["height"]);
                const fU = {};
                fU["fontSize"] = 0x20, fU["fill"] = "#BA9254", fU["fontFamily"] = "shousha", fU["fontWeight"] = "200";
                let fk = new PIXI["Text"]("大", fU);
                const ff = {};
                ff["fontSize"] = 0x20, ff["fill"] = "#BA9254", ff[Kn(0x246)] = "shousha", ff["fontWeight"] = "200";
                let fY = new PIXI["Text"]("厅", ff);
                fk["x"] = fY["x"] = -0.3 * fy["width"], fk["y"] = -0.29 * fy["height"], fY["y"] = -0.11 * fy["height"];
                let fm = Uo("pub_arrow_down");
                GF(fm), fm["scale"]["set"](0.69), fm["anchor"]["set"](0.5), fm["position"]["set"](-0.05 * fy["width"], 0.15 * fy["height"]), fm["rotation"] = Math["PI"] / 0x2, fy["addChild"](fk, fY, fm);
                const fb = {};
                fb["fontSize"] = 0x20, fb["fill"] = "#403428", fb["fontFamily"] = "shousha", fb["letterSpacing"] = -0x1;
                let fK = new PIXI["Text"]("大厅背景切换", fb);
                fK["position"]["set"](0.275 * fG["width"], 0.1 * fG["height"]);
                let fw = Uj("lobby_bg_help_btn");
                GF(fw), fw[Kq(0x1fb, "SnMu")]["set"](0.6925 * fG[Kn(rzshpX.G)], 0.1075 * fG["height"]), fw["scale"]["set"](0.91);
                let fc = new PIXI["NineSlicePlane"](Gb["resources"]["ui_tw"]["textures"]["lobby_bg_change_btn_bg"], 0x6, 0x6, 0x6, 0x6);
                fc["width"] = 0.8 * fG["width"] / 0x2, fc["position"]["set"](0.1 * fG["width"], 0.25 * fG["height"]);
                const fd = {};
                fd["fontSize"] = 0x18, fd["fill"] = lib["config"]["extension_如真似幻_menuInit"] == "1" ? "white" : "#CFBA9C", fd["fontFamily"] = "shousha", fd["letterSpacing"] = -0x1;
                let fp = new PIXI["Text"]("第1张", fd);
                fp["position"]["set"](0.5 * fc["width"] - 0.5 * fp["width"], 0.475 * fc["height"] - 0.5 * fp[Kq(0x1b4, "p[Aj")]);
                let fr = new PIXI["NineSlicePlane"](lib["config"]["extension_如真似幻_menuInit"] == "1" ? Gb["resources"]["ui_tw"]["textures"]["pub_btn_common2"] : Gb["resources"]["ui_tw"]["textures"][Kq(0x1e2, "5r0j")], 0xd, 0xd, 0xd, 0xd);
                fr["name"] = "publicui_changebtn1", fr["width"] = fc["width"], fr["height"] = fc["height"], fr[Kq(0x273, "JHx]")] = !![], fr["on"]("pointerup", fe), fr["on"]("pointerdown", Up), fc["addChild"](fr, fp);
                let fM = new PIXI["NineSlicePlane"](Gb["resources"][Kn(0x15b)]["textures"]["lobby_bg_change_btn_bg"], 0x6, 0x6, 0x6, 0x6);
                fM["width"] = 0.8 * fG["width"] / 0x2, fM["position"]["set"](0.1 * fG["width"] + fM["width"], 0.25 * fG["height"]);
                const fu = {};
                fu["fontSize"] = 0x18, fu[Kn(0x250)] = lib["config"]["extension_如真似幻_menuInit"] == "2" ? "white" : "#CFBA9C", fu[Kq(0x1f6, "tCfC")] = "shousha", fu["letterSpacing"] = -0x1;
                let ft = new PIXI["Text"]("第2张", fu);
                ft["position"]["set"](0.5 * fM["width"] - 0.5 * ft["width"], 0.475 * fM["height"] - 0.5 * ft["height"]);
                let fW = new PIXI[(Kn(0x1c1))](lib["config"]["extension_如真似幻_menuInit"] == "2" ? Gb["resources"]["ui_tw"]["textures"]["pub_btn_common2"] : Gb["resources"]["ui_tw"]["textures"]["pub_btn_common2_empty"], 0xd, 0xd, 0xd, 0xd);
                fW["name"] = "publicui_changebtn2", fW["width"] = fM["width"], fW["height"] = fM["height"], fW["interactive"] = !![], fW["on"]("pointerup", fe), fW["on"]("pointerdown", Up), fM["addChild"](fW, ft), fG["addChild"](fc, fM);
                function fe(fa) {
                    const Kz = Kq, KZ = Kn;
                    switch (fa["target"]["name"]) {
                        case "publicui_changebtn1":
                            game["saveConfig"]("extension_如真似幻_menuInit", "1"), fr["texture"] = Gb["resources"]["ui_tw"]["textures"]["pub_btn_common2"], fW["texture"] = Gb["resources"]["ui_tw"][KZ(0x1b3)]["pub_btn_common2_empty"], fp["style"]["fill"] = "white", ft["style"]["fill"] = "#CFBA9C", GM["removeChild"](G1, G0), GM["addChild"](C, x), GM["setChildIndex"](x, 0x0), GM["setChildIndex"](C, 0x0);
                            break;
                        case "publicui_changebtn2":
                            game["saveConfig"]("extension_如真似幻_menuInit", "2"), fr["texture"] = Gb["resources"]["ui_tw"]["textures"]["pub_btn_common2_empty"], fW["texture"] = Gb["resources"][Kz(0x14b, "vQIC")]["textures"]["pub_btn_common2"], fp["style"]["fill"] = "#CFBA9C", ft["style"]["fill"] = "white", GM["removeChild"](x, C), GM["addChild"](G0, G1), GM["setChildIndex"](G1, 0x0), GM["setChildIndex"](G0, 0x0);
                            break;
                    }
                }
                let fA = new PIXI["NineSlicePlane"](Gb["resources"]["ui_tw"]["textures"]["pub_dlg_content_bg"], 0xf, 0xf, 0xf, 0xf);
                fA["width"] = 0.8 * fG["width"], fA["height"] = 0.411 * fG["height"], fA["position"]["set"](0.1 * fG["width"], 0.4275 * fG["height"]), fG["addChild"](fy, fK, fw, fA), kB["addChild"](fG);
            }), ym["load"](() => {
                // 招募及其后续个人界面共用此加载器的 paiweiui 图集。
                // 必须等图集解析完成后再启动依赖它的界面加载。
                yu();
                yL["load"](() => { yC(); lifecycle.readyView("recruit", ys, () => U3(ys)); });
            });
        }
        const y6 = lifecycle.container(), y7 = lifecycle.container(), y8 = lifecycle.container();
        y6["width"] = i["screen"]["width"], y6["height"] = i["screen"]["height"], y7["width"] = 0.3 * i["screen"]["width"], y7["x"] = 0.1 * i["screen"]["width"], y7["height"] = i["screen"]["height"], y8["width"] = 0.3 * i["screen"]["width"], y8["height"] = i["screen"]["height"], y8["x"] = 0.6 * i["screen"]["width"];
        const y9 = lifecycle.container();
        y9["width"] = 0.4 * i["screen"]["width"], y9["height"] = 0.3 * i["screen"]["height"], y6["addChild"](y9, y7, y8);
        function yG(UU) { const Uk = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"][UU]); return Uk["name"] = UU, Uk; }
        function yy(UU) { let Uk = new PIXI["AnimatedSprite"]["fromFrames"](ym["resources"]["paiweiui"]["data"]["animations"][UU]); return Uk["name"] = UU, Uk["anchor"]["set"](0.5), Uk["animationSpeed"] = 0.3, Uk["play"](), Uk; }
        const yU = lifecycle.container();
        yU["width"] = i["screen"]["width"], yU["height"] = i["screen"]["height"];
        const yk = lifecycle.container();
        yk["width"] = i["screen"]["width"], yk["height"] = i["screen"]["height"];
        let yf = new PIXI["Graphics"]();
        yf["beginFill"](0x0, 0.8), yf["drawRect"](0x0, 0x0, i["renderer"][K1(0x315, "PA38")]["width"], i[K0(0x2c0)]["screen"]["height"]), yf["endFill"](), yf["interactive"] = !![], yU["addChild"](yf, yk);
        function yY(UU) { const Uk = new PIXI["Sprite"](ym["resources"]["menubtn"]["textures"][UU]); return Uk["name"] = UU, Uk; }
        yU["on"](K1(0x2c6, "PYEN"), () => { const UU = {}; UU["y"] = i["screen"]["height"]; const Uk = {}; Uk["duration"] = 0.5, Uk["y"] = 0x0, Uk["ease"] = "power2.out", gsap["fromTo"](yk, UU, Uk); }), yU["on"]("removed", () => { });
        const ym = lifecycle.loader(), yb = {};
        yb["name"] = "menubtn", yb["path"] = "extension/如真似幻/images/menu.json";
        const yK = {};
        yK["name"] = "paiweiui", yK["path"] = "extension/如真似幻/images/jj.json";
        const yw = {};
        yw["name"] = "shenfen", yw["path"] = "extension/如真似幻/images/modeb/mode1.png";
        const yc = {};
        yc["name"] = "doudizhu", yc["path"] = "extension/如真似幻/images/modeb/mode2.png";
        const yd = {};
        yd["name"] = "guozhan", yd[K0(0x2ad)] = "extension/如真似幻/images/modeb/mode3.png";
        const yp = {};
        yp["name"] = "setting", yp["path"] = "extension/如真似幻/images/setting.json";
        const yr = {};
        yr[K1(0x172, "Z6A)")] = "VCD", yr["path"] = "extension/如真似幻/audio/vcd.jpg";
        const yM = [yb, yK, yw, yc, yd, yp, yr];
        yM["forEach"](UU => { ym["add"](UU["name"], lib["assetURL"] + UU["path"]); }), Gf["forEach"](UU => { ym["add"](UU, lib["assetURL"] + "extension/如真似幻/audio/music/" + UU + "/bg.jpg"); });
        function yu() {
            const KR = K0, KN = K1;
            console["timeEnd"](KN(0x253, "rz96"));
            let UU = yG("jj_tittle");
            GF(UU);
            let Uk = yG("publicui_title_bg");
            GF(Uk);
            let Uf = yG("s0");
            y9["addChild"](Uk, UU, Uf), GF(Uf);
            let UY = Math["floor"](Math["random"]() * 0xd);
            Uf["texture"] = ym["resources"]["paiweiui"]["textures"]["s" + UY];
            let Um = yG("ttrankbg1");
            GF(Um);
            let Ub = yG("ttrankbg3");
            GF(Ub);
            let UK = yG("ttrankbg2");
            GF(UK), y7["addChild"](Um, Ub, UK);
            let Uw = (window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})["xxingnum"] || 0x0;
            if (lib["config"]["tianti_0星"])
                Uw++;
            let Uc;
            if (Uw < 0x7)
                Uc = yG("jj_grade_qingtong"), GF(Uc), y7["addChild"](Uc);
            else {
                if (Uw < 0x13)
                    Uc = yG("jj_grade_baiyin"), GF(Uc), y7["addChild"](Uc);
                else {
                    if (Uw < 0x2c)
                        Uc = yG("jj_grade_huangjin"), GF(Uc), y7["addChild"](Uc);
                    else {
                        if (Uw < 0x45)
                            Uc = yG("jj_grade_feicui"), GF(Uc), y7["addChild"](Uc);
                        else {
                            if (Uw < 0x63)
                                Uc = yG("jj_grade_dashi"), GF(Uc), y7["addChild"](Uc);
                            else
                                Uw >= 0x63 && (Uc = yy("ttrank"), GF(Uc), y7["addChild"](Uc));
                        }
                    }
                }
            }
            let Ud;
            Ud = (window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})["xxingnum"] || 0x0;
            let [Up, Ur, UM] = U(Ud);
            if (lib["config"]["tianti_0星"])
                [Up, Ur, UM] = U(Ud + 0x1);
            let Uu = new PIXI["Text"](Up);
            Uu["style"]["fontFamily"] = "shousha", Uu["style"]["fontSize"] = 0x30, Uu["anchor"]["set"](0.5), Uu["position"]["set"](0x0, 0x9b), Uu["style"]["fill"] = "#DAA520", UK["addChild"](Uu);
            let Ut = new PIXI["NineSlicePlane"](ym["resources"]["paiweiui"]["textures"]["load_progressbar"], 0x19, 0x1e, 0x19, 0x1e);
            Ut["width"] = 0x118, Ut["height"] = 0x23, Ut["pivot"]["set"](0.5), Ut["position"]["set"](-0x8a, 0xd2), UK["addChild"](Ut);
            let UW = yG("jj_morale");
            UW["width"] = ((window["_rzsh_current"] || lib[KN(0x164, "vQIC")]["tianti_versus_two"] || {})["count"] || 0x0) / ((window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})["top"] || 0x28) * 0x104, UW["height"] = 0x17, UW["position"]["set"](0xa, 0x6), Ut[KR(0x291)](UW);
            let Ue = new PIXI["Text"](((window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})["count"] || 0x0) + "/" + ((window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})[KN(rzshpF.G, "rkb@")] || 0x28));
            Ue["style"]["fontFamily"] = "shousha", Ue["style"]["fontSize"] = 0x18, Ue["anchor"]["set"](0.5), Ue["position"]["set"](0x0, 0xe1), Ue["style"]["fill"] = "#C0C0C0", UK["addChild"](Ue);
            if (((window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})["top"] || 0x28) != 0x28 && ((window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})["top"] || 0x28) != 0x226) {
                let Ug = yG("jj_protect_mark");
                Ug["position"]["set"](0x4b * G7, 0x0), Ut["addChild"](Ug);
            }
            if (!lib["config"]["tianti_0星"]) {
                if (UM == 0x2)
                    for (let UB = 0x0; UB < UM; UB++) {
                        let Uq = yG("jj_star_off");
                        GF(Uq), Uq["x"] += UB * 0x3c * G7;
                        if (UB < Ur)
                            Uq["texture"] = ym["resources"]["paiweiui"]["textures"]["jj_star_on"];
                        y7["addChild"](Uq);
                    }
                if (UM == 0x4)
                    for (let Un = 0x0; Un < UM; Un++) {
                        let UZ = yG("jj_star_off");
                        GF(UZ), UZ["x"] += Un * 0x3c * G7 - 0x3c * G7;
                        if (Un < Ur)
                            UZ["texture"] = ym["resources"]["paiweiui"]["textures"]["jj_star_on"];
                        y7["addChild"](UZ);
                    }
                if (UM == 0x5)
                    for (let Uz = 0x0; Uz < UM; Uz++) {
                        let UN = yG("jj_star_off");
                        GF(UN), UN["x"] += Uz * 0x3c * G7 - 0x5a * G7;
                        if (Uz < Ur)
                            UN["texture"] = ym["resources"]["paiweiui"]["textures"]["jj_star_on"];
                        y7["addChild"](UN);
                    }
                if (UM > 0x5) {
                    let UR = yG("jj_star_on");
                    GF(UR);
                    let US = new PIXI["Text"]("x " + Ur);
                    US["style"]["fontFamily"] = "shousha", US["style"]["fontSize"] = 0x30, US["anchor"]["set"](0.5), US["position"]["set"](0x46 * G7, -0x5 * G8), US["style"][KN(rzshpF.y, "]!s^")] = "#DAA520", UR["addChild"](US), y7["addChild"](UR);
                }
            }
            else {
                if (lib["config"]["tianti_0星"]) {
                    if (Ud <= 0x1)
                        for (let UX = 0x0; UX < 0x2; UX++) {
                            let UH = yG("jj_star_off");
                            GF(UH), UH["x"] += UX * 0x3c * G7, y7["addChild"](UH);
                        }
                    else {
                        if (Ud <= 0xe)
                            for (let UO = 0x0; UO < 0x4; UO++) {
                                let UQ = yG("jj_star_off");
                                GF(UQ), UQ["x"] += UO * 0x3c * G7 - 0x3c * G7, y7["addChild"](UQ);
                            }
                        else {
                            if (Ud < 0x62)
                                for (let Uh = 0x0; Uh < 0x5; Uh++) {
                                    let UL = yG("jj_star_off");
                                    GF(UL), UL["x"] += Uh * 0x3c * G7 - 0x5a * G7, y7["addChild"](UL);
                                }
                            else {
                                if (Ud >= 0x62) {
                                    let Us = yG("jj_star_on");
                                    GF(Us);
                                    let Uv = new PIXI["Text"]("x 0");
                                    Uv["style"]["fontFamily"] = "shousha", Uv["style"]["fontSize"] = 0x30, Uv["anchor"]["set"](0.5), Uv["position"]["set"](0x46 * G7, -0x5 * G8), Uv["style"]["fill"] = "#DAA520", Us["addChild"](Uv), y7["addChild"](Us);
                                }
                            }
                        }
                    }
                }
            }
            let UA = yG("tiantibg");
            GF(UA);
            let Ua = yG("jj_dianfeng");
            GF(Ua);
            let Uo = yG("solobtn");
            GF(Uo, !![]);
            let Uj = yG("versustwobtn");
            GF(Uj, !![]);
            let UD = yG("back");
            UD["name"] = "top_back", GF(UD, !![]), UD["scale"]["set"](0.65), UD["y"] = 0x23 * G8, y8["addChild"](UA, Ua, Uo, Uj), y6["addChild"](UD), y6["on"]("added", () => { const KS = KR; G2["texture"] = GG["resources"]["loadingbg"]["texture"], lifecycle.cover(G2), i["stage"]["removeChild"](GK), gsap["fromTo"](y8, { "y": -y8["height"] - 0x64 }, { "duration": 0.7, "y": y8["y"], "ease": "elastic.out(1, 0.3)" }); const UV = {}; UV["x"] = 0.1, UV["y"] = 0.1, gsap["fromTo"](Uc["scale"], UV, { "x": Uc["scale"]["x"], "y": Uc["scale"]["y"], "duration": 0x1, "ease": "power4.out", "onComplete": function () { window["isOnhide"] = ![]; } }); const UP = {}; UP[KS(0x1e8)] = 0.5, UP["y"] = 0x0, UP["ease"] = "power4.out", gsap["fromTo"](y9, { "y": -y9["height"] - 0x64 }, UP); });
            let UJ = yY("bigmenu");
            GF(UJ), yk["addChild"](UJ);
            const UI = ["menuyi1", "menuyi2", "menuyi3", "menuyi4", "menuyi5", KN(0x1b7, "PYEN"), "menuer1", "menusan1", "menusan2", "menusan3", "menusan4", "menusi1", "menusi2", "menusi3", "menusi4", "menusi5", "menusi6", "menuwu1", "menuwu2", "menuwu3"];
            for (let UV = 0x0; UV < UI["length"]; UV++) {
                let UP = UI[UV], Ul = yY(UP);
                GF(Ul, !![]), Ul["scale"]["set"](0.75 * G9);
                if (lib["config"]["red_point"]) {
                    if (Math["random"]() < 0.1) {
                        let UE = UT("redPoint");
                        UE["x"] = Ul["width"] / 1.2, UE["y"] = -Ul["height"] / 0x4, UE["scale"][KR(0x1ca)](0.8 * G9), Ul["addChild"](UE);
                    }
                }
                if (UV < 0x6)
                    Ul["x"] = (0xb4 + UV * 0x7a) * G7, Ul["y"] = 0x6e * G8;
                else {
                    if (UV == 0x6)
                        Ul["x"] = 0xb4 * G7, Ul["y"] = 0xc3 * G8;
                    else {
                        if (0x6 < UV && UV < 0xb)
                            Ul["x"] = (0xb4 + (UV - 0x7) * 0x7a) * G7, Ul["y"] = 0x118 * G8;
                        else {
                            if (0xb <= UV && UV < 0x11)
                                Ul["x"] = (0xb4 + (UV - 0xb) * 0x7a) * G7, Ul["y"] = 0x16d * G8;
                            else
                                0x11 <= UV && (Ul["x"] = (0xb4 + (UV - 0x11) * 0x7a) * G7, Ul["y"] = 0x1c2 * G8);
                        }
                    }
                }
                yk["addChild"](Ul);
            }
            let Ui = yY("pubbtn_close");
            GF(Ui, !![]), yk["addChild"](Ui);
            function UT(UF) { const UC = new PIXI["Sprite"](ym["resources"]["setting"]["textures"][UF]); return UC["name"] = UF, UC; }
            lifecycle.readyView("mode", Ga, () => Gl(Ga)); lifecycle.readyView("ranking", y6, () => U3(y6)); lifecycle.readyView("home", GK, () => GE());
            yx["load"](() => { U2(); lifecycle.readyView("matching", U1, () => U3(U1)); }), yt["load"](() => { yX(); lifecycle.readyView("characters", yA, () => U3(yA)); });
        }
        let yt = lifecycle.loader();
        yt["add"]("wujiang", lib["assetURL"] + "extension/如真似幻/images/wujiang.json"), yt["add"]("label", lib["assetURL"] + "extension/如真似幻/images/label.json"), yt["add"]("wujiangBG", lib["assetURL"] + "extension/如真似幻/images/wujiangbg.jpg");
        function yW(UU) { let Uk = new PIXI["Sprite"](yt["resources"]["wujiang"]["textures"][UU]); return Uk["name"] = UU, Uk; }
        let ye = [], yA = lifecycle.container();
        yA[K0(0x2b1)] = i["screen"]["width"], yA["height"] = i["screen"]["height"];
        let ya = lifecycle.container();
        ya["width"] = i["screen"][K1(0x2c4, "p[Aj")], ya["height"] = i["screen"]["height"];
        let yo = lifecycle.container();
        yo["width"] = i["screen"]["width"], yo["height"] = i["screen"]["height"];
        let yj = lifecycle.container();
        yj["width"] = i["screen"]["width"], yj["height"] = i["screen"][K1(0x1ef, "KsXd")];
        let yD = lifecycle.container();
        yD["width"] = i["screen"]["width"], yD["height"] = i["screen"]["height"], yA["addChild"](ya, yo, yj, yD);
        let yJ = lifecycle.container();
        yJ["width"] = i["screen"]["width"], yJ["height"] = i["screen"]["height"];
        let yI = lifecycle.container();
        yI["width"] = i["screen"]["width"] / 0x3, yI["height"] = i["screen"]["height"];
        const yi = {};
        yi["boxWidth"] = 0xa0 * G7, yi["boxHeight"] = 0x107 * G8, yi["passiveWheel"] = ![], yi[K0(0x1c7)] = 0x0, yi["scrollbarSize"] = 0x0, yi["stopPropagation"] = !![], yi["divWheel"] = i["view"], yi["interaction"] = i["renderer"]["plugins"]["interaction"];
        let yT = new PIXI["Scrollbox"](yi);
        yT["position"]["set"](0x28 * G7, 0xfd * G8), yT["content"]["addChild"](yI), yo["addChild"](yT, yJ);
        let yg = {}, yB = [];
        for (let UU in lib["translate"]) {
            yg[UU] = lib["translate"][UU];
        }
        for (let Uk in lib["imported"]["character"]) {
            if (lib["config"][K1(rzshMx.U, "@0B1")] && Array["isArray"](lib["config"]["hidepack"]) && lib["config"]["hidepack"]["includes"](Uk))
                continue;
            for (let Uf in lib["imported"]["character"][Uk]["character"]) {
                if (yB["includes"](Uf))
                    continue;
                yB["push"](Uf);
                let UY;
                // Portraits are requested only when their cards become visible.
            }
            for (let Um in lib["imported"]["character"][Uk]["translate"]) {
                yg[Um] = lib["imported"]["character"][Uk]["translate"][Um];
            }
        }
        const yq = {};
        yq["boxWidth"] = 0x2c6 * G7, yq["boxHeight"] = 0x1ae * G8, yq["passiveWheel"] = ![], yq["scrollbarBackgroundAlpha"] = 0x0, yq["scrollbarSize"] = 0x0, yq["stopPropagation"] = !![], yq["divWheel"] = i["view"], yq["interaction"] = i["renderer"]["plugins"]["interaction"];
        let yn = new PIXI["Scrollbox"](yq);
        yn["position"]["set"](0xf5 * G7, 0x43 * G8), yj["addChild"](yn);
        let yZ = yn["content"]["addChild"](lifecycle.container());
        const yz = {};
        yz["boxWidth"] = 0xaa * G7, yz["boxHeight"] = 0x12c * G8, yz["passiveWheel"] = ![], yz["scrollbarBackgroundAlpha"] = 0x0, yz["scrollbarSize"] = 0x0, yz["stopPropagation"] = !![], yz["divWheel"] = i["view"], yz["interaction"] = i["renderer"]["plugins"]["interaction"];
        let yN = new PIXI["Scrollbox"](yz);
        yN["position"]["set"](0x39c * G7, 0x6e * G8), yD["addChild"](yN);
        let yR = yN["content"]["addChild"](lifecycle.container());
        const yS = {};
        yS["x"] = 0x1f, yS["y"] = -0x17, yS["w"] = 0x87, yS["h"] = 0xfa;
        if (!lib["config"]["sprite_avatar"])
            game["saveConfig"]("sprite_avatar", yS);
        function yX() {
            const rzshrq = { G: 0x1dc }, rzshr0 = { G: 0x20b }, KH = K0, KX = K1;
            console["timeEnd"]("g加载完毕");
            let Ub = yW("warr_info_bg");
            Gx(Ub);
            let UK = yW("wujiangchangkuang");
            Gx(UK);
            let Uw = yW("jianghun");
            Gx(Uw);
            let Uc = yW("warr_info_dec");
            Gx(Uc);
            let Ud = yW("jl_bar_fg");
            Gx(Ud);
            let Up = yW("warr_arr_official");
            Gx(Up);
            let Ur = yW("officalui_icon_10");
            Gx(Ur);
            let UM = yW("offical_dayuanshuai");
            Gx(UM);
            const Uu = {};
            Uu["fontFamily"] = "shousha", Uu["fontSize"] = 0x1a, Uu["fill"] = "#BDA684", Uu["Stroke"] = "#292018", Uu["strokeThickness"] = 0x5, Uu[KX(0x26e, "KsXd")] = 0x3;
            let Ut = new PIXI["Text"](KH(0x16c), Uu);
            Ut["position"]["set"](0x0, -2.5 * G8), Ut["anchor"][KH(0x1ca)](0.5), Ud["addChild"](Ut);
            let UW = new PIXI["Text"](typeof lib["config"]["qhly_jianghun"] == "number" ? lib["config"]["qhly_jianghun"] : "800000");
            UW["style"]["fontFamily"] = "shousha", UW["style"]["fontSize"] = 0x18, UW["position"]["set"](0x0, 0x2f), UW["anchor"]["set"](0.5), UW["style"]["fill"] = KX(0x248, "VwJt"), Uw["addChild"](UW), Ub["addChild"](UK, Uw, Uc, Ud, Up, Ur, UM);
            let Ue = yW("biaojibeijing");
            GF(Ue), Ue["scale"]["set"](0.69), Ue["x"] = i["screen"]["width"] * 0.738;
            let UA = yW("pub_item_selected_s1");
            GF(UA), UA["anchor"]["set"](0.5);
            const Ua = {};
            Ua["fontFamily"] = "shousha", Ua["fontSize"] = 0x1a, Ua["fill"] = "#CFBA9C";
            let Uo = new PIXI["Text"]("全部武将", Ua);
            Uo["anchor"]["set"](0.5), Uo["y"] = -0.125 * Ue["y"];
            let Uj = yW("union_arrow");
            Uj["anchor"]["set"](0.5), Uj["scale"]["set"](0.8), Uj["x"] = Ue["width"] * 0.5, Ue["addChild"](UA, Uo, Uj);
            let UD = yW("search_btn");
            GF(UD), UD["x"] = i["screen"]["width"] * 0.85;
            let UJ = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["back"]);
            UJ["name"] = "wujiangback", GF(UJ, !![]), UJ["x"] = i["screen"]["width"] - UJ["width"] * 0.25, UJ["y"] = 0x2a, ya["addChild"](Ub, Ue, UD, UJ);
            let UI = yW("btn_lvl1_1");
            UI["name"] = "btn_lvl1_1a", GF(UI), UI["interactive"] = !![], UI["on"]("pointerup", kk), UI["on"]("pointerdown", kf), UI["sec"] = "favourite", UI["position"]["set"](0x79 * G7, 0xa0 * G8), UI["scale"]["set"](0.68 * G9), UI["anchor"]["set"](0.5);
            let Ui = yW("tag_hot");
            Ui["position"]["set"](-0x64, -0x32);
            const UT = {};
            UT["fontFamily"] = "shousha", UT["fontSize"] = 0x20, UT["fill"] = "#CFBA9C";
            let Ug = new PIXI["Text"]("热门", UT);
            Ug["anchor"]["set"](0.5), UI["addChild"](Ui, Ug);
            let UB = yW("btn_lvl1_1");
            UB["name"] = "btn_lvl1_1b", GF(UB), UB["interactive"] = !![], UB["on"]("pointerup", kk), UB["on"]("pointerdown", kf), UB["sec"] = KX(0x169, "hs^2"), UB["position"]["set"](0x79 * G7, 0xe6 * G8), UB["scale"]["set"](0.68 * G9), UB["anchor"][KH(0x1ca)](0.5);
            const Uq = {};
            Uq[KH(0x246)] = "shousha", Uq["fontSize"] = 0x20, Uq["fill"] = KX(0x2fc, "TK2T");
            let Un = new PIXI["Text"]("全部", Uq);
            Un["anchor"]["set"](0.5), Un["y"] = -0xf * G8;
            const UZ = {};
            UZ["fontFamily"] = "shousha", UZ["fontSize"] = 0x12, UZ["fill"] = "#CFBA9C";
            let Uz = new PIXI["Text"]("", UZ);
            Uz["anchor"]["set"](0.5), Uz["y"] = 0x1d * G8, Un["addChild"](Uz), UB["addChild"](Un), yJ["addChild"](UI, UB);
            let UN = 0x0;
            for (let kw in lib["imported"][KX(0x2fd, "6)6d")]) {
                if (lib["config"]["hidepack"] && Array["isArray"](lib["config"]["hidepack"]) && lib["config"]["hidepack"]["includes"](kw))
                    continue;
                let kc = new PIXI["Sprite"](yt["resources"]["wujiang"]["textures"]["btn_lvl2_1"]);
                kc["y"] = G8 * UN * kc["height"] / 0x2, kc["name"] = kw, kc["interactive"] = !![], kc["on"]("pointerup", kk), kc["on"]("pointerdown", kf), kc["on"]("pointermove", () => { clearTimeout(UV); });
                if (lib["config"]["characters"] && !lib["config"]["characters"]["includes"](kw))
                    kc["filters"] = [E];
                let kd = new PIXI.Text(lifecycle.packLabel(kw, yg));
                kd["style"]["fontFamily"] = "shousha", kd["style"]["fontSize"] = 0x1c, kd["position"]["set"](0x78, 0x32), kd["anchor"]["set"](0.5), kd["style"]["fill"] = "#CFBA9C", kc["scale"]["set"](0.67 * G7, 0.7 * G8), UN++, kc["addChild"](kd), yI["addChild"](kc);
                let kp = lifecycle.ticker();
                for (let kr in lib["imported"]["character"][kw]["character"]) {
                    if (Array["isArray"](lib["imported"]["character"][kw]["character"][kr][0x4]) && lib["imported"]["character"][kw]["character"][kr][0x4]["contains"]("unseen"))
                        continue;
                    let ku = lifecycle.own(new PIXI["Sprite"]());
                    ku["name"] = kr, ku["name2"] = yg[kr + "_ab"] || yg[kr], ku["pack"] = kw, ku["secgroup"] = "", ku["doublegroup"] = "";
                    var UR = [lib["imported"]["character"][kw]["character"][kr][0x1]], US = [lib["imported"]["character"][kw][KH(0x2f3)][kr][0x1]];
                    if (lib["imported"]["character"][kw]["character"][kr][0x4])
                        for (var UX of lib["imported"]["character"][kw]["character"][kr][0x4]) {
                            if (UX["startsWith"]("doublegroup:")) {
                                var UH = UX["indexOf"]("doublegroup:") + "doublegroup:"["length"];
                                UR = UX["substring"](UH)["trim"]()["split"](":");
                            }
                            if (UX["startsWith"]("groupcolor:")) {
                                var UH = UX["indexOf"]("groupcolor:") + "groupcolor:"["length"];
                                US = UX["substring"](UH)["trim"]()["split"](":");
                            }
                        }
                    for (var UX = 0x0; UX < UR["length"]; UX++) {
                        ku["secgroup"] += UR[UX], ku["doublegroup"] += UR[UX], UR[UX] != US[UX] && US["length"] >= UR["length"] && (ku["doublegroup"] += "" + US[UX]), UX != UR["length"] - 0x1 && (ku[KX(0x151, "TK2T")] += "_", ku["doublegroup"] += "_");
                    }
                    ku["secgroup"]["indexOf"]("_") !== -0x1 && (ku["secgroup"] = ku["secgroup"]["split"]("_"));
                    if (lib["config"]["favouriteCharacter"]["contains"](kr))
                        ku[KX(0x1b1, "5r0j")] = !![];
                    ku.workshopBuild = () => {
                    const kM = lifecycle.portraits.sprite(kr);
                    kM.name = "avatar";
                    let kt = new PIXI[(KX(0x28f, "2^^M"))]();
                    kt["x"] = -0x1;
                    try {
                        kt["texture"] = yt["resources"]["wujiang"]["textures"]["name_" + ku["doublegroup"]] ? yt["resources"][KH(0x307)]["textures"]["name_" + ku["doublegroup"]] : yt[KH(0x2bb)]["wujiang"]["textures"]["name_unknown"], ku["texture"] = yt["resources"]["wujiang"]["textures"]["name_" + ku["doublegroup"]] ? yt["resources"]["wujiang"]["textures"]["name_" + ku["doublegroup"]] : yt["resources"]["wujiang"]["textures"]["name_unknown"];
                    }
                    catch (kj) {
                        kt["texture"] = yt["resources"]["wujiang"]["textures"]["name_known"], ku["texture"] = yt["resources"]["wujiang"]["textures"]["name_known"];
                    }
                    ku["addChild"](kt), ku["setChildIndex"](kt, 0x0), ku["interactive"] = !![], ku["on"]("pointerup", kD => {
                        const Kh = KX, KQ = KH;
                        let kJ = kD["data"]["global"]["x"] - ku["startX"];
                        if (kJ != 0x0)
                            return;
                        if (lib["config"]["extension_千幻聆音_enable"] && lib["config"]["rzshxqhly"]) {
                            ui["window"] = ui["create"]["div"]("#window", document["body"]), game["qhly_open_new"](ku["name"], "skill"), kp["stop"](), kp["remove"](kT);
                            function kT() {
                                const KO = rzshU;
                                var kg = game["qhly_getShoushajinjie"](ku["name"]) || [];
                                UW["text"] = lib[KO(rzshr0.G, "tF)Q")]["qhly_jianghun"];
                                for (var kB = 0x0; kB < 0x4; kB++) {
                                    var kq = ku["getChildByName"]("dj_star_" + kB);
                                    kq && (kB >= 0x4 - kg[0x0] && (kq["texture"] = yt["resources"]["wujiang"]["textures"]["dj_star_light"]));
                                }
                            }
                            kp["add"](kT), kp["start"]();
                        }
                        else {
                            if (lib["config"]["extension_假装无敌_enable"] && lib["config"]["rzshxjzwd"]) {
                                !ui["window"] && (ui["window"] = ui[KQ(0x18c)]["div"]("#window"));
                                !String["prototype"]["newFedit"] && (String["prototype"]["newFedit"] = function (kg) { var kB = this, kq = kB["slice"](kB["indexOf"]("{") + 0x1)["slice"](0x0, -0x1); return kg(kq); });
                                !get["qyRateNum"] && (get["qyRateNum"] = function (kg) {
                                    const kB = game["getRarity"](kg);
                                    let kq = 0x1;
                                    const kn = game["getExtensionConfig"]("假装无敌", "rateCharacter") || {};
                                    if (kn[kg])
                                        kq = kn[kg];
                                    if (kq !== 0x1)
                                        return kq;
                                    switch (kB) {
                                        case "legend":
                                            kq = 0x5;
                                            break;
                                        case "epic":
                                            kq = 0x4;
                                            break;
                                        case "rare":
                                            kq = 0x3;
                                            break;
                                        case "junk":
                                            kq = 0x2;
                                            break;
                                        default:
                                            kq = 0x1;
                                            break;
                                    }
                                    return kq;
                                });
                                var kI = {}, ki = "extension_假装无敌_";
                                Object[Kh(0x30c, "PYEN")](lib["config"])["filter"](kg => kg["startsWith"](ki))["forEach"](kg => { kI[kg["slice"](ki["length"])] = lib["config"][kg]; });
                                while (lib["qyContent"]["length"]) {
                                    lib["qyContent"]["shift"]()(lib, game, ui, get, ai, _status, kI);
                                }
                                ui["click"]["qycharactercard"](ku["name"]);
                            }
                        }
                    }), ku["on"]("pointerdown", kD => { ku["startX"] = kD["data"]["global"]["x"]; }), ku["addChild"](kM); lifecycle.portraits.fit(kM, ku);
                    const kW = {};
                    kW["fontFamily"] = "shousha", kW["fontSize"] = 0x16, kW["fill"] = "white", kW["wordWrap"] = !![], kW["wordWrapWidth"] = 0x18, kW["align"] = "center", kW[KX(0x1a4, "C4@w")] = !![], kW["lineHeight"] = 0x15, kW["letterSpacing"] = -0x4, kW["dropShadow"] = !![], kW["dropShadowColor"] = KX(0x1c3, "Y&Q6"), kW["dropShadowAngle"] = Math["PI"] / 0x9, kW[KH(0x2e9)] = 0x9, kW["dropShadowDistance"] = 0x4;
                    let ke = new PIXI["Text"](ku["name2"], kW);
                    ke["anchor"]["set"](0.5, 0x0), ke["position"]["set"](0x14, 0x21);
                    if (Array["isArray"](ku["secgroup"]))
                        ke["y"] = 0x40 * G8;
                    ku["addChild"](ke);
                    let kA, ka = new PIXI["Sprite"](yt["resources"]["wujiang"]["textures"]["char_grade_frame_4"]);
                    ka["position"]["set"](-0x7, -0x7);
                    if (window["noname_character_rank"]["rarity"]["legend"]["contains"](kr))
                        kA = new PIXI["AnimatedSprite"]["fromFrames"](yt["resources"]["label"]["data"]["animations"]["chuanshuo"]), kA["animationSpeed"] = 0.15, kA["play"](), ka["texture"] = yt["resources"]["wujiang"]["textures"]["char_grade_frame_6"];
                    else {
                        if (window["noname_character_rank"]["rarity"]["epic"]["contains"](kr))
                            kA = new PIXI["AnimatedSprite"]["fromFrames"](yt["resources"]["label"]["data"]["animations"]["shishibiaoqian"]), kA["animationSpeed"] = 0.2, kA["play"](), ka["texture"] = yt["resources"]["wujiang"]["textures"]["char_grade_frame_5"];
                        else {
                            if (window["noname_character_rank"]["rarity"]["rare"]["contains"](kr))
                                kA = new PIXI["Sprite"](yt["resources"]["label"]["textures"]["skinGrade3"]), ka["texture"] = yt["resources"]["wujiang"]["textures"]["char_grade_frame_4"];
                            else
                                window["noname_character_rank"]["rarity"]["junk"]["contains"](kr) ? (kA = new PIXI["Sprite"](yt["resources"]["label"]["textures"]["skinGrade2"]), ka["texture"] = yt["resources"]["wujiang"]["textures"]["char_grade_frame_1"]) : (kA = new PIXI["Sprite"](yt["resources"]["label"][KX(0x2cb, "VwJt")]["skinGrade4"]), ka["texture"] = yt["resources"]["wujiang"]["textures"][KX(0x27e, "P9FJ")]);
                        }
                    }
                    kA[KH(0x1f9)]["set"](0.65), kA["x"] = 0x79, ku["addChild"](kA);
                    lib["config"]["raritybg"] && (ku["addChild"](ka), ku["setChildIndex"](ka, 0x0));
                    if (lib["config"]["extension_标记补充++_characterPackMark"]) {
                        let kD = new PIXI["Sprite"](yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_sp"]);
                        kD["anchor"]["set"](0x1), kD["position"]["set"](ku["width"], ku["height"] - 0x4), (lib["characterPack"]["refresh"] && lib["characterSort"]["refresh"]["refresh_standard"]["filter"](kJ => !["re_xiahoudun", "re_gongsunzan", "re_huaxiong"]["includes"](kJ))["includes"](kr) || lib["characterPack"]["mobile"] && [lib["characterSort"]["mobile"]["mobile_yijiang1"], lib["characterSort"]["mobile"]["mobile_yijiang2"], lib["characterSort"]["mobile"]["mobile_yijiang3"], lib[KH(0x25d)]["mobile"]["mobile_yijiang4"], lib["characterSort"]["mobile"]["mobile_yijiang5"], lib[KH(0x25d)][KH(0x325)]["mobile_yijiang67"], lib["characterSort"]["mobile"]["mobile_standard"], lib["characterSort"][KX(0x202, "P9FJ")]["mobile_shenhua"]]["some"](kJ => kJ["includes"](kr)) || ["re_huangzhong", "re_xuhuang", "re_pangde", "re_xiahouyuan", "re_weiyan", "re_xiaoqiao", "sp_zhangjiao", "re_yuji"]["includes"](kr)) && (kD["texture"] = yt[KH(0x2bb)]["wujiang"]["textures"]["pubchara_pinpai_icon_jie"], ku[KH(0x291)](kD)), lib["characterPack"]["yijiang"] && [lib["characterSort"]["yijiang"]["yijiang_2011"], lib["characterSort"]["yijiang"]["yijiang_2012"], lib["characterSort"]["yijiang"][KX(0x212, "r6vR")], lib["characterSort"]["yijiang"][KX(0x2de, "Z6A)")], lib["characterSort"]["yijiang"]["yijiang_2015"], lib["characterSort"]["yijiang"]["yijiang_2016"], lib["characterSort"]["yijiang"]["yijiang_2017"]]["some"](kJ => kJ["includes"](kr)) && (kD["texture"] = yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_jiang"], ku["addChild"](kD)), (lib["characterPack"]["mobile"] && [lib["characterSort"]["mobile"]["mobile_default"], lib["characterSort"]["mobile"]["mobile_sp"]]["some"](kJ => kJ["includes"](kr)) || lib["characterPack"]["sp"] && lib["characterSort"]["sp"]["sp_default"]["slice"](0x0, 0xa)["concat"](["sp_sunce", "tw_puyangxing", "tw_yanxiang", "tw_baoxin", "wuban", "tw_jiangji", "lijue", "guosi", "zhangji", "fanchou", "lvkai", "zhanggong", "beimihu"])["includes"](kr)) && (kD["texture"] = yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_sp"], ku["addChild"](kD)), lib["characterPack"][KX(0x200, "vQIC")] && [lib["characterSort"]["extra"]["extra_feng"], lib["characterSort"]["extra"]["extra_huo"], lib["characterSort"]["extra"]["extra_lin"], lib["characterSort"]["extra"]["extra_shan"], lib["characterSort"]["extra"]["extra_yin"], lib["characterSort"]["extra"]["extra_lei"], lib["characterSort"]["extra"]["extra_dif"], lib[KH(0x25d)]["extra"]["extra_mobilezhi"], lib["characterSort"]["extra"]["extra_mobilexin"], lib["characterSort"]["extra"][KH(0x258)]["concat"]("k_shenlusu")]["some"](kJ => kJ["includes"](kr)) && (kD["texture"] = yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_shen"], ku["addChild"](kD)), lib["characterPack"]["mobile"] && lib["characterSort"][KH(0x325)]["mobile_yijiang"]["includes"](kr) && (kD["texture"] = yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_xing"], ku["addChild"](kD)), lib["characterPack"]["shiji"] && lib["characterPack"]["shiji"][kr] != null && (kD["texture"] = yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_ji"], ku["addChild"](kD)), lib[KH(0x251)]["mobile"] && lib["characterSort"]["mobile"]["mobile_qiankun"]["concat"]("k_shichangshi")["includes"](kr) && (kD["texture"] = yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_kun"], ku["addChild"](kD)), lib["characterPack"]["sb"] && lib["characterPack"]["sb"][kr] != null && (kD["texture"] = yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_mou"], ku["addChild"](kD)), lib["characterPack"]["dragon"] && lib["characterPack"][KH(0x298)][kr] != null && (kD["texture"] = yt["resources"]["wujiang"]["textures"]["pubchara_pinpai_icon_xuan"], ku["addChild"](kD));
                    }
                    ku["scale"]["set"](0.7 * G9);
                    };
                    ye["push"](ku);
                }
            }
            Uz["text"] = ye["length"] + "/" + ye["length"];
            let UO = yW("pub_corner_bg");
            UO["scale"]["set"](0.71), UO["x"] = i["screen"]["width"] - UO["width"] * 0.775, UO["y"] = i["screen"]["height"] - UO["height"];
            let UQ = yW("pubbtn_menu");
            UQ["anchor"][KX(0x1e1, "vV5]")](0.5), UQ["position"]["set"](0.45 * UO["width"], 0.85 * UO["height"]), UO["addChild"](UQ), yA["addChild"](UO), UO["interactive"] = !![], UO["on"]("pointerup", () => { const kJ = {}; kJ["rotation"] = 0x2d * (Math["PI"] / 0xb4), kJ["ease"] = "none", gsap["to"](UQ, 0.2, kJ), yA["addChild"](Uh); const kI = {}; kI["x"] = i["screen"]["width"], gsap["fromTo"](Us, kI, { "duration": 0.75, "x": i["screen"]["width"] - Us["width"], "ease": "power4.out" }); }), UO["on"]("pointerdown", () => { const KL = KH; PIXI["sound"]["play"]("HugeButtom"), UO["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": KL(0x1cb), "gamma": 0x3, "onUpdate": () => { UO["filters"] = [P]; }, "onComplete": () => { UO["filters"] = null; } }); });
            let Uh = lifecycle.container(), UL = new PIXI["Graphics"]();
            UL[KX(0x293, "0ka9")](0x0), UL["drawRect"](0x0, 0x0, i["screen"]["width"], i["screen"]["height"]), UL["endFill"](), UL["interactive"] = !![], UL["alpha"] = 0x0, UL["on"]("pointerup", () => {
                if (UP != !![]) {
                    const kJ = {};
                    kJ["rotation"] = 0x0 * (Math["PI"] / 0xb4), kJ["ease"] = "none", gsap["to"](UQ, 0.2, kJ), gsap["fromTo"](Us, { "x": i["screen"]["width"] - Us["width"] }, { "duration": 0.5, "x": i["screen"]["width"], "ease": "power2.out" }), setTimeout(function () { yA["removeChild"](Uh); }, 0x12c);
                }
            }), UL["on"]("pointerdown", () => { PIXI["sound"]["play"]("PopUp"); });
            let Us = yW("clt_menu_bg");
            Us["interactive"] = !![], Us["scale"]["set"](0.69), Us["y"] = i["screen"]["height"] - Us["height"];
            let Uv = yW("clt_menu_decompose");
            GF(Uv), Uv["position"]["set"](Us["width"] * 0.9, Us["height"] * 0.85), Uv["anchor"]["set"](0.5), Uv["interactive"] = !![];
            let UV = null, UP = ![];
            Uv["on"]("pointerup", () => {
                const Ks = KH;
                clearTimeout(UV);
                if (UP != !![])
                    k8["forEach"](kJ => document["body"]["appendChild"](kJ)), UP = !![];
                else {
                    UP = ![];
                    const kJ = {};
                    kJ["x"] = k8[0x0][Ks(0x16f)], kJ["y"] = k8[0x1]["value"], kJ["w"] = k8[0x2]["value"], kJ["h"] = k8[0x3]["value"], game["saveConfig"]("sprite_avatar", kJ), k8["forEach"](kI => kI["remove"]());
                }
            }), Uv["on"]("pointerdown", () => {
                if (UP == ![])
                    return;
                UV = setTimeout(() => {
                    if (confirm("是否重置武将图片位置？")) {
                        k8[0x0]["value"] = 0x1f, k8[0x1]["value"] = -0x17, k8[0x2]["value"] = 0x87, k8[0x3]["value"] = 0xfa, ye["forEach"](kI => { const Kv = rzshy; let ki = kI["getChildByName"](Kv(0x163)); ki && (ki["x"] = 0x1f, ki["y"] = -0x17, ki["width"] = 0x87, ki[Kv(0x231)] = 0xfa); });
                        const kJ = {};
                        kJ["x"] = 0x1f, kJ["y"] = -0x17, kJ["w"] = 0x87, kJ["h"] = 0xfa, game["saveConfig"]("sprite_avatar", kJ);
                    }
                }, 0x3e8);
            }), Uv["on"]("pointermove", () => { clearTimeout(UV); });
            let Ul = yW("clt_menu_read");
            GF(Ul), Ul["position"]["set"](Us["width"] * 0.55, Us["height"] * 0.75), Ul[KH(0x173)]["set"](0.5), Ul["interactive"] = !![], Ul["on"]("pointerup", () => {
                const KV = KX;
                if (!lib["config"]["extension_千幻聆音_enable"] && !lib["config"]["extension_假装无敌_enable"])
                    return;
                else {
                    if (lib["config"]["extension_千幻聆音_enable"]) {
                        if (!lib["config"]["rzshxqhly"])
                            confirm("是否开启千幻适配大界面？") && game["saveConfig"]("rzshxqhly", !![]);
                        else
                            lib["config"]["rzshxqhly"] && (confirm("是否关闭千幻适配大页面？") && game["saveConfig"]("rzshxqhly", ![]));
                    }
                    else {
                        if (lib["config"]["extension_假装无敌_enable"]) {
                            if (!lib["config"]["rzshxjzwd"])
                                confirm("是否开启假装无敌适配大界面？") && game["saveConfig"](KV(0x1e6, "2^^M"), !![]);
                            else
                                lib["config"]["rzshxjzwd"] && (confirm("是否关闭假装无敌适配大页面？") && game["saveConfig"]("rzshxjzwd", ![]));
                        }
                    }
                }
            });
            let UE = yW("clt_menu_ban");
            GF(UE), UE["position"]["set"](Us["width"] * 1.25, Us["height"] * 0.75), UE["anchor"]["set"](0.5), UE["interactive"] = !![], UE["on"]("pointerup", () => {
                clearTimeout(UV);
                if (UP == !![])
                    return;
                if (k9 == "btn_lvl1_1a" || k9 == "btn_lvl1_1b")
                    return;
                if (!lib["config"]["hidepack"])
                    lib["config"]["hidepack"] = [];
                if (!lib["config"]["hidepack"]["includes"](ky[0x0]["pack"]))
                    confirm("是否在该页面隐藏该武将包？") && game["saveConfig"]("hidepack", lib["config"]["hidepack"]["add"](ky[0x0]["pack"]));
            }), UE["on"]("pointerdown", () => {
                if (UP == !![])
                    return;
                UV = setTimeout(() => { confirm("是否重置该页面隐藏的武将包？重启生效") && game["saveConfig"]("hidepack"); }, 0x3e8);
            }), UE["on"]("pointermove", () => { clearTimeout(UV); });
            const UF = {};
            UF["left"] = "10%", UF["top"] = "5%";
            const UC = {};
            UC["type"] = "text", UC["placeholder"] = "精灵x", UC["position"] = UF, UC["propertyName"] = "x";
            const Ux = {};
            Ux["left"] = "25%", Ux["top"] = "5%";
            const k0 = {};
            k0["type"] = "text", k0["placeholder"] = "精灵y", k0["position"] = Ux, k0["propertyName"] = "y";
            const k1 = {};
            k1["right"] = "25%", k1["top"] = "5%";
            const k2 = {};
            k2["type"] = "text", k2["placeholder"] = "精灵w", k2["position"] = k1, k2["propertyName"] = "width";
            const k3 = {};
            k3["right"] = "10%", k3["top"] = "5%";
            const k4 = {};
            k4["type"] = "text", k4["placeholder"] = "精灵h", k4["position"] = k3, k4["propertyName"] = KH(0x231);
            const k5 = [UC, k0, k2, k4], k6 = (kJ, kI) => { const KP = KX, ki = document["createElement"]("input"); return ki["setAttribute"]("type", kJ["type"]), ki["setAttribute"](KP(0x260, "JHx]"), kJ["placeholder"]), ki["style"]["position"] = "fixed", ki["style"]["width"] = "10%", ki["style"]["height"] = "10%", ki["style"]["zIndex"] = "100", ki["value"] = (ye[0]?.getChildByName("avatar")?.[kJ.propertyName] ?? lib.config.sprite_avatar[({width:"w",height:"h"})[kJ.propertyName] || kJ.propertyName]), Object["assign"](ki["style"], kJ["position"]), ki["addEventListener"]("input", kT => { kI(kJ["propertyName"], kT["target"]["value"]); }), ki; }, k7 = (kJ, kI) => { ye["forEach"](ki => { const kT = ki["getChildByName"]("avatar"); kT && (kT[kJ] = kI); }); }, k8 = k5["map"](kJ => { return k6(kJ, k7); });
            Us["addChild"](Ul, Uv, UE), Uh["addChild"](UL, Us);
            let k9 = null, kG = new Map(), ky = [], kU = null;
            yA["on"]("added", () => {
                const KE = KX, Kl = KH;
                G2["texture"] = yt["resources"]["wujiangBG"]["texture"], G2["width"] = i["screen"]["width"], G2["height"] = i["screen"]["width"] / 0x5fe * 0x2ee, kK(), i["stage"]["removeChild"](GK);
                if (k9 == "btn_lvl1_1a")
                    return;
                if (k9 == null)
                    k9 = Kl(0x16b);
                if (k9 != "btn_lvl1_1a" && k9 != "btn_lvl1_1b")
                    yI["getChildByName"](k9)["texture"] = yt["resources"]["wujiang"]["textures"]["btn_lvl2_1"];
                else
                    yJ["getChildByName"](k9)["texture"] = yt["resources"]["wujiang"]["textures"]["btn_lvl1_1"];
                k9 = "btn_lvl1_1a", UI["texture"] = yt["resources"]["wujiang"]["textures"]["btn_lvl1_2"], yZ["removeChildren"](), ky = ye["filter"](ki => ki["fav"] === !![]);
                let kJ = ky[Kl(0x2f5)]();
                if (G6 != null)
                    cancelAnimationFrame(G6);
                kb(kJ, yZ), kG["clear"]();
                for (const ki of ky) {
                    let kT = ki["secgroup"];
                    if (Array[KE(0x316, ")]^q")](kT))
                        for (const kg of kT) {
                            kG["has"](kg) ? kG[Kl(0x166)](kg)["push"](ki) : kG["set"](kg, [ki]);
                        }
                    else
                        kG["has"](kT) ? kG["get"](kT)["push"](ki) : kG["set"](kT, [ki]);
                }
                let kI = 0x0;
                if (yR[Kl(0x1bc)]["length"] > 0x0)
                    while (yR["children"][0x0]) {
                        let kB = yR["removeChild"](yR["children"][0x0]);
                        kB["destroy"]();
                    }
                kG["forEach"]((kq, kn) => { const KF = Kl; let kZ = new PIXI["Sprite"](yt["resources"]["wujiang"]["textures"][KF(0x2cd)]); kZ["scale"]["set"](0.7 * G9), kZ["anchor"]["set"](0.5), kZ["position"]["set"](0x64 * G7, 0x29 * G8), kZ["y"] += kI * 0x46, kZ["name"] = kn, kI++; const kz = {}; kz["fontFamily"] = "shousha", kz["fontSize"] = 0x1c, kz["fill"] = "#CFBA9C"; let kN = new PIXI["Text"](yg[kn], kz); kN["anchor"]["set"](0.5), kN["y"] = -0xc * G8; const kR = {}; kR["fontFamily"] = "shousha", kR["fontSize"] = 0x12, kR["fill"] = "#CFBA9C"; let kS = new PIXI["Text"](kq["length"] + "/" + kq["length"], kR); kS["anchor"]["set"](0.5), kS["y"] = 0x10 * G8, kZ["addChild"](kN, kS), kZ["interactive"] = !![], kZ["on"]("pointerup", kY), kZ["on"]("pointerdown", km), yR["addChild"](kZ); });
            }), yA["on"]("removed", () => {
                if (G6 != null)
                    cancelAnimationFrame(G6);
                G2["texture"] = GG["resources"]["uiBG"]["texture"];
            });
            function kk(kJ) {
                const Kx = KH, KC = KX;
                clearTimeout(UV);
                if (kJ["target"]["name"] == k9)
                    return;
                if (k9 == null)
                    k9 = kJ["target"]["name"];
                const kI = {};
                kI["duration"] = 0.5, kI["x"] = 0x0, kI["ease"] = "power4.out", gsap["fromTo"](yD, { "x": yD["width"] }, kI);
                if (window["currentSprite"] != kJ["target"])
                    return;
                if (kJ["target"]["name"] != "btn_lvl1_1a" && kJ["target"]["name"] != "btn_lvl1_1b") {
                    if (k9 != "btn_lvl1_1a" && k9 != "btn_lvl1_1b")
                        yI["getChildByName"](k9)["texture"] = yt["resources"]["wujiang"]["textures"]["btn_lvl2_1"];
                    else
                        yJ["getChildByName"](k9)["texture"] = yt["resources"]["wujiang"]["textures"]["btn_lvl1_1"];
                    kJ["target"]["texture"] = yt["resources"]["wujiang"]["textures"]["btn_lvl2_2"];
                }
                else {
                    if (k9 != "btn_lvl1_1a" && k9 != "btn_lvl1_1b")
                        yI["getChildByName"](k9)["texture"] = yt["resources"]["wujiang"]["textures"][KC(0x1da, "C4@w")];
                    else
                        yJ["getChildByName"](k9)["texture"] = yt["resources"]["wujiang"]["textures"]["btn_lvl1_1"];
                    kJ["target"]["texture"] = yt["resources"]["wujiang"][Kx(0x1b3)]["btn_lvl1_2"];
                }
                yZ["removeChildren"]();
                if (kJ["target"][Kx(0x1b5)] === "all")
                    ky = ye;
                else
                    kJ["target"]["sec"] === "favourite" ? ky = ye["filter"](kg => kg["fav"] === !![]) : ky = ye["filter"](kg => kg["pack"] === kJ["target"]["name"]);
                let ki = ky["slice"]();
                kG["clear"]();
                for (const kg of ky) {
                    let kB = kg["secgroup"];
                    if (Array["isArray"](kB))
                        for (const kq of kB) {
                            kG["has"](kq) ? kG["get"](kq)["push"](kg) : kG["set"](kq, [kg]);
                        }
                    else
                        kG["has"](kB) ? kG["get"](kB)["push"](kg) : kG["set"](kB, [kg]);
                }
                let kT = 0x0;
                if (yR["children"]["length"] > 0x0)
                    while (yR["children"][0x0]) {
                        let kn = yR["removeChild"](yR["children"][0x0]);
                        kn["destroy"]();
                    }
                kG["forEach"]((kZ, kz) => { const w0 = Kx; let kN = new PIXI["Sprite"](yt["resources"]["wujiang"][w0(0x1b3)]["clt_lvl3_btn_off"]); kN["scale"]["set"](0.69 * G9), kN["anchor"]["set"](0.5), kN["position"]["set"](0x64 * G7, 0x29 * G8), kN["y"] += kT * 0x46 * G8, kN["name"] = kz, kT++; const kR = {}; kR["fontFamily"] = "shousha", kR["fontSize"] = 0x1c, kR["fill"] = "#CFBA9C"; let kS = new PIXI["Text"](yg[kz], kR); kS["anchor"]["set"](0.5), kS["y"] = -0xc * G8; const kX = {}; kX["fontFamily"] = "shousha", kX["fontSize"] = 0x12, kX["fill"] = "#CFBA9C"; let kH = new PIXI["Text"](kZ["length"] + "/" + kZ["length"], kX); kH["anchor"]["set"](0.5), kH["y"] = 0x10 * G8, kN["addChild"](kS, kH), kN["interactive"] = !![], kN["on"]("pointerup", kY), kN["on"]("pointerdown", km), yR[w0(0x291)](kN); });
                if (G6 != null)
                    cancelAnimationFrame(G6);
                kb(ki, yZ), k9 = kJ["target"]["name"];
            }
            function kf(kJ) {
                const w1 = KH;
                window["currentSprite"] = kJ["target"], PIXI["sound"]["play"]("PopUp");
                if (UP == !![])
                    return;
                kJ["target"]["name"] && kJ["target"]["name"] != "btn_lvl1_1b" && kJ["target"]["name"] != w1(0x16b) && (UV = setTimeout(() => { const w2 = w1; !lib["config"]["characters"]["contains"](kJ["target"]["name"]) ? (kJ["target"]["filters"] = null, game["saveConfig"]("characters", lib["config"]["characters"]["add"](kJ["target"]["name"]))) : (kJ["target"]["filters"] = [E], game["saveConfig"]("characters", lib[w2(0x2da)]["characters"]["remove"](kJ["target"]["name"]))); }, 0x3e8));
            }
            function kY(kJ) {
                const w4 = KH, w3 = KX;
                if (window["currentSprite"] != kJ["target"])
                    return;
                yZ["removeChildren"]();
                if (kU == kJ["target"]["name"]) {
                    let kI = ky["slice"]();
                    if (G6 != null)
                        cancelAnimationFrame(G6);
                    kb(kI, yZ), kJ["target"]["texture"] = yt["resources"]["wujiang"][w3(0x2c3, "PYEN")]["clt_lvl3_btn_off"], kU = null;
                }
                else {
                    kJ["target"]["texture"] = yt["resources"]["wujiang"]["textures"]["clt_lvl3_btn_fg"];
                    if (kU != null && yR["getChildByName"](kU))
                        yR["getChildByName"](kU)["texture"] = yt["resources"]["wujiang"]["textures"][w4(0x2cd)];
                    kU = kJ["target"]["name"];
                    let ki = ky["filter"](kT => { return kT["secgroup"] === kJ["target"]["name"] || Array["isArray"](kT["secgroup"]) && kT["secgroup"]["includes"](kJ["target"]["name"]); })["slice"]();
                    if (G6 != null)
                        cancelAnimationFrame(G6);
                    kb(ki, yZ);
                }
            }
            function km(kJ) { window["currentSprite"] = kJ["target"], PIXI["sound"]["play"]("Label"); }
            function kb(kJ, kI) {
                lifecycle.grid.show(kJ, kI, yn, G7, G8);
            }
            function kK() { const w6 = KX, w5 = KH, kJ = {}; kJ["duration"] = 0.5, kJ["y"] = 0x0, kJ["ease"] = "power4.out", gsap["fromTo"](ya, { "y": -ya["height"] / 0x2 }, kJ); const kI = {}; kI["duration"] = 0.5, kI["x"] = 0x0, kI["ease"] = "power4.out", gsap["fromTo"](yo, { "x": -yo[w5(0x2b1)] }, kI); const ki = {}; ki["duration"] = 0.75, ki["x"] = 0x0, ki["ease"] = "power4.out", gsap["fromTo"](yD, { "x": yD["width"] }, ki); const kT = {}; kT["y"] = i["screen"][w6(rzshrq.G, "P9FJ")], gsap["fromTo"](UO, kT, { "duration": 0.5, "y": i["screen"]["height"] - UO["height"], "ease": "power4.out" }); }
        }
        const yH = lifecycle.loader();
        yH["add"]("shop_bg_3", lib["assetURL"] + "extension/如真似幻/images/shop_bg_3.jpg"), yH["add"]("ui_person", lib["assetURL"] + "extension/如真似幻/images/personui.json"), yH["add"]("ui_persont", lib["assetURL"] + "extension/如真似幻/images/persontaixu.json"), yH["add"]("personwarbg1", lib["assetURL"] + "extension/如真似幻/images/personWarWork_bg3.png"), yH["add"](K1(rzshMx.k, "hs^2"), lib["assetURL"] + "extension/如真似幻/images/personWarWork_bg4.png"), yH["add"](K0(0x303), lib["assetURL"] + "extension/如真似幻/images/personTaiXu_bg5.png");
        let yO = !![];
        try {
            lifecycle.optionalSpine(yH, "person_skel1", lib["assetURL"] + K0(0x15c));
        }
        catch (Ub) {
            yO = ![];
        }
        try {
            lifecycle.optionalSpine(yH, "person_skel2", lib["assetURL"] + "extension/十周年UI/assets/dynamic/吕玲绮/战场绝版/daiji.skel");
        }
        catch (UK) {
            yO = ![];
        }
        yH["onError"]["add"](function (Uw, Uc, Ud) { Ud && (Ud["name"] === "person_skel1" || Ud["name"] === "person_skel2") && (yO = ![]); });
        let yQ = lifecycle.container();
        yQ["width"] = i["screen"][K0(0x2b1)], yQ["height"] = i["screen"]["height"];
        function yh() {
            const rzshM2 = { G: 0x2f2 }, wk = K1, wU = K0;
            console["timeEnd"]("m加载完毕");
            function Uw(Yi, YT, Yg) {
                const w7 = rzshy;
                if (Yi[w7(0x2b9)](YT))
                    return Yg !== undefined ? Yi[YT] === Yg : !![];
                return ![];
            }
            function Uc(Yi) { const YT = new PIXI["Sprite"](yH["resources"]["ui_person"]["textures"][Yi]); return YT["name"] = Yi, YT; }
            function Ud(Yi) { const YT = new PIXI["Sprite"](yH["resources"]["ui_person"]["textures"][Yi]); return YT["name"] = Yi, YT["interactive"] = !![], YT["on"]("pointerdown", Ut), YT["on"]("pointerup", YJ), YT; }
            function Up(Yi) { const YT = new PIXI["Sprite"](yH["resources"]["ui_persont"]["textures"][Yi]); return YT["name"] = Yi, YT; }
            function Ur(Yi) { const w8 = rzshU, YT = new PIXI["Sprite"](yH["resources"][w8(0x16a, "r6vR")]["textures"][Yi]); return YT["name"] = Yi, YT["interactive"] = !![], YT["on"]("pointerdown", Ut), YT["on"]("pointerup", YJ), YT; }
            function UM(Yi) { const YT = new PIXI["Sprite"](Gb["resources"]["uilight"]["textures"][Yi]); return YT["name"] = Yi, YT["interactive"] = !![], YT; }
            function Uu(Yi) { const wG = rzshU, w9 = rzshy, YT = new PIXI["AnimatedSprite"]["fromFrames"](Gb[w9(0x2bb)]["uilight"]["data"]["animations"][Yi]); return YT["name"] = Yi, YT["interactive"] = !![], YT[wG(0x27a, "@0B1")] = 0x1, YT["play"](), YT; }
            function Ut(Yi) {
                const wy = rzshy;
                var YT = Yi["target"];
                window["currentSprite"] = Yi[wy(0x219)];
                switch (YT["name"]) {
                    default:
                        PIXI["sound"][wy(0x2ef)]("Label"), YT["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { YT["filters"] = [P]; }, "onComplete": () => { YT["filters"] = null; } });
                        break;
                }
            }
            let UW = lifecycle.container(), Ue = lifecycle.container(), UA = lifecycle.container(), Ua = lifecycle.container();
            const Uo = new PIXI[(wU(0x1a6))](yH["resources"]["ui_person"]["textures"][wU(0x1d1)]);
            Uo["name"] = "personbg3", Uo["x"] = 0.118 * i["screen"]["width"], Uo["y"] = 0.5 * i["screen"][wU(0x231)], Uo["height"] = i["screen"]["height"], Uo["width"] = i[wk(0x165, "xQ$a")]["height"] * 0x18c / 0x2ee, Uo["anchor"]["set"](0.5), GF(Uo);
            const Uj = -(Uo["texture"]["width"] / 0x2) * Uo["scale"]["x"], UD = new PIXI["Sprite"]();
            UD["name"] = wU(0x159), UD["interactive"] = !![], UD["on"]("pointerup", YJ), UD["on"]("pointerdown", U5), UD["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_select"], UD["y"] = -0.56 * (Uo["height"] / Uo["scale"]["y"]);
            const UJ = new PIXI["Sprite"]();
            UJ["name"] = "page2btn", UJ["interactive"] = !![], UJ["on"]("pointerup", YJ), UJ["on"]("pointerdown", U5), UJ["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UJ["y"] = -0.37 * (Uo["height"] / Uo["scale"]["y"]);
            const UI = new PIXI["Sprite"]();
            UI["name"] = "page3btn", UI["interactive"] = !![], UI["on"]("pointerup", YJ), UI["on"]("pointerdown", U5), UI["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UI["y"] = -0.18 * (Uo[wU(0x231)] / Uo["scale"]["y"]);
            const Ui = new PIXI["Sprite"]();
            Ui["name"] = "page4btn", Ui["interactive"] = !![], Ui["on"]("pointerup", YJ), Ui["on"]("pointerdown", U5), Ui["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], Ui["y"] = 0.01 * (Uo["height"] / Uo["scale"]["y"]);
            const UT = [UD, UJ, UI, Ui], Ug = -Uo["y"] + 0x32, UB = UD["height"] * 1.05;
            UT["forEach"]((Yi, YT) => { Yi["y"] = Ug + UB * YT; });
            const Uq = !!navigator["userAgent"]["match"](/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i), Un = Uo["texture"]["width"] * Uo["scale"]["x"] * (Uq ? 0.9 : 0.75);
            GF(UD), UD["height"] = UD["texture"]["height"] * (Un / UD["texture"]["width"]), UD["width"] = Un, UD["x"] = Uj, GF(UJ), UJ["height"] = UJ["texture"]["height"] * (Un / UJ["texture"]["width"]), UJ["width"] = Un, UJ["x"] = Uj, GF(UI), UI["height"] = UI["texture"]["height"] * (Un / UI["texture"]["width"]), UI["width"] = Un, UI["x"] = Uj, GF(Ui), Ui["height"] = Ui["texture"]["height"] * (Un / Ui["texture"]["width"]), Ui["width"] = Un, Ui["x"] = Uj;
            const UZ = !!navigator["userAgent"]["match"](/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i), Uz = UZ ? 0x34 : 0x20, UN = {};
            UN["fontSize"] = Uz, UN["fill"] = "#CFBA9C", UN["fontFamily"] = "shousha";
            const UR = new PIXI["Text"]("个人名片", UN), US = UD["texture"]["width"], UX = UD["texture"]["height"];
            UZ ? (UR["anchor"]["set"](0.5, 0.5), UR["x"] = US * 0.5, UR["y"] = UX * 0.46) : (UR["x"] = 0.325 * US, UR["y"] = 0.3 * UX);
            UR["alpha"] = 0x1;
            const UH = {};
            UH["fontSize"] = Uz, UH["fill"] = "#CFBA9C", UH["fontFamily"] = "shousha";
            const UO = new PIXI["Text"]("战绩", UH);
            UZ ? (UO["anchor"]["set"](0.5, 0.5), UO["x"] = US * 0.5, UO["y"] = UX * 0.46) : (UO["x"] = 0.35 * US, UO["y"] = 0.3 * UX);
            UO["alpha"] = 0.5;
            const UQ = {};
            UQ["fontSize"] = Uz, UQ["fill"] = "#CFBA9C", UQ["fontFamily"] = "shousha";
            const Uh = new PIXI["Text"]("战功", UQ);
            UZ ? (Uh["anchor"]["set"](0.5, 0.5), Uh["x"] = US * 0.5, Uh["y"] = UX * 0.46) : (Uh["x"] = 0.35 * US, Uh["y"] = 0.3 * UX);
            Uh["alpha"] = 0.5;
            const UL = {};
            UL["fontSize"] = Uz, UL["fill"] = "#CFBA9C", UL["fontFamily"] = "shousha";
            const Us = new PIXI["Text"]("太虚幻境", UL);
            UZ ? (Us["anchor"]["set"](0.5, 0.5), Us["x"] = US * 0.5, Us["y"] = UX * 0.46) : (Us["x"] = 0.325 * US, Us["y"] = 0.3 * UX);
            Us["alpha"] = 0.5, UD["addChild"](UR), UJ["addChild"](UO), UI["addChild"](Uh), Ui["addChild"](Us);
            const Uv = (window["_rzsh_current"] || lib["config"]["tianti_versus_two"] || {})["xxingnum"] || 0x0;
            if (lib["config"]["tianti_0星"])
                Uv++;
            var UV = 0x0, UP = 0x0, Ul = 0x0, UE = 0x0, UF = 0x0, UC = 0x0, Ux = 0x0, k0 = 0x0, k1 = 0x0, k2 = 0x0, k3 = 0x0, k4 = 0x0, k5 = 0x0, k6 = 0x0, k7 = 0x0, k8 = 0x0, k9 = [![], ![], ![], ![], ![]], kG = [![], ![], ![]], ky = [![], ![], ![], ![], ![], ![], ![]], kU = ![];
            if (Uw(lib["config"]["gameRecord"], "identity")) {
                let Yi = 0x0, YT = 0x0;
                Uw(lib["config"]["gameRecord"]["identity"]["data"], "zhu") && (Yi += lib["config"]["gameRecord"]["identity"]["data"]["zhu"][0x0], YT += lib["config"]["gameRecord"]["identity"]["data"]["zhu"][0x1], k9[0x1] = !![], UF = (lib["config"]["gameRecord"]["identity"]["data"]["zhu"][0x0] / (lib["config"]["gameRecord"]["identity"]["data"]["zhu"][0x0] + lib["config"]["gameRecord"]["identity"]["data"]["zhu"][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib["config"]["gameRecord"]["identity"]["data"], "zhong") && (Yi += lib["config"]["gameRecord"]["identity"]["data"]["zhong"][0x0], YT += lib["config"]["gameRecord"]["identity"]["data"][wU(0x227)][0x1], k9[0x2] = !![], UC = (lib["config"]["gameRecord"]["identity"]["data"]["zhong"][0x0] / (lib["config"]["gameRecord"]["identity"]["data"]["zhong"][0x0] + lib["config"]["gameRecord"]["identity"]["data"]["zhong"][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib[wk(0x2b3, "Fj0l")]["gameRecord"]["identity"]["data"], "fan") && (Yi += lib["config"]["gameRecord"]["identity"]["data"]["fan"][0x0], YT += lib["config"]["gameRecord"]["identity"]["data"]["fan"][0x1], k9[0x3] = !![], Ux = (lib["config"]["gameRecord"]["identity"]["data"]["fan"][0x0] / (lib["config"]["gameRecord"]["identity"]["data"]["fan"][0x0] + lib["config"]["gameRecord"]["identity"]["data"]["fan"][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib["config"]["gameRecord"]["identity"]["data"], "nei") && (Yi += lib[wU(0x2da)]["gameRecord"]["identity"]["data"]["nei"][0x0], YT += lib["config"]["gameRecord"][wk(0x1ac, "hJkg")]["data"][wU(0x21b)][0x1], k9[0x4] = !![], k0 = (lib["config"]["gameRecord"]["identity"]["data"]["nei"][0x0] / (lib["config"]["gameRecord"]["identity"]["data"]["nei"][0x0] + lib["config"]["gameRecord"]["identity"]["data"]["nei"][0x1]) * 0x64)["toFixed"](0x2));
                for (let Yg = 0x1; Yg <= k9["length"]; Yg++) {
                    if (k9[Yg]) {
                        k9[0x0] = !![];
                        break;
                    }
                }
                UV = (Yi / (Yi + YT) * 0x64)["toFixed"](0x2);
            }
            if (Uw(lib["config"]["gameRecord"], "guozhan")) {
                let YB = 0x0, Yq = 0x0;
                Uw(lib["config"]["gameRecord"]["guozhan"]["data"], "wei") && (YB += lib["config"][wk(0x2be, "v*9j")]["guozhan"]["data"]["wei"][0x0], Yq += lib["config"]["gameRecord"]["guozhan"]["data"]["wei"][0x1], ky[0x1] = !![], k3 = (lib["config"]["gameRecord"]["guozhan"]["data"]["wei"][0x0] / (lib["config"]["gameRecord"]["guozhan"]["data"]["wei"][0x0] + lib[wU(0x2da)]["gameRecord"]["guozhan"][wk(0x17e, "PYEN")]["wei"][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib["config"]["gameRecord"]["guozhan"]["data"], "shu") && (YB += lib["config"]["gameRecord"]["guozhan"]["data"]["shu"][0x0], Yq += lib["config"]["gameRecord"]["guozhan"]["data"]["shu"][0x1], ky[0x2] = !![], k4 = (lib["config"]["gameRecord"]["guozhan"]["data"]["shu"][0x0] / (lib["config"]["gameRecord"]["guozhan"]["data"]["shu"][0x0] + lib["config"]["gameRecord"]["guozhan"]["data"]["shu"][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib["config"]["gameRecord"]["guozhan"]["data"], "wu") && (YB += lib["config"]["gameRecord"]["guozhan"]["data"]["wu"][0x0], Yq += lib["config"]["gameRecord"]["guozhan"]["data"]["wu"][0x1], ky[0x3] = !![], k5 = (lib["config"]["gameRecord"]["guozhan"]["data"]["wu"][0x0] / (lib["config"][wk(0x2e0, "@0B1")]["guozhan"]["data"]["wu"][0x0] + lib["config"][wk(0x245, "vQIC")]["guozhan"]["data"]["wu"][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib["config"]["gameRecord"][wk(0x1a9, rzshMb.G)]["data"], "qun") && (YB += lib["config"]["gameRecord"]["guozhan"]["data"]["qun"][0x0], Yq += lib["config"]["gameRecord"][wk(0x2a8, "UEd7")]["data"]["qun"][0x1], ky[0x4] = !![], k6 = (lib["config"]["gameRecord"]["guozhan"]["data"]["qun"][0x0] / (lib["config"]["gameRecord"]["guozhan"]["data"]["qun"][0x0] + lib["config"]["gameRecord"]["guozhan"]["data"][wk(0x19b, "VwJt")][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib["config"]["gameRecord"]["guozhan"]["data"], "jin") && (YB += lib["config"]["gameRecord"]["guozhan"]["data"]["jin"][0x0], Yq += lib["config"]["gameRecord"]["guozhan"]["data"]["jin"][0x1], ky[0x5] = !![], k7 = (lib[wU(rzshMb.y)]["gameRecord"]["guozhan"]["data"]["jin"][0x0] / (lib["config"]["gameRecord"]["guozhan"]["data"]["jin"][0x0] + lib["config"]["gameRecord"]["guozhan"]["data"]["jin"][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib["config"]["gameRecord"]["guozhan"]["data"], "ye") && (YB += lib["config"]["gameRecord"]["guozhan"]["data"]["ye"][0x0], Yq += lib["config"]["gameRecord"]["guozhan"]["data"]["ye"][0x1], ky[0x6] = !![], k8 = (lib["config"]["gameRecord"]["guozhan"]["data"]["ye"][0x0] / (lib["config"]["gameRecord"]["guozhan"]["data"]["ye"][0x0] + lib["config"]["gameRecord"]["guozhan"]["data"]["ye"][0x1]) * 0x64)["toFixed"](0x2));
                for (let Yn = 0x1; Yn <= ky["length"]; Yn++) {
                    if (ky[Yn]) {
                        ky[0x0] = !![];
                        break;
                    }
                }
                Ul = (YB / (YB + Yq) * 0x64)["toFixed"](0x2);
            }
            if (Uw(lib["config"]["gameRecord"], "versus")) {
                let YZ = 0x0, Yz = 0x0;
                Uw(lib["config"]["gameRecord"][wk(0x184, "rkb@")]["data"], "三人") && (YZ += lib["config"]["gameRecord"]["versus"]["data"]["三人"][0x0], Yz += lib["config"]["gameRecord"][wk(0x168, "p[Aj")]["data"]["三人"][0x1], kU = !![]), Uw(lib["config"]["gameRecord"][wU(0x2fa)][wk(0x174, "FbmE")], "two") && (YZ += lib["config"]["gameRecord"]["versus"]["data"]["two"][0x0], Yz += lib["config"]["gameRecord"]["versus"]["data"]["two"][0x1], kU = !![]), UE = (YZ / (YZ + Yz) * 0x64)["toFixed"](0x2);
            }
            if (Uw(lib["config"]["gameRecord"], "doudizhu")) {
                let YN = 0x0, YR = 0x0;
                Uw(lib["config"][wk(0x2be, "v*9j")]["doudizhu"]["data"], "fan") && (YN += lib[wk(0x29d, "]!s^")]["gameRecord"]["doudizhu"]["data"]["fan"][0x0], YR += lib["config"]["gameRecord"]["doudizhu"]["data"]["fan"][0x1], kG[0x1] = !![], k2 = (lib["config"][wk(0x2ab, "Y&Q6")]["doudizhu"]["data"]["fan"][0x0] / (lib["config"]["gameRecord"]["doudizhu"]["data"]["fan"][0x0] + lib[wk(0x2e2, "SnMu")]["gameRecord"]["doudizhu"]["data"]["fan"][0x1]) * 0x64)["toFixed"](0x2));
                Uw(lib["config"]["gameRecord"]["doudizhu"]["data"], "zhu") && (YN += lib["config"]["gameRecord"]["doudizhu"]["data"]["zhu"][0x0], YR += lib["config"]["gameRecord"]["doudizhu"]["data"]["zhu"][0x1], kG[0x2] = !![], k1 = (lib["config"]["gameRecord"]["doudizhu"]["data"]["zhu"][0x0] / (lib["config"]["gameRecord"]["doudizhu"]["data"]["zhu"][0x0] + lib["config"]["gameRecord"]["doudizhu"]["data"]["zhu"][0x1]) * 0x64)["toFixed"](0x2));
                for (let YS = 0x1; YS <= kG["length"]; YS++) {
                    if (kG[YS]) {
                        kG[0x0] = !![];
                        break;
                    }
                }
                UP = (YN / (YN + YR) * 0x64)["toFixed"](0x2);
            }
            const kk = new PIXI["Sprite"](yH["resources"]["personwarbg1"]["texture"]);
            kk["name"] = "personbg1", kk["x"] = 0.5 * i["screen"]["width"], kk["y"] = 0.5 * i["screen"]["height"], kk["width"] = i[wk(0x187, "KsXd")]["width"], kk["height"] = i["screen"]["width"] * 0x2ee / 0x5fe, kk["anchor"]["set"](0.5), GF(kk);
            const kf = new PIXI["Sprite"](yH[wU(0x2bb)]["personwarbg2"]["texture"]);
            kf["name"] = "personbg2", kf["x"] = 0.5 * i["screen"]["width"], kf["y"] = 0.505 * i["screen"]["height"], kf["width"] = i["screen"]["width"], kf["height"] = 0.94 * i["screen"]["height"], kf["anchor"]["set"](0.5), GF(kf), UW["addChild"](kk, kf);
            const kY = new PIXI["Sprite"](Gb["resources"]["pic"]["texture"]);
            kY["name"] = wk(0x23e, "vQIC"), kY["anchor"]["set"](0.5), kY["x"] = 0.5428 * i["screen"]["width"], kY["y"] = 0.12 * i["screen"]["height"], kY["scale"]["set"](G9);
            const km = new PIXI["Sprite"](Gb["resources"]["avatarframe"]["texture"]);
            km["name"] = "avatarframe", km[wU(0x173)]["set"](0.5), km["scale"][wU(0x1ca)](G9), kY["addChild"](km);
            const kb = {};
            kb["fontSize"] = 0x22, kb["fill"] = "#5E422A", kb["fontFamily"] = "shousha", kb["fontWeight"] = 0x1f4, kb["letterSpacing"] = -1.5;
            const kK = new PIXI["Text"](lib["config"]["connect_nickname"], kb);
            kK["x"] = 0.6 * i["screen"]["width"], kK["y"] = 0.08 * i["screen"]["height"];
            const kw = {};
            kw["fontSize"] = 0x12, kw["fill"] = "#5E422A", kw["fontFamily"] = "shousha", kw["fontWeight"] = 0x1f4, kw["letterSpacing"] = -1.5;
            const kc = new PIXI["Text"]("LV. 220", kw);
            kc["x"] = 0.6 * i["screen"]["width"], kc["y"] = 0.1451 * i["screen"]["height"];
            const kd = Up("businesscard_progress_bar_bg");
            GF(kd), kd["x"] = 0.668 * i[wU(0x1f0)]["width"], kd["y"] = 0.1455 * i["screen"]["height"];
            const kp = Up(wU(0x14a));
            GF(kp), kp["anchor"]["set"](0.5), kp[wU(0x1bf)]["set"](0.5 * kd["width"], 0.5 * kd[wU(0x231)]);
            const kr = {};
            kr["fontSize"] = 0x12, kr["fill"] = "#FFFFFF", kr["fontFamily"] = "shousha", kr["fontWeight"] = 0x1f4;
            const kM = new PIXI["Text"]("100%", kr);
            kM["anchor"]["set"](0.5), kM["position"]["set"](0.5 * kd["width"], 0.5 * kd["height"]), kd["addChild"](kp, kM);
            const ku = Uc("businesscard_line");
            ku["alpha"] = 0.75, GF(ku), ku["x"] = 0.51 * i["screen"]["width"], ku["y"] = 0.186 * i["screen"][wk(0x1dd, rzshMb.U)], ku["width"] = 0.395 * i["screen"]["width"];
            let kt = [["union_grade_qingtong", "1.05", "排位赛"], ["personWarWork_txhj", "0.85", "霸王征程"], ["businesscard_flower", "1.05", "4357"], ["businesscard_egg", "1.05", "6142"], ["personWarWork_wujiang", "0.85", "1314"], ["personWarWork_skin", "0.85", "2896"], ["personWarWork_servant", "0.85", 0x0]];
            lib["extensionMenu"]["extension_EpicFX"] && lib["extensionMenu"]["extension_EpicFX"]["servant"] && (kt[0x6] = ["personWarWork_servant", "0.85", Object["keys"](lib["extensionMenu"]["extension_EpicFX"]["servant"]["item"])["length"] - 0x1]);
            if (Uv < 0x7)
                kt[0x0][0x0] = "union_grade_qingtong";
            else {
                if (Uv < 0x13)
                    kt[0x0][0x0] = "union_grade_baiyin";
                else {
                    if (Uv < 0x2c)
                        kt[0x0][0x0] = "union_grade_huangjin";
                    else {
                        if (Uv < 0x45)
                            kt[0x0][0x0] = "union_grade_feicui";
                        else {
                            if (Uv < 0x63)
                                kt[0x0][0x0] = "union_grade_dashi";
                            else
                                Uv >= 0x63 && (kt[0x0][0x0] = "union_grade_chuanshuo");
                        }
                    }
                }
            }
            for (var kW = 0x0; kW < 0x7; kW++) {
                const YX = Uc("businesscard_btn_icon_bg");
                GF(YX), YX["scale"]["set"](0.57), YX["anchor"]["set"](0.5), YX["x"] = (0.536 + 0.0545 * kW) * i["screen"]["width"], YX["y"] = 0.261 * i["screen"]["height"];
                const YH = {};
                YH["fontSize"] = 0x18, YH["fill"] = "#5E422A", YH["fontFamily"] = "shousha", YH["fontWeight"] = 0x1f4, YH["letterSpacing"] = -1.5;
                const YO = new PIXI[(wk(0x265, "!2E0"))](kt[kW][0x2], YH);
                YO["anchor"]["set"](0.5), YO["x"] = 0x0, YO["y"] = 1.07 * (YX["height"] / YX["scale"]["y"]);
                const YQ = Uc(kt[kW][0x0]);
                GF(YQ), YQ["scale"][wk(0x278, "rkb@")](kt[kW][0x1]), YQ["anchor"]["set"](0.5), YX["addChild"](YQ, YO), UW["addChild"](YX);
                if (kW < 0x6) {
                    const Yh = Uc("businesscard_vertical_line");
                    GF(Yh), Yh["anchor"]["set"](0.5), Yh["scale"]["set"](0.69), Yh["x"] = (0.56325 + 0.0545 * kW) * i[wk(0x29b, "PYEN")]["width"], Yh["y"] = 0.261 * i["screen"]["height"], UW["addChild"](Yh);
                }
            }
            const ke = Uc("businesscard_line");
            ke["alpha"] = 0.75, GF(ke), ke["x"] = 0.51 * i["screen"]["width"], ke["y"] = 0.34 * i["screen"]["height"], ke["width"] = 0.395 * i["screen"]["width"];
            const kA = {};
            kA["fontSize"] = 0x16, kA["fill"] = "#5E422A", kA["fontFamily"] = "shousha", kA["fontWeight"] = 0x1f4, kA["letterSpacing"] = -0x1;
            const ka = new PIXI["Text"]("我的最爱", kA);
            ka["position"]["set"](0.655 * i["screen"]["width"], 0.34 * i["screen"]["height"]);
            const ko = Ud("businesscard_btn_bg");
            GF(ko), ko["scale"][wk(0x1de, "xQ$a")](0.688), ko["x"] = 0.855 * i["screen"]["width"], ko["y"] = 0.345 * i["screen"]["height"];
            const kj = Uc("businesscard_edit");
            GF(kj), kj["anchor"]["set"](0.5), kj["x"] = 0.49 * ko["width"] / 0.688, kj["y"] = 0.49 * ko["height"] / 0.688;
            const kD = {};
            kD["fontSize"] = 0x18, kD["fill"] = "#5E422A", kD["fontFamily"] = "shousha", kD["fontWeight"] = 0x1f4, kD["letterSpacing"] = -1.5;
            const kJ = new PIXI["Text"]("编辑", kD);
            kJ["anchor"]["set"](0.5), kJ["x"] = 0.49 * ko["width"] / 0.688, kJ["y"] = 1.085 * ko["height"] / 0.688, ko["addChild"](kj, kJ), UW["addChild"](ka, ko);
            for (let YL = 0x0; YL < 0x4; YL++) {
                const Ys = Uc("businesscard_icon_bg");
                Ys["scale"]["set"](0.69), Ys[wk(0x326, "hZEd")]["set"](0.5), Ys["x"] = (0.58 + 0.0735 * YL) * i["screen"]["width"], Ys["y"] = 0.455 * i["screen"]["height"];
                const Yv = {};
                Yv["fontSize"] = 0x12, Yv["fill"] = "#CFBA9C", Yv["fontFamily"] = "shousha", Yv[wU(0x150)] = 0x1f4, Yv["letterSpacing"] = -1.5;
                const YV = new PIXI["Text"]("未选择武将", Yv);
                YV["anchor"]["set"](0.5), YV["position"]["set"](0x0, 0x0), YV["alpha"] = 0.5, Ys["addChild"](YV), UW["addChild"](Ys);
            }
            for (let YP = 0x0; YP < 0x3; YP++) {
                const Yl = Uc("businesscard_icon_bg");
                Yl["scale"]["set"](0.69), Yl[wk(0x2d1, "r6vR")]["set"](0.5), Yl["x"] = (0.6175 + 0.0735 * YP) * i["screen"]["width"], Yl["y"] = 0.5925 * i["screen"]["height"];
                const YE = {};
                YE["fontSize"] = 0x12, YE["fill"] = "#CFBA9C", YE[wk(0x1ff, "PYEN")] = "shousha", YE["fontWeight"] = 0x1f4, YE["letterSpacing"] = -1.5;
                const YF = new PIXI["Text"]("未选择侍灵", YE);
                YF["anchor"]["set"](0.5), YF["position"]["set"](0x0, 0x0), YF["alpha"] = 0.5, Yl["addChild"](YF), UW["addChild"](Yl);
            }
            const kI = Uc("businesscard_line");
            kI["alpha"] = 0.75, GF(kI), kI["x"] = 0.51 * i["screen"]["width"], kI["y"] = 0.665 * i["screen"]["height"], kI["width"] = 0.395 * i["screen"]["width"];
            const ki = new PIXI["Sprite"](Gb["resources"]["ui_tw"]["textures"]["dajiangjun_pic"]);
            GF(ki), ki["scale"]["set"](0.64), ki["x"] = 0.508 * i["screen"]["width"], ki["y"] = 0.67 * i["screen"]["height"];
            const kT = new PIXI["Sprite"](Gb["resources"]["ui_tw"]["textures"]["dajiangjun_text"]);
            GF(kT), kT["scale"]["set"](0.69), kT["x"] = 0.516 * i["screen"]["width"], kT["y"] = 0.825 * i["screen"]["height"], UW["addChild"](ki, kT);
            const kg = ["biao", "fen", "lin", "huo", "shan", "yin", "lei", "shen", "phone", "linju", "guo", "yijiang", wU(0x264), "sanjiang", "sijiang", "wujiang", "liujiang", "qijiang", "sp", "kun", "xing", "zhi", "xin", "ren", "yon", "yan", "mou_zhi", "mou_shi", "mou_tong", "mou_yu", "mou_neng", "xuan", "xia", "ding"], kB = ["yin", "lei", "shen", "phone", wk(0x309, "P9FJ"), "wujiang", "liujiang", "qijiang", "xuan", "xia", "ding"];
            var kq = 0x1, kn = 0x0;
            for (let YC = 0x0; YC < kg["length"]; YC++) {
                const Yx = kg[YC];
                var kZ;
                !kB["includes"](Yx) ? (kZ = Uu(Yx), GC(kZ), kZ["scale"]["set"](0.38), kZ["x"] = (0.608 + 0.032 * (kq - 0x1)) * i["screen"]["width"], kZ["y"] = (0.71 + 0.061 * kn) * i["screen"]["height"], UW["addChild"](kZ)) : (kZ = UM(Yx), GC(kZ), kZ["scale"]["set"](0.38), kZ["x"] = (0.608 + 0.032 * (kq - 0x1)) * i["screen"]["width"], kZ["y"] = (0.71 + 0.061 * kn) * i["screen"]["height"], UW["addChild"](kZ));
                if (kq % 0xc == 0x0 && kq != 0x0)
                    kq = 0x1, kn++;
                else
                    kq++;
            }
            UW["addChild"](kY, kK, kc, kd, ku, ke, kI);
            const kz = -0x2b, kN = 0xf, kR = 1.53, kS = Uc("businesscard_char_bg"), kX = 0.55 * G9, kH = i["screen"]["height"] / kS["texture"]["height"];
            kS[wk(0x25c, "1*2K")]["x"] = kX, kS["scale"]["y"] = kH, kS["x"] = 0.208 * i["screen"]["width"], kS["y"] = 0x0, GF(kS);
            const kO = kS["texture"]["width"] * 0.1, kQ = kS["texture"]["height"] * 0.02, kh = kS["texture"][wk(0x182, "Q@V7")] * 0.8, kL = kS["texture"]["height"] * 0.76, ks = kh * kX, kv = kL * kH, kV = new PIXI["Sprite"](Gb["resources"]["pic_horizon"]["texture"]);
            kV["anchor"]["set"](0.5);
            const kP = kV["texture"]["width"], kl = kV["texture"]["height"], kE = Math["max"](ks / kP, kv / kl);
            kV["scale"]["x"] = kE / kX, kV[wU(rzshMb.k)]["y"] = kE / kH, kV["x"] = kO + kh * 0.5, kV["y"] = kQ + kL * 0.5, kS["addChild"](kV);
            const kF = new PIXI["Graphics"]();
            kF["beginFill"](0xffffff), kF["drawRect"](kO, kQ, kh, kL), kF["endFill"](), kS["addChild"](kF), kV["mask"] = kF;
            const kC = lifecycle.container();
            kV["addChild"](kC);
            (!yH["resources"]["person_skel1"] || !yH["resources"]["person_skel1"]["spineData"] || !yH["resources"]["person_skel2"] || !yH["resources"]["person_skel2"]["spineData"]) && (yO = ![]);
            let kx = null, f0 = null;
            yO && (kx = new PIXI["spine"]["Spine"](yH["resources"]["person_skel1"][wk(0x217, "Z6A)")]), f0 = new PIXI["spine"]["Spine"](yH["resources"]["person_skel2"]["spineData"]));
            const f1 = 0.92 / kV["scale"]["x"], f2 = kX * 0.92 / (kH * kV["scale"]["y"]);
            kC["scale"]["set"](f1 * kR, f2 * kR), kC["x"] = kz, kC["y"] = kN;
            yO && (kx["x"] = 0x0, kx["y"] = 0x0, f0["x"] = 0x0, f0["y"] = 0x0, kC["addChild"](kx, f0));
            yO && (kx["state"]["setAnimation"](0x0, wU(0x2ef), !![]), f0["state"]["setAnimation"](0x0, "play", !![]));
            const f3 = Ud("businesscard_btn_bg");
            GF(f3), f3["name"] = "userbtn_setting";
            if (!yO)
                f3["visible"] = ![];
            const f4 = Uc("businesscard_setting");
            GF(f4), f4["anchor"][wk(0x19e, "P9FJ")](0.5), f4["x"] = 0.49 * f3["texture"]["width"], f4["y"] = 0.49 * f3["texture"]["height"];
            const f5 = {};
            f5["fontSize"] = 0x18, f5["fill"] = "#5E422A", f5["fontFamily"] = "shousha", f5["fontWeight"] = 0x1f4, f5["letterSpacing"] = 1.5;
            const f6 = new PIXI["Text"]("动静切换", f5);
            f6[wk(0x1d5, "og)$")]["set"](0.5), f6["x"] = 0.49 * f3["texture"]["width"], f6["y"] = 1.085 * f3["texture"]["height"], f3[wU(0x291)](f4, f6);
            const f7 = Ud(wk(0x26a, "PA38"));
            GF(f7), f7["name"] = "userbtn_share";
            const f8 = Uc("businesscard_share");
            GF(f8), f8["anchor"]["set"](0.5), f8["x"] = 0.49 * f7["texture"]["width"], f8["y"] = 0.49 * f7["texture"]["height"];
            const f9 = {};
            f9["fontSize"] = 0x18, f9["fill"] = "#5E422A", f9["fontFamily"] = "shousha", f9["fontWeight"] = 0x1f4, f9["letterSpacing"] = 1.5;
            const fG = new PIXI["Text"]("分享", f9);
            fG["anchor"]["set"](0.5), fG["x"] = 0.49 * f7["texture"]["width"], fG["y"] = 1.085 * f7["texture"]["height"], f7["addChild"](f8, fG), UW["addChild"](kS);
            const fy = kS["texture"]["width"] * kX, fU = f3["texture"]["width"], fk = (fy - 0x2 * fU) / 0x3;
            f3["x"] = kS["x"] + fk, f3["y"] = 0.82 * i["screen"]["height"], f7["x"] = kS["x"] + fk * 0x2 + fU, f7["y"] = 0.82 * i["screen"]["height"], UW["addChild"](f3, f7), f3["interactive"] = !![], f3["buttonMode"] = !![];
            let ff = !![];
            f3["on"]("pointertap", () => {
                if (!yO)
                    return;
                ff = !ff, ff ? (kx["state"]["timeScale"] = 0x1, f0["state"]["timeScale"] = 0x1, f6["text"] = "动静切换") : (kx["state"]["timeScale"] = 0x0, f0["state"]["timeScale"] = 0x0, f6["text"] = "恢复动效");
            });
            const fY = {};
            fY["boxWidth"] = i["screen"]["width"] - 0.69 * Uo["width"], fY["boxHeight"] = i["screen"]["height"] * 0.91, fY["passiveWheel"] = ![], fY["scrollbarBackgroundAlpha"] = 0x0, fY["scrollbarSize"] = 0x0, fY["stopPropagation"] = !![], fY["divWheel"] = i["view"], fY["interaction"] = i["renderer"]["plugins"]["interaction"];
            const fm = new PIXI["Scrollbox"](fY);
            fm["position"]["set"](0.69 * Uo["width"], 0.09 * i["screen"]["height"]);
            const fb = lifecycle.container();
            fm["content"]["addChild"](fb), fm["overflowY"] = "none", fm["update"]();
            for (let m0 = 0x0; m0 < 0x4; m0++) {
                const m1 = m0 === 0x0 || m0 === 0x1 && k9[0x0] || m0 === 0x2 && ky[0x0] || m0 === 0x3 && kG[0x0];
                if (!m1)
                    continue;
                const m2 = Uc("businesscard_zj_bg");
                m2["anchor"]["set"](0x0, 0x0);
                const m3 = Math["min"](0.9, i["screen"]["height"] / m2["texture"]["height"]);
                m2["scale"]["set"](m3);
                const m4 = m2[wk(0x225, "PYEN")]["width"], m5 = m2["texture"]["height"];
                m2["x"] = m4 * m3 * fb["children"]["length"], m2["y"] = 0x0, fb["addChild"](m2);
                const m6 = mG => { const my = {}; my["fontSize"] = 0x26, my["fill"] = "#FFF5D6", my["fontFamily"] = "shousha", my["fontWeight"] = 0x1f4, my["letterSpacing"] = 1.5; const mU = new PIXI["Text"](mG, my); return mU["anchor"]["set"](0.5, 0x0), mU["position"]["set"](m4 * 0.5, m5 * 0.06), mU; }, m7 = mG => { const wf = wk, my = Uc(mG); return my["anchor"]["set"](0.5), my["scale"]["set"](m3), my["pivot"]["set"](my["texture"][wf(0x1e7, "P9FJ")] / 0x2, my["texture"]["height"] / 0x2), my["position"]["set"](m4 * 0.68, m5 * 0.38), my; }, m8 = mG => { const my = {}; my["fontSize"] = 0x1e, my["fill"] = "#8E4427", my["fontFamily"] = "shousha", my["fontWeight"] = 0x1f4, my["letterSpacing"] = 1.5; const mU = new PIXI["Text"]("总胜率：" + Math["floor"](mG) + "%", my); return mU["anchor"]["set"](0.5), mU["position"]["set"](m4 * 0.5, m5 * 0.423), mU; }, m9 = (mG, my = m5 * 0.5) => { const mU = lifecycle.container(); mU["x"] = 0x0, mU["y"] = my; const mk = m5 * 0.09; return mG["forEach"]((mf, mY) => { const wY = rzshU, mm = {}; mm["fontSize"] = 0x1a, mm["fill"] = wY(0x2dc, "sxFt"), mm["fontFamily"] = "shousha"; const mb = new PIXI["Text"](mf["label"] + "胜率", mm); mb["x"] = m4 * 0.09, mb["y"] = mk * mY; const mK = {}; mK["fontSize"] = 0x1a, mK["fill"] = "#524C3E", mK["fontFamily"] = "shousha"; const mw = new PIXI["Text"](mf["wp"] + "%", mK); mw["x"] = m4 * 0.91 - mw["width"], mw["y"] = mk * mY, mU["addChild"](mb, mw); }), mU; };
                switch (m0) {
                    case 0x0: {
                        m2["addChild"](m6("排位赛"));
                        const mG = lib["config"][wU(0x289)] ? Uv-- : Uv, [my, mU] = U(mG);
                        let mk;
                        if (mG < 0x7)
                            mk = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_grade_qingtong"]);
                        else {
                            if (mG < 0x13)
                                mk = new PIXI[(wk(0x147, "f@0["))](ym["resources"]["paiweiui"]["textures"]["jj_grade_baiyin"]);
                            else {
                                if (mG < 0x2c)
                                    mk = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_grade_huangjin"]);
                                else {
                                    if (mG < 0x45)
                                        mk = new PIXI["Sprite"](ym[wk(0x2fe, "Z6A)")]["paiweiui"]["textures"][wU(0x21a)]);
                                    else
                                        mG < 0x63 ? mk = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"][wU(0x1a3)]) : (mk = new PIXI["AnimatedSprite"]["fromFrames"](ym[wU(0x2bb)]["paiweiui"]["data"]["animations"]["ttrank"]), mk["animationSpeed"] = 0.3, mk["play"]());
                                }
                            }
                        }
                        mk["anchor"]["set"](0.5), mk["pivot"]["set"](mk["texture"]["width"] / 0x2, mk["texture"]["height"] / 0x2), mk["scale"]["set"](mG < 0x63 ? 0.6 : 0.552), mk["position"]["set"](m4 * 0.76, m5 * 0.45);
                        if (mG >= 0x63)
                            mk["y"] -= 0x14 * G8;
                        const mf = {};
                        mf["fontSize"] = 0x22, mf["fill"] = "#8E4427", mf["fontFamily"] = wk(0x238, "vV5]"), mf["fontWeight"] = 0x1f4, mf["letterSpacing"] = 1.5;
                        const mY = new PIXI["Text"](my, mf);
                        mY["anchor"]["set"](0.5, 0x0), mY["position"]["set"](m4 * 0.5, m5 * 0.398);
                        const mm = lifecycle.container();
                        mm["scale"]["set"](0.69), mm["position"]["set"](m4 * 0.4, m5 * 0.36);
                        if (mG >= 0x63) {
                            const mw = new PIXI["Sprite"](ym["resources"]["paiweiui"][wk(0x18b, "v*9j")]["jj_star_on"]);
                            mw["anchor"]["set"](0x0, 0.5), mw["scale"]["set"](0.69);
                            const mc = {};
                            mc["fontSize"] = 0x24, mc["fill"] = wU(0x2cf), mc["fontFamily"] = wk(0x189, "xQ$a"), mc["fontWeight"] = 0x1f4, mc["letterSpacing"] = 0x0;
                            const md = new PIXI["Text"](lib["config"]["tianti_0星"] ? "x 0" : "x " + mU, mc);
                            md["x"] = mw["width"], mm["x"] -= mw["width"] * 0.5 * 0.69, mm["addChild"](mw, md);
                        }
                        else
                            for (let mp = 0x0; mp < mU; mp++) {
                                const mr = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_star_on"]);
                                mr["anchor"]["set"](0x0, 0x0), mr["scale"]["set"](0.69), mr["x"] = mr["width"] * mp;
                                if (mp > 0x0)
                                    mm["x"] -= mr["width"] * 0.5 * 0.69;
                                mm["addChild"](mr);
                            }
                        m2["addChild"](mk, mY, mm);
                        const mb = [], mK = {};
                        mK["label"] = "", mK["wp"] = UE;
                        if (kU)
                            mb["push"](mK);
                        m2["addChild"](m9(mb, m5 * 0.5));
                        break;
                    }
                    case 0x1: {
                        m2["addChild"](m6(wU(rzshMb.f)), m7("businesscard_sfc"), m8(UV));
                        const mM = {};
                        mM["label"] = "主公", mM["wp"] = UF, mM["played"] = k9[0x1];
                        const mu = {};
                        mu["label"] = "忠臣", mu["wp"] = UC, mu["played"] = k9[0x2];
                        const mt = {};
                        mt["label"] = "反贼", mt["wp"] = Ux, mt["played"] = k9[0x3];
                        const mW = {};
                        mW["label"] = "内奸", mW["wp"] = k0, mW["played"] = k9[0x4];
                        const me = [mM, mu, mt, mW]["filter"](mA => mA["played"]);
                        m2["addChild"](m9(me));
                        break;
                    }
                    case 0x2: {
                        m2["addChild"](m6("国战"), m7("businesscard_gz"), m8(Ul));
                        const mA = {};
                        mA[wU(0x171)] = "魏国", mA["wp"] = k3, mA["played"] = ky[0x1];
                        const ma = {};
                        ma["label"] = "蜀国", ma["wp"] = k4, ma["played"] = ky[0x2];
                        const mo = {};
                        mo["label"] = "吴国", mo["wp"] = k5, mo[wk(0x16d, rzshMb.Y)] = ky[0x3];
                        const mj = {};
                        mj["label"] = "群雄", mj["wp"] = k6, mj["played"] = ky[0x4];
                        const mD = {};
                        mD["label"] = "晋国", mD["wp"] = k7, mD[wU(0x1d7)] = ky[0x5];
                        const mJ = {};
                        mJ["label"] = "野心家", mJ["wp"] = k8, mJ["played"] = ky[0x6];
                        const mI = [mA, ma, mo, mj, mD, mJ]["filter"](mi => mi["played"]);
                        m2["addChild"](m9(mI));
                        break;
                    }
                    case 0x3: {
                        m2["addChild"](m6("斗地主"), m7("businesscard_ddz"), m8(UP));
                        const mi = {};
                        mi["label"] = "地主", mi["wp"] = k1, mi["played"] = kG[0x1];
                        const mT = {};
                        mT["label"] = "农民", mT["wp"] = k2, mT["played"] = kG[0x2];
                        const mg = [mi, mT]["filter"](mB => mB["played"]);
                        m2["addChild"](m9(mg));
                        break;
                    }
                }
            }
            const fK = Uc("businesscard_mask");
            GF(fK), fK["x"] = i[wk(0x30d, "@0B1")]["width"] - fK["width"];
            const fw = new PIXI["Sprite"](yH["resources"]["personwarbg2"]["texture"]), fc = Uo["x"] + Uo["width"] * 0.2, fd = 0.09 * i["screen"]["height"], fp = i["screen"]["width"] - 0x6, fr = i["screen"]["height"] - 0x6;
            fw["anchor"]["set"](0x0, 0x0), fw["x"] = fc, fw["y"] = fd, fw["width"] = fp - fc, fw["height"] = fr - fd;
            const fM = lifecycle.container();
            fM["name"] = "zjzj_page1", fM[wk(rzshMb.m, "PYEN")](fm, fK);
            const fu = lifecycle.container();
            fu["name"] = "zjzj_page2";
            const ft = lifecycle.container(), fW = Up("personTaiXu_bg4");
            fW["anchor"]["set"](0x0, 0x0), fW["y"] = fd, fW["height"] = fr - fd, fW["width"] = fW["texture"]["width"] * (fW["height"] / fW["texture"]["height"]), fW["x"] = fc, ft["addChild"](fW), fu["addChild"](ft);
            const fe = lifecycle.container();
            ft["addChild"](fe);
            const fA = fc + fW["width"] + 0x8, fa = fp - fA, fo = 19.8, fj = fd + fo, fD = fr - fd - fo * 0x2, fJ = {};
            fJ["boxWidth"] = fa, fJ["boxHeight"] = fD, fJ["passiveWheel"] = ![], fJ["scrollbarBackgroundAlpha"] = 0x0, fJ[wU(0x2e1)] = 0x0, fJ["stopPropagation"] = !![], fJ["divWheel"] = i["view"], fJ["interaction"] = i["renderer"]["plugins"]["interaction"];
            const fI = new PIXI["Scrollbox"](fJ);
            fI["position"][wk(0x162, "FbmE")](fA, fj), fu["addChild"](fI);
            function fi() { const mB = new PIXI["Graphics"](); mB["name"] = "hist_loading_mask", mB["beginFill"](0x0, 0.45), mB["drawRect"](0x0, 0x0, i["screen"]["width"], i["screen"]["height"]), mB["endFill"](), mB["interactive"] = !![]; const mq = {}; mq["fontSize"] = 0x24, mq["fill"] = "#FFFFFF", mq["fontFamily"] = "shousha", mq["fontWeight"] = 0x1f4; const mn = new PIXI["Text"]("加载中…", mq); return mn["anchor"]["set"](0.5), mn["position"]["set"](i["screen"]["width"] / 0x2, i["screen"]["height"] / 0x2), mB["addChild"](mn), i["stage"]["addChild"](mB), mB; }
            function fT() {
                const mB = i["stage"]["getChildByName"]("hist_loading_mask");
                if (mB)
                    i["stage"]["removeChild"](mB);
            }
            function fg(mB) { fI["content"]["removeChildren"](); const mq = {}; mq["fontSize"] = 0x1c, mq["fill"] = "#FFFFFF", mq["fontFamily"] = "shousha", mq["fontWeight"] = 0x1f4; const mn = new PIXI["Text"](mB, mq); mn["anchor"]["set"](0.5), mn["position"]["set"]((fp - fc) / 0x2, fD / 0x2), fI["content"]["addChild"](mn), fI["update"](); }
            function fB(mB, mq) {
                const wb = wk, wm = wU;
                fe["removeChildren"]();
                const mn = fW["x"], mZ = fW["width"], mz = fW["height"], mN = fW["y"], mR = new PIXI["Text"](mB, { "fontSize": Math["round"](mz * 0.055), "fill": "#FFF5D6", "fontFamily": "shousha", "fontWeight": 0x1f4, "letterSpacing": 1.5 });
                mR["anchor"]["set"](0.5, 0.5), mR["position"]["set"](mn + mZ * 0.5, mN + mz * 0.0738), fe["addChild"](mR);
                if (!mq) {
                    const b0 = {};
                    b0["fontSize"] = 0x1a, b0["fill"] = "#CFBA9C", b0["fontFamily"] = "shousha", b0["fontWeight"] = 0x190;
                    const b1 = new PIXI["Text"]("暂无数据", b0);
                    b1["anchor"]["set"](0.5), b1["position"]["set"](mn + mZ * 0.5, mN + mz * 0.5), fe["addChild"](b1);
                    return;
                }
                const mS = mq["xxingnum"] || 0x0, [mX, mH] = U(mS);
                let mO;
                if (mS < 0x7)
                    mO = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_grade_qingtong"]);
                else {
                    if (mS < 0x13)
                        mO = new PIXI[(wm(0x1a6))](ym["resources"]["paiweiui"]["textures"]["jj_grade_baiyin"]);
                    else {
                        if (mS < 0x2c)
                            mO = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_grade_huangjin"]);
                        else {
                            if (mS < 0x45)
                                mO = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_grade_feicui"]);
                            else {
                                if (mS < 0x63)
                                    mO = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_grade_dashi"]);
                                else
                                    mO = new PIXI["AnimatedSprite"]["fromFrames"](ym["resources"]["paiweiui"]["data"]["animations"]["ttrank"]), mO["animationSpeed"] = 0.3, mO["play"]();
                            }
                        }
                    }
                }
                mO["anchor"][wb(0x26f, ")]^q")](0.5), mO["pivot"]["set"](mO["texture"]["width"] / 0x2, mO["texture"]["height"] / 0x2);
                const mQ = mz * 0.2, mh = mQ / mO["texture"]["height"];
                mO["scale"]["set"](mh), mO["position"]["set"](mn + mZ * 0.65, mN + mz * (mS >= 0x63 ? 0.32 : 0.38)), fe["addChild"](mO);
                const mL = new PIXI["Text"](mX, { "fontSize": Math["round"](mz * 0.048), "fill": "#8E4427", "fontFamily": "shousha", "fontWeight": 0x1f4, "letterSpacing": 1.5 });
                mL["anchor"]["set"](0.5, 0x0), mL["position"]["set"](mn + mZ * 0.5, mN + mz * 0.307), fe["addChild"](mL);
                const ms = lifecycle.container();
                ms["scale"]["set"](0.69), ms["position"]["set"](mn + mZ * 0.4, mN + mz * (mS >= 0x63 ? 0.298 : 0.3));
                if (mS >= 0x63) {
                    const b2 = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_star_on"]);
                    b2[wb(0x1e4, "Y&Q6")]["set"](0x0, 0.5), b2["scale"]["set"](0.45);
                    const b3 = {};
                    b3["fontSize"] = 0x16, b3["fill"] = "#524C3E", b3["fontFamily"] = "shousha", b3["fontWeight"] = 0x1f4, b3["letterSpacing"] = 0x0;
                    const b4 = new PIXI["Text"]("x " + mH, b3);
                    b4["x"] = b2["width"], b4["anchor"]["set"](0x0, 0.5), ms["x"] -= b2["width"] * 0.5 * 0.45, ms["addChild"](b2, b4);
                }
                else
                    for (let b5 = 0x0; b5 < mH; b5++) {
                        const b6 = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["jj_star_on"]);
                        b6["anchor"][wm(0x1ca)](0x0, 0x0), b6["scale"]["set"](0.45), b6["x"] = b6["width"] * b5;
                        if (b5 > 0x0)
                            ms["x"] -= b6["width"] * 0.5 * 0.69;
                        ms["addChild"](b6);
                    }
                fe["addChild"](ms);
                const mv = mq["num"] || 0x0, mV = mq["win"] || 0x0, mP = mv === 0x0 ? "0%" : (Math["round"](mV / mv * 0x3e8) / 0xa)["toFixed"](0x1)["replace"](/\.0$/, "") + "%", ml = {};
                ml["label"] = "胜率", ml["val"] = mP;
                const mE = {};
                mE[wb(rzshM2.G, "SnMu")] = "总场次", mE["val"] = mv;
                const mF = {};
                mF["label"] = "最高连胜", mF["val"] = mq["top_win"] || 0x0;
                const mC = [ml, mE, mF], mx = mz * 0.09;
                mC["forEach"]((b7, b8) => { const b9 = {}; b9["fontSize"] = 0x1a, b9["fill"] = "#524C3E", b9["fontFamily"] = "shousha"; const bG = new PIXI["Text"](b7["label"], b9); bG["position"]["set"](mn + mZ * 0.09, mN + mz * 0.4 + mx * b8); const by = {}; by["fontSize"] = 0x1a, by["fill"] = "#524C3E", by["fontFamily"] = "shousha"; const bU = new PIXI["Text"](String(b7["val"]), by); bU["anchor"]["set"](0x1, 0x0), bU["position"]["set"](mn + mZ * 0.91, mN + mz * 0.4 + mx * b8), fe["addChild"](bG, bU); });
            }
            function fq(mB, mq) {
                fI["content"]["removeChildren"]();
                const mn = window["_rzsh_history"] || {}, mZ = Object["keys"](mB)["find"](mO => mB[mO]["name"] === mq), mz = Object["keys"](mB)["filter"](mO => mB[mO]["name"] !== mq)["sort"]((mO, mQ) => mB[mQ]["order"] - mB[mO]["order"]), mN = mZ ? [mZ, ...mz] : mz, mR = fa * 0.8, mS = mR / 0x2, mX = (fa - mR) / 0x2, mH = 0x8;
                mN["forEach"]((mO, mQ) => {
                    const mh = mB[mO], mL = mh["name"], ms = mL === mq, mv = (mS + mH) * mQ, mV = "https://raw.gitcode.com/Ryan_shiji/rzsh/raw/main/image/season/" + encodeURIComponent(mL) + ".png", mP = lifecycle.container();
                    mP["y"] = mv, mP["x"] = mX, mP["interactive"] = !![], mP["cursor"] = "pointer";
                    const ml = new PIXI["Graphics"]();
                    ml["beginFill"](0x1a1a1a, 0x1), ml["drawRect"](0x0, 0x0, mR, mS), ml["endFill"](), mP["addChild"](ml);
                    const mE = new PIXI["Text"]("加载中...", { "fontSize": Math["round"](mS * 0.12), "fill": "#AAAAAA", "fontFamily": "shousha" });
                    mE["anchor"]["set"](0.5, 0.5), mE["position"]["set"](mR * 0.5, mS * 0.5), mP["addChild"](mE);
                    const mF = mC => { PIXI["Loader"]["shared"]["resources"][mV] ? mC() : PIXI["Loader"]["shared"]["add"](mV, mV)["load"](mC); };
                    mF(() => {
                        const ww = rzshU, wK = rzshy;
                        if (PIXI["Loader"]["shared"][wK(0x2bb)][mV] && PIXI["Loader"]["shared"]["resources"][mV]["texture"]) {
                            const mC = new PIXI["Sprite"](PIXI["Loader"]["shared"]["resources"][mV]["texture"]);
                            mC["width"] = mR, mC["height"] = mS, mP["addChildAt"](mC, 0x0), ml["visible"] = ![], mE["visible"] = ![];
                            const mx = mS * 0.2, b0 = new PIXI["Graphics"]();
                            b0["beginFill"](0x0, 0.55), b0["drawRect"](0x0, mS - mx, mR, mx), b0["endFill"](), mP["addChild"](b0);
                            const b1 = Math["round"](mx * 0.38), b2 = mS - mx * 0.5, b3 = {};
                            b3["fontSize"] = b1, b3["fill"] = "#FFFFFF", b3["fontFamily"] = "shousha", b3["fontWeight"] = 0x190;
                            const b4 = new PIXI["Text"]("S" + mh["order"] + "  " + mL, b3);
                            b4[ww(0x2d7, "vV5]")]["set"](0x0, 0.5), b4["position"]["set"](mR * 0.04, b2), mP["addChild"](b4);
                            const b5 = {};
                            b5["fontSize"] = b1, b5["fill"] = "#FFFFFF", b5["fontFamily"] = "shousha", b5["fontWeight"] = 0x190;
                            const b6 = new PIXI["Text"](mh["time"], b5);
                            b6["anchor"]["set"](0x1, 0.5), b6["position"]["set"](mR * 0.96, b2), mP["addChild"](b6), fI["update"]();
                        }
                    }), mP["on"]("pointerup", () => { const mC = ms ? window["_rzsh_current"] || null : mn[mL] || null; fB(mL, mC); }), fI["content"]["addChild"](mP);
                }), mN["length"] === 0x0 && fg("暂无历史赛季"), fI["update"]();
            }
            fu["_histLoaded"] = ![], fu["_loadHistory"] = async function () {
                const wc = wk;
                if (fu["_histLoaded"]) {
                    fe["removeChildren"]();
                    const mq = fu["_histAllSeasons"], mn = fu["_histCurName"];
                    fB(mn, window["_rzsh_current"] || null);
                    return;
                }
                const mB = fi();
                try {
                    const mZ = await fetch("https://raw.gitcode.com/Ryan_shiji/rzsh/raw/main/season.json");
                    if (!mZ["ok"])
                        throw new Error("http_error");
                    const mz = await mZ["json"]();
                    fT();
                    const mN = Object["keys"](mz);
                    let mR = -Infinity, mS = mN[0x0];
                    mN["forEach"](mH => { mz[mH]["order"] > mR && (mR = mz[mH]["order"], mS = mH); });
                    const mX = mz[mS]["name"];
                    fe["removeChildren"](), fq(mz, mX), fu["_histLoaded"] = !![], fu["_histAllSeasons"] = mz, fu["_histCurName"] = mX, fB(mX, window["_rzsh_current"] || null);
                }
                catch (mH) {
                    fT();
                    const mO = mH instanceof TypeError || mH["message"] === "Failed to fetch";
                    fg(mO ? wc(0x1db, "hs^2") : "连接失败");
                }
            };
            const fn = Ur("personWarWork_anniu2");
            fn["name"] = "zjzj_page1_btn", fn["anchor"]["set"](0.5), fn["scale"]["set"](0.69), fn["position"]["set"](0.2275 * i["screen"]["width"], 0.07 * i["screen"]["height"]);
            const fZ = {};
            fZ[wU(0x1ba)] = 0x1e, fZ["fill"] = "#CFBA9C", fZ["fontFamily"] = "shousha", fZ["fontWeight"] = 0x12c;
            const fz = new PIXI["Text"]("当前战绩", fZ);
            fz["anchor"]["set"](0.5), fz["y"] = -0.025 * (fn["width"] / fn["scale"]["x"]), fn["addChild"](fz);
            const fN = Ur("personWarWork_anniu1");
            fN["name"] = "zjzj_page2_btn", fN["anchor"]["set"](0.5), fN["scale"]["set"](0.69), fN["position"]["set"](0.23 * i["screen"]["width"] + fN["width"], 0.07 * i["screen"]["height"]);
            const fR = {};
            fR["fontSize"] = 0x1e, fR["fill"] = "#CFBA9C", fR["fontFamily"] = "shousha", fR["fontWeight"] = 0x12c;
            const fS = new PIXI["Text"]("历史段位", fR);
            fS["anchor"]["set"](0.5), fS["y"] = -0.025 * (fN["width"] / fN["scale"]["x"]), fN["addChild"](fS), Ue["addChild"](fn, fN), Ue["addChild"](fw), Ue["addChild"](fM);
            const fX = Ur("personWarWork_anniu2");
            fX["name"] = "warwork_page1_btn", fX["anchor"]["set"](0.5), fX["scale"][wU(0x1ca)](0.69), fX["position"]["set"](0.2275 * i["screen"]["width"], 0.07 * i["screen"]["height"]);
            const fH = Ur("personWarWork_anniu1");
            fH["name"] = "warwork_page2_btn", fH[wU(0x173)][wk(0x249, "EZZT")](0.5), fH["scale"]["set"](0.69), fH[wk(0x2f1, rzshMb.b)]["set"](0.23 * i["screen"]["width"] + fH["width"], 0.07 * i["screen"]["height"]);
            const fO = Ur("personWarWork_anniu1");
            fO["name"] = "warwork_page3_btn", fO["anchor"]["set"](0.5), fO["scale"]["set"](0.69), fO["position"]["set"](0.2325 * i["screen"]["width"] + 0x2 * fO["width"], 0.07 * i["screen"]["height"]);
            const fQ = {};
            fQ["fontSize"] = 0x1e, fQ["fill"] = wk(0x222, "4(Dr"), fQ["fontFamily"] = "shousha", fQ["fontWeight"] = 0x12c;
            const fh = new PIXI["Text"]("总览", fQ);
            fh["anchor"]["set"](0.5), fh["y"] = -0.025 * (fX["width"] / fX["scale"]["x"]), fX["addChild"](fh);
            const fL = {};
            fL["fontSize"] = 0x1e, fL["fill"] = "#CFBA9C", fL["fontFamily"] = "shousha", fL["fontWeight"] = 0x12c;
            const fs = new PIXI["Text"]("武将", fL);
            fs[wU(0x173)]["set"](0.5), fs["y"] = -0.025 * (fH["width"] / fH["scale"]["x"]), fH["addChild"](fs);
            const fv = {};
            fv["fontSize"] = 0x1e, fv["fill"] = "#CFBA9C", fv[wk(0x22a, "5r0j")] = "shousha", fv["fontWeight"] = 0x12c;
            const fV = new PIXI["Text"]("经典", fv);
            fV["anchor"]["set"](0.5), fV["y"] = -0.025 * (fO["width"] / fO["scale"]["x"]), fO["addChild"](fV), UA["addChild"](fX, fH, fO);
            const fP = new PIXI["Sprite"](yH["resources"]["personwarbg2"]["texture"]);
            fP["anchor"]["set"](0x0, 0x0), fP["x"] = fc, fP["y"] = fd, fP["width"] = fp - fc, fP["height"] = fr - fd;
            const fl = lifecycle.container();
            fl["name"] = "warwork_page1";
            const fE = lifecycle.container();
            fE["name"] = "warwork_page2";
            const fF = lifecycle.container();
            fF["name"] = "warwork_page3", UA["addChild"](fP);
            const fC = Up(wk(0x213, "vV5]"));
            fC["anchor"]["set"](0x0, 0x0), fC["y"] = fd, fC["height"] = fr - fd, fC["width"] = fC["texture"]["width"] * (fC["height"] / fC["texture"]["height"]), fC["x"] = fc, fl["addChild"](fC);
            for (let mB = 0x0; mB < 0x8; mB++) {
                const mq = Ur("personWarWork_add");
                mq[wk(0x1ec, "tF)Q")]["set"](0.5), mq["scale"]["set"](0.69), mq["position"]["set"](i["screen"]["width"] * 0.605, i["screen"]["height"] * 0.25), mq["y"] += parseInt(mB / 0x2) * i["screen"]["height"] * 0.035 + parseInt(mB / 0x2) * mq["height"];
                if (mB % 0x2 != 0x0)
                    mq["x"] += i["screen"]["width"] * 0.015 + mq["width"];
                fl["addChild"](mq);
            }
            const fx = Ur("personWarWork_anniu_2");
            fx["name"] = "warwork_sort_btn1", fx["anchor"]["set"](0.5), fx["scale"]["set"](0.69), fx["position"]["set"](0.535 * i[wk(0x310, "f@0[")]["width"], 0.16 * i["screen"]["height"]);
            const Y0 = {};
            Y0["fontSize"] = 0x12, Y0["fill"] = wU(0x218), Y0["fontFamily"] = "shousha", Y0["fontWeight"] = 0x1f4, Y0["letterSpacing"] = -1.5;
            const Y1 = new PIXI["Text"]("全部", Y0);
            Y1["position"]["set"](0.535 * i["screen"]["width"] + fx["width"], 0.16 * i["screen"]["height"] - fx["height"]);
            const Y2 = Ur("personWarWork_anniu_1");
            Y2["name"] = "warwork_sort_btn2", Y2["anchor"]["set"](0.5), Y2["scale"][wU(0x1ca)](0.69), Y2["position"]["set"](0.595 * i["screen"]["width"], 0.16 * i["screen"]["height"]);
            const Y3 = {};
            Y3["fontSize"] = 0x12, Y3["fill"] = "#5E422A", Y3["fontFamily"] = "shousha", Y3["fontWeight"] = 0x1f4, Y3["letterSpacing"] = -1.5;
            const Y4 = new PIXI["Text"]("已拥有", Y3);
            Y4["position"]["set"](0.59 * i["screen"]["width"] + Y2["width"], 0.16 * i["screen"]["height"] - Y2["height"]);
            const Y5 = Ur(wU(0x20a));
            Y5["name"] = "warwork_sort_btn3", Y5["anchor"]["set"](0.5), Y5["scale"]["set"](0.69), Y5["position"]["set"](0.655 * i["screen"]["width"], 0.16 * i["screen"]["height"]);
            const Y6 = {};
            Y6["fontSize"] = 0x12, Y6["fill"] = "#5E422A", Y6["fontFamily"] = "shousha", Y6["fontWeight"] = 0x1f4, Y6["letterSpacing"] = -1.5;
            const Y7 = new PIXI["Text"]("未拥有", Y6);
            Y7["position"]["set"](0.65 * i["screen"]["width"] + Y5["width"], 0.16 * i["screen"]["height"] - Y5["height"]);
            const Y8 = Ur("personWarWork_input");
            Y8["anchor"]["set"](0.5), Y8["scale"]["set"](0.69), Y8["position"]["set"](0.7775 * i["screen"]["width"], 0.16 * i["screen"]["height"]);
            const Y9 = Ur("personWarWork_found");
            Y9["anchor"]["set"](0.5), Y9["scale"]["set"](0.69), Y9["position"]["set"](0.825 * i["screen"][wU(0x2b1)], 0.16 * i["screen"]["height"]), fE["addChild"](fx, Y1, Y2, Y4, Y5, Y7, Y8, Y9);
            const YG = Ur("personWarWork_anniu_2");
            YG["name"] = "warwork_sort_btn4", YG["anchor"]["set"](0.5), YG["scale"]["set"](0.69), YG["position"]["set"](0.535 * i["screen"]["width"], 0.16 * i["screen"]["height"]);
            const Yy = {};
            Yy["fontSize"] = 0x12, Yy["fill"] = wk(0x1f5, "f)#4"), Yy["fontFamily"] = "shousha", Yy["fontWeight"] = 0x1f4, Yy["letterSpacing"] = -1.5;
            const YU = new PIXI["Text"]("全部", Yy);
            YU[wk(0x1bd, "0ka9")]["set"](0.535 * i["screen"]["width"] + YG["width"], 0.16 * i["screen"]["height"] - YG["height"]);
            const Yk = Ur("personWarWork_anniu_1");
            Yk["name"] = "warwork_sort_btn5", Yk["anchor"]["set"](0.5), Yk["scale"]["set"](0.69), Yk["position"]["set"](0.595 * i["screen"]["width"], 0.16 * i["screen"]["height"]);
            const Yf = {};
            Yf["fontSize"] = 0x12, Yf["fill"] = "#5E422A", Yf["fontFamily"] = "shousha", Yf["fontWeight"] = 0x1f4, Yf["letterSpacing"] = -1.5;
            const YY = new PIXI["Text"]("已拥有", Yf);
            YY["position"]["set"](0.59 * i["screen"]["width"] + Yk["width"], 0.16 * i["screen"]["height"] - Yk["height"]);
            const Ym = Ur("personWarWork_anniu_1");
            Ym["name"] = "warwork_sort_btn6", Ym["anchor"]["set"](0.5), Ym["scale"]["set"](0.69), Ym["position"]["set"](0.655 * i["screen"]["width"], 0.16 * i["screen"]["height"]);
            const Yb = {};
            Yb[wU(rzshMb.K)] = 0x12, Yb["fill"] = "#5E422A", Yb[wU(0x246)] = "shousha", Yb["fontWeight"] = 0x1f4, Yb["letterSpacing"] = -1.5;
            const YK = new PIXI["Text"]("未拥有", Yb);
            YK["position"]["set"](0.65 * i["screen"]["width"] + Ym["width"], 0.16 * i["screen"]["height"] - Ym["height"]);
            const Yw = Ur("personWarWork_input");
            Yw["anchor"]["set"](0.5), Yw["scale"]["set"](0.69), Yw["position"]["set"](0.7775 * i["screen"]["width"], 0.16 * i[wU(0x1f0)]["height"]);
            const Yc = Ur("personWarWork_found");
            Yc["anchor"]["set"](0.5), Yc[wU(0x1f9)]["set"](0.69), Yc["position"]["set"](0.825 * i["screen"]["width"], 0.16 * i["screen"]["height"]), fF["addChild"](YG, YU, Yk, YY, Ym, YK, Yw, Yc);
            const Yd = Ur("personWarWork_anniu2");
            Yd["name"] = "taixu_page1_btn", Yd["anchor"]["set"](0.5), Yd["scale"]["set"](0.69), Yd["position"]["set"](0.2275 * i["screen"]["width"], 0.07 * i["screen"]["height"]);
            const Yp = Ur(wU(0x312));
            Yp[wU(0x2d8)] = "taixu_page2_btn", Yp["anchor"]["set"](0.5), Yp["scale"]["set"](0.69), Yp["position"]["set"](0.23 * i["screen"]["width"] + Yp["width"], 0.07 * i[wk(0x165, "xQ$a")]["height"]);
            const Yr = {};
            Yr["fontSize"] = 0x1e, Yr["fill"] = "#CFBA9C", Yr["fontFamily"] = "shousha", Yr["fontWeight"] = 0x12c;
            const YM = new PIXI["Text"]("总览", Yr);
            YM[wU(0x173)]["set"](0.5), YM["y"] = -0.025 * (Yd["width"] / Yd["scale"]["x"]), Yd["addChild"](YM);
            const Yu = {};
            Yu["fontSize"] = 0x1e, Yu["fill"] = "#CFBA9C", Yu["fontFamily"] = "shousha", Yu["fontWeight"] = 0x12c;
            const Yt = new PIXI["Text"]("霸王征程", Yu);
            Yt["anchor"]["set"](0.5), Yt["y"] = -0.025 * (Yp["width"] / Yp["scale"]["x"]), Yp["addChild"](Yt), Ua["addChild"](Yd, Yp);
            const YW = lifecycle.container();
            YW["name"] = "taixu_page1";
            const Ye = lifecycle.container();
            Ye["name"] = "taixu_page2";
            const YA = new PIXI[(wk(0x2b5, "sxFt"))](yH["resources"]["personwarbg2"]["texture"]);
            YA["anchor"]["set"](0x0, 0x0), YA["x"] = fc, YA["y"] = fd, YA["width"] = fp - fc, YA["height"] = fr - fd;
            const Ya = Up("personTaiXu_bg4");
            Ya["anchor"]["set"](0x0, 0x0), Ya["y"] = fd, Ya["height"] = fr - fd, Ya["width"] = Ya["texture"]["width"] * (Ya["height"] / Ya["texture"]["height"]), Ya["x"] = fc, YW["addChild"](YA, Ya);
            const Yo = new PIXI["Sprite"](yH["resources"]["personwarbg3"]["texture"]);
            Yo[wk(0x1d5, "og)$")]["set"](0.5), Yo["scale"]["set"](0.69), Yo["position"]["set"](0.55 * i["screen"]["width"], 0.535 * i["screen"]["height"]), GF(Yo), Ye["addChild"](Yo);
            const Yj = {};
            Yj["fontSize"] = 0x26, Yj["fill"] = "#FFF5D6", Yj["fontFamily"] = "shousha", Yj["fontWeight"] = 0x1f4, Yj["letterSpacing"] = 1.5;
            const YD = new PIXI["Text"](Yj);
            YD["position"]["set"](0.575 * Ya["width"], 0.08 * Ya["height"]);
            function YJ(mn) {
                const wr = wU, wp = wk;
                if (window["currentSprite"] != mn["target"])
                    return;
                window["currentSprite"] = null;
                switch (mn["target"]["name"]) {
                    case "page1btn":
                        UD["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_select"], UJ["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UI["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], Ui["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UR["alpha"] = 0x1, UO["alpha"] = 0.5, Uh["alpha"] = 0.5, Us["alpha"] = 0.5, [UD, UJ, UI, Ui]["forEach"](mZ => { mZ["height"] = mZ["texture"]["height"] * (Un / mZ["texture"]["width"]), mZ["width"] = Un; });
                        try {
                            yQ["removeChild"](UW, Ue, UA, Ua);
                        }
                        catch (mZ) { }
                        ;
                        yQ["addChild"](UW), yQ["setChildIndex"](UW, 0x0);
                        break;
                    case "page2btn":
                        UD["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UJ["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_select"], UI["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], Ui["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UR["alpha"] = 0.5, UO["alpha"] = 0x1, Uh["alpha"] = 0.5, Us["alpha"] = 0.5, [UD, UJ, UI, Ui]["forEach"](mz => { const wd = rzshy; mz["height"] = mz["texture"]["height"] * (Un / mz["texture"][wd(0x2b1)]), mz["width"] = Un; });
                        try {
                            yQ["removeChild"](UW, Ue, UA, Ua);
                        }
                        catch (mz) { }
                        ;
                        yQ[wp(0x2e4, rzshMf.G)](Ue), yQ["setChildIndex"](Ue, 0x0);
                        break;
                    case "page3btn":
                        UD[wp(0x311, "Y&Q6")] = yH["resources"]["ui_person"]["textures"][wp(0x209, "vV5]")], UJ["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UI["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_select"], Ui["texture"] = yH["resources"][wp(0x26c, "SdeW")]["textures"]["businesscard_tap_empty"], UR["alpha"] = 0.5, UO["alpha"] = 0.5, Uh["alpha"] = 0x1, Us["alpha"] = 0.5, [UD, UJ, UI, Ui]["forEach"](mN => { mN["height"] = mN["texture"]["height"] * (Un / mN["texture"]["width"]), mN["width"] = Un; });
                        try {
                            yQ[wp(0x2c5, "4(Dr")](UW, Ue, UA, Ua);
                        }
                        catch (mN) { }
                        ;
                        yQ["addChild"](UA), yQ["setChildIndex"](UA, 0x0);
                        UA["getChildByName"]("warwork_page2") != null && UA["removeChild"](fE);
                        UA["getChildByName"]("warwork_page3") != null && UA["removeChild"](fF);
                        UA["getChildByName"]("warwork_page1") == null && (fX["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu2"], fH[wp(0x314, "FbmE")] = yH["resources"][wp(0x2ba, "5r0j")]["textures"]["personWarWork_anniu1"], fO["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"], UA["addChild"](fl));
                        break;
                    case "page4btn":
                        UD["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UJ["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UI["texture"] = yH["resources"][wr(0x256)]["textures"]["businesscard_tap_empty"], Ui["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_select"], UR["alpha"] = 0.5, UO["alpha"] = 0.5, Uh["alpha"] = 0.5, Us["alpha"] = 0x1, [UD, UJ, UI, Ui]["forEach"](mR => { mR["height"] = mR["texture"]["height"] * (Un / mR["texture"]["width"]), mR["width"] = Un; });
                        try {
                            yQ["removeChild"](UW, Ue, UA, Ua);
                        }
                        catch (mR) { }
                        ;
                        yQ["addChild"](Ua), yQ["setChildIndex"](Ua, 0x0);
                        Ua["getChildByName"]("taixu_page2") != null && Ua["removeChild"](Ye);
                        Ua["getChildByName"]("taixu_page1") == null && (Yd["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu2"], Yp["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"], Ua["addChild"](YW));
                        break;
                    case "zjzj_page1_btn":
                        fn["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu2"], fN["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"];
                        try {
                            Ue["removeChild"](fM, fu);
                        }
                        catch (mS) { }
                        Ue["addChild"](fM);
                        break;
                    case "zjzj_page2_btn":
                        fn["texture"] = yH["resources"]["ui_persont"]["textures"][wp(0x21f, "PYEN")], fN["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu2"];
                        try {
                            Ue["removeChild"](fM, fu);
                        }
                        catch (mX) { }
                        Ue["addChild"](fu);
                        if (fu["_loadHistory"])
                            fu["_loadHistory"]();
                        break;
                    case "warwork_page1_btn":
                        fX["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu2"], fH["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"], fO["texture"] = yH["resources"]["ui_persont"]["textures"][wp(0x2ed, "!2E0")];
                        try {
                            UA["removeChild"](fl, fE, fF);
                        }
                        catch (mH) { }
                        ;
                        UA["addChild"](fl);
                        break;
                    case "warwork_page2_btn":
                        fX["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"], fH["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu2"], fO["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"];
                        try {
                            UA["removeChild"](fl, fE, fF);
                        }
                        catch (mO) { }
                        ;
                        UA["addChild"](fE);
                        break;
                    case "warwork_page3_btn":
                        fX["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"], fH["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"], fO["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu2"];
                        try {
                            UA["removeChild"](fl, fE, fF);
                        }
                        catch (mQ) { }
                        ;
                        UA["addChild"](fF);
                        break;
                    case "taixu_page1_btn":
                        Yd["texture"] = yH["resources"][wr(rzshMf.y)]["textures"]["personWarWork_anniu2"], Yp["texture"] = yH["resources"]["ui_persont"][wr(0x1b3)]["personWarWork_anniu1"];
                        try {
                            Ua["removeChild"](YW, Ye);
                        }
                        catch (mh) { }
                        ;
                        Ua["addChild"](YW);
                        break;
                    case "taixu_page2_btn":
                        Yd["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu1"], Yp["texture"] = yH[wp(0x1f7, "VwJt")]["ui_persont"]["textures"]["personWarWork_anniu2"];
                        try {
                            Ua["removeChild"](YW, Ye);
                        }
                        catch (mL) { }
                        ;
                        Ua["addChild"](Ye);
                        break;
                    case "warwork_sort_btn1":
                        fx[wr(0x23f)] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_2"], Y2["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"], Y5["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"];
                        break;
                    case "warwork_sort_btn2":
                        fx["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"], Y2["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_2"], Y5["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"];
                        break;
                    case "warwork_sort_btn3":
                        fx["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"], Y2["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"], Y5["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_2"];
                        break;
                    case "warwork_sort_btn4":
                        YG["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_2"], Yk["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"], Ym["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"];
                        break;
                    case "warwork_sort_btn5":
                        YG["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"], Yk["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_2"], Ym["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"];
                        break;
                    case "warwork_sort_btn6":
                        YG["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"], Yk["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_1"], Ym["texture"] = yH["resources"]["ui_persont"]["textures"]["personWarWork_anniu_2"];
                        break;
                    case "userbtn_setting":
                        kC["visible"] ? kC["visible"] = ![] : kC["visible"] = !![];
                        break;
                        break;
                    default: break;
                }
            }
            Uo["addChild"](UD, UJ, UI, Ui);
            const YI = new PIXI["Sprite"](yH["resources"]["ui_person"]["textures"]["lobbyui_back"]);
            YI["name"] = "wujiangback", GF(YI, !![]), YI["scale"]["set"](0.5), YI["x"] = i["screen"]["width"] - YI["width"] * YI["scale"]["x"], YI["y"] = 0x2b, yQ["on"]("added", () => { const wu = wk, wM = wU; G2["texture"] = yH["resources"]["shop_bg_3"]["texture"], G2[wM(0x2b1)] = i["screen"]["width"], G2["height"] = i[wM(0x1f0)]["height"], UD["texture"] = yH["resources"]["ui_person"]["textures"][wu(0x179, "f)#4")], UJ["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], UI["texture"] = yH["resources"]["ui_person"]["textures"]["businesscard_tap_empty"], Ui["texture"] = yH["resources"]["ui_person"][wM(rzshMY.G)]["businesscard_tap_empty"], UR["alpha"] = 0x1, UO["alpha"] = 0.5, Uh["alpha"] = 0.5, Us["alpha"] = 0.5, yQ["addChild"](UW, Uo, YI), yQ["setChildIndex"](UW, 0x0), yQ["setChildIndex"](Uo, 0x2), yQ["setChildIndex"](YI, 0x2); }), yQ["on"]("removed", () => {
                if (G6 != null)
                    cancelAnimationFrame(G6);
                while (yQ["children"]["length"] > 0x0) {
                    yQ["removeChildAt"](0x0);
                }
                G2["texture"] = GG["resources"]["uiBG"]["texture"];
            });
        }
        const yL = lifecycle.loader();
        yL["add"]("shop_bg_2", lib["assetURL"] + "extension/如真似幻/images/bg.jpg"), yL["add"]("ui_lottery", lib["assetURL"] + "extension/如真似幻/images/anim_pick.json"), yL["add"]("yinmenhuan", lib["assetURL"] + "extension/如真似幻/spine/lottery/yinmenhuan.skel"), yL["add"]("jinmenhuan", lib["assetURL"] + "extension/如真似幻/spine/lottery/jinmenhuan.skel"), yL["add"]("kaimenskel", lib["assetURL"] + "extension/如真似幻/spine/lottery/kaimen.skel"), yL["add"]("menfengskel", lib["assetURL"] + "extension/如真似幻/spine/lottery/menfeng.skel"), yL["add"]("kaimenguangskel", lib["assetURL"] + "extension/如真似幻/spine/lottery/skeleton.skel"), yL["add"]("pifu_zuoskel", lib["assetURL"] + "extension/如真似幻/spine/lottery/pifu_zuo.skel"), yL["add"]("pifu_youskel", lib["assetURL"] + "extension/如真似幻/spine/lottery/pifu_you.skel");
        let ys = lifecycle.container();
        ys["width"] = i["screen"]["width"], ys["height"] = i["screen"]["height"];
        let yv = new PIXI[(K0(0x1f2))]();
        yv["name"] = "lotterypage1", yv["width"] = i["screen"]["width"], yv["height"] = i[K0(0x1f0)]["height"];
        let yV = lifecycle.container();
        yV["name"] = "lotterypage2", yV["width"] = i["screen"]["width"], yV["height"] = i["screen"]["height"];
        let yP = lifecycle.container();
        yP["name"] = "lotterypage3", yP["width"] = i["screen"]["width"], yP["height"] = i["screen"]["height"];
        let yl = lifecycle.container();
        yl["width"] = i["screen"]["width"], yl["height"] = i["screen"]["height"] * 0.2;
        let yE = new PIXI[(K1(0x178, "hZEd"))]();
        yE["width"] = i["screen"]["width"], yE["height"] = i["screen"]["height"] * 0.1, yE["y"] = i["screen"]["height"] * 0.9;
        let yF = new PIXI[(K0(0x1f2))]();
        yF["width"] = i["screen"]["width"] * 0.2, yF["height"] = i["screen"]["height"], ys["addChild"](yF, yl, yE);
        function yC() {
            const wW = K0, wt = K1;
            console["timeEnd"]("k加载完毕");
            function Uw(UF) { const UC = new PIXI["Sprite"](yL["resources"]["ui_lottery"]["textures"][UF]); return UC["name"] = UF, UC; }
            function Uc(UF) { const UC = new PIXI["Sprite"](yL["resources"]["ui_lottery"]["textures"][UF]); return UC["name"] = UF, UC["interactive"] = !![], UC["on"]("pointerdown", Ud), UC["on"]("pointerup", UP), UC; }
            function Ud(UF) {
                var UC = UF["target"];
                window["currentSprite"] = UF["target"];
                switch (UC["name"]) {
                    case "lottery_button1":
                        if (ys["getChildByName"]("lotterypage1") == null)
                            PIXI["sound"]["play"]("HugeButtom");
                        break;
                    case "lottery_button2":
                        if (ys["getChildByName"]("lotterypage2") == null)
                            PIXI["sound"]["play"]("HugeButtom");
                        break;
                    case "lottery_button3":
                        if (ys["getChildByName"]("lotterypage3") == null)
                            PIXI["sound"]["play"]("HugeButtom");
                        break;
                    default:
                        PIXI["sound"]["play"]("MidButton"), UC["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { UC["filters"] = [P]; }, "onComplete": () => { UC["filters"] = null; } });
                        break;
                }
            }
            const Up = Uw("public_view_tittlebg");
            GF(Up), Up["scale"]["set"](0.71), Up["position"]["set"](0.043 * i["screen"]["width"], 0x0);
            const Ur = Uw("category_warr");
            GF(Ur), Ur["anchor"]["set"](0.5), Ur["position"]["set"](0.7 * Up["width"], 0.62 * Up["height"]), Up["addChild"](Ur);
            const UM = new PIXI["Sprite"](ym["resources"]["paiweiui"]["textures"]["back"]);
            UM["name"] = "wujiangback", GF(UM, !![]), UM["x"] = i["screen"]["width"] - UM["width"] * 0.25, UM["y"] = 0x2a, yl["addChild"](Up), ys["addChild"](UM);
            const Uu = Uw("fix_left_collection_btn");
            GF(Uu), Uu["scale"]["set"](0.71), Uu[wt(0x1f8, "!2E0")]["set"](-0.4 * Uu["width"], yE["height"] - Uu["height"] * 0.46);
            const Ut = Uc("tab_btn_pressed1");
            Ut[wt(rzshMa.G, "rz96")] = "lottery_button1", GF(Ut), Ut[wW(0x1f9)]["set"](0.71), Ut["position"]["set"](0.4 * Uu["width"], yE["height"] - Ut["height"] * 0.3);
            const UW = Uc("tab_btn_normal1");
            UW["name"] = "lottery_button2", GF(UW), UW["scale"]["set"](0.71), UW["position"]["set"](0.4 * Uu["width"] + Ut["width"] * 0.88, yE["height"] - UW["height"] * 0.3);
            const Ue = Uc("tab_btn_normal1");
            Ue["name"] = "lottery_button3", GF(Ue), Ue["scale"]["set"](0.71), Ue["position"]["set"](0.4 * Uu["width"] + Ut["width"] * 1.76, yE["height"] - Ue["height"] * 0.3);
            let UA = new PIXI["NineSlicePlane"](yL["resources"]["ui_lottery"]["textures"]["tab_bg_rb"], 0x4e, 0x0, 0x80, 0x0);
            UA["scale"]["set"](0.71), UA["position"]["set"](0.4 * Uu["width"] + Ut["width"] * 2.68, yE["height"] - UA["height"] * 0.38), UA["width"] = (i["screen"]["width"] - UA["x"]) / 0.71;
            const Ua = {};
            Ua["fontSize"] = 0x1c, Ua["fill"] = "#CFBA9C", Ua["fontFamily"] = "shousha";
            const Uo = new PIXI["Text"]("招武将", Ua);
            Uo["anchor"][wt(0x221, "hJkg")](0.5), Uo["position"]["set"](0.7 * Ut["width"], 0.7 * Ut["height"]), Ut["addChild"](Uo);
            const Uj = {};
            Uj["fontSize"] = 0x1c, Uj["fill"] = "#CFBA9C", Uj["fontFamily"] = "shousha";
            const UD = new PIXI[(wt(0x241, "r6vR"))]("集皮肤", Uj);
            UD[wW(0x173)]["set"](0.5), UD["position"]["set"](0.7 * UW["width"], 0.7 * UW["height"]), UW["addChild"](UD);
            const UJ = {};
            UJ["fontSize"] = 0x1c, UJ["fill"] = "#CFBA9C", UJ["fontFamily"] = "shousha";
            const UI = new PIXI["Text"]("商 店", UJ);
            UI["anchor"]["set"](0.5), UI["position"][wt(0x188, "og)$")](0.7 * Ue["width"], 0.7 * Ue["height"]), Ue["addChild"](UI), yE["addChild"](Uu, Ut, UW, Ue, UA);
            const Ui = Uc("lobby_info");
            GF(Ui), Ui["scale"]["set"](0.74), Ui["position"]["set"](0.0475 * i["screen"]["width"], 0.1 * i["screen"]["height"]);
            const UT = Uc("lobbyui_btn_bg2");
            GF(UT), UT["scale"]["set"](0.69), UT["position"]["set"](0.0475 * i["screen"]["width"], 0.72 * i["screen"]["height"]);
            const Ug = Uw("under6");
            GF(Ug), Ug["scale"]["set"](1.05), Ug["position"]["set"](-0.15 * UT["width"], 0.075 * UT["height"]), UT["addChild"](Ug), yF["addChild"](Ui, UT);
            const UB = new PIXI["spine"]["Spine"](yL["resources"]["menfengskel"]["spineData"]);
            UB["state"]["setAnimation"](0x0, "jingzhi", !![]), UB["scale"]["set"](0.72), UB["position"]["set"](0.4975 * i["screen"]["width"], 0.5 * i["screen"]["height"]);
            const Uq = Uw("pic_skin_char_left");
            GF(Uq), Uq["scale"]["set"](0.72), Uq["position"]["set"](0x0, 0.075 * i["screen"]["height"]);
            const Un = Uw("pic_skin_char_right");
            GF(Un), Un["scale"]["set"](0.72), Un["position"]["set"](i["screen"]["width"] - Un["width"], 0x0 * i["screen"]["height"]);
            const UZ = Uw("must_get_warr");
            GF(UZ), UZ["scale"]["set"](0.72), UZ["position"]["set"](0.85 * i["screen"]["width"], 0.1975 * i["screen"]["height"]);
            const Uz = new PIXI["spine"][(wW(rzshMa.y))](yL["resources"]["yinmenhuan"]["spineData"]);
            Uz[wW(0x2d8)] = "yinmenhuan", Uz["state"]["setAnimation"](0x0, "jingzhi", !![]), Uz["scale"]["set"](0.72), Uz["position"]["set"](0.5 * i["screen"]["width"], 0.225 * i["screen"]["width"]), Uz["interactive"] = !![], Uz["on"]("pointerup", UP), Uz["on"]("pointerdown", Ud);
            const UN = new PIXI["spine"]["Spine"](yL["resources"]["jinmenhuan"]["spineData"]);
            UN["name"] = "jinmenhuan", UN["state"]["setAnimation"](0x0, "jingzhi", !![]), UN["scale"]["set"](0.72), UN["position"]["set"](0.5 * i["screen"]["width"], 0.225 * i["screen"]["width"]), UN["interactive"] = !![], UN["on"]("pointerup", UP), UN["on"]("pointerdown", Ud);
            const UR = Uw("yici");
            GF(UR), UR["position"]["set"](-1.23 * Uz["width"], 0.37 * Uz["height"]), Uz["addChild"](UR);
            const US = Uw("wuci");
            GF(US), US[wW(0x1bf)]["set"](0.56 * UN["width"], 0.29 * UN["height"]), UN[wW(0x291)](US), yv["addChild"](UB, Uq, Un, UZ, Uz, UN);
            function UX(UF) { const we = wW, UC = new PIXI["spine"]["Spine"](yL["resources"]["kaimenskel"]["spineData"]); UC["state"]["setAnimation"](0x0, "jingzhi2"), UC["scale"]["set"](0.72), UC[we(0x1bf)]["set"](0.5 * i["screen"]["width"], 0.5 * i[we(0x1f0)]["height"]); const Ux = new PIXI["spine"]["Spine"](yL["resources"]["kaimenguangskel"]["spineData"]); Ux["state"]["setAnimation"](0x0, "jingzhi2"), Ux["scale"]["set"](0.72), Ux["position"]["set"](0.5 * i["screen"]["width"], 0.5 * i["screen"]["height"]), yv["removeChild"](UB), yv["addChild"](UC, Ux), UE(yl, "top"), UE(yF, "left"), setTimeout(function () { const wA = we; G2["texture"] = GG["resources"]["uiBG"]["texture"], G2["width"] = i["screen"][wA(0x2b1)], G2["height"] = i["screen"]["width"] / 0x536 * 0x2ee, ys["removeChild"](yv), UE(yE, "under"); }, 0x5dc), setTimeout(function () { GE(); }, 0x7d0); }
            const UH = new PIXI["spine"]["Spine"](yL["resources"]["menfengskel"]["spineData"]);
            UH["state"]["setAnimation"](0x0, wt(0x283, "1*2K"), !![]), UH["scale"]["set"](0.72), UH["position"]["set"](0.4975 * i["screen"]["width"], 0.5 * i["screen"][wW(0x231)]);
            const UO = new PIXI["spine"]["Spine"](yL["resources"]["pifu_zuoskel"]["spineData"]);
            UO["state"]["setAnimation"](0x0, "jingzhi", !![]), UO["scale"]["set"](0.72), UO["position"]["set"](0.51 * i["screen"]["width"], 0.225 * i["screen"][wt(0x183, "rkb@")]), UO["interactive"] = !![], UO["on"]("pointerup", UP), UO["on"]("pointerdown", Ud);
            const UQ = new PIXI["spine"]["Spine"](yL["resources"]["pifu_youskel"]["spineData"]);
            UQ["state"]["setAnimation"](0x0, "jingzhi", !![]), UQ["scale"]["set"](0.72), UQ["position"]["set"](0.49 * i["screen"]["width"], 0.225 * i["screen"]["width"]), UQ["interactive"] = !![], UQ["on"]("pointerup", UP), UQ["on"]("pointerdown", Ud);
            const Uh = Uw("must_get_skin2");
            GF(Uh), Uh["scale"]["set"](0.72), Uh["position"]["set"](0.535 * i["screen"]["width"], 0.43 * i["screen"]["height"]);
            const UL = Uw("pic_skin1_bg");
            GF(UL), UL["position"]["set"](-1.24 * UO["width"], 0.15 * UO["height"]);
            const Us = Uw("yici");
            GF(Us), Us["anchor"]["set"](0.5), Us["position"]["set"](0.5 * UL["width"], 0.45 * UL["height"]), UL["addChild"](Us), UO["addChild"](UL);
            const Uv = Uw("pic_skin10_bg");
            GF(Uv), Uv["position"]["set"](0.24 * UQ["width"], 0.15 * UQ["height"]);
            const UV = Uw("shici");
            GF(UV), UV["anchor"]["set"](0.5), UV["position"]["set"](0.5 * Uv["width"], 0.45 * Uv["height"]), Uv["addChild"](UV), UQ["addChild"](Uv), yV["addChild"](UH, UO, UQ, Uh);
            function UP(UF) {
                const wo = wW, wa = wt;
                if (window["currentSprite"] != UF["target"])
                    return;
                window["currentSprite"] = null;
                switch (UF["target"]["name"]) {
                    case "lottery_button1":
                        if (ys["getChildByName"]("lotterypage1") == null) {
                            Ut["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_pressed1"], UW["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_normal1"], Ue["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_normal1"];
                            try {
                                ys["removeChild"](yv, yV, yP);
                            }
                            catch (UC) { }
                            ;
                            ys["addChild"](yv), ys["setChildIndex"](yv, 0x0), Ur["texture"] = yL["resources"]["ui_lottery"]["textures"]["category_warr"], Ug["texture"] = yL["resources"]["ui_lottery"]["textures"]["under6"], Ul(yl, "top"), Ul(yF, "left");
                        }
                        break;
                    case "lottery_button2":
                        if (ys["getChildByName"]("lotterypage2") == null) {
                            Ut["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_normal1"], UW["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_pressed1"], Ue["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_normal1"];
                            try {
                                ys["removeChild"](yv, yV, yP);
                            }
                            catch (Ux) { }
                            ;
                            ys["addChild"](yV), ys["setChildIndex"](yV, 0x0), Ur["texture"] = yL["resources"][wa(0x1c6, "P9FJ")]["textures"]["category_skin"], Ug["texture"] = yL["resources"]["ui_lottery"]["textures"]["under5"], Ul(yl, "top"), Ul(yF, "left");
                        }
                        break;
                    case "lottery_button3":
                        if (ys["getChildByName"]("lotterypage3") == null) {
                            Ut["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_normal1"], UW["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_normal1"], Ue["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_pressed1"];
                            try {
                                ys["removeChild"](yv, yV, yP);
                            }
                            catch (k0) { }
                            ;
                            ys["addChild"](yP), ys["setChildIndex"](yP, 0x0), Ur["texture"] = yL["resources"]["ui_lottery"]["textures"]["category_shop"], Ug["texture"] = yL["resources"]["ui_lottery"]["textures"]["under6"], Ul(yl, "top"), Ul(yF, wo(0x19f));
                        }
                        break;
                    case "yinmenhuan":
                        UX(0x1);
                        break;
                    case "jinmenhuan":
                        UX(0x5);
                        break;
                    case "lobbyui_btn_bg2":
                        if (Ug["texture"] == yL["resources"]["ui_lottery"]["textures"]["under6"])
                            lifecycle.showView("characters");
                        break;
                    default: break;
                }
            }
            function Ul(UF, UC) {
                const wj = wW;
                let Ux = 0.5;
                const k0 = "power2.out";
                let k1, k2;
                switch (UC) {
                    case "top":
                        const k4 = {};
                        k4["y"] = -0x12c, k1 = k4;
                        const k5 = {};
                        k5["y"] = 0x0, k2 = k5, Ux = 0.3;
                        break;
                    case "under":
                        const k6 = {};
                        k6["y"] = 1.5 * i["screen"]["height"], k1 = k6;
                        const k7 = {};
                        k7["y"] = 0.91 * i["screen"]["height"], k2 = k7, Ux = 0.3;
                        break;
                    case "left":
                        const k8 = {};
                        k8["x"] = -0x12c, k1 = k8;
                        const k9 = {};
                        k9["x"] = 0x0, k2 = k9;
                        break;
                    case "right":
                        const kG = {};
                        kG["x"] = 1.5 * i["screen"][wj(0x2b1)], k1 = kG;
                        const ky = {};
                        ky["x"] = i["screen"]["width"] * 0.9, k2 = ky;
                        break;
                    default:
                        console["error"]("Invalid direction: $ {\n                                                    direction\n                                                }");
                        return;
                }
                const k3 = {};
                k3["ease"] = k0, gsap["fromTo"](UF, Ux, k1, k2, k3)["restart"]();
            }
            function UE(UF, UC) {
                let Ux = 0.8, k0 = "power2.out", k1, k2;
                switch (UC) {
                    case "top":
                        const k4 = {};
                        k4["y"] = -0x12c, k1 = k4;
                        const k5 = {};
                        k5["y"] = 0x0, k2 = k5;
                        break;
                    case "under":
                        const k6 = {};
                        k6["y"] = 1.5 * i["screen"]["height"], k1 = k6;
                        const k7 = {};
                        k7["y"] = i["screen"]["height"] * 0.91, k2 = k7;
                        break;
                    case "left":
                        const k8 = {};
                        k8["x"] = -0x12c, k1 = k8;
                        const k9 = {};
                        k9["x"] = 0x0, k2 = k9;
                        break;
                    case "right":
                        const kG = {};
                        kG["x"] = 1.5 * i["screen"]["width"], k1 = kG;
                        const ky = {};
                        ky["x"] = i["screen"]["width"] * 0.9, k2 = ky;
                        break;
                    default:
                        console["error"]("Invalid direction: $ {\n                                                    direction\n                                                }");
                        return;
                }
                const k3 = {};
                k3["ease"] = k0, gsap["fromTo"](UF, Ux, k2, k1, k3)["restart"]();
            }
            ys["on"]("added", () => {
                const wJ = wW, wD = wt;
                G2["texture"] = yL["resources"]["shop_bg_2"]["texture"], G2["width"] = i[wD(0x320, "v*9j")]["width"], G2["height"] = i["screen"]["width"] / 0x65c * 0x2f2;
                try {
                    ys["removeChild"](yv, yV, yP);
                }
                catch (Ux) { }
                ;
                ys["addChild"](yv), ys["setChildIndex"](yv, 0x0);
                yv["getChildByName"]("menfeng") == null && (yv["addChild"](UB), yv["setChildIndex"](UB, 0x0));
                const UF = {};
                UF["y"] = -0x12c;
                const UC = {};
                UC["y"] = 0x2b, UC["duration"] = 0.5, UC["ease"] = "power2.out", gsap["fromTo"](UM, UF, UC), Ut["texture"] = yL["resources"]["ui_lottery"]["textures"][wJ(0x161)], UW["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_normal1"], Ue["texture"] = yL["resources"]["ui_lottery"]["textures"]["tab_btn_normal1"], Ur["texture"] = yL["resources"]["ui_lottery"]["textures"]["category_warr"], Ul(yl, "top"), Ul(yE, "under"), Ul(yF, "left");
            }), yH["load"](() => { yh(); lifecycle.readyView("profile", yQ, () => U3(yQ)); });
        }
        const yx = lifecycle.loader();
        yx["add"]("zhuanpanBG", lib["assetURL"] + "extension/如真似幻/images/zhuanpanbg.jpg"), yx["add"]("zhuanpan", lib["assetURL"] + "extension/如真似幻/spine/Ot/xuanzhuan.skel"), yx["add"]("dayuanshuai", lib["assetURL"] + "extension/如真似幻/spine/Ot/大元帅/jinchang_dayuanshuai.skel"), yx["add"]("xiaosha", lib["assetURL"] + "extension/如真似幻/images/xiaosha.png"), yx["add"]("jbg", lib["assetURL"] + "extension/如真似幻/images/active/table_bg_seat.png"), yx["add"]("jbgshadow", lib[K1(0x1b9, "Q@V7")] + "extension/如真似幻/images/active/table_userinfo_bg.png"), yx["add"](K0(0x237), lib["assetURL"] + "extension/如真似幻/images/active/table_official_bg3.png"), yx["add"]("avatar_1", lib["assetURL"] + "extension/如真似幻/images/avatar/1.jpg"), yx["add"]("duijue", lib["assetURL"] + "extension/如真似幻/spine/duijue.json");
        let U0 = ["女宝", "夕", "隔壁戴夫", "EngJ.K", "文姬奶黄包", "黄小花", "非凡欧德内里", "🥕", "无中", "东方太白", "洛神", "路卡利欧", "幸运女神", "蒸", "夜雨触花开", "可爱的四月", "你似星辰亦是光", "Fire.win", "星飘永恒", "风轻云淡", "91管先生", "www", "高山流水", "四糸乃", "无伤大鸽子", "南街北巷", "夜洛樱琉璃", "蔡徐坤", "恰见明月栖木", "枫林残夜", "西瓜", "雷", "好呗。", "一只白羊呀", "魑魅魍魉", "塞尔太初"];
        Array["prototype"]["randomGetremove"] = function () { var Uw = this["randomGet"](); return this["remove"](Uw), Uw; };
        let U1 = lifecycle.container();
        U1["on"]("added", () => {
            const rzshMq = { G: "UEd7" }, wi = K0, wI = K1;
            G2["texture"] = yx["resources"][wI(0x1f3, "FbmE")]["texture"], lifecycle.cover(G2), PIXI["sound"]["play"]("PiPei1");
            let Uw = 3.6;
            function Uc() { Uw > 0x1 ? (Uw -= 0.02, G4["state"]["timeScale"] = Uw, G6 = requestAnimationFrame(Uc)) : (cancelAnimationFrame(G6), G6 = null); }
            setTimeout(function () { PIXI["sound"]["play"]("PiPei2"), PIXI["sound"]["stop"]("PiPei1"); }, 0x3e8), G6 = requestAnimationFrame(Uc);
            let Ud = lib["config"]["player_number"];
            if (lib["config"]["mode"] == "versus" && get["config"]("versus_mode") == "two")
                Ud = 0x4;
            G4[wi(0x2c1)]["tracks"][0x0]["onComplete"] = function () {
                const rzshMB = { G: 0x2f6 }, wg = wi, wT = wI;
                G6 != null && (cancelAnimationFrame(G6), G6 = null);
                for (let Ut = 0x0; Ut < Ud; Ut++) {
                    let UW = new PIXI["Sprite"](yx["resources"]["jbg"]["texture"]);
                    UW["anchor"][wT(0x188, "og)$")](0.5), UW[wT(0x22d, "C4@w")]["set"](0.7);
                    let Ue = new PIXI["Sprite"](yx["resources"][wg(0x230)]["texture"]);
                    Ue["y"] = 0.37 * UW["height"], Ue["anchor"]["set"](0.5);
                    let UA = lifecycle.portraits.sprite(yB["randomGet"]());
                    UA["width"] = 0x8a, UA["height"] = 0xfd, UA["anchor"]["set"](0.5), UA["y"] = -0x1b;
                    if (Ut == 0x0)
                        { UA["texture"] = yx["resources"]["avatar_1"]["texture"]; UA.workshopPortraitLoaded = true; }
                    let Ua = new PIXI["spine"]["Spine"](yx["resources"]["dayuanshuai"]["spineData"]);
                    Ua["state"]["setAnimation"](0x0, "play1", ![]), Ua["scale"]["set"](1.8);
                    if (Ut == Ud - 0x1)
                        Ua[wT(0x1c0, rzshMq.G)]["tracks"][0x0]["onComplete"] = function () { setTimeout(U8, 0x64); };
                    let Uo = lifecycle.container(), Uj = new PIXI["Sprite"](Gb["resources"]["uivip"]["textures"]["dj_vip_mark"]), UD = new PIXI["Sprite"](Gb["resources"]["uivip"]["textures"]["dj_vip" + [0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7]["randomGet"]()]);
                    if (Ut == 0x0)
                        UD["texture"] = Gb["resources"]["uivip"]["textures"]["dj_vip7"];
                    Uj["anchor"]["set"](0.5), Uj["x"] = -0x3e, Uj["y"] = 0x69, UD["anchor"]["set"](0.25), UD["x"] = -59.5, UD["y"] = 0x62;
                    const UJ = {};
                    UJ["fontSize"] = 0x14, UJ["fill"] = "#FFF", UJ["fontFamily"] = "shousha";
                    let UI = new PIXI["Text"](lib["config"]["connect_nickname"], UJ);
                    if (Ut != 0x0)
                        UI["text"] = U0["randomGetremove"]();
                    UI["anchor"]["set"](0.5), UI["x"] = 0x5, UI["y"] = 107.5, Uo["addChild"](Uj, UD, UI);
                    let Ui = lifecycle.container();
                    const UT = {};
                    UT["fontSize"] = 0x16, UT["fill"] = "#DAA520", UT["fontFamily"] = "shousha", UT["fontWeight"] = 0xc8;
                    let Ug = new PIXI["Text"]("Lv 220", UT);
                    Ug["anchor"]["set"](0.5), Ug["x"] = -0x30, Ug["y"] = 0x37;
                    const UB = {};
                    UB["fontSize"] = 0x10, UB["fill"] = "#DAA520", UB["fontFamily"] = "shousha", UB["fontWeight"] = 0xc8;
                    let Uq = new PIXI["Text"]("胜率：", UB);
                    Uq["text"] = "胜率：" + ((Math["random"]() * 0.22 + 0.5) * 0x64)["toFixed"](0x0) + "%";
                    if (Ut == 0x0)
                        Uq["text"] = "胜率：" + ((Math["random"]() * 0.1 + 0.6) * 0x64)[wg(0x21e)](0x0) + "%";
                    Uq["anchor"]["set"](0.5), Uq["x"] = 0x25, Uq["y"] = 0x3b;
                    let Un = new PIXI["Sprite"](yx["resources"]["officialbg"]["texture"]);
                    Un["anchor"]["set"](0.5), Un["x"] = 0x0, Un["y"] = 0x55;
                    let UZ = new PIXI["Sprite"](Gb["resources"]["ui_tw"]["textures"]["dajiangjun_pic"]);
                    UZ["x"] = -0x41, UZ["anchor"]["set"](0.5), UZ["scale"]["set"](0.25);
                    const Uz = {};
                    Uz["fontSize"] = 0x18, Uz["fill"] = "#DAA520", Uz["fontFamily"] = "shousha", Uz["fontWeight"] = 0xc8;
                    let UN = new PIXI["Text"]("大将军", Uz);
                    if (Ut == 0x0 || Math["random"]()["toFixed"](0x0) == "0")
                        UN["text"] = "大元帅";
                    UN["x"] = 0x5, UN["y"] = -0x2, UN["anchor"]["set"](0.5), Un["addChild"](UZ, UN), Ui["addChild"](Un, Uq, Ug), UW["addChild"](UA, Ue, Ui, Uo), UW["position"]["set"](0.5 * i[wT(0x310, "f@0[")]["width"], i["screen"]["height"]), setTimeout(function () {
                        const wq = wT, wB = wg;
                        U1["addChild"](UW);
                        if (lib["config"]["mode"] == "doudizhu") {
                            const UR = {};
                            UR["x"] = i["screen"]["width"] * 0.5, UR["y"] = i["screen"]["height"], gsap[wB(rzshMB.G)](UW, UR, { "duration": 0.6, "x": 0.5 * i["screen"]["width"] * (Ut + 0x1) / (Ud + 0x1) + 0.25 * i["screen"]["width"], "y": 0.4 * i["screen"]["height"], "ease": "power4.out", "onComplete": function () { UW["addChild"](Ua); } });
                        }
                        else {
                            if (lib["config"]["mode"] == "versus" && get["config"]("versus_mode") == "two") {
                                if (Ut == 0x2) {
                                    let US = new PIXI["spine"]["Spine"](yx["resources"]["duijue"]["spineData"]);
                                    US["scale"]["set"](0.71), US["x"] = 0.5 * i["screen"]["width"], US["y"] = 0.4 * i["screen"]["height"], US["state"]["setAnimation"](0x0, "animation", !![]), U1["addChild"](US);
                                }
                                if (Ut < 0x2) {
                                    const UX = {};
                                    UX["x"] = i["screen"]["width"] * 0.5, UX["y"] = i["screen"]["height"], gsap["fromTo"](UW, UX, { "duration": 0.6, "x": 0.5 * i["screen"]["width"] - 0.625 * i["screen"]["width"] * (0x2 - Ut) / (Ud + 0x1), "y": 0.4 * i["screen"]["height"], "ease": "power4.out", "onComplete": function () { UW["addChild"](Ua); } });
                                }
                                else {
                                    const UH = {};
                                    UH["x"] = i["screen"]["width"] * 0.5, UH["y"] = i["screen"]["height"], gsap["fromTo"](UW, UH, { "duration": 0.6, "x": 0.625 * i["screen"]["width"] * (Ut - 0x1) / (Ud + 0x1) + 0.5 * i["screen"][wq(0x242, "6)6d")], "y": 0.4 * i["screen"]["height"], "ease": "power4.out", "onComplete": function () { UW["addChild"](Ua); } });
                                }
                            }
                            else {
                                const UO = {};
                                UO["x"] = i["screen"]["width"] * 0.5, UO["y"] = i["screen"]["height"], gsap["fromTo"](UW, UO, { "duration": 0.6, "x": i["screen"]["width"] * (Ut + 0x1) / (Ud + 0x1), "y": 0.4 * i["screen"]["height"], "ease": "power4.out", "onComplete": function () { UW["addChild"](Ua); } });
                            }
                        }
                    }, 0xc8 * Ut);
                }
            };
            let Up = ["寻找对手中,不要着急哦~", "回合结束时,能保留的手牌数不能超过当前体力值", "忠臣以保护主公为己任，击杀所有的反贼和内奸，即可获得胜利", "主公与忠臣搭档，击杀所有的反贼和内奸，即可获得胜利", "反贼孤注一掷，全力推翻主公，即可获得胜利", wi(0x2f4), "游戏过程中，需要攻击敌人，保卫自己以获得最后的胜利", "每个回合开始后，都会获得两张新的卡牌", "回合结束时，能保留的手牌数不能超过当前的体力值", "一般情况下，每个自己的回合内只能使用一张【杀】", "【万箭齐发】:   ( 锦囊 ) 所有人,展现你灵巧的身姿吧", "【无懈可击】:   ( 锦囊 ) 休想得逞"];
            Up["push"]("【桃园结义】:   ( 锦囊 ) 大家来一起喝一杯", "【铁索连环】:   ( 锦囊 ) 我觉得你们应该有难同当", "【无中生有】:   ( 锦囊 ) 我需要更多的牌", "【借刀杀人】:   ( 锦囊 ) 你的武器归我了", "【酒】:  喝完酒我似乎更勇猛了，我不能倒下", "【兵粮寸断】:   ( 延时锦囊 ) 结果不是梅花，你已经没有补给了", "【乐不思蜀】:   ( 延时锦囊 ) 结果不是红桃，你就安逸的待着吧", "【闪电】:   ( 延时锦囊 ) 结果不是黑桃2～9，准备迎接闪电吧", "【决斗】:   ( 锦囊 ) 我【杀】多，来单挑吧", "【顺手牵羊】:   ( 锦囊 ) 你的就是我的，呵呵", "【过河拆桥】:   ( 锦囊 ) 我要扔掉你的牌", "【五谷丰登】:   ( 锦囊 )大家都来选张牌吧", "【诸葛连弩】:   ( 装备 ) 接下来我要疯狂的杀戮了", "【丈八蛇矛】:   ( 装备 ) 用这两张牌去换张【杀】吧", "【方天画戟】:   ( 装备 ) 我可以同时砍更多人了", "【古锭刀】:   ( 装备 ) 你没有牌的话，我就不客气了", "【麒麟弓】:   ( 装备 ) 怎么样，落马了吧", "【仁王盾】:   ( 装备 ) 黑色的【杀】在我面前毫无用处", "【贯石斧】:   ( 装备 ) 你的【闪】也挡不住我的攻击", "【青龙偃月刀】:   ( 装备 ) 我会杀到你不能闪为止", "【火攻】:   ( 锦囊 ) 出示你的牌，然后我会燃烧你", "【雌雄双股剑】:   ( 装备 )你是弃一张牌呢还是让我多一张牌呢", "【青釭剑】:   ( 装备 ) 你的防具对我来说毫无用处，哈哈哈", "【南蛮入侵】:   ( 锦囊 ) 所有人,亮出你的兵器吧", "【白银狮子】:   ( 装备 ) 我不会受到更多的伤害", "【寒冰剑】:   ( 装备 ) 我改变主意了，我要扔掉你的牌", "【八卦阵】:   ( 装备 ) 只要出现红色牌，我就不惧你的攻击");
            function Ur() { return Up[Math["round"](Math["random"]() * Up["length"])]; }
            const UM = {};
            UM["fontSize"] = 0x17, UM["fill"] = "#d0c18d", UM["fontFamily"] = "shousha";
            let Uu = new PIXI["Text"](Ur(), UM);
            Uu["anchor"]["set"](0.5), Uu["x"] = 0x0, Uu["y"] = -0x14, G4["addChild"](Uu), setTimeout(function () { Uu["text"] = Ur(); }, 0x7d0);
        });
        function U2() { console["timeEnd"]("p加载完毕"), G4 = new PIXI["spine"]["Spine"](yx["resources"]["zhuanpan"]["spineData"]), G4["x"] = 0.5 * i["screen"]["width"], G4["y"] = i["screen"]["height"], G4["scale"]["set"](0.64), G4["state"]["setAnimation"](0x0, "action4", ![]), U1["addChild"](G4); }
        function U3(Uw) { window["isOnhide"] = !![], i["stage"]["children"].slice()["forEach"](function (Uc) { Uc !== G2 && i["stage"]["removeChild"](Uc); }), i["stage"]["addChild"](Uw), window["container"] = Uw; }
        function U4(Uw) {
            const wZ = K0, wn = K1;
            if (window["currentSprite"] != Uw["target"])
                return;
            window["currentSprite"] = null;
            switch (Uw["target"]["name"]) {
                case "solobtn":
                    U6("single", "dianjiang");
                    if (window["isOnhide"] == ![])
                        U8();
                    break;
                case "versustwobtn":
                    U6("versus", "two"), U7();
                    break;
                case "bottom_plus":
                    lifecycle.openTools(() => GK.addChild(yU));
                    break;
                case "legacy_bottom_plus":
                    GK["addChild"](yU);
                    break;
                case "top_back":
                    GE();
                    break;
                case "pubbtn_close":
                    const Uc = {};
                    Uc["y"] = 0x0;
                    const Ud = {};
                    Ud["duration"] = 0.5, Ud["y"] = i["screen"]["height"], Ud["ease"] = "power2.out", gsap["fromTo"](yk, Uc, Ud), setTimeout(function () { GK["removeChild"](yU); }, 0x12c);
                    break;
                case "menuyi3": break;
                case "menuwu3":
                    lifecycle.restart();
                    break;
                case "menusi5":
                    lifecycle.settings();
                    break;
                case "menuyi6":
                    confirm("是否重置本赛季天梯数据？重启生效") && game[wZ(0x1fe)]();
                    ;
                    break;
                case wZ(0x201):
                    GE();
                    break;
                default:
            }
        }
        function U5(Uw) {
            var Uc = Uw["target"], Ud = Uw["target"]["getChildByName"]("redPoint");
            Uw["target"]["removeChild"](Ud), window["currentSprite"] = Uw["target"];
            switch (window["currentSprite"]["name"]) {
                case "bottom_plus":
                    PIXI["sound"]["play"]("HugeButtom"), Uc["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { Uc["filters"] = [P]; }, "onComplete": () => { Uc["filters"] = null; } });
                    break;
                case "pubbtn_close":
                    PIXI["sound"]["play"]("PopUp"), Uc["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { const wz = rzshU; Uc[wz(0x1aa, "J*tF")] = [P]; }, "onComplete": () => { Uc["filters"] = null; } });
                    break;
                case "modesecoff1":
                case "modesecoff2":
                case "modesecoff3":
                case "page1btn":
                case "page2btn":
                case "page3btn":
                case "page4btn":
                    PIXI["sound"]["play"]("Label");
                    break;
                default:
                    PIXI["sound"]["play"]("MidButton"), Uc["filters"] = [P], gsap["to"](P, { "duration": 0.5, "ease": "power2.inOut", "gamma": 0x3, "onUpdate": () => { Uc["filters"] = [P]; }, "onComplete": () => { Uc["filters"] = null; } });
                    break;
            }
        }
        function U6(Uw, Uc, Ud) { const wN = K0; lib["config"]["mode"] = Uw, game["saveConfig"](wN(0x27c), Uw), Uc != undefined && game["saveConfig"](Uw + "_mode", Uc, Uw), Ud != undefined && (lib["config"]["player_number"] = Ud, game["saveConfig"]("player_number", Ud, Uw)); }
        function U7() { lifecycle.startGame(lib.config.mode, true); }
        function U8() { lifecycle.startGame(lib.config.mode); }
        function U9(Uw, Uc) {
            const targetX = rzshUs[Uw.name] ? rzshUs[Uw.name].x * G7 : (Uw.workshopHomeX ??= Uw.x);
            gsap.fromTo(Uw, {x:i.screen.width + Uw.width}, {x:targetX, duration:Uc, ease:"power2.out", overwrite:true});
        }
        window["inSplash"] = !![], clearTimeout(window["resetGameTimeout"]), delete window["resetGameTimeout"];
    });
}
