/*! XianYu Game v2.0.1 —— 弦玉之间 · 纯引擎(渲染/音效/输入), 不含得分/结算等页面 UI
 *  画布上只有: 玉镯按钮 + 光圈 + 判定框高亮 + 打击特效 + 开局介绍; 得分/结算由宿主页面用 HTML 实现。
 *  纯脚本(UMD, 无 ES6 import), 任意环境 <script> 两个文件即可挂载:
 *    <script src="core.js"></script>
 *    <script src="game.js"></script>
 *    <script>
 *      const game = qyXianYuGame.mount(el, {
 *        keyboard: true,       // 1/2/3 快捷键(默认 true, 绑 window; 与宿主按键冲突时关掉)
 *        skin: 'jade.png',     // 玉环贴图 URL(默认 game.js 同目录 button-ring.png; 失败用内置画环)
 *        buttonRadius: 0,      // 玉镯半径: >=1 按 px, <1 按容器短边比例(如 0.14); 0/缺省 = 随容器自动
 *        hues: [0x59d9ff],     // 各按钮光圈色相
 *        transparent: false,   // 透明背景: 不画星空底色, 透出宿主页面
 *        intro: true,          // 开局介绍(画布显示玩法说明, 点击或倒计时结束自动开局); false 跳过
 *        introTime: 5,         // 介绍停留秒数(默认 5)
 *        hitWav: 'hit.wav',      // 点中音效(默认 game.js 同目录 hit.wav; 加载失败退回合成音)
 *        missMp3: 'default.mp3', // 没点中音效(默认 game.js 同目录 default.mp3; 加载失败退回合成音)
 *        background: 'bg.webp', // 背景图(默认 game.js 同目录 background.webp, cover 铺满; 传 false 禁用, 走纯色星空底)
 *        auto: false,          // 演奏模式: AI 自动游玩, 禁用触屏/键盘输入, 局终自动开下一局循环演奏; 传数字(如 4) = 每局命中 4 次即收尾; 达标前后都会随机失误(偶尔抢早/手慢), 达标后不再点击任由失误收场, 更像真人
 *        hud: false,           // 画布内 HUD: true=分数+生命值全开; 传 { score: true, hp: true } 分别开关; 缺省 false(得分/结算仍由宿主绘制)
 *        bgAnchors: [{ x: 0.5, y: 0.38 }, ...], // 玉镯锚点(相对整张背景图归一化坐标); 缺省自动布局: 在"并排一行"与"三角形"中选优, 且保证玉镯完整落在星空区域内; false=按视口布局(原逻辑)
 *        // 采样加载按 fetch → XHR → <audio> 三级降级: file:// 协议下 fetch 被浏览器禁止时自动改走 <audio> 元素兜底
 *        // 出现光圈 / 进入判定区不发声; 没有背景循环音
 *        onEnd, onEvent,       // 挂载时即可注册的回调
 *      });
 *      game.start();  // 直接开始一局(intro 开启时调用 start 也会立即跳过介绍开局)
 *      game.onEnd(r => {});   game.pause(true);   game.destroy(); // 卸载并释放
 *    </script>
 */
(function (root, factory) { // UMD 包装: 同时兼容 CommonJS 与浏览器全局挂载
  const api = factory(); // 立即执行工厂函数, 得到 { mount } 对外接口
  if (typeof module === 'object' && module.exports) module.exports = api; // Node/CommonJS 环境: 走模块导出
  else { // 浏览器环境: 挂到全局对象上
    root.qyXianYuGame = api; // 新命名空间(推荐使用)
    if (root.XianYuGame === undefined) root.XianYuGame = api; // 旧命名兼容(不覆盖宿主已有定义)
  }
})(typeof self !== 'undefined' ? self : this, function () { // 工厂函数: 闭包内实现全部逻辑, 不污染全局
  'use strict'; // 严格模式: 禁止隐式全局变量等不安全写法
  const SCRIPT_URL = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || ''; // 必须在 game.js 自己执行时取, 迟了会拿到页面内联脚本

  /* ============ 通用工具(模块级, 多实例共享) ============ */
  const TAU = Math.PI * 2; // 圆周率 × 2, 画整圆/角度换算常用常量
  const rand = (a, b) => a + Math.random() * (b - a); // 区间随机数: [a, b) 的浮点值
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v); // 数值夹取: 把 v 限制在 [a, b] 内
  const lerp = (a, b, t) => a + (b - a) * t; // 线性插值: t=0 取 a, t=1 取 b
  const easeOut = k => 1 - Math.pow(1 - k, 3); // 三次缓出曲线: 前快后慢, 用于特效收敛
  const FONT = '"PingFang SC","Microsoft YaHei","Noto Sans SC",-apple-system,"Segoe UI",sans-serif'; // 画布文字字体栈(中文优先)
  const rgba = (hex, a) => `rgba(${hex >> 16 & 255},${hex >> 8 & 255},${hex & 255},${a})`; // 0xRRGGBB + 透明度 => css rgba() 字符串

  /* ============ 精灵工厂(离屏画布 + 全局缓存, 多实例共用只读贴图) ============ */
  const spriteCache = new Map(); // 精灵缓存: key => 离屏 canvas, 避免重复绘制同一贴图
  function makeSprite(key, build) { // 按键取精灵; 没有就用 build 现画一份并缓存
    let s = spriteCache.get(key); // 先查缓存
    if (!s) spriteCache.set(key, s = build()); // 未命中: 构建并写入缓存(赋值表达式返回新精灵)
    return s; // 返回(缓存命中的或新建的)精灵
  }
  function radial(size, color, stops) { // 生成径向渐变圆斑精灵(离屏画布)
    const c = document.createElement('canvas'); c.width = c.height = size; // 创建 size×size 离屏画布
    const x = c.getContext('2d'), m = size / 2; // 取 2d 上下文; m 为圆心/半径
    const g = x.createRadialGradient(m, m, 0, m, m, m); // 从圆心到边缘的径向渐变
    for (const [o, a] of stops) g.addColorStop(o, rgba(color, a)); // 依次登记渐变停靠点(offset, alpha)
    x.fillStyle = g; x.beginPath(); x.arc(m, m, m, 0, TAU); x.fill(); // 以渐变填充整个圆
    return c; // 返回画好的离屏画布当作精灵
  }
  const SPRITES = { // 各类精灵的懒加载工厂(首次调用才绘制并缓存)
    bead: color => makeSprite('bead_' + color, () => radial(64, color, [[0, 1], [0.28, 0.92], [0.52, 0.4], [0.74, 0.12], [1, 0]])), // 亮边珠: 撑出清晰收缩边缘
    puff: color => makeSprite('puff_' + color, () => radial(128, color, [[0, 1], [0.32, 0.75], [0.58, 0.28], [0.82, 0.07], [1, 0]])), // 云片: 亮区大收边快, 避免糊雾
    glow: color => makeSprite('glow_' + color, () => radial(64, color, [[0, 1], [0.25, 0.85], [0.55, 0.28], [1, 0]])), // 尘埃/火花
    soft: color => makeSprite('soft_' + color, () => radial(128, color, [[0, 0.9], [0.4, 0.38], [1, 0]])), // 大光晕/背景雾团
    spark: color => makeSprite('spark_' + color, () => { // 四芒星: 光核 + 十字光轨
      const c = document.createElement('canvas'); c.width = c.height = 64; // 创建 64×64 离屏画布
      const x = c.getContext('2d'), m = 32; // 2d 上下文; 中心点 32
      const g0 = x.createRadialGradient(m, m, 0, m, m, m); // 光核: 中心到边缘径向渐变
      g0.addColorStop(0, rgba(color, 1)); g0.addColorStop(0.18, rgba(color, 0.9)); // 核心: 不透明到近不透明
      g0.addColorStop(0.5, rgba(color, 0.25)); g0.addColorStop(1, rgba(color, 0)); // 中段淡出直至透明
      x.fillStyle = g0; x.fillRect(0, 0, 64, 64); // 用渐变铺满画布形成光核
      x.globalCompositeOperation = 'lighter'; // 切换叠加混合: 十字光轨与光核相加更亮
      for (const rot of [0, Math.PI / 2]) { // 两条正交光轨: 横向 + 纵向
        x.save(); x.translate(m, m); x.rotate(rot); x.scale(1, 0.16); // 平移到中心→旋转→纵向压扁成细长光带
        const g = x.createRadialGradient(0, 0, 0, 0, 0, m); // 光带自身渐变
        g.addColorStop(0, rgba(color, 0.95)); g.addColorStop(0.4, rgba(color, 0.35)); g.addColorStop(1, rgba(color, 0)); // 亮头渐隐
        x.fillStyle = g; x.beginPath(); x.arc(0, 0, m, 0, TAU); x.fill(); x.restore(); // 画压扁圆并恢复变换
      }
      return c; // 返回四芒星精灵
    }),
  };
  // 星云绘制项类别 => 精灵类别(数据来自 core)
  const SPRITE_OF = { bead: 'bead', puff: 'puff', haze: 'puff', dust: 'glow' }; // 未知类别兜底为 glow(调用处处理)
  const STAR_RECT = { x0: 0.15, y0: 0.24, x1: 0.86, y1: 0.83 }; // 背景图内星海区域的归一化范围(玉镯整体必须落在其中; 按 1920×1079 卷轴图标定, 更换背景图后按新图微调此值)

  function mount(container, options) { // 挂载入口: container 为元素或选择器, options 为配置
    const opt = options || {}; // 配置兜底为空对象
    const hostEl = typeof container === 'string' ? document.querySelector(container) : container; // 字符串按选择器查元素, 否则直接用
    if (!hostEl) throw new Error('qyXianYuGame.mount: 容器不存在'); // 容器缺失直接报错, 避免后续空引用
    if (typeof XianYuCore === 'undefined') throw new Error('qyXianYuGame.mount: 请先加载 core.js'); // 依赖 core.js, 缺失即报错
    const TRANSPARENT = !!opt.transparent; // 是否透明背景模式(不画星空底)
    const AUTO = !!opt.auto; // 演奏模式: AI 自动游玩(禁用人类输入, 自动开局循环)
    const AUTO_HITS = typeof opt.auto === 'number' ? Math.max(1, Math.floor(opt.auto)) : 0; // 每局演奏命中目标(传 4 = 命中 4 次后故意失误收尾; 0/true = 跟随核心满目标分)
    const HUD = opt.hud === true ? { score: true, hp: true } // true = 分数与生命值全开
      : (opt.hud && typeof opt.hud === 'object' ? { score: opt.hud.score !== false, hp: opt.hud.hp !== false } // 对象 = 分别开关(子项缺省为开)
      : { score: false, hp: false }); // 其余(缺省/false) = 关闭, 得分结算仍由宿主页面自绘

    /* ---------------- 画布 ---------------- */
    const canvas = document.createElement('canvas'); // 创建游戏画布
    canvas.style.display = 'block'; // 块级布局, 消除 inline 底部空隙
    canvas.style.touchAction = 'none'; // 禁用浏览器默认触摸手势(滚动/缩放), 保证指针事件流畅
    canvas.style.userSelect = canvas.style.webkitUserSelect = 'none'; // 禁止长按选中画布内容
    canvas.style.webkitTapHighlightColor = 'transparent'; // iOS 点按高亮去除
    canvas.style.zIndex = 999; // 叠放层级: 覆盖宿主内容之上
    canvas.style.position = 'absolute'; // 绝对定位铺满容器
    canvas.style.inset = 0; // 四边归零: 与容器完全重合
    hostEl.appendChild(canvas); // 挂进宿主容器
    const ctx = canvas.getContext('2d'); // 2d 渲染上下文(全部绘制入口)
    let W = 0, H = 0, DPR = 1, T = 0, dead = false; // 逻辑宽高/像素比/累计时间/销毁标记
    const sizeOf = () => ({ // 容器尺寸(嵌入时跟随宿主布局); 尚未排版时退回窗口尺寸
      w: hostEl.clientWidth > 0 ? hostEl.clientWidth : (window.innerWidth || 800), // 宽: 容器实际宽, 否则窗口宽, 再否则 800
      h: hostEl.clientHeight > 0 ? hostEl.clientHeight : (window.innerHeight || 500), // 高: 容器实际高, 否则窗口高, 再否则 500
    });

    /* ---------------- 音效: 点中 hit.wav / 没点中 default.mp3, 出现光圈不发声; WebAudio 合成音兜底 ---------------- */
    let AC = null; // AudioContext 实例(音效总开关与载体)
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* 忽略 */ } // 创建音频上下文; 旧 Safari 用 webkit 前缀, 失败则静默降级
    const ensureAudio = () => { if (AC && AC.state === 'suspended' && !dead) AC.resume(); }; // 浏览器手势策略下, 首次交互需 resume 才能发声
    const tone = (freq, dur, type, vol, slide) => { // 合成音: 单振荡器 + 音量包络
      if (!AC || dead) return; // 无音频上下文或已销毁: 直接跳过
      try { // 任何 WebAudio 异常都不允许打断游戏
        const t0 = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(); // 起始时间/振荡器/增益节点
        o.type = type; o.frequency.setValueAtTime(freq, t0); // 设置波形与起始频率
        if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur); // 滑音: 结束频率不低于 30Hz 防止指数逼近 0 报错
        g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); // 音量从 vol 指数衰减到近 0, 形成自然尾音
        o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0 + dur + 0.02); // 振荡器→增益→输出; 稍加 20ms 缓冲后停止
      } catch (e) { /* 忽略 */ }
    };
    const beepHit = n => tone(560 * Math.pow(1.16, n), 0.14, 'triangle', 0.22, 260); // 点中合成音: 分数越高音调越高(等比上行), 略带上滑
    const beepMiss = () => tone(170, 0.2, 'sawtooth', 0.16, -70); // 失误合成音: 低频锯齿波下滑, 听感沉闷
    const beepEnd = win => (win ? [523, 659, 784, 1046] : [311, 247, 185]).forEach((f, i) => setTimeout(() => tone(f, win ? 0.22 : 0.26, win ? 'triangle' : 'sine', 0.2, 0), i * (win ? 120 : 150))); // 结局旋律: 胜利=上行琶音(C大调), 失败=下行三音, 逐音延时触发
    // 两个采样都在加载期预载, 触发时零延迟起播; 加载失败自动退回合成音
    let hitBuf = null, missBuf = null; // 点中/没点中的预载采样: AudioBuffer(最优) 或 HTMLAudioElement(file:// 兜底)
    { // 块级作用域: 只在挂载期执行一次的采样加载逻辑
      // 采样加载器: fetch 在 file:// 协议下被浏览器安全策略直接拒绝, 故按 fetch → XHR → <audio> 三级降级, 全失败才弃用采样
      const loadSample = url => new Promise((resolve, reject) => { // 返回 Promise: 成功给 AudioBuffer 或 <audio> 元素, 全失败 reject
        const viaFetch = () => fetch(url).then(r => r.arrayBuffer()).then(ab => AC.decodeAudioData(ab)); // 一级: fetch 拉取→取二进制→解码为 AudioBuffer(http/https 下零延迟最优)
        const viaXhr = () => new Promise((res, rej) => { // 二级: XHR 拉取(部分安卓 WebView 对 file:// 放行 XHR, 仍可解码成 AudioBuffer)
          const xhr = new XMLHttpRequest(); // 新建同步配置的异步请求
          xhr.open('GET', url, true); // GET 拉取采样文件
          xhr.responseType = 'arraybuffer'; // 直接收二进制, 省去文本转换
          xhr.onload = () => (xhr.status === 0 || xhr.status === 200) // file:// 成功时 status 为 0, http 成功为 200
            ? AC.decodeAudioData(xhr.response).then(res, rej) // 拿到二进制后解码为 AudioBuffer
            : rej(new Error('xhr ' + xhr.status)); // 非 0/200 视为失败
          xhr.onerror = () => rej(new Error('xhr error')); // 网络层失败(含 file:// 被禁): 进入下一级
          xhr.send(); // 发起请求
        });
        const viaAudio = () => new Promise((res, rej) => { // 三级: <audio> 元素兜底(<audio> 与 <img> 一样通常允许加载 file:// 资源)
          const a = new Audio(); // 新建音频元素
          a.preload = 'auto'; // 提示浏览器立即预加载, 首次触发尽量不卡
          a.oncanplaythrough = () => res(a); // 可完整播放时视为加载成功(元素本体作为采样)
          a.onerror = () => rej(new Error('audio error')); // 元素也加载失败: 彻底弃用采样
          a.src = url; // 赋 src 触发加载
        });
        viaFetch().then(resolve) // 先走 fetch
          .catch(() => viaXhr().then(resolve)) // fetch 失败(如 file:// 被禁)走 XHR
          .catch(() => viaAudio().then(resolve)) // XHR 也失败走 <audio>
          .catch(reject); // 三级全失败: reject(调用处静默, 退回合成音)
      });
      let hitUrl = opt.hitWav; // 点中采样路径(可由宿主指定)
      if (hitUrl === undefined && SCRIPT_URL) hitUrl = SCRIPT_URL.replace(/[^/]*$/, '') + 'hit.wav'; // 未指定时默认取 game.js 同目录的 hit.wav
      if (AC && typeof hitUrl === 'string') loadSample(hitUrl).then(buf => { hitBuf = buf; }).catch(() => { /* 保持合成音兜底 */ }); // 三级降级预载, 失败静默(继续用合成音)
      else if (hitUrl) hitBuf = hitUrl; // 宿主直接传入已解码的 AudioBuffer
      let missUrl = opt.missMp3; // 没点中采样路径(可由宿主指定)
      if (missUrl === undefined && SCRIPT_URL) missUrl = SCRIPT_URL.replace(/[^/]*$/, '') + 'default.mp3'; // 未指定时默认取 game.js 同目录的 default.mp3
      if (AC && typeof missUrl === 'string') loadSample(missUrl).then(buf => { missBuf = buf; }).catch(() => { /* 保持合成音兜底 */ }); // 三级降级预载, 失败静默
      else if (missUrl) missBuf = missUrl; // 宿主直接传入已解码的 AudioBuffer
    }
    const playHit = score => { // 播放点中音效(优先 wav 采样, 退回合成音)
      if (!AC || dead) return; // 无音频或已销毁: 跳过
      if (hitBuf instanceof AudioBuffer) { // 采样已就绪才走采样通道
        try { // 播放异常时退回合成音
          const src = AC.createBufferSource(); // 新建缓冲源(一次性, 每次点中都要新建)
          src.buffer = hitBuf; // 绑定点中采样
          src.playbackRate.value = 1 + Math.min(0.4, score * 0.02); // 分数越高音调微升(最多 +40%), 营造连击加速感
          const g = AC.createGain(); g.gain.value = 0.55; // 音量节点: 固定 0.55 倍
          src.connect(g); g.connect(AC.destination); src.start(); // 源→增益→输出, 立即起播
          return; // 采样播放成功, 不再走兜底通道
        } catch (e) { /* 落回下一级兜底 */ }
      }
      if (typeof HTMLAudioElement !== 'undefined' && hitBuf instanceof HTMLAudioElement) { // file:// 等协议下采样以 <audio> 元素形态兜底
        try { // 播放异常仍退回合成音
          const a = hitBuf.cloneNode(); // 克隆新实例播放: 连续快速点中互不打断(克隆继承已缓存的 src, 开销极小)
          a.volume = 0.55; // 与 AudioBuffer 通道一致的音量
          a.playbackRate = 1 + Math.min(0.4, score * 0.02); // 与 AudioBuffer 通道一致: 分数越高音调微升
          const p = a.play(); // 起播(返回 Promise, 可能被自动播放策略拦截)
          if (p && p.catch) p.catch(() => { /* 播放被拦截时静默, 不打断游戏 */ }); // 忽略播放失败
          return; // 元素通道已接管, 不再走合成音
        } catch (e) { /* 落回合成音 */ }
      }
      beepHit(score); // 兜底合成音
    };
    const playMiss = () => { // 没点中(点早/没入未点): default 采样播一遍
      if (!AC || dead) return; // 无音频或已销毁: 跳过
      if (missBuf instanceof AudioBuffer) { // 采样已就绪才走采样通道
        try { // 播放异常时退回合成音
          const src = AC.createBufferSource(); // 新建缓冲源
          src.buffer = missBuf; // 绑定没点中采样
          const g = AC.createGain(); g.gain.value = 0.5; // 音量节点: 固定 0.5 倍
          src.connect(g); g.connect(AC.destination); src.start(); // 源→增益→输出, 立即起播
          return; // 采样播放成功, 不再走兜底通道
        } catch (e) { /* 落回下一级兜底 */ }
      }
      if (typeof HTMLAudioElement !== 'undefined' && missBuf instanceof HTMLAudioElement) { // file:// 等协议下采样以 <audio> 元素形态兜底
        try { // 播放异常仍退回合成音
          const a = missBuf.cloneNode(); // 克隆新实例播放, 避免打断上一次
          a.volume = 0.5; // 与 AudioBuffer 通道一致的音量
          const p = a.play(); // 起播
          if (p && p.catch) p.catch(() => { /* 播放被拦截时静默 */ }); // 忽略播放失败
          return; // 元素通道已接管, 不再走合成音
        } catch (e) { /* 落回合成音 */ }
      }
      beepMiss(); // 兜底合成音
    };

    /* ---------------- 核心 + 玉环贴图 ---------------- */
    const HUES = opt.hues || [0x59d9ff, 0xb08cff, 0xff7fb2]; // 各按钮光圈色相(青/紫/粉), 宿主可覆盖
    const core = XianYuCore.createCore({ config: { nebulaHues: HUES }, onEvent: onCoreEvent }); // 创建核心逻辑(光圈生成/判定/星云模拟), 事件回流到 onCoreEvent
    let ringSkin = null; // 玉环贴图(异步加载就绪后才有)
    {
      let skin = opt.skin; // 贴图路径(可由宿主指定)
      if (skin === undefined && SCRIPT_URL) skin = SCRIPT_URL.replace(/[^/]*$/, '') + 'button-ring.png'; // 未指定时默认取 game.js 同目录的 button-ring.png
      if (typeof skin === 'string') { // 字符串 => 按 URL 异步加载
        const img = new Image(); // 新建图片对象
        img.onload = () => { if (!dead) { ringSkin = img; layout(); } }; // 加载成功且实例未销毁: 记录贴图并重排布局(半径可能随贴图调整)
        img.src = skin; // 触发加载
      } else if (skin) ringSkin = skin; // 已就绪的 HTMLImageElement 直接使用
    }
    let bgImg = null; // 背景图(异步加载就绪后才有)
    { // 背景图加载块: 与玉环贴图同款异步 Image 加载(file:// 下 <img> 标签通常允许加载本地资源)
      let bg = opt.background; // 背景图路径(可由宿主指定)
      if (bg === undefined && SCRIPT_URL) bg = SCRIPT_URL.replace(/[^/]*$/, '') + 'background.webp'; // 未指定时默认取 game.js 同目录的 background.webp
      if (typeof bg === 'string') { // 字符串 => 按 URL 异步加载
        const img = new Image(); // 新建图片对象
        img.onload = () => { if (!dead) { bgImg = img; layout(); } }; // 加载成功且未销毁: 记录背景图并重排(玉镯锚点需按图片实际绘制矩形重新落位)
        img.src = bg; // 触发加载
      } else if (bg) bgImg = bg; // 已就绪的 HTMLImageElement 直接使用
    }
    const vis = core.getButtons().map(() => ({ pressT: 1, punch: 1, shake: 0, dx: 0, dy: 0, flash: 0, flashColor: 0xffffff, glowA: 0, edgeA: 0, labelA: 0.45 })); // 每个按钮的视觉插值状态: 按压进度/缩放/抖动/位移/闪光/光晕/金圈/数字透明度
    const floats = [], waves = []; // 打击浮字/冲击波; 光圈离场动画由 core 模拟

    /* ---------------- 开局介绍(画布内): intro:false 跳过; 点击任意处或倒计时结束自动开局 ---------------- */
    let introT = AUTO || opt.intro === false ? 0 : (opt.introTime != null ? Math.max(0, +opt.introTime || 0) : 5); // 介绍剩余秒数: 演奏模式/intro:false 直接 0; 指定则取非负数; 缺省 5 秒
    let introDone = introT <= 0; // 介绍是否已结束(演奏模式/倒计时/点击/按键/宿主 start 等入口, 防重复开局)
    const introOn = () => !introDone && introT > 0; // 介绍页是否正在显示
    function endIntro() { // 介绍结束 => 直接开始一局
      if (introDone) return; // 已结束: 幂等返回, 防止重复 start
      introDone = true; // 标记介绍结束
      introT = 0; // 清零剩余时间
      ensureAudio(); // 倒计时自动开局时无手势, 浏览器可能限制声音到玩家首次点击为止
      core.start(); // 通知核心开始一局
    }
    function drawIntro() { // 绘制介绍页(半透明遮罩 + 标题/玩法/提示/倒计时)
      ctx.fillStyle = 'rgba(4,5,13,0.58)'; ctx.fillRect(0, 0, W, H); // 深色半透明遮罩压暗背景
      const cx = W / 2, cy = H / 2; // 画布中心
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = 1; // 文字居中对齐, 透明度复位
      ctx.fillStyle = '#eef4ff'; // 标题颜色: 亮蓝白
      ctx.font = `800 ${Math.round(clamp(W * 0.085, 34, 60))}px ${FONT}`; // 标题字号随宽度缩放, 夹在 34~60px
      ctx.fillText('弦玉之间', cx, cy - Math.round(H * 0.115)); // 画标题(中上位置)
      ctx.fillStyle = '#dfe9ff'; // 玩法说明颜色
      ctx.font = `500 ${Math.round(clamp(W * 0.028, 14, 21))}px ${FONT}`; // 说明字号随宽度缩放, 夹在 14~21px
      ctx.fillText('请在外围光圈缩小到和玉镯重合时点击玉镯', cx, cy + Math.round(H * 0.015)); // 画核心玩法说明(中心稍下)
      ctx.fillStyle = '#8fa3c8'; // 键盘提示颜色: 灰蓝
      ctx.fillText('PC 端可按键盘 1 / 2 / 3 代替', cx, cy + Math.round(H * 0.065)); // 画键盘操作提示
      ctx.fillStyle = '#ffd76a'; // 倒计时提示颜色: 金黄
      ctx.font = `600 ${Math.round(clamp(W * 0.026, 13, 19))}px ${FONT}`; // 提示字号随宽度缩放, 夹在 13~19px
      ctx.fillText(`点击任意处立即开始 · ${Math.ceil(introT)} 秒后自动开始`, cx, cy + Math.round(H * 0.145)); // 画点击提示与向上取整的剩余秒数
    }

    /* ---------------- 核心事件 => 音效/浮字/宿主回调 ---------------- */
    function onCoreEvent(type, d) { // core 事件分发: hit/fail 带负载(d.bi 按钮下标), start 无负载
      const B = d ? core.getButtons()[d.bi] : null, v = d ? vis[d.bi] : null; // start 事件无负载
      if (type === 'start' && AUTO) { autoMissRate = rand(0.08, 0.2); autoEarlyRate = rand(0.03, 0.1); } // 演奏模式每局重掷失误率: 有的局手滑多有的局稳, 避免固定节奏暴露脚本感
      if (type === 'hit') { // 点中事件
        floatText(B.x, B.y - B.r - 14, '+1', 0xffd76a, 34); // 按钮上方冒出金色 +1 浮字
        shock(B.x, B.y, 0xffe066, B.r * 1.6); // 按钮中心扩散金色冲击波
        v.flash = 1; v.flashColor = 0xffe066; v.shake = 0.35; // 金色闪光 + 轻微抖动
        playHit(d.score); // wav 采样, 失败退回合成音
      } else if (type === 'fail') { // 失误事件
        floatText(B.x, B.y - B.r - 14, '-1', 0xff6b7a, 30); // 按钮上方冒出红色 -1 浮字
        v.flash = 1; v.flashColor = 0xff5566; v.shake = 1; // 红色闪光 + 强烈抖动
        playMiss(); // 没点中: default 采样
      }
      if (typeof opt.onEvent === 'function') { try { opt.onEvent(type, d); } catch (e) { /* 宿主回调异常不影响游戏 */ } } // 透传给挂载时注册的 onEvent
      eventCbs.forEach(cb => { try { cb(type, d); } catch (e) { /* 同上 */ } }); // 透传给 onEvent(cb) 注册的所有回调
    }

    /* ---------------- 背景星野(transparent 模式保持为空) ---------------- */
    const BG_BLOBS = TRANSPARENT ? [] : [[0x1a3d7d, 0.30], [0x45208a, 0.24], [0x0e5a70, 0.22], [0x5e1f52, 0.18]].map(([tint, alpha]) => ({ // 四团彩色雾斑(深蓝/紫/青/洋红)及各自基础透明度
      spr: SPRITES.soft(tint), alpha, x: 0, y: 0, bx: 0, by: 0, size: 0, // 用 soft 精灵; 位置/尺寸待 layout() 填充
      sp1: rand(0.05, 0.12), sp2: rand(0.04, 0.1), ph: rand(0, TAU), rs: rand(-0.02, 0.02), rot: rand(0, TAU), // 漂移速度×2/相位/旋转速度/初始角度(各自随机, 避免同步运动)
    }));
    let stars = []; // 星星数组(随布局重建)
    const buildStars = () => { // 按画布面积重建星星
      stars = []; // 清空重建
      if (TRANSPARENT) return; // 透明模式不画星空
      for (let i = 0, n = clamp(Math.floor(W * H / 9000), 50, 240); i < n; i++) { // 数量按面积算(每 9000px² 一颗), 夹在 50~240
        const spark = Math.random() < 0.12; // 12% 概率生成四芒星, 其余为圆斑尘埃
        stars.push({ // 生成一颗星星
          spr: SPRITES[spark ? 'spark' : 'glow']([0xffffff, 0xbfd4ff, 0x9fc0ff, 0x8fb0ff][Math.floor(rand(0, 4))]), // 精灵按类型取, 颜色在白/浅蓝四档中随机
          x: rand(0, W), y: rand(0, H), size: rand(spark ? 3.8 : 2.2, spark ? 8.3 : 5.8), // 位置全屏随机; 尺寸区间按类型区分(四芒星更大)
          base: rand(0.2, 1), tw: rand(0.4, 2.0), ph: rand(0, TAU), a: 0, // 基础亮度/闪烁频率/相位(闪烁相位差避免整齐划一)/当前透明度
        });
      }
    };

    /* ---------------- 打击特效 ---------------- */
    const floatText = (x, y, str, color, size) => floats.push({ str, color, size, x, y, life: 0.9, dur: 0.9, vy: -85, alpha: 1, scale: 1 }); // 生成浮字: 生命 0.9s, 初始向上速度 85px/s
    const shock = (x, y, color, maxR) => waves.push({ color, x, y, maxR, life: 0.5, dur: 0.5, nowR: 1, alpha: 1 }); // 生成冲击波: 生命 0.5s, 扩散到 maxR
    function updateFx(dt) { // 特效推进(冲击波/浮字/背景雾/星星闪烁)
      for (let i = waves.length - 1; i >= 0; i--) { // 倒序遍历冲击波(便于边遍历边删除)
        const w = waves[i]; w.life -= dt; // 取当前项并扣减生命
        if (w.life <= 0) { waves.splice(i, 1); continue; } // 生命耗尽: 移除并跳过
        const k = 1 - w.life / w.dur; // 归一化进度 0→1
        w.nowR = w.maxR * (0.02 + easeOut(k)); w.alpha = 1 - k; // 半径缓出扩张, 透明度线性衰减
      }
      for (let i = floats.length - 1; i >= 0; i--) { // 倒序遍历浮字
        const f = floats[i]; f.life -= dt; // 取当前项并扣减生命
        if (f.life <= 0) { floats.splice(i, 1); continue; } // 生命耗尽: 移除并跳过
        const k = 1 - f.life / f.dur; // 归一化进度
        f.y += f.vy * dt; f.vy *= Math.exp(-2 * dt); // 上浮并按指数阻尼减速(帧率无关)
        f.alpha = Math.min(1, f.life / f.dur * 1.5); // 生命前 1/3 保持不透明, 之后线性淡出
        f.scale = 1 + 0.35 * (1 - easeOut(Math.min(1, k * 2.4))); // 出生时从 1.35 倍缩到 1 倍(前 ~42% 进度完成), 有弹出感
      }
      for (const s of BG_BLOBS) { // 背景雾斑漂移
        s.x = s.bx + Math.sin(T * s.sp1 + s.ph) * 46; // 横向正弦漂移(振幅 46px)
        s.y = s.by + Math.cos(T * s.sp2 + s.ph) * 34; // 纵向余弦漂移(振幅 34px, 与横向异速形成利萨如轨迹)
        s.rot += s.rs * dt; // 缓慢自转
      }
      for (const p of stars) p.a = p.base * (0.55 + 0.45 * Math.sin(T * p.tw + p.ph)); // 星星按各自频率/相位正弦闪烁(亮度在基础值的 10%~100% 间摆动)
    }

    /* ---------------- 按钮视觉状态 ---------------- */
    function updateVis(dt) { // 按钮视觉插值推进(呼吸/按压/抖动/闪光/金圈)
      const btns = core.getButtons(), rings = core.getRings(); // 本帧按钮与光圈数据(各取一次复用, 避免重复调用)
      const ringMap = new Map(); // 优化: bi => 光圈 的映射表, 把原来每按钮一次 find 的 O(n²) 降为 O(n)
      for (const r of rings) ringMap.set(r.bi, r); // 光圈数量极少(≤3), 建表开销可忽略
      vis.forEach((v, i) => { // 逐按钮更新视觉状态
        const b = btns[i], my = ringMap.get(i); // 本按钮数据 + 属于本按钮的当前光圈(可能没有)
        const active = !!my || !!b.pending; // 是否活跃: 有光圈在飞或已预约下一发
        v.pressT = Math.min(1, v.pressT + dt / 0.2); // 按压进度 0→1(0.2 秒走完)
        v.punch = 1 - 0.12 * Math.sin(v.pressT * Math.PI); // 按压缩放: 中途压到 0.88 倍后弹回(正弦半波)
        v.shake = Math.max(0, v.shake - dt * 3.2); // 抖动强度线性衰减
        v.dx = v.shake > 0 ? rand(-1, 1) * v.shake * 7 : 0; // 水平抖动位移(强度×7px, 停抖归零)
        v.dy = v.shake > 0 ? rand(-1, 1) * v.shake * 7 : 0; // 垂直抖动位移
        const breathe = 0.5 + 0.5 * Math.sin(T * 1.7 + i * 2.1); // 呼吸因子: 各按钮相位错开的 0~1 摆动
        v.glowA = lerp(v.glowA, active ? 0.5 : 0.15 + 0.08 * breathe, Math.min(1, dt * 8)) * (1 + v.flash * 1.2); // 光晕透明度向目标平滑过渡(活跃更亮), 闪光时再增亮
        v.flash = Math.max(0, v.flash - dt * 2.5); // 闪光强度衰减
        v.edgeA = lerp(v.edgeA, my && my.inWin ? 1 : (b.pending ? 0.35 + 0.35 * Math.sin(T * 16) : 0), Math.min(1, dt * 14)); // 金圈透明度: 在判定区内常亮 / 预约态高频闪烁 / 平常隐藏
        v.labelA = active ? 0.95 : 0.45; // 数字标签透明度: 活跃时更醒目
      });
    }

    /* ---------------- 绘制(只有游戏本体: 背景/玉镯/星云/特效) ---------------- */
    const blit = (spr, x, y, size, alpha) => { // 以中心点绘制精灵
      if (alpha <= 0.004 || size <= 0) return; // 几乎不可见或尺寸非法: 跳过绘制, 省去无效 drawImage
      ctx.globalAlpha = alpha; // 设置透明度
      ctx.drawImage(spr, x - size / 2, y - size / 2, size, size); // 以 (x,y) 为中心绘制 size×size
    };
    function drawBg() { // 绘制背景星野(雾斑 + 星星), 全部叠加发光混合
      ctx.globalCompositeOperation = 'lighter'; // 叠加混合: 多层光斑相加, 亮处更亮
      if (!bgImg) for (const s of BG_BLOBS) { // 逐雾斑绘制(有背景图时跳过: 避免雾斑冲淡卷轴画面)
        ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot); // 平移到雾斑位置并按自转角旋转
        blit(s.spr, 0, 0, s.size, s.alpha); // 在局部原点画雾斑精灵
        ctx.restore(); // 恢复变换矩阵
      }
      for (const p of stars) blit(p.spr, p.x, p.y, p.size, p.a); // 逐星星绘制(带闪烁透明度)
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; // 复位混合模式与透明度
    }
    function drawButtons() { // 绘制三个玉镯按钮(底盘/描边/贴图/金圈/数字)
      for (const b of core.getButtons()) { // 逐按钮绘制
        const v = vis[b.i]; // 本按钮视觉状态
        ctx.save(); // 保存变换, 便于本按钮独立平移/缩放
        ctx.translate(b.x + v.dx, b.y + v.dy); ctx.scale(v.punch, v.punch); // 平移到按钮位(含抖动偏移)并按按压缩放
        ctx.globalCompositeOperation = 'lighter'; // 光晕用叠加混合
        blit(SPRITES.soft(v.flash > 0 ? v.flashColor : HUES[b.i]), 0, 0, b.r * 3.2, v.glowA); // 画外光晕(闪光时用闪光色, 否则用本按钮色相)
        ctx.globalCompositeOperation = 'source-over'; // 切回普通混合画实体
        ctx.globalAlpha = 0.94; ctx.fillStyle = rgba(0x0b1126, 1); // 底盘填充: 深蓝黑, 透明度 0.94
        ctx.beginPath(); ctx.arc(0, 0, b.r, 0, TAU); ctx.fill(); // 画底盘圆
        ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = rgba(0x2a3763, 1); // 外描边: 2px 蓝灰
        ctx.beginPath(); ctx.arc(0, 0, b.r, 0, TAU); ctx.stroke(); // 画外描边圆
        ctx.lineWidth = 1; ctx.strokeStyle = rgba(0x1b2547, 1); // 内饰环: 1px 更深蓝
        ctx.beginPath(); ctx.arc(0, 0, b.r * 0.76, 0, TAU); ctx.stroke(); // 画 0.76 倍半径的内环
        if (b.img) { // 玉环贴图: 中孔透出底色圆, 判定金圈和数字画在其上
          const d = b.r * 2.2; // 贴图边长(直径 2.2 倍半径, 覆盖到底盘外)
          ctx.drawImage(b.img, -d / 2, -d / 2, d, d); // 居中画贴图
        }
        if (v.edgeA > 0.01) { // 判定框高亮(金色): 进判定区 / 出圈预兆
          ctx.globalCompositeOperation = 'lighter'; // 金圈用叠加混合更亮眼
          ctx.globalAlpha = v.edgeA; ctx.lineWidth = 5; ctx.strokeStyle = rgba(0xffe066, 1); // 按插值透明度画 5px 金色描边
          ctx.beginPath(); ctx.arc(0, 0, b.r, 0, TAU); ctx.stroke(); // 画金圈
          ctx.globalCompositeOperation = 'source-over'; // 复位混合
        }
        ctx.globalAlpha = v.labelA; ctx.fillStyle = rgba(0xdfe9ff, 1); // 数字标签颜色/透明度
        ctx.font = `800 ${Math.round(b.r * 0.44)}px ${FONT}`; // 数字字号随半径缩放(0.44 倍)
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; // 居中对齐
        ctx.fillText(String(b.i + 1), 0, 1); // 画编号(1/2/3), 微下移 1px 视觉居中
        ctx.globalAlpha = 1; // 透明度复位
        ctx.restore(); // 恢复变换矩阵
      }
    }
    function drawNebulas() { // 星云本体: core 输出绘制项, 这里只贴精灵
      const btns = core.getButtons(); // 按钮数据(本帧取一次)
      ctx.globalCompositeOperation = 'lighter'; // 星云粒子叠加发光
      for (const ring of core.getRings()) { // 逐光圈
        const b = btns[ring.bi], v = vis[ring.bi]; // 光圈归属的按钮与视觉状态(带抖动偏移跟随)
        for (const p of core.getNebula(ring.bi)) blit(SPRITES[SPRITE_OF[p.k] || 'glow'](p.c), b.x + v.dx + p.x, b.y + v.dy + p.y, p.s, p.a); // 逐粒子: 按类别选精灵, 位置=按钮位+抖动+粒子偏移
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; // 复位绘制状态
    }
    function drawFx() { // 星云离场动画(core 数据) + 冲击波 + 浮字
      ctx.globalCompositeOperation = 'lighter'; // 离场粒子与冲击波叠加发光
      const btns = core.getButtons(); // 优化: 按钮数据本帧只取一次, 供下方两处循环复用
      for (const b of core.getBursts()) { // 逐离场爆发组
        const btn = btns[b.bi], v = vis[b.bi]; // 爆发归属的按钮与视觉状态
        for (const o of b.items) blit(SPRITES[SPRITE_OF[o.k] || 'glow'](o.c), btn.x + v.dx + o.x, btn.y + v.dy + o.y, o.s, o.a); // 逐粒子贴精灵(位置随按钮抖动)
      }
      for (const w of waves) { // 逐冲击波
        ctx.globalAlpha = w.alpha; ctx.strokeStyle = rgba(w.color, 1); ctx.lineWidth = 3; // 透明度/颜色/3px 线宽
        ctx.beginPath(); ctx.arc(w.x, w.y, Math.max(0.5, w.nowR), 0, TAU); ctx.stroke(); // 画扩散圆环(半径下限 0.5 防止 0 尺寸绘制异常)
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; // 复位混合与透明度
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; // 浮字居中对齐(循环外设置一次即可)
      for (const f of floats) { // 逐浮字
        ctx.save(); // 保存变换
        ctx.translate(f.x, f.y); ctx.scale(f.scale, f.scale); // 平移到浮字位并按弹出缩放
        ctx.font = `800 ${f.size}px ${FONT}`; // 浮字字号
        ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(0x141026, 1); // 4px 圆角深色描边(保证任何背景上可读)
        ctx.globalAlpha = f.alpha; // 浮字透明度
        ctx.strokeText(f.str, 0, 0); // 先画描边层
        ctx.fillStyle = rgba(f.color, 1); ctx.fillText(f.str, 0, 0); // 再画填充层
        ctx.restore(); // 恢复变换
      }
    }
    function drawHud() { // 画布内 HUD: 分数 + 生命值(❤, 由 opt.hud 开关)
      const st = core.getState(); // 读核心实时状态(分数/失误/上限)
      const fs = Math.round(clamp(Math.min(W, H) * 0.034, 14, 24)); // HUD 字号随屏幕短边缩放
      ctx.save(); // 保存绘制状态: 阴影/字体只影响本段
      ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 6; // 文字投影: 亮背景上也可读
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'; // 顶部居中排布
      if (HUD.score) { // 分数
        ctx.font = `700 ${fs}px ${FONT}`; // 分数字体
        ctx.fillStyle = 'rgba(238,244,255,0.95)'; // 近白高亮
        ctx.fillText(`分数 ${st.score}`, W / 2, 12); // 顶部居中画分数
      }
      if (HUD.hp) { // 生命值 = maxFails - fails, 用红心表现
        const hp = Math.max(0, st.maxFails - st.fails); // 剩余生命
        ctx.font = `${fs + 3}px ${FONT}`; // 心形略大一号
        const adv = fs + 8; // 每颗心的水平步进
        for (let i = 0; i < st.maxFails; i++) { // 逐颗绘制(以 W/2 为中心对称排开)
          ctx.fillStyle = i < hp ? 'rgba(255,107,122,0.95)' : 'rgba(120,130,160,0.35)'; // 剩余=红, 已扣=灰
          ctx.fillText('♥', W / 2 + (i - (st.maxFails - 1) / 2) * adv, 12 + (HUD.score ? fs + 7 : 0)); // 分数正下方居中排开
        }
      }
      ctx.restore(); // 恢复绘制状态
    }
    function drawBgImage() { // 背景图按 contain 模式完整显示(等比缩放 + 居中, 不裁切不变形)
      const iw = bgImg.naturalWidth || bgImg.width, ih = bgImg.naturalHeight || bgImg.height; // 图片原始尺寸
      const s = Math.min(W / iw, H / ih); // contain 缩放系数: 长边贴合视口, 整张图完整可见(避免卷轴被裁)
      ctx.fillStyle = '#04050d'; ctx.fillRect(0, 0, W, H); // 先铺深空底色(视口与图片比例不一致时, 留边处不突兀)
      ctx.drawImage(bgImg, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s); // 居中完整绘制
    }
    function draw() { // 单帧总绘制: 背景→按钮→星云→特效→介绍页
      if (TRANSPARENT) ctx.clearRect(0, 0, W, H); // 透明模式: 只清屏不画底色
      else if (bgImg) drawBgImage(); // 背景图模式: 卷轴星图铺满
      else { ctx.fillStyle = '#04050d'; ctx.fillRect(0, 0, W, H); } // 普通模式: 深底色铺满
      if (!TRANSPARENT) drawBg(); // 星野叠加(背景图模式下跳过雾斑只画星星, 提供动态闪烁)
      drawButtons(); drawNebulas(); drawFx(); // 依次画按钮/星云/特效
      if (HUD.score || HUD.hp) drawHud(); // 画布内 HUD(分数/生命值, 由 opt.hud 开关)
      if (introOn()) drawIntro(); // 介绍页最后覆盖在最上层
    }

    /* ---------------- 布局(跟随容器尺寸) ---------------- */
    function layout() { // 重算画布尺寸/像素比/按钮位置与半径/背景物
      const sz = sizeOf(); W = sz.w; H = sz.h; // 读取容器尺寸并缓存
      DPR = Math.min(window.devicePixelRatio || 1, 2); // 像素比封顶 2(高清屏清晰度与性能的折中)
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR); // 物理像素尺寸(取整避免模糊)
      // canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; // (弃用)固定 px 尺寸, 改为百分比以贴合宿主缩放
      canvas.style.width = '100%'; canvas.style.height = '100%'; // CSS 尺寸铺满容器(与 inset:0 配合)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // 逻辑坐标系: 后续按 CSS 像素绘制, 内部自动乘 DPR
      const narrow = W < 560 || W / H < 0.95; // 窄屏用三角形排布(仅无背景图锚定时使用)
      let bgRect = null; // 背景图在画布上的实际绘制矩形(contain 模式计算结果; 无背景图/关闭锚定时为 null)
      if (bgImg && opt.bgAnchors !== false) { // 有背景图且未显式关闭锚定: 玉镯锚到图内星空
        const iw = bgImg.naturalWidth || bgImg.width, ih = bgImg.naturalHeight || bgImg.height; // 图片原始尺寸
        const s = Math.min(W / iw, H / ih); // 与 drawBgImage 相同的 contain 缩放系数
        bgRect = { x: (W - iw * s) / 2, y: (H - ih * s) / 2, w: iw * s, h: ih * s }; // 计算图片实际绘制矩形
      }
      const srect = bgRect && { x: bgRect.x + STAR_RECT.x0 * bgRect.w, y: bgRect.y + STAR_RECT.y0 * bgRect.h, w: (STAR_RECT.x1 - STAR_RECT.x0) * bgRect.w, h: (STAR_RECT.y1 - STAR_RECT.y0) * bgRect.h }; // 星海区域映射到画布像素(玉镯活动边界)
      let pts, autoR = Infinity; // 点位与星海约束半径(非锚定模式保持 Infinity, 走原公式)
      if (srect) { // 锚定星海: 优先并排且两侧贴边、半径尽量大; 宽度实在不够才切三角
        const PAD = Math.min(srect.w, srect.h) * 0.06; // 星海内边距: 两侧玉镯贴近星海边但保留一点呼吸间隙
        const rRow = Math.min((srect.w - 2 * PAD) / 6.7, srect.h / 2 - PAD, Math.min(W * 0.18, H * 0.18)); // 并排: 由"总宽 = 6r(三直径) + 2×0.35r(间隙) + 2×PAD"反解最大半径
        const triPts = [{ x: srect.x + 0.5 * srect.w, y: srect.y + 0.26 * srect.h }, { x: srect.x + 0.24 * srect.w, y: srect.y + 0.78 * srect.h }, { x: srect.x + 0.76 * srect.w, y: srect.y + 0.78 * srect.h }]; // 三角: 上 1 下 2
        const fit = (list, x0, y0, x1, y1) => { // 给定点位求最大可行半径: 两两不重叠且每个玉镯完整落在星海矩形内
          let m = Math.min(W * 0.18, H * 0.18); // 视口尺寸约束
          for (let a = 0; a < list.length; a++) for (let b = a + 1; b < list.length; b++) m = Math.min(m, Math.hypot(list[a].x - list[b].x, list[a].y - list[b].y) * 0.42); // 两两间距×0.42 防重叠
          for (const p of list) m = Math.min(m, p.x - x0, x1 - p.x, p.y - y0, y1 - p.y); // 各中心到星海四边的最近距离(半径不得超过, 保证不出星空)
          return m; // 该布局的最大可行半径
        };
        const rTri = fit(triPts, srect.x, srect.y, srect.x + srect.w, srect.y + srect.h); // 三角布局的可行半径
        if (rRow >= rTri * 0.85) { // 宽度基本够就优先并排(玉镯更大且两侧贴边)
          pts = [srect.x + PAD + rRow, srect.x + srect.w / 2, srect.x + srect.w - PAD - rRow].map(x => ({ x, y: srect.y + srect.h / 2 })); // 两侧玉镯贴边、中间居中, 垂直居中于星海
          autoR = rRow; // 使用并排的反解半径
        } else { pts = triPts; autoR = rTri; } // 明显不够宽才自动切三角
      } else if (opt.bgAnchors) { // 宿主自定义锚点(相对整张背景图): 直接映射, 由宿主自己保证落在星海内
        pts = opt.bgAnchors.map(a => ({ x: bgRect.x + a.x * bgRect.w, y: bgRect.y + a.y * bgRect.h })); // 映射锚点到画布坐标
      } else { // 无背景图: 按视口形态布局(原逻辑)
        pts = narrow
          ? [{ x: W * 0.5, y: H * 0.42 }, { x: W * 0.28, y: H * 0.70 }, { x: W * 0.72, y: H * 0.70 }] // 竖屏三角: 上 1 下 2
          : [{ x: W * 0.25, y: H * 0.55 }, { x: W * 0.5, y: H * 0.55 }, { x: W * 0.75, y: H * 0.55 }]; // 横屏一排三枚
      }
      let minD = Infinity; // 两两按钮最小间距(防重叠用)
      for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) minD = Math.min(minD, Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y)); // 遍历所有点对取最小距离
      let r; // 按钮半径
      if (opt.buttonRadius > 0) { // 宿主指定半径: >=1 按 px, <1 按短边比例; 只防相邻玉镯重叠
        const want = opt.buttonRadius < 1 ? Math.min(W, H) * opt.buttonRadius : opt.buttonRadius; // 换算期望半径(px)
        r = Math.max(12, Math.min(want, minD * 0.42)); // 下限 12px 保证可点, 上限 0.42×最小间距防重叠
      } else {
        r = clamp(Math.min(W * 0.16, H * 0.14, minD * 0.36, autoR), 34, 130); // 自动: 宽/高/间距/星海约束取最小, 夹在 34~130px(上限放宽让玉镯尽量大; 锚定星海时 autoR 已保证不出星空)
      }
      core.layout(pts.map(p => ({ x: p.x, y: p.y, r, img: ringSkin }))); // 把点位/半径/贴图交给核心(贴图可能尚未就绪, 为 null 时 core 走内置画环)
      [[0.24, 0.30, 0.55], [0.78, 0.26, 0.7], [0.62, 0.80, 0.6], [0.30, 0.82, 0.5]].forEach(([fx, fy, sz2], i) => { // 四团雾斑的相对位置与尺寸
        if (!BG_BLOBS[i]) return; // 透明模式无雾斑: 跳过
        BG_BLOBS[i].bx = W * fx; BG_BLOBS[i].by = H * fy; BG_BLOBS[i].size = Math.max(W, H) * sz2; // 记录基准位置(供漂移计算)与尺寸
      });
      buildStars(); // 重建星星(数量随新面积变化)
    }
    const onWinResize = () => layout(); // 窗口尺寸变化 => 立即重排
    window.addEventListener('resize', onWinResize); // 监听窗口 resize(destroy 时解绑)

    /* ---------------- 演奏模式(auto): AI 自动游玩, 禁用人类输入, 结束后自动开下一局 ---------------- */
    const autoPlan = new WeakMap(); // 光圈对象 => 本圈决策 { at: 计划按下时刻 } / { skip } / { early, at }(WeakMap: 光圈离场后自动回收, 无泄漏)
    let autoRestartTimer = 0; // 下一局自动开局的定时器句柄
    let autoMissRate = 0.12, autoEarlyRate = 0.06; // 本局失误率(每局 start 事件时重掷): 手慢没入 / 抢早点早
    function autoPlay() { // AI 操作: 全程拟人化 - 达标前偶尔抢早/手慢, 达标后不再点击任由失误收场
      const st = core.getState(); // 读实时状态(含局中标志与本局已命中数)
      if (st.state !== 'playing') return; // 非局中(结算/结束间隙)不操作
      const target = AUTO_HITS || st.targetScore; // 本局演奏目标: 指定次数(如 4)或核心满目标分
      if (st.hits >= target) return; // 达标后"一直失误": 不再按任何光圈, 任其接连没入塌缩, 直到 3 次失误自然收场
      for (const r of core.getRings()) { // 扫描场上光圈(决策提前到出场时做, 才能规划"抢早")
        let plan = autoPlan.get(r); // 读本圈已做的决策
        if (!plan) { // 光圈首次出现: 立即做本圈决策
          const roll = Math.random(); // 一次掷骰定本圈命运
          if (roll < autoEarlyRate) plan = { early: true, at: T + r.dur * rand(0.25, 0.5) }; // 抢早: 在收缩前段(远在判定区外)就按 => 必吃"点早"失误
          else if (roll < autoEarlyRate + autoMissRate) plan = { skip: true }; // 手慢: 压根不按, 任其没入 => 自然的"没反应过来"失误
          else plan = { at: 0 }; // 正常命中: at 先占位, 进判定区瞬间再定反应延迟
          autoPlan.set(r, plan); // 记录决策, 同一圈不会反复掷骰
        }
        if (plan.early) { // 抢早分支
          if (!r.inWin && T >= plan.at) { autoPlan.delete(r); vis[r.bi].pressT = 0; core.press(r.bi); } // 仍在判定区外且到点: 按下吃"点早"(若已被别的圈提前消耗则本圈自然走完)
          continue; // 抢早圈永远不进正常命中分支
        }
        if (!r.inWin) continue; // 未进判定区: 还不能按(按了会被判点早失误)
        if (!plan.at) plan.at = T + rand(0.03, 0.12); // 进判定区瞬间: 规划 30~120ms 人格化反应延迟
        if (T >= plan.at) { // 到点
          autoPlan.delete(r); // 先移除计划, 防止同一光圈重复触发
          vis[r.bi].pressT = 0; core.press(r.bi); // 复位按压动画并按下(命中/音效/浮字全走真人通道)
        }
      }
    }

    /* ---------------- 主循环(容器移出视口自动暂停, 嵌入友好) ---------------- */
    let paused = false, autoPaused = false, lastMs = performance.now(), rafId = 0; // 手动暂停/视口自动暂停/上一帧时间戳/动画帧句柄
    let sizeCheckT = 0; // 优化: 容器尺寸兜底检测的节流计时器(避免每帧读 clientWidth 强制排版)
    let io = null; // IntersectionObserver 实例
    if (typeof IntersectionObserver !== 'undefined') { // 环境支持才启用视口自动暂停
      io = new IntersectionObserver(es => { // 可见性回调
        autoPaused = !es[es.length - 1].isIntersecting; // 取最新一条: 移出视口则自动暂停
        lastMs = performance.now(); // 重置时间戳, 防止恢复时 dt 巨大导致跳帧
      });
      io.observe(hostEl); // 观察宿主容器
    }
    function frame(now) { // 每帧入口(rAF 驱动)
      rafId = requestAnimationFrame(frame); // 先排下一帧(即使本帧被暂停/销毁跳过, 生命周期由 destroy 统一 cancel)
      const dt = Math.min(now - lastMs, 50) / 1000; // 帧间隔(秒), 封顶 50ms 防止后台切回时物理步进过大
      lastMs = now; // 记录本帧时间
      if (paused || autoPaused || dead) return; // 手动暂停/移出视口/已销毁: 不更新不绘制
      T += dt; // 累计游戏时间(驱动呼吸/闪烁/漂移)
      sizeCheckT += dt; // 累计尺寸检测计时
      if (sizeCheckT >= 0.2) { // 兜底: 每 0.2 秒检查一次容器尺寸(节流; 窗口级变化仍由 resize 监听即时处理)
        sizeCheckT = 0; // 重置计时
        const sz = sizeOf(); // 读容器尺寸(读 clientWidth 会强制排版, 故必须节流)
        if (sz.w !== W || sz.h !== H) layout(); // 尺寸变了(容器变化但不派发 resize 的环境) => 重排
      }
      core.update(dt); // 推进核心逻辑(光圈缩放/星云模拟/判定)
      updateVis(dt); updateFx(dt); // 推进视觉插值与特效
      if (AUTO) autoPlay(); // 演奏模式: AI 按规划自动点击
      if (introOn()) { introT -= dt; if (introT <= 0) endIntro(); } // 倒计时结束自动开局
      draw(); // 绘制本帧画面
    }

    /* ---------------- 输入(pointer 绑定自家画布, 不劫持宿主) ---------------- */
    canvas.addEventListener('pointerdown', e => { // 画布指针按下: 处理开局/命中判定
      ensureAudio(); // 首次交互解锁音频上下文
      if (AUTO) return; // 演奏模式: 禁用人类输入(只看 AI 演奏)
      // alert()
      if (introOn()) { endIntro(); return; } // 介绍页任意点击 => 立即开局
      const rc = canvas.getBoundingClientRect(); // 画布在视口中的位置与实际渲染尺寸(可能被宿主 CSS 缩放)
      const x = (e.clientX / game.documentZoom - rc.left) * (W / Math.max(1, rc.width)); // 容器偏移/缩放换算
      const y = (e.clientY / game.documentZoom - rc.top) * (H / Math.max(1, rc.height)); // 同上(纵向); 依赖宿主全局 game.documentZoom 适配无名杀整体缩放
      for (const b of core.getButtons()) { // 命中区比可见圆大一圈, 方便手指点击
        if (Math.hypot(x - b.x, y - b.y) <= b.r * 1.32) { ensureAudio(); vis[b.i].pressT = 0; core.press(b.i); return; } // 距离命中(1.32 倍半径): 复位按压动画并通知核心判定, 命中即返回
      }
    });
    canvas.addEventListener('contextmenu', e => e.preventDefault()); // 屏蔽右键菜单, 避免长按/右击打断游戏
    let keyHandler = null; // 键盘监听句柄(destroy 时解绑)
    if (opt.keyboard !== false) { // 默认启用键盘(宿主可显式关闭)
      keyHandler = e => { // 键盘事件处理
        if (e.repeat) return; // 忽略长按连发
        if (AUTO) return; // 演奏模式: 禁用键盘输入
        const k = { Digit1: 0, Numpad1: 0, Digit2: 1, Numpad2: 1, Digit3: 2, Numpad3: 2 }[e.code]; // 主键盘/小键盘 1/2/3 => 按钮下标
        if (k === undefined) return; // 非目标按键: 忽略
        ensureAudio(); // 解锁音频
        if (introOn()) { endIntro(); return; } // 介绍页按 1/2/3 => 立即开局
        vis[k].pressT = 0; core.press(k); // 复位按压动画并通知核心判定
      };
      window.addEventListener('keydown', keyHandler); // 绑在 window 上(不抢占宿主焦点)
    }

    /* ---------------- 对外回调 ---------------- */
    let beatOneshot = null;         // start(cb) 传入的本局一次性回调
    const beatCbs = new Set();      // onEnd(cb) 注册的持久回调
    const eventCbs = new Set();     // onEvent(cb) 注册的过程事件回调
    if (typeof opt.onEnd === 'function') beatCbs.add(opt.onEnd); // 挂载时注册的结束回调入列
    if (typeof opt.onEvent === 'function') eventCbs.add(opt.onEvent); // 挂载时注册的事件回调入列
    core.onEnd(r => { // 核心局结束 => 结算音效 + 分发结果
      beepEnd(r.win); // 播放胜利/失败旋律
      if (AUTO) { clearTimeout(autoRestartTimer); autoRestartTimer = setTimeout(() => { if (!dead) core.start(); }, 1500); } // 演奏模式: 1.5 秒后自动开下一局, 无限循环演奏
      if (typeof beatOneshot === 'function') { try { beatOneshot(r); } catch (e) { /* 用户回调异常不影响游戏 */ } } // 先调本局一次性回调
      beatCbs.forEach(cb => { try { cb(r); } catch (e) { /* 同上 */ } }); // 再调所有持久回调
    });

    /* 测试钩子(仅 debug 模式挂 window.__xy) */
    if (opt.debug) { // debug 模式才暴露测试钩子
      window.__xy = { // 挂到全局供自动化测试调用
        _mine: true, // 归属标记: destroy 时据此删除, 不误删宿主同名对象
        core, draw, layout, errs: [], // 暴露核心/绘制/布局与错误收集
        introT: () => introT, // 读介绍剩余秒数
        press: i => { vis[i].pressT = 0; core.press(i); }, // 模拟按下第 i 个按钮
        rings: () => core.getRings().map(r => ({ bi: r.bi, scale: +r.scale.toFixed(3) })), // 读光圈缩放(保留 3 位小数便于断言)
        score: () => core.getState(), // 读实时状态(得分等)
        buttons: () => core.getButtons().map(b => ({ x: b.x, y: b.y, r: b.r })), // 读按钮几何信息
        pause: p => { paused = !!p; }, // 手动暂停/恢复
        step: (dt, n) => { for (let k = 0, m = Math.min(n || 1, 600); k < m; k++) core.update(dt || 1 / 60); }, // 手动快进核心逻辑(最多 600 步防卡死)
        neb: () => core.getRings().map(r => ({ bi: r.bi, n: core.getNebula(r.bi).length })), // 读各光圈星云粒子数
        fx: () => ({ floats: floats.length, waves: waves.length }), // 读特效计数
        audio: () => ({ hitBuf: hitBuf instanceof AudioBuffer, missBuf: missBuf instanceof AudioBuffer, hitEl: !!(hitBuf && hitBuf.cloneNode), missEl: !!(missBuf && missBuf.cloneNode) }), // 读采样加载状态(hitBuf/missBuf=AudioBuffer 最优通道; hitEl/missEl=<audio> 元素兜底通道)
        shot: () => { // 截图: 把主画布缩放绘制到临时画布并导出 dataURL
          const c = document.createElement('canvas'); // 临时画布
          c.width = Math.round(W * 0.75); c.height = Math.round(H * 0.75); // 尺寸为主画布 75%(减小导出体积)
          c.getContext('2d').drawImage(canvas, 0, 0, c.width, c.height); // 缩放拷贝主画布内容
          return c.toDataURL('image/png'); // 导出 PNG dataURL
        },
      };
    }

    /* ---------------- 启动: 只待命, 不开始、不弹任何面板 ---------------- */
    layout(); // 首次布局(计算尺寸/按钮/背景)
    rafId = requestAnimationFrame(frame); // 启动主循环(待命渲染)
    if (AUTO) { ensureAudio(); core.start(); } // 演奏模式: 挂载即开局循环演奏(介绍页已跳过)

    return { // 对外 API
      start(onEnd) { // 开始(或重开)一局; onEnd(result) 只对本局生效
        introDone = true; introT = 0; // 宿主直接开局: 跳过介绍
        beatOneshot = typeof onEnd === 'function' ? onEnd : null; // 记录本局一次性回调(非函数置空)
        ensureAudio(); // 手势里解锁音频上下文, 点中/没点中采样才能起播
        core.start(); // 通知核心开局
      },
      onEnd(cb) { if (typeof cb === 'function') beatCbs.add(cb); }, // 追加持久结束回调
      onEvent(cb) { if (typeof cb === 'function') eventCbs.add(cb); }, // 追加过程事件回调(start/spawn/window/hit/fail/consume)
      getResult: () => core.getResult(),           // 最近一局 { win, score, fails, hits, durationMs }; 未结束过为 null
      getState: () => core.getState(),             // 实时状态
      pause(p) { paused = !!p; if (!p) lastMs = performance.now(); }, // 暂停/恢复; 恢复时重置时间戳防 dt 跳变
      destroy() { // 卸载并释放: 停循环、解绑监听、关音频、移除画布
        if (dead) return; // 幂等: 重复销毁直接返回
        dead = true; // 标记销毁(所有异步回调入口都会检查此标记)
        cancelAnimationFrame(rafId); // 停止主循环
        clearTimeout(autoRestartTimer); // 取消演奏模式的自动开局定时器
        window.removeEventListener('resize', onWinResize); // 解绑窗口 resize
        if (keyHandler) window.removeEventListener('keydown', keyHandler); // 解绑键盘监听
        if (io) io.disconnect(); // 断开视口观察
        try { if (AC) AC.close(); } catch (e) { /* 忽略 */ } // 关闭音频上下文释放资源(部分环境 close 可能抛异常)
        canvas.remove(); // 从宿主移除画布
        beatCbs.clear(); beatOneshot = null; eventCbs.clear(); // 清空全部回调引用, 防止内存泄漏
        if (opt.debug && window.__xy && window.__xy._mine) delete window.__xy; // debug 模式下移除自己的测试钩子
      },
    };
  }

  return { mount }; // 对外只暴露 mount 一个入口
});
