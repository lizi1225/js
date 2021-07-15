const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

// 第一步：转换代码，生成依赖
function stepOne(filename) {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module', // 不加这个参数 无法识别es module
  })
  const dependencies = {}
  traverse(ast, {
    ImportDeclaration({
      node
    }) {
      const dirname = path.dirname(filename)
      const newFile = './' + path.join(dirname, node.source.value)
      dependencies[node.source.value] = newFile
    }
  })
  const {
    code
  } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  })
  return {
    filename,
    dependencies,
    code
  }
}


// 第二部 生成依赖图谱
function stepTwo(entry) {
  const entryModule = stepOne(entry)
  const graphArray = [entryModule]
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i]
    const {
      dependencies
    } = item
    for (let j in dependencies) {
      graphArray.push(stepOne(dependencies[j]))
    }
  }
  const graph = {}
  graphArray.forEach(item => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code
    }
  })
  return graph
}

// 第三部 生成代码字符串
function step3(entry) {
  const graph = JSON.stringify(stepTwo(entry))
  return `
  (function(graph) {
      //require函数的本质是执行一个模块的代码，然后将相应变量挂载到exports对象上
      function require(module) {
          //localRequire的本质是拿到依赖包的exports变量
          function localRequire(relativePath) {
              return require(graph[module].dependencies[relativePath]);
          }
          var exports = {};
          (function(require, exports, code) {
              eval(code);
          })(localRequire, exports, graph[module].code);
          return exports;//函数返回指向局部变量，形成闭包，exports变量在函数执行后不会被摧毁
      }
      require('${entry}')
  })(${graph})`

}
eval(step3('./src/index.js'))