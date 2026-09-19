import { game, ui, get, _status } from "noname";

let panel, message, steps, selection, undo, reset, activeEvent;
let resizeObserver, controlObserver, layoutFrame;
const marked = new Set();
const plain = value => String(value ?? "").replace(/<[^>]*>/g, "");

function formatRange(min, max) {
	if (max < 0) return "全部";
	if (!Number.isFinite(max)) return min > 0 ? `至少${min}` : "不限";
	return min === max ? String(max) : `${min}～${max}`;
}

export function clearSelectionGuide() {
    resizeObserver?.disconnect(); controlObserver?.disconnect(); cancelAnimationFrame(layoutFrame);
    window.removeEventListener("resize", scheduleLayout);
    ui.control?.removeEventListener("transitionend", scheduleLayout);
    for (const target of marked) {
        target.classList.remove("selection-candidate", "selection-picked", "selection-unavailable");
        target.querySelector(":scope > .selection-target-badge")?.remove();
    }
    marked.clear();
    panel?.remove(); panel = null; activeEvent = null;
	ui.window?.style.removeProperty("--selection-guide-clearance");
}

function scheduleLayout() {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => {
        if (!panel?.isConnected) return;
        const container = ui.window.getBoundingClientRect();
        const scale = container.height / ui.window.clientHeight || 1;
        const controls = Array.from(ui.control?.children || []).filter(node => !node.classList.contains("removing") && node.getClientRects().length && getComputedStyle(node).visibility !== "hidden");
        const top = Math.min(container.bottom, ...controls.map(node => node.getBoundingClientRect().top));
        // Measure actual wrapped skill rows, including UI zoom, rather than
        // assuming every device has a fixed 155/180px action area.
        panel.style.bottom = `${Math.max(12, (container.bottom - top) / scale + 12)}px`;
        panel.style.maxHeight = `${Math.max(52, Math.min(180, (top - container.top) / scale - 20))}px`;
		// Subtitles share this coordinate system and sit above the whole guide.
		ui.window.style.setProperty("--selection-guide-clearance", `${parseFloat(panel.style.bottom) + panel.offsetHeight + 12}px`);
    });
}

// Display the engine's actual selection order and legal targets. This module
// never adds candidates or changes a card/skill's target filters.
export function updateSelectionGuide(event, ok) {
    if (!event.isMine() || !event.filterTarget || !ui.arena || typeof window.__nonameHostEmit === "function") {
        clearSelectionGuide(); return;
    }
    if (activeEvent !== event) clearSelectionGuide();
    activeEvent = event;
    const cardInfo = get.info(get.card()) || {}, skillInfo = get.info(event.skill) || {};
    const prompts = event.targetprompt || (!skillInfo.viewAs && skillInfo.targetprompt) || cardInfo.targetprompt;
    const roles = Array.isArray(prompts) ? prompts.map(plain) : [];
    const chosen = ui.selected.targets;
    const targetRange = get.select(event.selectTarget);
    if (targetRange[1] === 0 && !chosen.length && !roles.length) { clearSelectionGuide(); return; }
    const ordered = roles.length > 1 || event.complexSelect || event.complexTarget || cardInfo.complexSelect || cardInfo.complexTarget || cardInfo.singleCard || skillInfo.complexTarget;
    const stages = [
        ["button", "候选项", ui.selected.buttons], ["card", "卡牌", ui.selected.cards], ["target", "目标", chosen],
    ].filter(([type]) => event["filter" + type[0].toUpperCase() + type.slice(1)]);
    const counts = stages.map(([type, label, items]) => {
        const [min, max] = get.select(event["select" + type[0].toUpperCase() + type.slice(1)]);
        return { type, label, count: items.length, min, max };
    });
    const prerequisite = counts.find(item => item.type !== "target" && item.count < item.min);
    const targetStage = !prerequisite && (targetRange[1] !== 0 || chosen.length > 0);
    if (!panel) {
        panel = document.createElement("section"); panel.className = "selection-guide";
        panel.setAttribute("aria-label", "选择目标与操作顺序");
        for (const type of ["click", "pointerdown", "pointerup", "touchstart", "touchend"]) panel.addEventListener(type, e => e.stopPropagation());
        message = document.createElement("strong"); message.setAttribute("role", "status"); message.setAttribute("aria-live", "polite");
        steps = document.createElement("div"); steps.className = "selection-guide-steps";
        selection = document.createElement("div"); selection.className = "selection-guide-chosen";
        const actions = document.createElement("div"); actions.className = "selection-guide-actions";
        function button(text, action) {
            const node = document.createElement("button"); node.type = "button"; node.textContent = text;
            node.onclick = () => { if (_status.event === activeEvent && activeEvent.isMine()) action(); };
            actions.append(node); return node;
        }
        undo = button("撤销最后目标", () => {
            const target = ui.selected.targets.pop();
            target?.classList.remove("selected"); target?.unprompt();
            activeEvent.custom?.add?.target?.(); game.check();
        });
        reset = button("重选目标", () => { game.uncheck("target"); event.custom?.add?.target?.(); game.check(); });
        panel.append(message, steps, selection, actions); ui.window.append(panel);
        resizeObserver = new ResizeObserver(scheduleLayout);
        resizeObserver.observe(ui.window);
		resizeObserver.observe(panel);
        if (ui.control) {
            resizeObserver.observe(ui.control);
            ui.control.addEventListener("transitionend", scheduleLayout);
            controlObserver = new MutationObserver(scheduleLayout);
            controlObserver.observe(ui.control, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
        }
        window.addEventListener("resize", scheduleLayout);
    }
    const stageText = counts.map((item, index) => `${index + 1}. ${item.label} ${item.count}/${formatRange(item.min, item.max)}`).join(" → ") + (ordered ? " · 按编号依次选人" : "");
    if (steps.textContent !== stageText) steps.textContent = stageText;
    const role = (index, target) => roles[Math.min(index, roles.length - 1)] ||
        (target && typeof prompts === "function" ? plain(prompts(target)) : "") || "目标";
    let text;
    if (prerequisite) text = `请先选择${prerequisite.label}，再选择目标`;
    else if (ok) text = `已选 ${chosen.length} 个目标，请核对${ordered ? "顺序后" : "后"}点击“确定”`;
    else if (targetStage) text = roles.length ? `下一步：第 ${chosen.length + 1} 位 · ${role(chosen.length)}` : `请选择${ordered ? "第 " + (chosen.length + 1) + " 个" : "高亮的"}目标`;
    else text = "请先选择要使用的卡牌或技能";
    if (message.textContent !== text) message.textContent = text;
    const names = chosen.map((target, index) => `${index + 1}. ${role(index, target)}：${plain(target.nickname || get.translation(target))}`);
    const summary = names.length ? names.join(ordered ? " → " : "；") : roles.length ? roles.map((name, index) => `${index + 1}. ${name}`).join(" → ") : "青色边框：可选 · 金色边框与编号：已选";
    if (selection.textContent !== summary) selection.textContent = summary;
    undo.disabled = reset.disabled = !chosen.length || targetRange[1] < 0;
    scheduleLayout();
    undo.hidden = reset.hidden = !chosen.length || typeof event.custom?.replace?.target === "function";
    const targets = new Set([...game.players, ...game.dead]);
    for (const target of new Set([...marked, ...targets])) {
        const index = chosen.indexOf(target), picked = targetStage && index !== -1;
        const candidate = targetStage && target.classList.contains("selectable") && !picked;
        target.classList.toggle("selection-picked", picked);
        target.classList.toggle("selection-candidate", candidate);
        target.classList.toggle("selection-unavailable", targetStage && targets.has(target) && !picked && !candidate);
        let badge = target.querySelector(":scope > .selection-target-badge");
        if (picked || candidate) {
            if (!badge) { badge = document.createElement("div"); badge.className = "selection-target-badge"; target.append(badge); }
            const label = picked ? `✓ ${index + 1} · ${role(index, target)}` : "可选";
            if (badge.textContent !== label) badge.textContent = label;
        } else badge?.remove();
        marked.add(target);
    }
}
