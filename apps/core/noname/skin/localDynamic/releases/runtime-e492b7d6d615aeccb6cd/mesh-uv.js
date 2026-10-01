// Some imported atlases have been repacked with transparent borders trimmed.
// Mesh UVs still address the original image. The legacy 3.6 renderer maps them
// directly to the trimmed rectangle, stretching pieces away from their seams.
export function restoreMeshUVs(mesh) {
  const r = mesh.region, source = mesh.regionUVs;
  if (!r || !source) return;
  const image = r.texture.getImage(), width = image.width, height = image.height;
  const top = r.originalHeight - r.height - r.offsetY;
  const output = mesh.uvs = new Float32Array(source.length);
  for (let i = 0; i < source.length; i += 2) {
    const x = source[i] * r.originalWidth, y = source[i + 1] * r.originalHeight;
    output[i] = (r.x + (r.rotate ? y - top : x - r.offsetX)) / width;
    output[i + 1] = (r.y + (r.rotate ? r.width + r.offsetX - x : y - top)) / height;
  }
}
