// Some repacked 3.7-labelled files retain the 3.6 binary layout. Admit that
// family only with full-stream validation below; PIXI supports 3.7 JSON only.
export function usesSpine36(model) {
  return !model.skeleton.endsWith('.json') && /^3\.[67]\./.test(model.version || '');
}

export function createLegacyParser(spine, atlas, model) {
  const loader = new spine.AtlasAttachmentLoader(atlas);
  if (model.skeleton.endsWith('.json')) return new spine.SkeletonJson(loader);
  if (!usesSpine36(model)) throw new Error('骨骼版本不能使用 3.6 解析器：' + model.version);
  const parser = new spine.SkeletonBinary(loader);
  const originalReadSkin = parser.readSkin;
  const readData = parser.readSkeletonData;
  // Spine 3.6 stores slot attachments immediately after the skin name.
  // Skin bones/constraints were added later. Override only this parser instance;
  // the shared decade UI runtime must not be globally patched.
  const standardSkin = function (input, data, isDefault, nonessential) {
    const name = isDefault ? 'default' : input.readString();
    const count = input.readInt(true);
    if (count === 0) return null;
    const skin = new spine.Skin(name);
    for (let i = 0; i < count; i++) {
      const slot = input.readInt(true), attachments = input.readInt(true);
      for (let j = 0; j < attachments; j++) {
        const key = input.readString();
        const attachment = this.readAttachment(input, data, skin, slot, key, nonessential);
        if (attachment) skin.setAttachment(slot, key, attachment);
      }
    }
    return skin;
  };
  parser.readSkeletonData = function (bytes) {
    // Validate the whole stream. Retain the vendor's extended table as a
    // compatibility fallback, without trusting a repacked file's version label.
    bytes = new Uint8Array(bytes);
    let lastError;
    for (const skinReader of [standardSkin, originalReadSkin]) {
      let input;
      this.linkedMeshes.length = 0;
      this.readSkin = function (reader, ...args) {
        if (!input) {
          input = reader;
          const readInt = reader.readInt;
          reader.readInt = function (positive) {
            const value = readInt.call(this, positive);
            if (positive && value > bytes.length) throw new Error('骨骼字段长度超出文件');
            return value;
          };
        }
        return skinReader.call(this, reader, ...args);
      };
      try {
        const data = readData.call(this, bytes);
        if (!input || input.index !== bytes.length) throw new Error('骨骼数据未完整解析');
        this.skinTableFormat = skinReader === standardSkin ? '3.6' : 'extended';
        return data;
      } catch (error) { lastError = error; }
    }
    throw lastError;
  };
  return parser;
}

