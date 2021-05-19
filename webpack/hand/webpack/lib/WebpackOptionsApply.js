const EntryOptionPlugin = require("./EntryOptionPlugin")

/**
 * 挂载各种各样的内置插件
 */
class WebpackOptionsApply{
    process(options, compiler) {
        new EntryOptionPlugin().apply(compiler)
        compiler.hooks.entryOption.call(options.context, options.entry)
    }
}
module.exports = WebpackOptionsApply