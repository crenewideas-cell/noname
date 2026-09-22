// Parse only literal source metadata; never import/evaluate source programs.
import ts from 'typescript';
let input='';for await(const chunk of process.stdin)input+=chunk;
const sources=JSON.parse(input),result={};
function literal(node){
 if(!node)return undefined;
 if(ts.isStringLiteral(node)||ts.isNumericLiteral(node))return ts.isNumericLiteral(node)?Number(node.text):node.text;
 if(node.kind===ts.SyntaxKind.TrueKeyword)return true;if(node.kind===ts.SyntaxKind.FalseKeyword)return false;
 if(ts.isPrefixUnaryExpression(node)&&node.operator===ts.SyntaxKind.MinusToken&&ts.isNumericLiteral(node.operand))return -Number(node.operand.text);
 if(ts.isArrayLiteralExpression(node))return node.elements.map(literal);
 if(ts.isObjectLiteralExpression(node))return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(p=>[p.name.text,literal(p.initializer)]).filter(([,v])=>v!==undefined));
}
for(const [file,text] of Object.entries(sources)){
 const ast=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
 function walk(n){
  if(ts.isVariableDeclaration(n)&&['skillDefines','cardDefines','chupaiAnimations','dynamicSkinConfig'].includes(n.name.getText(ast)))result[n.name.getText(ast)]=literal(n.initializer);
  if(ts.isBinaryExpression(n)&&n.left.getText(ast).endsWith('.dynamicSkin'))result.dynamicSkin=literal(n.right);
  ts.forEachChild(n,walk);
 }
 walk(ast);
}
process.stdout.write(JSON.stringify(result));
