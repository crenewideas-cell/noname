import ts from 'typescript';

/** Applied after migration and to checked-in scenes; never imports game code. */
export function isolateRzshScenes(source) {
 const ast=ts.createSourceFile('scenes.js',source,ts.ScriptTarget.Latest,true);
 const edits=[];
 function visit(node){
  if(ts.isVariableStatement(node)&&node.declarationList.declarations.some(item=>item.name.getText(ast)==='rankingContent')){
   edits.push([node.getStart(ast),node.end,'// Match results and ranking belong to the host, not the lobby.']);return;
  }
  if(ts.isCallExpression(node)&&ts.isElementAccessExpression(node.expression)&&node.expression.expression.getText(ast)==='ku'&&node.expression.argumentExpression.text==='on'&&node.arguments[0]?.text==='pointerup'){
   edits.push([node.arguments[1].getStart(ast),node.arguments[1].end,'event => { if (event.data.global.x === ku.startX) lifecycle.character(ku.name); }']);return;
  }
  ts.forEachChild(node,visit);
 }
 visit(ast);
 for(const [start,end,text] of edits.sort((a,b)=>b[0]-a[0]))source=source.slice(0,start)+text+source.slice(end);
 return source.replace('UI scenes and ranking logic retained; legacy game bootstrap is intentionally excluded.', 'UI scenes only; gameplay and match results belong to the host.').replace('import { lib, game, ui, get, ai, _status } from "noname";',
  'let lib, game, ui, get, ai, _status;\nexport function bindSceneContext(context) { ({lib,game,ui,get,ai,_status}=context); }');
}
