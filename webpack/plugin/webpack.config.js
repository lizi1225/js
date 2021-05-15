const DonePlugin = require('./plugins/DonePlugin')
const AssetsPlugin = require('./plugins/AssetsPlugin')
const ZipPlugin = require('./plugins/ZipPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AutoExternalPlugin = require('./plugins/AutoExternalPlugin')
module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/index.js',
    // externals: {
    //     'jquery': '$'
    // },
    plugins: [
        // new DonePlugin(),
        // new AssetsPlugin(),
        // new ZipPlugin(),

        // new HtmlWebpackPlugin({
        //     template: './src/index.html',
        //     filename: 'index.html'
        // }),
        new AutoExternalPlugin({
            jquery: {
                expose: '$',
                url: 'https://cdn.bootcss.com/jquery/3.1.0/jquery.js',
            },
            lodash: {
                expose: '_',
                url: 'https://cdn.bootcss.com/lodash/3.1.0/lodash.js',

            }
        })
    ]
}