import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {installReferenceScreenBlend} from './reference-spine40-screen.mjs';
const {chromium}=createRequire(import.meta.url)('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const run=path.resolve(process.argv[2]||'output/dynamic-remediation/20260926-r01');
const out=path.join(run,process.env.SKIN_BLEND_LABEL||'blend-contract');await fs.mkdir(out);
const vendor=await fs.readFile(path.join(run,'reference/spine-webgl-4.0.official.js'));
const pixi=await fs.readFile('apps/core/extension/imports/本地动态皮肤包/无名杀基础扩展/runtime/vendor/pixi.min.js');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:900,height:600}});await page.setContent('<html><body></body></html>');
 await page.addScriptTag({content:vendor.toString()});await page.addScriptTag({content:pixi.toString()});
 const result=await page.evaluate(adapterSource=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=8;
  const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:false});
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision highp float;uniform vec4 color;void main(){gl_FragColor=color;}'));gl.linkProgram(program);gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uniform=gl.getUniformLocation(program,'color'),pm=v=>v.map((x,i)=>i<3?x*v[3]:x),pixel=()=>{const p=new Uint8Array(4);gl.readPixels(4,4,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);return[...p];};
  const draw=(color)=>{gl.uniform4fv(uniform,pm(color));gl.drawArrays(gl.TRIANGLES,0,3);};
  const renderer=new PIXI.Renderer({width:8,height:8,backgroundAlpha:0,antialias:false,preserveDrawingBuffer:true});
  const cases=[{source:[.8,.3,.1,1],backdrop:[.1,.5,.9,1]},{source:[.8,.3,.1,.5],backdrop:[.1,.5,.9,.5]},{source:[.8,.3,.1,1],backdrop:[0,0,0,0]},{source:[.8,.3,.1,.25],backdrop:[0,0,0,0]},{source:[.8,.3,.1,0],backdrop:[.1,.5,.9,.5]}],rows=[];
  for(const mode of ['Normal','Screen'])for(const c of cases){
   const s=pm(c.source),d=pm(c.backdrop),expected=[...s.slice(0,3).map((v,i)=>mode==='Screen'?v+d[i]-v*d[i]:v+d[i]*(1-s[3])),s[3]+d[3]*(1-s[3])].map(v=>Math.round(v*255));
   const converter=spine.WebGLBlendModeConverter,m=spine.BlendMode[mode];
   const factors=[converter.getSourceColorGLBlendMode(m,true),converter.getDestGLBlendMode(m),converter.getSourceAlphaGLBlendMode(m),converter.getDestGLBlendMode(m)];
   gl.disable(gl.BLEND);draw(c.backdrop);gl.enable(gl.BLEND);gl.blendFuncSeparate(...factors);draw(c.source);const official=pixel();
   gl.disable(gl.BLEND);draw(c.backdrop);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.ONE,mode==='Screen'?gl.ONE_MINUS_SRC_COLOR:gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);draw(c.source);const analyticWebGL=pixel();
   const stage=new PIXI.Container();for(const [i,color] of [c.backdrop,c.source].entries()){const g=new PIXI.Graphics();g.beginFill((Math.round(color[0]*255)<<16)|(Math.round(color[1]*255)<<8)|Math.round(color[2]*255),color[3]);g.drawRect(0,0,8,8);g.endFill();if(i)g.blendMode=PIXI.BLEND_MODES[mode.toUpperCase()];stage.addChild(g);}renderer.render(stage);const p=new Uint8Array(4);renderer.gl.readPixels(4,4,1,1,renderer.gl.RGBA,renderer.gl.UNSIGNED_BYTE,p);stage.destroy({children:true});
   rows.push({mode,...c,expected,officialFactors:factors,official,analyticWebGL,pixi:[...p],officialError:gl.getError()});
  }
  (0,eval)('('+adapterSource+')(spine)');
  for(const row of rows){const c=spine.WebGLBlendModeConverter,m=spine.BlendMode[row.mode];gl.disable(gl.BLEND);draw(row.backdrop);gl.enable(gl.BLEND);gl.blendFuncSeparate(c.getSourceColorGLBlendMode(m,true),c.getDestGLBlendMode(m),c.getSourceAlphaGLBlendMode(m),c.getDestGLBlendMode(m));draw(row.source);row.adaptedReference=pixel();}
  const debug=gl.getExtension('WEBGL_debug_renderer_info');const gpu=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);renderer.destroy();return{gpu,rows};
 },installReferenceScreenBlend.toString());
 const near=(a,b)=>a.every((v,i)=>Math.abs(v-b[i])<=2);
 for(const row of result.rows){assert.ok(near(row.expected,row.analyticWebGL));assert.ok(near(row.expected,row.pixi));assert.ok(near(row.expected,row.adaptedReference));if(row.mode==='Normal')assert.ok(near(row.expected,row.official));}
 assert.ok(result.rows.filter(r=>r.mode==='Screen').some(r=>!near(r.expected,r.official)),'Pinned upstream Screen defect must reproduce');
 const report={...result,pass:true,source:'https://www.w3.org/TR/compositing-1/#blending',formula:'PMA Screen RGB = S + D - S*D; source-over alpha = As + Ad*(1-As). Independent arithmetic, raw WebGL, production PIXI compared with pinned official converter.',vendorSHA256:createHash('sha256').update(vendor).digest('hex'),pixiSHA256:createHash('sha256').update(pixi).digest('hex'),limitation:'Normal and Screen solid-pixel contract only; not a complete blend/mask/asset acceptance.'};
 await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
