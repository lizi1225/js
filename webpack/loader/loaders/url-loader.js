const {getOptions} = require('loader-utils')
const mime = require('mime')

function loader(source) {
  const {limit = 8 *1024, fallback='file-loader'} = getOptions(this) || {}
  
 
}
loader.raw = true
module.exports = loader