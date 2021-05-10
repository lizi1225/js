const DonePlugin = require('./plugins/DonePlugin')
const AssetsPlugin = require('./plugins/AssetsPlugin')
const ZipPlugin = require('./plugins/ZipPlugin')
module.exports = {
    plugins: [
        new DonePlugin(),
        new AssetsPlugin(),
        new ZipPlugin(),
    ]
}