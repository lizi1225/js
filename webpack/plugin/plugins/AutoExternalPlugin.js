const {
    ExternalModule
} = require("webpack")

class AutoExternalPlugin {
    constructor(options) {
        this.options = options
        this.importedModules = new Set()
    }
    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {
            normalModuleFactory.hooks.parser
                .for('javascript/auto')
                .tap('AutoExternalPlugin', parser => {
                    parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
                        this.importedModules.add(source)
                    })
                    parser.hooks.call.for('require').tap('AutoExternalPlugin', (expression) => {
                        let value = expression.arguments[0].value
                        this.importedModules.add(value)
                    })
                })
            normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolvedData, callback) => {
                const request = resolvedData.request // ./src/index.js
                if (this.importedModules.has(request)) {
                    let variable = this.options[request].expose
                    callback(null, new ExternalModule(variable, 'window', request))
                } else {
                    callback(null, new ExternalModule('jquery', 'window', request))

                }
            })
        })
    }
}
/**
 * 1.查找本项目中是否用到了某些模块
 * 2.介入 改造生产模块的过程 如果模块被配置为外部模块，就不需要打包了，走外部模块的流程，
 * 如果没有，则走正常打包流程
 */

module.exports = AutoExternalPlugin