// Public marks only. Never expose an opponent's entire skill storage: many
// other skills store hidden cards, privately chosen options, or identities.
const honglouPublicKeys = [
    "hlhj_mushi", "hlhj_lei", "hlhj_flower_step",
    "hlhj_gain_step", "hlhj_loss_step", "hlhj_wish_used", "hlhj_mushiyuan",
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
        visible[id] = { ...info, storage, hiddenSkills: [], invisibleSkills: [] };
    }
    return visible;
}
