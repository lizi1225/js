class AutoExternalPlugin {
    constructor(options) {
        this.options = options
        this.importedModules = new Set()
    }
    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {

        })
    }
}
/**
 * 1.查找本项目中是否用到了某些模块
 * 2.介入 改造生产模块的过程 如果模块被配置为外部模块，就不需要打包了，走外部模块的流程，
 * 如果没有，则走正常打包流程
 */

module.exports = AutoExternalPlugin