const webpack = require('webpack')
const config = require('./webpack.config')

const Server = require('./webpack-dev-server/lib/Server')

function startDevServer(compiler, config) {
    const devServerArgs = config.devServer || {}
    // 启动HTTP服务器，负责项目的打包和预览服务，通过它访问打包后的文件
    const server = new Server(compiler, devServerArgs)
    const { port = 8080, host = 'localhost' } = devServerArgs
    server.listen(port, host, (err) => {
        console.log(`Project is listen in http://${host}:${port}/`)
    })
}
const compiler = webpack(config)
startDevServer(compiler, config)

module.exports = startDevServer