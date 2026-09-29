/*! ice-farewell.js — 冰龟陨落 · 剧情转场特效（canvas 实现，零依赖）
 *  qyIceFarewell.create(container, options) -> 实例
 *  时长 / 文案 / 主题 / 是否循环 / 是否显控制条，全部可配。
 *  v1.0.0
 */
(function (root, factory) {
  var api = factory();                                                 // 工厂只跑一次, 两个命名空间共用同一份
  if (typeof module === 'object' && module.exports) { module.exports = api; }   // Node / CommonJS
  else {
    root.qyIceFarewell = api;                                          // 新命名空间(推荐): qy 前缀跟无名杀扩展保持一致
    if (root.IceFarewell === undefined) root.IceFarewell = api;         // 旧命名兼容, 不覆盖宿主已有的同名定义
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '1.0.0';
  var BASE_TOTAL = 9.80;   /* 基准时间轴总长（秒）；duration 按比例缩放整条时间轴 */

  var BASE_TT = {
    halo:     [0.15, 1.60],
    flash:    [0.00, 0.30],
    lines:    [[0.30,1.78],[0.52,1.98],[0.74,2.15],[0.94,2.30],[1.10,2.44]],
    shards:   [0.50, 2.30],
    vines:    [[0.42,1.95],[0.56,2.12],[0.70,2.28],[0.84,2.44]],
    petals:   [3.30, 5.60],
    title:    [1.52, 2.60],
    rule:     [2.30, 3.10],
    subtitle: [2.44, 3.65],
    outLine:  [6.30, 8.90],
    outBg:    [7.40, 9.10],
    rewind:   [6.60, 9.10],
    total:    9.80
  };

  var THEMES = {
    ice: {
      halo:      'rgba(22,64,88,ALPHA)',   halo2: 'rgba(14,42,60,ALPHA)',
      line:      [196, 228, 246],
      glow:      '#7ac8f2',
      vine:      [148, 196, 210],
      leaf:      [112, 168, 186],
      leafTip:   [172, 218, 232],
      blossom:   [222, 242, 255],
      blossomHi: [255, 255, 255],
      core:      '#ffffff',
      shard:     [170, 214, 238],
      mote:      [196, 232, 250],
      textA:     '#e9f7ff', textB: '#ffffff'
    },
    jade: {
      halo:      'rgba(18,72,62,ALPHA)',   halo2: 'rgba(10,44,40,ALPHA)',
      line:      [196, 240, 222],
      glow:      '#4fdcac',
      vine:      [138, 206, 176],
      leaf:      [96, 170, 140],
      leafTip:   [168, 232, 202],
      blossom:   [226, 255, 244],
      blossomHi: [255, 255, 255],
      core:      '#ffffff',
      shard:     [164, 232, 206],
      mote:      [190, 246, 224],
      textA:     '#e8fff6', textB: '#ffffff'
    },
    sakura: {
      halo:      'rgba(78,36,60,ALPHA)',   halo2: 'rgba(48,20,38,ALPHA)',
      line:      [250, 216, 232],
      glow:      '#ff8cba',
      vine:      [214, 168, 190],
      leaf:      [186, 132, 158],
      leafTip:   [242, 196, 216],
      blossom:   [255, 234, 244],
      blossomHi: [255, 255, 255],
      core:      '#fff8fc',
      shard:     [252, 206, 226],
      mote:      [255, 214, 234],
      textA:     '#fff0f6', textB: '#ffffff'
    },
    /* 混合：三个主题的色相分着用 —— 裂纹用冰蓝、藤蔓叶子用青玉、花用樱粉，
       背景光晕和粒子取三者平均，所以一帧里同时看得到三种味道 */
    mix: {
      halo:      'rgba(39,57,70,ALPHA)',   halo2: 'rgba(24,35,46,ALPHA)',   /* 三个主题背景色的平均值 */
      line:      [196, 228, 246],           /* 冰：冰裂纹 */
      glow:      '#7ac8f2',
      vine:      [138, 206, 176],           /* 玉：藤蔓 */
      leaf:      [96, 170, 140],
      leafTip:   [168, 232, 202],
      blossom:   [255, 214, 230],           /* 樱：花 */
      blossomHi: [255, 255, 255],
      core:      '#ffffff',
      shard:     [211, 210, 232],           /* 冰 + 樱 平均：淡紫冰晶 */
      mote:      [214, 231, 236],           /* 三色平均：珠光微尘 */
      textA:     '#eef5ff', textB: '#ffffff'
    }
  };

  /* 主题池：theme 传 'random' 时从这里掷一个（想只在前三色里随机，把 'mix' 去掉即可） */
  var RANDOM_POOL = ['ice', 'jade', 'sakura', 'mix'];

  var CSS = '.ifx{--glow:#6fc4f0;--title-a:#e8f6ff;--title-b:#fff;--ui-fg:rgba(214,235,248,.78);--ui-bg:rgba(9,18,26,.6);--ui-line:rgba(150,205,230,.18);position:relative;overflow:hidden;background:#000;isolation:isolate;width:100%;height:100%;font-family:"Songti SC","STSong","Source Han Serif SC","Noto Serif SC","PingFang SC","Microsoft YaHei",serif;color:#e2f1fa;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}.ifx-fixed{position:fixed;inset:0;width:100%;height:100%;z-index:9999}.ifx,.ifx *{box-sizing:border-box}.ifx-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}.ifx-text{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:6.5vh;pointer-events:none}.ifx-title{display:flex;gap:.17em;font-size:clamp(30px,5.4vw,70px);font-weight:600;line-height:1.24}.ifx-title .ifx-ch{display:inline-block;background-size:320% 100%;background-repeat:no-repeat;-webkit-background-clip:text;background-clip:text;color:transparent}.ifx-rule{display:flex;align-items:center;justify-content:center;width:min(640px,60vw);height:1px;margin:clamp(13px,2.3vh,26px) 0 clamp(11px,2vh,22px);opacity:0;transform:scaleX(0)}.ifx-rule i{flex:1;height:1px;display:block;background:linear-gradient(90deg,rgba(190,226,244,0),rgba(214,240,255,.9),rgba(190,226,244,0))}.ifx-rule s{width:5px;height:5px;margin:0 10px;display:block;text-decoration:none;background:#f0faff;transform:rotate(45deg);box-shadow:0 0 12px var(--glow)}.ifx-sub{display:flex;gap:.09em;font-size:clamp(13px,1.55vw,21px);font-weight:400;line-height:1.7}.ifx-sub .ifx-ch{display:inline-block;color:rgba(216,238,250,.95)}.ifx-ui{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:999px;background:var(--ui-bg);border:1px solid var(--ui-line);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 30px rgba(0,0,0,.55);font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;font-size:12px;letter-spacing:.04em;color:var(--ui-fg);transition:opacity .5s ease;z-index:20}.ifx-idle .ifx-ui{opacity:.34}.ifx-idle .ifx-ui:hover{opacity:1}.ifx-hidden .ifx-ui,.ifx-hidden .ifx-hint{opacity:0;pointer-events:none}.ifx-ui button{appearance:none;border:1px solid rgba(160,210,235,.16);background:rgba(255,255,255,.045);color:var(--ui-fg);padding:6px 12px;border-radius:999px;cursor:pointer;font-family:inherit;font-size:12px;letter-spacing:.05em;transition:background .2s,border-color .2s,color .2s}.ifx-ui button:hover{background:rgba(140,210,245,.16);border-color:rgba(150,215,250,.4);color:#f0faff}.ifx-sep{width:1px;height:16px;background:var(--ui-line);margin:0 2px}.ifx-scrub{-webkit-appearance:none;appearance:none;width:clamp(110px,17vw,210px);height:3px;border-radius:2px;background:rgba(180,220,240,.18);outline:none;cursor:pointer}.ifx-scrub::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:11px;height:11px;border-radius:50%;background:#eaf7ff;box-shadow:0 0 8px var(--glow);cursor:pointer}.ifx-scrub::-moz-range-thumb{width:11px;height:11px;border:0;border-radius:50%;background:#eaf7ff;box-shadow:0 0 8px var(--glow);cursor:pointer}.ifx-time{font-variant-numeric:tabular-nums;letter-spacing:.06em;min-width:72px;text-align:center;opacity:.75}.ifx-sw{width:17px;height:17px;border-radius:50%;cursor:pointer;border:1px solid rgba(255,255,255,.22);transition:transform .2s,box-shadow .2s}.ifx-sw:hover{transform:scale(1.14)}.ifx-sw[data-t=ice]{background:radial-gradient(circle at 34% 30%,#eaf7ff,#5fb3e0 62%,#1d4f6b)}.ifx-sw[data-t=jade]{background:radial-gradient(circle at 34% 30%,#e6fff5,#3fd9a4 62%,#1c5c48)}.ifx-sw[data-t=sakura]{background:radial-gradient(circle at 34% 30%,#fff2f7,#ff86b6 62%,#7a2c48)}.ifx-sw[data-t=mix]{background:conic-gradient(#5fb3e0,#3fd9a4,#ff86b6,#5fb3e0)}.ifx-sw[data-t=random]{background:conic-gradient(#eaf7ff,#5fb3e0,#3fd9a4,#ff86b6,#eaf7ff)}.ifx-sw.ifx-on{box-shadow:0 0 0 2px rgba(255,255,255,.55),0 0 16px rgba(150,215,250,.65)}.ifx-hint{position:absolute;right:22px;bottom:26px;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;font-size:11.5px;letter-spacing:.1em;color:rgba(190,220,238,.34);transition:opacity .8s ease;z-index:19;pointer-events:none}@media (max-width:640px){.ifx-hint{display:none}}\n/* 宿主页面(如无名杀)常有 div{display:inline-block;position:absolute;transition:all .5s} 这种全局重置: 会把标题/装饰线/副标题变成绝对定位全部叠在中心, 还会把逐帧动画糊成 0.5 秒缓动, 这里显式压回来 */\n.ifx-title,.ifx-rule,.ifx-sub{position:relative}\n.ifx,.ifx-text,.ifx-title,.ifx-rule,.ifx-sub{transition:none}';
  var cssInjected = false;
  function injectCSS(doc) {
    if (cssInjected) return;
    var st = doc.createElement('style');
    st.setAttribute('data-ice-farewell', '');
    st.textContent = CSS;
    doc.head.appendChild(st);
    cssInjected = true;
  }

  function buildTimeline(total) {
    var k = total / BASE_TOTAL;
    function sc(p) { return [p[0] * k, p[1] * k]; }
    var out = { total: total, k: k };
    var keys = ['halo','flash','shards','petals','title','rule','subtitle','outLine','outBg','rewind'];
    var i;
    for (i = 0; i < keys.length; i++) out[keys[i]] = sc(BASE_TT[keys[i]]);
    out.lines = BASE_TT.lines.map(sc);
    out.vines = BASE_TT.vines.map(sc);
    return out;
  }

  function create(container, options) {
    var opts = options || {};
    var host = container;
    if (typeof host === 'string') host = document.querySelector(host);
    var doc = (host && host.ownerDocument) || document;
    var win = doc.defaultView || window;
    injectCSS(doc);

    var rootEl = doc.createElement('div');
    rootEl.className = 'ifx';
    if (!host || host === doc.body || host === doc.documentElement) {
      host = doc.body;
      rootEl.className = 'ifx ifx-fixed';
      rootEl.style.position = 'fixed';
    }
    host.appendChild(rootEl);

    var cv = doc.createElement('canvas');
    cv.className = 'ifx-canvas';
    rootEl.appendChild(cv);

    var textEl = doc.createElement('div');
    textEl.className = 'ifx-text';
    var titleEl = doc.createElement('div');
    titleEl.className = 'ifx-title';
    var ruleEl = doc.createElement('div');
    ruleEl.className = 'ifx-rule';
    ruleEl.innerHTML = '<i></i><s></s><i></i>';
    var subEl = doc.createElement('div');
    subEl.className = 'ifx-sub';
    textEl.appendChild(titleEl);
    textEl.appendChild(ruleEl);
    textEl.appendChild(subEl);
    rootEl.appendChild(textEl);

    var ro = null, rafId = 0, DEAD = false;

    var CONFIG = {
      title: '冰龟死亡',
      subtitle: '冰面随之碎裂消融……',
      duration: BASE_TOTAL,
      theme: 'ice',
      themePick: 'ice',      /* 用户点的主题名（可能是 random），只拿来高亮色块 */
      themeObj: null,
      loop: true,
      flash: true,
      autoPlay: true,
      controls: false,
      keyboard: false,
      seed: 20241109,
      startAt: 0,
      hintText: '',
      onEnd: null
    };
    var ok;
    for (ok in opts) { if (opts.hasOwnProperty(ok)) CONFIG[ok] = opts[ok]; }

    var DURATION = Math.max(0.6, +CONFIG.duration || BASE_TOTAL);
    var SPEED = BASE_TOTAL / DURATION;   /* 内部时钟走"基准秒"：1 秒真实时间 = SPEED 基准秒 */
    var TT = buildTimeline(BASE_TOTAL);  /* 时间轴始终是基准秒，永不缩放，因此所有写死的时长/速率自动等比 */
    var K = 1;

  var TAU = Math.PI * 2;
  var M = 1;                       // 尺寸基准（min(W,H)），resize 时更新

  /* ---------------- 工具函数 ---------------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function eOutCubic(p) { return 1 - Math.pow(1 - p, 3); }
  function eInCubic(p) { return p * p * p; }
  function eOutQuint(p) { return 1 - Math.pow(1 - p, 5); }
  function eInOutCubic(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function eInOutSine(p) { return -(Math.cos(Math.PI * p) - 1) / 2; }
  function eOutBack(p) { var c1 = 1.55, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }
  function eOutElastic(p) {
    if (p === 0 || p === 1) return p;
    var c4 = TAU / 3;
    return Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;
  }
  function seg(t, a, b, ease) {
    if (b <= a) return t >= b ? 1 : 0;
    return (ease || eOutCubic)(clamp01((t - a) / (b - a)));
  }

  /* ============================================================
     故事时间 story(t)
     淡出 = 把淡入倒着播一遍：
       线从左到右出现  ->  从右到左收回
       花最后绽放      ->  最先合上
       文字最后出现的字 ->  最先消失
     所有元素都只依赖 story(t)，所以逆序是自动成立的。
     ============================================================ */
  /* 线的淡出：自左向右推进的"过渡"渐隐。
     线本身保持完整形状，只是可见度沿 x 递减 —— 不是收回、不是倒放。 */
  var lineWipe = 0;
  var WIPE_F = 0.34;                 /* 羽化带宽（占屏宽比例，越宽越柔和） */
  function wipeVis(x01) {
    if (lineWipe <= 0.001) return 1;
    var front = lineWipe * (1 + 2 * WIPE_F) - WIPE_F;
    return clamp01((x01 - (front - WIPE_F)) / (2 * WIPE_F));
  }
  function wipeGrad(rgb) {
    var front = lineWipe * (1 + 2 * WIPE_F) - WIPE_F;
    var a0 = clamp01(front - WIPE_F);
    var a1 = clamp01(front + WIPE_F);
    if (a1 <= a0) a1 = Math.min(1, a0 + 0.002);
    var g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, rgba(rgb, 0));
    g.addColorStop(a0, rgba(rgb, 0));
    g.addColorStop(a1, rgba(rgb, 1));
    g.addColorStop(1, rgba(rgb, 1));
    return g;
  }

  var RW_A = TT.rewind[0];
  var RW_LEN = TT.rewind[1] - TT.rewind[0];
  var SETTLED = 2.60;   /* 到这个故事时间，花/藤蔓/冰晶都已长满 */
  var FAST = 0.18;      /* 窗口前 18% 用来快速掠过"已就位"区间（视觉上无变化） */
  function story(t) {
    if (t <= RW_A) return t;
    var u = clamp01((t - RW_A) / RW_LEN);
    if (u <= FAST) return RW_A - (RW_A - SETTLED) * (u / FAST);
    var w = (u - FAST) / (1 - FAST);
    return SETTLED * (1 - eInOutSine(w));
  }
  function rgba(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(3) + ')';
  }
  function lerp(a, b, p) { return a + (b - a) * p; }

  /* 可复现随机数：保证 seek() 到任意时刻画面完全一致 */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function rr(rnd, a, b) { return a + (b - a) * rnd(); }

  /* 三次贝塞尔采样 */
  function cubicPts(p0, p1, p2, p3, n) {
    var out = [], i;
    for (i = 0; i <= n; i++) {
      var u = i / n, v = 1 - u;
      var x = v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0];
      var y = v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1];
      out.push([x, y]);
    }
    return out;
  }
  function polyLen(pts) {
    var L = 0, i;
    for (i = 1; i < pts.length; i++) {
      var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
      L += Math.sqrt(dx * dx + dy * dy);
    }
    return L;
  }
  function polyAt(pts, s) {
    if (s <= 0) return { p: pts[0], d: [1, 0] };
    if (s >= 1) {
      var n0 = pts.length - 1, a0 = pts[n0], b0 = pts[n0 - 1];
      var dx0 = a0[0] - b0[0], dy0 = a0[1] - b0[1], l0 = Math.sqrt(dx0 * dx0 + dy0 * dy0) || 1;
      return { p: a0, d: [dx0 / l0, dy0 / l0] };
    }
    var total = polyLen(pts), target = s * total, acc = 0, i;
    for (i = 1; i < pts.length; i++) {
      var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
      var l = Math.sqrt(dx * dx + dy * dy);
      if (acc + l >= target) {
        var k = (target - acc) / (l || 1);
        return {
          p: [pts[i - 1][0] + dx * k, pts[i - 1][1] + dy * k],
          d: [dx / (l || 1), dy / (l || 1)]
        };
      }
      acc += l;
    }
    return { p: pts[pts.length - 1], d: [1, 0] };
  }

  /* 角点局部坐标 -> 归一化世界坐标（四角镜像对称） */
  function cornerMap(corner, u, v) {
    if (corner === 0) return [u, v];
    if (corner === 1) return [1 - u, v];
    if (corner === 2) return [1 - u, 1 - v];
    return [u, 1 - v];
  }


  /* ============================================================
     场景数据：固定种子生成，保证每次播放完全一致
     ============================================================ */
  var cracks = [], vines = [], shards = [], motes = [], petals = [];
  var twinkles = [], nebula = [], blossomsAll = [];

  function buildCracks(rnd) {
    var specs = [
      { y: 0.415, amp: 0.011, freq: 2.6, phase: 0.4, thick: 1.15, a: 0.60, dir: 'ltr' },
      { y: 0.470, amp: 0.019, freq: 1.7, phase: 2.1, thick: 0.90, a: 0.40, dir: 'ltr' },
      { y: 0.352, amp: 0.009, freq: 3.3, phase: 4.6, thick: 0.78, a: 0.32, dir: 'ltr' },
      { y: 0.575, amp: 0.015, freq: 2.1, phase: 1.3, thick: 0.72, a: 0.21, dir: 'ltr' },
      { y: 0.505, amp: 0.007, freq: 4.1, phase: 3.4, thick: 0.62, a: 0.16, dir: 'ltr' }
    ];
    specs.forEach(function (sp, idx) {
      var tt = TT.lines[idx] || [1.0, 2.3];
      var line = {
        y: sp.y, amp: sp.amp, freq: sp.freq, phase: sp.phase,
        thick: sp.thick, a: sp.a, dir: sp.dir, t0: tt[0], t1: tt[1],
        branches: [], pearls: [], sparks: []
      };

      /* --- 侧枝：冰面裂纹分叉 --- */
      var nb = 2 + Math.floor(rnd() * 3);
      var i;
      for (i = 0; i < nb; i++) {
        var bx = rr(rnd, 0.06, 0.94);
        var up = rnd() < 0.5 ? -1 : 1;
        var bl = rr(rnd, 0.016, 0.046);
        var drift = rr(rnd, -0.022, 0.022);
        line.branches.push({
          x: bx, up: up, pts: [
            [0, 0],
            [drift * 0.35, bl * 0.30 * up],
            [drift * 0.80 + rr(rnd, -0.012, 0.012), bl * 0.66 * up],
            [drift * 1.25, bl * up]
          ],
          t0: tt[0] + (tt[1] - tt[0]) * bx + 0.06,
          dur: rr(rnd, 0.42, 0.72),
          thick: rr(rnd, 0.34, 0.62),
          a: rr(rnd, 0.20, 0.46)
        });
      }

      /* --- 沿线珍珠光点 --- */
      var np = 5 + Math.floor(rnd() * 4);
      for (i = 0; i < np; i++) {
        line.pearls.push({
          xf: rr(rnd, 0.08, 0.92),
          r: rr(rnd, 0.7, 1.9),
          t0: tt[1] + rr(rnd, -0.25, 0.55),
          phase: rr(rnd, 0, TAU),
          amp: rr(rnd, 1.2, 4.2),
          a: rr(rnd, 0.45, 0.95)
        });
      }

      /* --- 沿裂缝游走的光星 --- */
      var ns = 1 + Math.floor(rnd() * 2);
      for (i = 0; i < ns; i++) {
        line.sparks.push({
          off: rnd(), speed: rr(rnd, 0.045, 0.115) * (rnd() < 0.5 ? -1 : 1),
          size: rr(rnd, 0.004, 0.010), tint: rnd()
        });
      }
      cracks.push(line);
    });
  }

  /* ---------------- 四角藤蔓 ---------------- */
  function buildCornerVine(corner, rnd, hero, t0, t1) {
    var A = [
      [-0.02, 0.010], [0.100, 0.096], [0.232, -0.014], [0.345, 0.068]
    ];
    var pts = cubicPts(A[0], A[1], A[2], A[3], 26);
    var world = pts.map(function (p) { return cornerMap(corner, p[0], p[1]); });

    var vine = {
      pts: world, corner: corner, hero: hero, t0: t0, t1: t1,
      thick: rr(rnd, 0.9, 1.5), branches: [], leaves: [], blossoms: [], buds: []
    };

    var nb = hero ? 4 : 3;
    var i, j;
    for (i = 0; i < nb; i++) {
      var s = hero ? clamp(0.19 + i * 0.22 + rr(rnd, -0.05, 0.05), 0.10, 0.92) : rr(rnd, 0.16, 0.90);
      var anchor = polyAt(pts, s);
      var dx = rr(rnd, 0.040, 0.100), dy = rr(rnd, 0.026, 0.086);
      var c2x = anchor.p[0] + dx * rr(rnd, 0.35, 0.75), c2y = anchor.p[1] + dy * 1.25;
      var bp = cubicPts(
        anchor.p,
        [anchor.p[0] + dx * 0.30, anchor.p[1] + dy * 0.55],
        [c2x, c2y],
        [anchor.p[0] + dx * rr(rnd, 0.9, 1.35), anchor.p[1] + dy * rr(rnd, 0.9, 1.6)],
        14
      );
      var bw = bp.map(function (p) { return cornerMap(corner, p[0], p[1]); });
      var bt0 = t0 + (t1 - t0) * s + 0.06;
      var bt1 = bt0 + rr(rnd, 0.42, 0.70);
      var br = { pts: bw, t0: bt0, t1: bt1, thick: vine.thick * rr(rnd, 0.55, 0.82), leaves: [], blossom: null };

      var nl = 1 + Math.floor(rnd() * 2);
      for (j = 0; j < nl; j++) {
        br.leaves.push({
          s: rr(rnd, 0.45, 0.98), side: rnd() < 0.5 ? -1 : 1,
          len: rr(rnd, 0.016, 0.034), wid: rr(rnd, 0.38, 0.60),
          rot: rr(rnd, -0.35, 0.35), t0: bt1 + rr(rnd, -0.10, 0.24), dur: rr(rnd, 0.44, 0.72),
          sway: rr(rnd, 0, TAU), tone: rnd()
        });
      }

      if (hero && i < 2) {
        var last = bw[bw.length - 1];
        var r = rr(rnd, 0.0135, 0.0215);
        br.blossom = {
          x: last[0], y: last[1], r: r, t0: bt1 + rr(rnd, 0.10, 0.30),
          petals: 5, spin: rr(rnd, 0.10, 0.26) * (rnd() < 0.5 ? -1 : 1),
          rot: rr(rnd, 0, TAU), droop: rr(rnd, 0.10, 0.30)
        };
        spliceBlossom(br.blossom);
      }
      vine.branches.push(br);
    }

    /* 主蔓上的叶片 */
    var nl2 = hero ? 6 : 5;
    for (i = 0; i < nl2; i++) {
      var s2 = rr(rnd, 0.12, 0.96);
      vine.leaves.push({
        s: s2, side: rnd() < 0.5 ? -1 : 1,
        len: rr(rnd, 0.017, 0.038), wid: rr(rnd, 0.34, 0.58),
        rot: rr(rnd, -0.45, 0.45), t0: t0 + (t1 - t0) * s2 + rr(rnd, 0.02, 0.28),
        dur: rr(rnd, 0.48, 0.80), sway: rr(rnd, 0, TAU), tone: rnd()
      });
    }
    /* 未开的花苞 */
    for (i = 0; i < 2; i++) {
      var s3 = rr(rnd, 0.30, 0.92);
      vine.buds.push({
        s: s3, side: rnd() < 0.5 ? -1 : 1, len: rr(rnd, 0.010, 0.017),
        t0: t0 + (t1 - t0) * s3 + rr(rnd, 0.10, 0.42), dur: rr(rnd, 0.5, 0.8),
        rot: rr(rnd, -0.5, 0.5), sway: rr(rnd, 0, TAU)
      });
    }
    return vine;
  }

  function spliceBlossom(bl) {
    bl.wx = bl.x + Math.cos(bl.rot) * bl.r * 0.06;
    bl.wy = bl.y + Math.sin(bl.rot) * bl.r * 0.06;
    blossomsAll.push(bl);
  }

  function buildVines(rnd) {
    var c;
    for (c = 0; c < 4; c++) {
      var t = TT.vines[c];
      vines.push(buildCornerVine(c, rnd, true, t[0], t[1]));
      vines.push(buildCornerVine(c, rnd, false, t[0] + 0.14, t[1] + 0.16));
      var B = [
        [-0.005, -0.030], [0.108, 0.100], [-0.022, 0.245], [0.082, 0.400]
      ];
      var vineB = buildSideVine(c, rnd, B, t[0] + 0.08, t[1] + 0.10);
      vines.push(vineB);
    }
  }

  function buildSideVine(corner, rnd, A, t0, t1) {
    var pts = cubicPts(A[0], A[1], A[2], A[3], 24);
    var world = pts.map(function (p) { return cornerMap(corner, p[0], p[1]); });
    var vine = { pts: world, corner: corner, hero: false, t0: t0, t1: t1, thick: rr(rnd, 0.75, 1.15), branches: [], leaves: [], blossoms: [], buds: [] };
    var i;
    for (i = 0; i < 3; i++) {
      var s = rr(rnd, 0.20, 0.92);
      var anchor = polyAt(pts, s);
      var dx = rr(rnd, 0.045, 0.115), dy = rr(rnd, 0.045, 0.095);
      var bp = cubicPts(
        anchor.p,
        [anchor.p[0] + dx * 0.9, anchor.p[1] + dy * 0.25],
        [anchor.p[0] + dx * rr(rnd, 1.2, 1.7), anchor.p[1] + dy * 0.5],
        [anchor.p[0] + dx * rr(rnd, 1.5, 2.2), anchor.p[1] + dy * rr(rnd, 0.9, 1.5)],
        12
      );
      var bw = bp.map(function (p) { return cornerMap(corner, p[0], p[1]); });
      var bt0 = t0 + (t1 - t0) * s + 0.06;
      var bt1 = bt0 + rr(rnd, 0.40, 0.66);
      var br = { pts: bw, t0: bt0, t1: bt1, thick: vine.thick * rr(rnd, 0.5, 0.8), leaves: [], blossom: null };
      var j, nl = 1 + Math.floor(rnd() * 2);
      for (j = 0; j < nl; j++) {
        br.leaves.push({
          s: rr(rnd, 0.45, 0.98), side: rnd() < 0.5 ? -1 : 1,
          len: rr(rnd, 0.015, 0.031), wid: rr(rnd, 0.36, 0.58),
          rot: rr(rnd, -0.35, 0.35), t0: bt1 + rr(rnd, -0.10, 0.22), dur: rr(rnd, 0.44, 0.72),
          sway: rr(rnd, 0, TAU), tone: rnd()
        });
      }
      vine.branches.push(br);
    }
    for (i = 0; i < 5; i++) {
      var s2 = rr(rnd, 0.14, 0.96);
      vine.leaves.push({
        s: s2, side: rnd() < 0.5 ? -1 : 1,
        len: rr(rnd, 0.015, 0.034), wid: rr(rnd, 0.34, 0.56),
        rot: rr(rnd, -0.4, 0.4), t0: t0 + (t1 - t0) * s2 + rr(rnd, 0.02, 0.26),
        dur: rr(rnd, 0.46, 0.78), sway: rr(rnd, 0, TAU), tone: rnd()
      });
    }
    return vine;
  }

  /* ---------------- 边缘冰晶 ---------------- */
  function buildShards(rnd) {
    var e, i;
    for (e = 0; e < 4; e++) {
      var n = 11;
      for (i = 0; i < n; i++) {
        var u = (i + rr(rnd, 0.10, 0.90)) / n;
        shards.push({
          edge: e, u: u,
          len: rr(rnd, 0.010, 0.052) * (0.6 + 0.4 * Math.sin(u * Math.PI)),
          halfW: rr(rnd, 0.10, 0.30),
          tilt: rr(rnd, -0.42, 0.42),
          t0: TT.shards[0] + rr(rnd, 0, 0.95),
          dur: rr(rnd, 0.5, 0.95),
          a: rr(rnd, 0.18, 0.44)
        });
      }
    }
  }

  /* ---------------- 空气微尘 ---------------- */
  function buildMotes(rnd) {
    var i;
    for (i = 0; i < 52; i++) {
      motes.push({
        x0: rnd(), y0: rnd(),
        r: rr(rnd, 0.0009, 0.0032),
        vy: rr(rnd, 0.006, 0.026),
        sway: rr(rnd, 0.004, 0.020), swayF: rr(rnd, 0.20, 0.62),
        phase: rr(rnd, 0, TAU), a: rr(rnd, 0.16, 0.62),
        t0: rr(rnd, 0.2, 3.4)
      });
    }
  }

  /* ---------------- 闪烁光点 ---------------- */
  function buildTwinkles(rnd) {
    var i;
    for (i = 0; i < 16; i++) {
      twinkles.push({
        x: rnd(), y: rnd(), t0: rr(rnd, 1.4, 5.6),
        period: rr(rnd, 1.6, 3.6), size: rr(rnd, 0.006, 0.020), phase: rr(rnd, 0, TAU)
      });
    }
  }

  /* ---------------- 背景冷光云 ---------------- */
  function buildNebula(rnd) {
    var i;
    for (i = 0; i < 4; i++) {
      nebula.push({
        x: rr(rnd, 0.12, 0.88), y: rr(rnd, 0.18, 0.82),
        r: rr(rnd, 0.34, 0.62), a: rr(rnd, 0.30, 0.62),
        dx: rr(rnd, -0.012, 0.012), dy: rr(rnd, -0.010, 0.010),
        f: rr(rnd, 0.05, 0.14), phase: rr(rnd, 0, TAU), which: i % 2
      });
    }
  }

  /* ---------------- 飘落花瓣 ---------------- */
  function buildPetals(rnd) {
    var win = TT.petals, i, j;
    for (i = 0; i < blossomsAll.length; i++) {
      var bl = blossomsAll[i];
      var n = 3;
      for (j = 0; j < n; j++) {
        var life = rr(rnd, 2.6, 4.4);
        var t0 = rr(rnd, win[0], win[1]);
        var down = bl.y < 0.5 ? 1 : (rnd() < 0.75 ? 1 : -0.35);
        petals.push({
          x0: bl.wx, y0: bl.wy, t0: t0, life: life,
          size: bl.r * rr(rnd, 0.55, 0.95),
          vx: rr(rnd, -0.022, 0.022), vy: down * rr(rnd, 0.030, 0.062),
          sway: rr(rnd, 0.010, 0.030), swayF: rr(rnd, 0.5, 1.25),
          phase: rr(rnd, 0, TAU),
          rot0: rr(rnd, 0, TAU), rotSp: rr(rnd, -1.4, 1.4),
          tone: rnd()
        });
      }
    }
  }

  function buildAll() {
    var rnd = mulberry32(20241109);
    cracks = []; vines = []; shards = []; motes = []; petals = [];
    twinkles = []; nebula = []; blossomsAll = [];
    buildCracks(rnd);
    buildVines(rnd);
    buildShards(rnd);
    buildMotes(rnd);
    buildTwinkles(rnd);
    buildNebula(rnd);
    buildPetals(rnd);
  }


  /* ============================================================
     画布与渲染
     ============================================================ */
  /* alpha:false —— 画布始终不透明，合成器可省掉每帧一次全屏混合 */
  var ctx = cv.getContext('2d', { alpha: false });
  var W = 0, H = 0, M = 1, S = 1, DPR = 1, RS = 1, quality = 1, grainPattern = null;

  function hex2rgb(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(c1, c2, p) {
    return [Math.round(lerp(c1[0], c2[0], p)), Math.round(lerp(c1[1], c2[1], p)), Math.round(lerp(c1[2], c2[2], p))];
  }
  function theme() {
    if (CONFIG.themeObj) {
      var o = CONFIG.themeObj;
      if (!o.glowRgb) { o.glowRgb = hex2rgb(o.glow); o.coreRgb = hex2rgb(o.core); }
      return o;
    }
    var th = THEMES[CONFIG.theme] || THEMES.ice;
    if (!th.glowRgb) { th.glowRgb = hex2rgb(th.glow); th.coreRgb = hex2rgb(th.core); }
    return th;
  }

  function makeGrain() {
    var g = doc.createElement('canvas');
    g.width = g.height = 128;
    var gx = g.getContext('2d');
    var img = gx.createImageData(128, 128);
    var rnd = mulberry32(777);
    var i, v;
    for (i = 0; i < 128 * 128; i++) {
      v = 128 + (rnd() - 0.5) * 200;
      img.data[i * 4] = v; img.data[i * 4 + 1] = v; img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255;
    }
    gx.putImageData(img, 0, 0);
    return g;
  }

  function resize() {
    DPR = Math.min(win.devicePixelRatio || 1, 2);
    RS = DPR * quality;
    W = Math.max(1, cv.clientWidth || rootEl.clientWidth || win.innerWidth);
    H = Math.max(1, cv.clientHeight || rootEl.clientHeight || win.innerHeight);
    cv.width = Math.max(1, Math.round(W * RS));
    cv.height = Math.max(1, Math.round(H * RS));
    ctx.setTransform(RS, 0, 0, RS, 0, 0);
    M = Math.min(W, H);
    S = clamp(M / 950, 0.62, 1.85);
    bgDirty = true;
    vigDirty = true;
    /* 尺寸变了，字的 x 缓存作废 */
    if (titleChars) { var ci; for (ci = 0; ci < titleChars.length; ci++) titleChars[ci].cx = -1; }
    if (subChars) { var cj; for (cj = 0; cj < subChars.length; cj++) subChars[cj].cx = -1; }
    if (!grainPattern) grainPattern = ctx.createPattern(makeGrain(), 'repeat');
    render(TIME, true);
  }

  /* ---------------- 背景：黑场 + 冷光云 + 中心辉光 + 入场闪白 ---------------- */
  /* ---------- 背景烘焙 ----------
     光云 + 中心辉光变化极慢，没必要每帧重算 5 次全屏渐变。
     烘焙到离屏 canvas，之后每帧只做 1 次 blit；呼吸/漂移用变换实现。 */
  var bgCache = null, bgDirty = true;

  function bakeBackground() {
    if (!bgCache) bgCache = doc.createElement('canvas');
    var bw = Math.max(1, Math.round(W * RS));
    var bh = Math.max(1, Math.round(H * RS));
    if (bgCache.width !== bw || bgCache.height !== bh) {
      bgCache.width = bw;
      bgCache.height = bh;
    }
    var g = bgCache.getContext('2d');
    g.setTransform(RS, 0, 0, RS, 0, 0);
    g.clearRect(0, 0, W, H);
    var th = theme();
    var i, nb, x, y, r, grd, col;
    for (i = 0; i < nebula.length; i++) {
      nb = nebula[i];
      x = nb.x * W; y = nb.y * H; r = nb.r * M;
      col = nb.which ? th.halo : th.halo2;
      grd = g.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, col.replace('ALPHA', (0.50 * nb.a).toFixed(3)));
      grd.addColorStop(0.55, col.replace('ALPHA', (0.16 * nb.a).toFixed(3)));
      grd.addColorStop(1, col.replace('ALPHA', '0'));
      g.fillStyle = grd;
      g.beginPath();
      g.arc(x, y, r, 0, TAU);
      g.fill();
    }
    var rx = M * 0.84;
    grd = g.createRadialGradient(W * 0.5, H * 0.47, 0, W * 0.5, H * 0.47, rx);
    grd.addColorStop(0, th.halo.replace('ALPHA', '0.39'));
    grd.addColorStop(0.6, th.halo.replace('ALPHA', '0.105'));
    grd.addColorStop(1, th.halo.replace('ALPHA', '0'));
    g.fillStyle = grd;
    g.beginPath();
    g.arc(W * 0.5, H * 0.47, rx, 0, TAU);
    g.fill();
  }

  function drawBackground(t) {
    var th = theme();
    var show = seg(t, TT.halo[0], TT.halo[1], eInOutCubic) * (1 - seg(t, TT.outBg[0], TT.outBg[1], eInOutCubic));
    if (show > 0.003) {
      if (bgDirty) { bakeBackground(); bgDirty = false; }
      var bk = 1 + 0.035 * Math.sin(t * 0.42);
      var bx = 7 * Math.sin(t * 0.05);
      var by = 5 * Math.cos(t * 0.037);
      ctx.globalAlpha = show;
      ctx.drawImage(bgCache,
        (W - W * bk) * 0.5 + bx, (H - H * bk) * 0.5 + by,
        W * bk, H * bk);
      ctx.globalAlpha = 1;
    }
  }

  /* 开场闪白：用真实时间 t，不能用 story(t) ——
     否则倒放时它会在结尾"倒着重播"，越接近结尾画面越白 */
  function drawFlash(t) {
    if (!CONFIG.flash) return;
    if (!(t > TT.flash[0] && t < TT.flash[1] + 0.6)) return;
    var fl = seg(t, TT.flash[0], TT.flash[1], eOutCubic);
    var fa = (1 - fl) * 0.15;
    if (fa <= 0.002) return;
    ctx.fillStyle = 'rgba(214,240,255,' + fa.toFixed(3) + ')';
    ctx.fillRect(0, 0, W, H);
  }

  /* ---------------- 冰裂纹 ---------------- */
  function crackY(line, x) {
    return line.y + line.amp * Math.sin(x * line.freq * TAU + line.phase)
         + line.amp * 0.42 * Math.sin(x * line.freq * 2.3 * TAU + line.phase * 1.9);
  }
  /* 不用 shadowBlur（每次描边都会多一遍模糊，代价高），
     改用几层由粗到细的描边叠出辉光 */
  function paintWavy(xa, xb, line, color, width) {
    if (xb - xa < 0.7) return;
    ctx.beginPath();
    var step = 6, x, first = true, y;
    for (x = xa; x <= xb; x += step) {
      y = crackY(line, x / W) * H;
      if (first) { ctx.moveTo(x, y); first = false; } else { ctx.lineTo(x, y); }
    }
    ctx.lineTo(xb, crackY(line, xb / W) * H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  function growthRanges(dir, p) {
    if (dir === 'ltr') return [[0, p, 1]];
    if (dir === 'rtl') return [[1 - p, 1, -1]];
    if (dir === 'center') return [[0.5 - p * 0.5, 0.5, -1], [0.5, 0.5 + p * 0.5, 1]];
    return [[0, p * 0.5, 1], [1 - p * 0.5, 1, -1]];
  }

  function drawCracks(t) {
    var th = theme();
    if (lineWipe >= 0.999) return;
    var wipeA = lineWipe > 0.001 ? wipeGrad(th.line) : rgba(th.line, 1);
    var wipeB = lineWipe > 0.001 ? wipeGrad([255, 255, 255]) : 'rgba(255,255,255,1)';
    var br = 0.5 + 0.5 * Math.sin(t * 0.55);
    var i, r, L, p, ranges, alpha, xa, xb, tip, tx, ty, g;

    for (i = 0; i < cracks.length; i++) {
      L = cracks[i];
      p = seg(t, L.t0, L.t1, eInOutSine);
      if (p <= 0) continue;
      ranges = growthRanges(L.dir, p);
      alpha = L.a * (0.84 + 0.16 * br);

      for (r = 0; r < ranges.length; r++) {
        xa = ranges[r][0] * W;
        xb = ranges[r][1] * W;
        ctx.globalAlpha = alpha * 0.09; paintWavy(xa, xb, L, wipeA, L.thick * 8.0);
        ctx.globalAlpha = alpha * 0.17; paintWavy(xa, xb, L, wipeA, L.thick * 3.8);
        ctx.globalAlpha = alpha * 0.30; paintWavy(xa, xb, L, wipeA, L.thick * 1.8);
        ctx.globalAlpha = alpha * 0.72; paintWavy(xa, xb, L, wipeA, L.thick);
        ctx.globalAlpha = alpha * 0.46; paintWavy(xa, xb, L, wipeB, Math.max(0.45, L.thick * 0.42));
        ctx.globalAlpha = 1;

        /* 生长端点的高光 */
        tip = ranges[r][2];
        tx = (tip > 0 ? ranges[r][1] : ranges[r][0]) * W;
        ty = crackY(L, tx / W) * H;
        var tp = 1 - p;
        var ga = (0.34 + 0.66 * tp) * L.a * wipeVis(tx / W);
        if (ga > 0.01) {
          var rr0 = 17 * S * (1 + tp);
          g = ctx.createRadialGradient(tx, ty, 0, tx, ty, rr0);
          g.addColorStop(0, 'rgba(255,255,255,' + (0.55 * ga).toFixed(3) + ')');
          g.addColorStop(0.30, rgba(th.glowRgb, 0.34 * ga));
          g.addColorStop(1, rgba(th.glowRgb, 0));
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(tx, ty, rr0, 0, TAU); ctx.fill();
        }
      }

      /* 分叉 */
      var j, B, q, ax, ay, pts, nb, upto, k, X, Y, first;
      for (j = 0; j < L.branches.length; j++) {
        B = L.branches[j];
        q = seg(t, B.t0, B.t0 + B.dur, eOutCubic);
        if (q <= 0) continue;
        var bk = wipeVis(B.x);
        if (bk <= 0.004) continue;
        ax = B.x * W;
        ay = crackY(L, B.x) * H;
        pts = B.pts;
        nb = pts.length - 1;
        upto = Math.max(1, Math.floor(nb * q));
        first = true;
        ctx.save();
        ctx.beginPath();
        for (k = 0; k <= upto; k++) {
          X = ax + pts[k][0] * M;
          Y = ay + pts[k][1] * M;
          if (first) { ctx.moveTo(X, Y); first = false; } else { ctx.lineTo(X, Y); }
        }
        ctx.lineCap = 'round';
        ctx.lineWidth = B.thick * 3.0;
        ctx.strokeStyle = rgba(th.line, B.a * 0.16 * bk);
        ctx.stroke();
        ctx.lineWidth = B.thick;
        ctx.strokeStyle = rgba(th.line, B.a * 0.72 * bk);
        ctx.stroke();
        ctx.restore();
      }

      /* 珍珠光点 */
      var m, P, e, px, py2, pr, pa;
      for (m = 0; m < L.pearls.length; m++) {
        P = L.pearls[m];
        e = seg(t, P.t0, P.t0 + 0.55, eOutCubic);
        if (e <= 0.01) continue;
        px = P.xf * W;
        py2 = crackY(L, P.xf) * H + Math.sin(t * 1.35 + P.phase) * P.amp * S;
        pr = P.r * S * (0.82 + 0.18 * Math.sin(t * 1.9 + P.phase));
        var pk = wipeVis(P.xf);
        if (pk <= 0.004) continue;
        pa = P.a * e * pk;
        g = ctx.createRadialGradient(px, py2, 0, px, py2, pr * 3.4);
        g.addColorStop(0, 'rgba(255,255,255,' + (0.78 * pa).toFixed(3) + ')');
        g.addColorStop(0.22, rgba(th.glowRgb, 0.34 * pa));
        g.addColorStop(1, rgba(th.glowRgb, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py2, pr * 3.4, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,' + (0.92 * pa).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(px, py2, pr * 0.55, 0, TAU); ctx.fill();
      }

      /* 游走光星 */
      var s2, SP, xf, sx, sy, sa;
      for (s2 = 0; s2 < L.sparks.length; s2++) {
        SP = L.sparks[s2];
        xf = SP.off + t * SP.speed;
        xf = xf - Math.floor(xf);
        sx = xf * W;
        sy = crackY(L, xf) * H;
        sa = p * 0.85 * wipeVis(xf);
        if (sa <= 0.01) continue;
        var sr = SP.size * M * 1.6;
        g = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 5);
        g.addColorStop(0, 'rgba(255,255,255,' + (0.75 * sa).toFixed(3) + ')');
        g.addColorStop(0.3, rgba(th.glowRgb, 0.30 * sa));
        g.addColorStop(1, rgba(th.glowRgb, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(sx, sy, sr * 5, 0, TAU); ctx.fill();
      }
    }
  }

  /* ---------------- 藤蔓 / 叶 / 花 ---------------- */
  function dirAt(pts, s) {
    var a = polyAt(pts, s);
    var bx = a.p[0] * W, by = a.p[1] * H;
    var ex = (a.p[0] + a.d[0] * 0.01) * W, ey = (a.p[1] + a.d[1] * 0.01) * H;
    var dx = ex - bx, dy = ey - by, dl = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: bx, y: by, dx: dx / dl, dy: dy / dl };
  }

  function drawLeaf(bx, by, ang, len, wid, sc, alpha, tone) {
    if (sc <= 0.002 || alpha <= 0.004) return;
    var th = theme();
    var L = len * sc, Wd = len * wid * sc;
    var ca = Math.cos(ang), sa = Math.sin(ang);
    var tx = bx + ca * L, ty = by + sa * L;
    var nx = -sa, ny = ca;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.bezierCurveTo(
      bx + ca * L * 0.34 + nx * Wd, by + sa * L * 0.34 + ny * Wd,
      bx + ca * L * 0.80 + nx * Wd * 0.72, by + sa * L * 0.80 + ny * Wd * 0.72,
      tx, ty
    );
    ctx.bezierCurveTo(
      bx + ca * L * 0.80 - nx * Wd * 0.72, by + sa * L * 0.80 - ny * Wd * 0.72,
      bx + ca * L * 0.34 - nx * Wd, by + sa * L * 0.34 - ny * Wd,
      bx, by
    );
    ctx.closePath();
    var col = mix(th.leaf, th.leafTip, 0.28 + tone * 0.68);
    ctx.fillStyle = rgba(col, 0.30 * alpha);
    ctx.fill();
    ctx.strokeStyle = rgba(th.leafTip, 0.24 * alpha);
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = rgba(th.leafTip, 0.15 * alpha);
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  function drawStemPath(pts, upto, th) {
    var i, X, Y, first = true;
    ctx.beginPath();
    for (i = 0; i <= upto; i++) {
      X = pts[i][0] * W; Y = pts[i][1] * H;
      if (first) { ctx.moveTo(X, Y); first = false; } else { ctx.lineTo(X, Y); }
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = 4.2; ctx.strokeStyle = rgba(th.vine, 0.055); ctx.stroke();
    ctx.lineWidth = 2.2; ctx.strokeStyle = rgba(th.vine, 0.10); ctx.stroke();
    ctx.lineWidth = 1.05; ctx.strokeStyle = rgba(th.vine, 0.48); ctx.stroke();
  }

  function drawBlossom(B, st, rt) {
    var bloom = seg(st, B.t0, B.t0 + 0.9, eOutBack);
    if (bloom <= 0.004) return;
    var th = theme();
    var x = B.wx * W, y = B.wy * H;
    var r = B.r * M * (0.35 + 0.65 * bloom);
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.6);
    g.addColorStop(0, rgba(th.glowRgb, 0.15 * bloom));
    g.addColorStop(0.45, rgba(th.glowRgb, 0.045));
    g.addColorStop(1, rgba(th.glowRgb, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 4.6, 0, TAU); ctx.fill();

    var spin = B.rot + rt * B.spin;
    var i, a, pet;
    for (i = 0; i < B.petals; i++) {
      a = spin + (i / B.petals) * TAU;
      pet = 1 + 0.06 * Math.sin(rt * 1.1 + i * 1.7);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.64 * pet, r * 0.28, r * 0.74 * pet, 0, 0, TAU);
      ctx.fillStyle = rgba(th.blossom, 0.44);
      ctx.fill();
      ctx.strokeStyle = rgba(th.blossomHi, 0.30);
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    }
    var g2 = ctx.createRadialGradient(x, y, 0, x, y, r * 0.95);
    g2.addColorStop(0, rgba(th.coreRgb, 0.95));
    g2.addColorStop(0.45, rgba(th.blossomHi, 0.45));
    g2.addColorStop(1, rgba(th.blossomHi, 0));
    ctx.fillStyle = g2;
    ctx.beginPath(); ctx.arc(x, y, r * 0.95, 0, TAU); ctx.fill();
  }

  function drawVine(V, st, rt) {
    var p = seg(st, V.t0, V.t1, eOutCubic);
    if (p <= 0) return;
    var th = theme();
    var pts = V.pts, n = pts.length;
    var upto = Math.max(1, Math.floor((n - 1) * p));
    ctx.save();
    drawStemPath(pts, upto, th);
    ctx.restore();

    var i, d, sc, ang, bq;

    /* 侧枝 */
    for (i = 0; i < V.branches.length; i++) {
      var B = V.branches[i];
      bq = seg(st, B.t0, B.t1, eOutCubic);
      if (bq <= 0) continue;
      var bn = B.pts.length;
      var bup = Math.max(1, Math.floor((bn - 1) * bq));
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      drawStemPath(B.pts, bup, th);
      ctx.restore();

      var j, lf;
      for (j = 0; j < B.leaves.length; j++) {
        lf = B.leaves[j];
        sc = seg(st, lf.t0, lf.t0 + lf.dur, eOutBack);
        if (sc <= 0.002) continue;
        d = dirAt(B.pts, lf.s);
        ang = Math.atan2(d.dy, d.dx) + lf.side * Math.PI * 0.5 + lf.rot + Math.sin(rt * 0.75 + lf.sway) * 0.07;
        drawLeaf(d.x, d.y, ang, lf.len * M, lf.wid, sc, 1, lf.tone);
      }
      if (B.blossom) drawBlossom(B.blossom, st, rt);
    }

    /* 主蔓叶片 */
    for (i = 0; i < V.leaves.length; i++) {
      var lf2 = V.leaves[i];
      sc = seg(st, lf2.t0, lf2.t0 + lf2.dur, eOutBack);
      if (sc <= 0.002) continue;
      d = dirAt(pts, lf2.s);
      ang = Math.atan2(d.dy, d.dx) + lf2.side * Math.PI * 0.5 + lf2.rot + Math.sin(rt * 0.72 + lf2.sway) * 0.07;
      drawLeaf(d.x, d.y, ang, lf2.len * M, lf2.wid, sc, 1, lf2.tone);
    }

    /* 花苞 */
    for (i = 0; i < V.buds.length; i++) {
      var bd = V.buds[i];
      sc = seg(st, bd.t0, bd.t0 + bd.dur, eOutBack);
      if (sc <= 0.002) continue;
      d = dirAt(pts, bd.s);
      var dl = bd.len * M * sc;
      ang = Math.atan2(d.dy, d.dx) + bd.side * Math.PI * 0.5 + bd.rot + Math.sin(rt * 0.68 + bd.sway) * 0.06;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.ellipse(dl * 0.6, 0, dl * 0.9, dl * 0.44, 0, 0, TAU);
      ctx.fillStyle = rgba(mix(th.leaf, th.blossom, 0.5), 0.32);
      ctx.fill();
      ctx.strokeStyle = rgba(th.blossomHi, 0.20);
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawVines(st, rt) {
    var i;
    for (i = 0; i < vines.length; i++) drawVine(vines[i], st, rt);
  }

  /* ---------------- 边缘冰晶 ---------------- */
  function drawShards(t) {
    var th = theme();
    var i, e;

    /* 边缘霜线 */
    var rim = 0.14 * seg(t, TT.shards[0], TT.shards[0] + 0.9, eOutCubic);
    if (rim > 0.004) {
      var g;
      for (e = 0; e < 4; e++) {
        if (e === 0 || e === 1) {
          g = ctx.createLinearGradient(0, 0, W, 0);
        } else {
          g = ctx.createLinearGradient(0, 0, 0, H);
        }
        g.addColorStop(0, rgba(th.shard, 0));
        g.addColorStop(0.25, rgba(th.shard, rim * 0.6));
        g.addColorStop(0.5, rgba(th.shard, rim));
        g.addColorStop(0.75, rgba(th.shard, rim * 0.6));
        g.addColorStop(1, rgba(th.shard, 0));
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (e === 0) { ctx.moveTo(0, 0.6); ctx.lineTo(W, 0.6); }
        else if (e === 1) { ctx.moveTo(0, H - 0.6); ctx.lineTo(W, H - 0.6); }
        else if (e === 2) { ctx.moveTo(0.6, 0); ctx.lineTo(0.6, H); }
        else { ctx.moveTo(W - 0.6, 0); ctx.lineTo(W - 0.6, H); }
        ctx.stroke();
      }
    }

    for (i = 0; i < shards.length; i++) {
      var s = shards[i];
      var p = seg(t, s.t0, s.t0 + s.dur, eOutCubic);
      if (p <= 0) continue;
      var len = s.len * M * p;
      var hw = len * s.halfW;
      var bx, by, tx, ty;
      if (s.edge === 0) { bx = s.u * W; by = 0; tx = bx + s.tilt * len; ty = len; }
      else if (s.edge === 1) { bx = s.u * W; by = H; tx = bx + s.tilt * len; ty = H - len; }
      else if (s.edge === 2) { bx = 0; by = s.u * H; tx = len; ty = by + s.tilt * len; }
      else { bx = W; by = s.u * H; tx = W - len; ty = by + s.tilt * len; }
      var dx = tx - bx, dy = ty - by, dlen = Math.sqrt(dx * dx + dy * dy) || 1;
      var pxv = -dy / dlen * hw, pyv = dx / dlen * hw;
      var gg = ctx.createLinearGradient(bx, by, tx, ty);
      gg.addColorStop(0, rgba(th.shard, s.a));
      gg.addColorStop(0.5, rgba(th.shard, s.a * 0.55));
      gg.addColorStop(1, rgba(th.shard, 0));
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.moveTo(bx + pxv, by + pyv);
      ctx.lineTo(tx, ty);
      ctx.lineTo(bx - pxv, by - pyv);
      ctx.closePath();
      ctx.fill();
    }
  }

  /* ---------------- 微尘 / 花瓣 / 闪光 ---------------- */
  function drawMotes(t) {
    var th = theme();
    var amb = seg(t, TT.halo[0], TT.halo[1], eInOutCubic) * (1 - seg(t, TT.outBg[0], TT.outBg[1], eInOutCubic));
    var i, m, lt, y, x, a;
    for (i = 0; i < motes.length; i++) {
      m = motes[i];
      lt = t - m.t0;
      if (lt < 0) continue;
      y = m.y0 - m.vy * lt;
      y = y - Math.floor(y);
      x = m.x0 + Math.sin(lt * m.swayF * TAU * 0.4 + m.phase) * m.sway;
      a = m.a * amb * Math.min(1, lt / 1.4) * (0.55 + 0.45 * Math.sin(t * 1.6 + m.phase));
      if (a <= 0.006) continue;
      ctx.fillStyle = rgba(th.mote, a * 0.85);
      ctx.beginPath();
      ctx.arc(x * W, y * H, Math.max(0.35, m.r * M), 0, TAU);
      ctx.fill();
    }
  }

  function drawPetals(t) {
    var th = theme();
    var i, P, lt, k, a, x, y, rot, sz;
    for (i = 0; i < petals.length; i++) {
      P = petals[i];
      lt = t - P.t0;
      if (lt < 0 || lt > P.life) continue;
      k = lt / P.life;
      a = Math.min(1, lt / 0.55) * (1 - seg(k, 0.60, 1, eInCubic));
      if (a <= 0.006) continue;
      x = P.x0 + P.vx * lt + Math.sin(lt * P.swayF * TAU * 0.5 + P.phase) * P.sway;
      y = P.y0 + P.vy * lt;
      if (y > 1.05 || x < -0.05 || x > 1.05) continue;
      rot = P.rot0 + P.rotSp * lt;
      sz = P.size * M * (0.86 + 0.14 * Math.sin(lt * 2.1 + P.phase));
      ctx.save();
      ctx.translate(x * W, y * H);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, sz * 0.40, sz * 0.70, 0, 0, TAU);
      ctx.fillStyle = rgba(th.blossom, 0.48 * a);
      ctx.fill();
      ctx.strokeStyle = rgba(th.blossomHi, 0.20 * a);
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawTwinkles(t) {
    var th = theme();
    var amb = seg(t, TT.halo[0], TT.halo[1], eInOutCubic) * (1 - seg(t, TT.outBg[0], TT.outBg[1], eInOutCubic));
    var i, s, tw, sz, x, y, g;
    for (i = 0; i < twinkles.length; i++) {
      s = twinkles[i];
      tw = Math.sin((t - s.t0) / s.period * TAU + s.phase);
      if (tw <= 0.05) continue;
      tw = Math.pow(tw, 1.6);
      sz = s.size * M * tw;
      x = s.x * W; y = s.y * H;
      g = ctx.createRadialGradient(x, y, 0, x, y, sz * 3.4);
      g.addColorStop(0, rgba(th.mote, 0.42 * tw * amb));
      g.addColorStop(1, rgba(th.glowRgb, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, sz * 3.4, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba([255, 255, 255], 0.48 * tw * amb);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - sz * 2.1, y); ctx.lineTo(x + sz * 2.1, y);
      ctx.moveTo(x, y - sz * 2.1); ctx.lineTo(x, y + sz * 2.1);
      ctx.stroke();
    }
  }

  /* ---------------- 文字下方的承接暗场（提升可读性） ---------------- */
  function drawTextPool(t) {
    var q = seg(t, TT.title[0] - 0.25, TT.title[0] + 0.85, eInOutCubic) * wipeVis(0.5);
    if (q <= 0.004) return;
    var cx = W * 0.5, cy = H * 0.44;
    var rx = Math.min(W * 0.36, M * 1.02), ry = Math.min(H * 0.21, M * 0.32);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rx, ry);
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, 'rgba(0,0,0,' + (0.44 * q).toFixed(3) + ')');
    g.addColorStop(0.42, 'rgba(0,0,0,' + (0.24 * q).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  /* ---------------- 暗角 + 颗粒 ---------------- */
  var vigCache = null, vigDirty = true;

  function bakeVignette() {
    if (!vigCache) vigCache = doc.createElement('canvas');
    var bw = Math.max(1, Math.round(W * RS));
    var bh = Math.max(1, Math.round(H * RS));
    if (vigCache.width !== bw || vigCache.height !== bh) {
      vigCache.width = bw;
      vigCache.height = bh;
    }
    var g = vigCache.getContext('2d');
    g.setTransform(RS, 0, 0, RS, 0, 0);
    g.clearRect(0, 0, W, H);
    var cx = W * 0.5, cy = H * 0.5;
    var R = Math.sqrt(cx * cx + cy * cy);
    var grd = g.createRadialGradient(cx, cy, R * 0.20, cx, cy, R * 1.02);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(0.52, 'rgba(0,0,0,0.13)');
    grd.addColorStop(0.80, 'rgba(0,0,0,0.36)');
    grd.addColorStop(1, 'rgba(0,0,0,0.74)');
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);
  }

  function drawVignette(t) {
    if (vigDirty) { bakeVignette(); vigDirty = false; }
    var k = 1 + 0.05 * Math.sin(t * 0.5);
    ctx.drawImage(vigCache, (W - W * k) * 0.5, (H - H * k) * 0.5, W * k, H * k);
  }

  function drawGrain(t) {
    if (!grainPattern) return;
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.globalCompositeOperation = 'overlay';
    var ox = (t * 61) % 128, oy = (t * 97) % 128;
    ctx.translate(-ox, -oy);
    ctx.fillStyle = grainPattern;
    ctx.fillRect(0, 0, W + 130, H + 130);
    ctx.restore();
  }


  /* ============================================================
     文字：逐字淡入 + 流光 + 逐字淡出
     ============================================================ */
  var titleChars = [], subChars = [];

  function buildChars(host, text, win, baseAlpha, isTitle, th) {
    host.innerHTML = '';
    var out = [];
    var n = text.length;
    var dur = win * 0.45;
    var stagger = n > 1 ? (win - dur) / (n - 1) : 0;
    var i, s;
    for (i = 0; i < n; i++) {
      s = document.createElement('span');
      s.className = 'ifx-ch';
      s.textContent = text.charAt(i);
      if (isTitle) {
        s.style.backgroundImage = 'linear-gradient(100deg, ' + th.textA + ' 0%, ' + th.textB + ' 44%, ' + th.textA + ' 96%)';
      }
      host.appendChild(s);
      out.push({
        el: s, i: i,
        t0: win === 0 ? 0 : (isTitle ? TT.title[0] : TT.subtitle[0]) + i * stagger,
        dur: dur, base: baseAlpha,
        cx: -1                       /* 缓存字心 x（归一化），供波前判断 */
      });
    }
    return out;
  }

  function buildText() {
    var th = theme();
    var wTitle = TT.title[1] - TT.title[0];
    var wSub = TT.subtitle[1] - TT.subtitle[0];
    titleChars = buildChars(titleEl, CONFIG.title, wTitle, 1, true, th);
    subChars = buildChars(subEl, CONFIG.subtitle, wSub, 0.80, false, th);
  }

  /* 量化 + 变化才写：稳定期每帧写入从 14x6 次降到个位数（CSS filter 很贵） */
  function styleChars(arr, t, th, isTitle) {
    var i, c, pin, pout, p, a, glow, blur, ty, sc, bp, q;
    /* 先批量把缺的字心 x 读完，避免"边写样式边读布局"触发多次强制重排 */
    for (i = 0; i < arr.length; i++) {
      c = arr[i];
      if (c.cx < 0) c.cx = (c.el.offsetLeft + c.el.offsetWidth * 0.5) / W;
    }
    for (i = 0; i < arr.length; i++) {
      c = arr[i];
      pin = seg(t, c.t0, c.t0 + c.dur, eOutCubic);        /* 入场 */
      var wv = wipeVis(c.cx);                             /* 和线共用同一道波：该字处的可见度 */
      pout = 1 - wv;                                      /* 淡出进度（用于上浮/虚化） */
      p = pin * wv;                                       /* 可见度 = 入场 × 波前可见度 */
      if (p <= 0.002) {
        if (c.vis !== 0) {
          c.el.style.opacity = '0';
          c.el.style.filter = 'none';
          c.vis = 0;
        }
        continue;
      }
      q = Math.round(pin * 150) * 1000 + Math.round(pout * 150);
      if (q !== c.pq || c.vis !== 1) {
        c.pq = q;
        c.vis = 1;
        a = p * c.base;
        /* 入场形变只看 pin；淡出是纯透明度过渡，只加一点上浮和虚化 */
        ty = (1 - pin) * (isTitle ? 0.20 : 0.38) - pout * (isTitle ? 0.05 : 0.09);
        sc = isTitle ? 0.935 + 0.065 * pin : 1;
        blur = (1 - pin) * (isTitle ? 7.5 : 4.5) + pout * 1.2;
        glow = (isTitle ? 8 + 16 * pin : 4.5 + 8 * pin) * (1 - 0.6 * pout);
        c.el.style.opacity = a.toFixed(3);
        c.el.style.transform = 'translateY(' + ty.toFixed(3) + 'em) scale(' + sc.toFixed(3) + ')';
        c.el.style.filter = 'blur(' + blur.toFixed(2) + 'px) drop-shadow(0 0 ' + glow.toFixed(1) + 'px ' + th.glow + ')';
      }
      if (isTitle) {
        bp = Math.round((104 - pin * 42 + Math.sin(t * 1.15 + i * 0.55) * 9 + i * 7) * 2) / 2;
        if (bp !== c.bq) {
          c.bq = bp;
          c.el.style.backgroundPosition = bp.toFixed(1) + '% 50%';
        }
      }
    }
  }

  function updateText(t) {
    var th = theme();
    styleChars(titleChars, t, th, true);
    styleChars(subChars, t, th, false);

    var rp = seg(t, TT.rule[0], TT.rule[1], eOutCubic) * wipeVis(0.5);
    var pulse = 0.86 + 0.14 * Math.sin(t * 2.2);
    ruleEl.style.opacity = (rp * 0.95).toFixed(3);
    ruleEl.style.transform = 'scaleX(' + (0.15 + 0.85 * rp).toFixed(3) + ')';
    ruleEl.style.filter = 'drop-shadow(0 0 ' + (7 * pulse * rp).toFixed(1) + 'px ' + th.glow + ')';
  }


  /* ============================================================
     主渲染
     ============================================================ */
  /* 分层开关：api.skip.bg = true 可单独关掉某层做性能剖析 */
  var SKIP = {};

  function render(t) {
    var s = story(t);          /* 倒放：t 超过 rewind[0] 之后时间开始往回走 */
    lineWipe = seg(t, TT.outLine[0], TT.outLine[1], eInOutSine);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    if (!SKIP.bg) { drawBackground(t); drawFlash(t); }
    if (!SKIP.shards) drawShards(s);       /* 边缘冰晶：倒放收回 */
    if (!SKIP.cracks) drawCracks(t);       /* 线：真实时间 + 自左向右的过渡渐隐 */
    if (!SKIP.motes) drawMotes(t);
    if (!SKIP.pool) drawTextPool(t);
    if (!SKIP.vig) drawVignette(t);
    if (!SKIP.vines) drawVines(s, t);      /* 花与藤蔓：呈现用倒放时间，摇曳用真实时间 */
    if (!SKIP.petals) drawPetals(t);
    if (!SKIP.twinkles) drawTwinkles(t);
    if (!SKIP.grain) drawGrain(t);
    if (!SKIP.text) updateText(t);
  }

  /* ============================================================
     时间轴与交互
     ============================================================ */
  var TIME = 0, PAUSED = false, LAST = 0;

  /* 自适应分辨率：弱机自动降内部渲染分辨率（这种软辉光特效几乎看不出来）
     基准用滑动窗口的第 10 百分位（≈刷新周期），而不是历史最小值 ——
     否则启动时某一帧特别慢会把基准污染成很大的值，导致永远不降档。 */
  var frameBuf = [], statAvg = 0, vsync = 16.7, qCooldown = 0;

  function adaptQuality(dtms) {
    statAvg = statAvg ? statAvg * 0.92 + dtms * 0.08 : dtms;
    if (dtms < 0.2 || dtms > 200) return;      /* 忽略切标签页等异常帧 */
    frameBuf.push(dtms);
    if (frameBuf.length < 60) return;
    var s = frameBuf.slice().sort(function (a, b) { return a - b; });
    var floor = s[Math.floor(s.length * 0.1)];
    var avg = 0, i;
    for (i = 0; i < s.length; i++) avg += s[i];
    avg /= s.length;
    frameBuf.length = 0;
    /* 刷新周期基准：变快立刻采信，变慢每窗口只放宽 1.2%
       （若"每一帧都慢"，百分位也会跟着变大，那样就永远测不出慢） */
    if (floor < vsync) vsync = floor;
    else vsync = Math.min(24, vsync * 1.012);
    if (qCooldown > 0) { qCooldown--; return; }
    if (avg > vsync * 1.35 && quality > 0.6) { quality *= 0.82; qCooldown = 3; }
    else if (avg < vsync * 1.10 && quality < 1) { quality = Math.min(1, quality / 0.82); qCooldown = 3; }
    else return;
    resize();
  }

  function loop(now) {
    if (DEAD) return;
    rafId = requestAnimationFrame(loop);
    if (!LAST) LAST = now;
    var dt = (now - LAST) / 1000;
    LAST = now;
    if (dt > 0.08) dt = 0.08;
    adaptQuality(dt * 1000);
    if (!PAUSED) {
      TIME += dt * SPEED;
      if (TIME > TT.total) {
        if (CONFIG.loop) { TIME = 0; }
        else { TIME = TT.total; PAUSED = true; if (CONFIG.onEnd) CONFIG.onEnd(); }
      }
    }
    render(TIME);
    syncUI(false);
  }

  function restart() {
    TIME = 0;
    PAUSED = false;
    LAST = 0;
    showUI(true);
    syncUI(true);
  }
  function seek(t) {
    TIME = clamp(t * SPEED, 0, TT.total);
    PAUSED = true;
    render(TIME);
  }

  /* ---------------- 播放控制条状态 ---------------- */
  var btnPlay = null, scrubEl = null, timeEl = null;
  var btnReplay = null, btnLoop = null;
  var scrubbing = false;
  var uiTick = 0;
  var lastScrub = -1;

  function syncUI(force) {
    if (!scrubEl) return;
    var v = Math.round((TIME / SPEED) * 20) / 20;
    if (!scrubbing && v !== lastScrub) {
      lastScrub = v;
      scrubEl.value = v;
    }
    uiTick++;
    if (!force && uiTick % 5 !== 0) return;
    var pct = (TIME / TT.total) * 100;
    scrubEl.style.background = 'linear-gradient(90deg, rgba(170,225,250,.62) ' + pct.toFixed(1) + '%, rgba(180,220,240,.16) ' + pct.toFixed(1) + '%)';
    if (timeEl) timeEl.textContent = (TIME / SPEED).toFixed(1) + ' / ' + DURATION.toFixed(1) + 's';
    if (btnPlay) btnPlay.textContent = PAUSED ? '播放' : '暂停';
  }

  var uiTimer = null;
  function showUI() {
    rootEl.classList.remove('ifx-hidden');
    rootEl.classList.remove('ifx-idle');
    if (uiTimer) clearTimeout(uiTimer);
    uiTimer = setTimeout(function () { rootEl.classList.add('ifx-idle'); }, 4000);
  }

  function applyTheme(name) {
    if (name && typeof name === 'object') {
      var base = THEMES[CONFIG.theme] || THEMES.ice;
      var th = {};
      var k1;
      for (k1 in base) { if (base.hasOwnProperty(k1)) th[k1] = base[k1]; }
      for (k1 in name) { if (name.hasOwnProperty(k1)) th[k1] = name[k1]; }
      th.glowRgb = null;
      th.coreRgb = null;
      CONFIG.themeObj = th;
      CONFIG.theme = name.id || 'custom';
      CONFIG.themePick = 'custom';
    } else {
      var pick = typeof name === 'string' ? name : 'ice';
      CONFIG.themePick = pick;
      /* random：在这里掷一次骰子就定死，整场不会播到一半换色 */
      if (pick === 'random' || pick === 'rand') { pick = RANDOM_POOL[(Math.random() * RANDOM_POOL.length) | 0]; }
      CONFIG.theme = THEMES[pick] ? pick : 'ice';
      CONFIG.themeObj = null;
    }
    var t2 = theme();
    rootEl.style.setProperty('--glow', t2.glow);
    var sw = rootEl.querySelectorAll('.ifx-sw');
    var i;
    for (i = 0; i < sw.length; i++) {
      sw[i].classList.toggle('ifx-on', sw[i].getAttribute('data-t') === (CONFIG.themePick || CONFIG.theme));
    }
    buildText();
    bgDirty = true;
    vigDirty = true;
    render(TIME);
  }

  function bindUI() {
    win.addEventListener('resize', resize);
    if (win.ResizeObserver) {
      try {
        ro = new win.ResizeObserver(function () { resize(); });
        ro.observe(rootEl);
      } catch (e) { ro = null; }
    }
    if (btnPlay) btnPlay.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    if (btnReplay) btnReplay.addEventListener('click', function (e) { e.stopPropagation(); restart(); });
    if (btnLoop) btnLoop.addEventListener('click', function (e) {
      e.stopPropagation();
      CONFIG.loop = !CONFIG.loop;
      btnLoop.textContent = '循环 · ' + (CONFIG.loop ? '开' : '关');
      syncUI(true);
    });
    if (scrubEl) {
      scrubEl.max = DURATION;
      scrubEl.addEventListener('input', function (e) {
        e.stopPropagation();
        scrubbing = true;
        PAUSED = true;
        TIME = clamp(parseFloat(scrubEl.value) * SPEED, 0, TT.total);
        LAST = 0;
        render(TIME);
        syncUI(true);
      });
      scrubEl.addEventListener('change', function () {
        scrubbing = false;
        if (CONFIG.autoResume !== false) PAUSED = false;
        LAST = 0;
      });
    }
    var sw = rootEl.querySelectorAll('.ifx-sw');
    var i;
    for (i = 0; i < sw.length; i++) {
      (function (el) {
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          applyTheme(el.getAttribute('data-t'));
        });
      })(sw[i]);
    }
    if (CONFIG.controls) {
      rootEl.addEventListener('click', function () { restart(); });
      doc.addEventListener('mousemove', function () { showUI(); });
    }
    if (CONFIG.keyboard) {
      doc.addEventListener('keydown', function (e) {
        if (e.code === 'Space') { e.preventDefault(); toggle(); }
        else if (e.code === 'KeyR') { restart(); }
        else if (e.code === 'KeyH') { rootEl.classList.toggle('ifx-hidden'); }
      });
    }
    doc.addEventListener('visibilitychange', function () { if (!doc.hidden) LAST = 0; });
  }


    /* ============================================================
       控制条（可选：controls:true）
       ============================================================ */
    function buildUI() {
      if (!CONFIG.controls) return;
      var ui = doc.createElement('div');
      ui.className = 'ifx-ui';
      ui.innerHTML = '<button data-act=play>暂停</button>'
        + '<button data-act=replay>重播</button>'
        + '<button data-act=loop></button>'
        + '<span class="ifx-sep"></span>'
        + '<input class="ifx-scrub" type=range min=0 max=10 step=0.01 value=0>'
        + '<span class="ifx-time"></span>'
        + '<span class="ifx-sep"></span>'
        + '<span class="ifx-sw" data-t=ice></span>'
        + '<span class="ifx-sw" data-t=jade></span>'
        + '<span class="ifx-sw" data-t=sakura></span>'
        + '<span class="ifx-sw" data-t=mix></span>'
        + '<span class="ifx-sw" data-t=random></span>';
      rootEl.appendChild(ui);
      btnPlay = ui.querySelector('[data-act=play]');
      btnReplay = ui.querySelector('[data-act=replay]');
      btnLoop = ui.querySelector('[data-act=loop]');
      scrubEl = ui.querySelector('.ifx-scrub');
      timeEl = ui.querySelector('.ifx-time');
      if (scrubEl) scrubEl.max = DURATION;
      btnLoop.textContent = '循环 · ' + (CONFIG.loop ? '开' : '关');
      btnPlay.textContent = CONFIG.autoPlay ? '暂停' : '播放';
      var hint = doc.createElement('div');
      hint.className = 'ifx-hint';
      hint.textContent = CONFIG.hintText || '点击画面重播 · 空格暂停 · 拖动进度条预览 · H 隐藏界面';
      rootEl.appendChild(hint);
    }

    function toggle() {
      PAUSED = !PAUSED;
      LAST = 0;
      syncUI(true);
    }

    /* ============================================================
       初始化
       ============================================================ */
    buildAll();
    buildText();
    buildUI();
    bindUI();
    resize();
    applyTheme(CONFIG.theme);
    if (CONFIG.controls) showUI();
    if (CONFIG.autoPlay) { restart(); } else { seek(CONFIG.startAt || 0); }
    rafId = requestAnimationFrame(loop);

    var api = {
      el: rootEl,
      canvas: cv,
      version: VERSION,
      play: function () { PAUSED = false; LAST = 0; syncUI(true); return api; },
      pause: function () { PAUSED = true; LAST = 0; syncUI(true); return api; },
      toggle: function () { toggle(); return api; },
      seek: function (t) { seek(t); return api; },
      restart: function () { restart(); return api; },
      setTheme: function (t) { applyTheme(t); return api; },
      setText: function (o) {
        if (o) {
          if (o.title !== undefined) CONFIG.title = String(o.title);
          if (o.subtitle !== undefined) CONFIG.subtitle = String(o.subtitle);
        }
        buildText();
        render(TIME);
        return api;
      },
      setDuration: function (sec) {
        DURATION = Math.max(0.6, +sec || BASE_TOTAL);
        SPEED = BASE_TOTAL / DURATION;
        if (scrubEl) scrubEl.max = DURATION;
        syncUI(true);
        render(TIME);
        return api;
      },
      setLoop: function (b) {
        CONFIG.loop = !!b;
        if (btnLoop) btnLoop.textContent = '循环 · ' + (CONFIG.loop ? '开' : '关');
        syncUI(true);
        return api;
      },
      setQuality: function (q) { quality = clamp(q, 0.4, 1); resize(); return api; },
      stats: function () {
        return {
          time: +(TIME / SPEED).toFixed(2),
          duration: DURATION,
          paused: PAUSED,
          avgMs: +statAvg.toFixed(2),
          vsyncMs: +vsync.toFixed(2),
          estFps: +(1000 / (statAvg || 1)).toFixed(1),
          quality: +quality.toFixed(3),
          renderScale: +RS.toFixed(2),
          canvas: cv.width + 'x' + cv.height,
          theme: CONFIG.themeObj ? 'custom' : CONFIG.theme,
          themePick: CONFIG.themePick
        };
      },
      destroy: function () {
        DEAD = true;
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
        try { win.removeEventListener('resize', resize); } catch (e) {}
        if (rootEl && rootEl.parentNode) rootEl.parentNode.removeChild(rootEl);
        bgCache = null;
        vigCache = null;
        grainPattern = null;
      },
      phases: function () {
        var o = {}, key;
        for (key in TT) {
          if (!TT.hasOwnProperty(key)) continue;
          var v = TT[key];
          if (typeof v === 'number') o[key] = +(v / SPEED).toFixed(3);
          else if (Array.isArray(v) && typeof v[0] === 'number') {
            o[key] = [ +(v[0] / SPEED).toFixed(3), +(v[1] / SPEED).toFixed(3) ];
          } else if (Array.isArray(v)) {
            o[key] = v.map(function (p) { return [ +(p[0] / SPEED).toFixed(3), +(p[1] / SPEED).toFixed(3) ]; });
          }
        }
        return o;
      },
      config: CONFIG,
      timings: TT,
      skip: SKIP
    };
    return api;
  }

  return { create: create, themes: THEMES, pool: RANDOM_POOL, baseTotal: BASE_TOTAL, version: VERSION };
});
