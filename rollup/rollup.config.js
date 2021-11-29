import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
// 混淆、压缩js 文件名、变量名剪短
import { terser } from 'rollup-plugin-terser'
// 压缩css
import postcss from 'rollup-plugin-postcss'
// 预览项目
import serve from 'rollup-plugin-serve'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.es.js',
        // amd/es/iife/umd/cjs 
        format: 'es',
        name: 'bundleName',
        globals: {
            // 告诉rollup模块lodash可以从去全局变量_取
            lodash: '_',
            jquery: '$',
        }
    },
    plugins: [
        babel({
            exclude: /node_modules/
        }),
        resolve(),
        commonjs(),
        typescript(),
        terser(),
        postcss(),
        serve({
            open: false,
            port: 8080,
            contentBase: './dist',
        })
    ],
    external: ['lodash', 'jquery']
}