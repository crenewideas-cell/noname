// Explicit reference-only adaptation, never included in the production runtime.
// The pinned 4.0 converter writes zero alpha for an opaque Screen fragment.
// W3C source-over Screen in PMA form is S + D - S*D, As + Ad - As*Ad.
// Keep the upstream bundle intact and record this adapter separately in provenance.
export function installReferenceScreenBlend(spine){
 const converter=spine.WebGLBlendModeConverter,screen=spine.BlendMode.Screen;
 if(converter.getSourceColorGLBlendMode(screen,true)!==1||converter.getSourceAlphaGLBlendMode(screen)!==0x0301||converter.getDestGLBlendMode(screen)!==0x0303)throw Error('Unrecognized upstream Screen contract; adapter must be revalidated');
 const dest=converter.getDestGLBlendMode,alpha=converter.getSourceAlphaGLBlendMode;
 converter.getDestGLBlendMode=mode=>mode===screen?0x0301:dest(mode);
 converter.getSourceAlphaGLBlendMode=mode=>mode===screen?1:alpha(mode);
}
