// 不再修改老的console节点，需要在console之前插入一个新节点

const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types')
const template = require('@babel/template')


const source = `
console.log(1);

function func() {
    console.info(2);
}

export default class Clazz {
    say() {
        console.debug(3);
    }
    render() {
        return <div>{console.error(4)}</div>
    }
}
`
/**
 * 注意点：
 * 1.在jsx中不能简单的在前面插入一个节点，而要把整体替换成一个数组表达式，因为JSX中支持单个表达式 
 *    比如 `<div>{console.log(1}</div>`要换成`<div>{[console.log("line: 1, column: 1"), console.log(1)]}</div>`
 * 2.用新的节点替换了旧的节点之后，babel traverse会继续遍历新节点，这个是没必要的，可以跳过
 */

const ast = parser.parse(source, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
})

 const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);
 traverse(ast, {
   CallExpression(path) {
     if (path.node.isNew) {
       return
     }
     const calleeName = generate(path.node.callee).code
     if (targetCalleeName.includes(calleeName)) {
       const { line, column } = path.node.loc.start
       const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)()
       newNode.isNew = true
       if (path.findParent(path => path.isJSXElement())) {
         path.replaceWith(types.arrayExpression([newNode, path.node]))
         // 跳过子节点处理
         path.skip()
       } else {
         path.insertBefore(newNode)
       }
     }
   }
 })

 const { code } = generate(ast)
 console.log(code)