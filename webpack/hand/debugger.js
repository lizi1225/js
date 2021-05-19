const webpack = require('./webpack')
const webpackConfig = require('./webpack.config')

const compiler = webpack(webpackConfig)
compiler.run((err, stats) => {
    console.log(err)
    console.log(stats.toJson({
        // 显示所有入口、代码块、模块、资源
        entries: true,
        chunks: true,
        modules: true,
        assets: true,
    }))
})