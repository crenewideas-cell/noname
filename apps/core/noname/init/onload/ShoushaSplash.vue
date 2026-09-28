<template>
	<header class="lobby-heading">
		<h1 class="lobby-brand" aria-label="无名杀">无名杀</h1>
		<p class="lobby-kicker">群雄聚首 · 共竞风云</p>
		<p class="lobby-welcome">选择模式，开启对局</p>
	</header>
	<main class="lobby-modes" aria-label="游戏模式">
		<section v-for="group in groups" :key="group.id" class="lobby-mode-group" :class="`lobby-group-${group.id}`" :aria-label="group.title">
			<header class="lobby-group-heading"><h2>{{ group.title }}</h2><p>{{ group.subtitle }}</p></header>
			<div class="lobby-group-cards">
				<button v-for="(mode, index) in group.modes" :key="mode" :data-ui-mode="mode" type="button" class="lobby-mode lobby-atlas-card" :disabled="selected !== null || (mode !== 'more' && !modes.includes(mode))" :class="{ clicked: selected === mode, 'lobby-mode-featured': index === 0 && group.id !== 'extra' }" :aria-label="modeLabel(mode)" :title="mode !== 'more' && !modes.includes(mode) ? `${modeLabel(mode)}（未启用）` : modeLabel(mode)" @click="mode === 'more' ? moreDialog?.showModal() : enter(mode, $event)">
					<svg class="lobby-portrait" :viewBox="mode === 'more' ? '1398 530 95 70' : index === 0 && group.id !== 'extra' ? '40 100 833 970' : '40 100 833 620'" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
						<image :href="mode === 'more' ? referenceAtlas : `${lib.assetURL}image/splash/shousha/${mode}.jpg`" :width="mode === 'more' ? 1672 : 913" :height="mode === 'more' ? 941 : 1275" />
					</svg>
					<div class="lobby-mode-caption"><span>{{ modeLabel(mode) }}</span><small>{{ descriptions[mode] || "独具特色，自成一局" }}</small></div>
					<span class="lobby-mode-number" aria-hidden="true">{{ String(displayModes.indexOf(mode) + 1).padStart(2, "0") }}</span>
				</button>
			</div>
		</section>
		<p v-if="!modes.length" class="lobby-empty">暂无可用模式，请检查模式配置。</p>
	</main>
	<footer class="lobby-footer"><strong>牌起风云，谋定乾坤</strong><span>在这里，遇见不一样的世界</span></footer>
	<dialog ref="moreDialog" class="lobby-more-dialog" aria-labelledby="lobby-more-title">
		<header><h2 id="lobby-more-title">更多模式</h2><button type="button" @click="moreDialog?.close()">返回</button></header>
		<p v-if="!extraModes.length">暂无其它已启用模式，可在选项中管理模式扩展。</p>
		<div class="lobby-more-grid">
			<button v-for="mode in extraModes" :key="mode" :data-ui-mode="mode" type="button" class="lobby-mode" :disabled="selected !== null" :aria-label="modeLabel(mode)" @click="enter(mode, $event)">
				<img class="lobby-art" :ref="node => setArtwork(node, mode)" width="913" height="1275" alt="" decoding="async" draggable="false" @error="useFallback" />
				<div class="lobby-mode-caption"><span>{{ modeLabel(mode) }}</span><small>{{ descriptions[mode] || "独具特色，自成一局" }}</small></div>
			</button>
		</div>
	</dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { lib, get, game } from "noname";

const props = defineProps<{ handle: (mode: string) => string; click: (mode: string, node: HTMLElement) => void }>();
const modes = [...new Set<string>(lib.config.all.mode)].filter(mode => mode !== "connect");
const artworkModes = new Set(["identity", "guozhan", "doudizhu", "versus", "single", "connect", "boss", "brawl", "chess", "stone", "tafang"]);
const extraModes = modes.filter(mode => !artworkModes.has(mode));
const groups = [
	{ id: "classic", title: "经典模式", subtitle: "智谋纵横，经典永恒", modes: ["identity", "guozhan", "versus"] },
	{ id: "challenge", title: "挑战模式", subtitle: "突破极限，挑战自我", modes: ["boss", "doudizhu", "single"] },
	{ id: "extra", title: "娱乐拓展", subtitle: "百变玩法，乐在其中", modes: ["chess", "tafang", "stone", "brawl", "more"] },
];
const displayModes = groups.flatMap(group => group.modes);
// The stock portraits share the same 913 x 1275 source size. Frames and labels
// are independent; the composite screenshot must not dictate card dimensions.
const referenceAtlas = `${lib.assetURL}image/lobby/reference-atlas.png`;
const moreDialog = ref<HTMLDialogElement | null>(null);
const labels: Record<string, string> = { identity: "身份", guozhan: "国战", versus: "对决", boss: "挑战", doudizhu: "斗地主", single: "单挑", chess: "战棋", tafang: "塔防", stone: "演武", brawl: "乱斗", more: "更多模式" };
const modeLabel = (mode: string) => labels[mode] || get.translation(mode);
const descriptions: Record<string, string> = {
	identity: "明辨忠奸，运筹帷幄",
	guozhan: "合纵连横，逐鹿天下",
	doudizhu: "三人争锋，智取胜局",
	versus: "并肩迎敌，默契制胜",
	single: "一对一，见真章",
	connect: "邀友入席，共赴对局",
	boss: "群雄合力，挑战强敌",
	brawl: "百变规则，别样对局",
	chess: "步步为营，谋定而动",
	tafang: "排兵布阵，自成一局",
	stone: "自由演练，感受进化",
	more: "更多玩法，待君探索",
};
const selected = ref<string | null>(null);
let disposed = false;
onBeforeUnmount(() => {
	disposed = true;
});

function enter(mode: string, event: MouseEvent) {
	if (selected.value !== null || disposed) return;
	selected.value = mode;
	props.click(mode, event.currentTarget as HTMLElement);
}

function setArtwork(element: unknown, mode: string) {
	if (!(element instanceof HTMLImageElement) || element.dataset.loadedMode === mode) return;
	element.dataset.loadedMode = mode;
	delete element.dataset.fallback;
	// A real image supplies an intrinsic height to the grid, including before it loads.
	element.src = fallbackArtwork;
	const stock = lib.config.all.stockmode.includes(mode);
	const source = stock && artworkModes.has(mode) ? `image/splash/shousha/${mode}.jpg` : stock ? props.handle(mode) : lib.mode[mode]?.splash;
	if (!source) return;
	try {
		const address = lib.init.parseResourceAddress(source);
		if (address.protocol === "db:") {
			game.getDB("image", address.href.slice(3))
				.then(source => {
					if (disposed || element.dataset.loadedMode !== mode) return;
					if (typeof source === "string" && source) element.src = source;
				})
				.catch(() => {
					if (!disposed && element.dataset.loadedMode === mode) element.src = fallbackArtwork;
				});
		} else {
			element.src = address.href;
		}
	} catch {
		element.src = fallbackArtwork;
	}
}

const fallbackArtwork = `${lib.assetURL}image/splash/style1/identity.jpg`;
function useFallback(event: Event) {
	const image = event.currentTarget as HTMLImageElement;
	if (disposed || image.dataset.fallback) return;
	image.dataset.fallback = "true";
	image.src = fallbackArtwork;
}
</script>
