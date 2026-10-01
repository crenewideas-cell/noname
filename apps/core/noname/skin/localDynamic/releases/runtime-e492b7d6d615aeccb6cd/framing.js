// Content framing only; no controls or UI. Coordinates are normalized to visible artwork.
(function () {
  const presets = {
    // Shimakaze's rig includes large weapons behind the much smaller character.
    az_301290: { orientation: 'portrait', focus: { x: .12, y: -.04, width: .80, height: 1.08 } },
  };
  function visibleBounds(pixels, width, height, bottomUp = false) {
    let left = width, top = height, right = -1, bottom = -1;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] < 12) continue;
      const row = bottomUp ? height - 1 - y : y;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, row); bottom = Math.max(bottom, row);
    }
    return right < left ? null : { x: left / width, y: top / height, width: (right - left + 1) / width, height: (bottom - top + 1) / height };
  }
  function compose(entry, content, composition = {}) {
    const preset = { ...presets[entry.id], ...composition };
    const orientation = entry.legacy ? 'portrait' : preset.orientation || (entry.type === 'spine42' || content.width / content.height > 1.15 ? 'landscape' : 'portrait');
    const f = preset.focus || { x: 0, y: 0, width: 1, height: 1 };
    // Fixed framing per load avoids breathing/zooming as effects animate.
    const focus = { x: content.x + content.width * f.x, y: content.y + content.height * f.y, width: content.width * f.width, height: content.height * f.height };
    return { orientation, nativePortrait: !!entry.legacy, aspect: content.width / content.height, content, focus };
  }
  function isOpaqueScene(pixels,width,height,bottomUp=false){
    const b=visibleBounds(pixels,width,height,bottomUp);if(!b)return false;
    let solid=0,total=0;
    for(let y=Math.round(b.y*height);y<Math.round((b.y+b.height)*height);y++)for(let x=Math.round(b.x*width);x<Math.round((b.x+b.width)*width);x++){
      const row=bottomUp?height-1-y:y;total++;if(pixels[(row*width+x)*4+3]>=240)solid++;
    }
    return total>0&&solid/total>=.9;
  }
  function trimPortraitEdges(source, fit, aspect, yDown) {
    const canvas=document.createElement('canvas');canvas.width=120;canvas.height=Math.round(120/aspect);
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0,canvas.width,canvas.height);
    const w=canvas.width,h=canvas.height,p=ctx.getImageData(0,0,w,h).data;
    const solid=y=>{let count=0;for(let x=4;x<w-4;x++)if(p[(y*w+x)*4+3]>=240)count++;return count>=(w-8)*.98;};
    let top=0,bottom=0;
    while(top<h*.25&&!solid(top))top++;
    while(bottom<h*.25&&!solid(h-1-bottom))bottom++;
    // Only remove narrow transparent margins. Never zoom a sparse character
    // into an arbitrary opaque piece of clothing, or change its proportions.
    if(top>=h*.25)top=0;if(bottom>=h*.25)bottom=0;
    if(top+bottom>h*.3)return fit;
    if(!top&&!bottom)return fit;
    const height=Math.min(fit.height,fit.width/aspect),nextHeight=height*(1-(top+bottom)/h);
    return {x:fit.x+fit.width/2-nextHeight*aspect/2,y:fit.y+fit.height/2-height/2+height*(yDown?top:bottom)/h,width:nextHeight*aspect,height:nextHeight};
  }
  function sceneBounds(pixels, width, height, bottomUp = false, portrait = false, anchor, alphaThreshold = 245) {
    // A scene's opaque rectangular painting is the framing reference. Sparse
    // petals, lanterns and effect attachments must not shrink that painting.
    const heights=new Uint16Array(width);let best={area:0},anchored={area:0};
    for(let y=0;y<height;y++){
      const row=bottomUp?height-1-y:y;
      for(let x=0;x<width;x++)heights[x]=pixels[(row*width+x)*4+3]>=alphaThreshold?heights[x]+1:0;
      const stack=[];
      for(let x=0;x<=width;x++){
        const h=x===width?0:heights[x];let start=x;
        while(stack.length&&stack[stack.length-1].h>h){
          const s=stack.pop(),area=s.h*(x-s.x);start=s.x;
          const candidate={x:s.x,y:y-s.h+1,width:x-s.x,height:s.h,area};
          if(area>best.area)best=candidate;
          if(anchor&&area>anchored.area&&anchor.x*width>=s.x+candidate.width*.1&&anchor.x*width<=x-candidate.width*.1&&anchor.y*height>=candidate.y+s.h*.1&&anchor.y*height<=candidate.y+s.h*(anchor.kind==='body'?.9:.6))anchored=candidate;
        }
        if(h&&(!stack.length||stack[stack.length-1].h<h))stack.push({x:start,h});
      }
    }
    if(portrait){
      const visible=visibleBounds(pixels,width,height,bottomUp);
      // A translucent scene can have a fully opaque sky/lantern patch. Such a
      // patch is not its canvas. Measure against the background itself, not
      // the sample canvas (large foreground effects may make that enormous).
      const followsSubject=anchored.area>0;
      if(anchor&&!followsSubject)return null;
      if(followsSubject)best=anchored;
      if(!visible||best.area<visible.width*width*visible.height*height*.12||best.height<visible.height*height*(followsSubject?.25:.65))return null;
    }else if(best.area<width*height*.12||best.width/best.height<1.15)return null;
    return {x:best.x/width,y:best.y/height,width:best.width/width,height:best.height/height};
  }
  // Recover only a failed scene fit, using the opaque foreground to reject
  // detached clouds and lanterns that extend beyond the actual painting.
  function recoverSceneBounds(background,foreground,width,height,bottomUp=false){
    let count=0,xSum=0,ySum=0;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(foreground[(y*width+x)*4+3]>=240){count++;xSum+=x+.5;ySum+=(bottomUp?height-1-y:y)+.5;}
    if(count<12)return null;
    const b=sceneBounds(background,width,height,bottomUp,true,{x:xSum/count/width,y:ySum/count/height,kind:'body'});if(!b)return null;
    let inside=0,above=0;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(foreground[(y*width+x)*4+3]>=240){const row=bottomUp?height-1-y:y;if((row+.5)/height<b.y)above++;if((x+.5)/width>=b.x&&(x+.5)/width<=b.x+b.width&&(row+.5)/height>=b.y&&(row+.5)/height<=b.y+b.height)inside++;}
    // A torso can dominate pixel mass while its head is above the rectangle.
    // Reject that crop even if most of the body overlaps the opaque painting.
    return inside/count>=.7&&above/count<=.02?b:null;
  }
  function createPresentationCanvas(source, backgroundImage) {
    // One visible renderer surface, with a live softened copy filling transparent
    // edges. This never uses a character portrait, thumbnail, or a frozen frame.
    const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
    const small = document.createElement('canvas'), sample = small.getContext('2d', { willReadFrequently: true });
    canvas.dataset.skinSurface = 'true'; source.dataset.renderSource = 'true';
    source.style.display = 'none'; source.before(canvas);
    let color = '#302d36', nextColor = 0;
    function draw() {
      const w = source.width, h = source.height;
      if (!w || !h) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
        small.width = 128; small.height = Math.max(1, Math.round(128 * h / w));
      }
      if(backgroundImage){
        const scale=Math.max(w/backgroundImage.width,h/backgroundImage.height);
        context.clearRect(0,0,w,h);context.drawImage(backgroundImage,(w-backgroundImage.width*scale)/2,(h-backgroundImage.height*scale)/2,backgroundImage.width*scale,backgroundImage.height*scale);
        context.drawImage(source,0,0);return;
      }
      sample.clearRect(0, 0, small.width, small.height); sample.drawImage(source, 0, 0, small.width, small.height);
      if (performance.now() > nextColor) {
        const pixels = sample.getImageData(0, 0, small.width, small.height).data;
        let r = 0, g = 0, b = 0, total = 0;
        for (let i = 0; i < pixels.length; i += 4) { const a = pixels[i + 3] / 255; r += pixels[i] * a; g += pixels[i + 1] * a; b += pixels[i + 2] * a; total += a; }
        if (total) color = `rgb(${Math.round(r / total)},${Math.round(g / total)},${Math.round(b / total)})`;
        nextColor = performance.now() + 500;
      }
      context.filter = 'none'; context.fillStyle = color; context.fillRect(0, 0, w, h);
      const bleed = Math.min(w, h) * .14;
      context.filter = `blur(${Math.max(8, bleed * .5)}px)`;
      context.drawImage(small, -bleed, -bleed, w + bleed * 2, h + bleed * 2);
      context.filter = 'none'; context.drawImage(source, 0, 0);
    }
    draw(); return { canvas, draw };
  }
  window.SkinFraming = { visibleBounds, sceneBounds, recoverSceneBounds, compose, createPresentationCanvas, trimPortraitEdges, isOpaqueScene };
})();
