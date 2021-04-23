const {
  getOptions,
  interpolateName
} = require('loader-utils')

function loader(content) {
  const options = getOptions(this)
  const filename = interpolateName(this, options.name || '[hash].[ext]', {
    content
  })
  this.emitFile(filename, content)
  return typeof options.esModule === 'undefined' || options.esModule ? `export default ${JSON.stringify(filename)}` : `module.exports = ${JSON.stringify(filename)}`
}
loader.raw = true
module.exports = loader