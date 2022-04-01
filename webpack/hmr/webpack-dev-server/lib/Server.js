const express = require('express')
const http = require('http')
const updateCompiler = require('./utils/updateCompiler')
const webpackDevMiddleware = require('../../webpack-dev-middleware')

class Server {
    constructor(compiler, devServerArgs) {
        this.compiler = compiler
        this.devServerArgs = devServerArgs
        updateCompiler(compiler)
        // 启动webpack编译
        this.setupHooks()
        this.setupApp()
        this.routes()
        this.setupDevMiddleware()
        this.createServer()
    }
    setupDevMiddleware() {
        this.middleware = webpackDevMiddleware(this.compiler)
        this.app.use(this.middleware)
    }
    setupHooks() {
        // stats编译成功后的成果描述（modules,chunks,files,assets,entries）
        this.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
            console.log('stats.hash', stats.hash)
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