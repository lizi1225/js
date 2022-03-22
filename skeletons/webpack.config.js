const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { SkeletonPlugin } = require('./skeleton')

module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader', 
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
        }),
        new SkeletonPlugin({
            staticDir: path.resolve(__dirname, 'dist'),
            port: 8000,
            origin: 'http://localhost:8000',
            device: 'iPhone 6',
            defer: 5000,
            button: {
                color: '#EFEFEF',
            },
            image: {
                color: '#EFEFEF',
            },
        })
    ]
}