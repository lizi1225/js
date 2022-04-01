const path = require('path')

function updateCompiler(compiler) {
    const options = compiler.options
    // 1.来自于webpack-dev-sever/client/index.js websocket客户端
    options.entry.main.import.unshift(
        require.resolve('../../client/index.js')
    )
    // 2.webpack/hot/dev-server.js 用来在浏览器监听发射的事件，进行后续热更新逻辑
    options.entry.main.import.unshift(
        require.resolve('../../../webpack/hot/dev-server.js')
    )
    console.log(options.entry)
    // 通知webpack按新的入口进行编译
    compiler.hooks.entryOption.call(options.context, options.entry)
}


module.exports = updateCompiler
/**
 * webpack4 
 * entry: {
 *  main: ['./src/index.js']
 * }
 * webpack5
 * entry: {
 *  main: {
 *      import: ['./src/index.js]
 *  }
 * }
 */