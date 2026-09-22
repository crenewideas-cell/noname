/** One-way visual notifications. Providers receive frozen data, never an event,
 * player, card, rule registry or continuation. Results cannot affect gameplay. */
const listeners = new Set();
function freeze(value) {
	if (value && typeof value === "object") {
		for (const item of Object.values(value)) freeze(item);
		Object.freeze(value);
	}
	return value;
}
export function subscribePresentation(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
export function emitPresentation(type, snapshot) {
	if (!listeners.size) return;
	try {
		// Copy before freezing: even an accidental shared object from a producer
		// must never freeze engine state as a side effect of displaying an effect.
		const message = freeze(structuredClone({ ...snapshot(), type, time: performance.now() }));
		const recipients = [...listeners];
		queueMicrotask(() => {
			for (const listener of recipients) {
				if (!listeners.has(listener)) continue;
				try { Promise.resolve(listener(message)).catch(error => console.warn("UI 动画失败", error)); }
				catch (error) { console.warn("UI 动画失败", error); }
			}
		});
	} catch (error) { console.warn("UI 展示数据生成失败", error); }
}
export function playerPresentation(player) {
	if (!player?.node) return null;
	const rect = player.getBoundingClientRect();
	const hidden = ["unseen", "unseen_v", "unseen_show"].some(name => player.classList.contains(name));
	const hidden2 = ["unseen2", "unseen2_v", "unseen2_show"].some(name => player.classList.contains(name));
	return {
		seat: String(player.dataset.position || ""),
		name: hidden ? "未知武将" : player.node.name?.textContent || "",
		avatar: hidden ? "" : player.node.avatar?.style.backgroundImage || "",
		avatar2: hidden2 ? "" : player.node.avatar2?.style.backgroundImage || "",
		rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
	};
}
