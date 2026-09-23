// Public marks only. Never expose an opponent's entire skill storage: many
// other skills store hidden cards, privately chosen options, or identities.
const honglouPublicKeys = [
    "hlhj_mushi", "hlhj_lei", "hlhj_flower_step",
    "hlhj_gain_step", "hlhj_loss_step", "hlhj_wish_used", "hlhj_mushiyuan",
    "hlhj_jade", "hlhj_jade_created", "hlhj_gongdu", "hlhj_readers",
    "hlhj_book_pages", "hlhj_book_session", "hlhj_dream_target",
    "hlhj_furonglei", "hlhj_epitaph_used", "hlhj_dream_owners",
];

export function visibleSkillState(state, viewerId, playerIds) {
    const visible = { ...state };
    for (const id of playerIds) {
        const info = state[id];
        if (id === viewerId || !info) continue;
        const storage = {};
        if (info.skills?.some(skill => skill.startsWith("hlhj_"))) {
            for (const key of honglouPublicKeys) {
                if (Object.hasOwn(info.storage || {}, key)) storage[key] = info.storage[key];
            }
        }
        // A former reader may still hold dreams and keeps this round's usage.
        for (const key of ["hlhj_dream_owners", "hlhj_epitaph_used"]) {
            if (Object.hasOwn(info.storage || {}, key)) storage[key] = info.storage[key];
        }
        visible[id] = { ...info, storage, hiddenSkills: [], invisibleSkills: [] };
    }
    return visible;
}
