class DonePlugin {
    // apply是插件挂载方法
    apply(compiler) {
        debugger
        compiler.hooks.done.tapAsync('DonePlugin', (stats, callback) => {
            console.log('DonePlugin')
            callback()
        })
    }
}

module.exports = DonePlugin