const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: false,
    // MPA 多页应用
    entry: {
        // page1: './src/page1.js',
        // page2: './src/page2.js',
        // page3: './src/page3.js',
        home: './src/home.js',
        login: './src/login.js',
    },
    optimization: {
        splitChunks: {
            /**
             *  三个可选值 默认值是async
             * all 同步+异步
             * initial 同步  
             * async 异步
             * */ 
            chunks: 'all',
            // 被提取代码块的最小尺寸
            // 设置代码块打包后的名称，默认名称是用分隔符~分隔代码块
            automaticNameDelimiter: '~',
            // 同一个入口分割出来最大异步请求数 默认值为3
            maxAsyncRequests: 3,
            // 同一个入口分割出来最大同步请求数 默认值为5
            maxInitialRequests: 5,
            name: true,
            // minSize默认是30k
            minSize: 0,
            // 缓存组 可以设置不同的缓存组来提取满足不同规则的chunk
            cacheGroups: {
                // 把符合条件的缓存组提取出来放在vendor这个代码块里
                vendors: {
                    // 比外层的chunks优先级高 外面是公共配置
                    // chunks: 'all',
                    // 条件
                    test: /[\\/]node_modules[\\/]/,
                    //  如果一个模块 符合多个缓存组的条件 数字越大 优先级越高
                    // 为什么是负数 webpack里面还有一些默认缓存组，它的优先级是0
                    priority: -10,
                },
                // 提取不同的代码块之间的公共代码
                default: {
                    // 如果这个模块被两个及以上的代码块引用了，就可以单独提取出来
                    minChunks: 2,
                    // 默认是30k
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
        // 持久化缓存
        runtimeChunk: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['home'],
            filename: 'home.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['login'],
            filename: 'login.html',
        }),
    ]
}