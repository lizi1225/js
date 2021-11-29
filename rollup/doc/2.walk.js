const acorn = require('acorn')
// rollup和webpack都是通过acorn把源代码转成抽象语法树
const source = `import $ from 'jquery';`
const walk = require('./ast/walk')
const ast = acorn.parse(source, {
    // 显示位置 范围
    locations: true,
    ranges: true, 
    sourceType: 'module',
    ecmaVersion: 8,
})
let indent = 0
const padding = () => " ".repeat(indent)
// ast.body是数组，放置根语句
ast.body.forEach((statement) => {
    walk(statement, {
        enter(node, parent) {
            if (node.type) {
                console.log(padding() + node.type + ' enter')
                indent += 2
            }
        },
        leave(node) {
            if (node.type) {
                indent -= 2
                console.log(padding() + node.type + ' leave')
            }
        },
    })
})