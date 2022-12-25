const connect = require('connect')
const serveStaticMiddleware = require('./middlewares/static')
const resolveConfig = require('../config')
const { createOptimizeDepsRun } = require('../optimizer')

async function createServer() {
    const middlewares = connect()
    const config = await resolveConfig()
    middlewares.use(serveStaticMiddleware(config))
    const server = {
        async listen(port, cb) {
            // 依赖预构建
            await runOptimize(config, server)
            require('http').createServer(middlewares).listen(port, cb)
        }
    }
    return server
}

async function runOptimize(config, server) {
    const optimizeDeps = await createOptimizeDepsRun(config)
    server._optimizeDepsMetadata = optimizeDeps.metadata
}

exports.createServer = createServer