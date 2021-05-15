const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: false,
    output: {
        publicPath: 'http://localhost:3000/'
    },
    devServer: {
        port: 3000
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react']
                },
            },
            exclude: /node_modules/,
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: 'remoteEntry.js',
            name: 'remote',
            exposes: {
                './NewsList': './src/NewsList'
            },
            shared: {
                react: {
                    singleton: true,
                },
                'react-dom': {
                    singleton: true,
                }
            },
        }),
    ]
}