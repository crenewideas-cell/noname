import { lib, game, ui, get } from "noname";

export function installOpeningUI() {
    if (game.showOnlineOpening) return;
    let dialog, launcher, timer, searchTimer, currentToken, stage, stageTimer, viewState;
    const node = (parent, tag, className, text) => {
        const item = document.createElement(tag); if (className) item.className = className;
        if (text) item.textContent = text; parent.append(item); return item;
    };
    const button = (parent, text, action, className = "") => {
        const item = node(parent, "button", className, text); item.type = "button"; item.onclick = action; return item;
    };
    game.closeOnlineOpening = token => {
        if (token && token !== currentToken) return;
        clearInterval(timer); clearTimeout(searchTimer);
        dialog?.remove(); launcher?.remove(); dialog = launcher = null; currentToken = null;
    };
    game.renderOpeningStage = state => {
        clearInterval(stageTimer);
        stage?.remove(); stage = null;
        if (!state) return;
        stage = node(document.body, "aside", "online-opening-stage"); stage.setAttribute("role", "status");
        const update = () => {
            const seconds = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
            stage.textContent = (state.phase === "character" ? state.simultaneous ? `同时选将 · ${state.completed}/${state.total} 人已锁定 · 选将归属暂不公开` : `主公选将 · 等待主公确认武将` :
                `开局换牌 · ${state.completed}/${state.total} 人已准备 · 全员确认后开始第一回合`) + ` · ${seconds} 秒`;
        };
        update(); stageTimer = setInterval(update, 250);
    };
    game.showOnlineOpening = (data, token) => {
        const previousView = currentToken === token ? { ...viewState, query: dialog.querySelector(".op-search")?.value || "", focusSearch: document.activeElement?.classList.contains("op-search"), cursor: dialog.querySelector(".op-search")?.selectionStart, focusedCharacter: document.activeElement?.dataset.character, minimized: !dialog.open, scroll: dialog.querySelector(".op-character-grid")?.scrollTop || 0, dialogScroll: dialog.scrollTop } : null;
        game.closeOnlineOpening(); currentToken = token;
        viewState = previousView || { selected: [], page: 0, query: "" };
        let selected = viewState.selected.filter(id => data.characters?.includes(id)), page = viewState.page, matches = data.characters || [], pending = false;
        const lostSelection = selected.length !== viewState.selected.length;
        const characterMode = data.phase === "character", pageSize = 24;
        dialog = node(document.body, "dialog", "online-opening-dialog");
        dialog.setAttribute("aria-label", characterMode ? "开局选将与点将" : "开局手气卡换牌");
        for (const type of ["click", "pointerdown", "pointerup", "touchstart", "touchend"]) dialog.addEventListener(type, e => e.stopPropagation());
        const minimize = () => { dialog.close(); launcher.hidden = false; };
        dialog.addEventListener("cancel", e => { e.preventDefault(); minimize(); });
        launcher = button(document.body, characterMode ? "返回选将" : "返回手气卡", () => { launcher.hidden = true; dialog.showModal(); }, "online-opening-launcher");
        launcher.hidden = true;
        const header = node(dialog, "header", "op-header"), title = node(header, "div", "op-title");
        node(title, "small", "", characterMode ? "01 / 开局选将" : "02 / 起手牌准备");
        node(title, "h2", "", data.title);
        const clock = node(header, "strong", "op-clock"); clock.setAttribute("role", "timer");
        button(header, "查看牌桌", minimize);
        const notice = node(dialog, "p", "op-notice", characterMode ?
            data.notice || (lostSelection ? "刚才选中的武将已被锁定，请重新选择，不扣换候选次数。" :
                data.simultaneous ? data.poolMode === "partitioned" ? "主公已选定，其他玩家同时选将。这是你的独立武将池，按“确认选将”锁定。" : "主公已选定，其他玩家同时抢选。按“确认选将”才锁定，先确认者获得；不显示武将归属。" :
                "主公先选：点击武将查看并选中，按“确认选将”锁定。换一批与点将共享倒计时。") :
            "以下为你的当前起手牌。使用手气卡后立即展示新手牌，确认保留后等待其他玩家准备。换牌不重新计时。");
        const controls = node(dialog, "div", "op-actions");
        const send = (control, links) => {
            if (pending || currentToken !== token || Date.now() >= data.deadline) return;
            pending = true;
            void game.submitOpeningChoice({ control, ...(links ? { links } : {}) }, token);
        };
        let search, grid, count, previous, next, pageLabel, confirm, preview;
        const summary = node(dialog, "p", "op-selection"); summary.setAttribute("aria-live", "polite");
        if (characterMode) {
            const candidates = button(controls, "候选武将", () => send("candidates"));
            candidates.classList.toggle("active", data.mode === "candidates"); candidates.disabled = data.mode === "candidates";
            const free = button(controls, data.simultaneous ? data.poolMode === "partitioned" ? "我的全部武将" : "全部武将 · 共享抢选" : "点将 · 自由选择", () => send("all"));
            free.classList.toggle("active", data.mode === "all"); free.disabled = !data.freeChoose || data.mode === "all";
            const reroll = button(controls, `换一批（剩余 ${data.remaining} 次）`, () => send("reroll"));
            reroll.disabled = !data.remaining;
            if (!data.freeChoose) node(dialog, "p", "op-hint", "本房间未开启点将；房主可在大厅的“开局与操作设置”中开启，下一局生效。");
            search = node(dialog, "input", "op-search"); search.type = "search"; search.placeholder = "搜索武将名称或技能";
            search.value = viewState.query;
            search.setAttribute("aria-label", "搜索当前可选武将");
            count = node(dialog, "div", "op-hint"); grid = node(dialog, "div", "op-character-grid");
            const pages = node(dialog, "nav", "op-pages"); pages.setAttribute("aria-label", "武将分页");
            previous = button(pages, "上一页", () => { page--; render(); }); pageLabel = node(pages, "span");
            next = button(pages, "下一页", () => { page++; render(); });
            preview = node(dialog, "section", "op-preview");
            preview.setAttribute("aria-label", "已选武将技能说明");
            const textCache = new Map();
            const filter = () => {
                    viewState.query = search.value;
                    const query = viewState.query.trim().toLowerCase();
                    matches = data.characters.filter(id => {
                        if (!textCache.has(id)) {
                            const skills = lib.character[id]?.skills || [];
                            textCache.set(id, get.plainText([id, get.translation(id), ...skills.map(skill => get.translation(skill))].join(" ")).toLowerCase());
                        }
                        return textCache.get(id).includes(query);
                    });
            };
            filter();
            search.oninput = () => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => { filter(); page = 0; render(); }, 120);
            };
        } else {
            node(controls, "strong", "", `手气卡剩余 ${data.remaining} 次`);
            grid = node(dialog, "div", "op-hand-grid");
            for (const card of data.hand || []) ui.create.button(card, "card", grid, true);
            summary.textContent = `当前手牌 ${data.hand?.length || 0} 张 · ${data.remaining ? "可整手换牌，也可直接保留" : "次数已用完，请确认保留新手牌"}`;
        }
        const footer = node(dialog, "footer", "op-footer");
        if (characterMode) {
            node(footer, "span", "op-hint", `超时将使用推荐武将：${data.fallback.map(id => get.translation(id)).join("、")}`);
            confirm = button(footer, "确认选将", () => send("confirm", selected), "op-primary");
        } else {
            node(footer, "span", "op-hint", "超时自动保留当前手牌，不会消耗手气卡");
            const redraw = button(footer, "使用手气卡 · 整手换牌", () => send("mulligan")); redraw.disabled = !data.remaining;
            confirm = button(footer, "确认保留 · 准备开始", () => send("keep"), "op-primary");
        }
        function render() {
            if (currentToken !== token) return;
            const pages = Math.max(1, Math.ceil(matches.length / pageSize)); page = Math.max(0, Math.min(page, pages - 1));
            grid.replaceChildren();
            for (const id of matches.slice(page * pageSize, (page + 1) * pageSize)) {
                const tile = button(grid, "", () => {
                    if (Date.now() >= data.deadline) return;
                    if (selected.includes(id)) selected = selected.filter(value => value !== id);
                    else if (data.count === 1) selected = [id];
                    else if (selected.length < data.count) selected.push(id);
                    render();
                    Array.from(grid.children).find(item => item.dataset.character === id)?.focus({ preventScroll: true });
                }, "op-character");
                tile.dataset.character = id;
                tile.classList.toggle("chosen", selected.includes(id)); tile.setAttribute("aria-pressed", String(selected.includes(id)));
                tile.setAttribute("aria-label", get.plainText(get.translation(id)));
                // ui.create.div only recognises div/fragment containers, not a
                // native button. Create the real general card then attach it.
                const portrait = ui.create.button(id, "character", undefined, true);
                portrait.classList.add("op-portrait"); tile.append(portrait);
                node(tile, "span", "op-name", (selected.includes(id) ? "✓ " : "") + get.plainText(get.translation(id)));
                const skills = (lib.character[id]?.skills || []).map(skill => get.plainText(get.translation(skill)));
                node(tile, "span", "op-skills", skills.join(" · "));
                tile.title = (lib.character[id]?.skills || []).map(skill => `${get.plainText(get.translation(skill))}：${get.plainText(get.translation(skill + "_info"))}`).join("\n");
            }
            count.textContent = matches.length ? `当前 ${matches.length} 名可选武将 · ${data.poolMode === "partitioned" && data.simultaneous ? "你的独立武将池" : "已锁定武将自动移除，不显示归属"}` : "没有匹配武将，请更换关键词";
            previous.disabled = page === 0; next.disabled = page + 1 >= pages; pageLabel.textContent = `${page + 1} / ${pages}`;
            summary.textContent = selected.length ? `已选 ${selected.length}/${data.count}：${selected.map(id => get.translation(id)).join("、")} · 点击确认后锁定` : `请选择 ${data.count} 名武将`;
            preview.replaceChildren(); preview.hidden = !selected.length;
            for (const id of selected) {
                const detail = node(preview, "details"); detail.open = true;
                node(detail, "summary", "", `${get.plainText(get.translation(id))} · 技能说明`);
                for (const skill of lib.character[id]?.skills || []) {
                    node(detail, "p", "", `${get.plainText(get.translation(skill))}：${get.plainText(get.translation(skill + "_info"))}`);
                }
            }
            confirm.disabled = selected.length !== data.count;
            viewState.selected = selected.slice(); viewState.page = page;
        }
        const tick = () => {
            const seconds = Math.max(0, Math.ceil((data.deadline - Date.now()) / 1000));
            clock.textContent = seconds + " 秒"; clock.classList.toggle("urgent", seconds <= 10);
            if (!seconds) {
                for (const item of dialog.querySelectorAll("button, input")) item.disabled = true;
                notice.textContent = "时间已到，正在等待服务器确认…";
            }
        };
        if (characterMode) render();
        tick(); timer = setInterval(tick, 250);
        if (previousView?.minimized) launcher.hidden = false;
        else dialog.showModal();
        if (previousView) {
            if (!previousView.minimized) {
                if (previousView.focusSearch) {
                    search?.focus({ preventScroll: true });
                    if (typeof previousView.cursor === "number") search?.setSelectionRange(previousView.cursor, previousView.cursor);
                }
                else Array.from(grid.children).find(item => item.dataset.character === previousView.focusedCharacter)?.focus({ preventScroll: true });
            }
            grid.scrollTop = previousView.scroll; dialog.scrollTop = previousView.dialogScroll;
        }
    };
    window.addEventListener("pagehide", () => { game.closeOnlineOpening(); game.renderOpeningStage(null); }, { once: true });
}
