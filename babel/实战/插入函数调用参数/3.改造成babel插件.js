/**
 * 功能复用：改造成babel插件
 */


// babel插件形式 babel支持transform插件，形式是函数返回一个对象，对象有visitor属性
// 第一个参数可以拿到types、template等常用包的api，不需要再单独引入
// module.exports = function (api, options) {
//   return {
//     visitor: {
//       Identifier(path, state){},
//     }
//   }
// }
const generate = require('@babel/generator').default

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);
module.exports = function ({ types, template }) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew) {
          return
        }

        const calleeName = generate(path.node.callee).code
        if (targetCalleeName.includes(calleeName)) {
          const { line, column } = path.node.loc.start
          const newNode = template.expression(`console.log("${state.filename || 'unkown filename'}: (${line}, ${column})")`)();
          newNode.isNew = true

          if (path.findParent((path) => path.isJSXElement())) {
            path.replaceWith(types.arrayExpression([newNode, path.node]))
            path.skip()
          } else {
            path.insertBefore(newNode)
          }
        }
      }
    }
  }
}
