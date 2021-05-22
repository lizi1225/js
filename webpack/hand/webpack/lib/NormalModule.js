const path = require('path')
const types = require('babel-types')
const generate = require('babel-generator').default
const traverse = require('babel-traverse').default
const { moduleId } = require('_webpack@5.37.0@webpack/lib/RuntimeGlobals')

module.exports = class NormalModule {
    constructor({ name, context, rawRequest, resource, parser, moduleId }) {
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
                        const extName = moduleName.split(path.posix.sep).pop().indexOf('.') === -1 ? '.js' : ''
                        // 获取依赖模块的绝对路径
                        // path.posix路径分隔符一定是linux下的/ 保证打包出来的代码路径一样
                        const depResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extName)
                        const depModuleId = './' + path.posix.relative(this.context, depResource)
                        // 把require的模块id 从./title.js改成了./src/title.js
                        node.arguments = [types.stringLiteral(depModuleId)]
                        this.dependencies.push({
                            name: this.name,
                            context: this.context,
                            rawRequest: moduleName + extName,
                            moduleId: depModuleId,
                            resource: depResource,
                        })
                    }
                }
            })
            const { code } = generate(this._ast)
            this._source = code
            callback()
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