const hotEmitter = require('./emitter')
hotEmitter.on('webpackHotUpdate', (currentHash) => {
    console.log('devServer', currentHash)
    // 热更新检查
    // hotCheck()
})