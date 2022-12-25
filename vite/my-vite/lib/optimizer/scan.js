const { build } = require('esbuild')
const esBuildScanPlugin = require('./esBuildScanPlugin')
const path = require('path')

async function scanImports(config) {
    const depImports = {}
    const scanPlugin = await esBuildScanPlugin(config, depImports)
    await build({
        absWorkingDir: config.root,
        entryPoints: [path.resolve('./index.html')],
        bundle: true,
        format: 'esm',
        // outfile和write其实并不需要开启 这里只是用来写入硬盘可以看到展示效果
        outfile: './dist/bundle.js',
        write: true,
        plugins: [scanPlugin],
    })
    return depImports
}

module.exports = scanImports