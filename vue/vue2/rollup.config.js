import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'


export default {
    input: './src/index.js',
    output: {
        format: 'umd', // 模块化的类型
        name: 'Vue', // 全局变量的名字
        file: 'dist/umd/vue.js',
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            port: 3000,
            contentBase: '', // 此服务相对于哪个目录 为空表示相对于当前目录
            openPage: '/index.html' // 打开页面
        })
    ]
}