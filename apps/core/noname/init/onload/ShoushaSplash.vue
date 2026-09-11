<template>
	<header class="lobby-heading">
		<div>
			<p class="lobby-kicker">群雄聚首 · 执掌风云</p>
			<h1>无名杀</h1>
		</div>
		<p class="lobby-welcome">选择模式，开启对局</p>
	</header>
	<main class="lobby-modes" aria-label="游戏模式">
		<button v-for="(mode, index) in modes" :key="mode" type="button" class="lobby-mode" :disabled="selected !== null" :class="{ clicked: selected === mode }" :aria-label="get.translation(mode)" @click="enter(mode, $event)">
			<img class="lobby-art" :ref="node => setArtwork(node, mode)" width="913" height="1275" alt="" decoding="async" draggable="false" @error="useFallback" />
			<div class="lobby-mode-caption">
				<span>{{ get.translation(mode) }}</span
				><small>{{ descriptions[mode] || "独具特色，自成一局" }}</small>
			</div>
			<span class="lobby-mode-number" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
		</button>
		<p v-if="!modes.length" class="lobby-empty">暂无可用模式，请检查模式配置。</p>
	</main>
	<footer class="lobby-footer"><span>手杀风华</span><span>支持触屏滑动与键盘选择</span></footer>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { lib, get, game } from "noname";

const props = defineProps<{ handle: (mode: string) => string; click: (mode: string, node: HTMLElement) => void }>();
const modes = [...new Set<string>(lib.config.all.mode)].filter(mode => mode !== "connect");
const artworkModes = new Set(["identity", "guozhan", "doudizhu", "versus", "single", "connect", "boss", "brawl", "chess", "stone", "tafang"]);
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
