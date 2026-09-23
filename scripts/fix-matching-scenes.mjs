import ts from 'typescript';
// Reapply at generation time. Modern Spine dispatches TrackEntry.listener;
// the source's legacy onComplete property is never invoked by this runtime.
export function fixMatchingScenes(source,style){
 const start=source.indexOf(style==='shousha'?"pipeihome.on('added', () => {":'U1["on"]("added", () => {');
 const end=source.indexOf(style==='shousha'?'function setupp()':'function U2()',start);
 if(start<0||end<0)throw new Error('Missing matchmaking scene anchors');
 const ast=ts.createSourceFile('scene.js',source,ts.ScriptTarget.Latest,true),edits=[];
 function visit(node){
  if(node.getStart(ast)>=start&&node.end<=end&&ts.isBinaryExpression(node)&&ts.isFunctionExpression(node.right)){
   const left=node.left,text=left.getText(ast);
   if(/(?:\.onComplete|\["onComplete"\])$/.test(text)&&text.includes('tracks')){
    const next=text.replace(/(?:\.onComplete|\["onComplete"\])$/,'.listener');
    edits.push([left.getStart(ast),left.end,next],[node.right.getStart(ast),node.right.getStart(ast),'{complete: '],[node.right.end,node.right.end,'}']);
   }
  }
  ts.forEachChild(node,visit);
 }visit(ast);
 for(const[a,b,text]of edits.sort((x,y)=>y[0]-x[0]))source=source.slice(0,a)+text+source.slice(b);
 if(style==='shousha'){
  if(!source.includes('bridge.matching(lib.config.mode);'))source=source.replace("pipeihome.on('added', () => {","pipeihome.on('added', () => {\n bridge.matching(lib.config.mode);\n findpipei.state.setAnimation(0, 'action2', false);");
  if(!source.includes("get.config('versus_mode')==='two')plength=game.storyBgMode"))source=source.replace("window.playerNickName['rzsh']=[];","// Four portraits plus the middle VS animation; display slots only.\n if(lib.config.mode==='versus'&&get.config('versus_mode')==='two')plength=game.storyBgMode==='paiwei'?5:4;\n window.playerNickName['rzsh']=[];");
 }else if(!source.includes('G4.state.setAnimation(0, "action4", false);'))source=source.replace('U1["on"]("added", () => {','U1["on"]("added", () => {\n G4.state.setAnimation(0, "action4", false);');
 return source;
}
