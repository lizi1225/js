const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')
// 1. 通过词法分析、语法分析生成ast 2. 转换ast  3.生成代码

const code = `function ast(){}`
const ast = esprima.parse(code)
let indent = 0
// 深度优先遍历
estraverse.traverse(ast, {
  enter(node) {
    if(node.type === 'FunctionDeclaration') {
      node.id.name = 'newName'
    }
    console.log(' '.repeat(indent) + '进入', node.type)
    indent += 2
  },
  leave(node) {
    indent -= 2
    console.log(' '.repeat(indent) + '离开', node.type)
  }
})
const newCode = escodegen.generate(ast)
console.log(newCode)