/*! XianYu Core v2.0 —— 弦玉之间 · 三键光圈音游 · 游戏核心(规则 + 光圈粒子模拟 + 离场特效)
 *  无 DOM / 无渲染依赖: 星云模拟输出纯绘制数据, 任何宿主用精灵图即可渲染:
 *    const core = XianYuCore.createCore({ onEnd, onEvent, config });
 *    core.layout([{ x, y, r, img? }, ...]); // 宿主提供按钮几何; img 为贴图引用(由宿主解释, 不传则用 config.buttonSkin)
 *    core.update(dt);                       // 规则 + 星云模拟 + 离场特效一起推进(秒)
 *    core.getNebula(bi);                    // 按钮当前星云的绘制列表 [{ x, y, s, a, c, k }](按钮本地坐标; 同按钮多团自动合并)
 *    core.getBursts();                      // 离场动画 [{ bi, cx, cy, items: [绘制项] }]: 命中爆散 / 失误塌缩 / 结束淡出
 *    core.press(i);                         // 点击第 i 个按钮
 *  绘制项: { x, y, s 尺寸px, a 透明度, c 颜色 0xRRGGBB, k 类别 }
 *          k = 'bead' 亮边 | 'puff' 云体 | 'haze' 外雾 | 'dust' 尘埃
 *  过程事件(onEvent): start | spawn | window | hit | fail | consume
 *  结束回调(onEnd): { win, score, fails, hits, durationMs }
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.XianYuCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => { // 0xRRGGBB 颜色混合
    const ar = a >> 16 & 255, ag = a >> 8 & 255, ab = a & 255, br = b >> 16 & 255, bg = b >> 8 & 255, bb = b & 255;
    return (Math.round(lerp(ar, br, t)) << 16) | (Math.round(lerp(ag, bg, t)) << 8) | Math.round(lerp(ab, bb, t));
  };

  const DEFAULTS = {
    buttons: 3,        // 按钮数量
    targetScore: 10,   // 先到该分数 => 成功
    maxFails: 3,       // 失误次数上限 => 结束
    ringStart: 2.6,    // 星云起始半径(按钮半径倍数)
    ringEnd: 0.77,     // 玉环内缘: 星云缩过内缘(没入内圈) => 塌缩失误
    hitHigh: 1.2,      // 命中上限(略高于玉环外缘 1.1 作余量); 星云在 [ringEnd, hitHigh] 之间点击都命中
    durMin: 1.7, durMax: 2.6,     // 收缩时长(秒)
    durRamp: 0.95, durFloor: 1.3, // 命中越多收缩越快
    telegraph: 0.3,    // 出现前预兆时长(秒)
    respawnMin: 0.2, respawnMax: 0.5, // 补圈等待(秒); 加上预兆即"同一玉镯前后两团"的最小间隔
    spawnGap: 0.3,     // 相邻两次出圈的最小间隔(秒): 消除补圈同帧到期造成的忽快忽慢
    maxRings: null,    // 场上光圈并发上限; 缺省为 按钮数(3): 保持原有密度, 出生点纯随机可叠圈
    maxPerButton: 2,   // 同一按钮最多同时存在的光圈数: 允许同一玉镯先后出现两团
    stackGap: 0.6,     // 同一玉镯连出的最小间隔(秒): 距上次出圈不足此值不参与抽选, 空镯不受限; 亦即同镯两团出现至少相隔此值
    buttonSkin: null,  // 按钮贴图默认值(不透明引用, 由宿主解释; layout 的 img 可逐按钮覆盖)
    nebulaHues: null,  // 各按钮星云色相 [0x.., ...]; 缺省白色
  };

  const NEB = { GM: 1.44e6, soft: 26, lifeMin: 0.22, lifeMax: 0.45, rate: 26, inner: 0.72, kill: 3.4 };

  function createCore(options) {
    const opt = options || {};
    const cfg = Object.assign({}, DEFAULTS, opt.config);
    const N = cfg.buttons;
    cfg.maxRings = clamp(cfg.maxRings == null ? N : cfg.maxRings | 0, 1, N + 2);
    const emit = (type, data) => { try { (opt.onEvent || (() => {}))(type, data); } catch (e) { /* 宿主异常不影响核心 */ } };

    const buttons = Array.from({ length: N }, (_, i) => ({ i, x: 0, y: 0, r: 60, img: null, pending: null, neb: [], lastSpawnT: -9 }));
    let rings = [], refills = [], bursts = []; // refills: 待补圈倒计时(到点才加权挑位); bursts: 离场星云动画(核心模拟)
    let lastSpawnT = -9, lastPick = -1; // 上次出圈时刻(spawnGap 限速)与上次落点(连出降权, 不清零)
    let state = 'menu'; // menu | playing | ending | over
    let score = 0, hits = 0, fails = 0, T = 0;
    let endTimer = 0, endWin = false, startedAt = 0, lastResult = null;
    const endCbs = [];

    /* ---------- 星云粒子云(每团光圈自带一粒云, 纯数学模拟; 同按钮可叠多团) ---------- */
    const hueOf = bi => (cfg.nebulaHues && cfg.nebulaHues[bi % cfg.nebulaHues.length]) || 0xffffff;
    const cloudColor = bi => Math.random() < 0.05 ? 0xff4020 : (Math.random() < 0.5 ? 0xffffff : mix(hueOf(bi), 0xffffff, rand(0.1, 0.5)));
    function makeCloud(bi) { // 三层云片: 亮边定边缘 / 云体给体积 / 外雾做深度
      const puffs = [];
      for (let k = 0; k < 42; k++) puffs.push({ k: 'bead', a: k / 42 * TAU + rand(-0.06, 0.06), fr: rand(0.965, 1.025), size: rand(0.14, 0.26), c: cloudColor(bi), tw: rand(4, 7), ph: rand(0, TAU), w: rand(0.75, 1.3), base: 0.55 });
      for (let k = 0; k < 26; k++) puffs.push({ k: 'puff', a: k / 26 * TAU + rand(-0.11, 0.11), fr: rand(0.86, 1.06), size: rand(0.32, 0.55), c: cloudColor(bi), tw: rand(2, 4), ph: rand(0, TAU), w: rand(0.75, 1.3), base: 0.2 });
      for (let k = 0; k < 14; k++) puffs.push({ k: 'haze', a: k / 14 * TAU + rand(-0.15, 0.15), fr: rand(0.8, 1.15), size: rand(0.7, 1.1), c: cloudColor(bi), tw: rand(1.5, 3), ph: rand(0, TAU), w: rand(0.75, 1.3), base: 0.055 });
      return { puffs, dust: [], emitA: rand(0, TAU), acc: 0, swirl: Math.random() < 0.5 ? -1 : 1, age: 0, items: [] };
    }
    function emitDust(bi, cloud, er) { // 尘埃: 环缘喷出的细碎短命闪光(只作点缀, 不形成尾迹)
      const a = cloud.emitA + rand(-0.3, 0.3);
      const v = Math.sqrt(NEB.GM / Math.max(er, 30)) * rand(0.92, 1.12);
      const ca = Math.cos(a), sa = Math.sin(a);
      cloud.dust.push({
        x: ca * er * rand(0.97, 1.03) + rand(-6, 6), y: sa * er * rand(0.97, 1.03) + rand(-6, 6),
        vx: -sa * v * cloud.swirl + rand(-16, 16), vy: ca * v * cloud.swirl + rand(-16, 16),
        s: rand(1.6, 3.2) * (Math.random() < 0.15 ? 1.6 : 1) * 8, c: cloudColor(bi),
        age: 0, life: rand(NEB.lifeMin, NEB.lifeMax), a: 0.05, da: 0,
      });
    }
    function updateCloud(cloud, ring, dt) {
      cloud.age += dt;
      cloud.emitA += dt * 0.7;
      cloud.acc += dt * NEB.rate;
      const er = Math.max(20, ring.R * ring.scale);
      while (cloud.acc >= 1) { cloud.acc -= 1; emitDust(ring.bi, cloud, er); }
      const kw = cloud.swirl * Math.sqrt(NEB.GM); // 开普勒差速: ω ∝ r^-1.5, 收缩时旋涡加速
      for (const q of cloud.puffs) q.a += kw / Math.pow(Math.max(er * q.fr, 24), 1.5) * q.w * dt;
      const minD = er * NEB.inner, killD = ring.R * NEB.kill, parts = cloud.dust;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.age += dt;
        const dx = -p.x, dy = -p.y, d = Math.hypot(dx, dy) || 1;
        const f = NEB.GM / Math.max(d * d, NEB.soft * NEB.soft); // 中心引力井
        p.vx += dx / d * f * dt; p.vy += dy / d * f * dt;
        if (d < minD) { p.vx += dx / d * (minD - d) * 8 * dt; p.vy += dy / d * (minD - d) * 8 * dt; } // 内边界软弹回
        p.x += p.vx * dt; p.y += p.vy * dt;
        const speed = Math.hypot(p.vx, p.vy);
        p.a += (clamp(0.06 + speed / 500, 0.06, 0.5) - p.a) * Math.min(1, dt * 5); // 速度越快越亮
        p.da = p.a * Math.min(1, p.age / 0.12) * clamp((p.life - p.age) / 0.35, 0, 1);
        if (p.age >= p.life || d > killD) parts.splice(i, 1);
      }
    }
    function buildItems(cloud, ring) { // 云 => 绘制数据(数组复用, 零额外分配增长)
      const items = cloud.items, er = Math.max(20, ring.R * ring.scale);
      items.length = 0;
      const born = Math.min(1, cloud.age / 0.3);
      const boost = (1 + 0.45 * clamp(1.4 - ring.scale, 0, 1)) * (ring.inWin ? 1.3 : 1); // 越近边缘/进判定区越亮
      for (const q of cloud.puffs) {
        const tw = 0.6 + 0.4 * Math.sin(cloud.age * q.tw + q.ph);
        items.push({ x: Math.cos(q.a) * er * q.fr, y: Math.sin(q.a) * er * q.fr, s: ring.R * q.size * 1.5, a: q.base * born * tw * boost, c: q.c, k: q.k });
      }
      for (const p of cloud.dust) {
        if (p.da <= 0.004) continue;
        items.push({ x: p.x, y: p.y, s: p.s, a: p.da, c: p.c, k: 'dust' });
      }
      return items;
    }

    function consume(r, mode) { // 移除光圈并在核心内生成离场动画(burst 命中爆散 / die 失误塌缩 / fade 结束淡出)
      rings = rings.filter(x => x !== r);
      if (r.cloud) {
        const burst = {
          bi: r.bi, cx: buttons[r.bi].x, cy: buttons[r.bi].y, mode,
          t: 0, dur: mode === 'die' ? 0.35 : 0.8, mult: 1, items: [],
          parts: buildItems(r.cloud, r).map(o => ({
            x: o.x, y: o.y, vx: 0, vy: 0, s: o.s, baseA: Math.max(o.a, 0.25),
            c: mode === 'die' ? 0xff5566 : o.c, k: o.k, // 失误整团转红
          })),
        };
        if (mode === 'burst') for (const p of burst.parts) { // 沿各自角度向外爆散
          const ang = Math.atan2(p.y, p.x) || rand(0, TAU), sp = rand(140, 430);
          p.vx = Math.cos(ang) * sp; p.vy = Math.sin(ang) * sp;
        }
        bursts.push(burst);
      }
      emit('consume', { bi: r.bi, mode, s0: r.scale, cx: buttons[r.bi].x, cy: buttons[r.bi].y });
    }
    function updateBursts(dt) { // 离场动画推进: 爆散带阻尼外飞, 塌缩向中心收缩, 全程渐隐
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.t += dt;
        if (b.t >= b.dur) { bursts.splice(i, 1); continue; }
        const k = b.t / b.dur;
        if (b.mode === 'die') b.mult = lerp(1, 0.4, k * k);
        else if (b.mode === 'burst') {
          const drag = Math.exp(-2.1 * dt);
          for (const p of b.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= drag; p.vy *= drag; }
        }
      }
    }
    function endGame(win) {
      buttons.forEach(b => { b.pending = null; });
      refills.length = 0;
      rings.slice().forEach(r => consume(r, win ? 'fade' : 'die'));
      state = 'ending'; endWin = win; endTimer = win ? 1.0 : 0.9;
    }
    function pickSpawnButton() { // 落点在到点瞬间从候选里随机抽: 空镯与可连出的镯同权, 刚出过的一发若已过冷却再略加权 =>
      // 序列没有轮转规律, 同镯连出清晰可见; 已有光圈的按钮需距其上次出圈 ≥ stackGap 才可连出
      const cnt = new Array(N).fill(0);
      for (const r of rings) cnt[r.bi]++;
      const cands = buttons.filter(b => !b.pending && cnt[b.i] < cfg.maxPerButton && (cnt[b.i] === 0 || T - b.lastSpawnT >= cfg.stackGap));
      if (!cands.length) return null;
      const weights = cands.map(b => (b.i === lastPick ? 1.35 : 1));
      let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < cands.length; i++) { roll -= weights[i]; if (roll <= 0) return cands[i]; }
      return cands[cands.length - 1];
    }
    function fail(bi) { // 失误: 分数不减(只增不减), 仅累计失误数, 满 3 次判负
      fails++;
      emit('fail', { bi, score, fails });
      if (fails >= cfg.maxFails) endGame(false);
    }
    function spawn(bi) { // 光圈规则数据 + 粒子云一起创建(挂在圈上, 同按钮可多圈各自一团云)
      const ring = {
        bi, R: buttons[bi].r, t: 0, bornA: 0, wasIn: false, inWin: false,
        dur: Math.max(cfg.durFloor, rand(cfg.durMin, cfg.durMax) * Math.pow(cfg.durRamp, hits)),
        scale: cfg.ringStart, cloud: null,
      };
      ring.cloud = makeCloud(bi);
      buttons[bi].lastSpawnT = T; // 连出冷却计时起点
      lastPick = bi;
      rings.push(ring);
      emit('spawn', { bi });
    }

    return {
      config: cfg,
      layout(specs) { // 宿主提供按钮几何 [{ x, y, r, img? }]; img 为贴图引用, 不传则用 config.buttonSkin
        specs.slice(0, N).forEach((s, i) => {
          buttons[i].x = s.x; buttons[i].y = s.y; buttons[i].r = s.r;
          buttons[i].img = s.img !== undefined ? s.img : cfg.buttonSkin;
        });
        rings.forEach(g => { g.R = buttons[g.bi].r; });
      },
      start() { // 开始(或重开)一局: 预置 maxRings 个错峰补圈, 落点到点后加权随机抽取(可叠圈)
        rings = []; refills = []; bursts = [];
        lastSpawnT = -9; lastPick = -1;
        score = 0; hits = 0; fails = 0; state = 'playing'; startedAt = T;
        buttons.forEach(b => { b.pending = null; b.neb.length = 0; });
        const d1 = rand(0.15, 0.4);
        for (let k = 0; k < cfg.maxRings; k++) refills.push(d1 + rand(0.25, 0.65) * k);
        emit('start');
      },
      press(i) { // 点击第 i 个按钮; 空按与非进行中状态不判定不扣分
        if (state !== 'playing') return;
        const rs = rings.filter(r => r.bi === i);
        if (!rs.length) return;
        const inWin = rs.filter(r => r.scale <= cfg.hitHigh);
        if (inWin.length) { // 命中最深入(即将没入)的那团: +1
          const r = inWin.reduce((a, b) => (a.scale <= b.scale ? a : b));
          consume(r, 'burst');
          score++; hits++;
          emit('hit', { bi: i, score });
          if (score >= cfg.targetScore) endGame(true);
        } else { // 该按钮的光圈都还在镯外: 点早, 吞掉最深入的一团, 只扣一次
          const r = rs.reduce((a, b) => (a.scale <= b.scale ? a : b));
          consume(r, 'die');
          fail(i);
        }
      },
      update(dt) { // 每帧推进(秒): 规则 + 星云模拟
        T += dt;
        if (state === 'playing') {
          for (let i = refills.length - 1; i >= 0; i--) { // 补圈倒计时: 到点才加权随机挑位(可与现有光圈同按钮, 叠圈限 maxPerButton)
            refills[i] -= dt;
            if (refills[i] <= 0) {
              refills.splice(i, 1);
              const wait = Math.max(0, cfg.spawnGap - (T - lastSpawnT)); // 距上次出圈不足 spawnGap: 顺延, 保证节奏平稳
              const b = wait > 0 ? null : pickSpawnButton();
              if (b) { b.pending = { t: cfg.telegraph }; lastSpawnT = T; }
              else refills.push(wait || 0.2);
            }
          }
          for (const b of buttons) { // 预兆 -> 出圈
            if (b.pending) {
              b.pending.t -= dt;
              if (b.pending.t <= 0) { b.pending = null; spawn(b.i); }
            }
          }
          const npend = buttons.reduce((s, b) => s + (b.pending ? 1 : 0), 0);
          for (let k = 0; rings.length + refills.length + npend < cfg.maxRings; k++) {
            refills.push(rand(cfg.respawnMin, cfg.respawnMax) + (0.25 + Math.random() * 0.45) * k); // 一次补多个时随机错峰: 不扎堆也无固定节拍
          }
        }
        for (let i = rings.length - 1; i >= 0; i--) {
          const g = rings[i];
          g.t += dt;
          g.bornA = Math.min(1, g.t / 0.18);
          g.scale = lerp(cfg.ringStart, cfg.ringEnd, clamp(g.t / g.dur, 0, 1));
          g.inWin = g.scale <= cfg.hitHigh; // 碰到玉环起进入判定区
          if (g.inWin && !g.wasIn) emit('window', { bi: g.bi });
          g.wasIn = g.inWin;
          if (state === 'playing' && g.scale <= cfg.ringEnd) { // 没入内圈 => 塌缩失误
            consume(g, 'die');
            fail(g.bi);
          }
        }
        for (const g of rings) updateCloud(g.cloud, g, dt);
        updateBursts(dt);
        if (state === 'ending' && (endTimer -= dt) <= 0) {
          state = 'over';
          lastResult = { win: endWin, score, fails, hits, durationMs: Math.round((T - startedAt) * 1000) };
          endCbs.forEach(cb => { try { cb(lastResult); } catch (e) { /* 宿主异常不影响核心 */ } });
        }
      },
      getNebula(bi) { // 该按钮全部星云的绘制列表 [{ x, y, s, a, c, k }](按钮本地坐标; 叠圈时多团合并输出); 无星云返回空数组
        const out = buttons[bi].neb;
        out.length = 0;
        for (const r of rings) if (r.bi === bi) { const it = buildItems(r.cloud, r); for (const p of it) out.push(p); }
        return out;
      },
      getBursts: () => bursts.map(b => { // 离场动画 [{ bi, cx, cy, items }]: 塌缩按 mult 收缩, 爆散散开, 全程渐隐
        const k = b.t / b.dur, m = b.mode === 'die' ? b.mult : 1;
        b.items.length = 0;
        for (const p of b.parts) b.items.push({ x: p.x * m, y: p.y * m, s: b.mode === 'burst' ? p.s * (1 - 0.45 * k) : p.s, a: p.baseA * (1 - k), c: p.c, k: p.k });
        return b;
      }),
      setOnEnd(cb) { endCbs.length = 0; if (typeof cb === 'function') endCbs.push(cb); },
      onEnd(cb) { if (typeof cb === 'function') endCbs.push(cb); },
      getState: () => ({ state, score, fails, hits, targetScore: cfg.targetScore, maxFails: cfg.maxFails }),
      getResult: () => lastResult,
      getButtons: () => buttons,
      getRings: () => rings,
    };
  }
  return { createCore };
});
