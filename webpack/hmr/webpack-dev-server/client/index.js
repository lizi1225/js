const hotEmitter = require('../../webpack/hot/emitter')
const io = require('socket.io')

// 可以省略http://localhost:9000/ 可以传/ 或者不传
const socket = io('http://localhost:9000/')

let currentHash
socket.on('hash', (hash) => {
    console.log('客户端收到hash')
    currentHash = hash
})
socket.on('ok', () => {
    console.log('客户端收到ok信息')
    reloadApp()
})
function reloadApp() {
    hotEmitter.emit('webpackHotUpdate', currentHash)
}