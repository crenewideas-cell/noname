import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage();
 await page.route('**/__alpha-audit',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:8081/__alpha-audit');
 const results=await page.evaluate(async()=>{
  const {usePremultipliedTexture}=await import('/noname/skin/localDynamic/runtime/texture-alpha.js');
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
  const gl=canvas.getContext('webgl',{premultipliedAlpha:true,preserveDrawingBuffer:true});
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);return s;};
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float;uniform sampler2D image;void main(){gl_FragColor=texture2D(image,vec2(.5));}'));gl.linkProgram(program);gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const results=[];
  for(const bitmap of [false,true]){
   // Half-transparent white must contribute half its RGB. Without the upload
   // fix, source ONE produces opaque white under the screen/additive pipeline.
   const source=document.createElement('canvas');source.width=source.height=1;
   source.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray([255,255,255,128]),1,1),0,0);
   const image=bitmap?await createImageBitmap(source,{premultiplyAlpha:'none'}):source;
   const t={_image:image,getImage(){return this._image;},update(){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this._image);}};
   usePremultipliedTexture(t,gl);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
   for(let upload=0;upload<2;upload++){
    t.update();gl.clearColor(.2,.4,.6,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);const px=new Uint8Array(4);gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);results.push({bitmap,upload,pixel:Array.from(px)});
   }
  }
  return results;
 });
 for(const result of results)for(const [i,expected] of [153,179,204,255].entries())assert.ok(Math.abs(result.pixel[i]-expected)<=1,JSON.stringify(result));
 console.log('PASS alpha uploads',JSON.stringify(results));
}finally{await browser.close();}
