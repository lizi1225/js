const path = require('path')
const ts = require('rollup-plugin-typescript2')
const resolvePlugin = require('@rollup/plugin-node-resolve').default

const packagesDir = path.resolve(__dirname, 'packages')
const name =  process.env.TARGET
const packageDir = path.resolve(packagesDir, name)

const currentResolve = (p) => path.resolve(packageDir, p)

const pkg = require(currentResolve('package.json'))

const options = pkg.buildOptions

const outputConfig = {
    cjs: {
        file: currentResolve(`dist/${name}.cjs.js`),
        format: 'cjs',
    },
    global: {
        file: currentResolve(`dist/${name}.global.js`),
        format: 'iife',
    },
    'esm-bundler': {
        file: currentResolve(`dist/${name}.esm-bundler.js`),
        format: 'esm',
    },
}
function createConfig(output) {

    output.sourcemap = true
    output.name = options.name
    return {
        input: currentResolve('src/index.ts'),
        output,
        plugins: [
            ts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            resolvePlugin(),
        ]
    }
}

export default options.formats.map((v) => createConfig(outputConfig[v]))
