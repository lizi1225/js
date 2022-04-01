/**
 * webpack开发中间件
 * 1.以监听模式启动webpack的编译
 * 2. 返回一个express中间件，用来预览我们产出的资源文件
 */
// const MemoryFileSystem = require('memory-fs')
const fs = require('fs')
// const memoryFileSystem = new MemoryFileSystem()
const middleware = require('./middleware')
function webpackDevMiddleware(compiler) {
    
    compiler.watch({}, () => {
        console.log('检测到文件变化，webpack重新编译')
    })
    // 产出的文件不是写入硬盘 为了提高性能，将这些文件放在内存中
    // const fs = compiler.outputFileSystem = memoryFileSystem
    return middleware({
        fs,
        outputPath: compiler.options.output.path
    })
}
module.exports = webpackDevMiddleware