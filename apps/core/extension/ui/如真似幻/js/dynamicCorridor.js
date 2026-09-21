// Migrated from 如真似幻 2.0.2. Original authors: 蒸、某个萌新、非凡欧德内里、文和.
// UI scenes and ranking logic retained; legacy game bootstrap is intentionally excluded.
export default function (lib, game, ui, get, ai, _status, PIXI = globalThis.PIXI) {
    const register = callback => callback(lib, game, ui, get, ai, _status);
    window.dzxy_mzhl_dynamic = {
        shen_huatuo: {
            五灵济世: {
                name: "extension/十周年UI/assets/dynamic/神华佗/五灵济世/XingXiang",
                x: [0, 0.45],
                y: [0, 0.55],
                scale: 0.84,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/神华佗/五灵济世/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    deadline: "2025-3-29 00:00:00",
                    bundled: "白猿引道*周群",
                },
            },
        },
        maliang: {
            荡然由心: {
                name: "extension/十周年UI/assets/dynamic/马良/荡然由心/XingXiang",
                x: [0, 0.35],
                y: [0, 0.55],
                scale: 0.6,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/马良/荡然由心/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    deadline: "2025-3-15 00:00:00",
                    bundled: "独木难支*诸葛诞",
                },
            },
        },
        yj_jushou: {
            落定天元: {
                name: "extension/十周年UI/assets/dynamic/沮授/落定天元/XingXiang",
                x: [0, 0.25],
                y: [0, 0.5],
                scale: 0.84,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/沮授/落定天元/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    deadline: "2025-3-1 00:00:00",
                    bundled: "安远定交*吕岱",
                },
            },
        },
        db_wenyang: {
            破宇开天: {
                name: "extension/十周年UI/assets/dynamic/文鸯/破宇开天/XingXiang",
                x: [0, 0.5],
                y: [0, 0.5],
                scale: 0.84,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/文鸯/破宇开天/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    deadline: "2024-9-13 23:59:59",
                    bundled: "挽弓射敌*夏侯霸",
                    变身: "db_wenyang/破宇开天2",
                },
            },
            破宇开天2: {
                name: "extension/十周年UI/assets/dynamic/文鸯/破宇开天2/XingXiang",
                x: [0, 0.5],
                y: [0, 0.5],
                scale: 0.84,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/文鸯/破宇开天2/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    hidden: true,
                },
            },
        },
        zhonghui: {
            潜蛟觊天: {
                name: "extension/十周年UI/assets/dynamic/钟会/潜蛟觊天/XingXiang",
                x: [0, 0.25],
                y: [0, 0.5],
                scale: 0.84,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/钟会/潜蛟觊天/BeiJing",
                    x: [0, 0.25],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    deadline: "2024-8-13 23:59:59",
                    bundled: "海晏河清*刘表",
                    变身: "zhonghui/潜蛟觊天2",
                },
            },
            潜蛟觊天2: {
                name: "extension/十周年UI/assets/dynamic/钟会/潜蛟觊天2/XingXiang",
                x: [0, 0.5],
                y: [0, 0.5],
                scale: 0.84,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/钟会/潜蛟觊天2/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    hidden: true,
                },
            },
        },
        xin_liru: {
            业火毒计: {
                name: "extension/十周年UI/assets/dynamic/李儒/业火毒计/XingXiang",
                x: [0, 0.5],
                y: [0, 0.5],
                scale: 0.84,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/李儒/业火毒计/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    deadline: "2024-8-30 23:59:59",
                    bundled: "亲援余兵*曹仁",
                },
            },
        },
        wangyuanji: {
            婆娑起舞: {
                name: "extension/十周年UI/assets/dynamic/王元姬/婆娑起舞/XingXiang",
                x: [0, 0.5],
                y: [0, 0.5],
                scale: 0.84,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/王元姬/婆娑起舞/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.5],
                    scale: 0.84,
                },
                mzhl: {
                    deadline: "2024-8-30 23:59:59",
                    bundled: "不与俗同*崔琰",
                },
            },
        },
        guojia: {
            以身证道: {
                name: "extension/十周年UI/assets/dynamic/郭嘉/以身证道/XingXiang",
                x: [0, 0.25],
                y: [0, 0.5],
                scale: 1,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/郭嘉/以身证道/BeiJing",
                    x: [0, 0.25],
                    y: [0, 0.5],
                    scale: 1,
                },
                mzhl: {
                    deadline: "2024-8-31 23:59:59",
                    bundled: "蝗飞心乱*阎象",
                },
            },
        },
        yanghuiyu: {
            月耀华裳: {
                name: "extension/十周年UI/assets/dynamic/羊徽瑜/月耀华裳/XingXiang",
                x: [0, 0.5],
                y: [0, 0.65],
                scale: 1,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/羊徽瑜/月耀华裳/BeiJing",
                    x: [0, 0.5],
                    y: [0, 0.65],
                    scale: 1,
                },
                mzhl: {
                    deadline: "2024-8-31 23:59:59",
                    bundled: "奋威御侮*甘宁",
                },
            },
        },
        sp_duyu: {
            弼朝博虬: {
                name: "extension/十周年UI/assets/dynamic/杜预/弼朝博虬/XingXiang",
                x: [0, 0.35],
                y: [0, 0.5],
                scale: 1,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/杜预/弼朝博虬/BeiJing",
                    x: [0, 0.35],
                    y: [0, 0.5],
                    scale: 1,
                },
                //其他的参数同十周年，只是在十周年上额外加了以下参数↓
                //仅支持手杀的动皮
                mzhl: {
                    deadline: "2024-8-31 23:59:59", //上面显示的倒计时，仅显示作用，可以不写
                    // directgain: true,//不用抽奖直接获得
                    //hidden: true,//在梦之回廊中不显示，用在变身皮肤上
                    变身: "sp_duyu/弼朝博虬2", //状态2
                },
            },
            弼朝博虬2: {
                name: "extension/十周年UI/assets/dynamic/杜预/弼朝博虬2/XingXiang",
                x: [0, 0.35],
                y: [0, 0.5],
                scale: 1,
                beijing: {
                    name: "extension/十周年UI/assets/dynamic/杜预/弼朝博虬2/BeiJing",
                    x: [0, 0.35],
                    y: [0, 0.5],
                    scale: 1,
                },
                mzhl: {
                    hidden: true,
                },
            },
        },
    };
}
