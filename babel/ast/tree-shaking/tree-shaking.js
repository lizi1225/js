const acorn = require('acorn');
const fs = require('fs');
const path = require('path');
const buffer = fs.readFileSync(path.resolve(process.cwd(), './src/index.js')).toString();
const body = acorn.parse(buffer, {
    ecmaVersion: 'latest',
}).body;
const Generator = require('./generator');
const gen = new Generator();
const decls = new Map();
const calledDecls = [];
let code = []

body.forEach(node => {
    if (node.type === 'FunctionDeclaration') {
        const code = gen.run([node]);
        decls.set(gen.visitNode(node.id), code);
        return;
    }
    if (node.type === 'VariableDeclaration') {
        for (const decl of node.declarations) {
            decls.set(gen.visitNode(decl.id), gen.visitVariableDeclarator(decl, node.kind));
        }
        return;
    }
    if (node.type === 'ExpressionStatement') {
        if (node.expression.type === 'CallExpression') {
            const callNode = node.expression;
            calledDecls.push(gen.visitIdentifier(callNode.callee));
            for (const arg of callNode.arguments) {
                if (arg.type === 'Identifier') {
                    calledDecls.push(arg.name);
                }
            }
        }
    }
    if (node.type === 'Identifier') {
        calledDecls.push(node.name);
    }
    code.push(gen.run([node]));
})
code = calledDecls.map(c => decls.get(c)).concat(code).join('');
// console.log('decls', decls);
// console.log('calledDecls', calledDecls);
console.log(code);