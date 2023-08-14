const acorn = require('acorn');
const fs = require('fs');
const path = require('path');
const buffer = fs.readFileSync(path.resolve(process.cwd(), './src/index.js')).toString();
const body = acorn.parse(buffer, {
    ecmaVersion: 'latest',
}).body;
// 引用一个 Generator 类，用来生成 ast 对应的代码
const Generator = require('./generator');
// 创建 Generator 实例
const gen = new Generator();
// 定义变量decls  存储所有的函数或变量类型节点 Map类型
const decls = new Map();
// 定义变量calledDecls 存储被用到过的函数或变量类型节点 数组类型
const calledDecls = [];
// 保存代码信息
const code = [];
// 开始遍历 ast
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
})
console.log('decls', decls);
console.log('calledDecls', calledDecls);