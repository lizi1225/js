/**
 * 需要告诉webpack你要多输出一个文件
 */

const RawSource = require('webpack-sources/lib/RawSource')
class AssetsPlugin {
    apply(compiler) {
        // compiler.hooks.compilation.tap('AssetsPlugin', (compilation) => {
        //     // compilation.hooks.chunkAsset.tap('AssetsPlugin', (chunk, filename) => {
        //     //     console.log(chunk, filename)
        //     // })
        // })
        let assetList = ''
        compiler.hooks.emit.tapAsync('AssetsPlugin', (compilation, callback) => {
            for (let file in compilation.assets) {
                let source = compilation.assets[file].source()
                assetList += `${file} ${source.length} bytes\r\n`
            }
            compilation.assets['assets.md'] = new RawSource(assetList)
            callback()
        })
    }
}

module.exports = AssetsPlugin