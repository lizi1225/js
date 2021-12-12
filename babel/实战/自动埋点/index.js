const importModule = require('@babel/helper-module-imports')
const parser = require('@babel/parser')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default

const fs = require('fs')
const path = require('path')
/**
 * 1.在模块首部添加`import _tracker2 from "tracker"`
 * 2.在函数、方法中添加_tracker2()
 */
const sourceCode = fs.readFileSync(path.resolve(__dirname, 'sourceCode.js'), 'utf8')
console.log(sourceCode)

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
})
traverse(ast, {
    Program(node, path) {
        node.node.body.unshift(types.importDeclaration(
            [types.importDefaultSpecifier(types.identifier('_tracker2'))],
            types.stringLiteral('tracker')
        ))
    },
    FunctionDeclaration(node) {
        node.node.body.unshift(
            types.expressionStatement(
                types.callExpression([types.v8IntrinsicIdentifier('_tracker2')])))
    }
})

const { code } = generate(ast)
console.log(code)