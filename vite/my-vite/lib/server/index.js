const connect = require('connect')
const serveStaticMiddleware = require('./middlewares/static')
const transformMiddleware = require('./middlewares/transform')
const resolveConfig = require('../config')
const { createOptimizeDepsRun } = require('../optimizer')
const { createPluginContainer } = require('./pluginContainer')

async function createServer() {
    const middlewares = connect()
    const config = await resolveConfig()
    const pluginContainer = await createPluginContainer(config)
    
    const server = {
        pluginContainer,
        async listen(port, cb) {
            // 依赖预构建
            await runOptimize(config, server)
            require('http').createServer(middlewares).listen(port, cb)
        }
    }
    for(const plugin of config.plugins) {
        if (plugin.configureServer) {
            plugin.configureServer(server)
        }
    }
    middlewares.use(transformMiddleware(server))
    middlewares.use(serveStaticMiddleware(config))
    // vue => /node_modules/.vite/deps/vue.js?v=a3b4d5a9
    return server
}

async function runOptimize(config, server) {
    const optimizeDeps = await createOptimizeDepsRun(config)
    server._optimizeDepsMetadata = optimizeDeps.metadata
}

exports.createServer = createServer