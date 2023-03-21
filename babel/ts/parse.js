const tsCompiler = require('typescript');
const fs = require('fs');
const path = require('path');

const tsCode = fs.readFileSync(path.resolve(__dirname, '1.ts'), 'utf8');
const ast = tsCompiler.createSourceFile('xxx', tsCode, tsCompiler.ScriptTarget.Latest, true)
// console.log(ast)

function walk(node) {
    tsCompiler.forEachChild(node, walk)
    console.log(node)
}
walk(ast)