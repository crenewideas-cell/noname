import ts from 'typescript';

/** Applied after migration and to checked-in scenes; never imports game code. */
export function isolateRzshScenes(source) {
 const ast=ts.createSourceFile('scenes.js',source,ts.ScriptTarget.Latest,true);
 const edits=[];
 function visit(node){
  if(ts.isBinaryExpression(node)&&node.left.getText(ast)==='window["rzsh"]'&&ts.isObjectLiteralExpression(node.right)){
   edits.push([node.left.getStart(ast),node.left.end,'sceneGlobals["rzsh"]']);
   const functions=node.right.properties.find(property=>property.name?.text==='function');
   if(functions)edits.push([functions.initializer.getStart(ast),functions.initializer.end,'{}']);
   return;
  }
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
 if(!source.includes('const window = lifecycle.window, document = lifecycle.document;'))source=source.replace('const PIXI = lifecycle.pixi;', 'const window = lifecycle.window, document = lifecycle.document;\n    const PIXI = lifecycle.pixi;');
 if(!source.includes('const rzsh = window.rzsh;'))source=source.replace('const window = lifecycle.window, document = lifecycle.document;', 'const window = lifecycle.window, document = lifecycle.document;\n    const rzsh = window.rzsh;');
 return source.replace('UI scenes and ranking logic retained; legacy game bootstrap is intentionally excluded.', 'UI scenes only; gameplay and match results belong to the host.').replace('import { lib, game, ui, get, ai, _status } from "noname";',
  'const sceneGlobals = Object.create(null);\nexport function createSceneMetadata() { return structuredClone(sceneGlobals.rzsh); }');
}
