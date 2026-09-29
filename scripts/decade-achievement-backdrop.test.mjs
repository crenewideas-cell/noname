import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spine } from '../apps/core/extension/ui/十周年局内UI/vendor/spine.js';

const assets = new URL('../apps/core/extension/ui/十周年局内UI/assets/animation/', import.meta.url);
const names = ['shoupo', 'lianpo', 'sanpo', 'sipo', 'wupo', 'liupo', 'qipo', 'wanfumodi', 'shenweizhengqiankun'];

for (const name of names) {
 test(`${name}: hide the backdrop slot across its animation, retaining other artwork`, () => {
  const atlas = new spine.TextureAtlas(fs.readFileSync(new URL(name + '.atlas', assets), 'utf8'), () => ({
   setFilters() {}, setWraps() {}, getImage: () => ({ width: 2048, height: 2048 }),
  }));
  const data = new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas))
   .readSkeletonData(new Uint8Array(fs.readFileSync(new URL(name + '.skel', assets))));
  const skeleton = new spine.Skeleton(data);
  skeleton.opacity = 1;
  const state = new spine.AnimationState(new spine.AnimationStateData(data));
  state.setAnimation(0, data.animations[0].name, false);
  const renderer = new spine.webgl.SkeletonRenderer({});
  let draws = 0, visibleFrames = 0;
  const batcher = { setBlendMode() {}, draw() { draws++; } };
  const draw = hidden => {
   renderer.hideSlots = hidden;
   draws = 0;
   renderer.draw(batcher, skeleton);
   return draws;
  };
  for (let time = 0; time < data.animations[0].duration; time += 0.1) {
   state.update(0.1);
   state.apply(skeleton);
   skeleton.updateWorldTransform();
   const attachment = skeleton.findSlot('renwuguang2').getAttachment();
   if (!attachment) continue;
   visibleFrames++;
   const original = draw(undefined);
   assert.ok(original > 1, 'the achievement still has foreground artwork');
   assert.equal(draw(['renwuguang2']), original - 1, `${name} at ${time}: background must be excluded`);
   assert.equal(draw(attachment.name), original - 1, 'legacy attachment-name filters still work');
   assert.equal(draw(['missing-slot']), original, 'unrelated slots remain intact');
  }
  assert.ok(visibleFrames > 0, 'the test exercised visible backdrop frames');
 });
}
