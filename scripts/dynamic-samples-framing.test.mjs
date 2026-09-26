import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(fs.readFileSync('apps/core/noname/skin/localDynamic/runtime/framing.js','utf8'),context);
const {sceneBounds,compose}=context.window.SkinFraming;
test('a sparse full-body figure stays distinct from an embedded opaque scene',()=>{
  const p=new Uint8Array(100*100*4);
  for(let y=10;y<90;y++)for(let x=10;x<90;x++)if(x>30&&x<70||y>30&&y<40)p[(y*100+x)*4+3]=255;
  assert.equal(context.window.SkinFraming.isOpaqueScene(p,100,100),false);
  for(let y=10;y<90;y++)for(let x=10;x<90;x++)p[(y*100+x)*4+3]=255;
  assert.equal(context.window.SkinFraming.isOpaqueScene(p,100,100),true);
});
function canvas(width,height,rect){
 const pixels=new Uint8Array(width*height*4);
 for(let y=rect.y;y<rect.y+rect.height;y++)for(let x=rect.x;x<rect.x+rect.width;x++)pixels[(y*width+x)*4+3]=255;
 return pixels;
}
test('failed background fits recover only a painting containing most of the opaque subject',()=>{
  const background=canvas(100,100,{x:10,y:50,width:80,height:40});
  background[3]=100;background[(99*100+99)*4+3]=100;
  const foreground=canvas(100,100,{x:40,y:65,width:20,height:20});
  assert.equal(sceneBounds(background,100,100,false,true),null);
  const recovered=context.window.SkinFraming.recoverSceneBounds(background,foreground,100,100);
  assert.equal(recovered.y,.5);assert.equal(recovered.height,.4);
  assert.equal(context.window.SkinFraming.recoverSceneBounds(background,canvas(100,100,{x:40,y:5,width:20,height:20}),100,100),null);
  // The torso overlaps 80%, but the upper 20% (head) must not be cropped.
  assert.equal(context.window.SkinFraming.recoverSceneBounds(background,canvas(100,100,{x:40,y:40,width:20,height:50}),100,100),null);
});
test('scene fitting follows the opaque painting rather than distant particles',()=>{
 const pixels=canvas(100,100,{x:10,y:30,width:80,height:45});
 pixels[(2*100+1)*4+3]=255;pixels[(94*100+96)*4+3]=255;
 const bounds=sceneBounds(pixels,100,100);
 assert.equal(bounds.x,.1);assert.equal(bounds.y,.3);assert.equal(bounds.width,.8);assert.equal(bounds.height,.45);
 const flipped=new Uint8Array(pixels.length);
 for(let y=0;y<100;y++)flipped.set(pixels.subarray(y*400,(y+1)*400),(99-y)*400);
 assert.equal(JSON.stringify(sceneBounds(flipped,100,100,true)),JSON.stringify(bounds));
});
test('a tall subject and a sparse translucent effect are not rectangular scenes',()=>{
 assert.equal(sceneBounds(canvas(100,100,{x:40,y:10,width:20,height:80}),100,100),null);
 const pixels=canvas(100,100,{x:10,y:30,width:80,height:45});
 for(let i=3;i<pixels.length;i+=4)if(pixels[i])pixels[i]=120;
 assert.equal(sceneBounds(pixels,100,100),null);
});
test('composited portrait backgrounds use their entire opaque rectangle across texture tile seams',()=>{
 const pixels=canvas(100,100,{x:20,y:10,width:60,height:80});
 // Two separately authored background tiles meet at row 50. Their union,
 // rather than either tile's atlas bounds, must define the camera.
 for(let y=50;y<90;y++)for(let x=20;x<80;x++)pixels[(y*100+x)*4]=120;
 const bounds=sceneBounds(pixels,100,100,false,true);
 assert.equal(bounds.x,.2);assert.equal(bounds.y,.1);assert.equal(bounds.width,.6);assert.equal(bounds.height,.8);
});
test('an opaque lantern patch cannot replace a translucent scene; the subject can identify its painted stage',()=>{
 const pixels=canvas(100,100,{x:10,y:10,width:80,height:80});
 for(let i=3;i<pixels.length;i+=4)if(pixels[i])pixels[i]=100;
 for(let y=10;y<40;y++)for(let x=10;x<90;x++)pixels[(y*100+x)*4+3]=255;
 assert.equal(sceneBounds(pixels,100,100,false,true),null);
 assert.equal(sceneBounds(pixels,100,100,false,true,{x:.5,y:.38}),null,'A head at the bottom of a sky patch needs room for the body');
 for(let y=50;y<90;y++)for(let x=20;x<80;x++)pixels[(y*100+x)*4+3]=255;
 const bounds=sceneBounds(pixels,100,100,false,true,{x:.5,y:.7});
 assert.equal(bounds.y,.5);assert.equal(bounds.height,.4);
});
test('ordinary transparent portraits keep their complete subject coordinates',()=>{
 const fit={x:-30,y:-50,width:150,height:400};
 const presentation=compose({id:'unrelated-portrait',type:'spine'},fit);
 assert.equal(presentation.orientation,'portrait');
 assert.equal(JSON.stringify(presentation.focus),JSON.stringify(fit));
});
test('legacy scenes keep the native portrait frame even when their artwork is wide',()=>{
 const fit={x:-700,y:-320,width:1400,height:650};
 const presentation=compose({id:'legacy-scene',type:'spine36',legacy:{}},fit);
 assert.equal(presentation.nativePortrait,true);
 assert.equal(presentation.orientation,'portrait');
 assert.equal(JSON.stringify(presentation.focus),JSON.stringify(fit));
});
test('off-center portrait focus leaves the complete scene bounds intact',()=>{
 const content={x:-600,y:-400,width:1200,height:800};
 const presentation=compose({id:'off-center',legacy:{}},content,{focus:{x:0,y:0,width:.6,height:1}});
 assert.equal(presentation.focus.x+presentation.focus.width/2,-240);
 assert.equal(presentation.focus.height,800);
 assert.equal(JSON.stringify(presentation.content),JSON.stringify(content));
});
test('transparent scene margins crop uniformly with the correct Y direction; sparse figures are preserved',()=>{
 let pixels=canvas(120,200,{x:0,y:10,width:120,height:170});
 const sandbox={window:{},document:{createElement:()=>({getContext:()=>({drawImage(){},getImageData:()=>({data:pixels})})})}};
 vm.runInNewContext(fs.readFileSync('apps/core/noname/skin/localDynamic/runtime/framing.js','utf8'),sandbox);
 const trim=sandbox.window.SkinFraming.trimPortraitEdges,bounds={x:-300,y:-200,width:600,height:400};
 const down=trim({},bounds,.6,true),up=trim({},bounds,.6,false);
 assert.equal(down.width,204);assert.equal(down.height,340);assert.equal(down.x,-102);
 assert.equal(down.y,-180);assert.equal(up.y,-160);
 pixels=canvas(120,200,{x:40,y:20,width:40,height:160});
 assert.equal(trim({},bounds,.6,true),bounds);
});
