const Compiler = require('./Compiler')
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin')
const WebpackOptionsApply = require('./WebpackOptionsApply')
const webpack = (options, callback) => {
    // 1. 验证配置文件是否合法，不合法报错 new WebpackOptionsValidationError()
    // 2. 增加默认参数 webpack支持0配置 new WebpackOptionsDefaulter()
    // 3. 创建compiler对象
    const compiler = new Compiler(options.context)
    compiler.options = options
    new NodeEnvironmentPlugin().apply(compiler)
    // 4.挂载配置文件里提供的所有plugins
    if(options.plugins && Array.isArray(options.plugins)) {
        for(const plugin of options.plugins) {
            if(typeof plugin === 'function') {
                plugin.call(compiler, compiler)
            } else {
                plugin.apply(compiler)
            }
        }
    }
    new WebpackOptionsApply().process(options, compiler)
    return compiler

}
exports = module.exports = webpack