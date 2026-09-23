/** One-way visual notifications. Providers receive frozen data, never an event,
 * player, card, rule registry or continuation. Results cannot affect gameplay. */
const listeners = new Set();
const handLimits = new WeakMap(), dyingStates = new WeakMap();
// Observe the result of an existing rule query. Never call modifiers from UI.
export function rememberHandLimit(player, value) {
	if (Object.is(handLimits.get(player), value)) return;
	handLimits.set(player, value);
	emitPresentation("handLimit", () => ({ seat: String(player.dataset?.position || ""), value }));
}
export function handLimitPresentation(player) { return handLimits.get(player); }
export function rememberDying(player, active) {
	dyingStates.set(player, active === true);
	emitPresentation("dying", () => ({ player: playerPresentation(player), active: active === true }));
}
export function dyingPresentation(player) { return dyingStates.get(player) === true && player.hp <= 0 && !player.classList.contains("dead"); }
// Cosmetic milestones have their own weakly held state. They never enter
// player.storage, skill registries, rule statistics or the event queue.
const recoveryMilestones = new WeakMap(), rescueMilestones = new WeakMap();
export function clearPlayerPresentation(player) {
	handLimits.delete(player);dyingStates.delete(player);
	recoveryMilestones.delete(player);rescueMilestones.delete(player);
	emitPresentation("playerReset", () => ({ seat: String(player.dataset?.position || "") }));
}
export function recoveryPresentation(player, source, { amount, phase, rescued }) {
	if (!source || !Number.isFinite(amount) || amount <= 0) return [];
	const result = [], previous = recoveryMilestones.get(player);
	const total = (previous?.phase === phase ? previous.total : 0) + amount;
	recoveryMilestones.set(player, { phase, total: total >= 3 ? 0 : total });
	if (total >= 3) result.push("recovery");
	if (rescued && source !== player) {
		const count = (rescueMilestones.get(source) || 0) + 1;
		rescueMilestones.set(source, count >= 3 ? 0 : count);
		if (count >= 3) result.push("rescue");
	}
	return result;
}
function freeze(value, seen = new WeakSet()) {
	if (value && typeof value === "object") {
		if (seen.has(value)) return value;
		seen.add(value);
		for (const item of Object.values(value)) freeze(item, seen);
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

// Declarative labels only: do not call skill filters, dynamic translations,
// storage accessors or modifiers while rendering. Hidden generals' skills are
// intentionally unavailable to an observer. The local player's known skills
// can be shown even while that player's general is unrevealed.
export function skillPresentation(player, library, local = false) {
	const stored = (object, key) => Object.getOwnPropertyDescriptor(object || {}, key)?.value;
	if (!player || (!local && ["unseen", "unseen2", "unseen_v", "unseen2_v", "unseen_show", "unseen2_show"].some(name => player.classList.contains(name)))) return Object.freeze([]);
	const ids = new Set([...(stored(player, "skills") || []), ...(local ? stored(player, "hiddenSkills") || [] : []), ...Object.keys(stored(player, "tempSkills") || {})]);
	for (const [key, entry] of Object.entries(Object.getOwnPropertyDescriptors(stored(player, "additionalSkills") || {}))) {
		if (!local && key.startsWith("hidden:")) continue;
		if (Array.isArray(entry.value)) for (const id of entry.value) ids.add(id);
		else if (typeof entry.value === "string") ids.add(entry.value);
	}
	const result = [];
	for (const id of ids) {
		const info = stored(library.skill, id), label = stored(library.translate, id);
		if (!info || typeof label !== "string" || stored(info, "charlotte") || stored(info, "nopop")) continue;
		const kind = stored(info, "zhuanhuanji") || stored(info, "zhuanhuanji2") ? "conversion" : stored(info, "dutySkill") ? "mission" : stored(info, "juexingji") ? "awakening" : stored(info, "limited") ? "limited" : "normal";
		const value = stored(stored(player, "storage"), id);
		result.push({ id, label: label.replace(/<[^>]*>/g, ""), kind,
			active: !!stored(info, "enable"), used: (stored(player, "awakenedSkills") || []).includes(id),
			// Custom and multi-state conversions have no universal yin/yang mapping.
			state: kind === "conversion" && typeof stored(info, "zhuanhuanji") === "boolean" ? (value === true ? "yin" : "yang") : "",
		});
	}
	return freeze(result);
}
