const path = require('path')
const JSZip = require('jszip')
// const RawSource = require('webpack-sources/lib/RawSource')
class RawSource {
    constructor(source) {
        this._source = source
    }
    source() {
        return this._source
    }
    size() {
        return this._source.length
    }
}
class ZipPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
            const zip = new JSZip()
            for (let filename in compilation.assets) {
                let source = compilation.assets[filename].source()
                zip.file(filename, source)
            }
            zip.generateAsync({
                type: 'nodebuffer'
            }).then(content => {
                compilation.assets['assets.zip'] = new RawSource(content)
                callback()
            })
        })

    }
}

module.exports = ZipPlugin