import { lib, game, ui, get, ai, _status } from "./main/utils.js";
import { precontent } from "./main/precontent.js";
import { content } from "./main/content.js";
import config from "./main/config.js";

const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/华夏风云/info.json`);
let extensionPackage = {
	name: "华夏风云",
	config,
	help: {},
	package: {},
	precontent,
	content,
	files: { character: [], card: [], skill: [], audio: [] },
};

Object.keys(extensionInfo)
	.filter(key => key !== "name")
	.forEach(key => {
		extensionPackage.package[key] = extensionInfo[key];
	});

export let type = "extension";
export default extensionPackage;
// ================================================================
//  ★★★ 华夏风云 · 十周年UI移动版势力框图片注入（带前缀版）★★★
//  ★ 针对 GXS_ 前缀的新势力单独注册背景图片 ★
// ============================================================
// ================================================================
//  ★★★ 华夏风云 · 十周年UI移动版势力框图片注入（完整版）★★★
//  ★ 注册 GXS_ 前缀的新势力背景图片 ★
// ================================================================
lib.onload.push(function() {
    var isMobileUI = lib.config.extension_十周年UI_newDecadeStyle === 'off';
    if (!isMobileUI) {
        console.log('✅【华夏风云】当前UI非“移动版”皮肤，跳过图片注入。');
        return;
    }

    var style = document.createElement('style');
    style.innerHTML = `
        /* 君势力（GXS_jun）*/
        .camp-wrap[data-camp='GXS_jun'] > .camp-back {
            background-image: url('extension/华夏风云/shizhounian/group/name2_GXS_jun.png') !important;
            background-size: 104% 101.5% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        .camp-wrap[data-camp='GXS_jun'] > .camp-back::before {
            display: none !important;
        }

        /* 臣势力（GXS_chen）*/
        .camp-wrap[data-camp='GXS_chen'] > .camp-back {
            background-image: url('extension/华夏风云/shizhounian/group/name2_GXS_chen.png') !important;
            background-size: 104% 101.5% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        .camp-wrap[data-camp='GXS_chen'] > .camp-back::before {
            display: none !important;
        }

        /* 民势力（GXS_min）*/
        .camp-wrap[data-camp='GXS_min'] > .camp-back {
            background-image: url('extension/华夏风云/shizhounian/group/name2_GXS_min.png') !important;
            background-size: 104% 101.5% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        .camp-wrap[data-camp='GXS_min'] > .camp-back::before {
            display: none !important;
        }

        /* 魂势力（GXS_hun）*/
        .camp-wrap[data-camp='GXS_hun'] > .camp-back {
            background-image: url('extension/华夏风云/shizhounian/group/name2_GXS_hun.png') !important;
            background-size: 104% 101.5% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        .camp-wrap[data-camp='GXS_hun'] > .camp-back::before {
            display: none !important;
        }

        /* 魔势力（GXS_mo）*/
        .camp-wrap[data-camp='GXS_mo'] > .camp-back {
            background-image: url('extension/华夏风云/shizhounian/group/name2_GXS_mo.png') !important;
            background-size: 104% 101.5% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        .camp-wrap[data-camp='GXS_mo'] > .camp-back::before {
            display: none !important;
        }

        /* 妖势力（GXS_yao）*/
        .camp-wrap[data-camp='GXS_yao'] > .camp-back {
            background-image: url('extension/华夏风云/shizhounian/group/name2_GXS_yao.png') !important;
            background-size: 104% 101.5% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        .camp-wrap[data-camp='GXS_yao'] > .camp-back::before {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    console.log('✅【华夏风云】十周年UI移动版 GXS_ 系列势力图片已全部注入！');
});
// ================================================================
//  ★★★ 华夏风云 · 十周年UI非移动版势力角标（小图标）注入 ★★★
//  ★ 注册 name_ 前缀图片，仅当十周年UI移动版未开启时生效 ★
// ================================================================
lib.onload.push(function() {
    var isMobileUI = lib.config.extension_十周年UI_newDecadeStyle === 'off';
    if (isMobileUI) {
        console.log('✅【华夏风云】当前UI为移动版，跳过非移动版图片注入。');
        return;
    }

    var style = document.createElement('style');
    style.innerHTML = `
        /* 君势力（GXS_jun）*/
        .camp-wrap[data-camp='GXS_jun']::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -5px;
            width: 43px;
            height: 43px;
            background: url('extension/华夏风云/shizhounian/group/name_GXS_jun.png') no-repeat center / contain;
            z-index: 9999;
            pointer-events: none;
        }

        /* 臣势力（GXS_chen）*/
        .camp-wrap[data-camp='GXS_chen']::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -5px;
            width: 43px;
            height: 43px;
            background: url('extension/华夏风云/shizhounian/group/name_GXS_chen.png') no-repeat center / contain;
            z-index: 9999;
            pointer-events: none;
        }

        /* 民势力（GXS_min）*/
        .camp-wrap[data-camp='GXS_min']::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -5px;
            width: 43px;
            height: 43px;
            background: url('extension/华夏风云/shizhounian/group/name_GXS_min.png') no-repeat center / contain;
            z-index: 9999;
            pointer-events: none;
        }

        /* 魂势力（GXS_hun）*/
        .camp-wrap[data-camp='GXS_hun']::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -5px;
            width: 43px;
            height: 43px;
            background: url('extension/华夏风云/shizhounian/group/name_GXS_hun.png') no-repeat center / contain;
            z-index: 9999;
            pointer-events: none;
        }

        /* 魔势力（GXS_mo）*/
        .camp-wrap[data-camp='GXS_mo']::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -5px;
            width: 43px;
            height: 43px;
            background: url('extension/华夏风云/shizhounian/group/name_GXS_mo.png') no-repeat center / contain;
            z-index: 9999;
            pointer-events: none;
        }

        /* 妖势力（GXS_yao）*/
        .camp-wrap[data-camp='GXS_yao']::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -5px;
            width: 43px;
            height: 43px;
            background: url('extension/华夏风云/shizhounian/group/name_GXS_yao.png') no-repeat center / contain;
            z-index: 9999;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    console.log('✅【华夏风云】十周年UI非移动版 GXS_ 系列势力角标已全部注入！');
});