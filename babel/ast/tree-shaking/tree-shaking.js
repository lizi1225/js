const acorn = require('acorn');
const fs = require('fs');
const JSEmitter = require('./js-emitter');
const path = require('path');
// const args = process.args[2];
const buffer = fs.readFileSync(path.resolve(__dirname, './test.js')).toString();
const body = acorn.parse(buffer, {
    ecmaVersion: 'latest',
}).body;
const jsEmitter = new JSEmitter();
const decls = new Map();
const calledDecls = [];
let code = []

body.forEach(node => {
    if (node.type === 'FunctionDeclaration') {
        const code = jsEmitter.run([node]);
        decls.set(jsEmitter.visitNode(node.id), code);
        return;
    }
    if (node.type === 'VariableDeclaration') {
        for (const decl of node.declarations) {
            decls.set(jsEmitter.visitNode(decl.id), jsEmitter.visitVariableDeclarator(decl, node.kind));
        }
        return;
    }
    if (node.type === 'ExpressionStatement') {
        debugger;
        if (node.expression.type === 'CallExpression') {
            const callNode = node.expression;
            calledDecls.push(jsEmitter.visitIdentifier(callNode.callee));
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
    code.push(jsEmitter.run([node]));
})
code = calledDecls.map(c => decls.get(c)).concat(code).join('');
// console.log('decls', decls);
// console.log('calledDecls', calledDecls);
console.log(code);