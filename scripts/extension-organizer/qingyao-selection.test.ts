import test from "node:test";
import assert from "node:assert/strict";
import { installCharacterUI, playOptionalAudio } from "../../apps/core/extension/清瑶葭绮/members/假装无敌/compatibility.js";
import create from "../../apps/core/extension/清瑶葭绮/members/假装无敌/characters.js";

test("Qingyao installs its selection helper through the active lifecycle", () => {
	const lib: any = { config: {}, group: { add() {} }, groupnature: {}, translate: {}, characterPack: {} };
	const ui: any = {};
	const previous = globalThis.window;

	globalThis.window = {} as any;
	try {
		const extension = create(lib, {}, ui, {}, {}, {});
		extension.precontent();
		assert.equal(typeof ui.setFlashBackground, "function");
		assert.ok(extension.package.character.character.qy_qyqingyaoxuying);
		assert.equal(lib.qyUtils, undefined);
		const helper = ui.setFlashBackground;
		extension.precontent();
		assert.equal(ui.setFlashBackground, helper);
	} finally {
		globalThis.window = previous;
	}
});

test("background replacement supports missing old backgrounds and preserves an existing helper", () => {
	const previous = globalThis.document;
	const children: any[] = [];
	globalThis.document = { body: { firstChild: null, insertBefore(node) { children.unshift(node); } } } as any;
	try {
		const ui: any = { create: { div: () => ({ style: {}, setBackgroundImage(src) { this.src = src; } }) } };
		installCharacterUI({ config: { image_background_blur: true } }, ui);
		const background = ui.setFlashBackground("extension/qingyao.jpg");
		assert.equal(ui.background, background);
		assert.equal(children[0], background);
		assert.equal(background.src, "extension/qingyao.jpg");
		assert.equal(background.style.filter, "blur(8px)");
		const existing = () => "existing";
		const other = { setFlashBackground: existing };
		installCharacterUI({}, other);
		assert.equal(other.setFlashBackground, existing);
	} finally {
		globalThis.document = previous;
	}
});

test("optional selection music handles browser rejections and synchronous playback failures", async () => {
	for (const name of ["NotAllowedError", "NotSupportedError", "AbortError"]) {
		const error = Object.assign(new Error(name), { name });
		assert.equal(await playOptionalAudio({ play: () => Promise.reject(error) }), false);
		assert.equal(await playOptionalAudio({ play() { throw error; } }), false);
	}
	assert.equal(await playOptionalAudio({ play: () => Promise.resolve() }), true);
	assert.equal(await playOptionalAudio({ play() {} }), true);
});
