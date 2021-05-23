const path = require('path')
const types = require('babel-types')
const generate = require('babel-generator').default
const traverse = require('babel-traverse').default
const async = require('neo-async')

module.exports = class NormalModule {
    constructor({ name, context, rawRequest, resource, parser, moduleId, async }) {
        this.name = name
        this.context = context
        this.rawRequest = rawRequest
        this.resource = resource
        // Ast解析器,可以把源代码转成ast抽象语法树
        this.parser = parser
        this.moduleId = moduleId
        // 此模块对应的源代码
        this._source = undefined
        this._ast = undefined
        this.dependencies = []
        // 当前模块依赖哪些异步模块 动态import
        this.blocks = []
        // 当前代码块是异步还是同步
        this.async = async
    }
    build(compilation, callback) {
        this.doBuild(compilation, (err) => {
            this._ast = this.parser.parse(this._source)
            traverse(this._ast, {
                CallExpression: (nodePath) => {
                    const node = nodePath.node
                    if(node.callee.name === 'require') {
                        node.callee.name = '__webpack_require__'
                        const moduleName = node.arguments[0].value
                        let depResource;
                        // 判断是第三方模块还是本地模块(未考虑别名的情况)
                        if (moduleName.startsWith('.')) {
                            const extName = moduleName.split(path.posix.sep).pop().indexOf('.') === -1 ? '.js' : ''
                            // 获取依赖模块的绝对路径
                            // path.posix路径分隔符一定是linux下的/ 保证打包出来的代码路径一样
                            depResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extName)
                            
                        } else {
                            depResource = require.resolve(path.posix.join(this.context, 'node_modules', moduleName))
                            // 把window路径分隔符转为/
                            depResource = depResource.replace(/\\/g, '/')
                        }
                        // const depModuleId = './' + path.posix.relative(this.context, depResource)
                        let depModuleId = '.' + depResource.slice(this.context.length)
                        // 把require的模块id 从./title.js改成了./src/title.js
                        node.arguments = [types.stringLiteral(depModuleId)]
                        this.dependencies.push({
                            name: this.name,
                            context: this.context,
                            rawRequest: moduleName,
                            moduleId: depModuleId,
                            resource: depResource,
                        })
                    } else if(types.isImport(node.callee)) {
                        const moduleName = node.arguments[0].value
                        const extName = moduleName.split(path.posix.sep).pop().indexOf('.') === -1 ? '.js' : ''
                        const depResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extName)
                        const depModuleId = './' + path.posix.relative(this.context, depResource)
                        let chunkName = 0
                        if (Array.isArray(node.arguments[0].leadingComments) && node.arguments[0].leadingComments.length > 0) {
                            const leadingComments = node.arguments[0].leadingComments[0].value
                            const regexp = /webpackChunkName:\s*['"]([^'"]+)['"]/
                            chunkName = leadingComments.match(regexp)[1]
                        }
                        nodePath.replaceWithSourceString(`
                            __webpack_require__.e("${chunkName}").then(__webpack_require__.t.bind(null, "${depModuleId}"), 7)
                        `)
                        this.blocks.push({
                            context: this.context,
                            entry: depModuleId,
                            name: chunkName,
                            async: true
                        })
                    }
                }
            })
            const { code } = generate(this._ast)
            this._source = code
            // 循环构建每一个异步代码块
            async.forEach(this.blocks, ({ context, entry, name, async }, done) => {
                compilation._addModuleChain(context, entry, name, async, done)
            }, callback)
        })
    }
    /**
     * 1.读取模块的源代码
     * @param {*} compilation 
     * @param {*} callback 
     */
    doBuild(compilation, callback) {
        this.getSource(compilation, (err, source) => {
            // loader转换的逻辑写在这里
            this._source = source
            callback()
        })
    }
    getSource(compilation, callback) {
        compilation.inputFileSystem.readFile(this.resource, 'utf8', callback)
    }
}
/**
 * 1.从硬盘上读取文件内容 读成一个文本
 * 2.可能它不是一个js模块，所以可能要走loader的转换，最终要得到一个js模块，否则报错
 * 3.把这个js模块经过parser处理转成抽象语法树ast
 * 4.分析ast里面的依赖，也就是找require import节点 分析依赖的模块
 * 5。递归地编译依赖的模块
 * 6.不停地一次递归上面5步，直到所有的模块都编译完成为止
 * 
 * 模块Id
 * 不管是本地模块还是第三方模块，模块id都是相对于项目根目录的相对路径
 * ./src/index.js
 * ./node_modules/util/util.js
 * 特点： 以.开头 路径分割符是linux的/ 
 */

/**
 * 如何处理懒加载
 * 1. 先把代码转成ast语法树
 * 2.
 */