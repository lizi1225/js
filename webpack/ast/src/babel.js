// 箭头函数转化为普通函数的插件
const core = require('@babel/core')
const t = require('babel-types')
const BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')

const sourceCode = `
  const sum = (a, b) => {
    console.log(this)
    return a + b
  }
`
// 1. 遍历到箭头函数节点 2. 看箭头函数里面是否使用了this 如果使用了 就要找到有this的外层作用域 var _this = this 然后将箭头函数里面的this替换为_this
// 3. 将函数类型改为函数表达式
const MyBabelPluginTransformEs2015ArrowFunctions = {
  visitor: {
    ArrowFunctionExpression(nodePath) {
      hoistFunctionEnvironment(nodePath)
      nodePath.node.type = 'FunctionExpression'
    }
  }
}
function hoistFunctionEnvironment(fnPath) {
  const thisEnvFn = fnPath.findParent(p => {
    return (p.isFunction() && !p.isArrowFunctionExpression() || p.isProgram())
  })
  const thisPaths = getScopeInformation(fnPath)
  const thisBinding = '_this'
  if(thisPaths.length > 0) {
    thisEnvFn.scope.push({
      id: t.identifier(thisBinding),
      init: t.thisExpression()
    })
    thisPaths.forEach(thisPath => {
      thisPath.replaceWith(t.identifier(thisBinding))
    })
  }
}
function getScopeInformation(fnPath) {
  const thisPaths = []
  fnPath.traverse({
    ThisExpression(thisPath) {
      console.log(thisPath)
      thisPaths.push(thisPath)
    }
  })
  return thisPaths
}
const targetCode = core.transform(sourceCode, {
  plugins: [MyBabelPluginTransformEs2015ArrowFunctions]
})
console.log(targetCode.code)