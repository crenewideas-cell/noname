// Keep the texture and the renderer in the same alpha convention, including
// texture re-uploads after context restoration. Screen slots use source ONE.
export function usePremultipliedTexture(texture, gl, alreadyPremultiplied = false) {
  if (texture.__skinAlphaReady) return;
  texture.__skinAlphaReady = true;
  const update = texture.update;
  // WebGL ignores UNPACK_PREMULTIPLY_ALPHA_WEBGL for ImageBitmap sources.
  const image = texture.getImage();
  if (!alreadyPremultiplied && typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
    texture._image = canvas;
  }
  texture.update = function (...args) {
    const previous = gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !alreadyPremultiplied);
    try { return update.apply(this, args); }
    finally { gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, previous); }
  };
  texture.update();
}
