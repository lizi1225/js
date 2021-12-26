const Scope = require('./scope')
const walk = require('./walk')
const { hasOwnProperty } = require('../utils')

function analyse(ast, magicString, module) {
    // 模块内的顶级作用域
    let scope = new Scope({ name: '全局作用域' })
    ast.body.forEach((statement) => {
        function addToScope(name) {
            scope.add(name)
            // 是顶级作用域  只有顶级变量才能导出
            if (!scope.parent) {
                statement._defines[name] = true
            }
        }
        Object.defineProperties(statement, {
            _source: { value: magicString.snip(statement.start, statement.end) },
            // 当前节点是否已经被包含结果里了
            _include: { value: false, writable: true },
            // 当前statement节点定义了哪些变量
            _defines: { value: {} },
            // 当前statement节点依赖了哪些变量
            _dependsOn: { value: {} },
        })
        walk(statement, {
            enter(node) {
                let newScope;
                switch (node.type) {
                    case 'FunctionDeclaration':
                        addToScope(node.id.name)
                        const names = node.params.map(param => param.name)
                        newScope = new Scope({ name: node.id.name, parent: scope, names })
                        break
                    case 'VariableDeclaration':
                        node.declarations.forEach(declaration => addToScope(declaration.id.name))
                        break
                }
                if (newScope) {
                    Object.defineProperty(node, '_scope', { value: newScope })
                    scope = newScope
                }
            },
            leave(node) {
                if (hasOwnProperty(node, '_scope')) {
                    scope = scope.parent
                }
            }
        })
    })

    // 在构建完当前作用域，找到当前模块声明了哪些变量之后，要找到当前作用域内用到了哪些变量
    ast.body.forEach(statement => {
        walk(statement, {
            enter(node) {
                if (node.type === 'Identifier') {
                    // 说明我们要读取这个变量，依赖这个变量
                    statement._dependsOn[node.name] = true
                }
            },
            leave() {

            }
        })
    })
}


module.exports = analyse