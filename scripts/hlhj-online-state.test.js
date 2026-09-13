import test from "node:test";
import assert from "node:assert/strict";
import { visibleSkillState } from "../apps/core/noname/online/publicSkillState.js";

test("联机快照仅公开缘、泪和次数，不泄露其他技能私有存储", () => {
    const source = {
        a: { skills: ["hlhj_mushi"], hiddenSkills: ["secret"], invisibleSkills: ["hidden"], storage: { hlhj_mushi: ["b"], hlhj_lei: 0, hlhj_gain_step: 2, secretCards: ["sha"], hlhj_dreaming: true } },
        b: { skills: [], storage: { privateChoice: 7 } },
        c: { skills: ["other_skill"], storage: { hlhj_lei: 9, privateChoice: 3 } },
    };
    const visible = visibleSkillState(source, "b", ["a", "b", "c"]);
    assert.deepEqual(visible.a.storage, { hlhj_mushi: ["b"], hlhj_lei: 0, hlhj_gain_step: 2 });
    assert.deepEqual(visible.a.hiddenSkills, []); assert.deepEqual(visible.a.invisibleSkills, []);
    assert.deepEqual(visible.c.storage, {}); assert.equal(visible.b, source.b);
    assert.deepEqual(source.a.storage.secretCards, ["sha"]);
});
