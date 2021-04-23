const {getOptions} = require('loader-utils')
const mime = require('mime')

function loader(source) {
  const {limit = 8 *1024, fallback} = getOptions(this) || {}
  const mimeType = mime.getType(this.resourcePath)
  if(!limit || source.length < limit) {
    const base64 = `data:${mimeType};base64,${source.toString('base64')}`
    return `module.exports=${JSON.stringify(base64)}`
  }else {
    const fileLoader = require(fallback)
    return fileLoader.call(this, source)
  }
}
loader.raw = true
module.exports = loader