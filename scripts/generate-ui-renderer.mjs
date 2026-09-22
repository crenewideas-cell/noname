import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

// Extract rendering classes and literal artwork metadata, never execute a
// legacy module's registration callback (it also contains gameplay patches).
export function generateUiRenderer(root) {
 const source=fs.readFileSync(path.join(root,'original/十周年UI/animation.js'),'utf8');
 const ast=ts.createSourceFile('animation.js',source,ts.ScriptTarget.Latest,true);
 const factory=ast.statements.find(node=>ts.isExpressionStatement(node)&&ts.isCallExpression(node.expression)&&node.expression.expression.getText(ast).includes('function(duilib)'));
 if(!factory)throw new Error('Missing standalone animation renderer');
 let renderer=factory.getText(ast);
 const wrapper=factory.expression.expression;
 const fn=ts.isParenthesizedExpression(wrapper)?wrapper.expression:wrapper;
 const excluded=new Set(['duilib.observeSize','duilib.AnimationPlayerPool','duilib.DynamicPlayer','duilib.DynamicWorkers','duilib.BUILT_ID']);
 const cuts=fn.body.statements.filter(node=>ts.isExpressionStatement(node)&&ts.isBinaryExpression(node.expression)&&excluded.has(node.expression.left.getText(ast)));
 const edits=cuts.map(node=>[node.getStart(ast),node.end,'']);
 function sanitize(node){
  if(ts.isBinaryExpression(node)&&node.left.getText(ast)==='APNode.prototype.complete'){
   edits.push([node.right.getStart(ast),node.right.end,"function () { if (typeof this.oncomplete === 'function') this.oncomplete(); }"]);return;
  }
  ts.forEachChild(node,sanitize);
 }
 sanitize(fn);
 for(const [from,to,text] of edits.sort((a,b)=>b[0]-a[0])){
  const start=from-factory.getStart(ast),end=to-factory.getStart(ast);
  renderer=renderer.slice(0,start)+text+renderer.slice(end);
 }
 renderer=renderer.replaceAll('this.check();','');
 const generated=`// Generated from 十周年UI/animation.js; original authors retain attribution.\n// Rendering classes only. No skill/card registration or game globals.\nexport function createAnimationRenderer(spine) {\nconst window={spine,get devicePixelRatio(){return globalThis.devicePixelRatio||1;},documentZoom:1};\nconst self=window;\nconst decadeUI={get:{bodySize:()=>({width:innerWidth,height:innerHeight})}};\nlet duilib={};\n${renderer}\nreturn duilib;\n}\n`;
 fs.writeFileSync(path.join(root,'native/animation-renderer.js'),generated);
 function literal(node){
  if(ts.isStringLiteral(node)||ts.isNumericLiteral(node))return ts.isNumericLiteral(node)?Number(node.text):node.text;
  if(node.kind===ts.SyntaxKind.TrueKeyword)return true;
  if(node.kind===ts.SyntaxKind.FalseKeyword)return false;
  if(node.kind===ts.SyntaxKind.NullKeyword)return null;
  if(ts.isPrefixUnaryExpression(node)&&node.operator===ts.SyntaxKind.MinusToken&&ts.isNumericLiteral(node.operand))return -Number(node.operand.text);
  if(ts.isArrayLiteralExpression(node))return node.elements.map(literal);
  if(ts.isObjectLiteralExpression(node))return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(prop=>[prop.name.text,literal(prop.initializer)]).filter(([,value])=>value!==undefined));
 }
 let effects={};
 function visit(node){if(ts.isVariableDeclaration(node)&&node.name.getText(ast)==='defines')effects=literal(node.initializer)||{};ts.forEachChild(node,visit);}
 visit(ast);
 const skinsSource=fs.readFileSync(path.join(root,'original/十周年UI/dynamicSkin_default.js'),'utf8');
 const skinsAst=ts.createSourceFile('dynamicSkin.js',skinsSource,ts.ScriptTarget.Latest,true);
 let skins={};
 function visitSkins(node){if(ts.isBinaryExpression(node)&&node.left.getText(skinsAst)==='decadeUI.dynamicSkin'&&ts.isObjectLiteralExpression(node.right))skins=literal(node.right);ts.forEachChild(node,visitSkins);}
 visitSkins(skinsAst);
 fs.writeFileSync(path.join(root,'native/animation-assets.json'),JSON.stringify({effects,skins},null,2)+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))generateUiRenderer(path.resolve('apps/core/extension/ui/手杀标准UI'));
