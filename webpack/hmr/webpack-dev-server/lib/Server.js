const express = require('express')
const http = require('http')
const updateCompiler = require('./utils/updateCompiler')
const webpackDevMiddleware = require('../../webpack-dev-middleware')
const io = require('socket.io')

class Server {
    constructor(compiler, devServerArgs) {
        this.sockets = []
        this.compiler = compiler
        this.devServerArgs = devServerArgs
        updateCompiler(compiler)
        // 启动webpack编译
        this.setupHooks()
        this.setupApp()
        this.routes()
        this.setupDevMiddleware()
        this.createServer()
        this.createSocketServer()
    }
    createSocketServer() {
        // websocket通信之前要握手，握手用http协议
        const websocketServer = io(this.server)
        websocketServer.on('connection', (socket) => {
            console.log('新的websocket连接')
            // 保存socket 将来可以广播
            this.sockets.push(socket)
            socket.on('disconnect', () => {
                const index = this.sockets.indexOf(socket)
                this.sockets.splice(index, 1)
            })
            // 如果已经编译过了，发送消息
            if (this._stats) {
                socket.emit('hash', this._stats.hash)
                socket.emit('ok')
            }
        })
    }
    setupDevMiddleware() {
        this.middleware = webpackDevMiddleware(this.compiler)
        this.app.use(this.middleware)
    }
    setupHooks() {
        // stats编译成功后的成果描述（modules,chunks,files,assets,entries）
        this.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
            console.log('stats.hash', stats.hash)
            this.sockets.forEach(socket => {
                socket.emit('hash', stats.hash)
                socket.emit('ok')
            })
            this._stats = stats
        })
    }
    routes() {
        if (this.devServerArgs.contentBase) {
            this.app.use(express.static(this.devServerArgs.contentBase))
        }
    }
    setupApp() {
        // this.app并不是一个http服务，它本身其实只是一个路由中间件
        this.app = express()
    }
    createServer() {
        this.server = http.createServer(this.app)
    }
    listen(port, host, callback) {
        this.server.listen(port, host, callback)
    }
}
module.exports = Server